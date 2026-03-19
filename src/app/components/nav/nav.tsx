import { AnimatedThemeToggler } from '../ui/animated-theme-toggler'
import Link from 'next/link'


export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-brand/10 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto flex h-20 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-brand">
              <img 
              className="w-10 h-10"
              src={"/logo/logo.png"}
              alt='college logo'
               />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-none tracking-tight text-foreground">RGI T&P</h1>
              <p className="text-[10px] uppercase tracking-widest text-brand font-semibold hidden md:flex">Excellence in Placement</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-10">
            <Link className="text-sm font-medium hover:text-brand transition-colors" href="#">Home</Link>
            <Link className="text-sm font-medium hover:text-brand transition-colors" href="#about">About</Link>
            <Link className="text-sm font-medium hover:text-brand transition-colors" href="#recruiters">Recruiters</Link>
            <Link className="text-sm font-medium hover:text-brand transition-colors" href="#memories">Memories</Link>
            <Link className="text-sm font-medium hover:text-brand transition-colors" href="#feedback">Feedback</Link>
          <AnimatedThemeToggler />
          </div>
          <button className="bg-brand text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-brand/90 transition-all shadow-lg shadow-brand/20">
            Contact Us
          </button>
        </div>
      </nav>
  )
}
