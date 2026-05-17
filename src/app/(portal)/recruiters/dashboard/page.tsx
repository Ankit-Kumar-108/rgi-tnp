"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import useSWR from "swr";
import { fetchWithRetry } from "@/lib/fetch-utils";
import {
  Plus,
  Search,
  ChevronRight,
  Loader2,
  Briefcase,
  Clock,
  CheckCircle,
  Users,
  X,
  Eye,
  Edit,
  LogOut,
  RefreshCw,
  MessageSquareShare,
} from "lucide-react";
import Nav from "@/components/layout/nav/nav";
import Footer from "@/components/layout/footer/footer";
import { useAuth } from "@/hooks/useAuth";
import { getToken, logout } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import Image from "next/image";

// Lazy load heavy modal components — only loaded when user interacts
const JobDetailsModal = dynamic(
  () => import("@/components/forms/studentApplyModal/modal"),
  { ssr: false }
);
const FeedbackCorporate = dynamic(
  () => import("../feedback/feedbackpg"),
  { ssr: false }
);

const BRANCHES = ["Computer Science", "Civil", "Mechanical", "Electronics", "Electrical", "Power Systems", "Digital Communication", "Thermal Engineering", "Marketing", "Finance", "Human Resource"] //change courese here  for filtering

export default function RecruiterDashboard() {
  const { loading: authLoading, authenticated, user } = useAuth("recruiter", "/recruiters/login");

  /* SWR fetcher with auth */
  const recruiterFetcher = async <T = any,>(url: string): Promise<T> => {
    const token = getToken("recruiter");
    const res = await fetchWithRetry(url, {
      headers: { Authorization: `Bearer ${token}` },
      retries: 3,
      retryDelay: 1500,
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error((errData as any)?.message || `HTTP ${res.status}`);
    }
    return res.json() as Promise<T>;
  };

  /* ── SWR: Main dashboard data ── */
  const {
    data: dashResult,
    error: dashError,
    isLoading: loading,
    mutate: mutateDash,
  } = useSWR<{ success: boolean; drives?: any[]; stats?: any; message?: string }>(
    authenticated ? "/api/recruiter/dashboard" : null,
    recruiterFetcher,
    {
      revalidateOnFocus: true,
      errorRetryCount: 3,
      errorRetryInterval: 2000,
      dedupingInterval: 10000,
    },
  );

  const data = dashResult?.success ? dashResult : null;
  const fetchError: string | null = dashError?.message || (!dashResult?.success && dashResult?.message) || null;

  const [showForm, setShowForm] = useState(false);
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [formMsg, setFormMsg] = useState<{ msg: string; ok: boolean } | null>(null);
  const [selectedDrive, setSelectedDrive] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false)

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
    jobType: "Full Time",
    genderPreference: "Both",
    duration: "",
    interviewProcess: ""
  });
  const [editDriveId, setEditDriveId] = useState<string | null>(null);
  const [viewDrive, setViewDrive] = useState<any | null>(null);

  useEffect(() => {
    if (user?.company) setForm((f) => ({ ...f, companyName: user.company }));
  }, [user]);
  const fetchApplicants = async (driveId: string) => {
    try {
      setIsLoading(true)
      const token = getToken("recruiter")
      const response = await fetchWithRetry(`/api/recruiter/dashboard?driveId=${driveId}`, {
        headers: { Authorization: `Bearer ${token}` },
        retries: 2,
      })
      const data = (await response.json()) as any
      if (data.success) {
        setSelectedDrive((prev: any) =>
          prev ? { ...prev, applicants: data.firstDriveApplicants ?? [] } : prev
        )
      }
      setIsLoading(false)
    } catch (error: any) {
      console.error("Error fetching applicants")
      toast.error("Error fetching Applicants")
    }
  }

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    logout("recruiter");
    toast.success("Logged out successfully");
    router.push("/recruiters/login");
  };

  const handleSubmitDrive = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormMsg(null);
    try {
      const token = getToken("recruiter");
      const method = editDriveId ? "PUT" : "POST";
      const bodyData = editDriveId ? { ...form, id: editDriveId, minCGPA: parseFloat(String(form.minCGPA)) } : { ...form, minCGPA: parseFloat(String(form.minCGPA)) }

      if (!form.eligibleBranches) {
        setFormMsg({ msg: "Please select eligible branches", ok: false });
        toast.error("Please select eligible branches");
        setSubmitting(false);
        return;
      }
      if (!form.course) {
        setFormMsg({ msg: "Please select at least one course", ok: false });
        toast.error("Please select at least one course");
        setSubmitting(false);
        return;
      }

      const res = await fetchWithRetry("/api/recruiter/drives", {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(bodyData),
        retries: 2,
        retryDelay: 1500,
      });
      const d = (await res.json()) as any;
      setFormMsg({ msg: d.message, ok: d.success });
      if (d.success) {
        setTimeout(() => setShowForm(false), 1000);
        setForm({ companyName: user?.company || "", roleName: "", jobDescription: "", ctc: "", eligibleBranches: "", minCGPA: 0, minBatch: "", maxBatch: "", course: "B.Tech", driveDate: "", driveType: "Closed", jobType: "Full Time", genderPreference: "Both", duration: "", interviewProcess: "" });
        setEditDriveId(null);
        mutateDash();
      }
    } catch {
      setFormMsg({ msg: "Submission failed", ok: false });
      toast.error("Failed to submit drive request");
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
          {/* Error state */}
          {fetchError && !loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <p className="text-destructive font-bold text-lg">{fetchError}</p>
              <button
                onClick={() => mutateDash()}
                className="flex items-center gap-2 px-6 py-3 bg-brand text-primary-foreground rounded-xl font-bold text-sm hover:bg-brand/90 transition-all"
              >
                <RefreshCw className="w-4 h-4" /> Retry
              </button>
            </div>
          )}
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
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2.5 text-destructive rounded-full text-sm font-bold border border-border bg-destructive/20 hover:text-red-500 hover:border-red-500/30 transition-all"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
              <button
                onClick={() => setShowFeedbackModal(true)}
                className="inline-flex items-center gap-2 text-sm font-bold text-foreground hover:bg-muted transition-colors border border-border px-4 py-2.5 rounded-full bg-card shadow-sm cursor-pointer"
              >
                <MessageSquareShare className="w-4 h-4" />
                Share Feedback
              </button>
              <button
                onClick={() => {
                  setEditDriveId(null);
                  setForm({ companyName: user?.company || "", roleName: "", jobDescription: "", ctc: "", eligibleBranches: "", minCGPA: 0, minBatch: "", maxBatch: "", course: "B.Tech", driveDate: "", driveType: "Closed", jobType: "Full-Time", genderPreference: "Both", duration: "", interviewProcess: "" });
                  setFormMsg(null);
                  setShowForm(true);
                }}
                className="bg-brand text-white font-bold px-6 py-2.5 rounded-full flex items-center gap-2 hover:opacity-90 transition-opacity shadow-[var(--shadow-brand)] text-sm"
              >
                <Plus className="w-4 h-4" /> Submit Drive Request
              </button>
            </div>
          </section>

          {/* Stats */}
          {!loading && (
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {/* Total Drives */}
              <div className="bg-card rounded-2xl p-5 md:p-6 border border-border shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 bg-brand/10 rounded-xl flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-brand" />
                  </div>
                </div>
                <p className="text-3xl md:text-4xl font-black text-foreground leading-none mb-1">{stats.totalDrives || 0}</p>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Drives</p>
              </div>

              {/* Active Drives */}
              <div className="bg-card rounded-2xl p-5 md:p-6 border border-border shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 bg-brand/10 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-brand" />
                  </div>
                </div>
                <p className="text-3xl md:text-4xl font-black text-foreground leading-none mb-1">{stats.activeDrives || 0}</p>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active Drives</p>
              </div>

              {/* Pending Drives */}
              <div className="bg-card rounded-2xl p-5 md:p-6 border border-border shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 bg-brand/10 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-brand" />
                  </div>
                </div>
                <p className="text-3xl md:text-4xl font-black text-foreground leading-none mb-1">{stats.pendingDrives || 0}</p>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pending Review</p>
              </div>

              {/* Total Applicants */}
              <div className="bg-card rounded-2xl p-5 md:p-6 border border-border shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 bg-brand/10 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-brand" />
                  </div>
                </div>
                <p className="text-3xl md:text-4xl font-black text-brand leading-none mb-1">{stats.totalApplicants || 0}</p>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Applicants</p>
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
                <form onSubmit={handleSubmitDrive} className="space-y-7">
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
                    <textarea required value={form.jobDescription} onChange={(e) => setForm({ ...form, jobDescription: e.target.value })} rows={10}
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
                        <option value="Full Time">Full Time</option>
                        <option value="Internship with PPO">Internship with PPO</option>
                        <option value="Internship">Internship</option>
                        <option value="Full Time with Bond">Full Time with Bond</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-muted-foreground">Eligible Gender</label>
                      <select required value={form.genderPreference} onChange={(e) => setForm({ ...form, genderPreference: e.target.value })}
                        className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-brand outline-none">
                        <option value="Both">Both Gender</option>
                        <option value="Male">Male Only</option>
                        <option value="Female">Female Only</option>
                      </select>
                    </div>
                    {(form.jobType === "Internship" || form.jobType === "Full Time with Bond" || form.jobType === "Internship with PPO") && (
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-muted-foreground">
                          {form.jobType === "Internship" ? "Internship Duration": form.jobType === "Full Time with Bond" ? "Bond Duration" : form.jobType === "Internship with PPO"? "Internship Duration" : "Bond/Contract Duration"}
                        </label>
                        <input required value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })}
                          placeholder={form.jobType === "Internship" || form.jobType === "Internship with PPO" ? "e.g., 6 months" : "e.g., 2 years"}
                          className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-brand outline-none" />
                      </div>
                    )}
                  </div>
                  {/* Interview Process */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-muted-foreground">Interview Process</label>
                    <textarea value={form.interviewProcess} onChange={(e) => setForm({ ...form, interviewProcess: e.target.value })}
                      placeholder="e.g., Online Test (1 hour) → Technical Round → HR Round"
                      rows={5}
                      className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-brand outline-none" />
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
                  {/* Branches*/}
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
                        <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Company</th>
                        <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Role</th>
                        <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Type</th>
                        <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Date</th>
                        <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Applicants</th>
                        <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                        <th className="text-right px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {drives.map((drive: any) => (
                        <tr key={drive.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="px-5 py-3.5 font-medium text-foreground">{drive.companyName}</td>
                          <td className="px-5 py-3.5 text-muted-foreground">{drive.roleName}</td>
                          <td className="px-5 py-3.5">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${drive.driveType === "Open" ? "bg-green-500/10 text-green-600" : drive.driveType === "Pool" ? "bg-amber-500/10 text-amber-600" : "bg-blue-500/10 text-blue-600"}`}>{drive.driveType}</span>
                          </td>
                          <td className="px-5 py-3.5 text-muted-foreground">{new Date(drive.driveDate).toLocaleDateString()}</td>
                          <td className="px-5 py-3.5 font-bold text-foreground">{drive.registrationCount}</td>
                          <td className="px-5 py-3.5">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-bold capitalize ${getStatusBadge(drive.status)}`}>{drive.status}</span>
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
                                    jobType: drive.jobType || "Full-Time",
                                    genderPreference: drive.genderPreference || "Both",
                                    duration: drive.duration || "",
                                    interviewProcess: drive.interviewProcess || ""
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
                                  onClick={() => {
                                    if (selectedDrive?.id === drive.id) {
                                      setSelectedDrive(null);
                                    } else {
                                      setSelectedDrive(drive);
                                      fetchApplicants(drive.id);
                                    }
                                  }}
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

          {/* Applicants Modal */}
          {selectedDrive && (
            <div
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-300"
              onClick={() => setSelectedDrive(null)}
            >
              <div
                className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-[95vw] xl:max-w-7xl max-h-[92vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Top Fixed Control Area (Header + Search combined to prevent scroll layout bugs) */}
                <div className="bg-background border-b border-border">
                  {/* Header */}
                  <div className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <h2 className="text-xl font-bold tracking-tight text-foreground">
                          {selectedDrive.companyName}
                        </h2>
                        <span className="text-sm px-2.5 py-0.5 rounded-md bg-muted text-muted-foreground font-medium border border-border">
                          {selectedDrive.roleName}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {(selectedDrive.applicants ?? []).length} Total Applicant{(selectedDrive.applicants ?? []).length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedDrive(null)}
                      className="text-muted-foreground hover:text-foreground hover:bg-muted p-2 rounded-xl transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Search Bar Container */}
                  <div className="px-6 pb-4">
                    <div className="relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name, college, branch..."
                        className="w-full pl-10 pr-4 py-2 bg-muted/40 hover:bg-muted/60 focus:bg-background border border-border rounded-xl text-sm text-foreground outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all placeholder:text-muted-foreground/70"
                      />
                    </div>
                  </div>
                </div>

                {/* Scrollable Applicants List */}
                <div className="overflow-y-auto flex-1 p-6 bg-muted/10 flex justify-center items-center">
                  {isLoading ?
                  <div className="size-8 border-brand border-4 border-t-transparent animate-spin rounded-full"></div>
                    : (
                      (selectedDrive.applicants ?? []).length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
                          <p className="text-sm font-medium">No applicants found</p>
                          <p className="text-xs text-muted-foreground/70">Try adjusting your search criteria</p>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-3">
                          {(selectedDrive.applicants ?? [])
                            .filter((a: any) => !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.college.toLowerCase().includes(search.toLowerCase()) || a.branch.toLowerCase().includes(search.toLowerCase()))
                            .map((a: any) => (
                              <div
                                key={a.id}
                                className="bg-card flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-border p-4 hover:border-brand/40 hover:bg-muted/5 shadow-sm transition-all hover:shadow-md"
                              >
                                {/* 1. Profile / Identity Column */}
                                <div className="flex items-center gap-3.5 min-w-50">
                                  <div className="relative w-11 h-11 shrink-0 rounded-full bg-brand/10 text-brand flex items-center justify-center text-base font-bold ring-2 ring-brand/5 border border-brand/10 overflow-hidden">
                                    {typeof a.profileImageUrl === "string" && a.profileImageUrl.trim().length > 0 ? (
                                      <Image
                                        src={a.profileImageUrl}
                                        alt={a.name || "Applicant"}
                                        fill
                                        sizes="44px"
                                        className="object-cover"
                                      />
                                    ) : (
                                      <span>{a.name?.charAt(0) ?? "?"}</span>
                                    )}
                                  </div>
                                  <div className="flex flex-col min-w-0">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-0.5">Name</span>
                                    <h3 className="font-semibold text-foreground text-sm truncate" title={a.name}>
                                      {a.name}
                                    </h3>
                                  </div>
                                </div>

                                {/* 2. Professional Details Layout (Dashboard Style: Label stacked over data) */}
                                <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-2 text-xs my-1 md:my-0">
                                  <div className="flex flex-col min-w-0">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-0.5">College</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${a.type === "internal" ? "text-brand" : "text-amber-600 dark:text-amber-500"}`}>
                                        {a.type === "internal" ? "RGI Student" : `${a.college}`}
                                      </span>
                                  </div>
                                  <div className="flex flex-col min-w-0">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-0.5">Branch</span>
                                    <span className="text-foreground font-medium truncate" title={a.branch}>{a.branch}</span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-0.5">CGPA</span>
                                    <span className="text-foreground font-bold text-sm text-brand">{a.cgpa}</span>
                                  </div>
                                  <div className="flex flex-col min-w-0">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-0.5">Email Contact</span>
                                    <a href={`mailto:${a.email}`} className="text-muted-foreground hover:text-brand transition-colors truncate font-medium" title={a.email}>
                                      {a.email}
                                    </a>
                                  </div>
                                </div>

                                {/* 3. Status & Timestamp Section */}
                                <div className="flex items-center md:flex-col md:items-end justify-between md:justify-center gap-1.5 pt-3 md:pt-0 border-t md:border-t-0 md:border-l border-border md:pl-5 min-w-[110px]">
                                  <div className="flex items-center gap-1.5">
                                    {a.attended ? (
                                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                        <CheckCircle className="w-3.5 h-3.5" />
                                        <span className="text-xs font-semibold">Attended</span>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span className="text-xs font-semibold">Pending</span>
                                      </div>
                                    )}
                                  </div>
                                  <span className="text-[11px] text-muted-foreground/70 font-medium">
                                    {new Date(a.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                  </span>
                                </div>

                              </div>
                            ))}
                        </div>
                      )
                    )}
                </div>
              </div>
            </div>
          )}
          {/* Feedback Modal */}
          {showFeedbackModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-background/60 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setShowFeedbackModal(false)} />
              <div className="relative w-full max-w-2xl animate-in zoom-in-95 duration-300">
                <FeedbackCorporate onClose={() => setShowFeedbackModal(false)} />
              </div>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}
