"use client";

import Nav from "@/components/layout/nav/nav"
import Footer from "@/components/layout/footer/footer"
import { Building2, Mail, LockKeyhole, Earth, Info, Share2, Briefcase, User, Phone, BadgeCheck, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RecruiterRegister() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [form, setForm] = useState({
        name: "", email: "", phoneNumber: "", designation: "",
        company: "", password: "", confirmPassword: "",
    });

    const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm(prev => ({ ...prev, [field]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(""); setSuccess("");
        if (form.password !== form.confirmPassword) { setError("Passwords do not match"); return; }
        setLoading(true);
        try {
            const res = await fetch("/api/auth/register/recruiter-register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = (await res.json()) as { success?: boolean; message?: string };
            if (!res.ok || !data.success) { setError(data.message || "Registration failed"); return; }
            setSuccess("Registration successful! Redirecting to login...");
            setTimeout(() => router.push("/recruiters/login"), 2000);
        } catch { setError("Something went wrong."); } finally { setLoading(false); }
    };

    const inputClass = "w-full pl-11 pr-4 py-3 sm:py-3.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all placeholder:text-muted-foreground text-sm sm:text-base shadow-sm";
    const iconClass = "absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground";

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Nav/>
            <main className="flex-1 flex w-full items-center justify-center p-4 sm:p-6 md:p-8 pt-24 md:pt-32 pb-12">
                <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-background/50 backdrop-blur-sm rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl shadow-brand/10 border border-brand/10">
                    <div className="relative hidden lg:flex flex-col justify-end p-10 xl:p-12 overflow-hidden bg-brand/5">
                        <div className="absolute inset-0 bg-cover bg-center z-0 opacity-80" style={{ backgroundImage: "linear-gradient(180deg, rgba(146, 19, 236, 0.2) 0%, rgba(26, 16, 34, 0.9) 100%), url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop')" }} />
                        <div className="relative z-10 text-white">
                            <div className="mb-4 inline-flex items-center justify-center p-3 bg-brand backdrop-blur-md rounded-2xl text-brand-50 shadow-inner"><Briefcase className="w-8 h-8"/></div>
                            <h1 className="text-4xl font-black mb-4 leading-tight">Partner With Excellence</h1>
                            <p className="text-lg text-slate-200 font-light max-w-md">Register your company to access a pool of talented, driven, and industry-ready professionals.</p>
                            <div className="mt-12"><span className="text-sm font-medium text-white/90">Join 500+ top recruiters hiring from us</span></div>
                        </div>
                    </div>
                    <div className="p-6 sm:p-10 md:p-12 flex flex-col justify-center relative max-h-[90vh] overflow-y-auto">
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-brand/5 blur-2xl z-0 pointer-events-none"></div>
                        <div className="mb-6 relative z-10">
                            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">Company Registration</h2>
                            <p className="text-muted-foreground text-sm">Register your organization to access our talent pool.</p>
                        </div>

                        {error && <div className="mb-3 p-3 rounded-xl bg-destructive/10 text-destructive text-sm font-medium relative z-10">{error}</div>}
                        {success && <div className="mb-3 p-3 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-medium relative z-10">{success}</div>}

                        <form className="space-y-4 relative z-10" onSubmit={handleSubmit}>
                            {/* Contact Name */}
                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-foreground">Your Name</label>
                                <div className="relative">
                                    <div className={iconClass}><User className="w-5 h-5"/></div>
                                    <input className={inputClass} placeholder="Full name" type="text" required value={form.name} onChange={update("name")} />
                                </div>
                            </div>
                            {/* Company + Designation */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-foreground">Company Name</label>
                                    <div className="relative">
                                        <div className={iconClass}><Building2 className="w-5 h-5"/></div>
                                        <input className={inputClass} placeholder="Company name" type="text" required value={form.company} onChange={update("company")} />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-foreground">Designation</label>
                                    <div className="relative">
                                        <div className={iconClass}><BadgeCheck className="w-5 h-5"/></div>
                                        <input className={inputClass} placeholder="e.g. HR Manager" type="text" required value={form.designation} onChange={update("designation")} />
                                    </div>
                                </div>
                            </div>
                            {/* Email + Phone */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-foreground">Official Email</label>
                                    <div className="relative">
                                        <div className={iconClass}><Mail className="w-5 h-5"/></div>
                                        <input className={inputClass} placeholder="email@company.com" type="email" required value={form.email} onChange={update("email")} />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-foreground">Phone Number</label>
                                    <div className="relative">
                                        <div className={iconClass}><Phone className="w-5 h-5"/></div>
                                        <input className={inputClass} placeholder="10-digit number" required value={form.phoneNumber} onChange={update("phoneNumber")} />
                                    </div>
                                </div>
                            </div>
                            {/* Password */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-foreground">Password</label>
                                    <div className="relative">
                                        <div className={iconClass}><LockKeyhole className="w-5 h-5"/></div>
                                        <input className={inputClass} placeholder="Min 8 chars" type="password" required value={form.password} onChange={update("password")} />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-foreground">Confirm Password</label>
                                    <div className="relative">
                                        <div className={iconClass}><LockKeyhole className="w-5 h-5"/></div>
                                        <input className={inputClass} placeholder="Re-enter password" type="password" required value={form.confirmPassword} onChange={update("confirmPassword")} />
                                    </div>
                                </div>
                            </div>

                            <button className="w-full bg-brand hover:bg-brand/90 text-primary-foreground font-bold py-3.5 rounded-xl shadow-[0_4px_14px_0_rgba(var(--brand-rgb),0.39)] hover:shadow-[0_6px_20px_rgba(var(--brand-rgb),0.23)] hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 group mt-2 disabled:opacity-50 disabled:cursor-not-allowed" type="submit" disabled={loading}>
                                {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /><span>Registering...</span></>) : (<><span>Register Organization</span><Building2 className="w-5 h-5 group-hover:translate-x-1 transition-transform"/></>)}
                            </button>
                        </form>
                        
                        <div className="mt-6 pt-4 border-t border-border relative z-10">
                            <p className="text-center text-muted-foreground mb-3 text-sm">Already a registered partner?</p>
                            <Link href="/recruiters/login" className="w-full py-3 sm:py-3.5 rounded-xl border-2 border-brand/20 text-brand font-bold bg-transparent hover:bg-brand/5 transition-all duration-200 flex items-center justify-center gap-2">Login Here</Link>
                        </div>
                        
                        <div className="mt-8 flex flex-col items-center gap-2 relative z-10">
                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Official Portal of</p>
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
