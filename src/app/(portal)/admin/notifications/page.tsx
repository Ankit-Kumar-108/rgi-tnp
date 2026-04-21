"use client";

import React, { useState } from "react";
import {
  Bell,
  Shield,
  ArrowLeft,
  Loader2,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Mail,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

// Simulated notification log data (in production, this would come from an API)
const MOCK_LOGS = [
  { id: "1", type: "approval", action: "Drive Approved", recipient: "TCS Recruiter", email: "recruiter@tcs.com", timestamp: "2026-03-24T10:30:00Z", status: "sent" },
  { id: "2", type: "rejection", action: "Drive Rejected", recipient: "Wipro HR", email: "hr@wipro.com", timestamp: "2026-03-24T09:15:00Z", status: "sent" },
  { id: "3", type: "otp", action: "OTP Sent", recipient: "Amit Kumar", email: "amit@rgi.ac.in", timestamp: "2026-03-24T08:45:00Z", status: "sent" },
  { id: "4", type: "approval", action: "Memory Approved", recipient: "Priya Singh", email: "priya@rgi.ac.in", timestamp: "2026-03-23T16:00:00Z", status: "sent" },
  { id: "5", type: "referral", action: "Referral Published", recipient: "All CS Students", email: "broadcast", timestamp: "2026-03-23T14:30:00Z", status: "sent" },
  { id: "6", type: "registration", action: "Student Registered", recipient: "Rahul Verma", email: "rahul@rgi.ac.in", timestamp: "2026-03-23T11:00:00Z", status: "sent" },
  { id: "7", type: "rejection", action: "External Student Rejected", recipient: "Sneha P.", email: "sneha@mit.edu", timestamp: "2026-03-22T17:45:00Z", status: "failed" },
  { id: "8", type: "approval", action: "Referral Approved", recipient: "Alumni Network", email: "broadcast", timestamp: "2026-03-22T10:00:00Z", status: "sent" },
];

type FilterType = "all" | "approval" | "rejection" | "otp" | "referral" | "registration";

export default function AdminNotificationsPage() {
  const { loading: authLoading, authenticated } = useAuth("admin", "/admin/login");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [showCompose, setShowCompose] = useState(false);
  const [composeData, setComposeData] = useState({ to: "all_students", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  const filteredLogs = MOCK_LOGS.filter((log) => {
    if (filterType !== "all" && log.type !== filterType) return false;
    if (search && !log.action.toLowerCase().includes(search.toLowerCase()) && !log.recipient.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleSend = async () => {
    setSending(true);
    // Simulate sending
    await new Promise((r) => setTimeout(r, 1500));
    setSending(false);
    setSendSuccess(true);
    setTimeout(() => {
      setSendSuccess(false);
      setShowCompose(false);
      setComposeData({ to: "all_students", subject: "", message: "" });
    }, 2000);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "approval": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "rejection": return <XCircle className="w-4 h-4 text-red-500" />;
      case "otp": return <Clock className="w-4 h-4 text-yellow-500" />;
      case "referral": return <Send className="w-4 h-4 text-blue-500" />;
      default: return <Mail className="w-4 h-4 text-brand" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const styles: Record<string, string> = {
      approval: "bg-green-500/10 text-green-600",
      rejection: "bg-red-500/10 text-red-500",
      otp: "bg-yellow-500/10 text-yellow-600",
      referral: "bg-blue-500/10 text-blue-600",
      registration: "bg-brand/10 text-brand",
    };
    return styles[type] || "bg-muted text-muted-foreground";
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
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="text-muted-foreground hover:text-brand transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-brand" />
              </div>
              <h1 className="text-lg font-black text-foreground tracking-tight">
                Notification Center
              </h1>
            </div>
          </div>
          <button
            onClick={() => setShowCompose(true)}
            className="bg-brand text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-brand/90 transition-all flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Compose
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Compose Modal */}
        {showCompose && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowCompose(false)}>
            <div className="bg-card rounded-2xl border border-border shadow-2xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
              {sendSuccess ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-foreground">Email Sent!</h3>
                  <p className="text-sm text-muted-foreground mt-1">Your message has been queued for delivery.</p>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-bold text-foreground mb-4">Send Custom Email</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-muted-foreground">To</label>
                      <div className="relative">
                        <select
                          value={composeData.to}
                          onChange={(e) => setComposeData({ ...composeData, to: e.target.value })}
                          className="w-full appearance-none bg-surface border border-border rounded-xl px-4 py-2.5 pr-10 text-sm text-foreground focus:ring-2 focus:ring-brand"
                        >
                          <option value="all_students">All Students</option>
                          <option value="cs_students">CS Branch Students</option>
                          <option value="mech_students">Mechanical Students</option>
                          <option value="all_alumni">All Alumni</option>
                          <option value="all_recruiters">All Recruiters</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-muted-foreground">Subject</label>
                      <input
                        type="text"
                        value={composeData.subject}
                        onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
                        className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-brand"
                        placeholder="Email subject..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-muted-foreground">Message</label>
                      <textarea
                        value={composeData.message}
                        onChange={(e) => setComposeData({ ...composeData, message: e.target.value })}
                        className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-brand"
                        rows={5}
                        placeholder="Write your message..."
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowCompose(false)}
                        className="flex-1 border border-border text-foreground py-2.5 rounded-xl font-bold hover:bg-muted transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSend}
                        disabled={sending || !composeData.subject || !composeData.message}
                        className="flex-1 bg-brand text-white py-2.5 rounded-xl font-bold hover:bg-brand/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        {sending ? "Sending..." : "Send"}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notifications..."
              className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
            />
          </div>
          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as FilterType)}
              className="appearance-none bg-card border border-border rounded-xl px-4 py-2.5 pr-10 text-sm text-foreground focus:ring-2 focus:ring-brand"
            >
              <option value="all">All Types</option>
              <option value="approval">Approvals</option>
              <option value="rejection">Rejections</option>
              <option value="otp">OTP</option>
              <option value="referral">Referrals</option>
              <option value="registration">Registrations</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Notification Log */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No notifications found</p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {filteredLogs.map((log) => (
                <div key={log.id} className="px-5 py-4 hover:bg-muted/30 transition-colors flex items-center gap-4">
                  <div className="w-10 h-10 bg-muted/50 rounded-xl flex items-center justify-center flex-shrink-0">
                    {getTypeIcon(log.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-medium text-sm text-foreground">{log.action}</p>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold capitalize ${getTypeBadge(log.type)}`}>
                        {log.type}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      To: {log.recipient} ({log.email})
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</p>
                    <span className={`text-xs font-bold ${log.status === "sent" ? "text-green-600" : "text-red-500"}`}>
                      {log.status === "sent" ? "✓ Sent" : "✗ Failed"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="text-center text-muted-foreground text-xs mt-6">
          Showing {filteredLogs.length} notification{filteredLogs.length !== 1 ? "s" : ""}
        </p>
      </main>
    </div>
  );
}

