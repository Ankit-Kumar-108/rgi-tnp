"use client";

import Nav from "@/components/layout/nav/nav"
import Footer from "@/components/layout/footer/footer"
import { LockKeyhole, Loader2, KeyRound, ChevronLeft, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function ResetPassword() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const role = searchParams.get("role");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (!token || !role) {
            setError("Invalid or missing reset token. Please request a new password reset link.");
        }
    }, [token, role]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        
        if (!token || !role) {
            setError("Missing token or role in the URL");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, role, password }),
            });
            const data = (await res.json()) as any;

            if (!res.ok || !data.success) {
                setError(data.message || "Something went wrong");
                return;
            }

            setSuccess("Password has been reset successfully! Redirecting to login...");
            
            // Redirect based on role
            setTimeout(() => {
                if (role === "student") router.push("/students/login");
                else if (role === "external_student") router.push("/external-students/login");
                else if (role === "alumni") router.push("/alumni/login");
                else router.push("/");
            }, 3000);

        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Nav />
            <main className="flex-1 flex w-full items-center justify-center p-4 sm:p-6 md:p-8 pt-24 md:pt-32 pb-12">
                <div className="w-full max-w-md bg-background/50 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl shadow-brand/10 border border-brand/10 p-8 relative">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-brand/5 blur-2xl z-0 pointer-events-none"></div>
                    
                    <div className="relative z-10 flex flex-col items-center text-center mb-8">
                        <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center text-brand mb-4">
                            <KeyRound className="w-8 h-8" />
                        </div>
                        <h1 className="text-2xl font-bold text-foreground">Set New Password</h1>
                        <p className="text-muted-foreground text-sm mt-2">
                            Please create a strong password that you do not use on other websites.
                        </p>
                    </div>

                    {error && <div className="mb-4 p-3 rounded-xl bg-destructive/10 text-destructive text-sm font-medium">{error}</div>}
                    {success && <div className="mb-4 p-3 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-medium">{success}</div>}

                    {!success && (!token || !role) ? (
                        <div className="mt-8 text-center relative z-10 pt-6">
                            <Link href="/forgot-password" className="inline-flex items-center gap-2 text-sm font-medium text-brand hover:text-brand/80 transition-colors">
                                <ChevronLeft className="w-4 h-4" /> Go back to Forgot Password
                            </Link>
                        </div>
                    ) : null}

                    {(!error || error === "") && !success && token && role ? (
                        <form className="space-y-5 relative z-10" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-foreground">New Password</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                        <LockKeyhole className="w-5 h-5"/>
                                    </div>
                                    <input 
                                        className="w-full pl-11 pr-12 py-3 sm:py-3.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all text-sm" 
                                        placeholder="Min 8 characters" 
                                        type={showPassword ? "text" : "password"} 
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-brand transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-foreground">Confirm New Password</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                        <LockKeyhole className="w-5 h-5"/>
                                    </div>
                                    <input 
                                        className="w-full pl-11 pr-12 py-3 sm:py-3.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all text-sm" 
                                        placeholder="Re-enter password" 
                                        type={showConfirmPassword ? "text" : "password"} 
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-brand transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <button 
                                className="w-full bg-brand hover:bg-brand/90 text-primary-foreground font-bold py-3.5 rounded-xl shadow-[0_4px_14px_0_rgba(var(--brand-rgb),0.39)] hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-50" 
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /><span>Saving...</span></>) : <span>Reset Password</span>}
                            </button>
                        </form>
                    ) : null}
                </div>
            </main>
            <Footer />
        </div>
    );
}
