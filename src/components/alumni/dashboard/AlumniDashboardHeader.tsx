import React from "react";
import { LogOut, MessageSquareShare, ChevronRight, UserRoundPen, Send } from "lucide-react";
import NotificationBell from "@/components/ui/NotificationBell";
import AlumniProfileCompletionForm from "./AlumniProfileCompletionForm";

interface AlumniDashboardHeaderProps {
  showProfileForm: boolean;
  setShowProfileForm: (val: boolean) => void;
  isProfileIncomplete: boolean;
  setShowFeedbackModal: (val: boolean) => void;
  setShowReferralModal: (val: boolean) => void;
  handleLogout: () => void;
  alumni: any;
  fetchDashboard: () => void;
}

export default function AlumniDashboardHeader({
  showProfileForm,
  setShowProfileForm,
  isProfileIncomplete,
  setShowFeedbackModal,
  setShowReferralModal,
  handleLogout,
  alumni,
  fetchDashboard,
}: AlumniDashboardHeaderProps) {
  return (
    <>
      <section className="hidden md:flex pt-4 md:pt-8 flex-col md:flex-row justify-between md:items-end gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowReferralModal(true)}
            className="inline-flex items-center gap-2 text-sm font-bold text-primary-foreground hover:opacity-90 transition-opacity border border-transparent px-4 py-2.5 rounded-lg bg-brand shadow-md"
          >
            <Send className="w-4 h-4" />
            Post a Referral
          </button>
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
            <UserRoundPen className="w-4 h-4" />
            {showProfileForm ? "Cancel Edit" : "Update Profile"}
            <ChevronRight className={`w-4 h-4 transition-transform ${showProfileForm ? "rotate-90" : ""}`} />
            {!showProfileForm && isProfileIncomplete && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-sm" />
            )}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-destructive/10 text-destructive px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-destructive/20 transition-all shadow-sm border border-destructive/10"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
          <NotificationBell role="alumni" />
        </div>
      </section>

      <section className="md:hidden flex flex-col gap-2 w-full">
        {/* Grouped action list */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">

          {/* Post Referral */}
          <button
            onClick={() => setShowReferralModal(true)}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-muted/50 transition-colors border-b border-border"
          >
            <span className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <Send className="w-4 h-4" />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-sm font-medium text-foreground leading-tight">Post a Referral</span>
              <span className="block text-xs text-muted-foreground mt-0.5">Refer a job to students</span>
            </span>
            <ChevronRight className="w-4 h-4 text-muted-foreground/50 shrink-0" />
          </button>

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
              <span className="block text-xs text-muted-foreground mt-0.5">Rate your experience</span>
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
                {showProfileForm ? "Discard unsaved changes" : "Edit your details"}
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
            <AlumniProfileCompletionForm
              alumni={alumni}
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
      </section>
    </>
  );
}
