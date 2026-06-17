import React, { useState } from "react";
import { AlertTriangle, ChevronRight, FileText, Loader2, X } from "lucide-react";
import { getToken } from "@/lib/auth-client";

interface ExternalProfileCompletionFormProps {
  student: any;
  showProfileForm: boolean;
  setShowProfileForm: (val: boolean) => void;
  fetchDashboard: () => void;
}

export default function ExternalProfileCompletionForm({
  student,
  showProfileForm,
  setShowProfileForm,
  fetchDashboard,
}: ExternalProfileCompletionFormProps) {
  const isProfileIncomplete = student && (!student.tenthPercentage || !student.cgpa || !student.resumeUrl);

  const [submittingProfile, setSubmittingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ msg: string; ok: boolean } | null>(null);
  const [profileForm, setProfileForm] = useState({
    tenthPercentage: student?.tenthPercentage || "",
    cgpa: student?.cgpa || "",
    twelfthPercentage: student?.twelfthPercentage || "",
    activeBacklog: student?.activeBacklog || "0",
    linkedinUrl: student?.linkedinUrl || "",
    githubUrl: student?.githubUrl || "",
  });

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingProfile(true);
    setProfileMsg(null);
    try {
      const token = getToken("external_student");
      const res = await fetch("/api/external/update-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ profileImageUrl: student?.profileImageUrl, ...profileForm }),
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

  return (
    <>
      {/* Complete Profile Prompt */}
      {isProfileIncomplete && !showProfileForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl rounded-xl border border-border bg-card/95 shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300">
            <div className="p-6 md:p-7">
              <div className="flex items-start gap-4">
                <div className="shrink-0 rounded-lg bg-brand/10 text-brand p-3">
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
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand text-primary-foreground px-5 py-2.5 text-sm font-bold hover:bg-brand/90 transition-colors"
                >
                  Complete Profile
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Complete Profile Form (Collapsible) */}
      {showProfileForm && (
        <section className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm p-4 ">
          <div className="w-full max-w-2xl rounded-lg border border-border bg-card/95 shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300 p-5">
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2"><div className="p-2 bg-brand/10 rounded-lg text-brand"><FileText className="w-5 h-5" /></div>
            Academic Details</div>
            <div className="cursor-pointer p-1 hover:bg-red-600/20 rounded-full" onClick={()=>setShowProfileForm(false)}><X className="w-5 h-5" /></div>
          </h2>
          <form onSubmit={handleSubmitProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">10th Percentage</label>
                <input type="number" step="0.01" min="10" max="100"
                  required
                  value={profileForm.tenthPercentage} onChange={(e) => setProfileForm({ ...profileForm, tenthPercentage: e.target.value })}
                  className="w-full bg-muted px-5 py-3.5 rounded-lg border-none focus:ring-2 focus:ring-brand transition-all text-sm outline-none text-foreground"
                  placeholder="e.g. 85.50" />
              </div>
              {student?.course === "Diploma" ? null : (
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">12th Percentage/ Diploma</label>
                  <input type="number" step="0.01" min="0" max="100"
                    value={profileForm.twelfthPercentage} onChange={(e) => setProfileForm({ ...profileForm, twelfthPercentage: e.target.value })}
                    className="w-full bg-muted px-5 py-3.5 rounded-lg border-none focus:ring-2 focus:ring-brand transition-all text-sm outline-none text-foreground"
                    placeholder="e.g. 78.30" />
                </div>
              )}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Graduation CGPA (Out of 10)</label>
                <input type="number" step="0.01" min="0" max="10"
                  value={profileForm.cgpa} onChange={(e) => setProfileForm({ ...profileForm, cgpa: e.target.value })}
                  className="w-full bg-muted px-5 py-3.5 rounded-lg border-none focus:ring-2 focus:ring-brand transition-all text-sm outline-none text-foreground"
                  placeholder="e.g. 8.25" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Active Backlogs</label>
                <input type="number" min="0"
                  required
                  value={profileForm.activeBacklog} onChange={(e) => setProfileForm({ ...profileForm, activeBacklog: e.target.value })}
                  className="w-full bg-muted px-5 py-3.5 rounded-lg border-none focus:ring-2 focus:ring-brand transition-all text-sm outline-none text-foreground"
                  placeholder="0" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">LinkedIn Profile</label>
                <input type="url"
                  value={profileForm.linkedinUrl} onChange={(e) => setProfileForm({ ...profileForm, linkedinUrl: e.target.value })}
                  className="w-full bg-muted px-5 py-3.5 rounded-lg border-none focus:ring-2 focus:ring-brand transition-all text-sm outline-none text-foreground"
                  placeholder="https://linkedin.com/in/..." />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">GitHub Profile</label>
                <input type="url"
                  value={profileForm.githubUrl} onChange={(e) => setProfileForm({ ...profileForm, githubUrl: e.target.value })}
                  className="w-full bg-muted px-5 py-3.5 rounded-lg border-none focus:ring-2 focus:ring-brand transition-all text-sm outline-none text-foreground"
                  placeholder="https://github.com/..." />
              </div>
            </div>

            {profileMsg && (
              <div className={`p-4 rounded-lg text-sm font-bold flex items-center gap-2 ${profileMsg.ok ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"}`}>
                <AlertTriangle className="w-4 h-4" />
                {profileMsg.msg}
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-border gap-2">
              <button onClick={() => setShowProfileForm(false)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand text-primary-foreground px-5 py-2.5 text-sm font-bold hover:bg-brand/90 transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingProfile}
                className="bg-brand text-primary-foreground px-8 py-3.5 rounded-lg font-bold hover:bg-brand/90 transition-all flex items-center gap-2 disabled:opacity-50 shadow-[var(--shadow-brand)]"
              >
                {submittingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
                {submittingProfile ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
          </div>
        </section>
      )}
    </>
  );
}
