import React from "react";
import { ArrowLeft, ArrowRight, ChevronDown, MessageCircle } from "lucide-react";
import Footer from "@/components/layout/footer/footer";
import Nav from "@/components/layout/nav/nav";

export default function InspirationalPortal() {
  return (
    <>
    <Nav/>
    <div className="bg-background text-foreground antialiased font-sans flex flex-col min-h-screen selection:bg-brand/10 selection:text-brand overflow-x-hidden mt-20 ">
      
      {/* Local styles for the carousel animation */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .carousel-track {
              display: flex;
              width: 300%;
              animation: slide 15s infinite ease-in-out;
          }
          @keyframes slide {
              0%, 30% { transform: translateX(0); }
              33%, 63% { transform: translateX(-33.33%); }
              66%, 96% { transform: translateX(-66.66%); }
              100% { transform: translateX(0); }
          }
        `
      }} />

      <main className="flex-1 w-full">
        {/* Carousel Hero Section */}
        <section className="relative h-[600px] md:h-[700px] overflow-hidden bg-zinc-950">
          <div className="carousel-track h-full">
            {/* Slide 1 */}
            <div className="w-1/3 h-full relative shrink-0">
              <img
                alt="Featured Story 1"
                className="w-full h-full object-cover opacity-70"
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2940&auto=format&fit=crop"
              />
              <div className="absolute inset-0 flex flex-col justify-center items-start px-8 md:px-24 bg-gradient-to-r from-black/80 to-transparent">
                <span className="text-brand font-bold tracking-[0.3em] text-xs mb-4 uppercase">
                  Featured Story
                </span>
                <h2 className="text-white text-4xl md:text-6xl font-black max-w-2xl leading-tight mb-6">
                  Breaking Boundaries: From Campus to Global Tech.
                </h2>
                <button className="bg-brand text-primary-foreground px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-opacity-90 transition-all">
                  Read Story
                </button>
              </div>
            </div>
            
            {/* Slide 2 */}
            <div className="w-1/3 h-full relative shrink-0">
              <img
                alt="Featured Story 2"
                className="w-full h-full object-cover opacity-70"
                src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=2940&auto=format&fit=crop"
              />
              <div className="absolute inset-0 flex flex-col justify-center items-start px-8 md:px-24 bg-gradient-to-r from-black/80 to-transparent">
                <span className="text-brand font-bold tracking-[0.3em] text-xs mb-4 uppercase">
                  Leadership Spotlight
                </span>
                <h2 className="text-white text-4xl md:text-6xl font-black max-w-2xl leading-tight mb-6">
                  Empowering the Next Generation of Innovators.
                </h2>
                <button className="bg-brand text-primary-foreground px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-opacity-90 transition-all">
                  Meet the Team
                </button>
              </div>
            </div>
            
            {/* Slide 3 */}
            <div className="w-1/3 h-full relative shrink-0">
              <img
                alt="Featured Story 3"
                className="w-full h-full object-cover opacity-70"
                src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2940&auto=format&fit=crop"
              />
              <div className="absolute inset-0 flex flex-col justify-center items-start px-8 md:px-24 bg-gradient-to-r from-black/80 to-transparent">
                <span className="text-brand font-bold tracking-[0.3em] text-xs mb-4 uppercase">
                  Success Stories
                </span>
                <h2 className="text-white text-4xl md:text-6xl font-black max-w-2xl leading-tight mb-6">
                  The Blueprint for Professional Excellence.
                </h2>
                <button className="bg-brand text-primary-foreground px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-opacity-90 transition-all">
                  Explore Alumni
                </button>
              </div>
            </div>
          </div>
          
          {/* Carousel Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
            <div className="w-2 h-2 rounded-full bg-white"></div>
            <div className="w-2 h-2 rounded-full bg-white/40"></div>
            <div className="w-2 h-2 rounded-full bg-white/40"></div>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="max-w-7xl mx-auto px-8 py-24 text-center">
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-foreground mb-8 leading-[0.9]">
            Your Dream,<br /> Our <span className="text-brand">Launchpad.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-muted-foreground text-xl leading-relaxed mb-12 font-medium opacity-80">
            For the dreamers, the doers, and the future-makers. Discover the path
            carved by those who stood where you are today at Radharaman Group of Institutes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button className="bg-brand text-primary-foreground px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl shadow-brand/30 hover:-translate-y-1 transition-all">
              Start Your Journey
            </button>
            <button className="bg-background border-2 border-border text-foreground px-10 py-5 rounded-2xl font-bold text-lg hover:bg-muted transition-all">
              Watch Virtual Tour
            </button>
          </div>
        </section>

        {/* Stories Grid Section */}
        <section className="max-w-7xl mx-auto px-8 pb-32">
          <div className="flex items-end justify-between mb-16 border-b border-border pb-8">
            <div className="max-w-xl">
              <h2 className="text-4xl font-black mb-4 text-foreground">
                The Impact of Choice
              </h2>
              <p className="text-muted-foreground">
                Real stories, real tips, real growth. Explore the life that awaits
                you at RGI.
              </p>
            </div>
            <div className="hidden md:flex gap-4">
              <button className="p-3 rounded-full border border-border text-muted-foreground hover:bg-brand hover:text-primary-foreground hover:border-brand transition-all">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <button className="p-3 rounded-full border border-border text-muted-foreground hover:bg-brand hover:text-primary-foreground hover:border-brand transition-all">
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Story Card 1 */}
            <div className="group relative bg-card rounded-[2.5rem] overflow-hidden shadow-xl border border-border">
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  alt="Students celebrating"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2941&auto=format&fit=crop"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-12 left-10 right-10">
                  <div className="bg-brand/90 backdrop-blur-md px-4 py-2 rounded-lg inline-block text-primary-foreground text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
                    Success Tip
                  </div>
                  <p className="text-white text-2xl font-light leading-relaxed italic">
                    "Focus on consistency over intensity. The small daily coding
                    challenges were my biggest breakthrough."
                  </p>
                  <div className="mt-6 flex items-center gap-4">
                    <div className="h-[1px] w-8 bg-brand"></div>
                    <span className="text-white/80 text-sm font-bold uppercase tracking-widest">
                      Anita R., Batch of 2023
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Story Card 2 */}
            <div className="group relative bg-card rounded-[2.5rem] overflow-hidden shadow-xl border border-border">
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  alt="Student with offer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2940&auto=format&fit=crop"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-12 left-10 right-10">
                  <div className="bg-brand/90 backdrop-blur-md px-4 py-2 rounded-lg inline-block text-primary-foreground text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
                    Student Voice
                  </div>
                  <p className="text-white text-2xl font-light leading-relaxed italic">
                    "Don't just learn to code, learn to solve. The hackathons at RGI changed my entire perspective on engineering."
                  </p>
                  <div className="mt-6 flex items-center gap-4">
                    <div className="h-[1px] w-8 bg-brand"></div>
                    <span className="text-white/80 text-sm font-bold uppercase tracking-widest">
                      Siddharth M., Senior SDE
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Story Card 3 */}
            <div className="group relative bg-card rounded-[2.5rem] overflow-hidden shadow-xl border border-border">
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  alt="Collaboration"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2940&auto=format&fit=crop"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-12 left-10 right-10">
                  <div className="bg-brand/90 backdrop-blur-md px-4 py-2 rounded-lg inline-block text-primary-foreground text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
                    Peer Advice
                  </div>
                  <p className="text-white text-2xl font-light leading-relaxed italic">
                    "Build a network before you need one. Your peers are your
                    biggest assets in the professional world."
                  </p>
                  <div className="mt-6 flex items-center gap-4">
                    <div className="h-[1px] w-8 bg-brand"></div>
                    <span className="text-white/80 text-sm font-bold uppercase tracking-widest">
                      The Innovators Club
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Story Card 4 */}
            <div className="group relative bg-card rounded-[2.5rem] overflow-hidden shadow-xl border border-border">
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  alt="Student workshop"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2940&auto=format&fit=crop"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-12 left-10 right-10">
                  <div className="bg-brand/90 backdrop-blur-md px-4 py-2 rounded-lg inline-block text-primary-foreground text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
                    Motivation
                  </div>
                  <p className="text-white text-2xl font-light leading-relaxed italic">
                    "The labs are open 24/7 because inspiration doesn't have a
                    schedule. Use that freedom to create."
                  </p>
                  <div className="mt-6 flex items-center gap-4">
                    <div className="h-[1px] w-8 bg-brand"></div>
                    <span className="text-white/80 text-sm font-bold uppercase tracking-widest">
                      Karan V., Tech Lead
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Load More Button */}
          <div className="mt-20 flex flex-col items-center">
            <p className="text-muted-foreground mb-8 text-center font-medium">
              Want to see more of what life looks like here?
            </p>
            <button className="flex items-center gap-3 px-12 py-5 bg-brand text-primary-foreground rounded-full font-bold shadow-2xl shadow-brand/40 hover:scale-105 transition-all">
              Load More Stories
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>
        </section>
      </main>

      {/* Floating Action Button */}
      <button className="fixed bottom-10 right-10 w-16 h-16 bg-brand text-primary-foreground rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50">
        <MessageCircle className="w-8 h-8" />
      </button>

    </div>
    <Footer/>
    </>
  );
}