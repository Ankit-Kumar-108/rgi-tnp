"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import {
  Search, Calendar, TrendingUp, ChevronDown, SlidersHorizontal,
  Briefcase, Mail, Network, Database, Loader2, BookOpen, X,
  School, MapPin, Link as LinkIcon,
  Share2, Send, BadgeCheck,
  BadgeAlert
} from "lucide-react";
import Footer from "@/components/layout/footer/footer";
import Nav from "@/components/layout/nav/nav";

export default function AlumniDiscovery() {
  const [alumniRawData, setAlumniRawData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAlumni, setSelectedAlumni] = useState<any>(null);

  const [filters, setFilters] = useState({
    search: "",
    batch: "All Batches",
    branch: "All Branches",
    course: "All Courses",
  });

  useEffect(() => {
    const fetchAlumni = async () => {
      if (page === 1) setLoading(true);
      else setLoadingMore(true);

      try {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", "12");

        if (filters.search) params.append("search", filters.search);
        if (filters.batch !== "All Batches") params.append("batch", filters.batch);
        if (filters.branch !== "All Branches") params.append("branch", filters.branch);
        if (filters.course !== "All Courses") params.append("course", filters.course);

        const res = await fetch(`/api/alumni/alumni-network?${params.toString()}`);
        const d = await res.json() as any;

        if (d.success) {
          // If page 1 (filters changed), replace data. Else (scrolling), append data.
          setAlumniRawData(prev => page === 1 ? d.alumniData : [...prev, ...d.alumniData]);
          setHasMore(d.hasMore);
        } else {
          if (page === 1) {
            toast.error(d.message || "Failed to load alumni data");
          }
        }
      } catch (err) {
        console.error("Fetch error:", err);
        if (page === 1) {
          toast.error("Failed to load alumni network. Please try again.");
        } else {
          toast.error("Failed to load more alumni. Please scroll again.");
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };

    // Add a small delay (debounce) for typing in the search bar
    const timeoutId = setTimeout(() => fetchAlumni(), 300);
    return () => clearTimeout(timeoutId);

  }, [page, filters]);

  // Infinite Scroll Observer
  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loadingMore) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [loadingMore, hasMore]);


  // Format the data for the UI
  const finalAlumniData = alumniRawData.map((alumni: any) => ({
    ...alumni, // Propagate all raw fields like: about, currentCompany, jobTitle, course, etc.
    badge: null,
    icon: <Briefcase className="text-brand w-5 h-5" />,
    image: alumni.profileImageUrl || "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop",
    // Calculated display fields for the listing card
    displayBatch: `${alumni.batch || "N/A"} ${alumni.course ? `(${alumni.course})` : ""}`,
    displayRole: `${alumni.jobTitle} at ${alumni.currentCompany}`,
  }));

  const branch = () => {
    switch (filters.course) {
      case 'All Courses':
        return ["Computer Science", "Mechanical", "Civil", "Electronics", "Electrical", "Digital Communication", "Power Systems", "Thermal Engineering", "Marketing", "Finance", "Human Resource"]

      case 'B.Tech':
        return ["Computer Science", "AIML", "Mechanical", "Civil", "Electronics", "Electrical"]

      case 'M.Tech':
        return ["Digital Communication", "Power Systems", "Thermal Engineering"]
      
      case 'MBA':
        return ["Marketing", "Finance", "Human Resource"]

      case 'Diploma':
        return ["Civil","Mechanical", "Electrical", "Electronics", "Computer Science"]
      default:
        return ["All Branches"]
    }
  }
  const branches = branch()
  const courses = ["All Courses", "B.Tech", "M.Tech", "MBA", "Diploma"]
  const batches = ["All Batches", "2022", "2023", "2024", "2025", "2026", "2027", "2028"]

  const getCollegeName = (enroll: string | undefined) => {
  if (!enroll) return "Radharaman Group of Institutions";

  const clgCode = enroll.substring(0, 4);

  if (clgCode === "0132") return "Radharaman Institute of Technology & Science";
  if (clgCode === "0158") return "Radharaman Engineering College";

  return "Radharaman Group of Institutions";
};

  const rout = () => {
    const url = selectedAlumni?.linkedInUrl; // Double check your field name (linkedInUrl vs linkedinUrl)

    if (url && url.startsWith('http')) {
      window.open(url, "_blank", "noopener,noreferrer");
    }else if(url && !url.startsWith('http')){
      window.open(`https://${url}`, "_blank", "noopener,noreferrer");
    } else {
      // Optional: Show a toast or alert if the link is missing
      alert("This alum hasn't linked their profile yet.");
    }
  };

  return (
    <>
      <Nav />
      <div className="bg-[#fcfbf9] dark:bg-background text-foreground antialiased font-sans min-h-screen mt-20">
        <style dangerouslySetInnerHTML={{
          __html: `
          .custom-scrollbar::-webkit-scrollbar { height: 4px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }
        `
        }} />

        {isModalOpen ?
          (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-background/80 backdrop-blur-md overflow-y-auto">

              {/* Alumni Profile Modal Container */}
              <main className="relative w-full max-w-4xl bg-card rounded-lg sm:rounded-lg md:rounded-[2rem] shadow-2xl overflow-hidden flex flex-col border border-border my-4">

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col max-h-[95vh] sm:max-h-[90vh] overflow-y-auto custom-scrollbar">

                  <style dangerouslySetInnerHTML={{
                    __html: `
              .custom-scrollbar::-webkit-scrollbar { width: 6px; }
              .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
              .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }
              `
                  }} />

                  {/* Close Button */}
                  <button
                    onClick={() => {
                      setIsModalOpen(!isModalOpen)
                      setSelectedAlumni(null)
                    }}
                    className="absolute top-3 right-3 sm:top-6 sm:right-6 z-20 p-1.5 sm:p-2 rounded-full bg-background/50 hover:bg-muted transition-colors text-muted-foreground">
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>

                  {/* Top Header Section */}
                  <header className="p-4 sm:p-6 md:p-8 lg:p-12 bg-linear-to-br from-brand/10 via-brand/5 to-transparent flex flex-col items-center gap-4 sm:gap-6 relative">
                    <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-brand/5 rounded-full blur-3xl"></div>

                    {/* Circular Profile Picture */}
                    <div className="relative group shrink-0">
                      <div className="absolute inset-0 bg-brand/20 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
                      <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full p-1 bg-linear-to-tr from-brand to-brand/30">
                        <img
                          alt="Alumni Profile"
                          className="w-full h-full rounded-full object-cover border-3 sm:border-4 border-card shadow-lg"
                          src={selectedAlumni?.image}
                        />
                      </div>
                      <div className="absolute bottom-0 right-0 bg-background rounded-full shadow-md">
                        {selectedAlumni?.isVerified ? (
                          <BadgeCheck className="size-4 sm:size-5 md:size-7 text-green-500" />
                        ) : (
                          <BadgeAlert className="size-4 sm:size-5 md:size-7 text-destructive/80" />
                        )}
                      </div>
                    </div>

                    {/* Primary Professional Info */}
                    <div className="flex-1 text-center pt-0 sm:pt-2">
                      <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-foreground tracking-tight leading-tight mb-2 sm:mb-3">
                        {selectedAlumni?.name}
                      </h1>
                      <p className="text-sm sm:text-base md:text-lg font-medium text-muted-foreground mb-4 sm:mb-6">{selectedAlumni?.displayRole}</p>

                      <div className="flex flex-wrap justify-center gap-3">
                        <div className="flex items-center gap-2 px-4 py-1.5 bg-background rounded-full border border-border/60 text-xs sm:text-sm">
                          <Briefcase className="text-muted-foreground w-3.5 h-3.5" />
                          <span className="font-medium line-clamp-1">{selectedAlumni?.currentCompany}</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-1.5 bg-background rounded-full border border-border/60 text-xs sm:text-sm">
                          <MapPin className="text-muted-foreground w-3.5 h-3.5" />
                          <span className="font-medium line-clamp-1">{selectedAlumni?.city}</span>
                        </div>
                      </div>
                    </div>
                  </header>

                  {/* Central Body Area */}
                  <div className="p-4 sm:p-6 md:p-8 lg:p-12 space-y-6 sm:space-y-8 md:space-y-12">

                    {/* Bio Section */}
                    <section>
                      <h2 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-muted-foreground mb-2 sm:mb-4">Professional Bio</h2>
                      <p className="text-sm sm:text-base md:text-lg text-foreground/80 leading-relaxed font-light">
                        {selectedAlumni?.about || "This alum has not added a bio yet."}
                      </p>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10">
                      {/* Academic Background */}
                      <section className="space-y-4 sm:space-y-6">
                        <h2 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-muted-foreground">Academic Background</h2>
                        <div className="bg-muted/30 rounded-lg sm:rounded-lg p-4 sm:p-6 flex gap-3 sm:gap-4 items-start sm:items-center border border-border/50 group hover:border-brand/30 transition-colors">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-lg bg-brand/10 text-brand flex items-center justify-center shrink-0">
                            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-sm sm:text-base text-foreground">{getCollegeName(selectedAlumni?.enrollmentNumber)}</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground">{selectedAlumni?.course} {selectedAlumni?.branch}</p>
                            <p className="text-[10px] sm:text-xs font-black text-brand mt-1 uppercase tracking-wider">Class of {selectedAlumni?.batch}</p>
                          </div>
                        </div>
                      </section>

                      {/* Career Highlights */}
                      <section className="space-y-4 sm:space-y-6">
                        <h2 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-muted-foreground">Career Highlights</h2>
                        <div className="space-y-4 sm:space-y-5">
                          <div className="flex items-start gap-3 sm:gap-4 group">
                            <span className="w-2 h-2 rounded-full bg-brand mt-1.5 sm:mt-2 ring-4 ring-brand/10"></span>
                            <div className="min-w-0">
                              <p className="font-bold text-sm sm:text-base text-foreground group-hover:text-brand transition-colors line-clamp-2">{selectedAlumni?.jobTitle}</p>
                              <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{selectedAlumni?.currentCompany}</p>
                              <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{selectedAlumni?.city}, {selectedAlumni?.country}</p>
                            </div>
                          </div>
                        </div>
                      </section>
                    </div>

                    {/* Footer Action Area */}
                    <footer className="pt-6 sm:pt-8 md:pt-10 border-t border-border flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-8">

                      {/* Connect Button */}
                      <button
                        onClick={rout}
                        className="w-full sm:w-auto px-6 sm:px-10 py-3 sm:py-4 bg-[#0077b5] text-white rounded-lg sm:rounded-lg font-bold text-xs sm:text-sm shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-2 sm:gap-3 group hover:shadow-2xl"
                      >
                        Connect on LinkedIn
                        <Send className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </button>
                    </footer>
                  </div>
                </div>
              </main>
            </div>
          ) : (
            ``
          )}

        <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-8 sm:py-12 md:py-20">

          {/* Header Console */}
          <div className="mb-8 sm:mb-12 md:mb-16 text-center space-y-4 sm:space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="max-w-3xl mx-auto space-y-2 sm:space-y-3 md:space-y-4">
              <h4 className="text-brand font-bold tracking-widest uppercase text-sm mb-6">Global Directory</h4>
              <h1 className="text-4xl md:text-6xl lg:text-[5rem] font-serif tracking-tight leading-tight text-foreground mb-6">
                Discovery <span className="italic text-brand">Console.</span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto">
                Instantly explore the global Radharaman Group of Institutes (RGI) network.
                Start typing to find alumni by role, company, or interests.
              </p>
            </div>

            {/* Search Input - Now Functional! */}
            <div className="relative max-w-2xl mx-auto group">
              <div className="absolute inset-y-0 left-3 sm:left-4 md:left-6 flex items-center pointer-events-none">
                <Search className="text-brand size-4 sm:size-5 md:size-6" />
              </div>
              <input
                value={filters.search}
                onChange={(e) => {
                  setPage(1); // Reset page on search
                  setFilters({ ...filters, search: e.target.value });
                }}
                className="w-full bg-card border border-border h-9 sm:h-11 md:h-12 lg:h-14 pl-10 sm:pl-12 md:pl-16 pr-4 sm:pr-6 md:pr-8 rounded-full text-xs sm:text-sm md:text-base lg:text-lg shadow-lg shadow-brand/5 focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-brand/10 transition-all placeholder:text-muted-foreground/50 text-foreground"
                placeholder="Search by name, role, or company..."
                type="text"
              />
            </div>
          </div>

          {/* ═══ MOBILE: Compact Dropdown Selects (single row) ═══ */}
          <div className="flex sm:hidden items-center gap-2 mt-6 px-1">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground shrink-0" />
            <div className="flex-1 grid grid-cols-3 gap-2">
              <div className="relative">
                <select
                  value={filters.course}
                  onChange={(e) => { setPage(1); setFilters({ ...filters, course: e.target.value }); }}
                  className="w-full appearance-none bg-card border border-border rounded-lg px-3 py-2.5 pr-7 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all truncate"
                >
                  {courses.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={filters.branch}
                  onChange={(e) => { setPage(1); setFilters({ ...filters, branch: e.target.value }); }}
                  className="w-full appearance-none bg-card border border-border rounded-lg px-3 py-2.5 pr-7 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all truncate"
                >
                  <option value="All Branches">All Branches</option>
                  {branches.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={filters.batch}
                  onChange={(e) => { setPage(1); setFilters({ ...filters, batch: e.target.value }); }}
                  className="w-full appearance-none bg-card border border-border rounded-lg px-3 py-2.5 pr-7 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all truncate"
                >
                  {batches.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          {/* ═══ DESKTOP: Chip Pills (hidden on mobile) ═══ */}
          <div className="hidden sm:flex flex-col gap-4 md:gap-5 mt-10 md:mt-12 w-full max-w-5xl mx-auto">
            {/* Course chips */}
            <div className="space-y-1.5">
              <p className="text-xs font-black uppercase tracking-[0.15em] text-muted-foreground text-center">Course</p>
              <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                {courses.map((course) => (
                  <button
                    key={course}
                    onClick={() => { setPage(1); setFilters({ ...filters, course: course }); }}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-semibold text-xs md:text-sm transition-all whitespace-nowrap ${filters.course === course
                      ? "bg-brand text-primary-foreground shadow-sm"
                      : "bg-card border border-border text-foreground hover:border-brand hover:text-brand"
                      }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    {course}
                  </button>
                ))}
              </div>
            </div>
            {/* Branch chips */}
            <div className="space-y-1.5">
              <p className="text-xs font-black uppercase tracking-[0.15em] text-muted-foreground text-center">Branch</p>
              <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                {branches.map((branch) => (
                  <button
                    key={branch}
                    onClick={() => { setPage(1); setFilters({ ...filters, branch: branch }); }}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-semibold text-xs md:text-sm transition-all whitespace-nowrap ${filters.branch === branch
                      ? "bg-brand text-primary-foreground shadow-sm"
                      : "bg-card border border-border text-foreground hover:border-brand"
                      }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    {branch}
                  </button>
                ))}
              </div>
            </div>
            {/* Batch chips */}
            <div className="space-y-1.5">
              <p className="text-xs font-black uppercase tracking-[0.15em] text-muted-foreground text-center">Batch</p>
              <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                {batches.map((batch) => (
                  <button
                    key={batch}
                    onClick={() => { setPage(1); setFilters({ ...filters, batch: batch }); }}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-semibold text-xs md:text-sm transition-all whitespace-nowrap ${filters.batch === batch
                      ? "bg-brand text-primary-foreground shadow-sm"
                      : "bg-card border border-border text-foreground hover:border-brand"
                      }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    {batch}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-8 sm:space-y-10 md:space-y-12 mt-10 sm:mt-12 md:mt-16">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4 sm:pb-6 gap-3 sm:gap-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <TrendingUp className="text-brand w-5 h-5 sm:w-6 sm:h-6" />
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">Network Members</h2>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">Showing {finalAlumniData.length} Alumni</p>
            </div>

            {loading ? (
              <div className="flex justify-center py-32">
                <Loader2 className="w-10 h-10 animate-spin text-brand" />
              </div>
            ) : finalAlumniData.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <Database className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="text-lg font-medium">No alumni found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
                {finalAlumniData.map((alumni) => (
                  <div
                    key={alumni.id}
                    onClick={() => {
                      setIsModalOpen(!isModalOpen)
                      setSelectedAlumni(alumni)
                    }}
                    className="group relative flex flex-col bg-card p-2 sm:p-3 md:p-4 rounded-lg md:rounded-none md:rounded-tr-3xl md:rounded-bl-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-border/40 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] hover:border-brand/20 transition-all duration-500 cursor-pointer overflow-hidden"
                  >
                    {/* Profile Image */}
                    <div className="relative mb-5 rounded-lg md:rounded-lg overflow-hidden bg-muted aspect-square">
                      <img
                        alt={`${alumni.name} profile portrait`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        src={alumni.image}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 flex items-end p-4">
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex flex-col flex-1">
                      <div className="mb-4">
                        <h3 className="font-serif text-lg md:text-xl font-bold text-foreground group-hover:text-brand transition-colors leading-tight">
                          {alumni.name}
                        </h3>
                        <p className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1.5">
                          Batch of {alumni.displayBatch}
                        </p>
                      </div>

                      {alumni.jobTitle && alumni.currentCompany &&
                      <div className="mt-auto pt-4 border-t border-border/50">
                        <p className="text-xs md:text-sm font-medium text-foreground line-clamp-1">
                          {alumni.jobTitle}
                        </p>
                        <p className="text-[11px] md:text-xs text-muted-foreground mt-0.5 line-clamp-1">
                          at {alumni.currentCompany}
                        </p>
                      </div>
                      }
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* The Infinite Scroll Trigger */}
            <div ref={lastElementRef} className="flex flex-col items-center justify-center py-8 sm:py-10 md:py-12 h-24 sm:h-28 md:h-32 w-full">
              {loadingMore && (
                <div className="flex flex-col items-center gap-3 text-brand">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <span className="text-sm font-bold tracking-widest uppercase animate-pulse">Loading More Network...</span>
                </div>
              )}

              {!hasMore && finalAlumniData.length > 0 && !loading && (
                <div className="flex flex-col items-center gap-2 opacity-50">
                  <Database className="w-6 h-6" />
                  <p className="text-muted-foreground text-sm font-bold">
                    You've reached the end of the directory.
                  </p>
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
