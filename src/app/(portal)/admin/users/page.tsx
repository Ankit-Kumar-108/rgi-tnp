"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  GraduationCap,
  Building2,
  UserCheck,
  Search,
  Loader2,
  Shield,
  ArrowLeft,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

type TabKey = "student" | "alumni" | "recruiter" | "external";

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "student", label: "Students", icon: GraduationCap },
  { key: "alumni", label: "Alumni", icon: UserCheck },
  { key: "recruiter", label: "Recruiters", icon: Building2 },
  { key: "external", label: "External Students", icon: Users },
];

const BRANCHES = [
  "All Branches",
  "Computer Science",
  "Mechanical",
  "Electrical",
  "Civil",
  "Electronics",
];

export default function AdminUsersPage() {
  const { loading: authLoading, authenticated } = useAuth("admin", "/admin/login");
  const [activeTab, setActiveTab] = useState<TabKey>("student");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("");

  useEffect(() => {
    if (!authenticated) return;
    fetchUsers();
  }, [authenticated, activeTab]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ role: activeTab });
      if (branch && branch !== "All Branches") params.set("branch", branch);
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/users?${params}`);
      const data = (await res.json()) as { success: boolean; users: any[] };
      if (data.success) setUsers(data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  if (authLoading || !authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/admin/dashboard" className="text-muted-foreground hover:text-brand transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-brand" />
            </div>
            <h1 className="text-lg font-black text-foreground tracking-tight">
              User Management
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setUsers([]); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? "bg-brand text-white shadow-lg shadow-brand/20"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Filters */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or enrollment..."
              className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
            />
          </div>
          {activeTab === "student" && (
            <div className="relative">
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="appearance-none bg-card border border-border rounded-xl px-4 py-2.5 pr-10 text-sm text-foreground focus:ring-2 focus:ring-brand"
              >
                {BRANCHES.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          )}
          <button
            type="submit"
            className="bg-brand text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-brand/90 transition-all"
          >
            Search
          </button>
        </form>

        {/* Results Table */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-brand" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No users found</p>
              <p className="text-xs mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    {activeTab === "student" && (
                      <>
                        <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Name</th>
                        <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Enrollment</th>
                        <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Email</th>
                        <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Branch</th>
                        <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">CGPA</th>
                        <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Verified</th>
                      </>
                    )}
                    {activeTab === "alumni" && (
                      <>
                        <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Name</th>
                        <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Email</th>
                        <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Company</th>
                        <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Job Title</th>
                        <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">City</th>
                      </>
                    )}
                    {activeTab === "recruiter" && (
                      <>
                        <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Name</th>
                        <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Email</th>
                        <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Company</th>
                        <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Designation</th>
                        <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Phone</th>
                      </>
                    )}
                    {activeTab === "external" && (
                      <>
                        <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Name</th>
                        <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">College</th>
                        <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Branch</th>
                        <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">CGPA</th>
                        <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Screened</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {users.map((user: any, i: number) => (
                    <tr
                      key={user.id || i}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    >
                      {activeTab === "student" && (
                        <>
                          <td className="px-5 py-3.5 font-medium text-foreground">{user.name}</td>
                          <td className="px-5 py-3.5 text-muted-foreground font-mono text-xs">{user.enrollmentNumber}</td>
                          <td className="px-5 py-3.5 text-muted-foreground">{user.email}</td>
                          <td className="px-5 py-3.5 text-muted-foreground">{user.branch}</td>
                          <td className="px-5 py-3.5 font-bold text-foreground">{user.cgpa}</td>
                          <td className="px-5 py-3.5">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${user.isVerified ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-500"}`}>
                              {user.isVerified ? "Yes" : "No"}
                            </span>
                          </td>
                        </>
                      )}
                      {activeTab === "alumni" && (
                        <>
                          <td className="px-5 py-3.5 font-medium text-foreground">{user.name}</td>
                          <td className="px-5 py-3.5 text-muted-foreground">{user.personalEmail}</td>
                          <td className="px-5 py-3.5 text-muted-foreground">{user.currentCompany || "—"}</td>
                          <td className="px-5 py-3.5 text-muted-foreground">{user.jobTitle || "—"}</td>
                          <td className="px-5 py-3.5 text-muted-foreground">{user.city || "—"}</td>
                        </>
                      )}
                      {activeTab === "recruiter" && (
                        <>
                          <td className="px-5 py-3.5 font-medium text-foreground">{user.name}</td>
                          <td className="px-5 py-3.5 text-muted-foreground">{user.email}</td>
                          <td className="px-5 py-3.5 text-muted-foreground">{user.company}</td>
                          <td className="px-5 py-3.5 text-muted-foreground">{user.designation}</td>
                          <td className="px-5 py-3.5 text-muted-foreground">{user.phoneNumber}</td>
                        </>
                      )}
                      {activeTab === "external" && (
                        <>
                          <td className="px-5 py-3.5 font-medium text-foreground">{user.name}</td>
                          <td className="px-5 py-3.5 text-muted-foreground">{user.collegeName}</td>
                          <td className="px-5 py-3.5 text-muted-foreground">{user.branch}</td>
                          <td className="px-5 py-3.5 font-bold text-foreground">{user.cgpa}</td>
                          <td className="px-5 py-3.5">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${user.isScreened ? "bg-green-500/10 text-green-600" : "bg-yellow-500/10 text-yellow-600"}`}>
                              {user.isScreened ? "Screened" : "Pending"}
                            </span>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="text-center text-muted-foreground text-xs mt-6">
          Showing {users.length} {activeTab === "external" ? "external students" : activeTab + "s"}
        </p>
      </main>
    </div>
  );
}
