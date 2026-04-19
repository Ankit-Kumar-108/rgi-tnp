"use client";

import React, { useEffect, useState } from "react";
import {
  Loader2,
  Briefcase,
  CheckCircle,
  Clock,
  BadgeCheck,
  BadgeAlert,
  Images,
  LogOut,
  RefreshCw,
  Heart,
  Users,
  Award,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getToken, logout } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import VolunteerDriveImageManagement from "@/components/volunteer/VolunteerDriveImageManagement";

interface VolunteerData {
  volunteer: {
    id: string;
    studentId: string;
    designation: string;
    isVerified: boolean;
    isActive: boolean;
    assignedBy?: string;
    assignedAt?: string;
    verificationNotes?: string;
    createdAt: string;
    updatedAt: string;
  };
  student: {
    id: string;
    name: string;
    enrollmentNumber: string;
    email: string;
    branch: string;
    semester: number;
    cgpa: number;
    profileImageUrl?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    batch: string;
    course: string;
  };
  stats: {
    driveImagesUploaded: number;
    activeDrives: number;
    registeredStudents: number;
    totalApprovals: number;
  };
}

export default function VolunteerDashboard() {
  const { loading: authLoading, authenticated, user } = useAuth(
    "student",
    "/students/login"
  );
  const [data, setData] = useState<VolunteerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "drive-images">("overview");
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [submittingProfile, setSubmittingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ msg: string; ok: boolean } | null>(null);
  const [profileForm, setProfileForm] = useState({
    linkedinUrl: "",
    githubUrl: "",
  });

  const router = useRouter();

  useEffect(() => {
    if (!authenticated) return;
    fetchVolunteerDashboard();
  }, [authenticated]);

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    logout("student");
    toast.success("Logged out successfully");
    router.push("/");
  };

  const fetchVolunteerDashboard = async () => {
    try {
      setFetchError(null);
      const token = getToken("student");
      const res = await fetch("/api/volunteer/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const d = (await res.json()) as any;
      if (d.success) {
        setData(d.data);
        if (d.data.student) {
          setProfileForm({
            linkedinUrl: d.data.student.linkedinUrl || "",
            githubUrl: d.data.student.githubUrl || "",
          });
        }
      } else {
        setFetchError(d.message || "Failed to load dashboard");
        toast.error(d.message || "Failed to load dashboard");
      }
    } catch (err) {
      console.error(err);
      setFetchError("Network error. Please check your connection and try again.");
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingProfile(true);
    setProfileMsg(null);
    try {
      const token = getToken("student");
      const res = await fetch("/api/student/update-profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileForm),
      });
      const d = (await res.json()) as any;
      setProfileMsg({ msg: d.message, ok: d.success });
      if (d.success) {
        fetchVolunteerDashboard();
        setTimeout(() => setShowProfileForm(false), 2000);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setProfileMsg({ msg: "Update failed", ok: false });
    } finally {
      setSubmittingProfile(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  const student = data?.student;
  const volunteer = data?.volunteer;

  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <header className="sticky z-40 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-brand" />
            </div>
            <div>
              <h1 className="text-lg font-black text-foreground tracking-tight">
                Volunteer Dashboard
              </h1>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                RGI T&P Cell
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors font-medium text-sm"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Profile Card */}
        <section className="relative mb-8">
          {/* Background Glows */}
          <div className="absolute -top-12 -left-12 w-64 h-64 bg-brand/10 rounded-full blur-3xl -z-10"></div>
          <div className="absolute top-24 -right-12 w-48 h-48 bg-foreground/5 rounded-full blur-3xl -z-10"></div>

          <div className="bg-card rounded-2xl p-6 md:p-8 shadow-sm border border-border flex flex-col md:flex-row gap-8 md:items-center relative overflow-hidden group hover:shadow-xl transition-shadow duration-500">
            {/* Decorative Gradient Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-brand/10 to-transparent rounded-bl-[5rem]"></div>

            {/* Avatar Section */}
            <div className="relative shrink-0 mx-auto md:mx-0">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-full p-2 bg-linear-to-tr from-brand to-brand/40 transition-transform duration-500 group-hover:rotate-6">
                <div className="w-full h-full rounded-full border-4 border-background overflow-hidden bg-muted">
                  {student?.profileImageUrl ? (
                    <img
                      alt="Volunteer Portrait"
                      loading="lazy"
                      className="w-full h-full object-cover"
                      src={student.profileImageUrl}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl font-black text-muted-foreground uppercase">
                      {student?.name?.charAt(0)}
                    </div>
                  )}
                </div>
              </div>

              {/* Verification Badge */}
              <div className="absolute bottom-4 bg-background right-0 md:right-4 size-10 rounded-full flex shrink-0 items-center justify-center">
                {volunteer?.isVerified ? (
                  <BadgeCheck className="size-11 text-center text-green-500" />
                ) : (
                  <BadgeAlert className="size-11 text-center text-yellow-500" />
                )}
              </div>
            </div>

            {/* Info Section */}
            <div className="flex-1 space-y-6 text-center md:text-left">
              <div className="space-y-2">
                <p className="text-brand font-bold text-xs uppercase tracking-[0.3em]">
                  Volunteer Profile
                </p>
                <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tighter leading-none">
                  {student?.name}
                </h1>
                <p className="text-lg md:text-xl font-medium text-muted-foreground tracking-tight">
                  {volunteer?.designation}
                </p>
              </div>

              {/* Horizontal Grid Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-0 pt-6 border-t border-border">
                <div className="md:pr-6 md:border-r border-border">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                    Current CGPA
                  </p>
                  <p className="text-xl md:text-2xl font-bold text-brand">
                    {student?.cgpa}
                  </p>
                </div>
                <div className="md:px-6 md:border-r border-border">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                    Semester
                  </p>
                  <p className="text-xl md:text-2xl font-bold text-brand">
                    {student?.semester}
                  </p>
                </div>
                <div className="md:px-6 md:border-r border-border">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                    Branch
                  </p>
                  <p className="text-xl md:text-2xl font-bold text-brand">
                    {student?.branch}
                  </p>
                </div>
                <div className="md:pl-6">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                    Status
                  </p>
                  <p className="text-xl md:text-2xl font-bold text-green-600">
                    {volunteer?.isVerified ? "Verified" : "Pending"}
                  </p>
                </div>
              </div>

              {/* Links */}
              <div className="flex gap-4 pt-4 border-t border-border justify-center md:justify-start flex-wrap">
                {student?.linkedinUrl && (
                  <a
                    href={student.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
                  >
                    LinkedIn →
                  </a>
                )}
                {student?.githubUrl && (
                  <a
                    href={student.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
                  >
                    GitHub →
                  </a>
                )}
                <button
                  onClick={() => setShowProfileForm(!showProfileForm)}
                  className="text-sm text-brand hover:text-brand/80 transition-colors font-bold"
                >
                  {showProfileForm ? "Cancel" : "Edit Profile →"}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Volunteer Status Section */}
        <section className="mb-8">
          <div
            className={`rounded-2xl p-6 md:p-8 border ${
              volunteer?.isActive
                ? volunteer?.isVerified
                  ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800"
                  : "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800"
                : "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                {volunteer?.isActive ? (
                  volunteer?.isVerified ? (
                    <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
                  ) : (
                    <Clock className="w-8 h-8 text-yellow-600 flex-shrink-0 mt-1" />
                  )
                ) : (
                  <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                )}
                <div className="flex-1">
                  <h3 className={`text-lg font-bold mb-2 ${
                    volunteer?.isActive
                      ? volunteer?.isVerified
                        ? "text-green-900 dark:text-green-100"
                        : "text-yellow-900 dark:text-yellow-100"
                      : "text-red-900 dark:text-red-100"
                  }`}>
                    {volunteer?.isActive
                      ? volunteer?.isVerified
                        ? "✓ Volunteer Verified"
                        : "⏳ Pending Admin Approval"
                      : "❌ Volunteer Account Deactivated"}
                  </h3>
                  <p className={`text-sm ${
                    volunteer?.isActive
                      ? volunteer?.isVerified
                        ? "text-green-800 dark:text-green-200"
                        : "text-yellow-800 dark:text-yellow-200"
                      : "text-red-800 dark:text-red-200"
                  }`}>
                    {volunteer?.isActive
                      ? volunteer?.isVerified
                        ? "Your volunteer account is active and verified. You can now upload drive images and manage your volunteer responsibilities."
                        : "Your volunteer account has been created. An administrator will verify your account and contact you soon. Expected timeframe: 24-48 hours."
                      : "Your volunteer account has been deactivated. Please contact an administrator if you believe this is a mistake."}
                  </p>

                  {/* Additional Status Info */}
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {volunteer?.assignedAt && (
                      <div>
                        <p className={`text-xs font-bold uppercase tracking-wide mb-1 ${
                          volunteer?.isActive
                            ? volunteer?.isVerified
                              ? "text-green-700 dark:text-green-300"
                              : "text-yellow-700 dark:text-yellow-300"
                            : "text-red-700 dark:text-red-300"
                        }`}>
                          Assigned Date
                        </p>
                        <p className={`text-sm font-medium ${
                          volunteer?.isActive
                            ? volunteer?.isVerified
                              ? "text-green-900 dark:text-green-100"
                              : "text-yellow-900 dark:text-yellow-100"
                            : "text-red-900 dark:text-red-100"
                        }`}>
                          {new Date(volunteer.assignedAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    )}
                    {volunteer?.assignedBy && (
                      <div>
                        <p className={`text-xs font-bold uppercase tracking-wide mb-1 ${
                          volunteer?.isActive
                            ? volunteer?.isVerified
                              ? "text-green-700 dark:text-green-300"
                              : "text-yellow-700 dark:text-yellow-300"
                            : "text-red-700 dark:text-red-300"
                        }`}>
                          Assigned By
                        </p>
                        <p className={`text-sm font-medium ${
                          volunteer?.isActive
                            ? volunteer?.isVerified
                              ? "text-green-900 dark:text-green-100"
                              : "text-yellow-900 dark:text-yellow-100"
                            : "text-red-900 dark:text-red-100"
                        }`}>
                          {volunteer.assignedBy}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className={`text-xs font-bold uppercase tracking-wide mb-1 ${
                        volunteer?.isActive
                          ? volunteer?.isVerified
                            ? "text-green-700 dark:text-green-300"
                            : "text-yellow-700 dark:text-yellow-300"
                          : "text-red-700 dark:text-red-300"
                      }`}>
                        Designation
                      </p>
                      <p className={`text-sm font-medium ${
                        volunteer?.isActive
                          ? volunteer?.isVerified
                            ? "text-green-900 dark:text-green-100"
                            : "text-yellow-900 dark:text-yellow-100"
                          : "text-red-900 dark:text-red-100"
                      }`}>
                        {volunteer?.designation}
                      </p>
                    </div>
                  </div>

                  {volunteer?.verificationNotes && (
                    <div className="mt-4 p-3 bg-white/40 dark:bg-black/20 rounded-lg">
                      <p className={`text-xs font-bold uppercase tracking-wide mb-1 ${
                        volunteer?.isActive
                          ? volunteer?.isVerified
                            ? "text-green-700 dark:text-green-300"
                            : "text-yellow-700 dark:text-yellow-300"
                          : "text-red-700 dark:text-red-300"
                      }`}>
                        Admin Notes
                      </p>
                      <p className={`text-sm ${
                        volunteer?.isActive
                          ? volunteer?.isVerified
                            ? "text-green-900 dark:text-green-100"
                            : "text-yellow-900 dark:text-yellow-100"
                          : "text-red-900 dark:text-red-100"
                      }`}>
                        {volunteer.verificationNotes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Edit Profile Form */}
        {showProfileForm && (
          <section className="mb-8 bg-card border border-border rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-brand" />
              Update Profile Links
            </h2>
            <form onSubmit={handleSubmitProfile} className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2 text-foreground">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={profileForm.linkedinUrl}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, linkedinUrl: e.target.value })
                  }
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-foreground">
                  GitHub URL
                </label>
                <input
                  type="url"
                  value={profileForm.githubUrl}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, githubUrl: e.target.value })
                  }
                  placeholder="https://github.com/yourprofile"
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all"
                />
              </div>
              {profileMsg && (
                <p
                  className={`text-sm font-medium ${
                    profileMsg.ok ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {profileMsg.msg}
                </p>
              )}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={submittingProfile}
                  className="bg-brand text-primary-foreground px-8 py-3.5 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg shadow-brand/20 disabled:opacity-50 flex items-center gap-2"
                >
                  {submittingProfile ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  Save Profile
                </button>
                <button
                  type="button"
                  onClick={() => setShowProfileForm(false)}
                  className="bg-muted text-foreground px-8 py-3.5 rounded-xl font-bold hover:bg-muted/80 transition-colors"
                >
                  Discard
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Stats Cards */}
        {data && (
          <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <p className="text-muted-foreground text-sm font-medium">
                  Drive Images
                </p>
                <Images className="w-5 h-5 text-brand" />
              </div>
              <p className="text-3xl font-bold text-foreground">
                {data.stats.driveImagesUploaded}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Uploaded this session
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <p className="text-muted-foreground text-sm font-medium">
                  Active Drives
                </p>
                <Briefcase className="w-5 h-5 text-brand" />
              </div>
              <p className="text-3xl font-bold text-foreground">
                {data.stats.activeDrives}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Available for students
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <p className="text-muted-foreground text-sm font-medium">
                  Students
                </p>
                <Users className="w-5 h-5 text-brand" />
              </div>
              <p className="text-3xl font-bold text-foreground">
                {data.stats.registeredStudents}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Registered in system
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <p className="text-muted-foreground text-sm font-medium">
                  Pending Tasks
                </p>
                <Award className="w-5 h-5 text-brand" />
              </div>
              <p className="text-3xl font-bold text-foreground">
                {data.stats.totalApprovals}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Awaiting approval
              </p>
            </div>
          </section>
        )}

        {/* Tab Navigation */}
        <section className="mb-8 flex gap-4 border-b border-border">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-4 px-4 font-bold text-sm transition-colors ${
              activeTab === "overview"
                ? "text-brand border-b-2 border-brand"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Overview
            </div>
          </button>
          <button
            onClick={() => setActiveTab("drive-images")}
            className={`pb-4 px-4 font-bold text-sm transition-colors ${
              activeTab === "drive-images"
                ? "text-brand border-b-2 border-brand"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-2">
              <Images className="w-4 h-4" />
              Drive Images
            </div>
          </button>
        </section>

        {/* Tab Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-brand" />
          </div>
        ) : fetchError ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <p className="text-destructive font-bold text-lg">{fetchError}</p>
            <button
              onClick={() => {
                setLoading(true);
                fetchVolunteerDashboard();
              }}
              className="flex items-center gap-2 px-6 py-3 bg-brand text-primary-foreground rounded-xl font-bold text-sm hover:bg-brand/90 transition-all"
            >
              <RefreshCw className="w-4 h-4" /> Retry
            </button>
          </div>
        ) : (
          <>
            {activeTab === "overview" && (
              <section className="space-y-6">
                <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Heart className="w-6 h-6 text-brand" />
                    Volunteer Information
                  </h2>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-muted-foreground text-sm font-medium mb-1">
                          Enrollment Number
                        </p>
                        <p className="text-foreground font-bold">
                          {student?.enrollmentNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm font-medium mb-1">
                          Email
                        </p>
                        <p className="text-foreground font-bold">{student?.email}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm font-medium mb-1">
                          Course
                        </p>
                        <p className="text-foreground font-bold">{student?.course}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm font-medium mb-1">
                          Batch
                        </p>
                        <p className="text-foreground font-bold">{student?.batch}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm font-medium mb-1">
                          Joined as Volunteer
                        </p>
                        <p className="text-foreground font-bold">
                          {new Date(volunteer?.createdAt || "").toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm font-medium mb-1">
                          Verification Status
                        </p>
                        <div className="flex items-center gap-2">
                          {volunteer?.isVerified ? (
                            <>
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              <span className="text-green-600 font-bold">Verified</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-5 h-5 text-yellow-500" />
                              <span className="text-yellow-600 font-bold">Pending</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeTab === "drive-images" && (
              <VolunteerDriveImageManagement />
            )}
          </>
        )}
      </main>
    </div>
  );
}
