"use client"
import { AnimatedThemeToggler } from '../../ui/animated-theme-toggler'
import Link from 'next/link'
import {
  Menu,
  X,
  Home,
  Info,
  Activity,
  Users,
  Briefcase,
  GraduationCap,
  Images,
  MessageSquare
} from "lucide-react"
import { useState, useEffect } from 'react'


export default function Nav() {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-brand/5 px-6 lg:px-20">
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
        <div className="hidden lg:flex items-center gap-5">
          {["Home", "About", "Activities", "Students", "Recruiters", "Alumni", "Memories", "Feedbacks"].map((item) => (
            <div
              key={item}
              className="relative text-sm font-medium hover:text-brand transition-colors mt-8 pb-7 cursor-pointer after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.75 after:bg-brand after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-center"
            >
              {item}
            </div>
          ))}
        </div>
        <div>
          <AnimatedThemeToggler />
        </div>
        <div className='lg:hidden flex items-center'>
          <div
            onClick={() => setIsOpen(!isOpen)}
            className='size-7 md:mr-15 group'>
            {isOpen ? (<X />) : (<Menu />)}
          </div>
          {isOpen ? (
            <>
              <div className='fixed z-50 right-5 top-24 bg-background border border-brand/20 w-56 rounded-2xl flex flex-col p-2 shadow-xl shadow-brand/10'>
                <div className="flex flex-col divide-y divide-brand/10">

                  <div className='flex items-center gap-4 p-3 rounded-lg hover:bg-brand/5 cursor-pointer transition-colors'>
                    <Home className='text-brand size-5' />
                    <p className="font-medium text-sm text-foreground">Home</p>
                  </div>

                  <div className='flex items-center gap-4 p-3 rounded-lg hover:bg-brand/5 cursor-pointer transition-colors'>
                    <Info className='text-brand size-5' />
                    <p className="font-medium text-sm text-foreground">About</p>
                  </div>

                  <div className='flex items-center gap-4 p-3 rounded-lg hover:bg-brand/5 cursor-pointer transition-colors'>
                    <Activity className='text-brand size-5' />
                    <p className="font-medium text-sm text-foreground">Activities</p>
                  </div>

                  <div className='flex items-center gap-4 p-3 rounded-lg hover:bg-brand/5 cursor-pointer transition-colors'>
                    <Users className='text-brand size-5' />
                    <p className="font-medium text-sm text-foreground">Students</p>
                  </div>

                  <div className='flex items-center gap-4 p-3 rounded-lg hover:bg-brand/5 cursor-pointer transition-colors'>
                    <Briefcase className='text-brand size-5' />
                    <p className="font-medium text-sm text-foreground">Recruiters</p>
                  </div>

                  <div className='flex items-center gap-4 p-3 rounded-lg hover:bg-brand/5 cursor-pointer transition-colors'>
                    <GraduationCap className='text-brand size-5' />
                    <p className="font-medium text-sm text-foreground">Alumni</p>
                  </div>

                  <div className='flex items-center gap-4 p-3 rounded-lg hover:bg-brand/5 cursor-pointer transition-colors'>
                    <Images className='text-brand size-5' />
                    <p className="font-medium text-sm text-foreground">Memories</p>
                  </div>

                  <div className='flex items-center gap-4 p-3 rounded-lg hover:bg-brand/5 cursor-pointer transition-colors'>
                    <MessageSquare className='text-brand size-5' />
                    <p className="font-medium text-sm text-foreground">Feedbacks</p>
                  </div>

                </div>
              </div>
              <div
                onClick={() => setIsOpen(!isOpen)}
                className='w-dvw h-dvh absolute left-0 top-0 z-20'></div>
            </>
          ) : (
            ""
          )}

        </div>
        <button className="hidden -mr-20 lg:block bg-brand text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-brand/90 transition-all shadow-lg shadow-brand/20">
          Contact Us
        </button>
      </div>
    </nav>
  )
}
