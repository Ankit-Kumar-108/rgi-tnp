"use client";

import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Star, Building2, Quote, GraduationCap, Loader2, UserCircle2 } from "lucide-react";
import { toast } from "sonner";
import Nav from "@/components/layout/nav/nav";
import Footer from "@/components/layout/footer/footer";

/* --- Types & Interfaces --- */
type FilterTab = "All Feedback" | "Alumni" | "Recruiters" | "Students";

interface BaseFeedback {
  id: string;
  content: string;
  rating: number;
  createdAt: string;
  _type: Exclude<FilterTab, "All Feedback">;
}

interface StudentFeedback extends BaseFeedback {
  student: { name: string; course: string; batch: string; branch: string; profileImageUrl?: string | null };
}

interface AlumniFeedback extends BaseFeedback {
  alumni: { name: string; branch: string; batch: string; course: string; profileImageUrl?: string | null };
}

interface RecruiterFeedback extends BaseFeedback {
  recruiter: { name: string; company: string; designation: string };
}

type FeedbackUnion = StudentFeedback | AlumniFeedback | RecruiterFeedback;

const TABS: FilterTab[] = ["All Feedback", "Alumni", "Recruiters", "Students"];

/* --- Main Page Component --- */
export default function Testimonials() {
  const [feedbacks, setFeedbacks] = useState<FeedbackUnion[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("All Feedback");
  
  // Pagination & Infinite Scroll States
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Intersection Observer for Infinite Scroll
  const observer = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading || !hasMore) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPage(prevPage => prevPage + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  // Fetch Data Function
  const loadFeedback = useCallback(async (currentPage: number) => {
    setIsLoading(true);

    try {
      // Fetch 10 from each category per page (API returns up to 30 combined)
      const response = await fetch(`/api/feedback?limit=10&page=${currentPage}`);
      if (!response.ok) throw new Error("Network response was not ok");
      
      const data = await response.json() as any
      
      if (data.success) {
        // Normalize the three arrays and attach type identifiers
        const students = (data.studentFeedback || []).map((f: any) => ({ ...f, _type: 'Students' }));
        const alumni = (data.alumniFeedback || []).map((f: any) => ({ ...f, _type: 'Alumni' }));
        const recruiters = (data.corporateFeedback || []).map((f: any) => ({ ...f, _type: 'Recruiters' }));

        const combined: FeedbackUnion[] = [...students, ...alumni, ...recruiters];
        
        // If no new items are returned, stop fetching
        if (combined.length === 0) {
          setHasMore(false);
          setIsLoading(false);
          return;
        }

        setFeedbacks(prev => {
          // De-duplicate items based on ID to handle React Strict Mode double-invocations
          const allItems = currentPage === 1 ? combined : [...prev, ...combined];
          const uniqueItemsMap = new Map(allItems.map(item => [item.id, item]));
          const uniqueItems = Array.from(uniqueItemsMap.values());
          
          // Sort overall array by newest first
          return uniqueItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        });
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
      if (page === 1) {
        toast.error("Failed to load feedbacks. Please try again.");
      } else {
        toast.error("Failed to load more feedbacks. Please scroll again.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Trigger fetch when page changes
  useEffect(() => {
    loadFeedback(page);
  }, [page, loadFeedback]);

  // Filter the displayed list based on the active tab
  const displayedFeedbacks = useMemo(() => {
    return feedbacks.filter(f => activeFilter === "All Feedback" || f._type === activeFilter);
  }, [feedbacks, activeFilter]);

  return (
    <>
      <Nav />
      <div className="bg-background dark:bg-background min-h-screen font-sans selection:bg-brand/20 selection:text-brand">
        <main className="pt-24 pb-24">

          {/* Header Section */}
          <section className="max-w-7xl mx-auto px-6 md:px-8 mb-16 text-center space-y-6">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
              Hear From Our <span className="text-brand dark:text-brand">Community</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">
              Discover what our students, alumni, and top recruiting partners have to say about their experience.
            </p>

            {/* Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-card shadow-[var(--shadow-xs)] rounded-2xl w-fit mx-auto border border-border">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveFilter(tab);
                    // Reset to top visually if desired, though infinite scroll keeps data in memory
                  }}
                  className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    activeFilter === tab
                      ? "bg-brand text-white shadow-[var(--shadow-brand)]"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </section>

          {/* Masonry Grid */}
          <section className="max-w-7xl mx-auto px-6 md:px-8">
            {isLoading && page === 1 ? (
              <div className="flex justify-center py-32">
                <Loader2 className="w-10 h-10 animate-spin text-brand" />
              </div>
            ) : displayedFeedbacks.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {displayedFeedbacks.map((feedback, index) => {
                  const isLastElement = index === displayedFeedbacks.length - 1;

                  return (
                    <div key={feedback.id} ref={isLastElement ? lastItemRef : null} className="break-inside-avoid relative">
                      {feedback._type === "Recruiters" && <RecruiterCard data={feedback as RecruiterFeedback} />}
                      {feedback._type === "Alumni" && <AlumniCard data={feedback as AlumniFeedback} />}
                      {feedback._type === "Students" && <StudentCard data={feedback as StudentFeedback} />}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Infinite Scroll Loading Indicator */}
            {isLoading && page > 1 && (
              <div className="flex justify-center py-12 mt-8">
                <div className="bg-card p-4 rounded-full shadow-[var(--shadow-sm)] border border-border">
                  <Loader2 className="w-6 h-6 animate-spin text-brand" />
                </div>
              </div>
            )}
            
            {/* End of list message */}
            {!hasMore && displayedFeedbacks.length > 0 && (
              <div className="text-center py-12 mt-8 text-muted-foreground font-medium text-sm">
                You've reached the end of the feedback.
              </div>
            )}
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}

/* --- Shared & Premium Sub-Components --- */

const StarRating = React.memo(({ rating }: { rating: number }) => (
  <div className="flex gap-1 mb-5" aria-label={`Rating ${rating} out of 5`}>
    {[...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 transition-colors ${
          i < rating 
            ? "fill-yellow-400 text-yellow-400" 
            : "text-muted-foreground/30"
        }`} 
      />
    ))}
  </div>
));
StarRating.displayName = "StarRating";

const EmptyState = React.memo(() => (
  <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
    <div className="bg-muted p-6 rounded-3xl mb-6">
      <Quote className="w-12 h-12 opacity-50" />
    </div>
    <h3 className="font-bold text-xl text-foreground mb-2">No feedback found</h3>
    <p className="text-sm">There are currently no testimonials in this category.</p>
  </div>
));
EmptyState.displayName = "EmptyState";

/* --- 1. Recruiter Card (Corporate & Elegant) --- */
const RecruiterCard = React.memo(({ data }: { data: RecruiterFeedback }) => {
  return (
    <div className="group relative bg-card p-5 md:p-8 rounded-2xl md:rounded-3xl border border-border hover:shadow-[var(--shadow-lg)] hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      {/* Decorative Watermark */}
      <Building2 className="absolute -top-6 -right-6 w-32 h-32 text-muted/80 dark:text-muted/30 z-0 rotate-12 transition-transform group-hover:rotate-6 group-hover:scale-110 duration-500" />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h4 className="font-extrabold text-foreground text-lg uppercase tracking-tight">
              {data.recruiter.company}
            </h4>
            <span className="inline-block mt-1 text-xs font-bold tracking-widest text-brand dark:text-brand uppercase bg-brand/10 px-2 py-1 rounded-md">
              Industry Partner
            </span>
          </div>
        </div>
        
        <StarRating rating={data.rating} />
        
        <blockquote className="text-muted-foreground font-medium text-[15px] leading-relaxed mb-8">
          "{data.content}"
        </blockquote>
        
        <div className="flex items-center gap-3 pt-6 border-t border-border">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
             <UserCircle2 className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-bold text-sm text-foreground">{data.recruiter.name}</p>
            <p className="text-muted-foreground text-xs font-medium">{data.recruiter.designation}</p>
          </div>
        </div>
      </div>
    </div>
  );
});
RecruiterCard.displayName = "RecruiterCard";

/* --- 2. Alumni Card (Nostalgic & Proud) --- */
const AlumniCard = React.memo(({ data }: { data: AlumniFeedback }) => {
  return (
    <div className="relative bg-linear-to-br from-card to-muted/30 p-5 md:p-8 rounded-2xl md:rounded-3xl border border-border hover:shadow-[var(--shadow-lg)] hover:border-brand/30 transition-all duration-300">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative shrink-0">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-muted border-2 border-card shadow-sm">
            {data.alumni.profileImageUrl ? (
              <img className="w-full h-full object-cover" alt={data.alumni.name} src={data.alumni.profileImageUrl} loading="lazy" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-brand text-xl bg-brand/10 dark:bg-brand/30">
                {data.alumni.name.charAt(0)}
              </div>
            )}
          </div>
            <div className="absolute -bottom-1 -right-1 bg-brand text-white p-1.5 rounded-full ring-2 ring-card">
            <GraduationCap className="w-3 h-3" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-foreground text-[15px] truncate">{data.alumni.name}</h4>
          <p className="text-muted-foreground text-xs mt-0.5 truncate">
            {data.alumni.course} {data.alumni.branch ? `• ${data.alumni.branch}` : ''}
          </p>
          <p className="text-brand dark:text-brand text-xs font-bold mt-0.5">
            Class of {data.alumni.batch}
          </p>
        </div>
      </div>
      
      <StarRating rating={data.rating} />
      
      <blockquote className="text-muted-foreground text-sm leading-relaxed relative z-10">
        "{data.content}"
      </blockquote>
    </div>
  );
});
AlumniCard.displayName = "AlumniCard";

/* --- 3. Student Card (Fresh & Vibrant) --- */
const StudentCard = React.memo(({ data }: { data: StudentFeedback }) => {
  return (
    <div className="relative bg-card p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-[var(--shadow-sm)] border border-border hover:shadow-[var(--shadow-lg)] transition-all duration-300 overflow-hidden">
       {/* Left side accent line */}
      <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-brand rounded-l-3xl" />
      
      <div className="pl-2">
        <StarRating rating={data.rating} />
        
        <blockquote className="text-foreground/80 font-medium text-[15px] leading-relaxed mb-8 relative z-10">
          "{data.content}"
        </blockquote>
        
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-muted shrink-0">
            {data.student.profileImageUrl ? (
              <img className="w-full h-full object-cover" alt={data.student.name} src={data.student.profileImageUrl} loading="lazy" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-muted-foreground">
                {data.student.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-sm text-foreground truncate">{data.student.name}</h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <p className="text-muted-foreground text-xs truncate">
                Current Student • {data.student.course}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
StudentCard.displayName = "StudentCard";
