"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { 
  Briefcase, CalendarDays, CheckCircle, ChevronRight, Loader2, 
  XCircle, AlertTriangle, Clock, RefreshCw, Building2, FileText
} from "lucide-react";
import DashboardHeader from "@/components/student/dashboard/DashboardHeader";
import ProfileCompletionForm from "@/components/student/dashboard/ProfileCompletionForm";
import DashboardOverview from "@/components/student/dashboard/DashboardOverview";
import MemoriesTab from "@/components/student/dashboard/MemoriesTab";
import Nav from "@/components/layout/nav/nav"
import Footer from "@/components/layout/footer/footer"
import FeedbackComp from "@/app/(portal)/students/feedback/feedbakComp"
import { useAuth } from "@/hooks/useAuth"
import { getToken, logout } from "@/lib/auth-client"
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useSWR from "swr";
import { fetchWithRetry } from "@/lib/fetch-utils";
import { PlacementDrive } from "@/types";

// Lazy load heavy modal components — only loaded when user interacts
const JobDetailsModal = dynamic(
  () => import("@/components/forms/studentApplyModal/modal"),
  { ssr: false }
);

/* SWR fetcher with auth */
const dashboardFetcher = async <T = any,>(url: string): Promise<T> => {
  const token = getToken("student");
  const res = await fetchWithRetry(url, {
    headers: { Authorization: `Bearer ${token}` },
    retries: 3,
    retryDelay: 1500,
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    if (res.status === 401 || res.status === 404) {
      logout("student");
      window.location.href = "/students/login";
    }
    throw new Error((errData as any)?.message || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
};

export default function StudentDashboard() {
  const { loading: authLoading, authenticated, user } = useAuth("student", "/students/login");

  /* ── SWR: Main dashboard data with caching + retry ── */
  const {
    data: dashboardData,
    error: fetchErrorObj,
    isLoading: loading,
    mutate: mutateDashboard,
  } = useSWR<{ success: boolean; student?: any; drives?: any[]; archivedDrives?: any[]; registrations?: any[]; memories?: any[]; message?: string }>(
    authenticated ? "/api/student/dashboard" : null,
    dashboardFetcher,
    {
      revalidateOnFocus: true,
      errorRetryCount: 3,
      errorRetryInterval: 2000,
      dedupingInterval: 10000,
    },
  );

  const data = dashboardData?.success ? dashboardData : null;
  const fetchError = fetchErrorObj?.message || (!dashboardData?.success && dashboardData?.message) || null;

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDrive, setSelectedDrive] = useState<PlacementDrive | null>(null)

  // Feedback Modal
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // Complete Profile Form
  const [showProfileForm, setShowProfileForm] = useState(false);

  const router = useRouter();

  // it auto updates semester
  useEffect(() => {
    const updateSemester = async () => {
      try {
        const token = getToken("student");
        const res = await fetchWithRetry("/api/student/update-semester", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          retries: 2,
        });
        const data = await res.json() as any;
        if (data.success && data.updated) {
          toast.success(`Semester updated to ${data.semester}`);
        }
      } catch (error: any) {
        console.error("Error updating semester:", error);
      }
    }
    if (authenticated) updateSemester();
  }, [authenticated])

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    logout("student");
    router.push("/");
  };

  // Convenience: re-fetch dashboard via SWR mutate
  const fetchDashboard = () => mutateDashboard();

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
      {/* Complete Profile Prompt */}
      {isProfileIncomplete && !showProfileForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl rounded-3xl border border-border bg-card/95 shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300">
            <div className="p-6 md:p-7">
              <div className="flex items-start gap-4">
                <div className="shrink-0 rounded-2xl bg-brand/10 text-brand p-3">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl md:text-2xl font-black tracking-tight text-foreground">
                    Complete Your Profile
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Please add your 10th, 12th/ Diploma, and resume details to unlock drive applications and improve your recruiter visibility. GitHub and LinkedIn are optional
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowProfileForm(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand text-primary-foreground px-5 py-2.5 text-sm font-bold hover:bg-brand/90 transition-colors"
                >
                  Complete Profile
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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

      <div className="bg-background text-foreground antialiased font-sans min-h-screen mt-15 overflow-hidden">
        <div className="fixed bottom-0 right-0 w-96 h-96 bg-brand/5 rounded-full blur-[120px] -z-10" />
        <div className="fixed top-1/2 left-0 w-64 h-64 bg-brand/5 rounded-full blur-[100px] -z-10" />

        <main className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
          {/* Header */}
          <DashboardHeader 
            showProfileForm={showProfileForm}
            setShowProfileForm={setShowProfileForm}
            isProfileIncomplete={isProfileIncomplete || false}
            setShowFeedbackModal={setShowFeedbackModal}
            handleLogout={handleLogout}
          />

          {/* Complete Profile Form (Collapsible) */}
          <ProfileCompletionForm 
            student={student}
            showProfileForm={showProfileForm}
            setShowProfileForm={setShowProfileForm}
            fetchDashboard={fetchDashboard}
          />

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-brand" />
            </div>
          ) : fetchError ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <p className="text-destructive font-bold text-lg">{fetchError}</p>
              <button
                onClick={() => { mutateDashboard(); }}
                className="flex items-center gap-2 px-6 py-3 bg-brand text-primary-foreground rounded-xl font-bold text-sm hover:bg-brand/90 transition-all"
              >
                <RefreshCw className="w-4 h-4" /> Retry
              </button>
            </div>
          ) : (
            <>
              <DashboardOverview
                student={student}
                drivesLength={drives.length}
                registrationsLength={registrations.length}
                loading={loading}
                fetchDashboard={fetchDashboard}
              />

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
                      onClick={() => { mutateDashboard(); }}
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
                                <p className="text-sm font-bold text-foreground">{new Date(drive.driveDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</p>
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
              <MemoriesTab memories={memories} fetchDashboard={fetchDashboard} />

              {/* Feedback Modal */}
              {showFeedbackModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowFeedbackModal(false)} />
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

