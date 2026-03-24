"use client";

import React, { useEffect, useState } from "react";
import {
  FileText,
  Briefcase,
  Users,
  Image,
  Shield,
  ArrowLeft,
  Loader2,
  Check,
  X,
  Eye,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

type TabKey = "drives" | "referrals" | "external" | "memories";

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "drives", label: "Drive Requests", icon: Briefcase },
  { key: "referrals", label: "Alumni Referrals", icon: Users },
  { key: "external", label: "External Screening", icon: FileText },
  { key: "memories", label: "Memory Moderation", icon: Image },
];

export default function AdminApprovalsPage() {
  const { loading: authLoading, authenticated } = useAuth("admin", "/admin/login");
  const [activeTab, setActiveTab] = useState<TabKey>("drives");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [viewItem, setViewItem] = useState<any>(null);

  useEffect(() => {
    if (!authenticated) return;
    fetchItems();
  }, [authenticated, activeTab]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/approvals?type=${activeTab}`);
      const data = (await res.json()) as { success: boolean; items: any[] };
      if (data.success) setItems(data.items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: "approve" | "reject") => {
    setActionLoading(id);
    try {
      const res = await fetch("/api/admin/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: activeTab, id, action }),
      });
      const data = (await res.json()) as { success: boolean };
      if (data.success) {
        setItems((prev) => prev.filter((item) => item.id !== id));
        setViewItem(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
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
              Approval Queue
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
              onClick={() => { setActiveTab(tab.key); setItems([]); setViewItem(null); }}
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

        {/* Detail Modal */}
        {viewItem && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setViewItem(null)}>
            <div className="bg-card rounded-2xl border border-border shadow-2xl max-w-lg w-full p-6 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground">Details</h3>
                <button onClick={() => setViewItem(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3 text-sm">
                {Object.entries(viewItem).map(([key, value]) => (
                  key !== "id" && key !== "_count" && (
                    <div key={key} className="flex gap-3">
                      <span className="text-muted-foreground font-medium min-w-[120px] capitalize">{key.replace(/([A-Z])/g, " $1")}:</span>
                      <span className="text-foreground">{typeof value === "object" ? JSON.stringify(value) : String(value)}</span>
                    </div>
                  )
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => handleAction(viewItem.id, "approve")}
                  disabled={actionLoading === viewItem.id}
                  className="flex-1 bg-green-600 text-white py-2.5 rounded-xl font-bold hover:bg-green-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Check className="w-4 h-4" /> Approve
                </button>
                <button
                  onClick={() => handleAction(viewItem.id, "reject")}
                  disabled={actionLoading === viewItem.id}
                  className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <X className="w-4 h-4" /> Reject
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-brand" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Check className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">All clear!</p>
              <p className="text-xs mt-1">No pending items in this category</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    {activeTab === "drives" && (
                      <>
                        <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Company</th>
                        <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Role</th>
                        <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Type</th>
                        <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Date</th>
                        <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">CTC</th>
                        <th className="text-right px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Actions</th>
                      </>
                    )}
                    {activeTab === "referrals" && (
                      <>
                        <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Alumni</th>
                        <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Company</th>
                        <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Position</th>
                        <th className="text-right px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Actions</th>
                      </>
                    )}
                    {activeTab === "external" && (
                      <>
                        <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Name</th>
                        <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">College</th>
                        <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Branch</th>
                        <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">CGPA</th>
                        <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Resume</th>
                        <th className="text-right px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Actions</th>
                      </>
                    )}
                    {activeTab === "memories" && (
                      <>
                        <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Student</th>
                        <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Image</th>
                        <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Uploaded</th>
                        <th className="text-right px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Actions</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {items.map((item: any) => (
                    <tr key={item.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      {activeTab === "drives" && (
                        <>
                          <td className="px-5 py-3.5 font-medium text-foreground">{item.companyName}</td>
                          <td className="px-5 py-3.5 text-muted-foreground">{item.roleName}</td>
                          <td className="px-5 py-3.5">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${item.driveType === "Open" ? "bg-green-500/10 text-green-600" : "bg-blue-500/10 text-blue-600"}`}>
                              {item.driveType}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-muted-foreground">{new Date(item.driveDate).toLocaleDateString()}</td>
                          <td className="px-5 py-3.5 text-foreground font-medium">{item.ctc}</td>
                        </>
                      )}
                      {activeTab === "referrals" && (
                        <>
                          <td className="px-5 py-3.5 font-medium text-foreground">{item.alumni?.name}</td>
                          <td className="px-5 py-3.5 text-muted-foreground">{item.companyName}</td>
                          <td className="px-5 py-3.5 text-muted-foreground">{item.position}</td>
                        </>
                      )}
                      {activeTab === "external" && (
                        <>
                          <td className="px-5 py-3.5 font-medium text-foreground">{item.name}</td>
                          <td className="px-5 py-3.5 text-muted-foreground">{item.collegeName}</td>
                          <td className="px-5 py-3.5 text-muted-foreground">{item.branch}</td>
                          <td className="px-5 py-3.5 font-bold text-foreground">{item.cgpa}</td>
                          <td className="px-5 py-3.5">
                            {item.resumeUrl && (
                              <a href={item.resumeUrl} target="_blank" rel="noreferrer" className="text-brand hover:underline flex items-center gap-1 text-xs">
                                <ExternalLink className="w-3 h-3" /> View
                              </a>
                            )}
                          </td>
                        </>
                      )}
                      {activeTab === "memories" && (
                        <>
                          <td className="px-5 py-3.5 font-medium text-foreground">{item.student?.name}</td>
                          <td className="px-5 py-3.5">
                            <a href={item.imageUrl} target="_blank" rel="noreferrer" className="text-brand hover:underline flex items-center gap-1 text-xs">
                              <Image className="w-3 h-3" /> View Image
                            </a>
                          </td>
                          <td className="px-5 py-3.5 text-muted-foreground text-xs">{new Date(item.createdAt).toLocaleString()}</td>
                        </>
                      )}
                      {/* Action Buttons */}
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setViewItem(item)}
                            className="p-1.5 rounded-lg bg-muted hover:bg-brand/10 text-muted-foreground hover:text-brand transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleAction(item.id, "approve")}
                            disabled={actionLoading === item.id}
                            className="p-1.5 rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors disabled:opacity-50"
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleAction(item.id, "reject")}
                            disabled={actionLoading === item.id}
                            className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="text-center text-muted-foreground text-xs mt-6">
          {items.length} pending item{items.length !== 1 ? "s" : ""}
        </p>
      </main>
    </div>
  );
}
