"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  FileText,
  Briefcase,
  Users,
  ImageIcon,
  Shield,
  ArrowLeft,
  Loader2,
  Check,
  X,
  Trash2,
  MapPin,
  Calendar,
  GraduationCap,
  Mail,
  Phone,
  LinkIcon,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { toast } from "sonner";

type TabKey = "drives"| "feedback" | "referrals" | "external" | "memories" | "unverified" | "volunteers";
type SubTabKey = "approve" | "approved";
type FeedbackSubTabKey = "student" | "alumni" | "corporate";
type UnverifiedSubTabKey = "students" | "alumni" | "external";

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "drives", label: "Drives", icon: Briefcase },
  { key: "feedback", label: "Feedbacks", icon: FileText },
  { key: "referrals", label: "Referrals", icon: Users },
  { key: "external", label: "Screening", icon: FileText },
  { key: "volunteers", label: "Volunteers", icon: Users },
  { key: "memories", label: "Memories", icon: ImageIcon },
  { key: "unverified", label: "Unverified Emails", icon: Mail },
];

const FEEDBACKTABS: { key: "student" | "alumni" | "corporate"; label: string; icon: React.ElementType }[] = [
  { key: "student", label: "Student Feedback", icon: GraduationCap },
  { key: "alumni", label: "Alumni Feedback", icon: Shield },
  { key: "corporate", label: "Corporate Feedback", icon: Briefcase },
];

const UNVERIFIEDTABS: { key: UnverifiedSubTabKey; label: string; icon: React.ElementType }[] = [
  { key: "students", label: "Students", icon: GraduationCap },
  { key: "alumni", label: "Alumni", icon: Shield },
  { key: "external", label: "External", icon: Briefcase },
];

const SUBTABS: { key: SubTabKey; label: string; icon: React.ElementType }[] = [
  { key: "approve", label: "Pending", icon: Loader2 },
  { key: "approved", label: "Approved", icon: Check },
];

export default function AdminApprovalsPage() {
  const { loading: authLoading, authenticated } = useAuth("admin", "/admin/login");
  const [activeTab, setActiveTab] = useState<TabKey>("drives");
  const [activeSubTab, setActiveSubTab] = useState<SubTabKey>("approve");
  const [activeFeedbackSubTab, setActiveFeedbackSubTab] = useState<FeedbackSubTabKey>("student");
  const [activeUnverifiedSubTab, setActiveUnverifiedSubTab] = useState<UnverifiedSubTabKey>("students");
  const [items, setItems] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [bulkActionLoading, setBulkActionLoading] = useState<"approve" | "reject" | null>(null);
  const [viewItem, setViewItem] = useState<any>(null);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const observer = React.useRef<IntersectionObserver | null>(null);
  const lastItemRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prev) => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);


  useEffect(() => {
    if (!authenticated) return;
    const loadItems = async () => {
      setLoading(true);
      try {
        let fetchType: string = activeTab;
        if (activeTab === "feedback") {
          fetchType = `${activeFeedbackSubTab}Feedback`;
        } else if (activeTab === "unverified") {
          const unverifiedMap: Record<UnverifiedSubTabKey, string> = {
            students: "unverifiedStudents",
            alumni: "unverifiedAlumni",
            external: "unverifiedExternal",
          };
          fetchType = unverifiedMap[activeUnverifiedSubTab];
        }
        const res = await fetch(`/api/admin/approvals?type=${fetchType}&page=${page}&limit=50`);
        const data = (await res.json()) as { success: boolean; items: any[]; totalCount: number };
        if (data.success) {
          setItems((prev) => {
            if (page === 1) return data.items;
             const existingIds = new Set(prev.map(i => i.id));
             const newItems = data.items.filter(i => !existingIds.has(i.id));
             return [...prev, ...newItems];
          });
          setTotalCount(data.totalCount || 0);
          setHasMore(data.totalCount > page * 50);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch items");
      } finally {
        setLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json() as { success: boolean; stats: any };
        if (data.success) setStats(data.stats);
      } catch (err) {
        // Silent catch for stats
      }
    };

    loadItems();
    fetchStats();
  }, [authenticated, activeTab, activeFeedbackSubTab, activeUnverifiedSubTab, page]);

  const handleChangeTab = (tab: TabKey) => {
    setActiveTab(tab);
    setPage(1);
    setItems([])
    setHasMore(true);
    setViewItem(null);
    if (tab !== "feedback") setActiveFeedbackSubTab("student");
    if (tab !== "unverified") setActiveUnverifiedSubTab("students");
  };


  const handleAction = async (id: string, action: "approve" | "reject") => {
    setActionLoading(id);
    try {
      let actionType:string = activeTab;
      if (activeTab === "feedback") {
        actionType = `${activeFeedbackSubTab}Feedback`;
      } else if (activeTab === "unverified") {
        const unverifiedMap: Record<UnverifiedSubTabKey, string> = {
          students: "unverifiedStudents",
          alumni: "unverifiedAlumni",
          external: "unverifiedExternal",
        };
        actionType = unverifiedMap[activeUnverifiedSubTab];
      }
      const res = await fetch("/api/admin/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: actionType, id, action }),
      });
      const data = (await res.json()) as { success: boolean; message: string };
      if (data.success) {
        toast.success(data.message);
        setItems((prev) => prev.filter((item) => item.id !== id));
        if (activeTab === "memories" && action === "approve") {
            setItems((prev) => prev.map((item) => item.id === id ? { ...item, status: "approved" } : item));
        } else {
          setItems((prev) => prev.filter((item) => item.id !== id));
          setTotalCount((prev) => prev - 1);
        }
        setViewItem(null);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleBulkAction = async (action: "approve" | "reject") => {
    const targetItems = activeTab === "memories" 
        ? items.filter(i => activeSubTab === "approve" ? i.status === "pending_moderation" : i.status === "approved")
        : activeTab === "feedback"
        ? items.filter(i => !i.isApproved)
        : items;

    if (targetItems.length === 0) return;
    if (!confirm(`Are you sure you want to ${action} ALL ${targetItems.length} items?`)) return;

    setBulkActionLoading(action);
    try {
      let actionType: string = activeTab;
      if (activeTab === "feedback") {
        actionType = `${activeFeedbackSubTab}Feedback`;
      } else if (activeTab === "unverified") {
        const unverifiedMap: Record<UnverifiedSubTabKey, string> = {
          students: "unverifiedStudents",
          alumni: "unverifiedAlumni",
          external: "unverifiedExternal",
        };
        actionType = unverifiedMap[activeUnverifiedSubTab];
      }
      const res = await fetch("/api/admin/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            type: actionType, 
            ids: targetItems.map(i => i.id), 
            action 
        }),
      });
      const data = (await res.json()) as { success: boolean; message: string };
      if (data.success) {
        toast.success(data.message);
        const targetIds = new Set(targetItems.map(i => i.id));
        if (activeTab === "memories" && action === "approve") {
          setItems((prev) => prev.map((item) => targetIds.has(item.id) ? { ...item, status: "approved" } : item));
        } else {
          setItems((prev) => prev.filter((item) => !targetIds.has(item.id)));
          setTotalCount((prev) => prev - targetItems.length);
        }
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Bulk action failed");
    } finally {
      setBulkActionLoading(null);
    }
  };

  const displayedItems = useMemo(() => {
    if (activeTab !== "memories") return items;
    return items.filter((item) => 
      activeSubTab === "approve"
        ? item.status === "pending_moderation"
        : item.status === "approved"
    );
  }, [items, activeTab, activeSubTab]);

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
      <header className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3">
          <Link href="/admin/dashboard" className="text-muted-foreground hover:text-brand transition-colors p-1">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-brand/10 rounded-lg sm:rounded-xl flex items-center justify-center">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-brand" />
            </div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-foreground">Queue</h1>
          </div>

          <div className="ml-auto flex gap-1.5 sm:gap-2">
            {displayedItems.length > 0 && (
                <>
                <button
                    onClick={() => handleBulkAction("approve")}
                    disabled={bulkActionLoading !== null}
                    className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-green-500 text-white rounded-lg sm:rounded-xl text-xs sm:text-xs font-bold hover:bg-green-600 transition-all shadow-md shadow-green-500/10 disabled:opacity-50"
                  >
                    {bulkActionLoading === "approve" ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                    <span className="hidden xs:inline">Approve All</span>
                    <span className="xs:hidden">Approve</span>
                  </button>
                  <button
                    onClick={() => handleBulkAction("reject")}
                    disabled={bulkActionLoading !== null}
                    className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-border text-red-500 rounded-lg sm:rounded-xl text-xs sm:text-xs font-bold hover:bg-red-50 transition-all disabled:opacity-50"
                  >
                    {bulkActionLoading === "reject" ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                    <span className="hidden xs:inline">Delete All</span>
                    <span className="xs:hidden">Delete</span>
                  </button>
                </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Category Tabs */}
        <div className="flex gap-1.5 sm:gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2 scrollbar-none">
          {TABS.map((tab) => {
            let count = 0;
            if (stats) {
              if (tab.key === "drives") count = stats.pendingDrives || 0;
              else if (tab.key === "referrals") count = stats.pendingReferrals || 0;
              else if (tab.key === "external") count = stats.pendingExternalScreening || 0;
              else if (tab.key === "memories") count = stats.pendingMemories || 0;
              else if (tab.key === "volunteers") count = stats.pendingVolunteers || 0;
              else if (tab.key === "feedback") count = (stats.pendingStudentFeedback || 0) + (stats.pendingAlumniFeedback || 0) + (stats.pendingCorporateFeedback || 0);
              else if (tab.key === "unverified") count = (stats.pendingUnverifiedStudents || 0) + (stats.pendingUnverifiedAlumni || 0) + (stats.pendingUnverifiedExternal || 0);
            }

            return (
              <button
                key={tab.key}
                onClick={() => { handleChangeTab(tab.key) }}
                className={`relative flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${activeTab === tab.key
                    ? "bg-brand text-white shadow-[var(--shadow-brand)]"
                    : "bg-card border border-border text-muted-foreground hover:bg-accent"
                  }`}
              >
                <tab.icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
                {count > 0 && (
                  <span className={`ml-1 min-w-[20px] h-5 rounded-full text-xs flex items-center justify-center px-1.5 font-bold transition-all ${
                    activeTab === tab.key 
                      ? "bg-white/20 text-white shadow-sm" 
                      : "bg-destructive/20 text-destructive animate-pulse shadow-sm shadow-destructive/20"
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Memories Sub-Tabs */}
        {activeTab === "memories" && (
            <div className="flex items-center gap-1.5 mb-6 bg-card p-1 rounded-xl sm:rounded-2xl border border-border w-fit">
              {SUBTABS.map((sub) => (
                <button
                  key={sub.key}
                  onClick={() => setActiveSubTab(sub.key)}
                  className={`flex items-center gap-1.5 px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-xs font-bold transition-all ${activeSubTab === sub.key
                      ? "bg-muted text-brand"
                      : "text-muted-foreground hover:text-muted-foreground"
                    }`}
                >
                  <sub.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  {sub.label}
                </button>
              ))}
            </div>
        )}

        {/* Feedback Sub-Tabs */}
        {activeTab === "feedback" && (
            <div className="flex items-center gap-1.5 mb-6 bg-card p-1 rounded-xl sm:rounded-2xl border border-border w-fit">
              {FEEDBACKTABS.map((feedbackTab) => (
                <button
                  key={feedbackTab.key}
                  onClick={() => {
                    setActiveFeedbackSubTab(feedbackTab.key);
                    setPage(1);
                    setItems([]);
                    setHasMore(true);
                  }}
                  className={`flex items-center gap-1.5 px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-xs font-bold transition-all ${activeFeedbackSubTab === feedbackTab.key
                      ? "bg-muted text-brand"
                      : "text-muted-foreground hover:text-muted-foreground"
                    }`}
                >
                  <feedbackTab.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  {feedbackTab.label}
                </button>
              ))}
            </div>
        )}

        {/* Unverified Email Sub-Tabs */}
        {activeTab === "unverified" && (
            <div className="flex items-center gap-1.5 mb-6 bg-card p-1 rounded-xl sm:rounded-2xl border border-border w-fit">
              {UNVERIFIEDTABS.map((unverTab) => (
                <button
                  key={unverTab.key}
                  onClick={() => {
                    setActiveUnverifiedSubTab(unverTab.key);
                    setPage(1);
                    setItems([]);
                    setHasMore(true);
                  }}
                  className={`flex items-center gap-1.5 px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-xs font-bold transition-all ${activeUnverifiedSubTab === unverTab.key
                      ? "bg-muted text-brand"
                      : "text-muted-foreground hover:text-muted-foreground"
                    }`}
                >
                  <unverTab.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  {unverTab.label}
                </button>
              ))}
            </div>
        )}

        {loading && page == 1 ? (
          <div className="flex flex-col items-center justify-center py-24 sm:py-32 gap-3 sm:gap-4">
            <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-brand" />
            <p className="text-xs sm:text-sm font-bold text-muted-foreground">Loading...</p>
          </div>
        ) : displayedItems.length === 0 ? (
          <div className="text-center py-20 sm:py-32 bg-card rounded-2xl sm:rounded-3xl border-2 border-dashed border-border">
            <Check className="w-8 h-8 sm:w-10 sm:h-10 text-card-foreground/60 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-bold text-foreground">Clear!</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">No pending items here.</p>
          </div>
        ) : (
          <div className={`grid gap-4 sm:gap-6 ${activeTab === "memories" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" : "grid-cols-1 lg:grid-cols-2"}`}>
            {displayedItems.map((item, index) => {
              const isLastElement = index === displayedItems.length - 1;
              return (
                <div key={item.id}
                ref={isLastElement ? lastItemRef : null}
                className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                    {activeTab === "drives" && <DriveRequestCard item={item} onAction={handleAction} loading={actionLoading} />}
                    {activeTab === "referrals" && <ReferralCard item={item} onAction={handleAction} loading={actionLoading} />}
                    {activeTab === "external" && <ExternalScreeningCard item={item} onAction={handleAction} loading={actionLoading} />}
                    {activeTab === "feedback" && <FeedbackCard item={item} onAction={handleAction} loading={actionLoading} feedbackType={activeFeedbackSubTab} />}
                    {activeTab === "unverified" && <UnverifiedEmailCard item={item} onAction={handleAction} loading={actionLoading} userType={activeUnverifiedSubTab} />}
                    {activeTab === "volunteers" && <VolunteerCard item={item} onAction={handleAction} loading={actionLoading} />}
                    {activeTab === "memories" && (
                        <div 
                        onClick={() => setViewItem(item)}
                        className="group relative aspect-square bg-muted rounded-lg sm:rounded-2xl overflow-hidden cursor-pointer border border-border shadow-sm hover:shadow-md transition-all bg-top">
                            <img 
                              src={item.imageUrl} 
                              alt="Memory" 
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                            />
                            <div className="absolute inset-x-0 bottom-0 p-2 sm:p-3 bg-linear-to-t from-black/70 to-transparent">
                                <p className="text-[8px] sm:text-xs font-bold text-white uppercase tracking-wider truncate">{item.title || "Untitled"}</p>
                                <p className="text-[7px] sm:text-xs text-white/80">by {item.uploaderName}</p>
                            </div>
                            <div className={`absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full text-[7px] sm:text-[8px] font-bold uppercase tracking-tight ${item.status === "approved" ? "bg-green-500 text-white" : "bg-amber-500 text-white"}`}>
                                {item.status === "approved" ? "OK" : "PEN"}
                            </div>
                        </div>
                    )}
                </div>
            )})}
          </div>
        )}
        {/* Bottom Loading Indicator */}
        {loading && page > 1 && (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-brand" />
          </div>
        )}

        {/* End of list message */}
        {!hasMore && items.length > 0 && (
          <div className="text-center py-8 text-muted-foreground font-bold text-sm">
            Showing {items.length} of {totalCount} items
          </div>
        )}
      </main>

      {/* Modern Modal with Blurred Backdrop */}
      {viewItem && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center p-2 sm:p-4 md:p-8 animate-in fade-in duration-300"
          onClick={() => setViewItem(null)}
        >
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          
          <div
            className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col md:flex-row max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Content - Media */}
            <div className="w-full md:w-1/2 max-h-[60vh] md:max-h-[80vh] bg-muted relative flex items-center justify-center overflow-hidden bg-top">
                <img
                  src={viewItem.imageUrl || viewItem.profileImageUrl}
                  alt="Preview"
                  loading="lazy"
                  className="w-full h-full object-contain"
                />
                <button 
                onClick={() => setViewItem(null)}
                className="absolute top-3 right-3 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-sm transition-all md:hidden">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Modal Content - Info */}
            <div className="w-full md:w-1/2 p-5 sm:p-8 flex flex-col overflow-hidden max-h-[30vh] md:max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight leading-tight">
                        {activeTab === "memories" ? viewItem.title || "Untitled Memory" : viewItem.name}
                    </h3>
                    <p className="text-xs sm:text-xs font-bold text-brand uppercase tracking-widest mt-1">
                        {activeTab === "memories" ? `Uploaded ${new Date(viewItem.createdAt).toLocaleDateString()}` : "Verification Details"}
                    </p>
                </div>
                <button
                  onClick={() => setViewItem(null)}
                  className="hidden md:flex p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 sm:space-y-6 pr-1 scrollbar-thin">
                {activeTab === "memories" && (
                    <div className="bg-muted p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-100">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Uploader</p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border border-border shadow-sm flex items-center justify-center font-bold text-brand overflow-hidden shrink-0 bg-top">
                                {viewItem.student?.profileImageUrl || viewItem.alumni?.profileImageUrl ? (
                                    <img 
                                      src={viewItem.student?.profileImageUrl || viewItem.alumni?.profileImageUrl} 
                                      loading="lazy" 
                                      className="w-full h-full object-cover" 
                                    />
                                ) : viewItem.uploaderName?.charAt(0)}
                            </div>
                            <div>
                                <p className="font-bold text-foreground text-sm">{viewItem.uploaderName}</p>
                                <p className="text-xs sm:text-xs text-muted-foreground font-medium">ID: {viewItem.student?.enrollmentNumber || viewItem.alumni?.enrollmentNumber || "External"}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                    {Object.entries(viewItem).map(([key, value]) => {
                        if (["id", "_count", "studentId", "alumniId", "imageUrl", "profileImageUrl", "status", "student", "alumni", "createdAt", "uploaderName", "title"].includes(key)) return null;
                        if (!value) return null;

                        return (
                            <div key={key} className="flex flex-col gap-0.5">
                                <span className="text-[8px] sm:text-xs uppercase font-bold text-muted-foreground tracking-wider">
                                    {key.replace(/([A-Z])/g, " $1")}
                                </span>
                                <span className="text-xs sm:text-sm text-foreground font-bold break-words leading-snug">
                                    {typeof value === "object" ? JSON.stringify(value) : String(value)}
                                </span>
                            </div>
                        );
                    })}
                </div>
              </div>

              {/* Action Bar */}
              <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-100 flex gap-2 sm:gap-3">
                {(activeTab !== "memories" || viewItem.status !== "approved") && (
                    <button
                        onClick={() => handleAction(viewItem.id, "approve")}
                        disabled={actionLoading === viewItem.id}
                        className="flex-1 bg-brand text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold hover:bg-brand/90 transition-all flex items-center justify-center gap-2 shadow-[var(--shadow-brand)] disabled:opacity-50"
                    >
                        {actionLoading === viewItem.id ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> : <Check className="w-4 h-4 sm:w-5 sm:h-5" />}
                        Approve
                    </button>
                )}

                <button
                  onClick={() => handleAction(viewItem.id, "reject")}
                  disabled={actionLoading === viewItem.id}
                  className="px-4 sm:px-6 bg-white border border-border text-red-500 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden xs:inline">{activeTab === "memories" ? "Delete" : "Reject"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* Sub-Components for Cards */

function DriveRequestCard({ item, onAction, loading }: { item: any, onAction: any, loading: string | null }) {
    return (
        <div className="bg-card p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-border shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded-lg sm:rounded-2xl flex items-center justify-center text-brand border border-slate-100">
                        <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                        <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight leading-tight">{item.companyName}</h3>
                        <p className="text-xs sm:text-xs font-medium text-muted-foreground">Recruiter: {item.recruiter?.name}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <GraduationCap className="w-3.5 h-3.5 text-brand" />
                    <span className="text-xs sm:text-xs font-bold">{item.roleName}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand" />
                    <span className="text-xs sm:text-xs font-bold">{item.ctc} LPA</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5 text-brand" />
                    <span className="text-xs sm:text-xs font-bold">{new Date(item.driveDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5 text-brand" />
                    <span className="text-xs sm:text-xs font-bold font-mono tracking-tight">{item.driveType}</span>
                </div>
            </div>

            <div className="p-3 sm:p-4 bg-muted rounded-xl sm:rounded-2xl mb-4 sm:mb-6 border border-slate-100">
                <p className="text-xs sm:text-xs text-muted-foreground font-medium line-clamp-2 leading-relaxed">
                    {item.jobDescription}
                </p>
            </div>

            <div className="flex gap-2 sm:gap-3">
                <button 
                onClick={() => onAction(item.id, "approve")}
                disabled={loading === item.id}
                className="flex-1 py-2 sm:py-3 bg-brand text-white rounded-lg sm:rounded-xl text-xs sm:text-xs font-bold hover:bg-brand/90 transition-all flex items-center justify-center gap-2 shadow-md shadow-brand/10 disabled:opacity-50">
                     {loading === item.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                     Approve
                </button>
                <button 
                onClick={() => onAction(item.id, "reject")}
                disabled={loading === item.id}
                className="flex-1 py-2 sm:py-3 bg-white border border-border text-muted-foreground rounded-lg sm:rounded-xl text-xs sm:text-xs font-bold hover:bg-red-50 hover:text-red-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                    Reject
                </button>
            </div>
        </div>
    )
}

function ReferralCard({ item, onAction, loading }: { item: any, onAction: any, loading: string | null }) {
    return (
        <div className="bg-card rounded-2xl sm:rounded-3xl border border-border shadow-sm hover:shadow-md transition-all overflow-hidden">
            <div className="p-4 sm:p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4 sm:mb-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-lg sm:rounded-2xl flex items-center justify-center text-brand border border-brand/80">
                            <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <div>
                            <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight leading-tight">{item.companyName}</h3>
                            <p className="text-xs sm:text-xs font-medium text-muted-foreground">Alumni: {item.alumni?.name}</p>
                        </div>
                    </div>
                </div>

                {/* Position & Job Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="space-y-1">
                        <p className="text-[8px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">Position</p>
                        <p className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
                            <Briefcase className="w-3.5 h-3.5 text-brand" />
                            {item.position}
                        </p>
                    </div>
                    {item.jobType && (
                        <div className="space-y-1">
                            <p className="text-[8px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">Job Type</p>
                            <p className="text-xs sm:text-sm font-bold text-foreground">{item.jobType}</p>
                        </div>
                    )}
                </div>

                {/* Location & Batch */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    {item.location && (
                        <div className="space-y-1">
                            <p className="text-[8px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">Location</p>
                            <p className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
                                <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                                {item.location}
                            </p>
                        </div>
                    )}
                    {item.batchEligible && (
                        <div className="space-y-1">
                            <p className="text-[8px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">Batch Eligible</p>
                            <p className="text-xs sm:text-sm font-bold text-foreground">{item.batchEligible}</p>
                        </div>
                    )}
                </div>

                {/* CGPA & Experience */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    {item.minCGPA && (
                        <div className="space-y-1">
                            <p className="text-[8px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">Min CGPA</p>
                            <p className="text-xs sm:text-sm font-bold text-foreground">{item.minCGPA}</p>
                        </div>
                    )}
                    {item.experience && (
                        <div className="space-y-1">
                            <p className="text-[8px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">Experience</p>
                            <p className="text-xs sm:text-sm font-bold text-foreground">{item.experience}</p>
                        </div>
                    )}
                </div>

                {/* Referral Code & Deadline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    {item.referralCode && (
                        <div className="space-y-1">
                            <p className="text-[8px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">Referral Code</p>
                            <p className="text-xs sm:text-sm font-bold text-foreground bg-blue-50 px-3 py-1 rounded-lg inline-block">{item.referralCode}</p>
                        </div>
                    )}
                    {item.deadline && (
                        <div className="space-y-1">
                            <p className="text-[8px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">Deadline</p>
                            <p className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                                {new Date(item.deadline).toLocaleDateString()}
                            </p>
                        </div>
                    )}
                </div>

                {/* Description */}
                <div className="mb-4 sm:mb-6">
                    <p className="text-[8px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Description</p>
                    <div className="p-3 sm:p-4 bg-muted rounded-xl sm:rounded-2xl border border-slate-100 font-medium text-muted-foreground text-xs sm:text-xs leading-relaxed">
                        {item.description}
                    </div>
                </div>

                {/* Links */}
                <div className="flex flex-col gap-2 mb-4 sm:mb-6">
                    {item.applyLink && (
                        <a href={item.applyLink} target="_blank" className="p-3 sm:p-4 bg-muted rounded-xl sm:rounded-2xl border border-slate-100 flex items-center gap-2 text-brand text-xs sm:text-xs font-bold hover:bg-muted transition-colors">
                            <LinkIcon className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">Apply Link: {item.applyLink}</span>
                        </a>
                    )}
                    {item.refrerralLink && (
                        <a href={item.refrerralLink} target="_blank" className="p-3 sm:p-4 bg-muted rounded-xl sm:rounded-2xl border border-slate-100 flex items-center gap-2 text-muted-foreground text-xs sm:text-xs font-bold hover:bg-muted transition-colors">
                            <LinkIcon className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">Referral Link: {item.refrerralLink}</span>
                        </a>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 sm:gap-3">
                    <button 
                        onClick={() => onAction(item.id, "approve")}
                        disabled={loading === item.id}
                        className="flex-1 py-2 sm:py-3 bg-brand text-primary-foreground rounded-lg sm:rounded-xl text-xs sm:text-xs font-bold hover:bg-brand/80 transition-all flex items-center justify-center gap-2 shadow-md shadow-brand/10 disabled:opacity-50"
                    >
                        {loading === item.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                        Publish
                    </button>
                    <button 
                        onClick={() => onAction(item.id, "reject")}
                        disabled={loading === item.id}
                        className="flex-1 py-2 sm:py-3 bg-card border border-border text-muted-foreground rounded-lg sm:rounded-xl text-xs sm:text-xs font-bold hover:bg-destructive/10 hover:text-destructive transition-all disabled:opacity-50"
                    >
                        Reject
                    </button>
                </div>
            </div>
        </div>
    )
}

function ExternalScreeningCard({ item, onAction, loading }: { item: any, onAction: any, loading: string | null }) {
    return (
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-border shadow-sm hover:shadow-md transition-all overflow-hidden font-medium">
            <div className="p-4 sm:p-6">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-muted border border-border overflow-hidden shrink-0 bg-top">
                        {item.profileImageUrl ? (
                            <img src={item.profileImageUrl} loading="lazy" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-xl sm:text-2xl text-white/70">
                                {item.name?.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div>
                        <h3 className="text-base sm:text-xl font-bold text-foreground tracking-tight leading-tight">{item.name}</h3>
                        <p className="text-xs sm:text-xs font-bold text-orange-500 mt-1 uppercase tracking-widest flex items-center gap-1.5 leading-none">
                            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-orange-500 animate-pulse" />
                            Screening
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="space-y-0.5">
                        <p className="text-[8px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">College</p>
                        <p className="text-xs sm:text-xs font-bold text-foreground truncate" title={item.collegeName}>{item.collegeName}</p>
                    </div>
                    <div className="space-y-0.5">
                        <p className="text-[8px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">Perf</p>
                        <p className="text-xs sm:text-xs font-bold text-foreground">{item.cgpa} CGPA</p>
                    </div>
                    <div className="space-y-0.5">
                        <p className="text-[8px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">Branch</p>
                        <p className="text-xs sm:text-xs font-bold text-foreground truncate">{item.branch}</p>
                    </div>
                    <div className="space-y-0.5">
                        <p className="text-[8px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">Batch</p>
                        <p className="text-xs sm:text-xs font-bold text-foreground">{item.batch || "N/A"}</p>
                    </div>
                </div>

                <div className="space-y-2.5 p-3 sm:p-4 bg-muted rounded-xl sm:rounded-2xl mb-4 sm:mb-6 border border-slate-100 text-xs sm:text-xs text-muted-foreground break-words">
                    <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <span className="truncate">{item.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <span>{item.phoneNumber}</span>
                    </div>
                </div>

                <div className="flex gap-2 mb-4 sm:mb-6 flex-wrap">
                     <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[8px] sm:text-xs font-bold rounded-md">10th: {item.tenthPercentage}%</span>
                     <span className="px-2 py-1 bg-purple-50 text-purple-600 text-[8px] sm:text-xs font-bold rounded-md">12th: {item.twelfthPercentage}%</span>
                     {item.resumeUrl && (
                        <a href={item.resumeUrl} target="_blank" className="flex items-center gap-1.5 px-2 py-1 bg-green-50 text-green-600 text-[8px] sm:text-xs font-bold rounded-md hover:bg-green-100 transition-colors">
                            <FileText className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Resume
                        </a>
                     )}
                </div>

                <div className="flex gap-2 sm:gap-4 ">
                    <button 
                    onClick={() => onAction(item.id, "approve")}
                    disabled={loading === item.id}
                    className="flex-1 py-2.5 sm:py-3.5 bg-orange-500 text-white rounded-xl sm:rounded-2xl text-xs sm:text-xs font-bold hover:bg-orange-600 transition-all shadow-md shadow-orange-500/10 disabled:opacity-50 flex items-center justify-center gap-4">
                        {loading === item.id ? <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5 sm:size-5" />}
                        Approve
                    </button>
                    <button 
                    onClick={() => onAction(item.id, "reject")}
                    disabled={loading === item.id}
                    className="px-3 sm:px-4 py-2.5 sm:py-3.5 bg-white border border-border text-muted-foreground rounded-xl sm:rounded-2xl text-xs sm:text-xs font-bold hover:text-red-500 hover:border-red-100 transition-all disabled:opacity-50">
                        <Trash2 className="w-3.5 h-3.5 sm:size-5" />
                    </button>
                </div>
            </div>
        </div>
    )
}

function FeedbackCard({ item, onAction, loading, feedbackType }: { item: any, onAction: any, loading: string | null, feedbackType: string }) {
    const getIcon = () => {
        switch(feedbackType) {
            case "student": return <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />;
            case "alumni": return <Shield className="w-5 h-5 sm:w-6 sm:h-6" />;
            case "corporate": return <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />;
        }
    };

    const getColor = () => {
        switch(feedbackType) {
            case "student": return "bg-blue-50 text-blue-600 border-blue-200";
            case "alumni": return "bg-purple-50 text-purple-600 border-purple-200";
            case "corporate": return "bg-orange-50 text-orange-600 border-orange-200";
        }
    };

    const getAuthorEmail = () => {
        if (feedbackType === "alumni") return item.alumni?.personalEmail;
        if (feedbackType === "corporate") return item.recruiter?.email;
        return item.student?.email;
    };

    const getAuthorName = () => {
        if (feedbackType === "alumni") return item.alumni?.name;
        if (feedbackType === "corporate") return item.recruiter?.name;
        return item.student?.name;
    };

    return (
        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-border shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 sm:gap-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl flex items-center justify-center border ${getColor()}`}>
                        {getIcon()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base font-bold text-foreground tracking-tight line-clamp-2">{getAuthorName()}</h3>
                        <p className="text-xs sm:text-xs font-medium text-muted-foreground truncate">{getAuthorEmail()}</p>
                    </div>
                </div>
                <div className={`px-2.5 py-1 rounded-lg text-xs sm:text-xs font-bold uppercase tracking-tight ${getColor()}`}>
                    {feedbackType}
                </div>
            </div>

            <div className="mb-4 sm:mb-6">
                <div className="flex items-center gap-2 text-brand mb-2">
                    <span className="text-xs sm:text-sm font-bold">Rating: </span>
                    <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-lg ${i < item.rating ? "text-yellow-400" : "text-white/80"}`}>
                                ★
                            </span>
                        ))}
                    </div>
                </div>
                <div className="p-3 sm:p-4 bg-muted rounded-xl sm:rounded-2xl border border-slate-100">
                    <p className="text-xs sm:text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                        {item.content}
                    </p>
                </div>
            </div>

            <div className="text-xs sm:text-xs text-muted-foreground mb-4">
                {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>

            <div className="flex gap-2 sm:gap-3">
                <button 
                onClick={() => onAction(item.id, "approve")}
                disabled={loading === item.id}
                className="flex-1 py-2 sm:py-3 bg-brand text-white rounded-lg sm:rounded-xl text-xs sm:text-xs font-bold hover:bg-brand/90 transition-all flex items-center justify-center gap-2 shadow-md shadow-brand/10 disabled:opacity-50">
                     {loading === item.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                     Approve
                </button>
                <button 
                onClick={() => onAction(item.id, "reject")}
                disabled={loading === item.id}
                className="flex-1 py-2 sm:py-3 bg-white border border-border text-muted-foreground rounded-lg sm:rounded-xl text-xs sm:text-xs font-bold hover:bg-red-50 hover:text-red-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                    Reject
                </button>
            </div>
        </div>
    )
}

function VolunteerCard({ item, onAction, loading }: { item: any, onAction: any, loading: string | null }) {
    return (
        <div className="bg-card rounded-2xl sm:rounded-3xl border border-border shadow-sm hover:shadow-md transition-all overflow-hidden font-medium">
            <div className="p-4 sm:p-6">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-surface border border-border overflow-hidden shrink-0 bg-top">
                        <img
                            src={item.student?.profileImageUrl || ""}
                            alt={item.student?.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm sm:text-base text-foreground">{item.student?.name}</h3>
                        <p className="text-xs sm:text-xs text-muted-foreground">{item.designation}</p>
                        <p className="text-xs text-muted-foreground mt-1">{item.student?.enrollmentNumber}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="space-y-0.5">
                        <p className="text-[8px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">Branch</p>
                        <p className="text-xs sm:text-xs text-foreground font-bold">{item.student?.branch}</p>
                    </div>
                    <div className="space-y-0.5">
                        <p className="text-[8px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">Batch</p>
                        <p className="text-xs sm:text-xs text-foreground font-bold">{item.student?.batch}</p>
                    </div>
                    <div className="space-y-0.5">
                        <p className="text-[8px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">CGPA</p>
                        <p className="text-xs sm:text-xs text-foreground font-bold">{item.student?.cgpa?.toFixed(2)}</p>
                    </div>
                    <div className="space-y-0.5">
                        <p className="text-[8px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">Course</p>
                        <p className="text-xs sm:text-xs text-foreground font-bold">{item.student?.course}</p>
                    </div>
                </div>

                <div className="space-y-2.5 p-3 sm:p-4 bg-muted rounded-xl sm:rounded-2xl mb-4 sm:mb-6 border border-slate-100 text-xs sm:text-xs text-muted-foreground break-words">
                    <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <span className="truncate">{item.student?.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <span>{item.student?.phoneNumber || "N/A"}</span>
                    </div>
                </div>

                <div className="text-xs sm:text-xs text-muted-foreground mb-4">
                    Applied: {new Date(item.createdAt).toLocaleDateString()}
                </div>

                <div className="flex gap-2 sm:gap-4">
                    <button
                        onClick={() => onAction(item.id, "approve")}
                        disabled={loading === item.id}
                        className="flex-1 py-2.5 sm:py-3.5 bg-brand text-white rounded-xl sm:rounded-2xl text-xs sm:text-xs font-bold hover:bg-brand/90 transition-all shadow-md shadow-brand/10 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading === item.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                        Approve
                    </button>
                    <button
                        onClick={() => onAction(item.id, "reject")}
                        disabled={loading === item.id}
                        className="px-3 sm:px-4 py-2.5 sm:py-3.5 bg-card border border-border text-muted-foreground rounded-xl sm:rounded-2xl text-xs sm:text-xs font-bold hover:text-destructive hover:border-destructive/30 transition-all disabled:opacity-50"
                    >
                        <Trash2 className="w-3.5 h-3.5 sm:size-5" />
                    </button>
                </div>
            </div>
        </div>
    )
}

function UnverifiedEmailCard({ item, onAction, loading, userType }: { item: any, onAction: any, loading: string | null, userType: string }) {
    const getIcon = () => {
        switch(userType) {
            case "students": return <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />;
            case "alumni": return <Shield className="w-5 h-5 sm:w-6 sm:h-6" />;
            case "external": return <Users className="w-5 h-5 sm:w-6 sm:h-6" />;
        }
    };

    const getColor = () => {
        switch(userType) {
            case "students": return "bg-red-50 text-red-600 border-red-200";
            case "alumni": return "bg-red-50 text-red-600 border-red-200";
            case "external": return "bg-red-50 text-red-600 border-red-200";
        }
    };

    const getEmail = () => {
        return item.personalEmail || item.email || "No email";
    };

    return (
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-border shadow-sm hover:shadow-md transition-all overflow-hidden font-medium">
            <div className="p-4 sm:p-6">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-muted border border-border overflow-hidden shrink-0 bg-top">
                        {item.profileImageUrl ? (
                            <img src={item.profileImageUrl} loading="lazy" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-xl sm:text-2xl text-white/70">
                                {item.name?.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <h3 className="text-base sm:text-xl font-bold text-foreground tracking-tight leading-tight">{item.name}</h3>
                        <p className="text-xs sm:text-xs font-bold text-red-500 mt-1 uppercase tracking-widest flex items-center gap-1.5 leading-none">
                            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500 animate-pulse" />
                            Email Failed
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="space-y-0.5">
                        <p className="text-[8px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">Type</p>
                        <p className="text-xs sm:text-xs font-bold text-foreground capitalize">{userType.slice(0, -1)}</p>
                    </div>
                    <div className="space-y-0.5">
                        <p className="text-[8px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">Branch</p>
                        <p className="text-xs sm:text-xs font-bold text-foreground truncate">{item.branch || "N/A"}</p>
                    </div>
                    <div className="space-y-0.5">
                        <p className="text-[8px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">Batch</p>
                        <p className="text-xs sm:text-xs font-bold text-foreground">{item.batch || "N/A"}</p>
                    </div>
                    <div className="space-y-0.5">
                        <p className="text-[8px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">Perf</p>
                        <p className="text-xs sm:text-xs font-bold text-foreground">{item.cgpa ? `${item.cgpa} CGPA` : "N/A"}</p>
                    </div>
                </div>

                <div className="space-y-2.5 p-3 sm:p-4 bg-red-50 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 border border-red-100 text-xs sm:text-xs text-red-600 break-words">
                    <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-red-400 shrink-0" />
                        <span className="truncate">{getEmail()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-red-400 shrink-0" />
                        <span>{item.phoneNumber || "N/A"}</span>
                    </div>
                    {item.emailVerificationError && (
                        <div className="flex items-start gap-2 mt-2 pt-2 border-t border-red-100">
                            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                            <span className="text-xs">{item.emailVerificationError}</span>
                        </div>
                    )}
                </div>

                <div className="text-xs sm:text-xs text-muted-foreground mb-4">
                    Failed: {new Date(item.createdAt).toLocaleDateString()}
                </div>

                <div className="flex gap-2 sm:gap-3">
                    <button 
                    onClick={() => onAction(item.id, "approve")}
                    disabled={loading === item.id}
                    className="flex-1 py-2.5 sm:py-3.5 bg-brand text-white rounded-xl sm:rounded-2xl text-xs sm:text-xs font-bold hover:bg-brand/90 transition-all shadow-md shadow-brand/10 disabled:opacity-50 flex items-center justify-center gap-2">
                        {loading === item.id ? <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                        <span>Approve</span>
                    </button>
                    <button 
                    onClick={() => onAction(item.id, "reject")}
                    disabled={loading === item.id}
                    className="flex-1 py-2.5 sm:py-3.5 bg-white border border-border text-muted-foreground rounded-xl sm:rounded-2xl text-xs sm:text-xs font-bold hover:text-red-500 hover:border-red-100 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>Delete</span>
                    </button>
                </div>
            </div>
        </div>
    )
}


