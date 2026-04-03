"use client";

import React, { useEffect, useState } from "react";
import {
  UserPlus,
  GraduationCap,
  TrendingUp,
  Send,
  MessageSquareShare,
  Star,
  Loader2,
  ChevronRight,
  Briefcase,
  CheckCircle,
  Clock,
  XCircle,
  Linkedin,
  MapPin,
  Phone,
  LogOut,
  RefreshCw,
} from "lucide-react";
import Nav from "@/components/layout/nav/nav";
import Footer from "@/components/layout/footer/footer";
import { useAuth } from "@/hooks/useAuth";
import { getToken, logout } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AlumniDashboard() {
  const { loading: authLoading, authenticated, user } = useAuth("alumni", "/alumni/alumni-register");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const router = useRouter();

  // Referral form
  const [refForm, setRefForm] = useState({ companyName: "", position: "", description: "", applyLink: "" });
  const [submittingRef, setSubmittingRef] = useState(false);
  const [refMsg, setRefMsg] = useState<{ msg: string; ok: boolean } | null>(null);

  // Feedback form
  const [fbRating, setFbRating] = useState(0);
  const [fbContent, setFbContent] = useState("");
  const [submittingFb, setSubmittingFb] = useState(false);
  const [fbMsg, setFbMsg] = useState<{ msg: string; ok: boolean } | null>(null);

  // Profile Form
  const [profileForm, setProfileForm] = useState({
    currentCompany: "",
    jobTitle: "",
    city: "",
    linkedInUrl: "",
    phoneNumber: "",
  });
  const [submittingProfile, setSubmittingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ msg: string; ok: boolean } | null>(null);
  const [showProfileForm, setShowProfileForm] = useState(false);

  useEffect(() => {
    if (!authenticated) return;
    fetchDashboard();
  }, [authenticated]);

  const fetchDashboard = async () => {
    try {
      setFetchError(null);
      const token = getToken("alumni");
      const res = await fetch("/api/alumni/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const d = (await res.json()) as any;
      if (d.success) {
        setData(d);
        if (d.alumni) {
          setProfileForm({
            currentCompany: d.alumni.currentCompany || "",
            jobTitle: d.alumni.jobTitle || "",
            city: d.alumni.city || "",
            linkedInUrl: d.alumni.linkedInUrl || "",
            phoneNumber: d.alumni.phoneNumber || "",
          });
        }
      } else {
        setFetchError("Failed to load dashboard data.");
      }
    } catch (err) {
      console.error(err);
      setFetchError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    logout("alumni");
    router.push("/alumni/alumni-register");
  };

  const handleSubmitReferral = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingRef(true);
    setRefMsg(null);
    try {
      const token = getToken("alumni");
      const res = await fetch("/api/alumni/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(refForm),
      });
      const d = (await res.json()) as any;
      setRefMsg({ msg: d.message, ok: d.success });
      if (d.success) {
        setRefForm({ companyName: "", position: "", description: "", applyLink: "" });
        fetchDashboard();
      }
    } catch {
      setRefMsg({ msg: "Submission failed", ok: false });
    } finally {
      setSubmittingRef(false);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!fbContent || fbRating === 0) return;
    setSubmittingFb(true);
    setFbMsg(null);
    try {
      const token = getToken("alumni");
      const res = await fetch("/api/alumni/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: fbContent, rating: fbRating }),
      });
      const d = (await res.json()) as any;
      setFbMsg({ msg: d.message, ok: d.success });
      if (d.success) {
        setFbContent("");
        setFbRating(0);
      }
    } catch {
      setFbMsg({ msg: "Failed to submit", ok: false });
    } finally {
      setSubmittingFb(false);
    }
  };

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingProfile(true);
    setProfileMsg(null);
    try {
      const token = getToken("alumni");
      const res = await fetch("/api/alumni/profile", {
        method: "POST",
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published": return "bg-green-500/10 text-green-600";
      case "pending": return "bg-yellow-500/10 text-yellow-600";
      case "rejected": return "bg-red-500/10 text-red-500";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (authLoading || !authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    );
  }

  const alumni = data?.alumni;
  const referrals = data?.referrals || [];
  const stats = data?.stats || {};

  return (
    <>
      <Nav />
      <div className="bg-background text-foreground antialiased font-sans min-h-screen mt-15">
        <div className="fixed bottom-0 right-0 w-96 h-96 bg-brand/5 rounded-full blur-[120px] -z-10" />
        <div className="fixed top-1/2 left-0 w-64 h-64 bg-brand/5 rounded-full blur-[100px] -z-10" />

        <main className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
          {/* Header */}
          <section className="pt-4 md:pt-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-bold uppercase tracking-widest mb-4">
              <GraduationCap className="w-4 h-4" /> Alumni
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
              Welcome back, <span className="text-brand">{user?.name || alumni?.name || "Alumni"}</span>
            </h1>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
              {alumni && (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground text-sm font-medium">
                  {alumni.currentCompany && (
                    <span className="flex items-center gap-1.5 bg-muted/50 px-3 py-1 rounded-full border border-border">
                      <Briefcase className="w-3.5 h-3.5 text-brand" /> {alumni.jobTitle} at {alumni.currentCompany}
                    </span>
                  )}
                  {alumni.city && (
                    <span className="flex items-center gap-1.5 bg-muted/50 px-3 py-1 rounded-full border border-border">
                      <MapPin className="w-3.5 h-3.5 text-brand" /> {alumni.city}
                    </span>
                  )}
                  {alumni.linkedInUrl && (
                    <a href={alumni.linkedInUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-brand/5 text-brand hover:bg-brand/10 px-3 py-1 rounded-full border border-brand/20 transition-colors">
                      <Linkedin className="w-3.5 h-3.5" /> LinkedIn Profile
                    </a>
                  )}
                </div>
              )}
              <button
                onClick={() => setShowProfileForm(!showProfileForm)}
                className="inline-flex items-center gap-2 text-sm font-bold text-brand hover:text-brand/80 transition-colors"
              >
                {showProfileForm ? "Cancel Edit" : "Update Profile"}
                <ChevronRight className={`w-4 h-4 transition-transform ${showProfileForm ? "rotate-90" : ""}`} />
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-red-500 border border-border px-4 py-2 rounded-xl transition-all hover:border-red-500/30"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </section>

          {/* Profile Form (Collapsible) */}
          {showProfileForm && (
            <section className="bg-card rounded-[2rem] p-8 shadow-xl border-2 border-brand/20 animate-in fade-in slide-in-from-top-4 duration-300">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <div className="p-2 bg-brand/10 rounded-lg text-brand"><GraduationCap className="w-5 h-5" /></div>
                Professional Details
              </h2>
              <form onSubmit={handleSubmitProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Current Company</label>
                    <input required value={profileForm.currentCompany} onChange={(e) => setProfileForm({ ...profileForm, currentCompany: e.target.value })}
                      className="w-full bg-muted px-5 py-3.5 rounded-2xl border-none focus:ring-2 focus:ring-brand transition-all text-sm outline-none text-foreground"
                      placeholder="e.g. Microsoft" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Job Title</label>
                    <input required value={profileForm.jobTitle} onChange={(e) => setProfileForm({ ...profileForm, jobTitle: e.target.value })}
                      className="w-full bg-muted px-5 py-3.5 rounded-2xl border-none focus:ring-2 focus:ring-brand transition-all text-sm outline-none text-foreground"
                      placeholder="e.g. Senior Engineer" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">City</label>
                    <input required value={profileForm.city} onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                      className="w-full bg-muted px-5 py-3.5 rounded-2xl border-none focus:ring-2 focus:ring-brand transition-all text-sm outline-none text-foreground"
                      placeholder="e.g. Bangalore" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">LinkedIn URL</label>
                    <div className="relative">
                      <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input value={profileForm.linkedInUrl} onChange={(e) => setProfileForm({ ...profileForm, linkedInUrl: e.target.value })}
                        className="w-full bg-muted pl-11 pr-5 py-3.5 rounded-2xl border-none focus:ring-2 focus:ring-brand transition-all text-sm outline-none text-foreground"
                        placeholder="https://linkedin.com/in/..." />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input value={profileForm.phoneNumber} onChange={(e) => setProfileForm({ ...profileForm, phoneNumber: e.target.value })}
                        className="w-full bg-muted pl-11 pr-5 py-3.5 rounded-2xl border-none focus:ring-2 focus:ring-brand transition-all text-sm outline-none text-foreground"
                        placeholder="10-digit number" />
                    </div>
                  </div>
                </div>
                {profileMsg && <p className={`text-sm font-medium ${profileMsg.ok ? "text-green-600" : "text-red-500"}`}>{profileMsg.msg}</p>}
                <div className="flex gap-4">
                  <button type="submit" disabled={submittingProfile}
                    className="bg-brand text-primary-foreground px-8 py-3.5 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg shadow-brand/20 disabled:opacity-50 flex items-center gap-2"
                  >
                    {submittingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                    Save Profile changes
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

          {/* Stats */}
          {!loading && !fetchError && (
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card rounded-[2rem] p-6 shadow-sm flex items-center justify-between border border-border hover:-translate-y-1 transition-transform">
                <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Referrals</p>
                  <h3 className="text-4xl font-black text-foreground">{stats.totalReferrals || 0}</h3>
                </div>
                <div className="bg-brand/10 p-4 rounded-2xl text-brand"><UserPlus className="w-8 h-8" /></div>
              </div>
              <div className="bg-card rounded-[2rem] p-6 shadow-sm flex items-center justify-between border border-border hover:-translate-y-1 transition-transform">
                <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">Approved</p>
                  <h3 className="text-4xl font-black text-foreground">{stats.approvedReferrals || 0}</h3>
                </div>
                <div className="bg-brand/10 p-4 rounded-2xl text-brand"><Briefcase className="w-8 h-8" /></div>
              </div>
              <div className="bg-brand text-primary-foreground rounded-[2rem] p-6 shadow-xl shadow-brand/20 flex items-center justify-between hover:-translate-y-1 transition-transform">
                <div>
                  <p className="text-sm font-bold opacity-80 uppercase tracking-widest mb-1">Pending</p>
                  <h3 className="text-4xl font-black">{stats.pendingReferrals || 0}</h3>
                </div>
                <div className="bg-background/20 p-4 rounded-2xl backdrop-blur-sm"><TrendingUp className="w-8 h-8 text-primary-foreground" /></div>
              </div>
            </section>
          )}

          {/* Error State */}
          {!loading && fetchError && (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <p className="text-destructive font-bold text-lg">{fetchError}</p>
              <button
                onClick={() => { setLoading(true); fetchDashboard(); }}
                className="flex items-center gap-2 px-6 py-3 bg-brand text-primary-foreground rounded-xl font-bold text-sm hover:bg-brand/90 transition-all"
              >
                <RefreshCw className="w-4 h-4" /> Retry
              </button>
            </div>
          )}

          {/* Action Cards */}
          {!loading && !fetchError && (
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Referral Form (spans 2) */}
              <div className="lg:col-span-2 bg-card rounded-[2rem] p-8 shadow-sm border border-border">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-brand/10 rounded-xl text-brand"><Send className="w-6 h-6" /></div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Post a Referral</h2>
                    <p className="text-sm text-muted-foreground mt-1">Submit a job referral for RGI students. Admin will review before publishing.</p>
                  </div>
                </div>
                <form onSubmit={handleSubmitReferral} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Company Name</label>
                      <input required value={refForm.companyName} onChange={(e) => setRefForm({ ...refForm, companyName: e.target.value })}
                        className="w-full bg-muted px-5 py-4 rounded-2xl border-none focus:ring-2 focus:ring-brand transition-all text-sm outline-none text-foreground placeholder:text-muted-foreground/50"
                        placeholder="e.g. Google" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Role / Position</label>
                      <input required value={refForm.position} onChange={(e) => setRefForm({ ...refForm, position: e.target.value })}
                        className="w-full bg-muted px-5 py-4 rounded-2xl border-none focus:ring-2 focus:ring-brand transition-all text-sm outline-none text-foreground placeholder:text-muted-foreground/50"
                        placeholder="e.g. SDE Intern" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Description</label>
                    <textarea required value={refForm.description} onChange={(e) => setRefForm({ ...refForm, description: e.target.value })} rows={3}
                      className="w-full bg-muted px-5 py-4 rounded-2xl border-none focus:ring-2 focus:ring-brand transition-all text-sm outline-none resize-none text-foreground placeholder:text-muted-foreground/50"
                      placeholder="Job details, eligibility..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Apply Link / Email</label>
                    <input required value={refForm.applyLink} onChange={(e) => setRefForm({ ...refForm, applyLink: e.target.value })}
                      className="w-full bg-muted px-5 py-4 rounded-2xl border-none focus:ring-2 focus:ring-brand transition-all text-sm outline-none text-foreground placeholder:text-muted-foreground/50"
                      placeholder="https://careers.google.com/..." />
                  </div>
                  {refMsg && <p className={`text-sm font-medium ${refMsg.ok ? "text-green-600" : "text-red-500"}`}>{refMsg.msg}</p>}
                  <button type="submit" disabled={submittingRef}
                    className="w-full md:w-auto bg-brand text-primary-foreground px-10 py-4 rounded-xl font-bold hover:scale-[1.02] transition-transform shadow-lg shadow-brand/20 disabled:opacity-50 flex items-center gap-2"
                  >
                    {submittingRef ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {submittingRef ? "Submitting..." : "Submit Referral"}
                  </button>
                </form>
              </div>

              {/* Feedback Card */}
              <div className="lg:col-span-1 bg-gradient-to-br from-muted/50 to-background rounded-[2rem] p-8 border border-border flex flex-col">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-brand/10 rounded-xl text-brand"><MessageSquareShare className="w-6 h-6" /></div>
                  <h2 className="text-xl font-bold text-foreground">Curriculum Feedback</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  Rate the current batch's preparedness and suggest improvements.
                </p>
                <div className="flex gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} onClick={() => setFbRating(s)} className={`hover:scale-110 transition-transform ${s <= fbRating ? "text-brand" : "text-muted-foreground"}`}>
                      <Star className={`w-6 h-6 ${s <= fbRating ? "fill-current" : ""}`} />
                    </button>
                  ))}
                </div>
                <textarea
                  value={fbContent} onChange={(e) => setFbContent(e.target.value)}
                  className="w-full bg-background p-5 rounded-2xl border border-border focus:ring-2 focus:ring-brand transition-all text-sm resize-none mb-6 outline-none text-foreground placeholder:text-muted-foreground/50"
                  placeholder="What skill is missing from the syllabus?" rows={4} />
                {fbMsg && <p className={`text-sm font-medium mb-3 ${fbMsg.ok ? "text-green-600" : "text-red-500"}`}>{fbMsg.msg}</p>}
                <button onClick={handleSubmitFeedback} disabled={submittingFb || !fbContent || fbRating === 0}
                  className="mt-auto w-full bg-foreground text-background py-4 rounded-xl font-bold hover:bg-brand hover:text-primary-foreground transition-colors disabled:opacity-50"
                >
                  {submittingFb ? "Submitting..." : "Share Expertise"}
                </button>
              </div>
            </section>
          )}

          {/* Referrals Table */}
          {!loading && !fetchError && referrals.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">My Referrals</h2>
              <div className="overflow-hidden rounded-[2rem] bg-card shadow-sm border border-border">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Company</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Position</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Apply Link</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {referrals.map((ref: any) => (
                        <tr key={ref.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4 font-semibold text-foreground">{ref.companyName}</td>
                          <td className="px-6 py-4 text-muted-foreground text-sm">{ref.position}</td>
                          <td className="px-6 py-4 text-brand text-sm truncate max-w-[200px]">{ref.applyLink}</td>
                          <td className="px-6 py-4 text-right">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusBadge(ref.status)}`}>{ref.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}