import React from "react";
import Image from "next/image";
import {
    Wrench,
    Award,
    TrendingUp,
    ExternalLink,
    Building2,
    Microscope,
    Laptop,
    Server,
    Globe,
    Briefcase,
    BadgeCheck,
    ChevronRight,
} from "lucide-react";
import Nav from "@/components/layout/nav/nav";
import Footer from "@/components/layout/footer/footer";
import Link from "next/link";

export default function StrategicAlliances() {
    const stats = [
      { value: "11+", label: "Active MoUs" },
      { value: "Govt.", label: "BOAT Ministry of HRD" },
      { value: "1100+", label: "TCS Exam Systems" },
      { value: "Global", label: "International Partners" },
    ];

    const mous = [
        {
            name: "HP",
            desc: "Training for final and pre-final year students according to current IT and Software Industry requirements.",
            category: "Industrial Training",
            icon: Laptop,
        },
        {
            name: "TCS TEST PREP",
            desc: "Access to a series of 12 aptitude tests to help students practice and prepare for Campus Recruitment Processes.",
            category: "Placement Preparation",
            icon: Briefcase,
        },
        {
            name: "CISCO",
            desc: "Comprehensive training programs leading to subsequent CISCO professional certifications.",
            category: "Professional Certification",
            icon: Globe,
        },
        {
            name: "IBM",
            desc: "Training students in IBM-specific software including DB2, JAVA Visual Age, and Rational Rose across platforms.",
            category: "Technical Training",
            icon: Server,
        },
        {
            name: "Netlink",
            desc: "Collaboration with the Detroit-headquartered software company providing value-added technology and business solutions.",
            category: "Global Tech Partner",
            icon: Globe,
        },
        {
            name: "Mutanex",
            desc: "Partnership with AI-powered platform focusing on data science, predictive analytics, and strategic insights.",
            category: "AI & Data Science",
            icon: Microscope,
        },
        {
            name: "BOAT (Ministry of HRD)",
            desc: "Alliance with Board of Apprenticeship Training, an autonomous body of the Government of India.",
            category: "Govt. Apprenticeship",
            icon: Building2,
        },
        {
            name: "Illumine Childcare Technology",
            desc: "US-based leading childcare management platform partnership for technological integration and exposure.",
            category: "EdTech Partner",
            icon: Laptop,
        },
        {
            name: "Ziroh Labs",
            desc: "Deep tech startup with presence in Bay Area and Bangalore, driving innovation in the computing field.",
            category: "Deep Tech & Research",
            icon: Microscope,
        },
        {
            name: "Cyber Infrastructure CIS",
            desc: "Collaboration with CMMI Level III Company located in Indore for software engineering best practices.",
            category: "Software Engineering",
            icon: Building2,
        },
    ];

    return (
        <>
            <Nav />
            <div className="bg-background text-foreground antialiased font-sans flex flex-col min-h-screen">
                <main className="flex-1 w-full">
                    {/* HERO SECTION */}
                    <section className="relative min-h-[480px] md:min-h-[640px] flex items-end overflow-hidden bg-foreground mt-20">
                        <div className="absolute inset-0">
                            <Image
                                fill
                                priority
                                className="object-cover"
                                alt="Professional corporate partnership handshake"
                                src="https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=2874&auto=format&fit=crop"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/40"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 to-transparent"></div>
                        </div>

                        <div className="absolute top-0 left-0 w-80 h-80 bg-brand/10 blur-[150px] rounded-full"></div>

                        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 lg:px-20 w-full pb-32 md:pb-32">
                            <nav className="flex items-center gap-2 text-white/50 text-xs md:text-sm mb-6 md:mb-8">
                                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                                <ChevronRight className="w-3.5 h-3.5" />
                                <Link href="/about/training-placement" className="hover:text-white transition-colors">Placement</Link>
                                <ChevronRight className="w-3.5 h-3.5" />
                                <span className="text-white/80">MoUs</span>
                            </nav>

                            <div className="max-w-3xl">
                                <span className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full bg-brand/20 text-brand font-bold text-[10px] md:text-xs uppercase tracking-[0.15em] md:tracking-[0.2em] mb-4 md:mb-6 backdrop-blur-sm border border-brand/20">
                                    <Building2 className="w-3.5 h-3.5" />
                                    Corporate Synergy
                                </span>
                                <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-white mb-4 md:mb-6 leading-[1.08]">
                                    Strategic Alliances <br />
                                    <span className="text-brand">& MoUs</span>
                                </h1>
                                <p className="text-sm md:text-xl text-white/60 leading-relaxed mb-6 md:mb-10 font-light max-w-2xl">
                                    RGI believes in active collaboration with government bodies and
                                    corporate companies, aiding students in training, internships,
                                    and personality development.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                    <Link href="#partners" className="w-full sm:w-auto">
                                        <button className="bg-brand text-white px-8 py-3.5 rounded-full font-bold text-sm shadow-xl shadow-brand/30 flex items-center justify-center gap-2.5 group hover:opacity-90 transition-all cursor-pointer w-full sm:w-auto">
                                            Explore Partnerships
                                        </button>
                                    </Link>
                                    <a href="https://radharamanbhopal.com/radharaman/contact-us/index.php" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                                        <button className="bg-white/10 backdrop-blur-sm text-white px-8 py-3.5 rounded-full font-bold text-sm border border-white/20 hover:bg-white/20 transition-all cursor-pointer w-full sm:w-auto text-center flex justify-center items-center gap-2">
                                            Corporate Inquiry
                                            <ExternalLink className="w-4 h-4" />
                                        </button>
                                    </a>
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

                    {/* FEATURED: TCS EXAM CENTER */}
                    <section className="max-w-7xl mx-auto px-5 md:px-8 lg:px-20 py-14 md:py-28">
                        <div className="text-center mb-10 md:mb-16">
                            <div className="inline-flex items-center gap-2 bg-brand/10 text-brand px-4 py-1.5 rounded-full mb-4">
                                <BadgeCheck className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">Infrastructure Partner</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-3 md:mb-4">
                                Official TCS Examination Hub
                            </h2>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center bg-card rounded-lg md:rounded-3xl p-5 md:p-10 border border-border shadow-[var(--shadow-md)]">
                            <div className="relative group rounded-lg overflow-hidden h-52 sm:h-64 md:h-80">
                                <Image
                                    alt="TCS Computer Examination Center at RGI"
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2940&auto=format&fit=crop"
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                                <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 bg-background/90 backdrop-blur-md p-2.5 md:p-3 rounded-lg border border-border shadow-sm">
                                    <Server className="text-brand w-6 h-6 md:w-8 md:h-8" />
                                </div>
                            </div>
                            <div className="space-y-4 md:space-y-6">
                                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-brand/10 text-brand font-semibold text-xs md:text-sm">
                                    <Building2 className="w-4 h-4" />
                                    Corporate Giant TCS
                                </span>
                                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-foreground leading-tight">
                                    1,100+ Computer Infrastructure
                                </h3>
                                <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                                    RGI has signed an MoU with Corporate Giant TCS for conducting Online
                                    examinations for various organizations. With over 1,100 computers
                                    registered with TCS, all systems are frequently used for major
                                    national and state-level exams.
                                </p>
                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <div className="flex flex-col p-3.5 md:p-4 bg-muted rounded-lg border border-border/50">
                                        <span className="font-bold text-foreground">AIEEE / JEE</span>
                                        <span className="text-xs text-muted-foreground">National Level</span>
                                    </div>
                                    <div className="flex flex-col p-3.5 md:p-4 bg-muted rounded-lg border border-border/50">
                                        <span className="font-bold text-foreground">GATE</span>
                                        <span className="text-xs text-muted-foreground">PG Engineering</span>
                                    </div>
                                    <div className="flex flex-col p-3.5 md:p-4 bg-muted rounded-lg border border-border/50">
                                        <span className="font-bold text-foreground">IBPS</span>
                                        <span className="text-xs text-muted-foreground">Banking Sector</span>
                                    </div>
                                    <div className="flex flex-col p-3.5 md:p-4 bg-muted rounded-lg border border-border/50">
                                        <span className="font-bold text-foreground">Patwari</span>
                                        <span className="text-xs text-muted-foreground">State Govt.</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* MoU Grid */}
                    <section id="partners" className="bg-muted">
                        <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-20 py-14 md:py-28">
                            <div className="text-center mb-10 md:mb-16">
                                <div className="inline-flex items-center gap-2 bg-brand/10 text-brand px-4 py-1.5 rounded-full mb-4">
                                    <Globe className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Global Network</span>
                                </div>
                                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-3 md:mb-4">
                                    Corporate & Institutional MoUs
                                </h2>
                                <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
                                    These active memorandums of understanding ensure our students receive
                                    industry-relevant training, access to modern tools, and direct placement opportunities.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                                {mous.map((mou, i) => {
                                    const Icon = mou.icon;
                                    return (
                                        <div
                                            key={i}
                                            className="bg-card rounded-lg p-5 md:p-6 border border-border shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-300 hover:-translate-y-0.5 flex flex-col group"
                                        >
                                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-brand/10 flex items-center justify-center mb-4 group-hover:bg-brand/20 transition-colors shrink-0">
                                                <Icon className="w-5 h-5 md:w-6 md:h-6 text-brand" />
                                            </div>
                                            <h3 className="text-base md:text-lg font-bold text-foreground mb-1">{mou.name}</h3>
                                            <span className="inline-block px-2.5 py-1 bg-brand/10 text-brand text-[10px] font-bold rounded-full mb-3 w-fit">
                                                {mou.category}
                                            </span>
                                            <p className="text-muted-foreground text-xs md:text-sm leading-relaxed flex-1">
                                                {mou.desc}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* Impact & Benefits Section */}
                    <section className="bg-brand/5 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-brand/10 via-transparent to-brand/5 pointer-events-none"></div>

                        <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-20 py-14 md:py-28 relative z-10">
                            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                                <div className="relative order-2 lg:order-1">
                                    <div className="flex flex-col gap-6">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-1 bg-brand rounded-full"></div>
                                            <span className="text-brand font-bold uppercase tracking-widest text-xs">Advantage</span>
                                        </div>
                                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-2 leading-tight">
                                            Value for <span className="text-brand italic">Students</span>
                                        </h2>

                                        <div className="space-y-4 md:space-y-6">
                                            <div className="flex items-start gap-3 md:gap-4">
                                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-brand/20 flex items-center justify-center shrink-0">
                                                    <Wrench className="w-5 h-5 md:w-6 md:h-6 text-brand" />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm md:text-lg font-bold text-foreground mb-1">
                                                        Direct Industry Exposure
                                                    </h4>
                                                    <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                                                        Regular visits, expert technical sessions, and immersion programs with
                                                        our Tier-1 corporate partners.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3 md:gap-4">
                                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-brand/20 flex items-center justify-center shrink-0">
                                                    <Award className="w-5 h-5 md:w-6 md:h-6 text-brand" />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm md:text-lg font-bold text-foreground mb-1">
                                                        Certified Training Programs
                                                    </h4>
                                                    <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                                                        Curriculum tracks that provide industry-recognized
                                                        certifications (CISCO, IBM, AWS) alongside core degrees.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3 md:gap-4">
                                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-brand/20 flex items-center justify-center shrink-0">
                                                    <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-brand" />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm md:text-lg font-bold text-foreground mb-1">
                                                        Enhanced Placement Odds
                                                    </h4>
                                                    <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                                                        Exclusive pre-placement offers, aptitude preparation (TCS), and interview waivers for
                                                        top-performing students.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative order-1 lg:order-2">
                                    <div className="rounded-lg overflow-hidden relative h-56 sm:h-72 md:h-[500px]">
                                        <Image
                                            className="object-cover"
                                            alt="Students benefiting from corporate partnerships"
                                            src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2940&auto=format&fit=crop"
                                            fill
                                            sizes="(max-width: 1024px) 100vw, 50vw"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="max-w-7xl mx-auto px-5 md:px-8 lg:px-20 py-14 md:py-28">
                        <div className="bg-brand rounded-lg p-6 md:p-16 relative overflow-hidden">
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>

                            <div className="relative z-10 grid md:grid-cols-2 gap-8 md:gap-10 items-center">
                                <div>
                                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-3 md:mb-4 leading-tight">
                                        Become a Partner
                                    </h2>
                                    <p className="text-white/70 text-sm md:text-lg leading-relaxed">
                                        Join our network of industry leaders to setup CoEs, conduct joint research,
                                        or hire from Central India&apos;s premier talent pool.
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
                                            Corporate Relations Cell
                                            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
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