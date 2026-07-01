import React from "react";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BookOpen,
  BrainCircuit,
  Building2,
  ChevronRight,
  Cloud,
  ExternalLink,
  FileCheck,
  GraduationCap,
  Handshake,
  PenTool,
  Shield,
  Star,
  TrendingUp,
  Users,
  Wrench,
} from "lucide-react";
import Nav from "@/components/layout/nav/nav";
import Footer from "@/components/layout/footer/footer";
import Image from "next/image";
import Link from "next/link";

export default function CertificatesPage() {
  const stats = [
    { value: "6+", label: "National Accreditations" },
    { value: "ISO 9001", label: "Quality Certified" },
    { value: "10+", label: "Corporate Endorsements" },
    { value: "RGPV", label: "Affiliated University" },
  ];

  const accreditations = [
    {
      name: "ISO 9001:2008",
      body: "International Organization for Standardization",
      desc: "All five constituent colleges are ISO 9001:2008 certified for quality management systems, ensuring excellence in educational delivery and administrative processes.",
      icon: Shield,
    },
    {
      name: "RGPV Affiliation",
      body: "Rajiv Gandhi Proudyogiki Vishwavidyalaya, Bhopal",
      desc: "Permanently affiliated to RGPV for all major engineering disciplines including CS, ME, CE, EE, and EC across RITS and REC.",
      icon: GraduationCap,
    },
    {
      name: "AICTE Approval",
      body: "All India Council for Technical Education, New Delhi",
      desc: "National-level apex advisory body approval for technical education. All UG and PG engineering programs are AICTE-approved.",
      icon: Building2,
    },
    {
      name: "NBA Accreditation",
      body: "National Board of Accreditation, New Delhi",
      desc: "Accredited programs falling under the ambit of Washington Accord (WA), ensuring substantial equivalency of engineering programs globally.",
      icon: BadgeCheck,
    },
    {
      name: "PCI Approval",
      body: "Pharmacy Council of India",
      desc: "B.Pharmacy and M.Pharmacy programmes approved by PCI for both RIPS and RCP colleges with full compliance.",
      icon: FileCheck,
    },
    {
      name: "ACEN Recognition",
      body: "Accreditation Commission for Education in Nursing",
      desc: "Recognized as the accrediting body for nursing education programs offered at Radharaman Institute of Nursing (RIN).",
      icon: BookOpen,
    },
  ];

  const corporateEndorsements = [
    {
      name: "HCL Talent Care",
      desc: "Recognized as a Premier Training Hub for HCL's early career programs with emphasis on cloud and infrastructure services.",
      badge: "Verified Partner",
      icon: Building2,
      featured: true,
    },
    {
      name: "Cognizant",
      desc: "Nurturing Excellence award for Digital Transformation readiness and industry-aligned curriculum.",
      badge: "Excellence Award",
      icon: BrainCircuit,
    },
    {
      name: "Amazon AWS",
      desc: "AWS Academy Member Institution for Cloud Curriculum integration and student certification programs.",
      badge: "Academy Member",
      icon: Cloud,
    },
    {
      name: "Autodesk",
      desc: "Authorized Training Center for Design & Innovation tools used across Civil and Mechanical engineering.",
      badge: "Training Center",
      icon: PenTool,
    },
    {
      name: "NPTEL Local Chapter",
      desc: "Ranked among top institutions in the region for SWAYAM-NPTEL certification participation, fostering digital learning.",
      badge: "Top Chapter",
      icon: BookOpen,
    },
  ];

  return (
    <>
      <Nav />
      <div className="bg-background text-foreground antialiased font-sans">
        <main>
          {/* HERO SECTION */}
          <section className="relative min-h-[480px] md:min-h-[640px] flex items-end overflow-hidden bg-foreground mt-20">
            <div className="absolute inset-0">
              <img
                className="w-full h-full object-cover"
                alt="Professional accreditations and certificates"
                src="/images/archive2.png"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/55 to-slate-950/10"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 to-transparent"></div>
            </div>

            <div className="absolute top-0 right-0 w-80 h-80 bg-brand/10 blur-[150px] rounded-full"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 lg:px-20 w-full pb-32 md:pb-32">
              <nav className="flex items-center gap-2 text-white/50 text-xs md:text-sm mb-6 md:mb-8">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <Link href="/activities" className="hover:text-white transition-colors">Activities</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-white/80">Certificates</span>
              </nav>

              <div className="max-w-3xl">
                <span className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full bg-brand/20 text-brand font-bold text-[10px] md:text-xs uppercase tracking-[0.15em] md:tracking-[0.2em] mb-4 md:mb-6 backdrop-blur-sm border border-brand/20">
                  <Shield className="w-3.5 h-3.5" />
                  Quality Assurance
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-white mb-4 md:mb-6 leading-[1.08]">
                  Accreditations &<br />
                  <span className="text-brand">Certifications</span>
                </h1>
                <p className="text-sm md:text-xl text-white/60 leading-relaxed mb-6 md:mb-10 font-light max-w-2xl">
                  Maintaining the highest standards of technical education through
                  rigorous national quality audits and strategic corporate
                  partnerships.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Link href="/about/rgi" className="w-full sm:w-auto">
                    <button className="bg-brand text-white px-8 py-3.5 rounded-full font-bold text-sm shadow-xl shadow-brand/30 flex items-center justify-center gap-2.5 group hover:opacity-90 transition-all cursor-pointer w-full sm:w-auto">
                      Explore RGI
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 duration-200 transition-transform" />
                    </button>
                  </Link>
                  <Link href="/activities/achievements" className="w-full sm:w-auto">
                    <button className="bg-white/10 backdrop-blur-sm text-white px-8 py-3.5 rounded-full font-bold text-sm border border-white/20 hover:bg-white/20 transition-all cursor-pointer w-full sm:w-auto text-center">
                      View Achievements
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-white/[0.06] backdrop-blur-xl border-t border-white/10">
              <div className="max-w-7xl mx-auto px-3 md:px-8 lg:px-20">
                <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
                  {stats.map((stat, i) => (
                    <div key={i} className="py-3.5 md:py-6 px-2.5 md:px-8">
                      <div className="text-base md:text-2xl font-black text-white">{stat.value}</div>
                      <div className="text-[10px] md:text-xs text-white/50 font-medium">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* FEATURED: TCS RECOGNITION */}
          <section className="max-w-7xl mx-auto px-5 md:px-8 lg:px-20 py-14 md:py-28">
            <div className="text-center mb-10 md:mb-16">
              <div className="inline-flex items-center gap-2 bg-brand/10 text-brand px-4 py-1.5 rounded-full mb-4">
                <Star className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Premier Recognition</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-3 md:mb-4">
                Featured Achievement
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center bg-card rounded-lg md:rounded-lg p-5 md:p-10 border border-border shadow-[var(--shadow-md)]">
              <div className="relative group rounded-lg overflow-hidden h-52 sm:h-64 md:h-80">
                <Image
                  alt="Certificate of Appreciation from TCS"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  src="https://images.unsplash.com/photo-1589330694653-afa59f4710dd?q=80&w=2940&auto=format&fit=crop"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 bg-background/90 backdrop-blur-md p-2.5 md:p-3 rounded-lg border border-border shadow-sm">
                  <BadgeCheck className="text-brand w-6 h-6 md:w-8 md:h-8" />
                </div>
              </div>
              <div className="space-y-4 md:space-y-6">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand/10 text-brand font-semibold text-xs md:text-sm">
                  <Star className="w-4 h-4" />
                  Corporate Excellence Award
                </span>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-foreground leading-tight">
                  Certificate of Appreciation:{" "}
                  <span className="text-brand">Tata Consultancy Services</span>
                </h3>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                  A testament to our enduring commitment to industry-aligned pedagogy.
                  TCS recognizes RGI for outstanding contribution to the talent
                  ecosystem and consistent delivery of high-caliber engineering
                  professionals.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center gap-3 p-3.5 md:p-4 bg-muted rounded-lg border border-border/50">
                    <Handshake className="text-brand w-5 h-5 md:w-6 md:h-6 shrink-0" />
                    <span className="text-xs md:text-sm font-medium">Strategic Academic Partner</span>
                  </div>
                  <div className="flex items-center gap-3 p-3.5 md:p-4 bg-muted rounded-lg border border-border/50">
                    <Award className="text-brand w-5 h-5 md:w-6 md:h-6 shrink-0" />
                    <span className="text-xs md:text-sm font-medium">Tier-1 Placement Priority</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* INSTITUTIONAL ACCREDITATIONS */}
          <section className="bg-muted">
            <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-20 py-14 md:py-28">
              <div className="text-center mb-10 md:mb-16">
                <div className="inline-flex items-center gap-2 bg-brand/10 text-brand px-4 py-1.5 rounded-full mb-4">
                  <BadgeCheck className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Compliance</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-3 md:mb-4">
                  Institutional Accreditations
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
                  Recognized by India&apos;s premier regulatory bodies for maintaining
                  the highest standards of academic quality and institutional governance.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {accreditations.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={i}
                      className="bg-card rounded-lg p-5 md:p-8 border border-border shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-300 hover:-translate-y-0.5 group"
                    >
                      <div className="flex items-center gap-3 md:gap-4 mb-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-brand/10 flex items-center justify-center shrink-0 group-hover:bg-brand/20 transition-colors">
                          <Icon className="w-5 h-5 md:w-6 md:h-6 text-brand" />
                        </div>
                        <div>
                          <div className="text-lg md:text-xl font-black text-brand">{item.name}</div>
                          <div className="text-[10px] md:text-xs text-muted-foreground font-medium leading-tight">{item.body}</div>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* CORPORATE ENDORSEMENTS */}
          <section className="max-w-7xl mx-auto px-5 md:px-8 lg:px-20 py-14 md:py-28">
            <div className="text-center mb-10 md:mb-16">
              <div className="inline-flex items-center gap-2 bg-brand/10 text-brand px-4 py-1.5 rounded-full mb-4">
                <Handshake className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Endorsements</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-3 md:mb-4">
                Corporate Endorsements
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
                Leading global corporations recognize RGI as a premier institution
                for talent development and industry-aligned education.
              </p>
            </div>

            {/* Featured HCL Card */}
            <div className="bg-brand rounded-lg p-5 md:p-10 mb-4 md:mb-6 relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="relative z-10 grid md:grid-cols-2 gap-6 md:gap-8 items-center">
                <div>
                  <Building2 className="w-8 h-8 md:w-10 md:h-10 text-white/80 mb-4 md:mb-6" />
                  <h3 className="text-xl md:text-2xl font-black text-white mb-2">HCL Talent Care</h3>
                  <p className="text-white/70 text-sm md:text-base leading-relaxed">
                    Recognized as a Premier Training Hub for HCL&apos;s early career
                    programs. High emphasis on cloud and infrastructure services.
                  </p>
                </div>
                <div className="flex items-center justify-between md:justify-end gap-4">
                  <span className="text-white/60 text-xs font-bold tracking-widest uppercase">
                    Verified Partner
                  </span>
                  <button className="bg-white text-brand px-5 md:px-6 py-2.5 md:py-3 rounded-lg text-xs md:text-sm font-bold hover:bg-white/90 transition-colors cursor-pointer">
                    View Letter
                  </button>
                </div>
              </div>
            </div>

            {/* Other Endorsements Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {corporateEndorsements.filter(e => !e.featured).map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className="bg-card rounded-lg p-5 md:p-6 border border-border shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-300 hover:-translate-y-0.5 group flex flex-col"
                  >
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-brand/10 flex items-center justify-center mb-4 group-hover:bg-brand/20 transition-colors">
                      <Icon className="w-5 h-5 md:w-6 md:h-6 text-brand" />
                    </div>
                    <h3 className="text-sm md:text-base font-bold text-foreground mb-1">{item.name}</h3>
                    <span className="inline-block px-2.5 py-1 bg-brand/10 text-brand text-[10px] font-bold rounded-full mb-3 w-fit">
                      {item.badge}
                    </span>
                    <p className="text-muted-foreground text-xs leading-relaxed flex-1">{item.desc}</p>
                    <button className="mt-4 text-brand text-xs font-bold flex items-center gap-1.5 group/btn cursor-pointer">
                      Details
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          {/* IMPACT SECTION */}
          <section className="bg-brand/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand/10 via-transparent to-brand/5 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-20 py-14 md:py-28 relative z-10">
              <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                <div className="relative">
                  <div className="rounded-lg md:rounded-lg overflow-hidden relative h-56 sm:h-72 md:h-96">
                    <Image
                      className="object-cover"
                      alt="Students collaborating at RGI campus"
                      src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2940&auto=format&fit=crop"
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                  <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 bg-brand p-5 md:p-8 rounded-lg shadow-xl z-20">
                    <div className="text-2xl md:text-4xl font-black text-white">10+</div>
                    <div className="text-white/80 font-bold text-[10px] md:text-sm tracking-widest uppercase mt-0.5 md:mt-1">Active Alliances</div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-1 bg-brand rounded-full"></div>
                    <span className="text-brand font-bold uppercase tracking-widest text-xs">Impact</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-5 md:mb-6 leading-tight">
                    Empowering Student <span className="text-brand italic">Careers</span>
                  </h2>

                  <div className="space-y-4 md:space-y-6">
                    {[
                      {
                        icon: Wrench,
                        title: "Direct Industry Exposure",
                        desc: "Regular visits, expert sessions, and immersion programs with our Tier-1 corporate partners.",
                      },
                      {
                        icon: Award,
                        title: "Certified Training Programs",
                        desc: "Integrated curriculum tracks that provide industry-recognized certifications along with degrees.",
                      },
                      {
                        icon: TrendingUp,
                        title: "Enhanced Placement Odds",
                        desc: "Exclusive pre-placement offers and interview waivers for top-performing students in partner projects.",
                      },
                    ].map((item, i) => {
                      const Icon = item.icon;
                      return (
                        <div key={i} className="flex items-start gap-3 md:gap-4">
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-brand/20 flex items-center justify-center shrink-0">
                            <Icon className="w-5 h-5 md:w-6 md:h-6 text-brand" />
                          </div>
                          <div>
                            <h4 className="text-sm md:text-lg font-bold text-foreground mb-1">{item.title}</h4>
                            <p className="text-muted-foreground/50 text-xs md:text-sm leading-relaxed">{item.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA BANNER */}
          <section className="max-w-7xl mx-auto px-5 md:px-8 lg:px-20 py-14 md:py-28">
            <div className="bg-brand rounded-lg p-6 md:p-16 relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>

              <div className="relative z-10 grid md:grid-cols-2 gap-8 md:gap-10 items-center">
                <div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-3 md:mb-4 leading-tight">
                    Partner With RGI
                  </h2>
                  <p className="text-white/70 text-sm md:text-lg leading-relaxed">
                    Join our elite network of industry leaders and help shape the
                    next generation of professional talent from Central India.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 md:justify-end">
                  <a
                    href="https://radharamanbhopal.com/radharaman/contact-us/index.php"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto"
                  >
                    <button className="bg-white text-brand px-8 py-3.5 rounded-full font-bold text-sm shadow-xl hover:bg-white/90 transition-all flex items-center justify-center gap-2 group cursor-pointer w-full sm:w-auto">
                      Contact T&P Cell
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </a>
                  <Link href="/about/training-placement" className="w-full sm:w-auto">
                    <button className="bg-white/15 backdrop-blur-sm text-white px-8 py-3.5 rounded-full font-bold text-sm border border-white/20 hover:bg-white/25 transition-all cursor-pointer w-full sm:w-auto text-center">
                      View Placements
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}