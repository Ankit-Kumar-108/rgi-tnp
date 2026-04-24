"use client";

import Nav from "@/components/layout/nav/nav"
import Footer from "@/components/layout/footer/footer"
import {
    LogIn,
    Mail,
    LockKeyhole,
    Earth,
    Info,
    Share2,
    GraduationCap,
    Loader2,
    Eye,
    EyeOff
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { saveAuth } from "@/lib/auth-client"
import { toast } from "sonner"

export default function StudentLogin() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        toast.dismiss(); // Dismiss any existing toasts
        setLoading(true);

        try {
            const res = await fetch("/api/auth/login/student-login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = (await res.json()) as { success?: boolean; message?: string; token?: string; student?: any };

            if (!res.ok || !data.success) {
                setError(data.message || "Login failed");
                    toast.error(data.message || "Login failed");
                return;
            }

            saveAuth("student", data.token!, data.student);
            toast.success("Login successful");
            setTimeout(() => {
                const redirect = searchParams.get("redirect");
                const safeRedirect = redirect?.startsWith("/") ? redirect : "/students/dashboard";
                router.push(safeRedirect);
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
            <Nav/>
            <main className="flex-1 flex w-full items-center justify-center p-4 sm:p-6 sm:mt-10 md:mt-0 pt-24 md:pt-32 pb-12 lg:h-screen lg:max-h-screen lg:py-24">
                <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-background/50 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-[var(--shadow-xl)] border border-border lg:h-[85vh] lg:max-h-200 mt-10 overflow-hidden">
                    {/* Left Side: Visual/Branding */}
                    <div className="relative hidden lg:flex flex-col justify-end p-10 xl:p-12 overflow-hidden bg-brand/5">
                        <div 
                            className="absolute inset-0 bg-cover bg-center z-0 opacity-80" 
                            data-alt="Students collaborating and studying on campus" 
                            style={{ backgroundImage: "linear-gradient(180deg, rgba(146, 19, 236, 0.2) 0%, rgba(26, 16, 34, 0.9) 100%), url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop')" }}
                        />
                        <div className="relative z-10 text-white">
                            <div className="mb-4 inline-flex items-center justify-center p-3 bg-brand backdrop-blur-md rounded-2xl text-brand-50 shadow-inner">
                                <GraduationCap className="w-8 h-8"/>
                            </div>
                            <h1 className="text-4xl font-black mb-4 leading-tight">Kickstart Your Career Journey</h1>
                            <p className="text-lg text-white/80 font-light max-w-md">Access exclusive internships, upcoming placement drives, premium training resources, and track your applications seamlessly.</p>
                            <div className="mt-12 flex items-center gap-4">
                                <div className="flex -space-x-4">
                                    <img className="w-11 h-11 rounded-full border-2 border-slate-900 object-cover relative z-30" alt="Student 1" src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&h=100&fit=crop" />
                                    <img className="w-11 h-11 rounded-full border-2 border-slate-900 object-cover relative z-20" alt="Student 2" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" />
                                    <img className="w-11 h-11 rounded-full border-2 border-slate-900 object-cover relative z-10" alt="Student 3" src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop" />
                                </div>
                                <span className="text-sm font-medium text-white/90">Join 5,000+ students analyzing opportunities</span>
                            </div>
                        </div>
                    </div>
                    {/* Right Side: Login Form */}
                    <div className="p-6 sm:p-10 md:p-12 flex flex-col justify-center relative overflow-y-scroll overflow-x-hidden">
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-brand/5 blur-2xl z-0 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 rounded-full bg-brand/5 blur-2xl z-0 pointer-events-none"></div>

                        <div className="mb-8 relative z-10">
                            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2 mt-15">Student Portal Login</h2>
                            <p className="text-muted-foreground text-sm sm:text-base">Please enter your credentials to access your dashboard.</p>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 rounded-xl bg-destructive/10 text-destructive text-sm font-medium relative z-10">
                                {error}
                            </div>
                        )}

                        <form className="space-y-5 relative z-10" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-foreground">Email</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                        <Mail className="w-5 h-5"/>
                                    </div>
                                    <input 
                                        className="w-full pl-11 pr-4 py-3 sm:py-3.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all placeholder:text-muted-foreground text-sm sm:text-base shadow-sm" 
                                        placeholder="Enter your email" 
                                        type="email" 
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-semibold text-foreground">Password</label>
                                    <Link className="text-sm font-medium text-brand hover:text-brand/80 transition-colors" href="/forgot-password">Forgot Password?</Link>
                                </div>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                        <LockKeyhole className="w-5 h-5"/>
                                    </div>
                                    <input 
                                        className="w-full pl-11 pr-12 py-3 sm:py-3.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all placeholder:text-muted-foreground text-sm sm:text-base shadow-sm" 
                                        placeholder="Enter Password" 
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
                            <button 
                                className="w-full bg-brand hover:opacity-90 text-primary-foreground font-bold py-3.5 rounded-full shadow-[var(--shadow-brand)] transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed" 
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /><span>Signing in...</span></>
                                ) : (
                                    <><span>Login</span><LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform"/></>
                                )}
                            </button>
                        </form>
                        
                        <div className="mt-8 pt-6 border-t border-border relative z-10">
                            <p className="text-center text-muted-foreground mb-4 text-sm">Don&apos;t have an account yet?</p>
                            <Link href="/students/register" className="w-full py-3 sm:py-3.5 rounded-full border-2 border-brand/20 text-brand font-bold bg-transparent hover:bg-brand/5 transition-colors duration-200 flex items-center justify-center gap-2">
                                Register as Student
                            </Link>
                        </div>
                        
                        <div className="mt-10 flex flex-col items-center gap-2 relative z-10">
                            <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Official Portal of</p>
                            <span className="text-foreground font-bold text-xs sm:text-sm text-center">RADHARAMAN GROUP OF INSTITUTES</span>
                            <div className="flex gap-4 mt-2">
                                <a className="text-muted-foreground hover:text-brand transition-colors p-2 hover:bg-brand/5 rounded-full" href="#" aria-label="Website"><Earth className="w-4 h-4"/></a>
                                <a className="text-muted-foreground hover:text-brand transition-colors p-2 hover:bg-brand/5 rounded-full" href="#" aria-label="Share"><Share2 className="w-4 h-4"/></a>
                                <a className="text-muted-foreground hover:text-brand transition-colors p-2 hover:bg-brand/5 rounded-full" href="#" aria-label="Information"><Info className="w-4 h-4"/></a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer/>
        </div>
    )
}
