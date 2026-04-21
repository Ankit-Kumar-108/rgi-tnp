import React from "react";
import { 
  TrendingUp, 
  GraduationCap, 
  Medal, 
  Award, 
  Zap, 
  Users, 
  Trophy, 
  Activity 
} from "lucide-react";
import Footer from "@/components/layout/footer/footer";
import Nav from "@/components/layout/nav/nav";

export default function YouthHub() {
  return (
    <>
    <Nav/>
    <style dangerouslySetInnerHTML={{__html: `
      .ach-theme {
        --ach-primary: #a83df2;
        --ach-primary-bright: #c471ff;
        --ach-secondary: #ff4d8d;
        --ach-accent: #00f5d4;
        --ach-surface: #fdf8ff;
        --ach-on-surface: #2d1b4d;
        --ach-vihan: #6a00f4;
      }
      .dark .ach-theme {
        --ach-surface: #1a0f2e;
        --ach-on-surface: #fdf8ff;
      }
    `}} />
    <div className="ach-theme mt-17 bg-[var(--ach-surface)] text-[var(--ach-on-surface)] font-sans selection:bg-[var(--ach-primary-bright)] selection:text-white overflow-x-hidden">
      <main className="flex-1">
        
        {/* Hero Section */}
        <section className="px-6 md:px-12 py-12">
          <div className="relative rounded-[2.5rem] overflow-hidden bg-[var(--ach-on-surface)] min-h-[600px] flex items-center p-8 md:p-20">
            <div className="absolute inset-0 opacity-60">
              <img
                alt="Campus"
                className="w-full h-full object-cover"
                src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2940&auto=format&fit=crop"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--ach-on-surface)] via-[var(--ach-on-surface)]/80 to-transparent"></div>
            
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 mb-8">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--ach-accent)] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--ach-accent)]"></span>
                </span>
                <span className="text-white text-xs font-bold uppercase tracking-widest">
                  Admissions Open {new Date().getFullYear()}
                </span>
              </div>
              <h1 className="text-white text-6xl md:text-8xl font-black leading-[0.9] mb-6">
                BEYOND THE <br /> <span className="text-[var(--ach-primary-bright)]">ORDINARY.</span>
              </h1>
              <p className="text-white/80 text-xl md:text-2xl font-medium max-w-xl mb-10 leading-relaxed">
                Where academic excellence meets unstoppable youthful energy. Join
                the legacy of Bhopal's brightest minds.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-gradient-to-br from-[var(--ach-primary)] to-[var(--ach-secondary)] text-white px-10 py-5 rounded-full text-lg font-black shadow-2xl hover:scale-105 transition-transform">
                  Start Your Journey
                </button>
                <button className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-10 py-5 rounded-full text-lg font-black hover:bg-white/20 transition-all">
                  View 2026 Report
                </button>
              </div>
            </div>

            {/* Floating Stats */}
            <div className="absolute bottom-12 right-12 hidden xl:flex flex-col gap-4">
              <div className="bg-white dark:bg-[var(--ach-on-surface)] p-6 rounded-3xl shadow-2xl border border-[var(--ach-primary)]/10 rotate-3 flex items-center gap-4">
                <span className="text-4xl font-black text-[var(--ach-primary)]">50+</span>
                <p className="text-xs font-bold uppercase text-[var(--ach-on-surface)]/60 dark:text-[var(--ach-surface)]/60">
                  Awards
                  <br />
                  Won
                </p>
              </div>
              <div className="bg-[var(--ach-accent)] p-6 rounded-3xl shadow-2xl -rotate-2 flex items-center gap-4 text-[#2d1b4d]">
                <span className="text-4xl font-black">15k+</span>
                <p className="text-xs font-bold uppercase opacity-80">
                  Success
                  <br />
                  Stories
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Academic Clout Section */}
        <section className="px-6 md:px-12 py-20">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-[var(--ach-on-surface)] mb-4">
                Academic <span className="text-[var(--ach-primary)]">Clout.</span>
              </h2>
              <p className="text-[var(--ach-on-surface)]/60 text-lg font-medium">
                We don't just study, we dominate the leaderboard.
              </p>
            </div>
            <a
              className="group flex items-center gap-3 bg-[var(--ach-primary)]/10 text-[var(--ach-primary)] px-6 py-3 rounded-full font-bold hover:bg-[var(--ach-primary)] hover:text-white transition-all cursor-pointer"
            >
              University Rankers{" "}
              <TrendingUp className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[var(--ach-primary)]/5 p-8 md:p-10 rounded-2xl md:rounded-[2.5rem] border border-[var(--ach-primary)]/10 flex flex-col justify-between transition-all duration-300 hover:shadow-[var(--shadow-lg)]">
              <GraduationCap className="w-16 h-16 text-[var(--ach-primary)] mb-12" />
              <div>
                <h3 className="text-3xl font-black mb-4 text-[var(--ach-on-surface)]">
                  RGPV Top 50
                </h3>
                <p className="text-[var(--ach-on-surface)]/70 leading-relaxed mb-6">
                  10 students secured top spots in the university merit list. We
                  keep it 100%.
                </p>
                <span className="inline-block px-4 py-1.5 bg-[var(--ach-primary)] text-white text-xs font-bold rounded-full">
                  Official Rankers
                </span>
              </div>
            </div>
            
            <div className="bg-[var(--ach-secondary)]/5 p-8 md:p-10 rounded-2xl md:rounded-[2.5rem] border border-[var(--ach-secondary)]/10 md:mt-12 flex flex-col justify-between transition-all duration-300 hover:shadow-[var(--shadow-lg)]">
              <Medal className="w-16 h-16 text-[var(--ach-secondary)] mb-12" />
              <div>
                <h3 className="text-3xl font-black mb-4 text-[var(--ach-on-surface)]">
                  Gold Stack
                </h3>
                <p className="text-[var(--ach-on-surface)]/70 leading-relaxed mb-6">
                  2 consecutive gold medals in Civil & CS. Innovation is in our DNA.
                </p>
                <span className="inline-block px-4 py-1.5 bg-[var(--ach-secondary)] text-white text-xs font-bold rounded-full">
                  Top Performers
                </span>
              </div>
            </div>

            <div className="bg-[var(--ach-accent)]/10 p-8 md:p-10 rounded-2xl md:rounded-[2.5rem] border border-[var(--ach-accent)]/20 flex flex-col justify-between transition-all duration-300 hover:shadow-[var(--shadow-lg)]">
              <Award className="w-16 h-16 text-[var(--ach-on-surface)] mb-12" />
              <div>
                <h3 className="text-3xl font-black mb-4 text-[var(--ach-on-surface)]">
                  Best Technical Campus
                </h3>
                <p className="text-[var(--ach-on-surface)]/70 leading-relaxed mb-6">
                  Awarded by State Education Ministry. The absolute peak of
                  campuses in Bhopal.
                </p>
                <span className="inline-block px-4 py-1.5 bg-[var(--ach-on-surface)] text-[var(--ach-surface)] text-xs font-bold rounded-full dark:text-[var(--ach-on-surface)]">
                  State Certified
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* VIHAN Section */}
        <section className="px-6 md:px-12 py-24 bg-[var(--ach-on-surface)] relative overflow-hidden rounded-[4rem] mx-6">
          <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
            {/* Keeping the brand color in the radial gradient to match the theme */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--ach-primary),transparent)] scale-150"></div>
          </div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="inline-block bg-[var(--ach-vihan)] text-white px-6 py-2 rounded-full text-sm font-bold tracking-widest uppercase">
                Major Event: VIHAN 2026
              </div>
              <h2 className="text-6xl md:text-8xl font-black text-white leading-tight">
                VIHAN <br />
                {/* Arbitrary value for the text-stroke effect */}
                <span className="[-webkit-text-stroke:1px_white] text-transparent italic">
                  Technofest
                </span>
              </h2>
              <p className="text-white/70 text-xl font-medium leading-relaxed max-w-xl">
                Experience the ultimate fusion of tech and culture. Held at RGI,
                VIHAN is Central India's biggest technofest featuring robotics,
                workshops, and high-energy hackathons.
              </p>
              
              <div className="bg-white/5 border border-white/10 p-8 rounded-3xl flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-[var(--ach-accent)] flex items-center justify-center text-[#2d1b4d]">
                    <Zap className="w-6 h-6 font-bold" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">
                      50+ Interactive Projects
                    </h4>
                    <p className="text-white/50 text-sm">
                      See innovation in action at the Expo.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-[var(--ach-primary)] flex items-center justify-center text-white">
                    <Users className="w-6 h-6 font-bold" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">
                      Workshop Series
                    </h4>
                    <p className="text-white/50 text-sm">
                      Learn from industry pros and RGI faculty.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6">
                <a
                  className="bg-gradient-to-br from-[var(--ach-primary)] to-[var(--ach-secondary)] text-white px-10 py-5 rounded-full font-black text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-[var(--ach-primary)]/20"
                  href="https://vihan-rgi.vercel.app"
                >
                  Discover More @ rgibhopal.com
                </a>
                <a 
                href="https://vihan-rgi.vercel.app"
                className="bg-white text-[var(--ach-on-surface)] px-10 py-5 rounded-full font-black hover:bg-[var(--ach-accent)] transition-colors">
                  Register Now
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 relative">
              <div className="space-y-6">
                <div className="rounded-3xl overflow-hidden aspect-square shadow-2xl transition-all duration-300 hover:-rotate-1 hover:scale-[1.02] hover:shadow-[var(--ach-primary)]/20 border-4 border-white/10">
                  <img
                    alt="Hackathon"
                    className="w-full h-full object-cover"
                    src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2940&auto=format&fit=crop"
                  />
                </div>
                <div className="bg-[var(--ach-accent)] p-8 rounded-[2.5rem] text-[#2d1b4d] flex flex-col items-center justify-center text-center -rotate-6">
                  <span className="text-5xl font-black">1.5k+</span>
                  <span className="text-sm font-bold uppercase">Participants</span>
                </div>
              </div>
              <div className="space-y-6 pt-12">
                <div className="bg-[var(--ach-primary)] p-8 rounded-[2.5rem] text-white flex flex-col items-center justify-center text-center rotate-3">
                  <span className="text-4xl font-black">50+</span>
                  <span className="text-sm font-bold uppercase">Events</span>
                </div>
                <div className="rounded-3xl overflow-hidden aspect-[3/4] shadow-2xl transition-all duration-300 hover:-rotate-1 hover:scale-[1.02] hover:shadow-[var(--ach-primary)]/20 border-4 border-white/10">
                  <img
                    alt="Cultural Fest"
                    className="w-full h-full object-cover"
                    src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2940&auto=format&fit=crop"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Elite Athletics Section */}
        <section className="px-6 md:px-12 py-24">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-5 flex flex-col justify-center">
              <span className="text-[var(--ach-secondary)] font-black tracking-widest uppercase text-sm mb-4">
                Elite Athletics
              </span>
              <h2 className="text-5xl md:text-7xl font-black text-[var(--ach-on-surface)] mb-8 leading-[0.9]">
                DOMINATE THE <span className="text-[var(--ach-secondary)]">FIELD.</span>
              </h2>
              <p className="text-[var(--ach-on-surface)]/60 text-xl font-medium mb-12 leading-relaxed">
                Physical grit meets mental resilience. Our teams are consistently
                ranked top in zonal and national circuits.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-5 md:p-6 bg-card rounded-2xl md:rounded-3xl shadow-[var(--shadow-sm)] border-l-8 border-[var(--ach-secondary)] transition-shadow duration-300 hover:shadow-[var(--shadow-lg)]">
                  <Trophy className="w-6 h-6 text-[var(--ach-secondary)]" />
                  <div>
                    <h5 className="font-black text-[var(--ach-on-surface)] dark:text-[var(--ach-surface)]">
                      Cricket Zonal Kings
                    </h5>
                    <p className="text-[var(--ach-on-surface)]/50 dark:text-[var(--ach-surface)]/60 text-sm">
                      3 Consecutive Years Undefeated.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-5 md:p-6 bg-card rounded-2xl md:rounded-3xl shadow-[var(--shadow-sm)] border-l-8 border-[var(--ach-accent)] transition-shadow duration-300 hover:shadow-[var(--shadow-lg)]">
                  <Activity className="w-6 h-6 text-[var(--ach-accent)]" />
                  <div>
                    <h5 className="font-black text-[var(--ach-on-surface)] dark:text-[var(--ach-surface)]">
                      Taekwondo Gold
                    </h5>
                    <p className="text-[var(--ach-on-surface)]/50 dark:text-[var(--ach-surface)]/60 text-sm">
                      National Level representation and podium finish.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-span-12 lg:col-span-7 grid grid-cols-2 gap-6 mt-12 lg:mt-0">
              <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl -rotate-2">
                <img
                  alt="Basketball"
                  className="w-full h-full object-cover"
                  src="https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=2942&auto=format&fit=crop"
                />
              </div>
              <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl mt-12 rotate-2">
                <img
                  alt="Track"
                  className="w-full h-full object-cover"
                  src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=2940&auto=format&fit=crop"
                />
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