"use client";
export const runtime = "edge";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import DriveImageManagement from "@/components/admin/DriveImageManagement";
import { ArrowLeft, Shield, Loader2 } from "lucide-react";
import Link from "next/link";

export default function DriveImagesAdminPage() {
  const { loading: authLoading, authenticated } = useAuth("admin", "/admin/login");
  const router = useRouter();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top navigation bar */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/admin/dashboard")}
              className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center hover:bg-muted/80 transition-colors cursor-pointer"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-brand" />
              </div>
              <div>
                <h1 className="text-lg font-black text-foreground tracking-tight">
                  Drive Images
                </h1>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                  Admin Panel • RGI T&P Cell
                </p>
              </div>
            </div>
          </div>
          <Link
            href="/admin/dashboard"
            className="text-sm text-muted-foreground hover:text-foreground font-medium transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <DriveImageManagement />
      </main>
    </div>
  );
}

