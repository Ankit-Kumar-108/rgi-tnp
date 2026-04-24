"use client"
export const runtime = 'edge'
import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import {
  ArrowLeft, Loader2, Users, Search, CheckCircle2,
  ArrowRightCircle, XCircle, FileText, Download, ExternalLink,
  Github, Linkedin,
  ChevronDown, SlidersHorizontal, BarChart3, Clock,
  Mail, Phone, UserCheck, QrCode, AlertCircle
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { toast } from "sonner";
import QRCode from "qrcode";

// Types
type Participant = {
  id: string;
  status: string;
  attended: boolean;
  createdAt: string;
  starred?: boolean;
  student?: StudentUser;
  externalStudent?: StudentUser;
};
type StudentUser = {
  name?: string;
  enrollmentNumber?: string;
  email?: string;
  phoneNumber?: string;
  branch?: string;
  batch?: string | number;
  cgpa?: number | string;
  course?: string;
  collegeName?: string;
  profileImageUrl?: string;
  resumeUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  skills?: string[];
  tenthPercentage?: number | string;
  twelfthPercentage?: number | string;
};

//Status Config 
const STATUS_CONFIG: Record<string, { label: string; pill: string; dot: string; icon: React.ReactNode }> = {
  Applied: { label: "Applied", pill: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300", dot: "bg-slate-400", icon: <Clock className="w-3 h-3" /> },
  Shortlisted: { label: "Shortlisted", pill: "bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300", dot: "bg-amber-400", icon: <ArrowRightCircle className="w-3 h-3" /> },
  Selected: { label: "Selected", pill: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300", dot: "bg-emerald-500", icon: <CheckCircle2 className="w-3 h-3" /> },
  Rejected: { label: "Rejected", pill: "bg-red-50 text-red-600 dark:bg-red-900/40 dark:text-red-300", dot: "bg-red-400", icon: <XCircle className="w-3 h-3" /> },
};

const getStatusCfg = (s?: string) => STATUS_CONFIG[s || "Applied"] ?? STATUS_CONFIG.Applied;

// Subcomponents 

/** Avatar with optional status ring */
function Avatar({ user, status, size = "md" }: { user: StudentUser; status: string; size?: "sm" | "md" | "lg" }) {
  const dim = size === "lg" ? "size-32" : size === "md" ? "size-24" : "size-16";
  const txt = size === "lg" ? "text-lg" : size === "md" ? "text-base" : "text-xs";
  const ringColor = status === "Selected" ? "ring-emerald-500" : status === "Shortlisted" ? "ring-amber-400" : status === "Rejected" ? "ring-red-400" : "ring-border";
  return (
    <div className={`${dim} rounded-full ring-2 ${ringColor} ring-offset-2 ring-offset-card overflow-hidden bg-muted flex items-center justify-center shrink-0`}>
      {user.profileImageUrl
        ? <img src={user.profileImageUrl} alt={user.name} className="w-full h-full object-cover object-top" />
        : <span className={`font-black text-brand ${txt}`}>{user.name?.charAt(0) ?? "?"}</span>
      }
    </div>
  );
}

/** Status pill badge */
function StatusBadge({ status }: { status: string }) {
  const cfg = getStatusCfg(status);
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${cfg.pill}`}>
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

/** Stat chip (number + label) */
function StatChip({ value, label }: { value?: string | number; label: string }) {
  if (!value) return null;
  return (
    <span className="inline-flex flex-col items-center leading-tight">
      <span className="text-sm font-black text-foreground">{value}</span>
      <span className="text-[9px] text-muted-foreground uppercase tracking-wide">{label}</span>
    </span>
  );
}


/** Pipeline funnel progress bar */
function PipelineFunnel({ counts, total }: { counts: Record<string, number>; total: number }) {
  const stages = [
    { key: "Applied", color: "bg-slate-400", label: "Applied" },
    { key: "Shortlisted", color: "bg-amber-400", label: "Shortlisted" },
    { key: "Selected", color: "bg-emerald-500", label: "Selected" },
    { key: "Rejected", color: "bg-red-400", label: "Rejected" },
  ];
  return (
    <div className="flex gap-1 h-1.5 rounded-full overflow-hidden w-full">
      {stages.map(s => {
        const pct = total > 0 ? ((counts[s.key] || 0) / total) * 100 : 0;
        if (pct === 0) return null;
        return <div key={s.key} className={`${s.color} h-full`} style={{ width: `${pct}%` }} title={`${s.label}: ${counts[s.key] || 0}`} />;
      })}
    </div>
  );
}

// Main Page 
export default function DriveParticipantsPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = React.use(paramsPromise);
  const { id } = params;
  const { loading: authLoading, authenticated } = useAuth("admin", "/admin/login");

  // Data states
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [drive, setDrive] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // UI states
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState<"date" | "cgpa" | "name">("date");
  const [showFilters, setShowFilters] = useState(false);
  const [typeFilter, setTypeFilter] = useState<"All" | "Internal" | "External">("All");

  const [showQrModal, setShowQrModal] = useState(false);
  const [qrImageUrl, setQrImageUrl] = useState("");
  const [qrDriveName, setQrDriveName] = useState("");
  const [qrLoading, setQrLoading] = useState(false);
  const [qrExpiresAt, setQrExpiresAt] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");

  // state for attandance 
  const [attandanceFilter, setAttandanceFilter] = useState<"All" | "Present" | "Absent">("All");

  useEffect(() => {
    if (!showQrModal || !qrExpiresAt) return;

    const updateTimer = () => {
      const now = Date.now();
      const difference = qrExpiresAt - now;

      if (difference <= 0) {
        setTimeLeft("Expired");
        return;
      }

      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    };

    updateTimer();
    const timerId = setInterval(updateTimer, 1000);

    return () => clearInterval(timerId);
  }, [showQrModal, qrExpiresAt]);

  const generateQr = async () => {
    setQrLoading(true);
    try {
      const res = await fetch(`/api/admin/drives/${id}/attendance-qr`);
      const data = (await res.json()) as any;
      if (data.success) {
        setQrDriveName(data.driveName);
        setQrExpiresAt(data.expiresAt);
        const imgUrl = await QRCode.toDataURL(data.qrUrl, { width: 400, margin: 2 });
        setQrImageUrl(imgUrl);
        setShowQrModal(true);
      } else {
        toast.error(data.message || "Failed to generate QR");
      }
    } catch {
      toast.error("Failed to generate QR");
    }
    setQrLoading(false);
  };

  // Infinite scroll
  const observer = useRef<IntersectionObserver | null>(null);
  const lastRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) setPage(p => p + 1);
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    if (!authenticated) return;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/drives/${id}/participants?limit=50&page=${page}`);
        const data = await res.json() as any;
        if (data.success) {
          setDrive(data.drive);
          setTotalCount(data.totalCount || 0);
          setParticipants(prev => {
            const existing = new Set(prev.map(p => p.id));
            const fresh = data.registrations.filter((p: any) => !existing.has(p.id));
            return [...prev, ...fresh];
          });
          setHasMore(data.totalCount > page * 50);
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, [authenticated, id, page]);

  const handleStatusUpdate = async (newStatus: string) => {
    if (!selectedIds.size) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/drives/${id}/participants`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationIds: Array.from(selectedIds), status: newStatus }),
      });
      const data = await res.json() as any;
      if (data.success) {
        toast.success(`${selectedIds.size} candidate${selectedIds.size > 1 ? "s" : ""} moved to ${newStatus}`);
        setParticipants(prev => prev.map(p => selectedIds.has(p.id) ? { ...p, status: newStatus } : p));
        setSelectedIds(new Set());
      } else toast.error("Failed to update status");
    } catch { toast.error("An error occurred"); }
    finally { setActionLoading(false); }
  };

  const toggleSelection = (id: string) => setSelectedIds(prev => {
    const s = new Set(prev);
    s.has(id) ? s.delete(id) : s.add(id);
    return s;
  });


  const toggleAll = () => {
    if (selectedIds.size === filteredParticipants.length && filteredParticipants.length > 0)
      setSelectedIds(new Set());
    else
      setSelectedIds(new Set(filteredParticipants.map(p => p.id)));
  };

  const filteredParticipants = useMemo(() => {
    let list = participants.filter(p => {
      const u = p.student || p.externalStudent;
      const matchesSearch = !searchQuery ||
        u?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u?.enrollmentNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u?.branch?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || p.status === statusFilter;
      const isInternal = !!p.student;
      const matchesType = typeFilter === "All" || (typeFilter === "Internal" ? isInternal : !isInternal);
      const matchesAttandance = attandanceFilter === "All" || (attandanceFilter === "Present" ? p.attended : !p.attended);
      return matchesSearch && matchesStatus && matchesType && matchesAttandance;
    });

    list.sort((a, b) => {
      const ua = a.student || a.externalStudent || {};
      const ub = b.student || b.externalStudent || {};
      if (sortBy === "cgpa") return (Number(ub.cgpa) || 0) - (Number(ua.cgpa) || 0);
      if (sortBy === "name") return (ua.name || "").localeCompare(ub.name || "");
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return list;
  }, [participants, searchQuery, statusFilter, typeFilter, sortBy]);

  const uniqueStatuses = useMemo(() => {
    const s = new Set(participants.map(p => p.status || "Applied"));
    return ["All", ...Array.from(s)];
  }, [participants]);

  const statusCounts = useMemo(() => {
    const c: Record<string, number> = { Applied: 0, Shortlisted: 0, Selected: 0, Rejected: 0 };
    participants.forEach(p => { const s = p.status || "Applied"; c[s] = (c[s] || 0) + 1; });
    return c;
  }, [participants]);

  //  CSV export 
  const exportToCSV = () => {
    if (!filteredParticipants.length) return;
    const headers = ["Name", "Enrollment", "Email", "Phone", "Type", "College", "Branch", "CGPA", "10th Percentage", "12th Percentage/ Diploma", "Status", "Attended", "Applied On", "Resume"];
    const rows = filteredParticipants.map(p => {
      const u = p.student || p.externalStudent || {};
      const type = p.student ? "Internal" : "External";
      return [
        `"${u.name || ""}"`, `"${u.enrollmentNumber || ""}"`, `"${u.email || ""}"`,
        `"${u.phoneNumber || ""}"`, `"${type}"`, `"${u.collegeName || "RGI"}"`,
        `"${u.branch || ""}"`, u.cgpa || "", `"${u.tenthPercentage || ""}"`, `"${u.twelfthPercentage || ""}"`, `"${p.status || "Applied"}"`, `"${p.attended ? "Yes" : "No"}"`,
        `"${new Date(p.createdAt).toLocaleDateString()}"`, `"${u.resumeUrl || "—"}"`,
      ].join(",");
    });
    const blob = new Blob([[headers.join(","), ...rows].join("\n")], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${drive?.companyName || "Drive"}_Participants.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  //  Auth gate
  if (authLoading || !authenticated) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-8 h-8 animate-spin text-brand" />
    </div>
  );

  //  Render 
  return (
    <div className="min-h-screen bg-background">

      {/*  Sticky Header */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border">
        {/* 1. Changed: Removed fixed h-16, added py-3, flex-wrap, and min-h-[4rem] */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 min-h-16 flex flex-wrap items-center justify-between gap-3 sm:gap-4">

          {/* Left: back + title */}
          {/* 2. Changed: Added flex-1 on mobile so it pushes the export button to the right */}
          <div className="flex items-center gap-3 min-w-0 flex-1 sm:flex-none">
            <Link href="/admin/drives"
              className="w-8 h-8 rounded-lg flex items-center justify-center border border-border hover:bg-muted transition-colors shrink-0">
              <ArrowLeft className="w-4 h-4 text-muted-foreground" />
            </Link>
            <div className="min-w-0">
              <h1 className="text-sm font-black text-foreground tracking-tight truncate">
                {drive?.companyName || "Drive"}
              </h1>
              <p className="text-[11px] text-muted-foreground hidden sm:block">
                {totalCount} total · {statusCounts.Shortlisted || 0} shortlisted · {statusCounts.Selected || 0} selected
              </p>
            </div>
          </div>

          {/* Right: actions */}
          {/* 3. Changed: Added order-2 on mobile so it stays on the top row with the title */}
          <div className="flex items-center gap-2 shrink-0 order-2 sm:order-0">
            {drive?.googleSheetUrl && (
              <a href={drive.googleSheetUrl} target="_blank" rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 h-8 px-3 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold transition-colors">
                <ExternalLink className="w-3.5 h-3.5" /> Sheet
              </a>
            )}
            <button onClick={generateQr} disabled={qrLoading}
              className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-purple-500/10 text-purple-700 dark:text-purple-400 hover:bg-purple-500/20 text-xs font-bold transition-colors disabled:opacity-50">
              {qrLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <QrCode className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">Attendance QR</span>
            </button>
            <button onClick={exportToCSV} disabled={!filteredParticipants.length}
              className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-brand text-white hover:bg-brand/90 text-xs font-bold transition-colors disabled:opacity-40">
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>

          {/* Bulk action bar */}
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2 h-11 px-3 bg-brand/5 border border-brand/20 rounded-xl animate-in fade-in slide-in-from-bottom-2 duration-200 w-full sm:w-auto order-3 sm:order-0 overflow-x-auto no-scrollbar">
              <span className="hidden md:block text-xs font-bold text-brand mr-1 shrink-0">{selectedIds.size} selected</span>
              <div className="h-4 w-px bg-border shrink-0" />
              {[
                { status: "Shortlisted", label: "Shortlist", icon: <ArrowRightCircle className="w-3.5 h-3.5" />, cls: "text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30" },
                { status: "Selected", label: "Select", icon: <CheckCircle2 className="w-3.5 h-3.5" />, cls: "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30" },
                { status: "Rejected", label: "Reject", icon: <XCircle className="w-3.5 h-3.5" />, cls: "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30" },
              ].map(action => (
                <button key={action.status}
                  onClick={() => handleStatusUpdate(action.status)}
                  disabled={actionLoading}
                  className={`flex items-center gap-1.5 h-7 px-3 rounded-lg text-xs font-bold transition-colors disabled:opacity-50 shrink-0 ${action.cls}`}>
                  {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : action.icon}
                  <span className="whitespace-nowrap">{action.label}</span>
                </button>
              ))}
              <button onClick={() => setSelectedIds(new Set())}
                className="ml-auto text-muted-foreground hover:text-foreground transition-colors shrink-0 pl-2">
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/*  Pipeline Stats  */}
        <section>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { key: "Applied", label: "Total Applied", icon: <Users className="w-4 h-4" />, accent: "text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-300", value: totalCount || participants.length },
              { key: "Shortlisted", label: "Shortlisted", icon: <ArrowRightCircle className="w-4 h-4" />, accent: "text-amber-600 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-300", value: statusCounts.Shortlisted || 0 },
              { key: "Selected", label: "Selected", icon: <CheckCircle2 className="w-4 h-4" />, accent: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-300", value: statusCounts.Selected || 0 },
              { key: "Rejected", label: "Rejected", icon: <XCircle className="w-4 h-4" />, accent: "text-red-500 bg-red-50 dark:bg-red-900/30 dark:text-red-300", value: statusCounts.Rejected || 0 },
            ].map(stat => {
              const pct = totalCount > 0 ? Math.round((stat.value / totalCount) * 100) : 0;
              return (
                <button key={stat.key}
                  onClick={() => setStatusFilter(statusFilter === stat.key && stat.key !== "Applied" ? "All" : stat.key === "Applied" ? "All" : stat.key)}
                  className={`bg-card border rounded-xl p-4 text-left hover:border-brand/40 transition-all group ${statusFilter === stat.key ? "border-brand ring-1 ring-brand/20" : "border-border"}`}>
                  <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg mb-3 ${stat.accent}`}>
                    {stat.icon}
                  </div>
                  <p className="text-2xl font-black text-foreground tabular-nums">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mt-0.5">{stat.label}</p>
                  {totalCount > 0 && stat.key !== "Applied" && (
                    <div className="mt-2">
                      <div className="h-1 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${stat.accent.includes("amber") ? "bg-amber-400" : stat.accent.includes("emerald") ? "bg-emerald-500" : "bg-red-400"}`}
                          style={{ width: `${pct}%` }} />
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1">{pct}% of total</p>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {totalCount > 0 && (
            <div className="mt-3 bg-card border border-border rounded-xl px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5" /> Pipeline overview
                </p>
                <p className="text-[11px] text-muted-foreground">{filteredParticipants.length} shown of {totalCount}</p>
              </div>
              <PipelineFunnel counts={statusCounts} total={totalCount} />
              <div className="flex gap-4 mt-2">
                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                  <span key={key} className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">

            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
              <input type="text" placeholder="Search by name, enrollment, branch…"
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-4 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand transition-colors" />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <XCircle className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="relative">
              <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
                className="h-9 pl-3 pr-8 bg-card border border-border rounded-lg text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-brand cursor-pointer">
                <option value="date">Sort: Latest</option>
                <option value="cgpa">Sort: CGPA ↓</option>
                <option value="name">Sort: A → Z</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            </div>

            {/* Filter toggle */}
            <button onClick={() => setShowFilters(!showFilters)}
              className={`h-9 px-3 rounded-lg border text-sm font-medium flex items-center gap-1.5 transition-colors ${showFilters ? "bg-brand text-white border-brand" : "bg-card border-border text-foreground hover:border-brand/40"}`}>
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters
              {(statusFilter !== "All" || typeFilter !== "All") && (
                <span className="w-4 h-4 rounded-full bg-white text-brand text-[9px] font-black flex items-center justify-center">
                  {[statusFilter !== "All", typeFilter !== "All"].filter(Boolean).length}
                </span>
              )}
            </button>
          </div>

          {/* Expanded filters */}
          {showFilters && (
            <div className="flex flex-wrap gap-2 p-3 bg-muted/30 border border-border rounded-xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Status:</span>
                {uniqueStatuses.map(s => (
                  <button key={s} onClick={() => setStatusFilter(s)}
                    className={`h-7 px-3 rounded-full text-xs font-bold transition-colors ${statusFilter === s ? "bg-brand text-white" : "bg-card border border-border text-foreground hover:border-brand/50"}`}>
                    {s}
                    {s !== "All" && <span className="ml-1 opacity-60">·{statusCounts[s] || 0}</span>}
                  </button>
                ))}
              </div>
              <div className="w-px bg-border mx-1 hidden sm:block" />
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Type:</span>
                {(["All", "Internal", "External"] as const).map(t => (
                  <button key={t} onClick={() => setTypeFilter(t)}
                    className={`h-7 px-3 rounded-full text-xs font-bold transition-colors ${typeFilter === t ? "bg-brand text-white" : "bg-card border border-border text-foreground hover:border-brand/50"}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Users className="w-4 h-4 text-brand" />
              Candidates
              <span className="text-muted-foreground font-normal">({filteredParticipants.length})</span>
            </h2>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox"
                className="w-4 h-4 rounded border-border accent-brand cursor-pointer"
                checked={selectedIds.size > 0 && selectedIds.size === filteredParticipants.length}
                onChange={toggleAll} />
              <span className="text-xs text-muted-foreground font-medium">
                {selectedIds.size > 0 ? `${selectedIds.size} / ${filteredParticipants.length}` : "Select all"}
              </span>
            </label>
          </div>

          {loading && page === 1 ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-5 animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-40" />
                      <div className="h-3 bg-muted rounded w-64" />
                      <div className="h-3 bg-muted rounded w-32" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredParticipants.length === 0 ? (
            <div className="bg-card rounded-xl border border-border p-12 text-center">
              <Users className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
              <p className="font-bold text-foreground text-sm">No candidates found</p>
              <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters or search query.</p>
              {(searchQuery || statusFilter !== "All" || typeFilter !== "All") && (
                <button onClick={() => { setSearchQuery(""); setStatusFilter("All"); setTypeFilter("All"); }}
                  className="mt-3 text-xs text-brand hover:underline font-medium">
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredParticipants.map((reg, index) => {
                const user = reg.student || reg.externalStudent || {} as StudentUser;
                const isSelected = selectedIds.has(reg.id);
                const isInternal = !!reg.student;
                const isLast = index === filteredParticipants.length - 1;

                return (
                  <div key={reg.id} ref={isLast ? lastRef : null}
                    onClick={e => { const t = (e.target as HTMLElement).tagName; if (t !== "INPUT" && t !== "A" && t !== "BUTTON") toggleSelection(reg.id); }}
                    className={`group bg-card border rounded-xl px-5 py-4 transition-all cursor-pointer select-none
                      ${isSelected
                        ? "border-brand ring-1 ring-brand/20 bg-brand/20"
                        : "border-border hover:border-border/80 hover:shadow-sm"
                      }`}>

                    <div className="flex items-start gap-4 flex-col md:flex-row">
                      {/* Checkbox Desktop */}
                      <input type="checkbox" onClick={e => e.stopPropagation()}
                          className="hidden md:block mt-1 w-4 h-4 rounded border-border accent-brand cursor-pointer shrink-0"
                          checked={isSelected} onChange={() => toggleSelection(reg.id)}
                        />
                      {/* Mobile View */}
                      <div className="md:hidden w-full flex justify-between items-start md:items-center gap-2">
                        {/* Checkbox mobile */}
                        <input type="checkbox" onClick={e => e.stopPropagation()}
                          className="mt-1 w-4 h-4 rounded border-border accent-brand cursor-pointer shrink-0"
                          checked={isSelected} onChange={() => toggleSelection(reg.id)}
                        />
                        {/* status mobile */}
                        <div className="md:hidden">
                          <StatusBadge status={reg.status} />
                        </div>
                      </div>
                      {/* Avatar Desktop */}
                      <div className="hidden md:block">
                        <Avatar user={user} status={reg.status} size="lg" />
                      </div>

                      {/* Avatar Mobile */}
                      <div className="md:hidden flex justify-center w-full">
                        <Avatar user={user} status={reg.status} size="md" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">

                        {/* Row 1: Name + badges + status + star */}
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2 flex-wrap min-w-0">
                            <h3 className="font-black text-foreground text-base leading-tight truncate">{user.name || "—"}</h3>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isInternal ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" : "bg-brand/10 text-brand"}`}>
                              {isInternal ? "Internal" : "External"}
                            </span>
                            <div className="hidden md:block">
                            <StatusBadge status={reg.status} />
                            </div>

                            {/* NEW: Attended Badge */}
                            {reg.attended && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-900/30 dark:border-purple-800 dark:text-purple-300">
                                <UserCheck className="w-3 h-3" /> Attended
                              </span>
                            )}

                          </div>
                        </div>

                        {/* Row 2: Degree · College · Branch · Batch */}
                        <div className="flex items-center gap-1.5 flex-wrap text-xs text-muted-foreground mb-1.5">
                          <span className="font-medium text-foreground">{user.course || "B.Tech"}</span>
                          <span className="text-border">·</span>
                          <span className="font-semibold text-brand">{user.collegeName || "RGI"}</span>
                          <span className="text-border">·</span>
                          <span>{user.branch || "—"}</span>
                          {user.batch && <><span className="text-border">·</span><span>Batch {user.batch}</span></>}
                          <span className="text-border">·</span>
                          <span className="text-[11px]">Applied {new Date(reg.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                        </div>

                        {/* Row 3: Stats + Skills */}
                        <div className="flex items-center gap-4 flex-wrap mb-2.5">
                          <div className="flex flex-wrap items-center gap-3 divide-x divide-border">
                            {user.cgpa && (
                              <div className="pr-3">
                                <StatChip value={user.cgpa} label="CGPA" />
                              </div>
                            )}
                            {user.enrollmentNumber && (
                              <div className="pr-3">
                                <span className="text-[10px] text-muted-foreground font-medium">{user.enrollmentNumber}</span>
                              </div>
                            )}
                            <div className="pr-3">
                              {user.tenthPercentage && (
                                <StatChip value={`${user.tenthPercentage}%`} label="10th" />
                              )}
                            </div>
                            <div className="pr-3">
                              {user.twelfthPercentage && (
                                <StatChip value={`${user.twelfthPercentage}%`} label="12th/Diploma" />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Row 4: Actionable Links (Email, Phone, Resumes, etc.) */}
                        <div className="flex items-center gap-2 flex-wrap">

                          {/* NEW: Clickable Email Link */}
                          {user.email && (
                            <a href={`mailto:${user.email}`} onClick={e => e.stopPropagation()}
                              className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-md text-[11px] font-bold bg-muted text-muted-foreground hover:bg-muted/80 transition-colors">
                              <Mail className="w-3 h-3" /> {user.email}
                            </a>
                          )}

                          {/* NEW: Clickable Phone Link */}
                          {user.phoneNumber && (
                            <a href={`tel:${user.phoneNumber}`} onClick={e => e.stopPropagation()}
                              className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-md text-[11px] font-bold bg-muted text-muted-foreground hover:bg-muted/80 transition-colors">
                              <Phone className="w-3 h-3" /> {user.phoneNumber}
                            </a>
                          )}

                          {user.resumeUrl && (
                            <a href={user.resumeUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                              className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-100 transition-colors">
                              <FileText className="w-3 h-3" /> Resume
                            </a>
                          )}
                          {user.githubUrl && (
                            <a href={user.githubUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                              className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 transition-colors">
                              <Github className="w-3 h-3" /> GitHub
                            </a>
                          )}
                          {user.linkedinUrl && (
                            <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                              className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-md text-[11px] font-bold bg-blue-700/10 text-blue-700 dark:text-blue-400 hover:bg-blue-700/20 transition-colors">
                              <Linkedin className="w-3 h-3" /> LinkedIn
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Infinite scroll loader */}
              {loading && page > 1 && (
                <div className="flex justify-center py-6">
                  <Loader2 className="w-5 h-5 animate-spin text-brand" />
                </div>
              )}

              {/* End of list */}
              {!hasMore && participants.length > 0 && (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  All candidates loaded · {participants.length} total
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-border text-[11px] text-muted-foreground font-medium">
                <span>Showing {filteredParticipants.length} of {totalCount} candidates</span>
                {selectedIds.size > 0 && <span className="text-brand font-bold">{selectedIds.size} selected</span>}
              </div>
            </div>
          )}
        </section>
      </main>

      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setShowQrModal(false)}>
          <div className="bg-card border border-border rounded-[2rem] p-8 max-w-sm w-full text-center relative overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={e => e.stopPropagation()}>
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-brand/10 text-brand text-[10px] font-bold uppercase tracking-widest mb-3">
              Ready to Scan
            </div>
            
            <h2 className="text-2xl font-black text-foreground mb-1 tracking-tight">Attendance QR</h2>
            <p className="text-sm text-muted-foreground mb-6 font-medium">For <span className="text-foreground font-bold">{qrDriveName}</span></p>
            
            {qrImageUrl && (
              <div className="relative p-5 bg-white rounded-[1.5rem] shadow-xl border border-border/50 inline-block group hover:scale-[1.02] transition-transform duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent rounded-[1.5rem] opacity-0 group-hover:opacity-100 transition-opacity" />
                <img src={qrImageUrl} alt="Attendance QR Code" className="w-56 h-56 relative z-10 mx-auto" />
              </div>
            )}
            
            {timeLeft === "Expired" ? (
              <div className="mt-6 inline-flex items-center gap-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 px-5 py-2 rounded-full font-bold text-sm border border-red-200 dark:border-red-500/20 shadow-sm">
                <AlertCircle className="w-4 h-4" /> QR Code Expired
              </div>
            ) : (
              <div className="mt-6 flex flex-col items-center gap-1.5">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Expires In
                </p>
                <div className="font-mono text-2xl font-black text-brand tracking-tight drop-shadow-sm">
                  {timeLeft}
                </div>
              </div>
            )}
            
            <div className="flex gap-3 mt-8 justify-center">
              {qrImageUrl && timeLeft !== "Expired" && (
                <a href={qrImageUrl} download={`${qrDriveName}-attendance-qr.png`}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-brand to-brand/90 text-white rounded-xl text-xs font-bold hover:shadow-lg hover:shadow-brand/20 transition-all">
                  Download
                </a>
              )}
              <button onClick={() => setShowQrModal(false)}
                className="flex-1 px-4 py-3 bg-muted text-foreground rounded-xl text-xs font-bold hover:bg-muted/80 transition-colors border border-border/50">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}