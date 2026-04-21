import React from "react";
import { getToken } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    X,
    FileText,
    Building2,
    ClipboardCheck,
    CalendarDays,
    Users,
    MapPin,
} from "lucide-react";
import { PlacementDrive } from "@/types";

export default function JobDetailsModal({
    drive,
    isOpen,
    onClose,
    onSuccess,
    role = "student",
    publicMode = false,
    readonly = false,
    isRegistered = false,
}: {
    drive: PlacementDrive;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    role?: "student" | "external_student" | "admin" | "recruiter";
    publicMode?: boolean;
    readonly?: boolean;
    isRegistered?: boolean;
}) {
    const router = useRouter();
    const [registering, setRegistering] = useState(false)

    const getDaysLeft = () => {
        const targetDate = new Date(drive.driveDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        targetDate.setHours(0, 0, 0, 0);

        const differenceInMs = targetDate.getTime() - today.getTime();
        const daysLeft = Math.ceil(differenceInMs / (1000 * 60 * 60 * 24));

        if (daysLeft < 0) return "Expired";
        if (daysLeft === 0) return "today";
        if (daysLeft === 1) return "1 day";
        return `${daysLeft} days`;
    }
    if (!isOpen)
        return null;

    const registerForDrive = async () => {
        if (isRegistered) {
            toast("You have already registered for this drive.");
            return;
        }
        if (publicMode) {
            router.push("/external-students/login");
            return;
        }

        setRegistering(true);
        try {
            const token = getToken(role);
            const endpoint = role === "external_student" ? "/api/external/dashboard" : "/api/student/drives";
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ driveId: drive.id }),
            })
            const d = (await res.json()) as any;
            if (d.success) {
                toast.success(d.message || "Successfully registered for drive!");
                onSuccess();
            }
            else {
                toast.error(d.message || "Registration failed");
            }
        } catch (error) {
            toast.error("Registration failed. Please try again.");
        } finally {
            setRegistering(false);
        }
    }
    return (
        // Modal Backdrop
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-background/80 backdrop-blur-md p-4">

            {/* Custom Scrollbar Styles for the Modal Content */}
            <style dangerouslySetInnerHTML={{
                __html: `
          .custom-scrollbar::-webkit-scrollbar { width: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }
        `
            }} />

            {/* Job Details Modal Container */}
            <div className="relative w-full max-w-4xl max-h-[90vh] bg-card rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-brand/20">

                {/* Close Button */}
                <button onClick={onClose} className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors active:scale-95 border border-transparent hover:border-border">
                    <X className="w-5 h-5 text-muted-foreground" />
                </button>

                {/* Modal Content (Scrollable Area) */}
                <div className="overflow-y-auto custom-scrollbar flex-1">

                    {/* Header Section with Company Branding */}
                    <div className="relative px-8 pt-10 pb-8 bg-linear-to-br from-brand/10 to-transparent border-b border-border/50">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            <div className="w-20 h-20 rounded-[1.5rem] bg-background shadow-lg border border-border flex items-center justify-center p-3 overflow-hidden shrink-0">
                                <div className="w-full h-full flex items-center justify-center bg-brand/10 text-brand">
                                    <Building2 className="w-8 h-8" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-bold uppercase tracking-widest">
                                        {drive.jobType || "Full-Time"}
                                    </span>
                                    <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-bold uppercase tracking-widest">
                                        {drive.driveType || "Open"} Campus
                                    </span>
                                    <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold uppercase tracking-widest">
                                        {drive.ctc}
                                    </span>
                                </div>
                                <h3 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
                                    {drive.roleName}
                                </h3>
                                <p className="text-base md:text-lg text-brand font-semibold">
                                    {drive.companyName}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Body Grid */}
                    <div className="px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">

                        {/* Left Column: Description & Criteria */}
                        <div className="lg:col-span-2 space-y-10">

                            {/* Job Description */}
                            <section className="space-y-5">
                                <h4 className="text-xl font-bold flex items-center gap-2 text-foreground">
                                    <FileText className="text-brand w-5 h-5" />
                                    Job Description
                                </h4>
                                <div className="text-muted-foreground leading-relaxed space-y-4 font-light text-sm md:text-base">
                                    <p>
                                        {drive.jobDescription || "No detailed description provided for this drive."}
                                    </p>

                                </div>
                            </section>

                            {/* Eligibility Criteria */}
                            <section className="space-y-5">
                                <h4 className="text-xl font-bold flex items-center gap-2 text-foreground">
                                    <ClipboardCheck className="text-brand w-5 h-5" />
                                    Eligibility Criteria
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-5 rounded-2xl bg-muted/50 border border-border group hover:border-brand/30 transition-colors">
                                        <p className="text-xs font-bold text-brand uppercase tracking-wider mb-1">
                                            Academic Grade
                                        </p>
                                        <p className="text-lg font-bold text-foreground font-mono">CGPA: {drive.minCGPA}</p>
                                        <p className="text-xs text-muted-foreground mt-1">Minimum requirement to apply.</p>
                                    </div>
                                    <div className="p-5 rounded-2xl bg-muted/50 border border-border group hover:border-brand/30 transition-colors">
                                        <p className="text-xs font-bold text-brand uppercase tracking-wider mb-1">
                                            Target Branches
                                        </p>
                                        <p className="text-lg font-bold text-foreground">
                                            {drive.eligibleBranches.split(',').map(branch => branch.trim()).join(', ')}</p>
                                        <p className="text-xs text-muted-foreground mt-1">Eligible candidates only.</p>
                                    </div>
                                    <div className="p-5 rounded-2xl bg-muted/50 border border-border group hover:border-brand/30 transition-colors sm:col-span-2">
                                        <p className="text-xs font-bold text-brand uppercase tracking-wider mb-3">
                                            Eligible Courses
                                        </p>
                                        <p className="text-lg font-bold text-foreground">
                                            {drive.course === "All" ? "All" : (drive.course?.split(',') || []).map(course => course.trim()).join(', ')}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">Eligible candidates only.</p>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Right Column: Key Dates & Info */}
                        <div className="space-y-8">

                            {/* Schedule Card */}
                            <div className="bg-muted/30 p-6 rounded-3xl border border-border space-y-6">
                                <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                                    Important Schedule
                                </h4>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center text-brand shrink-0">
                                            <CalendarDays className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                                Registration Deadline
                                            </p>
                                            <p className="text-sm font-bold text-foreground">{new Date(drive.driveDate).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center text-brand shrink-0">
                                            <Users className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                                Interview Drive
                                            </p>
                                            <p className="text-sm font-bold text-foreground">Tentative</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center text-brand shrink-0">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                                Interview Mode
                                            </p>
                                            <p className="text-sm font-bold text-foreground">{drive.driveType} Campus</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Drive Quick Info */}
                            <div className="p-6 rounded-3xl bg-brand/5 border border-brand/20">
                                <h4 className="text-xs font-black uppercase tracking-widest text-brand mb-5">
                                    What to Expect
                                </h4>
                                <ul className="space-y-4 text-sm font-medium text-foreground">
                                    <li className="flex items-center gap-3">
                                        <span className="w-6 h-6 rounded-full bg-brand text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">
                                            ₹
                                        </span>
                                        CTC: {drive.ctc}
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="w-6 h-6 rounded-full bg-brand text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">
                                            ✓
                                        </span>
                                        Min CGPA: {drive.minCGPA}
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="w-6 h-6 rounded-full bg-brand text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">
                                            📋
                                        </span>
                                        {drive.jobType || "Full-Time"} Role
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sticky Footer CTA */}
                {!readonly && (
                    <div className="px-6 py-5 md:px-8 bg-background border-t border-border flex items-center justify-between gap-6 shrink-0 rounded-b-[2.5rem]">
                        <div className="hidden sm:block">
                            <p className="text-sm font-bold text-foreground">Active Placement Drive</p>
                            <p className="text-xs text-brand font-medium mt-0.5">Register in {getDaysLeft()}</p>
                        </div>
                        <div className="flex-1 sm:flex-none flex flex-col sm:flex-row items-center gap-4">
                            <button
                                onClick={() => registerForDrive()}
                                disabled={registering}
                                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-brand text-primary-foreground font-black shadow-lg shadow-brand/30 hover:shadow-brand/40 transition-all active:scale-95 flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                                {publicMode ?
                                    "Login to Apply"
                                    :
                                    isRegistered ?
                                        "Registered"
                                        :
                                    registering ?
                                        (
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-4 h-4 animate-spin rounded-full border-2 border-t-brand border-r-brand border-b-brand border-l-transparent">
                                                </div>
                                                Registering...
                                            </div>
                                        ) :
                                        "Apply for Role"}
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
