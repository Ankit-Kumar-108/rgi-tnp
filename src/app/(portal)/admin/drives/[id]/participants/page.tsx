export const runtime = 'edge'
"use client";
import React, { useEffect, useState, useMemo } from "react";
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
  ExternalLink
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function DriveParticipantsPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = React.use(paramsPromise);
  const { id } = params;
  const { loading: authLoading, authenticated } = useAuth("admin", "/admin/login");
  const [participants, setParticipants] = useState<any[]>([]);
  const [drive, setDrive] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Selection and Filtering
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchParticipants = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/drives/${id}/participants`);
      const data = await res.json() as any
      if (data.success) {
        setParticipants(data.registrations);
        setDrive(data.drive);
        setSelectedIds(new Set()); // Clear selection after refresh
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authenticated) return;
    fetchParticipants();
  }, [authenticated, id]);

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
      const data = await res.json() as any
      if (data.success) fetchParticipants();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
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

          {/* Action Dashboard */}
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-xl border border-border animate-in fade-in slide-in-from-bottom-2">
              <span className="text-xs font-bold text-muted-foreground px-2">
                {selectedIds.size} Selected
              </span>
              <button
                onClick={() => handleStatusUpdate("Shortlisted")}
                disabled={actionLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 text-xs font-bold rounded-lg transition-colors">
                <ArrowRightCircle className="w-3.5 h-3.5" />
                Shortlist
              </button>
              <button
                onClick={() => handleStatusUpdate("Selected")}
                disabled={actionLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-600 hover:bg-green-500/20 text-xs font-bold rounded-lg transition-colors">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Select
              </button>
              <button
                onClick={() => handleStatusUpdate("Rejected")}
                disabled={actionLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 text-xs font-bold rounded-lg transition-colors">
                <XCircle className="w-3.5 h-3.5" />
                Reject
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or enrollment..."
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

        {/* Participants Table */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-brand" />
            </div>
          ) : filteredParticipants.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground flex flex-col items-center">
              <Users className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-medium text-lg text-foreground">No participants found</p>
              <p className="text-sm mt-1">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/30 border-b border-border">
                    <th className="px-5 py-4 w-12 text-left">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-border text-brand focus:ring-brand accent-brand cursor-pointer"
                        checked={selectedIds.size > 0 && selectedIds.size === filteredParticipants.length}
                        onChange={toggleAll}
                      />
                    </th>
                    <th className="text-left px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground w-64">Candidate Details</th>
                    <th className="text-left px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Academic</th>
                    <th className="text-left px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Applied On</th>
                    <th className="text-right px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Current Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredParticipants.map((reg) => {
                    const user = reg.student || reg.externalStudent || {};
                    const isSelected = selectedIds.has(reg.id);

                    return (
                      <tr
                        key={reg.id}
                        className={`border-b border-border/50 transition-colors ${isSelected ? "bg-brand/5" : "hover:bg-muted/20"}`}
                        onClick={(e) => {
                          // Prevent toggling when clicking buttons or inputs directly
                          if ((e.target as HTMLElement).tagName !== "INPUT" && (e.target as HTMLElement).tagName !== "BUTTON") {
                            toggleSelection(reg.id);
                          }
                        }}
                      >
                        <td className="px-5 py-4 w-12 text-left">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-border text-brand focus:ring-brand accent-brand cursor-pointer"
                            checked={isSelected}
                            onChange={() => toggleSelection(reg.id)}
                          />
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-muted border border-border shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                              {user.profileImageUrl ? (
                                <img src={user.profileImageUrl} alt={user.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-xs font-bold text-muted-foreground">
                                  {user.name?.charAt(0) || "?"}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-foreground text-sm tracking-tight">{user.name}</p>
                              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                                {user.enrollmentNumber}
                              </p>
                              {user.collegeName && (
                                <p className="text-[9px] mt-0.5 text-brand truncate max-w-[150px]" title={user.collegeName}>
                                  {user.collegeName}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-foreground">{user.branch}</p>
                            <div className="flex gap-2 items-center">
                              <span className="text-[10px] font-bold px-2 py-0.5 bg-muted rounded-md text-muted-foreground">
                                {user.cgpa} CGPA
                              </span>
                              {user.resumeUrl && (
                                <a
                                  href={user.resumeUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={e => e.stopPropagation()}
                                  className="text-[10px] font-bold px-2 py-0.5 bg-blue-500/10 text-blue-600 rounded-md hover:bg-blue-500/20 flex items-center gap-1 transition-colors"
                                >
                                  <FileText className="w-3 h-3" /> CV
                                </a>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-xs font-medium text-muted-foreground">
                          {new Date(reg.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <span className={`inline-flex py-1 px-3 rounded-full text-[10px] font-black uppercase tracking-wider ${reg.status === "Selected" ? "bg-green-500/10 text-green-600" :
                              reg.status === "Rejected" ? "bg-red-500/10 text-red-500" :
                                reg.status === "Shortlisted" ? "bg-yellow-500/10 text-yellow-600" :
                                  "bg-muted text-foreground"
                            }`}>
                            {reg.status || "Applied"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="p-4 border-t border-border bg-muted/20 text-xs font-bold text-muted-foreground flex justify-between">
                <span>Total Candidates: {filteredParticipants.length}</span>
                {selectedIds.size > 0 && <span>Selected: {selectedIds.size}</span>}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
