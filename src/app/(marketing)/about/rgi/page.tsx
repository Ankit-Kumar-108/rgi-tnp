import React from "react";
import { ArrowRight, ChevronRight, BadgeCheck } from "lucide-react";
import Nav from "@/components/layout/nav/nav";
import Footer from "@/components/layout/footer/footer";

export default function RGIProfile() {
  return (
    <>
    <Nav/>
    <div className="bg-background text-foreground antialiased font-sans mt-20">
      <main>
        {/* Hero Section */}
        <section className="relative h-217.5 flex items-center overflow-hidden bg-foreground">
          <div className="absolute inset-0 opacity-70">
            <img
              className="w-full h-full object-cover"
              alt="Aerial view of a modern university campus with green spaces"
              src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2940&auto=format&fit=crop"
            />
          </div>
          <div className="absolute inset-0 bg-linear-to-r from-slate-900/60 via-slate-900/80 to-transparent"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
            <div className="max-w-3xl">
              <span className="inline-block px-4 py-1.5 rounded-full bg-brand/20 text-brand font-bold text-xs uppercase tracking-[0.2em] mb-6">
                Established 2003
              </span>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight text-background mb-8 leading-[1.1]">
                Radharaman Group of Institutes:{" "}
                <span className="text-brand">A Legacy of Excellence</span>
              </h1>
              <p className="text-xl text-slate-300 leading-relaxed mb-10 font-light max-w-2xl">
                Nurturing talent and driving innovation in Central India through
                world-class infrastructure and academic rigor for over two
                decades.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-brand text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-brand/30 flex items-center gap-2 group hover:opacity-90 transition-all">
                  Explore Campus
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 duration-200 transition-transform" />
                </button>
              </div>
            </div>
          </div>
          {/* Prism Decorative Element */}
          <div className="absolute -right-20 bottom-0 w-96 h-96 bg-brand/20 blur-[120px] rounded-full"></div>
        </section>

        {/* Main Content Area with Sidebar */}
        <section className="max-w-7xl mx-auto px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Sidebar (Left for Desktop) */}
            <aside className="lg:col-span-3 order-2 lg:order-1">
              <div className="sticky top-32 space-y-8">
                
                <div className="bg-brand rounded-2xl p-8 text-primary-foreground relative overflow-hidden shadow-xl shadow-brand/20">
                  <div className="relative z-10">
                    <h4 className="text-xl font-bold mb-4">
                      Ready to join our community?
                    </h4>
                    <p className="text-primary-foreground/80 text-sm mb-6 leading-relaxed">
                      Join 15,000+ students already pursuing their dreams at
                      RGI.
                    </p>
                    <button className="w-full bg-background text-brand py-3 rounded-2xl font-bold hover:bg-muted transition-colors">
                      Apply Now
                    </button>
                  </div>
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-background/10 rounded-full blur-2xl"></div>
                </div>
              </div>
            </aside>

            {/* Content Body */}
            <div className="lg:col-span-9 order-1 lg:order-2 space-y-24">
              
              {/* About the Group */}
              <div id="about">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-px flex-1 bg-border"></div>
                  <span className="text-brand font-black uppercase tracking-widest text-xs">
                    Origin Story
                  </span>
                </div>
                <h2 className="text-4xl font-black text-foreground mb-8 leading-tight">
                  Founded on the Pillar of{" "}
                  <span className="text-brand italic">Tapasya</span>.
                </h2>
                <div className="grid md:grid-cols-2 gap-12 text-muted-foreground leading-relaxed text-lg font-light">
                  <p>
                    Established in 2003 by the{" "}
                    <span className="text-foreground font-semibold">
                      Tapasya Education Society
                    </span>
                    , the Radharaman Group of Institutes (RGI) began with a
                    singular mission: to provide unparalleled technical
                    education in Central India. The journey commenced with the
                    Radharaman Institute of Technology & Science (RITS), which
                    quickly became a benchmark for engineering excellence.
                  </p>
                  <p>
                    Driven by a vision of holistic educational growth, the
                    group rapidly expanded its footprint. In 2004, the
                    Radharaman Institute of Pharmaceutical Sciences (RIPS) was
                    founded, followed by the Radharaman Engineering College
                    (REC) in 2005 and the Radharaman College of Pharmacy (RCP)
                    in 2006, creating a diversified academic ecosystem.
                  </p>
                </div>
              </div>

              {/* Academic Expansion Timeline */}
              <div
                className="bg-muted rounded-[3rem] p-12 relative overflow-hidden"
                id="timeline"
              >
                <div className="relative z-10">
                  <h2 className="text-3xl font-black mb-12 text-center text-foreground">
                    Milestones of Growth
                  </h2>
                  <div className="grid md:grid-cols-4 gap-8">
                    {[
                      {
                        year: "2003",
                        title: "The Foundation",
                        desc: "RITS Engineering established, setting the foundation for the group.",
                      },
                      {
                        year: "2005",
                        title: "Expansion",
                        desc: "REC Bhopal opens its doors to cater to growing technical demand.",
                      },
                      {
                        year: "2016",
                        title: "Ayurveda",
                        desc: "Radharaman Ayurveda Medical College & Research established.",
                      },
                      {
                        year: "2020",
                        title: "Healthcare",
                        desc: "RGI Nursing College launches, focusing on specialized B.Sc. Nursing.",
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-background p-8 rounded-2xl shadow-sm hover:scale-105 transition-transform border border-border"
                      >
                        <div className="text-brand font-black text-3xl mb-4">
                          {item.year}
                        </div>
                        <div className="font-bold text-foreground mb-2">
                          {item.title}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {item.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 blur-3xl rounded-full"></div>
              </div>

              {/* Institutional Reach (Bento Grid) */}
              <div id="institutes">
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-black mb-4 text-foreground">
                    The RGI Umbrella
                  </h2>
                  <p className="text-muted-foreground max-w-xl mx-auto">
                    Specialized institutions offering world-class expertise
                    across diverse professional fields.
                  </p>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 bg-card rounded-2xl overflow-hidden shadow-sm border border-border group">
                    <div className="relative h-64 overflow-hidden">
                      <img
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        alt="Engineering & Technology"
                        src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2940&auto=format&fit=crop"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-foreground/90 to-transparent"></div>
                      <div className="absolute bottom-6 left-8 text-background">
                        <div className="font-black text-2xl">
                          Engineering & Technology
                        </div>
                        <div className="text-background/80 font-medium">
                          RITS & REC Bhopal
                        </div>
                      </div>
                    </div>
                    <div className="p-8">
                      <p className="text-muted-foreground leading-relaxed">
                        Premier engineering education focusing on Computer
                        Science, Mechanical, Civil, and Electronic streams with
                        state-of-the-art incubation centers.
                      </p>
                    </div>
                  </div>

                  <div className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border group">
                    <div className="relative h-64 overflow-hidden">
                      <img
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        alt="Pharmacy"
                        src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=2940&auto=format&fit=crop"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-foreground/90 to-transparent"></div>
                      <div className="absolute bottom-6 left-8 text-background">
                        <div className="font-black text-2xl">Pharmacy</div>
                        <div className="text-background/80 font-medium">
                          RIPS & RCP
                        </div>
                      </div>
                    </div>
                    <div className="p-8">
                      <p className="text-muted-foreground leading-relaxed">
                        Excellence in pharmaceutical research and formulation
                        sciences.
                      </p>
                    </div>
                  </div>

                  <div className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border group">
                    <div className="relative h-64 overflow-hidden">
                      <img
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        alt="Nursing"
                        src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2940&auto=format&fit=crop"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-foreground/90 to-transparent"></div>
                      <div className="absolute bottom-6 left-8 text-background">
                        <div className="font-black text-2xl">Nursing</div>
                        <div className="text-background/80 font-medium">
                          RGI Nursing College
                        </div>
                      </div>
                    </div>
                    <div className="p-8">
                      <p className="text-muted-foreground leading-relaxed">
                        Dedicated to producing compassionate healthcare
                        professionals.
                      </p>
                    </div>
                  </div>

                  <div className="md:col-span-2 bg-card rounded-2xl overflow-hidden shadow-sm border border-border group">
                    <div className="relative h-64 overflow-hidden">
                      <img
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        alt="Ayurveda Medical"
                        src="https://images.unsplash.com/photo-1607613009820-a29f4bb81153?q=80&w=2787&auto=format&fit=crop"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-foreground/90 to-transparent"></div>
                      <div className="absolute bottom-6 left-8 text-background">
                        <div className="font-black text-2xl">
                          Ayurveda Medical
                        </div>
                        <div className="text-background/80 font-medium">
                          RAMCR Bhopal
                        </div>
                      </div>
                    </div>
                    <div className="p-8">
                      <p className="text-muted-foreground leading-relaxed">
                        Bridging ancient wisdom with modern medical research to
                        provide integrative healthcare solutions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Values & Infrastructure */}
              <div className="relative" id="values">
                <div className="flex flex-col md:flex-row gap-16 items-center">
                  <div className="md:w-1/2">
                    <h2 className="text-4xl font-black mb-8 text-foreground">
                      Empowering Innovation
                    </h2>
                    <p className="text-muted-foreground text-lg leading-relaxed font-light mb-8">
                      Our campus is designed to be a catalyst for academic
                      excellence. We believe that world-class infrastructure is
                      the foundation of pioneering research and student success.
                    </p>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-4">
                        <BadgeCheck className="text-brand w-6 h-6 shrink-0 mt-1" />
                        <div>
                          <div className="font-bold text-foreground">
                            Digital Learning Hubs
                          </div>
                          <div className="text-sm text-muted-foreground">
                            24/7 access to global research databases and
                            high-speed campus-wide Wi-Fi.
                          </div>
                        </div>
                      </li>
                      <li className="flex items-start gap-4">
                        <BadgeCheck className="text-brand w-6 h-6 shrink-0 mt-1" />
                        <div>
                          <div className="font-bold text-foreground">
                            Advanced R&D Labs
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Specialized laboratories equipped for multi-disciplinary
                            scientific research.
                          </div>
                        </div>
                      </li>
                      <li className="flex items-start gap-4">
                        <BadgeCheck className="text-brand w-6 h-6 shrink-0 mt-1" />
                        <div>
                          <div className="font-bold text-foreground">
                            Holistic Development
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Sports complexes, auditoriums, and creative studios
                            for all-round growth.
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="md:w-1/2 grid grid-cols-2 gap-4">
                    <img
                      className="rounded-2xl h-64 w-full object-cover shadow-lg"
                      alt="Students studying in a modern light-filled library"
                      src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2940&auto=format&fit=crop"
                    />
                    <img
                      className="rounded-2xl h-64 w-full object-cover shadow-lg mt-8"
                      alt="A large academic lecture hall"
                      src="https://images.unsplash.com/photo-1577415124269-b911f140e3eb?q=80&w=2940&auto=format&fit=crop"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
    <Footer/>
    </>
  );
}