import React from "react";
import { LogOut, MessageSquareShare, ChevronRight, UserRoundPen } from "lucide-react";
import NotificationBell from "@/components/ui/NotificationBell";
import ProfileCompletionForm from "./ProfileCompletionForm";

interface DashboardHeaderProps {
  showProfileForm: boolean;
  setShowProfileForm: (val: boolean) => void;
  isProfileIncomplete: boolean;
  setShowFeedbackModal: (val: boolean) => void;
  handleLogout: () => void;
  student: any;
  fetchDashboard: () => void;
}

export default function DashboardHeader({
  showProfileForm,
  setShowProfileForm,
  isProfileIncomplete,
  setShowFeedbackModal,
  handleLogout,
  student,
  fetchDashboard,
}: DashboardHeaderProps) {
  return (
    <>
      <section className="hidden md:flex pt-4 md:pt-8 flex-col md:flex-row justify-between md:items-end gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowFeedbackModal(true)}
            className="inline-flex items-center gap-2 text-sm font-bold text-foreground hover:bg-muted transition-colors border border-border px-4 py-2.5 rounded-lg bg-card shadow-sm"
          >
            <MessageSquareShare className="w-4 h-4" />
            Share Feedback
          </button>
          <button
            onClick={() => setShowProfileForm(!showProfileForm)}
            className="relative inline-flex items-center gap-2 text-sm font-bold text-brand hover:text-brand/80 transition-colors border border-brand/20 px-4 py-2.5 rounded-lg bg-brand/5 hover:bg-brand/10"
          >
            <UserRoundPen className="size-4" />
            {showProfileForm ? "Cancel Edit" : "Update Profile"}
            <ChevronRight className={`size-4 transition-transform ${showProfileForm ? "rotate-90" : ""}`} />
            {!showProfileForm && isProfileIncomplete && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-sm" />
            )}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-destructive/10 text-destructive px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-destructive/20 transition-all shadow-sm border border-destructive/10"
          >
            <LogOut className="size-4" /> Logout
          </button>
          <NotificationBell role="student" />
        </div>
      </section>
      <section className="md:hidden flex flex-col gap-2 w-full">
        {/* Grouped action list */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">

          {/* Share Feedback */}
          <button
            onClick={() => setShowFeedbackModal(true)}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-muted/50 transition-colors border-b border-border"
          >
            <span className="w-9 h-9 rounded-xl bg-violet-50 text-violet-700 flex items-center justify-center shrink-0">
              <MessageSquareShare className="w-4 h-4" />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-sm font-medium text-foreground leading-tight">Share feedback</span>
              <span className="block text-xs text-muted-foreground mt-0.5">Rate your T&amp;P experience</span>
            </span>
            <ChevronRight className="w-4 h-4 text-muted-foreground/50 shrink-0" />
          </button>

          {/* Update Profile */}
          <button
            onClick={() => setShowProfileForm(!showProfileForm)}
            className="relative w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-muted/50 transition-colors border-b border-border"
          >
            <span className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <UserRoundPen className="w-4 h-4" />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-sm font-medium text-foreground leading-tight">
                {showProfileForm ? "Cancel editing" : "Update profile"}
              </span>
              <span className="block text-xs text-muted-foreground mt-0.5">
                {showProfileForm ? "Discard unsaved changes" : "Edit your details & resume"}
              </span>
            </span>
            {!showProfileForm && isProfileIncomplete && (
              <span className="absolute top-3 right-9 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
            <ChevronRight
              className={`w-4 h-4 text-muted-foreground/50 shrink-0 transition-transform ${showProfileForm ? "rotate-90" : ""}`}
            />
          </button>

          <div className="md:hidden">
            <ProfileCompletionForm 
              student={student}
              showProfileForm={showProfileForm}
              setShowProfileForm={setShowProfileForm}
              fetchDashboard={fetchDashboard}
            />
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-muted/50 transition-colors"
          >
            <span className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
              <LogOut className="w-4 h-4" />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-sm font-medium text-red-600 leading-tight">Log out</span>
              <span className="block text-xs text-muted-foreground mt-0.5">Sign out of your account</span>
            </span>
            <ChevronRight className="w-4 h-4 text-muted-foreground/50 shrink-0" />
          </button>
        </div>

        {/* Notification bell as its own pill row */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <NotificationBell role="student" />
        </div>
      </section>
    </>
  );
}
