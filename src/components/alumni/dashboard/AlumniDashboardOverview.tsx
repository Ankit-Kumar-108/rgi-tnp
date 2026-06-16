import React from "react";
import { Camera, BadgeCheck, BadgeAlert, Linkedin, ChevronRight, Loader2 } from "lucide-react";

interface AlumniDashboardOverviewProps {
  alumni: any;
  profileUploading: boolean;
  profileImageRef: React.RefObject<HTMLInputElement | null>;
  handleProfileImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showProfileForm: boolean;
  setShowProfileForm: (val: boolean) => void;
  isProfileIncomplete: boolean;
}

export default function AlumniDashboardOverview({
  alumni,
  profileUploading,
  profileImageRef,
  handleProfileImageUpload,
  showProfileForm,
  setShowProfileForm,
  isProfileIncomplete,
}: AlumniDashboardOverviewProps) {
  return (
    <section className="w-full z-40">
      <div className="flex flex-col items-center justify-between gap-6 mt-2">
        {alumni && (
          <div className="w-full relative group">
            <div className="absolute -top-12 -left-12 w-48 h-48 md:w-64 md:h-64 bg-brand/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
            <div className="absolute top-24 -right-12 w-32 h-32 md:w-48 md:h-48 bg-foreground/5 rounded-full blur-3xl -z-10"></div>

            <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 md:p-10 lg:p-12 shadow-[var(--shadow-md)] border border-border/60 flex flex-col md:flex-row gap-8 items-center md:items-start relative overflow-hidden transition-shadow duration-300 hover:shadow-[var(--shadow-lg)]">

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
                      className="flex items-center gap-2 bg-[#0077b5] text-white hover:bg-[#0077b5]/90 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md"
                    >
                      <Linkedin className="w-4 h-4" />
                      <span className="hidden xs:inline">LinkedIn Profile</span>
                      <span className="xs:hidden">LinkedIn</span>
                    </a>
                  )}
                  
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
