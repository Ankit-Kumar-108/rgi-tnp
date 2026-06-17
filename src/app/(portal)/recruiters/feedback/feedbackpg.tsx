import { Loader2, MessageSquareShare, Send, Heart, X, CheckCircle2 } from 'lucide-react';
import React, { useState } from 'react'
import { useAuth } from '@/hooks/useAuth';
import { getToken } from '@/lib/auth-client';
import { toast } from 'sonner';

interface FeedbackCorporateProps {
  onClose?: () => void;
}

const EMOJIS = [
  { val: 1, icon: "😡", label: "Terrible" },
  { val: 2, icon: "🙁", label: "Poor" },
  { val: 3, icon: "😐", label: "Okay" },
  { val: 4, icon: "🙂", label: "Good" },
  { val: 5, icon: "🤩", label: "Excellent" },
];

const TAGS = ["Student Quality", "Curriculum", "Hiring Process", "Platform UI", "Support", "Other"];

export default function FeedbackCorporate({ onClose }: FeedbackCorporateProps = {}) {
  const { loading: authLoading, authenticated } = useAuth("recruiter", "/recruiters/register");
  const [fbRating, setFbRating] = useState(0);
  const [fbContent, setFbContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submittingFb, setSubmittingFb] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!authenticated || authLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    );
  }

  const handleSubmitFeedback = async () => {
    if (!fbContent.trim() && selectedTags.length === 0 || fbRating === 0) {
      toast.error("Please provide a rating and some feedback.");
      return;
    }
    setSubmittingFb(true);
    try {
      const token = getToken("recruiter");
      const combinedContent = selectedTags.length > 0
        ? `[Tags: ${selectedTags.join(", ")}]\n${fbContent}`
        : fbContent;

      const res = await fetch("/api/recruiter/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: combinedContent, rating: fbRating }),
      });
      const d = (await res.json()) as any;
      if (d.success) {
        toast.success(d.message || "Feedback submitted successfully!");
        setSubmitted(true);
        setTimeout(() => {
          setFbContent("");
          setFbRating(0);
          setSelectedTags([]);
          setSubmitted(false);
          if (onClose) onClose();
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

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  if (submitted) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 md:p-12 text-center animate-in zoom-in-95 fade-in duration-300 shadow-xl w-full max-w-md mx-auto relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-bl-full -z-10 blur-xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand/10 rounded-tr-full -z-10 blur-xl" />
        <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-green-500/10 mx-auto mb-6">
          <Heart className="w-10 h-10 md:w-12 md:h-12 text-green-500 fill-green-500 animate-pulse" />
        </div>
        <h3 className="text-2xl md:text-3xl font-black text-foreground tracking-tight mb-3">Thank You!</h3>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          Your feedback helps us build a better hiring experience for everyone.
        </p>
      </div>
    );
  }

  return (
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
            <h2 className="text-lg md:text-xl font-black text-foreground tracking-tight">Corporate Feedback</h2>
            <p className="text-xs md:text-sm text-muted-foreground font-medium">Your insights shape our curriculum</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2.5 bg-background border border-border hover:bg-muted text-muted-foreground hover:text-foreground rounded-full transition-colors flex-shrink-0">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="p-5 md:p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1">
        
        {/* Rating Bento */}
        <div className="bg-surface border border-border rounded-lg p-4 md:p-5 shadow-sm relative overflow-hidden">
          <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
            1. How was your experience? *
          </label>
          <div className="grid grid-cols-5 gap-1.5 md:gap-3">
            {EMOJIS.map((e) => (
              <button
                key={e.val}
                onClick={() => setFbRating(e.val)}
                className={`flex flex-col items-center justify-center gap-2 py-3 md:py-4 rounded-lg transition-all duration-300 ${
                  fbRating === e.val 
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
            {TAGS.map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 md:px-4 py-2 rounded-lg text-[11px] md:text-xs font-bold transition-all border flex items-center gap-1.5 ${
                    active 
                      ? "bg-foreground text-background border-foreground shadow-sm scale-105" 
                      : "bg-background text-muted-foreground border-border hover:border-foreground/30 hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {active && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
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
            placeholder="Tell us about the students' preparedness or suggest curriculum updates..."
            className="w-full bg-background border border-border rounded-lg px-4 py-3.5 text-sm text-foreground focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all resize-y min-h-[90px] md:min-h-[120px] placeholder:text-muted-foreground/50 custom-scrollbar leading-relaxed"
          />
        </div>

      </div>

      {/* Footer (Sticky) */}
      <div className="p-5 md:p-6 border-t border-border bg-card/80 backdrop-blur-md shrink-0">
        <button
          onClick={handleSubmitFeedback}
          disabled={submittingFb || fbRating === 0 || (!fbContent.trim() && selectedTags.length === 0)}
          className="w-full bg-foreground hover:bg-foreground/90 disabled:bg-muted disabled:text-muted-foreground text-background py-3.5 md:py-4 rounded-lg font-black text-sm md:text-base transition-all flex items-center justify-center gap-2 shadow-lg disabled:shadow-none active:scale-[0.98] disabled:active:scale-100"
        >
          {submittingFb ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          {submittingFb ? "Submitting..." : "Send Feedback"}
        </button>
      </div>
    </div>
  )
}
