import Image from "next/image";
import { Quote } from "lucide-react";

interface TestimonialData {
  id: string;
  name?: string;
  jobTitle?: string;
  currentCompany?: string;
  content?: string;
  profileImageUrl?: string;
}

export default function TestimonialGrid({ testimonials }: { testimonials: TestimonialData[] }) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="bg-brand/5 section-y" id="alumni">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-20">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3 md:mb-4">Voices of Success</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            Hear from our alumni who are now leading the tech world from top global corporations.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-card p-6 md:p-10 rounded-2xl md:rounded-3xl shadow-[var(--shadow-sm)] border border-border hover:shadow-[var(--shadow-md)] transition-shadow duration-300 flex flex-col items-center text-center group">
              <div className="w-20 h-20 md:w-32 md:h-32 rounded-full mb-4 md:mb-6 ring-4 ring-brand/10 group-hover:ring-brand/20 transition-all relative overflow-hidden">
                <Image src={testimonial.profileImageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuD-4qpQG9rSHLujKoHhrbgWRAg81sFBu41MDA54QQ14Y6yYxoww19N7Hs6lybLRgvZCg5yNw-06wJ8p2GwAuZrN9ytupLwK1aRZSm47WIYXx5ld9vONPYIsuhD5KGlStRJhFuJTFHl_Hc-t-2CxveYwpsep0lUKrYPz6ghsEv9_r2NE8H2tzkba6XLY91OoOHMGHGA4iF6n7TtSxX_Dr3zeJ206-8b6lxuPWVgO5R0mihIiXboKj1OEPXe_2qH9vxxFdK4gE9e5YQ"} alt="Alumni testimonial" fill className="object-cover" sizes="128px" />
              </div>
              <div className="mb-4 md:mb-6">
                <h3 className="text-base md:text-xl font-bold text-foreground">{testimonial.name || "Anonymous"}</h3>
                <p className="text-xs md:text-sm text-brand font-semibold uppercase tracking-wider">{testimonial.jobTitle ? `${testimonial.jobTitle} at ${testimonial.currentCompany}` : "Alumni"}</p>
              </div>
              <div className="relative px-1 md:px-4">
                <Quote className="text-brand/40 text-2xl md:text-4xl absolute -top-4 -left-2" />
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed italic">
                  &ldquo;{testimonial.content || "No content available."}&rdquo;
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
