import React from "react";
import {
  BadgeCheck,
  Star,
  Handshake,
  Award,
  Building2,
  ArrowRight,
  BrainCircuit,
  Cloud,
  PenTool,
  Shield,
} from "lucide-react";
import Nav from "@/components/layout/nav/nav";
import Footer from "@/components/layout/footer/footer";

export default function Accreditations() {
  return (
    <>
    <Nav/>
    <div className="bg-background text-foreground antialiased font-sans flex min-h-screen">

      {/* Main Content */}
      <main className="flex w-full">
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-24">
          
          {/* Hero Header Section */}
          <section className="relative mb-16 overflow-hidden rounded-[2rem] bg-brand/5 p-8 md:p-12 border border-brand/10">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand/10 to-transparent"></div>
            <div className="relative z-10 max-w-2xl">
              <span className="inline-block px-4 py-1 rounded-full bg-brand/10 text-brand font-bold text-xs uppercase tracking-widest mb-4">
                Quality Assurance
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight mb-6">
                Professional <span className="text-brand">Accreditations</span>{" "}
                & Global Recognitions
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Radharaman Group of Institutes maintains the highest standards of
                technical education through rigorous quality audits and strategic
                corporate partnerships, ensuring our graduates are world-ready.
              </p>
            </div>
          </section>

          {/* Featured Achievement: TCS Appreciation */}
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-border"></div>
              <h2 className="text-2xl font-bold text-foreground uppercase tracking-tighter">
                Premier Recognition
              </h2>
              <div className="h-px flex-1 bg-border"></div>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center bg-card rounded-[2rem] p-8 shadow-sm border border-border">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-tr from-brand to-foreground opacity-10 blur-2xl group-hover:opacity-20 transition-opacity rounded-[2rem]"></div>
                <img
                  alt="Certificate of Appreciation from TCS"
                  className="relative w-full rounded-2xl shadow-xl transition-transform duration-500 group-hover:scale-[1.02] object-cover aspect-[4/3]"
                  src="https://images.unsplash.com/photo-1589330694653-afa59f4710dd?q=80&w=2940&auto=format&fit=crop"
                />
                <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-md p-3 rounded-xl border border-border shadow-sm">
                  <BadgeCheck className="text-brand w-8 h-8" />
                </div>
              </div>
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-foreground/10 text-foreground font-semibold text-sm">
                  <Star className="w-4 h-4" />
                  Corporate Excellence Award
                </div>
                <h3 className="text-3xl font-black text-foreground">
                  Certificate of Appreciation:{" "}
                  <span className="text-brand">Tata Consultancy Services</span>
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  A testament to our enduring commitment to industry-aligned
                  pedagogy. TCS recognizes RGI for outstanding contribution to the
                  talent ecosystem and consistent delivery of high-caliber
                  engineering professionals.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <div className="flex items-center gap-3 p-4 bg-muted rounded-2xl flex-1 min-w-[200px] border border-border/50">
                    <Handshake className="text-brand w-6 h-6" />
                    <span className="text-sm font-medium">
                      Strategic Academic Partner
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-muted rounded-2xl flex-1 min-w-[200px] border border-border/50">
                    <Award className="text-brand w-6 h-6" />
                    <span className="text-sm font-medium">
                      Tier-1 Placement Priority
                    </span>
                  </div>
                </div>
                <button className="w-full md:w-auto bg-brand text-primary-foreground px-8 py-4 rounded-xl font-bold shadow-lg shadow-brand/20 hover:scale-105 transition-all">
                  View Full Certificate
                </button>
              </div>
            </div>
          </section>

          {/* Grid of Recognitions */}
          <section className="mb-20">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl font-bold text-foreground">
                  Institutional Compliance
                </h2>
                <p className="text-muted-foreground mt-1">
                  Affiliations and quality benchmarks
                </p>
              </div>
              <div className="hidden md:block h-px flex-1 bg-border mx-8 mb-4"></div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* ISO 9001:2015 */}
              <div className="bg-card rounded-[2rem] p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-border hover:border-brand/30 group">
                <div className="aspect-[4/3] bg-muted rounded-2xl mb-6 overflow-hidden relative">
                  <div className="absolute inset-0 bg-brand/5 group-hover:bg-transparent transition-colors z-10"></div>
                  <img
                    alt="ISO Certification document"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src="https://images.unsplash.com/photo-1620608518882-628d61741cf3?q=80&w=2938&auto=format&fit=crop"
                  />
                </div>
                <h4 className="text-xl font-bold mb-2 text-foreground">
                  ISO 9001:2015
                </h4>
                <p className="text-sm text-muted-foreground mb-6">
                  Certified Quality Management System ensuring excellence in
                  educational delivery and administrative processes.
                </p>
                <button className="w-full py-3 rounded-xl border-2 border-brand/20 text-brand font-bold hover:bg-brand hover:text-primary-foreground transition-all text-sm">
                  View Full Certificate
                </button>
              </div>

              {/* RGPV Affiliation */}
              <div className="bg-card rounded-[2rem] p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-border hover:border-brand/30 group">
                <div className="aspect-[4/3] bg-muted rounded-2xl mb-6 overflow-hidden relative">
                  <div className="absolute inset-0 bg-brand/5 group-hover:bg-transparent transition-colors z-10"></div>
                  <img
                    alt="RGPV Affiliation letter"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2936&auto=format&fit=crop"
                  />
                </div>
                <h4 className="text-xl font-bold mb-2 text-foreground">
                  RGPV Affiliation
                </h4>
                <p className="text-sm text-muted-foreground mb-6">
                  Permanently affiliated to Rajiv Gandhi Proudyogiki
                  Vishwavidyalaya, Bhopal for all major engineering disciplines.
                </p>
                <button className="w-full py-3 rounded-xl border-2 border-brand/20 text-brand font-bold hover:bg-brand hover:text-primary-foreground transition-all text-sm">
                  View Full Certificate
                </button>
              </div>

              {/* AICTE Approval */}
              <div className="bg-card rounded-[2rem] p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-border hover:border-brand/30 group">
                <div className="aspect-[4/3] bg-muted rounded-2xl mb-6 overflow-hidden relative">
                  <div className="absolute inset-0 bg-brand/5 group-hover:bg-transparent transition-colors z-10"></div>
                  <img
                    alt="AICTE approval"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2912&auto=format&fit=crop"
                  />
                </div>
                <h4 className="text-xl font-bold mb-2 text-foreground">
                  AICTE Approval
                </h4>
                <p className="text-sm text-muted-foreground mb-6">
                  Recognized by the All India Council for Technical Education for
                  its diverse range of UG and PG programs.
                </p>
                <button className="w-full py-3 rounded-xl border-2 border-brand/20 text-brand font-bold hover:bg-brand hover:text-primary-foreground transition-all text-sm">
                  View Full Certificate
                </button>
              </div>
            </div>
          </section>

          {/* Corporate Endorsements Bento Grid */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-foreground mb-8">
              Corporate Endorsements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              <div className="md:col-span-2 bg-gradient-to-br from-brand/80 to-brand p-8 rounded-[2rem] text-primary-foreground shadow-xl flex flex-col justify-between">
                <div>
                  <Building2 className="w-10 h-10 mb-6 text-primary-foreground/90" />
                  <h3 className="text-2xl font-bold mb-2">HCL Talent Care</h3>
                  <p className="text-primary-foreground/80 leading-relaxed">
                    Recognized as a Premier Training Hub for HCL's early career
                    programs. High emphasis on cloud and infrastructure services.
                  </p>
                </div>
                <div className="mt-8 flex justify-between items-end">
                  <span className="text-xs font-bold tracking-widest uppercase">
                    Verified Partner
                  </span>
                  <button className="bg-background text-brand px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-muted transition-colors">
                    View Letter
                  </button>
                </div>
              </div>

              <div className="bg-card rounded-[2rem] p-6 border border-border shadow-sm flex flex-col justify-between hover:-translate-y-1 transition-transform">
                <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center mb-6">
                  <BrainCircuit className="text-brand w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Cognizant</h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    Nurturing Excellence award for Digital Transformation readiness.
                  </p>
                </div>
                <button className="mt-6 text-brand text-xs font-bold flex items-center gap-1 group">
                  Details{" "}
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="bg-card rounded-[2rem] p-6 border border-border shadow-sm flex flex-col justify-between hover:-translate-y-1 transition-transform">
                <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center mb-6">
                  <Cloud className="text-brand w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Amazon AWS</h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    AWS Academy Member Institution for Cloud Curriculum
                    integration.
                  </p>
                </div>
                <button className="mt-6 text-brand text-xs font-bold flex items-center gap-1 group">
                  Details{" "}
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="md:col-span-1 bg-card rounded-[2rem] p-6 border border-border shadow-sm flex flex-col justify-between hover:-translate-y-1 transition-transform">
                <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center mb-6">
                  <PenTool className="text-brand w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Autodesk</h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    Authorized Training Center for Design & Innovation.
                  </p>
                </div>
                <button className="mt-6 text-brand text-xs font-bold flex items-center gap-1 group">
                  Details{" "}
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="md:col-span-3 bg-card p-8 rounded-[2rem] border border-border shadow-md flex flex-col sm:flex-row items-start sm:items-center gap-8">
                <div className="hidden sm:block shrink-0">
                  <div className="w-24 h-24 bg-brand/10 rounded-full flex items-center justify-center">
                    <Shield className="text-brand w-10 h-10" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    NPTEL Local Chapter
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Ranked among the top institutions in the region for
                    SWAYAM-NPTEL certification participation, fostering a culture
                    of self-paced digital learning.
                  </p>
                </div>
                <div className="shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
                  <button className="w-full bg-muted text-foreground px-6 py-4 rounded-xl font-bold hover:bg-border transition-colors border border-border/50">
                    Explore Data
                  </button>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
    <Footer/>
    </>
  );
}