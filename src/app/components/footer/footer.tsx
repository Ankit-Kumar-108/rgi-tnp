import Link from 'next/link'
import {Globe, Mail, Phone} from "lucide-react"
export default function Footer() {
  return (
    <footer className="bg-surface py-16 px-6 lg:px-20 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
          <div className="max-w-xs">
            <div className="flex items-center gap-3 mb-6">
              <img 
              className="w-8 h-8 text-brand"
              src={"/logo/logo.png"}
              alt='college logo'
               />
              <span className="font-bold text-xl">RGI T&P</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Radharaman Group of Institutes is dedicated to providing quality technical education and ensuring every student reaches their career potential.
            </p>
            <div className="flex gap-4">
              <Link className="text-muted-foreground hover:text-brand transition-colors" href="#"><Globe className="w-5 h-5" /></Link>
              <Link className="text-muted-foreground hover:text-brand transition-colors" href="#"><Mail className="w-5 h-5" /></Link>
              <Link className="text-muted-foreground hover:text-brand transition-colors" href="#"><Phone className="w-5 h-5" /></Link>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 md:gap-24">
            <div>
              <h4 className="font-bold mb-6">Quick Links</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><Link className="hover:text-brand transition-colors" href="#">Career Portal</Link></li>
                <li><Link className="hover:text-brand transition-colors" href="#">Skill Development</Link></li>
                <li><Link className="hover:text-brand transition-colors" href="#">MOU Details</Link></li>
                <li><Link className="hover:text-brand transition-colors" href="#">Contact Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Resources</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><Link className="hover:text-brand transition-colors" href="#">Interview Prep</Link></li>
                <li><Link className="hover:text-brand transition-colors" href="#">Aptitude Tests</Link></li>
                <li><Link className="hover:text-brand transition-colors" href="#">Resume Builder</Link></li>
                <li><Link className="hover:text-brand transition-colors" href="#">HR Policies</Link></li>
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h4 className="font-bold mb-6">Contact</h4>
              <address className="not-italic text-sm text-muted-foreground space-y-4">
                <p>Ratibad Road, Bhopal,</p>
                <p>Madhya Pradesh 462044</p>
                <p>+91 755 2477777</p>
                <p>tpo@radharaman.com</p>
              </address>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-16 mt-16 border-t border-border text-center text-xs text-muted-foreground">
          <p>&copy; 2026 Radharaman Group of Institutes. All rights reserved. Designed for Excellence.</p>
        </div>
      </footer>
  )
}
