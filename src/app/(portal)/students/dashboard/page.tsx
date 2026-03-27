"use client";

import React, { useEffect, useState } from "react";
import {
  Loader2,
  GraduationCap,
  Briefcase,
  TrendingUp,
  Camera,
  CheckCircle,
  Clock,
  CalendarDays,
  Building2,
  BadgeCheck,
  BadgeAlert,
  Upload,
  XCircle,
  FileText,
} from "lucide-react"
import Nav from "@/components/layout/nav/nav"
import Footer from "@/components/layout/footer/footer"
import { useAuth } from "@/hooks/useAuth"
import { getToken } from "@/lib/auth-client"
import JobDetailsModal from "@/components/forms/studentApplyModal/modal";
import { Student, PlacementDrive, DriveRegistration, Memory } from "@/types";
import { uploadFileToR2 } from "@/lib/upload-r2";
import { Camera as CameraIcon } from "lucide-react";

export default function StudentDashboard() {
  const { loading: authLoading, authenticated, user } = useAuth("student", "/students/login");
  const [data, setData] = useState<{
    student: Student;
    drives: PlacementDrive[];
    archivedDrives?: PlacementDrive[];
    registrations: DriveRegistration[];
    memories: Memory[];
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDrive, setSelectedDrive] = useState<PlacementDrive | null>(null)
  const [memUploading, setMemUploading] = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);

  useEffect(() => {
    if (!authenticated) return;
    fetchDashboard();
  }, [authenticated]);

  const fetchDashboard = async () => {
    try {
      const token = getToken("student");
      const res = await fetch("/api/student/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const d = (await res.json()) as any;
      if (d.success) setData(d);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setResumeUploading(true);
      const url = await uploadFileToR2(file, "resumes");
      const token = getToken("student");
      const res = await fetch("/api/student/update-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ resumeUrl: url }),
      });
      const d = await res.json() as any;
      if (d.success) {
        alert("Resume updated successfully!");
        fetchDashboard();
      } else {
        throw new Error(d.message);
      }
    } catch (err: any) {
      console.error(err);
      alert("Resume upload failed: " + err.message);
    } finally {
      setResumeUploading(false);
    }
  };

  const handleMemoryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) { // 10MB for memories
      alert("Image must be smaller than 10MB");
      return;
    }

    try {
      setMemUploading(true);
      const imageUrl = await uploadFileToR2(file, "memories");

      const token = getToken("student");
      const res = await fetch("/api/student/memories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ imageUrl }),
      });

      const d = await res.json() as any
      if (d.success) {
        alert("Memory uploaded! It will appear after moderation.");
        fetchDashboard();
      } else {
        throw new Error(d.message);
      }
    } catch (err: any) {
      console.error(err);
      alert("Memory upload failed: " + err.message);
    } finally {
      setMemUploading(false);
    }
  };

  if (authLoading || !authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    );
  }

  const student = data?.student;
  const drives = data?.drives || [];
  const archivedDrives = data?.archivedDrives || [];
  const registrations = data?.registrations || [];
  const memories = data?.memories || [];

  return (
    <>
      <Nav />
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
        />
      )}
      <div className="bg-background text-foreground antialiased font-sans min-h-screen mt-15">
        <div className="fixed bottom-0 right-0 w-96 h-96 bg-brand/5 rounded-full blur-[120px] -z-10" />
        <div className="fixed top-1/2 left-0 w-64 h-64 bg-brand/5 rounded-full blur-[100px] -z-10" />

        <main className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
          {/* Header */}
          <section className="pt-4 md:pt-8">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
              Welcome, <span className="text-brand">{student?.name || "Student"}</span>
            </h1>
          </section>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-brand" />
            </div>
          ) : (
            <>
              {/* Academic Profile Card */}
              <section className="relative">
                <div className="space-y-8">
                  <section className="relative">
                    {/* Background Glows */}
                    <div className="absolute -top-12 -left-12 w-64 h-64 bg-brand/10 rounded-full blur-3xl -z-10"></div>
                    <div className="absolute top-24 -right-12 w-48 h-48 bg-foreground/5 rounded-full blur-3xl -z-10"></div>

                    <div className="bg-card rounded-2xl p-8 md:p-12 shadow-sm border border-border flex flex-col md:flex-row gap-8 md:items-center relative overflow-hidden group hover:shadow-xl transition-shadow duration-500">

                      {/* Decorative Gradient Accent */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-brand/10 to-transparent rounded-bl-[5rem]"></div>

                      {/* Avatar Section */}
                      <div className="relative shrink-0 mx-auto md:mx-0">
                        <div className="w-40 h-40 md:w-56 md:h-56 rounded-full p-2 bg-gradient-to-tr from-brand to-brand/40 transition-transform duration-500 group-hover:rotate-6">
                          <div className="w-full h-full rounded-full border-4 border-background overflow-hidden bg-muted">
                            {student?.profileImageUrl ? (
                              <img
                                alt="Student Portrait"
                                className="w-full h-full object-cover"
                                src={student.profileImageUrl}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-4xl font-black text-muted-foreground uppercase">
                                {student?.name?.charAt(0)}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Verified Badge */}
                        <div className="absolute bottom-4 bg-background right-0 md:right-4 size-10 rounded-full flex shrink-0 items-center justify-center">
                          {user?.isVerified ? (
                            <BadgeCheck className={`size-11 text-center text-brand`} />
                          ) : (
                            <BadgeAlert className={`size-11 text-center text-red-500`} />
                          )}
                        </div>

                      </div>

                      {/* Info Section */}
                      <div className="flex-1 space-y-6 text-center md:text-left">
                        <div className="space-y-2">
                          <p className="text-brand font-bold text-xs uppercase tracking-[0.3em]">
                            Institutional Identity
                          </p>
                          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter leading-none">
                            {student?.name}
                          </h1>
                          <p className="text-lg md:text-xl font-medium text-muted-foreground tracking-tight">
                            {student?.course}
                          </p>
                        </div>

                        {/* Horizontal Grid Stats */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-0 pt-6 border-t border-border">
                          <div className="md:pr-6 md:border-r border-border">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Current CGPA</p>
                            <p className="text-2xl font-bold text-brand">{student?.cgpa}</p>
                          </div>
                          <div className="md:px-6 md:border-r border-border">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Branch</p>
                            <p className="text-lg font-bold text-foreground leading-tight">{student?.branch}</p>
                          </div>
                          <div className="md:px-6 md:border-r border-border">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Semester</p>
                            <p className="text-2xl font-bold text-foreground">{student?.semester}</p>
                          </div>
                          <div className="md:px-6 md:border-r border-border">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Course</p>
                            <p className="text-2xl font-bold text-foreground">{student?.course}</p>
                          </div>
                        </div>

                        {/* Resume Actions */}
                        <div className="pt-6 flex flex-wrap items-center gap-3">
                          {student?.resumeUrl ? (
                            <a href={student.resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-brand/10 text-brand rounded-xl font-bold hover:bg-brand/20 transition-colors text-sm">
                              <FileText className="w-4 h-4" /> View Resume
                            </a>
                          ) : (
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-muted text-muted-foreground rounded-xl font-bold text-sm">
                              <FileText className="w-4 h-4" /> No Resume
                            </span>
                          )}
                          <label className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-xl text-sm font-bold hover:bg-muted/80 transition-all cursor-pointer">
                            {resumeUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                            {resumeUploading ? "Uploading..." : "Update Resume"}
                            <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleResumeUpload} disabled={resumeUploading} />
                          </label>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </section>

              {/* Stats */}
              {!loading && data && (
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
                    <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center mb-3">
                      <Briefcase className="w-5 h-5 text-brand" />
                    </div>
                    <p className="text-2xl font-black text-foreground">{drives.length}</p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-1">Eligible Drives</p>
                  </div>
                  <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
                    <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center mb-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <p className="text-2xl font-black text-foreground">{registrations.length}</p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-1">Registrations</p>
                  </div>
                  <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center mb-3">
                      <Camera className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className="text-2xl font-black text-foreground">{memories.length}</p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-1">Memories</p>
                  </div>
                  <div className="bg-brand text-primary-foreground rounded-2xl p-5 shadow-xl shadow-brand/20">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <p className="text-2xl font-black">{registrations.filter((r: any) => r.attended).length}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider mt-1 opacity-80">Attended</p>
                  </div>
                </section>
              )}

              {loading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-brand" />
                </div>
              ) : (
                <>
                </>
              )}

              {/* Upcoming Drives */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-brand" />
                  Upcoming Drives
                </h2>
                {drives.length === 0 ? (
                  <div className="bg-card rounded-2xl border border-border p-8 text-center text-muted-foreground">
                    <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No eligible drives available right now</p>
                    <p className="text-xs mt-1">Check back later for new opportunities</p>
                  </div>
                ) : (
                  <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-muted/50 border-b border-border">
                            <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Company</th>
                            <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Role</th>
                            <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">CTC</th>
                            <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Date</th>
                            <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Type</th>
                            <th className="text-right px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {drives.map((drive: any) => (
                            <tr key={drive.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                              <td className="px-5 py-3.5">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-brand/10 rounded-lg flex items-center justify-center">
                                    <Building2 className="w-4 h-4 text-brand" />
                                  </div>
                                  <span className="font-medium text-foreground">{drive.companyName}</span>
                                </div>
                              </td>
                              <td className="px-5 py-3.5 text-muted-foreground">{drive.roleName}</td>
                              <td className="px-5 py-3.5 font-bold text-foreground">{drive.ctc}</td>
                              <td className="px-5 py-3.5 text-muted-foreground">{new Date(drive.driveDate).toLocaleDateString()}</td>
                              <td className="px-5 py-3.5">
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${drive.driveType === "Open" ? "bg-green-500/10 text-green-600" : "bg-blue-500/10 text-blue-600"
                                  }`}>{drive.driveType}</span>
                              </td>
                              <td className="px-5 py-3.5 text-right">
                                {(() => {
                                  const isEligible = (drive.course === "All" || drive.course?.includes(student?.course)) && 
                                                     drive.eligibleBranches?.includes(student?.branch) && 
                                                     (student?.cgpa || 0) >= drive.minCGPA;

                                  if (drive.isRegistered) {
                                    return (
                                      <span className="inline-flex items-center gap-1 text-green-600 text-xs font-bold">
                                        <CheckCircle className="w-4 h-4" /> Registered
                                      </span>
                                    );
                                  }
                                  if (!isEligible) {
                                    return <span className="inline-flex items-center gap-1 text-red-500 text-xs font-bold"><XCircle className="w-4 h-4" /> Ineligible</span>;
                                  }
                                  return (
                                    <button
                                      onClick={() => {
                                        setSelectedDrive(drive);
                                        setIsModalOpen(true);
                                      }}
                                      className="bg-brand text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-brand/90 transition-all disabled:opacity-50"
                                    >
                                      Register
                                    </button>
                                  );
                                })()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </section>

              {/* My Registrations */}
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-brand" />
                  My Registrations
                </h2>
                {registrations.length === 0 ? (
                  <div className="bg-card rounded-2xl border border-border p-8 text-center text-muted-foreground">
                    <p className="font-medium">No registrations yet</p>
                    <p className="text-xs mt-1">Register for a drive from the list above</p>
                  </div>
                ) : (
                  <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-muted/50 border-b border-border">
                            <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Company</th>
                            <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Role</th>
                            <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Date</th>
                            <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Action Status</th>
                            <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Drive Status</th>
                            <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Attendance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {registrations.map((reg: any) => (
                            <tr key={reg.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                              <td className="px-5 py-3.5 font-medium text-foreground">{reg.drive?.companyName}</td>
                              <td className="px-5 py-3.5 text-muted-foreground">{reg.drive?.roleName}</td>
                              <td className="px-5 py-3.5 text-muted-foreground">{reg.drive?.driveDate ? new Date(reg.drive.driveDate).toLocaleDateString() : "-"}</td>
                              <td className="px-5 py-3.5">
                                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider ${
                                  reg.status === "Selected" ? "bg-green-500/10 text-green-600" :
                                  reg.status === "Rejected" ? "bg-red-500/10 text-red-500" :
                                  reg.status === "Shortlisted" ? "bg-yellow-500/10 text-yellow-600" :
                                  "bg-muted text-muted-foreground"
                                }`}>
                                  {reg.status || "Applied"}
                                </span>
                              </td>
                              <td className="px-5 py-3.5">
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold capitalize ${reg.drive?.status === "active" ? "bg-green-500/10 text-green-600"
                                  : reg.drive?.status === "completed" ? "bg-blue-500/10 text-blue-600"
                                    : "bg-muted text-muted-foreground"
                                  }`}>{reg.drive?.status}</span>
                              </td>
                              <td className="px-5 py-3.5">
                                {reg.attended ? (
                                  <span className="text-green-600 text-xs font-bold flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Present</span>
                                ) : (
                                  <span className="text-muted-foreground text-xs font-bold flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Upcoming</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </section>

              {/* Archived Drives */}
              {archivedDrives.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2 opacity-70">
                    <CalendarDays className="w-5 h-5 text-brand" />
                    Archived Drives History
                  </h2>
                  <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden opacity-70">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-muted/50 border-b border-border">
                            <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Company</th>
                            <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Role</th>
                            <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Date</th>
                            <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {archivedDrives.map((drive: any) => (
                            <tr key={drive.id} className="border-b border-border/50">
                              <td className="px-5 py-3.5 font-medium text-foreground">{drive.companyName}</td>
                              <td className="px-5 py-3.5 text-muted-foreground">{drive.roleName}</td>
                              <td className="px-5 py-3.5 text-muted-foreground">{new Date(drive.driveDate).toLocaleDateString()}</td>
                              <td className="px-5 py-3.5">
                                {drive.isRegistered ? (
                                  <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-brand/10 text-brand">Registered</span>
                                ) : (
                                  <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-muted text-muted-foreground">Not Registered</span>
                                )}
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
                    <CameraIcon className="w-5 h-5 text-brand" />
                    My Memories
                  </h2>
                  <label className="flex items-center gap-2 px-4 py-2 bg-brand/10 text-brand rounded-xl text-xs font-bold hover:bg-brand/20 transition-all cursor-pointer">
                    {memUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {memUploading ? "Uploading..." : "Upload Memory"}
                    <input type="file" accept="image/*" className="hidden" onChange={handleMemoryUpload} disabled={memUploading} />
                  </label>
                </div>
                {memories.length === 0 ? (
                  <div className="bg-card rounded-2xl border border-border p-8 text-center text-muted-foreground">
                    <Camera className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No memories uploaded yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {memories.map((m: any) => (
                      <div key={m.id} className="bg-card rounded-2xl border border-border overflow-hidden">
                        <div className="aspect-square bg-muted flex items-center justify-center">
                          <img src={m.imageUrl} alt="Memory" className="w-full h-full object-cover" />
                        </div>
                        <div className="p-3">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${m.status === "approved" ? "bg-green-500/10 text-green-600"
                            : m.status === "rejected" ? "bg-red-500/10 text-red-500"
                              : "bg-yellow-500/10 text-yellow-600"
                            }`}>{m.status === "pending_moderation" ? "Pending" : m.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </main>
      </div >

      <Footer />
    </>
  );
}