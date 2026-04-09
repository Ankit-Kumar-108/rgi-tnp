"use client"
export const runtime = 'edge'
import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import {
  ArrowLeft,
  Loader2,
  Users,
  Search,
  Filter,
  CheckCircle2,
  ArrowRightCircle,
  XCircle,
  FileText,
  Download,
  ExternalLink,
  Building2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { toast } from "sonner"; // Added toast for notifications

export default function DriveParticipantsPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = React.use(paramsPromise);
  const { id } = params;
  const { loading: authLoading, authenticated } = useAuth("admin", "/admin/login");
  
  // Infinite Scroll States
  const [participants, setParticipants] = useState<any[]>([]);
  const [drive, setDrive] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Selection and Filtering
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // --- Infinite Scroll Sensor ---
  const observer = useRef<IntersectionObserver | null>(null);
  const lastParticipantRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // --- Fetch Participants ---
  useEffect(() => {
    if (!authenticated) return;
    
    const loadParticipants = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/drives/${id}/participants?limit=50&page=${page}`);
        const data = await res.json() as any;
        
        if (data.success) {
          setDrive(data.drive);
          setTotalCount(data.totalCount || 0);
          
          setParticipants(prev => {
            const existingIds = new Set(prev.map(p => p.id));
            const newParticipants = data.registrations.filter((p: any) => !existingIds.has(p.id));
            return [...prev, ...newParticipants];
          });
          
          setHasMore(data.totalCount > page * 50);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadParticipants();
  }, [authenticated, id, page]);

  // --- Bulk Update Status (Local State Update) ---
  const handleStatusUpdate = async (newStatus: string) => {
    if (selectedIds.size === 0) return;

    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/drives/${id}/participants`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationIds: Array.from(selectedIds),
          status: newStatus
        }),
      });
      const data = await res.json() as any;
      
      if (data.success) {
        toast.success(`Updated ${selectedIds.size} candidates to ${newStatus}`);
        
        // Update local state instantly instead of re-fetching
        setParticipants(prev => prev.map(p => 
          selectedIds.has(p.id) ? { ...p, status: newStatus } : p
        ));
        
        // Clear selection
        setSelectedIds(new Set());
      } else {
        toast.error("Failed to update status");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred");
    } finally {
      setActionLoading(false);
    }
  };

  const toggleSelection = (regId: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(regId)) newSelected.delete(regId);
    else newSelected.add(regId);
    setSelectedIds(newSelected);
  };

  const toggleAll = () => {
    if (selectedIds.size === filteredParticipants.length && filteredParticipants.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredParticipants.map(p => p.id)));
    }
  };

  const filteredParticipants = useMemo(() => {
    return participants.filter(p => {
      const u = p.student || p.externalStudent;
      const matchesSearch = u?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u?.enrollmentNumber?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [participants, searchQuery, statusFilter]);

  const uniqueStatuses = useMemo(() => {
    const statuses = new Set(participants.map(p => p.status || "Applied"));
    return ["All", ...Array.from(statuses)];
  }, [participants]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { Applied: 0, Shortlisted: 0, Selected: 0, Rejected: 0 };
    participants.forEach(p => {
      const s = p.status || "Applied";
      counts[s] = (counts[s] || 0) + 1;
    });
    return counts;
  }, [participants]);

  const exportToCSV = () => {
    if (filteredParticipants.length === 0) return;
    const headers = ["Name", "Enrollment Number", "Email", "Phone Number", "Type", "College", "Branch", "CGPA", "Status", "Applied On", "Resume Link"];
    const rows = filteredParticipants.map(p => {
      const u = p.student || p.externalStudent || {};
      const type = p.student ? "Internal" : "External";
      return [
        `"${u.name || ""}"`,
        `"${u.enrollmentNumber || ""}"`,
        `"${u.email || ""}"`,
        `"${u.phoneNumber || ""}"`,
        `"${type}"`,
        `"${u.collegeName || "RGI"}"`,
        `"${u.branch || ""}"`,
        u.cgpa || "",
        `"${p.status || "Applied"}"`,
        `"${new Date(p.createdAt).toLocaleDateString()}"`,
        `"${u.resumeUrl || "Not Provided"}"`
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${drive?.companyName || "Drive"}_Participants.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    const s = status || "Applied";
    if (s === "Selected") return "bg-green-500/10 text-green-600";
    if (s === "Rejected") return "bg-red-500/10 text-red-500";
    if (s === "Shortlisted") return "bg-yellow-500/10 text-yellow-600";
    return "bg-muted text-muted-foreground";
  };

  if (authLoading || !authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/drives" className="text-muted-foreground hover:text-brand transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-brand" />
            </div>
            <div>
              <h1 className="text-lg font-black text-foreground tracking-tight">Participant Management</h1>
              <p className="text-xs text-muted-foreground">Manage candidates for {drive?.companyName || "this drive"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {drive?.googleSheetUrl && (
              <a
                href={drive.googleSheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-600 hover:bg-green-500/20 text-xs font-bold rounded-lg transition-colors"
                title="Open Google Sheet"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Sheet
              </a>
            )}
            <button
              onClick={exportToCSV}
              disabled={filteredParticipants.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-brand text-white hover:bg-brand/90 text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
            <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center mb-3">
              <Users className="w-5 h-5 text-brand" />
            </div>
            <p className="text-2xl font-black text-foreground">{totalCount || participants.length}</p>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-1">Total Applied</p>
          </div>
          <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
            <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center mb-3">
              <ArrowRightCircle className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-2xl font-black text-foreground">{statusCounts.Shortlisted || 0}</p>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-1">Shortlisted (Loaded)</p>
          </div>
          <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
            <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-black text-foreground">{statusCounts.Selected || 0}</p>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-1">Selected (Loaded)</p>
          </div>
          <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
            <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center mb-3">
              <XCircle className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-2xl font-black text-foreground">{statusCounts.Rejected || 0}</p>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-1">Rejected (Loaded)</p>
          </div>
        </section>

        {/* Search + Filter + Bulk Actions */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search loaded candidates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-xl text-sm focus:outline-none focus:border-brand"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
              <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
              {uniqueStatuses.map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${statusFilter === status
                    ? "bg-brand text-primary-foreground shadow-md"
                    : "bg-card border border-border text-foreground hover:border-brand/50"
                    }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-xl border border-border animate-in fade-in slide-in-from-bottom-2">
              <span className="text-xs font-bold text-muted-foreground px-2">
                {selectedIds.size} Selected
              </span>
              <button
                onClick={() => handleStatusUpdate("Shortlisted")}
                disabled={actionLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 text-xs font-bold rounded-lg transition-colors disabled:opacity-50">
                <ArrowRightCircle className="w-3.5 h-3.5" />
                Shortlist
              </button>
              <button
                onClick={() => handleStatusUpdate("Selected")}
                disabled={actionLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-600 hover:bg-green-500/20 text-xs font-bold rounded-lg transition-colors disabled:opacity-50">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Select
              </button>
              <button
                onClick={() => handleStatusUpdate("Rejected")}
                disabled={actionLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 text-xs font-bold rounded-lg transition-colors disabled:opacity-50">
                <XCircle className="w-3.5 h-3.5" />
                Reject
              </button>
            </div>
          )}
        </section>

        {/* Participants - Card Layout */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Users className="w-5 h-5 text-brand" />
              Candidates
            </h2>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-border text-brand focus:ring-brand accent-brand cursor-pointer"
                checked={selectedIds.size > 0 && selectedIds.size === filteredParticipants.length}
                onChange={toggleAll}
              />
              <span className="text-xs font-bold text-muted-foreground">
                {selectedIds.size > 0 ? `${selectedIds.size} / ${filteredParticipants.length}` : "Select All"}
              </span>
            </div>
          </div>

          {loading && page === 1 ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-brand" />
            </div>
          ) : filteredParticipants.length === 0 ? (
            <div className="bg-card rounded-2xl border border-border p-8 text-center text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No participants found</p>
              <p className="text-xs mt-1">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredParticipants.map((reg, index) => {
                const user = reg.student || reg.externalStudent || {};
                const isSelected = selectedIds.has(reg.id);
                const isInternal = !!reg.student;
                const isLastElement = index === filteredParticipants.length - 1;

                return (
                  <div
                    key={reg.id}
                    ref={isLastElement ? lastParticipantRef : null}
                    className={`bg-card border rounded-2xl p-4 md:p-5 shadow-sm transition-colors cursor-pointer ${isSelected ? "border-brand bg-brand/5" : "border-border hover:bg-muted/20"}`}
                    onClick={(e) => {
                      const tag = (e.target as HTMLElement).tagName;
                      if (tag !== "INPUT" && tag !== "A") toggleSelection(reg.id);
                    }}
                  >
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-4">
                      {/* Checkbox */}
                      <div className="w-full md:w-0 flex items-center justify-between">
                      <input
                        type="checkbox"
                        className="w-4 h-4 md:mt-3 rounded border-border text-brand focus:ring-brand accent-brand cursor-pointer shrink-0"
                        checked={isSelected}
                        onChange={() => toggleSelection(reg.id)}
                      />
                      <span className={`md:hidden shrink-0 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${getStatusBadge(reg.status)}`}>
                            {reg.status || "Applied"}
                          </span>
                      </div>

                      {/* Profile Image */}
                      <div className="size-24 md:size-32 rounded-full bg-muted border border-border shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                        {user.profileImageUrl ? (
                          <img src={user.profileImageUrl} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-brand font-black text-lg">{user.name?.charAt(0) || "?"}</span>
                        )}
                      </div>

                      {/* Info Section */}
                      <div className="flex-1 min-w-0">                      
                        {/* Row 1: Name + Status */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="font-bold text-foreground text-base md:text-lg leading-tight truncate">{user.name}</h3>
                          </div>
                          <span className={`hidden md:block shrink-0 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${getStatusBadge(reg.status)}`}>
                            {reg.status || "Applied"}
                          </span>
                        </div>

                        {/* Row 2: Course, College */}
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="text-xs font-medium text-muted-foreground">{user.course || "-"}</span>
                          <span className="text-muted-foreground/40">•</span>
                          <span className="text-xs font-medium text-brand">{user.collegeName || "RGI"}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${isInternal ? "bg-blue-500/10 text-blue-600" : "bg-brand/10 text-brand"}`}>
                            {isInternal ? "Internal" : "External"}
                          </span>
                        </div>

                        {/* Row 3: Branch, Batch */}
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="text-xs text-foreground font-medium">{user.branch || "-"}</span>
                          <span className="text-muted-foreground/40">•</span>
                          <span className="text-xs text-muted-foreground">{user.batch ? `Batch ${user.batch}` : "-"}</span>
                        </div>

                        {/* Row 4: CGPA, Applied Date */}
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-muted rounded-md text-muted-foreground">
                            {user.cgpa || "-"} CGPA
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            Applied {new Date(reg.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        </div>

                        {/* Row 5: Links */}
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          {user.resumeUrl && (
                            <a
                              href={user.resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={e => e.stopPropagation()}
                              className="text-[10px] font-bold px-2 py-0.5 bg-blue-500/10 text-blue-600 rounded-md hover:bg-blue-500/20 flex items-center gap-1 transition-colors"
                            >
                              <FileText className="w-3 h-3" /> C.V
                            </a>
                          )}
                          {user.githubUrl && (
                            <a
                              href={user.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={e => e.stopPropagation()}
                              className="text-[10px] font-bold px-2 py-0.5 bg-gray-500/10 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-500/20 flex items-center gap-1 transition-colors"
                            >
                              <ExternalLink className="w-3 h-3" /> GitHub
                            </a>
                          )}
                          {user.linkedinUrl && (
                            <a
                              href={user.linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={e => e.stopPropagation()}
                              className="text-[10px] font-bold px-2 py-0.5 bg-blue-700/10 text-blue-700 rounded-md hover:bg-blue-700/20 flex items-center gap-1 transition-colors"
                            >
                              <ExternalLink className="w-3 h-3" /> LinkedIn
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Bottom Loading Indicator */}
              {loading && page > 1 && (
                <div className="flex justify-center py-6">
                  <Loader2 className="w-6 h-6 animate-spin text-brand" />
                </div>
              )}

              {/* End of list message */}
              {!hasMore && participants.length > 0 && (
                <div className="text-center py-6 text-muted-foreground font-medium text-sm">
                  All candidates loaded.
                </div>
              )}

              {/* Footer */}
              <div className="p-4 text-xs font-bold text-muted-foreground flex justify-between border-t border-border mt-4">
                <span>Loaded Candidates: {filteredParticipants.length} of {totalCount}</span>
                {selectedIds.size > 0 && <span className="text-brand">Selected: {selectedIds.size}</span>}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}