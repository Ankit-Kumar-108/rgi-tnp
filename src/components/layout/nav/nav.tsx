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
  MessageSquare,
  Building2,
  Trophy,
  Award,
  Handshake,
  UserPlus,
  UserCheck,
  TrendingUp,
  Network,
  ClipboardList,
  Earth
} from "lucide-react"
import { useState } from 'react'

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false)

  // CLEANED UP NAVIGATION: Reduced from 10 top-level items to 7
  const navItems = [
    { name: "Home", link: "/", icon: Home },
    {
      name: "About",
      icon: Info,
      subMenu: [
        { name: "About RGI", icon: Building2, link: "about/rgi" },
        { name: "T&P Department", icon: Briefcase, link: "about/training-placement" },
        { name: "Feedbacks", icon: MessageSquare, link: "feedbacks" } // Grouped here
      ]
    },
    {
      name: "Activities",
      icon: Activity,
      subMenu: [
        { name: "Achievements", icon: Trophy, link: "activities/achievements" },
        { name: "Certificates", icon: Award, link: "activities/certificates" },
        { name: "MoU", icon: Handshake, link: "activities/mou" },
        { name: "Memories", icon: Images, link: "memories" } // Grouped here
      ]
    },
    {
      name: "Students",
      icon: Users,
      subMenu: [
        { name: "Login", icon: UserCheck, link: "students/login" },
        { name: "Register", icon: UserPlus, link: "students/register" },
        { name: "Dashboard", icon: Activity, link: "students/dashboard" }
      ]
    },
    {
      name: "Recruiters",
      icon: Briefcase,
      subMenu: [
        { name: "Login", icon: UserCheck, link: "recruiters/login" },
        { name: "Register", icon: UserPlus, link: "recruiters/register" },
        { name: "Dashboard", icon: TrendingUp, link: "recruiters/dashboard" }
      ]
    },
    {
      name: "External",
      icon: Earth,
      subMenu: [
        { name: "Open Drives", icon: Building2, link: "open-drives" },
        { name: "Login", icon: UserCheck, link: "external-students/login" },
        { name: "Register", icon: UserPlus, link: "external-students/register" },
        { name: "Dashboard", icon: TrendingUp, link: "students/external-dashboard" }
      ]
    },
    {
      name: "Alumni",
      icon: GraduationCap,
      subMenu: [
        { name: "Login", icon: UserCheck, link: "alumni/login" },
        { name: "Register", icon: ClipboardList, link: "alumni/alumni-register" },
        { name: "Alumni Network", icon: Network, link: "alumni/alumni-network" },
        { name: "Dashboard", icon: TrendingUp, link: "alumni/dashboard" },
      ]
    }
    // Admin was completely removed. Put this link in your Footer component instead!
  ];

  const renderMobileSubMenu = (categoryName: string) => {
    const item = navItems.find((i) => i.name === categoryName);
    if (!item || !item.subMenu) return null;

    return (
      <div className="flex flex-col gap-3 pl-12 pb-3 pt-1">
        {item.subMenu.map((subItem) => (
          <Link
            key={subItem.name}
            href={`/${subItem.link}`}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 text-xs font-medium text-foreground/70 hover:text-brand transition-colors"
          >
            <subItem.icon className="size-4" />
            {subItem.name}
          </Link>
        ))}
      </div>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect px-6 lg:px-20">
      <div className="max-w-7xl mx-auto flex h-20 items-center justify-between">

        {/* Logo Section */}
        <Link href={"/"} className="flex items-center gap-3 min-w-max">
          <div className="text-brand">
            <img
              className="w-10 h-10"
              src={"/logo/logo.png"}
              alt='college logo'
            />
          </div>
          <div>
            <h1 className="md:hidden text-xl font-bold leading-none tracking-tight text-foreground">RGI T&P</h1>
            <h1 className="hidden md:block text-2xl font-bold leading-none tracking-tight text-foreground">RGI <span className="text-brand">Training & Placement</span></h1>
            <p className="text-[10px] uppercase tracking-widest text-brand font-semibold hidden md:flex">Excellence in Placement</p>
          </div>
        </Link >

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center justify-center flex-1 gap-4 xl:gap-6 px-4">
          {navItems.map((item) => (
            <div
              key={item.name}
              className="group relative text-sm font-medium hover:text-brand transition-colors mt-8 pb-7 cursor-pointer after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.75 after:bg-brand after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-center"
            >
              {item.link ? (
                <Link href={item.link} className="flex items-center gap-1 whitespace-nowrap">
                  {item.name}
                </Link>
              ) : (
                <span className="flex items-center gap-1 whitespace-nowrap">
                  {item.name}
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 group-hover:rotate-180 transition-transform duration-300">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
              )}
              {item.subMenu && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 z-50 w-56 p-2 bg-background/95 backdrop-blur-md border border-border/50 shadow-2xl shadow-brand/5 rounded-xl opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 ease-out">
                  <div className="flex flex-col gap-1">
                    {item.subMenu.map((subItem) => (
                      <Link
                        href={`/${subItem.link}`}
                        key={subItem.name}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-foreground/80 hover:text-brand hover:bg-brand/10 rounded-md transition-colors"
                      >
                        <div className="flex items-center justify-center p-1.5 rounded-md bg-brand/5 text-brand">
                          <subItem.icon className="size-4" />
                        </div>
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right Section: Theme Toggler & Mobile Menu Toggle */}
        <div className="flex items-center gap-4 min-w-max justify-end">
          <AnimatedThemeToggler />
          
          <div className='lg:hidden flex items-center gap-4'>
            <div
              onClick={() => setIsOpen(!isOpen)}
              className='size-7 cursor-pointer'>
              {isOpen ? (<X />) : (<Menu />)}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <>
            <div className='lg:hidden fixed z-50 right-5 top-24 bg-background border border-brand/20 w-56 rounded-2xl flex flex-col p-2 shadow-xl shadow-brand/10 max-h-[75vh] overflow-y-auto'>
              <div className="flex flex-col divide-y divide-brand/10">
                {navItems.map((item) => (
                  <div key={item.name} className="flex flex-col">
                    {item.link && !item.subMenu ? (
                      <Link 
                        href={item.link} 
                        onClick={() => setIsOpen(false)} 
                        className='flex items-center gap-4 p-3 rounded-lg hover:bg-brand/5 transition-colors'
                      >
                        {item.icon && <item.icon className='text-brand size-5' />}
                        <p className="font-medium text-sm text-foreground">{item.name}</p>
                      </Link>
                    ) : (
                      <>
                        <div className='flex items-center gap-4 p-3'>
                          {item.icon && <item.icon className='text-brand size-5' />}
                          <p className="font-medium text-sm text-foreground">{item.name}</p>
                        </div>
                        {renderMobileSubMenu(item.name)}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Overlay Backdrop */}
            <div
              onClick={() => setIsOpen(false)}
              className='w-dvw h-dvh fixed left-0 top-0 z-20'
            ></div>
          </>
        )}
      </div>
    </nav>
  )
}