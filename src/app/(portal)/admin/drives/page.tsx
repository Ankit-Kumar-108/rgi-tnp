"use client";

import React, { useEffect, useState } from "react";
import {
  Briefcase,
  Shield,
  ArrowLeft,
  Loader2,
  BarChart3,
  XCircle,
  RotateCcw,
  Calendar,
  Users,
  Eye,
  Edit,
  Trash2,
  X,
  Plus,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import JobDetailsModal from "@/components/forms/studentApplyModal/modal";
import { useRef, useCallback } from "react";

const BRANCHES = ["Computer Science", "Civil", "Mechanical", "Electronics", "Electrical", "Power Systems", "Digital Communication", "Thermal Engineering", "Marketing", "Finance", "Human Resource"];
import Link from "next/link";
import { toast } from "sonner";
import { set } from "zod";

export default function AdminDrivesPage() {
  const { loading: authLoading, authenticated } = useAuth("admin", "/admin/login");
  const [drives, setDrives] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [editDriveId, setEditDriveId] = useState<string | null>(null);
  const [viewDrive, setViewDrive] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formMsg, setFormMsg] = useState<{ msg: string; ok: boolean } | null>(null);
  const [form, setForm] = useState({
    companyName: "", roleName: "", jobDescription: "", ctc: "", eligibleBranches: "", minCGPA: 0, minBatch: "", maxBatch: "", course: "B.Tech", driveDate: "", driveType: "Closed", jobType: "Full-Time"
  });
  const observer = useRef<IntersectionObserver | null>(null);

  const lastDriveElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return; // Don't trigger if we are already fetching
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      // If the sensor hits the screen AND there is more data in the DB
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1); // Load the next page
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    if (!authenticated) return;
    const loadDrives = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/drives?limit=12&page=${page}`);
        const data = (await res.json()) as { success: boolean; drives: any[]; totalCount: number };
        if (data.success) {
          setDrives(prev => {
            const existingIds = new Set(prev.map(d => d.id));
            const newDrives = data.drives.filter(d => !existingIds.has(d.id));
            return [...prev, ...newDrives];
          });

          setHasMore(data.totalCount > page * 12);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load drives");
      } finally {
        setLoading(false);
      }
    };
    loadDrives();
  }, [authenticated, page]);


  const handleSubmitDrive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDriveId) return;
    setSubmitting(true);
    setFormMsg(null);
    try {
      const res = await fetch("/api/admin/drives", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, id: editDriveId, minCGPA: parseFloat(String(form.minCGPA)) }),
      });
      const d = (await res.json()) as any;
      toast[d.success ? "success" : "error"](d.message || (d.success ? "Drive updated successfully" : "Failed to update drive"));
      setFormMsg({ msg: d.message, ok: d.success });
      if (d.success) {
        setTimeout(() => setShowForm(false), 1000);
        setDrives(prev => prev.map(d => d.id === editDriveId ? { ...d, ...form } : d));
        setEditDriveId(null);
      }
    } catch {
      setFormMsg({ msg: "Update failed", ok: false });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAction = async (id: string, action: "close" | "reopen" | "archive") => {
    setActionLoading(id);
    try {
      const res = await fetch("/api/admin/drives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      const data = (await res.json()) as { success: boolean };
      if (data.success) {
        if (action === "archive") {
          setDrives(prev => prev.filter(d => d.id !== id));
        } else {
          const newStatus = action === "close" ? "completed" : "active";
          setDrives(prev => prev.map(drive => drive.id === id ? { ...drive, status: newStatus } : drive));
        }
        toast.success(`Drive ${action}d successfully`);

      };
    } catch (err) {
      console.error(err);
      toast.error("Action failed");
    } finally {
      setActionLoading(null);
    }
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
      {viewDrive && (
        <JobDetailsModal
          drive={viewDrive}
          isOpen={true}
          onClose={() => setViewDrive(null)}
          onSuccess={() => { }}
          role="admin"
          readonly={true}
        />
      )}

      {/* Drive Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex flex-col items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-card rounded-2xl border border-border shadow-2xl max-w-lg w-full p-6 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-foreground">Edit Drive Details</h3>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmitDrive} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-muted-foreground">Company Name</label>
                  <input required value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                    className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-brand outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-muted-foreground">Role</label>
                  <input required value={form.roleName} onChange={(e) => setForm({ ...form, roleName: e.target.value })}
                    className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-brand outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-muted-foreground">Job Description</label>
                <textarea required value={form.jobDescription} onChange={(e) => setForm({ ...form, jobDescription: e.target.value })} rows={3}
                  className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-brand outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-muted-foreground">CTC / Stipend</label>
                  <input required value={form.ctc} onChange={(e) => setForm({ ...form, ctc: e.target.value })}
                    className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-brand outline-none" placeholder="e.g. 7 LPA" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-muted-foreground">Min CGPA</label>
                  <input required type="number" step="0.1" min="0" max="10" value={form.minCGPA} onChange={(e) => setForm({ ...form, minCGPA: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-brand outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-muted-foreground">Job Type</label>
                  <select required value={form.jobType} onChange={(e) => setForm({ ...form, jobType: e.target.value })}
                    className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-brand outline-none">
                    <option value="Full-Time">Full-Time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
              </div>
              {/* Course */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-muted-foreground">Course</label>
                <div className="flex flex-wrap gap-2">
                  {["B.Tech", "M.Tech", "MBA", "Diploma", "All"].map((c) => (
                    <button key={c} type="button"
                      onClick={() => {
                        if (c === "All") {
                          setForm({ ...form, course: "All" });
                          return;
                        }
                        let arr = form.course ? form.course.split(",") : [];
                        if (arr.includes("All")) arr = [];
                        const updated = arr.includes(c) ? arr.filter((x) => x !== c) : [...arr, c];
                        setForm({ ...form, course: updated.join(",") });
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${(form.course === "All" && c === "All") || (form.course && form.course.includes(c) && form.course !== "All") ? "bg-brand text-white" : "bg-muted border border-border text-muted-foreground"}`}
                    >{c === "All" ? "All Courses" : c}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-muted-foreground">Eligible Branches</label>
                <div className="flex flex-wrap gap-2">
                  <button type="button"
                    onClick={() => {
                      const allSelected = BRANCHES.every(b => form.eligibleBranches.includes(b));
                      setForm({ ...form, eligibleBranches: allSelected ? "" : BRANCHES.join(",") });
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${BRANCHES.every(b => form.eligibleBranches.includes(b)) ? "bg-brand text-white" : "bg-muted border border-border text-muted-foreground"}`}
                  >All Branches</button>
                  {BRANCHES.map((b) => (
                    <button key={b} type="button"
                      onClick={() => {
                        const arr = form.eligibleBranches ? form.eligibleBranches.split(",") : [];
                        const updated = arr.includes(b) ? arr.filter((x) => x !== b) : [...arr, b];
                        setForm({ ...form, eligibleBranches: updated.join(",") });
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${form.eligibleBranches.includes(b) ? "bg-brand text-white" : "bg-muted border border-border text-muted-foreground"}`}
                    >{b}</button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-muted-foreground">Min Batch (From)</label>
                  <input required value={form.minBatch} onChange={(e) => setForm({ ...form, minBatch: e.target.value })}
                    placeholder="e.g. 2021" className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-brand outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-muted-foreground">Max Batch (To)</label>
                  <input required value={form.maxBatch} onChange={(e) => setForm({ ...form, maxBatch: e.target.value })}
                    placeholder="e.g. 2025" className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-brand outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-muted-foreground">Drive Date</label>
                  <input required type="date" value={form.driveDate} onChange={(e) => setForm({ ...form, driveDate: e.target.value })}
                    className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-brand outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-muted-foreground">Drive Type</label>
                  <div className="flex gap-2">
                    {["Closed", "Open", "Pool"].map((t) => (
                      <button key={t} type="button" onClick={() => setForm({ ...form, driveType: t })}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${form.driveType === t ? "bg-brand text-white" : "bg-muted border border-border text-muted-foreground"}`}
                      >{t} Campus</button>
                    ))}
                  </div>
                </div>
              </div>
              {formMsg && (
                <p className={`text-sm font-medium ${formMsg.ok ? "text-green-600" : "text-red-500"}`}>{formMsg.msg}</p>
              )}
              <button type="submit" disabled={submitting}
                className="w-full bg-brand text-white py-3 rounded-xl font-bold hover:bg-brand/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Edit className="w-4 h-4" />}
                {submitting ? "Updating..." : "Update Drive Details"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/admin/dashboard" className="text-muted-foreground hover:text-brand transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-brand" />
            </div>
            <h1 className="text-lg font-black text-foreground tracking-tight">
              Drive Management
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card p-5 rounded-2xl border border-border shadow-sm">
            <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center mb-3">
              <Briefcase className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-black text-foreground">{drives.filter(d => d.status === "active").length}</p>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mt-1">Active</p>
          </div>
          <div className="bg-card p-5 rounded-2xl border border-border shadow-sm">
            <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center mb-3">
              <Calendar className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-2xl font-black text-foreground">{drives.filter(d => d.status === "pending").length}</p>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mt-1">Pending</p>
          </div>
          <div className="bg-card p-5 rounded-2xl border border-border shadow-sm">
            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center mb-3">
              <BarChart3 className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-2xl font-black text-foreground">{drives.filter(d => d.status === "completed").length}</p>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mt-1">Completed</p>
          </div>
          <div className="bg-card p-5 rounded-2xl border border-border shadow-sm">
            <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center mb-3">
              <Users className="w-5 h-5 text-brand" />
            </div>
            <p className="text-2xl font-black text-foreground">{drives.reduce((sum, d) => sum + (d.registrationCount || 0), 0)}</p>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mt-1">Total Registrations</p>
          </div>
        </div>

        {/* Drives Table */}
        <div className="overflow-hidden">
          {loading && page === 1 ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-brand" />
            </div>
          ) : drives.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No drives found</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 p-5">
                {drives.map((drive: any, index: number) => {

                  const isLastElement = index === drives.length - 1;
                  const statusConfig: Record<string, { gradient: string; dot: string; label: string; bg: string }> = {
                    active: { gradient: "from-emerald-500/20 via-emerald-500/5 to-transparent", dot: "bg-emerald-500", label: "Active", bg: "bg-emerald-500/10 text-emerald-600" },
                    pending: { gradient: "from-amber-500/20 via-amber-500/5 to-transparent", dot: "bg-amber-500", label: "Pending", bg: "bg-amber-500/10 text-amber-600" },
                    completed: { gradient: "from-blue-500/20 via-blue-500/5 to-transparent", dot: "bg-blue-500", label: "Completed", bg: "bg-blue-500/10 text-blue-600" },
                    rejected: { gradient: "from-red-500/20 via-red-500/5 to-transparent", dot: "bg-red-500", label: "Rejected", bg: "bg-red-500/10 text-red-500" },
                  };
                  const sc = statusConfig[drive.status] || statusConfig.pending;

                  return (
                    <div
                      key={drive.id}
                      ref={isLastElement ? lastDriveElementRef : null}
                      className={`group relative overflow-hidden rounded-2xl border border-border/60  bg-card/80 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:-translate-y-1`}
                    >
                      {/* Subtle gradient glow at top */}
                      <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${sc.gradient} pointer-events-none`} />

                      <div className="relative p-5 flex flex-col gap-4">
                        {/* Top row: Avatar + Company + Status */}
                        <div className="flex items-start gap-3.5 bg-top">
                          {drive.companyLogoUrl ? (
                            <img
                              src={drive.companyLogoUrl}
                              alt={drive.companyName}
                              className="w-11 h-11 rounded-xl object-cover border border-border/50 shadow-sm flex-shrink-0"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-linear-to-br from-brand/20 to-brand/5 text-brand font-black text-lg border border-brand/10 shadow-sm shrink-0">
                              {drive.companyName?.[0]?.toUpperCase() || "?"}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h2 className="text-base font-extrabold text-foreground leading-tight truncate">{drive.companyName}</h2>
                            <p className="text-sm text-muted-foreground font-medium truncate mt-0.5">{drive.roleName}</p>
                          </div>
                          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${sc.bg} flex-shrink-0`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot} ${drive.status === "active" ? "animate-pulse" : ""}`} />
                            {sc.label}
                          </div>
                        </div>

                        {/* Key metrics row */}
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="flex items-center gap-1.5 bg-linear-to-r from-brand/10 to-brand/5 px-3 py-1.5 rounded-lg border border-brand/10">
                            <span className="text-brand font-extrabold text-sm">₹{drive.ctc || "—"}</span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-muted/60 px-3 py-1.5 rounded-lg text-muted-foreground">
                            <Calendar className="w-3.5 h-3.5" />
                            <span className="text-xs font-semibold">{drive.driveDate ? new Date(drive.driveDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}</span>
                          </div>
                          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${drive.driveType === "Open" ? "bg-emerald-500/8 text-emerald-600 border border-emerald-500/15" : drive.driveType === "Pool" ? "bg-amber-500/8 text-amber-600 border border-amber-500/15" : "bg-blue-500/8 text-blue-600 border border-blue-500/15"}`}>
                            {drive.driveType}
                          </div>
                          {drive.jobType && (
                            <div className="flex items-center gap-1.5 bg-muted/60 px-3 py-1.5 rounded-lg text-xs font-semibold text-muted-foreground">
                              <Briefcase className="w-3.5 h-3.5" />
                              {drive.jobType}
                            </div>
                          )}
                        </div>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground/80 leading-relaxed line-clamp-2 min-h-10">
                          {drive.jobDescription || <span className="italic opacity-60">No description provided.</span>}
                        </p>

                        {/* Footer: Registrations + Actions */}
                        <div className="flex items-center justify-between pt-3 border-t border-border/40 mt-auto">
                          <Link
                            href={`/admin/drives/${drive.id}/participants`}
                            className="flex items-center gap-2 bg-brand/8 hover:bg-brand/15 px-3 py-1.5 rounded-lg transition-colors group/reg"
                          >
                            <Users className="w-4 h-4 text-brand" />
                            <span className="text-sm font-bold text-brand">{drive.registrationCount || 0}</span>
                            <span className="text-xs text-brand/70 font-medium">applicants</span>
                          </Link>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setViewDrive(drive)}
                              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-200"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setEditDriveId(drive.id);
                                setForm({
                                  companyName: drive.companyName,
                                  roleName: drive.roleName,
                                  jobDescription: drive.jobDescription,
                                  ctc: drive.ctc,
                                  eligibleBranches: drive.eligibleBranches,
                                  minCGPA: drive.minCGPA,
                                  minBatch: drive.minBatch,
                                  maxBatch: drive.maxBatch,
                                  course: drive.course || "B.Tech",
                                  driveDate: new Date(drive.driveDate).toISOString().split('T')[0],
                                  driveType: drive.driveType,
                                  jobType: drive.jobType || "Full-Time"
                                });
                                setFormMsg(null);
                                setShowForm(true);
                              }}
                              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-200"
                              title="Edit Drive"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            {drive.status === "active" && (
                              <button
                                onClick={() => handleAction(drive.id, "close")}
                                disabled={actionLoading === drive.id}
                                className="p-2 rounded-xl text-red-400 hover:text-red-500 hover:bg-red-500/10 transition-all duration-200 disabled:opacity-40"
                                title="Close Drive"
                              >
                                {actionLoading === drive.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                              </button>
                            )}
                            {drive.status === "completed" && (
                              <button
                                onClick={() => handleAction(drive.id, "reopen")}
                                disabled={actionLoading === drive.id}
                                className="p-2 rounded-xl text-emerald-400 hover:text-emerald-500 hover:bg-emerald-500/10 transition-all duration-200 disabled:opacity-40"
                                title="Reopen Drive"
                              >
                                {actionLoading === drive.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                              </button>
                            )}
                            <button
                              onClick={() => {
                                if (window.confirm("Are you sure you want to archive this drive? This action cannot be undone.")) {
                                  handleAction(drive.id, "archive");
                                }
                              }}
                              disabled={actionLoading === drive.id}
                              className="p-2 rounded-xl text-muted-foreground/60 hover:text-red-500 hover:bg-red-500/10 transition-all duration-200 disabled:opacity-40"
                              title="Archive / Delete Drive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Loading Spinner for the bottom of the feed */}
              {loading && (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-brand" />
                </div>
              )}

              {/* End of list message */}
              {!hasMore && drives.length > 0 && (
                <div className="text-center py-8 text-muted-foreground font-medium text-sm">
                  You have reached the end of the list.
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

