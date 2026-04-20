"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  School, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Zap, 
  Headset,
  ChevronRight,
  type LucideIcon
} from "lucide-react";
import Nav from "@/components/layout/nav/nav";
import Footer from "@/components/layout/footer/footer";

const gateways = [
  {
    title: "Volunteer Portal",
    role: "Student Access",
    description: "Coordinate placement logistics, manage event media, and track your volunteer hours and contributions.",
    icon: <School className="w-6 h-6" />,
    buttonText: "Enter Volunteer Space",
    href: "/volunteer/login",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop",
    accent: "blue"
  },
  {
    title: "Administrative Hub",
    role: "Staff Access",
    description: "Full oversight of recruitment drives, student analytics, and portal moderation for institutional growth.",
    icon: <ShieldCheck className="w-6 h-6" />,
    buttonText: "Enter Admin Suite",
    href: "/admin/login",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop",
    accent: "indigo"
  }
];

const features: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Lock, title: "Secure Protocol", desc: "Enterprise-grade AES-256 encryption." },
  { icon: Zap, title: "High Velocity", desc: "Built for peak recruitment traffic." },
  { icon: Headset, title: "Live Support", desc: "Instant tech-assistance for staff." }
];

export default function AccessPage() {
  return (
    <div className="bg-[#fafafa] dark:bg-zinc-950 min-h-screen flex flex-col font-sans selection:bg-indigo-100">
      <Nav />

      <main className="grow pt-32 pb-24 px-4 max-w-6xl mx-auto w-full">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
              T&P Management System
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Radharaman Group of Institutes
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 font-medium">
            Please choose your destination to continue to the Training & Placement ecosystem.
          </p>
        </div>

        {/* Gateway Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {gateways.map((gate, i) => (
            <Link 
              key={i} 
              href={gate.href}
              className="group relative flex flex-col bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image Header */}
              <div className="h-48 relative overflow-hidden">
                <Image 
                  src={gate.image} 
                  alt={gate.title} 
                  fill 
                  className="object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-6">
                  <span className="text-xs font-bold text-white/80 uppercase tracking-widest">{gate.role}</span>
                  <h2 className="text-2xl font-bold text-white">{gate.title}</h2>
                </div>
              </div>

              {/* Body */}
              <div className="p-8 flex flex-col grow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                    {gate.icon}
                  </div>
                  <div className="h-px grow bg-zinc-100 dark:bg-zinc-800" />
                </div>
                
                <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed mb-8 grow text-[15px]">
                  {gate.description}
                </p>

                <div className="flex items-center text-indigo-600 dark:text-indigo-400 font-semibold group-hover:gap-2 transition-all">
                  {gate.buttonText}
                  <ChevronRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Feature Footer */}
        <div className="mt-20 pt-12 border-t border-zinc-200 dark:border-zinc-800">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
            {features.map((f, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="mt-1 text-indigo-500">
                  <f.icon size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{f.title}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}