"use client";

import React, { useEffect, useState } from "react";
import {
  Loader2,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Mail,
  Search,
  ArrowLeft,
  UserCheck,
  Users,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getToken } from "@/lib/auth-client";
import Link from "next/link";
import { toast } from "sonner";

interface Volunteer {
  id: string;
  studentId: string;
  designation: string;
  isVerified: boolean;
  isActive: boolean;
  assignedBy: string;
  assignedAt: string;
  verificationNotes?: string;
  student: {
    id: string;
    name: string;
    email: string;
    enrollmentNumber: string;
    branch: string;
    semester: number;
    cgpa: number;
    batch: string;
    profileImageUrl?: string;
  };
}

interface AssignForm {
  studentId: string;
  designation: string;
  verificationNotes: string;
  isVerified: boolean;
}

interface EditForm {
  designation: string;
  verificationNotes: string;
  isVerified: boolean;
}

export default function VolunteersManagement() {
  const { loading: authLoading } = useAuth("admin", "/admin/login");
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [assignForm, setAssignForm] = useState<AssignForm>({
    studentId: "",
    designation: "Volunteer",
    verificationNotes: "",
    isVerified: false,
  });
  const [editForm, setEditForm] = useState<EditForm>({
    designation: "",
    verificationNotes: "",
    isVerified: false,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    try {
      setError(null);
      const token = getToken("admin");
      const res = await fetch("/api/admin/volunteers", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch volunteers");
      }

      const data = (await res.json()) as { success: boolean; data: Volunteer[] };
      setVolunteers(data.data || []);
    } catch (err: any) {
      setError(err.message);
      toast.error("Failed to load volunteers");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignVolunteer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignForm.studentId) {
      toast.error("Please select a student");
      return;
    }

    setSubmitting(true);
    try {
      const token = getToken("admin");
      const res = await fetch("/api/admin/volunteers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(assignForm),
      });

      const data = (await res.json()) as { success: boolean; message?: string; data?: any };

      if (!res.ok) {
        throw new Error(data.message || "Failed to assign volunteer");
      }

      toast.success("Volunteer assigned successfully!");
      setShowAssignModal(false);
      setAssignForm({
        studentId: "",
        designation: "Volunteer",
        verificationNotes: "",
        isVerified: false,
      });
      fetchVolunteers();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditVolunteer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVolunteer) return;

    setSubmitting(true);
    try {
      const token = getToken("admin");
      const res = await fetch(`/api/admin/volunteers/${selectedVolunteer.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      const data = (await res.json()) as { success: boolean; message?: string; data?: any };

      if (!res.ok) {
        throw new Error(data.message || "Failed to update volunteer");
      }

      toast.success("Volunteer updated successfully!");
      setShowEditModal(false);
      fetchVolunteers();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivateVolunteer = async (volunteerId: string) => {
    if (!window.confirm("Are you sure you want to deactivate this volunteer?")) {
      return;
    }

    setSubmitting(true);
    try {
      const token = getToken("admin");
      const res = await fetch(`/api/admin/volunteers/${volunteerId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = (await res.json()) as { success: boolean; message?: string; data?: any };

      if (!res.ok) {
        throw new Error(data.message || "Failed to deactivate volunteer");
      }

      toast.success("Volunteer deactivated successfully!");
      fetchVolunteers();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (volunteer: Volunteer) => {
    setSelectedVolunteer(volunteer);
    setEditForm({
      designation: volunteer.designation,
      verificationNotes: volunteer.verificationNotes || "",
      isVerified: volunteer.isVerified,
    });
    setShowEditModal(true);
  };

  const filteredVolunteers = volunteers.filter((v) =>
    v.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.student?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.student?.enrollmentNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-brand/20 selection:text-brand">
      {/* Premium Glassmorphic Header */}
      <header className="sticky top-0 z-50 w-full bg-card/75 backdrop-blur-xl border-b border-border/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/dashboard"
              className="group p-2 bg-muted hover:bg-brand/10 rounded-lg transition-all duration-300"
              aria-label="Back to Admin Dashboard"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-brand group-hover:-translate-x-1 transition-all duration-300" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand/10 rounded-lg flex items-center justify-center border border-brand/20 shadow-xs shadow-brand/10">
                <UserCheck className="w-5 h-5 text-brand" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg md:text-xl font-black text-foreground tracking-tight flex gap-2">
                    Volunteer <span className="text-brand hidden md:block bg-linear-to-r from-brand to-brand/60 bg-clip-text text-transparent">Management</span>
                  </h1>
                  <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand/10 text-brand">
                    {volunteers.length} Total
                  </span>
                </div>
                <p className="text-xs text-muted-foreground hidden sm:block">Assign student coordinators and manage workspace permissions.</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowAssignModal(true)}
            className="touch-target group flex items-center gap-2 px-3 md:px-5 py-2.5 bg-linear-to-r from-brand to-brand/80 text-primary-foreground hover:shadow-[var(--shadow-brand)] hover:scale-[1.02] active:scale-[0.98] rounded-lg font-bold transition-all duration-300 shadow-md"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
            <span className="flex gap-2">Assign <span className="hidden md:block">Volunteer</span></span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Dynamic Key Stats Section - Highlighted at the Top */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card 1: Total Volunteers */}
          <div className="group relative overflow-hidden bg-card border border-border rounded-lg p-6 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-bl from-brand/10 to-transparent rounded-bl-[4rem]"></div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand/10 rounded-lg flex items-center justify-center text-brand border border-brand/20 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-0.5">
                  Total Volunteers
                </p>
                <p className="text-3xl font-black text-foreground tracking-tight">
                  {volunteers.length}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Sparkles className="w-3.5 h-3.5 text-brand" />
              <span>Coordinating placement operations</span>
            </div>
          </div>

          {/* Card 2: Verified & Active */}
          <div className="group relative overflow-hidden bg-card border border-border rounded-lg p-6 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-bl from-emerald-500/10 to-transparent rounded-bl-[4rem]"></div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-600 border border-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-0.5">
                  Verified Active
                </p>
                <p className="text-3xl font-black text-foreground tracking-tight">
                  {volunteers.filter((v) => v.isVerified && v.isActive).length}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Full portal privileges granted</span>
            </div>
          </div>

          {/* Card 3: Pending Verification */}
          <div className="group relative overflow-hidden bg-card border border-border rounded-lg p-6 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-bl from-amber-500/10 to-transparent rounded-bl-[4rem]"></div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-600 border border-amber-500/20 group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-0.5">
                  Awaiting Review
                </p>
                <p className="text-3xl font-black text-foreground tracking-tight">
                  {volunteers.filter((v) => !v.isVerified && v.isActive).length}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-amber-600 font-semibold">
              <AlertCircle className="w-3.5 h-3.5 animate-pulse" />
              <span>Profiles pending admin audit</span>
            </div>
          </div>
        </section>

        {/* Action and Search Controls */}
        <section className="bg-card border border-border rounded-lg p-4 md:p-6 mb-8 shadow-xs">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search volunteers by name, email, or enrollment number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-muted/50 border border-border rounded-lg focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all placeholder:text-muted-foreground text-sm"
            />
          </div>
        </section>

        {/* Notification / Error Alerts */}
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg mb-8 flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-destructive">Data Sync Failure</h4>
              <p className="text-xs text-destructive/80 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Volunteers Display Area */}
        <section className="space-y-6">
          
          {/* Volunteers Table - Desktop View */}
          <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hidden md:block transition-all duration-300">
            {filteredVolunteers.length === 0 ? (
              <div className="p-16 text-center text-muted-foreground">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 border border-border">
                  <User className="w-8 h-8 opacity-50" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-1">No Volunteers Found</h3>
                <p className="text-sm max-w-xs mx-auto">Try refining your search query or assign a new volunteer above.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border/80">
                      <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        Volunteer Details
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        Enrollment
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        Branch
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        Designation
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        Assigned On
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredVolunteers.map((volunteer) => (
                      <tr
                        key={volunteer.id}
                        className="group hover:bg-muted/30 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="relative shrink-0 w-10 h-10 rounded-full border border-border bg-muted flex items-center justify-center overflow-hidden">
                              {volunteer.student?.profileImageUrl ? (
                                <img
                                  src={volunteer.student.profileImageUrl}
                                  alt={volunteer.student.name}
                                  className="w-full h-full object-cover object-top"
                                />
                              ) : (
                                <span className="font-bold text-brand uppercase text-sm">
                                  {volunteer.student?.name?.substring(0, 2)}
                                </span>
                              )}
                              {volunteer.isActive && volunteer.isVerified && (
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-card"></span>
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-foreground text-sm group-hover:text-brand transition-colors duration-200">
                                {volunteer.student?.name}
                              </div>
                              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                <Mail className="w-3 h-3 shrink-0" />
                                <span className="truncate max-w-[180px]">{volunteer.student?.email}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-foreground font-semibold">
                          {volunteer.student?.enrollmentNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                          {volunteer.student?.branch || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground font-medium">
                          {volunteer.designation}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {volunteer.isActive ? (
                            volunteer.isVerified ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-full text-xs font-bold">
                                <CheckCircle className="w-3.5 h-3.5" />
                                Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded-full text-xs font-bold">
                                <Clock className="w-3.5 h-3.5 animate-pulse" />
                                Pending
                              </span>
                            )
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-destructive/10 text-destructive border border-destructive/20 rounded-full text-xs font-bold">
                              <AlertCircle className="w-3.5 h-3.5" />
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                          {volunteer.assignedAt
                            ? new Date(volunteer.assignedAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end items-center gap-1.5">
                            <button
                              onClick={() => openEditModal(volunteer)}
                              className="p-2 hover:bg-brand/10 hover:text-brand text-muted-foreground rounded-lg transition-all duration-200"
                              title="Edit Permissions"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            {volunteer.isActive && (
                              <button
                                onClick={() => handleDeactivateVolunteer(volunteer.id)}
                                className="p-2 hover:bg-destructive/10 hover:text-destructive text-muted-foreground rounded-lg transition-all duration-200"
                                title="Deactivate Volunteer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Volunteers Cards - Mobile View */}
          <div className="md:hidden grid grid-cols-1 gap-4">
            {filteredVolunteers.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground bg-card border border-border rounded-lg">
                <User className="w-12 h-12 mx-auto mb-3 opacity-45" />
                <h3 className="font-bold text-foreground mb-0.5">No Volunteers</h3>
                <p className="text-xs">No volunteer accounts fit the criteria.</p>
              </div>
            ) : (
              filteredVolunteers.map((volunteer) => (
                <div
                  key={volunteer.id}
                  className="bg-card border border-border rounded-lg p-5 space-y-4 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  {/* Top Profile Header */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-full border border-border bg-muted flex items-center justify-center overflow-hidden shrink-0">
                        {volunteer.student?.profileImageUrl ? (
                          <img
                            src={volunteer.student.profileImageUrl}
                            alt={volunteer.student.name}
                            className="w-full h-full object-cover object-top"
                          />
                        ) : (
                          <span className="font-bold text-brand uppercase text-base">
                            {volunteer.student?.name?.substring(0, 2)}
                          </span>
                        )}
                        {volunteer.isActive && volunteer.isVerified && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-card"></span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-foreground truncate text-sm">
                          {volunteer.student?.name}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3 shrink-0" />
                          <span>{volunteer.student?.email}</span>
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="shrink-0">
                      {volunteer.isActive ? (
                        volunteer.isVerified ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                            Pending
                          </span>
                        )
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-destructive/10 text-destructive border border-destructive/20">
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="h-px bg-border/60" />

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs">
                    <div>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-0.5">
                        Enrollment
                      </p>
                      <p className="font-mono text-foreground font-bold">
                        {volunteer.student?.enrollmentNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-0.5">
                        Designation
                      </p>
                      <p className="text-foreground font-medium">{volunteer.designation}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-0.5">
                        Branch / Course
                      </p>
                      <p className="text-foreground">{volunteer.student?.branch || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-0.5">
                        Assigned On
                      </p>
                      <p className="text-foreground">
                        {volunteer.assignedAt
                          ? new Date(volunteer.assignedAt).toLocaleDateString()
                          : "-"}
                      </p>
                    </div>
                  </div>

                  {/* Verification Notes */}
                  {volunteer.verificationNotes && (
                    <div className="bg-muted/50 border border-border/60 rounded-lg p-3 text-xs leading-relaxed text-muted-foreground">
                      <p className="font-bold text-foreground text-[10px] uppercase tracking-wider mb-1">Verification Notes</p>
                      {volunteer.verificationNotes}
                    </div>
                  )}

                  {/* Interactive Touch actions */}
                  <div className="flex gap-3 pt-1">
                    <button
                      onClick={() => openEditModal(volunteer)}
                      className="touch-target flex-1 px-4 py-2.5 bg-brand/10 hover:bg-brand/20 text-brand rounded-lg font-bold text-xs transition-colors duration-200 flex items-center justify-center gap-1.5"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit Roles
                    </button>
                    {volunteer.isActive && (
                      <button
                        onClick={() => handleDeactivateVolunteer(volunteer.id)}
                        className="touch-target flex-1 px-4 py-2.5 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg font-bold text-xs transition-colors duration-200 flex items-center justify-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Deactivate
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {/* Assign Modal Wrapper */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-lg max-w-md w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-muted/30 border-b border-border/80 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-brand/10 rounded-lg flex items-center justify-center text-brand">
                  <UserCheck className="w-4 h-4" />
                </div>
                <h2 className="text-base font-black text-foreground">Assign New Volunteer</h2>
              </div>
              <button
                onClick={() => setShowAssignModal(false)}
                className="p-1 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAssignVolunteer} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Student Enrollment Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 19CS012"
                  value={assignForm.studentId}
                  onChange={(e) =>
                    setAssignForm({ ...assignForm, studentId: e.target.value.toUpperCase() })
                  }
                  className="uppercase w-full px-4 py-3 bg-muted/40 border border-border rounded-lg focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none text-sm font-semibold tracking-wider placeholder:text-muted-foreground/60 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Volunteer Designation
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Drive Coordinator, T&P Representative"
                  value={assignForm.designation}
                  onChange={(e) =>
                    setAssignForm({ ...assignForm, designation: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-muted/40 border border-border rounded-lg focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none text-sm placeholder:text-muted-foreground/60 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Verification Notes (Optional)
                </label>
                <textarea
                  placeholder="Add details about their task assignments or verification details..."
                  value={assignForm.verificationNotes}
                  onChange={(e) =>
                    setAssignForm({ ...assignForm, verificationNotes: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-muted/40 border border-border rounded-lg focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none text-sm placeholder:text-muted-foreground/60 transition-all resize-none"
                  rows={3}
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer group select-none">
                  <input
                    type="checkbox"
                    checked={assignForm.isVerified}
                    onChange={(e) =>
                      setAssignForm({ ...assignForm, isVerified: e.target.checked })
                    }
                    className="w-4.5 h-4.5 rounded border-border text-brand focus:ring-brand cursor-pointer"
                  />
                  <div>
                    <span className="text-sm font-semibold text-foreground group-hover:text-brand transition-colors">
                      Verify immediately
                    </span>
                    <p className="text-[10px] text-muted-foreground">Skip verification queue and grant instant access privileges.</p>
                  </div>
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-border/80 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="flex-1 py-2.5 border border-border rounded-lg text-sm font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-brand text-primary-foreground rounded-lg text-sm font-bold hover:bg-brand/90 disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Assigning...
                    </>
                  ) : (
                    "Assign Role"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal Wrapper */}
      {showEditModal && selectedVolunteer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-lg max-w-md w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-muted/30 border-b border-border/80 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-brand/10 rounded-lg flex items-center justify-center text-brand">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-black text-foreground">Edit Volunteer</h2>
                  <p className="text-[10px] text-brand font-bold uppercase tracking-wider">{selectedVolunteer.student?.name}</p>
                </div>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleEditVolunteer} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Volunteer Designation
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lead Coordinator"
                  value={editForm.designation}
                  onChange={(e) =>
                    setEditForm({ ...editForm, designation: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-muted/40 border border-border rounded-lg focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none text-sm placeholder:text-muted-foreground/60 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Verification Notes
                </label>
                <textarea
                  placeholder="Add update remarks or specific tasks details..."
                  value={editForm.verificationNotes}
                  onChange={(e) =>
                    setEditForm({ ...editForm, verificationNotes: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-muted/40 border border-border rounded-lg focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none text-sm placeholder:text-muted-foreground/60 transition-all resize-none"
                  rows={3}
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer group select-none">
                  <input
                    type="checkbox"
                    checked={editForm.isVerified}
                    onChange={(e) =>
                      setEditForm({ ...editForm, isVerified: e.target.checked })
                    }
                    className="w-4.5 h-4.5 rounded border-border text-brand focus:ring-brand cursor-pointer"
                  />
                  <div>
                    <span className="text-sm font-semibold text-foreground group-hover:text-brand transition-colors">
                      Verified Member
                    </span>
                    <p className="text-[10px] text-muted-foreground">Toggling verification controls their student portal dashboard access.</p>
                  </div>
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-border/80 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-2.5 border border-border rounded-lg text-sm font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-brand text-primary-foreground rounded-lg text-sm font-bold hover:bg-brand/90 disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
