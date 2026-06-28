import React, { useRef, useState } from "react";
import { BadgeCheck, BadgeAlert, Briefcase, CheckCircle, Camera, FileText, Loader2, Upload, User, Mail, Phone, User2, ExternalLink, Eye, X, Building2 } from "lucide-react";
import { toast } from "sonner";
import { getToken } from "@/lib/auth-client";
import { uploadFileToR2 } from "@/lib/upload-r2";
import DashboardHeader from "./DashboardHeader";

interface DashboardOverviewProps {
  student: any;
  drivesLength: number;
  registrationsLength: number;
  loading: boolean;
  fetchDashboard: () => void;
  showProfileForm: boolean;
  setShowProfileForm: (value: boolean) => void;
  isProfileIncomplete?: boolean;
  setShowFeedbackModal: (value: boolean) => void;
  handleLogout: () => void;
  
}

export default function DashboardOverview({
  student,
  drivesLength,
  registrationsLength,
  loading,
  fetchDashboard,
  showProfileForm,
  setShowProfileForm,
  isProfileIncomplete,
  setShowFeedbackModal,
  handleLogout,
}: DashboardOverviewProps) {
  const [resumeUploading, setResumeUploading] = useState(false);
  const [profileUploading, setProfileUploading] = useState(false);
  const [showAllData, setShowAllData] = useState(false);
  const profileImageRef = useRef<HTMLInputElement>(null);

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
      const d = (await res.json()) as any;
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
      e.target.value = "";
    }
  };

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setProfileUploading(true);
      const url = await uploadFileToR2(file, "profiles", { role: "student" });
      const token = getToken("student");
      const res = await fetch("/api/student/update-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ profileImageUrl: url }),
      });
      const d = (await res.json()) as any;
      if (d.success) {
        toast.success("Profile image updated successfully!");
        fetchDashboard();
      } else {
        throw new Error(d.message);
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Profile image upload failed: " + err.message);
    } finally {
      setProfileUploading(false);
      e.target.value = "";
    }
  };

  return (
    <>
      {/* Academic Profile Card */}
      <section className="relative">
        <div className="space-y-8">
          <section className="relative">
            {/* Background Glows */}
            <div className="absolute -top-12 -left-12 size-64 bg-brand/10 rounded-full blur-3xl -z-10"></div>
            <div className="absolute top-24 -right-12 size-48 bg-foreground/5 rounded-full blur-3xl -z-10"></div>

            <div className="bg-card rounded-lg p-6 md:p-8 shadow-[var(--shadow-sm)] border border-border flex flex-col md:flex-row gap-8 md:items-center relative overflow-hidden group hover:shadow-[var(--shadow-md)] transition-shadow duration-300">
              {/* Decorative Gradient Accent */}
              <div className="absolute top-0 right-0 size-32 bg-linear-to-bl from-brand/10 to-transparent rounded-bl-[5rem]"></div>

              {/* Avatar Section */}
              <div
                onClick={() => !profileUploading && profileImageRef.current?.click()}
                className="relative shrink-0 mx-auto md:mx-0 cursor-pointer group/avatar"
              >
                <div className="w-32 h-32 md:size-48 rounded-full p-1 md:p-2 bg-linear-to-tr from-brand to-brand/40 transition-transform duration-500 group-hover/avatar:scale-105">
                  <div className="w-full h-full rounded-full border-2 md:border-4 border-background overflow-hidden bg-muted relative">
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

                    {/* Camera Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300">
                      <Camera className="w-6 h-6 mb-1 text-white animate-pulse" />
                      <span className="text-[10px] uppercase font-bold tracking-wider">Change Image</span>
                    </div>

                    {/* Loading Overlay */}
                    {profileUploading && (
                      <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-brand animate-spin" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Hidden Input */}
                <input
                  type="file"
                  ref={profileImageRef}
                  onChange={handleProfileImageUpload}
                  accept="image/*"
                  className="hidden"
                  disabled={profileUploading}
                />

                {/* Verified Badge */}
                <div className="absolute bottom-4 bg-background right-0 md:right-4 size-7 md:size-10 rounded-full flex shrink-0 items-center justify-center shadow-lg">
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
                  {student?.collegeName && (
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5 justify-center md:justify-start mt-1">
                      <Building2 className="w-4 h-4 text-brand" /> {student.collegeName}
                    </p>
                  )}
                </div>

                {/* Horizontal Grid Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-0 pt-6 border-t border-border">
                  <div className="md:pr-6 md:border-r border-border">
                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">CGPA</p>
                    <p className="text-xl md:text-2xl font-bold text-brand">{student?.cgpa ? Number(student.cgpa).toFixed(2) : "N/A"}</p>
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
                <div className="pt-6 flex flex-wrap items-center gap-3 justify-center md:justify-start">
                  {student?.resumeUrl ? (
                    <a href={student.resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-brand/10 text-brand rounded-lg font-bold hover:bg-brand/20 transition-colors text-sm">
                      <FileText className="w-4 h-4" /> View Resume
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-muted text-muted-foreground rounded-lg font-bold text-sm">
                      <FileText className="w-4 h-4" /> No Resume
                    </span>
                  )}
                  <label className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg text-sm font-bold hover:bg-muted/80 transition-all cursor-pointer">
                    {resumeUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {resumeUploading ? "Uploading..." : "Update Resume"}
                    <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleResumeUpload} disabled={resumeUploading} />
                  </label>
                  <button
                    onClick={() => setShowAllData(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand text-primary-foreground rounded-lg font-bold hover:bg-brand/90 transition-all text-sm cursor-pointer"
                  >
                    <Eye className="w-4 h-4" /> Show all Data
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Header for mobile */}
          <div className="flex md:hidden">
            <DashboardHeader 
              student={student}
              fetchDashboard={fetchDashboard}
              showProfileForm={showProfileForm}
              setShowProfileForm={setShowProfileForm}
              isProfileIncomplete={isProfileIncomplete || false}
              setShowFeedbackModal={setShowFeedbackModal}
              handleLogout={handleLogout}
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      {!loading && student && (
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {/* Stat Card: Eligible Drives */}
          <div className="bg-card rounded-lg p-5 md:p-6 border border-border shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300 group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 bg-brand/10 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-brand" />
              </div>
            </div>
            <p className="text-3xl md:text-4xl font-black text-foreground leading-none mb-1">{drivesLength}</p>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Eligible Drives</p>
          </div>

          {/* Stat Card: Registrations */}
          <div className="bg-card rounded-lg p-5 md:p-6 border border-border shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300 group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 bg-brand/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-brand" />
              </div>
            </div>
            <p className="text-3xl md:text-4xl font-black text-foreground leading-none mb-1">{registrationsLength}</p>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Applied</p>
          </div>
        </section>
      )}

      {/* Show All Student Data Modal */}
      {showAllData && (
        <div className="fixed w-full h-full top-0 left-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl rounded-lg border border-border bg-card/95 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[85vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-border flex items-center justify-between bg-linear-to-r from-brand/5 to-transparent shrink-0">
              <div>
                <h2 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2">
                  <User className="w-5 h-5 text-brand" /> Student Profile Details
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Enrollment No: <span className="font-bold text-foreground">{student?.enrollmentNumber}</span>
                </p>
              </div>
              <button
                onClick={() => setShowAllData(false)}
                className="p-1.5 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Academic Details Section */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-brand">Academic Records</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="bg-muted/40 p-3.5 rounded-lg border border-border/30">
                    <span className="block text-[10px] uppercase font-bold text-muted-foreground">College</span>
                    <span className="text-sm font-bold text-foreground leading-tight">{student?.collegeName || "N/A"}</span>
                  </div>
                  <div className="bg-muted/40 p-3.5 rounded-lg border border-border/30">
                    <span className="block text-[10px] uppercase font-bold text-muted-foreground">Course</span>
                    <span className="text-sm font-bold text-foreground">{student?.course || "N/A"}</span>
                  </div>
                  <div className="bg-muted/40 p-3.5 rounded-lg border border-border/30">
                    <span className="block text-[10px] uppercase font-bold text-muted-foreground">Branch</span>
                    <span className="text-sm font-bold text-foreground">{student?.branch || "N/A"}</span>
                  </div>
                  <div className="bg-muted/40 p-3.5 rounded-lg border border-border/30">
                    <span className="block text-[10px] uppercase font-bold text-muted-foreground">Semester</span>
                    <span className="text-sm font-bold text-foreground">{student?.semester || "N/A"}</span>
                  </div>
                  <div className="bg-muted/40 p-3.5 rounded-lg border border-border/30">
                    <span className="block text-[10px] uppercase font-bold text-muted-foreground">Batch</span>
                    <span className="text-sm font-bold text-foreground">{student?.batch || "N/A"}</span>
                  </div>
                  <div className="bg-muted/40 p-3.5 rounded-lg border border-border/30">
                    <span className="block text-[10px] uppercase font-bold text-muted-foreground">CGPA</span>
                    <span className="text-sm font-bold text-brand">{student?.cgpa ? Number(student.cgpa).toFixed(2) : "N/A"}</span>
                  </div>
                  <div className="bg-muted/40 p-3.5 rounded-lg border border-border/30">
                    <span className="block text-[10px] uppercase font-bold text-muted-foreground">10th Percentage</span>
                    <span className="text-sm font-bold text-foreground">{student?.tenthPercentage ? `${Number(student.tenthPercentage).toFixed(2)}%` : "N/A"}</span>
                  </div>
                  <div className="bg-muted/40 p-3.5 rounded-lg border border-border/30">
                    <span className="block text-[10px] uppercase font-bold text-muted-foreground">12th / Diploma %</span>
                    <span className="text-sm font-bold text-foreground">{student?.twelfthPercentage ? `${Number(student.twelfthPercentage).toFixed(2)}%` : "N/A"}</span>
                  </div>
                  <div className="bg-muted/40 p-3.5 rounded-lg border border-border/30">
                    <span className="block text-[10px] uppercase font-bold text-muted-foreground">Active Backlogs</span>
                    <span className={`text-sm font-bold ${Number(student?.activeBacklog) > 0 ? "text-red-500" : "text-foreground"}`}>
                      {student?.activeBacklog ?? "0"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Personal Details Section */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-brand">Personal Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-muted/40 p-3.5 rounded-lg border border-border/30 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand/10 text-brand flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[10px] uppercase font-bold text-muted-foreground">Email Address</span>
                      <span className="text-xs font-semibold text-foreground truncate block">{student?.email || "N/A"}</span>
                    </div>
                  </div>
                  <div className="bg-muted/40 p-3.5 rounded-lg border border-border/30 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand/10 text-brand flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-muted-foreground">Phone Number</span>
                      <span className="text-xs font-semibold text-foreground">{student?.phoneNumber || "N/A"}</span>
                    </div>
                  </div>
                  <div className="bg-muted/40 p-3.5 rounded-lg border border-border/30 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand/10 text-brand flex items-center justify-center shrink-0">
                      <User2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-muted-foreground">Gender</span>
                      <span className="text-xs font-semibold text-foreground capitalize">{student?.gender || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Links & Resume */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-brand">Professional Links</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-muted/40 p-3.5 rounded-lg border border-border/30">
                    <span className="block text-[10px] uppercase font-bold text-muted-foreground mb-1">LinkedIn</span>
                    {student?.linkedinUrl ? (
                      <a
                        href={student.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-brand hover:underline inline-flex items-center gap-1"
                      >
                        View Profile <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <span className="text-xs text-muted-foreground">Not Linked</span>
                    )}
                  </div>
                  <div className="bg-muted/40 p-3.5 rounded-lg border border-border/30">
                    <span className="block text-[10px] uppercase font-bold text-muted-foreground mb-1">GitHub</span>
                    {student?.githubUrl ? (
                      <a
                        href={student.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-brand hover:underline inline-flex items-center gap-1"
                      >
                        View Profile <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <span className="text-xs text-muted-foreground">Not Linked</span>
                    )}
                  </div>
                  <div className="bg-muted/40 p-3.5 rounded-lg border border-border/30">
                    <span className="block text-[10px] uppercase font-bold text-muted-foreground mb-1">Resume File</span>
                    {student?.resumeUrl ? (
                      <a
                        href={student.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-brand hover:underline inline-flex items-center gap-1"
                      >
                        View Resume <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <span className="text-xs text-muted-foreground">No Resume</span>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-border flex justify-end bg-muted/20 shrink-0">
              <button
                onClick={() => setShowAllData(false)}
                className="bg-brand text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-brand/90 transition-all cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
