import React from "react";
import { Link as LinkIcon } from "lucide-react";
import Nav from "@/components/layout/nav/nav";
import Footer from "@/components/layout/footer/footer";

export default function ImpactCommunity() {
    return (
        <>
            <Nav />
            <div className="antialiased overflow-x-hidden bg-background text-foreground font-sans">
                <main>
                    <section className="relative min-h-200 flex items-center pt-20 overflow-hidden bg-linear-to-br from-background to-muted">
                        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                            <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[120%] bg-brand/20 rounded-full blur-[120px]"></div>
                            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[80%] bg-brand/10 rounded-full blur-[100px]"></div>
                            <div className="absolute top-[20%] left-[10%] text-[25vw] font-black text-brand/5 leading-none select-none">
                                IMPACT
                            </div>
                        </div>

                        <div className="max-w-360 mx-auto px-8 lg:px-20 relative z-10 w-full">
                            <div className="max-w-4xl">
                                <span className="inline-block text-brand font-bold tracking-[0.4em] text-xs uppercase mb-8 border-l-4 border-brand pl-4">
                                    Social Responsibility
                                </span>
                                <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter text-foreground leading-[0.9] mb-8">
                                    Empowering <br />
                                    <span className="text-transparent bg-clip-text bg-linear-to-r from-brand to-foreground/70">
                                        Purposeful
                                    </span>{" "}
                                    <br />
                                    Careers.
                                </h1>
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-end">
                                    <div className="md:col-span-7">
                                        <p className="text-2xl text-muted-foreground leading-relaxed font-light mb-12">
                                            The Impact-Driven Development center at RGI Amethyst connects
                                            visionary talent with organizations dedicated to profound
                                            societal transformation.
                                        </p>
                                        <div className="flex flex-wrap gap-6">
                                            <button className="px-10 rounded-2xl py-5 bg-brand text-white font-bold text-xs uppercase tracking-[0.2em] shadow-2xl shadow-brand/30 hover:opacity-90 transition-all">
                                                Impact Report 2024
                                            </button>
                                            <button className="rounded-2xl px-10 py-5 bg-background border border-border text-foreground font-bold text-xs uppercase tracking-[0.2em] hover:bg-muted transition-all">
                                                Engagement Model
                                            </button>
                                        </div>
                                    </div>

                                    <div className="md:col-span-5 grid grid-cols-2 gap-x-8 gap-y-12">
                                        <div className="relative">
                                            <div className="text-5xl font-black text-brand mb-1">85%</div>
                                            <div className="h-px bg-linear-to-r from-brand/50 to-transparent mb-3"></div>
                                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                                Community Impact Rate
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <div className="text-5xl font-black text-brand mb-1">
                                                120+
                                            </div>
                                            <div className="h-px bg-linear-to-r from-brand/50 to-transparent mb-3"></div>
                                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                                Active NGO Partners
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <div className="text-5xl font-black text-brand mb-1">
                                                15k+
                                            </div>
                                            <div className="h-px bg-linear-to-r from-brand/50 to-transparent mb-3"></div>
                                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                                Volunteer Hours Yearly
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <div className="text-5xl font-black text-brand mb-1">
                                                Top 5
                                            </div>
                                            <div className="h-px bg-linear-to-r from-brand/50 to-transparent mb-3"></div>
                                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                                Ethical Leadership Ranking
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Social Mandate Section */}
                    <section className="bg-background py-32 px-8 overflow-hidden">
                        <div className="max-w-250 mx-auto">
                            <div className="mb-24 flex flex-col items-center">
                                <span className="text-brand font-bold uppercase tracking-[0.5em] text-[10px] mb-6 block text-center italic">
                                    The Social Mandate
                                </span>
                                <h2 className="text-5xl md:text-7xl font-bold text-foreground text-center leading-[1.1] tracking-tight max-w-4xl">
                                    Cultivating Ethical Leadership for a Better World
                                </h2>
                            </div>
                            <div className="w-full aspect-video mb-16 overflow-hidden [clip-path:polygon(0_0,100%_0,100%_85%,0_100%)]">
                                <img
                                    alt="Community engagement"
                                    loading="lazy"
                                    className="w-full h-full object-cover"
                                    src="/images/tnp-conference-hall.jpeg"
                                />
                            </div>
                            <div className="max-w-2xl mx-auto space-y-12">
                                <p className="text-2xl font-light text-muted-foreground leading-relaxed">
                                    Our mission is to foster{" "}
                                    <span className="text-brand font-semibold">
                                        conscious human capital
                                    </span>{" "}
                                    dedicated to service. We prioritize meaningful contribution over
                                    conventional success, ensuring our graduates enter the world as
                                    ethical agents of sustainable change.
                                </p>
                                <div className="grid grid-cols-1 gap-10">
                                    <div className="flex flex-col gap-6 pt-10 border-t border-border">
                                        <ul className="space-y-8">
                                            <li className="flex items-start gap-6 group">
                                                <span className="text-4xl font-black text-brand/90 group-hover:text-brand transition-colors">
                                                    01
                                                </span>
                                                <div>
                                                    <h4 className="text-lg font-bold text-foreground mb-2">
                                                        Ethical Skill Integration
                                                    </h4>
                                                    <p className="text-muted-foreground font-light text-sm">
                                                        Embedding social responsibility and ethical
                                                        considerations into every technical discipline.
                                                    </p>
                                                </div>
                                            </li>
                                            <li className="flex items-start gap-6 group">
                                                <span className="text-4xl font-black text-brand/90 group-hover:text-brand transition-colors">
                                                    02
                                                </span>
                                                <div>
                                                    <h4 className="text-lg font-bold text-foreground mb-2">
                                                        Social Enterprise Immersion
                                                    </h4>
                                                    <p className="text-muted-foreground font-light text-sm">
                                                        Direct collaboration with global NGOs and grassroot
                                                        organizations to solve real-world problems.
                                                    </p>
                                                </div>
                                            </li>
                                            <li className="flex items-start gap-6 group">
                                                <span className="text-4xl font-black text-brand/90 group-hover:text-brand transition-colors">
                                                    03
                                                </span>
                                                <div>
                                                    <h4 className="text-lg font-bold text-foreground mb-2">
                                                        Compassionate Career Pathfinding
                                                    </h4>
                                                    <p className="text-muted-foreground font-light text-sm">
                                                        Mentorship focused on finding roles that align personal
                                                        values with societal needs.
                                                    </p>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Leadership Section */}
                    <section className="bg-muted py-32 px-8">
                        <div className="max-w-250 mx-auto space-y-32">
                            <div className="text-center">
                                <h2 className="text-5xl font-black text-foreground tracking-tighter uppercase italic">
                                    Empathetic Leadership
                                </h2>
                                <div className="w-12 h-1 bg-brand mx-auto mt-6"></div>
                            </div>

                            <div className="flex flex-col md:flex-row items-center gap-16">
                                <div className="md:w-1/2 order-2 md:order-1">
                                    <span className="text-brand font-bold uppercase tracking-[0.3em] text-xs mb-4 block">
                                        Director of Training And Placement
                                    </span>
                                    <h3 className="text-4xl font-bold text-foreground mb-8">
                                        James Kuttappam
                                    </h3>
                                    <p className="text-2xl font-light italic text-muted-foreground leading-relaxed mb-10">
                                        "Leadership is not about being in charge. It's about taking care
                                        of those in your charge and the world we share."
                                    </p>
                                    <div className="flex gap-4 items-center">
                                        <div className="w-10 h-10 border border-brand flex items-center justify-center text-brand">
                                            <LinkIcon className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                            Social Portfolio
                                        </span>
                                    </div>
                                </div>
                                <div className="md:w-1/2 order-1 md:order-2">
                                    <div className="relative">
                                        <div className="absolute -top-6 -right-6 w-full h-full border-4 border-brand/20 -z-10"></div>
                                        <img
                                            alt="Robin Samuel"
                                            loading="lazy"
                                            className="w-full aspect-4/5 object-cover shadow-2xl"
                                            src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2787&auto=format&fit=crop"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row items-center gap-16">
                                <div className="md:w-1/2">
                                    <div className="relative">
                                        <div className="absolute -bottom-6 -left-6 w-full h-full border-4 border-brand/20 -z-10"></div>
                                        <img
                                            alt="Elena Vance"
                                            loading="lazy"
                                            className="w-full aspect-4/5 object-cover shadow-2xl"
                                            src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2787&auto=format&fit=crop"
                                        />
                                    </div>
                                </div>
                                <div className="md:w-1/2">
                                    <span className="text-brand font-bold uppercase tracking-[0.3em] text-xs mb-4 block">
                                        Dy. Director Of Training And Placement
                                    </span>
                                    <h3 className="text-4xl font-bold text-foreground mb-8">
                                        Robin P. Samuel
                                    </h3>
                                    <p className="text-2xl font-light italic text-muted-foreground leading-relaxed mb-10">
                                        "Meaningful contribution starts with listening to the
                                        communities we serve and designing with empathy."
                                    </p>
                                    <div className="flex gap-4 items-center">
                                        <div className="w-10 h-10 border border-brand flex items-center justify-center text-brand">
                                            <LinkIcon className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                            Social Portfolio
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Core Values Section */}
                    <section className="bg-foreground text-background py-32 px-8">
                        <div className="max-w-360 mx-auto px-12">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
                                <div className="group border-t border-background/20 pt-10">
                                    <span className="text-brand font-bold text-6xl block mb-12 opacity-80">
                                        I
                                    </span>
                                    <h3 className="text-3xl font-bold mb-6 tracking-tight uppercase">
                                        Social Responsibility
                                    </h3>
                                    <p className="text-background/70 font-light text-lg leading-relaxed">
                                        A core commitment to ethical decision-making and sustainable
                                        practices in all professional endeavors.
                                    </p>
                                </div>
                                <div className="group border-t border-background/20 pt-10">
                                    <span className="text-brand font-bold text-6xl block mb-12 opacity-80">
                                        II
                                    </span>
                                    <h3 className="text-3xl font-bold mb-6 tracking-tight uppercase">
                                        Global Citizenship
                                    </h3>
                                    <p className="text-background/70 font-light text-lg leading-relaxed">
                                        Developing a deep awareness of global challenges and a drive to
                                        contribute to universal well-being.
                                    </p>
                                </div>
                                <div className="group border-t border-background/20 pt-10">
                                    <span className="text-brand font-bold text-6xl block mb-12 opacity-80">
                                        III
                                    </span>
                                    <h3 className="text-3xl font-bold mb-6 tracking-tight uppercase">
                                        Purposeful Contribution
                                    </h3>
                                    <p className="text-background/70 font-light text-lg leading-relaxed">
                                        Redefining success as the positive impact one leaves on their
                                        community and the environment.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Partners Section */}
                    <section className="px-8 py-32 max-w-360 mx-auto overflow-hidden">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
                            <div className="max-w-2xl">
                                <span className="text-brand font-bold uppercase tracking-[0.5em] text-[10px] mb-6 block">
                                    NGO & Social Partners
                                </span>
                                <h2 className="text-6xl font-black text-foreground tracking-tighter leading-none mb-6 italic">
                                    Our Impact Network
                                </h2>
                                <p className="text-xl text-muted-foreground font-light">
                                    Collaborating with the world's leading social enterprises and NGOs
                                    to provide our students with opportunities for meaningful service.
                                </p>
                            </div>
                            <button className="px-10 rounded-2xl py-5 bg-background border-2 border-foreground text-foreground font-bold text-xs uppercase tracking-[0.2em] hover:bg-foreground hover:text-background transition-all duration-200">
                                View All Partners
                            </button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 border-l border-t border-border">
                            {[
                                "Doctors Without Borders",
                                "Greenpeace",
                                "Amnesty International",
                                "Ashoka",
                                "Oxfam",
                                "Teach For All",
                            ].map((partner, index) => (
                                <div
                                    key={index}
                                    className="aspect-square border-r border-b border-border flex items-center justify-center p-8 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer"
                                >
                                    <span className="text-lg font-bold text-foreground tracking-widest uppercase text-center">
                                        {partner}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>
            </div>
            <Footer />
        </>
    );
}