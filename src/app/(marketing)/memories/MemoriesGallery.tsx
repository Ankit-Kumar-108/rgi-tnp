"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, X, Camera, ImageIcon } from "lucide-react";
import { toast } from "sonner";

export default function MemoriesGallery() {
  const [selectedImage, setSelectedImage] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [totalCount, setTotalCount] = useState(0)

  const observer = useRef<IntersectionObserver | null>(null)
  const lastImageRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) {
      return
    }
    if (observer.current) {
      observer.current.disconnect()
    }

    observer.current = new IntersectionObserver(enteries => {
      if (enteries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1)
      }
    })
    if (node) observer.current.observe(node)
  },[isLoading, hasMore])



  useEffect(() => {
    const loadMemories = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/memories?limit=21&page=${page}`)
        if (response.ok) {
          const result = await response.json() as any
          if(result.success){
            setTotalCount(result.totalCount || 0)
            setHasMore(result.totalCount > page * 21)
            setData(prev => {
              const incoming = result.memories ?? []
              if (page === 1) return incoming
              const existingIds = new Set(prev.map((m: any) => m.id))
              const newMemories = incoming.filter((m: any) => !existingIds.has(m.id))
              return [...prev, ...newMemories]
            })
          }
        } else {
          toast.error("Failed to load memories.")
        }
      } catch (error) {
        console.error("Error fetching memories:", error)
        toast.error("An error occurred while loading our collection.")
      } finally {
        setIsLoading(false)
      }
    }
    loadMemories()
  }, [page]);

  const fetchMemories = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/memories");
      if (response.ok) {
        const result = await response.json() as any;
        setData(result);
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

  if (isLoading && page === 1) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-4xl text-brand" />
      </div>
    );
  }

  if (!isLoading && data.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center px-6">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center text-muted-foreground/30">
          <Camera className="w-10 h-10" />
        </div>
        <div>
          <p className="text-xl font-bold text-foreground">No memories found yet.</p>
          <p className="text-muted-foreground text-sm max-w-xs mt-1">Our gallery is currently empty, but check back soon for updates!</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="pt-32 pb-20 max-w-7xl mx-auto px-6 flex-1">
        <header className="mb-16 space-y-4 text-center md:text-left">
          <span className="text-brand font-bold text-xs uppercase tracking-[0.3em] mb-4 block">
            Institutional Archive
          </span>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight text-foreground leading-none">
                Radharaman <span className="text-brand">Memories</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mt-6 leading-relaxed">
                A curated visual archive capturing the spirit of excellence, campus life, and the milestones of our students.
              </p>
            </div>
            
            {/* Added a nice little counter for the UI */}
            <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-xl border border-border w-fit mx-auto md:mx-0">
              <ImageIcon className="w-4 h-4 text-brand" />
              <span className="text-sm font-bold text-muted-foreground">
                <span className="text-foreground">{totalCount}</span> Photos
              </span>
            </div>
          </div>
        </header>

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {data.map((memory, index) => {
            const isLastElement = index === data.length - 1;
            
            return (
            <div
              key={memory.id}
              ref={isLastElement ? lastImageRef : null} // Attach the sensor to the last image!
              className="relative group break-inside-avoid cursor-pointer rounded-3xl overflow-hidden border border-border/50 bg-muted shadow-sm hover:shadow-xl hover:border-brand/30 transition-all duration-500"
              onClick={() => setSelectedImage(memory)}
            >
              {/* Image Component */}
              <img
                src={memory.imageUrl}
                alt={memory.title}
                loading="lazy"
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Overlay Info */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <h3 className="text-white font-bold text-lg leading-tight mb-1">{memory.title}</h3>
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  Shared by {memory.uploaderName || "Anonymous"}
                </span>
              </div>
            </div>
          )})}
        </div>

        {/* Bottom Loading Indicator */}
        {isLoading && page > 1 && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-brand" />
          </div>
        )}

        {/* End of list message */}
        {!hasMore && data.length > 0 && (
          <div className="text-center py-12 text-muted-foreground font-bold text-sm">
            You've reached the end of our gallery!
          </div>
        )}
      </main>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/95 backdrop-blur-xl animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute z-[101] top-8 right-8 text-foreground p-3 hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-8 h-8" />
          </button>

          <div
            className="relative max-w-5xl w-full max-h-[85vh] flex flex-col scale-in-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-[75vh] rounded-3xl overflow-hidden shadow-2xl border border-border bg-black/10">
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.title}
                loading="lazy"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="mt-6 flex justify-between items-center px-4 bg-background text-foreground">
              <div>
                <h2 className="text-xl md:text-3xl font-black tracking-tight">{selectedImage.title}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-slate-400 font-bold text-sm md:text-base tracking-widest uppercase mb-0.5">Shared by {selectedImage.uploaderName}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
