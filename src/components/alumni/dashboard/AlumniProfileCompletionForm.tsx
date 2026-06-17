import React, { useState } from "react";
import {
  Loader2,
  CheckCircle,
  BadgeAlert,
  GraduationCap,
  Briefcase,
  TrendingUp,
  Linkedin,
  MapPin,
  Phone,
  X
} from "lucide-react";
import { getToken } from "@/lib/auth-client";
import { toast } from "sonner";

interface AlumniProfileCompletionFormProps {
  alumni: any;
  showProfileForm: boolean;
  setShowProfileForm: (val: boolean) => void;
  fetchDashboard: () => void;
}

export default function AlumniProfileCompletionForm({
  alumni,
  showProfileForm,
  setShowProfileForm,
  fetchDashboard,
}: AlumniProfileCompletionFormProps) {
  const [submittingProfile, setSubmittingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ msg: string; ok: boolean } | null>(null);

  // Initialize from alumni prop
  const [profileForm, setProfileForm] = useState({
    currentCompany: alumni?.currentCompany || "",
    jobTitle: alumni?.jobTitle || "",
    city: alumni?.city || "",
    country: alumni?.country || "",
    linkedInUrl: alumni?.linkedInUrl || "",
    phoneNumber: alumni?.phoneNumber || "",
    about: alumni?.about || "",
  });

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingProfile(true);
    setProfileMsg(null);
    try {
      const token = getToken("alumni");
      const res = await fetch("/api/alumni/update-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ profileImageUrl: alumni?.profileImageUrl, ...profileForm }),
      });
      const d = (await res.json()) as any;
      setProfileMsg({ msg: d.message, ok: d.success });
      if (d.success) {
        toast.success("Profile updated successfully!");
        fetchDashboard();
        setTimeout(() => setShowProfileForm(false), 2000);
      } else {
        toast.error(d.message || "Profile update failed.");
      }
    } catch {
      setProfileMsg({ msg: "Update failed due to a network error", ok: false });
      toast.error("Network error. Please try again.");
    } finally {
      setSubmittingProfile(false);
    }
  };

  if (!showProfileForm) return null;

  return (
    <section className="fixed top-0 w-full h-full left-0 right-0 z-60 flex items-center justify-center bg-black/45 backdrop-blur-sm p-4 ">
      <div className="max-h-[90vh] overflow-y-auto rounded-lg">
        <div className="w-full max-w-3xl rounded-lg border border-border bg-card/95 shadow-2xl  animate-in zoom-in-95 fade-in duration-300 p-5">
          <div className="relative flex w-full items-center gap-4 mb-8 pb-6 border-b border-border/50">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center justify-between gap-2 w-full">
                <div className="flex items-center gap-2"><div className="p-2 bg-brand/10 rounded-lg text-brand"><GraduationCap className="w-5 h-5" /></div>
                  Professional Profile</div>
                <div className="absolute right-0 cursor-pointer p-1 hover:bg-red-600/20 rounded-full" onClick={() => setShowProfileForm(false)}><X className="w-5 h-5" /></div>
              </h2>
              <p className="text-xs md:text-sm text-muted-foreground font-medium">Update your career details for the RGI community.</p>
            </div>
          </div>

          <form onSubmit={handleSubmitProfile} className="space-y-8">
            <div className="space-y-3 text-left">
              <label htmlFor="about" className="text-xs md:text-xs font-black uppercase tracking-widest text-brand ml-1 flex items-center gap-2">
                <div className="w-1 h-1 bg-brand rounded-full" /> Tell Us About Your Journey
              </label>
              <div className="relative group">
                <textarea
                  id="about"
                  value={profileForm.about}
                  onChange={(e) => setProfileForm({ ...profileForm, about: e.target.value })}
                  className="w-full bg-muted/50 px-6 py-5 rounded-[1.5rem] border border-transparent focus:border-brand/30 focus:bg-background transition-all text-sm outline-none text-foreground resize-none leading-relaxed shadow-sm group-hover:shadow-md"
                  placeholder="E.g. Transitioned from Frontend to Full-stack, currently leading a team at Microsoft..."
                  rows={4}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Current Company (Optional)</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-background rounded-lg border border-border group-focus-within:border-brand/50 transition-colors">
                    <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <input
                    value={profileForm.currentCompany}
                    onChange={(e) => setProfileForm({ ...profileForm, currentCompany: e.target.value })}
                    className="w-full bg-muted/50 pl-14 pr-5 py-4 rounded-2xl border border-transparent focus:border-brand/30 focus:bg-background transition-all text-sm outline-none text-foreground font-bold"
                    placeholder="e.g. Google"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Job Title (Optional)</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-background rounded-lg border border-border group-focus-within:border-brand/50 transition-colors">
                    <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <input
                    value={profileForm.jobTitle}
                    onChange={(e) => setProfileForm({ ...profileForm, jobTitle: e.target.value })}
                    className="w-full bg-muted/50 pl-14 pr-5 py-4 rounded-2xl border border-transparent focus:border-brand/30 focus:bg-background transition-all text-sm outline-none text-foreground font-bold"
                    placeholder="e.g. Software Engineer"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">LinkedIn Profile</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-[#0077b5]/10 rounded-lg border border-[#0077b5]/20">
                    <Linkedin className="w-3.5 h-3.5 text-[#0077b5]" />
                  </div>
                  <input
                    value={profileForm.linkedInUrl}
                    onChange={(e) => setProfileForm({ ...profileForm, linkedInUrl: e.target.value })}
                    className="w-full bg-muted/50 pl-14 pr-5 py-4 rounded-2xl border border-transparent focus:border-brand/30 focus:bg-background transition-all text-sm outline-none text-foreground font-bold"
                    placeholder="linkedin.com/in/yourname"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Location (Current City)</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-background rounded-lg border border-border">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <input
                    required
                    value={profileForm.city}
                    onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                    className="w-full bg-muted/50 pl-14 pr-5 py-4 rounded-2xl border border-transparent focus:border-brand/30 focus:bg-background transition-all text-sm outline-none text-foreground font-bold"
                    placeholder="e.g. Bhopal"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Country</label>
                <input
                  required
                  value={profileForm.country}
                  onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
                  className="w-full bg-muted/50 px-6 py-4 rounded-2xl border border-transparent focus:border-brand/30 focus:bg-background transition-all text-sm outline-none text-foreground font-bold"
                  placeholder="e.g. India"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Phone Number (Private)</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-background rounded-lg border border-border">
                    <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <input
                    value={profileForm.phoneNumber}
                    onChange={(e) => setProfileForm({ ...profileForm, phoneNumber: e.target.value })}
                    className="w-full bg-muted/50 pl-14 pr-5 py-4 rounded-2xl border border-transparent focus:border-brand/30 focus:bg-background transition-all text-sm outline-none text-foreground font-bold"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </div>
            </div>

            {profileMsg && (
              <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-left-2 ${profileMsg.ok ? "bg-green-500/10 text-green-600 border border-green-500/20" : "bg-destructive/10 text-destructive border border-destructive/20"}`}>
                {profileMsg.ok ? <CheckCircle className="w-4 h-4" /> : <BadgeAlert className="w-4 h-4" />}
                <p className="text-xs md:text-sm font-bold">{profileMsg.msg}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border/50">
              <button
                type="submit"
                disabled={submittingProfile}
                className="flex-1 bg-brand text-primary-foreground px-8 py-4 rounded-full font-black hover:opacity-90 transition-opacity shadow-[var(--shadow-brand)] disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {submittingProfile ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                <span className="tracking-tight uppercase text-xs md:text-sm">Save Profile changes</span>
              </button>
              <button
                type="button"
                onClick={() => setShowProfileForm(false)}
                className="bg-muted text-foreground px-8 py-4 rounded-full font-bold hover:bg-muted/80 transition-all uppercase text-xs md:text-sm tracking-widest"
              >
                Discard
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
