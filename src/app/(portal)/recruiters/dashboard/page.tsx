"use client";

import React from "react";
import { 
  Plus, 
  Ban, 
  Search, 
  Filter, 
  Download, 
  ArrowUpDown, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Loader2
} from "lucide-react";
import Nav from "@/components/layout/nav/nav";
import Footer from "@/components/layout/footer/footer";
import { useAuth } from "@/hooks/useAuth";

export default function RecruiterDashboard() {
  const { loading, authenticated } = useAuth("recruiter", "/recruiters/login");

  if (loading || !authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <>
    <Nav/>
    <div className="bg-background text-foreground antialiased font-sans flex flex-col min-h-screen mt-15">
      
      {/* Local styles for condensed text/numbers */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .condensed-text { font-stretch: condensed; }
          .hero-number { line-height: 0.8; }
        `
      }} />

      {/* Main Content Area */}
      <main className="p-8 max-w-6xl mx-auto w-full space-y-10 flex-1">
        
        {/* Total Pipeline Volume */}
        <section className="text-center py-10">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">
            Total Pipeline Volume
          </p>
          <div className="flex flex-col items-center justify-center">
            <span className="text-8xl font-black text-brand hero-number tracking-tighter condensed-text">
              1,284
            </span>
            <span className="text-sm font-semibold text-muted-foreground mt-6 bg-card px-4 py-2 rounded-full border border-border">
              Active Candidates Across All Sectors
            </span>
          </div>
        </section>

        {/* Manage Active Jobs */}
        <section>
          <div className="flex items-center justify-between mb-6 px-2">
            <h2 className="text-lg font-bold text-foreground">Manage Active Jobs</h2>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold rounded-full uppercase">
                12 Active
              </span>
              <span className="px-3 py-1 bg-muted text-muted-foreground text-[10px] font-bold rounded-full uppercase">
                4 Paused
              </span>
            </div>
            <button className="bg-brand text-primary-foreground font-bold px-6 py-2.5 rounded-full flex items-center gap-2 hover:bg-brand/90 transition-all shadow-md text-sm">
            <Plus className="w-4 h-4" />
            <span>Create Job Posting</span>
          </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Job Card 1 */}
            <div className="bg-card p-5 rounded-3xl border border-border shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="px-2 py-0.5 bg-brand/10 text-brand text-[10px] font-bold rounded uppercase">
                    Tech
                  </span>
                  <span className="text-[10px] font-medium text-muted-foreground">
                    Posted 2d ago
                  </span>
                </div>
                <h3 className="font-bold text-foreground">Senior Software Engineer</h3>
                <p className="text-xs text-muted-foreground mt-1">Full-time • Remote Friendly</p>
                <p className="text-xs font-bold text-brand mt-3">458 Applications</p>
              </div>
              <button className="mt-5 w-full py-2 bg-destructive/10 text-destructive text-xs font-bold rounded-xl hover:bg-destructive/20 transition-colors flex items-center justify-center gap-2">
                <Ban className="w-4 h-4" />
                Stop Taking Responses
              </button>
            </div>

            {/* Job Card 2 */}
            <div className="bg-card p-5 rounded-3xl border border-border shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="px-2 py-0.5 bg-foreground/10 text-foreground text-[10px] font-bold rounded uppercase">
                    Design
                  </span>
                  <span className="text-[10px] font-medium text-muted-foreground">
                    Posted 5d ago
                  </span>
                </div>
                <h3 className="font-bold text-foreground">Graduate UX Designer</h3>
                <p className="text-xs text-muted-foreground mt-1">Internship • Campus Drive</p>
                <p className="text-xs font-bold text-brand mt-3">824 Applications</p>
              </div>
              <button className="mt-5 w-full py-2 bg-destructive/10 text-destructive text-xs font-bold rounded-xl hover:bg-destructive/20 transition-colors flex items-center justify-center gap-2">
                <Ban className="w-4 h-4" />
                Stop Taking Responses
              </button>
            </div>

            {/* Post New Job Card */}
            <div className="bg-card p-5 rounded-3xl border border-border shadow-sm flex flex-col justify-between border-dashed hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="h-full flex flex-col items-center justify-center py-6">
                <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center mb-3">
                  <Plus className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-xs font-bold text-muted-foreground">Post Another Role</p>
              </div>
            </div>
          </div>
        </section>

        {/* Applicant Processing Table */}
        <section className="bg-card rounded-[2rem] shadow-sm border border-border overflow-hidden">
          
          {/* Table Header Controls */}
          <div className="px-8 py-5 flex justify-between items-center border-b border-border bg-muted/30">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-bold text-foreground">Process Applicants</h3>
              <div className="flex items-center bg-background border border-border px-3 py-1.5 rounded-full">
                <Search className="w-4 h-4 text-muted-foreground mr-2" />
                <input 
                  className="bg-transparent border-none focus:ring-0 text-[11px] w-40 font-medium p-0 outline-none text-foreground placeholder:text-muted-foreground" 
                  placeholder="Filter by name or college..." 
                  type="text" 
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-muted-foreground hover:text-brand transition-colors">
                <Filter className="w-5 h-5" />
              </button>
              <button className="p-2 text-muted-foreground hover:text-brand transition-colors">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left table-fixed">
              <thead className="bg-muted/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-8 py-4 w-1/4">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-brand transition-colors">
                      Candidate Name <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-4 py-4 w-1/4">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-brand transition-colors">
                      College Name <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-4 py-4 w-1/5">Applied Role</th>
                  <th className="px-4 py-4 w-1/6">Status</th>
                  <th className="px-8 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                
                {/* Row 1 */}
                <tr className="hover:bg-brand/5 transition-colors group">
                  <td className="px-8 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-brand/10 flex items-center justify-center text-brand font-black text-[10px]">
                        AM
                      </div>
                      <span className="font-bold text-foreground text-sm condensed-text">
                        Aditi Mishra
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium text-muted-foreground truncate block">
                      Radharaman Engineering College
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-muted-foreground font-medium">Full Stack Dev</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-brand/10 text-brand text-[9px] font-black rounded uppercase tracking-tighter">
                      Shortlisted
                    </span>
                  </td>
                  <td className="px-8 py-3 text-right">
                    <a className="inline-flex items-center gap-1 text-brand font-black text-[11px] hover:underline uppercase tracking-tight" href="#">
                      View Application <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </td>
                </tr>

                {/* Row 2 */}
                <tr className="hover:bg-brand/5 transition-colors group">
                  <td className="px-8 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-black text-[10px]">
                        RK
                      </div>
                      <span className="font-bold text-foreground text-sm condensed-text">
                        Rahul Kapoor
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium text-muted-foreground truncate block">
                      UIT-RGPV Bhopal
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-muted-foreground font-medium">Data Analyst</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-muted text-muted-foreground text-[9px] font-black rounded uppercase tracking-tighter">
                      Under Review
                    </span>
                  </td>
                  <td className="px-8 py-3 text-right">
                    <a className="inline-flex items-center gap-1 text-brand font-black text-[11px] hover:underline uppercase tracking-tight" href="#">
                      View Application <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </td>
                </tr>

                {/* Row 3 */}
                <tr className="hover:bg-brand/5 transition-colors group">
                  <td className="px-8 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 font-black text-[10px]">
                        PS
                      </div>
                      <span className="font-bold text-foreground text-sm condensed-text">
                        Priya Sharma
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium text-muted-foreground truncate block">
                      SATI Vidisha
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-muted-foreground font-medium">UI/UX Designer</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[9px] font-black rounded uppercase tracking-tighter">
                      Offer Sent
                    </span>
                  </td>
                  <td className="px-8 py-3 text-right">
                    <a className="inline-flex items-center gap-1 text-brand font-black text-[11px] hover:underline uppercase tracking-tight" href="#">
                      View Application <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </td>
                </tr>

                {/* Row 4 */}
                <tr className="hover:bg-brand/5 transition-colors group">
                  <td className="px-8 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-brand/10 flex items-center justify-center text-brand font-black text-[10px]">
                        VS
                      </div>
                      <span className="font-bold text-foreground text-sm condensed-text">
                        Vikram Singh
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium text-muted-foreground truncate block">
                      LNCT Group
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-muted-foreground font-medium">Backend Engineer</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-brand/10 text-brand text-[9px] font-black rounded uppercase tracking-tighter">
                      Shortlisted
                    </span>
                  </td>
                  <td className="px-8 py-3 text-right">
                    <a className="inline-flex items-center gap-1 text-brand font-black text-[11px] hover:underline uppercase tracking-tight" href="#">
                      View Application <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </td>
                </tr>

                {/* Row 5 */}
                <tr className="hover:bg-brand/5 transition-colors group">
                  <td className="px-8 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-700 dark:text-yellow-400 font-black text-[10px]">
                        AN
                      </div>
                      <span className="font-bold text-foreground text-sm condensed-text">
                        Anjali Nair
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium text-muted-foreground truncate block">
                      Radharaman Institute of Tech
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-muted-foreground font-medium">QA Engineer</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-[9px] font-black rounded uppercase tracking-tighter">
                      Interviewed
                    </span>
                  </td>
                  <td className="px-8 py-3 text-right">
                    <a className="inline-flex items-center gap-1 text-brand font-black text-[11px] hover:underline uppercase tracking-tight" href="#">
                      View Application <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination */}
          <div className="px-8 py-4 bg-muted/30 flex justify-between items-center text-[11px] font-bold text-muted-foreground">
            <span>Showing 5 of 1,284 applicants</span>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1 hover:text-brand transition-colors">
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <div className="flex gap-2">
                <span className="w-6 h-6 flex items-center justify-center bg-brand text-primary-foreground rounded-md">1</span>
                <span className="w-6 h-6 flex items-center justify-center hover:bg-background rounded-md cursor-pointer transition-colors border border-transparent hover:border-border">2</span>
                <span className="w-6 h-6 flex items-center justify-center hover:bg-background rounded-md cursor-pointer transition-colors border border-transparent hover:border-border">3</span>
              </div>
              <button className="flex items-center gap-1 hover:text-brand transition-colors">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </section>
      </main>
    </div>
    <Footer/>
    </>
  );
}