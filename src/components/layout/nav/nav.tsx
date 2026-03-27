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
  MessageSquareText,
  Camera,
  UserCheck,
  TrendingUp,
  Network,
  ClipboardList,
  Shield,
  Earth
} from "lucide-react"
import { useState, useEffect } from 'react'
import { isLoggedIn, logout, type UserRole } from '@/lib/auth-client'
import { usePathname, useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const [loggedInRoles, setLoggedInRoles] = useState<UserRole[]>([])

  useEffect(() => {
    const roles: UserRole[] = ["student", "recruiter", "alumni", "admin", "external_student"];
    const active = roles.filter(role => isLoggedIn(role));
    setLoggedInRoles(active);
  }, [pathname]);

  const handleLogout = () => {
    loggedInRoles.forEach(role => logout(role));
    setLoggedInRoles([]);
    router.push("/");
    router.refresh();
  };

  const getRoleFromCategory = (cat: string): UserRole | null => {
    if (cat === "Students") return "student";
    if (cat === "Recruiters") return "recruiter";
    if (cat === "External") return "external_student";
    if (cat === "Alumni") return "alumni";
    return null;
  };

  const navItems = [
    { name: "Home", link: "/" },
    {
      name: "About",
      subMenu: [
        { name: "About RGI", icon: Building2, link: "about/rgi" },
        { name: "T&P Department", icon: Briefcase, link: "about/training-placement" }
      ]
    },
    {
      name: "Activities",
      subMenu: [
        { name: "Achievements", icon: Trophy, link: "activities/achievements" },
        { name: "Certificates", icon: Award, link: "activities/certificates" },
        { name: "MoU", icon: Handshake, link: "activities/mou" }
      ]
    },
    {
      name: "Students",
      subMenu: [
        { name: "Login", icon: UserCheck, link: "students/login", hideIfLoggedIn: true },
        { name: "Register", icon: UserPlus, link: "students/register", hideIfLoggedIn: true },
        { name: "Dashboard", icon: Activity, link: "students/dashboard", showIfLoggedInOnly: true }
      ]
    },
    {
      name: "Recruiters",
      subMenu: [
        { name: "Login", icon: UserCheck, link: "recruiters/login", hideIfLoggedIn: true },
        { name: "Register", icon: UserPlus, link: "recruiters/register", hideIfLoggedIn: true },
        { name: "Dashboard", icon: TrendingUp, link: "recruiters/dashboard", showIfLoggedInOnly: true }
      ]
    },
    {
      name: "External",
      subMenu: [
        { name: "Login", icon: UserCheck, link: "external-students/login", hideIfLoggedIn: true },
        { name: "Register", icon: UserPlus, link: "external-students/register", hideIfLoggedIn: true },
        { name: "Dashboard", icon: TrendingUp, link: "students/external-dashboard", showIfLoggedInOnly: true }
      ]
    },
    {
      name: "Alumni",
      subMenu: [
        { name: "Login", icon: UserCheck, link: "alumni/login", hideIfLoggedIn: true },
        { name: "Register", icon: ClipboardList, link: "alumni/alumni-register", hideIfLoggedIn: true },
        { name: "Alumni Network", icon: Network, link: "alumni/alumni-network" },
        { name: "Dashboard", icon: TrendingUp, link: "alumni/dashboard", showIfLoggedInOnly: true },
      ]
    },
    // Standalone items
    { name: "Memories", link: "/memories" },
    { name: "Feedbacks", link: "/feedbacks" },
    { name: "Admin", link: "/admin/login", hideIfLoggedIn: true },
  ];

  // Helper function to render sub-menus seamlessly in mobile view
  const renderMobileSubMenu = (categoryName: string) => {
    const item = navItems.find((i) => i.name === categoryName);
    if (!item || !item.subMenu) return null;

    const role = getRoleFromCategory(categoryName);
    const isRoleLoggedIn = role && loggedInRoles.includes(role);
    const isAnyLoggedIn = loggedInRoles.length > 0;

    return (
      <div className="flex flex-col gap-3 pl-12 pb-3 pt-1">
        {item.subMenu.filter(sub => {
          if (sub.hideIfLoggedIn && isAnyLoggedIn) return false;
          if (sub.showIfLoggedInOnly && !isRoleLoggedIn) return false;
          return true;
        }).map((subItem) => (
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

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-5">
          {navItems.map((item) => (
            <div
              key={item.name}
              className="group relative text-sm font-medium hover:text-brand transition-colors mt-8 pb-7 cursor-pointer after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.75 after:bg-brand after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-center"
            >
              {item.link ? (
                <Link href={item.link} className="flex items-center gap-1">
                  {item.name}
                </Link>
              ) : (
                <span className="flex items-center gap-1">
                  {item.name}
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 group-hover:rotate-180 transition-transform duration-300">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
              )}
              {item.subMenu && (
                <div className="absolute top-full left-0 z-50 w-56 p-2 bg-background/95 backdrop-blur-md border border-border/50 shadow-2xl shadow-brand/5 rounded-xl opacity-0 invisible -translate-y-1 scale-95 origin-top-left group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:scale-100 transition-all duration-200 ease-out">
                  <div className="flex flex-col gap-1">
                    {item.subMenu.filter(sub => {
                      const role = getRoleFromCategory(item.name);
                      const isRoleLoggedIn = role && loggedInRoles.includes(role);
                      const isAnyLoggedIn = loggedInRoles.length > 0;

                      if (sub.hideIfLoggedIn && isAnyLoggedIn) return false;
                      if (sub.showIfLoggedInOnly && !isRoleLoggedIn) return false;
                      return true;
                    }).map((subItem) => (
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

        {/* Right Section: Theme Toggler & Logout & Mobile Menu */}
        <div className="flex items-center gap-4">
          <AnimatedThemeToggler />
          {loggedInRoles.length > 0 && (
            <button
              onClick={handleLogout}
              className="hidden lg:flex items-center gap-2 bg-destructive/10 text-destructive px-4 py-2 rounded-xl text-xs font-bold hover:bg-destructive/20 transition-all shadow-sm"
              title="Logout from all sessions"
            >
              <LogOut className="size-4" />
              Logout
            </button>
          )}
        </div>

        {/* Mobile Hamburger Navigation */}
        <div className='lg:hidden flex items-center gap-4'>
          {loggedInRoles.length > 0 && (
            <button
              onClick={handleLogout}
              className="flex items-center justify-center p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
              title="Logout"
            >
              <LogOut className="size-5" />
            </button>
          )}
          <div
            onClick={() => setIsOpen(!isOpen)}
            className='size-7 cursor-pointer'>
            {isOpen ? (<X />) : (<Menu />)}
          </div>

          {isOpen && (
            <>
              {/* Added max-h and overflow-y-auto so the menu is scrollable on smaller phones */}
              <div className='fixed z-50 right-5 top-24 bg-background border border-brand/20 w-56 rounded-2xl flex flex-col p-2 shadow-xl shadow-brand/10 max-h-[75vh] overflow-y-auto'>
                <div className="flex flex-col divide-y divide-brand/10">

                  {/* Home */}
                  <Link href="/" onClick={() => setIsOpen(false)} className='flex items-center gap-4 p-3 rounded-lg hover:bg-brand/5 transition-colors'>
                    <Home className='text-brand size-5' />
                    <p className="font-medium text-sm text-foreground">Home</p>
                  </Link>

                  {/* About */}
                  <div className="flex flex-col">
                    <div className='flex items-center gap-4 p-3'>
                      <Info className='text-brand size-5' />
                      <p className="font-medium text-sm text-foreground">About</p>
                    </div>
                    {renderMobileSubMenu("About")}
                  </div>

                  {/* Activities */}
                  <div className="flex flex-col">
                    <div className='flex items-center gap-4 p-3'>
                      <Activity className='text-brand size-5' />
                      <p className="font-medium text-sm text-foreground">Activities</p>
                    </div>
                    {renderMobileSubMenu("Activities")}
                  </div>

                  {/* Students */}
                  <div className="flex flex-col">
                    <div className='flex items-center gap-4 p-3'>
                      <Users className='text-brand size-5' />
                      <p className="font-medium text-sm text-foreground">Students</p>
                    </div>
                    {renderMobileSubMenu("Students")}
                  </div>

                  {/* Recruiters */}
                  <div className="flex flex-col">
                    <div className='flex items-center gap-4 p-3'>
                      <Briefcase className='text-brand size-5' />
                      <p className="font-medium text-sm text-foreground">Recruiters</p>
                    </div>
                    {renderMobileSubMenu("Recruiters")}
                  </div>

                  {/* External Students */}
                  <div className="flex flex-col">
                    <div className='flex items-center gap-4 p-3'>
                      <Earth className='text-brand size-5' />
                      <p className="font-medium text-sm text-foreground">External</p>
                    </div>
                    {renderMobileSubMenu("External")}
                  </div>

                  {/* Alumni das */}
                  <div className="flex flex-col">
                    <div className='flex items-center gap-4 p-3'>
                      <GraduationCap className='text-brand size-5' />
                      <p className="font-medium text-sm text-foreground">Alumni</p>
                    </div>
                    {renderMobileSubMenu("Alumni")}
                  </div>

                  {/* Memories */}
                  <Link href="/memories" onClick={() => setIsOpen(false)} className='flex items-center gap-4 p-3 rounded-lg hover:bg-brand/5 transition-colors'>
                    <Images className='text-brand size-5' />
                    <p className="font-medium text-sm text-foreground">Memories</p>
                  </Link>

                  {/* Feedbacks */}
                  <Link href="/feedbacks" onClick={() => setIsOpen(false)} className='flex items-center gap-4 p-3 rounded-lg hover:bg-brand/5 transition-colors'>
                    <MessageSquare className='text-brand size-5' />
                    <p className="font-medium text-sm text-foreground">Feedbacks</p>
                  </Link>

                  {/* Admin */}
                  <Link href="/admin/login" onClick={() => setIsOpen(false)} className='flex items-center gap-4 p-3 rounded-lg hover:bg-brand/5 transition-colors'>
                    <Shield className='text-brand size-5' />
                    <p className="font-medium text-sm text-foreground">Admin Panel</p>
                  </Link>

                </div>
              </div>

              {/* Overlay Backdrop to close menu when clicking outside */}
              <div
                onClick={() => setIsOpen(false)}
                className='w-dvw h-dvh absolute left-0 top-0 z-20'
              ></div>
            </>
          )}

        </div>

        {/* Desktop Contact CTA */}
        {/* <button className="hidden -mr-20 lg:block bg-brand text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-brand/90 transition-all shadow-lg shadow-brand/20">
          Contact Us
        </button> */}
      </div>
    </nav>
  )
}