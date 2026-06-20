"use client";

import React, { useEffect, useState } from "react";
import Nav from "@/components/layout/nav/nav";
import Footer from "@/components/layout/footer/footer";
import { Building2, CalendarDays, Rocket, Briefcase, MapPin, Search, Loader2 } from "lucide-react";
import JobDetailsModal from "@/components/forms/studentApplyModal/modal";

export default function PublicOpenDrivesPage() {
  const [drives, setDrives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDrive, setSelectedDrive] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    try {
      const res = await fetch("/api/external/public-drives");
      const data = await res.json() as any;
      if (data.success) {
        setDrives(data.drives || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Nav />
      {selectedDrive && (
        <JobDetailsModal
          drive={selectedDrive}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedDrive(null);
          }}
          onSuccess={() => { }} // Won't be called in publicMode
          publicMode={true}
          role="external_student"
        />
      )}
      <div className="bg-[#fcfbf9] dark:bg-background text-foreground antialiased font-sans flex flex-col min-h-screen">
        <main className="flex-1 w-full pt-20 pb-24">

          {/* Hero Section */}
          <section className="max-w-7xl mx-auto px-5 md:px-8 mb-16 md:mb-24 mt-8">
            <div className="mb-12 text-center md:text-left animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="inline-block text-brand text-sm font-bold tracking-widest uppercase mb-4">
                Global Opportunities
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-[5rem] font-serif tracking-tight leading-tight text-foreground mb-6">
                Open Campus {" "}
                <span className="italic text-brand">Drives.</span>
              </h1>
              <p className="text-base md:text-lg text-muted-foreground font-light max-w-2xl">
                Explore exciting placement opportunities available for students from all colleges. Register and start your journey with top organizations.
              </p>
            </div>

            <div className="w-full border-b border-border/60 pb-4 max-w-3xl hidden md:block"></div>
          </section>

          {/* Drives Section */}
          <section className="max-w-7xl mx-auto px-5 md:px-8">
            {loading ? (
              <div className="flex items-center justify-center py-32">
                <Loader2 className="w-10 h-10 animate-spin text-brand" />
              </div>
            ) : drives.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-40 text-muted-foreground">
                <Briefcase className="w-12 h-12 text-muted-foreground/20 mb-6" />
                <h3 className="font-serif text-2xl text-foreground mb-2">No Drives Available</h3>
                <p className="text-sm">There are currently no open campus drives scheduled. Check back soon!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {drives.map((drive, index) => (
                  <div
                    key={drive.id}
                    className="group flex flex-col bg-card hover:bg-card/80 border border-border/80 hover:border-brand/30 rounded-lg p-6 shadow-[0_8px_30px_rgb(0,0,0,0.01)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all duration-300 relative overflow-hidden h-full animate-in fade-in slide-in-from-bottom-8 fill-mode-both"
                    style={{ animationDelay: `${(index % 12) * 50}ms` }}
                  >
                    {/* Top Accent Gradient Line */}
                    <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-brand/20 via-brand to-brand/20 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    
                    {/* Header */}
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-brand/5 border border-brand/10 flex items-center justify-center text-brand group-hover:scale-110 transition-transform duration-300 shrink-0">
                          <Building2 className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-base text-foreground line-clamp-1">
                            {drive.companyName}
                          </h3>
                          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                            {drive.driveType} Campus
                          </p>
                        </div>
                      </div>
                      
                      {/* CTC Badge */}
                      <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-xs font-bold whitespace-nowrap">
                        {drive.ctc}
                      </div>
                    </div>

                    {/* Role Title */}
                    <div className="mb-5">
                      <h4 className="font-serif text-xl text-foreground font-medium tracking-tight line-clamp-1 group-hover:text-brand transition-colors duration-300">
                        {drive.roleName}
                      </h4>
                      {drive.jobType && (
                        <span className="inline-block mt-1 text-[10px] text-muted-foreground font-bold uppercase tracking-wider px-2 py-0.5 bg-muted rounded border border-border/60">
                          {drive.jobType}
                        </span>
                      )}
                    </div>

                    {/* Key Details Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-6 mt-auto">
                      <div className="p-3 rounded-lg bg-muted/40 border border-border/40 hover:bg-muted/60 transition-colors">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block mb-1">Drive Date</span>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                          <CalendarDays className="w-3.5 h-3.5 text-brand shrink-0" />
                          <span>{new Date(drive.driveDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-muted/40 border border-border/40 hover:bg-muted/60 transition-colors">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block mb-1">Cutoff Criteria</span>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                          <Rocket className="w-3.5 h-3.5 text-brand shrink-0" />
                          <span>{drive.minCGPA ? `${drive.minCGPA} CGPA` : "No CGPA"}</span>
                        </div>
                      </div>

                      <div className="col-span-2 p-3 rounded-lg bg-muted/40 border border-border/40 hover:bg-muted/60 transition-colors">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block mb-1">Eligible Branches</span>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                          <MapPin className="w-3.5 h-3.5 text-brand shrink-0" />
                          <span className="line-clamp-1">{drive.eligibleBranches || "All Branches"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => { setSelectedDrive(drive); setIsModalOpen(true); }}
                      className="w-full py-3 px-4 rounded-lg bg-brand text-primary-foreground hover:bg-brand/90 hover:shadow-lg hover:shadow-brand/20 text-xs font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 group/btn mt-2"
                    >
                      Apply & View Details
                      <span className="text-sm transform group-hover/btn:translate-x-1 transition-transform duration-300">→</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

        </main>
      </div>
      <Footer />
    </>
  );
}
