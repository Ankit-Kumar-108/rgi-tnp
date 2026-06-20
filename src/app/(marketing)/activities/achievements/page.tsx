import React from "react";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BookOpen,
  Briefcase,
  Building2,
  ChevronRight,
  GraduationCap,
  Medal,
  Shield,
  Star,
  Trophy,
  Users,
  Zap,
  Globe,
  Target,
  Lightbulb,
  FileCheck,
} from "lucide-react";
import Footer from "@/components/layout/footer/footer";
import Nav from "@/components/layout/nav/nav";
import Image from "next/image";
import Link from "next/link";

export default function AchievementsPage() {
  const stats = [
    { value: "50+", label: "Awards Won", icon: Trophy },
    { value: "20+", label: "Years of Excellence", icon: Star },
    { value: "6", label: "Accredited Institutes", icon: Shield },
    { value: "15,000+", label: "Alumni Network", icon: Users },
  ];

  const majorAwards = [
    {
      title: "Prominent Leaders in Engineering, Medical & Pharmaceutical Education Excellence Award",
      awardedBy: "National Education Body",
      icon: Award,
      accent: "brand",
    },
    {
      title: "Fastest Emerging Institute Award",
      awardedBy: "Hon'ble Shri Shivraj Singh Chouhan, CM of Madhya Pradesh",
      icon: Zap,
      accent: "brand",
    },
    {
      title: "Best Placement Efforts Award",
      awardedBy: "Hon'ble Shri Uma Shankar Gupta, Home Minister of M.P.",
      icon: Briefcase,
      accent: "brand",
    },
    {
      title: "Vice Chancellor Award — 1st Position among all RGPV Institutes",
      awardedBy: "Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV), Bhopal",
      icon: GraduationCap,
      accent: "brand",
    },
    {
      title: "'A' Grade Institute Certification",
      awardedBy: "Hon'ble Justice Dwivedi Committee",
      icon: Shield,
      accent: "brand",
    },
    {
      title: "Best Institute for Campus Placement Award",
      awardedBy: "Technical Minister of Madhya Pradesh",
      icon: Target,
      accent: "brand",
    },
    {
      title: "Best Emerging Institute of Central India",
      awardedBy: "National-level Recognition",
      icon: Star,
      accent: "brand",
    },
    {
      title: "Most Preferred Institute in M.P. for Campus Placement",
      awardedBy: "Hon'ble Chief Minister of Madhya Pradesh",
      icon: Medal,
      accent: "brand",
    },
  ];

  const accreditations = [
    {
      name: "NBA",
      fullName: "National Board of Accreditation",
      desc: "Accredited programs falling under the ambit of Washington Accord (WA) for substantial equivalency of engineering programs globally.",
      icon: BadgeCheck,
    },
    {
      name: "AICTE",
      fullName: "All India Council for Technical Education",
      desc: "National-level apex advisory body conducting survey on technical education facilities. All engineering programs approved.",
      icon: Building2,
    },
    {
      name: "PCI",
      fullName: "Pharmacy Council of India",
      desc: "B.Pharmacy and M.Pharmacy programmes approved by PCI for both RIPS and RCP colleges.",
      icon: FileCheck,
    },
    {
      name: "ISO 9001:2008",
      fullName: "International Organization for Standardization",
      desc: "All five constituent colleges are ISO 9001:2008 certified for quality management systems.",
      icon: Shield,
    },
    {
      name: "NIRF",
      fullName: "National Institutional Ranking Framework",
      desc: "Participating in NIRF ranking across Engineering, Pharmacy, Management, and Overall categories since 2023.",
      icon: Trophy,
    },
    {
      name: "ARIIA",
      fullName: "Atal Ranking of Institutions on Innovation Achievements",
      desc: "Ranked in ARIIA 2020 for innovation achievements, recognizing entrepreneurship and startup ecosystem.",
      icon: Lightbulb,
    },
  ];

  const academicHighlights = [
    {
      title: "RGPV University Top 50",
      desc: "10 students consistently secure top positions in the university merit list across engineering and pharmacy programs.",
      badge: "University Rankers",
      icon: GraduationCap,
    },
    {
      title: "Consecutive Gold Medals",
      desc: "2 consecutive gold medals in Civil Engineering and Computer Science branches at RGPV university examinations.",
      badge: "Top Performers",
      icon: Medal,
    },
    {
      title: "Best Technical Campus",
      desc: "Awarded by the State Education Ministry as the best technical campus in Bhopal for academic infrastructure and outcomes.",
      badge: "State Certified",
      icon: Award,
    },
  ];

  const sportsAchievements = [
    {
      title: "Cricket — Zonal Champions",
      desc: "3 consecutive years undefeated in zonal cricket tournaments. Teams consistently ranked top in the university circuit.",
      icon: Trophy,
    },
    {
      title: "Taekwondo — National Level",
      desc: "National-level representation and podium finish in inter-university Taekwondo championships.",
      icon: Medal,
    },
    {
      title: "Athletics & Track Events",
      desc: "Multiple medals in RGPV inter-college athletics meet including 100m, 200m, relay, and long jump events.",
      icon: Star,
    },
    {
      title: "Basketball & Volleyball",
      desc: "Regular participation and winners in zonal and inter-college basketball and volleyball tournaments.",
      icon: Target,
    },
  ];

  return (
    <>
      <Nav />
      <div className="bg-background text-foreground antialiased font-sans">
        <main>
          {/* HERO SECTION */}
          <section className="relative min-h-[480px] md:min-h-[640px] flex items-end overflow-hidden bg-foreground mt-16 md:mt-20">
            {/* Background */}
            <div className="absolute inset-0">
              <img
                className="w-full h-full object-cover"
                alt="Achievements and Awards at Radharaman Group of Institutes"
                src="/images/archive1.png"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/55 to-slate-950/10"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 to-transparent"></div>
            </div>

            {/* Decorative */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand/10 blur-[150px] rounded-full"></div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 lg:px-20 w-full pb-32 md:pb-32">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-white/50 text-xs md:text-sm mb-6 md:mb-8">
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <Link
                  href="/activities"
                  className="hover:text-white transition-colors"
                >
                  Activities
                </Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-white/80">Achievements</span>
              </nav>

              <div className="max-w-3xl">
                <span className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full bg-brand/20 text-brand font-bold text-[10px] md:text-xs uppercase tracking-[0.15em] md:tracking-[0.2em] mb-4 md:mb-6 backdrop-blur-sm border border-brand/20">
                  <Trophy className="w-3.5 h-3.5" />
                  Awards & Recognition
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-white mb-4 md:mb-6 leading-[1.08]">
                  Achievements &<br />
                  <span className="text-brand">Milestones</span>
                </h1>
                <p className="text-sm md:text-xl text-white/60 leading-relaxed mb-6 md:mb-10 font-light max-w-2xl">
                  Two decades of relentless pursuit of excellence — recognized
                  by state governments, national bodies, and industry leaders
                  across India.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Link
                    href="/about/rgi"
                    className="w-full sm:w-auto"
                  >
                    <button className="bg-brand text-white px-8 py-3.5 rounded-full font-bold text-sm shadow-xl shadow-brand/30 flex items-center justify-center gap-2.5 group hover:opacity-90 transition-all cursor-pointer w-full sm:w-auto">
                      Explore RGI
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 duration-200 transition-transform" />
                    </button>
                  </Link>
                  <Link
                    href="/about/training-placement"
                    className="w-full sm:w-auto"
                  >
                    <button className="bg-white/10 backdrop-blur-sm text-white px-8 py-3.5 rounded-full font-bold text-sm border border-white/20 hover:bg-white/20 transition-all cursor-pointer w-full sm:w-auto text-center">
                      View Placements
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-white/[0.06] backdrop-blur-xl border-t border-white/10">
              <div className="max-w-7xl mx-auto px-3 md:px-8 lg:px-20">
                <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
                  {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <div
                        key={i}
                        className="py-3.5 md:py-6 px-2.5 md:px-8 flex items-center gap-2 md:gap-4"
                      >
                        <div className="w-10 h-10 rounded-lg bg-brand/20 flex items-center justify-center shrink-0 hidden md:flex">
                          <Icon className="w-5 h-5 text-brand" />
                        </div>
                        <div>
                          <div className="text-base md:text-2xl font-black text-white">
                            {stat.value}
                          </div>
                          <div className="text-[10px] md:text-xs text-white/50 font-medium">
                            {stat.label}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* AWARDS & RECOGNITION */}
          <section className="max-w-7xl mx-auto px-5 md:px-8 lg:px-20 py-14 md:py-28">
            <div className="text-center mb-10 md:mb-16">
              <div className="inline-flex items-center gap-2 bg-brand/10 text-brand px-4 py-1.5 rounded-full mb-4">
                <Award className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Recognition
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-3 md:mb-4">
                Awards & Recognition
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
                Honored by Chief Ministers, Home Ministers, Vice Chancellors, and
                national education bodies for academic, placement, and
                institutional excellence.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {majorAwards.map((award, i) => {
                const Icon = award.icon;
                return (
                  <div
                    key={i}
                    className="bg-card rounded-lg p-5 md:p-6 border border-border shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-300 hover:-translate-y-0.5 group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-brand/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-brand/10 transition-colors"></div>
                    <div className="relative z-10">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-brand/10 flex items-center justify-center mb-4 group-hover:bg-brand/20 transition-colors">
                        <Icon className="w-5 h-5 md:w-6 md:h-6 text-brand" />
                      </div>
                      <h3 className="text-sm md:text-base font-bold text-foreground mb-2 leading-snug">
                        {award.title}
                      </h3>
                      <p className="text-muted-foreground text-xs leading-relaxed">
                        {award.awardedBy}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chairman meets APJ Abdul Kalam highlight */}
            <div className="mt-8 md:mt-12 bg-muted rounded-lg  p-5 md:p-8 border border-border flex flex-col md:flex-row items-center gap-5 md:gap-8">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-lg bg-brand/10 flex items-center justify-center shrink-0">
                <Star className="w-7 h-7 md:w-8 md:h-8 text-brand" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold text-foreground mb-1">
                  Historic Meeting with Dr. APJ Abdul Kalam
                </h3>
                <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                  RGI Chairman Radharaman Saxena ji met with Dr. APJ Abdul
                  Kalam, Former President of India, recognizing the Group&apos;s
                  contribution to technical education in Central India.
                </p>
              </div>
            </div>
          </section>

          {/* ACCREDITATIONS & APPROVALS */}
          <section className="bg-muted">
            <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-20 py-14 md:py-28">
              <div className="text-center mb-10 md:mb-16">
                <div className="inline-flex items-center gap-2 bg-brand/10 text-brand px-4 py-1.5 rounded-full mb-4">
                  <Shield className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Accreditations
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-3 md:mb-4">
                  Accreditations & Approvals
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
                  Recognized by India&apos;s premier regulatory and
                  accreditation bodies for maintaining the highest standards of
                  academic quality.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {accreditations.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={i}
                      className="bg-card rounded-lg  p-5 md:p-8 border border-border shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-300 hover:-translate-y-0.5 group"
                    >
                      <div className="flex items-center gap-3 md:gap-4 mb-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-brand/10 flex items-center justify-center shrink-0 group-hover:bg-brand/20 transition-colors">
                          <Icon className="w-5 h-5 md:w-6 md:h-6 text-brand" />
                        </div>
                        <div>
                          <div className="text-lg md:text-xl font-black text-brand">
                            {item.name}
                          </div>
                          <div className="text-[10px] md:text-xs text-muted-foreground font-medium">
                            {item.fullName}
                          </div>
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

          {/* ACADEMIC EXCELLENCE */}
          <section className="max-w-7xl mx-auto px-5 md:px-8 lg:px-20 py-14 md:py-28">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
              {/* Text */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-1 bg-brand rounded-full"></div>
                  <span className="text-brand font-bold uppercase tracking-widest text-xs">
                    Academic Excellence
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-5 md:mb-6 leading-tight">
                  Where Merit{" "}
                  <span className="text-brand italic">Shines</span>
                </h2>
                <p className="text-muted-foreground text-sm md:text-base lg:text-lg leading-relaxed font-light mb-8">
                  Our students consistently demonstrate academic excellence at
                  the university and national level — securing top ranks, gold
                  medals, and institutional awards year after year.
                </p>

                <div className="space-y-4 md:space-y-5">
                  {academicHighlights.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={i}
                        className="bg-card rounded-lg  p-5 md:p-6 border border-border shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-300 group"
                      >
                        <div className="flex items-start gap-3 md:gap-4">
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-brand/10 flex items-center justify-center shrink-0 group-hover:bg-brand/20 transition-colors">
                            <Icon className="w-5 h-5 md:w-6 md:h-6 text-brand" />
                          </div>
                          <div>
                            <h3 className="text-sm md:text-base font-bold text-foreground mb-1">
                              {item.title}
                            </h3>
                            <p className="text-muted-foreground text-xs md:text-sm leading-relaxed mb-2">
                              {item.desc}
                            </p>
                            <span className="inline-block px-3 py-1 bg-brand/10 text-brand text-[10px] md:text-xs font-bold rounded-full">
                              {item.badge}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Image */}
              <div className="space-y-4">
                <div className="rounded-lg md:rounded-lg overflow-hidden relative h-56 sm:h-72 md:h-96 group">
                  <Image
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    alt="Academic achievements at RGI"
                    src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=2940&auto=format&fit=crop"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3 md:gap-4">
                  <div className="bg-brand rounded-lg  p-4 md:p-6 text-center">
                    <div className="text-xl md:text-3xl font-black text-white">
                      10+
                    </div>
                    <div className="text-white/70 text-[10px] md:text-xs font-medium">
                      University Rankers
                    </div>
                  </div>
                  <div className="bg-card rounded-lg  p-4 md:p-6 text-center border border-border shadow-[var(--shadow-sm)]">
                    <div className="text-xl md:text-3xl font-black text-brand">
                      2
                    </div>
                    <div className="text-muted-foreground text-[10px] md:text-xs font-medium">
                      Gold Medals
                    </div>
                  </div>
                  <div className="bg-card rounded-lg  p-4 md:p-6 text-center border border-border shadow-[var(--shadow-sm)]">
                    <div className="text-xl md:text-3xl font-black text-brand">
                      A
                    </div>
                    <div className="text-muted-foreground text-[10px] md:text-xs font-medium">
                      Grade Rating
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* VIHAN TECHNOFEST */}
          <section className="bg-brand/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand/10 via-transparent to-brand/5 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-20 py-14 md:py-28 relative z-10">
              <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                {/* Text */}
                <div>
                  <span className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full bg-brand/20 text-brand font-bold text-[10px] md:text-xs uppercase tracking-[0.15em] md:tracking-[0.2em] mb-4 md:mb-6 border border-brand/20">
                    <Zap className="w-3.5 h-3.5" />
                    Annual Flagship Event
                  </span>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-4 md:mb-6 leading-[1.08]">
                    VIHAN{" "}
                    <span className="text-brand italic">Technofest</span>
                  </h2>
                  <p className="text-foreground/80 text-sm md:text-lg leading-relaxed mb-6 md:mb-8 max-w-xl font-light">
                    Central India&apos;s biggest technofest — a fusion of
                    technology, innovation, and culture featuring robotics
                    competitions, workshops, hackathons, and live
                    performances at the RGI campus.
                  </p>

                  <div className="space-y-3 md:space-y-4 mb-8">
                    <div className="bg-card/80 border border-border rounded-lg p-4 md:p-5 flex items-center gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-brand/20 flex items-center justify-center shrink-0">
                        <Zap className="w-5 h-5 md:w-6 md:h-6 text-brand" />
                      </div>
                      <div>
                        <h4 className="text-foreground font-bold text-sm md:text-base">
                          50+ Interactive Projects & Events
                        </h4>
                        <p className="text-foreground/80 text-xs md:text-sm">
                          Innovation expo, technical quizzes, coding
                          competitions, and more.
                        </p>
                      </div>
                    </div>
                    <div className="bg-card/80 border border-border rounded-lg p-4 md:p-5 flex items-center gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-brand/20 flex items-center justify-center shrink-0">
                        <Users className="w-5 h-5 md:w-6 md:h-6 text-brand" />
                      </div>
                      <div>
                        <h4 className="text-foreground font-bold text-sm md:text-base">
                          1,500+ Participants Annually
                        </h4>
                        <p className="text-foreground/80 text-xs md:text-sm">
                          Students from colleges across M.P. compete and
                          collaborate.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <a
                      href="https://vihan-rgi.vercel.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto"
                    >
                      <button className="bg-brand text-white px-8 py-3.5 rounded-full font-bold text-sm shadow-xl shadow-brand/30 flex items-center justify-center gap-2.5 group hover:opacity-90 transition-all cursor-pointer w-full sm:w-auto">
                        Visit VIHAN {new Date().getFullYear()}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 duration-200 transition-transform" />
                      </button>
                    </a>
                    <a
                      href="https://vihan-rgi.vercel.app/register"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto"
                    >
                      <button className="bg-card text-foreground px-8 py-3.5 rounded-full font-bold text-sm border border-border shadow-[var(--shadow-sm)] hover:bg-card/80 transition-all cursor-pointer w-full sm:w-auto text-center">
                        Register Now
                      </button>
                    </a>
                  </div>
                </div>

                {/* Image Grid */}
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div className="space-y-3 md:space-y-4">
                    <div className="rounded-lg  overflow-hidden aspect-square shadow-lg">
                      <img
                        alt="VIHAN Technofest at RGI"
                        className="w-full h-full object-cover object-top"
                        src="/images/vihan1.png"
                      />
                    </div>
                    <div className="bg-brand rounded-lg  p-5 md:p-6 text-center">
                      <span className="text-2xl md:text-4xl font-black text-white block">
                        1.5k+
                      </span>
                      <span className="text-white/70 text-[10px] md:text-xs font-bold uppercase">
                        Participants
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3 md:space-y-4 pt-6 md:pt-10">
                    <div className="bg-card border border-border rounded-lg  p-5 md:p-6 text-center">
                      <span className="text-2xl md:text-4xl font-black text-brand block">
                        50+
                      </span>
                      <span className="text-foreground text-[10px] md:text-xs font-bold uppercase">
                        Events
                      </span>
                    </div>
                    <div className="rounded-lg  overflow-hidden aspect-[3/4] shadow-lg">
                      <img
                        alt="Cultural performance at VIHAN"
                        className="w-full h-full object-cover"
                        src="/images/vihan2.jpg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SPORTS & ATHLETICS */}
          <section className="max-w-7xl mx-auto px-5 md:px-8 lg:px-20 py-14 md:py-28">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              {/* Images */}
              <div className="grid grid-cols-2 gap-3 md:gap-4 order-2 lg:order-1">
                <div className="rounded-lg  overflow-hidden aspect-[4/5] shadow-[var(--shadow-md)]">
                  <img
                    alt="Basketball at RGI"
                    className="w-full h-full object-cover"
                    src="/images/basketball.png"
                  />
                </div>
                <div className="rounded-lg  overflow-hidden aspect-[4/5] shadow-[var(--shadow-md)] mt-6 md:mt-10">
                  <img
                    alt="Track & Field at RGI"
                    className="w-full h-full object-cover"
                    src="/images/cricket.png"
                  />
                </div>
              </div>

              {/* Text */}
              <div className="order-1 lg:order-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-1 bg-brand rounded-full"></div>
                  <span className="text-brand font-bold uppercase tracking-widest text-xs">
                    Sports & Athletics
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-5 md:mb-6 leading-tight">
                  Dominate the{" "}
                  <span className="text-brand italic">Field</span>
                </h2>
                <p className="text-muted-foreground text-sm md:text-base lg:text-lg leading-relaxed font-light mb-6 md:mb-8">
                  Physical grit meets mental resilience. Our teams are
                  consistently ranked top in zonal and national university
                  circuits across multiple sporting disciplines.
                </p>

                <div className="space-y-3 md:space-y-4">
                  {sportsAchievements.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={i}
                        className="bg-card rounded-lg  p-4 md:p-5 border border-border shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-300 flex items-start gap-3 md:gap-4 group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center shrink-0 group-hover:bg-brand/20 transition-colors">
                          <Icon className="w-5 h-5 text-brand" />
                        </div>
                        <div>
                          <h3 className="text-sm md:text-base font-bold text-foreground mb-0.5">
                            {item.title}
                          </h3>
                          <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* CTA BANNER */}
          <section className="max-w-7xl mx-auto px-5 md:px-8 lg:px-20 pb-14 md:pb-28">
            <div className="bg-brand rounded-lg md: p-6 md:p-16 relative overflow-hidden">
              {/* Decorative */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>

              <div className="relative z-10 grid md:grid-cols-2 gap-8 md:gap-10 items-center">
                <div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-3 md:mb-4 leading-tight">
                    Be Part of the Legacy
                  </h2>
                  <p className="text-white/70 text-sm md:text-lg leading-relaxed">
                    Join 15,000+ alumni who began their journey at Radharaman
                    Group of Institutes. Apply for admission or explore our
                    campus today.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 md:justify-end">
                  <Link href="/about/rgi" className="w-full sm:w-auto">
                    <button className="bg-white text-brand px-8 py-3.5 rounded-full font-bold text-sm shadow-xl hover:bg-white/90 transition-all flex items-center justify-center gap-2 group cursor-pointer w-full sm:w-auto">
                      Explore RGI
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                  <a
                    href="https://radharamanbhopal.com/radharaman/admission/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto"
                  >
                    <button className="bg-white/15 backdrop-blur-sm text-white px-8 py-3.5 rounded-full font-bold text-sm border border-white/20 hover:bg-white/25 transition-all cursor-pointer w-full sm:w-auto text-center">
                      Apply Now
                    </button>
                  </a>
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