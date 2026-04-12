"use client";

import Nav from "@/components/layout/nav/nav"
import Footer from "@/components/layout/footer/footer"
import { Mail, Loader2, KeyRound, ChevronLeft } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner";

export default function ForgotPassword() {
    const [loading, setLoading] = useState(false);
    
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("student");

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
        <div className="min-h-screen flex flex-col bg-background">
            <Nav />
            <main className="flex-1 flex w-full items-center justify-center p-4 sm:p-6 md:p-8 pt-24 md:pt-32 pb-12">
                <div className="w-full max-w-md bg-background/50 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl shadow-brand/10 border border-brand/10 p-8 relative">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-brand/5 blur-2xl z-0 pointer-events-none"></div>
                    
                    <div className="relative z-10 flex flex-col items-center text-center mb-8">
                        <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center text-brand mb-4">
                            <KeyRound className="w-8 h-8" />
                        </div>
                        <h1 className="text-2xl font-bold text-foreground">Forgot Password?</h1>
                        <p className="text-muted-foreground text-sm mt-2">
                            Enter your email and account type to receive a password reset link.
                        </p>
                    </div>

                    {/* Form content */}

                    <form className="space-y-5 relative z-10" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">Account Type</label>
                            <select 
                                className="w-full py-3 sm:py-3.5 px-4 rounded-xl border border-input bg-background focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all text-sm shadow-sm"
                                value={role} 
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="student">Internal Student (RGI)</option>
                                <option value="external_student">External Student</option>
                                <option value="alumni">Alumni</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">Email</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    <Mail className="w-5 h-5"/>
                                </div>
                                <input 
                                    className="w-full pl-11 pr-4 py-3 sm:py-3.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all text-sm" 
                                    placeholder="Enter your registered email" 
                                    type="email" 
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <button 
                            className="w-full bg-brand hover:bg-brand/90 text-primary-foreground font-bold py-3.5 rounded-xl shadow-[0_4px_14px_0_rgba(var(--brand-rgb),0.39)] hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-50" 
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /><span>Sending...</span></>) : <span>Send Reset Link</span>}
                        </button>
                    </form>

                    <div className="mt-8 text-center relative z-10 border-t border-border pt-6">
                        <Link href="/students/login" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-brand transition-colors">
                            <ChevronLeft className="w-4 h-4" /> Back to Login
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
