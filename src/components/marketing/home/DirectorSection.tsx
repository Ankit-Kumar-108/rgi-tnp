import Image from "next/image";
import { Quote } from "lucide-react";

export default function DirectorSection() {
  return (
    <>
      {/* Director's Section */}
      <section className="section-y px-4 md:px-8 lg:px-20 max-w-7xl mx-auto" id="about">
        <div className="bg-card rounded-2xl md:rounded-3xl shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] overflow-hidden border border-border transition-shadow duration-300">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-1/3 aspect-square lg:aspect-auto relative">
              <Image
                alt="Robin Samuel, Director T&P"
                className="object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIBYviOOWoEn1D6xTyYMluquzqttL4SCoQ8YTdPoSTTNYQLCqya8DiCAs66JmTJiHyRmHxUpVjA4GCYy4fhForyUeFzidpP8yNMIkHu_oaQRp9Krmp-Gz1K9nwFA-4vEgEubQQch8uCbxjl-ImtNgvWcFKvMoDY-gPzvpkp5HvSUSDe_vCwfaHUk_I7xlMHmS6Z4yoMHaYo8erwwh2Y4C_p5eHMCF4UEtWfpnKSjQrYRwDmJRAQhUxaICeli4FyMR5td48o8_nWg"
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="lg:w-2/3 p-8 lg:p-16 flex flex-col justify-center">
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Director&apos;s Message</h2>
                <p className="text-brand font-semibold text-lg">James Kuttappan, Director (Training and Placement)</p>
              </div>
              <Quote className="text-brand text-5xl mb-4" />
              <p className="text-muted-foreground text-sm md:text-lg leading-relaxed mb-8 italic">
                &quot;Welcome to the gateway of professional excellence. At Radharaman Group, our commitment is to bridge the gap between academic brilliance and global corporate requirements. We don&apos;t just place students we architect careers by fostering an environment of continuous learning and industry exposure.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Deputy Director's Section */}
      <section className="pb-16 md:pb-24 px-4 md:px-8 lg:px-20 max-w-7xl mx-auto">
        <div className="bg-card rounded-2xl md:rounded-3xl shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] overflow-hidden border border-border transition-shadow duration-300">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-1/3 aspect-square lg:aspect-auto relative">
              <Image
                alt="Deputy Director T&P"
                className="object-cover"
                src="/images/Robin.P.Samuel.png"
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="lg:w-2/3 p-8 lg:p-16 flex flex-col justify-center">
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Dy Director&apos;s Message</h2>
                <p className="text-brand font-semibold text-lg">Robin P. Samuel, Dy Director (Training and Placement)</p>
              </div>
              <Quote className="text-brand text-5xl mb-4" />
              <p className="text-muted-foreground text-sm md:text-lg leading-relaxed mb-8 italic">
                &quot;Our focus is on the holistic development of our students. Through rigorous aptitude training, soft skills workshops, and technical certifications, we ensure our graduates are not just job-ready, but industry-leading. We value our partnerships with recruiters and strive to provide a seamless hiring experience.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
