"use client";

import Nav from "@/components/layout/nav/nav"
import Footer from "@/components/layout/footer/footer"
import { UserPlus, Mail, LockKeyhole, User, Earth, Info, Share2, GraduationCap, Phone, Hash, Building2, FileText, Loader2, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { uploadFileToR2 } from "@/lib/upload-r2"

export default function ExternalStudentRegister() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [form, setForm] = useState({
        name: "", email: "", collegeName: "", enrollmentNumber: "", branch: "", course: "",
        cgpa: "", batch: "", phoneNumber: "",
        password: "", confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
    const [resumeFile, setResumeFile] = useState<File | null>(null);

    const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setForm(prev => ({ ...prev, [field]: e.target.value }));

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 5 * 1024 * 1024) {
                setError("Profile image must be smaller than 5MB");
                return;
            }
            setProfileImageFile(file);
        }
    };

    const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 5 * 1024 * 1024) {
                setError("Resume must be smaller than 5MB");
                return;
            }
            setResumeFile(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(""); setSuccess("");
        if (form.password !== form.confirmPassword) { setError("Passwords do not match"); return; }
        if (!resumeFile) { setError("Resume is required for external students"); return; }

        setLoading(true);
        try {
            let profileImageUrl: string | undefined = undefined;
            let resumeUrl: string | undefined = undefined;

            if (profileImageFile) {
                profileImageUrl = await uploadFileToR2(profileImageFile, "profiles");
            }
            resumeUrl = await uploadFileToR2(resumeFile, "resumes");

            const res = await fetch("/api/auth/register/external-student-register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    cgpa: Number(form.cgpa),
                    profileImageUrl,
                    resumeUrl,
                }),
            });
            const data = (await res.json()) as { success?: boolean; message?: string };
            if (!res.ok || !data.success) { setError(data.message || "Registration failed"); return; }
            setSuccess("Registration successful! Check your email to verify your account.");
            setTimeout(() => router.push(`/external-students/login`), 2000);
        } catch { setError("Something went wrong."); } finally { setLoading(false); }
    };

    const inputClass = "w-full pl-11 pr-12 py-3 sm:py-3.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all placeholder:text-muted-foreground text-sm sm:text-base shadow-sm";
    const iconClass = "absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground";

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Nav />
            <main className="flex-1 flex w-full items-center justify-center p-4 sm:p-6 md:p-8 pt-24 md:pt-32 pb-12">
                <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-background/50 backdrop-blur-sm rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl shadow-brand/10 border border-brand/10">
                    <div className="relative hidden lg:flex flex-col justify-end p-10 xl:p-12 overflow-hidden bg-brand/5">
                        <div className="absolute inset-0 bg-cover bg-center z-0 opacity-80" style={{ backgroundImage: "linear-gradient(180deg, rgba(146, 19, 236, 0.2) 0%, rgba(26, 16, 34, 0.9) 100%), url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop')" }} />
                        <div className="relative z-10 text-white">
                            <div className="mb-4 inline-flex items-center justify-center p-3 bg-brand backdrop-blur-md rounded-2xl text-brand-50 shadow-inner"><GraduationCap className="w-8 h-8" /></div>
                            <h1 className="text-4xl font-black mb-4 leading-tight">Join as an External Student</h1>
                            <p className="text-lg text-slate-200 font-light max-w-md">Register to participate in open campus placement drives hosted by RGI.</p>
                        </div>
                    </div>
                    <div className="p-6 sm:p-10 md:p-12 flex flex-col justify-center relative max-h-[90vh] overflow-y-auto">
                        <div className="mb-6 relative z-10">
                            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">Create Account</h2>
                            <p className="text-muted-foreground text-sm">Register as an External Student.</p>
                        </div>
                        {error && <div className="mb-3 p-3 rounded-xl bg-destructive/10 text-destructive text-sm font-medium relative z-10">{error}</div>}
                        {success && <div className="mb-3 p-3 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-medium relative z-10">{success}</div>}

                        <form className="space-y-4 relative z-10" onSubmit={handleSubmit}>
                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-foreground">Full Name</label>
                                <div className="relative">
                                    <div className={iconClass}><User className="w-5 h-5" /></div>
                                    <input className={inputClass} placeholder="Enter your full name" type="text" required value={form.name} onChange={update("name")} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-foreground">Email</label>
                                <div className="relative">
                                    <div className={iconClass}><Mail className="w-5 h-5" /></div>
                                    <input className={inputClass} placeholder="yourname@gmail.com" type="email" required value={form.email} onChange={update("email")} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-foreground">College Name</label>
                                <div className="relative">
                                    <div className={iconClass}><Building2 className="w-5 h-5" /></div>
                                    <input className={inputClass} placeholder="Enter your current college name" required value={form.collegeName} onChange={update("collegeName")} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-foreground">Enrollment Number</label>
                                <div className="relative">
                                    <div className={iconClass}><Hash className="w-5 h-5" /></div>
                                    <input className={inputClass} placeholder="Your university enrollment ID uppercase" required value={form.enrollmentNumber.toUpperCase()} onChange={update("enrollmentNumber")} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-foreground">Branch</label>
                                    <select className={inputClass.replace('pl-11', 'pl-4')} required value={form.branch} onChange={update("branch")}>
                                        <option value="">Select Branch</option>
                                        <option value="Computer Science">Computer Science</option>
                                        <option value="Electronics">Electronics</option>
                                        <option value="Electrical">Electrical</option>
                                        <option value="Mechanical">Mechanical</option>
                                        <option value="Civil">Civil</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-foreground">Course</label>
                                    <select className={inputClass.replace('pl-11', 'pl-4')} required value={form.course} onChange={update("course")}>
                                        <option value="">Select Course</option>
                                        <option value="B.Tech">B.Tech</option>
                                        <option value="BBA">M.Tech</option>
                                        <option value="BCA">MBA</option>
                                        <option value="B.Sc">Diploma</option>
                                        <option value="B.Com">B.Com</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-foreground">Batch</label>
                                    <input className={inputClass.replace('pl-11', 'pl-4')} type="text" placeholder="2024-2028" required value={form.batch} onChange={update("batch")} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-foreground">CGPA</label>
                                    <input className={inputClass.replace('pl-11', 'pl-4')} type="number" step="0.01" min="0" max="10" placeholder="8.5" required value={form.cgpa} onChange={update("cgpa")} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-foreground">Phone Number</label>
                                <div className="relative">
                                    <div className={iconClass}><Phone className="w-5 h-5" /></div>
                                    <input className={inputClass} placeholder="10-digit phone number" required value={form.phoneNumber} onChange={update("phoneNumber")} />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-foreground">Resume (PDF, max 5MB) *</label>
                                <input type="file" accept=".pdf" required onChange={handleResumeChange} className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand/10 file:text-brand hover:file:bg-brand/20 cursor-pointer" />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-foreground">Profile Picture (Optional, max 5MB)</label>
                                <input type="file" accept="image/*" onChange={handleProfileChange} className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand/10 file:text-brand hover:file:bg-brand/20 cursor-pointer" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-foreground">Password</label>
                                    <div className="relative">
                                        <div className={iconClass}><LockKeyhole className="w-5 h-5" /></div>
                                        <input className={inputClass} placeholder="Min 8 chars" type={showPassword ? "text" : "password"} required value={form.password} onChange={update("password")} />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-brand transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-foreground">Confirm</label>
                                    <div className="relative">
                                        <div className={iconClass}><LockKeyhole className="w-5 h-5" /></div>
                                        <input className={inputClass} placeholder="Re-enter password" type={showConfirmPassword ? "text" : "password"} required value={form.confirmPassword} onChange={update("confirmPassword")} />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-brand transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full bg-brand hover:bg-brand/90 text-primary-foreground font-bold py-3.5 rounded-xl shadow-[0_4px_14px_0_rgba(var(--brand-rgb),0.39)] hover:shadow-[0_6px_20px_rgba(var(--brand-rgb),0.23)] flex items-center justify-center gap-2 group mt-2 disabled:opacity-50" type="submit" disabled={loading}>
                                {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /><span>Registering...</span></>) : (<><span>Register</span><UserPlus className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>)}
                            </button>
                        </form>
                        <div className="mt-6 pt-4 border-t border-border">
                            <p className="text-center text-muted-foreground mb-3 text-sm">Already have an account?</p>
                            <Link href="/external-students/login" className="w-full py-3 sm:py-3.5 rounded-xl border-2 border-brand/20 text-brand font-bold bg-transparent hover:bg-brand/5 transition-all duration-200 flex items-center justify-center gap-2">Login Here</Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
