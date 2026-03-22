import React from "react";
import { 
  Bell, 
  Search, 
  Activity, 
  MoreHorizontal, 
  Plus, 
  Star, 
  Quote, 
  MessageSquare, 
  ChevronRight, 
  Images, 
  Brain 
} from "lucide-react";
import Footer from "@/components/layout/footer/footer";
import Nav from "@/components/layout/nav/nav";

export default function StudentDashboard() {
  return (
    <>
    <Nav/>
    <div className="bg-background text-foreground antialiased font-sans flex flex-col min-h-screen selection:bg-brand/10 selection:text-brand mt-20">

      {/* Main Content */}
      <main className="p-6 lg:p-8 min-h-screen w-full max-w-7xl mx-auto rounded-2xl bg-[radial-gradient(circle_at_top_right,var(--brand)_0%,transparent_20%)] opacity-95">
        
        {/* Welcome Section */}
        <section className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-foreground">
              Hello, Ankit
            </h2>
            <p className="text-muted-foreground font-medium text-sm mt-1">
              Focus on your next milestones. You have 2 action items today.
            </p>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-brand/10 text-brand text-[11px] font-bold rounded-full border border-brand/20">
              Active Applications: 4
            </span>
            <span className="px-3 py-1 bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[11px] font-bold rounded-full">
              Next Deadline: 2d
            </span>
          </div>
        </section>

        {/* Progress Tracker */}
        <section className="mb-10">
          <div className="bg-card p-6 rounded-[2rem] shadow-sm border border-border">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center">
                  <Activity className="text-brand w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">My Progress Tracker</h3>
                  <p className="text-xs text-muted-foreground font-medium">
                    Tracking 4 active application paths
                  </p>
                </div>
              </div>
              <button className="text-muted-foreground hover:text-brand transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="p-4 bg-muted/30 rounded-2xl border border-border group hover:border-brand/30 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-sm font-bold text-foreground">Microsoft</span>
                  <span className="bg-green-500/10 text-green-600 dark:text-green-400 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    Shortlisted
                  </span>
                </div>
                <div className="w-full bg-border h-1 rounded-full overflow-hidden">
                  <div className="bg-brand h-full w-[75%] rounded-full"></div>
                </div>
                <p className="mt-2 text-[10px] text-muted-foreground font-medium italic">
                  Round 3: System Design
                </p>
              </div>

              <div className="p-4 bg-muted/30 rounded-2xl border border-border group hover:border-brand/30 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-sm font-bold text-foreground">Zomato</span>
                  <span className="bg-muted text-muted-foreground text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    Awaiting Result
                  </span>
                </div>
                <div className="w-full bg-border h-1 rounded-full overflow-hidden">
                  <div className="bg-muted-foreground/50 h-full w-[40%] rounded-full"></div>
                </div>
                <p className="mt-2 text-[10px] text-muted-foreground font-medium italic">
                  Applied: Oct 15
                </p>
              </div>

              <div className="p-4 bg-muted/30 rounded-2xl border border-border group hover:border-brand/30 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-sm font-bold text-foreground">Amazon</span>
                  <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    In Review
                  </span>
                </div>
                <div className="w-full bg-border h-1 rounded-full overflow-hidden">
                  <div className="bg-brand h-full w-[25%] rounded-full"></div>
                </div>
                <p className="mt-2 text-[10px] text-muted-foreground font-medium italic">
                  Profile Screening
                </p>
              </div>

              <div className="p-4 bg-muted/30 rounded-2xl border border-border border-dashed flex flex-col items-center justify-center text-muted-foreground hover:text-brand hover:bg-brand/5 transition-all cursor-pointer">
                <Plus className="w-6 h-6" />
                <span className="text-[10px] font-bold uppercase tracking-widest mt-1">
                  Add Tracker
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Upcoming Campus Placements */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2 text-foreground">
                Upcoming Campus Placements
                <span className="bg-muted text-muted-foreground text-[10px] font-bold px-2 py-0.5 rounded">
                  Sorted by Deadline
                </span>
              </h3>
              <a className="text-brand text-xs font-bold hover:underline uppercase tracking-widest cursor-pointer">
                Full Calendar
              </a>
            </div>
            
            <div className="space-y-3">
              
              {/* Google */}
              <div className="bg-card p-4 rounded-2xl shadow-sm border border-border flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-card rounded-xl shadow-sm border border-border flex items-center justify-center flex-shrink-0">
                  <img 
                    alt="Google logo" 
                    className="w-6 h-6 object-contain grayscale" 
                    src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" 
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-foreground">Google</h4>
                    <span className="text-[9px] font-bold bg-brand/10 text-brand px-1.5 py-0.5 rounded">
                      Dream Co.
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Software Engineering Intern</p>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-bold text-destructive uppercase tracking-tighter">
                    Closes in 2 days
                  </p>
                  <p className="text-[10px] text-muted-foreground font-medium">Oct 24, 2026</p>
                </div>
                <button className="bg-brand text-primary-foreground px-4 py-2 rounded-xl text-xs font-bold transition-transform active:scale-95 ml-2 hover:bg-brand/90">
                  Apply
                </button>
              </div>

              {/* Adobe */}
              <div className="bg-brand p-4 rounded-2xl shadow-sm flex items-center gap-4 text-primary-foreground">
                <div className="w-12 h-12 bg-background/20 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-md">
                  <Star className="w-6 h-6 text-primary-foreground fill-current" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm">Adobe</h4>
                    <span className="text-[9px] font-bold bg-background/20 px-1.5 py-0.5 rounded">
                      Priority
                    </span>
                  </div>
                  <p className="text-xs text-primary-foreground/80">Product Design Lead</p>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-bold text-background uppercase tracking-tighter">
                    Immediate Interview
                  </p>
                  <p className="text-[10px] text-primary-foreground/70 font-medium">
                    Oct 26, 2026
                  </p>
                </div>
                <button className="bg-background text-brand px-4 py-2 rounded-xl text-xs font-bold ml-2 hover:bg-muted transition-colors">
                  Register
                </button>
              </div>

              {/* Amazon */}
              <div className="bg-card p-4 rounded-2xl shadow-sm border border-border flex items-center gap-4 hover:shadow-md transition-shadow opacity-80">
                <div className="w-12 h-12 bg-foreground rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-background font-black text-xs">A</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-foreground">Amazon</h4>
                  <p className="text-xs text-muted-foreground">Cloud Support Engineer</p>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                    Starts in 6 days
                  </p>
                  <p className="text-[10px] text-muted-foreground font-medium">Oct 28, 2026</p>
                </div>
                <button className="border border-border text-foreground px-4 py-2 rounded-xl text-xs font-bold ml-2 hover:bg-muted transition-colors">
                  Details
                </button>
              </div>
              
            </div>
          </div>

          {/* Right Sidebar Widgets */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            
            {/* Quote Widget */}
            <div className="bg-gradient-to-br from-brand/20 to-background p-6 rounded-[2rem] border border-brand/10 relative overflow-hidden h-48 flex flex-col justify-center">
              <Quote className="text-brand/10 absolute -top-4 -right-4 w-32 h-32 rotate-12 fill-current" />
              <p className="text-lg font-semibold text-foreground leading-tight relative z-10 italic">
                "The only way to do great work is to love what you do."
              </p>
              <div className="mt-4 flex items-center gap-2">
                <div className="h-0.5 w-8 bg-brand/30"></div>
                <p className="text-[10px] font-bold text-brand uppercase tracking-widest">
                  Steve Jobs
                </p>
              </div>
            </div>

            {/* Feedback Widget */}
            <div className="bg-card p-5 rounded-3xl border border-border shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-foreground">Feedback</h3>
                <a className="text-[10px] text-brand font-bold hover:underline uppercase cursor-pointer">
                  History
                </a>
              </div>
              <div className="bg-muted p-3 rounded-xl flex items-center justify-between group cursor-pointer hover:bg-brand/5 transition-colors">
                <div className="flex items-center gap-3">
                  <MessageSquare className="text-brand w-4 h-4" />
                  <span className="text-xs font-medium text-foreground">
                    Pending review for Zomato
                  </span>
                </div>
                <ChevronRight className="text-muted-foreground group-hover:text-brand transition-colors w-5 h-5" />
              </div>
            </div>

            {/* Memories Widget */}
            <div className="bg-card p-5 rounded-3xl border border-border shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-foreground">Memories</h3>
                <Images className="text-muted-foreground w-4 h-4" />
              </div>
              <div className="flex -space-x-2 mb-3">
                <div className="w-8 h-8 rounded-lg border-2 border-background bg-muted overflow-hidden">
                  <img alt="prev" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=100&auto=format&fit=crop" />
                </div>
                <div className="w-8 h-8 rounded-lg border-2 border-background bg-muted"></div>
                <div className="w-8 h-8 rounded-lg border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                  +12
                </div>
              </div>
              <button className="w-full text-[10px] font-black uppercase tracking-[0.2em] py-2 border border-dashed border-border rounded-xl text-muted-foreground hover:border-brand/50 hover:text-brand transition-all">
                Upload New
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
    <Footer/>
    </>
  );
}