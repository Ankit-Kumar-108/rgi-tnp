import React from "react";
import { LogOut, MessageSquareShare, ChevronRight } from "lucide-react";
import NotificationBell from "@/components/ui/NotificationBell";

interface DashboardHeaderProps {
  showProfileForm: boolean;
  setShowProfileForm: (val: boolean) => void;
  isProfileIncomplete: boolean;
  setShowFeedbackModal: (val: boolean) => void;
  handleLogout: () => void;
}

export default function DashboardHeader({
  showProfileForm,
  setShowProfileForm,
  isProfileIncomplete,
  setShowFeedbackModal,
  handleLogout,
}: DashboardHeaderProps) {
  return (
    <section className="pt-4 md:pt-8 flex flex-col md:flex-row justify-between md:items-end gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => setShowFeedbackModal(true)}
          className="inline-flex items-center gap-2 text-sm font-bold text-foreground hover:bg-muted transition-colors border border-border px-4 py-2.5 rounded-2xl bg-card shadow-sm"
        >
          <MessageSquareShare className="w-4 h-4" />
          Share Feedback
        </button>
        <button
          onClick={() => setShowProfileForm(!showProfileForm)}
          className="relative inline-flex items-center gap-2 text-sm font-bold text-brand hover:text-brand/80 transition-colors border border-brand/20 px-4 py-2.5 rounded-2xl bg-brand/5 hover:bg-brand/10"
        >
          {showProfileForm ? "Cancel Edit" : "Update Profile"}
          <ChevronRight className={`w-4 h-4 transition-transform ${showProfileForm ? "rotate-90" : ""}`} />
          {!showProfileForm && isProfileIncomplete && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-sm" />
          )}
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-destructive/10 text-destructive px-5 py-2.5 rounded-2xl text-sm font-bold hover:bg-destructive/20 transition-all shadow-sm border border-destructive/10"
        >
          <LogOut className="size-4" /> Logout
        </button>
        <NotificationBell role="student" />
      </div>
    </section>
  );
}
