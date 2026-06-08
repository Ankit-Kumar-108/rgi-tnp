"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, X, Camera, ImageIcon } from "lucide-react";
import { toast } from "sonner";

export default function MemoriesGallery() {
  const [selectedImage, setSelectedImage] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastImageRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  useEffect(() => {
    const loadMemories = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/memories?limit=21&page=${page}`);
        if (response.ok) {
          const result = await response.json() as any;
          if(result.success){
            setTotalCount(result.totalCount || 0);
            setHasMore(result.totalCount > page * 21);
            setData(prev => {
              const incoming = result.memories ?? [];
              if (page === 1) return incoming;
              const existingIds = new Set(prev.map((m: any) => m.id));
              const newMemories = incoming.filter((m: any) => !existingIds.has(m.id));
              return [...prev, ...newMemories];
            });
          }
        } else {
          toast.error("Failed to load memories.");
        }
      } catch (error) {
        console.error("Error fetching memories:", error);
        toast.error("An error occurred while loading our collection.");
      } finally {
        setIsLoading(false);
      }
    };
    loadMemories();
  }, [page]);

  if (isLoading && page === 1) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-brand" />
      </div>
    );
  }

  if (!isLoading && data.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] py-40 text-muted-foreground">
        <Camera className="w-12 h-12 text-muted-foreground/20 mb-6" />
        <h3 className="font-serif text-2xl text-foreground mb-2">No memories yet.</h3>
        <p className="text-sm">Check back soon for updates to our gallery.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#fcfbf9] dark:bg-background min-h-screen font-sans text-foreground">
        <main className="pt-24 md:pt-32 pb-24 max-w-7xl mx-auto px-5 md:px-8">
          
          {/* Editorial Hero Section */}
          <section className="mb-16 md:mb-24 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h4 className="text-brand font-bold tracking-widest uppercase text-sm mb-6">
              Institutional Archive
            </h4>
            <h1 className="text-4xl md:text-6xl lg:text-[5rem] font-serif tracking-tight leading-tight text-foreground mb-6 max-w-4xl">
              Radharaman <span className="italic">Memories.</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              A curated visual archive capturing the spirit of excellence, campus life, and the milestones of our students.
            </p>
            
            <div className="mt-8 flex items-center justify-center gap-2 border-b border-border/60 pb-4 w-full max-w-3xl">
              <span className="text-sm font-medium tracking-widest uppercase text-muted-foreground">
                <span className="text-foreground">{totalCount}</span> Featured Photos
              </span>
            </div>
          </section>

          {/* Masonry Grid Optimized for Mobile */}
          <section>
            <div className="columns-1 md:columns-2 lg:columns-3 gap-5 md:gap-8">
              {data.map((memory, index) => {
                const isLastElement = index === data.length - 1;
                
                return (
                  <div
                    key={memory.id}
                    ref={isLastElement ? lastImageRef : null}
                    className="group break-inside-avoid mb-5 md:mb-8 cursor-pointer flex flex-col bg-card rounded-2xl md:rounded-none md:rounded-tr-3xl md:rounded-bl-3xl p-3 md:p-4 border border-border/40 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] hover:border-brand/20 transition-all duration-500 animate-in fade-in slide-in-from-bottom-8 fill-mode-both"
                    style={{ animationDelay: `${(index % 12) * 50}ms` }}
                    onClick={() => setSelectedImage(memory)}
                  >
                    {/* Image Area */}
                    <div className="rounded-xl overflow-hidden relative bg-muted aspect-auto">
                      <img
                        src={memory.imageUrl}
                        alt={memory.title}
                        loading="lazy"
                        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Subtle hover overlay for focus */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                    </div>

                    {/* Editorial Caption Area */}
                    <div className="pt-4 pb-2 px-2 flex flex-col justify-between h-full">
                      <h3 className="font-serif text-lg md:text-xl text-foreground leading-snug mb-2 group-hover:text-brand transition-colors duration-300">
                        {memory.title}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-auto">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand/50"></span>
                        <span className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
                          {memory.uploaderName || "Anonymous"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Loading Indicator */}
            {isLoading && page > 1 && (
              <div className="flex justify-center py-12 mt-4">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            )}

            {/* End of Content */}
            {!hasMore && data.length > 0 && (
              <div className="flex justify-center py-16 mt-8">
                <div className="w-12 h-[1px] bg-border" />
              </div>
            )}
          </section>
        </main>
      </div>

      {/* Optimized Lightbox Modal for Mobile */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 bg-background/95 backdrop-blur-xl animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute z-[101] top-4 right-4 md:top-8 md:right-8 text-foreground p-3 hover:bg-muted rounded-full transition-colors bg-background/50 backdrop-blur-md md:bg-transparent"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            <X className="w-6 h-6 md:w-8 md:h-8" />
          </button>

          <div
            className="relative w-full h-full md:h-auto md:max-w-5xl md:max-h-[85vh] flex flex-col scale-in-center bg-card md:bg-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Container */}
            <div className="relative w-full flex-1 md:h-[70vh] md:rounded-3xl overflow-hidden bg-black flex items-center justify-center">
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.title}
                loading="lazy"
                className="w-full h-full object-contain md:object-scale-down"
              />
            </div>
            
            {/* Title & Info Banner */}
            <div className="p-6 md:p-8 flex flex-col bg-card md:bg-background border-t border-border">
              <h2 className="text-xl md:text-3xl font-serif text-foreground leading-tight">{selectedImage.title}</h2>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-muted-foreground font-medium text-xs md:text-sm tracking-widest uppercase">
                  Captured by {selectedImage.uploaderName || "Anonymous"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


