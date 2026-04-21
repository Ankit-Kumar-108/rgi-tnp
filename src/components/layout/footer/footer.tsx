import Link from 'next/link'
import { Globe, Mail, Phone, MapPin, Shield } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-surface pt-16 pb-8 px-6 lg:px-20 border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Column 1: Brand Info */}
          <div className="lg:pr-8">
            <div className="flex items-center gap-3 mb-6">
              <img
                className="size-12 text-brand"
                src={"/logo/logo.png"}
                alt='college logo'
              />
              <div className='flex flex-col'>
              <span className="font-bold text-xl text-foreground">RGI T&P</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Radharaman Group of Institutes is dedicated to providing quality technical education and ensuring every student reaches their career potential.
            </p>
            <div className="flex gap-4">
              <Link className="p-2 rounded-full bg-foreground/5 text-muted-foreground hover:bg-brand/10 hover:text-brand transition-colors" href="#">
                <Globe className="w-4 h-4" />
              </Link>
              <Link className="p-2 rounded-full bg-foreground/5 text-muted-foreground hover:bg-brand/10 hover:text-brand transition-colors" href="mailto:tpo@radharaman.com">
                <Mail className="w-4 h-4" />
              </Link>
              <Link className="p-2 rounded-full bg-foreground/5 text-muted-foreground hover:bg-brand/10 hover:text-brand transition-colors" href="tel:+917552477777">
                <Phone className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-bold text-foreground mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link className="hover:text-brand transition-colors" href="#">Career Portal</Link></li>
              <li><Link className="hover:text-brand transition-colors" href="#">Skill Development</Link></li>
              <li><Link className="hover:text-brand transition-colors" href="/activities/mou">MOU Details</Link></li>
              <li><Link className="hover:text-brand transition-colors" href="/feedbacks">Feedbacks</Link></li>
            </ul>
          </div>

          {/* Column 3: Portals & Resources */}
          <div>
            <h4 className="font-bold text-foreground mb-6">Portals & Resources</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link className="hover:text-brand transition-colors" href="#">Interview Prep</Link></li>
              <li><Link className="hover:text-brand transition-colors" href="#">Resume Builder</Link></li>
              <li><Link className="hover:text-brand transition-colors" href="#">HR Policies</Link></li>
              {/* ADMIN LINK ADDED HERE */}
              <li className="pt-2 mt-2 border-t border-border/50">
                <Link className="flex items-center gap-2 hover:text-brand transition-colors font-medium" href="/administration-panel">
                  <Shield className="w-4 h-4" />
                  Administration Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="font-bold text-foreground mb-6">Contact Us</h4>
            <address className="not-italic text-sm text-muted-foreground space-y-4">
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-brand shrink-0" />
                <p>Ratibad Road, Bhopal,<br />Madhya Pradesh 462044</p>
              </div>
              <div className="flex gap-3 items-center">
                <Phone className="w-5 h-5 text-brand shrink-0" />
                <p>+91 755 2477777</p>
              </div>
              <div className="flex gap-3 items-center">
                <Mail className="w-5 h-5 text-brand shrink-0" />
                <p>tpo@radharaman.com</p>
              </div>
            </address>
          </div>

        </div>

        {/* Bottom Section: Copyright & Developer Credit */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-border text-xs md:text-sm text-muted-foreground">
          <p className="text-center md:text-left">&copy; {new Date().getFullYear()} Radharaman Group of Institutes. All rights reserved.</p>
          
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <p className="text-muted-foreground">
              Developed by <span className="text-foreground font-bold tracking-wide">Ankit Kumar</span>
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/Ankit-Kumar-108"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                title="GitHub Profile"
              >
                <svg className="size-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/ankit-kumar-98102b24a/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                title="LinkedIn Profile"
              >
                <svg className="size-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>
          
        </div>
      </div>
    </footer>
  )
}