export const runtime = 'edge';

import React from "react";
import Nav from "@/components/layout/nav/nav";
import Footer from "@/components/layout/footer/footer";
import MemoriesGallery from "./MemoriesGallery";

export const metadata = {
  title: "Memories | RGI Training & Placement",
  description: "A visual archive of the milestones, campus life, and success stories at Radharaman Group of Institutes.",
};

export default function MemoriesPage() {
  return (
    <div className="bg-background min-h-screen flex flex-col selection:bg-brand/10 selection:text-brand">
      {/* Navigation */}
      <Nav />
      {/* Client Component Gallery */}
      <MemoriesGallery />
      {/* Footer */}
      <Footer />
    </div>
  );
}