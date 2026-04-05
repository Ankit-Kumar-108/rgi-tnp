"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Search, Calendar, TrendingUp,
  Briefcase, Mail, Network, Database, Loader2, BookOpen, X,
  School, MapPin, Link as LinkIcon,
  Share2, Send, BadgeCheck
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
        }
      } catch (err) {
        console.error("Fetch error:", err);
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

  const branches = ["All Branches", "Computer Science", "Mechanical", "Civil", "Electronics", "Electrical"]
  const batches = ["All Batches", "2022", "2023", "2024", "2025", "2026", "2027", "2028"]
  const courses = ["All Courses", "B.Tech", "M.Tech", "MBA", "Diploma"]

  const getCollegeName = (enroll: string | undefined) => {
    if (!enroll) return "Radharaman Group of Institutions";
    const clgCode = enroll.substring(0, 4);

    if (clgCode === "0132") return "Radharaman Institute of Technology & Science";
    if (clgCode === "0158") return "Radharaman Engineering College";

    return "Radharaman Group of Institutions";
  };

  const collegeName = getCollegeName(selectedAlumni?.enrollmentNumber);

  const rout = () => {
    const url = selectedAlumni?.linkedInUrl; // Double check your field name (linkedInUrl vs linkedinUrl)

    if (url && url.startsWith('http')) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      // Optional: Show a toast or alert if the link is missing
      alert("This alum hasn't linked their profile yet.");
    }
  };

  return (
    <>
      <Nav />
      <div className="bg-background text-foreground antialiased font-sans min-h-screen selection:bg-brand/10 selection:text-brand mt-20">
        <style dangerouslySetInnerHTML={{
          __html: `
          .custom-scrollbar::-webkit-scrollbar { height: 4px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }
        `
        }} />

        {isModalOpen ?
          (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-md">

              {/* Alumni Profile Modal Container */}
              <main className="relative w-full max-w-4xl bg-card rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-border">

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col max-h-[90vh] overflow-y-auto custom-scrollbar">

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
                    className="absolute top-6 right-6 z-20 p-2 rounded-full bg-background/50 hover:bg-muted transition-colors text-muted-foreground">
                    <X className="w-5 h-5" />
                  </button>

                  {/* Top Header Section */}
                  <header className="p-8 md:p-12 bg-gradient-to-br from-brand/10 via-brand/5 to-transparent flex flex-col md:flex-row items-center md:items-start gap-8 relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full blur-3xl"></div>

                    {/* Circular Profile Picture */}
                    <div className="relative group shrink-0">
                      <div className="absolute inset-0 bg-brand/20 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
                      <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-tr from-brand to-brand/30">
                        <img
                          alt="Alumni Profile"
                          className="w-full h-full rounded-full object-cover border-4 border-card shadow-lg"
                          src={selectedAlumni?.image}
                        />
                      </div>
                      <div className="absolute bottom-2 right-2 w-8 h-8 bg-brand text-primary-foreground rounded-full flex items-center justify-center border-2 border-card shadow-lg">
                        <BadgeCheck className="w-4 h-4 fill-current" />
                      </div>
                    </div>

                    {/* Primary Professional Info */}
                    <div className="flex-1 text-center md:text-left pt-2">
                      <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight leading-none mb-3">
                        {selectedAlumni?.name}
                      </h1>
                      <p className="text-xl font-bold text-brand mb-5">{selectedAlumni?.displayRole}</p>

                      <div className="flex flex-wrap justify-center md:justify-start gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-full border border-border shadow-sm">
                          <Briefcase className="text-brand w-4 h-4" />
                          <span className="text-sm font-semibold">{selectedAlumni?.currentCompany}</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-full border border-border shadow-sm">
                          <MapPin className="text-brand w-4 h-4" />
                          <span className="text-sm font-semibold">{selectedAlumni?.city}</span>
                        </div>
                      </div>
                    </div>
                  </header>

                  {/* Central Body Area */}
                  <div className="p-8 md:p-12 space-y-12">

                    {/* Bio Section */}
                    <section>
                      <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-4">Professional Bio</h2>
                      <p className="text-lg text-foreground/80 leading-relaxed font-light">
                        {selectedAlumni?.about || "This alum has not added a bio yet."}
                      </p>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      {/* Academic Background */}
                      <section className="space-y-6">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Academic Background</h2>
                        <div className="bg-muted/30 rounded-2xl p-6 flex gap-4 items-center border border-border/50 group hover:border-brand/30 transition-colors">
                          <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0">
                            <BookOpen className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground">{getCollegeName(selectedAlumni?.enrollmentNumber)}</h3>
                            <p className="text-sm text-muted-foreground">{selectedAlumni?.course} {selectedAlumni?.branch}</p>
                            <p className="text-xs font-black text-brand mt-1 uppercase tracking-wider">Class of {selectedAlumni?.batch}</p>
                          </div>
                        </div>
                      </section>

                      {/* Career Highlights */}
                      <section className="space-y-6">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Career Highlights</h2>
                        <div className="space-y-5">
                          <div className="flex items-start gap-4 group">
                            <span className="w-2 h-2 rounded-full bg-brand mt-2 ring-4 ring-brand/10"></span>
                            <div>
                              <p className="font-bold text-foreground group-hover:text-brand transition-colors">{selectedAlumni?.jobTitle}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{selectedAlumni?.currentCompany}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{selectedAlumni?.city}, {selectedAlumni?.country}</p>
                            </div>
                          </div>
                        </div>
                      </section>
                    </div>

                    {/* Footer Action Area */}
                    <footer className="pt-10 border-t border-border flex flex-col md:flex-row items-center justify-end gap-8">

                      {/* Connect Button */}
                      <button
                        onClick={rout}
                        className="flex-1 md:flex-none px-10 py-4 bg-[#0077b5] text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-500/20 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
                      >
                        Connect on LinkedIn
                        <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </button>
                    </footer>
                  </div>
                </div>
              </main>
            </div>
          ) : (
            ``
          )}

        <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">

          {/* Header Console */}
          <div className="mb-16 text-center space-y-8">
            <div className="max-w-3xl mx-auto space-y-4">
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground">
                Discovery Console
              </h1>
              <p className="text-lg text-muted-foreground font-light leading-relaxed">
                Instantly explore the global Radharaman Group of Institutes (RGI) network.
                Start typing to find alumni by role, company, or interests.
              </p>
            </div>

            {/* Search Input - Now Functional! */}
            <div className="relative max-w-2xl mx-auto group">
              <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                <Search className="text-brand w-6 h-6" />
              </div>
              <input
                value={filters.search}
                onChange={(e) => {
                  setPage(1); // Reset page on search
                  setFilters({ ...filters, search: e.target.value });
                }}
                className="w-full bg-card border border-border h-20 pl-16 pr-8 rounded-[2rem] text-xl shadow-2xl shadow-brand/5 focus:outline-none focus:ring-4 focus:ring-brand/10 transition-all placeholder:text-muted-foreground/50 text-foreground"
                placeholder="Search by name, role, or company..."
                type="text"
              />
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex flex-col items-center gap-4 mt-8">
            {/* Branch Filters */}
            <div className="flex flex-wrap justify-center gap-3 overflow-x-auto pb-2 px-4 custom-scrollbar max-w-5xl">
              {branches.map((branch) => (
                <button
                  key={branch}
                  onClick={() => { setPage(1); setFilters({ ...filters, branch: branch }); }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all shadow-sm ${filters.branch === branch
                    ? "bg-brand text-primary-foreground"
                    : "bg-card border border-border text-foreground hover:border-brand"
                    }`}
                >
                  <BookOpen className="w-4 h-4" /> {branch}
                </button>
              ))}
            </div>
            {/* Batch Filters */}
            <div className="flex flex-wrap justify-center gap-3 overflow-x-auto pb-2 px-4 custom-scrollbar max-w-5xl">
              {batches.map((batch) => (
                <button
                  key={batch}
                  onClick={() => { setPage(1); setFilters({ ...filters, batch: batch }); }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all shadow-sm ${filters.batch === batch
                    ? "bg-brand text-primary-foreground"
                    : "bg-card border border-border text-foreground hover:border-brand"
                    }`}
                >
                  <Calendar className="w-4 h-4" /> {batch}
                </button>
              ))}
            </div>
            {/* Courses Filters */}
            <div className="flex flex-wrap justify-center gap-3 overflow-x-auto pb-2 px-4 custom-scrollbar max-w-5xl">
              {courses.map((course) => (
                <button
                  key={course}
                  onClick={() => { setPage(1); setFilters({ ...filters, course: course }); }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all ${filters.course === course
                    ? "bg-brand text-primary-foreground border-brand"
                    : "bg-card border border-border text-foreground hover:border-brand hover:text-brand"
                    }`}
                >
                  <BookOpen className="w-4 h-4" /> {course}
                </button>
              ))}
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-12 mt-12">
            <div className="flex items-center justify-between border-b border-border pb-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="text-brand w-6 h-6" />
                <h2 className="text-xl font-bold text-foreground">Network Members</h2>
              </div>
              <p className="text-sm text-muted-foreground font-medium">Showing {finalAlumniData.length} Alumni</p>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-brand" />
              </div>
            ) : finalAlumniData.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <Database className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="text-lg font-medium">No alumni found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {finalAlumniData.map((alumni) => (
                  <div
                    key={alumni.id}
                    className="group relative bg-card rounded-[2rem] p-5 shadow-sm hover:shadow-2xl transition-all duration-300 border border-border hover:border-brand/30 overflow-hidden flex flex-col justify-between"
                  >
                    {/* Profile Image with Hover Overlay */}
                    <div className="relative h-64 mb-6 rounded-2xl overflow-hidden bg-muted">
                      <img
                        alt={`${alumni.name} profile portrait`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        src={alumni.image}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                        <button
                          onClick={() => {
                            setIsModalOpen(!isModalOpen)
                            setSelectedAlumni(alumni)

                          }}
                          className="w-full bg-background text-foreground py-3 rounded-xl font-bold text-sm hover:bg-muted transition-colors">
                          View Full Profile
                        </button>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-4 flex-1 flex flex-col justify-end">
                      <div>
                        <h3 className="text-xl font-bold text-foreground group-hover:text-brand transition-colors">
                          {alumni.name}
                        </h3>
                        <p className="text-xs font-bold text-brand uppercase tracking-wider mt-1">
                          Batch of {alumni.displayBatch}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-2xl border border-border/50">
                        <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center shadow-sm shrink-0">
                          {alumni.icon}
                        </div>
                        <p className="text-xs font-semibold leading-snug text-foreground">
                          {alumni.displayRole}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* The Infinite Scroll Trigger */}
            <div ref={lastElementRef} className="flex flex-col items-center justify-center py-12 h-32 w-full">
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