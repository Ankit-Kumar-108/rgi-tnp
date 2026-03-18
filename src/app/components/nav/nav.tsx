import React from 'react'
import { AnimatedThemeToggler } from '../ui/animated-theme-toggler'
import Link from 'next/link'


export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-[#9213ec]/10 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto flex h-20 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-[#9213ec]">
              {/* <GraduationCap className="w-10 h-10" /> */}
            </div>
            <div>
              <h1 className="text-xl font-bold leading-none tracking-tight text-slate-900">RGI T&P</h1>
              <p className="text-[10px] uppercase tracking-widest text-[#9213ec] font-semibold">Excellence in Placement</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-10">
            <Link className="text-sm font-medium hover:text-[#9213ec] transition-colors" href="#">Home</Link>
            <Link className="text-sm font-medium hover:text-[#9213ec] transition-colors" href="#about">About</Link>
            <Link className="text-sm font-medium hover:text-[#9213ec] transition-colors" href="#recruiters">Recruiters</Link>
            <Link className="text-sm font-medium hover:text-[#9213ec] transition-colors" href="#memories">Memories</Link>
            <Link className="text-sm font-medium hover:text-[#9213ec] transition-colors" href="#feedback">Feedback</Link>
          {/* <ThemeToggler/> */}
          <AnimatedThemeToggler />
          </div>
          <button className="bg-[#9213ec] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-[#9213ec]/90 transition-all shadow-lg shadow-[#9213ec]/20">
            Contact Us
          </button>
        </div>
      </nav>
  )
}
