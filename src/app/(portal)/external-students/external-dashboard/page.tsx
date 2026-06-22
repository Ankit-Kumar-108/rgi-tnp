"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  Briefcase,
  CheckCircle,
  Clock,
  Building2,
  AlertTriangle,
  XCircle,
  CalendarDays,
  FileText,
  Loader2,
  LogOut,
  RefreshCw,
  ChevronRight,
  MessageSquareShare,
  GraduationCap,
} from "lucide-react";
import Nav from "@/components/layout/nav/nav";
import Footer from "@/components/layout/footer/footer";
import { useAuth } from "@/hooks/useAuth";
import { getToken, logout } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { PlacementDrive } from "@/types";
import { toast } from "sonner";
import { meetsCgpaCriteria } from "@/lib/cgpa-utils";
import ExternalDashboardHeader from "@/components/external-student/dashboard/ExternalDashboardHeader";
import ExternalProfileCompletionForm from "@/components/external-student/dashboard/ExternalProfileCompletionForm";
import ExternalDashboardOverview from "@/components/external-student/dashboard/ExternalDashboardOverview";
import NotificationBell from "@/components/ui/NotificationBell";

// Lazy load heavy modal components — only loaded when user interacts
const JobDetailsModal = dynamic(
  () => import("@/components/forms/studentApplyModal/modal"),
  { ssr: false }
);
const FeedbackComp = dynamic(
  () => import("@/app/(portal)/students/feedback/feedbakComp"),
  { ssr: false }
);

export default function ExternalStudentDashboard() {
  const router = useRouter();
  const { loading: authLoading, authenticated, user } = useAuth("external_student", "/external-students/login");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Feedback Modal
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // Complete Profile Form
  const [showProfileForm, setShowProfileForm] = useState(false);
  useEffect(() => {
    if (!authenticated) return;
    fetchDashboard();
  }, [authenticated]);

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    logout("external_student");
    toast.success("Logged out successfully!");
    router.push("/");
  };

  const getEligibilityData = (drive: any, student: any) => {
    let reason = "";
    if (drive.course !== "All" && !drive.course?.includes(student?.course)) reason = "Course Ineligible";
    else if (!drive.eligibleBranches?.includes(student?.branch)) reason = "Branch Ineligible";
    else if (!meetsCgpaCriteria(student?.cgpa, drive.minCGPA)) reason = "CGPA too low";
    else if (student?.batch && drive.minBatch && drive.maxBatch) {
      const sBatch = parseInt(student.batch.split('-').pop(), 10);
      const minB = parseInt(drive.minBatch.split('-').pop(), 10);
      const maxB = parseInt(drive.maxBatch.split('-').pop(), 10);
      if (sBatch < minB || sBatch > maxB) reason = "Batch Ineligible";
    }

    const hasRegistered = drive.isRegistered || registrations.some((r: any) => r.driveId === drive.id);

    if (hasRegistered) {
      return {
        actionElement: (
          <button
            onClick={() => { setSelectedDrive(drive); setIsModalOpen(true); }}
            className="inline-flex items-center gap-1.5 text-green-600 bg-green-500/10 hover:bg-green-500/20 px-4 py-2.5 rounded-lg text-xs font-bold transition-all"
          >
            <CheckCircle className="w-4 h-4" /> View Details
          </button>
        )
      };
    }

    if (reason) {
      return {
        actionElement: (
          <button
            onClick={() => { setSelectedDrive(drive); setIsModalOpen(true); }}
            className="inline-flex items-center gap-1.5 text-red-600 bg-red-500/10 hover:bg-red-500/20 px-4 py-2.5 rounded-lg text-xs font-bold transition-all"
          >
            <span>Ineligible</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )
      };
    }

    return {
      actionElement: (
        <button
          onClick={() => { setSelectedDrive(drive); setIsModalOpen(true); }}
          className="bg-brand text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-brand/90 transition-all"
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
      }
      else setFetchError(d.message || "Failed to load dashboard");
    } catch (err) {
      console.error(err);
      setFetchError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const [selectedDrive, setSelectedDrive] = useState<PlacementDrive | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (authLoading || !authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    );
  }

  const student = data?.student;
  const isProfileIncomplete = student && (!student.tenthPercentage || !student.cgpa || !student.resumeUrl);
  const drives = data?.drives || [];
  const archivedDrives = data?.archivedDrives || [];
  const registrations = data?.registrations || [];

  return (
    <>
      <Nav />
      {selectedDrive && (() => {
        let reason = "";
        if (selectedDrive.course !== "All" && !selectedDrive.course?.includes(student?.course)) reason = "Course Ineligible";
        else if (!selectedDrive.eligibleBranches?.includes(student?.branch)) reason = "Branch Ineligible";
        else if (!meetsCgpaCriteria(student?.cgpa, selectedDrive.minCGPA)) reason = "CGPA too low";
        else if (student?.batch && selectedDrive.minBatch && selectedDrive.maxBatch) {
          const sBatch = parseInt(student.batch.split('-').pop() || "0", 10);
          const minB = parseInt(selectedDrive.minBatch.split('-').pop() || "0", 10);
          const maxB = parseInt(selectedDrive.maxBatch.split('-').pop() || "0", 10);
          if (sBatch < minB || sBatch > maxB) reason = "Batch Ineligible";
        }
        const isEligible = !reason;
        return (
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
            isRegistered={registrations.some((r: any) => r.driveId === selectedDrive.id)}
            isEligible={isEligible}
            ineligibilityReason={reason}
          />
        );
      })()}

      <div className="bg-background text-foreground antialiased font-sans min-h-screen mt-15 overflow-hidden">
        <div className="fixed bottom-0 right-0 w-96 h-96 bg-brand/5 rounded-full blur-[120px] -z-10" />

        <main className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">

          {/* Header for desktop */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-bold uppercase tracking-widest mb-0">
            <GraduationCap className="w-4 h-4" /> External Student
          </div>
          <div className="hidden md:flex">
            <ExternalDashboardHeader 
              student={student}
              fetchDashboard={fetchDashboard}
              showProfileForm={showProfileForm}
              setShowProfileForm={setShowProfileForm}
              isProfileIncomplete={isProfileIncomplete || false}
              setShowFeedbackModal={setShowFeedbackModal}
              handleLogout={handleLogout}
            />
          </div>

          {/* Notification bell as its own pill row */}
        <div className="md:hidden w-full mt-3 flex justify-end items-center">
          <NotificationBell role="external_student" />
        </div>

          {/* Complete Profile Form (Collapsible) */}
          <div className="hidden md:block">
            <ExternalProfileCompletionForm 
              student={student}
              showProfileForm={showProfileForm}
              setShowProfileForm={setShowProfileForm}
              fetchDashboard={fetchDashboard}
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-brand" />
            </div>
          ) : fetchError ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <p className="text-destructive font-bold text-lg">{fetchError}</p>
              <button
                onClick={() => { setLoading(true); fetchDashboard(); }}
                className="flex items-center gap-2 px-6 py-3 bg-brand text-primary-foreground rounded-lg font-bold text-sm hover:bg-brand/90 transition-all"
              >
                <RefreshCw className="w-4 h-4" /> Retry
              </button>
            </div>
          ) : (
            <>
              <ExternalDashboardOverview
                student={student}
                drivesLength={drives.length}
                registrationsLength={registrations.length}
                loading={loading}
                fetchDashboard={fetchDashboard}
                showProfileForm={showProfileForm}
                setShowProfileForm={setShowProfileForm}
                isProfileIncomplete={isProfileIncomplete || false}
                setShowFeedbackModal={setShowFeedbackModal}
                handleLogout={handleLogout}
              />

              {/* Email Verification Banner (Conditional) */}
              {!student?.isVerified && (
                <section className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-5 flex items-center gap-4">
                  <AlertTriangle className="w-8 h-8 text-yellow-500 shrink-0" />
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
                  <div className="bg-card rounded-lg border border-border p-8 text-center text-muted-foreground">
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
                          <div key={drive.id} className="bg-card border border-border rounded-lg p-5 shadow-sm space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-brand/10 rounded-lg flex items-center justify-center shrink-0">
                                  <Building2 className="w-5 h-5 text-brand" />
                                </div>
                                <div>
                                  <h3 className="font-bold text-foreground leading-tight">{drive.companyName}</h3>
                                  <p className="text-xs text-muted-foreground">{drive.roleName}</p>
                                </div>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded-full font-bold ${drive.driveType === "Open" ? "bg-green-500/10 text-green-600" : "bg-blue-500/10 text-blue-600"}`}>
                                {drive.driveType}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 py-2 border-y border-border/50">
                              <div>
                                <p className="text-xs uppercase font-black text-muted-foreground tracking-widest">CTC</p>
                                <p className="text-sm font-bold text-foreground">{drive.ctc}</p>
                              </div>
                              <div>
                                <p className="text-xs uppercase font-black text-muted-foreground tracking-widest">Date</p>
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
                    <div className="hidden md:block bg-card rounded-lg border border-border shadow-sm overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50 border-b border-border">
                          <tr className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
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
                                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${drive.driveType === "Open" ? "bg-green-500/10 text-green-600" : "bg-blue-500/10 text-blue-600"}`}>
                                    {drive.driveType}
                                  </span>
                                </td>
                                <td className="px-5 py-3.5 flex justify-end">
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

              {/* My Registrations History */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-brand" />
                  My Registrations
                </h2>

                {registrations.length === 0 ? (
                  <div className="bg-card rounded-lg border border-border p-8 text-center text-muted-foreground">
                    <p className="font-medium">No registrations yet</p>
                    <p className="text-xs mt-1">Register for a drive from the list above</p>
                  </div>
                ) : (
                  <>
                    {/* MOBILE VIEW: Cards */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                      {registrations.map((reg: any) => (
                        <div key={reg.id} className="bg-card border border-border rounded-lg p-5 shadow-sm space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-foreground leading-tight">{reg.drive?.companyName}</h3>
                              <p className="text-xs text-muted-foreground">{reg.drive?.roleName}</p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full font-bold capitalize ${reg.drive?.status === "active" ? "bg-green-500/10 text-green-600" :
                              reg.drive?.status === "completed" ? "bg-blue-500/10 text-blue-600" :
                                "bg-muted text-muted-foreground"
                              }`}>
                              {reg.drive?.status}
                            </span>
                          </div>

                          <div className="flex items-center justify-between py-3 border-y border-border/50">
                            <div className="space-y-1">
                              <p className="text-xs uppercase font-black text-muted-foreground tracking-widest">Action Status</p>
                              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold tracking-wider ${reg.status === "Selected" ? "bg-green-500/10 text-green-600" :
                                reg.status === "Rejected" ? "bg-red-500/10 text-red-500" :
                                  reg.status === "Shortlisted" ? "bg-yellow-500/10 text-yellow-600" :
                                    "bg-muted text-muted-foreground"
                                }`}>
                                {reg.status || "Applied"}
                              </span>
                            </div>
                            <div className="text-right space-y-1">
                              <p className="text-xs uppercase font-black text-muted-foreground tracking-widest">Attendance</p>
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

                          <p className="text-xs text-muted-foreground italic">
                            Drive Date: {reg.drive?.driveDate ? new Date(reg.drive.driveDate).toLocaleDateString() : "-"}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* DESKTOP VIEW: Table */}
                    <div className="hidden md:block bg-card rounded-lg border border-border shadow-sm overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                          <thead>
                            <tr className="bg-muted/50 border-b border-border text-xs font-bold uppercase tracking-wider text-muted-foreground">
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
                                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold tracking-wider ${reg.status === "Selected" ? "bg-green-500/10 text-green-600" :
                                    reg.status === "Rejected" ? "bg-red-500/10 text-red-500" :
                                      reg.status === "Shortlisted" ? "bg-yellow-500/10 text-yellow-600" :
                                        "bg-muted text-muted-foreground"
                                    }`}>
                                    {reg.status || "Applied"}
                                  </span>
                                </td>
                                <td className="px-5 py-3.5">
                                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold capitalize ${reg.drive?.status === "active" ? "bg-green-500/10 text-green-600" :
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
                      <div key={drive.id} className="bg-card/50 border border-border rounded-lg p-4 flex justify-between items-center">
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
                  <div className="hidden md:block bg-card rounded-lg border border-border shadow-sm overflow-hidden">
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

              <button
                onClick={() => setShowFeedbackModal(true)}
                className="mt-8 flex items-center gap-2 text-sm font-medium text-brand hover:underline"
              >
                <MessageSquareShare className="w-4 h-4" />
                Share Feedback
              </button>

              {/* Feedback Modal */}
              {showFeedbackModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowFeedbackModal(false)} />
                  <div className="relative w-full max-w-2xl animate-in zoom-in-95 duration-300">
                    <FeedbackComp onClose={() => setShowFeedbackModal(false)} />
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}
