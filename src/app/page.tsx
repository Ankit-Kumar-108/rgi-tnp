import { Suspense } from "react";
import Nav from "@/components/layout/nav/nav";
import Footer from "@/components/layout/footer/footer";
import { LoaderCircle } from "lucide-react";

import HeroSection from "@/components/marketing/home/HeroSection";
import DirectorSection from "@/components/marketing/home/DirectorSection";
import StakeholderCards from "@/components/marketing/home/StakeholderCards";
import DriveCarousel from "@/components/marketing/home/DriveCarousel";
import TestimonialGrid from "@/components/marketing/home/TestimonialGrid";
import MemoryGallery from "@/components/marketing/home/MemoryGallery";
import VolunteerGrid from "@/components/marketing/home/VolunteerGrid";

import {
  fetchHomeDrives,
  fetchTestimonials,
  fetchHomeMemories,
  fetchHomeVolunteers,
} from "@/lib/home-data";

export const runtime = "edge";

function LoadingSection({ height = "300px" }) {
  return (
    <div className="flex justify-center items-center w-full" style={{ minHeight: height }}>
      <LoaderCircle className="w-12 h-12 text-brand animate-spin" />
    </div>
  );
}

// Suspense wrappers for fetching data
async function DriveSectionWrapper() {
  const drives = await fetchHomeDrives(10);
  return <DriveCarousel drives={drives} />;
}

async function TestimonialsWrapper() {
  const testimonials = await fetchTestimonials();
  return <TestimonialGrid testimonials={testimonials} />;
}

async function MemoriesWrapper() {
  const memories = await fetchHomeMemories(6);
  return <MemoryGallery memories={memories} />;
}

async function VolunteersWrapper() {
  const volunteers = await fetchHomeVolunteers();
  return <VolunteerGrid volunteers={volunteers} />;
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Fixed Top Navigation */}
      <Nav />
      <main className="pt-10">
        <HeroSection />

        <Suspense fallback={<LoadingSection height="400px" />}>
          <DriveSectionWrapper />
        </Suspense>

        <DirectorSection />

        <Suspense fallback={<LoadingSection height="300px" />}>
          <VolunteersWrapper />
        </Suspense>

        <StakeholderCards />

        <Suspense fallback={<LoadingSection height="300px" />}>
          <TestimonialsWrapper />
        </Suspense>

        <Suspense fallback={<LoadingSection height="400px" />}>
          <MemoriesWrapper />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
