"use client";

import React, { useEffect, useState } from "react";
import {
  Loader2,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Mail,
  BookOpen,
  Hash,
  Search,
} from "lucide-react";
import Nav from "@/components/layout/nav/nav";
import Footer from "@/components/layout/footer/footer";
import { useAuth } from "@/hooks/useAuth";
import { getToken } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
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
  const [students, setStudents] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchVolunteers();
    fetchStudents();
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

      const data = await res.json();
      setVolunteers(data.data || []);
    } catch (err: any) {
      setError(err.message);
      toast.error("Failed to load volunteers");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const token = getToken("admin");
      // This would fetch all students from a new endpoint
      // For now, we'll assume the assignment form will search or select from a list
      // You may need to create a /api/admin/students endpoint
    } catch (err: any) {
      console.error("Failed to fetch students:", err);
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

      const data = await res.json();

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

      const data = await res.json();

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

      const data = await res.json();

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
    <div className="min-h-screen flex flex-col bg-background">
      <Nav />
      <main className="flex-1 w-full p-4 md:p-8 mt-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Volunteer Management
            </h1>
            <p className="text-muted-foreground">
              Manage and assign volunteers to the T&P program
            </p>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, email, or enrollment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none"
              />
            </div>
            <button
              onClick={() => setShowAssignModal(true)}
              className="px-6 py-2 bg-brand text-primary-foreground rounded-lg font-bold hover:bg-brand/90 transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Assign Volunteer
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg mb-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Volunteers Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden shadow-lg">
            {filteredVolunteers.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No volunteers found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted border-b border-border">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-bold text-foreground">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-foreground">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-foreground">
                        Enrollment
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-foreground">
                        Designation
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-foreground">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-foreground">
                        Assigned
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVolunteers.map((volunteer) => (
                      <tr
                        key={volunteer.id}
                        className="border-b border-border hover:bg-muted/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {volunteer.student?.profileImageUrl && (
                              <img
                                src={volunteer.student.profileImageUrl}
                                alt={volunteer.student.name}
                                className="w-8 h-8 rounded-full"
                              />
                            )}
                            <span className="font-medium text-foreground">
                              {volunteer.student?.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {volunteer.student?.email}
                        </td>
                        <td className="px-6 py-4 text-sm font-mono text-muted-foreground">
                          {volunteer.student?.enrollmentNumber}
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground">
                          {volunteer.designation}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {volunteer.isActive ? (
                              volunteer.isVerified ? (
                                <>
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                  <span className="text-xs font-bold text-green-600">
                                    Verified
                                  </span>
                                </>
                              ) : (
                                <>
                                  <Clock className="w-4 h-4 text-yellow-600" />
                                  <span className="text-xs font-bold text-yellow-600">
                                    Pending
                                  </span>
                                </>
                              )
                            ) : (
                              <>
                                <AlertCircle className="w-4 h-4 text-red-600" />
                                <span className="text-xs font-bold text-red-600">
                                  Inactive
                                </span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {volunteer.assignedAt
                            ? new Date(volunteer.assignedAt).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditModal(volunteer)}
                              className="p-2 hover:bg-muted rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4 text-brand" />
                            </button>
                            {volunteer.isActive && (
                              <button
                                onClick={() =>
                                  handleDeactivateVolunteer(volunteer.id)
                                }
                                className="p-2 hover:bg-muted rounded-lg transition-colors"
                                title="Deactivate"
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
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

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <User className="w-5 h-5 text-brand" />
                <span className="text-muted-foreground text-sm">
                  Total Volunteers
                </span>
              </div>
              <p className="text-3xl font-bold">{volunteers.length}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-muted-foreground text-sm">
                  Verified
                </span>
              </div>
              <p className="text-3xl font-bold">
                {volunteers.filter((v) => v.isVerified && v.isActive).length}
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <span className="text-muted-foreground text-sm">Pending</span>
              </div>
              <p className="text-3xl font-bold">
                {volunteers.filter((v) => !v.isVerified && v.isActive).length}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-md w-full p-6 border border-border">
            <h2 className="text-xl font-bold mb-4">Assign Volunteer</h2>
            <form onSubmit={handleAssignVolunteer} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">
                  Student Enrollment Number
                </label>
                <input
                  type="text"
                  placeholder="Enter enrollment number"
                  value={assignForm.studentId}
                  onChange={(e) =>
                    setAssignForm({ ...assignForm, studentId: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">
                  Designation
                </label>
                <input
                  type="text"
                  placeholder="e.g., Drive Coordinator"
                  value={assignForm.designation}
                  onChange={(e) =>
                    setAssignForm({
                      ...assignForm,
                      designation: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">
                  Verification Notes (Optional)
                </label>
                <textarea
                  placeholder="Add notes about this volunteer..."
                  value={assignForm.verificationNotes}
                  onChange={(e) =>
                    setAssignForm({
                      ...assignForm,
                      verificationNotes: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none"
                  rows={3}
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={assignForm.isVerified}
                  onChange={(e) =>
                    setAssignForm({ ...assignForm, isVerified: e.target.checked })
                  }
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm font-medium">
                  Verify immediately
                </span>
              </label>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-brand text-primary-foreground rounded-lg hover:bg-brand/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Assigning...
                    </>
                  ) : (
                    "Assign"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedVolunteer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-md w-full p-6 border border-border">
            <h2 className="text-xl font-bold mb-4">Edit Volunteer</h2>
            <p className="text-sm text-muted-foreground mb-4">
              {selectedVolunteer.student?.name}
            </p>
            <form onSubmit={handleEditVolunteer} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">
                  Designation
                </label>
                <input
                  type="text"
                  value={editForm.designation}
                  onChange={(e) =>
                    setEditForm({ ...editForm, designation: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">
                  Verification Notes
                </label>
                <textarea
                  value={editForm.verificationNotes}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      verificationNotes: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none"
                  rows={3}
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editForm.isVerified}
                  onChange={(e) =>
                    setEditForm({ ...editForm, isVerified: e.target.checked })
                  }
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm font-medium">Verified</span>
              </label>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-brand text-primary-foreground rounded-lg hover:bg-brand/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
