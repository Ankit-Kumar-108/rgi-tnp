"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Loader2, KeyRound, Eye, EyeOff, LockKeyhole, ShieldCheck, ArrowRight, Sparkles, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState<"form" | "loading" | "success" | "error">("form");
  const [message, setMessage] = useState("");

  const token = searchParams?.get("token");
  const role = searchParams?.get("role") || "student";
  const tokenMissing = !token;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!token) {
      toast.error("Invalid reset link. Please request a new one.");
      return;
    }

    setLoading(true);
    setStatus("loading");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, role }),
      });
      const data = await res.json() as any;

      if (data.success) {
        setStatus("success");
        setMessage(data.message || "Your password has been reset successfully. Redirecting to login...");
        toast.success(data.message || "Password reset successfully!");
        setTimeout(() => {
          router.push(getLoginHref());
        }, 1500);
      } else {
        setStatus("error");
        setMessage(data.message || "Reset failed. The link may have expired.");
        toast.error(data.message || "Reset failed. The link may have expired.");
      }
    } catch {
      setStatus("error");
      setMessage("An error occurred. Please try again later.");
      toast.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getLoginHref = () => {
    if (role === "external_student") return "/external-students/login";
    if (role === "alumni") return "/alumni/login";
    return "/students/login";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black/60 p-4 sm:p-6 overflow-hidden">
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 right-0 h-80 w-80 rounded-full bg-brand/10 blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-foreground/5 blur-[120px] translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative w-full max-w-xl max-h-[calc(100dvh-7rem)] overflow-y-auto overflow-hidden rounded-lg border border-border bg-card shadow-[0_30px_120px_rgba(16,16,32,0.18)] backdrop-blur-xl">
        <div className="p-4 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-brand">
              <KeyRound className="h-4 w-4" /> Reset Password
            </div>
            <Link href={getLoginHref()} className="text-sm font-medium text-brand/60 hover:text-brand transition-colors duration-300">
              Back to Login
            </Link>
          </div>

          <div className="mb-5 sm:mb-6 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-lg border border-brand/15 bg-brand/5 px-3 py-2 text-xs font-semibold text-brand">
              <LockKeyhole className="h-4 w-4" /> Secure recovery
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Create a new password.
            </h1>
            <p className="max-w-xl text-sm sm:text-base text-muted-foreground leading-relaxed">
              Choose a strong password you haven’t used before. This will update the account tied to your reset link.
            </p>
          </div>

          {tokenMissing && status !== "success" ? (
              <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-5 sm:p-6 text-left">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-amber-500/10 p-3 text-amber-500">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Missing reset token</h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    Open this page from the reset link sent to your email. If the link is missing, request a fresh one.
                  </p>
                </div>
              </div>
              <div className="mt-5">
                <Link href="/forgot-password" className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-bold text-primary-foreground transition-all hover:bg-brand/90">
                  Request a new link <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ) : status === "success" ? (
            <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-5 sm:p-8 text-left">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-green-500/10 p-3 text-green-500">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black tracking-tight text-foreground">Password updated</h3>
                  <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">{message}</p>
                </div>
              </div>
              <div className="mt-6">
                <Link href={getLoginHref()} className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-bold text-primary-foreground shadow-(--shadow-brand) transition-all hover:-translate-y-0.5 hover:bg-brand/90 sm:py-3.5">
                  Go to Login <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {status === "error" && message && (
                <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm font-medium text-destructive">
                  {message}
                </div>
              )}

              <div className="space-y-2.5">
                <label className="text-sm font-semibold text-foreground">Account Type</label>
                <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/50 px-4 py-3 text-sm font-semibold text-foreground">
                  <span>
                    {role === "student" && "Internal Student (RGI)"}
                    {role === "external_student" && "External Student"}
                    {role === "alumni" && "Alumni"}
                    {role === "recruiter" && "Recruiter"}
                  </span>
                  <span className="rounded-full bg-brand/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-brand">
                    From email
                  </span>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2.5 sm:col-span-2">
                  <label className="text-sm font-semibold text-foreground">New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full rounded-lg border border-input bg-background px-4 py-3 pr-12 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-brand focus:ring-2 focus:ring-brand/15"
                      placeholder="Enter new password (min 8 characters)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2.5 sm:col-span-2">
                  <label className="text-sm font-semibold text-foreground">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      className="w-full rounded-lg border border-input bg-background px-4 py-3 pr-12 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-brand focus:ring-2 focus:ring-brand/15"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-bold text-primary-foreground shadow-(--shadow-brand) transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand/90 disabled:translate-y-0 disabled:opacity-50 sm:py-3.5"
              >
                {status === "loading" ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> Resetting...</>
                ) : (
                  <><span>Reset Password</span><ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></>
                )}
              </button>

              <div className="rounded-lg border border-border bg-brand/5 p-4 text-sm text-muted-foreground leading-relaxed">
                💡Tip: use a unique password with letters, numbers, and symbols for better account security.
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}