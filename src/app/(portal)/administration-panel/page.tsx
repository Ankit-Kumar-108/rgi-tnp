"use client";

import React from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Users,
  ChevronRight,
  Lock,
  Server,
  UserCheck,
  type LucideIcon
} from "lucide-react";
import Nav from "@/components/layout/nav/nav";
import Footer from "@/components/layout/footer/footer";

const gateways = [
  {
    title: "Administrative Hub",
    role: "Faculty & Staff Access",
    description: "Complete oversight of recruitment drives, student analytics, and institutional configurations.",
    icon: ShieldCheck,
    href: "/admin/login",
    primaryColor: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-500/10",
    borderColor: "border-blue-100 dark:border-blue-500/20",
    hoverBorder: "hover:border-blue-300 dark:hover:border-blue-500/40",
    hoverShadow: "hover:shadow-blue-500/10",
    buttonBg: "bg-blue-600 hover:bg-blue-700 text-white",
  },
  {
    title: "Volunteer Portal",
    role: "Student Coordinator Access",
    description: "Coordinate placement logistics, manage event media, and track volunteer contributions.",
    icon: Users,
    href: "/volunteer/login",
    primaryColor: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-500/10",
    borderColor: "border-emerald-100 dark:border-emerald-500/20",
    hoverBorder: "hover:border-emerald-300 dark:hover:border-emerald-500/40",
    hoverShadow: "hover:shadow-emerald-500/10",
    buttonBg: "bg-emerald-600 hover:bg-emerald-700 text-white",
  }
];

const securityFeatures: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Lock, title: "Secure Access", desc: "End-to-end encrypted authentication protocols." },
  { icon: UserCheck, title: "Role-Based Control", desc: "Strict permission boundaries and data segregation." },
  { icon: Server, title: "Data Integrity", desc: "Automated backups and high-availability infrastructure." }
];

export default function AdministrationPanelPage() {
  return (
    <div className="bg-background min-h-screen flex flex-col font-sans selection:bg-brand/20">
      <Nav />

      <main className="grow pt-32 pb-24 px-4 w-full flex flex-col items-center justify-center relative overflow-hidden">
        
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02]" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '32px 32px' }}>
        </div>

        <div className="max-w-5xl mx-auto w-full relative z-10">
          
          {/* Header Section */}
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center justify-center p-3 mb-4 rounded-lg bg-brand/5 text-brand ring-1 ring-brand/10">
              <ShieldCheck className="w-8 h-8" strokeWidth={1.5} />
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              Administration <span className="text-brand">Portal</span>
            </h1>
            <p className="text-lg text-muted-foreground font-medium">
              Radharaman Group of Institutes Training & Placement Cell
            </p>
            <div className="h-1 w-12 bg-brand/20 rounded-full mx-auto mt-6"></div>
          </div>

          {/* Gateway Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
            {gateways.map((gate, i) => (
              <Link 
                key={i} 
                href={gate.href}
                className={`group flex flex-col bg-card rounded-lg border transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl ${gate.borderColor} ${gate.hoverBorder} ${gate.hoverShadow} hover:-translate-y-1`}
              >
                <div className="p-8 flex flex-col grow">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-4 rounded-lg ${gate.bgColor} ${gate.primaryColor}`}>
                      <gate.icon className="w-8 h-8" strokeWidth={1.5} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-3 py-1 rounded-full bg-secondary">
                      {gate.role}
                    </span>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-foreground mb-3">{gate.title}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-8 grow">
                    {gate.description}
                  </p>

                  <div className={`mt-auto inline-flex items-center justify-center w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200 ${gate.buttonBg}`}>
                    Access Portal
                    <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Security Features Footer */}
          <div className="mt-24 pt-10 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center md:text-left">
              {securityFeatures.map((f, i) => (
                <div key={i} className="flex flex-col md:flex-row gap-4 items-center md:items-start">
                  <div className="p-2 rounded-lg bg-secondary text-muted-foreground shrink-0">
                    <f.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{f.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}