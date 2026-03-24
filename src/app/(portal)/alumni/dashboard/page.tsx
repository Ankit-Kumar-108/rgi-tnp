"use client";

import Nav from "@/components/layout/nav/nav";
import Footer from "@/components/layout/footer/footer";
import { 
  UserPlus, 
  GraduationCap, 
  TrendingUp, 
  Send, 
  MessageSquareShare, 
  Star, 
  Check, 
  X, 
  CalendarDays, 
  MapPin,
  ChevronRight,
  Briefcase,
  Loader2
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function AlumniDashboard() {
  const { loading, authenticated, user } = useAuth("alumni", "/alumni/alumni-register");

  if (loading || !authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <>
    <Nav/>
    <div className="bg-background text-foreground antialiased font-sans min-h-screen selection:bg-brand/10 selection:text-brand relative overflow-x-hidden mt-15">
      
      {/* Decorative refracted light elements */}
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-brand/5 rounded-full blur-[120px] -z-10"></div>
      <div className="fixed top-1/2 left-0 w-64 h-64 bg-brand/5 rounded-full blur-[100px] -z-10"></div>

      <main className="p-6 md:p-10 max-w-7xl mx-auto space-y-12">
        
        {/* Welcome Header */}
        <section className="relative z-10 pt-4 md:pt-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-bold uppercase tracking-widest mb-4">
            <GraduationCap className="w-4 h-4" />
            Alumni
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
            Welcome back, <span className="text-brand">{user?.name || "Alumni"}</span>
          </h1>
          <p className="text-muted-foreground mt-3 text-lg font-light leading-relaxed max-w-2xl">
            You're making a difference at Radharaman Group of Institutes. Your mentorship and referrals have directly impacted 12 students this month.
          </p>
        </section>

        {/* Statistics Bar */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          <div className="bg-card rounded-[2rem] p-6 shadow-sm flex items-center justify-between border border-border hover:-translate-y-1 transition-transform">
            <div>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Referrals</p>
              <h3 className="text-4xl font-black text-foreground">42</h3>
            </div>
            <div className="bg-brand/10 p-4 rounded-2xl text-brand">
              <UserPlus className="w-8 h-8" />
            </div>
          </div>
          
          <div className="bg-card rounded-[2rem] p-6 shadow-sm flex items-center justify-between border border-border hover:-translate-y-1 transition-transform">
            <div>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">Students Placed</p>
              <h3 className="text-4xl font-black text-foreground">18</h3>
            </div>
            <div className="bg-brand/10 p-4 rounded-2xl text-brand">
              <Briefcase className="w-8 h-8" />
            </div>
          </div>
          
          <div className="bg-brand text-primary-foreground rounded-[2rem] p-6 shadow-xl shadow-brand/20 flex items-center justify-between hover:-translate-y-1 transition-transform">
            <div>
              <p className="text-sm font-bold opacity-80 uppercase tracking-widest mb-1">Network Impact</p>
              <h3 className="text-4xl font-black">Top 5%</h3>
            </div>
            <div className="bg-background/20 p-4 rounded-2xl backdrop-blur-sm">
              <TrendingUp className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
        </section>

        {/* Action Cards Section (Bento Grid Style) */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          
          {/* Refer a Student Card (Spans 2 columns) */}
          <div className="lg:col-span-2 bg-card rounded-[2rem] p-8 shadow-sm border border-border">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-brand/10 rounded-xl text-brand">
                <Send className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Refer a Student</h2>
                <p className="text-sm text-muted-foreground mt-1">Submit an RGI student for a role at your company.</p>
              </div>
            </div>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Student Name</label>
                  <input 
                    className="w-full bg-muted px-5 py-4 rounded-2xl border-none focus:ring-2 focus:ring-brand transition-all text-sm outline-none placeholder:text-muted-foreground/50 text-foreground" 
                    placeholder="e.g. Rahul Sharma" 
                    type="text" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Graduation Year</label>
                  <input 
                    className="w-full bg-muted px-5 py-4 rounded-2xl border-none focus:ring-2 focus:ring-brand transition-all text-sm outline-none placeholder:text-muted-foreground/50 text-foreground" 
                    placeholder="2025" 
                    type="number" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Job/Role referring for</label>
                <input 
                  className="w-full bg-muted px-5 py-4 rounded-2xl border-none focus:ring-2 focus:ring-brand transition-all text-sm outline-none placeholder:text-muted-foreground/50 text-foreground" 
                  placeholder="Software Engineer - Tier 1" 
                  type="text" 
                />
              </div>
              <button 
                className="w-full md:w-auto bg-brand text-primary-foreground px-10 py-4 rounded-xl font-bold hover:scale-[1.02] transition-transform shadow-lg shadow-brand/20" 
                type="button"
              >
                Submit Referral
              </button>
            </form>
          </div>

          {/* Give Institutional Feedback Card (Spans 1 column) */}
          <div className="lg:col-span-1 bg-gradient-to-br from-muted/50 to-background rounded-[2rem] p-8 border border-border flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-brand/10 rounded-xl text-brand">
                <MessageSquareShare className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Curriculum Feedback</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Help the RGI T&P department evolve. Rate the current batch's preparedness and suggest tech stacks we should add next semester.
            </p>
            
            <div className="flex gap-2 mb-6">
              {[1, 2, 3, 4].map((star) => (
                <button key={star} className="text-brand hover:scale-110 transition-transform">
                  <Star className="w-6 h-6 fill-current" />
                </button>
              ))}
              <button className="text-muted-foreground hover:scale-110 transition-transform hover:text-brand">
                <Star className="w-6 h-6" />
              </button>
            </div>
            
            <textarea 
              className="w-full bg-background p-5 rounded-2xl border border-border focus:ring-2 focus:ring-brand transition-all text-sm resize-none mb-6 outline-none placeholder:text-muted-foreground/50 text-foreground" 
              placeholder="What modern skill is missing from the syllabus?" 
              rows={4}
            ></textarea>
            
            <button className="mt-auto w-full bg-foreground text-background py-4 rounded-xl font-bold hover:bg-brand hover:text-primary-foreground transition-colors">
              Share Expertise
            </button>
          </div>

          {/* Mentorship Requests Card */}
          <div className="lg:col-span-1 bg-card rounded-[2rem] p-8 shadow-sm border border-border flex flex-col">
             <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Mentorship Requests</h2>
              <span className="bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                2 Pending
              </span>
            </div>
            
            <div className="space-y-4 flex-1">
              {/* Request 1 */}
              <div className="bg-muted/50 p-4 rounded-2xl border border-border">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Karan Verma</h4>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">CSE • 3rd Year</p>
                  </div>
                  <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=100&auto=format&fit=crop" alt="Student" className="w-8 h-8 rounded-full object-cover" />
                </div>
                <p className="text-xs text-muted-foreground italic mb-4">"Would love your feedback on my React portfolio."</p>
                <div className="flex gap-2">
                  <button className="flex-1 bg-brand text-primary-foreground py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 hover:bg-brand/90 transition-colors">
                    <Check className="w-3 h-3" /> Accept
                  </button>
                  <button className="flex-1 bg-background border border-border text-muted-foreground py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 hover:bg-muted transition-colors">
                    <X className="w-3 h-3" /> Decline
                  </button>
                </div>
              </div>
            </div>
            <button className="mt-4 text-brand text-sm font-bold flex items-center justify-center gap-1 hover:underline">
              View All Students <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Upcoming Chapter Events */}
          <div className="lg:col-span-2 bg-card rounded-[2rem] p-8 shadow-sm border border-border flex flex-col sm:flex-row gap-8 items-center">
            <div className="w-full sm:w-1/2 aspect-video rounded-2xl overflow-hidden relative">
              <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2940&auto=format&fit=crop" alt="Event" className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-lg">
                <p className="text-xs font-bold text-brand text-center">OCT<br /><span className="text-lg">24</span></p>
              </div>
            </div>
            <div className="w-full sm:w-1/2 space-y-4">
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand/10 text-brand text-[10px] font-bold uppercase tracking-widest">
                <MapPin className="w-3 h-3" /> Bangalore Chapter
              </div>
              <h3 className="text-2xl font-bold text-foreground">Annual Tech Mixer 2026</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Join fellow RGI alumni for an evening of networking, panel discussions, and drinks at the Indiranagar tech park.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <button className="bg-foreground text-background px-6 py-3 rounded-xl text-sm font-bold hover:bg-brand hover:text-primary-foreground transition-colors">
                  RSVP Now
                </button>
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-card bg-muted"></div>
                  <div className="w-8 h-8 rounded-full border-2 border-card bg-muted"></div>
                  <div className="w-8 h-8 rounded-full border-2 border-card bg-brand text-primary-foreground flex items-center justify-center text-[10px] font-bold">+42</div>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* Recent Referrals List (Table) */}
        <section className="space-y-6 relative z-10 pt-8">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-bold text-foreground">Recent Student Referrals</h2>
            <button className="text-brand font-bold text-sm hover:underline flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="overflow-hidden rounded-[2rem] bg-card shadow-sm border border-border">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Student Name</th>
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Batch</th>
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Applied Role</th>
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  
                  <tr className="hover:bg-muted/30 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center text-brand font-bold text-xs">AM</div>
                        <span className="font-semibold text-foreground">Ananya Mishra</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-muted-foreground text-sm">2026</td>
                    <td className="px-8 py-6 text-muted-foreground text-sm">Product Analyst</td>
                    <td className="px-8 py-6 text-right">
                      <span className="px-4 py-1.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold uppercase tracking-tighter">
                        Hired
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-muted/30 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs">RK</div>
                        <span className="font-semibold text-foreground">Rohan Kapoor</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-muted-foreground text-sm">2025</td>
                    <td className="px-8 py-6 text-muted-foreground text-sm">Backend Dev Intern</td>
                    <td className="px-8 py-6 text-right">
                      <span className="px-4 py-1.5 rounded-full bg-brand/10 text-brand text-xs font-bold uppercase tracking-tighter">
                        Interview Scheduled
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-muted/30 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold text-xs">SJ</div>
                        <span className="font-semibold text-foreground">Sneha Jain</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-muted-foreground text-sm">2026</td>
                    <td className="px-8 py-6 text-muted-foreground text-sm">Data Science Intern</td>
                    <td className="px-8 py-6 text-right">
                      <span className="px-4 py-1.5 rounded-full bg-muted text-muted-foreground text-xs font-bold uppercase tracking-tighter">
                        Under Review
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-muted/30 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center text-foreground font-bold text-xs">PJ</div>
                        <span className="font-semibold text-foreground">Pranav Joshi</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-muted-foreground text-sm">2025</td>
                    <td className="px-8 py-6 text-muted-foreground text-sm">UI Designer</td>
                    <td className="px-8 py-6 text-right">
                      <span className="px-4 py-1.5 rounded-full bg-muted text-muted-foreground text-xs font-bold uppercase tracking-tighter">
                        Application Sent
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-muted/30 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center text-brand font-bold text-xs">VT</div>
                        <span className="font-semibold text-foreground">Varun Tiwari</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-muted-foreground text-sm">2024</td>
                    <td className="px-8 py-6 text-muted-foreground text-sm">DevOps Engineer</td>
                    <td className="px-8 py-6 text-right">
                      <span className="px-4 py-1.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold uppercase tracking-tighter">
                        Hired
                      </span>
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>
          </div>
        </section>

      </main>
    </div>
    <Footer/>
    </>
  );
}