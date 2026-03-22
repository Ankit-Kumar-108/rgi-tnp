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
    GraduationCap
} from "lucide-react"
import Link from "next/link"

export default function StudentLogin() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Nav/>
            <main className="flex-1 flex w-full items-center justify-center p-4 sm:p-6 md:p-8 pt-24 md:pt-32 pb-12">
                <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-background/50 backdrop-blur-sm rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl shadow-brand/10 border border-brand/10">
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
                            <p className="text-lg text-slate-200 font-light max-w-md">Access exclusive internships, upcoming placement drives, premium training resources, and track your applications seamlessly.</p>
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
                    <div className="p-6 sm:p-10 md:p-12 flex flex-col justify-center relative">
                        {/* Decorative blob for right side */}
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-brand/5 blur-2xl z-0 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 rounded-full bg-brand/5 blur-2xl z-0 pointer-events-none"></div>

                        <div className="mb-8 relative z-10">
                            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">Student Portal</h2>
                            <p className="text-muted-foreground text-sm sm:text-base">Please enter your credentials to access your dashboard.</p>
                        </div>
                        <form className="space-y-5 relative z-10" onSubmit={(e) => { e.preventDefault(); window.location.href = '/students/dashboard'; }}>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-foreground">Scholar ID or Email</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                        <Mail className="w-5 h-5"/>
                                    </div>
                                    <input 
                                        className="w-full pl-11 pr-4 py-3 sm:py-3.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all placeholder:text-muted-foreground text-sm sm:text-base shadow-sm" 
                                        placeholder="Enter Scholar ID / E-mail" 
                                        type="text" 
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-semibold text-foreground">Password</label>
                                    <Link className="text-sm font-medium text-brand hover:text-brand/80 transition-colors" href="#">Forgot Password?</Link>
                                </div>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                        <LockKeyhole className="w-5 h-5"/>
                                    </div>
                                    <input 
                                        className="w-full pl-11 pr-4 py-3 sm:py-3.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all placeholder:text-muted-foreground text-sm sm:text-base shadow-sm" 
                                        placeholder="Enter Password" 
                                        type="password" 
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 pt-1 pb-2">
                                <input 
                                    className="w-4 h-4 rounded text-brand border-input focus:ring-brand accent-brand cursor-pointer" 
                                    id="remember" 
                                    type="checkbox" 
                                />
                                <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer select-none">Stay signed in</label>
                            </div>
                            <button 
                                className="w-full bg-brand hover:bg-brand/90 text-primary-foreground font-bold py-3.5 rounded-xl shadow-[0_4px_14px_0_rgba(var(--brand-rgb),0.39)] hover:shadow-[0_6px_20px_rgba(var(--brand-rgb),0.23)] hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 group" 
                                type="submit"
                            >
                                <span>Login</span>
                                <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform"/>
                            </button>
                        </form>
                        
                        <div className="mt-8 pt-6 border-t border-border relative z-10">
                            <p className="text-center text-muted-foreground mb-4 text-sm">Don't have an account yet?</p>
                            <Link href="/students/register" className="w-full py-3 sm:py-3.5 rounded-xl border-2 border-brand/20 text-brand font-bold bg-transparent hover:bg-brand/5 transition-all duration-200 flex items-center justify-center gap-2">
                                Register as Student
                            </Link>
                        </div>
                        
                        {/* Institute Identity */}
                        <div className="mt-10 flex flex-col items-center gap-2 relative z-10">
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
