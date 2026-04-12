import { Loader2, MessageSquareShare, Star, AlertCircle } from 'lucide-react';
import React, { useState } from 'react'
import { useAuth } from '@/hooks/useAuth';
import { getToken } from '@/lib/auth-client';
import { toast } from 'sonner';


export default function FeedbackCorporate() {
  const { loading: authLoading, authenticated, user } = useAuth("recruiter", "/recruiters/register");
const [fbRating, setFbRating] = useState(0);
const [fbContent, setFbContent] = useState("");
const [submittingFb, setSubmittingFb] = useState(false);

if(!authenticated){
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
    const token = getToken("recruiter");
    const res = await fetch("/api/recruiter/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ content: fbContent, rating: fbRating }),
    });
    const d = (await res.json()) as any;
    if (d.success) {
      toast.success(d.message || "Feedback submitted successfully!");
      setFbContent("");
      setFbRating(0);
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
  return (
    <div className="lg:col-span-1 bg-gradient-to-br from-brand/5 via-background to-muted/30 rounded-[2.5rem] p-8 border border-brand/20 shadow-lg shadow-brand/5 flex flex-col text-left hover:shadow-lg hover:shadow-brand/10 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-brand/20 to-brand/10 rounded-2xl text-brand flex items-center justify-center"><MessageSquareShare className="w-6 h-6" /></div>
          <div className="flex-1">
            <h2 className="text-2xl font-black text-foreground leading-tight">Share Your Feedback</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Help us improve</p>
          </div>
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground mb-6 leading-relaxed font-medium">
        Is the college syllabus up to date? Rate the batch's preparedness and suggest improvements.
      </p>
      
      {/* Rating Stars */}
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Your Rating</p>
        <div className="flex gap-3 bg-muted/20 p-4 rounded-xl">
          {[1, 2, 3, 4, 5].map((s) => (
            <button 
              key={s} 
              onClick={() => setFbRating(s)} 
              className={`transition-all duration-200 hover:scale-125 cursor-pointer ${
                s <= fbRating 
                  ? "text-yellow-400 drop-shadow-md" 
                  : "text-muted-foreground/30 hover:text-muted-foreground/50"
              }`}
            >
              <Star className={`w-7 h-7 ${s <= fbRating ? "fill-current" : ""}`} />
            </button>
          ))}
        </div>
        {fbRating > 0 && <p className="text-xs text-brand font-semibold mt-2">Rating: {fbRating}/5 ⭐</p>}
      </div>

      {/* Feedback Textarea */}
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Your Feedback</p>
        <textarea
          value={fbContent} 
          onChange={(e) => setFbContent(e.target.value)}
          maxLength={500}
          className="w-full flex-1 bg-background px-6 py-4 rounded-2xl border-2 border-border hover:border-brand/30 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none text-sm placeholder:text-muted-foreground/40 resize-none transition-all"
          placeholder="What skill is missing from the syllabus? Any suggestions?" 
          rows={4} 
        />
        <p className="text-xs text-muted-foreground mt-2 text-right">{fbContent.length}/500 characters</p>
      </div>

      {/* Submit Button */}
      <button 
        onClick={handleSubmitFeedback} 
        disabled={submittingFb || !fbContent.trim() || fbRating === 0}
        className="mt-auto w-full bg-gradient-to-r from-brand to-brand/80 hover:from-brand/90 hover:to-brand/70 disabled:from-muted disabled:to-muted/50 text-primary-foreground py-4 rounded-2xl font-black transition-all duration-200 shadow-lg shadow-brand/20 hover:shadow-brand/30 disabled:shadow-none active:scale-95 flex items-center justify-center gap-2 group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
        <span className="relative">{submittingFb 
          ? <><Loader2 className="w-5 h-5 animate-spin" /> <span>Submitting...</span></>
          : <><MessageSquareShare className="w-5 h-5" /> <span>Share Expertise</span></>
        }</span>
      </button>
    </div>
  );
}