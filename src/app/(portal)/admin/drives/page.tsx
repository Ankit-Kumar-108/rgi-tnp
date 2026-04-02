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

const BRANCHES = ["Computer Science", "Civil", "Mechanical", "Electronics", "Electrical", "Power Systems", "Digital Communication", "Thermal Engineering", "Marketing", "Finance", "Human Resource"];
import Link from "next/link";

export default function AdminDrivesPage() {
  const { loading: authLoading, authenticated } = useAuth("admin", "/admin/login");
  const [drives, setDrives] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [editDriveId, setEditDriveId] = useState<string | null>(null);
  const [viewDrive, setViewDrive] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formMsg, setFormMsg] = useState<{ msg: string; ok: boolean } | null>(null);
  const [form, setForm] = useState({
    companyName: "", roleName: "", jobDescription: "", ctc: "", eligibleBranches: "", minCGPA: 0, minBatch: "", maxBatch: "", course: "B.Tech", driveDate: "", driveType: "Closed", jobType: "Full-Time"
  });

  useEffect(() => {
    if (!authenticated) return;
    fetchDrives();
  }, [authenticated]);

  const fetchDrives = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/drives");
      const data = (await res.json()) as { success: boolean; drives: any[] };
      if (data.success) setDrives(data.drives);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
      setFormMsg({ msg: d.message, ok: d.success });
      if (d.success) {
        setTimeout(() => setShowForm(false), 1000);
        setEditDriveId(null);
        fetchDrives();
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
      if (data.success) fetchDrives();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-500/10 text-yellow-600",
      active: "bg-green-500/10 text-green-600",
      completed: "bg-blue-500/10 text-blue-600",
      rejected: "bg-red-500/10 text-red-500",
    };
    return styles[status] || "bg-muted text-muted-foreground";
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
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-1">Active</p>
          </div>
          <div className="bg-card p-5 rounded-2xl border border-border shadow-sm">
            <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center mb-3">
              <Calendar className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-2xl font-black text-foreground">{drives.filter(d => d.status === "pending").length}</p>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-1">Pending</p>
          </div>
          <div className="bg-card p-5 rounded-2xl border border-border shadow-sm">
            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center mb-3">
              <BarChart3 className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-2xl font-black text-foreground">{drives.filter(d => d.status === "completed").length}</p>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-1">Completed</p>
          </div>
          <div className="bg-card p-5 rounded-2xl border border-border shadow-sm">
            <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center mb-3">
              <Users className="w-5 h-5 text-brand" />
            </div>
            <p className="text-2xl font-black text-foreground">{drives.reduce((sum, d) => sum + (d.registrationCount || 0), 0)}</p>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-1">Total Registrations</p>
          </div>
        </div>

        {/* Drives Table */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-brand" />
            </div>
          ) : drives.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No drives found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Company</th>
                    <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Role</th>
                    <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Type</th>
                    <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Date</th>
                    <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Registrations</th>
                    <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                    <th className="text-right px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {drives.map((drive: any) => (
                    <tr key={drive.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <div>
                          <p className="font-medium text-foreground">{drive.companyName}</p>
                          <p className="text-[10px] text-muted-foreground">{drive.recruiter?.company}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground">{drive.roleName}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${drive.driveType === "Open" ? "bg-green-500/10 text-green-600" : "bg-blue-500/10 text-blue-600"}`}>
                          {drive.driveType}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground">{new Date(drive.driveDate).toLocaleDateString()}</td>
                      <td className="px-5 py-3.5 font-bold text-foreground">{drive.registrationCount || 0}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold capitalize ${getStatusBadge(drive.status)}`}>
                          {drive.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setViewDrive(drive)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors"
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
                            className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors"
                            title="Edit Drive"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <Link
                            href={`/admin/drives/${drive.id}/participants`}
                            className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 transition-colors"
                            title="View Participants"
                          >
                            <Users className="w-4 h-4" />
                          </Link>
                          {drive.status === "active" && (
                            <button
                              onClick={() => handleAction(drive.id, "close")}
                              disabled={actionLoading === drive.id}
                              className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                              title="Close Drive"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                          {drive.status === "completed" && (
                            <button
                              onClick={() => handleAction(drive.id, "reopen")}
                              disabled={actionLoading === drive.id}
                              className="p-1.5 rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors disabled:opacity-50"
                              title="Reopen Drive"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              if (confirm("Are you sure you want to archive this drive?")) {
                                handleAction(drive.id, "archive");
                              }
                            }}
                            disabled={actionLoading === drive.id}
                            className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                            title="Archive / Delete Drive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
