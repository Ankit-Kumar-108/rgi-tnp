import Link from "next/link";
import Image from "next/image";
import { BadgeCheck, SquareArrowOutUpRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="bg-brand/5 mt-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-20 py-10 lg:py-22">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="order-2 lg:order-1 flex flex-col gap-5 md:gap-8">
            <div className="hidden md:inline-flex items-center gap-2 bg-brand/10 text-brand px-4 py-1.5 rounded-full w-fit">
              <BadgeCheck className="text-lg" />
              <span className="text-xs font-bold uppercase tracking-wider">Top Rated Placement Cell</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black leading-[1.05] tracking-tight">
              Empowering Careers at <span className="text-brand">RGI</span>
            </h1>
            <p className="text-sm md:text-lg text-muted-foreground max-w-lg leading-relaxed">
              Connecting top-tier talent with global industry leaders. Join our legacy of excellence and secure your future with world-class opportunities.
            </p>
            <div className="flex flex-wrap gap-3 md:gap-4">
              <Link href="/recruiters/register">
                <button className="bg-brand text-white px-7 py-3 rounded-full text-sm md:text-base font-bold flex items-center gap-2 hover:opacity-90 transition-opacity group cursor-pointer">
                  Hire from Us <div className="group-hover:scale-125 transition-all duration-300"><SquareArrowOutUpRight className="w-4 h-4" /></div>
                </button>
              </Link>
              <Link href="/students/login">
                <button className="bg-background border-2 border-border text-foreground px-7 py-3 rounded-full text-sm md:text-base font-bold hover:bg-muted cursor-pointer transition-colors duration-300">
                  Student Portal
                </button>
              </Link>
            </div>
          </div>
          <div className="order-1 lg:order-2 flex flex-col gap-5">
            <div className="md:hidden inline-flex items-center gap-2 bg-brand/10 text-brand px-4 py-1.5 rounded-full w-fit">
              <BadgeCheck className="text-lg" />
              <span className="text-xs font-bold uppercase tracking-wider">Top Rated Placement Cell</span>
            </div>
            <div className="relative">
              <div className="relative h-80 md:h-112.5 w-full rounded-lg md:rounded-xl shadow-[var(--shadow-lg)] overflow-hidden">
                <Image
                  src="/images/RGI.jpg"
                  alt="Modern college campus students collaborating outdoors"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
