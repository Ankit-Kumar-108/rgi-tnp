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
    Phone,
    Hash,
    Building2,
    X,
    Loader2,
    Eye,
    EyeOff,
    FileText
} from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { uploadFileToR2 } from "@/lib/upload-r2";
import { toast } from "sonner";

export default function ExternalStudentRegister() {
    const router = useRouter();

    // Form & Request State
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [form, setForm] = useState({
        name: "", email: "", collegeName: "", enrollmentNumber: "", branch: "", course: "",
        cgpa: "", batch: "", semester: "", phoneNumber: "", password: "", confirmPassword: "",
    });

    // UI Toggle States
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isProfileImgModalOpen, setIsProfileImgModalOpen] = useState(false);
    const [isResumePreviewOpen, setIsResumePreviewOpen] = useState(false); // NEW: Controls the PDF Preview Modal
    const [isDragging, setIsDragging] = useState(false);

    // File Management States
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
    const [imgPreviewURL, setImgPreviewURL] = useState<string | null>(null);
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [resumePreviewURL, setResumePreviewURL] = useState<string | null>(null);

    // year logic states 
    const [year, setYear] = useState<number[]>([]);

        // smart year dropdown generation based on current year
        useEffect(() => {
            const currentYear = new Date().getFullYear();
            const year = Array.from({ length: 4 }, (_, i) => currentYear + i);
            
            setYear(year);
        }, []);

    const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setForm(prev => ({ ...prev, [field]: e.target.value }));

    // Validates and sets the profile image from the modal
    const handleFileSelection = (selectedFile: File) => {
        if (!selectedFile.type.startsWith("image/")) {
            setError("Please upload a valid image file.");
            toast.error("Please upload a valid image file.");
            return;
        }
        if (selectedFile.size > 5 * 1024 * 1024) {
            setError("Profile image must be smaller than 5MB");
            toast.error("Profile image must be smaller than 5MB");

            return;
        }
        setProfileImageFile(selectedFile);
        setImgPreviewURL(URL.createObjectURL(selectedFile));
        setError("");
        toast.success("Profile image uploaded successfully.");
    };

    // Handles the Resume Upload from the Form
    const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.type !== "application/pdf") {
                setError("Please upload a PDF file for your resume.");
                toast.error("Please upload a PDF file for your resume.");
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setError("Resume must be smaller than 5MB");
                toast.error("Resume must be smaller than 5MB");
                return;
            }
            setResumeFile(file);
            setResumePreviewURL(URL.createObjectURL(file));
            setError(""); // Clear error if successful
            toast.success("Resume uploaded successfully.");

        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        toast.dismiss(); // Dismiss any existing toasts
        setSuccess("");

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match");
            toast.error("Passwords do not match");
            return;
        }
        if (!resumeFile) {
            setError("Resume is required");
            toast.error("Resume is required");
            return;
        }
        if (!profileImageFile) {
            setError("Profile image is required");
            toast.error("Profile image is required");
            return;
        }

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

            if (!res.ok || !data.success) {
                setError(data.message || "Registration failed");
                toast.error(data.message || "Registration failed");
                return;
            }

            setSuccess("Registration successful! Check your email to verify your account.");
            toast.success("Registration successful! Check your email to verify your account.");
            setTimeout(() => router.push(`/external-students/login`), 1000);
        } catch (error: any) {
            setError("Something went wrong.");
            toast.error(error.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full pl-10 sm:pl-11 pr-12 py-2.5 sm:py-3.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all placeholder:text-muted-foreground text-sm sm:text-base shadow-sm";
    const iconClass = "absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-muted-foreground";

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Nav />

            {/* Profile Image Modal Overlay */}
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
                                    setImgPreviewURL(null);
                                    setProfileImageFile(null);
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
                                            alt="Student portrait preview"
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
                                className={`relative group border-2 border-dashed rounded-2xl sm:rounded-3xl p-6 sm:p-10 flex flex-col items-center justify-center gap-3 sm:gap-4 transition-all cursor-pointer ${isDragging ? 'border-brand bg-brand/10 scale-[1.02]' : 'border-border bg-muted/30 hover:border-brand/50 hover:bg-brand/5'
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
                                className={`flex-1 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm transition-all ${profileImageFile
                                        ? "bg-brand text-primary-foreground shadow-lg shadow-brand/20 hover:scale-[1.02] active:scale-[0.98]"
                                        : "bg-muted text-muted-foreground cursor-not-allowed"
                                    }`}
                            >
                                Save Image
                            </button>
                            <button
                                onClick={() => {
                                    setIsProfileImgModalOpen(false);
                                    setImgPreviewURL(null);
                                    setProfileImageFile(null);
                                }}
                                className="flex-1 py-3 sm:py-4 bg-background border-2 border-border text-foreground rounded-xl sm:rounded-2xl font-bold text-sm hover:bg-muted transition-all active:scale-[0.98]"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Resume PDF Preview Modal Overlay */}
            {isResumePreviewOpen && resumePreviewURL && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-md">
                    <div className="w-full max-w-4xl bg-card rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl overflow-hidden ring-1 ring-border flex flex-col h-[90vh]">
                        
                        {/* Modal Header */}
                        <div className="px-6 py-4 flex justify-between items-center border-b border-border bg-muted/30">
                            <div>
                                <h2 className="text-lg font-bold text-foreground tracking-tight">Resume Preview</h2>
                                <p className="text-muted-foreground text-xs">{resumeFile?.name}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsResumePreviewOpen(false)}
                                className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground shrink-0"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* PDF Viewer */}
                        <div className="flex-1 w-full bg-muted/10 p-2 sm:p-4">
                            <iframe 
                                src={`${resumePreviewURL}#toolbar=0`} 
                                className="w-full h-full rounded-xl border border-border bg-background"
                                title="Resume Preview"
                            />
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-border bg-background flex justify-end">
                            <button
                                type="button"
                                onClick={() => setIsResumePreviewOpen(false)}
                                className="px-6 py-2.5 bg-brand text-primary-foreground rounded-xl font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                Looks Good
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Registration Content */}
            <main className="flex-1 flex w-full items-center justify-center p-4 sm:p-6 sm:mt-10 md:mt-0 pt-24 md:pt-32 pb-12 lg:h-screen lg:max-h-screen lg:py-24">
                <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-background/50 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-2xl shadow-brand/10 border border-brand/10 lg:h-[85vh] lg:max-h-200 mt-10 overflow-hidden">

                    {/* Left side */}
                    <div className="relative hidden lg:flex flex-col justify-end p-10 xl:p-12 bg-brand/5 h-full">
                        <div className="absolute inset-0 bg-cover bg-center z-0 opacity-80" style={{ backgroundImage: "linear-gradient(180deg, rgba(146, 19, 236, 0.2) 0%, rgba(26, 16, 34, 0.9) 100%), url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop')" }} />
                        <div className="relative z-10 text-white">
                            <div className="mb-4 inline-flex items-center justify-center p-3 bg-brand backdrop-blur-md rounded-2xl shadow-inner">
                                <GraduationCap className="w-8 h-8" />
                            </div>
                            <h1 className="text-4xl font-black mb-4 leading-tight">Join as an External Student</h1>
                            <p className="text-lg text-slate-200 font-light max-w-md">Register to participate in open campus placement drives hosted by RGI.</p>
                        </div>
                    </div>

                    {/* Form Side */}
                    <div className="p-5 sm:p-8 md:p-10 lg:p-12 flex flex-col relative h-full lg:overflow-y-auto custom-scrollbar">
                        
                        <style dangerouslySetInnerHTML={{
                            __html: `
                            .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                            .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                            .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }
                            `
                        }} />

                        <div className="mb-6 relative z-10">
                            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-1 sm:mb-2">Create Account</h2>
                            <p className="text-muted-foreground text-xs sm:text-sm">Register as an External Student.</p>
                        </div>

                        {error && <div className="mb-4 p-3 rounded-xl bg-destructive/10 text-destructive text-sm font-medium relative z-10 border border-destructive/20">{error}</div>}
                        {success && <div className="mb-4 p-3 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-medium relative z-10 border border-green-500/20">{success}</div>}

                        <form className="space-y-3 sm:space-y-4 relative z-10" onSubmit={handleSubmit}>

                            {/* Profile Image Trigger */}
                            <div className="flex justify-center mb-4 sm:mb-6">
                                {imgPreviewURL ? (
                                    <div className="relative group cursor-pointer" onClick={() => setIsProfileImgModalOpen(true)}>
                                        <img src={imgPreviewURL} alt="Profile" className="size-24 sm:size-26 md:size-28 lg:size-32 rounded-full object-cover border-4 border-brand/20 shadow-md" />
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
                                        <User className="w-4 h-4 sm:w-5 sm:h-5" /> Upload Profile Image*
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
                                <label className="text-xs sm:text-sm font-semibold text-foreground">Email</label>
                                <div className="relative">
                                    <div className={iconClass}><Mail className="w-4 h-4 sm:w-5 sm:h-5" /></div>
                                    <input className={inputClass} placeholder="yourname@gmail.com" type="email" required value={form.email} onChange={update("email")} />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs sm:text-sm font-semibold text-foreground">College Name</label>
                                <div className="relative">
                                    <div className={iconClass}><Building2 className="w-4 h-4 sm:w-5 sm:h-5" /></div>
                                    <input className={inputClass} placeholder="Enter your current college name" required value={form.collegeName} onChange={update("collegeName")} />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs sm:text-sm font-semibold text-foreground">Enrollment Number</label>
                                <div className="relative">
                                    <div className={iconClass}><Hash className="w-4 h-4 sm:w-5 sm:h-5" /></div>
                                    <input className={inputClass} placeholder="University enrollment ID" required value={form.enrollmentNumber.toUpperCase()} onChange={update("enrollmentNumber")} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs sm:text-sm font-semibold text-foreground">Branch</label>
                                    <select className={inputClass.replace('pl-10 sm:pl-11', 'pl-3 sm:pl-4')} required value={form.branch} onChange={update("branch")}>
                                        <option value="">Select Branch</option>
                                        <option value="Computer Science">Computer Science</option>
                                        <option value="Electronics">Electronics</option>
                                        <option value="Electrical">Electrical</option>
                                        <option value="Mechanical">Mechanical</option>
                                        <option value="Civil">Civil</option>
                                        <option value="Digital Communication">Digital Communication</option>
                                        <option value="Power Systems">Power Systems</option>
                                        <option value="Thermal Engineering">Thermal Engineering</option>
                                        <option value="Marketing">Marketing</option>
                                        <option value="Finance">Finance</option>
                                        <option value="Human Resource">Human Resource</option>
                                    </select>
                                </div>
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
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs sm:text-sm font-semibold text-foreground">Select Batch</label>
                                    <select className={inputClass.replace('pl-10 sm:pl-11', 'pl-3 sm:pl-4')} required value={form.batch} onChange={update("batch")}>
                                        <option value="">Select</option>
                                        {year.map((y) => (
                                            <option key={y} value={y}>{y}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs sm:text-sm font-semibold text-foreground">Select Semester</label>
                                    <select className={inputClass.replace('pl-10 sm:pl-11', 'pl-3 sm:pl-4')} required value={form.semester} onChange={update("semester")}>
                                        <option value="">Select</option>
                                        {[1,2,3,4,5,6,7,8].map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs sm:text-sm font-semibold text-foreground">CGPA</label>
                                    <input className={inputClass.replace('pl-10 sm:pl-11', 'pl-3 sm:pl-4')} type="number" step="0.01" min="0" max="10" placeholder="8.5" required value={form.cgpa} onChange={update("cgpa")} />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs sm:text-sm font-semibold text-foreground">Phone Number</label>
                                <div className="relative">
                                    <div className={iconClass}><Phone className="w-4 h-4 sm:w-5 sm:h-5" /></div>
                                    <input className={inputClass} placeholder="10-digit number" required value={form.phoneNumber} onChange={update("phoneNumber")} />
                                </div>
                            </div>

                            {/* Resume Upload Field */}
                            <div className="space-y-1">
                                <label className="text-xs sm:text-sm font-semibold text-foreground">Resume (PDF, max 5MB) *</label>
                                {resumeFile ? (
                                    <div className="flex items-center justify-between p-3 rounded-xl border border-brand/30 bg-brand/5">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="p-2 bg-brand/10 rounded-lg text-brand shrink-0">
                                                <FileText className="w-4 h-4" />
                                            </div>
                                            <div className="truncate">
                                                <p className="text-sm font-bold text-foreground truncate">{resumeFile.name}</p>
                                                <p className="text-xs text-muted-foreground">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <button
                                                type="button"
                                                onClick={() => setIsResumePreviewOpen(true)}
                                                className="p-2 text-brand hover:bg-brand/10 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold"
                                            >
                                                <Eye className="w-4 h-4" /> <span className="hidden sm:inline">Preview</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setResumeFile(null);
                                                    setResumePreviewURL(null);
                                                }}
                                                className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <input 
                                        type="file" 
                                        accept=".pdf" 
                                        required 
                                        onChange={handleResumeChange} 
                                        className="w-full text-xs sm:text-sm text-muted-foreground file:mr-3 sm:file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs sm:file:text-sm file:font-bold file:bg-brand/10 file:text-brand hover:file:bg-brand/20 cursor-pointer border border-dashed border-border p-2 rounded-xl transition-all hover:border-brand/50" 
                                    />
                                )}
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

                            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 px-1">
                                Password must contain: uppercase letter, lowercase letter, number, and special character (@$!%*?&)
                            </p>

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
                            <Link href="/external-students/login" className="w-full py-2.5 sm:py-3.5 rounded-xl border-2 border-brand/20 text-brand font-bold bg-transparent hover:bg-brand/5 transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base">Login Here</Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}