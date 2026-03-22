import React from "react";
import {
    Wrench,
    Award,
    TrendingUp,
} from "lucide-react";
import Nav from "@/components/layout/nav/nav";
import Footer from "@/components/layout/footer/footer";

export default function StrategicAlliances() {
    return (
        <>
            <Nav />
            <div className="bg-background text-foreground antialiased font-sans flex flex-col min-h-screen mt-20">
                <main className="flex-1 w-full">
                    {/* Hero Section */}
                    <section className="relative min-h-[716px] flex items-center overflow-hidden">
                        <div className="absolute inset-0 z-0">
                            <img
                                className="w-full h-full object-cover opacity-30"
                                alt="Professional business handshake in a bright modern office"
                                src="https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=2874&auto=format&fit=crop"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent"></div>
                        </div>

                        <div className="relative z-10 max-w-7xl mx-auto px-8 py-20 w-full">
                            <div className="max-w-3xl">
                                <span className="inline-block px-4 py-1 rounded-full bg-brand/10 text-brand font-bold text-sm tracking-widest uppercase mb-6">
                                    Institutional Excellence
                                </span>
                                <h1 className="text-5xl md:text-7xl font-black tracking-tight text-foreground mb-8 leading-[1.1]">
                                    Strategic Alliances <br /> & MoUs
                                </h1>
                                <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed mb-10 max-w-2xl">
                                    At Radharaman Group of Institutes (RGI), we bridge the gap between
                                    academic theory and industrial reality through a curated ecosystem
                                    of global partnerships, empowering our students with elite
                                    professional growth opportunities.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <button className="bg-brand text-primary-foreground px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-brand/20 hover:scale-105 transition-all">
                                        Explore Partnerships
                                    </button>
                                    <button className="bg-transparent border-2 border-brand/20 text-brand px-8 py-4 rounded-xl font-bold text-lg hover:bg-brand/5 transition-all">
                                        Corporate Inquiry
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* MoU Categorization & Grid */}
                    <section className="py-24 px-8 bg-muted/30">
                        <div className="max-w-7xl mx-auto">
                            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                                <div>
                                    <h2 className="text-4xl font-bold text-foreground mb-4">
                                        Our Global Network
                                    </h2>
                                    <p className="text-muted-foreground max-w-xl">
                                        Curating collaborations across technology, research, and social
                                        impact to ensure a 360-degree development for our future
                                        leaders.
                                    </p>
                                </div>
                            </div>

                            {/* Bento Grid of MoUs */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                                {/* Partner Card 1 */}
                                <div className="group bg-card p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all flex flex-col items-center text-center border border-border">
                                    <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mb-6 overflow-hidden">
                                        <img
                                            className="w-12 h-12 object-contain"
                                            alt="Microsoft"
                                            src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
                                        />
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground mb-2">
                                        Microsoft
                                    </h3>
                                    <span className="px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-bold uppercase tracking-wider mb-4">
                                        Industrial Partnership
                                    </span>
                                    <p className="text-sm text-muted-foreground font-light mb-6">
                                        Advanced Cloud Computing Certification & Azure Lab Access for
                                        Students.
                                    </p>
                                    <div className="mt-auto pt-4 border-t border-border w-full text-xs text-muted-foreground italic">
                                        Est. Sept 2022
                                    </div>
                                </div>

                                {/* Partner Card 2 */}
                                <div className="group bg-card p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all flex flex-col items-center text-center border border-border">
                                    <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mb-6 overflow-hidden p-2">
                                        <img
                                            className="w-full h-full object-contain"
                                            alt="TCS iON"
                                            src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg"
                                        />
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground mb-2">
                                        TCS iON
                                    </h3>
                                    <span className="px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-bold uppercase tracking-wider mb-4">
                                        Direct Placement
                                    </span>
                                    <p className="text-sm text-muted-foreground font-light mb-6">
                                        Exclusive hiring portal access and digital proficiency training
                                        modules.
                                    </p>
                                    <div className="mt-auto pt-4 border-t border-border w-full text-xs text-muted-foreground italic">
                                        Est. Jan 2021
                                    </div>
                                </div>

                                {/* Partner Card 3 */}
                                <div className="group bg-card p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all flex flex-col items-center text-center border border-border">
                                    <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mb-6 overflow-hidden">
                                        <span className="text-2xl font-black text-foreground">NPTEL</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground mb-2">NPTEL</h3>
                                    <span className="px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-bold uppercase tracking-wider mb-4">
                                        Skill Development
                                    </span>
                                    <p className="text-sm text-muted-foreground font-light mb-6">
                                        Certification credits integrated into core academic curriculum.
                                    </p>
                                    <div className="mt-auto pt-4 border-t border-border w-full text-xs text-muted-foreground italic">
                                        Est. March 2023
                                    </div>
                                </div>

                                {/* Partner Card 4 */}
                                <div className="group bg-card p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all flex flex-col items-center text-center border border-border">
                                    <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mb-6 overflow-hidden">
                                        <img
                                            className="w-12 h-12 object-contain"
                                            alt="IBM"
                                            src="https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg"
                                        />
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground mb-2">
                                        IBM Academic
                                    </h3>
                                    <span className="px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-bold uppercase tracking-wider mb-4">
                                        Research Partnership
                                    </span>
                                    <p className="text-sm text-muted-foreground font-light mb-6">
                                        Quantum Computing initiative and specialized AI research labs.
                                    </p>
                                    <div className="mt-auto pt-4 border-t border-border w-full text-xs text-muted-foreground italic">
                                        Est. July 2023
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Impact & Benefits Section */}
                    <section className="py-24 px-8 bg-background relative">
                        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div className="relative">
                                <div className="absolute -top-12 -left-12 w-64 h-64 bg-brand/10 blur-[100px] rounded-full"></div>
                                <img
                                    className="relative z-10 rounded-[2rem] shadow-2xl object-cover aspect-[4/3]"
                                    alt="Students collaborating in a high-tech modern classroom"
                                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2940&auto=format&fit=crop"
                                />
                                <div className="absolute -bottom-8 -right-8 bg-brand p-8 rounded-[2rem] shadow-xl z-20 hidden md:block">
                                    <div className="text-4xl font-black text-primary-foreground">
                                        10+
                                    </div>
                                    <div className="text-primary-foreground/80 font-bold text-sm tracking-widest uppercase mt-1">
                                        Active Alliances
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-4xl font-bold text-foreground mb-12">
                                    Empowering Student Careers
                                </h2>
                                <div className="space-y-8">
                                    <div className="flex gap-6">
                                        <div className="w-14 h-14 shrink-0 bg-brand/10 rounded-2xl flex items-center justify-center">
                                            <Wrench className="text-brand w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold mb-2 text-foreground">
                                                Direct Industry Exposure
                                            </h4>
                                            <p className="text-muted-foreground leading-relaxed">
                                                Regular visits, expert sessions, and immersion programs with
                                                our Tier-1 corporate partners.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="w-14 h-14 shrink-0 bg-brand/10 rounded-2xl flex items-center justify-center">
                                            <Award className="text-brand w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold mb-2 text-foreground">
                                                Certified Training Programs
                                            </h4>
                                            <p className="text-muted-foreground leading-relaxed">
                                                Integrated curriculum tracks that provide industry-recognized
                                                certifications along with degrees.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="w-14 h-14 shrink-0 bg-brand/10 rounded-2xl flex items-center justify-center">
                                            <TrendingUp className="text-brand w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold mb-2 text-foreground">
                                                Enhanced Placement Odds
                                            </h4>
                                            <p className="text-muted-foreground leading-relaxed">
                                                Exclusive pre-placement offers and interview waivers for
                                                top-performing students in partner projects.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Call to Action Section */}
                    <section className="py-24 px-8 bg-foreground text-background overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand/20 -skew-x-12 translate-x-1/4"></div>

                        <div className="max-w-4xl mx-auto relative z-10">
                            <div className="text-center mb-16">
                                <h2 className="text-4xl md:text-5xl font-black mb-6">
                                    Partner With Us
                                </h2>
                                <p className="text-background/80 text-lg font-light leading-relaxed">
                                    Join our elite network of industry leaders and help shape the next
                                    generation of professional talent.
                                </p>
                            </div>

                            <div className="bg-background p-10 md:p-12 rounded-[2.5rem] shadow-2xl text-foreground">
                                <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                            Organization Name
                                        </label>
                                        <input
                                            className="w-full bg-muted border-none rounded-xl py-4 px-6 focus:ring-2 focus:ring-brand outline-none"
                                            placeholder="e.g. Global Tech Solutions"
                                            type="text"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                            Contact Person
                                        </label>
                                        <input
                                            className="w-full bg-muted border-none rounded-xl py-4 px-6 focus:ring-2 focus:ring-brand outline-none"
                                            placeholder="Full Name"
                                            type="text"
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                            Collaboration Interest
                                        </label>
                                        <select className="w-full bg-muted border-none rounded-xl py-4 px-6 focus:ring-2 focus:ring-brand outline-none text-foreground appearance-none">
                                            <option>Industrial Training & MoUs</option>
                                            <option>Exclusive Placement Drives</option>
                                            <option>Research & Development</option>
                                            <option>Skill Enhancement Workshops</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                            Your Proposal/Message
                                        </label>
                                        <textarea
                                            className="w-full bg-muted border-none rounded-xl py-4 px-6 focus:ring-2 focus:ring-brand outline-none resize-none"
                                            placeholder="Briefly describe your partnership vision..."
                                            rows={4}
                                        ></textarea>
                                    </div>
                                    <div className="md:col-span-2 mt-4">
                                        <button className="w-full bg-brand text-primary-foreground font-bold py-5 rounded-xl text-lg shadow-xl shadow-brand/30 hover:scale-[1.01] transition-all">
                                            Submit Collaboration Inquiry
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
            <Footer />
        </>
    );
}