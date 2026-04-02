"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  GraduationCap,
  Building2,
  Briefcase,
  AlertCircle,
  Activity,
  UserCheck,
  FileText,
  Image,
  Bell,
  Database,
  LogOut,
  Loader2,
  ChevronRight,
  Shield,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

interface Stats {
  totalStudents: number;
  totalAlumni: number;
  totalRecruiters: number;
  totalExternalStudents: number;
  activeDrives: number;
  pendingApprovals: number;
  pendingDrives: number;
  pendingReferrals: number;
  pendingMemories: number;
  pendingExternalScreening: number;
}

export default function AdminDashboard() {
  const { loading: authLoading, authenticated } = useAuth("admin", "/admin/login");
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!authenticated) return;
    const fetchStats = async () => {
      try {
        setFetchError(null);
        const res = await fetch("/api/admin/stats");
        const data = (await res.json()) as { success: boolean; stats: Stats };
        if (data.success) setStats(data.stats);
        else setFetchError("Failed to load dashboard data");
      } catch (err) {
        console.error(err);
        setFetchError("Network error. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [authenticated]);

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    logout("admin");
    router.push("/admin/login");
  };

  if (authLoading || !authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    );
  }

  const statCards = stats
    ? [
        { label: "Total Students", value: stats.totalStudents, icon: GraduationCap, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Total Alumni", value: stats.totalAlumni, icon: UserCheck, color: "text-green-500", bg: "bg-green-500/10" },
        { label: "Recruiters", value: stats.totalRecruiters, icon: Building2, color: "text-purple-500", bg: "bg-purple-500/10" },
        { label: "External Students", value: stats.totalExternalStudents, icon: Users, color: "text-orange-500", bg: "bg-orange-500/10" },
        { label: "Active Drives", value: stats.activeDrives, icon: Briefcase, color: "text-brand", bg: "bg-brand/10" },
        { label: "Pending Approvals", value: stats.pendingApprovals, icon: AlertCircle, color: "text-red-500", bg: "bg-red-500/10" },
      ]
    : [];

  const navSections = [
    {
      title: "Approval Queue",
      desc: "Drive requests, referrals, screening, image moderation",
      icon: FileText,
      href: "/admin/approvals",
      badge: stats?.pendingApprovals || 0,
    },
    {
      title: "Drive Management",
      desc: "View, manage, and track placement drives",
      icon: Briefcase,
      href: "/admin/drives",
      badge: stats?.activeDrives || 0,
    },
    {
      title: "User Management",
      desc: "Students, alumni, recruiters, external students",
      icon: Users,
      href: "/admin/users",
      badge: null,
    },
    {
      title: "Notification Center",
      desc: "Email logs, approval history, custom emails",
      icon: Bell,
      href: "/admin/notifications",
      badge: null,
    },
    {
      title: "Master Data",
      desc: "Upload CSV for StudentMaster & AlumniMaster",
      icon: Database,
      href: "/admin/master-data",
      badge: null,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-brand" />
            </div>
            <div>
              <h1 className="text-lg font-black text-foreground tracking-tight">
                Admin Panel
              </h1>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                RGI T&P Cell
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-muted-foreground hover:text-destructive transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Overview Stats */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-brand/10 rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-brand" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Overview</h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-brand" />
            </div>
          ) : fetchError ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <p className="text-destructive font-bold text-lg">{fetchError}</p>
              <button
                onClick={() => { setLoading(true); const fetchStats = async () => { try { setFetchError(null); const res = await fetch("/api/admin/stats"); const data = (await res.json()) as { success: boolean; stats: Stats }; if (data.success) setStats(data.stats); else setFetchError("Failed to load"); } catch { setFetchError("Network error"); } finally { setLoading(false); } }; fetchStats(); }}
                className="flex items-center gap-2 px-6 py-3 bg-brand text-primary-foreground rounded-xl font-bold text-sm hover:bg-brand/90 transition-all"
              >
                <RefreshCw className="w-4 h-4" /> Retry
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {statCards.map((card) => (
                <div
                  key={card.label}
                  className="bg-card p-5 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center mb-3`}>
                    <card.icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                  <p className="text-2xl font-black text-foreground">{card.value}</p>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-1">
                    {card.label}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Navigation Sections */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-6">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {navSections.map((section) => (
              <Link
                key={section.title}
                href={section.href}
                className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-lg hover:border-brand/30 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center group-hover:bg-brand/20 transition-colors">
                    <section.icon className="w-6 h-6 text-brand" />
                  </div>
                  {section.badge !== null && section.badge > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {section.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-foreground mb-1 flex items-center gap-2">
                  {section.title}
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-brand group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-xs text-muted-foreground">{section.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
