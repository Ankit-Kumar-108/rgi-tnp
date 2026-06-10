import React from "react";
import {
  ArrowRight,
  BadgeCheck,
  ChevronRight,
  Briefcase,
  Users,
  GraduationCap,
  TrendingUp,
  Building2,
  BookOpen,
  Handshake,
  MessageSquareQuote,
  Target,
  ClipboardCheck,
  Megaphone,
  Globe,
  Lightbulb,
  Award,
  Phone,
} from "lucide-react";
import Nav from "@/components/layout/nav/nav";
import Footer from "@/components/layout/footer/footer";
import Image from "next/image";
import Link from "next/link";

export default function TrainingPlacementAbout() {
  const stats = [
    { value: "500+", label: "Recruiting Companies", icon: Building2 },
    { value: "₹47.61L", label: "Highest Package", icon: TrendingUp },
    { value: "85%+", label: "Placement Rate", icon: BadgeCheck },
    { value: "20+", label: "Years of T&P", icon: Briefcase },
  ];

  const highlights = [
    {
      company: "ServiceNow",
      package: "₹47.61 LPA",
    },
    {
      company: "ServiceNow",
      package: "₹42.87 LPA",
    },
    {
      company: "Juspay",
      package: "₹27 LPA",
    },
    {
      company: "Catalogic",
      package: "₹25 LPA",
    },
    {
      company: "Silicon Labs",
      package: "₹24.17 LPA",
    },
    {
      company: "Juspay",
      package: "₹21 LPA",
    },
    {
      company: "Trident Group",
      package: "₹18 LPA",
    },
    {
      company: "Amadeus",
      package: "₹12.62 LPA",
    },
  ];

  const activities = [
    {
      icon: ClipboardCheck,
      title: "Aptitude & Mock Tests",
      desc: "Regular aptitude assessments and mock interviews to sharpen problem-solving skills and build interview confidence.",
    },
    {
      icon: Megaphone,
      title: "Soft Skills & Communication",
      desc: "In-house trainers conduct workshops on spoken English, technical communication, and interpersonal skills.",
    },
    {
      icon: BookOpen,
      title: '"Crack the Campus" Program',
      desc: "Integrated training program for 1st & 2nd year students merged with curriculum — preparing students from day one.",
    },
    {
      icon: Globe,
      title: "Competitive Exam Coaching",
      desc: "Dedicated coaching for GATE, GRE, GMAT, TOEFL, DRDO, ISRO, and other national-level competitive exams.",
    },
    {
      icon: Building2,
      title: "Industrial Visits & Expert Lectures",
      desc: "Frequent visits to companies in and around Bhopal, supplemented by expert guest lectures from industry leaders.",
    },
    {
      icon: Lightbulb,
      title: "Entrepreneurship Awareness",
      desc: "Annual camps under State Government guidance to explore small & medium scale industry opportunities and consultancy.",
    },
  ];

  const corporateTieups = [
    "DRDO",
    "NTPC",
    "BHEL",
    "Doordarshan",
    "TIFR",
    "BSNL",
    "Indian Railways",
    "Essar Group",
    "Heidelberg",
    "Crompton & Greaves",
    "Gammon India",
    "Fedders Lloyd",
  ];

  const techPartners = [
    {
      name: "Google",
      desc: "Android & Digital Programming certifications",
    },
    {
      name: "Microsoft",
      desc: "Microsoft certifications & ventures",
    },
    {
      name: "Intel",
      desc: "Cloud computing, data centres & FPGA training",
    },
    {
      name: "Informatica",
      desc: "University Training Program with courses & materials",
    },
  ];

  return (
    <>
      <Nav />
      <div className="bg-background text-foreground antialiased font-sans">
        <main>
          {/* HERO SECTION */}
          <section className="relative min-h-[480px] md:min-h-[640px] flex items-end overflow-hidden bg-foreground mt-20 md:mt-20">
            {/* Background */}
            <div className="absolute inset-0">
              <img
                className="w-full h-full object-cover"
                alt="Training and Placement Cell at Radharaman Group of Institutes"
                src="/images/tnp-conference-hall.jpeg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/30"></div>
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
                <span className="text-white/80">
                  Training & Placement
                </span>
              </nav>

              <div className="max-w-3xl">
                <span className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full bg-brand/20 text-brand font-bold text-[10px] md:text-xs uppercase tracking-[0.15em] md:tracking-[0.2em] mb-4 md:mb-6 backdrop-blur-sm border border-brand/20">
                  <Briefcase className="w-3.5 h-3.5" />
                  Since 2005
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-white mb-4 md:mb-6 leading-[1.08]">
                  Training &<br />
                  <span className="text-brand">Placement Cell</span>
                </h1>
                <p className="text-sm md:text-xl text-white/60 leading-relaxed mb-6 md:mb-10 font-light max-w-2xl">
                  Bridging the gap between academic brilliance and global
                  corporate requirements — we don&apos;t just place students,
                  we architect careers.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Link href="/recruiters/register" className="w-full sm:w-auto">
                    <button className="bg-brand text-white px-8 py-3.5 rounded-full font-bold text-sm shadow-xl shadow-brand/30 flex items-center justify-center gap-2.5 group hover:opacity-90 transition-all cursor-pointer w-full sm:w-auto">
                      Hire from Us
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 duration-200 transition-transform" />
                    </button>
                  </Link>
                  <Link href="/students/login" className="w-full sm:w-auto">
                    <button className="bg-white/10 backdrop-blur-sm text-white px-8 py-3.5 rounded-full font-bold text-sm border border-white/20 hover:bg-white/20 transition-all cursor-pointer w-full sm:w-auto text-center">
                      Student Portal
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

          {/* ABOUT THE T&P CELL */}
          <section className="max-w-7xl mx-auto px-5 md:px-8 lg:px-20 py-14 md:py-28">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Text */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-1 bg-brand rounded-full"></div>
                  <span className="text-brand font-bold uppercase tracking-widest text-xs">
                    About the Cell
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-5 md:mb-6 leading-tight">
                  Where{" "}
                  <span className="text-brand italic">Ability</span> Meets
                  Opportunity
                </h2>
                <div className="space-y-4 md:space-y-5 text-muted-foreground leading-relaxed text-sm md:text-base lg:text-lg font-light">
                  <p>
                    We at RGI believe in combining four facets that together
                    spell <strong className="text-foreground">SUCCESS</strong>{" "}
                    —{" "}
                    <span className="text-foreground font-semibold">
                      Ability, Motivation, and Attitude
                    </span>
                    . With this belief, the Department of Training & Placement
                    came into existence in{" "}
                    <span className="text-foreground font-semibold">2005</span>{" "}
                    for providing industrial training to our first batch of
                    students.
                  </p>
                  <p>
                    A dedicated team of in-house trainers regularly trains
                    students on Aptitude, Technical Communication, Spoken
                    English, Soft Skills, and other critical skill sets required
                    to excel in the corporate world.
                  </p>
                  <p>
                    We are the only institute in Bhopal that strongly emphasizes
                    training imparted to students alongside placements, providing
                    opportunities at leading multinational companies for
                    engineering, pharmacy, diploma, and management graduates.
                  </p>
                </div>
              </div>

              {/* Image + CTA Card */}
              <div className="space-y-4">
                <div className="rounded-lg overflow-hidden relative h-56 sm:h-72 md:h-96 group">
                  <Image
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    alt="T&P Conference hall at RGI"
                    src="/images/tnp-conference-hall.jpeg"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <div className="bg-brand rounded-lg p-6 md:p-8 relative overflow-hidden">
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="relative z-10">
                    <h4 className="text-lg font-bold text-white mb-2">
                      For Recruiters & Corporates
                    </h4>
                    <p className="text-white/70 text-sm mb-4 leading-relaxed">
                      Schedule campus recruitment drives and hire top-tier
                      talent from 7 specialized institutions.
                    </p>
                    <Link href="/recruiters/register">
                      <button className="w-full bg-white text-brand py-3 rounded-lg font-bold text-sm hover:bg-white/90 transition-colors cursor-pointer">
                        Register as Recruiter
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* LEADERSHIP SECTION */}
          <section className="bg-muted">
            <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-20 py-14 md:py-28">
              <div className="text-center mb-10 md:mb-16">
                <div className="inline-flex items-center gap-2 bg-brand/10 text-brand px-4 py-1.5 rounded-full mb-4">
                  <Users className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Leadership
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-3 md:mb-4">
                  The Minds Behind Your Career
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
                  Meet the leadership driving our students towards
                  industry-leading careers.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
                {/* Director */}
                <div className="bg-card rounded-lg overflow-hidden border border-border shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300 group">
                  <div className="relative h-56 sm:h-72 md:h-80 overflow-hidden">
                    <Image
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                      alt="James Kuttappan, Director Training & Placement"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIBYviOOWoEn1D6xTyYMluquzqttL4SCoQ8YTdPoSTTNYQLCqya8DiCAs66JmTJiHyRmHxUpVjA4GCYy4fhForyUeFzidpP8yNMIkHu_oaQRp9Krmp-Gz1K9nwFA-4vEgEubQQch8uCbxjl-ImtNgvWcFKvMoDY-gPzvpkp5HvSUSDe_vCwfaHUk_I7xlMHmS6Z4yoMHaYo8erwwh2Y4C_p5eHMCF4UEtWfpnKSjQrYRwDmJRAQhUxaICeli4FyMR5td48o8_nWg"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      referrerPolicy="no-referrer"
                      unoptimized={true}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-6">
                      <span className="inline-flex items-center gap-1.5 bg-brand/90 text-white px-3 py-1 rounded-full text-xs font-bold">
                        <Briefcase className="w-3 h-3" />
                        Director
                      </span>
                    </div>
                  </div>
                  <div className="p-5 md:p-8">
                    <h3 className="text-xl md:text-2xl font-black text-foreground mb-1">
                      James Kuttappan
                    </h3>
                    <p className="text-brand font-semibold text-sm mb-4">
                      Director, Training & Placement
                    </p>
                    <div className="relative pl-5 border-l-2 border-brand/30">
                      <MessageSquareQuote className="w-5 h-5 text-brand/40 absolute -left-3 -top-0.5 bg-card" />
                      <p className="text-muted-foreground text-sm leading-relaxed italic">
                        &ldquo;Welcome to the gateway of professional
                        excellence. At Radharaman Group, our commitment is to
                        bridge the gap between academic brilliance and global
                        corporate requirements. We don&apos;t just place
                        students — we architect careers.&rdquo;
                      </p>
                    </div>
                  </div>
                </div>

                {/* Deputy Director */}
                <div className="bg-card rounded-lg overflow-hidden border border-border shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300 group">
                  <div className="relative h-56 sm:h-72 md:h-80 overflow-hidden">
                    <Image
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                      alt="Robin P. Samuel, Dy. Director Training & Placement"
                      src="/images/Robin.P.Samuel.png"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-6">
                      <span className="inline-flex items-center gap-1.5 bg-brand/90 text-white px-3 py-1 rounded-full text-xs font-bold">
                        <Briefcase className="w-3 h-3" />
                        Dy. Director
                      </span>
                    </div>
                  </div>
                  <div className="p-5 md:p-8">
                    <h3 className="text-xl md:text-2xl font-black text-foreground mb-1">
                      Robin P. Samuel
                    </h3>
                    <p className="text-brand font-semibold text-sm mb-4">
                      Dy. Director, Training & Placement
                    </p>
                    <div className="relative pl-5 border-l-2 border-brand/30">
                      <MessageSquareQuote className="w-5 h-5 text-brand/40 absolute -left-3 -top-0.5 bg-card" />
                      <p className="text-muted-foreground text-sm leading-relaxed italic">
                        &ldquo;Our focus is on holistic development. Through
                        rigorous aptitude training, soft skills workshops, and
                        technical certifications, we ensure our graduates are
                        not just job-ready, but industry-leading.&rdquo;
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* TRAINING ACTIVITIES */}
          <section className="max-w-7xl mx-auto px-5 md:px-8 lg:px-20 py-14 md:py-28">
            <div className="text-center mb-10 md:mb-16">
              <div className="inline-flex items-center gap-2 bg-brand/10 text-brand px-4 py-1.5 rounded-full mb-4">
                <GraduationCap className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  What We Do
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-3 md:mb-4">
                Training & Activities
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
                A comprehensive training ecosystem designed to carve our
                students&apos; unique niche in today&apos;s competitive
                corporate world.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {activities.map((activity, i) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={i}
                    className="bg-card rounded-lg p-5 md:p-8 border border-border shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-300 hover:-translate-y-0.5 group"
                  >
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-brand/10 flex items-center justify-center mb-4 md:mb-5 group-hover:bg-brand/20 transition-colors">
                      <Icon className="w-5 h-5 md:w-6 md:h-6 text-brand" />
                    </div>
                    <h3 className="text-base md:text-lg font-bold text-foreground mb-1.5 md:mb-2">
                      {activity.title}
                    </h3>
                    <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                      {activity.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* TOP PLACEMENTS HIGHLIGHTS */}
          <section className="bg-brand/5">
            <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-20 py-14 md:py-28">
              <div className="text-center mb-10 md:mb-16">
                <div className="inline-flex items-center gap-2 bg-brand/10 text-brand px-4 py-1.5 rounded-full mb-4">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Record-Breaking
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-3 md:mb-4">
                  Top Placement Packages
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
                  Our students consistently secure prestigious packages at
                  leading global companies.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-5">
                {highlights.map((item, i) => (
                  <div
                    key={i}
                    className="bg-card rounded-lg p-3.5 md:p-6 border border-border shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-300 hover:-translate-y-0.5 text-center group"
                  >
                    <div className="text-lg sm:text-2xl md:text-3xl font-black text-brand mb-1.5 md:mb-2 group-hover:scale-110 transition-transform">
                      {item.package}
                    </div>
                    <div className="h-px bg-brand/10 mb-3"></div>
                    <div className="text-xs md:text-base font-bold text-foreground">
                      {item.company}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-10">
                <Link href="/open-drives">
                  <button className="text-brand font-bold text-sm flex items-center gap-2 mx-auto hover:gap-3 transition-all cursor-pointer">
                    View All Placement Drives
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
          </section>

          {/* CORPORATE TIE-UPS + TECH PARTNERS */}
          <section className="max-w-7xl mx-auto px-5 md:px-8 lg:px-20 py-14 md:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
              {/* Corporate Tie-Ups */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-1 bg-brand rounded-full"></div>
                  <span className="text-brand font-bold uppercase tracking-widest text-xs">
                    Industrial Training
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground mb-3 md:mb-4 leading-tight">
                  Corporate Tie-Ups
                </h2>
                <p className="text-muted-foreground text-sm md:text-base mb-8 leading-relaxed">
                  We have established corporate partnerships for industrial
                  training with some of India&apos;s most prestigious
                  organizations:
                </p>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {corporateTieups.map((name, i) => (
                    <span
                      key={i}
                      className="bg-muted text-foreground text-xs md:text-sm font-semibold px-4 py-2 rounded-full border border-border hover:border-brand/30 hover:bg-brand/5 transition-all cursor-default"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Technology Partners */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-1 bg-brand rounded-full"></div>
                  <span className="text-brand font-bold uppercase tracking-widest text-xs">
                    Global Partners
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground mb-3 md:mb-4 leading-tight">
                  Technology Partners
                </h2>
                <p className="text-muted-foreground text-sm md:text-base mb-8 leading-relaxed">
                  World-leading technology companies providing certifications
                  and specialized training to our students:
                </p>
                <div className="space-y-3 md:space-y-4">
                  {techPartners.map((partner, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-4 bg-card rounded-lg p-4 md:p-5 border border-border shadow-[var(--shadow-xs)] hover:shadow-[var(--shadow-sm)] transition-all group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center shrink-0 group-hover:bg-brand/20 transition-colors">
                        <Handshake className="w-5 h-5 text-brand" />
                      </div>
                      <div>
                        <div className="font-bold text-foreground text-sm md:text-base">
                          {partner.name}
                        </div>
                        <div className="text-muted-foreground text-xs md:text-sm">
                          {partner.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* T&P PROCESS / HOW IT WORKS */}
          <section className="bg-muted">
            <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-20 py-14 md:py-28">
              <div className="text-center mb-10 md:mb-16">
                <div className="inline-flex items-center gap-2 bg-brand/10 text-brand px-4 py-1.5 rounded-full mb-4">
                  <Target className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    The Process
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-3 md:mb-4">
                  From Campus to Career
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
                  A structured, four-step approach ensuring every student is
                  industry-ready upon graduation.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[
                  {
                    step: "01",
                    title: "Skill Assessment",
                    desc: "Evaluate each student's aptitude, technical proficiency, and career aspirations through comprehensive assessments.",
                    icon: ClipboardCheck,
                  },
                  {
                    step: "02",
                    title: "Intensive Training",
                    desc: "Targeted skill-building through our 'Crack the Campus' program, language labs, mock interviews, and workshops.",
                    icon: GraduationCap,
                  },
                  {
                    step: "03",
                    title: "Industry Exposure",
                    desc: "Industrial visits, expert lectures, internships with top companies, and hands-on project experience.",
                    icon: Building2,
                  },
                  {
                    step: "04",
                    title: "Campus Placement",
                    desc: "On-campus and off-campus recruitment drives connecting students directly with 500+ hiring companies.",
                    icon: Award,
                  },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={i}
                      className="bg-card rounded-lg p-5 md:p-8 border border-border shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-300 hover:-translate-y-0.5 relative group"
                    >
                      <div className="text-5xl md:text-6xl font-black text-brand/10 absolute top-4 right-5 group-hover:text-brand/20 transition-colors">
                        {item.step}
                      </div>
                      <div className="w-12 h-12 rounded-lg bg-brand/10 flex items-center justify-center mb-5 group-hover:bg-brand/20 transition-colors">
                        <Icon className="w-6 h-6 text-brand" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* COUNSELING SERVICES */}
          <section className="max-w-7xl mx-auto px-5 md:px-8 lg:px-20 py-14 md:py-28">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-1 bg-brand rounded-full"></div>
                  <span className="text-brand font-bold uppercase tracking-widest text-xs">
                    Beyond Placements
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-5 md:mb-6 leading-tight">
                  Career <span className="text-brand">Counseling</span> &
                  Guidance
                </h2>
                <p className="text-muted-foreground text-sm md:text-base lg:text-lg leading-relaxed font-light mb-6 md:mb-8">
                  The T&P department goes beyond placement — providing
                  holistic career counseling to help every student discover
                  the path best suited to their talent and aspirations.
                </p>
                <ul className="space-y-4">
                  {[
                    "Higher Education Abroad — guidance for MS, MBA, and PhD admissions globally",
                    "Public Sector & Defence — coaching for UPSC, SSC, Defence Services",
                    "Competitive Exams — GATE, CAT, GMAT, GRE, TOEFL preparation",
                    "Entrepreneurship — startup mentorship and small business consultancy",
                    "Scholarships — awareness and application support for merit-based funding",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <BadgeCheck className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                      <span className="text-muted-foreground text-sm md:text-base leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Image + Contact Card */}
              <div className="space-y-4">
                <div className="rounded-lg overflow-hidden relative h-48 sm:h-64 md:h-80 group">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    alt="Career counseling session at RGI"
                    src="/images/tnp.png"
                  />
                </div>
                <div className="bg-card rounded-lg p-6 md:p-8 border border-border shadow-[var(--shadow-sm)]">
                  <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-brand" />
                    Contact T&P Cell
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <a
                      href="tel:+919425609712"
                      className="flex items-center gap-2 text-muted-foreground text-sm hover:text-brand transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      +91 94256 09712
                    </a>
                    <a
                      href="tel:+919425303149"
                      className="flex items-center gap-2 text-muted-foreground text-sm hover:text-brand transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      +91 94253 03149
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA BANNER */}
          <section className="max-w-7xl mx-auto px-5 md:px-8 lg:px-20 pb-14 md:pb-28">
            <div className="bg-brand rounded-lg p-6 md:p-16 relative overflow-hidden">
              {/* Decorative */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>

              <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
                <div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-3 md:mb-4 leading-tight">
                    Partner With Us for Campus Hiring
                  </h2>
                  <p className="text-white/70 text-sm md:text-lg leading-relaxed">
                    Join 500+ companies that trust Radharaman for quality
                    talent. Schedule your next campus recruitment drive with
                    us today.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 md:justify-end">
                  <Link href="/recruiters/register">
                    <button className="bg-white text-brand px-8 py-3.5 rounded-full font-bold text-sm shadow-xl hover:bg-white/90 transition-all flex items-center justify-center gap-2 group cursor-pointer w-full sm:w-auto">
                      Register as Recruiter
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                  <Link href="/students/login">
                    <button className="bg-white/15 backdrop-blur-sm text-white px-8 py-3.5 rounded-full font-bold text-sm border border-white/20 hover:bg-white/25 transition-all cursor-pointer w-full sm:w-auto text-center">
                      Student Login
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
