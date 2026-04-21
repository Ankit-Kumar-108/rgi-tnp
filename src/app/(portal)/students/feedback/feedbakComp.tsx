import { Loader2, MessageSquareShare, Star, Sparkles, Send, Heart, X } from 'lucide-react';
import React, { useState } from 'react'
import { useAuth } from '@/hooks/useAuth';
import { getToken } from '@/lib/auth-client';
import { toast } from 'sonner';

interface FeedbackCompProps {
  onClose?: () => void;
}

export default function FeedbackComp({ onClose }: FeedbackCompProps = {}) {
  const { loading: authLoading, authenticated, user } = useAuth("student", "/student/register");
  const [fbRating, setFbRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [fbContent, setFbContent] = useState("");
  const [submittingFb, setSubmittingFb] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!authenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    );
  }

  const handleSubmitFeedback = async () => {
    if (!fbContent || fbRating === 0) return;
    setSubmittingFb(true);
    try {
      const token = getToken("student");
      const res = await fetch("/api/student/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: fbContent, rating: fbRating }),
      });
      const d = (await res.json()) as any;
      if (d.success) {
        toast.success(d.message || "Feedback submitted successfully!");
        setSubmitted(true);
        setTimeout(() => {
          setFbContent("");
          setFbRating(0);
          setSubmitted(false);
        }, 3000);
      } else {
        toast.error(d.message || "Failed to submit feedback");
      }
    } catch (error) {
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setSubmittingFb(false);
    }
  };

  if (authLoading || !authenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    );
  }

  const ratingLabels = ["", "Poor", "Fair", "Good", "Great", "Excellent"];
  const activeRating = hoverRating || fbRating;

  if (submitted) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-green-500/30 bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-teal-500/5 p-6 md:p-8 text-center animate-in zoom-in-95 fade-in duration-500">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-500/10 to-transparent rounded-bl-[4rem]" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-500/10 to-transparent rounded-tr-[3rem]" />

        <div className="relative space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/15 mx-auto">
            <Heart className="w-10 h-10 text-green-500 fill-green-500 animate-pulse" />
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">Thank You!</h3>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
            Your feedback helps us build a better experience for everyone at RGI.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-brand/20 bg-gradient-to-br from-brand/[0.03] via-background to-background shadow-xl shadow-brand/[0.04] text-left group/card hover:border-brand/30 transition-all duration-500">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-brand/8 via-brand/3 to-transparent rounded-bl-[5rem]" />
      <div className="absolute bottom-0 left-0 w-28 h-28 bg-gradient-to-tr from-brand/5 to-transparent rounded-tr-[3rem]" />
      <div className="absolute top-1/2 -right-8 w-16 h-16 bg-brand/5 rounded-full blur-2xl" />

      <div className="relative p-5 md:p-6 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-brand/25 to-brand/10 rounded-xl flex items-center justify-center shadow-inner">
                <MessageSquareShare className="w-5 h-5 text-brand" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-brand/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-2 h-2 text-brand" />
              </div>
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-black text-foreground tracking-tight leading-tight">
                Share Feedback
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5 font-medium">Your voice shapes our future</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Context */}
        <div className="bg-muted/30 rounded-xl px-4 py-3 border border-border/50">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Help us improve.</span>{" "}
            Rate the placement cell&apos;s effectiveness, suggest curriculum updates, or share any constructive thoughts.
          </p>
        </div>

        {/* Rating Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs md:text-xs font-black uppercase tracking-[0.15em] text-muted-foreground">
              Your Rating
            </p>
            {activeRating > 0 && (
              <span className="text-xs font-bold text-brand bg-brand/10 px-3 py-1 rounded-full animate-in fade-in slide-in-from-right-2 duration-200">
                {ratingLabels[activeRating]}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setFbRating(s)}
                onMouseEnter={() => setHoverRating(s)}
                onMouseLeave={() => setHoverRating(0)}
                className="relative group/star p-1.5 md:p-2 rounded-lg hover:bg-brand/5 transition-all duration-200"
              >
                <Star
                  className={`w-6 h-6 md:w-7 md:h-7 transition-all duration-300 ${
                    s <= activeRating
                      ? "text-amber-400 fill-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.4)] scale-110"
                      : "text-border hover:text-muted-foreground/50"
                  }`}
                />
                {s <= activeRating && (
                  <div className="absolute inset-0 bg-amber-400/5 rounded-xl animate-in fade-in duration-200" />
                )}
              </button>
            ))}
          </div>

          {/* Rating Progress Bar */}
          <div className="h-1 bg-muted/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(activeRating / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Feedback Textarea */}
        <div className="space-y-2.5">
          <label className="text-xs md:text-xs font-black uppercase tracking-[0.15em] text-muted-foreground">
            Your Thoughts
          </label>
          <div className="relative group/textarea">
            <textarea
              value={fbContent}
              onChange={(e) => setFbContent(e.target.value)}
              maxLength={500}
              className="w-full bg-background/80 backdrop-blur-sm px-4 py-3 rounded-xl border-2 border-border/60 hover:border-brand/20 focus:border-brand/40 focus:ring-4 focus:ring-brand/10 outline-none text-sm md:text-base placeholder:text-muted-foreground/30 resize-none transition-all duration-300 min-h-[100px] leading-relaxed text-foreground"
              placeholder="What could be improved? What's working well? Share your honest thoughts..."
              rows={4}
            />
            {/* Floating character counter */}
            <div className="absolute bottom-3 right-4 flex items-center gap-2">
              <div className="h-1 w-16 bg-muted/50 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    fbContent.length > 450 ? "bg-amber-500" : fbContent.length > 400 ? "bg-amber-400" : "bg-brand/40"
                  }`}
                  style={{ width: `${Math.min((fbContent.length / 500) * 100, 100)}%` }}
                />
              </div>
              <span className={`text-xs font-bold tabular-nums ${
                fbContent.length > 450 ? "text-amber-500" : "text-muted-foreground/60"
              }`}>
                {fbContent.length}/500
              </span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmitFeedback}
          disabled={submittingFb || !fbContent.trim() || fbRating === 0}
          className="group/btn w-full relative overflow-hidden bg-brand hover:opacity-90 disabled:bg-muted text-primary-foreground py-3 rounded-xl font-black text-sm md:text-base transition-all duration-300 shadow-[var(--shadow-brand)]  disabled:shadow-none flex items-center justify-center gap-3"
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-in-out" />

          <span className="relative flex items-center gap-2.5">
            {submittingFb ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send className="w-4.5 h-4.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-300" />
                <span>Submit Feedback</span>
              </>
            )}
          </span>
        </button>

        {/* Disclaimer */}
        <p className="text-xs text-center text-muted-foreground/50 leading-relaxed">
          Your feedback is anonymous and helps shape the training & placement process.
        </p>
      </div>
    </div>
  )
}
