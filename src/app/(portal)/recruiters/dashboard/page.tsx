"use client";

import React, { useEffect, useState } from "react";
import {
  Plus,
  Ban,
  Search,
  Filter,
  Download,
  ArrowUpDown,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Briefcase,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Building2,
  CalendarDays,
  X,
  Eye,
  Edit,
} from "lucide-react";
import Nav from "@/components/layout/nav/nav";
import JobDetailsModal from "@/components/forms/studentApplyModal/modal";
import Footer from "@/components/layout/footer/footer";
import { useAuth } from "@/hooks/useAuth";
import { getToken } from "@/lib/auth-client";

const BRANCHES = ["Computer Science", "Civil", "Mechanical", "Electronics", "Electrical"] //change courese here  for filtering

export default function RecruiterDashboard() {
  const { loading: authLoading, authenticated, user } = useAuth("recruiter", "/recruiters/login");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formMsg, setFormMsg] = useState<{ msg: string; ok: boolean } | null>(null);
  const [selectedDrive, setSelectedDrive] = useState<any>(null);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    companyName: "",
    roleName: "",
    jobDescription: "",
    ctc: "",
    eligibleBranches: "" as string,
    minCGPA: 0,
    minBatch: "",
    maxBatch: "",
    course: "B.Tech",
    driveDate: "",
    driveType: "Closed",
    jobType: "Full-Time"
  });
  const [editDriveId, setEditDriveId] = useState<string | null>(null);
  const [viewDrive, setViewDrive] = useState<any | null>(null);

  useEffect(() => {
    if (!authenticated) return;
    fetchDashboard();
  }, [authenticated]);

  useEffect(() => {
    if (user?.company) setForm((f) => ({ ...f, companyName: user.company }));
  }, [user]);

  const fetchDashboard = async () => {
    try {
      const token = getToken("recruiter");
      const res = await fetch("/api/recruiter/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const d = (await res.json()) as any;
      if (d.success) setData(d);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitDrive = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormMsg(null);
    try {
      const token = getToken("recruiter");
      const method = editDriveId ? "PUT" : "POST";
      const bodyData = editDriveId ? { ...form, id: editDriveId, minCGPA: parseFloat(String(form.minCGPA)) } : { ...form, minCGPA: parseFloat(String(form.minCGPA)) };

      const res = await fetch("/api/recruiter/drives", {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(bodyData),
      });
      const d = (await res.json()) as any;
      setFormMsg({ msg: d.message, ok: d.success });
      if (d.success) {
        setTimeout(() => setShowForm(false), 1000);
        setForm({ companyName: user?.company || "", roleName: "", jobDescription: "", ctc: "", eligibleBranches: "", minCGPA: 0, minBatch: "", maxBatch: "", course: "B.Tech", driveDate: "", driveType: "Closed", jobType: "Full-Time" });
        setEditDriveId(null);
        fetchDashboard();
      }
    } catch {
      setFormMsg({ msg: "Submission failed", ok: false });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/10 text-green-600";
      case "pending": return "bg-yellow-500/10 text-yellow-600";
      case "completed": return "bg-blue-500/10 text-blue-600";
      case "rejected": return "bg-red-500/10 text-red-500";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (authLoading || !authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    );
  }

  const drives = data?.drives || [];
  const stats = data?.stats || {};

  return (
    <>
      <Nav />
      {viewDrive && (
        <JobDetailsModal
          drive={viewDrive}
          isOpen={true}
          onClose={() => setViewDrive(null)}
          onSuccess={() => { }}
          role="recruiter"
          readonly={true}
        />
      )}
      <div className="bg-background text-foreground antialiased font-sans flex flex-col min-h-screen mt-15">
        <main className="p-6 md:p-8 max-w-6xl mx-auto w-full space-y-8 flex-1">
          {/* Header */}
          <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-bold uppercase tracking-widest mb-2">
                <Briefcase className="w-4 h-4" /> Recruiter
              </div>
              <h1 className="text-3xl font-black tracking-tight text-foreground">
                Welcome, <span className="text-brand">{user?.name || "Recruiter"}</span>
              </h1>
              {user?.company && <p className="text-sm text-muted-foreground mt-1">{user.company}</p>}
            </div>
            <button
              onClick={() => {
                setEditDriveId(null);
                setForm({ companyName: user?.company || "", roleName: "", jobDescription: "", ctc: "", eligibleBranches: "", minCGPA: 0, minBatch: "", maxBatch: "", course: "B.Tech", driveDate: "", driveType: "Closed", jobType: "Full-Time" });
                setFormMsg(null);
                setShowForm(true);
              }}
              className="bg-brand text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 hover:bg-brand/90 transition-all shadow-lg shadow-brand/20 text-sm"
            >
              <Plus className="w-4 h-4" /> Submit Drive Request
            </button>
          </section>

          {/* Stats */}
          {!loading && (
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
                <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center mb-3"><Briefcase className="w-5 h-5 text-brand" /></div>
                <p className="text-2xl font-black text-foreground">{stats.totalDrives || 0}</p>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-1">Total Drives</p>
              </div>
              <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
                <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center mb-3"><CheckCircle className="w-5 h-5 text-green-500" /></div>
                <p className="text-2xl font-black text-foreground">{stats.activeDrives || 0}</p>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-1">Active</p>
              </div>
              <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
                <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center mb-3"><Clock className="w-5 h-5 text-yellow-500" /></div>
                <p className="text-2xl font-black text-foreground">{stats.pendingDrives || 0}</p>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-1">Pending</p>
              </div>
              <div className="bg-brand text-primary-foreground rounded-2xl p-5 shadow-xl shadow-brand/20">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3"><Users className="w-5 h-5" /></div>
                <p className="text-2xl font-black">{stats.totalApplicants || 0}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider mt-1 opacity-80">Total Applicants</p>
              </div>
            </section>
          )}

          {/* Drive Form Modal */}
          {showForm && (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
              <div className="bg-card rounded-2xl border border-border shadow-2xl max-w-lg w-full p-6 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-foreground">{editDriveId ? "Edit Drive Details" : "Submit Drive Request"}</h3>
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
                      <label htmlFor="minCGPA" className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-muted-foreground">
                        Min CGPA
                      </label>
                      <input
                        id="minCGPA"
                        required
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={form.minCGPA.toString()}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setForm({ ...form, minCGPA: isNaN(val) ? 0 : val });
                        }}
                        className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-brand outline-none"
                      />
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
                  {/* Course */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-muted-foreground">Course</label>
                    <select required value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })}
                      className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-brand outline-none">
                      <option value="B.Tech">B.Tech</option>
                      <option value="M.Tech">M.Tech</option>
                      <option value="MBA">MBA</option>
                      <option value="Diploma">Diploma</option>
                      <option value="All">All Courses</option>
                    </select>
                  </div>
                  {/* Batch Range */}
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
                        {["Closed", "Open"].map((t) => (
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
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : editDriveId ? null : <Plus className="w-4 h-4" />}
                    {submitting ? (editDriveId ? "Updating..." : "Submitting...") : (editDriveId ? "Update Drive Details" : "Submit for Approval")}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* My Submissions */}
          <section>
            <h2 className="text-lg font-bold text-foreground mb-4">My Drive Submissions</h2>
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-brand" /></div>
            ) : drives.length === 0 ? (
              <div className="bg-card rounded-2xl border border-border p-8 text-center text-muted-foreground">
                <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No drives submitted yet</p>
                <p className="text-xs mt-1">Submit a drive request to get started</p>
              </div>
            ) : (
              <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50 border-b border-border">
                        <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Company</th>
                        <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Role</th>
                        <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Type</th>
                        <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Date</th>
                        <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Applicants</th>
                        <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                        <th className="text-right px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {drives.map((drive: any) => (
                        <tr key={drive.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="px-5 py-3.5 font-medium text-foreground">{drive.companyName}</td>
                          <td className="px-5 py-3.5 text-muted-foreground">{drive.roleName}</td>
                          <td className="px-5 py-3.5">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${drive.driveType === "Open" ? "bg-green-500/10 text-green-600" : "bg-blue-500/10 text-blue-600"}`}>{drive.driveType}</span>
                          </td>
                          <td className="px-5 py-3.5 text-muted-foreground">{new Date(drive.driveDate).toLocaleDateString()}</td>
                          <td className="px-5 py-3.5 font-bold text-foreground">{drive.registrationCount}</td>
                          <td className="px-5 py-3.5">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold capitalize ${getStatusBadge(drive.status)}`}>{drive.status}</span>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-3">
                              <button
                                onClick={() => setViewDrive(drive)}
                                className="text-muted-foreground hover:text-brand transition-colors"
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
                                className="text-muted-foreground hover:text-brand transition-colors"
                                title="Edit Drive"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              {drive.registrationCount > 0 && (
                                <button
                                  onClick={() => setSelectedDrive(selectedDrive?.id === drive.id ? null : drive)}
                                  className="text-brand text-xs font-bold hover:underline flex items-center gap-1 ml-2"
                                >
                                  {selectedDrive?.id === drive.id ? "Close" : "Applicants"} <ChevronRight className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>

          {/* Applicant Detail */}
          {selectedDrive && (
            <section className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="px-5 py-4 bg-muted/30 border-b border-border flex items-center justify-between">
                <h3 className="font-bold text-foreground">Applicants — {selectedDrive.companyName} ({selectedDrive.roleName})</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..."
                    className="pl-9 pr-4 py-1.5 bg-background border border-border rounded-lg text-xs text-foreground outline-none focus:ring-2 focus:ring-brand" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border">
                      <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Name</th>
                      <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">College</th>
                      <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Branch</th>
                      <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">CGPA</th>
                      <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Type</th>
                      <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Attended</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedDrive.applicants
                      .filter((a: any) => !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.college.toLowerCase().includes(search.toLowerCase()))
                      .map((a: any) => (
                        <tr key={a.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="px-5 py-3.5 font-medium text-foreground">{a.name}</td>
                          <td className="px-5 py-3.5 text-muted-foreground">{a.college}</td>
                          <td className="px-5 py-3.5 text-muted-foreground">{a.branch}</td>
                          <td className="px-5 py-3.5 font-bold text-foreground">{a.cgpa}</td>
                          <td className="px-5 py-3.5">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${a.type === "internal" ? "bg-brand/10 text-brand" : "bg-yellow-500/10 text-yellow-600"}`}>
                              {a.type === "internal" ? "RGI" : "External"}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            {a.attended ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Clock className="w-4 h-4 text-muted-foreground" />}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}