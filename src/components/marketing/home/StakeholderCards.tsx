import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function StakeholderCards() {
  return (
    <section className="section-y px-4 md:px-8 lg:px-20 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-8">
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
            btn: "Recruiter Login",
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
            className="relative group overflow-hidden rounded-lg md:rounded-xl lg:rounded-2xl h-60 lg:h-100"
          >
            <Image
              className="absolute inset-0 w-full object-cover transition-transform duration-500 group-hover:scale-110"
              src={item.img}
              alt={item.title}
              fill
              sizes="(max-width: 1024px) 100vw, 33vw"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 p-3 md:p-6 lg:p-8 w-full">
              <h3 className="text-white text-lg md:text-xl lg:text-2xl font-bold mb-2">{item.title}</h3>
              <p className="text-white/70 text-xs md:text-sm mb-4">{item.desc}</p>
              <Link href={item.link} className="text-brand text-sm font-bold flex items-center gap-2 hover:translate-x-2 transition-transform w-fit">
                {item.btn} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
