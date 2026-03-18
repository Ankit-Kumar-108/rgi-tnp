"use client";
import { motion } from "motion/react";
import { 
  GraduationCap, 
  Quote, 
  Users, 
  Handshake, 
  Search, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle, 
  Globe, 
  Mail, 
  Phone 
} from "lucide-react";
import Link from "next/link";
import Nav from "./components/nav/nav";

export default function Home() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen">
      {/* Fixed Top Navigation */}
      <Nav/>
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative h-150 flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ 
              backgroundImage: `linear-gradient(rgba(26, 16, 34, 0.7), rgba(26, 16, 34, 0.5)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuAyrbN4nL1QOAtE2C8TdAa-cfFv5OVXEY1F4UGqy-29SEV3FnHY8IdpLdSEX39J_0VoQ7KL7kWYetb954DdDlhNNg-Bx7XiHnakUE0ZzL6o9ophTbDbLuLMsAORgdmOkC4SMoR5c6eTmrkKajKGs9wrVX5gQa1ocVaIQHDnqgpSfOZCs0ptainXpoJ0TyD2ZaJDW7jdiDuvm6wyE5O7N13nLttjvcdOVVKkRNAi3qw7GSSinBPjydPGTf6Vs73RZXnvfRBLEnYqxw')` 
            }}
          ></div>
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <motion.span 
              {...fadeIn}
              className="inline-block px-4 py-1.5 mb-6 rounded-full bg-[#9213ec]/20 border border-[#9213ec]/30 text-[#9213ec] text-xs font-bold uppercase tracking-widest"
            >
              Training & Placement Cell
            </motion.span>
            <motion.h1 
              {...fadeIn}
              transition={{ delay: 0.2 }}
              className="text-white text-5xl md:text-7xl font-black mb-6 leading-tight"
            >
              Elevating Careers at Radharaman Group
            </motion.h1>
            <motion.p 
              {...fadeIn}
              transition={{ delay: 0.4 }}
              className="text-slate-200 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Empowering the next generation of professional leaders through industry-aligned training and strategic excellence.
            </motion.p>
            <motion.div 
              {...fadeIn}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button className="bg-[#9213ec] text-white px-8 py-4 rounded-lg font-bold text-lg hover:-translate-y-1 transition-all">View Placement Records</button>
              <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/20 transition-all">Corporate Brochure</button>
            </motion.div>
          </div>
        </section>

        {/* Leadership Section */}
        <section className="py-24 px-6 lg:px-20 max-w-7xl mx-auto" id="about">
          <motion.div 
            {...fadeIn}
            className="bg-white/10 backdrop-blur-[3px] rounded-2xl shadow-xl overflow-hidden border border-[#9213ec]/5"
          >
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-1/3 aspect-square lg:aspect-auto">
                <img 
                  alt="Robin Samuel, Director T&P" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIBYviOOWoEn1D6xTyYMluquzqttL4SCoQ8YTdPoSTTNYQLCqya8DiCAs66JmTJiHyRmHxUpVjA4GCYy4fhForyUeFzidpP8yNMIkHu_oaQRp9Krmp-Gz1K9nwFA-4vEgEubQQch8uCbxjl-ImtNgvWcFKvMoDY-gPzvpkp5HvSUSDe_vCwfaHUk_I7xlMHmS6Z4yoMHaYo8erwwh2Y4C_p5eHMCF4UEtWfpnKSjQrYRwDmJRAQhUxaICeli4FyMR5td48o8_nWg"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="lg:w-2/3 p-8 lg:p-16 flex flex-col justify-center">
                <div className="mb-8">
                  <Quote className="text-[#9213ec] w-12 h-12 mb-4" />
                  <h2 className="text-3xl font-bold mb-2">Director's Message</h2>
                  <p className="text-[#9213ec] font-semibold text-lg">Robin Samuel, Director (T&P)</p>
                </div>
                <p className="text-slate-600 text-lg leading-relaxed mb-8 italic">
                  "Welcome to the gateway of professional excellence. At Radharaman Group, our commitment is to bridge the gap between academic brilliance and global corporate requirements. We don't just place students; we architect careers by fostering an environment of continuous learning and industry exposure."
                </p>
                <div className="flex gap-4">
                  <div className="h-px bg-[#9213ec]/20 flex-1 self-center"></div>
                  <button className="text-[#9213ec] font-bold hover:underline">Read Full Message</button>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Placement Team Grid */}
        <section className="bg-[#9213ec]/5 py-24 px-6 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Our Placement Team</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">The dedicated experts behind our students' success stories.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Placement Officer", desc: "Expert Career Guidance", icon: Users },
                { title: "Corporate Relations", desc: "Strategic Alliances", icon: Handshake },
                { title: "Lead Volunteer", desc: "Student Coordination", icon: Search },
                { title: "Staff Coordinator", desc: "Administrative Support", icon: ShieldCheck },
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  {...fadeIn}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-8 rounded-xl border border-[#9213ec]/10 text-center hover:shadow-lg transition-shadow"
                >
                  <div className="w-20 h-20 bg-[#9213ec]/10 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <item.icon className="text-[#9213ec] w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                  <p className="text-slate-500 text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stakeholder Sections */}
        <section className="py-24 px-6 lg:px-20 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              { 
                title: "For Students", 
                desc: "Access placement portals, training resources, and mock interviews.", 
                btn: "Student Login", 
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHKr33DbqDXOMcpZm0eMAJC5hjINXKljRdpGE23wNRXATHdX_uVdvJaILEzettWwTjc9BWymhXDOYI_650EsS_i0zchK4OoTbpD3ndPFnNxLxdCF63EBJoNiCCVSrNQv6Jy1B9anPQOjf661YqpcO_Vv3jiDM3lerHVtgOkzlrDxdvfD6BCKyMcsbXKB6bSe2Nr8DpKx4WhmMlfra-ARFgb-dwelBAbgMMBlvGFb2H_KWrVuCFc2LPDyUp5jEnsr4vjuUk0Ugunw" 
              },
              { 
                title: "For Recruiters", 
                desc: "Hire top-tier talent and schedule campus recruitment drives.", 
                btn: "Recruitment Portal", 
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDI3AGXNcBdGYNnQC6rTAaVBW9jOcMUXZsclcq6racWYLm5CE51KLDmOpDGPCxuImcM64dL2yzo6NbPLi48ZGWDbKHoFsShQDhbrE5a7AB3Zd8-pI96vVUd3FZTMPRviTnSNrE15dg2CaGTu0tUKxb1hlgBFuIC6cJtb84L7Ow3753HPwNwP6bA_O2xDRTynWdRvy2_Sg5QaKwnaMJ2Px55UQMeQgWIUjAwYZp1wYe3HE1klyE8JAZxIZgDs4FtUY1BduXqQblkAQ" 
              },
              { 
                title: "For Alumni", 
                desc: "Mentor the next batch and stay connected with your alma mater.", 
                btn: "Connect Now", 
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCXVPK8Cn5Ib2YCbG42UxeqSLconAJ1rUOAaN1WgNq91TRkd4dstErCv2ZC5I9Vw4txaPccPIgSBN4hNDoC2R2hNg84z0AuQeP_UA_j_SFjElRn4PpWfV5Vxug1jHaM5Qni6oo1BTjzSYDMIw2fHZxsckI-itXPhltlu1I666w7uWZEAp9BKR9wp-mDSLcoYJgRsjVatn0Jh1nQoSFLs0KGz6QhqxG-7VKmb8wuFaYSqMadSDDa3RPNd5_tqe-4y2BvBsIqMYa8UA" 
              },
            ].map((item, i) => (
              <motion.div 
                key={i}
                {...fadeIn}
                transition={{ delay: i * 0.1 }}
                className="relative group overflow-hidden rounded-2xl h-100"
              >
                <img 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  src={item.img}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#1a1022] via-[#1a1022]/20 to-transparent"></div>
                <div className="absolute bottom-0 p-8">
                  <h3 className="text-white text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-slate-300 text-sm mb-4">{item.desc}</p>
                  <button className="text-[#9213ec] font-bold flex items-center gap-2">
                    {item.btn} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Recruiters Section */}
        <section className="bg-white py-24 px-6 lg:px-20 border-y border-[#9213ec]/5" id="recruiters">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <h2 className="text-3xl font-bold mb-4">Our Elite Recruiters</h2>
                <p className="text-slate-600">Join the league of global giants who trust RGI for their talent needs.</p>
              </div>
              <button className="border-2 border-[#9213ec] text-[#9213ec] px-6 py-2 rounded-lg font-bold hover:bg-[#9213ec] hover:text-white transition-all">
                View All 500+ Recruiters
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-60">
              {[
                "https://lh3.googleusercontent.com/aida-public/AB6AXuCsNZYI8wU_SkuK8RMAzajDAfAHRxmql5tocS0JTTA6poEjHT5NYvWCTfAchJL9PdAIuLlEMTa-mBAUSpxw-auIvTRg68iZeEpzdH1yzdIgY0TM78v8eNoP1Az6dY7Oz3zQbDkxj1Frhv69IvMsZpLYSUt0OT8zHl1oZuiTGkfPtErl6rJwLkTRytXCvrM2LRp2BjetBncZwJrYbRrA3hfQpR3v5bxRNAxE9GzWPKaQTZBREQIP_-jyTX9DuQkL2sDKQY9JCh5nLg",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuAS-jOJ3wcjk9yHqdlr6s1kl-OchdhA9AnKUqgUellyRJc-KmEM8lLst-XplJT4lrUP7WxlOxQUy6Crcdic-c_PA5r9A64TB932hzpYB7AlbKD9T7O_mHZNm-PPI4Zex7JnJG-UpemWPxqUhTKAVPDHsgCHASbDhHmSeEuxgyHU3QF4RF9ICzJSEpSI9oVHIfyrTtlwpQn8tVQi35yKj18OKEzlMdZSY6XUtI_OfOgMh_1WW4jDf9U8CfWmbywRKkO7P08GslQg3g",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuAr5_mR8PfWSGBAL1goad-cJ8BZRkQoPI1n4jS8DBNK1THKkcf51wBG2N6fAlTR1M2T2ciDqmJqAAEpZJv_dtJpkcwzHH-5EFLKYBLwi6IIQLHx2iY0GcxFh4T4BkVfrk_qKsOzDTSJC6J4WPM5c5BbxLqq8hVknubglU1yIY5exvbqCz2Q4m0k2ykjKomAyzPfgkcHDNRHtoM_tyknK1kOuq-8emzMcAlzvvB2pH0JatbcPzDzBt8GZMB1ultdlpBjrpoaNt_uYw",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuA3JBWymJ-p1jJP5f6IR8ZEx555yhZHS62aQ7xs7P7z3lGn1DeCn7L5dF-Pjo_REvAnCz4raCwVnqu5hroJSIwb8zed8lJr6qM6pv2KlWQOwD_fwhjmMyZdPvojyTh23kvlsoqnOb2RzMNRKW5I2hafgZQsG1npM0ZM-uGwsCt0x_6dBzhAt3pzpr8m7RSj-cl_Q0V8UlGuQHM4b-rhGf5cmCSalcplcufgHGMB-UzWl7SR-FbzX6EfthdQzxK1b3eiGbWPVzvgVQ",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuD651mzJv-uoxrAWZTKmPqjWF1CYGu68kN4HjhCVJeXCwLzrL1yh1KOZBTL_lPoVfgW_iErGhAnZb_onBbMJ0eVnJtRzPve8306SJmygtUNFV5WOA_4cWiDCcwELXi_Yr2RtnKsQjp8wd4KDyHExBFDCkjaJLiAUYmfuP4kDcA5VIZM0g0deBoafZHW8XJZOlPcvooMbd1Vg18zpk-aAL6ixqM-3wgLLyrA8_brz1zvJnNzC_fAYFqY8MvbpDzVqdF9KEAZ22YTDg",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuBSb2D2L0ZcWyJek5XemWtTvXdIdj2ymz15Kn0Ds213V7wSAx_c-lBtX00HJhkVj0nIETAKdnSi8q6DnyUtTdHgcnDGcjkPP61aM-JNhXMaMueon4iBB-fv6eGHLVCE9bjWukz6sNiDFUoJNFQ5YpeeZctIfYSt6jiXs_IaJPgb0HDfJAiYssROaKvssIefAulD4THT1T9HMpIphrp2ODb-t6qGlqUBTeVA10jPRwuFA30VvxrZhEwxPvqSeaY-48i_qPlNngsltw"
              ].map((logo, i) => (
                <div key={i} className="p-4 grayscale hover:grayscale-0 transition-all cursor-pointer">
                  <img src={logo} className="max-h-10 mx-auto" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "Amit Sharma", company: "Amazon", package: "24 LPA", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBsC4hyTVdHtQfzyVCTK3q_kIsNH18ZW4hU5RkWuvL7cOaGRccwb4H_yXmbNAaSOeIEVRvLrDko-UefFsuXomiMQHBuFDAu5xY448feTDowbwKxoUdkKRXJ3crHkCUJLsLkeqUdef4nTl2K5Hi0x9erHHZiXGXabwRNVzzLD7lAFgBCxTbWQRXrwYTfMdY0QrsfsJMBrV0ND4cCXoUlYIXfvHxv01KivFY_Y0LQQZiBpxX4yGj4Spgrg4jM2CgqkYPKMSAFv2PvYw" },
                { name: "Priya Patel", company: "Microsoft", package: "21 LPA", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDgj0N0EDxZUO2li1OPMqm8alzNDAx6aFWdhSiKwl8q5DDqylDbrFSlLH94MkfSHesJepmgfS6zJNRS3qxQqEcteVBwsgqEaMREmBhWC8q6D7shmm4hI8JIDXRliI3R2VhOOc7RwfOq3tIRHKpn4DzzPNBWl9qlwERMXRznzCHPmOx40gr4fJ-mGgHTylffoW84uyy32Q4314r2u6vRa-EJWnoYys6hWWAqCjaS515Atn3qWMyFyR1fpqXkBSKIicrtKnwafL2Yqg" },
                { name: "Rahul Verma", company: "Google", package: "18.5 LPA", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB7gcAHI3LB6uKD12nSBcNNVJzdDOxUuHjDC2A1EypikKLexix7qmtTo9Z6MIXQK5bl5rLinVExEFjZsm3oXT_EgAVNI-4A6B47jP-1erMd_vAPqvJY_JsoPML7fH2ncZEf0zu6ZmVeUU5F3flSG7A-pX5ev65dEnJDq7qyAeYCEuzVUnLpa1Eetr1fj9FGqh0Cb7a0VWoZG8RxNPzILgRMgQX1qJ2sPIKwl2ugqWDEyYYE5shegXA2a_kjzEzLBlrufXApXsbyHg" },
              ].map((student, i) => (
                <motion.div 
                  key={i}
                  {...fadeIn}
                  transition={{ delay: i * 0.1 }}
                  className="bg-[#f7f6f8] p-6 rounded-2xl flex items-center gap-6 border border-[#9213ec]/5"
                >
                  <img 
                    className="w-20 h-20 rounded-full object-cover ring-4 ring-[#9213ec]/20" 
                    src={student.img}
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="font-bold">{student.name}</h4>
                    <p className="text-sm text-slate-500 mb-1">Placed at {student.company}</p>
                    <span className="text-[#9213ec] font-bold text-sm">Package: {student.package}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Memories Gallery */}
        <section className="py-24 px-6 lg:px-20 max-w-7xl mx-auto" id="memories">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Capturing Success: Placement Journey</h2>
            <p className="text-slate-600">Life at RGI - From orientation to the final handshake.</p>
          </div>
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {[
              "https://lh3.googleusercontent.com/aida-public/AB6AXuDPQgsYPOo5DdOsWzJXFo-mUBfpuckWqboRpVT6KF_g1iwpXL5yFCgXAXuxRHiq1qrEqdqG6xvwzMXF38UEaNEGAzNnngoijgFuRDUNvRzFkPmvJZl3ByVj7f15LPzoGi6QQ5jmlYkZ1vi49HQZXCCAYCpVzmlst-Lw8IZjmFee_lVVNt1RvcAdseubLdXeqpGcCiTwMhhJ0jEeKFpyDradpO82gKl_Lq_uVXBmzzOFFbAq76byWSAfRj8A_tSWyJq0HOprsq_vWg",
              "https://lh3.googleusercontent.com/aida-public/AB6AXuD3M7vR9qL02iaDFm1ZyqXozHwK0di4Mu9giyXOe_ZOutca8gjmmFTn11E7Y-i5CpBw9MFXxcM8B7wQCK9X_OwaVLx45tAo6lxjGLUYyb0tlVy_HU2Dz4OTmG4RNGM9dlMJt7-wXQQ9Ol_5SB6PZK4aJlKr9zHlV1Y2Ha1Y4g41NhkV7kuYoZguqPr8-sRGl15OWiCxze7hJMjBNToZLyKvm2TfJeEd0QXBnlNe9ie2Fp2fgLcmFy7aswDu903R-GnFHqpyCctoRA",
              "https://lh3.googleusercontent.com/aida-public/AB6AXuCAmJ8Hu-mqdM9hMpyIAUgv1AHlZbV8usHG3-SbUEqgRzvjrn7SEJxAL8b9SLhn2bzL2-rROGYwJntc9AlJePQ2SyUtz26EPU4aYe2MtxbkT5ed9eVEQTSlidcrtiYW5qpPzUFTwWTvPpqCbY2h8_KElOXQwUGnomi3PViXbuP6sZKXcvAXg1WnLqM5begplN9SvlXwg48opRrscYXtowYgNIctkAHe0xmqvk8LrUSHc3w4p8bTNEBwXIRosvE6xCtDGxidjzm0wA",
              "https://lh3.googleusercontent.com/aida-public/AB6AXuByc8la3zx98_08OcwColsy28f-H7Rm_WoVhg42rEtLAhEJPSKiZUIv6SSVouPB2CyJn5D_5rt2ySyBnt313-PG8U48LgxFGdi4ybG5Hj6nj--BTN6eB2EKSVdwzL5WrKYZEvRX1k60K4x2hk0HH9dgVhWckmkDL0M4TOodM8-RvuLNTI103S2SMYtefSWw-f7CkAeKyY8uQ-59IPtFI0CWn8qp3fmJf50vQXPO5qmQUmWaeQ3dF4j6e_5vEf-V-PZOvALfIIhg7Q",
              "https://lh3.googleusercontent.com/aida-public/AB6AXuB0rCsqWhzyApkPObaSEsLCjD8nUoFNHw5o-HACANOnuOORIZ7P9z1txTqBJYOsSEtnd8A6Xx_Mm6gEcAW3DCKT8FZuXYdS5aJF6k3OZ5D9cF2MRV0jJhYEc4NFLjMgE8ZU5qOUYLmqhmgnCWI-2T5IAMndW-bxe3HIJHRnyOKixzYtgUHZZJzrZyfA2hm-62gClGmtoWkKWNucZtUXxGRIAM5DPehqvFQQcDUNXxUsCdh5Y51tVEQuS6sH99fF9cq41ixa-ZG-xg",
              "https://lh3.googleusercontent.com/aida-public/AB6AXuCj4OZmyGy7feJQIH32daM6l6DD4Afd3UDIWHsztqIIhiu4gErn85Y1fH5tRw7XzCGllBgzYht-a_g3V5pyj0Alb_a6Yhb6jK9aFwipNYu3-smdA1pk6jjS7Sjw02N0btuYMI6kEFJud8TXCUqJ9RPbElE38pU0HesY1l0OJtOh_4SBgtPtxLcLlnk2qBmGJRAXmYI4bVUO7WhNCeZ0wPXr5F3fppgHzOKeT9yfAQhmuyyIKAo--Xh7YV8G5GTATCgCYW1cx9aX6A"
            ].map((img, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="break-inside-avoid rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow"
              >
                <img className="w-full" src={img} referrerPolicy="no-referrer" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Feedback Section */}
        <section className="bg-[#1a1022] py-24 px-6 lg:px-20 text-white" id="feedback">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Student & Recruiter Feedback</h2>
              <p className="text-slate-400 text-lg mb-10">We value your input. Whether you're a student who recently got placed or a recruiter who visited our campus, let us know about your experience.</p>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#9213ec]/20 rounded-lg flex items-center justify-center shrink-0">
                    <CheckCircle className="text-[#9213ec] w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold">95% Success Rate</h4>
                    <p className="text-sm text-slate-400">Consistent placement records across all departments.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#9213ec]/20 rounded-lg flex items-center justify-center shrink-0">
                    <Users className="text-[#9213ec] w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold">Top Recruiters</h4>
                    <p className="text-sm text-slate-400">Partnerships with Fortune 500 companies.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl text-slate-900">
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-500">Full Name</label>
                    <input className="w-full bg-[#f7f6f8] border-none rounded-lg focus:ring-2 focus:ring-[#9213ec] p-3" type="text" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-500">Category</label>
                    <select className="w-full bg-[#f7f6f8] border-none rounded-lg focus:ring-2 focus:ring-[#9213ec] p-3">
                      <option>Student</option>
                      <option>Recruiter</option>
                      <option>Alumni</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-500">Email Address</label>
                  <input className="w-full bg-[#f7f6f8] border-none rounded-lg focus:ring-2 focus:ring-[#9213ec] p-3" type="email" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-500">Message / Testimonial</label>
                  <textarea className="w-full bg-[#f7f6f8] border-none rounded-lg focus:ring-2 focus:ring-[#9213ec] p-3" rows={4}></textarea>
                </div>
                <button className="w-full bg-[#9213ec] text-white py-4 rounded-lg font-bold hover:bg-[#9213ec]/90 transition-all" type="submit">
                  Submit Feedback
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-100 py-16 px-6 lg:px-20 border-t border-[#9213ec]/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
          <div className="max-w-xs">
            <div className="flex items-center gap-3 mb-6">
              <GraduationCap className="w-8 h-8 text-[#9213ec]" />
              <span className="font-bold text-xl">RGI T&P</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              Radharaman Group of Institutes is dedicated to providing quality technical education and ensuring every student reaches their career potential.
            </p>
            <div className="flex gap-4">
              <Link className="text-slate-400 hover:text-[#9213ec]" href="#"><Globe className="w-5 h-5" /></Link>
              <Link className="text-slate-400 hover:text-[#9213ec]" href="#"><Mail className="w-5 h-5" /></Link>
              <Link className="text-slate-400 hover:text-[#9213ec]" href="#"><Phone className="w-5 h-5" /></Link>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 md:gap-24">
            <div>
              <h4 className="font-bold mb-6">Quick Links</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><Link className="hover:text-[#9213ec] transition-colors" href="#">Career Portal</Link></li>
                <li><Link className="hover:text-[#9213ec] transition-colors" href="#">Skill Development</Link></li>
                <li><Link className="hover:text-[#9213ec] transition-colors" href="#">MOU Details</Link></li>
                <li><Link className="hover:text-[#9213ec] transition-colors" href="#">Contact Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Resources</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><Link className="hover:text-[#9213ec] transition-colors" href="#">Interview Prep</Link></li>
                <li><Link className="hover:text-[#9213ec] transition-colors" href="#">Aptitude Tests</Link></li>
                <li><Link className="hover:text-[#9213ec] transition-colors" href="#">Resume Builder</Link></li>
                <li><Link className="hover:text-[#9213ec] transition-colors" href="#">HR Policies</Link></li>
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h4 className="font-bold mb-6">Contact</h4>
              <address className="not-italic text-sm text-slate-500 space-y-4">
                <p>Ratibad Road, Bhopal,</p>
                <p>Madhya Pradesh 462044</p>
                <p>+91 755 2477777</p>
                <p>placements@radharamanbhopal.com</p>
              </address>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-16 mt-16 border-t border-slate-200 text-center text-xs text-slate-400">
          <p>© 2024 Radharaman Group of Institutes. All rights reserved. Designed for Excellence.</p>
        </div>
      </footer>
    </div>
  );
}
