import React from "react";
import { 
  Search, 
  Calendar, 
  Cpu, 
  Wrench, 
  Globe, 
  Filter, 
  TrendingUp, 
  Zap, 
  Star, 
  Briefcase, 
  Code, 
  Landmark, 
  Brain, 
  Mail, 
  Network, 
  ChevronDown,
  Rocket,
  Cloud,
  Database,
  TerminalSquare
} from "lucide-react";
import Footer from "@/components/layout/footer/footer";
import Nav from "@/components/layout/nav/nav";

export default function AlumniDiscovery() {
  // Alumni Data Array to easily manage and add more content
  const alumniList = [
    {
      id: 1,
      name: "Arjun Malhotra",
      batch: "2018",
      role: "Senior Product Designer at Google",
      location: "Active now",
      badge: { text: "TRENDING", icon: <Zap className="w-3 h-3 fill-current" />, style: "bg-brand/90 text-primary-foreground" },
      icon: <Briefcase className="text-brand w-5 h-5" />,
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 2,
      name: "Priya Sharma",
      batch: "2020",
      role: "Software Engineer at Microsoft",
      location: "Mentoring",
      badge: { text: "MOST ENGAGED", icon: <Star className="w-3 h-3 fill-current" />, style: "bg-yellow-500 text-white" },
      icon: <Code className="text-brand w-5 h-5" />,
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 3,
      name: "Rohit Verma",
      batch: "2016",
      role: "Investment Banker at JP Morgan",
      location: "London, UK",
      badge: null,
      icon: <Landmark className="text-brand w-5 h-5" />,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 4,
      name: "Sneha Gupta",
      batch: "2019",
      role: "AI Researcher at Adobe",
      location: "Research Hub",
      badge: null,
      icon: <Brain className="text-brand w-5 h-5" />,
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 5,
      name: "Kabir Singh",
      batch: "2015",
      role: "Founder & CEO at TechNova",
      location: "Hiring",
      badge: { text: "FOUNDER", icon: <Rocket className="w-3 h-3 fill-current" />, style: "bg-foreground text-background" },
      icon: <TerminalSquare className="text-brand w-5 h-5" />,
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 6,
      name: "Aisha Patel",
      batch: "2021",
      role: "Frontend Developer at Vercel",
      location: "Remote",
      badge: { text: "NEW ROLE", icon: <Star className="w-3 h-3 fill-current" />, style: "bg-green-500 text-white" },
      icon: <Globe className="text-brand w-5 h-5" />,
      image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 7,
      name: "Rohan Desai",
      batch: "2017",
      role: "Cloud Architect at AWS",
      location: "Seattle, USA",
      badge: null,
      icon: <Cloud className="text-brand w-5 h-5" />,
      image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 8,
      name: "Meera Reddy",
      batch: "2022",
      role: "Data Scientist at Netflix",
      location: "Active now",
      badge: null,
      icon: <Database className="text-brand w-5 h-5" />,
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop",
    }
  ];

  return (
    <>
    <Nav/>
    <div className="bg-background text-foreground antialiased font-sans min-h-screen selection:bg-brand/10 selection:text-brand mt-20">
      
      {/* Custom Scrollbar Styles for the Filter Row */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .custom-scrollbar::-webkit-scrollbar { height: 4px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }
        `
      }} />

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        
        {/* Header Console */}
        <div className="mb-16 text-center space-y-8">
          <div className="max-w-3xl mx-auto space-y-4">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground">
              Discovery Console
            </h1>
            <p className="text-lg text-muted-foreground font-light leading-relaxed">
              Instantly explore the global Radharaman Group of Institutes (RGI) network. 
              Start typing to find alumni by role, company, or interests.
            </p>
          </div>
          
          {/* Search Input */}
          <div className="relative max-w-2xl mx-auto group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <Search className="text-brand w-6 h-6" />
            </div>
            <input 
              className="w-full bg-card border border-border h-20 pl-16 pr-8 rounded-[2rem] text-xl shadow-2xl shadow-brand/5 focus:outline-none focus:ring-4 focus:ring-brand/10 transition-all placeholder:text-muted-foreground/50 text-foreground" 
              placeholder="Search by name, role, or company..." 
              type="text" 
            />
            <div className="absolute right-6 top-6">
              <kbd className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-muted text-muted-foreground text-xs font-bold border border-border">
                <span className="text-lg leading-none">⌘</span> K
              </kbd>
            </div>
          </div>
          
          {/* Filters Row */}
          <div className="flex flex-col items-center gap-4 mt-8">
            <div className="flex flex-wrap justify-center gap-3 overflow-x-auto pb-2 px-4 custom-scrollbar max-w-5xl">
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand text-primary-foreground font-semibold text-sm shadow-md hover:bg-brand/90 transition-all">
                <Calendar className="w-4 h-4" />
                All Batches
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-card border border-border text-foreground font-medium text-sm hover:border-brand hover:text-brand transition-all">
                Class of 2024
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-card border border-border text-foreground font-medium text-sm hover:border-brand hover:text-brand transition-all">
                Class of 2023
              </button>
              <div className="w-px h-8 bg-border mx-2 hidden sm:block"></div>
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-card border border-border text-foreground font-medium text-sm hover:border-brand hover:text-brand transition-all">
                <Cpu className="w-4 h-4" />
                Computer Science
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-card border border-border text-foreground font-medium text-sm hover:border-brand hover:text-brand transition-all">
                <Wrench className="w-4 h-4" />
                Mechanical
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-card border border-border text-foreground font-medium text-sm hover:border-brand hover:text-brand transition-all">
                <Globe className="w-4 h-4" />
                Remote Only
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-card border border-border text-foreground font-medium text-sm hover:border-brand hover:text-brand transition-all">
                <Filter className="w-4 h-4" />
                More Filters
              </button>
            </div>
          </div>
        </div>

        {/* Trending Section */}
        <div className="space-y-12">
          <div className="flex items-center justify-between border-b border-border pb-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="text-brand w-6 h-6" />
              <h2 className="text-xl font-bold text-foreground">Trending Professionals</h2>
            </div>
            <p className="text-sm text-muted-foreground font-medium">Showing 1,284 Alumni</p>
          </div>
          
          {/* Dynamic Grid mapped from alumniList */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {alumniList.map((alumni) => (
              <div 
                key={alumni.id} 
                className="group relative bg-card rounded-[2rem] p-5 shadow-sm hover:shadow-2xl transition-all duration-300 border border-border hover:border-brand/30 overflow-hidden flex flex-col justify-between"
              >
                {/* Optional Badge */}
                {alumni.badge && (
                  <div className="absolute top-8 left-8 z-10">
                    <span className={`flex items-center gap-1 text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-sm shadow-lg ${alumni.badge.style}`}>
                      {alumni.badge.icon}
                      {alumni.badge.text}
                    </span>
                  </div>
                )}
                
                {/* Profile Image with Hover Overlay */}
                <div className="relative h-64 mb-6 rounded-2xl overflow-hidden bg-muted">
                  <img 
                    alt={`${alumni.name} profile portrait`} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    src={alumni.image} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <button className="w-full bg-background text-foreground py-3 rounded-xl font-bold text-sm hover:bg-muted transition-colors">
                      View Full Profile
                    </button>
                  </div>
                </div>
                
                {/* Details */}
                <div className="space-y-4 flex-1 flex flex-col justify-end">
                  <div>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-brand transition-colors">
                      {alumni.name}
                    </h3>
                    <p className="text-xs font-bold text-brand uppercase tracking-wider mt-1">
                      Batch of {alumni.batch}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-2xl border border-border/50">
                    <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center shadow-sm shrink-0">
                      {alumni.icon}
                    </div>
                    <p className="text-xs font-semibold leading-snug text-foreground">
                      {alumni.role}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <div className="flex gap-3">
                      <Mail className="text-muted-foreground w-4 h-4 hover:text-brand cursor-pointer transition-colors" />
                      <Network className="text-muted-foreground w-4 h-4 hover:text-brand cursor-pointer transition-colors" />
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">
                      {alumni.location}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Load More Action */}
          <div className="flex justify-center py-12">
            <button className="flex items-center gap-3 bg-card border border-border px-10 py-4 rounded-full font-bold text-sm hover:bg-brand hover:text-primary-foreground hover:border-brand transition-all shadow-sm hover:shadow-brand/20 group">
              Explore More Alumni
              <ChevronDown className="group-hover:translate-y-1 transition-transform w-5 h-5" />
            </button>
          </div>
        </div>

      </main>
    </div>
    <Footer/>
    </>
  );
}