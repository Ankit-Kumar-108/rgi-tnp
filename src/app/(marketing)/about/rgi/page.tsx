import React from "react";
import {
  ArrowRight,
  BadgeCheck,
  GraduationCap,
  Building2,
  FlaskConical,
  Stethoscope,
  Heart,
  Leaf,
  BookOpen,
  Users,
  Trophy,
  MapPin,
  Calendar,
  Target,
  Eye,
  Sparkles,
  ChevronRight,
  Globe,
  Microscope,
  Dumbbell,
} from "lucide-react";
import Nav from "@/components/layout/nav/nav";
import Footer from "@/components/layout/footer/footer";
import Link from "next/link";

export default function RGIProfile() {
  const stats = [
    { value: "20+", label: "Years of Excellence" },
    { value: "15,000+", label: "Students" },
    { value: "7", label: "Institutes" },
    { value: "500+", label: "Recruiting Partners" },
  ];

  const timeline = [
    {
      year: "2003",
      title: "Radharaman Institute of Technology & Science (RITS)",
      desc: "The founding institution — approved by AICTE, New Delhi & affiliated to RGPV Bhopal. Set the benchmark for technical education in Central India.",
      icon: GraduationCap,
    },
    {
      year: "2004",
      title: "Radharaman Institute of Pharmaceutical Sciences (RIPS)",
      desc: "Expanded into pharmaceutical sciences with D.Pharm and B.Pharm programs approved by PCI.",
      icon: FlaskConical,
    },
    {
      year: "2005",
      title: "Radharaman Engineering College (REC)",
      desc: "Opened to meet rising demand for quality engineering education with programs in CS, ME, CE, EE, and EC.",
      icon: Building2,
    },
    {
      year: "2006",
      title: "Radharaman College of Pharmacy (RCP)",
      desc: "Strengthened the pharmaceutical ecosystem with advanced pharmacy research and formulation programs.",
      icon: FlaskConical,
    },
    {
      year: "2016",
      title: "Radharaman Ayurveda Medical College & Research Hospital (RAMCRH)",
      desc: "Bridging ancient Ayurvedic wisdom with modern medical research — offering BAMS programs with a 60-bed teaching hospital.",
      icon: Leaf,
    },
    {
      year: "2020",
      title: "Radharaman Institute of Nursing (RIN)",
      desc: "Launched B.Sc. Nursing program to produce compassionate, skilled healthcare professionals for the nation.",
      icon: Heart,
    },
  ];

  const institutes = [
    {
      name: "Engineering & Technology",
      colleges: "RITS & REC Bhopal",
      desc: "Premier engineering education in Computer Science, Mechanical, Civil, Electrical & Electronics with modern labs and incubation centers.",
      image:
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2940&auto=format&fit=crop",
      span: "md:col-span-2 md:row-span-2",
      icon: GraduationCap,
      color: "from-violet-600/90 to-indigo-900/90",
    },
    {
      name: "Pharmacy",
      colleges: "RIPS & RCP",
      desc: "Excellence in pharmaceutical research, drug formulation, and clinical pharmacy practice.",
      image:
        "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=2940&auto=format&fit=crop",
      span: "",
      icon: FlaskConical,
      color: "from-emerald-600/90 to-teal-900/90",
    },
    {
      name: "Nursing",
      colleges: "Radharaman Institute of Nursing",
      desc: "Producing compassionate healthcare professionals through rigorous clinical training.",
      image:
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2940&auto=format&fit=crop",
      span: "",
      icon: Heart,
      color: "from-rose-600/90 to-pink-900/90",
    },
    {
      name: "Ayurveda Medical",
      colleges: "RAMCRH Bhopal",
      desc: "Integrating ancient Ayurvedic wisdom with modern medical research through a 60-bed hospital and BAMS program.",
      image:
        "https://images.unsplash.com/photo-1607613009820-a29f4bb81153?q=80&w=2787&auto=format&fit=crop",
      span: "md:col-span-2",
      icon: Leaf,
      color: "from-amber-600/90 to-orange-900/90",
    },
    {
      name: "Arts, Management & Commerce",
      colleges: "RAMCH — Radharaman Arts, Management & Commerce Hub",
      desc: "Comprehensive programs in BBA, BCA, B.Com, and Arts — preparing future business leaders and creative professionals.",
      image:
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2940&auto=format&fit=crop",
      span: "",
      icon: BookOpen,
      color: "from-blue-600/90 to-cyan-900/90",
    },
  ];

  const values = [
    {
      icon: Globe,
      title: "Digital Learning Hubs",
      desc: "24/7 access to global research databases, e-libraries, and high-speed campus-wide Wi-Fi.",
    },
    {
      icon: Microscope,
      title: "Advanced R&D Labs",
      desc: "Specialized laboratories equipped for multi-disciplinary scientific and pharmaceutical research.",
    },
    {
      icon: Dumbbell,
      title: "Sports & Recreation",
      desc: "Olympic-standard sports complexes, indoor courts, and fitness centers for holistic development.",
    },
    {
      icon: Users,
      title: "Cultural Life & Vihan",
      desc: "Annual festival Vihan, cultural societies, and creative studios fostering all-round growth.",
    },
  ];

  return (
    <>
      <Nav />
      <div className="bg-background text-foreground antialiased font-sans">
        <main>
          {/* HERO SECTION */}
          <section className="relative min-h-[520px] md:min-h-[620px] flex items-end overflow-hidden bg-foreground mt-16 md:mt-20">
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                className="w-full h-full object-cover"
                alt="Radharaman Group of Institutes campus aerial view"
                src="/images/rgiProfile.png"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/40 to-slate-950/10"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/20 to-transparent"></div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand/10 blur-[150px] rounded-full"></div>
            <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-brand/5 blur-[120px] rounded-full"></div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-20 w-full pb-16 md:pb-20">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-white/50 text-sm mb-8">
                <Link
                  href="/"
                  className="hover:text-white transition-colors"
                >
                  Home
                </Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-white/80">About RGI</span>
              </nav>

              <div className="max-w-3xl">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand/20 text-brand font-bold text-xs uppercase tracking-[0.2em] mb-6 backdrop-blur-sm border border-brand/20">
                  <Calendar className="w-3.5 h-3.5" />
                  Established 2003
                </span>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-white mb-6 leading-[1.08]">
                  Radharaman Group
                  <br />
                  <span className="text-brand">of Institutes</span>
                </h1>
                <p className="text-base md:text-xl text-white/60 leading-relaxed mb-10 font-light max-w-2xl">
                  Nurturing talent and driving innovation in Central India
                  through world-class infrastructure and academic rigor for
                  over two decades.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/recruiters/register">
                    <button className="bg-brand text-white px-8 py-3.5 rounded-full font-bold text-sm shadow-xl shadow-brand/30 flex items-center gap-2.5 group hover:opacity-90 transition-all cursor-pointer">
                      Explore Campus
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 duration-200 transition-transform" />
                    </button>
                  </Link>
                  <a
                    href="https://radharamanbhopal.com/radharaman/admission/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="bg-white/10 backdrop-blur-sm text-white px-8 py-3.5 rounded-full font-bold text-sm border border-white/20 hover:bg-white/20 transition-all cursor-pointer">
                      Apply Now
                    </button>
                  </a>
                </div>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-white/[0.06] backdrop-blur-xl border-t border-white/10">
              <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-20">
                <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
                  {stats.map((stat, i) => (
                    <div
                      key={i}
                      className="py-5 md:py-6 px-4 md:px-8 text-center"
                    >
                      <div className="text-2xl md:text-3xl font-black text-white">
                        {stat.value}
                      </div>
                      <div className="text-xs md:text-sm text-white/50 font-medium mt-0.5">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ABOUT THE GROUP*/}
          <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-20 py-20 md:py-28">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Text */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-1 bg-brand rounded-full"></div>
                  <span className="text-brand font-bold uppercase tracking-widest text-xs">
                    Our Story
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-6 leading-tight">
                  Founded on the Pillar of{" "}
                  <span className="text-brand italic">Tapasya</span>
                </h2>
                <div className="space-y-5 text-muted-foreground leading-relaxed text-base lg:text-lg font-light">
                  <p>
                    Established in 2003 by the{" "}
                    <span className="text-foreground font-semibold">
                      Tapasya Education Society
                    </span>
                    , the Radharaman Group of Institutes (RGI) began with a
                    singular mission: to provide unparalleled technical
                    education in Central India. The journey commenced with the
                    Radharaman Institute of Technology & Science (RITS),
                    approved by AICTE and affiliated to RGPV Bhopal.
                  </p>
                  <p>
                    The group is well known for innovation and academic
                    excellence. RGI combines the best of both worlds — here
                    the technology, individuality & independence of the west
                    are blended in right proportion with the culture,
                    traditions & sensitivity of the east.
                  </p>
                  <p>
                    Driven by a vision of holistic educational growth, the
                    group rapidly expanded its footprint across Engineering,
                    Pharmacy, Ayurveda, Nursing, and most recently{" "}
                    <span className="text-foreground font-semibold">
                      Arts, Management & Commerce (RAMCH)
                    </span>
                    , creating a truly diversified academic ecosystem.
                  </p>
                </div>
              </div>

              {/* Image Grid */}
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div className="space-y-3 md:space-y-4">
                  <div className="rounded-2xl overflow-hidden h-44 md:h-56 relative group">
                    <img
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      alt="Modern campus building"
                      src="/images/collegeP.png"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden h-52 md:h-72 relative group">
                    <img
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      alt="Students in a lab"
                      src="/images/lab.png"
                    />
                  </div>
                </div>
                <div className="space-y-3 md:space-y-4 pt-8">
                  <div className="rounded-2xl overflow-hidden h-52 md:h-72 relative group">
                    <img
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      alt="Library study area"
                      src="/images/library.png"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden h-44 md:h-56 relative group bg-brand flex items-center justify-center p-6 text-center">
                    <div>
                      <div className="text-4xl md:text-5xl font-black text-white mb-2">
                        20+
                      </div>
                      <div className="text-white/80 font-medium text-sm">
                        Years of Academic Excellence
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* VISION & MISSION */}
          <section className="bg-muted">
            <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-20 py-20 md:py-28">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-brand/10 text-brand px-4 py-1.5 rounded-full mb-4">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Guiding Principles
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground">
                  Vision & Mission
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                {/* Vision */}
                <div className="bg-card rounded-3xl p-8 md:p-10 border border-border shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-brand/5 blur-3xl rounded-full"></div>
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-brand/10 flex items-center justify-center mb-6">
                      <Eye className="w-7 h-7 text-brand" />
                    </div>
                    <h3 className="text-2xl font-black text-foreground mb-4">
                      Our Vision
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-base">
                      To be a globally recognized multi-disciplinary
                      educational institution that produces industry-ready
                      professionals, fosters cutting-edge research, and
                      contributes to nation-building through innovation,
                      character, and service to society.
                    </p>
                  </div>
                </div>

                {/* Mission */}
                <div className="bg-card rounded-3xl p-8 md:p-10 border border-border shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300 relative overflow-hidden">
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-brand/5 blur-3xl rounded-full"></div>
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-brand/10 flex items-center justify-center mb-6">
                      <Target className="w-7 h-7 text-brand" />
                    </div>
                    <h3 className="text-2xl font-black text-foreground mb-4">
                      Our Mission
                    </h3>
                    <ul className="text-muted-foreground leading-relaxed text-base space-y-3">
                      <li className="flex items-start gap-3">
                        <BadgeCheck className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                        Provide a creative learning environment for the
                        discovery of principles, concepts & values.
                      </li>
                      <li className="flex items-start gap-3">
                        <BadgeCheck className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                        Nurture entrepreneurial mindset and industry-ready
                        competencies across all disciplines.
                      </li>
                      <li className="flex items-start gap-3">
                        <BadgeCheck className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                        Bridge academic excellence with real-world impact
                        through strong industry partnerships.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* TIMELINE — MILESTONES OF GROWTH */}
          <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-20 py-20 md:py-28">
            <div className="text-center mb-16 md:mb-20">
              <div className="inline-flex items-center gap-2 bg-brand/10 text-brand px-4 py-1.5 rounded-full mb-4">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Our Journey
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-4">
                Milestones of Growth
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                From a single engineering institute to a seven-college
                educational powerhouse spanning multiple disciplines.
              </p>
            </div>

            {/* Timeline */}
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px"></div>

              <div className="space-y-8 md:space-y-12">
                {timeline.map((item, idx) => {
                  const Icon = item.icon;
                  const isLeft = idx % 2 === 0;
                  return (
                    <div
                      key={idx}
                      className={`relative flex items-start gap-6 md:gap-0 ${
                        isLeft
                          ? "md:flex-row"
                          : "md:flex-row-reverse"
                      }`}
                    >
                      {/* Dot on line */}
                      <div className="absolute left-5 md:left-1/2 w-10 h-10 -translate-x-1/2 bg-brand rounded-xl flex items-center justify-center z-10 shadow-lg shadow-brand/20">
                        <Icon className="w-5 h-5 text-white" />
                      </div>

                      {/* Content Card */}
                      <div
                        className={`ml-14 md:ml-0 md:w-[calc(50%-2.5rem)] ${
                          isLeft
                            ? "md:pr-0 md:text-right"
                            : "md:pl-0 md:text-left"
                        }`}
                      >
                        <div
                          className={`bg-card rounded-2xl p-6 md:p-8 border border-border shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-300 hover:-translate-y-0.5 ${
                            isLeft ? "md:mr-10" : "md:ml-10"
                          }`}
                        >
                          <div
                            className={`text-brand font-black text-2xl md:text-3xl mb-2`}
                          >
                            {item.year}
                          </div>
                          <h3 className="font-bold text-foreground text-base md:text-lg mb-2">
                            {item.title}
                          </h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </div>

                      {/* Spacer for opposite side */}
                      <div className="hidden md:block md:w-[calc(50%-2.5rem)]"></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* INSTITUTIONS BENTO GRID*/}
          <section className="bg-brand/10 text-foreground">
            <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-20 py-20 md:py-28">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-white/10 text-brand px-4 py-1.5 rounded-full mb-4">
                  <Building2 className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Our Institutions
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4">
                  The RGI Umbrella
                </h2>
                <p className="text-foreground/50 max-w-xl mx-auto">
                  Seven specialized institutions delivering world-class
                  expertise across engineering, pharmacy, medicine, nursing,
                  arts, management & commerce.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4 md:gap-5 auto-rows-[240px] md:auto-rows-[260px]">
                {institutes.map((inst, i) => {
                  const Icon = inst.icon;
                  return (
                    <div
                      key={i}
                      className={`relative rounded-2xl md:rounded-3xl overflow-hidden group cursor-pointer ${inst.span}`}
                    >
                      <img
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        alt={inst.name}
                        src={inst.image}
                      />
                      <div
                        className={`absolute inset-0 bg-gradient-to-t ${inst.color} opacity-80 group-hover:opacity-90 transition-opacity duration-300`}
                      ></div>
                      <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end relative z-10">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center mb-3 md:mb-4">
                          <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        </div>
                        <h3 className="text-xl md:text-2xl font-black text-white mb-1">
                          {inst.name}
                        </h3>
                        <p className="text-white/70 text-xs md:text-sm font-medium mb-2 md:mb-3">
                          {inst.colleges}
                        </p>
                        <p className="text-white/60 text-xs md:text-sm leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all">
                          {inst.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* INFRASTRUCTURE & VALUES */}
          <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-20 py-20 md:py-28">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Left: Text */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-1 bg-brand rounded-full"></div>
                  <span className="text-brand font-bold uppercase tracking-widest text-xs">
                    Campus Life
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-6 leading-tight">
                  Infrastructure that{" "}
                  <span className="text-brand">Inspires</span>
                </h2>
                <p className="text-muted-foreground text-base lg:text-lg leading-relaxed font-light mb-10">
                  Our campus is designed to be a catalyst for academic
                  excellence. World-class infrastructure is the foundation of
                  pioneering research and student success.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {values.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={i}
                        className="flex items-start gap-4 group"
                      >
                        <div className="w-11 h-11 rounded-xl bg-brand/10 flex items-center justify-center shrink-0 group-hover:bg-brand/20 transition-colors">
                          <Icon className="w-5 h-5 text-brand" />
                        </div>
                        <div>
                          <div className="font-bold text-foreground text-sm mb-1">
                            {item.title}
                          </div>
                          <div className="text-xs text-muted-foreground leading-relaxed">
                            {item.desc}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right: Images */}
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <img
                  className="rounded-2xl h-48 md:h-64 w-full object-cover shadow-lg"
                  alt="Modern campus library with natural light"
                  src="/images/Library.png"
                />
                <img
                  className="rounded-2xl h-48 md:h-64 w-full object-cover shadow-lg mt-8"
                  alt="Lecture hall with stadium seating"
                  src="/images/seminar.png"
                />
                <img
                  className="rounded-2xl h-48 md:h-64 w-full object-cover shadow-lg col-span-2"
                  alt="Students working on a group project on campus"
                  src="/images/project.png"
                />
              </div>
            </div>
          </section>

          {/* ACCREDITATIONS & AFFILIATIONS */}
          <section className="bg-muted">
            <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-20 py-16 md:py-20">
              <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-black text-foreground mb-3">
                  Accreditations & Affiliations
                </h2>
                <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
                  Recognized by the nation&apos;s premier regulatory bodies
                  for academic standards and infrastructure.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {[
                  {
                    name: "AICTE",
                    full: "All India Council for Technical Education",
                  },
                  {
                    name: "RGPV",
                    full: "Rajiv Gandhi Proudyogiki Vishwavidyalaya, Bhopal",
                  },
                  {
                    name: "PCI",
                    full: "Pharmacy Council of India",
                  },
                  {
                    name: "INC",
                    full: "Indian Nursing Council",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-card rounded-2xl p-6 md:p-8 text-center border border-border shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-brand/10 flex items-center justify-center mx-auto mb-4">
                      <Trophy className="w-7 h-7 md:w-8 md:h-8 text-brand" />
                    </div>
                    <h3 className="text-lg md:text-xl font-black text-foreground mb-1">
                      {item.name}
                    </h3>
                    <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                      {item.full}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA BANNER */}
          <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-20 py-20 md:py-28">
            <div className="bg-brand rounded-3xl md:rounded-[2rem] p-8 md:p-16 relative overflow-hidden">
              {/* Decorative */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>

              <div className="relative z-10 text-center max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
                  Ready to Join Our Community?
                </h2>
                <p className="text-white/70 text-base md:text-lg mb-8 leading-relaxed">
                  Join 15,000+ students already pursuing their dreams at
                  Radharaman Group of Institutes. Start your journey today.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <a
                    href="https://radharamanbhopal.com/radharaman/admission/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="bg-white text-brand px-8 py-3.5 rounded-full font-bold text-sm shadow-xl hover:bg-white/90 transition-all flex items-center gap-2 group cursor-pointer">
                      Apply for Admission
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </a>
                  <Link href="/">
                    <button className="bg-white/15 backdrop-blur-sm text-white px-8 py-3.5 rounded-full font-bold text-sm border border-white/20 hover:bg-white/25 transition-all cursor-pointer">
                      Back to Home
                    </button>
                  </Link>
                </div>

                {/* Contact Info */}
                <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-white/60 text-sm">
                  <a
                    href="tel:+9118002700660"
                    className="flex items-center gap-2 hover:text-white transition-colors"
                  >
                    <Stethoscope className="w-4 h-4" />
                    Toll Free: 1800-270-0660
                  </a>
                  <a
                    href="https://radharamanbhopal.com/radharaman/contact-us/index.php"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-white transition-colors"
                  >
                    <MapPin className="w-4 h-4" />
                    Bhopal, Madhya Pradesh
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
