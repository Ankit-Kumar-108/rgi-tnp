import React from "react";
import { Star, Building2, BadgeCheck, Quote, GraduationCap } from "lucide-react";
import Footer from "@/components/layout/footer/footer";
import Nav from "@/components/layout/nav/nav";

export default function Testimonials() {
  return (
    <>
    <Nav/>
    <div className="bg-background text-foreground antialiased font-sans flex flex-col min-h-screen selection:bg-brand/10 selection:text-brand">
      <main className="flex-1 w-full pt-20 pb-24">
        
        {/* Hero Section: Featured Testimonials */}
        <section className="max-w-7xl mx-auto px-6 md:px-8 mb-20">
          <div className="mb-12">
            <span className="inline-block bg-brand/10 text-brand text-sm font-bold tracking-widest uppercase px-4 py-1 rounded-full mb-4">
              Voices of Excellence
            </span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.9] text-foreground mb-6">
              What Our Community <br />
              <span className="text-brand">Says.</span>
            </h1>
          </div>

          {/* Bento Featured Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
            {/* Featured Alumni (Large) */}
            <div className="md:col-span-8 relative overflow-hidden rounded-[2rem] group bg-card shadow-xl border border-border">
              <img
                alt="Success Story Alumni"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2788&auto=format&fit=crop"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-brand px-3 py-1 rounded-full text-xs font-bold text-primary-foreground uppercase tracking-wider">
                    Alumni Spotlight
                  </span>
                  <span className="flex items-center text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </span>
                </div>
                <blockquote className="text-2xl md:text-4xl font-bold text-background mb-6 leading-tight italic">
                  "The curriculum at RGI wasn't just about learning code;
                  it was about building the mindset of a leader. Three years later,
                  I'm leading a team of 40 at a Fortune 500 company."
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full border-2 border-brand overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      alt="Small alumni avatar"
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop"
                    />
                  </div>
                  <div>
                    <p className="text-background font-bold text-lg">
                      Dr. Elena Rodriguez
                    </p>
                    <p className="text-background/70 text-sm">
                      CSE Class of '18 • Senior VP of Tech, Global Solutions
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Student & Recruiter Stack */}
            <div className="md:col-span-4 flex flex-col gap-6">
              {/* Recruiter */}
              <div className="flex-1 relative overflow-hidden rounded-[2rem] group bg-brand p-8 text-primary-foreground shadow-lg">
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-background/20 rounded-2xl backdrop-blur-md">
                        <Building2 className="w-8 h-8" />
                      </div>
                      <div className="flex items-center gap-1 bg-background/10 px-2 py-1 rounded-lg">
                        <BadgeCheck className="w-3 h-3 fill-current" />
                        <span className="text-[10px] font-bold uppercase tracking-tighter">
                          Verified Recruiter
                        </span>
                      </div>
                    </div>
                    <p className="text-xl font-bold leading-snug">
                      "We hire from here because we know we're getting talent that's
                      day-one ready."
                    </p>
                  </div>
                  <div className="mt-4">
                    <p className="font-bold text-sm">Marcus Chen</p>
                    <p className="text-primary-foreground/80 text-xs">
                      Head of Talent, Vertex Dynamics
                    </p>
                  </div>
                </div>
                <div className="absolute -right-8 -bottom-8 opacity-10">
                  <Quote className="w-48 h-48" />
                </div>
              </div>

              {/* Student */}
              <div className="flex-1 relative overflow-hidden rounded-[2rem] bg-muted p-8 border border-border">
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <div className="text-brand mb-4">
                      <GraduationCap className="w-10 h-10" />
                    </div>
                    <p className="text-foreground font-semibold italic text-lg leading-relaxed">
                      "The placement support was incredible. I had three offers
                      before finals!"
                    </p>
                  </div>
                  <div className="flex items-center gap-3 mt-6">
                    <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-brand font-bold">
                      SP
                    </div>
                    <div>
                      <p className="font-bold text-sm text-foreground">Sarah Parker</p>
                      <p className="text-muted-foreground text-xs">
                        B.Tech Mechanical '24
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Tabs */}
        <section className="max-w-7xl mx-auto px-6 md:px-8 mb-16">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 p-2 bg-muted/50 backdrop-blur-md rounded-2xl w-fit mx-auto border border-border">
            <button className="px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 bg-brand text-primary-foreground shadow-lg shadow-brand/20">
              All Feedback
            </button>
            <button className="px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 text-muted-foreground hover:bg-background hover:text-foreground">
              Alumni
            </button>
            <button className="px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 text-muted-foreground hover:bg-background hover:text-foreground">
              Recruiters
            </button>
            <button className="px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 text-muted-foreground hover:bg-background hover:text-foreground">
              Students
            </button>
          </div>
        </section>

        {/* Feedback Masonry Grid */}
        <section className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            
            {/* Recruiter Card */}
            <div className="break-inside-avoid bg-card p-8 rounded-[2rem] shadow-sm border border-border hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center font-black text-muted-foreground group-hover:text-brand transition-colors">
                  V
                </div>
                <div className="flex items-center gap-1 text-brand">
                  <BadgeCheck className="w-3 h-3 fill-current" />
                  <span className="text-[10px] font-bold uppercase">Recruiter</span>
                </div>
              </div>
              <div className="flex mb-4 text-yellow-500">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
              </div>
              <p className="text-foreground font-medium leading-relaxed mb-6">
                "The technical proficiency of the graduates here is consistently
                higher than other institutes in the region. Their problem-solving
                skills are impressive."
              </p>
              <div className="pt-6 border-t border-border">
                <h4 className="font-bold text-foreground">David Wilson</h4>
                <p className="text-muted-foreground text-xs">
                  Director of Engineering, Innovate Labs
                </p>
              </div>
            </div>

            {/* Alumni Card */}
            <div className="break-inside-avoid bg-muted/50 p-8 rounded-[2rem] shadow-sm border border-border hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <img
                  className="w-12 h-12 rounded-full object-cover"
                  alt="Alumni profile photo"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop"
                />
                <div className="flex-1">
                  <h4 className="font-bold text-foreground text-sm">
                    Julian Vance
                  </h4>
                  <p className="text-brand text-[10px] font-bold uppercase tracking-wider">
                    ECE Class of '21
                  </p>
                </div>
                <div className="flex items-center gap-1 text-brand/40">
                  <BadgeCheck className="w-4 h-4 fill-current" />
                </div>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed italic">
                "Beyond the books, the alumni network here is a powerhouse. I got
                my current role at Tesla through a connection I made during a guest
                lecture series."
              </p>
            </div>

            {/* Student Card */}
            <div className="break-inside-avoid bg-card p-8 rounded-[2rem] shadow-sm border border-border hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-l-4 border-l-brand">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <span className="bg-brand/10 text-brand text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
                    Current Student
                  </span>
                </div>
              </div>
              <p className="text-foreground font-semibold text-lg leading-tight mb-4">
                "The hands-on labs changed my perspective on engineering. It's not
                just theory; we're building real solutions."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-muted overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    alt="Student avatar"
                    src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=100&auto=format&fit=crop"
                  />
                </div>
                <div>
                  <p className="font-bold text-xs text-foreground">
                    Liam O'Conner
                  </p>
                  <p className="text-muted-foreground text-[10px]">
                    Information Technology '25
                  </p>
                </div>
              </div>
            </div>

            {/* Recruiter Card Dark */}
            <div className="break-inside-avoid bg-foreground p-8 rounded-[2rem] shadow-xl text-background hover:scale-[1.02] transition-all duration-300">
              <div className="flex justify-between items-center mb-6">
                <div className="text-lg font-black tracking-tighter uppercase">
                  Nexa Group
                </div>
                <BadgeCheck className="w-5 h-5 text-brand fill-current" />
              </div>
              <p className="text-background/80 text-sm leading-relaxed mb-6">
                "RGI graduates possess a unique blend of technical depth and
                soft skills. They integrate into our corporate culture seamlessly
                and start contributing immediately."
              </p>
              <div className="flex items-center gap-1 mb-1 text-yellow-500">
                <Star className="w-3 h-3 fill-current" />
                <Star className="w-3 h-3 fill-current" />
                <Star className="w-3 h-3 fill-current" />
                <Star className="w-3 h-3 fill-current" />
                <Star className="w-3 h-3 fill-current" />
              </div>
              <p className="font-bold text-sm">Amara K.</p>
              <p className="text-background/60 text-[10px]">
                Talent Acquisition Lead
              </p>
            </div>

            {/* Alumni Card */}
            <div className="break-inside-avoid bg-card p-8 rounded-[2rem] shadow-sm border border-border hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center text-brand font-black">
                  JS
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-foreground text-sm">
                    Jasmine Smith
                  </h4>
                  <p className="text-brand text-[10px] font-bold uppercase tracking-wider">
                    Bio-Tech Class of '15
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                "The research facilities here were world-class even a decade ago.
                It provided the foundation for my PhD and subsequent work in
                genetic engineering."
              </p>
            </div>

            {/* Student Card */}
            <div className="break-inside-avoid bg-brand/10 p-8 rounded-[2rem] shadow-sm border border-brand/20 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
              <p className="text-brand font-bold text-lg leading-snug mb-6">
                "I never thought I'd be able to win a national hackathon, but the
                mentorship here pushed me past my limits."
              </p>
              <div className="flex items-center gap-3">
                <img
                  className="w-10 h-10 rounded-full object-cover grayscale"
                  alt="Smiling female student"
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop"
                />
                <div>
                  <p className="font-bold text-xs text-foreground">
                    Priya Sharma
                  </p>
                  <p className="text-muted-foreground text-[10px]">
                    Data Science '23
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Load More Action */}
          <div className="mt-16 text-center">
            <button className="bg-background border-2 border-brand/20 text-brand px-12 py-4 rounded-2xl font-bold hover:bg-brand hover:text-primary-foreground transition-all duration-300 shadow-sm hover:shadow-brand/30">
              Load More Stories
            </button>
          </div>
        </section>
      </main>
    </div>
    <Footer/>
    </>
  );
}