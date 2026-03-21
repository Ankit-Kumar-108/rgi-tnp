"use client"
import { motion } from "motion/react"
import {
  Quote,
  Users,
  ChevronRight,
  ArrowRight,
  CheckCircle,
  BadgeCheck,
  MoveRight,
} from "lucide-react"
import Nav from "../components/layout/nav/nav"
import Footer from "../components/layout/footer/footer"
export default function Home() {

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
                  Connecting top-tier talent with global industry leaders. Join our legacy of excellence and secure your future with world-className opportunities.
                </p>
                <div className="flex flex-wrap gap-2 md:gap-4">
                  <button className="bg-brand text-white px-6 py-2.5 rounded-xl text-base font-bold flex items-center gap-2 hover:scale-105 transition-transform">
                    Hire from Us <MoveRight />
                  </button>
                  <button className="bg-background border-2 border-brand/20 text-foreground px-6 py-2.5 rounded-xl text-base font-bold hover:bg-surface transition-colors">
                    Student Portal
                  </button>
                </div>
              </div>
              <div className="order-1 lg:order-2 flex flex-col gap-5">
                <div className="md:hidden inline-flex items-center gap-2 bg-brand/10 text-brand px-4 py-1.5 rounded-full w-fit">
                  <BadgeCheck className="text-lg" />
                  <span className="text-xs font-bold uppercase tracking-wider">Top Rated Placement Cell</span>
                </div>
                <div className="relative group">
                  <div className="absolute -inset-4 bg-brand/20 rounded-3xl blur-2xl group-hover:bg-brand/30 transition-all"></div>
                  <div className="relative h-112.5 w-full rounded-2xl bg-cover bg-center shadow-2xl overflow-hidden border-4 border-background" data-alt="Modern college campus students collaborating outdoors" style={{ backgroundImage: "url(https://lh3.googleusercontent.com/aida-public/AB6AXuBIVPJ6bv7Dr7lCEYqnwXx2t5FSUvVVJgGETqGWiAnivZer2aB87kt_HLiLPDt21HDlVDz8VsoaU6Ndo3QrsOqWBkHLzvp_lqpnUppw5BcFfjcLKCRAkiFxoux2y4go15GQUt0lPo3SukxGG7brmhc5VyesFUCdQe2SK_GCCXnRFTml0yTzr9G94J-eKXgGRDHi0GAUnNj4V9R1QWLhShBOwsV-arIw46WqYP6Paax2cpoZvE5npGQZscSCV3LVb_M9c0SN0zA4DA)" }}>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Director's Section */}
        <section className="py-24 px-6 lg:px-20 max-w-7xl mx-auto" id="about">
          <div
            className="bg-card/80 backdrop-blur-[3px] rounded-2xl shadow-md hover:shadow-xl overflow-hidden border border-brand/5 hover:scale-105 transition-all duration-300"
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
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">Director&apos;s Message</h2>
                  <p className="text-brand font-semibold text-lg">James Kuttappan, Director (T&P)</p>
                </div>
                  <Quote className="text-brand text-5xl mb-4" />
                <p className="text-muted-foreground text-[13px] md:text-lg leading-relaxed mb-8 italic">
                  &quot;Welcome to the gateway of professional excellence. At Radharaman Group, our commitment is to bridge the gap between academic brilliance and global corporate requirements. We don&apost just place students we architect careers by fostering an environment of continuous learning and industry exposure.&quot;
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Deputy Director's Section */}
        <section className="pb-24 px-6 lg:px-20 max-w-7xl mx-auto">
          <div
          className="bg-white dark:bg-card/80 rounded-2xl shadow-md hover:shadow-xl overflow-hidden border border-brand/5 hover:scale-105 transition-all duration-300">
            <div className="flex flex-col lg:flex-row-reverse">
              <div className="lg:w-1/3 aspect-square lg:aspect-auto">
                <img 
                alt="Deputy Director T&amp;P" 
                className="w-full h-full object-cover" 
                data-alt="Professional portrait of Deputy Director in business attire" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIBYviOOWoEn1D6xTyYMluquzqttL4SCoQ8YTdPoSTTNYQLCqya8DiCAs66JmTJiHyRmHxUpVjA4GCYy4fhForyUeFzidpP8yNMIkHu_oaQRp9Krmp-Gz1K9nwFA-4vEgEubQQch8uCbxjl-ImtNgvWcFKvMoDY-gPzvpkp5HvSUSDe_vCwfaHUk_I7xlMHmS6Z4yoMHaYo8erwwh2Y4C_p5eHMCF4UEtWfpnKSjQrYRwDmJRAQhUxaICeli4FyMR5td48o8_nWg"
                referrerPolicy="no-referrer" 
                />
              </div>
              <div className="lg:w-2/3 p-8 lg:p-16 flex flex-col justify-center">
                <div className="mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">Dy Director's Message</h2>
                  <p className="text-brand font-semibold text-lg">Robin P. Samuel, Dy Director (T&amp;P)</p>
                </div>
                <Quote className="text-brand text-5xl mb-4"/>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-2" >The Placement Team</h2>
              <p className="text-slate-500 text-xs md:text-lg" >The dedicated minds behind our student success.</p>
            </div>
          </div>
          <div className="flex items-end justify-end mb-5">
            <button className="text-brand font-bold flex items-center gap-1 " >View All <ChevronRight className="text-brand" /></button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 md:gap-5 gap-3">
            {/* <!-- Card 1 --> */}
            <div className="bg-white dark:bg-slate-900 rounded-xl hover:scale-105 border overflow-hidden border-brand/5 shadow-md hover:shadow-xl transition-all duration-300">
              <div className="aspect-2.5/3 bg-cover bg-top mb-4 transition-transform" data-alt="Female staff member profile" style={{ backgroundImage: "url(https://lh3.googleusercontent.com/aida-public/AB6AXuCwfoJsfJpSlw13cw9oHHcBFpUmlThTV4dahXFh0Qj0CAh37D3VkPF5Vy1WZ84fBrK27NKLkXJe9RdG7AK2_YVd56NxRE4WEisDxlGzpaHsjKPTDR4U181mIlvvE1U5v6IWNlaG_DgTioYwka5jHwh_pve2IGBpiChT2QMrlz4k151kkJSQh6DP0UchBMNC4_S69_b1AMPjNTlMUv9w1e1pD9_ibxhXkKedP9XEQnEHpH6UEZbIhd1RaiUAIFn7iUNBNm1Piuq4rA)" }}></div>
              <div className="ml-2">
                <h3 className="font-bold text-sm md:text-lg" >Dr. Anjali Sharma</h3>
                <p className="text-brand text-xs md:text-sm font-medium mb-4" >Corporate Relations</p>
              </div>
            </div>
            {/* <!-- Card 2 --> */}
            <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border hover:scale-105 border-brand/5 shadow-md hover:shadow-xl transition-all duration-300">
              <div className="aspect-2.5/3 bg-cover bg-top mb-4 transition-transform" data-alt="Male staff member profile" style={{ backgroundImage: "url(https://lh3.googleusercontent.com/aida-public/AB6AXuAlBGcrKwosCrkAFG1qE2hMewRAhTS-EYKa7SX5VzKmhlBmcIztS0GsQ0_Rgz9VISZXklQKDWvsxaR_LvJAkVsHULlHlXfyZ4nWerTDPLdIe3qjX8LxGmJ3zuGiOPazUvP0C2eJvz1M6jzY3GQqrki-7wjTCNTNln4d3_JSSh3Es0CreOhKnzrPJfaIyqQ8jMSk_X8uCLGzJoYfiYyXC4HpIGJ7IJ-ERWVMjRjgv78yuEYpx2COfNFV579HNLl8x406i5IuTeIzAA)" }}></div>
              <div className="ml-2">
                <h3 className="font-bold text-sm md:text-lg" >Vikram Malhotra</h3>
                <p className="text-brand text-xs md:text-sm font-medium mb-4" >Technical Trainer</p>
              </div>
            </div>
            {/* <!-- Card 3 --> */}
            <div className="bg-white dark:bg-slate-900 rounded-xl hover:scale-105 overflow-hidden border border-brand/5 shadow-md hover:shadow-xl transition-all duration-300">
              <div className="aspect-2.5/3 bg-cover bg-top mb-4" data-alt="Female student volunteer" style={{ backgroundImage: "url(https://lh3.googleusercontent.com/aida-public/AB6AXuBvMtr2p2ngRt9hK1Jn6FrV4XHZlxx9MzK655JpTskmWj_hS4QAP6MX1VA4MFE8Po0VpwOr8M6vd2CZaeq3Da1fYO-6cMzMVaSOKbqJaXyP-O3kiQo3iYP7wqUb7DB_j3HahZcUqeW8hCdtz_hdJPm_ocN6cwLxwCbPVw2mnl-cwSyCjX8jq6bXiu_yHsaYt6HTLHOztoOuHm-Lym8KraBLLFh8MDKLUuBBxjG9xv1dbyZvYdy2Mqj-_EohWc67WEV4fgoYMBFSSQ)" }}></div>
              <div className="ml-2">
                <h3 className="font-bold text-sm md:text-lg" >Neha Singh</h3>
                <p className="text-brand text-xs md:text-sm font-medium mb-4" >Student Lead</p>
              </div>
            </div>
            {/* <!-- Card 4 --> */}
            <div className="bg-white dark:bg-slate-900 rounded-xl hover:scale-105 overflow-hidden border border-brand/5 shadow-md hover:shadow-xl transition-all duration-300">
              <div className="aspect-2.5/3 bg-cover bg-top mb-4" data-alt="Male student volunteer" style={{ backgroundImage: "url(https://lh3.googleusercontent.com/aida-public/AB6AXuDcieaOwaB_8kavE_tydgpoKCMmW8zgXo46rbL1ABkBG2Xl4Ugae-0S9ZfXIhXGD86rFKMPXpNiw_XsXOlrp4KlaL87K1DgrihXRXIQqxow3qW_fXec3xCOiOGV8TeBp5dhzAlRguHWBBmJJj2xqUdmMvJ_VwzkhQoYKarT-AjNU_9KDusbNsiA6i9S1dt0RwqUepiImzSPwAq8IzU1sXLpDl88wppHQdcrIsM3jwFOxaA3PtZXtNmtclNuTgVmxZeNOH_yFkBJFA)" }}></div>
              <div className="ml-2">
                <h3 className="font-bold text-sm md:text-lg" >Rahul Verma</h3>
                <p className="text-brand text-xs md:text-sm font-medium mb-4" >Event Coordinator</p>
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
              <div
                key={i}
                className="relative group overflow-hidden rounded-2xl h-100"
              >
                <img
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  src={item.img}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 p-8">
                  <h3 className="text-white text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-slate-300 text-sm mb-4">{item.desc}</p>
                  <button className="text-brand font-bold flex items-center gap-2">
                    {item.btn} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recruiters Section */}
        <section className="bg-brand/5 py-24" id="alumni">
          <div className="max-w-7xl mx-auto px-3 lg:px-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4" >Voices of Success</h2>
              <p className="text-slate-500 max-w-2xl mx-auto" >Hear from our alumni who are now leading the tech world from top global corporations.</p>
            </div>
            {/* <!-- Redesigned Card 1 --> */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8">
              <div className="bg-white dark:bg-slate-900 p-4 md:p-10 rounded-3xl shadow-sm border border-brand/10 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center group">
                <div className="w-32 h-32 rounded-full bg-cover bg-center mb-6 ring-4 ring-brand/10 group-hover:ring-brand/30 transition-all" data-alt="Alumni testimonial female" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD-4qpQG9rSHLujKoHhrbgWRAg81sFBu41MDA54QQ14Y6yYxoww19N7Hs6lybLRgvZCg5yNw-06wJ8p2GwAuZrN9ytupLwK1aRZSm47WIYXx5ld9vONPYIsuhD5KGlStRJhFuJTFHl_Hc-t-2CxveYwpsep0lUKrYPz6ghsEv9_r2NE8H2tzkba6XLY91OoOHMGHGA4iF6n7TtSxX_Dr3zeJ206-8b6lxuPWVgO5R0mihIiXboKj1OEPXe_2qH9vxxFdK4gE9e5YQ')" }}></div>
                <div className="mb-6">
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">Sanjana Gupta</h3>
                  <p className="text-xs md:text-sm text-brand font-semibold uppercase tracking-wider">SDE at Amazon</p>
                </div>
                <div className="relative px-1 md:px-4">
                  <Quote className="text-brand/60  md:text-4xl absolute -top-5 -left-2" />
                  <p className="text-slate-600 text-xs md:text-md dark:text-slate-400 leading-relaxed italic">"The training programs at Radharaman were pivotal in helping me crack the Amazon interview. The technical mock drills and soft skills sessions were exactly what I needed."</p>
                </div>
              </div>
              {/* <!-- Redesigned Card 2 --> */}
              <div className="bg-white dark:bg-slate-900 p-4 md:p-10 rounded-3xl shadow-sm border border-brand/10 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center group">
                <div className="w-32 h-32 rounded-full bg-cover bg-center mb-6 ring-4 ring-brand/10 group-hover:ring-brand/30 transition-all" data-alt="Alumni testimonial male" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBrv34Kah0CGQEmqlZfoy65dpzIBk9AxbLDjz6yNdzXV7SPD2XQB2Vl6LLzSr3hWUzpyUnYkY9udiyz1RrCsMnK0FAWkPLW10rTDgTHD-jbPsLlY1ER_8hH0oBn-Vhtf9ZG9-1haNsor-0FPBSg92DGsUo2qhV81IDAt9ymVIHGE_UDzNtrKaKPz3AnzxDxptY3iSmBWWAmAnwg3IzYSLrPx9SKmB_EGkz6ZyzLdWxGEB2zzz8HdUZcx_6Cn5qZpfXhnWXTplGNvQ')" }}></div>
                <div className="mb-6">
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">Arjun Kapoor</h3>
                  <p className="md:text-sm text-xs text-brand font-semibold uppercase tracking-wider">Lead Engineer at Google</p>
                </div>
                <div className="relative px-1 md:px-4">
                  <Quote className="material-symbols-outlined text-brand/60 text-4xl absolute -top-5 -left-2" />
                  <p className="text-slate-600 md:text-md text-xs dark:text-slate-400 leading-relaxed italic">"From campus to corporate, the transition was seamless thanks to the T&ampP cell. They focus on holistic development, not just coding."</p>
                </div>
              </div>
              {/* <!-- Redesigned Card 3 --> */}
              <div className="bg-white dark:bg-slate-900 p-4 md:p-10 rounded-3xl shadow-sm border border-brand/10 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center group">
                <div className="w-32 h-32 rounded-full bg-cover bg-center mb-6 ring-4 ring-brand/10 group-hover:ring-brand/30 transition-all" data-alt="Alumni testimonial female 2" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAdNzMEkFXCh6aRMNjJQy86ehkYbxa40o8KnpPF7c9Vub7mdqmCc3oRnfIWG-ey6P7C54GbGvHh7QLDx81w7B7c-F5tid0JSio10kM9mtaJ3LAcH_8Q-kr6RtEVMFrfIcBSTQ14pWxzCXnCXtBIV0oQsZlv4Xh51Wejwz6ZQTIZ3MPbqwIPHCr1BZue1EAByYYgWeDxd5oeP6pBPlDamFhjlt8sw_oiuaIm2RaEESu87WSmdwOfrWq6ZpqJfRgvZyNTqJRJwH7eig')" }}></div>
                <div className="mb-6">
                  <h3 className="md:text-xl text-lg font-bold text-slate-900 dark:text-white">Meera Iyer</h3>
                  <p className="md:text-sm text-xs text-brand font-semibold uppercase tracking-wider">Analyst at Microsoft</p>
                </div>
                <div className="relative px-1 md:px-4">
                  <Quote className="material-symbols-outlined text-brand/60 text-4xl absolute -top-5 -left-2" />
                  <p className="text-slate-600 md:text-md text-xs dark:text-slate-400 leading-relaxed italic">"The constant support from mentors and the wide range of visiting companies give students an unparalleled edge in the job market."</p>
                </div>
              </div></div>
          </div>
        </section>

        {/* Memories Gallery */}
        <section className="max-w-7xl mx-auto px-3 lg:px-20 py-24">
          <h2 className="text-4xl font-bold mb-12 text-center" >Life at Radharaman <span className="text-brand" >Placements</span></h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
            <div className="col-span-2 row-span-2 rounded-2xl overflow-hidden relative group">
              <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" data-alt="Students celebrating job offers together" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC97PRhCgez5vt9saBg50a81NQl00I3X5oJekFcGncJ_rtn8lGAgg0R5rdfYKEJss12iI-MMSMIJO_5AAP8QVSVr4zN2sO4g-9DOSXkB3RmfbmhlPbFvFqLoOogUPSE6F3YveI_u4x8HKjtV1sfoBlbGstnVLEwiyLJLa2iTEAzgj0KRt5wgCCIJJNXoVXvwYpHWFpKlJf0wQX6LSTDrTEVnC8Aky63CuM1Q7s_mp2WIs1HYWn-q6LmaA5trwzhCtdW31OdBgx7zw" />
              <div className="absolute inset-0 bg-linear-to-t from-brand/70 via-brand/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <p className="text-white font-bold" >Success Celebration 2023</p>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden relative group">
              <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" data-alt="Professional workshop session" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDh6hS3y3An0YD7BtmPrJjDJy3QqxeWstYyROERKY0bxcMmfi3NtKSgBtciSNen085rHJLes5JrTcoA5T4Vf2WNw2IM8kRVvRLyoasWkdNmfAov8REckXa_OE0be3DmEtrTvkNzzfew3SjV3XPxzdopBINZ2o5vzBcqR7jYZez5IOP6LzmIYnvjp5gPQWTS5tYpBwlhyiNkgeN9P4YOck_f3zhTSgxGGAeIEWsTG4EcdZH06oT7Si25K0FozYFtqQkSJaOn-hOc8g" />
              <div className="absolute inset-0 bg-linear-to-t from-brand/70 via-brand/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <p className="text-white text-xs font-bold" >Industry Workshop</p>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden relative group">
              <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" data-alt="Group of students at career fair" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfVL3bulkTn6s12N7oW80mh_GCLiSw_N7D4kSqzKOmW9UHhtz4eYA_dhYsnps6YBYyPDyK0b-VMfNHvHKsuz-q-4Wk3Oc1PfptLnBo8ms3ccnPWg14Cr7W6TOLNLmFWLeOvI30Uq3He2J8U-RWMqUpyfHiREvsA6uZZbhREsPCNnQJdqXfkBPrrT1a4qAvXr223gUxvoPH1wBvSTbad54mHToce10X7mwyZxOZYFstCQ1mfxW6UAe08UBm07ZZmtcUgM4KOPtGiQ" />
              <div className="absolute inset-0 bg-linear-to-t from-brand/70 via-brand/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <p className="text-white text-xs font-bold" >Career Fair</p>
              </div>
            </div>
            <div className="col-span-2 rounded-2xl overflow-hidden relative group">
              <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" data-alt="Corporate training meeting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTeMzT5fUnQNwQOk4-MtK4UKshACdx6vF5j3zM4xwJfWNXxO2LO9g37Nht5WGURIQCVpgw01qsuzaTli-rQkFp6_jc6PldL-Hpf43BoLX0IzXAY40OB3SudgNuAraLAVrJZjEdqdoj79narEEugwtM0OeghOU_Mggn4GTVSRHnsRfrzmzTZHeSi-9ndWU0iJYDWdBTVUAJV9uzq6lGBKYeXnGQIq1ziSdTYOhys206aN2QueMgXLfOFykuUFLCXSLK6WND8phzXg" />
              <div className="absolute inset-0 bg-linear-to-t from-brand/70 via-brand/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <p className="text-white font-bold" >Corporate Mentorship</p>
              </div>
            </div>
          </div>
        </section>

        {/* Feedback Section — Now theme-aware */}
        <section className="bg-surface/30 py-24 px-5 lg:px-20 border-y border-border" id="feedback">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Feedback</h2>
              <p className="text-muted-foreground text-sm md:text-lg mb-10">We value your input. Whether you&aposre a student who recently got placed or a recruiter who visited our campus, let us know about your experience.</p>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-brand/20 rounded-lg flex items-center justify-center shrink-0">
                    <CheckCircle className="text-brand w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold">95% Success Rate</h4>
                    <p className="text-sm text-muted-foreground">Consistent placement records across all departments.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-brand/20 rounded-lg flex items-center justify-center shrink-0">
                    <Users className="text-brand w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold">Top Recruiters</h4>
                    <p className="text-sm text-muted-foreground">Partnerships with Fortune 500 companies.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-card p-8 rounded-2xl border border-border shadow-lg">
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-muted-foreground">Full Name</label>
                    <input className="w-full bg-surface border border-border rounded-lg focus:ring-2 focus:ring-brand p-3 text-foreground" type="text" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-muted-foreground">Category</label>
                    <select className="w-full bg-surface border border-border rounded-lg focus:ring-2 focus:ring-brand p-3 text-foreground">
                      <option disabled >Select</option>
                      <option>Student</option>
                      <option>Recruiter</option>
                      <option>Alumni</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-muted-foreground">Email Address</label>
                  <input className="w-full bg-surface border border-border rounded-lg focus:ring-2 focus:ring-brand p-3 text-foreground" type="email" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-muted-foreground">Message / Testimonial</label>
                  <textarea className="w-full bg-surface border border-border rounded-lg focus:ring-2 focus:ring-brand p-3 text-foreground" rows={4}></textarea>
                </div>
                <button className="w-full bg-brand text-white py-4 rounded-lg font-bold hover:bg-brand/90 transition-all" type="submit">
                  Submit Feedback
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer — Now theme-aware */}
      <Footer />
    </div>
  )
}
