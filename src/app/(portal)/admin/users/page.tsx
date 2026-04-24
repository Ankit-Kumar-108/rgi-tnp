"use client";

export const runtime = 'edge';
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Users, GraduationCap, Building2, UserCheck, Search, Loader2,
  Shield, ArrowLeft, ChevronDown, Trash2, Mail, Phone, MapPin,
  Briefcase, FileText, Github, Linkedin, CheckCircle2, Clock, XCircle
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { toast } from "sonner";

// Types
type TabKey = "student" | "alumni" | "recruiter" | "external";

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "student", label: "Students", icon: GraduationCap },
  { key: "alumni", label: "Alumni", icon: UserCheck },
  { key: "recruiter", label: "Recruiters", icon: Building2 },
  { key: "external", label: "External Students", icon: Users },
];

const BRANCHES = [
  "All Branches", "Computer Science", "Mechanical", "Electrical",
  "Civil", "Electronics", "Digital Communication", "Power Systems",
  "Thermal Engineering", "Marketing", "Finance", "Human Resource",
];

// Subcomponents 

function Avatar({ url, name, isVerified }: { url?: string; name?: string; isVerified?: boolean }) {
  const ringColor = isVerified ? "ring-emerald-500" : isVerified === false ? "ring-amber-400" : "ring-border";
  return (
    <div className={`w-12 h-12 rounded-full ring-2 ${ringColor} ring-offset-2 ring-offset-card overflow-hidden bg-muted flex items-center justify-center shrink-0`}>
      {url ? (
        <img src={url} alt={name} className="w-full h-full object-cover object-top" />
      ) : (
        <span className="font-black text-brand text-base">{name?.charAt(0) ?? "?"}</span>
      )}
    </div>
  );
}

function StatChip({ value, label }: { value?: string | number; label: string }) {
  if (!value) return null;
  return (
    <span className="inline-flex flex-col items-center leading-tight">
      <span className="text-sm font-black text-foreground">{value}</span>
      <span className="text-xs text-muted-foreground uppercase tracking-wide">{label}</span>
    </span>
  );
}

// Main Page
export default function AdminUsersPage() {
  const { loading: authLoading, authenticated } = useAuth("admin", "/admin/login");
  const [activeTab, setActiveTab] = useState<TabKey>("student");
  
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState(""); 
  const [branch, setBranch] = useState("");
  
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [actionLoading, setActionLoading] = useState(false);

  //  Infinite scroll
  const observer = useRef<IntersectionObserver | null>(null);
  const lastUserRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) setPage(p => p + 1);
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // Fetch users 
  useEffect(() => {
    if (!authenticated) return;
    
    const loadUsers = async () => {
      if (page === 1) setLoading(true); 
      
      try {
        const params = new URLSearchParams({ 
          role: activeTab, 
          limit: "50", 
          page: page.toString() 
        });
        
        if (branch && branch !== "All Branches") params.set("branch", branch);
        if (submittedSearch) params.set("search", submittedSearch);
        
        const res = await fetch(`/api/admin/users?${params}`);
        const data = (await res.json()) as { success: boolean; users: any[], totalCount: number };
        
        if (data.success) {
          setTotalCount(data.totalCount || 0);
          setUsers(prev => {
            if (page === 1) return data.users;
            const existingIds = new Set(prev.map(u => u.id));
            const newUsers = data.users.filter(u => !existingIds.has(u.id));
            return [...prev, ...newUsers];
          });
          setHasMore(data.totalCount > page * 50);
          if (page === 1) setSelectedIds(new Set());
        }
      } catch (err) {
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [authenticated, activeTab, branch, submittedSearch, page]);

  //  Handlers 
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setUsers([]);
    setSubmittedSearch(search);
  };

  const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBranch(e.target.value);
    setPage(1);
    setUsers([]); 
  };

  const handleTabChange = (tabKey: TabKey) => {
    setActiveTab(tabKey);
    setSearch("");
    setSubmittedSearch("");
    setBranch("");
    setPage(1);
    setUsers([]);
    setSelectedIds(new Set());
  };

  const handleBulkAction = async (action: "approve" | "delete") => {
    if (selectedIds.size === 0) return;
    if (action === "delete" && !confirm(`Are you sure you want to delete ${selectedIds.size} ${activeTab}(s)? This cannot be undone.`)) return;

    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: action === "delete" ? "DELETE" : "PATCH",
        headers: { "Content-Type": "application/json" },
        // NOTE: Passing 'role' so your backend knows which table to update/delete from
        body: JSON.stringify({ ids: Array.from(selectedIds), action, role: activeTab }),
      });
      const data = await res.json() as any;
      
      if (data.success) {
        toast.success(`Successfully ${action === 'delete' ? 'deleted' : 'approved'} ${selectedIds.size} users`);
        
        if (action === "delete") {
          setUsers(prev => prev.filter(u => !selectedIds.has(u.id)));
          setTotalCount(prev => prev - selectedIds.size);
        } else {
          setUsers(prev => prev.map(u => selectedIds.has(u.id) ? { ...u, isVerified: true, isEmailVerified: true } : u));
        }
        
        setSelectedIds(new Set());
      } else {
        toast.error(data.message || "Action failed");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setActionLoading(false);
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => {
      const newSelected = new Set(prev);
      newSelected.has(id) ? newSelected.delete(id) : newSelected.add(id);
      return newSelected;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === users.length && users.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(users.map(u => u.id)));
    }
  };

  if (authLoading || !authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    );
  }

  // Render 
  return (
    <div className="min-h-screen bg-background pb-12 overflow-hidden">
      
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 min-h-16 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
          
          {/* Left: back + title */}
          <div className="flex items-center gap-3 min-w-0 flex-1 sm:flex-none">
            <Link href="/admin/dashboard" className="w-8 h-8 rounded-lg flex items-center justify-center border border-border hover:bg-muted transition-colors shrink-0">
              <ArrowLeft className="w-4 h-4 text-muted-foreground" />
            </Link>
            <div className="min-w-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-brand/10 rounded-lg md:flex items-center justify-center shrink-0 hidden sm:flex">
                <Shield className="w-4 h-4 text-brand" />
              </div>
              <div>
                <h1 className="text-sm font-black text-foreground tracking-tight truncate">User Management</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  {totalCount} total {activeTab}s registered
                </p>
              </div>
            </div>
          </div>

          {/* Bulk action bar (Responsive: drops to new line on mobile) */}
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2 h-11 px-3 bg-brand/5 border border-brand/20 rounded-xl animate-in fade-in slide-in-from-bottom-2 duration-200 w-full sm:w-auto order-3 sm:order-0 overflow-x-auto no-scrollbar">
              <span className="text-xs font-bold text-brand mr-1 shrink-0">{selectedIds.size} selected</span>
              <div className="h-4 w-px bg-border shrink-0" />
              
              <button onClick={() => handleBulkAction("approve")} disabled={actionLoading}
                className="flex items-center gap-1.5 h-7 px-3 rounded-lg text-xs font-bold transition-colors disabled:opacity-50 shrink-0 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30">
                {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                <span className="whitespace-nowrap">Approve</span>
              </button>
              
              <button onClick={() => handleBulkAction("delete")} disabled={actionLoading}
                className="flex items-center gap-1.5 h-7 px-3 rounded-lg text-xs font-bold transition-colors disabled:opacity-50 shrink-0 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30">
                {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span className="whitespace-nowrap">Delete</span>
              </button>
              
              <button onClick={() => setSelectedIds(new Set())}
                className="ml-auto text-muted-foreground hover:text-foreground transition-colors shrink-0 pl-2">
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* ── Tabs ────────────────────────────────────────────────────────── */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {TABS.map((tab) => (
            <button key={tab.key} onClick={() => handleTabChange(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? "bg-brand text-white shadow-[var(--shadow-brand)]"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-brand/40"
              }`}>
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Search & Filters ───────────────────────────────────────────── */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or enrollment..."
              className="w-full h-10 pl-10 pr-4 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand transition-all" />
            {search && (
              <button type="button" onClick={() => { setSearch(""); setSubmittedSearch(""); setPage(1); setUsers([]); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <XCircle className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {(activeTab === "student" || activeTab === "external") && (
            <div className="relative">
              <select value={branch} onChange={handleBranchChange}
                className="h-10 pl-4 pr-10 bg-card border border-border rounded-xl text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-brand cursor-pointer">
                {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          )}
          
          <button type="submit" className="h-10 px-5 bg-brand text-white rounded-xl text-sm font-bold hover:bg-brand/90 transition-all shrink-0">
            Search
          </button>
        </form>

        {/* ── Users List (Cards) ─────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Users className="w-4 h-4 text-brand" />
              {TABS.find(t => t.key === activeTab)?.label}
            </h2>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox"
                className="w-4 h-4 rounded border-border accent-brand cursor-pointer"
                checked={selectedIds.size > 0 && selectedIds.size === users.length}
                onChange={toggleAll} />
              <span className="text-xs text-muted-foreground font-medium">
                {selectedIds.size > 0 ? `${selectedIds.size} / ${users.length}` : "Select all"}
              </span>
            </label>
          </div>

          {loading && page === 1 ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-5 animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-40" />
                      <div className="h-3 bg-muted rounded w-64" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="bg-card rounded-xl border border-border p-12 text-center">
              <Users className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
              <p className="font-bold text-foreground text-sm">No users found</p>
              <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or branch filter.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {users.map((user, index) => {
                const isSelected = selectedIds.has(user.id);
                const isLast = index === users.length - 1;
                
                // Normalize data structure across the 4 different tab schemas
                const email = user.email || user.personalEmail;
                const isVerified = user.isVerified ?? user.isEmailVerified;
                const linkedinUrl = user.linkedinUrl || user.linkedInUrl;
                const company = user.currentCompany || user.company;
                const designation = user.jobTitle || user.designation;
                const college = user.collegeName || (activeTab === "external" ? "Unknown" : "RGI");

                return (
                  <div key={user.id} ref={isLast ? lastUserRef : null}
                    onClick={e => { const t = (e.target as HTMLElement).tagName; if (t !== "INPUT" && t !== "A" && t !== "BUTTON") toggleSelection(user.id); }}
                    className={`group bg-card border rounded-xl px-5 py-4 transition-all cursor-pointer select-none
                      ${isSelected ? "border-brand ring-1 ring-brand/20 bg-brand/15" : "border-border hover:border-border/80 hover:shadow-sm"}`}>
                    
                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <input type="checkbox" onClick={e => e.stopPropagation()}
                        className="mt-1 w-4 h-4 rounded border-border accent-brand cursor-pointer shrink-0"
                        checked={isSelected} onChange={() => toggleSelection(user.id)} />

                      {/* Avatar */}
                      <Avatar url={user.profileImageUrl} name={user.name} isVerified={isVerified} />

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        
                        {/* Row 1: Name + Role Badge + Verification */}
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2 flex-wrap min-w-0">
                            <h3 className="font-black text-foreground text-base leading-tight truncate">{user.name || "Unknown"}</h3>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-brand/10 text-brand uppercase tracking-wide">
                              {activeTab}
                            </span>
                            
                            {/* Verification Badge (Hidden for recruiters as they lack the DB field) */}
                            {activeTab !== "recruiter" && (
                              <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                                isVerified 
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-300"
                                  : "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-300"
                              }`}>
                                {isVerified ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                {isVerified ? "Verified" : "Pending"}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Row 2: Metadata (Degree, College, Branch, Company, etc) */}
                        <div className="flex items-center gap-1.5 flex-wrap text-xs text-muted-foreground mb-1.5">
                          {company && (
                            <>
                              <span className="inline-flex items-center gap-1 font-semibold text-brand"><Briefcase className="w-3 h-3"/> {company}</span>
                              <span className="text-border">·</span>
                              <span>{designation || "Employee"}</span>
                              <span className="text-border">·</span>
                            </>
                          )}
                          {user.course && (
                            <>
                              <span className="font-medium text-foreground">{user.course}</span>
                              <span className="text-border">·</span>
                            </>
                          )}
                          {(activeTab === "student" || activeTab === "external") && (
                            <>
                              <span className="font-semibold text-brand">{college}</span>
                              <span className="text-border">·</span>
                              <span>{user.branch || "No Branch"}</span>
                            </>
                          )}
                          {user.batch && (
                            <>
                              <span className="text-border">·</span>
                              <span>Batch {user.batch}</span>
                            </>
                          )}
                          {user.city && (
                            <>
                              <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3"/> {user.city}{user.country ? `, ${user.country}` : ""}</span>
                            </>
                          )}
                        </div>

                        {/* Row 3: Stats (CGPA, Enrollment) */}
                        <div className="flex items-center gap-4 flex-wrap mb-2.5">
                          <div className="flex items-center gap-3 divide-x divide-border">
                            {user.cgpa && (
                              <div className="pr-3">
                                <StatChip value={user.cgpa} label="CGPA" />
                              </div>
                            )}
                            {user.enrollmentNumber && (
                              <div className={user.cgpa ? "pl-3" : ""}>
                                <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest">{user.enrollmentNumber}</span>
                              </div>
                            )}
                            {user.semester && (
                              <div className={user.enrollmentNumber || user.cgpa ? "pl-3" : ""}>
                                <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Sem {user.semester}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Row 4: Links & Actions */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {email && (
                            <a href={`mailto:${email}`} onClick={e => e.stopPropagation()}
                               className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-md text-xs font-bold bg-muted text-muted-foreground hover:bg-muted/80 transition-colors">
                              <Mail className="w-3 h-3" /> {email}
                            </a>
                          )}
                          {user.phoneNumber && (
                            <a href={`tel:${user.phoneNumber}`} onClick={e => e.stopPropagation()}
                               className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-md text-xs font-bold bg-muted text-muted-foreground hover:bg-muted/80 transition-colors">
                              <Phone className="w-3 h-3" /> {user.phoneNumber}
                            </a>
                          )}
                          {user.resumeUrl && (
                            <a href={user.resumeUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                              className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-md text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-100 transition-colors">
                              <FileText className="w-3 h-3" /> Resume
                            </a>
                          )}
                          {user.githubUrl && (
                            <a href={user.githubUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                              className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-md text-xs font-bold bg-muted text-foreground dark:bg-slate-800 dark:text-white/70 hover:bg-slate-200 transition-colors">
                              <Github className="w-3 h-3" /> GitHub
                            </a>
                          )}
                          {linkedinUrl && (
                            <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                              className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-md text-xs font-bold bg-blue-700/10 text-blue-700 dark:text-blue-400 hover:bg-blue-700/20 transition-colors">
                              <Linkedin className="w-3 h-3" /> LinkedIn
                            </a>
                          )}

                          {/* Quick Actions Hover */}
                          <div className="ml-auto flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button title="Delete User" onClick={(e) => {
                                e.stopPropagation();
                                setSelectedIds(new Set([user.id]));
                                handleBulkAction("delete");
                              }}
                              className="h-6 w-6 rounded-md flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 transition-colors">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {loading && page > 1 && (
                <div className="flex justify-center py-6">
                  <Loader2 className="w-5 h-5 animate-spin text-brand" />
                </div>
              )}
              
              {!hasMore && users.length > 0 && (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  All {activeTab}s loaded · {users.length} total
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

