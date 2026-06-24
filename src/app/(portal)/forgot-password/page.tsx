"use client";

import Nav from "@/components/layout/nav/nav"
import Footer from "@/components/layout/footer/footer"
import { Mail, Loader2, KeyRound, ChevronLeft, ShieldCheck, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner";

function ForgotPasswordContent() {
    const [loading, setLoading] = useState(false);
    const searchParams = useSearchParams();
    const roleFromQuery = searchParams?.get("role");
    
    const [email, setEmail] = useState("");
    const [role, setRole] = useState(roleFromQuery || "student");

    useEffect(() => {
        if (roleFromQuery) {
            setRole(roleFromQuery);
        }
    }, [roleFromQuery]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, role }),
            });
            const data = (await res.json()) as any;

            if (!res.ok || !data.success) {
                toast.error(data.message || "Something went wrong");
                return;
            }

            toast.success(data.message || "If an account exists, a reset link was sent to your email.");
            setEmail("");
        } catch {
            toast.error("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
      <div className="relative w-full max-w-xl max-h-[calc(100dvh-7rem)] overflow-y-auto overflow-hidden rounded-[2rem] border border-border bg-card/85 shadow-[0_30px_120px_rgba(16,16,32,0.18)] backdrop-blur-xl">
        <div className="p-4 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-brand">
              <KeyRound className="h-4 w-4" /> Forgot Password
            </div>
            <Link
              href={roleFromQuery === "external_student" ? "/external-students/login" : roleFromQuery === "alumni" ? "/alumni/login" : roleFromQuery === "recruiter" ? "/recruiters/login" : "/students/login"}
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-brand transition-colors"
            >
              <ChevronLeft className="h-4 w-4" /> Back to Login
            </Link>
          </div>

          <div className="mb-5 sm:mb-6 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-lg border border-brand/15 bg-brand/5 px-3 py-2 text-xs font-semibold text-brand">
              <ShieldCheck className="h-4 w-4" /> Secure recovery
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Reset access without stress.
            </h1>
            <p className="max-w-xl text-sm sm:text-base text-muted-foreground leading-relaxed">
              Enter the email connected to your account and we'll send a one-time reset link. It's role-aware and expires automatically.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2.5">
              <label className="text-sm font-semibold text-foreground">Account Type</label>
              {roleFromQuery ? (
                <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/50 px-4 py-3 text-sm font-semibold text-foreground shadow-sm">
                  <span>
                    {roleFromQuery === "student" && "Internal Student (RGI)"}
                    {roleFromQuery === "external_student" && "External Student"}
                    {roleFromQuery === "alumni" && "Alumni"}
                    {roleFromQuery === "recruiter" && "Recruiter"}
                  </span>
                  <span className="rounded-full bg-brand/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-brand">Locked</span>
                </div>
              ) : (
                <select
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm shadow-sm outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/15"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="student">Internal Student (RGI)</option>
                  <option value="external_student">External Student</option>
                  <option value="alumni">Alumni</option>
                  <option value="recruiter">Recruiter</option>
                </select>
              )}
            </div>

            <div className="space-y-2.5">
              <label className="text-sm font-semibold text-foreground">Email</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 rounded-lg bg-brand/10 p-2 text-brand">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  className="w-full rounded-lg border border-input bg-background pl-14 pr-4 py-3 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-brand focus:ring-2 focus:ring-brand/15"
                  placeholder="Enter your registered email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button
              className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-bold text-primary-foreground shadow-(--shadow-brand) transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand/90 disabled:translate-y-0 disabled:opacity-50 sm:py-3.5"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <><Loader2 className="h-5 w-5 animate-spin" /><span>Sending reset link...</span></>
              ) : (
                <><span>Send Reset Link</span><ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></>
              )}
            </button>

            <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm leading-relaxed text-muted-foreground">
              Tip: if the email doesn't arrive, confirm the selected role matches the account you're trying to recover.
            </div>
          </form>
        </div>
      </div>
    );
}

export default function ForgotPassword() {
    return (
        <div className="min-h-screen flex flex-col bg-background overflow-hidden">
            <Nav />
            <main className="relative flex-1 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-12">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-28 -left-24 h-80 w-80 rounded-full bg-brand/10 blur-3xl" />
                    <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-foreground/5 blur-3xl" />
                </div>

                <Suspense fallback={
                    <div className="relative w-full max-w-xl rounded-[2rem] border border-border bg-card/85 shadow-[0_30px_120px_rgba(16,16,32,0.18)] flex items-center justify-center h-96">
                        <Loader2 className="w-8 h-8 animate-spin text-brand" />
                    </div>
                }>
                    <ForgotPasswordContent />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}
