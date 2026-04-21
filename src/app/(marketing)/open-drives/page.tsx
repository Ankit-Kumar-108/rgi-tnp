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
      <div className="bg-background text-foreground antialiased font-sans flex flex-col min-h-screen selection:bg-brand/10 selection:text-brand">
        <main className="flex-1 w-full pt-20 pb-24">
          
          {/* Hero Section */}
          <section className="max-w-7xl mx-auto px-6 md:px-8 mb-20">
            <div className="mb-12 text-center md:text-left">
              <span className="inline-block bg-brand/10 text-brand text-sm font-bold tracking-widest uppercase px-4 py-1 rounded-full mb-4">
                Global Opportunities
              </span>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.9] text-foreground mb-6">
                Open Campus <br />
                <span className="text-brand">Drives.</span>
              </h1>
              <p className="text-lg text-muted-foreground font-light max-w-2xl">
                Explore exciting placement opportunities available for students from all colleges. Register and start your journey with top organizations.
              </p>
            </div>
          </section>

          {/* Drives Section */}
          <section className="max-w-7xl mx-auto px-6 md:px-8">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-brand" />
              </div>
            ) : drives.length === 0 ? (
              <div className="bg-card rounded-[2rem] border border-border p-16 text-center shadow-sm">
                <Briefcase className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground">No Drives Available</h3>
                <p className="text-muted-foreground mt-2">There are currently no open campus drives scheduled. Check back soon!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {drives.map((drive) => (
                  <div key={drive.id} className="group flex flex-col bg-card rounded-[2rem] p-8 shadow-[var(--shadow-sm)] border border-border hover:shadow-[var(--shadow-xl)] hover:border-brand/30 transition-all duration-300">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-brand/10 flex items-center justify-center border border-brand/20">
                        <Building2 className="w-6 h-6 text-brand" />
                      </div>
                      <span className="px-3 py-1 bg-green-500/10 text-green-600 text-xs font-bold uppercase tracking-widest rounded-full">
                        {drive.ctc}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-black text-foreground mb-1 group-hover:text-brand transition-colors">
                      {drive.roleName}
                    </h3>
                    <p className="text-base text-muted-foreground font-medium mb-6">
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

                    <button 
                      onClick={() => { setSelectedDrive(drive); setIsModalOpen(true); }}
                      className="w-full bg-background border-2 border-brand/20 text-brand py-3.5 rounded-xl font-bold hover:bg-brand hover:text-primary-foreground hover:border-brand transition-colors text-sm"
                    >
                      View Details
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
