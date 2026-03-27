"use client";

import React, { useEffect, useState } from "react";
import {
  GraduationCap,
  Briefcase,
  CheckCircle,
  Clock,
  Building2,
  AlertTriangle,
  XCircle,
  CalendarDays,
  Camera,
  CheckCircle2,
  FileText,
  Upload,
  Loader2,
} from "lucide-react";
import Nav from "@/components/layout/nav/nav";
import Footer from "@/components/layout/footer/footer";
import { useAuth } from "@/hooks/useAuth";
import { getToken } from "@/lib/auth-client";
import { uploadFileToR2 } from "@/lib/upload-r2";
import { PlacementDrive } from "@prisma/client";
import JobDetailsModal from "@/components/forms/studentApplyModal/modal";

export default function ExternalStudentDashboard() {
  const { loading: authLoading, authenticated, user } = useAuth("external_student", "/students/login");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState<string | null>(null);
  const [regMsg, setRegMsg] = useState<{ id: string; msg: string; ok: boolean } | null>(null);

  useEffect(() => {
    if (!authenticated) return;
    fetchDashboard();
  }, [authenticated]);

  const fetchDashboard = async () => {
    try {
      const token = getToken("external_student");
      const res = await fetch("/api/external/dashboard", {
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

  const [selectedDrive, setSelectedDrive] = useState<PlacementDrive | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [resumeUploading, setResumeUploading] = useState(false);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    try {
      setResumeUploading(true);
      const url = await uploadFileToR2(e.target.files[0], "resumes");
      const token = getToken("external_student");
      const res = await fetch("/api/external/update-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ profileImageUrl: student?.profileImageUrl, resumeUrl: url }),
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

  return (
    <>
      <Nav />
      {selectedDrive && (
        <JobDetailsModal
          role="external_student"
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

        <main className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
          {/* Header */}
          <section className="pt-4 md:pt-8">
            <div className="flex flex-col md:flex-row gap-8 md:items-center">
              {/* Avatar Section */}
              <div className="relative shrink-0 mx-auto md:mx-0 group">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl p-1 bg-gradient-to-tr from-brand to-brand/40 overflow-hidden">
                  <div className="w-full h-full rounded-[1.4rem] border-2 border-background overflow-hidden bg-muted">
                    {student?.profileImageUrl ? (
                      <img src={student.profileImageUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl font-black text-muted-foreground uppercase bg-surface">
                        {student?.name?.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>
                
              </div>

              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-600 text-xs font-bold uppercase tracking-widest mb-4">
                  <GraduationCap className="w-4 h-4" /> External Student
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
                  Welcome, <span className="text-brand">{user?.name || student?.name || "Student"}</span>
                </h1>
                {student && (
                  <p className="text-muted-foreground mt-2 text-sm flex items-center gap-2">
                    <Building2 className="w-4 h-4" /> {student.collegeName} • {student.branch} • CGPA {student.cgpa}
                  </p>
                )}
                
                <div className="mt-4 flex flex-wrap items-center gap-3">
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

          {/* Screening Status */}
          {!loading && student && (
            <section>
              {student.isVerified ? (
                <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-5 flex items-center gap-4">
                  <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-green-600">Profile Verified</p>
                    <p className="text-sm text-muted-foreground">You can register for open campus drives below.</p>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-5 flex items-center gap-4">
                  <AlertTriangle className="w-8 h-8 text-yellow-500 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-yellow-600">Profile Pending Verification</p>
                    <p className="text-sm text-muted-foreground">Your profile and resume are being verified by the admin. You'll be able to register for drives once verified.</p>
                  </div>
                </div>
              )}
            </section>
          )}

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-brand" /></div>
          ) : (
            <>
              {/* Stats */}
              <section className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
                  <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center mb-3"><Briefcase className="w-5 h-5 text-brand" /></div>
                  <p className="text-2xl font-black text-foreground">{drives.length}</p>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-1">Open Drives</p>
                </div>
                <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
                  <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center mb-3"><CheckCircle className="w-5 h-5 text-green-500" /></div>
                  <p className="text-2xl font-black text-foreground">{registrations.length}</p>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-1">Registrations</p>
                </div>
                <div className={`rounded-2xl p-5 shadow-sm ${student?.isVerified ? "bg-green-500/10 border border-green-500/20" : "bg-yellow-500/10 border border-yellow-500/20"}`}>
                  <div className="w-10 h-10 bg-white/50 rounded-xl flex items-center justify-center mb-3">
                    {student?.isVerified ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Clock className="w-5 h-5 text-yellow-600" />}
                  </div>
                  <p className="text-2xl font-black text-foreground">{student?.isVerified ? "✓" : "⏳"}</p>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-1">Verification</p>
                </div>
              </section>

              {/* Open Drives */}
              {student?.isVerified && (
                <section>
                  <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-brand" /> Open Campus Drives
                  </h2>
                  {drives.length === 0 ? (
                    <div className="bg-card rounded-2xl border border-border p-8 text-center text-muted-foreground">
                      <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="font-medium">No open drives available</p>
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
                              <th className="text-right px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {drives.map((drive: any) => (
                              <tr key={drive.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                                <td className="px-5 py-3.5">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-brand/10 rounded-lg flex items-center justify-center"><Building2 className="w-4 h-4 text-brand" /></div>
                                    <span className="font-medium text-foreground">{drive.companyName}</span>
                                  </div>
                                </td>
                                <td className="px-5 py-3.5 text-muted-foreground">{drive.roleName}</td>
                                <td className="px-5 py-3.5 font-bold text-foreground">{drive.ctc}</td>
                                <td className="px-5 py-3.5 text-muted-foreground">{new Date(drive.driveDate).toLocaleDateString()}</td>
                                <td className="px-5 py-3.5 text-right">
                                  {(() => {
                                    const isEligible = drive.eligibleBranches?.includes(student?.branch) && (student?.cgpa || 0) >= drive.minCGPA;
                                    
                                    if (drive.isRegistered) {
                                      return <span className="inline-flex items-center gap-1 text-green-600 text-xs font-bold"><CheckCircle className="w-4 h-4" /> Registered</span>;
                                    }
                                    if (!isEligible) {
                                      return <span className="inline-flex items-center gap-1 text-red-500 text-xs font-bold"><XCircle className="w-4 h-4" /> Ineligible</span>;
                                    }
                                    return (
                                      <button onClick={() => { setSelectedDrive(drive); setIsModalOpen(true); }}
                                        className="bg-brand text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-brand/90 transition-all disabled:opacity-50"
                                      >View Details</button>
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
              )}

              {/* Registrations */}
              {registrations.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold text-foreground mb-4">My Registrations</h2>
                  <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-muted/50 border-b border-border">
                            <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Company</th>
                            <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Role</th>
                            <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Date</th>
                            <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                            <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Attendance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {registrations.map((r: any) => (
                            <tr key={r.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                              <td className="px-5 py-3.5 font-medium text-foreground">{r.drive?.companyName}</td>
                              <td className="px-5 py-3.5 text-muted-foreground">{r.drive?.roleName}</td>
                              <td className="px-5 py-3.5 text-muted-foreground">{r.drive?.driveDate ? new Date(r.drive.driveDate).toLocaleDateString() : "-"}</td>
                              <td className="px-5 py-3.5">
                                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider ${
                                  r.status === "Selected" ? "bg-green-500/10 text-green-600" :
                                  r.status === "Rejected" ? "bg-red-500/10 text-red-500" :
                                  r.status === "Shortlisted" ? "bg-yellow-500/10 text-yellow-600" :
                                  "bg-muted text-muted-foreground"
                                }`}>
                                  {r.status || "Applied"}
                                </span>
                              </td>
                              <td className="px-5 py-3.5">
                                {r.attended ? (
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
                </section>
              )}

              {/* Archived Drives */}
              {archivedDrives.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold text-foreground mb-4 opacity-70">Archived Drives History</h2>
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
            </>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}
