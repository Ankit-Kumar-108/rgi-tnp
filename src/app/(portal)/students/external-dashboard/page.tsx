"use client";

import React, { useEffect, useState } from "react";
import {
  Briefcase,
  CheckCircle,
  Clock,
  Building2,
  AlertTriangle,
  XCircle,
  CalendarDays,
  FileText,
  Upload,
  Loader2,
  BadgeCheck,
  BadgeAlert,
  LogOut,
  RefreshCw,
  ChevronRight,
  Linkedin,
  Github,
} from "lucide-react";
import Nav from "@/components/layout/nav/nav";
import Footer from "@/components/layout/footer/footer";
import { useAuth } from "@/hooks/useAuth";
import { getToken, logout } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { uploadFileToR2 } from "@/lib/upload-r2";
import { PlacementDrive } from "@/types";
import JobDetailsModal from "@/components/forms/studentApplyModal/modal";
import { toast } from "sonner";

export default function ExternalStudentDashboard() {
  const router = useRouter();
  const { loading: authLoading, authenticated, user } = useAuth("external_student", "/external-students/login");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Complete Profile Form
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [submittingProfile, setSubmittingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ msg: string; ok: boolean } | null>(null);
  const [profileForm, setProfileForm] = useState({
    tenthPercentage: "",
    twelfthPercentage: "",
    activeBacklog: "0",
    linkedinUrl: "",
    githubUrl: "",
  });

  useEffect(() => {
    if (!authenticated) return;
    fetchDashboard();
  }, [authenticated]);

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    logout("external_student");
    router.push("/");
  };

  const getEligibilityData = (drive: any, student: any) => {
    let reason = "";
    if (drive.course !== "All" && !drive.course?.includes(student?.course)) reason = "Course Ineligible";
    else if (!drive.eligibleBranches?.includes(student?.branch)) reason = "Branch Ineligible";
    else if ((student?.cgpa || 0) < drive.minCGPA) reason = "CGPA too low";
    else if (student?.batch && drive.minBatch && drive.maxBatch) {
      const sBatch = parseInt(student.batch.split('-').pop(), 10);
      const minB = parseInt(drive.minBatch.split('-').pop(), 10);
      const maxB = parseInt(drive.maxBatch.split('-').pop(), 10);
      if (sBatch < minB || sBatch > maxB) reason = "Batch Ineligible";
    }

    if (drive.isRegistered) {
      return {
        actionElement: <span className="inline-flex items-center gap-1 text-green-600 text-xs font-bold"><CheckCircle className="w-4 h-4" /> Registered</span>
      };
    }

    if (reason) {
      return {
        actionElement: (
          <div className="flex flex-col items-end">
            <span className="inline-flex items-center gap-1 text-red-500 text-xs font-bold"><XCircle className="w-4 h-4" /> Ineligible</span>
            <span className="text-[10px] text-muted-foreground leading-none mt-1">{reason}</span>
          </div>
        )
      };
    }

    return {
      actionElement: (
        <button
          onClick={() => { setSelectedDrive(drive); setIsModalOpen(true); }}
          className="bg-brand text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-brand/90 transition-all active:scale-95"
        >
          Register
        </button>
      )
    };
  };

  const fetchDashboard = async () => {
    try {
      setFetchError(null);
      const token = getToken("external_student");
      const res = await fetch("/api/external/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const d = (await res.json()) as any;
      if (d.success) {
        setData(d);
        if (d.student) {
          setProfileForm({
            tenthPercentage: d.student.tenthPercentage?.toString() || "",
            twelfthPercentage: d.student.twelfthPercentage?.toString() || "",
            activeBacklog: d.student.activeBacklog?.toString() || "0",
            linkedinUrl: d.student.linkedinUrl || "",
            githubUrl: d.student.githubUrl || "",
          });
        }
      }
      else setFetchError(d.message || "Failed to load dashboard");
    } catch (err) {
      console.error(err);
      setFetchError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingProfile(true);
    setProfileMsg(null);
    try {
      const token = getToken("external_student");
      const res = await fetch("/api/external/update-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ profileImageUrl: data?.student?.profileImageUrl, ...profileForm }),
      });
      const d = (await res.json()) as any;
      setProfileMsg({ msg: d.message, ok: d.success });
      if (d.success) {
        fetchDashboard();
        setTimeout(() => setShowProfileForm(false), 2000);
      }
    } catch {
      setProfileMsg({ msg: "Update failed", ok: false });
    } finally {
      setSubmittingProfile(false);
    }
  };

  const [selectedDrive, setSelectedDrive] = useState<PlacementDrive | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    try {
      setResumeUploading(true);
      const url = await uploadFileToR2(e.target.files[0], "resumes");
      const token = getToken("external_student");
      const res = await fetch("/api/external/update-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ profileImageUrl: student?.profileImageUrl, resumeUrl: url }),
      });
      const d = await res.json() as any;
      if (d.success) {
        toast.success("Resume updated successfully!");
        fetchDashboard();
      } else {
        throw new Error(d.message);
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Resume upload failed: " + err.message);
    } finally {
      setResumeUploading(false);
    }
  };

  if (authLoading || !authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    );
  }

  const student = data?.student;
  const drives = data?.drives || [];
  const archivedDrives = data?.archivedDrives || [];
  const registrations = data?.registrations || [];

  return (
    <>
      <Nav />
      {selectedDrive && (
        <JobDetailsModal
          role="external_student"
          drive={selectedDrive}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedDrive(null);
          }}
          onSuccess={() => {
            fetchDashboard();
          }}
        />
      )}

      <div className="bg-background text-foreground antialiased font-sans min-h-screen mt-15">
        <div className="fixed bottom-0 right-0 w-96 h-96 bg-brand/5 rounded-full blur-[120px] -z-10" />

        <main className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">

          {/* Main Welcome Header */}
          <section className="pt-4 md:pt-8 flex flex-col md:flex-row justify-between md:items-end gap-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-tight">
              Welcome, <span className="text-brand">{student?.name || "Student"}</span>
            </h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowProfileForm(!showProfileForm)}
                className="inline-flex items-center gap-2 text-sm font-bold text-brand hover:text-brand/80 transition-colors border border-brand/20 px-4 py-2.5 rounded-2xl bg-brand/5 hover:bg-brand/10"
              >
                {showProfileForm ? "Cancel Edit" : "Complete Profile"}
                <ChevronRight className={`w-4 h-4 transition-transform ${showProfileForm ? "rotate-90" : ""}`} />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-destructive/10 text-destructive px-5 py-2.5 rounded-2xl text-sm font-bold hover:bg-destructive/20 transition-all shadow-sm border border-destructive/10"
              >
                <LogOut className="size-4" /> Logout
              </button>
            </div>
          </section>

          {/* Complete Profile Form (Collapsible) */}
          {showProfileForm && (
            <section className="bg-card rounded-[2rem] p-8 shadow-xl border-2 border-brand/20 animate-in fade-in slide-in-from-top-4 duration-300">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <div className="p-2 bg-brand/10 rounded-lg text-brand"><FileText className="w-5 h-5" /></div>
                Academic &amp; Professional Details
              </h2>
              <form onSubmit={handleSubmitProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">10th Percentage</label>
                    <input type="number" step="0.01" min="0" max="100"
                      value={profileForm.tenthPercentage} onChange={(e) => setProfileForm({ ...profileForm, tenthPercentage: e.target.value })}
                      className="w-full bg-muted px-5 py-3.5 rounded-2xl border-none focus:ring-2 focus:ring-brand transition-all text-sm outline-none text-foreground"
                      placeholder="e.g. 85.50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">12th Percentage</label>
                    <input type="number" step="0.01" min="0" max="100"
                      value={profileForm.twelfthPercentage} onChange={(e) => setProfileForm({ ...profileForm, twelfthPercentage: e.target.value })}
                      className="w-full bg-muted px-5 py-3.5 rounded-2xl border-none focus:ring-2 focus:ring-brand transition-all text-sm outline-none text-foreground"
                      placeholder="e.g. 78.30" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Active Backlogs</label>
                    <input type="number" min="0" max="20"
                      value={profileForm.activeBacklog} onChange={(e) => setProfileForm({ ...profileForm, activeBacklog: e.target.value })}
                      className="w-full bg-muted px-5 py-3.5 rounded-2xl border-none focus:ring-2 focus:ring-brand transition-all text-sm outline-none text-foreground"
                      placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">LinkedIn URL</label>
                    <div className="relative">
                      <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input value={profileForm.linkedinUrl} onChange={(e) => setProfileForm({ ...profileForm, linkedinUrl: e.target.value })}
                        className="w-full bg-muted pl-11 pr-5 py-3.5 rounded-2xl border-none focus:ring-2 focus:ring-brand transition-all text-sm outline-none text-foreground"
                        placeholder="https://linkedin.com/in/..." />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">GitHub URL</label>
                    <div className="relative">
                      <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input value={profileForm.githubUrl} onChange={(e) => setProfileForm({ ...profileForm, githubUrl: e.target.value })}
                        className="w-full bg-muted pl-11 pr-5 py-3.5 rounded-2xl border-none focus:ring-2 focus:ring-brand transition-all text-sm outline-none text-foreground"
                        placeholder="https://github.com/..." />
                    </div>
                  </div>
                </div>
                {profileMsg && <p className={`text-sm font-medium ${profileMsg.ok ? "text-green-600" : "text-red-500"}`}>{profileMsg.msg}</p>}
                <div className="flex gap-4">
                  <button type="submit" disabled={submittingProfile}
                    className="bg-brand text-primary-foreground px-8 py-3.5 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg shadow-brand/20 disabled:opacity-50 flex items-center gap-2"
                  >
                    {submittingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                    Save Profile
                  </button>
                  <button type="button" onClick={() => setShowProfileForm(false)}
                    className="bg-muted text-foreground px-8 py-3.5 rounded-xl font-bold hover:bg-muted/80 transition-colors"
                  >
                    Discard
                  </button>
                </div>
              </form>
            </section>
          )}

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-brand" />
            </div>
          ) : fetchError ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <p className="text-destructive font-bold text-lg">{fetchError}</p>
              <button
                onClick={() => { setLoading(true); fetchDashboard(); }}
                className="flex items-center gap-2 px-6 py-3 bg-brand text-primary-foreground rounded-xl font-bold text-sm hover:bg-brand/90 transition-all"
              >
                <RefreshCw className="w-4 h-4" /> Retry
              </button>
            </div>
          ) : (
            <>
              {/* Academic Profile Card */}
              <section className="relative">
                <div className="absolute -top-12 -left-12 w-64 h-64 bg-brand/10 rounded-full blur-3xl -z-10"></div>
                <div className="absolute top-24 -right-12 w-48 h-48 bg-foreground/5 rounded-full blur-3xl -z-10"></div>

                <div className="bg-card rounded-2xl p-8 md:p-12 shadow-sm border border-border flex flex-col md:flex-row gap-8 md:items-center relative overflow-hidden group hover:shadow-xl transition-shadow duration-500">

                  {/* Decorative Gradient Accent */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-brand/10 to-transparent rounded-bl-[5rem]"></div>

                  {/* Avatar Section */}
                  <div className="relative shrink-0 mx-auto md:mx-0">
                    <div className="w-40 h-40 md:w-56 md:h-56 rounded-full p-2 bg-gradient-to-tr from-brand to-brand/40 transition-transform duration-500 group-hover:rotate-6">
                      <div className="w-full h-full rounded-full border-4 border-background overflow-hidden bg-muted">
                        {student?.profileImageUrl ? (
                          <img
                            alt="Student Portrait"
                            className="w-full h-full object-cover"
                            src={student.profileImageUrl}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl font-black text-muted-foreground uppercase">
                            {student?.name?.charAt(0)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Verified Badge */}
                    <div className="absolute bottom-4 bg-background right-0 md:right-4 size-10 rounded-full flex shrink-0 items-center justify-center shadow-lg">
                      {student?.isVerified ? (
                        <BadgeCheck className="size-11 text-green-500" />
                      ) : (
                        <BadgeAlert className="size-11 text-red-500" />
                      )}
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="flex-1 space-y-6 text-center md:text-left">
                    <div className="space-y-2">
                      <p className="text-brand font-bold text-xs uppercase tracking-[0.3em]">
                        Institutional Identity
                      </p>
                      <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter leading-none">
                        {student?.name}
                      </h2>
                      <p className="text-lg md:text-xl font-medium text-muted-foreground tracking-tight flex items-center justify-center md:justify-start gap-2">
                        <Building2 className="w-5 h-5" /> {student?.collegeName || "External Institute"}
                      </p>
                    </div>

                    {/* Horizontal Grid Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-0 pt-6 border-t border-border">
                      <div className="md:pr-6 md:border-r border-border">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Current CGPA</p>
                        <p className="text-xl md:text-2xl font-bold text-brand">{student?.cgpa || "N/A"}</p>
                      </div>
                      <div className="md:px-6 md:border-r border-border">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Branch</p>
                        <p className="text-md md:text-lg font-bold text-foreground leading-tight truncate">{student?.branch || "N/A"}</p>
                      </div>
                      <div className="md:px-6 md:border-r border-border">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Batch</p>
                        <p className="text-xl md:text-2xl font-bold text-foreground">{student?.batch || "N/A"}</p>
                      </div>
                      <div className="md:pl-6">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Course</p>
                        <p className="text-xl md:text-2xl font-bold text-foreground">{student?.course}</p>
                      </div>
                    </div>

                    {/* Resume Actions */}
                    <div className="pt-6 flex flex-wrap items-center justify-center md:justify-start gap-3">
                      {student?.resumeUrl ? (
                        <a href={student.resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-brand/10 text-brand rounded-xl font-bold hover:bg-brand/20 transition-colors text-sm">
                          <FileText className="w-4 h-4" /> View Resume
                        </a>
                      ) : (
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-muted text-muted-foreground rounded-xl font-bold text-sm">
                          <FileText className="w-4 h-4" /> No Resume
                        </span>
                      )}
                      <label className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-xl text-sm font-bold hover:bg-muted/80 transition-all cursor-pointer border border-border/50">
                        {resumeUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        {resumeUploading ? "Uploading..." : "Update Resume"}
                        <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleResumeUpload} disabled={resumeUploading} />
                      </label>
                    </div>
                  </div>
                </div>
              </section>

              {/* Email Verification Banner (Conditional) */}
              {!student?.isVerified && (
                <section className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-5 flex items-center gap-4">
                  <AlertTriangle className="w-8 h-8 text-yellow-500 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-yellow-600">Action Required: Verify Email</p>
                    <p className="text-sm text-muted-foreground">You cannot apply for pool campus drives until your account is verified.</p>
                  </div>
                </section>
              )}

              {/* Open Drives Section */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-brand" />
                  Upcoming Drives
                </h2>

                {drives.length === 0 ? (
                  <div className="bg-card rounded-2xl border border-border p-8 text-center text-muted-foreground">
                    <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No eligible drives available right now</p>
                  </div>
                ) : (
                  <>
                    {/* MOBILE VIEW: Grid of Cards (Visible only on small screens) */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                      {drives.map((drive: any) => {
                        const { actionElement } = getEligibilityData(drive, student);
                        return (
                          <div key={drive.id} className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center shrink-0">
                                  <Building2 className="w-5 h-5 text-brand" />
                                </div>
                                <div>
                                  <h3 className="font-bold text-foreground leading-tight">{drive.companyName}</h3>
                                  <p className="text-xs text-muted-foreground">{drive.roleName}</p>
                                </div>
                              </div>
                              <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${drive.driveType === "Open" ? "bg-green-500/10 text-green-600" : "bg-blue-500/10 text-blue-600"}`}>
                                {drive.driveType}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 py-2 border-y border-border/50">
                              <div>
                                <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">CTC</p>
                                <p className="text-sm font-bold text-foreground">{drive.ctc}</p>
                              </div>
                              <div>
                                <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Date</p>
                                <p className="text-sm font-bold text-foreground">{new Date(drive.driveDate).toLocaleDateString()}</p>
                              </div>
                            </div>

                            <div className="flex justify-end pt-1">
                              {actionElement}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* DESKTOP VIEW: Standard Table (Hidden on small screens) */}
                    <div className="hidden md:block bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50 border-b border-border">
                          <tr className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            <th className="text-left px-5 py-3">Company</th>
                            <th className="text-left px-5 py-3">Role</th>
                            <th className="text-left px-5 py-3">CTC</th>
                            <th className="text-left px-5 py-3">Date</th>
                            <th className="text-left px-5 py-3">Type</th>
                            <th className="text-right px-5 py-3">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                          {drives.map((drive: any) => {
                            const { actionElement } = getEligibilityData(drive, student);
                            return (
                              <tr key={drive.id} className="hover:bg-muted/30 transition-colors">
                                <td className="px-5 py-3.5">
                                  <div className="flex items-center gap-3">
                                    <Building2 className="w-4 h-4 text-brand" />
                                    <span className="font-medium">{drive.companyName}</span>
                                  </div>
                                </td>
                                <td className="px-5 py-3.5 text-muted-foreground">{drive.roleName}</td>
                                <td className="px-5 py-3.5 font-bold">{drive.ctc}</td>
                                <td className="px-5 py-3.5 text-muted-foreground">{new Date(drive.driveDate).toLocaleDateString()}</td>
                                <td className="px-5 py-3.5">
                                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${drive.driveType === "Open" ? "bg-green-500/10 text-green-600" : "bg-blue-500/10 text-blue-600"}`}>
                                    {drive.driveType}
                                  </span>
                                </td>
                                <td className="px-5 py-3.5 text-right">{actionElement}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </section>

              {/* My Registrations History */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-brand" />
                  My Registrations
                </h2>

                {registrations.length === 0 ? (
                  <div className="bg-card rounded-2xl border border-border p-8 text-center text-muted-foreground">
                    <p className="font-medium">No registrations yet</p>
                    <p className="text-xs mt-1">Register for a drive from the list above</p>
                  </div>
                ) : (
                  <>
                    {/* MOBILE VIEW: Cards */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                      {registrations.map((reg: any) => (
                        <div key={reg.id} className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-foreground leading-tight">{reg.drive?.companyName}</h3>
                              <p className="text-xs text-muted-foreground">{reg.drive?.roleName}</p>
                            </div>
                            <span className={`text-[10px] px-2 py-1 rounded-full font-bold capitalize ${reg.drive?.status === "active" ? "bg-green-500/10 text-green-600" :
                              reg.drive?.status === "completed" ? "bg-blue-500/10 text-blue-600" :
                                "bg-muted text-muted-foreground"
                              }`}>
                              {reg.drive?.status}
                            </span>
                          </div>

                          <div className="flex items-center justify-between py-3 border-y border-border/50">
                            <div className="space-y-1">
                              <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Action Status</p>
                              <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider ${reg.status === "Selected" ? "bg-green-500/10 text-green-600" :
                                reg.status === "Rejected" ? "bg-red-500/10 text-red-500" :
                                  reg.status === "Shortlisted" ? "bg-yellow-500/10 text-yellow-600" :
                                    "bg-muted text-muted-foreground"
                                }`}>
                                {reg.status || "Applied"}
                              </span>
                            </div>
                            <div className="text-right space-y-1">
                              <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Attendance</p>
                              {reg.attended ? (
                                <span className="text-green-600 text-xs font-bold flex items-center justify-end gap-1">
                                  <CheckCircle className="w-3.5 h-3.5" /> Present
                                </span>
                              ) : (
                                <span className="text-muted-foreground text-xs font-bold flex items-center justify-end gap-1">
                                  <Clock className="w-3.5 h-3.5" /> Upcoming
                                </span>
                              )}
                            </div>
                          </div>

                          <p className="text-[10px] text-muted-foreground italic">
                            Drive Date: {reg.drive?.driveDate ? new Date(reg.drive.driveDate).toLocaleDateString() : "-"}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* DESKTOP VIEW: Table */}
                    <div className="hidden md:block bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                          <thead>
                            <tr className="bg-muted/50 border-b border-border text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                              <th className="px-5 py-4">Company & Role</th>
                              <th className="px-5 py-4">Date</th>
                              <th className="px-5 py-4">Action Status</th>
                              <th className="px-5 py-4">Drive Status</th>
                              <th className="px-5 py-4 text-right">Attendance</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/50">
                            {registrations.map((reg: any) => (
                              <tr key={reg.id} className="hover:bg-muted/30 transition-colors">
                                <td className="px-5 py-3.5">
                                  <p className="font-medium text-foreground">{reg.drive?.companyName}</p>
                                  <p className="text-xs text-muted-foreground">{reg.drive?.roleName}</p>
                                </td>
                                <td className="px-5 py-3.5 text-muted-foreground">
                                  {reg.drive?.driveDate ? new Date(reg.drive.driveDate).toLocaleDateString() : "-"}
                                </td>
                                <td className="px-5 py-3.5">
                                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider ${reg.status === "Selected" ? "bg-green-500/10 text-green-600" :
                                    reg.status === "Rejected" ? "bg-red-500/10 text-red-500" :
                                      reg.status === "Shortlisted" ? "bg-yellow-500/10 text-yellow-600" :
                                        "bg-muted text-muted-foreground"
                                    }`}>
                                    {reg.status || "Applied"}
                                  </span>
                                </td>
                                <td className="px-5 py-3.5">
                                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold capitalize ${reg.drive?.status === "active" ? "bg-green-500/10 text-green-600" :
                                    reg.drive?.status === "completed" ? "bg-blue-500/10 text-blue-600" :
                                      "bg-muted text-muted-foreground"
                                    }`}>
                                    {reg.drive?.status}
                                  </span>
                                </td>
                                <td className="px-5 py-3.5 text-right">
                                  {reg.attended ? (
                                    <span className="text-green-600 text-xs font-bold inline-flex items-center gap-1">
                                      <CheckCircle className="w-3.5 h-3.5" /> Present
                                    </span>
                                  ) : (
                                    <span className="text-muted-foreground text-xs font-bold inline-flex items-center gap-1">
                                      <Clock className="w-3.5 h-3.5" /> Upcoming
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}
              </section>
              {/* Archived Drives */}
              {archivedDrives.length > 0 && (
                <section className="opacity-70 hover:opacity-100 transition-opacity duration-300">
                  <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-brand" />
                    Archived Drives History
                  </h2>

                  {/* MOBILE VIEW: Compact List */}
                  <div className="grid grid-cols-1 gap-3 md:hidden">
                    {archivedDrives.map((drive: any) => (
                      <div key={drive.id} className="bg-card/50 border border-border rounded-xl p-4 flex justify-between items-center">
                        <div className="space-y-1">
                          <h3 className="text-sm font-bold text-foreground truncate max-w-[150px]">
                            {drive.companyName}
                          </h3>
                          <p className="text-[10px] text-muted-foreground">
                            {drive.roleName} • {new Date(drive.driveDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          {drive.isRegistered ? (
                            <span className="bg-brand/10 text-brand text-[9px] px-2 py-0.5 rounded-full font-bold">
                              Registered
                            </span>
                          ) : (
                            <span className="bg-muted text-muted-foreground text-[9px] px-2 py-0.5 rounded-full font-bold">
                              Missed
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* DESKTOP VIEW: Clean Table */}
                  <div className="hidden md:block bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-muted/50 border-b border-border text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            <th className="text-left px-5 py-3">Company</th>
                            <th className="text-left px-5 py-3">Role</th>
                            <th className="text-left px-5 py-3">Date</th>
                            <th className="text-right px-5 py-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                          {archivedDrives.map((drive: any) => (
                            <tr key={drive.id} className="hover:bg-muted/20 transition-colors">
                              <td className="px-5 py-3.5 font-medium text-foreground">
                                {drive.companyName}
                              </td>
                              <td className="px-5 py-3.5 text-muted-foreground">
                                {drive.roleName}
                              </td>
                              <td className="px-5 py-3.5 text-muted-foreground">
                                {new Date(drive.driveDate).toLocaleDateString()}
                              </td>
                              <td className="px-5 py-3.5 text-right">
                                {drive.isRegistered ? (
                                  <span className="bg-brand/10 text-brand text-[10px] px-2 py-0.5 rounded-full font-bold">
                                    Registered
                                  </span>
                                ) : (
                                  <span className="bg-muted text-muted-foreground text-[10px] px-2 py-0.5 rounded-full font-bold">
                                    Not Registered
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>
              )}
            </>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}