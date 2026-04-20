"use client";

import Nav from "@/components/layout/nav/nav";
import Footer from "@/components/layout/footer/footer";
import {
    UserPlus,
    Mail,
    LockKeyhole,
    User,
    Camera,
    UploadCloud,
    GraduationCap,
    Hash,
    Earth,
    Info,
    Share2,
    X,
    Loader2,
    Eye,
    EyeOff,
} from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { getRegistrationUploadToken, uploadFileToR2 } from "@/lib/upload-r2";
import { toast } from "sonner";

export default function AlumniRegister() {
    const router = useRouter();

    // Form & Request State
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [form, setForm] = useState({
        name: "", personalEmail: "", enrollmentNumber: "",
        course: "", batch: "", branch: "",
        password: "", confirmPassword: "",
    });

    // UI Toggle States
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isProfileImgModalOpen, setIsProfileImgModalOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    // File Management States
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
    const [imgPreviewURL, setImgPreviewURL] = useState<string | null>(null);


    const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setForm(prev => ({ ...prev, [field]: e.target.value }));

    const handleFileSelection = (selectedFile: File) => {
        if (!selectedFile.type.startsWith("image/")) {
            setError("Please upload a valid image file.");
            toast.error("Invalid file type. Please select an image.");
            return;
        }
        if (selectedFile.size > 5 * 1024 * 1024) {
            setError("Profile image must be smaller than 5MB");
            toast.error("File size exceeds 5MB limit.");
            return;
        }
        setProfileImageFile(selectedFile);
        setImgPreviewURL(URL.createObjectURL(selectedFile));
        setError("");
        toast.success("Profile image selected successfully!");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(""); 
        toast.dismiss();
        setSuccess("");
        
        if (form.password !== form.confirmPassword) { 
            setError("Passwords do not match"); 
            toast.error("Passwords do not match. Please re-enter.");
            return; 
        }
        if (!profileImageFile) { 
            setError("Please upload a profile image to continue."); 
            toast.error("Please upload a profile image to continue.");
            return; 
        }

        setLoading(true);
        try {
            const uploadToken = await getRegistrationUploadToken("alumni_registration");
            const profileImageUrl = await uploadFileToR2(profileImageFile, "profiles", { uploadToken });

            const res = await fetch("/api/auth/register/alumni-register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    profileImageUrl,
                }),
            });
            const data = (await res.json()) as { success?: boolean; message?: string };
            
            if (!res.ok || !data.success) { 
                setError(data.message || "Registration failed"); 
                toast.error(data.message || "Registration failed");
                return; 
            }
            
            setSuccess("Registration successful! Check your email for the verification link.");
            toast.success("Registration successful! Check your email for the verification link.");
            setTimeout(() => router.push(`/alumni/login`), 1000);
        } catch (error) {
            console.error("Error during registration", error);
            setError("Something went wrong."); 
            toast.error("Something went wrong.");
        } finally { 
            setLoading(false); 
        }
    };

    const inputClass = "w-full pl-10 sm:pl-11 pr-12 py-2.5 sm:py-3.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all placeholder:text-muted-foreground text-sm sm:text-base shadow-sm";
    const iconClass = "absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-muted-foreground";

    return (
        <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
            <Nav />

            {/* --- Profile Image Modal Overlay --- */}
            {isProfileImgModalOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-md">
                    <div className="w-full max-w-lg bg-card rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl overflow-hidden ring-1 ring-border relative">
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand/10 rounded-full blur-[80px] pointer-events-none -z-10"></div>

                        <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4 flex justify-between items-start relative z-10">
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">Update Profile Photo</h2>
                                <p className="text-muted-foreground text-xs sm:text-sm mt-1 leading-relaxed">Make sure your face is clearly visible and well-lit.</p>
                            </div>
                            <button
                                onClick={() => {
                                    setIsProfileImgModalOpen(false);
                                    if (!profileImageFile) setImgPreviewURL(null);
                                }}
                                className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground shrink-0"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="px-6 sm:px-8 py-4 sm:py-6 space-y-6 sm:space-y-8 relative z-10">
                            <div className="flex justify-center">
                                <div
                                    className="relative group cursor-pointer"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 sm:border-[6px] border-background shadow-xl overflow-hidden bg-muted">
                                        <img
                                            alt="Alumni portrait preview"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            src={imgPreviewURL || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop"}
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-foreground/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                        <Camera className="text-background w-6 h-6 sm:w-8 sm:h-8" />
                                    </div>
                                </div>
                            </div>

                            <div
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    setIsDragging(false);
                                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                        handleFileSelection(e.dataTransfer.files[0]);
                                    }
                                }}
                                className={`relative group border-2 border-dashed rounded-2xl sm:rounded-3xl p-6 sm:p-10 flex flex-col items-center justify-center gap-3 sm:gap-4 transition-all cursor-pointer ${
                                    isDragging ? 'border-brand bg-brand/10 scale-[1.02]' : 'border-border bg-muted/30 hover:border-brand/50 hover:bg-brand/5'
                                }`}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            handleFileSelection(e.target.files[0]);
                                        }
                                    }}
                                    accept="image/png, image/jpeg, image/webp"
                                    className="hidden"
                                />
                                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-brand text-primary-foreground flex items-center justify-center shadow-lg shadow-brand/20 group-hover:scale-110 transition-transform">
                                    <UploadCloud className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <div className="text-center">
                                    <p className="font-bold text-foreground text-sm sm:text-base">Drag and drop your image</p>
                                    <p className="text-muted-foreground text-xs sm:text-sm mt-1">Or <span className="text-brand font-bold hover:underline">click to browse</span></p>
                                </div>
                                <p className="text-[9px] sm:text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1 sm:mt-2 bg-background px-3 py-1 rounded-full border border-border">
                                    Supports JPG, PNG, WEBP (Max 5MB)
                                </p>
                            </div>
                        </div>

                        <div className="px-6 sm:px-8 pb-6 sm:pb-8 flex items-center gap-3 sm:gap-4 relative z-10">
                            <button
                                disabled={!profileImageFile}
                                onClick={() => setIsProfileImgModalOpen(false)}
                                className={`flex-1 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm transition-all ${
                                    profileImageFile 
                                    ? "bg-brand text-primary-foreground shadow-lg shadow-brand/20 hover:scale-[1.02] active:scale-[0.98]" 
                                    : "bg-muted text-muted-foreground cursor-not-allowed"
                                }`}
                            >
                                Save Image
                            </button>
                            <button
                                onClick={() => {
                                    setIsProfileImgModalOpen(false);
                                    if (!profileImageFile) setImgPreviewURL(null);
                                }}
                                className="flex-1 py-3 sm:py-4 bg-background border-2 border-border text-foreground rounded-xl sm:rounded-2xl font-bold text-sm hover:bg-muted transition-all active:scale-[0.98]"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- Main Registration Content --- */}
            <main className="flex-1 flex w-full items-center justify-center p-4 sm:p-6 sm:mt-10 md:mt-0 pt-24 md:pt-32 pb-12 lg:h-screen lg:max-h-screen lg:py-24">
                
                <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-background/50 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-2xl shadow-brand/10 border border-brand/10 lg:h-[85vh] lg:max-h-200 mt-10 overflow-hidden">
                    
                    {/* Left Decorative Side (Hidden on Mobile) */}
                    <div className="relative hidden lg:flex flex-col justify-end p-10 xl:p-12 bg-brand/5 h-full">
                        <div className="absolute inset-0 bg-cover bg-center z-0 opacity-80" style={{ backgroundImage: "linear-gradient(180deg, rgba(146, 19, 236, 0.2) 0%, rgba(26, 16, 34, 0.9) 100%), url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop')" }} />
                        <div className="relative z-10 text-white">
                            <div className="mb-4 inline-flex items-center justify-center p-3 bg-brand backdrop-blur-md rounded-2xl shadow-inner">
                                <GraduationCap className="w-8 h-8" />
                            </div>
                            <h1 className="text-4xl font-black mb-4 leading-tight">Join Your Alumni Community</h1>
                            <p className="text-lg text-slate-200 font-light max-w-md">Create an account to access exclusive opportunities, networking, and stay connected with your alma mater.</p>
                            <div className="mt-12 flex items-center gap-4">
                                <div className="flex -space-x-4">
                                    <img className="w-11 h-11 rounded-full border-2 border-slate-900 object-cover relative z-30" alt="Alumni 1" src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&h=100&fit=crop" />
                                    <img className="w-11 h-11 rounded-full border-2 border-slate-900 object-cover relative z-20" alt="Alumni 2" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" />
                                    <img className="w-11 h-11 rounded-full border-2 border-slate-900 object-cover relative z-10" alt="Alumni 3" src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop" />
                                </div>
                                <span className="text-sm font-medium text-white/90">Join 500+ alumni already registered</span>
                            </div>
                        </div>
                    </div>

                    {/* Form Side with Independent Scroll */}
                    <div className="p-5 sm:p-8 md:p-10 lg:p-12 flex flex-col relative h-full lg:overflow-y-auto lg:overflow-x-hidden custom-scrollbar">
                        
                        <style dangerouslySetInnerHTML={{
                            __html: `
                            .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                            .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                            .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }
                            `
                        }} />

                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-brand/5 blur-2xl z-0 pointer-events-none"></div>
                        
                        <div className="mb-6 relative z-10">
                            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-1 sm:mb-2">Create Account</h2>
                            <p className="text-muted-foreground text-xs sm:text-sm">Register as an Alumni to access the portal.</p>
                        </div>

                        {error && <div className="mb-4 p-3 rounded-xl bg-destructive/10 text-destructive text-sm font-medium relative z-10 border border-destructive/20">{error}</div>}
                        {success && <div className="mb-4 p-3 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-medium relative z-10 border border-green-500/20">{success}</div>}

                        <form className="space-y-3 sm:space-y-4 relative z-10" onSubmit={handleSubmit}>

                            {/* Profile Image Trigger */}
                            <div className="flex justify-center mb-4 sm:mb-6">
                                {imgPreviewURL ? (
                                    <div className="relative group cursor-pointer" onClick={() => setIsProfileImgModalOpen(true)}>
                                        <img src={imgPreviewURL} alt="Profile" className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-brand/20 shadow-md" />
                                        <div className="absolute inset-0 bg-background/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                            <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setIsProfileImgModalOpen(true)}
                                        className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-brand/10 text-brand rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm border border-brand/20 hover:bg-brand/20 hover:scale-[1.02] active:scale-[0.98] transition-all w-full sm:w-auto"
                                    >
                                        <User className="w-4 h-4 sm:w-5 sm:h-5" /> Upload Profile Image *
                                    </button>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs sm:text-sm font-semibold text-foreground">Full Name</label>
                                <div className="relative">
                                    <div className={iconClass}><User className="w-4 h-4 sm:w-5 sm:h-5" /></div>
                                    <input className={inputClass} placeholder="Enter your full name" type="text" required value={form.name} onChange={update("name")} />
                                </div>
                            </div>
                            
                            <div className="space-y-1">
                                <label className="text-xs sm:text-sm font-semibold text-foreground">Personal Email</label>
                                <div className="relative">
                                    <div className={iconClass}><Mail className="w-4 h-4 sm:w-5 sm:h-5" /></div>
                                    <input className={inputClass} placeholder="yourname@gmail.com" type="email" required value={form.personalEmail} onChange={update("personalEmail")} />
                                </div>
                            </div>
                            
                            <div className="space-y-1">
                                <label className="text-xs sm:text-sm font-semibold text-foreground">Enrollment Number</label>
                                <div className="relative">
                                    <div className={iconClass}><Hash className="w-4 h-4 sm:w-5 sm:h-5" /></div>
                                    <input className={inputClass} placeholder="e.g. 0158CS211001" required value={form.enrollmentNumber.toUpperCase()} onChange={update("enrollmentNumber")} />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs sm:text-sm font-semibold text-foreground">Course</label>
                                    <select className={inputClass.replace('pl-10 sm:pl-11', 'pl-3 sm:pl-4')} required value={form.course} onChange={update("course")}>
                                        <option value="">Select Course</option>
                                        <option value="B.Tech">B.Tech</option>
                                        <option value="M.Tech">M.Tech</option>
                                        <option value="MBA">MBA</option>
                                        <option value="Diploma">Diploma</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs sm:text-sm font-semibold text-foreground">Batch (Passing Year)</label>
                                    <input className={inputClass.replace('pl-10 sm:pl-11', 'pl-3 sm:pl-4')} type="text" placeholder="e.g. 2020" required value={form.batch} onChange={update("batch")} />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs sm:text-sm font-semibold text-foreground">Branch</label>
                                <select className={inputClass.replace('pl-10 sm:pl-11', 'pl-3 sm:pl-4')} required value={form.branch} onChange={update("branch")}>
                                    <option value="">Select Branch</option>
                                    <option value="Computer Science">Computer Science</option>
                                    <option value="Mechanical">Mechanical</option>
                                    <option value="Electrical">Electrical</option>
                                    <option value="Civil">Civil</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Information Technology">Information Technology</option>
                                    <option value="Digital Communication">Digital Communication</option>
                                    <option value="Power Systems">Power Systems</option>
                                    <option value="Thermal Engineering">Thermal Engineering</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Finance">Finance</option>
                                    <option value="Human Resource">Human Resource</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-1 sm:pt-2">
                                <div className="space-y-1">
                                    <label className="text-xs sm:text-sm font-semibold text-foreground">Password</label>
                                    <div className="relative">
                                        <div className={iconClass}><LockKeyhole className="w-4 h-4 sm:w-5 sm:h-5" /></div>
                                        <input className={inputClass} placeholder="Min 8 chars" type={showPassword ? "text" : "password"} required value={form.password} onChange={update("password")} />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-brand transition-colors p-1"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs sm:text-sm font-semibold text-foreground">Confirm Password</label>
                                    <div className="relative">
                                        <div className={iconClass}><LockKeyhole className="w-4 h-4 sm:w-5 sm:h-5" /></div>
                                        <input className={inputClass} placeholder="Re-enter password" type={showConfirmPassword ? "text" : "password"} required value={form.confirmPassword} onChange={update("confirmPassword")} />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-brand transition-colors p-1"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number.</p>
                            <button className="w-full bg-brand hover:bg-brand/90 text-primary-foreground font-bold py-3 sm:py-3.5 rounded-xl shadow-[0_4px_14px_0_rgba(var(--brand-rgb),0.39)] hover:shadow-[0_6px_20px_rgba(var(--brand-rgb),0.23)] flex items-center justify-center gap-2 group mt-4 sm:mt-6 disabled:opacity-50 transition-all text-sm sm:text-base shrink-0" type="submit" disabled={loading}>
                                {loading ? (
                                    <><Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /><span>Registering...</span></>
                                ) : (
                                    <><span>Register</span><UserPlus className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" /></>
                                )}
                            </button>
                        </form>

                        <div className="mt-5 sm:mt-6 pt-4 border-t border-border relative z-10 shrink-0">
                            <p className="text-center text-muted-foreground mb-2 sm:mb-3 text-xs sm:text-sm">Already have an account?</p>
                            <Link href="/alumni/login" className="w-full py-2.5 sm:py-3.5 rounded-xl border-2 border-brand/20 text-brand font-bold bg-transparent hover:bg-brand/5 transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base">Login Here</Link>
                        </div>

                        {/* Footer Info Box */}
                        <div className="mt-8 flex flex-col items-center gap-2 relative z-10 shrink-0">
                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Official Portal of</p>
                            <span className="text-foreground font-bold text-xs sm:text-sm text-center">RADHARAMAN GROUP OF INSTITUTES</span>
                            <div className="flex gap-4 mt-2">
                                <a className="text-muted-foreground hover:text-brand transition-colors p-2 hover:bg-brand/5 rounded-full" href="#" aria-label="Website"><Earth className="w-4 h-4" /></a>
                                <a className="text-muted-foreground hover:text-brand transition-colors p-2 hover:bg-brand/5 rounded-full" href="#" aria-label="Share"><Share2 className="w-4 h-4" /></a>
                                <a className="text-muted-foreground hover:text-brand transition-colors p-2 hover:bg-brand/5 rounded-full" href="#" aria-label="Information"><Info className="w-4 h-4" /></a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
