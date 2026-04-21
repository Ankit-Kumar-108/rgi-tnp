"use client"
export const runtime = "edge";
import {
  Quote,
  ChevronRight,
  ArrowRight,
  BadgeCheck,
  MoveRight,
} from "lucide-react"
import Nav from "../components/layout/nav/nav"
import Footer from "../components/layout/footer/footer"
import Link from "next/link"
import { useEffect, useState } from "react";
import { Camera } from "lucide-react";

/* ──────────────────────────────────────
   Types
   ────────────────────────────────────── */

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

interface MemoryData {
  id: string;
  imageUrl: string;
  title: string;
  uploaderName: string;
  createdAt: string;
}

interface HomeDrive {
  id: string;
  companyName: string;
  driveDate: string;
  driveImages: DriveImageData[];
}

interface TestimonialData {
  id: string;
  name?: string;
  jobTitle?: string;
  currentCompany?: string;
  content?: string;
  profileImageUrl?: string;
}

/* ──────────────────────────────────────
   Component
   ────────────────────────────────────── */

export default function Home() {
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
  const [memories, setMemories] = useState<MemoryData[]>([]);
  const [driveGroups, setDriveGroups] = useState<DriveGroup[]>([]);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [loadingDrives, setLoadingDrives] = useState(true);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);
  const [loadingMemories, setLoadingMemories] = useState(true);

  /* ── Fetch drive images ── */
  useEffect(() => {
    const controller = new AbortController();

    const fetchDriveImages = async () => {
      try {
        const drivesRes = await fetch("/api/home/driveImages?limit=10", {
          signal: controller.signal
        });
        const drivesData = await drivesRes.json() as {
          success: boolean;
          drives: HomeDrive[];
        };

        if (!drivesData.success || !drivesData.drives) {
          setLoadingDrives(false);
          return;
        }

        const groups = drivesData.drives
          .filter((drive) => drive.driveImages.length > 0)
          .map((drive) => ({
            driveId: drive.id,
            title: drive.companyName,
            images: drive.driveImages,
          }));

        setDriveGroups(groups);
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error("Error fetching drive images:", error);
        }
      } finally {
        setLoadingDrives(false);
      }
    };

    fetchDriveImages();
    return () => controller.abort();
  }, []);

  /* ── Fetch testimonials ── */
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch("/api/home/testimonial");
        const data = (await response.json()) as TestimonialData[];
        if (!response.ok) {
          throw new Error("Failed to fetch testimonials");
        }
        setTestimonials(data);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setLoadingTestimonials(false);
      }
    };
    fetchTestimonials();
  }, []);

  /* ── Fetch approved memories ── */
  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const res = await fetch("/api/memories?limit=6");
        const data = (await res.json()) as { success: boolean; memories: MemoryData[] };
        if (data.success && data.memories) {
          setMemories(data.memories);
        }
      } catch (error) {
        console.error("Error fetching memories:", error);
      } finally {
        setLoadingMemories(false);
      }
    };
    fetchMemories();
  }, []);

  /* ── Auto-scroll carousel ── */
  useEffect(() => {
    if (driveGroups.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentGroupIndex((prev) => (prev + 1) % driveGroups.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [driveGroups.length]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Fixed Top Navigation */}
      <Nav />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-brand/5">
          <div className="max-w-7xl mx-auto px-3 lg:px-20 py-12 lg:py-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1 flex flex-col gap-6 md:gap-8">
                <div className="hidden md:inline-flex items-center gap-2 bg-brand/10 text-brand px-4 py-1.5 rounded-full w-fit">
                  <BadgeCheck className="text-lg" />
                  <span className="text-xs font-bold uppercase tracking-wider">Top Rated Placement Cell</span>
                </div>
                <h1 className="text-3xl md:text-5xl lg:text-7xl font-black leading-tight tracking-tight">
                  Empowering Careers at <span className="text-brand">RGI</span>
                </h1>
                <p className="text-[14px] md:text-lg text-muted-foreground max-w-lg leading-relaxed">
                  Connecting top-tier talent with global industry leaders. Join our legacy of excellence and secure your future with world-class opportunities.
                </p>
                <div className="flex flex-wrap gap-2 md:gap-4">
                  <Link href="/recruiters/register">
                    <button className="bg-brand text-white px-6 py-2.5 rounded-xl text-base font-bold flex items-center gap-2 hover:scale-105 transition-transform group cursor-pointer">
                      Hire from Us <div className="group-hover:translate-x-2 transition-all duration-300"><MoveRight /></div>
                    </button>
                  </Link>
                  <Link href="/students/login">
                    <button className="bg-background border-2 border-brand/20 text-foreground px-6 py-2.5 rounded-xl text-base font-bold hover:bg-surface cursor-pointer hover:scale-105 transition-all duration-300">
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
                <div className="relative group">
                  <div className="absolute -inset-4 bg-brand/10 rounded-3xl blur-xl group-hover:bg-brand/15 transition-all"></div>
                  <div className="relative h-112.5 w-full rounded-2xl bg-cover bg-center shadow-2xl overflow-hidden border-4 border-background" data-alt="Modern college campus students collaborating outdoors" style={{ backgroundImage: "url(/images/RGI.jpg)" }}>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/*Drive Images Marquee Carousel*/}
        {loadingDrives ? (
          <section className="py-16 md:py-24 bg-gradient-to-b from-background via-brand/[0.02] to-background">
            <div className="max-w-7xl mx-auto px-3 lg:px-20">
              <div className="flex flex-col items-center gap-4 mb-12">
                <div className="h-6 w-48 rounded-full skeleton-shimmer" />
                <div className="h-10 w-80 rounded-xl skeleton-shimmer" />
                <div className="h-4 w-64 rounded-full skeleton-shimmer" />
              </div>
              <div className="grid grid-cols-4 grid-rows-2 gap-3 md:gap-4 h-[280px] md:h-[420px]">
                <div className="col-span-2 row-span-2 rounded-2xl skeleton-shimmer" />
                <div className="col-span-1 row-span-1 rounded-2xl skeleton-shimmer" />
                <div className="col-span-1 row-span-1 rounded-2xl skeleton-shimmer" />
                <div className="col-span-2 row-span-1 rounded-2xl skeleton-shimmer" />
              </div>
            </div>
          </section>
        ) : driveGroups.length > 0 && (
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
              <div className="relative" style={{ minHeight: "480px" }}>
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
                        <div className="bg-card border border-border rounded-2xl px-6 py-3 shadow-md flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                          <h3 className="text-base md:text-lg font-bold text-foreground">
                            Successful Campus Drive of{" "}
                            <span className="text-brand">{group.title}</span>
                          </h3>
                        </div>
                      </div>

                      {/* 4-image asymmetric grid */}
                      <div className="grid grid-cols-4 grid-rows-2 gap-3 md:gap-4 h-[280px] md:h-[420px]">
                        {/* Image 1 — large (spans 2 cols, 2 rows) */}
                        {group.images[0] && (
                          <div className="col-span-2 row-span-2 rounded-2xl overflow-hidden relative group/img shadow-lg">
                            <img
                              src={group.images[0].imageUrl}
                              alt={group.images[0].title}
                              className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300" />
                          </div>
                        )}
                        {/* Image 2 — top right */}
                        {group.images[1] && (
                          <div className="col-span-1 row-span-1 rounded-2xl overflow-hidden relative group/img shadow-lg">
                            <img
                              src={group.images[1].imageUrl}
                              alt={group.images[1].title}
                              className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300" />
                          </div>
                        )}
                        {/* Image 3 — top far-right */}
                        {group.images[2] && (
                          <div className="col-span-1 row-span-1 rounded-2xl overflow-hidden relative group/img shadow-lg">
                            <img
                              src={group.images[2].imageUrl}
                              alt={group.images[2].title}
                              className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300" />
                          </div>
                        )}
                        {/* Image 4 — bottom right (spans 2 cols) */}
                        {group.images[3] && (
                          <div className="col-span-2 row-span-1 rounded-2xl overflow-hidden relative group/img shadow-lg">
                            <img
                              src={group.images[3].imageUrl}
                              alt={group.images[3].title}
                              className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300" />
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
                      aria-label={`Go to ${group.title}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Director's Section */}
        <section className="py-24 px-6 lg:px-20 max-w-7xl mx-auto" id="about">
          <div
            className="bg-card/80 backdrop-blur-[3px] rounded-2xl shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-lg)] overflow-hidden border border-border hover:scale-[1.01] transition-all duration-300"
          >
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-1/3 aspect-square lg:aspect-auto">
                <img
                  alt="Robin Samuel, Director T&P"
                  loading="lazy"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIBYviOOWoEn1D6xTyYMluquzqttL4SCoQ8YTdPoSTTNYQLCqya8DiCAs66JmTJiHyRmHxUpVjA4GCYy4fhForyUeFzidpP8yNMIkHu_oaQRp9Krmp-Gz1K9nwFA-4vEgEubQQch8uCbxjl-ImtNgvWcFKvMoDY-gPzvpkp5HvSUSDe_vCwfaHUk_I7xlMHmS6Z4yoMHaYo8erwwh2Y4C_p5eHMCF4UEtWfpnKSjQrYRwDmJRAQhUxaICeli4FyMR5td48o8_nWg"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="lg:w-2/3 p-8 lg:p-16 flex flex-col justify-center">
                <div className="mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">Director&apos;s Message</h2>
                  <p className="text-brand font-semibold text-lg">James Kuttappan, Director (T&P)</p>
                </div>
                <Quote className="text-brand text-5xl mb-4" />
                <p className="text-muted-foreground text-[13px] md:text-lg leading-relaxed mb-8 italic">
                  &quot;Welcome to the gateway of professional excellence. At Radharaman Group, our commitment is to bridge the gap between academic brilliance and global corporate requirements. We don&apos;t just place students we architect careers by fostering an environment of continuous learning and industry exposure.&quot;
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Deputy Director's Section */}
        <section className="pb-24 px-6 lg:px-20 max-w-7xl mx-auto">
          <div
            className="bg-card/80 backdrop-blur-[3px] rounded-2xl shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-lg)] overflow-hidden border border-border hover:scale-[1.01] transition-all duration-300">
            <div className="flex flex-col lg:flex-row-reverse">
              <div className="lg:w-1/3 aspect-square lg:aspect-auto">
                <img
                  alt="Deputy Director T&amp;P"
                  loading="lazy"
                  className="w-full h-full object-cover"
                  data-alt="Professional portrait of Deputy Director in business attire"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIBYviOOWoEn1D6xTyYMluquzqttL4SCoQ8YTdPoSTTNYQLCqya8DiCAs66JmTJiHyRmHxUpVjA4GCYy4fhForyUeFzidpP8yNMIkHu_oaQRp9Krmp-Gz1K9nwFA-4vEgEubQQch8uCbxjl-ImtNgvWcFKvMoDY-gPzvpkp5HvSUSDe_vCwfaHUk_I7xlMHmS6Z4yoMHaYo8erwwh2Y4C_p5eHMCF4UEtWfpnKSjQrYRwDmJRAQhUxaICeli4FyMR5td48o8_nWg"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="lg:w-2/3 p-8 lg:p-16 flex flex-col justify-center">
                <div className="mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">Dy Director&apos;s Message</h2>
                  <p className="text-brand font-semibold text-lg">Robin P. Samuel, Dy Director (T&amp;P)</p>
                </div>
                <Quote className="text-brand text-5xl mb-4" />
                <p className="text-muted-foreground text-[14px] md:text-lg leading-relaxed mb-8 italic">
                  &quot;Our focus is on the holistic development of our students. Through rigorous aptitude training, soft skills workshops, and technical certifications, we ensure our graduates are not just job-ready, but industry-leading. We value our partnerships with recruiters and strive to provide a seamless hiring experience.&quot;
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* Placement Team Grid */}
        <section className="max-w-7xl mx-auto px-3 lg:px-20 py-16">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-2" >The Placement Team</h2>
              <p className="text-muted-foreground text-xs md:text-lg" >The dedicated minds behind our student success.</p>
            </div>
            <button className="text-brand font-bold flex items-center gap-1 hover:gap-2 transition-all" >View All <ChevronRight className="text-brand w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 md:gap-5 gap-3">
            {/* <!-- Card 1 --> */}
            <div className="bg-card rounded-xl hover:scale-[1.01] border overflow-hidden border-border shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-300">
              <div className="aspect-2.5/3 bg-cover bg-top transition-transform" data-alt="Female staff member profile" style={{ backgroundImage: "url(https://lh3.googleusercontent.com/aida-public/AB6AXuCwfoJsfJpSlw13cw9oHHcBFpUmlThTV4dahXFh0Qj0CAh37D3VkPF5Vy1WZ84fBrK27NKLkXJe9RdG7AK2_YVd56NxRE4WEisDxlGzpaHsjKPTDR4U181mIlvvE1U5v6IWNlaG_DgTioYwka5jHwh_pve2IGBpiChT2QMrlz4k151kkJSQh6DP0UchBMNC4_S69_b1AMPjNTlMUv9w1e1pD9_ibxhXkKedP9XEQnEHpH6UEZbIhd1RaiUAIFn7iUNBNm1Piuq4rA)" }}></div>
              <div className="p-4">
                <h3 className="font-bold text-sm md:text-lg" >Dr. Anjali Sharma</h3>
                <p className="text-brand text-xs md:text-sm font-medium" >Corporate Relations</p>
              </div>
            </div>
            {/* <!-- Card 2 --> */}
            <div className="bg-card rounded-xl overflow-hidden border hover:scale-[1.01] border-border shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-300">
              <div className="aspect-2.5/3 bg-cover bg-top transition-transform" data-alt="Male staff member profile" style={{ backgroundImage: "url(https://lh3.googleusercontent.com/aida-public/AB6AXuAlBGcrKwosCrkAFG1qE2hMewRAhTS-EYKa7SX5VzKmhlBmcIztS0GsQ0_Rgz9VISZXklQKDWvsxaR_LvJAkVsHULlHlXfyZ4nWerTDPLdIe3qjX8LxGmJ3zuGiOPazUvP0C2eJvz1M6jzY3GQqrki-7wjTCNTNln4d3_JSSh3Es0CreOhKnzrPJfaIyqQ8jMSk_X8uCLGzJoYfiYyXC4HpIGJ7IJ-ERWVMjRjgv78yuEYpx2COfNFV579HNLl8x406i5IuTeIzAA)" }}></div>
              <div className="p-4">
                <h3 className="font-bold text-sm md:text-lg" >Vikram Malhotra</h3>
                <p className="text-brand text-xs md:text-sm font-medium" >Technical Trainer</p>
              </div>
            </div>
            {/* <!-- Card 3 --> */}
            <div className="bg-card rounded-xl hover:scale-[1.01] overflow-hidden border border-border shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-300">
              <div className="aspect-2.5/3 bg-cover bg-top" data-alt="Female student volunteer" style={{ backgroundImage: "url(https://lh3.googleusercontent.com/aida-public/AB6AXuBvMtr2p2ngRt9hK1Jn6FrV4XHZlxx9MzK655JpTskmWj_hS4QAP6MX1VA4MFE8Po0VpwOr8M6vd2CZaeq3Da1fYO-6cMzMVaSOKbqJaXyP-O3kiQo3iYP7wqUb7DB_j3HahZcUqeW8hCdtz_hdJPm_ocN6cwLxwCbPVw2mnl-cwSyCjX8jq6bXiu_yHsaYt6HTLHOztoOuHm-Lym8KraBLLFh8MDKLUuBBxjG9xv1dbyZvYdy2Mqj-_EohWc67WEV4fgoYMBFSSQ)" }}></div>
              <div className="p-4">
                <h3 className="font-bold text-sm md:text-lg" >Neha Singh</h3>
                <p className="text-brand text-xs md:text-sm font-medium" >Student Lead</p>
              </div>
            </div>
            {/* <!-- Card 4 --> */}
            <div className="bg-card rounded-xl hover:scale-[1.01] overflow-hidden border border-border shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-300">
              <div className="aspect-2.5/3 bg-cover bg-top" data-alt="Male student volunteer" style={{ backgroundImage: "url(https://lh3.googleusercontent.com/aida-public/AB6AXuDcieaOwaB_8kavE_tydgpoKCMmW8zgXo46rbL1ABkBG2Xl4Ugae-0S9ZfXIhXGD86rFKMPXpNiw_XsXOlrp4KlaL87K1DgrihXRXIQqxow3qW_fXec3xCOiOGV8TeBp5dhzAlRguHWBBmJJj2xqUdmMvJ_VwzkhQoYKarT-AjNU_9KDusbNsiA6i9S1dt0RwqUepiImzSPwAq8IzU1sXLpDl88wppHQdcrIsM3jwFOxaA3PtZXtNmtclNuTgVmxZeNOH_yFkBJFA)" }}></div>
              <div className="p-4">
                <h3 className="font-bold text-sm md:text-lg" >Rahul Verma</h3>
                <p className="text-brand text-xs md:text-sm font-medium" >Event Coordinator</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stakeholder Sections */}
        <section className="py-24 px-3 lg:px-20 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                title: "For Students",
                desc: "Access placement portals, training resources, and mock interviews.",
                btn: "Student Login",
                link: "/students/login",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHKr33DbqDXOMcpZm0eMAJC5hjINXKljRdpGE23wNRXATHdX_uVdvJaILEzettWwTjc9BWymhXDOYI_650EsS_i0zchK4OoTbpD3ndPFnNxLxdCF63EBJoNiCCVSrNQv6Jy1B9anPQOjf661YqpcO_Vv3jiDM3lerHVtgOkzlrDxdvfD6BCKyMcsbXKB6bSe2Nr8DpKx4WhmMlfra-ARFgb-dwelBAbgMMBlvGFb2H_KWrVuCFc2LPDyUp5jEnsr4vjuUk0Ugunw"
              },
              {
                title: "For Recruiters",
                desc: "Hire top-tier talent and schedule campus recruitment drives.",
                btn: "Recruitment Portal",
                link: "/recruiters/login",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDI3AGXNcBdGYNnQC6rTAaVBW9jOcMUXZsclcq6racWYLm5CE51KLDmOpDGPCxuImcM64dL2yzo6NbPLi48ZGWDbKHoFsShQDhbrE5a7AB3Zd8-pI96vVUd3FZTMPRviTnSNrE15dg2CaGTu0tUKxb1hlgBFuIC6cJtb84L7Ow3753HPwNwP6bA_O2xDRTynWdRvy2_Sg5QaKwnaMJ2Px55UQMeQgWIUjAwYZp1wYe3HE1klyE8JAZxIZgDs4FtUY1BduXqQblkAQ"
              },
              {
                title: "For Alumni",
                desc: "Mentor the next batch and stay connected with your alma mater.",
                btn: "Connect Now",
                link: "/alumni/alumni-register",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCXVPK8Cn5Ib2YCbG42UxeqSLconAJ1rUOAaN1WgNq91TRkd4dstErCv2ZC5I9Vw4txaPccPIgSBN4hNDoC2R2hNg84z0AuQeP_UA_j_SFjElRn4PpWfV5Vxug1jHaM5Qni6oo1BTjzSYDMIw2fHZxsckI-itXPhltlu1I666w7uWZEAp9BKR9wp-mDSLcoYJgRsjVatn0Jh1nQoSFLs0KGz6QhqxG-7VKmb8wuFaYSqMadSDDa3RPNd5_tqe-4y2BvBsIqMYa8UA"
              },
            ].map((item, i) => (
              <div
                key={i}
                className="relative group overflow-hidden rounded-2xl h-100"
              >
                <img
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  src={item.img}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 p-8 w-full">
                  <h3 className="text-white text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-slate-300 text-sm mb-4">{item.desc}</p>
                  <Link href={item.link} className="text-brand font-bold flex items-center gap-2 hover:translate-x-2 transition-transform w-fit">
                    {item.btn} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-brand/5 py-24" id="alumni">
          <div className="max-w-7xl mx-auto px-3 lg:px-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black tracking-tight mb-4" >Voices of Success</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto" >Hear from our alumni who are now leading the tech world from top global corporations.</p>
            </div>
            {/* Testimonial Cards */}
            {loadingTestimonials ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-card p-4 md:p-10 rounded-3xl shadow-[var(--shadow-sm)] border border-border flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full skeleton-shimmer mb-6" />
                    <div className="h-5 w-32 rounded skeleton-shimmer mb-2" />
                    <div className="h-3 w-24 rounded skeleton-shimmer mb-6" />
                    <div className="space-y-2 w-full">
                      <div className="h-3 w-full rounded skeleton-shimmer" />
                      <div className="h-3 w-4/5 rounded skeleton-shimmer" />
                      <div className="h-3 w-3/5 rounded skeleton-shimmer" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="bg-card p-4 md:p-10 rounded-3xl shadow-[var(--shadow-sm)] border border-border hover:shadow-[var(--shadow-lg)] hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group">
                    <div className="w-32 h-32 rounded-full bg-cover bg-center mb-6 ring-4 ring-brand/10 group-hover:ring-brand/30 transition-all" data-alt="Alumni testimonial" style={{ backgroundImage: testimonial.profileImageUrl ? `url('${testimonial.profileImageUrl}')` : "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD-4qpQG9rSHLujKoHhrbgWRAg81sFBu41MDA54QQ14Y6yYxoww19N7Hs6lybLRgvZCg5yNw-06wJ8p2GwAuZrN9ytupLwK1aRZSm47WIYXx5ld9vONPYIsuhD5KGlStRJhFuJTFHl_Hc-t-2CxveYwpsep0lUKrYPz6ghsEv9_r2NE8H2tzkba6XLY91OoOHMGHGA4iF6n7TtSxX_Dr3zeJ206-8b6lxuPWVgO5R0mihIiXboKj1OEPXe_2qH9vxxFdK4gE9e5YQ')" }}></div>
                    <div className="mb-6">
                      <h3 className="text-lg md:text-xl font-bold text-foreground">{testimonial.name || "Anonymous"}</h3>
                      <p className="text-xs md:text-sm text-brand font-semibold uppercase tracking-wider">{testimonial.jobTitle ? `${testimonial.jobTitle} at ${testimonial.currentCompany}` : "Alumni"}</p>
                    </div>
                    <div className="relative px-1 md:px-4">
                      <Quote className="text-brand/60  md:text-4xl absolute -top-5 -left-2" />
                      <p className="text-muted-foreground text-xs md:text-md leading-relaxed italic">
                        &ldquo;{testimonial.content || "No content available."}&rdquo;
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Memories Gallery — Dynamic from approved memories */}
        <section className="max-w-7xl mx-auto px-3 lg:px-20 py-24">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold">Life at Radharaman <span className="text-brand">Placements</span></h2>
              <p className="text-muted-foreground text-sm mt-2">Captured by our students and alumni community</p>
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

          {loadingMemories ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[200px]">
              <div className="col-span-2 row-span-2 rounded-2xl skeleton-shimmer" />
              <div className="rounded-2xl skeleton-shimmer" />
              <div className="rounded-2xl skeleton-shimmer" />
              <div className="col-span-2 rounded-2xl skeleton-shimmer" />
            </div>
          ) : memories.length >= 4 ? (
            /* ── Dynamic grid from approved memories ── */
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[200px]">
              {/* Memory 1 — Large (2 cols × 2 rows) */}
              <div className="col-span-2 row-span-2 rounded-2xl overflow-hidden relative group">
                <img
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  alt={memories[0].title}
                  loading="lazy"
                  src={memories[0].imageUrl}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                  <p className="text-white font-bold text-lg">{memories[0].title}</p>
                  <p className="text-white/70 text-xs mt-1">by {memories[0].uploaderName}</p>
                </div>
              </div>
              {/* Memory 2 */}
              <div className="rounded-2xl overflow-hidden relative group">
                <img
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  alt={memories[1].title}
                  loading="lazy"
                  src={memories[1].imageUrl}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <p className="text-white text-xs font-bold">{memories[1].title}</p>
                  <p className="text-white/70 text-[10px] mt-0.5">by {memories[1].uploaderName}</p>
                </div>
              </div>
              {/* Memory 3 */}
              <div className="rounded-2xl overflow-hidden relative group">
                <img
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  alt={memories[2].title}
                  loading="lazy"
                  src={memories[2].imageUrl}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <p className="text-white text-xs font-bold">{memories[2].title}</p>
                  <p className="text-white/70 text-[10px] mt-0.5">by {memories[2].uploaderName}</p>
                </div>
              </div>
              {/* Memory 4 — Wide (2 cols × 1 row) */}
              <div className="col-span-2 rounded-2xl overflow-hidden relative group">
                <img
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  alt={memories[3].title}
                  loading="lazy"
                  src={memories[3].imageUrl}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                  <p className="text-white font-bold">{memories[3].title}</p>
                  <p className="text-white/70 text-xs mt-1">by {memories[3].uploaderName}</p>
                </div>
              </div>
            </div>
          ) : (
            /* ── Fallback: static placeholder grid ── */
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[200px]">
              <div className="col-span-2 row-span-2 rounded-2xl overflow-hidden relative group">
                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" data-alt="Students celebrating" loading="lazy" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC97PRhCgez5vt9saBg50a81NQl00I3X5oJekFcGncJ_rtn8lGAgg0R5rdfYKEJss12iI-MMSMIJO_5AAP8QVSVr4zN2sO4g-9DOSXkB3RmfbmhlPbFvFqLoOogUPSE6F3YveI_u4x8HKjtV1sfoBlbGstnVLEwiyLJLa2iTEAzgj0KRt5wgCCIJJNXoVXvwYpHWFpKlJf0wQX6LSTDrTEVnC8Aky63CuM1Q7s_mp2WIs1HYWn-q6LmaA5trwzhCtdW31OdBgx7zw" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand/70 via-brand/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <p className="text-white font-bold">Success Celebration 2023</p>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden relative group">
                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" data-alt="Workshop" loading="lazy" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDh6hS3y3An0YD7BtmPrJjDJy3QqxeWstYyROERKY0bxcMmfi3NtKSgBtciSNen085rHJLes5JrTcoA5T4Vf2WNw2IM8kRVvRLyoasWkdNmfAov8REckXa_OE0be3DmEtrTvkNzzfew3SjV3XPxzdopBINZ2o5vzBcqR7jYZez5IOP6LzmIYnvjp5gPQWTS5tYpBwlhyiNkgeN9P4YOck_f3zhTSgxGGAeIEWsTG4EcdZH06oT7Si25K0FozYFtqQkSJaOn-hOc8g" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand/70 via-brand/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <p className="text-white text-xs font-bold">Industry Workshop</p>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden relative group">
                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" data-alt="Career Fair" loading="lazy" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfVL3bulkTn6s12N7oW80mh_GCLiSw_N7D4kSqzKOmW9UHhtz4eYA_dhYsnps6YBYyPDyK0b-VMfNHvHKsuz-q-4Wk3Oc1PfptLnBo8ms3ccnPWg14Cr7W6TOLNLmFWLeOvI30Uq3He2J8U-RWMqUpyfHiREvsA6uZZbhREsPCNnQJdqXfkBPrrT1a4qAvXr223gUxvoPH1wBvSTbad54mHToce10X7mwyZxOZYFstCQ1mfxW6UAe08UBm07ZZmtcUgM4KOPtGiQ" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand/70 via-brand/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <p className="text-white text-xs font-bold">Career Fair</p>
                </div>
              </div>
              <div className="col-span-2 rounded-2xl overflow-hidden relative group">
                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" data-alt="Mentorship" loading="lazy" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTeMzT5fUnQNwQOk4-MtK4UKshACdx6vF5j3zM4xwJfWNXxO2LO9g37Nht5WGURIQCVpgw01qsuzaTli-rQkFp6_jc6PldL-Hpf43BoLX0IzXAY40OB3SudgNuAraLAVrJZjEdqdoj79narEEugwtM0OeghOU_Mggn4GTVSRHnsRfrzmzTZHeSi-9ndWU0iJYDWdBTVUAJV9uzq6lGBKYeXnGQIq1ziSdTYOhys206aN2QueMgXLfOFykuUFLCXSLK6WND8phzXg" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand/70 via-brand/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <p className="text-white font-bold">Corporate Mentorship</p>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
      {/* Footer — Now theme-aware */}
      <Footer />
    </div>
  )
}
