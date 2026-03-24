"use client";

import React, { useEffect, useState } from "react";
import {
  Briefcase,
  Shield,
  ArrowLeft,
  Loader2,
  Settings,
  BarChart3,
  XCircle,
  RotateCcw,
  Calendar,
  Users,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function AdminDrivesPage() {
  const { loading: authLoading, authenticated } = useAuth("admin", "/admin/login");
  const [drives, setDrives] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!authenticated) return;
    fetchDrives();
  }, [authenticated]);

  const fetchDrives = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/drives");
      const data = (await res.json()) as { success: boolean; drives: any[] };
      if (data.success) setDrives(data.drives);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: "close" | "reopen") => {
    setActionLoading(id);
    try {
      const res = await fetch("/api/admin/drives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      const data = (await res.json()) as { success: boolean };
      if (data.success) fetchDrives();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-500/10 text-yellow-600",
      active: "bg-green-500/10 text-green-600",
      completed: "bg-blue-500/10 text-blue-600",
      rejected: "bg-red-500/10 text-red-500",
    };
    return styles[status] || "bg-muted text-muted-foreground";
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
              Drive Management
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card p-5 rounded-2xl border border-border shadow-sm">
            <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center mb-3">
              <Briefcase className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-black text-foreground">{drives.filter(d => d.status === "active").length}</p>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-1">Active</p>
          </div>
          <div className="bg-card p-5 rounded-2xl border border-border shadow-sm">
            <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center mb-3">
              <Calendar className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-2xl font-black text-foreground">{drives.filter(d => d.status === "pending").length}</p>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-1">Pending</p>
          </div>
          <div className="bg-card p-5 rounded-2xl border border-border shadow-sm">
            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center mb-3">
              <BarChart3 className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-2xl font-black text-foreground">{drives.filter(d => d.status === "completed").length}</p>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-1">Completed</p>
          </div>
          <div className="bg-card p-5 rounded-2xl border border-border shadow-sm">
            <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center mb-3">
              <Users className="w-5 h-5 text-brand" />
            </div>
            <p className="text-2xl font-black text-foreground">{drives.reduce((sum, d) => sum + (d.registrationCount || 0), 0)}</p>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-1">Total Registrations</p>
          </div>
        </div>

        {/* Drives Table */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-brand" />
            </div>
          ) : drives.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No drives found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Company</th>
                    <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Role</th>
                    <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Type</th>
                    <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Date</th>
                    <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Registrations</th>
                    <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                    <th className="text-right px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {drives.map((drive: any) => (
                    <tr key={drive.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <div>
                          <p className="font-medium text-foreground">{drive.companyName}</p>
                          <p className="text-[10px] text-muted-foreground">{drive.recruiter?.company}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground">{drive.roleName}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${drive.driveType === "Open" ? "bg-green-500/10 text-green-600" : "bg-blue-500/10 text-blue-600"}`}>
                          {drive.driveType}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground">{new Date(drive.driveDate).toLocaleDateString()}</td>
                      <td className="px-5 py-3.5 font-bold text-foreground">{drive.registrationCount || 0}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold capitalize ${getStatusBadge(drive.status)}`}>
                          {drive.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {drive.status === "active" && (
                            <button
                              onClick={() => handleAction(drive.id, "close")}
                              disabled={actionLoading === drive.id}
                              className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                              title="Close Drive"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                          {drive.status === "completed" && (
                            <button
                              onClick={() => handleAction(drive.id, "reopen")}
                              disabled={actionLoading === drive.id}
                              className="p-1.5 rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors disabled:opacity-50"
                              title="Reopen Drive"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
