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
  Eye,
  Trash2,
  Archive,
  GraduationCap,
  Mail,
  Phone,
  LinkIcon,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { toast } from "sonner";

type TabKey = "memories" | "referrals" | "feedback";
type FeedbackSubTabKey = "student" | "alumni" | "corporate";

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "memories", label: "Memories", icon: ImageIcon },
  { key: "referrals", label: "Referrals", icon: Users },
  { key: "feedback", label: "Feedbacks", icon: FileText },
];

const FEEDBACKTABS: { key: FeedbackSubTabKey; label: string; icon: React.ElementType }[] = [
  { key: "student", label: "Student Feedback", icon: GraduationCap },
  { key: "alumni", label: "Alumni Feedback", icon: Shield },
  { key: "corporate", label: "Corporate Feedback", icon: Briefcase },
];

export default function PublishedManagementPage() {
  const { loading: authLoading, authenticated } = useAuth("admin", "/admin/login");
  const [activeTab, setActiveTab] = useState<TabKey>("memories");
  const [activeFeedbackSubTab, setActiveFeedbackSubTab] = useState<FeedbackSubTabKey>("student");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [bulkActionLoading, setBulkActionLoading] = useState<"unpublish" | "delete" | null>(null);
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
        const fetchType = activeTab === "feedback" ? `${activeFeedbackSubTab}Feedback` : activeTab;
        const res = await fetch(`/api/admin/published?type=${fetchType}&page=${page}&limit=50`);
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
    loadItems();
  }, [authenticated, activeTab, activeFeedbackSubTab, page]);

  const handleChangeTab = (tab: TabKey) => {
    setActiveTab(tab);
    setPage(1);
    setItems([]);
    setHasMore(true);
    setViewItem(null);
    if (tab !== "feedback") setActiveFeedbackSubTab("student");
  };

  const handleAction = async (id: string, action: "unpublish" | "delete") => {
    setActionLoading(id);
    try {
      const actionType = activeTab === "feedback" ? `${activeFeedbackSubTab}Feedback` : activeTab;
      const res = await fetch("/api/admin/published", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: actionType, id, action }),
      });
      const data = (await res.json()) as { success: boolean; message: string };
      if (data.success) {
        toast.success(data.message);
        setItems((prev) => prev.filter((item) => item.id !== id));
        setTotalCount((prev) => prev - 1);
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

  const handleBulkAction = async (action: "unpublish" | "delete") => {
    if (items.length === 0) return;
    if (!confirm(`Are you sure you want to ${action} ALL ${items.length} items?`)) return;

    setBulkActionLoading(action);
    try {
      const actionType = activeTab === "feedback" ? `${activeFeedbackSubTab}Feedback` : activeTab;
      const res = await fetch("/api/admin/published", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: actionType,
          ids: items.map(i => i.id),
          action
        }),
      });
      const data = (await res.json()) as { success: boolean; message: string };
      if (data.success) {
        toast.success(data.message);
        setItems([]);
        setTotalCount(0);
        setPage(1);
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

  if (authLoading || !authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="fixed w-full top-0 z-50 bg-card/90 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3">
          <Link href="/admin/dashboard" className="text-muted-foreground hover:text-brand transition-colors p-1">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center">
              <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            </div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-foreground flex gap-3">Published <span className="text-brand hidden sm:block">Management</span></h1>
          </div>

          <div className="ml-auto flex gap-1.5 sm:gap-2">
            {items.length > 0 && (
              <>
                <button
                  onClick={() => handleBulkAction("unpublish")}
                  disabled={bulkActionLoading !== null}
                  className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-orange-600 text-white rounded-lg sm:rounded-xl text-xs sm:text-xs font-bold hover:bg-orange-700 transition-all shadow-md shadow-orange-600/10 disabled:opacity-50"
                >
                  {bulkActionLoading === "unpublish" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Archive className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                  <span className="hidden xs:inline">Unpublish All</span>
                  <span className="xs:hidden">Unpublish</span>
                </button>
                <button
                  onClick={() => handleBulkAction("delete")}
                  disabled={bulkActionLoading !== null}
                  className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-card border border-border text-muted-foreground rounded-lg sm:rounded-xl text-xs sm:text-xs font-bold hover:bg-destructive/10 hover:text-destructive transition-all disabled:opacity-50"
                >
                  {bulkActionLoading === "delete" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                  <span className="hidden xs:inline">Delete All</span>
                  <span className="xs:hidden">Delete</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mt-15 mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Category Tabs */}
        <div className="flex gap-1.5 sm:gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2 scrollbar-none">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { handleChangeTab(tab.key) }}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${activeTab === tab.key
                ? "bg-brand text-white shadow-[var(--shadow-brand)]"
                : "bg-card border border-border text-muted-foreground hover:bg-accent"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

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
                <div className="hidden md:block">
                  {feedbackTab.label}
                </div>
                <div className="md:hidden">
                  {feedbackTab.label.split(" ")[0]}
                </div>
              </button>
            ))}
          </div>
        )}

        {loading && page == 1 ? (
          <div className="flex flex-col items-center justify-center py-24 sm:py-32 gap-3 sm:gap-4">
            <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-brand" />
            <p className="text-xs sm:text-sm font-bold text-muted-foreground">Loading...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 sm:py-32 bg-card rounded-2xl sm:rounded-3xl border-2 border-dashed border-border">
            <Eye className="w-8 h-8 sm:w-10 sm:h-10 text-card-foreground/40 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-bold text-foreground">No published items</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">No published content here yet.</p>
          </div>
        ) : (
          <div className={`grid gap-4 sm:gap-6 ${activeTab === "memories" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" : "grid-cols-1 lg:grid-cols-2"}`}>
            {items.map((item, index) => {
              const isLastElement = index === items.length - 1;
              return (
                <div key={item.id}
                  ref={isLastElement ? lastItemRef : null}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-300">
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
                      <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full text-[7px] sm:text-[8px] font-bold uppercase tracking-tight bg-green-500 text-white">
                        LIVE
                      </div>
                    </div>
                  )}
                  {activeTab === "referrals" && <ReferralCard item={item} onAction={handleAction} loading={actionLoading} onViewItem={setViewItem} />}
                  {activeTab === "feedback" && <FeedbackCard item={item} onAction={handleAction} loading={actionLoading} feedbackType={activeFeedbackSubTab} onViewItem={setViewItem} />}
                </div>
              );
            })}
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

      {/* Modal for Memory Preview */}
      {viewItem && activeTab === "memories" && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center p-2 sm:p-4 md:p-8 animate-in fade-in duration-300"
          onClick={() => setViewItem(null)}
        >
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <div
            className="relative bg-card rounded-2xl sm:rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col md:flex-row max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full md:w-2/3 max-h-[60vh] md:max-h-[80vh] bg-black/5 flex items-center justify-center overflow-hidden bg-top">
              <img
                src={viewItem.imageUrl}
                alt={viewItem.title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between max-h-[30vh] md:max-h-[80vh] overflow-y-auto">
              <div>
                <h2 className="text-lg sm:text-2xl font-bold text-foreground mb-4">{viewItem.title}</h2>
                
                {/* Uploader Info */}
                <div className="bg-muted p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-border mb-4">
                  <p className="text-xs sm:text-xs text-muted-foreground font-bold uppercase tracking-wide mb-2">Uploaded By</p>
                  <div className="flex items-center gap-3">
                    {viewItem.student?.profileImageUrl || viewItem.alumni?.profileImageUrl ? (
                      <img 
                        src={viewItem.student?.profileImageUrl || viewItem.alumni?.profileImageUrl}
                        alt="Profile"
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover border border-border shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-200 rounded-lg flex items-center justify-center text-muted-foreground shrink-0">
                        <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm sm:text-base font-bold text-foreground truncate">{viewItem.uploaderName}</p>
                      <p className="text-xs sm:text-xs text-muted-foreground">{viewItem.student?.enrollmentNumber || viewItem.alumni?.enrollmentNumber || 'N/A'}</p>
                      <p className="text-xs sm:text-xs text-muted-foreground font-mono">{viewItem.id}</p>
                    </div>
                  </div>
                </div>
                
                <p className="text-xs sm:text-xs text-muted-foreground">
                  {new Date(viewItem.createdAt).toLocaleDateString()} at {new Date(viewItem.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              <div className="flex gap-2 sm:gap-3 mt-4">
                <button
                  onClick={() => {
                    handleAction(viewItem.id, "unpublish");
                  }}
                  disabled={actionLoading === viewItem.id}
                  className="flex-1 py-2 sm:py-3 bg-orange-600 text-white rounded-lg sm:rounded-xl text-xs sm:text-xs font-bold hover:bg-orange-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {actionLoading === viewItem.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Archive className="w-3.5 h-3.5" />}
                  Unpublish
                </button>
                <button
                  onClick={() => {
                    handleAction(viewItem.id, "delete");
                  }}
                  disabled={actionLoading === viewItem.id}
                  className="flex-1 py-2 sm:py-3 bg-destructive text-white rounded-lg sm:rounded-xl text-xs sm:text-xs font-bold hover:bg-destructive/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {actionLoading === viewItem.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Referral Details */}
      {viewItem && activeTab === "referrals" && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center p-2 sm:p-4 md:p-8 animate-in fade-in duration-300"
          onClick={() => setViewItem(null)}
        >
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <div
            className="relative bg-card rounded-2xl sm:rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in zoom-in-95 duration-300 p-4 sm:p-8 max-h-[90vh] overflow-y-auto bg-top"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 sm:gap-4 mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-50 rounded-lg sm:rounded-2xl flex items-center justify-center text-brand border border-brand/80">
                <Users className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-2xl font-bold text-foreground truncate">{viewItem.companyName}</h2>
                <p className="text-xs sm:text-sm text-muted-foreground">Position: {viewItem.position}</p>
              </div>
            </div>

            {/* Alumni Info */}
            <div className="bg-muted p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-border mb-4">
              <p className="text-xs sm:text-xs text-muted-foreground font-bold uppercase tracking-wide mb-2">Posted By</p>
              <div className="flex items-center gap-3 bg-top">
                {viewItem.alumni?.profileImageUrl && (
                  <img 
                    src={viewItem.alumni.profileImageUrl}
                    alt="Profile"
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover border border-border"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base font-bold text-foreground truncate">{viewItem.alumni?.name}</p>
                  <p className="text-xs sm:text-xs text-muted-foreground">{viewItem.alumni?.personalEmail}</p>
                  <p className="text-xs sm:text-xs text-muted-foreground font-mono">{viewItem.id}</p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs sm:text-sm font-bold text-muted-foreground mb-2">Description</p>
              <p className="text-xs sm:text-sm text-muted-foreground bg-muted p-3 sm:p-4 rounded-lg sm:rounded-xl border border-border leading-relaxed">
                {viewItem.description}
              </p>
            </div>

            {viewItem.applyLink && (
              <div className="mb-4">
                <a href={viewItem.applyLink} target="_blank" className="text-xs sm:text-sm text-brand font-bold hover:underline flex items-center gap-2">
                  <LinkIcon className="w-3.5 h-3.5" />
                  {viewItem.applyLink}
                </a>
              </div>
            )}

            <p className="text-xs sm:text-xs text-muted-foreground mb-4">
              Published: {new Date(viewItem.createdAt).toLocaleDateString()} at {new Date(viewItem.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>

            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => handleAction(viewItem.id, "unpublish")}
                disabled={actionLoading === viewItem.id}
                className="flex-1 py-2 sm:py-3 bg-orange-500 text-white rounded-lg sm:rounded-xl text-xs sm:text-xs font-bold hover:bg-orange-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {actionLoading === viewItem.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Archive className="w-3.5 h-3.5" />}
                Unpublish
              </button>
              <button
                onClick={() => handleAction(viewItem.id, "delete")}
                disabled={actionLoading === viewItem.id}
                className="flex-1 py-2 sm:py-3 bg-red-500 text-white rounded-lg sm:rounded-xl text-xs sm:text-xs font-bold hover:bg-red-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {actionLoading === viewItem.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Feedback Details */}
      {viewItem && activeTab === "feedback" && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center p-2 sm:p-4 md:p-8 animate-in fade-in duration-300"
          onClick={() => setViewItem(null)}
        >
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <div
            className="relative bg-card rounded-2xl sm:rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in zoom-in-95 duration-300 p-4 sm:p-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6">
              <div className="flex items-center gap-2 text-brand mb-3">
                <span className="text-sm sm:text-base font-bold">Rating: </span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-xl ${i < viewItem.rating ? "text-yellow-400" : "text-white/80"}`}>
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <p className="px-3 py-1 bg-muted text-foreground text-xs sm:text-xs font-bold uppercase tracking-tight rounded-lg w-fit">
                {activeFeedbackSubTab} Feedback
              </p>
            </div>

            {/* Author Info */}
            <div className="bg-muted p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-border mb-4">
              <p className="text-xs sm:text-xs text-muted-foreground font-bold uppercase tracking-wide mb-2">Author</p>
              <div className="flex items-center gap-3 bg-top">
                {viewItem.student?.profileImageUrl || viewItem.alumni?.profileImageUrl || viewItem.recruiter?.profileImageUrl ? (
                  <img 
                    src={viewItem.student?.profileImageUrl || viewItem.alumni?.profileImageUrl || viewItem.recruiter?.profileImageUrl}
                    alt="Profile"
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover border border-border"
                  />
                ) : (
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-200 rounded-lg flex items-center justify-center bg-top">
                    {activeFeedbackSubTab === "student" && <GraduationCap className="w-5 h-5 text-muted-foreground" />}
                    {activeFeedbackSubTab === "alumni" && <Shield className="w-5 h-5 text-muted-foreground" />}
                    {activeFeedbackSubTab === "corporate" && <Briefcase className="w-5 h-5 text-muted-foreground" />}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base font-bold text-foreground truncate">
                    {viewItem.student?.name || viewItem.alumni?.name || viewItem.recruiter?.name}
                  </p>
                  <p className="text-xs sm:text-xs text-muted-foreground">
                    {viewItem.student?.email || viewItem.alumni?.personalEmail || viewItem.recruiter?.email}
                  </p>
                  <p className="text-xs sm:text-xs text-muted-foreground font-mono">{viewItem.id}</p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs sm:text-sm font-bold text-muted-foreground mb-2">Feedback</p>
              <p className="text-xs sm:text-sm text-muted-foreground bg-muted p-3 sm:p-4 rounded-lg sm:rounded-xl border border-border leading-relaxed">
                {viewItem.content}
              </p>
            </div>

            <p className="text-xs sm:text-xs text-muted-foreground mb-4">
              Submitted: {new Date(viewItem.createdAt).toLocaleDateString()} at {new Date(viewItem.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>

            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => handleAction(viewItem.id, "unpublish")}
                disabled={actionLoading === viewItem.id}
                className="flex-1 py-2 sm:py-3 bg-orange-500 text-white rounded-lg sm:rounded-xl text-xs sm:text-xs font-bold hover:bg-orange-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {actionLoading === viewItem.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Archive className="w-3.5 h-3.5" />}
                Unpublish
              </button>
              <button
                onClick={() => handleAction(viewItem.id, "delete")}
                disabled={actionLoading === viewItem.id}
                className="flex-1 py-2 sm:py-3 bg-red-500 text-white rounded-lg sm:rounded-xl text-xs sm:text-xs font-bold hover:bg-red-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {actionLoading === viewItem.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ReferralCard({ item, onAction, loading, onViewItem }: { item: any, onAction: any, loading: string | null, onViewItem: any }) {
  return (
    <div 
      onClick={() => onViewItem(item)}
      className="bg-card p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-border shadow-sm hover:shadow-md transition-all cursor-pointer group\">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-lg sm:rounded-2xl flex items-center justify-center text-brand border border-brand/80">
            <Users className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight leading-tight group-hover:text-brand transition-colors">{item.companyName}</h3>
            <p className="text-xs sm:text-xs font-medium text-muted-foreground truncate">Alumni: {item.alumni?.name}</p>
          </div>
        </div>
      </div>

      <div className="mb-4 sm:mb-6">
        <div className="flex items-center gap-2 text-brand mb-2">
          <Briefcase className="w-3.5 h-3.5 font-bold" />
          <span className="text-xs sm:text-sm font-bold">{item.position}</span>
        </div>
        <div className="p-3 sm:p-4 bg-muted rounded-xl sm:rounded-2xl border border-slate-100">
          <p className="text-xs sm:text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>

      {item.applyLink && (
        <div className="mb-4 flex p-3 bg-muted rounded-xl sm:rounded-2xl border border-slate-100">
          <a href={item.applyLink} target="_blank" onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 text-brand text-xs sm:text-xs font-bold uppercase tracking-widest hover:text-brand/80 transition-colors">
            <LinkIcon className="w-3 h-3" />
            Link
          </a>
        </div>
      )}

      <div className="flex gap-2 sm:gap-3">
        <button
          onClick={(e) => { e.stopPropagation(); onAction(item.id, "unpublish"); }}
          disabled={loading === item.id}
          className="flex-1 py-2 sm:py-3 bg-orange-500 text-white rounded-lg sm:rounded-xl text-xs sm:text-xs font-bold hover:bg-orange-600 transition-all flex items-center justify-center gap-2 shadow-md shadow-orange-500/10 disabled:opacity-50"
        >
          {loading === item.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Archive className="w-3.5 h-3.5" />}
          Unpublish
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onAction(item.id, "delete"); }}
          disabled={loading === item.id}
          className="flex-1 py-2 sm:py-3 bg-red-500 text-white rounded-lg sm:rounded-xl text-xs sm:text-xs font-bold hover:bg-red-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading === item.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
          Delete
        </button>
      </div>
    </div>
  );
}

function FeedbackCard({ item, onAction, loading, feedbackType, onViewItem }: { item: any, onAction: any, loading: string | null, feedbackType: string, onViewItem: any }) {
  const getIcon = () => {
    switch (feedbackType) {
      case "student": return <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />;
      case "alumni": return <Shield className="w-5 h-5 sm:w-6 sm:h-6" />;
      case "corporate": return <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />;
    }
  };

  const getColor = () => {
    switch (feedbackType) {
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
    <div 
      onClick={() => onViewItem(item)}
      className="bg-card p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-border shadow-sm hover:shadow-md transition-all cursor-pointer group\">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl flex items-center justify-center border ${getColor()}`}>
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm sm:text-base font-bold text-foreground tracking-tight line-clamp-2 group-hover:text-brand transition-colors">{getAuthorName()}</h3>
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
          onClick={(e) => { e.stopPropagation(); onAction(item.id, "unpublish"); }}
          disabled={loading === item.id}
          className="flex-1 py-2 sm:py-3 bg-orange-500 text-white rounded-lg sm:rounded-xl text-xs sm:text-xs font-bold hover:bg-orange-600 transition-all flex items-center justify-center gap-2 shadow-md shadow-orange-500/10 disabled:opacity-50"
        >
          {loading === item.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Archive className="w-3.5 h-3.5" />}
          Unpublish
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onAction(item.id, "delete"); }}
          disabled={loading === item.id}
          className="flex-1 py-2 sm:py-3 bg-red-500 text-white rounded-lg sm:rounded-xl text-xs sm:text-xs font-bold hover:bg-red-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading === item.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
          Delete
        </button>
      </div>
    </div>
  );
}



