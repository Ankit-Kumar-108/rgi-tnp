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
          onSuccess={() => {}} // Won't be called in publicMode
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
                Open Campus <br className="hidden md:block" />
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
              <div className="columns-1 md:columns-2 lg:columns-3 gap-5 md:gap-8 space-y-5 md:space-y-8">
                {drives.map((drive, index) => (
                  <div 
                    key={drive.id} 
                    className="break-inside-avoid group flex flex-col bg-card p-6 md:p-8 rounded-2xl md:rounded-none md:rounded-tr-3xl md:rounded-bl-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-border/40 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] hover:border-brand/20 transition-all duration-500 animate-in fade-in slide-in-from-bottom-8 fill-mode-both"
                    style={{ animationDelay: `${(index % 12) * 50}ms` }}
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center border border-border shrink-0">
                        <Building2 className="w-5 h-5 text-muted-foreground group-hover:text-brand transition-colors duration-300" />
                      </div>
                      <span className="text-[10px] font-bold tracking-widest uppercase text-brand">
                        {drive.ctc}
                      </span>
                    </div>
                    
                    <h3 className="font-serif text-xl md:text-2xl text-foreground mb-1 group-hover:text-brand transition-colors duration-300 leading-tight">
                      {drive.roleName}
                    </h3>
                    <p className="text-sm text-muted-foreground font-medium mb-6">
                      {drive.companyName}
                    </p>

                    <div className="space-y-3 mb-8 mt-auto flex-1">
                      <div className="flex items-center gap-3 text-sm text-foreground/80">
                        <CalendarDays className="w-4 h-4 text-brand" />
                        <span>Date: {new Date(drive.driveDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-foreground/80">
                        <Rocket className="w-4 h-4 text-brand" />
                        <span>Branches: <span className="text-xs">{drive.eligibleBranches}</span></span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-foreground/80">
                        <MapPin className="w-4 h-4 text-brand" />
                        <span>Type: {drive.driveType} Campus</span>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-border/40 mt-auto">
                      <button 
                        onClick={() => { setSelectedDrive(drive); setIsModalOpen(true); }}
                        className="flex items-center justify-between w-full text-sm font-bold uppercase tracking-widest text-muted-foreground group-hover:text-brand transition-colors duration-300"
                      >
                        <span>View Details</span>
                        <span className="w-6 h-6 rounded-full border border-border flex items-center justify-center group-hover:border-brand transition-colors">
                          <span className="text-brand">→</span>
                        </span>
                      </button>
                    </div>
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
