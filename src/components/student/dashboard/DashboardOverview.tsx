import React, { useRef, useState } from "react";
import { BadgeCheck, BadgeAlert, Briefcase, CheckCircle, Camera, FileText, Loader2, Upload } from "lucide-react";
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
    </>
  );
}
