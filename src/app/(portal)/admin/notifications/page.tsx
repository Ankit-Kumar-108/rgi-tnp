"use client";

import React, { useState, useEffect } from "react";
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
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Layers,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

interface EmailLog {
  id: string;
  to: string;
  subject: string;
  template: string;
  status: string;
  error: string | null;
  triggeredBy: string;
  createdAt: string;
}

interface Stats {
  totalSent: number;
  sentSuccess: number;
  sentFailed: number;
}

export default function AdminNotificationsPage() {
  const { loading: authLoading, authenticated } = useAuth("admin", "/admin/login");
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState<Stats>({ totalSent: 0, sentSuccess: 0, sentFailed: 0 });

  // Filters & Search
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Compose Broadcast
  const [showCompose, setShowCompose] = useState(false);
  const [composeData, setComposeData] = useState({
    to: "all_students",
    subject: "",
    message: "",
    emailChannel: true,
    inAppChannel: true,
  });
  const [sending, setSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendError, setSendError] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch notifications log
  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/notifications?search=${encodeURIComponent(debouncedSearch)}&status=${statusFilter}&type=${typeFilter}&page=${currentPage}&limit=10`
      );
      const data = await response.json() as {
        success: boolean;
        items: EmailLog[];
        totalCount: number;
        totalPages: number;
        stats: Stats;
      };
      if (data.success) {
        setLogs(data.items);
        setTotalCount(data.totalCount);
        setTotalPages(data.totalPages);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to load logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authenticated) {
      fetchLogs();
    }
  }, [authenticated, debouncedSearch, statusFilter, typeFilter, currentPage]);

  const handleSend = async () => {
    setSending(true);
    setSendError("");
    try {
      const channels: string[] = [];
      if (composeData.emailChannel) channels.push("email");
      if (composeData.inAppChannel) channels.push("in_app");

      if (channels.length === 0) {
        setSendError("Please select at least one delivery channel (Email or In-App).");
        setSending(false);
        return;
      }

      const response = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audience: composeData.to,
          subject: composeData.subject,
          message: composeData.message,
          channels,
        }),
      });

      const resData = await response.json() as { success: boolean; message: string };

      if (resData.success) {
        setSendSuccess(true);
        fetchLogs();
        setTimeout(() => {
          setSendSuccess(false);
          setShowCompose(false);
          setComposeData({
            to: "all_students",
            subject: "",
            message: "",
            emailChannel: true,
            inAppChannel: true,
          });
        }, 2000);
      } else {
        setSendError(resData.message || "Failed to trigger broadcast.");
      }
    } catch (err) {
      setSendError("An unexpected error occurred. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const getTemplateIcon = (template: string) => {
    switch (template) {
      case "placementOpportunityTemplate":
        return <TrendingUp className="w-4 h-4 text-blue-500" />;
      case "custom_broadcast":
        return <Send className="w-4 h-4 text-brand text-[#0F52BA]" />;
      case "studentVerificationSuccess":
      case "verificationSuccessStudentTemplate":
      case "alumniVerificationSuccess":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "driveRejectionTemplate":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Mail className="w-4 h-4 text-slate-500" />;
    }
  };

  const getTemplateBadge = (template: string) => {
    const cleanName = template.replace("Template", "");
    return (
      <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 capitalize">
        {cleanName === "custom_broadcast" ? "Broadcast" : cleanName}
      </span>
    );
  };

  if (authLoading || !authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] dark:bg-[#090D16]">
        <Loader2 className="w-8 h-8 animate-spin text-[#0F52BA]" />
      </div>
    );
  }

  const successRate = stats.totalSent > 0 ? Math.round((stats.sentSuccess / stats.totalSent) * 100) : 100;

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#090D16] text-[#1E293B] dark:text-[#F1F5F9] transition-colors duration-200">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#0D1527]/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="text-[#64748B] hover:text-[#0F52BA] transition-colors duration-150">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0F52BA]/10 rounded-xl flex items-center justify-center shadow-inner">
                <Shield className="w-5 h-5 text-[#0F52BA]" />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                  Notification Center
                </h1>
                <p className="text-xs text-slate-400 dark:text-slate-500">Log auditing and targeted alerts</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowCompose(true)}
            className="bg-[#0F52BA] hover:bg-[#0D4196] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-[#0F52BA]/25 transition-all duration-200 flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Compose Broadcast
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-[#0D1527] rounded-2xl border border-slate-200 dark:border-slate-800/80 p-6 shadow-sm flex items-center gap-5 relative overflow-hidden group hover:shadow-md transition-all duration-200">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#0F52BA]/5 rounded-bl-full pointer-events-none transition-all group-hover:scale-110"></div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 flex-shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Total Emails Triggered</p>
              <h3 className="text-3xl font-black mt-1 text-slate-900 dark:text-white">{stats.totalSent}</h3>
              <p className="text-xs text-slate-400 mt-0.5">Sent since deployment</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0D1527] rounded-2xl border border-slate-200 dark:border-slate-800/80 p-6 shadow-sm flex items-center gap-5 relative overflow-hidden group hover:shadow-md transition-all duration-200">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-bl-full pointer-events-none transition-all group-hover:scale-110"></div>
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 flex-shrink-0">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Delivery Success Rate</p>
              <h3 className="text-3xl font-black mt-1 text-green-600 dark:text-green-500">{successRate}%</h3>
              <p className="text-xs text-slate-400 mt-0.5">{stats.sentSuccess} successfully delivered</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0D1527] rounded-2xl border border-slate-200 dark:border-slate-800/80 p-6 shadow-sm flex items-center gap-5 relative overflow-hidden group hover:shadow-md transition-all duration-200">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-bl-full pointer-events-none transition-all group-hover:scale-110"></div>
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 flex-shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Failed Deliveries</p>
              <h3 className="text-3xl font-black mt-1 text-red-600 dark:text-red-500">{stats.sentFailed}</h3>
              <p className="text-xs text-slate-400 mt-0.5">Check logs for error messages</p>
            </div>
          </div>
        </div>

        {/* Compose Modal */}
        {showCompose && (
          <div className="fixed inset-0 z-50 bg-[#020617]/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowCompose(false)}>
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
                    <div className="w-10 h-10 bg-[#0F52BA]/10 rounded-xl flex items-center justify-center text-[#0F52BA]">
                      <Send className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">New Multi-Channel Broadcast</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Send immediate push alerts or emails to target groups</p>
                    </div>
                  </div>

                  {sendError && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs rounded-xl flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      <span>{sendError}</span>
                    </div>
                  )}

                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[#64748B]">Target Recipient Audience</label>
                      <div className="relative">
                        <select
                          value={composeData.to}
                          onChange={(e) => setComposeData({ ...composeData, to: e.target.value })}
                          className="w-full appearance-none bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 pr-10 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0F52BA] transition-all"
                        >
                          <option value="all_students">All Students</option>
                          <option value="cs_students">Computer Science & IT Branches</option>
                          <option value="mech_students">Mechanical Engineering Branch</option>
                          <option value="batch_2026">2026 Batch Students</option>
                          <option value="batch_2025">2025 Batch Students</option>
                          <option value="all_alumni">All Registered Alumni</option>
                          <option value="all_recruiters">All Registered Recruiters</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[#64748B]">Message Subject</label>
                      <input
                        type="text"
                        value={composeData.subject}
                        onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0F52BA] transition-all"
                        placeholder="Opportunity update, urgent notice, event alert..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[#64748B]">Detailed Body Message</label>
                      <textarea
                        value={composeData.message}
                        onChange={(e) => setComposeData({ ...composeData, message: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0F52BA] transition-all"
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
                            className="w-4 h-4 text-[#0F52BA] focus:ring-[#0F52BA] border-slate-300 dark:border-slate-700 rounded"
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
                            className="w-4 h-4 text-[#0F52BA] focus:ring-[#0F52BA] border-slate-300 dark:border-slate-700 rounded"
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
                        onClick={handleSend}
                        disabled={sending || !composeData.subject || !composeData.message}
                        className="flex-1 bg-[#0F52BA] hover:bg-[#0D4196] text-white py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-[#0F52BA]/25 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-40"
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

        {/* Filters and Controls */}
        <div className="bg-white dark:bg-[#0D1527] rounded-2xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by email or subject..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F52BA] transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-4 w-full md:w-auto justify-end">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="appearance-none bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F52BA]"
              >
                <option value="all">All Delivery Status</option>
                <option value="sent">Sent Success</option>
                <option value="failed">Failed Logs</option>
              </select>
              <Filter className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="appearance-none bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F52BA]"
              >
                <option value="all">All Notification Types</option>
                <option value="placementOpportunityTemplate">Placement Drives</option>
                <option value="custom_broadcast">Broadcast Messages</option>
                <option value="studentVerificationSuccess">User Verifications</option>
                <option value="driveRejectionTemplate">Rejection Notices</option>
              </select>
              <Layers className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Logs Feed */}
        <div className="bg-white dark:bg-[#0D1527] rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <Loader2 className="w-10 h-10 animate-spin text-[#0F52BA] mb-3" />
              <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">Syncing with live delivery records...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800/60 rounded-full flex items-center justify-center text-slate-400 mx-auto mb-4">
                <Bell className="w-8 h-8 opacity-40" />
              </div>
              <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">No logs match your parameters</h4>
              <p className="text-sm text-[#64748B] mt-1 max-w-xs mx-auto">Try resetting active filters or adjusting search queries.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {logs.map((log) => (
                <div key={log.id} className="px-6 py-5 hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors duration-150 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                      {getTemplateIcon(log.template)}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2.5">
                        <p className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                          {log.subject}
                        </p>
                        {getTemplateBadge(log.template)}
                      </div>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                        <span className="font-semibold">Recipient:</span>
                        <span className="text-[#0F52BA] underline dark:text-blue-400">{log.to}</span>
                        <span className="text-slate-300 dark:text-slate-700">|</span>
                        <span>Sender: {log.triggeredBy}</span>
                      </p>
                      {log.error && (
                        <div className="mt-2 text-xs text-red-600 dark:text-red-400 bg-red-500/5 border border-red-500/10 rounded-lg p-2.5 font-mono max-w-xl overflow-x-auto">
                          {log.error}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-left md:text-right flex-shrink-0 flex md:flex-col justify-between items-center md:items-end gap-2 border-t md:border-none pt-3 md:pt-0 border-slate-100 dark:border-slate-800">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 ${
                        log.status === "sent"
                          ? "bg-green-500/10 text-green-600 dark:text-green-400"
                          : "bg-red-500/10 text-red-600 dark:text-red-400"
                      }`}
                    >
                      {log.status === "sent" ? (
                        <>
                          <CheckCircle className="w-3 h-3" />
                          Success
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" />
                          Failed
                        </>
                      )}
                    </span>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-300 dark:text-slate-600" />
                      {new Date(log.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-800/10 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">
                Showing logs {(currentPage - 1) * 10 + 1} - {Math.min(currentPage * 10, totalCount)} of {totalCount}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold px-3">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 disabled:opacity-40 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
