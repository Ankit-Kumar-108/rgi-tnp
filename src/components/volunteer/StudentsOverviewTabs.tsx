"use client";

import React, { useMemo } from "react";
import { Search, GraduationCap } from "lucide-react";

interface StudentData {
  registrationId: string;
  driveId: string;
  studentId: string;
  studentType: "internal" | "external";
  name: string;
  enrollmentNumber: string;
  email: string;
  branch: string;
  cgpa: number;
  semester?: number;
  batch?: string;
  collegeName?: string;
  profileImageUrl?: string;
  companyName: string;
  roleName: string;
  ctc: string;
  minCGPA: number;
  jobType: string;
  driveDate: string | Date;
  status: "Applied" | "Selected" | "Rejected" | "Shortlisted";
  appliedAt: string | Date;
}

type TabType = "all" | "selected" | "rejected" | "shortlisted";

interface StudentsOverviewTabsProps {
  students: StudentData[];
  loading?: boolean;
}

const statusColors: Record<string, { bg: string; badge: string; text: string }> = {
  Applied: { bg: "bg-gray-50", badge: "bg-gray-100 text-gray-700", text: "gray" },
  Selected: { bg: "bg-green-50", badge: "bg-green-100 text-green-700", text: "green" },
  Rejected: { bg: "bg-red-50", badge: "bg-red-100 text-red-700", text: "red" },
  Shortlisted: { bg: "bg-blue-50", badge: "bg-blue-100 text-blue-700", text: "blue" },
};

export default function StudentsOverviewTabs({ students, loading = false }: StudentsOverviewTabsProps) {
  const [activeTab, setActiveTab] = React.useState<TabType>("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  const tabs: { id: TabType; label: string; status?: string }[] = [
    { id: "all", label: "All Students" },
    { id: "selected", label: "Selected", status: "Selected" },
    { id: "rejected", label: "Rejected", status: "Rejected" },
    { id: "shortlisted", label: "Shortlisted", status: "Shortlisted" },
  ];

  const filteredStudents = useMemo(() => {
    let filtered = students;

    // Filter by status tab
    if (activeTab !== "all") {
      const statusMap: Record<TabType, string> = {
        all: "",
        selected: "Selected",
        rejected: "Rejected",
        shortlisted: "Shortlisted",
      };
      filtered = filtered.filter((s) => s.status === statusMap[activeTab]);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.enrollmentNumber.toLowerCase().includes(query) ||
          s.email.toLowerCase().includes(query) ||
          s.companyName.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [students, activeTab, searchQuery]);

  const stats = useMemo(() => {
    return {
      all: students.length,
      selected: students.filter((s) => s.status === "Selected").length,
      rejected: students.filter((s) => s.status === "Rejected").length,
      shortlisted: students.filter((s) => s.status === "Shortlisted").length,
    };
  }, [students]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-brand/10 mx-auto mb-4 flex items-center justify-center animate-pulse">
            <GraduationCap className="w-6 h-6 text-brand" />
          </div>
          <p className="text-muted-foreground">Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              activeTab === tab.id
                ? "border-brand bg-brand/5"
                : "border-border bg-card hover:border-brand/50"
            }`}
          >
            <div className="text-sm text-muted-foreground font-medium">
              {tab.label}
            </div>
            <div className={`text-2xl font-bold mt-2 ${
              activeTab === tab.id ? "text-brand" : "text-foreground"
            }`}>
              {tab.id === "all" ? stats.all : stats[tab.id as keyof typeof stats]}
            </div>
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by name, enrollment, email, or company..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
        />
      </div>

      {/* Students List/Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {filteredStudents.length === 0 ? (
          <div className="flex items-center justify-center py-12 px-4">
            <div className="text-center">
              <GraduationCap className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">
                {students.length === 0
                  ? "No students found"
                  : "No students match your search"}
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Student
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Enrollment
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Branch
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    CGPA
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Company
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredStudents.map((student) => {
                  const statusColor = statusColors[student.status];
                  return (
                    <tr
                      key={`${student.registrationId}`}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          {student.profileImageUrl ? (
                            <img
                              src={student.profileImageUrl}
                              alt={student.name}
                              className="w-10 h-10 rounded-full object-cover shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center text-xs font-semibold text-brand">
                              {student.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-foreground">
                              {student.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {student.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {student.enrollmentNumber}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {student.branch}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground font-medium">
                        {student.cgpa.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="font-medium text-foreground">
                          {student.companyName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {student.roleName}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColor.badge}`}
                        >
                          {student.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mobile View - Card Layout */}
      <div className="md:hidden space-y-3">
        {filteredStudents.length === 0 ? null : (
          filteredStudents.map((student) => {
            const statusColor = statusColors[student.status];
            return (
              <div
                key={`${student.registrationId}`}
                className={`p-4 rounded-xl border border-border ${statusColor.bg}`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    {student.profileImageUrl ? (
                      <img
                        src={student.profileImageUrl}
                        alt={student.name}
                        className="w-10 h-10 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-sm font-semibold text-brand shrink-0">
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="font-semibold text-foreground truncate">
                        {student.name}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {student.enrollmentNumber}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-semibold shrink-0 ${statusColor.badge}`}
                  >
                    {student.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Branch:</span>{" "}
                    <span className="font-medium">{student.branch}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">CGPA:</span>{" "}
                    <span className="font-medium">{student.cgpa.toFixed(2)}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Company:</span>{" "}
                    <span className="font-medium">{student.companyName}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Role:</span>{" "}
                    <span className="font-medium">{student.roleName}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
