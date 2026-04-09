"use client";

import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Star, Building2, BadgeCheck, Quote, GraduationCap, Loader2 } from "lucide-react";
import Footer from "@/components/layout/footer/footer";
import Nav from "@/components/layout/nav/nav";
import { toast } from "sonner";

type FilterTab = "All Feedback" | "Alumni" | "Recruiters" | "Students";

export default function Testimonials() {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("All Feedback");
  
  // Pagination & Loading States
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Infinite Scroll Sensor
  const observer = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  // Fetch Data
  useEffect(() => {
    const loadFeedback = async () => {
      if (page === 1) setIsLoading(true);
      
      try {
        // Fetching 10 from each category (30 total per page)
        const response = await fetch(`/api/feedback?limit=10&page=${page}`);
        if (response.ok) {
          const data = await response.json() as {
            success: boolean;
            studentFeedback: any[];
            alumniFeedback: any[];
            corporateFeedback: any[];
            studentFeedbackCount: number;
            alumniFeedbackCount: number;
            corporateFeedbackCount: number;
          }
          
          if (data.success) {
            // 1. Normalize the three arrays into one consistent format
            const students = data.studentFeedback.map((f: any) => ({ ...f, _type: 'Students' }));
            const alumni = data.alumniFeedback.map((f: any) => ({ ...f, _type: 'Alumni' }));
            const corporate = data.corporateFeedback.map((f: any) => ({ ...f, _type: 'Recruiters' }));

            // 2. Combine and sort by newest first
            const combined = [...students, ...alumni, ...corporate].sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );

            // 3. Update State safely
            setFeedbacks(prev => {
              if (page === 1) return combined;
              const existingIds = new Set(prev.map(f => f.id));
              const newItems = combined.filter(c => !existingIds.has(c.id));
              return [...prev, ...newItems].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            });

            // 4. Update Totals
            const total = data.studentFeedbackCount + data.alumniFeedbackCount + data.corporateFeedbackCount;
            setTotalCount(total);
            
            // If the combined array we got back is empty, we hit the end
            setHasMore(combined.length > 0);
          }
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
        toast.error("Failed to load testimonials.");
      } finally {
        setIsLoading(false);
      }
    };

    loadFeedback();
  }, [page]);

  // Filter the combined list
  const displayedFeedbacks = useMemo(() => {
    return feedbacks.filter(f => activeFilter === "All Feedback" || f._type === activeFilter);
  }, [feedbacks, activeFilter]);

  const TABS: FilterTab[] = ["All Feedback", "Alumni", "Recruiters", "Students"];

  return (
    <>
      <Nav />
      <div className="bg-background text-foreground antialiased font-sans flex flex-col min-h-screen selection:bg-brand/10 selection:text-brand">
        <main className="flex-1 w-full pt-20 pb-24">
          
          {/* Header & Filter Tabs */}
          <section className="max-w-7xl mx-auto px-6 md:px-8 mb-16 space-y-8 text-center">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
                Hear From Our <span className="text-brand">Community</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Discover what our students, alumni, and top recruiting partners have to say about their experience with RGI.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 md:gap-4 p-2 bg-muted/50 backdrop-blur-md rounded-2xl w-fit mx-auto border border-border">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-6 md:px-8 py-2.5 md:py-3 rounded-xl font-bold text-xs md:text-sm transition-all duration-300 ${
                    activeFilter === tab
                      ? "bg-brand text-primary-foreground shadow-lg shadow-brand/20"
                      : "text-muted-foreground hover:bg-background hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </section>

          {/* Feedback Masonry Grid */}
          <section className="max-w-7xl mx-auto px-6 md:px-8">
            {isLoading && page === 1 ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-brand" />
              </div>
            ) : displayedFeedbacks.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <Quote className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="font-bold text-lg">No feedback found for this category.</p>
              </div>
            ) : (
              <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {displayedFeedbacks.map((feedback, index) => {
                  const isLastElement = index === displayedFeedbacks.length - 1;

                  return (
                    <div key={feedback.id} ref={isLastElement ? lastItemRef : null}>
                      {feedback._type === "Recruiters" && <RecruiterCard data={feedback} />}
                      {feedback._type === "Alumni" && <AlumniCard data={feedback} />}
                      {feedback._type === "Students" && <StudentCard data={feedback} />}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Bottom Loading State */}
            {isLoading && page > 1 && (
              <div className="flex justify-center py-10 mt-8">
                <Loader2 className="w-8 h-8 animate-spin text-brand" />
              </div>
            )}
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}

/* --- Dynamic Sub-Components --- */

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex mb-4 text-yellow-500">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-current" : "text-muted stroke-current"}`} />
      ))}
    </div>
  );
}

function RecruiterCard({ data }: { data: any }) {
  const isDark = Math.random() > 0.5; // Randomly assigns the dark/light variations you created!

  if (isDark) {
    return (
      <div className="break-inside-avoid bg-foreground p-8 rounded-[2rem] shadow-xl text-background hover:scale-[1.02] transition-all duration-300">
        <div className="flex justify-between items-center mb-6">
          <div className="text-lg font-black tracking-tighter uppercase line-clamp-1 pr-4">
            {data.recruiter?.company || "Corporate Partner"}
          </div>
          <BadgeCheck className="w-5 h-5 text-brand fill-current shrink-0" />
        </div>
        <p className="text-background/80 text-sm leading-relaxed mb-6 italic">
          "{data.content}"
        </p>
        <StarRating rating={data.rating} />
        <p className="font-bold text-sm">{data.recruiter?.name}</p>
        <p className="text-background/60 text-[10px]">{data.recruiter?.designation}</p>
      </div>
    );
  }

  return (
    <div className="break-inside-avoid bg-card p-8 rounded-[2rem] shadow-sm border border-border hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
      <div className="flex justify-between items-start mb-6">
        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center font-black text-muted-foreground text-xl group-hover:text-brand transition-colors">
          {data.recruiter?.company?.charAt(0) || "C"}
        </div>
        <div className="flex items-center gap-1 text-brand bg-brand/10 px-2 py-1 rounded-lg">
          <Building2 className="w-3 h-3" />
          <span className="text-[10px] font-bold uppercase">Recruiter</span>
        </div>
      </div>
      <StarRating rating={data.rating} />
      <p className="text-foreground font-medium text-sm leading-relaxed mb-6 italic">
        "{data.content}"
      </p>
      <div className="pt-6 border-t border-border">
        <h4 className="font-bold text-foreground">{data.recruiter?.name}</h4>
        <p className="text-muted-foreground text-xs">{data.recruiter?.designation}, {data.recruiter?.company}</p>
      </div>
    </div>
  );
}

function AlumniCard({ data }: { data: any }) {
  return (
    <div className="break-inside-avoid bg-muted/50 p-8 rounded-[2rem] shadow-sm border border-border hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-card border border-border shrink-0 flex items-center justify-center font-bold text-brand">
          {data.alumni?.profileImageUrl ? (
            <img className="w-full h-full object-cover" alt={data.alumni.name} loading="lazy" src={data.alumni.profileImageUrl} />
          ) : (
            data.alumni?.name?.charAt(0)
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-foreground text-sm truncate">{data.alumni?.name}</h4>
          <p className="text-brand text-[10px] font-bold uppercase tracking-wider truncate">
            {data.alumni?.branch} '{data.alumni?.batch?.slice(-2)}
          </p>
        </div>
        <div className="flex items-center gap-1 text-brand/40 shrink-0">
          <BadgeCheck className="w-5 h-5 fill-current" />
        </div>
      </div>
      <StarRating rating={data.rating} />
      <p className="text-muted-foreground text-sm leading-relaxed italic">
        "{data.content}"
      </p>
    </div>
  );
}

function StudentCard({ data }: { data: any }) {
  return (
    <div className="break-inside-avoid bg-card p-8 rounded-[2rem] shadow-sm border border-border hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-l-4 border-l-brand">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <span className="bg-brand/10 text-brand text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider">
            Current Student
          </span>
        </div>
      </div>
      <StarRating rating={data.rating} />
      <p className="text-foreground font-semibold text-sm leading-relaxed mb-6 italic">
        "{data.content}"
      </p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-muted overflow-hidden flex items-center justify-center font-bold text-muted-foreground border border-border shrink-0">
          {data.student?.profileImageUrl ? (
            <img className="w-full h-full object-cover" alt={data.student.name} loading="lazy" src={data.student.profileImageUrl} />
          ) : (
            data.student?.name?.charAt(0)
          )}
        </div>
        <div className="min-w-0">
          <p className="font-bold text-xs text-foreground truncate">{data.student?.name}</p>
          <p className="text-muted-foreground text-[10px] truncate">
            {data.student?.course} '{data.student?.batch?.slice(-2)}
          </p>
        </div>
      </div>
    </div>
  );
}