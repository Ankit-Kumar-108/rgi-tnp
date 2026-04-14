"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, XCircle, Loader2, KeyRound, Eye, EyeOff } from "lucide-react";
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
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-125 h-125 bg-brand/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-125 h-125 bg-brand/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="max-w-md w-full bg-card/50 backdrop-blur-xl border border-border p-8 rounded-3xl shadow-2xl text-center">
        <div className="w-20 h-20 bg-brand/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          {status === "loading" && <Loader2 className="w-10 h-10 text-brand animate-spin" />}
          {status === "success" && <CheckCircle className="w-10 h-10 text-green-500" />}
          {(status === "form" || status === "error") && <KeyRound className="w-10 h-10 text-brand" />}
        </div>

        <h1 className="text-2xl font-black text-foreground mb-3 tracking-tight">
          {status === "loading" && "Resetting Password..."}
          {status === "success" && "Password Reset!"}
          {(status === "form" || status === "error") && "Set New Password"}
        </h1>

        {status === "success" ? (
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm leading-relaxed">{message}</p>
            <Link
              href={getLoginHref()}
              className="flex items-center justify-center gap-2 w-full py-3 bg-brand text-primary-foreground rounded-xl font-bold hover:bg-brand/90 transition-all shadow-lg shadow-brand/20"
            >
              Go to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {status === "error" && message && (
              <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-sm font-medium text-center">
                {message}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all text-sm pr-12"
                  placeholder="Enter new password (min 8 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all text-sm pr-12"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-3 bg-brand text-primary-foreground rounded-xl font-bold hover:bg-brand/90 transition-all shadow-lg shadow-brand/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {status === "loading" ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Resetting...</>
              ) : (
                "Reset Password"
              )}
            </button>

            <div className="text-center pt-2">
              <Link href={getLoginHref()} className="text-xs text-muted-foreground hover:text-brand transition-colors font-medium">
                Back to Login
              </Link>
            </div>
          </form>
        )}
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