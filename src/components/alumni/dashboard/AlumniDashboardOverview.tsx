import React, { useState } from "react";
import { Camera, BadgeCheck, BadgeAlert, Linkedin, ChevronRight, Loader2, User, Mail, Phone, User2, ExternalLink, Eye, X, GraduationCap, Briefcase, MapPin, FileText, Upload } from "lucide-react";

interface AlumniDashboardOverviewProps {
  alumni: any;
  profileUploading: boolean;
  profileImageRef: React.RefObject<HTMLInputElement | null>;
  handleProfileImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showProfileForm: boolean;
  setShowProfileForm: (val: boolean) => void;
  isProfileIncomplete: boolean;
  resumeUploading?: boolean;
  handleResumeUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function AlumniDashboardOverview({
  alumni,
  profileUploading,
  profileImageRef,
  handleProfileImageUpload,
  showProfileForm,
  setShowProfileForm,
  isProfileIncomplete,
  resumeUploading = false,
  handleResumeUpload,
}: AlumniDashboardOverviewProps) {
  const [showAllData, setShowAllData] = useState(false);
  return (
    <section className="w-full">
      <div className="flex flex-col items-center justify-between gap-6 mt-2">
        {alumni && (
          <div className="w-full relative group">
            <div className="absolute -top-12 -left-12 w-48 h-48 md:w-64 md:h-64 bg-brand/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
            <div className="absolute top-24 -right-12 w-32 h-32 md:w-48 md:h-48 bg-foreground/5 rounded-full blur-3xl -z-10"></div>

            <div className="bg-card/80 backdrop-blur-sm rounded-lg p-6 md:p-10 lg:p-12 shadow-[var(--shadow-md)] border border-border/60 flex flex-col md:flex-row gap-8 items-center md:items-start relative overflow-hidden transition-shadow duration-300 hover:shadow-[var(--shadow-lg)]">

              <div className="absolute top-0 right-0 w-24 h-24 md:w-40 md:h-40 bg-gradient-to-bl from-brand/10 via-transparent to-transparent rounded-bl-[3rem] md:rounded-bl-[6rem]"></div>

              <div
                onClick={() => !profileUploading && profileImageRef.current?.click()}
                className="relative shrink-0 cursor-pointer group/avatar"
              >
                <div className="w-32 h-32 md:w-44 lg:w-52 md:h-44 lg:h-52 rounded-full p-1 md:p-2 bg-gradient-to-tr from-brand to-brand/50 transition-transform duration-500 group-hover/avatar:scale-105">
                  <div className="w-full h-full rounded-full border-[3px] md:border-[5px] border-background overflow-hidden bg-muted flex items-center justify-center relative">
                    {alumni?.profileImageUrl ? (
                      <img
                        alt="Alumni Portrait"
                        className="w-full h-full object-cover object-top"
                        src={alumni.profileImageUrl}
                      />
                    ) : (
                      <span className="text-4xl md:text-5xl font-black text-muted-foreground/40 uppercase leading-none">
                        {alumni?.name?.charAt(0)}
                      </span>
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

                <div className="absolute bottom-1 md:bottom-2 right-1 md:right-4 bg-background rounded-full shadow-md">
                  {alumni?.isVerified ? (
                    <BadgeCheck className="w-7 h-7 md:w-10 md:h-10 text-green-500" />
                  ) : (
                    <BadgeAlert className="w-7 h-7 md:w-10 md:h-10 text-destructive/80" />
                  )}
                </div>
              </div>


              <div className="flex-1 space-y-6 md:space-y-8 w-full text-center md:text-left">
                <div className="space-y-2 md:space-y-3">
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-tight">
                    {alumni?.name}
                  </h1>
                  <p className="text-sm md:text-lg font-bold text-brand uppercase tracking-widest bg-brand/5 inline-block px-4 py-1 rounded-full">
                    {alumni?.course}
                  </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-6 md:gap-y-0 md:pt-6 border-t border-border/50 pt-6">
                  <div className="px-2 md:pr-6 md:border-r border-border/50 text-left">
                    <p className="text-xs md:text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Current Role</p>
                    <p className="text-sm md:text-lg font-extrabold text-foreground leading-snug truncate">{alumni?.jobTitle || "N/A"}</p>
                  </div>
                  <div className="px-2 md:px-6 md:border-r border-border/50 text-left">
                    <p className="text-xs md:text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Company</p>
                    <p className="text-sm md:text-lg font-extrabold text-foreground leading-snug truncate">{alumni?.currentCompany || "N/A"}</p>
                  </div>
                  <div className="px-2 md:px-6 md:border-r border-border/50 text-left text-left">
                    <p className="text-xs md:text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">City</p>
                    <p className="text-sm md:text-lg font-extrabold text-foreground leading-snug truncate">{alumni?.city || "N/ A"}</p>
                  </div>
                  <div className="px-2 md:pl-6 text-left">
                    <p className="text-xs md:text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Country</p>
                    <p className="text-sm md:text-lg font-extrabold text-foreground leading-snug truncate">{alumni?.country || "N/A"}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  {alumni?.linkedInUrl && (
                    <a
                      href={alumni.linkedInUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-[#0077b5] text-white hover:bg-[#0077b5]/90 px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-md"
                    >
                      <Linkedin className="w-4 h-4" />
                      <span className="hidden xs:inline">LinkedIn Profile</span>
                      <span className="xs:hidden">LinkedIn</span>
                    </a>
                  )}
                  {alumni?.resumeUrl ? (
                    <a
                      href={alumni.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-brand/10 text-brand hover:bg-brand/20 px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-md"
                    >
                      <FileText className="w-4 h-4" /> View Resume
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-2 bg-muted text-muted-foreground px-5 py-2.5 rounded-lg font-bold text-sm shadow-sm">
                      <FileText className="w-4 h-4" /> No Resume
                    </span>
                  )}
                  <label className="inline-flex items-center gap-2 bg-muted text-foreground hover:bg-muted/80 px-5 py-2.5 rounded-lg font-bold text-sm transition-all cursor-pointer shadow-md">
                    {resumeUploading ? <Loader2 className="w-4 h-4 animate-spin text-brand" /> : <Upload className="w-4 h-4" />}
                    {resumeUploading ? "Uploading..." : "Update Resume"}
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={handleResumeUpload}
                      disabled={resumeUploading}
                    />
                  </label>
                  <button
                    onClick={() => setShowAllData(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand text-primary-foreground rounded-lg font-bold hover:bg-brand/90 transition-all text-sm cursor-pointer shadow-md"
                  >
                    <Eye className="w-4 h-4" /> Show all Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Show All Alumni Data Modal */}
      {showAllData && (
        <div className="fixed w-full h-full top-0 left-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl rounded-lg border border-border bg-card/95 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[85vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-border flex items-center justify-between bg-linear-to-r from-brand/5 to-transparent shrink-0">
              <div>
                <h2 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2">
                  <User className="w-5 h-5 text-brand" /> Alumni Profile Details
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Enrollment No: <span className="font-bold text-foreground">{alumni?.enrollmentNumber}</span>
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
              
              {/* Professional details */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-brand">Professional Profile</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-muted/40 p-3.5 rounded-lg border border-border/30">
                    <span className="block text-[10px] uppercase font-bold text-muted-foreground">Company</span>
                    <span className="text-sm font-bold text-foreground leading-tight block">{alumni?.currentCompany || "N/A"}</span>
                  </div>
                  <div className="bg-muted/40 p-3.5 rounded-lg border border-border/30">
                    <span className="block text-[10px] uppercase font-bold text-muted-foreground">Job Title</span>
                    <span className="text-sm font-bold text-foreground leading-tight block">{alumni?.jobTitle || "N/A"}</span>
                  </div>
                  <div className="bg-muted/40 p-3.5 rounded-lg border border-border/30">
                    <span className="block text-[10px] uppercase font-bold text-muted-foreground">City</span>
                    <span className="text-sm font-bold text-foreground block">{alumni?.city || "N/A"}</span>
                  </div>
                  <div className="bg-muted/40 p-3.5 rounded-lg border border-border/30">
                    <span className="block text-[10px] uppercase font-bold text-muted-foreground">Country</span>
                    <span className="text-sm font-bold text-foreground block">{alumni?.country || "N/A"}</span>
                  </div>
                </div>
                {alumni?.about && (
                  <div className="bg-muted/40 p-3.5 rounded-lg border border-border/30">
                    <span className="block text-[10px] uppercase font-bold text-muted-foreground mb-1">About / Bio</span>
                    <span className="text-xs text-foreground leading-relaxed block">{alumni.about}</span>
                  </div>
                )}
              </div>

              {/* Academic Details Section */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-brand">Academic Records</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="bg-muted/40 p-3.5 rounded-lg border border-border/30">
                    <span className="block text-[10px] uppercase font-bold text-muted-foreground">Course</span>
                    <span className="text-sm font-bold text-foreground">{alumni?.course || "N/A"}</span>
                  </div>
                  <div className="bg-muted/40 p-3.5 rounded-lg border border-border/30">
                    <span className="block text-[10px] uppercase font-bold text-muted-foreground">Branch</span>
                    <span className="text-sm font-bold text-foreground">{alumni?.branch || "N/A"}</span>
                  </div>
                  <div className="bg-muted/40 p-3.5 rounded-lg border border-border/30">
                    <span className="block text-[10px] uppercase font-bold text-muted-foreground">Batch</span>
                    <span className="text-sm font-bold text-foreground">{alumni?.batch || "N/A"}</span>
                  </div>
                  <div className="bg-muted/40 p-3.5 rounded-lg border border-border/30">
                    <span className="block text-[10px] uppercase font-bold text-muted-foreground">CGPA</span>
                    <span className="text-sm font-bold text-brand">{alumni?.cgpa ? Number(alumni.cgpa).toFixed(2) : "N/A"}</span>
                  </div>
                  <div className="bg-muted/40 p-3.5 rounded-lg border border-border/30">
                    <span className="block text-[10px] uppercase font-bold text-muted-foreground">10th Percentage</span>
                    <span className="text-sm font-bold text-foreground">{alumni?.tenthPercentage ? `${Number(alumni.tenthPercentage).toFixed(2)}%` : "N/A"}</span>
                  </div>
                  <div className="bg-muted/40 p-3.5 rounded-lg border border-border/30">
                    <span className="block text-[10px] uppercase font-bold text-muted-foreground">12th / Diploma %</span>
                    <span className="text-sm font-bold text-foreground">{alumni?.twelfthPercentage ? `${Number(alumni.twelfthPercentage).toFixed(2)}%` : "N/A"}</span>
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
                      <span className="text-xs font-semibold text-foreground truncate block">{alumni?.personalEmail || "N/A"}</span>
                    </div>
                  </div>
                  <div className="bg-muted/40 p-3.5 rounded-lg border border-border/30 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand/10 text-brand flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-muted-foreground">Phone Number</span>
                      <span className="text-xs font-semibold text-foreground">{alumni?.phoneNumber || "N/A"}</span>
                    </div>
                  </div>
                  <div className="bg-muted/40 p-3.5 rounded-lg border border-border/30 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand/10 text-brand flex items-center justify-center shrink-0">
                      <User2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-muted-foreground">Gender</span>
                      <span className="text-xs font-semibold text-foreground capitalize">{alumni?.gender || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Links */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-brand">Professional Links</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-muted/40 p-3.5 rounded-lg border border-border/30">
                    <span className="block text-[10px] uppercase font-bold text-muted-foreground mb-1">LinkedIn</span>
                    {alumni?.linkedInUrl ? (
                      <a
                        href={alumni.linkedInUrl}
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
    </section>
  );
}
