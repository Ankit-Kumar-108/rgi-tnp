"use client";

import React, { useEffect, useState } from "react";
import {
  UserPlus,
  GraduationCap,
  TrendingUp,
  Send,
  MessageSquareShare,
  Loader2,
  ChevronRight,
  Briefcase,
  CheckCircle,
  RefreshCw,
  X,
  AlertCircle,
  Heart,
  Building2,
  Link2,
  FileText,
  Users,
  Camera,
  Trash2,
  Upload,
  AlertTriangle,
  CalendarDays,
  Clock,
  UserCheck,
  UploadCloud
} from "lucide-react";
import Nav from "@/components/layout/nav/nav";
import Footer from "@/components/layout/footer/footer";
import { useAuth } from "@/hooks/useAuth";
import { getToken, logout } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DriveRegistration, Memory, PlacementDrive, Student } from "@/types";
import { uploadFileToR2 } from "@/lib/upload-r2";
import NotificationBell from "@/components/ui/NotificationBell";
import dynamic from "next/dynamic";
import AlumniDashboardHeader from "@/components/alumni/dashboard/AlumniDashboardHeader";
import AlumniProfileCompletionForm from "@/components/alumni/dashboard/AlumniProfileCompletionForm";
import AlumniDashboardOverview from "@/components/alumni/dashboard/AlumniDashboardOverview";

const JobDetailsModal = dynamic(
  () => import("@/components/forms/studentApplyModal/modal"),
  { ssr: false }
);

const FB_EMOJIS = [
  { val: 1, icon: "😡", label: "Terrible" },
  { val: 2, icon: "🙁", label: "Poor" },
  { val: 3, icon: "😐", label: "Okay" },
  { val: 4, icon: "🙂", label: "Good" },
  { val: 5, icon: "🤩", label: "Excellent" },
];

const FB_TAGS = ["Network", "Mentorship", "Events", "Support", "Platform UI", "Other"];
export default function AlumniDashboard() {
  const { loading: authLoading, authenticated, user } = useAuth("alumni", "/alumni/login");
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const router = useRouter();
  const [selectedDrive, setSelectedDrive] = useState<PlacementDrive | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Referral form
  const [refForm, setRefForm] = useState({
    companyName: "",
    jobType: "",
    position: "",
    description: "",
    location: "",
    minCGPA: "",
    experience: "",
    batchEligible: "",
    refrerralLink: "",
    referralCode: "",
    deadline: "",
    applyLink: ""
  });
  const [submittingRef, setSubmittingRef] = useState(false);
  const [refMsg, setRefMsg] = useState<{ msg: string; ok: boolean; errors?: any } | null>(null);

  // Feedback form
  const [fbRating, setFbRating] = useState(0);
  const [fbContent, setFbContent] = useState("");
  const [fbSelectedTags, setFbSelectedTags] = useState<string[]>([]);
  const [submittingFb, setSubmittingFb] = useState(false);
  const [fbMsg, setFbMsg] = useState<{ msg: string; ok: boolean } | null>(null);
  const [fbSubmitted, setFbSubmitted] = useState(false);

  // Memory Modal State
  const [isMemModalOpen, setIsMemModalOpen] = useState(false);
  const [selectedMemFiles, setSelectedMemFiles] = useState<File[]>([]);
  const [memBatchTitle, setMemBatchTitle] = useState("");
  const [memPreviews, setMemPreviews] = useState<string[]>([]);
  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<any | null>(null);
  const [data, setData] = useState<any>(null);
  const [memUploading, setMemUploading] = useState(false);
  const [profileUploading, setProfileUploading] = useState(false);
  const profileImageRef = React.useRef<HTMLInputElement>(null);


  // Profile Form State
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>()

  //Placement Data Completion State
  const [isPlacemntDataComplete, setIsPlacemntDataComplete] = useState(false)
  const [placementModal, setPlacementModal] = useState(false)
  const [resumeUploading, setResumeUploading] = useState(false);
  const [submittingPlacement, setSubmittingPlacement] = useState(false);

  //Placement Data Form 
  const [placementForm, setPlacementForm] = useState<{
    course: string;
    branch: string;
    batch: string;
    cgpa: string;
    tenthPercentage: string;
    twelfthPercentage: string;
    resume: string | null;
    gender: string;
  }>({
    course: "",
    branch: "",
    batch: "",
    cgpa: "",
    tenthPercentage: "",
    twelfthPercentage: "",
    resume: null,
    gender: "",
  });

  // Pre-populate placement form when alumni data is loaded
  useEffect(() => {
    if (data?.alumni && data.alumni.id) {
      setPlacementForm({
        course: data.alumni.course || "",
        branch: data.alumni.branch || "",
        batch: data.alumni.batch || "",
        cgpa: data.alumni.cgpa ? String(data.alumni.cgpa) : "",
        tenthPercentage: data.alumni.tenthPercentage ? String(data.alumni.tenthPercentage) : "",
        twelfthPercentage: data.alumni.twelfthPercentage ? String(data.alumni.twelfthPercentage) : "",
        resume: data.alumni.resumeUrl || null,
        gender: data.alumni.gender || "",
      });
    }
  }, [data]);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file only");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB");
      return;
    }

    try {
      setResumeUploading(true);
      const url = await uploadFileToR2(file, "resumes", { role: "alumni" });
      setPlacementForm((prev) => ({ ...prev, resume: url }));
      toast.success("Resume uploaded successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error("Resume upload failed: " + err.message);
    } finally {
      setResumeUploading(false);
      e.target.value = ""; // Reset input value
    }
  };

  const handleSubmitPlacementForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!placementForm.course) {
      toast.error("Please select a course");
      return;
    }
    if (!placementForm.branch) {
      toast.error("Please select a branch");
      return;
    }
    if (!placementForm.batch) {
      toast.error("Please enter graduation batch");
      return;
    }
    if (!placementForm.cgpa) {
      toast.error("Please enter your current CGPA");
      return;
    }
    if (!placementForm.gender) {
      toast.error("Please select your gender");
      return;
    }
    if (!placementForm.tenthPercentage) {
      toast.error("Please enter your 10th percentage");
      return;
    }
    if (!placementForm.twelfthPercentage) {
      toast.error("Please enter your 12th/Diploma percentage");
      return;
    }
    if (!placementForm.resume) {
      toast.error("Please upload your resume");
      return;
    }

    setSubmittingPlacement(true);
    try {
      const token = getToken("alumni");
      const res = await fetch("/api/alumni/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          course: placementForm.course,
          branch: placementForm.branch,
          batch: placementForm.batch,
          cgpa: placementForm.cgpa,
          tenthPercentage: placementForm.tenthPercentage,
          twelfthPercentage: placementForm.twelfthPercentage,
          resumeUrl: placementForm.resume,
          gender: placementForm.gender,
        }),
      });

      const d = await res.json() as any;
      if (d.success) {
        toast.success("Placement data updated successfully!");
        setPlacementModal(false);
        fetchDashboard();
      } else {
        toast.error(d.message || "Failed to update placement data");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setSubmittingPlacement(false);
    }
  };


  useEffect(() => {
    if (!authenticated) return;
    fetchDashboard();
  }, [authenticated]);

  const fetchDashboard = async () => {
    try {
      setFetchError(null);
      setLoading(true);
      const token = getToken("alumni");
      const res = await fetch("/api/alumni/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const d = (await res.json()) as any;
      if (d.success) {
        setData(d);
      } else {
        setFetchError("Failed to load dashboard data.");
        toast.error("Failed to load dashboard data.");
      }
    } catch (err) {
      console.error(err);
      setFetchError("Network error. Please check your connection.");
      toast.error("Network error. Please check your connection.");

    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    logout("alumni");
    router.push("/alumni/alumni-register");
  };

  const handleSubmitReferral = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingRef(true);
    setRefMsg(null);
    try {
      const token = getToken("alumni");
      const res = await fetch("/api/alumni/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(refForm),
      });
      const d = (await res.json()) as any;
      setRefMsg({ msg: d.message, ok: d.success, errors: d.errors });

      if (d.success) {
        toast.success("Referral submitted successfully! Awaiting admin approval.");
        setRefForm({
          companyName: "",
          jobType: "",
          position: "",
          description: "",
          location: "",
          minCGPA: "",
          experience: "",
          batchEligible: "",
          refrerralLink: "",
          referralCode: "",
          deadline: "",
          applyLink: ""
        });
        fetchDashboard();
      } else {
        // Show validation errors as toast
        if (d.errors?.fieldErrors) {
          const errorList = Object.entries(d.errors.fieldErrors)
            .map(([field, errors]: [string, any]) => `${field}: ${errors[0]}`)
            .join("\n");
          toast.error(`Validation Failed:\n${errorList}`);
        } else {
          toast.error(d.message || "Submission failed");
        }
      }
    } catch (error) {
      const msg = "Network error. Please check your connection.";
      setRefMsg({ msg, ok: false });
      toast.error(msg);
    } finally {
      setSubmittingRef(false);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!fbContent.trim() && fbSelectedTags.length === 0 || fbRating === 0) {
      toast.error("Please provide a rating and some feedback.");
      return;
    }
    setSubmittingFb(true);
    setFbMsg(null);
    try {
      const token = getToken("alumni");
      const combinedContent = fbSelectedTags.length > 0
        ? `[Tags: ${fbSelectedTags.join(", ")}]\n${fbContent}`
        : fbContent;

      const res = await fetch("/api/alumni/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: combinedContent, rating: fbRating }),
      });
      const d = (await res.json()) as any;
      setFbMsg({ msg: d.message, ok: d.success });
      if (d.success) {
        toast.success(d.message || "Feedback submitted successfully!");
        setFbSubmitted(true);
        setTimeout(() => {
          setFbContent("");
          setFbRating(0);
          setFbSelectedTags([]);
          setFbSubmitted(false);
          setShowFeedbackModal(false);
        }, 3000);
      } else {
        toast.error(d.message || "Failed to submit feedback");
      }
    } catch (error) {
      const errorMsg = "Failed to submit feedback. Please try again.";
      setFbMsg({ msg: errorMsg, ok: false });
      toast.error(errorMsg);
    } finally {
      setSubmittingFb(false);
    }
  };

  const toggleFbTag = (tag: string) => {
    setFbSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setProfileUploading(true);
      const url = await uploadFileToR2(file, "profiles", { role: "alumni" });
      const token = getToken("alumni");
      const res = await fetch("/api/alumni/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ profileImageUrl: url }),
      });
      const d = await res.json() as any;
      if (d.success) {
        toast.success("Profile image updated successfully!");
        fetchDashboard();
      } else {
        throw new Error(d.message);
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Profile image upload failed: " + err.message);
    } finally {
      setProfileUploading(false);
    }
  };

  const handleResumeUploadDirect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file only");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB");
      return;
    }

    try {
      setResumeUploading(true);
      const url = await uploadFileToR2(file, "resumes", { role: "alumni" });
      const token = getToken("alumni");
      const res = await fetch("/api/alumni/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ resumeUrl: url }),
      });
      const d = await res.json() as any;
      if (d.success) {
        toast.success("Resume updated successfully!");
        fetchDashboard();
      } else {
        throw new Error(d.message);
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Resume upload failed: " + err.message);
    } finally {
      setResumeUploading(false);
      e.target.value = ""; // Reset input
    }
  };

  const [showReferralModal, setShowReferralModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const handleMemoryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const oversized = files.some(f => f.size > 10 * 1024 * 1024);
    if (oversized) {
      toast.error("One or more images are larger than 10MB");
      return;
    }

    setSelectedMemFiles(files);
    setMemBatchTitle("");

    const previewPromises = files.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    const results = await Promise.all(previewPromises);
    setMemPreviews(results);
    setIsMemModalOpen(true);
  };

  const startMemoryUpload = async () => {
    if (selectedMemFiles.length === 0) {
      toast.error("Please select at least one image.");
      return;
    }

    try {
      setMemUploading(true);

      const uploadPromises = selectedMemFiles.map((file) =>
        uploadFileToR2(file, "memories", { role: "alumni" }),
      );
      const imageUrls = await Promise.all(uploadPromises);

      const memories = imageUrls.map(url => ({
        imageUrl: url,
        title: memBatchTitle || "Untitled Memory"
      }));

      const token = getToken("alumni");
      const res = await fetch("/api/alumni/memories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ memories }),
      });

      const d = await res.json() as any
      if (d.success) {
        toast.success(d.message || "Memories uploaded! They will appear after moderation.");
        setIsMemModalOpen(false);
        setSelectedMemFiles([]);
        setMemPreviews([]);
        setMemBatchTitle("");
        fetchDashboard();
      } else {
        throw new Error(d.message);
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Upload failed: " + err.message);
    } finally {
      setMemUploading(false);
    }
  };

  const handleDeleteMemory = async (id: string) => {
    try {
      setIsDeleting(id)
      const token = getToken("alumni");
      const res = await fetch("/api/alumni/memories", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ memoryIds: [id] })
      });
      const d = await res.json() as any;
      if (d.success) {
        toast.success("Memory deleted successfully!");
        fetchDashboard();
      } else {
        throw new Error(d.message);
      }
    } catch (error: any) {
      console.error("Error deleting memory:", error);
      toast.error("Failed to delete memory. Please try again.");
    } finally {
      setIsDeleting(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published": return "bg-green-500/10 text-green-600";
      case "pending": return "bg-yellow-500/10 text-yellow-600";
      case "rejected": return "bg-red-500/10 text-red-500";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (authLoading || !authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    );
  }

  const alumni = data?.alumni;
  const isProfileIncomplete = alumni && (!alumni.city || !alumni.linkedInUrl || !alumni.about);
  const referrals = data?.referrals || [];
  const stats = data?.stats || {};
  const memories = data?.memories || [];
  const drives = data?.drives || [];
  const archivedDrives = data?.archivedDrives || [];
  const registrations = data?.registrations || [];

  function isUserHasEntereddata(drive: any) {
    if (!alumni.tenthPercentage || !alumni.twelfthPercentage || !alumni.resumeUrl || !alumni.gender) {
      return setIsPlacemntDataComplete(() => (!isPlacemntDataComplete))
    }
    else {
      return setIsModalOpen(() => (!isModalOpen)), setSelectedDrive(drive)
    }
  }
  return (
    <>
      <Nav />
      {/* Complete Profile Prompt */}
      {isProfileIncomplete && !showProfileForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl rounded-lg border border-border bg-card/95 shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300">
            <div className="p-6 md:p-7">
              <div className="flex items-start gap-4">
                <div className="shrink-0 rounded-lg bg-brand/10 text-brand p-3">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl md:text-2xl font-black tracking-tight text-foreground">
                    Complete Your Profile
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Please add your current city and Linkedin details to unlock full functionality and improve your visibility. Other details are optional
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowProfileForm(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand text-primary-foreground px-5 py-2.5 text-sm font-bold hover:bg-brand/90 transition-colors"
                >
                  Complete Profile
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* job details model */}
      {selectedDrive && (
        <JobDetailsModal
          drive={selectedDrive}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedDrive(null);
          }}
          onSuccess={() => {
            fetchDashboard();
          }}
          role="alumni"
          isRegistered={registrations.some((r: any) => r.driveId === selectedDrive.id)}
        />
      )}
      {/* placement data model */}
      {isPlacemntDataComplete && (
        <>
          <div
          onClick={() => setIsPlacemntDataComplete(!isPlacemntDataComplete)}
          className="fixed w-full h-full top-0 left-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm p-4">
            <div 
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl rounded-lg border border-border bg-card/95 shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300">
              <div className="p-6 md:p-7">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 rounded-lg bg-brand/10 text-brand p-3">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-xl md:text-2xl font-black tracking-tight text-foreground">
                      Complete Your Placement Data
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Please add your placement data to unlock full functionality and improve your visibility. Other details are optional
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setIsPlacemntDataComplete(!isPlacemntDataComplete);
                      setPlacementModal(!placementModal);
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand text-primary-foreground px-5 py-2.5 text-sm font-bold hover:bg-brand/90 transition-colors"
                  >
                    Complete Placement Data
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {/* Placement Modal */}
      {placementModal && (
       <div
       onClick={() => setPlacementModal(!placementModal)}
       className="fixed w-full h-full top-0 left-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[85vh] rounded-lg border border-border bg-card/95 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border p-5 bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="shrink-0 rounded-lg bg-brand/10 text-brand p-2.5">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground flex gap-4">Update <span className="hidden md:block">Placement</span> Data</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Please ensure all details match your official documents.</p>
            </div>
          </div>
          <button 
            onClick={() => setPlacementModal(!placementModal)}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmitPlacementForm} className="p-6 md:p-7 space-y-6">
          
          {/* Section: Academic Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Academic Details</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Course */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Course</label>
                <select 
                  value={placementForm.course}
                  onChange={(e) => setPlacementForm((prev) => ({ ...prev, course: e.target.value }))}
                  required
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 transition-colors"
                >
                  <option value="">Select Course</option>
                  <option value="B.Tech">B.Tech</option>
                  <option value="M.Tech">M.Tech</option>
                  <option value="MBA">MBA</option>
                  <option value="Diploma">Diploma</option>
                </select>
              </div>

              {/* Branch */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Branch</label>
                <select 
                  value={placementForm.branch}
                  onChange={(e) => setPlacementForm((prev) => ({ ...prev, branch: e.target.value }))}
                  required
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 transition-colors"
                >
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

              {/* Batch */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Graduation Batch</label>
                <input 
                  type="number" 
                  placeholder="e.g., 2026" 
                  value={placementForm.batch}
                  onChange={(e) => setPlacementForm((prev) => ({ ...prev, batch: e.target.value }))}
                  required
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 transition-colors"
                />
              </div>

              {/* CGPA */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Current CGPA</label>
                <input 
                  type="number" 
                  step="0.01" 
                  placeholder="e.g., 9.25" 
                  value={placementForm.cgpa}
                  onChange={(e) => setPlacementForm((prev) => ({ ...prev, cgpa: e.target.value }))}
                  required
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 transition-colors"
                />
              </div>

              {/* Gender */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Gender</label>
                <select 
                  value={placementForm.gender}
                  onChange={(e) => setPlacementForm((prev) => ({ ...prev, gender: e.target.value }))}
                  required
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 transition-colors"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <hr className="border-border" />

          {/* Section: Prior Education */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Prior Education (%)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 10th Score */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">10th Percentage</label>
                <input 
                  type="number" 
                  step="0.1" 
                  placeholder="e.g., 95.2" 
                  value={placementForm.tenthPercentage}
                  onChange={(e) => setPlacementForm((prev) => ({ ...prev, tenthPercentage: e.target.value }))}
                  required
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 transition-colors"
                />
              </div>

              {/* 12th Score */}
              {alumni.course === "diploma"?(``) : (<div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Diploma Percentage</label>
                <input 
                  type="number" 
                  step="0.1" 
                  placeholder="e.g., 91.4" 
                  value={placementForm.twelfthPercentage}
                  onChange={(e) => setPlacementForm((prev) => ({ ...prev, twelfthPercentage: e.target.value }))}
                  required
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 transition-colors"
                />
              </div>)}
            </div>
          </div>

          <hr className="border-border" />

          {/* Section: Resume Upload */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
              Resume <span className="text-destructive">*</span>
            </label>
            
            {/* Drag & Drop Area */}
            <div className="border-2 border-dashed border-brand/40 hover:border-brand/80 bg-background/80 rounded-lg p-5 text-center cursor-pointer transition-colors group">
              <input 
                type="file" 
                className="hidden" 
                id="resume-upload" 
                accept=".pdf" 
                onChange={handleResumeUpload}
                disabled={resumeUploading}
              />
              <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center gap-2">
                {resumeUploading ? (
                  <>
                    <div className="p-2 rounded-full bg-brand/10">
                      <Loader2 className="w-5 h-5 animate-spin text-brand" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Uploading resume...</p>
                    </div>
                  </>
                ) : placementForm.resume ? (
                  <>
                    <div className="p-2 rounded-full bg-green-500/10 text-green-600">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-600">Resume Uploaded Successfully</p>
                      <p className="text-xs text-muted-foreground mt-0.5 max-w-[200px] truncate">
                        {placementForm.resume.split("/").pop()}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-2 rounded-full bg-muted group-hover:bg-brand/10 group-hover:text-brand transition-colors">
                      <UploadCloud className="w-5 h-5 text-muted-foreground group-hover:text-brand" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Click to upload or drag & drop</p>
                      <p className="text-xs text-muted-foreground mt-0.5">PDF format only (Max 2MB)</p>
                    </div>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3 sm:justify-end border-t border-border mt-6">
            <button
              type="button"
              onClick={() => setPlacementModal(!placementModal)}
              disabled={submittingPlacement || resumeUploading}
              className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors order-2 sm:order-1 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingPlacement || resumeUploading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand text-primary-foreground px-5 py-2.5 text-sm font-bold hover:bg-brand/90 shadow-sm transition-colors order-1 sm:order-2 disabled:opacity-50"
            >
              {submittingPlacement ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save changes"}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
        </form>
      </div>
    </div>
      )}
      {/* body */}
      <div className="relative bg-background text-foreground antialiased font-sans min-h-screen mt-15 overflow-hidden">
        <div className="fixed bottom-0 right-0 w-96 h-96 bg-brand/5 rounded-full blur-[120px] -z-10" />
        <div className="fixed top-1/2 left-0 w-64 h-64 bg-brand/5 rounded-full blur-[100px] -z-10" />

        <main className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
          {/* Header */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-bold uppercase tracking-widest mb-0">
            <GraduationCap className="w-4 h-4" /> Alumni
          </div>
          <div className="hidden md:flex">
            <AlumniDashboardHeader
              alumni={alumni}
              showProfileForm={showProfileForm}
              setShowProfileForm={setShowProfileForm}
              isProfileIncomplete={isProfileIncomplete}
              setShowFeedbackModal={setShowFeedbackModal}
              setShowReferralModal={setShowReferralModal}
              handleLogout={handleLogout}
              fetchDashboard={fetchDashboard}
            />
          </div>

          {/* Notification bell */}
          <div className="mt-2 w-full md:hidden flex justify-end ">
            <NotificationBell role="alumni" />
          </div>

          {/* Loader State */}
          {loading && (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-brand" />
            </div>
          )}

          {/* Hero Section & Profile Form */}
          {!loading && !fetchError && (
            <div className="flex flex-col gap-6">
              <AlumniDashboardOverview
                alumni={alumni}
                profileUploading={profileUploading}
                profileImageRef={profileImageRef}
                handleProfileImageUpload={handleProfileImageUpload}
                showProfileForm={showProfileForm}
                setShowProfileForm={setShowProfileForm}
                isProfileIncomplete={isProfileIncomplete}
                resumeUploading={resumeUploading}
                handleResumeUpload={handleResumeUploadDirect}
              />
              <div className="hidden md:block">
                <AlumniProfileCompletionForm
                  alumni={alumni}
                  showProfileForm={showProfileForm}
                  setShowProfileForm={setShowProfileForm}
                  fetchDashboard={fetchDashboard}
                />
              </div>
            </div>
          )}

          <div className="md:hidden">
            <AlumniDashboardHeader
              alumni={alumni}
              showProfileForm={showProfileForm}
              setShowProfileForm={setShowProfileForm}
              isProfileIncomplete={isProfileIncomplete}
              setShowFeedbackModal={setShowFeedbackModal}
              setShowReferralModal={setShowReferralModal}
              handleLogout={handleLogout}
              fetchDashboard={fetchDashboard}
            />
          </div>

          {/* Stats */}
          {!loading && !fetchError && (
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Stat Card: Total Referrals */}
              <div className="bg-card rounded-lg p-6 md:p-8 border border-border shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300 group">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 bg-brand/10 rounded-lg flex items-center justify-center">
                    <UserPlus className="w-6 h-6 text-brand" />
                  </div>
                </div>
                <p className="text-3xl md:text-4xl font-black text-foreground leading-none mb-2">{stats.totalReferrals || 0}</p>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Referrals</p>
              </div>

              {/* Stat Card: Approved Referrals */}
              <div className="bg-card rounded-lg p-6 md:p-8 border border-border shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300 group">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 bg-brand/10 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-brand" />
                  </div>
                </div>
                <p className="text-3xl md:text-4xl font-black text-foreground leading-none mb-2">{stats.approvedReferrals || 0}</p>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Approved</p>
              </div>

              {/* Stat Card: Pending Review */}
              <div className="bg-card rounded-lg p-6 md:p-8 border border-border shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300 group">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 bg-brand/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-brand" />
                  </div>
                </div>
                <p className="text-3xl md:text-4xl font-black text-brand leading-none mb-2">{stats.pendingReferrals || 0}</p>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Under Review</p>
              </div>
            </section>
          )}

          {/* Upcoming Drives */}
          {!loading && !fetchError && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-brand/10 rounded-full">
                    <CalendarDays className="w-5 h-5 text-brand" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Upcoming Drives</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Browse open positions for alumni</p>
                  </div>
                </div>
                <span className="text-xs font-bold bg-brand/10 text-brand px-3 py-1.5 rounded-full">{drives.length} Available</span>
              </div>

              {drives.length === 0 ? (
                <div className="bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg border-2 border-dashed border-border p-12 text-center space-y-4 group hover:border-brand/30 transition-colors">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full group-hover:bg-brand/10 transition-colors">
                    <Briefcase className="w-8 h-8 text-muted-foreground group-hover:text-brand transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">No Eligible Drives Yet</h3>
                    <p className="text-sm text-muted-foreground">Come back soon for new placement opportunities</p>
                  </div>
                  <button
                    onClick={() => { fetchDashboard(); }}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-brand/10 text-brand rounded-lg font-bold text-sm hover:bg-brand/20 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" /> Check Again
                  </button>
                </div>
              ) : (
                <>
                  {/* MOBILE VIEW: Grid of Cards */}
                  <div className="grid grid-cols-1 gap-4 md:hidden">
                    {drives.map((drive: any) => (
                      <div key={drive.id} className="bg-card border border-border rounded-lg p-5 shadow-sm hover:shadow-md hover:border-brand/30 transition-all space-y-4 group">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-brand/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-brand/20 transition-colors">
                              <Building2 className="w-5 h-5 text-brand" />
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-bold text-foreground leading-tight truncate">{drive.companyName}</h3>
                              <p className="text-xs text-muted-foreground truncate">{drive.roleName}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1.5">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-bold whitespace-nowrap ${drive.driveType === "Open" ? "bg-green-500/15 text-green-700" : "bg-blue-500/15 text-blue-700"}`}>
                              {drive.driveType}
                            </span>
                            {drive.isEligible === false && (
                              <span className="text-xs px-2.5 py-1 rounded-full font-bold whitespace-nowrap bg-red-500/15 text-red-700">
                                Ineligible
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 py-3 border-y border-border/50">
                          <div>
                            <p className="text-xs uppercase font-black text-muted-foreground tracking-wider mb-1">CTC</p>
                            <p className="text-sm font-bold text-foreground">{drive.ctc}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase font-black text-muted-foreground tracking-wider mb-1">Date</p>
                            <p className="text-sm font-bold text-foreground">{new Date(drive.driveDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</p>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          {drive.isRegistered ? (
                            <button
                              onClick={() => { setSelectedDrive(drive); setIsModalOpen(true); }}
                              className="inline-flex items-center gap-1.5 text-green-600 bg-green-500/10 hover:bg-green-500/20 px-4 py-2 rounded-lg text-xs font-bold transition-all"
                            >
                              <CheckCircle className="w-4 h-4" /> View Details
                            </button>
                          ) : (
                            <button
                              onClick={() => isUserHasEntereddata(drive)}
                              className="shrink-0 text-xs font-bold px-4 py-2 rounded-lg bg-brand text-white hover:bg-brand/90 transition-all shadow-md shadow-brand/25"
                            >
                              View Details
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* DESKTOP VIEW: Professional Table */}
                  <div className="hidden md:block bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-muted/50 to-muted/30 border-b border-border">
                          <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Company</th>
                          <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Position</th>
                          <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">CTC</th>
                          <th className="text-center px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Drive Date</th>
                          <th className="text-center px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Type</th>
                          <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {drives.map((drive: any) => (
                          <tr key={drive.id} className="hover:bg-muted/20 transition-colors group">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-brand/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-brand/20 transition-colors">
                                  <Building2 className="w-5 h-5 text-brand" />
                                </div>
                                <span className="font-bold text-foreground">{drive.companyName}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-muted-foreground font-medium">{drive.roleName}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-bold text-foreground">{drive.ctc}</span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="text-muted-foreground font-medium">{new Date(drive.driveDate).toLocaleDateString('en-IN')}</span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex flex-col items-center gap-1.5">
                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${drive.driveType === "Open" ? "bg-green-500/15 text-green-700" : "bg-blue-500/15 text-blue-700"}`}>
                                  {drive.driveType}
                                </span>
                                {drive.isEligible === false && (
                                  <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-bold bg-red-500/15 text-red-700 uppercase tracking-wider">
                                    Ineligible
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 flex justify-end">
                              {drive.isRegistered ? (
                                <button
                                  onClick={() => { setSelectedDrive(drive); setIsModalOpen(true); }}
                                  className="inline-flex items-center gap-1.5 text-green-600 bg-green-500/10 hover:bg-green-500/20 px-4 py-2 rounded-lg text-xs font-bold transition-all"
                                >
                                  <CheckCircle className="w-4 h-4" /> View Details
                                </button>
                              ) : (
                                <button
                                  onClick={() => isUserHasEntereddata(drive)}
                                  className="shrink-0 text-xs font-bold px-4 py-2 rounded-lg bg-brand text-white hover:bg-brand/90 transition-all shadow-md shadow-brand/25"
                                >
                                  View Details
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </section>
          )}

          {/* My Registrations */}
          {!loading && !fetchError && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-brand/10 rounded-full">
                    <FileText className="w-5 h-5 text-brand" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">My Applications</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Track your drive participation</p>
                  </div>
                </div>
                <span className="text-xs font-bold bg-brand/10 text-brand px-3 py-1.5 rounded-full">{registrations.length} Applied</span>
              </div>

              {registrations.length === 0 ? (
                <div className="bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg border-2 border-dashed border-border p-12 text-center space-y-4 group hover:border-brand/30 transition-colors">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full group-hover:bg-brand/10 transition-colors">
                    <Briefcase className="w-8 h-8 text-muted-foreground group-hover:text-brand transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">No Applications Yet</h3>
                    <p className="text-sm text-muted-foreground">Start applying to drives from the list above</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* MOBILE VIEW: Cards */}
                  <div className="grid grid-cols-1 gap-4 md:hidden">
                    {registrations.map((reg: any) => (
                      <div key={reg.id} className="bg-card border border-border rounded-lg p-5 shadow-sm hover:shadow-md hover:border-brand/30 transition-all space-y-4 group">
                        <div className="flex justify-between items-start gap-3">
                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-foreground leading-tight truncate">{reg.drive?.companyName}</h3>
                            <p className="text-xs text-muted-foreground truncate">{reg.drive?.roleName}</p>
                          </div>
                          <span className={`text-xs px-2.5 py-1 rounded-full font-bold whitespace-nowrap ${reg.drive?.status === "active" ? "bg-green-500/15 text-green-700" : reg.drive?.status === "completed" ? "bg-blue-500/15 text-blue-700" : "bg-muted text-muted-foreground"}`}>
                            {reg.drive?.status}
                          </span>
                        </div>

                        <div className="flex items-center justify-between py-3 border-y border-border/50">
                          <div className="space-y-1">
                            <p className="text-xs uppercase font-black text-muted-foreground tracking-wider">Status</p>
                            <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold tracking-wider ${reg.status === "Selected" ? "bg-green-500/15 text-green-700" :
                              reg.status === "Rejected" ? "bg-red-500/15 text-red-600" :
                                reg.status === "Shortlisted" ? "bg-yellow-500/15 text-yellow-700" :
                                  "bg-muted text-muted-foreground"
                              }`}>
                              {reg.status || "Applied"}
                            </span>
                          </div>
                          <div className="text-right space-y-1">
                            <p className="text-xs uppercase font-black text-muted-foreground tracking-wider">Attendance</p>
                            {reg.attended ? (
                              <span className="text-green-600 text-xs font-bold flex items-center justify-end gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5" /> Present
                              </span>
                            ) : (
                              <span className="text-muted-foreground text-xs font-bold flex items-center justify-end gap-1.5">
                                <Clock className="w-3.5 h-3.5" /> Upcoming
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-muted-foreground">
                          📅 {reg.drive?.driveDate ? new Date(reg.drive.driveDate).toLocaleDateString('en-IN') : "—"}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* DESKTOP VIEW: Professional Table */}
                  <div className="hidden md:block bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gradient-to-r from-muted/50 to-muted/30 border-b border-border">
                            <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Company & Role</th>
                            <th className="text-center px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Drive Date</th>
                            <th className="text-center px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Application Status</th>
                            <th className="text-center px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Drive Status</th>
                            <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Attendance</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                          {registrations.map((reg: any) => (
                            <tr key={reg.id} className="hover:bg-muted/20 transition-colors group">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3 group">
                                  <div className="w-10 h-10 bg-brand/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-brand/20 transition-colors">
                                    <Briefcase className="w-5 h-5 text-brand" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-bold text-foreground">{reg.drive?.companyName}</p>
                                    <p className="text-xs text-muted-foreground truncate">{reg.drive?.roleName}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <span className="text-muted-foreground font-medium text-sm">
                                  {reg.drive?.driveDate ? new Date(reg.drive.driveDate).toLocaleDateString('en-IN') : "—"}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <span className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-bold ${reg.status === "Selected" ? "bg-green-500/15 text-green-700" :
                                  reg.status === "Rejected" ? "bg-red-500/15 text-red-600" :
                                    reg.status === "Shortlisted" ? "bg-yellow-500/15 text-yellow-700" :
                                      "bg-muted text-muted-foreground"
                                  }`}>
                                  {reg.status || "Applied"}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <span className={`text-xs px-3 py-1.5 rounded-lg font-bold ${reg.drive?.status === "active" ? "bg-green-500/15 text-green-700" :
                                  reg.drive?.status === "completed" ? "bg-blue-500/15 text-blue-700" :
                                    "bg-muted text-muted-foreground"
                                  }`}>
                                  {reg.drive?.status || "Unknown"}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                {reg.attended ? (
                                  <span className="text-green-600 font-bold inline-flex items-center gap-1.5">
                                    <CheckCircle className="w-4 h-4" /> Present
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground font-bold inline-flex items-center justify-end gap-1.5 w-full">
                                    <Clock className="w-4 h-4" /> Upcoming
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </section>
          )}

          {/* Archived Drives */}
          {!loading && !fetchError && archivedDrives.length > 0 && (
            <section className="opacity-70 hover:opacity-100 transition-opacity duration-300">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-brand" />
                Archived Drives History
              </h2>

              {/* MOBILE VIEW: Compact List */}
              <div className="grid grid-cols-1 gap-3 md:hidden">
                {archivedDrives.map((drive: any) => (
                  <div key={drive.id} className="bg-card/50 border border-border rounded-lg p-4 flex justify-between items-center">
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-foreground truncate max-w-[15rem]">
                        {drive.companyName}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {drive.roleName} • {new Date(drive.driveDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      {drive.isRegistered ? (
                        <span className="bg-brand/10 text-brand text-xs px-2 py-0.5 rounded-full font-bold">
                          Registered
                        </span>
                      ) : (
                        <span className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full font-bold">
                          Missed
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* DESKTOP VIEW: Compact Table */}
              <div className="hidden md:block bg-card/50 rounded-lg border border-border overflow-hidden">
                <table className="w-full">
                  <tbody className="divide-y divide-border/40">
                    {archivedDrives.map((drive: any) => (
                      <tr key={drive.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-6 py-3">
                          <span className="font-bold text-foreground text-sm">{drive.companyName}</span>
                        </td>
                        <td className="px-6 py-3 text-muted-foreground text-sm">{drive.roleName}</td>
                        <td className="px-6 py-3 text-muted-foreground text-sm">{new Date(drive.driveDate).toLocaleDateString()}</td>
                        <td className="px-6 py-3 text-right">
                          {drive.isRegistered ? (
                            <span className="inline-flex items-center gap-1.5 bg-brand/10 text-brand text-xs px-2.5 py-1 rounded-full font-bold">
                              <CheckCircle className="w-3.5 h-3.5" /> Registered
                            </span>
                          ) : (
                            <span className="bg-muted text-muted-foreground text-xs px-2.5 py-1 rounded-full font-bold">
                              Missed
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Error State */}
          {!loading && fetchError && (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <p className="text-destructive font-bold text-lg">{fetchError}</p>
              <button
                onClick={() => { setLoading(true); fetchDashboard(); }}
                className="flex items-center gap-2 px-6 py-3 bg-brand text-primary-foreground rounded-lg font-bold text-sm hover:bg-brand/90 transition-all"
              >
                <RefreshCw className="w-4 h-4" /> Retry
              </button>
            </div>
          )}

          {/* Action Modals */}
          {!loading && !fetchError && (
            <>
              {/*Referral Modal*/}
              {showReferralModal && (
                <div className="fixed inset-0 z-[100] w-full h-full flex items-center justify-center p-4">
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowReferralModal(false)} />
                  <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-card rounded-lg border border-border shadow-2xl animate-in zoom-in-95 duration-300 custom-scrollbar flex flex-col">

                    {/* Header */}
                    <div className="flex items-center justify-between p-6 md:p-8 border-b border-border bg-muted/10">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-brand text-primary-foreground rounded-lg flex items-center justify-center shadow-lg">
                          <Send className="w-6 h-6" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-black text-foreground tracking-tight">Post a Referral</h2>
                          <p className="text-sm text-muted-foreground font-medium mt-1">Share exclusive job opportunities with RGI students.</p>
                        </div>
                      </div>
                      <button onClick={() => setShowReferralModal(false)} className="p-3 bg-background border border-border hover:bg-muted text-muted-foreground hover:text-foreground rounded-full transition-colors self-start">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="p-6 md:p-8">
                      <form onSubmit={handleSubmitReferral} className="space-y-6">

                        {/* Validation Messages */}
                        {refMsg && (
                          <div className={`p-5 rounded-lg flex items-start gap-3 border ${refMsg.ok
                            ? "bg-green-500/10 border-green-500/20 text-green-600"
                            : "bg-destructive/10 border-destructive/20 text-destructive"
                            }`}>
                            {refMsg.ok ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                            <div className="space-y-1 mt-0.5">
                              <p className="text-sm font-bold">{refMsg.msg}</p>
                              {refMsg.errors?.fieldErrors && (
                                <ul className="text-xs space-y-1 opacity-90 mt-2 list-disc list-inside">
                                  {Object.entries(refMsg.errors.fieldErrors).map(([field, errors]: [string, any]) => (
                                    <li key={field}><span className="font-semibold capitalize">{field.replace(/([A-Z])/g, ' $1')}:</span> {errors[0]}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Left Column */}
                          <div className="space-y-6">
                            {/* Bento 1: Basics */}
                            <div className="bg-surface border border-border rounded-lg p-6 shadow-sm space-y-5">
                              <div className="flex items-center gap-2 mb-2">
                                <Building2 className="w-4 h-4 text-brand" />
                                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Role Basics</h3>
                              </div>

                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <label className="text-xs font-bold text-muted-foreground uppercase">Company Name *</label>
                                  <input required value={refForm.companyName} onChange={(e) => setRefForm({ ...refForm, companyName: e.target.value })}
                                    className="w-full bg-background border border-border px-4 py-3 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all text-sm font-medium"
                                    placeholder="e.g. Google" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground uppercase">Role/Position *</label>
                                    <input required value={refForm.position} onChange={(e) => setRefForm({ ...refForm, position: e.target.value })}
                                      className="w-full bg-background border border-border px-4 py-3 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all text-sm font-medium"
                                      placeholder="SDE Intern" />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground uppercase">Job Type *</label>
                                    <select required value={refForm.jobType} onChange={(e) => setRefForm({ ...refForm, jobType: e.target.value })}
                                      className="w-full bg-background border border-border px-4 py-3 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all text-sm font-medium cursor-pointer">
                                      <option value="">Select Type</option>
                                      <option value="Full-time">Full-time</option>
                                      <option value="Part-time">Part-time</option>
                                      <option value="Internship">Internship</option>
                                      <option value="Contract/Bond">Contract</option>
                                    </select>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-xs font-bold text-muted-foreground uppercase">Location</label>
                                  <input value={refForm.location} onChange={(e) => setRefForm({ ...refForm, location: e.target.value })}
                                    className="w-full bg-background border border-border px-4 py-3 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all text-sm font-medium"
                                    placeholder="Bangalore, India" />
                                </div>
                              </div>
                            </div>

                            {/* Bento 2: Job Description */}
                            <div className="bg-surface border border-border rounded-lg p-6 shadow-sm space-y-4">
                              <div className="flex items-center gap-2 mb-2">
                                <FileText className="w-4 h-4 text-brand" />
                                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Job Description *</h3>
                              </div>
                              <textarea required value={refForm.description} onChange={(e) => setRefForm({ ...refForm, description: e.target.value })} rows={5}
                                className="w-full bg-background border border-border px-4 py-3 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all text-sm font-medium resize-y min-h-[120px] custom-scrollbar"
                                placeholder="Details about responsibilities, tech stack, day-to-day tasks..." />
                            </div>
                          </div>

                          {/* Right Column */}
                          <div className="space-y-6">
                            {/* Bento 3: Eligibility */}
                            <div className="bg-surface border border-border rounded-lg p-6 shadow-sm space-y-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Users className="w-4 h-4 text-brand" />
                                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Eligibility</h3>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label className="text-xs font-bold text-muted-foreground uppercase">Min CGPA</label>
                                  <input type="number" step="0.01" value={refForm.minCGPA} onChange={(e) => setRefForm({ ...refForm, minCGPA: e.target.value })}
                                    className="w-full bg-background border border-border px-4 py-3 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all text-sm font-medium"
                                    placeholder="e.g. 7.5" />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-xs font-bold text-muted-foreground uppercase">Experience</label>
                                  <input value={refForm.experience} onChange={(e) => setRefForm({ ...refForm, experience: e.target.value })}
                                    className="w-full bg-background border border-border px-4 py-3 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all text-sm font-medium"
                                    placeholder="e.g. 0-2 yrs" />
                                </div>
                                <div className="space-y-2 col-span-2">
                                  <label className="text-xs font-bold text-muted-foreground uppercase">Eligible Batches</label>
                                  <input value={refForm.batchEligible} onChange={(e) => setRefForm({ ...refForm, batchEligible: e.target.value })}
                                    className="w-full bg-background border border-border px-4 py-3 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all text-sm font-medium"
                                    placeholder="e.g. 2024, 2025" />
                                </div>
                              </div>
                            </div>

                            {/* Bento 4: Application Links */}
                            <div className="bg-surface border border-border rounded-lg p-6 shadow-sm space-y-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Link2 className="w-4 h-4 text-brand" />
                                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Application Flow</h3>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label className="text-xs font-bold text-muted-foreground uppercase">Referral Code</label>
                                  <input value={refForm.referralCode} onChange={(e) => setRefForm({ ...refForm, referralCode: e.target.value })}
                                    className="w-full bg-background border border-border px-4 py-3 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all text-sm font-medium"
                                    placeholder="e.g. EMP405" />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-xs font-bold text-muted-foreground uppercase">Deadline</label>
                                  <input type="date" value={refForm.deadline} onChange={(e) => setRefForm({ ...refForm, deadline: e.target.value })}
                                    className="w-full bg-background border border-border px-4 py-3 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all text-sm font-medium" />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase">Referral Link (Optional)</label>
                                <input value={refForm.refrerralLink} onChange={(e) => setRefForm({ ...refForm, refrerralLink: e.target.value })}
                                  className="w-full bg-background border border-border px-4 py-3 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all text-sm font-medium"
                                  placeholder="https://..." />
                              </div>
                              <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase">Apply Link / Email *</label>
                                <input required value={refForm.applyLink} onChange={(e) => setRefForm({ ...refForm, applyLink: e.target.value })}
                                  className="w-full bg-background border border-brand/50 px-4 py-3 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all text-sm font-medium"
                                  placeholder="https://careers.google.com/..." />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Footer Action */}
                        <div className="pt-4 mt-6 border-t border-border flex items-center justify-end">
                          <button type="submit" disabled={submittingRef}
                            className="w-full md:w-auto bg-brand hover:bg-brand/90 text-background px-8 py-4 rounded-lg font-black text-sm transition-all flex items-center justify-center gap-2 shadow-lg disabled:shadow-none"
                          >
                            {submittingRef ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                            {submittingRef ? "Submitting..." : "Submit Referral"}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {/*Feedback Modal*/}
              {showFeedbackModal && (
                <div className="fixed inset-0 z-[100] w-full h-full flex items-center justify-center p-4">
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowFeedbackModal(false)} />
                  <div className="relative w-full max-w-xl animate-in zoom-in-95 duration-300">
                    {fbSubmitted ? (
                      <div className="bg-card border border-border rounded-lg p-6 md:p-12 text-center shadow-xl w-full max-w-md mx-auto relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-bl-full -z-10 blur-xl" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand/10 rounded-tr-full -z-10 blur-xl" />
                        <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-green-500/10 mx-auto mb-6">
                          <Heart className="w-10 h-10 md:w-12 md:h-12 text-green-500 fill-green-500 animate-pulse" />
                        </div>
                        <h3 className="text-2xl md:text-3xl font-black text-foreground tracking-tight mb-3">Thank You!</h3>
                        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                          Your feedback helps us build a better experience for everyone at RGI.
                        </p>
                      </div>
                    ) : (
                      <div className="bg-card rounded-lg border border-border shadow-2xl w-full max-w-xl mx-auto max-h-[90vh] md:max-h-[85vh] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300 relative overflow-hidden">
                        {/* Decorative Blur */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full blur-3xl -z-10 pointer-events-none" />

                        {/* Header (Sticky) */}
                        <div className="flex items-center justify-between p-5 md:p-6 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-10 shrink-0">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-brand text-primary-foreground rounded-full flex items-center justify-center shadow-md">
                              <MessageSquareShare className="w-5 h-5" />
                            </div>
                            <div>
                              <h2 className="text-lg md:text-xl font-black text-foreground tracking-tight">Alumni Feedback</h2>
                              <p className="text-xs md:text-sm text-muted-foreground font-medium">Your insights shape our future</p>
                            </div>
                          </div>
                          <button onClick={() => setShowFeedbackModal(false)} className="p-2.5 bg-background border border-border hover:bg-muted text-muted-foreground hover:text-foreground rounded-full transition-colors flex-shrink-0">
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="p-5 md:p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1">

                          {/* Rating Bento */}
                          <div className="bg-surface border border-border rounded-lg p-4 md:p-5 shadow-sm relative overflow-hidden">
                            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                              1. How was your experience? *
                            </label>
                            <div className="grid grid-cols-5 gap-1.5 md:gap-3">
                              {FB_EMOJIS.map((e) => (
                                <button
                                  key={e.val}
                                  onClick={() => setFbRating(e.val)}
                                  className={`flex flex-col items-center justify-center gap-2 py-3 md:py-4 rounded-lg transition-all duration-300 ${fbRating === e.val
                                    ? "bg-brand/10 border border-brand/30 shadow-inner scale-[1.02] ring-2 ring-brand/20 ring-offset-1 ring-offset-background"
                                    : "hover:bg-muted border border-transparent grayscale hover:grayscale-0 opacity-60 hover:opacity-100 hover:scale-105"
                                    }`}
                                >
                                  <span className="text-2xl md:text-4xl filter drop-shadow-sm transform transition-transform duration-300">{e.icon}</span>
                                  <span className={`text-[10px] md:text-xs font-bold ${fbRating === e.val ? "text-brand" : "text-muted-foreground"}`}>{e.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Tags Bento */}
                          <div className="bg-surface border border-border rounded-lg p-4 md:p-5 shadow-sm">
                            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                              2. What is this regarding? <span className="normal-case tracking-normal opacity-70">(Optional)</span>
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {FB_TAGS.map((tag) => {
                                const active = fbSelectedTags.includes(tag);
                                return (
                                  <button
                                    key={tag}
                                    onClick={() => toggleFbTag(tag)}
                                    className={`px-3 md:px-4 py-2 rounded-lg text-[11px] md:text-xs font-bold transition-all border flex items-center gap-1.5 ${active
                                      ? "bg-foreground text-background border-foreground shadow-sm scale-105"
                                      : "bg-background text-muted-foreground border-border hover:border-foreground/30 hover:bg-muted hover:text-foreground"
                                      }`}
                                  >
                                    {active && <CheckCircle className="w-3.5 h-3.5 shrink-0" />}
                                    {tag}
                                  </button>
                                )
                              })}
                            </div>
                          </div>

                          {/* Textarea Bento */}
                          <div className="bg-surface border border-border rounded-lg p-4 md:p-5 shadow-sm">
                            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                              3. Any additional thoughts?
                            </label>
                            <textarea
                              value={fbContent}
                              onChange={(e) => setFbContent(e.target.value)}
                              placeholder="Tell us how we can better support our alumni network..."
                              className="w-full bg-background border border-border rounded-lg px-4 py-3.5 text-sm text-foreground focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all resize-y min-h-[90px] md:min-h-[120px] placeholder:text-muted-foreground/50 custom-scrollbar leading-relaxed"
                            />
                          </div>

                        </div>

                        {/* Footer (Sticky) */}
                        <div className="p-5 md:p-6 border-t border-border bg-card/80 backdrop-blur-md shrink-0">
                          <button
                            onClick={handleSubmitFeedback}
                            disabled={submittingFb || fbRating === 0 || (!fbContent.trim() && fbSelectedTags.length === 0)}
                            className="w-full bg-foreground hover:bg-foreground/90 disabled:bg-muted disabled:text-muted-foreground text-background py-3.5 md:py-4 rounded-lg font-black text-sm md:text-base transition-all flex items-center justify-center gap-2 shadow-lg disabled:shadow-none active:scale-[0.98] disabled:active:scale-100"
                          >
                            {submittingFb ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                            {submittingFb ? "Submitting..." : "Send Feedback"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {isMemModalOpen && (
            <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-card w-full max-w-md rounded-lg p-6 shadow-2xl border border-border space-y-6 animate-in zoom-in-95 duration-300">
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-black text-foreground tracking-tight">Create Memory</h3>
                  <p className="text-sm text-muted-foreground">Share this special moment from your journey</p>
                </div>

                {memPreviews.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 max-h-75 overflow-y-auto p-1 scrollbar-hide">
                    {memPreviews.map((preview, idx) => (
                      <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border-2 border-brand/20 bg-muted group">
                        <img src={preview} alt={`Preview ${idx}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Batch Title (Optional)</label>
                    <input
                      type="text"
                      value={memBatchTitle}
                      onChange={(e) => setMemBatchTitle(e.target.value)}
                      placeholder="e.g. Campus Farewell..."
                      className="w-full bg-muted px-6 py-4 rounded-lg border-transparent focus:border-brand border focus:ring-2 focus:ring-brand outline-none text-foreground font-medium transition-all"
                    />
                    <p className="text-xs text-muted-foreground ml-1">This title will be applied to all {selectedMemFiles.length} images.</p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => { setIsMemModalOpen(false); setSelectedMemFiles([]); setMemPreviews([]); }}
                      className="flex-1 bg-muted text-foreground px-6 py-4 rounded-lg font-bold hover:bg-muted/80 transition-all text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={startMemoryUpload}
                      disabled={memUploading}
                      className="flex-2 bg-brand text-white px-6 py-4 rounded-lg font-bold hover:bg-brand/90 transition-all text-sm disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2 shadow-[var(--shadow-brand)]"
                    >
                      {memUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Uploading {selectedMemFiles.length} Photos...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          Upload All
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Referrals Table */}
          {!loading && !fetchError && referrals.length > 0 && (
            <section className="space-y-6 text-left">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">My Referrals</h2>
              <div className="overflow-hidden rounded-[2.5rem] bg-card shadow-sm border border-border">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-muted/50 border-b border-border text-xs font-black uppercase tracking-widest text-muted-foreground">
                      <tr>
                        <th className="px-8 py-6">Company</th>
                        <th className="px-8 py-6">Position</th>
                        <th className="px-8 py-6">Apply Link</th>
                        <th className="px-8 py-6 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {referrals.map((ref: any) => (
                        <tr key={ref.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-8 py-6 font-bold text-sm text-foreground">{ref.companyName}</td>
                          <td className="px-8 py-6 text-muted-foreground text-xs">{ref.position}</td>
                          <td className="px-8 py-6 text-brand text-xs font-bold truncate max-w-[150px]">{ref.applyLink}</td>
                          <td className="px-8 py-6 text-right">
                            <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase ${getStatusBadge(ref.status)}`}>{ref.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}
          {/* Memories Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Camera className="w-5 h-5 text-brand" />
                My Memories
              </h2>
              <label className="flex items-center gap-2 px-4 py-2 bg-brand/10 text-brand rounded-lg text-xs font-bold hover:bg-brand/20 transition-all cursor-pointer">
                {memUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {memUploading ? "Uploading..." : "Upload Memory"}
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleMemoryUpload} disabled={memUploading} />
              </label>
            </div>
            {memories.length === 0 ? (
              <div className="bg-card rounded-lg border border-border p-8 text-center text-muted-foreground">
                <Camera className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No memories uploaded yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {memories.map((m: any) => (
                  <div key={m.id} className="bg-card rounded-lg border border-border overflow-hidden">
                    <div
                      onClick={() => { setIsMemoryModalOpen(true); setSelectedMemory(m); }}
                      className="aspect-square bg-muted flex items-center justify-center object-top cursor-pointer"
                    >
                      <img src={m.imageUrl} alt="Memory" loading="lazy" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3 flex items-center justify-between">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${m.status === "approved" ? "bg-green-500/10 text-green-600"
                        : m.status === "rejected" ? "bg-red-500/10 text-red-500"
                          : "bg-yellow-500/10 text-yellow-600"
                        }`}>{m.status === "pending_moderation" ? "Pending" : m.status}</span>
                      {isDeleting == m.id ? (<div className="size-5 border-3 border-red-500 rounded-full border-t-transparent animate-spin"></div>) : (
                        <Trash2 className="text-red-500 cursor-pointer size-6" onClick={() => handleDeleteMemory(m.id)} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {isMemoryModalOpen && (
              <div
                onClick={() => setIsMemoryModalOpen(false)}
                className="fixed inset-0 z-50 w-full h-full flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
              >
                <button
                  onClick={() => setIsMemoryModalOpen(false)}
                  className="fixed z-[60] top-4 right-4 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all border border-white/20 hover:scale-110 shadow-lg"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-full max-w-2xl bg-card rounded-lg border border-border shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-[0.98] duration-300"
                >
                  {selectedMemory && (
                    <>
                      {/* Image Viewer */}
                      <div className="bg-muted flex items-center justify-center p-2 min-h-[300px] max-h-[65vh] overflow-hidden">
                        <img
                          src={selectedMemory.imageUrl}
                          alt={selectedMemory.title}
                          className="max-w-full max-h-[63vh] rounded-lg object-contain shadow-sm"
                        />
                      </div>
                      
                      {/* Info & Action Bar */}
                      <div className="p-4 bg-card border-t border-border flex items-center justify-between gap-4">
                        <div className="flex flex-col gap-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">
                            {selectedMemory.title || "Untitled Memory"}
                          </p>
                          <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold w-fit ${
                            selectedMemory.status === "approved"
                              ? "bg-green-500/10 text-green-600"
                              : selectedMemory.status === "rejected"
                              ? "bg-red-500/10 text-red-500"
                              : "bg-yellow-500/10 text-yellow-600"
                          }`}>
                            {selectedMemory.status === "pending_moderation" ? "Pending" : selectedMemory.status}
                          </span>
                        </div>
                        <div className="flex items-center shrink-0">
                          {isDeleting === selectedMemory.id ? (
                            <Loader2 className="w-5 h-5 text-red-500 animate-spin" />
                          ) : (
                            <button
                              onClick={async () => {
                                await handleDeleteMemory(selectedMemory.id);
                                setIsMemoryModalOpen(false);
                                setSelectedMemory(null);
                              }}
                              className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                              title="Delete Memory"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </section>

        </main>
      </div>
      <Footer />
    </>
  );
}

