"use client";

import React, { useEffect, useState } from "react";
import {
  Loader2,
  Briefcase,
  TrendingUp,
  Camera,
  CheckCircle,
  Clock,
  CalendarDays,
  Building2,
  BadgeCheck,
  BadgeAlert,
  Upload,
  XCircle,
  FileText,
  LogOut,
  RefreshCw,
  ChevronRight,
  Linkedin,
  Github,
  Delete,
  Trash2,
  MessageSquareShare,
} from "lucide-react"
import Nav from "@/components/layout/nav/nav"
import Footer from "@/components/layout/footer/footer"
import { useAuth } from "@/hooks/useAuth"
import { getToken, logout } from "@/lib/auth-client"
import JobDetailsModal from "@/components/forms/studentApplyModal/modal";
import { useRouter } from "next/navigation";
import { Student, PlacementDrive, DriveRegistration, Memory } from "@/types";
import { uploadFileToR2 } from "@/lib/upload-r2";
import { toast } from "sonner";
import FeedbackComp from "../feedback/feedbakComp";

export default function StudentDashboard() {
  const { loading: authLoading, authenticated, user } = useAuth("student", "/students/login");
  const [data, setData] = useState<{
    student: Student;
    drives: PlacementDrive[];
    archivedDrives?: PlacementDrive[];
    registrations: DriveRegistration[];
    memories: Memory[];
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDrive, setSelectedDrive] = useState<PlacementDrive | null>(null)
  const [memUploading, setMemUploading] = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);

  // Memory Modal State
  const [isMemModalOpen, setIsMemModalOpen] = useState(false);
  const [selectedMemFiles, setSelectedMemFiles] = useState<File[]>([]);
  const [memBatchTitle, setMemBatchTitle] = useState("");
  const [memPreviews, setMemPreviews] = useState<string[]>([]);

  // Feedback Modal
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

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

  const router = useRouter();

  useEffect(() => {
    if (!authenticated) return;
    fetchDashboard();
  }, [authenticated]);

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    logout("student");
    router.push("/");
  };

  const fetchDashboard = async () => {
    try {
      setFetchError(null);
      const token = getToken("student");
      const res = await fetch("/api/student/dashboard", {
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
      const token = getToken("student");
      const res = await fetch("/api/student/update-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(profileForm),
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

    const hasRegistered = drive.isRegistered || registrations.some(r => r.driveId === drive.id);

  if (hasRegistered) {
    return {
      actionElement: (
        // 2. Make this a clickable button so they can still read the job details
        <button 
          onClick={() => { setSelectedDrive(drive); setIsModalOpen(true); }}
          className="inline-flex items-center gap-1.5 text-green-600 bg-green-500/10 hover:bg-green-500/20 px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
        >
          <CheckCircle className="w-4 h-4" /> View Details
        </button>
      )
    };
  }

    if (reason) {
      return {
        actionElement: (
          <div className="flex flex-col items-end">
            <span className="inline-flex items-center gap-1 text-red-500 text-xs font-bold"><XCircle className="w-4 h-4" /> Ineligible</span>
            <span className="text-xs text-muted-foreground leading-none mt-1">{reason}</span>
          </div>
        )
      };
    }

    return {
      actionElement: (
        <button
          onClick={() => { setSelectedDrive(drive); setIsModalOpen(true); }}
          className="bg-brand hover:opacity-90 text-white px-6 py-2.5 rounded-full text-xs font-bold shadow-[var(--shadow-brand)] transition-opacity flex items-center gap-2 group"
        >
          <span>Apply Now</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      )
    };
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setResumeUploading(true);
      const url = await uploadFileToR2(file, "resumes", { role: "student" });
      const token = getToken("student");
      const res = await fetch("/api/student/update-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ resumeUrl: url }),
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

  const handleMemoryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Check for size on each file
    const oversized = files.some(f => f.size > 10 * 1024 * 1024);
    if (oversized) {
      toast.error("One or more images are larger than 10MB");
      return;
    }

    setSelectedMemFiles(files);
    setMemBatchTitle("");

    // Generate all previews
    const previewPromises = files.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    const results = await Promise.all(previewPromises);
    setMemPreviews(results);
    setIsMemModalOpen(true);
  };

  const startMemoryUpload = async () => {
    if (selectedMemFiles.length === 0) {
      toast.error("Please select at least one image.");
      return;
    }

    try {
      setMemUploading(true);

      // 1. Upload all to R2 in parallel
      const uploadPromises = selectedMemFiles.map((file) =>
        uploadFileToR2(file, "memories", { role: "student" }),
      );
      const imageUrls = await Promise.all(uploadPromises);

      // 2. Prepare the batch for the API
      const memories = imageUrls.map(url => ({
        imageUrl: url,
        title: memBatchTitle || "Untitled Memory"
      }));

      const token = getToken("student");
      const res = await fetch("/api/student/memories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ memories }),
      });

      const d = await res.json() as any
      if (d.success) {
        toast.success(d.message || "Memories uploaded! They will appear after moderation.");
        setIsMemModalOpen(false);
        setSelectedMemFiles([]);
        setMemPreviews([]);
        setMemBatchTitle("");
        fetchDashboard();
      } else {
        throw new Error(d.message);
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Upload failed: " + err.message);
    } finally {
      setMemUploading(false);
    }
  };

  const handleDeleteMemory = async (id: string) => {
    try {
      const token = getToken("student");
      const res = await fetch("/api/student/memories", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ id })
      });
      const d = await res.json() as any;
      if (d.success) {
        toast.success("Memory deleted successfully!");
        fetchDashboard();
      } else {
        throw new Error(d.message);
      }

    } catch (error: any) {
      console.error("Error deleting memory:", error);
      toast.error("Failed to delete memory. Please try again.");
    }
  }

  if (authLoading || !authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    );
  }

  const student = data?.student;
  const isProfileIncomplete = student && (!student.tenthPercentage || !student.twelfthPercentage || !student.resumeUrl);
  const drives = data?.drives || [];
  const archivedDrives = data?.archivedDrives || [];
  const registrations = data?.registrations || [];
  const memories = data?.memories || [];

  return (
    <>
      <Nav />
      {selectedDrive && (
        <JobDetailsModal
          drive={selectedDrive}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedDrive(null);
          }}
          onSuccess={() => {
            fetchDashboard();
          }}
          isRegistered={registrations.some(r => r.driveId === selectedDrive.id)}
        />
      )}

      {isMemModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-md rounded-2xl p-6 shadow-2xl border border-border space-y-6 animate-in zoom-in-95 duration-300">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-black text-foreground tracking-tight">Create Memory</h3>
              <p className="text-sm text-muted-foreground">Share this special moment from your journey</p>
            </div>

            {memPreviews.length > 0 && (
              <div className="grid grid-cols-2 gap-3 max-h-75 overflow-y-auto p-1 scrollbar-hide">
                {memPreviews.map((preview, idx) => (
                  <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-brand/20 bg-muted group">
                    <img src={preview} alt={`Preview ${idx}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Batch Title (Optional)</label>
                <input 
                  type="text"
                  value={memBatchTitle}
                  onChange={(e) => setMemBatchTitle(e.target.value)}
                  placeholder="e.g. Campus Farewell..."
                  className="w-full bg-muted px-6 py-4 rounded-2xl border-none focus:ring-2 focus:ring-brand outline-none text-foreground font-medium transition-all"
                />
                <p className="text-xs text-muted-foreground ml-1">This title will be applied to all {selectedMemFiles.length} images.</p>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => { setIsMemModalOpen(false); setSelectedMemFiles([]); setMemPreviews([]); }}
                  className="flex-1 bg-muted text-foreground px-6 py-4 rounded-xl font-bold hover:bg-muted/80 transition-all text-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={startMemoryUpload}
                  disabled={memUploading}
                  className="flex-2 bg-brand text-white px-6 py-4 rounded-xl font-bold hover:bg-brand/90 transition-all text-sm disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2 shadow-[var(--shadow-brand)]"
                >
                  {memUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading {selectedMemFiles.length} Photos...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload All
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-background text-foreground antialiased font-sans min-h-screen mt-15 overflow-hidden">
        <div className="fixed bottom-0 right-0 w-96 h-96 bg-brand/5 rounded-full blur-[120px] -z-10" />
        <div className="fixed top-1/2 left-0 w-64 h-64 bg-brand/5 rounded-full blur-[100px] -z-10" />

        <main className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
          {/* Header */}
          <section className="pt-4 md:pt-8 flex flex-col md:flex-row justify-between md:items-end gap-4">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-tight">
              Welcome, <span className="text-brand">{student?.name || "Student"}</span>
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowFeedbackModal(true)}
                className="inline-flex items-center gap-2 text-sm font-bold text-foreground hover:bg-muted transition-colors border border-border px-4 py-2.5 rounded-2xl bg-card shadow-sm"
              >
                <MessageSquareShare className="w-4 h-4" />
                Share Feedback
              </button>
              <button
                onClick={() => setShowProfileForm(!showProfileForm)}
                className="relative inline-flex items-center gap-2 text-sm font-bold text-brand hover:text-brand/80 transition-colors border border-brand/20 px-4 py-2.5 rounded-2xl bg-brand/5 hover:bg-brand/10"
              >
                {showProfileForm ? "Cancel Edit" : "Complete Profile"}
                <ChevronRight className={`w-4 h-4 transition-transform ${showProfileForm ? "rotate-90" : ""}`} />
                {!showProfileForm && isProfileIncomplete && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-sm" />
                )}
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
            <section className="bg-card rounded-2xl p-6 shadow-xl border-2 border-brand/20 animate-in fade-in slide-in-from-top-4 duration-300">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
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
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">12th/Diploma Percentage</label>
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
                    className="bg-brand text-primary-foreground px-8 py-3.5 rounded-full font-bold hover:opacity-90 transition-opacity shadow-[var(--shadow-brand)] disabled:opacity-50 flex items-center gap-2"
                  >
                    {submittingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                    Save <span className="hidden sm:block">Profile</span>
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
                <div className="space-y-8">
                  <section className="relative">
                    {/* Background Glows */}
                    <div className="absolute -top-12 -left-12 size-64 bg-brand/10 rounded-full blur-3xl -z-10"></div>
                    <div className="absolute top-24 -right-12 size-48 bg-foreground/5 rounded-full blur-3xl -z-10"></div>

                    <div className="bg-card rounded-2xl p-6 md:p-8 shadow-[var(--shadow-sm)] border border-border flex flex-col md:flex-row gap-8 md:items-center relative overflow-hidden group hover:shadow-[var(--shadow-md)] transition-shadow duration-300">

                      {/* Decorative Gradient Accent */}
                      <div className="absolute top-0 right-0 size-32 bg-linear-to-bl from-brand/10 to-transparent rounded-bl-[5rem]"></div>

                      {/* Avatar Section */}
                      <div className="relative shrink-0 mx-auto md:mx-0">
                        <div className="w-32 h-32 md:size-48 rounded-full p-1 md:p-2 bg-linear-to-tr from-brand to-brand/40 transition-transform duration-500 group-hover:rotate-6">
                          <div className="w-full h-full rounded-full border-2 md:border-4 border-background overflow-hidden bg-muted">
                            {student?.profileImageUrl ? (
                              <img
                                alt="Student Portrait"
                                loading="lazy"
                                className="w-full h-full object-cover object-top"
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
                        <div className="absolute bottom-4 bg-background right-0 md:right-4 size-7 md:size-10 rounded-full flex shrink-0 items-center justify-center">
                          {student?.isVerified || student?.isEmailVerified ? (
                            <BadgeCheck className={`size-7 md:size-10 text-center text-green-500`} />
                          ) : (
                            <BadgeAlert className={`size-7 md:size-10 text-center text-red-500`} />
                          )}
                        </div>

                      </div>

                      {/* Info Section */}
                      <div className="flex-1 space-y-6 text-center md:text-left">
                        <div className="space-y-2">
                          <p className="text-brand font-bold text-xs uppercase tracking-[0.3em]">
                            Institutional Identity
                          </p>
                          <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tighter leading-none">
                            {student?.name}
                          </h1>
                          <p className="text-lg md:text-xl font-medium text-muted-foreground tracking-tight">
                            {student?.course}
                          </p>
                        </div>

                        {/* Horizontal Grid Stats */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-0 pt-6 border-t border-border">
                          <div className="md:pr-6 md:border-r border-border">
                            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Current CGPA</p>
                            <p className="text-xl md:text-2xl font-bold text-brand">{student?.cgpa}</p>
                          </div>
                          <div className="md:px-6 md:border-r border-border">
                            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Branch</p>
                            <p className="text-md md:text-lg font-bold text-foreground leading-tight">{student?.branch}</p>
                          </div>
                          <div className="md:px-6 md:border-r border-border">
                            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Semester</p>
                            <p className="text-xl md:text-2xl font-bold text-foreground">{student?.semester}</p>
                          </div>
                          <div className="md:px-6 md:border-r border-border">
                            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Course</p>
                            <p className="text-xl md:text-2xl font-bold text-foreground">{student?.course}</p>
                          </div>
                        </div>

                        {/* Resume Actions */}
                        <div className="pt-6 flex flex-wrap items-center gap-3">
                          {student?.resumeUrl ? (
                            <a href={student.resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-brand/10 text-brand rounded-xl font-bold hover:bg-brand/20 transition-colors text-sm">
                              <FileText className="w-4 h-4" /> View Resume
                            </a>
                          ) : (
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-muted text-muted-foreground rounded-xl font-bold text-sm">
                              <FileText className="w-4 h-4" /> No Resume
                            </span>
                          )}
                          <label className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-xl text-sm font-bold hover:bg-muted/80 transition-all cursor-pointer">
                            {resumeUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                            {resumeUploading ? "Uploading..." : "Update Resume"}
                            <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleResumeUpload} disabled={resumeUploading} />
                          </label>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </section> 

              {/* Stats */}
              {!loading && data && (
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {/* Stat Card: Eligible Drives */}
                  <div className="bg-card rounded-2xl p-5 md:p-6 border border-border shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300 group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-11 h-11 bg-brand/10 rounded-xl flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-brand" />
                      </div>
                    </div>
                    <p className="text-3xl md:text-4xl font-black text-foreground leading-none mb-1">{drives.length}</p>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Eligible Drives</p>
                  </div>

                  {/* Stat Card: Registrations */}
                  <div className="bg-card rounded-2xl p-5 md:p-6 border border-border shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300 group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-11 h-11 bg-brand/10 rounded-xl flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-brand" />
                      </div>
                    </div>
                    <p className="text-3xl md:text-4xl font-black text-foreground leading-none mb-1">{registrations.length}</p>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Applied</p>
                  </div>

                  {/* Stat Card: Memories */}
                  <div className="bg-card rounded-2xl p-5 md:p-6 border border-border shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300 group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-11 h-11 bg-brand/10 rounded-xl flex items-center justify-center">
                        <Camera className="w-5 h-5 text-brand" />
                      </div>
                    </div>
                    <p className="text-3xl md:text-4xl font-black text-foreground leading-none mb-1">{memories.length}</p>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Memories</p>
                  </div>

                  {/* Stat Card: Attended */}
                  <div className="bg-card rounded-2xl p-5 md:p-6 border border-border shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300 group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-11 h-11 bg-brand/10 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-brand" />
                      </div>
                    </div>
                    <p className="text-3xl md:text-4xl font-black text-brand leading-none mb-1">{registrations.filter((r: any) => r.attended).length}</p>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Attended</p>
                  </div>
                </section>
              )}

              {/* Upcoming Drives */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-brand/10 rounded-full">
                      <CalendarDays className="w-5 h-5 text-brand" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground">Upcoming Drives</h2>
                      <p className="text-xs text-muted-foreground mt-0.5">Browse open positions</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold bg-brand/10 text-brand px-3 py-1.5 rounded-full">{drives.length} Available</span>
                </div>

                {drives.length === 0 ? (
                  <div className="bg-linear-to-br from-muted/30 to-muted/10 rounded-[2rem] border-2 border-dashed border-border p-12 text-center space-y-4 group hover:border-brand/30 transition-colors">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full group-hover:bg-brand/10 transition-colors">
                      <Briefcase className="w-8 h-8 text-muted-foreground group-hover:text-brand transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1">No Eligible Drives Yet</h3>
                      <p className="text-sm text-muted-foreground">Come back soon for new placement opportunities</p>
                    </div>
                    <button
                      onClick={() => { setLoading(true); fetchDashboard(); }}
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-brand/10 text-brand rounded-xl font-bold text-sm hover:bg-brand/20 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" /> Check Again
                    </button>
                  </div>
                ) : (
                  <>
                    {/* MOBILE VIEW: Grid of Cards */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                      {drives.map((drive: any) => {
                        const { actionElement } = getEligibilityData(drive, student);
                        return (
                          <div key={drive.id} className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-brand/30 transition-all space-y-4 group">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-brand/20 transition-colors">
                                  <Building2 className="w-5 h-5 text-brand" />
                                </div>
                                <div className="min-w-0">
                                  <h3 className="font-bold text-foreground leading-tight truncate">{drive.companyName}</h3>
                                  <p className="text-xs text-muted-foreground truncate">{drive.roleName}</p>
                                </div>
                              </div>
                              <span className={`text-xs px-2.5 py-1 rounded-full font-bold whitespace-nowrap ml-2 ${drive.driveType === "Open" ? "bg-green-500/15 text-green-700" : "bg-blue-500/15 text-blue-700"}`}>
                                {drive.driveType}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 py-3 border-y border-border/50">
                              <div>
                                <p className="text-xs uppercase font-black text-muted-foreground tracking-wider mb-1">CTC</p>
                                <p className="text-sm font-bold text-foreground">{drive.ctc}</p>
                              </div>
                              <div>
                                <p className="text-xs uppercase font-black text-muted-foreground tracking-wider mb-1">Date</p>
                                <p className="text-sm font-bold text-foreground">{new Date(drive.driveDate).toLocaleDateString('en-IN', {month: 'short', day: 'numeric'})}</p>
                              </div>
                            </div>

                            <div className="flex justify-end">
                              {actionElement}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* DESKTOP VIEW: Professional Table */}
                    <div className="hidden md:block bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-linear-to-r from-muted/50 to-muted/30 border-b border-border">
                            <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Company</th>
                            <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Position</th>
                            <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">CTC</th>
                            <th className="text-center px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Drive Date</th>
                            <th className="text-center px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Type</th>
                            <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                          {drives.map((drive: any) => {
                            const { actionElement } = getEligibilityData(drive, student);
                            return (
                              <tr key={drive.id} className="hover:bg-muted/20 transition-colors group">
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-brand/20 transition-colors">
                                      <Building2 className="w-5 h-5 text-brand" />
                                    </div>
                                    <span className="font-bold text-foreground">{drive.companyName}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="text-muted-foreground font-medium">{drive.roleName}</span>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="font-bold text-foreground">{drive.ctc}</span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                  <span className="text-muted-foreground font-medium">{new Date(drive.driveDate).toLocaleDateString('en-IN')}</span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${drive.driveType === "Open" ? "bg-green-500/15 text-green-700" : "bg-blue-500/15 text-blue-700"}`}>
                                    {drive.driveType}
                                  </span>
                                </td>
                                <td className="px-6 py-4 flex justify-end">
                                  {actionElement}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </section>

              {/* My Registrations */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-brand/10 rounded-full">
                      <FileText className="w-5 h-5 text-brand" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground">My Applications</h2>
                      <p className="text-xs text-muted-foreground mt-0.5">Track your drive participation</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold bg-brand/10 text-brand px-3 py-1.5 rounded-full">{registrations.length} Applied</span>
                </div>

                {registrations.length === 0 ? (
                  <div className="bg-linear-to-br from-muted/30 to-muted/10 rounded-[2rem] border-2 border-dashed border-border p-12 text-center space-y-4 group hover:border-brand/30 transition-colors">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full group-hover:bg-brand/10 transition-colors">
                      <Briefcase className="w-8 h-8 text-muted-foreground group-hover:text-brand transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1">No Applications Yet</h3>
                      <p className="text-sm text-muted-foreground">Start applying to drives from the list above</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* MOBILE VIEW: Cards */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                      {registrations.map((reg: any) => (
                        <div key={reg.id} className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-brand/30 transition-all space-y-4 group">
                          <div className="flex justify-between items-start gap-3">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-bold text-foreground leading-tight truncate">{reg.drive?.companyName}</h3>
                              <p className="text-xs text-muted-foreground truncate">{reg.drive?.roleName}</p>
                            </div>
                            <span className={`text-xs px-2.5 py-1 rounded-full font-bold whitespace-nowrap ${reg.drive?.status === "active" ? "bg-green-500/15 text-green-700" : reg.drive?.status === "completed" ? "bg-blue-500/15 text-blue-700" : "bg-muted text-muted-foreground"}`}>
                              {reg.drive?.status}
                            </span>
                          </div>

                          <div className="flex items-center justify-between py-3 border-y border-border/50">
                            <div className="space-y-1">
                              <p className="text-xs uppercase font-black text-muted-foreground tracking-wider">Status</p>
                              <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold tracking-wider ${reg.status === "Selected" ? "bg-green-500/15 text-green-700" :
                                reg.status === "Rejected" ? "bg-red-500/15 text-red-600" :
                                  reg.status === "Shortlisted" ? "bg-yellow-500/15 text-yellow-700" :
                                    "bg-muted text-muted-foreground"
                                }`}>
                                {reg.status || "Applied"}
                              </span>
                            </div>
                            <div className="text-right space-y-1">
                              <p className="text-xs uppercase font-black text-muted-foreground tracking-wider">Attendance</p>
                              {reg.attended ? (
                                <span className="text-green-600 text-xs font-bold flex items-center justify-end gap-1.5">
                                  <CheckCircle className="w-3.5 h-3.5" /> Present
                                </span>
                              ) : (
                                <span className="text-muted-foreground text-xs font-bold flex items-center justify-end gap-1.5">
                                  <Clock className="w-3.5 h-3.5" /> Upcoming
                                </span>
                              )}
                            </div>
                          </div>

                          <p className="text-xs text-muted-foreground">
                            📅 {reg.drive?.driveDate ? new Date(reg.drive.driveDate).toLocaleDateString('en-IN') : "—"}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* DESKTOP VIEW: Professional Table */}
                    <div className="hidden md:block bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-linear-to-r from-muted/50 to-muted/30 border-b border-border">
                              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Company & Role</th>
                              <th className="text-center px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Drive Date</th>
                              <th className="text-center px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Application Status</th>
                              <th className="text-center px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Drive Status</th>
                              <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Attendance</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/40">
                            {registrations.map((reg: any) => (
                              <tr key={reg.id} className="hover:bg-muted/20 transition-colors group">
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3 group">
                                    <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-brand/20 transition-colors">
                                      <Briefcase className="w-5 h-5 text-brand" />
                                    </div>
                                    <div className="min-w-0">
                                      <p className="font-bold text-foreground">{reg.drive?.companyName}</p>
                                      <p className="text-xs text-muted-foreground truncate">{reg.drive?.roleName}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                  <span className="text-muted-foreground font-medium text-sm">
                                    {reg.drive?.driveDate ? new Date(reg.drive.driveDate).toLocaleDateString('en-IN') : "—"}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                  <span className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-bold ${reg.status === "Selected" ? "bg-green-500/15 text-green-700" :
                                    reg.status === "Rejected" ? "bg-red-500/15 text-red-600" :
                                      reg.status === "Shortlisted" ? "bg-yellow-500/15 text-yellow-700" :
                                        "bg-muted text-muted-foreground"
                                    }`}>
                                    {reg.status || "Applied"}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                  <span className={`text-xs px-3 py-1.5 rounded-lg font-bold ${reg.drive?.status === "active" ? "bg-green-500/15 text-green-700" :
                                    reg.drive?.status === "completed" ? "bg-blue-500/15 text-blue-700" :
                                      "bg-muted text-muted-foreground"
                                    }`}>
                                    {reg.drive?.status || "Unknown"}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  {reg.attended ? (
                                    <span className="text-green-600 font-bold inline-flex items-center gap-1.5">
                                      <CheckCircle className="w-4 h-4" /> Present
                                    </span>
                                  ) : (
                                    <span className="text-muted-foreground font-bold inline-flex items-center gap-1.5">
                                      <Clock className="w-4 h-4" /> Upcoming
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
                          <h3 className="text-sm font-bold text-foreground truncate max-w-37.5">
                            {drive.companyName}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {drive.roleName} • {new Date(drive.driveDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          {drive.isRegistered ? (
                            <span className="bg-brand/10 text-brand text-xs px-2 py-0.5 rounded-full font-bold">
                              Registered
                            </span>
                          ) : (
                            <span className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full font-bold">
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
                          <tr className="bg-muted/50 border-b border-border text-xs font-bold uppercase tracking-wider text-muted-foreground">
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
                                  <span className="bg-brand/10 text-brand text-xs px-2 py-0.5 rounded-full font-bold">
                                    Registered
                                  </span>
                                ) : (
                                  <span className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full font-bold">
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
              {/* Memories Section */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <Camera className="w-5 h-5 text-brand" />
                    My Memories
                  </h2>
                  <label className="flex items-center gap-2 px-4 py-2 bg-brand/10 text-brand rounded-xl text-xs font-bold hover:bg-brand/20 transition-all cursor-pointer">
                    {memUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {memUploading ? "Uploading..." : "Upload Memory"}
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleMemoryUpload} disabled={memUploading} />
                  </label>
                </div>
                {memories.length === 0 ? (
                  <div className="bg-card rounded-2xl border border-border p-8 text-center text-muted-foreground">
                    <Camera className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No memories uploaded yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {memories.map((m: any) => (
                      <div key={m.id} className="bg-card rounded-2xl border border-border overflow-hidden">
                        <div className="aspect-square bg-muted flex items-center justify-center object-top">
                          <img src={m.imageUrl} alt="Memory" loading="lazy" className="w-full h-full object-cover" />
                          
                        </div>
                        <div className="p-3 flex items-center justify-between">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${m.status === "approved" ? "bg-green-500/10 text-green-600"
                            : m.status === "rejected" ? "bg-red-500/10 text-red-500"
                              : "bg-yellow-500/10 text-yellow-600"
                            }`}>{m.status === "pending_moderation" ? "Pending" : m.status}</span>
                            <Trash2 className="text-red-500 cursor-pointer size-6" onClick={() => handleDeleteMemory(m.id)} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Feedback Modal */}
              {showFeedbackModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                  <div className="absolute inset-0 bg-background/60 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setShowFeedbackModal(false)} />
                  <div className="relative w-full max-w-2xl animate-in zoom-in-95 duration-300">
                    <FeedbackComp onClose={() => setShowFeedbackModal(false)} />
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div >

      <Footer />
    </>
  );
}

