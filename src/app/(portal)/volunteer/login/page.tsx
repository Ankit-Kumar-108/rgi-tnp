"use client";

import Nav from "@/components/layout/nav/nav";
import Footer from "@/components/layout/footer/footer";
import {
  LogIn,
  Mail,
  LockKeyhole,
  Heart,
  Loader2,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveAuth } from "@/lib/auth-client";
import { toast } from "sonner";

export default function VolunteerLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    toast.dismiss();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login/student-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as {
        success?: boolean;
        message?: string;
        token?: string;
        student?: any;
      };

      if (!res.ok || !data.success) {
        setError(data.message || "Login failed");
        toast.error(data.message || "Login failed");
        return;
      }

      saveAuth("student", data.token!, data.student);
      toast.success("Login successful! Redirecting to volunteer dashboard...");
      setTimeout(() => {
        router.push("/volunteer/dashboard");
      }, 1000);
    } catch (error: any) {
      console.error("Error during login", error);
      setError("Something went wrong. Please try again.");
      toast.error("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Nav />
      <main className="flex-1 flex w-full items-center justify-center p-4 sm:p-6 sm:mt-10 md:mt-0 pt-24 md:pt-32 pb-12 lg:h-screen lg:max-h-screen lg:py-24">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-background/50 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-2xl shadow-brand/10 border border-brand/10 lg:h-[85vh] lg:max-h-200 mt-10 overflow-hidden">
          {/* Left Side: Visual/Branding */}
          <div className="relative hidden lg:flex flex-col justify-end p-10 xl:p-12 overflow-hidden bg-brand/5">
            <div
              className="absolute inset-0 bg-cover bg-center z-0 opacity-80"
              data-alt="Volunteers helping and supporting community"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, rgba(146, 19, 236, 0.2) 0%, rgba(26, 16, 34, 0.9) 100%), url('https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop')",
              }}
            />
            <div className="relative z-10 text-white">
              <div className="mb-4 inline-flex items-center justify-center p-3 bg-brand backdrop-blur-md rounded-2xl text-brand-50 shadow-inner">
                <Heart className="w-8 h-8" />
              </div>
              <h1 className="text-4xl font-black mb-4 leading-tight">
                Make a Difference
              </h1>
              <p className="text-lg text-slate-200 font-light max-w-md">
                Join our volunteer team, support fellow students, upload drive
                photos, and help shape the future of our T&P Cell.
              </p>
              <div className="mt-12 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 text-brand" />
                  </div>
                  <span className="text-sm font-medium text-white/90">
                    Upload drive images
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 text-brand" />
                  </div>
                  <span className="text-sm font-medium text-white/90">
                    Help students in placements
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 text-brand" />
                  </div>
                  <span className="text-sm font-medium text-white/90">
                    Gain leadership experience
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Login Form */}
          <div className="p-6 sm:p-10 md:p-12 flex flex-col justify-center relative overflow-y-scroll overflow-x-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-brand/5 blur-2xl z-0 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 rounded-full bg-brand/5 blur-2xl z-0 pointer-events-none"></div>

            <div className="mb-8 relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center">
                  <Heart className="w-5 h-5 text-brand" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">
                  Volunteer Login
                </h2>
              </div>
              <p className="text-muted-foreground text-sm sm:text-base">
                Admin-assigned volunteers only. Use your student credentials to login.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-foreground">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-brand transition-colors" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-12 pr-4 py-3 bg-muted border border-border rounded-xl focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-bold text-foreground">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-brand hover:underline font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative group">
                  <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-brand transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3 bg-muted border border-border rounded-xl focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all text-foreground placeholder:text-muted-foreground"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-600 font-bold text-xs">!</span>
                  </div>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-brand text-primary-foreground rounded-xl font-bold hover:bg-brand/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Login
                  </>
                )}
              </button>

              {/* Admin Assignment Info */}
              <div className="p-4 bg-brand/5 border border-brand/20 rounded-xl">
                <p className="text-xs text-foreground font-medium mb-2">
                  💡 Admin-Only Assignment
                </p>
                <p className="text-xs text-muted-foreground">
                  You can only login if you've been assigned as a volunteer by an administrator. If you believe you should have access, contact your T&P Cell administrator.
                </p>
              </div>

              {/* Student Login Link */}
              <p className="text-xs text-muted-foreground text-center">
                Not a volunteer yet?{" "}
                <Link
                  href="/students/login"
                  className="text-brand font-bold hover:underline"
                >
                  Login as Student
                </Link>
              </p>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
