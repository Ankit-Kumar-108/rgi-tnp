"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { BadgeCheck } from "lucide-react";

interface DriveImageData {
  id: string;
  title: string;
  imageUrl: string;
  driveId: string;
}

interface DriveGroup {
  driveId: string;
  title: string;
  images: DriveImageData[];
}

interface HomeDrive {
  id: string;
  title: string;
  driveDate: Date;
  driveImages: DriveImageData[];
}

export default function DriveCarousel({ drives }: { drives: HomeDrive[] }) {
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);

  const driveGroups: DriveGroup[] = drives
    .filter((d) => d.driveImages && d.driveImages.length > 0)
    .map((d) => ({ driveId: d.id, title: d.title, images: d.driveImages }));

  useEffect(() => {
    if (driveGroups.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentGroupIndex((prev) => (prev + 1) % driveGroups.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [driveGroups.length]);

  if (driveGroups.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background via-brand/[0.02] to-background overflow-hidden" id="placement-drives">
      <div className="max-w-7xl mx-auto px-3 lg:px-20">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-brand/10 text-brand px-4 py-1.5 rounded-full mb-4">
            <BadgeCheck className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Campus Placements</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
            Placement Drive <span className="text-brand">Gallery</span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
            Moments from our successful campus recruitment drives
          </p>
        </div>

        {/* Carousel viewport — all slides stacked, crossfade via opacity */}
        <div className="relative">
          {driveGroups.map((group, idx) => {
            const isActive = idx === currentGroupIndex;
            return (
              <div
                key={group.driveId}
                className="w-full transition-all duration-700 ease-in-out"
                style={{
                  position: idx === 0 ? "relative" : "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? "translateX(0)" : "translateX(40px)",
                  pointerEvents: isActive ? "auto" : "none",
                  zIndex: isActive ? 10 : 1,
                }}
                aria-hidden={!isActive}
              >
                {/* Drive title */}
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-card border border-border rounded-lg px-6 py-3 shadow-md flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-brand animate-pulse shrink-0" />
                    <h3 className="text-base md:text-lg font-bold text-foreground">
                      <span className="text-brand">{group.images[0]?.title}</span>
                    </h3>
                  </div>
                </div>

                {/* 4-image asymmetric grid */}
                <div className="grid grid-cols-4 grid-rows-2 gap-2 md:gap-4 h-70 md:h-105">
                  {/* Image 1 — large (spans 2 cols, 2 rows) */}
                  {group.images[0] && (
                    <div className="col-span-2 row-span-2 rounded-lg overflow-hidden relative group/img shadow-lg">
                      <Image
                        src={group.images[0].imageUrl}
                        alt={group.images[0].title}
                        className="object-cover group-hover/img:scale-105 transition-transform duration-700"
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300" />
                    </div>
                  )}
                  {/* Image 2 — top right */}
                  {group.images[1] && (
                    <div className="col-span-1 row-span-1 rounded-lg overflow-hidden relative group/img shadow-lg">
                      <Image
                        src={group.images[1].imageUrl}
                        alt={group.images[1].title}
                        className="object-cover object-top group-hover/img:scale-105 transition-transform duration-700"
                        fill
                        sizes="(max-width: 768px) 25vw, 12.5vw"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300" />
                    </div>
                  )}
                  {/* Image 3 — top far-right */}
                  {group.images[2] && (
                    <div className="col-span-1 row-span-1 rounded-lg overflow-hidden relative group/img shadow-lg">
                      <Image
                        src={group.images[2].imageUrl}
                        alt={group.images[2].title}
                        className="object-cover object-top group-hover/img:scale-105 transition-transform duration-700"
                        fill
                        sizes="(max-width: 768px) 25vw, 12.5vw"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300" />
                    </div>
                  )}
                  {/* Image 4 — bottom right (spans 2 cols) */}
                  {group.images[3] && (
                    <div className="col-span-2 row-span-1 rounded-lg overflow-hidden relative group/img shadow-lg">
                      <Image
                        src={group.images[3].imageUrl}
                        alt={group.images[3].title}
                        className="object-cover group-hover/img:scale-105 transition-transform duration-700"
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Dot indicators */}
        {driveGroups.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            {driveGroups.map((group, idx) => (
              <button
                key={group.driveId}
                onClick={() => setCurrentGroupIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${idx === currentGroupIndex
                  ? "w-8 bg-brand"
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                aria-label={`Go to ${group.images[0]?.title} drive images`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
