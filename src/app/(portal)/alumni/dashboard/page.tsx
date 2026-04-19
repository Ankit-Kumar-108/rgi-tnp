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
  AlertCircle,
  Sparkles,
  Heart,
  Building2,
  Link2,
  FileText,
  Calendar,
  Users,
  Award,
  ExternalLink
} from "lucide-react";
import Nav from "@/components/layout/nav/nav";
import Footer from "@/components/layout/footer/footer";
import { useAuth } from "@/hooks/useAuth";
import { getToken, logout } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AlumniDashboard() {
  const { loading: authLoading, authenticated, user } = useAuth("alumni", "/alumni/login");
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
  const [refMsg, setRefMsg] = useState<{ msg: string; ok: boolean; errors?: any } | null>(null);

  // Feedback form
  const [fbRating, setFbRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [fbContent, setFbContent] = useState("");
  const [submittingFb, setSubmittingFb] = useState(false);
  const [fbMsg, setFbMsg] = useState<{ msg: string; ok: boolean } | null>(null);
  const [fbSubmitted, setFbSubmitted] = useState(false);

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
      setRefMsg({ msg: d.message, ok: d.success, errors: d.errors });
      
      if (d.success) {
        toast.success("Referral submitted successfully! Awaiting admin approval.");
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
      } else {
        // Show validation errors as toast
        if (d.errors?.fieldErrors) {
          const errorList = Object.entries(d.errors.fieldErrors)
            .map(([field, errors]: [string, any]) => `${field}: ${errors[0]}`)
            .join("\n");
          toast.error(`Validation Failed:\n${errorList}`);
        } else {
          toast.error(d.message || "Submission failed");
        }
      }
    } catch (error) {
      const msg = "Network error. Please check your connection.";
      setRefMsg({ msg, ok: false });
      toast.error(msg);
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
        setFbSubmitted(true);
        setTimeout(() => {
          setFbContent("");
          setFbRating(0);
          setFbSubmitted(false);
        }, 3000);
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
        toast.success("Profile updated successfully!");
        fetchDashboard();
        setTimeout(() => setShowProfileForm(false), 2000);
      } else {
        toast.error(d.message || "Failed to update profile");
      }
    } catch (error) {
      const errorMsg = "Failed to update profile. Please try again.";
      setProfileMsg({ msg: errorMsg, ok: false });
      toast.error(errorMsg);
    } finally {
      setSubmittingProfile(false);
    }
  };

  const [showReferralModal, setShowReferralModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

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
  const isProfileIncomplete = alumni && (!alumni.jobTitle || !alumni.currentCompany || !alumni.city || !alumni.linkedInUrl);
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
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowReferralModal(true)}
                className="inline-flex items-center gap-2 text-sm font-bold text-primary-foreground hover:opacity-90 transition-opacity border border-transparent px-4 py-2.5 rounded-2xl bg-brand shadow-md"
              >
                <Send className="w-4 h-4" />
                Post a Referral
              </button>
              <button
                onClick={() => setShowFeedbackModal(true)}
                className="inline-flex items-center gap-2 text-sm font-bold text-foreground hover:bg-muted transition-colors border border-border px-4 py-2.5 rounded-2xl bg-card shadow-sm"
              >
                <MessageSquareShare className="w-4 h-4" />
                Share Feedback
              </button>
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
                          <p className="text-sm md:text-lg font-extrabold text-foreground leading-snug truncate">{alumni?.jobTitle || "â€”"}</p>
                        </div>
                        <div className="px-2 md:px-6 md:border-r border-border/50 text-left">
                          <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Company</p>
                          <p className="text-sm md:text-lg font-extrabold text-foreground leading-snug truncate">{alumni?.currentCompany || "â€”"}</p>
                        </div>
                        <div className="px-2 md:px-6 md:border-r border-border/50 text-left text-left">
                          <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">City</p>
                          <p className="text-sm md:text-lg font-extrabold text-foreground leading-snug truncate">{alumni?.city || "â€”"}</p>
                        </div>
                        <div className="px-2 md:pl-6 text-left">
                          <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Country</p>
                          <p className="text-sm md:text-lg font-extrabold text-foreground leading-snug truncate">{alumni?.country || "â€”"}</p>
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
                          className="relative flex items-center gap-2 text-sm font-bold border border-border bg-background hover:bg-muted px-5 py-2.5 rounded-xl transition-all active:scale-95"
                        >
                          {showProfileForm ? "Close Form" : "Update Profile"}
                          <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${showProfileForm ? "rotate-90" : ""}`} />
                          {!showProfileForm && isProfileIncomplete && (
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-sm" />
                          )}
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

          {/* Action Modals */}
          {!loading && !fetchError && (
            <>
              {/* â”€â”€ Referral Modal â”€â”€ */}
              {showReferralModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                  <div className="absolute inset-0 bg-background/60 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setShowReferralModal(false)} />
                  <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-card rounded-2xl border border-border/80 shadow-xl text-left animate-in zoom-in-95 duration-300">
                    <button onClick={() => setShowReferralModal(false)} className="absolute top-4 right-4 z-10 p-2 text-muted-foreground hover:bg-muted rounded-full">
                      <X className="w-5 h-5" />
                    </button>
                {/* Decorative accents */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-brand/[0.06] via-brand/[0.02] to-transparent rounded-bl-[6rem]" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-500/[0.04] to-transparent rounded-tr-[4rem]" />
                <div className="absolute top-1/3 -right-6 w-12 h-12 bg-brand/5 rounded-full blur-xl" />

                <div className="relative p-5 md:p-6 space-y-6">
                  {/* Header */}
                  <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-brand/25 to-brand/10 rounded-xl flex items-center justify-center shadow-inner">
                        <Send className="w-5 h-5 text-brand" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-brand/20 rounded-full flex items-center justify-center">
                        <Sparkles className="w-2 h-2 text-brand" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-lg md:text-xl font-black text-foreground tracking-tight leading-tight">Post a Referral</h2>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed max-w-md">
                        Share job opportunities with RGI students. Admin reviews before publishing.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmitReferral} className="space-y-5">
                    {/* Section 1: Company & Role */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center">
                          <Building2 className="w-3.5 h-3.5 text-blue-500" />
                        </div>
                        <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.15em] text-muted-foreground">Company & Role</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 ml-1">Company Name *</label>
                          <div className="relative group/input">
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-muted/80 rounded-xl flex items-center justify-center border border-border/50 group-focus-within/input:border-brand/30 group-focus-within/input:bg-brand/5 transition-all">
                              <Building2 className="w-3.5 h-3.5 text-muted-foreground group-focus-within/input:text-brand transition-colors" />
                            </div>
                            <input required value={refForm.companyName} onChange={(e) => setRefForm({ ...refForm, companyName: e.target.value })}
                              className="w-full bg-muted/40 pl-14 pr-5 py-3.5 rounded-xl border border-transparent hover:border-border/50 focus:border-brand/30 focus:bg-background focus:ring-2 focus:ring-brand/10 transition-all text-sm outline-none text-foreground font-medium placeholder:text-muted-foreground/40"
                              placeholder="e.g. Google" />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 ml-1">Job Type *</label>
                          <div className="relative group/input">
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-muted/80 rounded-xl flex items-center justify-center border border-border/50 group-focus-within/input:border-brand/30 group-focus-within/input:bg-brand/5 transition-all">
                              <Briefcase className="w-3.5 h-3.5 text-muted-foreground group-focus-within/input:text-brand transition-colors" />
                            </div>
                            <select value={refForm.jobType} onChange={(e) => setRefForm({ ...refForm, jobType: e.target.value })}
                              className="w-full bg-muted/40 pl-14 pr-5 py-3.5 rounded-xl border border-transparent hover:border-border/50 focus:border-brand/30 focus:bg-background focus:ring-2 focus:ring-brand/10 transition-all text-sm outline-none text-foreground font-medium appearance-none cursor-pointer">
                              <option value="">Select Type</option>
                              <option value="Full-time">Full-time</option>
                              <option value="Part-time">Part-time</option>
                              <option value="Internship">Internship</option>
                              <option value="Contract/Bond">Contract</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 ml-1">Role / Position *</label>
                          <div className="relative group/input">
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-muted/80 rounded-xl flex items-center justify-center border border-border/50 group-focus-within/input:border-brand/30 group-focus-within/input:bg-brand/5 transition-all">
                              <Award className="w-3.5 h-3.5 text-muted-foreground group-focus-within/input:text-brand transition-colors" />
                            </div>
                            <input required value={refForm.position} onChange={(e) => setRefForm({ ...refForm, position: e.target.value })}
                              className="w-full bg-muted/40 pl-14 pr-5 py-3.5 rounded-xl border border-transparent hover:border-border/50 focus:border-brand/30 focus:bg-background focus:ring-2 focus:ring-brand/10 transition-all text-sm outline-none text-foreground font-medium placeholder:text-muted-foreground/40"
                              placeholder="e.g. SDE Intern" />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 ml-1">Location</label>
                          <div className="relative group/input">
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-muted/80 rounded-xl flex items-center justify-center border border-border/50 group-focus-within/input:border-brand/30 group-focus-within/input:bg-brand/5 transition-all">
                              <MapPin className="w-3.5 h-3.5 text-muted-foreground group-focus-within/input:text-brand transition-colors" />
                            </div>
                            <input value={refForm.location} onChange={(e) => setRefForm({ ...refForm, location: e.target.value })}
                              className="w-full bg-muted/40 pl-14 pr-5 py-3.5 rounded-xl border border-transparent hover:border-border/50 focus:border-brand/30 focus:bg-background focus:ring-2 focus:ring-brand/10 transition-all text-sm outline-none text-foreground font-medium placeholder:text-muted-foreground/40"
                              placeholder="e.g. Bangalore, India" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                    </div>

                    {/* Section 2: Description */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-lg bg-purple-500/10 flex items-center justify-center">
                          <FileText className="w-3.5 h-3.5 text-purple-500" />
                        </div>
                        <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.15em] text-muted-foreground">Job Description</span>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 ml-1">Description *</label>
                        <textarea required value={refForm.description} onChange={(e) => setRefForm({ ...refForm, description: e.target.value })} rows={3}
                          className="w-full bg-muted/40 px-5 py-4 rounded-xl border border-transparent hover:border-border/50 focus:border-brand/30 focus:bg-background focus:ring-2 focus:ring-brand/10 transition-all text-sm outline-none resize-none text-foreground font-medium placeholder:text-muted-foreground/40 min-h-[110px] leading-relaxed"
                          placeholder="Job details, responsibilities, required skills, eligibility criteria..." />
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                    </div>

                    {/* Section 3: Requirements */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-lg bg-amber-500/10 flex items-center justify-center">
                          <Users className="w-3.5 h-3.5 text-amber-500" />
                        </div>
                        <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.15em] text-muted-foreground">Requirements & Eligibility</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 ml-1">Min CGPA</label>
                          <input type="number" step="0.01" value={refForm.minCGPA} onChange={(e) => setRefForm({ ...refForm, minCGPA: e.target.value })}
                            className="w-full bg-muted/40 px-5 py-3.5 rounded-xl border border-transparent hover:border-border/50 focus:border-brand/30 focus:bg-background focus:ring-2 focus:ring-brand/10 transition-all text-sm outline-none text-foreground font-medium placeholder:text-muted-foreground/40"
                            placeholder="e.g. 7.0" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 ml-1">Experience</label>
                          <input value={refForm.experience} onChange={(e) => setRefForm({ ...refForm, experience: e.target.value })}
                            className="w-full bg-muted/40 px-5 py-3.5 rounded-xl border border-transparent hover:border-border/50 focus:border-brand/30 focus:bg-background focus:ring-2 focus:ring-brand/10 transition-all text-sm outline-none text-foreground font-medium placeholder:text-muted-foreground/40"
                            placeholder="e.g. 0-1 years" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 ml-1">Batch Eligible</label>
                          <input value={refForm.batchEligible} onChange={(e) => setRefForm({ ...refForm, batchEligible: e.target.value })}
                            className="w-full bg-muted/40 px-5 py-3.5 rounded-xl border border-transparent hover:border-border/50 focus:border-brand/30 focus:bg-background focus:ring-2 focus:ring-brand/10 transition-all text-sm outline-none text-foreground font-medium placeholder:text-muted-foreground/40"
                            placeholder="e.g. 2024, 2025" />
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                    </div>

                    {/* Section 4: Links & Deadline */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-lg bg-green-500/10 flex items-center justify-center">
                          <Link2 className="w-3.5 h-3.5 text-green-500" />
                        </div>
                        <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.15em] text-muted-foreground">Links & Deadline</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 ml-1">
                            Referral Code <span className="text-brand/60 normal-case tracking-normal">(Optional)</span>
                          </label>
                          <input value={refForm.referralCode} onChange={(e) => setRefForm({ ...refForm, referralCode: e.target.value })}
                            className="w-full bg-muted/40 px-5 py-3.5 rounded-xl border border-transparent hover:border-border/50 focus:border-brand/30 focus:bg-background focus:ring-2 focus:ring-brand/10 transition-all text-sm outline-none text-foreground font-medium placeholder:text-muted-foreground/40"
                            placeholder="e.g. REF2024" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 ml-1">Deadline</label>
                          <div className="relative group/input">
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-muted/80 rounded-xl flex items-center justify-center border border-border/50 group-focus-within/input:border-brand/30 group-focus-within/input:bg-brand/5 transition-all">
                              <Calendar className="w-3.5 h-3.5 text-muted-foreground group-focus-within/input:text-brand transition-colors" />
                            </div>
                            <input type="date" value={refForm.deadline} onChange={(e) => setRefForm({ ...refForm, deadline: e.target.value })}
                              className="w-full bg-muted/40 pl-14 pr-5 py-3.5 rounded-xl border border-transparent hover:border-border/50 focus:border-brand/30 focus:bg-background focus:ring-2 focus:ring-brand/10 transition-all text-sm outline-none text-foreground font-medium" />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 ml-1">
                          Referral Link <span className="text-brand/60 normal-case tracking-normal">(Optional)</span>
                        </label>
                        <div className="relative group/input">
                          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-muted/80 rounded-xl flex items-center justify-center border border-border/50 group-focus-within/input:border-brand/30 group-focus-within/input:bg-brand/5 transition-all">
                            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-focus-within/input:text-brand transition-colors" />
                          </div>
                          <input value={refForm.refrerralLink} onChange={(e) => setRefForm({ ...refForm, refrerralLink: e.target.value })}
                            className="w-full bg-muted/40 pl-14 pr-5 py-3.5 rounded-xl border border-transparent hover:border-border/50 focus:border-brand/30 focus:bg-background focus:ring-2 focus:ring-brand/10 transition-all text-sm outline-none text-foreground font-medium placeholder:text-muted-foreground/40"
                            placeholder="https://referral-link.com" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 ml-1">Apply Link / Email *</label>
                        <div className="relative group/input">
                          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-brand/10 rounded-xl flex items-center justify-center border border-brand/20">
                            <ExternalLink className="w-3.5 h-3.5 text-brand" />
                          </div>
                          <input required value={refForm.applyLink} onChange={(e) => setRefForm({ ...refForm, applyLink: e.target.value })}
                            className="w-full bg-muted/40 pl-14 pr-5 py-3.5 rounded-xl border border-transparent hover:border-brand/20 focus:border-brand/30 focus:bg-background focus:ring-2 focus:ring-brand/10 transition-all text-sm outline-none text-foreground font-medium placeholder:text-muted-foreground/40"
                            placeholder="https://careers.google.com/..." />
                        </div>
                      </div>
                    </div>

                    {/* Validation Messages */}
                    {refMsg && (
                      <div className={`p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
                        refMsg.ok
                          ? "bg-green-500/10 border border-green-500/20 text-green-600"
                          : "bg-destructive/10 border border-destructive/20 text-destructive"
                      }`}>
                        {refMsg.ok ? <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /> : <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />}
                        <div className="space-y-1">
                          <p className="text-sm font-bold">{refMsg.msg}</p>
                          {refMsg.errors?.fieldErrors && (
                            <ul className="text-xs space-y-0.5 opacity-80">
                              {Object.entries(refMsg.errors.fieldErrors).map(([field, errors]: [string, any]) => (
                                <li key={field}>â€¢ <span className="font-semibold capitalize">{field.replace(/([A-Z])/g, ' $1')}:</span> {errors[0]}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button type="submit" disabled={submittingRef}
                      className="group/btn w-full md:w-auto relative overflow-hidden bg-gradient-to-r from-brand via-brand to-brand/90 hover:from-brand/90 hover:via-brand/95 hover:to-brand/80 text-primary-foreground px-8 py-3 rounded-xl font-black shadow-lg shadow-brand/20 hover:shadow-xl hover:shadow-brand/30 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-3 transition-all duration-300 active:scale-[0.98]"
                    >
                      {/* Shimmer */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-in-out" />
                      <span className="relative flex items-center gap-2.5 text-sm">
                        {submittingRef ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-300" />}
                        {submittingRef ? "Submitting..." : "Submit Referral"}
                      </span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* â”€â”€ Feedback Modal â”€â”€ */}
          {showFeedbackModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-background/60 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setShowFeedbackModal(false)} />
              <div className="relative w-full max-w-2xl animate-in zoom-in-95 duration-300">
                {fbSubmitted ? (
                  <div className="relative overflow-hidden rounded-2xl border border-green-500/30 bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-teal-500/5 p-6 md:p-8 text-center flex flex-col items-center justify-center bg-card">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-500/10 to-transparent rounded-bl-[4rem]" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-500/10 to-transparent rounded-tr-[3rem]" />
                  <div className="relative space-y-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/15 mx-auto">
                      <Heart className="w-10 h-10 text-green-500 fill-green-500 animate-pulse" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">Thank You!</h3>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
                      Your feedback helps us build a better experience for everyone at RGI.
                    </p>
                  </div>
                </div>
                ) : (
                  <div className="relative overflow-hidden rounded-2xl border border-brand/20 bg-gradient-to-br from-brand/[0.03] via-background to-background shadow-xl shadow-brand/[0.04] text-left flex flex-col bg-card">
                    <button onClick={() => setShowFeedbackModal(false)} className="absolute top-4 right-4 z-10 p-2 text-muted-foreground hover:bg-muted rounded-full">
                      <X className="w-5 h-5" />
                    </button>
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-brand/8 via-brand/3 to-transparent rounded-bl-[5rem]" />
                  <div className="absolute bottom-0 left-0 w-28 h-28 bg-gradient-to-tr from-brand/5 to-transparent rounded-tr-[3rem]" />

                  <div className="relative p-5 md:p-6 space-y-5 flex flex-col flex-1">
                    {/* Header */}
                    <div className="flex items-start gap-3">
                      <div className="relative shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-brand/25 to-brand/10 rounded-xl flex items-center justify-center shadow-inner">
                          <MessageSquareShare className="w-5 h-5 text-brand" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-brand/20 rounded-full flex items-center justify-center">
                          <Sparkles className="w-2 h-2 text-brand" />
                        </div>
                      </div>
                      <div>
                        <h2 className="text-lg md:text-xl font-black text-foreground tracking-tight leading-tight">Share Feedback</h2>
                        <p className="text-xs text-muted-foreground mt-0.5 font-medium">Your voice shapes our future</p>
                      </div>
                    </div>

                    {/* Context */}
                    <div className="bg-muted/30 rounded-xl px-4 py-3 border border-border/50">
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        <span className="font-semibold text-foreground">Help us improve.</span>{" "}
                        Rate the syllabus relevance, batch preparedness, and suggest improvements.
                      </p>
                    </div>

                    {/* Rating Section */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground">Your Rating</p>
                        {(hoverRating || fbRating) > 0 && (
                          <span className="text-[10px] font-bold text-brand bg-brand/10 px-2.5 py-0.5 rounded-full animate-in fade-in duration-200">
                            {["", "Poor", "Fair", "Good", "Great", "Excellent"][hoverRating || fbRating]}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setFbRating(s)}
                            onMouseEnter={() => setHoverRating(s)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="relative group/star p-1.5 md:p-2 rounded-lg hover:bg-brand/5 transition-all duration-200"
                          >
                            <Star
                              className={`w-6 h-6 transition-all duration-300 ${
                                s <= (hoverRating || fbRating)
                                  ? "text-amber-400 fill-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.4)] scale-110"
                                  : "text-border hover:text-muted-foreground/50"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      {/* Rating Progress */}
                      <div className="h-0.5 bg-muted/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${((hoverRating || fbRating) / 5) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Feedback Textarea */}
                    <div className="space-y-2 flex-1 flex flex-col">
                      <label className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground">Your Thoughts</label>
                      <textarea
                        value={fbContent}
                        onChange={(e) => setFbContent(e.target.value)}
                        maxLength={500}
                        className="w-full flex-1 bg-background/80 backdrop-blur-sm px-4 py-3 rounded-xl border-2 border-border/60 hover:border-brand/20 focus:border-brand/40 focus:ring-4 focus:ring-brand/10 outline-none text-sm placeholder:text-muted-foreground/30 resize-none transition-all duration-300 min-h-[100px] leading-relaxed text-foreground"
                        placeholder="What could be improved? Any suggestions for the placement cell?"
                        rows={4}
                      />
                      <div className="flex items-center justify-end gap-2">
                        <div className="h-1 w-12 bg-muted/50 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              fbContent.length > 450 ? "bg-amber-500" : "bg-brand/40"
                            }`}
                            style={{ width: `${Math.min((fbContent.length / 500) * 100, 100)}%` }}
                          />
                        </div>
                        <span className={`text-[10px] font-bold tabular-nums ${fbContent.length > 450 ? "text-amber-500" : "text-muted-foreground/60"}`}>
                          {fbContent.length}/500
                        </span>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      onClick={handleSubmitFeedback}
                      disabled={submittingFb || !fbContent.trim() || fbRating === 0}
                      className="group/btn mt-auto w-full relative overflow-hidden bg-gradient-to-r from-brand via-brand to-brand/90 hover:from-brand/90 hover:via-brand/95 hover:to-brand/80 disabled:from-muted disabled:via-muted disabled:to-muted/80 text-primary-foreground py-3 rounded-xl font-black text-sm transition-all duration-300 shadow-lg shadow-brand/20 hover:shadow-xl hover:shadow-brand/30 disabled:shadow-none active:scale-[0.98] flex items-center justify-center gap-2.5"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-in-out" />
                      <span className="relative flex items-center gap-2.5">
                        {submittingFb ? (
                          <><Loader2 className="w-5 h-5 animate-spin" /> <span>Submitting...</span></>
                        ) : (
                          <><Send className="w-4.5 h-4.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-300" /> <span>Share Expertise</span></>
                        )}
                      </span>
                    </button>

                    {/* Disclaimer */}
                    <p className="text-[10px] text-center text-muted-foreground/50 leading-relaxed">
                      Your feedback is valued and helps shape the training & placement process.
                    </p>
                  </div>
                </div>
                )}
              </div>
            </div>
          )}
          </>
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
