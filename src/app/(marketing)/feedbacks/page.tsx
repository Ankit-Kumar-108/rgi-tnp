/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use client";

import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Star, Loader2, Quote, UserCircle2, GraduationCap, Building2 } from "lucide-react";
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
  
  // Pagination & Infinite Scroll
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

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

  const loadFeedback = useCallback(async (currentPage: number) => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/feedback?limit=10&page=${currentPage}`);
      if (!response.ok) throw new Error("Network response was not ok");
      
      const data = await response.json() as any
      
      if (data.success) {
        const students = (data.studentFeedback || []).map((f: any) => ({ ...f, _type: 'Students' }));
        const alumni = (data.alumniFeedback || []).map((f: any) => ({ ...f, _type: 'Alumni' }));
        const recruiters = (data.corporateFeedback || []).map((f: any) => ({ ...f, _type: 'Recruiters' }));

        const combined: FeedbackUnion[] = [...students, ...alumni, ...recruiters];
        
        if (combined.length === 0) {
          setHasMore(false);
          setIsLoading(false);
          return;
        }

        setFeedbacks(prev => {
          const allItems = currentPage === 1 ? combined : [...prev, ...combined];
          const uniqueItemsMap = new Map(allItems.map(item => [item.id, item]));
          const uniqueItems = Array.from(uniqueItemsMap.values());
          return uniqueItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        });
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
      if (page === 1) toast.error("Failed to load feedbacks.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeedback(page);
  }, [page, loadFeedback]);

  const displayedFeedbacks = useMemo(() => {
    return feedbacks.filter(f => activeFilter === "All Feedback" || f._type === activeFilter);
  }, [feedbacks, activeFilter]);

  return (
    <>
      <Nav />
      {/* Editorial aesthetic: Warm off-white background in light mode, deep black in dark mode */}
      <div className="bg-[#fcfbf9] dark:bg-background min-h-screen font-sans text-foreground">
        <main className="pt-24 md:pt-32 pb-24 max-w-7xl mx-auto px-5 md:px-8">

          {/* Editorial Hero Section */}
          <section className="mb-16 md:mb-24 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h4 className="text-brand font-bold tracking-widest uppercase text-sm mb-6">
              Testimonials
            </h4>
            <h1 className="text-4xl md:text-6xl lg:text-[5rem] tracking-tight leading-tight text-foreground mb-8 max-w-4xl">
              <span className="text-brand">Stories {" "}</span>from the heart of our community.
            </h1>

            {/* Elegant Underlined Tabs */}
            <div className="mt-8 flex overflow-x-auto custom-scrollbar justify-start md:justify-center items-center gap-6 md:gap-10 border-b border-border/60 pb-1 w-full max-w-3xl px-2">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`pb-4 text-sm md:text-base font-medium transition-all duration-300 relative whitespace-nowrap shrink-0 ${
                    activeFilter === tab
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground/80"
                  }`}
                >
                  {tab}
                  {activeFilter === tab && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-foreground animate-in fade-in slide-in-from-bottom-1 duration-300" />
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Masonry Grid */}
          <section>
            {isLoading && page === 1 ? (
              <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-brand" />
              </div>
            ) : displayedFeedbacks.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="columns-1 md:columns-2 lg:columns-3 gap-5 md:gap-8 space-y-5 md:space-y-8">
                {displayedFeedbacks.map((feedback, index) => {
                  const isLastElement = index === displayedFeedbacks.length - 1;
                  return (
                    <div 
                      key={feedback.id} 
                      ref={isLastElement ? lastItemRef : null} 
                      className="break-inside-avoid animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
                      style={{ animationDelay: `${(index % 12) * 50}ms` }}
                    >
                      {feedback._type === "Recruiters" && <EditorialCard data={feedback} type="Recruiters" />}
                      {feedback._type === "Alumni" && <EditorialCard data={feedback} type="Alumni" />}
                      {feedback._type === "Students" && <EditorialCard data={feedback} type="Students" />}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Infinite Scroll Loader */}
            {isLoading && page > 1 && (
              <div className="flex justify-center py-12 mt-4">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            )}
            
            {/* End of Content */}
            {!hasMore && displayedFeedbacks.length > 0 && (
              <div className="flex justify-center py-16 mt-8">
                <div className="w-12 h-[1px] bg-border" />
              </div>
            )}
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}

/* --- Shared Components --- */

const EmptyState = React.memo(() => (
  <div className="flex flex-col items-center justify-center py-40 text-muted-foreground">
    <Quote className="w-12 h-12 text-muted-foreground/20 mb-6" />
    <h3 className="font-serif text-2xl text-foreground mb-2">No stories yet.</h3>
    <p className="text-sm">Feedback for this section will appear here.</p>
  </div>
));
EmptyState.displayName = "EmptyState";

/* --- Universal Editorial Card --- */
const EditorialCard = React.memo(({ data, type }: { data: FeedbackUnion, type: Exclude<FilterTab, "All Feedback"> }) => {
  // Extract common fields dynamically based on type
  let name = "";
  let subtitle = "";
  let icon = null;
  let imageUrl: string | null | undefined = null;

  if (type === "Recruiters") {
    const r = data as RecruiterFeedback;
    name = r.recruiter.name;
    subtitle = `${r.recruiter.designation}, ${r.recruiter.company}`;
    icon = <Building2 className="w-4 h-4" />;
  } else if (type === "Alumni") {
    const a = data as AlumniFeedback;
    name = a.alumni.name;
    subtitle = `Class of ${a.alumni.batch} • ${a.alumni.course}`;
    imageUrl = a.alumni.profileImageUrl;
    icon = <GraduationCap className="w-4 h-4" />;
  } else if (type === "Students") {
    const s = data as StudentFeedback;
    name = s.student.name;
    subtitle = `Current Student • ${s.student.course}`;
    imageUrl = s.student.profileImageUrl;
    icon = <UserCircle2 className="w-4 h-4" />;
  }

  return (
    <div className="group bg-card p-6 md:p-10 rounded-lg md:rounded-none md:rounded-tr-xl md:rounded-bl-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-border/40 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all duration-500 relative">
      
      {/* Editorial Quote Mark */}
      <Quote className="absolute top-6 left-6 w-12 h-12 text-foreground/5 rotate-180 -z-0" />
      
      <div className="relative z-10 flex flex-col h-full">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-8" aria-label={`Rating ${data.rating} out of 5`}>
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-4 h-4 ${
                i < data.rating 
                  ? "fill-brand text-brand" 
                  : "text-muted-foreground/20"
              }`} 
            />
          ))}
        </div>
        
        {/* Quote Content (Serif) */}
        <blockquote className="text-foreground font-serif text-base md:text-xl leading-relaxed mb-10 text-balance">
          "{data.content}"
        </blockquote>
        
        {/* Profile/Footer Area */}
        <div className="mt-auto flex items-center gap-4 pt-6 border-t border-border/50">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex items-center justify-center shrink-0 border border-border">
            {imageUrl ? (
              <img className="w-full h-full object-cover" alt={name} src={imageUrl} loading="lazy" />
            ) : (
              <span className="font-serif text-lg text-foreground">{name.charAt(0)}</span>
            )}
          </div>
          <div>
            <h4 className="font-bold text-base text-foreground tracking-tight leading-none mb-1.5">{name}</h4>
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
              <span className="text-brand">{icon}</span>
              <span className="truncate max-w-[200px]">{subtitle}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
EditorialCard.displayName = "EditorialCard";

