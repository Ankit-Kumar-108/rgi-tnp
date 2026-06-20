"use client"
import Image from "next/image";
import Link from "next/link";
import { Camera, ArrowRight, X } from "lucide-react";
import { useState } from "react";

interface MemoryData {
  id: string;
  imageUrl: string;
  title: string;
  uploaderName: string;
  createdAt: string;
}

export default function MemoryGallery({ memories }: { memories: MemoryData[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<string | null>(null);
  return (
    <section className="relative z-50 max-w-7xl mx-auto px-4 md:px-8 lg:px-20 section-y">
      <div className="flex flex-col md:flex-row items-center justify-between mb-10 md:mb-14 gap-4">
        <div className="text-center md:text-left">
          <h2 className="text-2xl md:text-4xl font-black tracking-tight">Life at Radharaman <span className="text-brand">Placements</span></h2>
          <p className="text-muted-foreground text-sm md:text-base mt-2">Captured by our students and alumni community</p>
        </div>
        <Link
          href="/memories"
          className="flex items-center gap-2 text-brand font-bold text-sm hover:gap-3 transition-all"
        >
          <Camera className="w-4 h-4" />
          View All Memories
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {memories.length >= 4 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[200px]">
          {/* Memory 1 — Large (2 cols × 2 rows) */}
          <div className="col-span-2 row-span-2 rounded-lg overflow-hidden relative group">
            <Image
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              alt={memories[0].title}
              src={memories[0].imageUrl}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div
            onClick={() => {setIsModalOpen(!isModalOpen); setSelectedMemory(memories[0].imageUrl || "")}}
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
              <p className="text-white font-bold text-lg">{memories[0].title}</p>
              <p className="text-white/70 text-xs mt-1">by {memories[0].uploaderName}</p>
            </div>
          </div>
          {/* Memory 2 */}
          <div className="rounded-lg overflow-hidden relative group">
            <Image
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              alt={memories[1].title}
              src={memories[1].imageUrl}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div 
            onClick={() => {setIsModalOpen(!isModalOpen); setSelectedMemory(memories[1].imageUrl || "")}}
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
              <p className="text-white text-xs font-bold">{memories[1].title}</p>
              <p className="text-white/70 text-xs mt-0.5">by {memories[1].uploaderName}</p>
            </div>
          </div>
          {/* Memory 3 */}
          <div className="rounded-lg overflow-hidden relative group">
            <Image
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              alt={memories[2].title}
              src={memories[2].imageUrl}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div 
            onClick={() => {setIsModalOpen(!isModalOpen); setSelectedMemory(memories[2].imageUrl || "")}} 
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
              <p className="text-white text-xs font-bold">{memories[2].title}</p>
              <p className="text-white/70 text-xs mt-0.5">by {memories[2].uploaderName}</p>
            </div>
          </div>
          {/* Memory 4 — Wide (2 cols × 1 row) */}
          <div className="col-span-2 rounded-lg overflow-hidden relative group">
            <Image
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              alt={memories[3].title}
              src={memories[3].imageUrl}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div 
            onClick={() => {setIsModalOpen(!isModalOpen); setSelectedMemory(memories[3].imageUrl || "")}} 
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
              <p className="text-white font-bold">{memories[3].title}</p>
              <p className="text-white/70 text-xs mt-1">by {memories[3].uploaderName}</p>
            </div>
          </div>
        </div>
      ) : (
        /* ── Fallback: static placeholder grid ── */
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[200px]">
          <div className="col-span-2 row-span-2 rounded-lg overflow-hidden relative group">
            <Image className="object-cover group-hover:scale-110 transition-transform duration-700" alt="Students celebrating" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC97PRhCgez5vt9saBg50a81NQl00I3X5oJekFcGncJ_rtn8lGAgg0R5rdfYKEJss12iI-MMSMIJO_5AAP8QVSVr4zN2sO4g-9DOSXkB3RmfbmhlPbFvFqLoOogUPSE6F3YveI_u4x8HKjtV1sfoBlbGstnVLEwiyLJLa2iTEAzgj0KRt5wgCCIJJNXoVXvwYpHWFpKlJf0wQX6LSTDrTEVnC8Aky63CuM1Q7s_mp2WIs1HYWn-q6LmaA5trwzhCtdW31OdBgx7zw" fill sizes="(max-width: 768px) 100vw, 50vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand/70 via-brand/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
              <p className="text-white font-bold">Success Celebration 2023</p>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden relative group">
            <Image className="object-cover group-hover:scale-110 transition-transform duration-700" alt="Workshop" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDh6hS3y3An0YD7BtmPrJjDJy3QqxeWstYyROERKY0bxcMmfi3NtKSgBtciSNen085rHJLes5JrTcoA5T4Vf2WNw2IM8kRVvRLyoasWkdNmfAov8REckXa_OE0be3DmEtrTvkNzzfew3SjV3XPxzdopBINZ2o5vzBcqR7jYZez5IOP6LzmIYnvjp5gPQWTS5tYpBwlhyiNkgeN9P4YOck_f3zhTSgxGGAeIEWsTG4EcdZH06oT7Si25K0FozYFtqQkSJaOn-hOc8g" fill sizes="(max-width: 768px) 50vw, 25vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand/70 via-brand/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
              <p className="text-white text-xs font-bold">Industry Workshop</p>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden relative group">
            <Image className="object-cover group-hover:scale-110 transition-transform duration-700" alt="Career Fair" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfVL3bulkTn6s12N7oW80mh_GCLiSw_N7D4kSqzKOmW9UHhtz4eYA_dhYsnps6YBYyPDyK0b-VMfNHvHKsuz-q-4Wk3Oc1PfptLnBo8ms3ccnPWg14Cr7W6TOLNLmFWLeOvI30Uq3He2J8U-RWMqUpyfHiREvsA6uZZbhREsPCNnQJdqXfkBPrrT1a4qAvXr223gUxvoPH1wBvSTbad54mHToce10X7mwyZxOZYFstCQ1mfxW6UAe08UBm07ZZmtcUgM4KOPtGiQ" fill sizes="(max-width: 768px) 50vw, 25vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand/70 via-brand/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
              <p className="text-white text-xs font-bold">Career Fair</p>
            </div>
          </div>
          <div className="col-span-2 rounded-lg overflow-hidden relative group">
            <Image className="object-cover group-hover:scale-110 transition-transform duration-700" alt="Mentorship" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTeMzT5fUnQNwQOk4-MtK4UKshACdx6vF5j3zM4xwJfWNXxO2LO9g37Nht5WGURIQCVpgw01qsuzaTli-rQkFp6_jc6PldL-Hpf43BoLX0IzXAY40OB3SudgNuAraLAVrJZjEdqdoj79narEEugwtM0OeghOU_Mggn4GTVSRHnsRfrzmzTZHeSi-9ndWU0iJYDWdBTVUAJV9uzq6lGBKYeXnGQIq1ziSdTYOhys206aN2QueMgXLfOFykuUFLCXSLK6WND8phzXg" fill sizes="(max-width: 768px) 100vw, 50vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand/70 via-brand/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
              <p className="text-white font-bold">Corporate Mentorship</p>
            </div>
          </div>
        </div>
      )}
      {/* Memory modal */}
      {isModalOpen && memories && (
        <div className="fixed inset-0 z-[100] w-full h-full flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <button
            onClick={() => setIsModalOpen(!isModalOpen)}
            className="fixed z-[101] top-4 right-4 md:top-6 md:right-6 p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all border border-white/20 hover:scale-110 shadow-lg"
            aria-label="Close"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <div className="relative w-full h-full max-h-[85vh] md:max-w-[90vw] lg:max-w-[80vw] mx-auto flex items-center justify-center animate-in zoom-in-[0.98] duration-300">
            {selectedMemory && (
              <img
                src={selectedMemory}
                alt="Memory"
                className="max-w-full max-h-[85vh] rounded-lg drop-shadow-2xl object-contain"
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
