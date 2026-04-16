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
  Linkedin,
  MapPin,
  Phone,
  LogOut,
  RefreshCw,
  BadgeCheck,
  BadgeAlert,
  X,
  AlertCircle
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
  const [refForm, setRefForm] = useState({ 
    companyName: "", 
    jobType: "",
    position: "", 
    description: "", 
    location: "",
    minCGPA: "",
    experience: "",
    batchEligible: "",
    refrerralLink: "",
    referralCode: "",
    deadline: "",
    applyLink: "" 
  });
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
    country: "",
    linkedInUrl: "",
    phoneNumber: "",
    about: "",
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
      setLoading(true);
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
            country: d.alumni.country || "",
            linkedInUrl: d.alumni.linkedInUrl || "",
            phoneNumber: d.alumni.phoneNumber || "",
            about: d.alumni.about || "",
          });
        }
      } else {
        setFetchError("Failed to load dashboard data.");
        toast.error("Failed to load dashboard data.");
      }
    } catch (err) {
      console.error(err);
      setFetchError("Network error. Please check your connection.");
      toast.error("Network error. Please check your connection.");

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
        setRefForm({ 
          companyName: "", 
          jobType: "",
          position: "", 
          description: "", 
          location: "",
          minCGPA: "",
          experience: "",
          batchEligible: "",
          refrerralLink: "",
          referralCode: "",
          deadline: "",
          applyLink: "" 
        });
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
        toast.success(d.message || "Feedback submitted successfully!");
        setFbContent("");
        setFbRating(0);
      } else {
        toast.error(d.message || "Failed to submit feedback");
      }
    } catch (error) {
      const errorMsg = "Failed to submit feedback. Please try again.";
      setFbMsg({ msg: errorMsg, ok: false });
      toast.error(errorMsg);
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-bold uppercase tracking-widest mb-0">
            <GraduationCap className="w-4 h-4" /> Alumni
          </div>
          <section className="pt-4 md:pt-8 flex flex-col md:flex-row justify-between md:items-end gap-4">

            <h1 className="text-2xl md:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-tight">
              Welcome Back, <span className="text-brand">{alumni?.name || "Student"}</span>
            </h1>
            <div className="flex items-center gap-3">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-destructive/10 text-destructive px-5 py-2.5 rounded-2xl text-sm font-bold hover:bg-destructive/20 transition-all shadow-sm border border-destructive/10"
              >
                <LogOut className="size-4" /> Logout
              </button>
            </div>
          </section>

          {/* Hero Section */}
          <section className="pt-4 md:pt-8 w-full">
            <div className="flex flex-col items-center justify-between gap-6 mt-2">
              {alumni && (
                <div className="w-full relative group">
                  <div className="absolute -top-12 -left-12 w-48 h-48 md:w-64 md:h-64 bg-brand/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
                  <div className="absolute top-24 -right-12 w-32 h-32 md:w-48 md:h-48 bg-foreground/5 rounded-full blur-3xl -z-10"></div>

                  <div className="bg-card/80 backdrop-blur-sm rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 lg:p-12 shadow-xl shadow-brand/5 border border-border/60 flex flex-col md:flex-row gap-8 items-center md:items-start relative overflow-hidden transition-all duration-500 hover:border-brand/30">

                    <div className="absolute top-0 right-0 w-24 h-24 md:w-40 md:h-40 bg-gradient-to-bl from-brand/10 via-transparent to-transparent rounded-bl-[3rem] md:rounded-bl-[6rem]"></div>

                    <div className="relative shrink-0 transition-transform duration-500 hover:scale-105">
                      <div className="w-32 h-32 md:w-44 lg:w-52 md:h-44 lg:h-52 rounded-full p-1 md:p-1.5 bg-gradient-to-tr from-brand via-brand/60 to-orange-400">
                        <div className="w-full h-full rounded-full border-[3px] md:border-[5px] border-background overflow-hidden bg-muted flex items-center justify-center">
                          {alumni?.profileImageUrl ? (
                            <img
                              alt="Alumni Portrait"
                              className="w-full h-full object-cover"
                              src={alumni.profileImageUrl}
                            />
                          ) : (
                            <span className="text-4xl md:text-5xl font-black text-muted-foreground/40 uppercase leading-none">
                              {alumni?.name?.charAt(0)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="absolute bottom-1 md:bottom-2 right-1 md:right-4 bg-background rounded-full p-1 shadow-md">
                        {alumni?.isVerified ? (
                          <BadgeCheck className="w-8 h-8 md:w-10 md:h-10 text-green-500" />
                        ) : (
                          <BadgeAlert className="w-8 h-8 md:w-10 md:h-10 text-destructive/80" />
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
                          <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Current Role</p>
                          <p className="text-sm md:text-lg font-extrabold text-foreground leading-snug truncate">{alumni?.jobTitle || "—"}</p>
                        </div>
                        <div className="px-2 md:px-6 md:border-r border-border/50 text-left">
                          <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Company</p>
                          <p className="text-sm md:text-lg font-extrabold text-foreground leading-snug truncate">{alumni?.currentCompany || "—"}</p>
                        </div>
                        <div className="px-2 md:px-6 md:border-r border-border/50 text-left text-left">
                          <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">City</p>
                          <p className="text-sm md:text-lg font-extrabold text-foreground leading-snug truncate">{alumni?.city || "—"}</p>
                        </div>
                        <div className="px-2 md:pl-6 text-left">
                          <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Country</p>
                          <p className="text-sm md:text-lg font-extrabold text-foreground leading-snug truncate">{alumni?.country || "—"}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                        {alumni.linkedInUrl && (
                          <a
                            href={alumni.linkedInUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-[#0077b5] text-white hover:bg-[#0077b5]/90 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95"
                          >
                            <Linkedin className="w-4 h-4" />
                            <span className="hidden xs:inline">LinkedIn Profile</span>
                            <span className="xs:hidden">LinkedIn</span>
                          </a>
                        )}
                        <button
                          onClick={() => setShowProfileForm(!showProfileForm)}
                          className="flex items-center gap-2 text-sm font-bold border border-border bg-background hover:bg-muted px-5 py-2.5 rounded-xl transition-all active:scale-95"
                        >
                          {showProfileForm ? "Close Form" : "Update Profile"}
                          <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${showProfileForm ? "rotate-90" : ""}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Profile Form (Full Screen Overlay) */}
          {showProfileForm && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
              {/* Backdrop */}
              <div 
                className="absolute w-full h-[120%] bg-background/60 backdrop-blur-xl animate-in fade-in duration-300"
                onClick={() => setShowProfileForm(false)}
              />
              
              {/* Modal Container */}
              <section className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-card rounded-[2.5rem] p-6 md:p-10 shadow-2xl border border-brand/20 animate-in zoom-in-95 duration-300">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-border/50">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-brand/10 rounded-2xl text-brand shadow-inner">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-black text-foreground tracking-tight">Professional Profile</h2>
                      <p className="text-xs md:text-sm text-muted-foreground font-medium">Update your career details for the RGI community.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowProfileForm(false)}
                    className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-7" /> 
                  </button>
                </div>

                <form onSubmit={handleSubmitProfile} className="space-y-8">
                  <div className="space-y-3 text-left">
                    <label htmlFor="about" className="text-[10px] md:text-xs font-black uppercase tracking-widest text-brand ml-1 flex items-center gap-2">
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
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Current Company</label>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-background rounded-lg border border-border group-focus-within:border-brand/50 transition-colors">
                          <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
                        </div>
                        <input
                          required
                          value={profileForm.currentCompany}
                          onChange={(e) => setProfileForm({ ...profileForm, currentCompany: e.target.value })}
                          className="w-full bg-muted/50 pl-14 pr-5 py-4 rounded-2xl border border-transparent focus:border-brand/30 focus:bg-background transition-all text-sm outline-none text-foreground font-bold"
                          placeholder="e.g. Google"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Job Title</label>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-background rounded-lg border border-border group-focus-within:border-brand/50 transition-colors">
                          <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
                        </div>
                        <input
                          required
                          value={profileForm.jobTitle}
                          onChange={(e) => setProfileForm({ ...profileForm, jobTitle: e.target.value })}
                          className="w-full bg-muted/50 pl-14 pr-5 py-4 rounded-2xl border border-transparent focus:border-brand/30 focus:bg-background transition-all text-sm outline-none text-foreground font-bold"
                          placeholder="e.g. Software Engineer"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">LinkedIn Profile</label>
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
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Location (City)</label>
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
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Country</label>
                      <input
                        value={profileForm.country}
                        onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
                        className="w-full bg-muted/50 px-6 py-4 rounded-2xl border border-transparent focus:border-brand/30 focus:bg-background transition-all text-sm outline-none text-foreground font-bold"
                        placeholder="India"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Phone Number (Private)</label>
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
                      className="flex-1 bg-brand text-primary-foreground px-8 py-4 rounded-2xl font-black hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-brand/20 disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                      {submittingProfile ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                      <span className="tracking-tight uppercase text-xs md:text-sm">Save Profile changes</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowProfileForm(false)}
                      className="bg-muted text-foreground px-8 py-4 rounded-2xl font-bold hover:bg-muted/80 transition-all uppercase text-xs md:text-sm tracking-widest"
                    >
                      Discard
                    </button>
                  </div>
                </form>
              </section>
            </div>
          )}

          {/* Stats */}
          {!loading && !fetchError && (
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Stat Card: Total Referrals */}
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-[1.75rem] p-6 md:p-8 border border-blue-500/20 shadow-sm hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                    <UserPlus className="w-7 h-7 text-blue-600" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-blue-500/40 group-hover:text-blue-500/60 group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-3xl md:text-4xl font-black text-foreground leading-none mb-2">{stats.totalReferrals || 0}</p>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Referrals</p>
                <p className="text-[10px] text-blue-600/70 mt-2">Opportunities shared</p>
              </div>

              {/* Stat Card: Approved Referrals */}
              <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-[1.75rem] p-6 md:p-8 border border-green-500/20 shadow-sm hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                    <Briefcase className="w-7 h-7 text-green-600" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-green-500/40 group-hover:text-green-500/60 group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-3xl md:text-4xl font-black text-foreground leading-none mb-2">{stats.approvedReferrals || 0}</p>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Approved</p>
                <p className="text-[10px] text-green-600/70 mt-2">Published opportunities</p>
              </div>

              {/* Stat Card: Pending Review */}
              <div className="bg-gradient-to-br from-brand/15 to-brand/5 rounded-[1.75rem] p-6 md:p-8 border border-brand/30 shadow-md hover:-translate-y-1 transition-all duration-300 group cursor-pointer hover:shadow-lg hover:shadow-brand/10">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-brand/30 rounded-2xl flex items-center justify-center group-hover:bg-brand/40 transition-colors">
                    <TrendingUp className="w-7 h-7 text-brand" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-brand/50 group-hover:text-brand/70 group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-3xl md:text-4xl font-black text-brand leading-none mb-2">{stats.pendingReferrals || 0}</p>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Under Review</p>
                <p className="text-[10px] text-brand/70 mt-2">Awaiting approval</p>
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
              <div className="lg:col-span-2 bg-card rounded-[2.5rem] p-8 md:p-10 border border-border shadow-sm text-left">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 bg-brand/10 rounded-2xl text-brand"><Send className="w-6 h-6" /></div>
                  <div>
                    <h2 className="text-2xl font-black">Post a Referral</h2>
                    <p className="text-sm text-muted-foreground">Submit a job referral for RGI students. Admin will review before publishing.</p>
                  </div>
                </div>
                <form onSubmit={handleSubmitReferral} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Company Name</label>
                      <input required value={refForm.companyName} onChange={(e) => setRefForm({ ...refForm, companyName: e.target.value })}
                        className="w-full bg-muted/50 px-6 py-4 rounded-2xl border-none focus:ring-2 focus:ring-brand transition-all text-sm outline-none text-foreground placeholder:text-muted-foreground/50"
                        placeholder="e.g. Google" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Job Type</label>
                      <select value={refForm.jobType} onChange={(e) => setRefForm({ ...refForm, jobType: e.target.value })}
                        className="w-full bg-muted/50 px-6 py-4 rounded-2xl border-none focus:ring-2 focus:ring-brand transition-all text-sm outline-none text-foreground placeholder:text-muted-foreground/50">
                        <option value="">Select Job Type</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Internship">Internship</option>
                        <option value="Contract/Bond">Contract</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Role / Position</label>
                      <input required value={refForm.position} onChange={(e) => setRefForm({ ...refForm, position: e.target.value })}
                        className="w-full bg-muted/50 px-6 py-4 rounded-2xl border-none focus:ring-2 focus:ring-brand transition-all text-sm outline-none text-foreground placeholder:text-muted-foreground/50"
                        placeholder="e.g. SDE Intern" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Location</label>
                      <input value={refForm.location} onChange={(e) => setRefForm({ ...refForm, location: e.target.value })}
                        className="w-full bg-muted/50 px-6 py-4 rounded-2xl border-none focus:ring-2 focus:ring-brand transition-all text-sm outline-none text-foreground placeholder:text-muted-foreground/50"
                        placeholder="e.g. Bangalore, India" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Description</label>
                    <textarea required value={refForm.description} onChange={(e) => setRefForm({ ...refForm, description: e.target.value })} rows={3}
                      className="w-full bg-muted/50 px-6 py-4 rounded-2xl border-none focus:ring-2 focus:ring-brand transition-all text-sm outline-none resize-none text-foreground placeholder:text-muted-foreground/50 min-h-[120px]"
                      placeholder="Job details, eligibility..." />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Min CGPA</label>
                      <input type="number" step="0.01" value={refForm.minCGPA} onChange={(e) => setRefForm({ ...refForm, minCGPA: e.target.value })}
                        className="w-full bg-muted/50 px-6 py-4 rounded-2xl border-none focus:ring-2 focus:ring-brand transition-all text-sm outline-none text-foreground placeholder:text-muted-foreground/50"
                        placeholder="e.g. 3.5" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Experience Required</label>
                      <input value={refForm.experience} onChange={(e) => setRefForm({ ...refForm, experience: e.target.value })}
                        className="w-full bg-muted/50 px-6 py-4 rounded-2xl border-none focus:ring-2 focus:ring-brand transition-all text-sm outline-none text-foreground placeholder:text-muted-foreground/50"
                        placeholder="e.g. 0-1 years" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Batch Eligible</label>
                      <input value={refForm.batchEligible} onChange={(e) => setRefForm({ ...refForm, batchEligible: e.target.value })}
                        className="w-full bg-muted/50 px-6 py-4 rounded-2xl border-none focus:ring-2 focus:ring-brand transition-all text-sm outline-none text-foreground placeholder:text-muted-foreground/50"
                        placeholder="e.g. 2024, 2025" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Referral Code <span className="text-brand font-normal">(Optional)</span></label>
                      <input value={refForm.referralCode} onChange={(e) => setRefForm({ ...refForm, referralCode: e.target.value })}
                        className="w-full bg-muted/50 px-6 py-4 rounded-2xl border-none focus:ring-2 focus:ring-brand transition-all text-sm outline-none text-foreground placeholder:text-muted-foreground/50"
                        placeholder="e.g. REF2024" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Deadline</label>
                      <input type="datetime-local" value={refForm.deadline} onChange={(e) => setRefForm({ ...refForm, deadline: e.target.value })}
                        className="w-full bg-muted/50 px-6 py-4 rounded-2xl border-none focus:ring-2 focus:ring-brand transition-all text-sm outline-none text-foreground placeholder:text-muted-foreground/50" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Referral Link <span className="text-brand font-normal">(Optional)</span></label>
                    <input value={refForm.refrerralLink} onChange={(e) => setRefForm({ ...refForm, refrerralLink: e.target.value })}
                      className="w-full bg-muted/50 px-6 py-4 rounded-2xl border-none focus:ring-2 focus:ring-brand transition-all text-sm outline-none text-foreground placeholder:text-muted-foreground/50"
                      placeholder="e.g. https://referral-link.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Apply Link / Email</label>
                    <input required value={refForm.applyLink} onChange={(e) => setRefForm({ ...refForm, applyLink: e.target.value })}
                      className="w-full bg-muted/50 px-6 py-4 rounded-2xl border-none focus:ring-2 focus:ring-brand transition-all text-sm outline-none text-foreground placeholder:text-muted-foreground/50"
                      placeholder="https://careers.google.com/..." />
                  </div>
                  {refMsg && <p className={`text-sm font-medium ${refMsg.ok ? "text-green-600" : "text-red-500"}`}>{refMsg.msg}</p>}
                  <button type="submit" disabled={submittingRef}
                    className="w-full md:w-auto bg-brand text-primary-foreground px-10 py-4 rounded-2xl font-black shadow-lg shadow-brand/20 disabled:opacity-50 flex items-center gap-2 hover:scale-105 transition-all"
                  >
                    {submittingRef ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {submittingRef ? "Submitting..." : "Submit Referral"}
                  </button>
                </form>
              </div>

              {/* Feedback Card */}
              <div className="lg:col-span-1 bg-gradient-to-br from-brand/5 via-background to-muted/30 rounded-[2.5rem] p-8 border border-brand/20 shadow-lg shadow-brand/5 flex flex-col text-left hover:shadow-lg hover:shadow-brand/10 transition-all">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3.5 bg-gradient-to-br from-brand/20 to-brand/10 rounded-2xl text-brand flex items-center justify-center"><MessageSquareShare className="w-6 h-6" /></div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-black text-foreground leading-tight">Share Your Feedback</h2>
                      <p className="text-xs text-muted-foreground mt-0.5">Help us improve</p>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed font-medium">
                  Is the college syllabus up to date? Rate the batch's preparedness and suggest improvements.
                </p>
                
                {/* Rating Stars */}
                <div className="mb-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Your Rating</p>
                  <div className="flex gap-3 bg-muted/20 p-4 rounded-xl">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button 
                        key={s} 
                        onClick={() => setFbRating(s)} 
                        className={`transition-all duration-200 hover:scale-125 cursor-pointer ${
                          s <= fbRating 
                            ? "text-yellow-400 drop-shadow-md" 
                            : "text-muted-foreground/30 hover:text-muted-foreground/50"
                        }`}
                      >
                        <Star className={`w-7 h-7 ${s <= fbRating ? "fill-current" : ""}`} />
                      </button>
                    ))}
                  </div>
                  {fbRating > 0 && <p className="text-xs text-brand font-semibold mt-2">Rating: {fbRating}/5 ⭐</p>}
                </div>

                {/* Feedback Textarea */}
                <div className="mb-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Your Feedback</p>
                  <textarea
                    value={fbContent} 
                    onChange={(e) => setFbContent(e.target.value)}
                    maxLength={500}
                    className="w-full flex-1 bg-background px-6 py-4 rounded-2xl border-2 border-border hover:border-brand/30 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none text-sm placeholder:text-muted-foreground/40 resize-none transition-all"
                    placeholder="What skill is missing from the syllabus? Any suggestions?" 
                    rows={4} 
                  />
                  <p className="text-xs text-muted-foreground mt-2 text-right">{fbContent.length}/500 characters</p>
                </div>

                {/* Error/Success Message Display (kept for backward compatibility) */}
                {fbMsg && !submittingFb && (
                  <div className={`mb-4 p-3 rounded-xl text-sm font-medium ${
                    fbMsg.ok 
                      ? "bg-green-500/10 text-green-600" 
                      : "bg-red-500/10 text-red-600"
                  }`}>
                    {fbMsg.msg}
                  </div>
                )}

                {/* Submit Button */}
                <button 
                  onClick={handleSubmitFeedback} 
                  disabled={submittingFb || !fbContent.trim() || fbRating === 0}
                  className="mt-auto w-full bg-gradient-to-r from-brand to-brand/80 hover:from-brand/90 hover:to-brand/70 disabled:from-muted disabled:to-muted/50 text-primary-foreground py-4 rounded-2xl font-black transition-all duration-200 shadow-lg shadow-brand/20 hover:shadow-brand/30 disabled:shadow-none active:scale-95 flex items-center justify-center gap-2 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                  <span className="relative">{
                    submittingFb 
                      ? <><Loader2 className="w-5 h-5 animate-spin" /> <span>Submitting...</span></>
                      : <><MessageSquareShare className="w-5 h-5" /> <span>Share Expertise</span></>
                  }</span>
                </button>
              </div>
            </section>
          )}

          {/* Referrals Table */}
          {!loading && !fetchError && referrals.length > 0 && (
            <section className="space-y-6 text-left">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">My Referrals</h2>
              <div className="overflow-hidden rounded-[2.5rem] bg-card shadow-sm border border-border">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-muted/50 border-b border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      <tr>
                        <th className="px-8 py-6">Company</th>
                        <th className="px-8 py-6">Position</th>
                        <th className="px-8 py-6">Apply Link</th>
                        <th className="px-8 py-6 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {referrals.map((ref: any) => (
                        <tr key={ref.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-8 py-6 font-bold text-sm text-foreground">{ref.companyName}</td>
                          <td className="px-8 py-6 text-muted-foreground text-xs">{ref.position}</td>
                          <td className="px-8 py-6 text-brand text-xs font-bold truncate max-w-[150px]">{ref.applyLink}</td>
                          <td className="px-8 py-6 text-right">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${getStatusBadge(ref.status)}`}>{ref.status}</span>
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