"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

interface VolunteerData {
  id: string;
  designation: string;
  student: {
    name: string;
    profileImageUrl: string;
    linkedinUrl?: string | null;
  };
}

export default function VolunteerGrid({ volunteers }: { volunteers: VolunteerData[] }) {
  const [showAllVolunteers, setShowAllVolunteers] = useState(false);

  const displayedVolunteers = showAllVolunteers ? volunteers : volunteers.slice(0, 4);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-20 section-y">
      <div className="flex justify-between items-end mb-5 md:mb-7">
        <div>
          <h2 className="text-2xl md:text-4xl font-black tracking-tight mb-1 md:mb-2">The Placement Team</h2>
          <p className="text-muted-foreground text-sm md:text-lg">The dedicated minds behind our student success.</p>
        </div>
      </div>
      
      {volunteers.length > 4 && (
        <div className="flex w-full items-center justify-end mb-5">
          <button
            onClick={() => setShowAllVolunteers((prev) => !prev)}
            className="text-brand font-bold flex items-center gap-1 hover:gap-2 transition-all text-sm cursor-pointer"
          >
            {showAllVolunteers ? "View Less" : "View All"} <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {volunteers.length === 0 ? (
          <>
            {/* <!-- Card 1 --> */}
            <div className="bg-card rounded-lg hover:shadow-[var(--shadow-lg)] border overflow-hidden border-border shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-300">
              <div className="aspect-2.5/3 relative">
                <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwfoJsfJpSlw13cw9oHHcBFpUmlThTV4dahXFh0Qj0CAh37D3VkPF5Vy1WZ84fBrK27NKLkXJe9RdG7AK2_YVd56NxRE4WEisDxlGzpaHsjKPTDR4U181mIlvvE1U5v6IWNlaG_DgTioYwka5jHwh_pve2IGBpiChT2QMrlz4k151kkJSQh6DP0UchBMNC4_S69_b1AMPjNTlMUv9w1e1pD9_ibxhXkKedP9XEQnEHpH6UEZbIhd1RaiUAIFn7iUNBNm1Piuq4rA" alt="Female staff member profile" className="object-cover object-top transition-transform" fill sizes="(max-width: 768px) 50vw, 25vw" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-base md:text-lg">Dr. Anjali Sharma</h3>
                <p className="text-brand text-xs md:text-sm font-medium">Corporate Relations</p>
              </div>
            </div>
            {/* <!-- Card 2 --> */}
            <div className="bg-card rounded-lg overflow-hidden border hover:shadow-[var(--shadow-lg)] border-border shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-300">
              <div className="aspect-2.5/3 relative">
                <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlBGcrKwosCrkAFG1qE2hMewRAhTS-EYKa7SX5VzKmhlBmcIztS0GsQ0_Rgz9VISZXklQKDWvsxaR_LvJAkVsHULlHlXfyZ4nWerTDPLdIe3qjX8LxGmJ3zuGiOPazUvP0C2eJvz1M6jzY3GQqrki-7wjTCNTNln4d3_JSSh3Es0CreOhKnzrPJfaIyqQ8jMSk_X8uCLGzJoYfiYyXC4HpIGJ7IJ-ERWVMjRjgv78yuEYpx2COfNFV579HNLl8x406i5IuTeIzAA" alt="Male staff member profile" className="object-cover object-top transition-transform" fill sizes="(max-width: 768px) 50vw, 25vw" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-base md:text-lg">Vikram Malhotra</h3>
                <p className="text-brand text-xs md:text-sm font-medium">Technical Trainer</p>
              </div>
            </div>
            {/* <!-- Card 3 --> */}
            <div className="bg-card rounded-lg hover:shadow-[var(--shadow-lg)] overflow-hidden border border-border shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-300">
              <div className="aspect-2.5/3 relative">
                <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvMtr2p2ngRt9hK1Jn6FrV4XHZlxx9MzK655JpTskmWj_hS4QAP6MX1VA4MFE8Po0VpwOr8M6vd2CZaeq3Da1fYO-6cMzMVaSOKbqJaXyP-O3kiQo3iYP7wqUb7DB_j3HahZcUqeW8hCdtz_hdJPm_ocN6cwLxwCbPVw2mnl-cwSyCjX8jq6bXiu_yHsaYt6HTLHOztoOuHm-Lym8KraBLLFh8MDKLUuBBxjG9xv1dbyZvYdy2Mqj-_EohWc67WEV4fgoYMBFSSQ" alt="Female student volunteer" className="object-cover object-top transition-transform" fill sizes="(max-width: 768px) 50vw, 25vw" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-base md:text-lg">Neha Singh</h3>
                <p className="text-brand text-xs md:text-sm font-medium">Student Lead</p>
              </div>
            </div>
            {/* <!-- Card 4 --> */}
            <div className="bg-card rounded-lg hover:shadow-[var(--shadow-lg)] overflow-hidden border border-border shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-300">
              <div className="aspect-2.5/3 relative">
                <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcieaOwaB_8kavE_tydgpoKCMmW8zgXo46rbL1ABkBG2Xl4Ugae-0S9ZfXIhXGD86rFKMPXpNiw_XsXOlrp4KlaL87K1DgrihXRXIQqxow3qW_fXec3xCOiOGV8TeBp5dhzAlRguHWBBmJJj2xqUdmMvJ_VwzkhQoYKarT-AjNU_9KDusbNsiA6i9S1dt0RwqUepiImzSPwAq8IzU1sXLpDl88wppHQdcrIsM3jwFOxaA3PtZXtNmtclNuTgVmxZeNOH_yFkBJFA" alt="Male student volunteer" className="object-cover object-top transition-transform" fill sizes="(max-width: 768px) 50vw, 25vw" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-base md:text-lg">Rahul Verma</h3>
                <p className="text-brand text-xs md:text-sm font-medium">Event Coordinator</p>
              </div>
            </div>
          </>
        ) : (
          <>
            {displayedVolunteers.map((volunteer) => (
              <div
                key={volunteer.id}
                id={volunteer.id}
                className="bg-card relative rounded-lg hover:shadow-[var(--shadow-lg)] border overflow-hidden border-border shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-300 group">
                <div className="aspect-2.5/3 relative">
                  <Image src={volunteer.student.profileImageUrl} alt={volunteer.student.name} className="object-cover object-top transition-transform" fill sizes="(max-width: 768px) 50vw, 25vw" />
                </div>
                <div className="p-3">
                  {volunteer.student.linkedinUrl &&
                    <a
                      href={volunteer.student.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-2 right-2 p-1 md:p-2 bg-white/90 backdrop-blur-md rounded-lg shadow-lg text-[#0077b5] md:translate-x-12 md:-translate-y-12 md:group-hover:translate-x-0 md:group-hover:translate-y-0 transition-all duration-500 ease-out hover:bg-[#0077b5] hover:text-white z-10"
                      title="LinkedIn Profile"
                    >
                      <svg className="size-7 md:size-7 fill-current" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                  }
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-sm md:text-lg">{volunteer.student.name}</h3>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-brand text-xs md:text-sm font-medium">{volunteer.designation}</p>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </section>
  );
}
