"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Users, GraduationCap, Building2, UserCheck, Search, Loader2,
  Shield, ArrowLeft, ChevronDown, Trash2, Mail, Phone, MapPin,
  Briefcase, FileText, Github, Linkedin, CheckCircle2, Clock, XCircle,
  Send,
  AlertTriangle,
  CheckCircle,
  Bell
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { toast } from "sonner";
import { isPassout } from "@/lib/constants";

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

const COURSES = ["B.Tech", "M.Tech", "MBA", "Diploma"];

// Subcomponents 

function Avatar({ url, name, isVerified }: { url?: string; name?: string; isVerified?: boolean }) {
  const ringColor = isVerified ? "ring-emerald-500" : isVerified === false ? "ring-amber-400" : "ring-border";
  return (
    <div className={`size-32 rounded-full ring-2 ${ringColor} ring-offset-2 ring-offset-card overflow-hidden bg-muted flex items-center justify-center shrink-0`}>
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

  // Compose Broadcast
  const [showCompose, setShowCompose] = useState(false);
  const [composeData, setComposeData] = useState({
    to: "all_students",
    course: "",
    branch: "",
    subject: "",
    message: "",
    emailChannel: true,
    inAppChannel: true,
  });
  const [sending, setSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendError, setSendError] = useState("");

  // Add to state declarations (~line 76):
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferLoading, setTransferLoading] = useState(false);
  const [transferCompany, setTransferCompany] = useState("");
  const [transferJobTitle, setTransferJobTitle] = useState("");
  const [hasPlacement, setHasPlacement] = useState(false);
  const [passoutOnly, setPassoutOnly] = useState(false);

  const handleTransfer = async () => {
    if (selectedIds.size === 0) return;
    setTransferLoading(true);
    try {
      const res = await fetch("/api/admin/users/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentIds: Array.from(selectedIds),
          placementDetails: hasPlacement
            ? { currentCompany: transferCompany, jobTitle: transferJobTitle }
            : undefined,
        }),
      });
      const data = (await res.json()) as any;
      if (data.success) {
        toast.success(
          `Transferred ${data.transferred} student(s) to Alumni` +
          (data.skipped > 0 ? ` (${data.skipped} skipped)` : "")
        );
        setUsers((prev) => prev.filter((u) => !selectedIds.has(u.id)));
        setTotalCount((prev) => prev - (data.transferred || 0));
        setSelectedIds(new Set());
        if (data.errors?.length) {
          data.errors.forEach((err: string) => toast.error(err));
        }
      } else {
        toast.error(data.message || "Transfer failed");
      }
    } catch (err) {
      toast.error("An error occurred during transfer");
    } finally {
      setTransferLoading(false);
      setShowTransferModal(false);
      setTransferCompany("");
      setTransferJobTitle("");
      setHasPlacement(false);
    }
  };



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
        if (passoutOnly) params.set("passout_only", "true");

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
  }, [authenticated, activeTab, branch, submittedSearch, page, passoutOnly]);

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

  // Handle broadcast send
  const handleSendBroadcast = async () => {
    if (!composeData.subject || !composeData.message) {
      setSendError("Subject and message are required");
      return;
    }

    if (!composeData.emailChannel && !composeData.inAppChannel) {
      setSendError("Please select at least one delivery channel");
      return;
    }

    setSending(true);
    setSendError("");

    try {
      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: composeData.to,
          course: composeData.course || undefined,
          branch: composeData.branch || undefined,
          subject: composeData.subject,
          message: composeData.message,
          emailChannel: composeData.emailChannel,
          inAppChannel: composeData.inAppChannel,
        }),
      });

      const data = await res.json() as any;

      if (data.success) {
        setSendSuccess(true);
        toast.success("Broadcast queued successfully!");

        // Reset form after 2 seconds
        setTimeout(() => {
          setShowCompose(false);
          setSendSuccess(false);
          setComposeData({
            to: "all_students",
            course: "",
            branch: "",
            subject: "",
            message: "",
            emailChannel: true,
            inAppChannel: true,
          });
        }, 2000);
      } else {
        setSendError(data.message || "Failed to send broadcast");
      }
    } catch (err) {
      setSendError("An error occurred while sending the broadcast");
      toast.error("Error sending broadcast");
    } finally {
      setSending(false);
    }
  };

  function getTabData(activeTab: string) {
    if (activeTab === "student") {
      return [{ tabData: "all_students" }];
    }
    if (activeTab === "alumni") {
      return [{ tabData: "all_alumnis" }];
    }
    if (activeTab === "recruiter") {
      return [{ tabData: "all_recruiters" }];
    }
    if (activeTab === "external") {
      return [{ tabData: "all_external_students" }];
    }

    return [];
  }

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
      <header className="fixed w-full top-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border">
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

              {activeTab === "student" && (
                <button
                  onClick={() => setShowTransferModal(true)}
                  disabled={actionLoading}
                  className="flex items-center gap-1.5 h-7 px-3 rounded-lg text-xs font-bold
               transition-colors disabled:opacity-50 shrink-0
               text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span className="whitespace-nowrap">Transfer to Alumni</span>
                </button>
              )}

              <button onClick={() => setSelectedIds(new Set())}
                className="ml-auto text-muted-foreground hover:text-foreground transition-colors shrink-0 pl-2">
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          )}
          {/* compose button */}
          <button
            onClick={() => {
              setShowCompose(true);
              setComposeData(prev => ({ ...prev, to: getTabData(activeTab)[0]?.tabData ?? activeTab }));
            }}
            className="group bg-brand text-white px-4.5 py-2 rounded-lg md:rounded-xl text-xs font-bold shadow-lg shadow-brand/25 transition-all duration-300 flex items-center gap-2 cursor-pointer"
          >
            <Send className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-all duration-300 size-5" />
            <span className="hidden md:flex">Compose Broadcast</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-15 sm:px-6 py-6 space-y-6">

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {TABS.map((tab) => (
            <button key={tab.key} onClick={() => handleTabChange(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${activeTab === tab.key
                ? "bg-brand text-white shadow-(--shadow-brand)"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-brand/40"
                }`}>
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/*Search & Filters */}
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

          {activeTab === "student" && (
            <button
              type="button"
              onClick={() => {
                setPassoutOnly((prev) => !prev);
                setPage(1);
                setUsers([]);
              }}
              className={`h-10 px-4 rounded-xl text-sm font-bold whitespace-nowrap transition-all border ${passoutOnly
                ? "bg-amber-500 text-white border-amber-500"
                : "bg-card border-border text-muted-foreground hover:border-amber-400"
                }`}
            >
              Pass Outs
            </button>
          )}

          <button type="submit" className="h-10 px-5 bg-brand text-white rounded-xl text-sm font-bold hover:bg-brand/90 transition-all shrink-0">
            Search
          </button>
        </form>
        {/* Compose Modal */}
        {showCompose && (
          <div className="fixed w-full h-full top-0 left-0 z-60 bg-[#020617]/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowCompose(false)}>
            <div className="bg-white dark:bg-[#0D1527] rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-2xl max-w-xl w-full p-8 animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
              {sendSuccess ? (
                <div className="text-center py-10">
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">Broadcast Queued!</h3>
                  <p className="text-sm text-slate-400 mt-2 max-w-sm mx-auto">Your message is being distributed in the background through Cloudflare workers.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center text-brand">
                      <Send className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">New Multi-Channel Broadcast</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Send immediate push alerts or emails to target groups</p>
                    </div>
                  </div>

                  {sendError && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs rounded-xl flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{sendError}</span>
                    </div>
                  )}

                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[#64748B]">Target Recipient Audience</label>
                      <div className="relative">
                        <select
                          value={composeData.to}
                          onChange={(e) => setComposeData({ ...composeData, to: e.target.value, course: "", branch: "" })}
                          className="w-full appearance-none bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 pr-10 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand transition-all"
                        >
                          <option value={getTabData(activeTab)[0]?.tabData ?? activeTab}>
                            All {TABS.find(t => t.key === activeTab)?.label}
                          </option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    {(activeTab === "student" || activeTab === "external") && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[#64748B]">Course</label>
                          <div className="relative">
                            <select
                              value={composeData.course}
                              onChange={(e) => setComposeData({ ...composeData, course: e.target.value })}
                              className="w-full appearance-none bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 pr-10 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand transition-all"
                            >
                              <option value="">All Courses</option>
                              {COURSES.map((c) => (
                                <option key={c} value={c}>{c}</option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[#64748B]">Branch</label>
                          <div className="relative">
                            <select
                              value={composeData.branch}
                              onChange={(e) => setComposeData({ ...composeData, branch: e.target.value })}
                              className="w-full appearance-none bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 pr-10 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand transition-all"
                            >
                              <option value="">All Branches</option>
                              {BRANCHES.filter(b => b !== "All Branches").map((b) => (
                                <option key={b} value={b}>{b}</option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[#64748B]">Message Subject</label>
                      <input
                        type="text"
                        value={composeData.subject}
                        onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand transition-all"
                        placeholder="Opportunity update, urgent notice, event alert..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[#64748B]">Detailed Body Message</label>
                      <textarea
                        value={composeData.message}
                        onChange={(e) => setComposeData({ ...composeData, message: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand transition-all"
                        rows={5}
                        placeholder="Write the clear details of your notice here..."
                      />
                    </div>

                    {/* Delivery Channels */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[#64748B]">Delivery Channels</label>
                      <div className="flex gap-6 mt-1">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={composeData.emailChannel}
                            onChange={(e) => setComposeData({ ...composeData, emailChannel: e.target.checked })}
                            className="w-4 h-4 text-brand focus:ring-brand border-slate-300 dark:border-slate-700 rounded"
                          />
                          <span className="text-sm font-semibold group-hover:text-slate-900 dark:group-hover:text-white transition-colors flex items-center gap-1.5">
                            <Mail className="w-4 h-4 text-slate-400" />
                            Email Channel
                          </span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={composeData.inAppChannel}
                            onChange={(e) => setComposeData({ ...composeData, inAppChannel: e.target.checked })}
                            className="w-4 h-4 text-brand focus:ring-brand border-slate-300 dark:border-slate-700 rounded"
                          />
                          <span className="text-sm font-semibold group-hover:text-slate-900 dark:group-hover:text-white transition-colors flex items-center gap-1.5">
                            <Bell className="w-4 h-4 text-slate-400" />
                            In-App Push
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-2">
                      <button
                        onClick={() => setShowCompose(false)}
                        className="flex-1 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 py-3 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all duration-150"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSendBroadcast}
                        disabled={sending || !composeData.subject || !composeData.message}
                        className="flex-1 bg-brand hover:bg-brand/90 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-brand/25 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-40"
                      >
                        {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        {sending ? "Triggering..." : "Send Broadcast"}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {showTransferModal && (
          <div
            className="fixed w-full h-full top-0 left-0 z-60 bg-[#020617]/50
               backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowTransferModal(false)}
          >
            <div
              className="bg-white dark:bg-[#0D1527] rounded-3xl border
                 border-slate-200 dark:border-slate-800/80 shadow-2xl
                 max-w-lg w-full p-8 animate-in fade-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center
                        justify-center text-amber-500">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    Transfer to Alumni
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {selectedIds.size} student(s) will be converted to alumni
                  </p>
                </div>
              </div>

              {/* Warning */}
              <div className="mb-5 p-3 bg-amber-500/10 border border-amber-500/20
                      text-amber-700 dark:text-amber-300 text-xs rounded-xl
                      flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">This action cannot be undone.</p>
                  <p className="mt-1">
                    Student accounts will be deleted and new alumni accounts created.
                    They will need to login via the alumni portal with their existing password.
                  </p>
                </div>
              </div>

              {/* Placement checkbox + fields */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={hasPlacement}
                    onChange={(e) => setHasPlacement(e.target.checked)}
                    className="w-4 h-4 text-amber-500 focus:ring-amber-500
                       border-slate-300 dark:border-slate-700 rounded"
                  />
                  <span className="text-sm font-semibold group-hover:text-slate-900
                           dark:group-hover:text-white transition-colors">
                    These students have been placed
                  </span>
                </label>

                {hasPlacement && (
                  <div className="space-y-3 pl-6 border-l-2 border-amber-200
                          dark:border-amber-800 ml-2">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider
                                mb-1.5 text-[#64748B]">Company Name</label>
                      <input
                        type="text"
                        value={transferCompany}
                        onChange={(e) => setTransferCompany(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800/40 border
                           border-slate-200 dark:border-slate-800 rounded-xl
                           px-4 py-2.5 text-sm focus:outline-none focus:ring-2
                           focus:ring-amber-500 transition-all"
                        placeholder="e.g., TCS, Infosys, Google..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider
                                mb-1.5 text-[#64748B]">Job Title / Role</label>
                      <input
                        type="text"
                        value={transferJobTitle}
                        onChange={(e) => setTransferJobTitle(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800/40 border
                           border-slate-200 dark:border-slate-800 rounded-xl
                           px-4 py-2.5 text-sm focus:outline-none focus:ring-2
                           focus:ring-amber-500 transition-all"
                        placeholder="e.g., Software Engineer, Analyst..."
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  onClick={() => {
                    setShowTransferModal(false);
                    setHasPlacement(false);
                    setTransferCompany("");
                    setTransferJobTitle("");
                  }}
                  className="flex-1 border border-slate-200 dark:border-slate-800
                     text-slate-700 dark:text-slate-300 py-3 rounded-xl
                     font-bold hover:bg-slate-50 dark:hover:bg-slate-800/40
                     transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTransfer}
                  disabled={transferLoading || (hasPlacement && !transferCompany)}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-3
                     rounded-xl font-bold hover:shadow-lg hover:shadow-amber-500/25
                     transition-all flex items-center justify-center gap-2
                     disabled:opacity-40"
                >
                  {transferLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <GraduationCap className="w-4 h-4" />
                  )}
                  {transferLoading ? "Transferring..." : "Confirm Transfer"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/*Users List Cards*/}
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

                    <div className="flex flex-col md:flex-row items-start gap-4">
                      {/* Checkbox */}
                      <input type="checkbox" onClick={e => e.stopPropagation()}
                        className="mt-1 w-4 h-4 rounded border-border accent-brand cursor-pointer shrink-0"
                        checked={isSelected} onChange={() => toggleSelection(user.id)} />

                      {/* Avatar Desktop */}
                      <div className="hidden md:block">
                        <Avatar url={user.profileImageUrl} name={user.name} isVerified={isVerified} />
                      </div>
                      {/* Avatar Mobile */}
                      <div className="md:hidden w-full flex justify-center">
                        <Avatar url={user.profileImageUrl} name={user.name} isVerified={isVerified} />
                      </div>

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
                              <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${isVerified
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-300"
                                : "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-300"
                                }`}>
                                {isVerified ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                {isVerified ? "Verified" : "Pending"}
                              </span>
                            )}
                            {/* Add after the existing role badge and verification badge */}
                            {activeTab === "student" && user.course && user.semester &&
                              isPassout(user.course, user.semester) && (
                                <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5rounded-full bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-300">
                                  Pass Outs
                                </span>
                              )}

                          </div>
                        </div>

                        {/* Row 2: Metadata (Degree, College, Branch, Company, etc) */}
                        <div className="flex items-center gap-1.5 flex-wrap text-xs text-muted-foreground mb-1.5">
                          {company && (
                            <>
                              <span className="inline-flex items-center gap-1 font-semibold text-brand"><Briefcase className="w-3 h-3" /> {company}</span>
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
                              <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" /> {user.city}{user.country ? `, ${user.country}` : ""}</span>
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
                              className="size-10 rounded-md flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 transition-colors">
                              <Trash2 className="size-5" />
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
