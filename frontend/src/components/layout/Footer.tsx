'use client';

import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react';

const collectionsLinks = [
  { name: 'Bridal', href: '#' },
  { name: 'Heritage', href: '#' },
  { name: 'Everyday', href: '#' },
  { name: 'Statement', href: '#' },
  { name: 'Gemstone', href: '#' },
  { name: "Men's", href: '#' },
];

const servicesLinks = [
  { name: 'Bespoke Design', href: '#' },
  { name: 'Restoration', href: '#' },
  { name: 'Certification', href: '#' },
  { name: 'Personal Styling', href: '#' },
];

export default function Footer() {
  return (
    <footer className="bg-ink-950 border-t border-white/5 relative overflow-hidden">
      {/* Top Gold Gradient Divider */}
      <div className="w-full h-1 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent opacity-50" />

      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-5 flex flex-col">
            <h2 className="font-accent text-3xl text-gold-500 uppercase tracking-[0.25em] mb-4">
              AURUM
            </h2>
            <p className="font-display text-xl text-cream-50 italic mb-4">
              Timeless Elegance, Crafted in Gold
            </p>
            <p className="text-ink-400 font-body max-w-sm mb-8 leading-relaxed">
              Established in 1892, Aurum has been curating exceptional pieces of fine jewellery that transcend generations. Every piece tells a story of extraordinary craftsmanship.
            </p>
            
            <div className="flex gap-4 items-center">
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-ink-400 hover:text-gold-500 hover:border-gold-500/50 transition-all duration-300">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-ink-400 hover:text-gold-500 hover:border-gold-500/50 transition-all duration-300">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-ink-400 hover:text-gold-500 hover:border-gold-500/50 transition-all duration-300">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Collections */}
          <div className="lg:col-span-2 flex flex-col">
            <h3 className="text-cream-50 font-display tracking-widest uppercase mb-6 text-sm font-semibold">
              Collections
            </h3>
            <ul className="flex flex-col gap-3">
              {collectionsLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-ink-400 hover:text-gold-300 transition-colors duration-300 font-body text-sm">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="lg:col-span-2 flex flex-col">
            <h3 className="text-cream-50 font-display tracking-widest uppercase mb-6 text-sm font-semibold">
              Services
            </h3>
            <ul className="flex flex-col gap-3">
              {servicesLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-ink-400 hover:text-gold-300 transition-colors duration-300 font-body text-sm">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Visit Us */}
          <div className="lg:col-span-3 flex flex-col">
            <h3 className="text-cream-50 font-display tracking-widest uppercase mb-6 text-sm font-semibold">
              Visit Us
            </h3>
            <div className="flex flex-col gap-4 text-ink-400 font-body text-sm">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="mt-1 flex-shrink-0 text-gold-500/70" />
                <span>
                  152, Place Vendôme<br />
                  75001 Paris, France
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="flex-shrink-0 text-gold-500/70" />
                <span>+33 1 42 60 40 50</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="flex-shrink-0 text-gold-500/70" />
                <a href="mailto:boutique@aurum.com" className="hover:text-gold-300 transition-colors">
                  boutique@aurum.com
                </a>
              </div>
              <div className="mt-2 text-ink-500 italic">
                Mon - Sat: 10:00 - 19:00<br />
                Sun: By Appointment
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Bar */}
        <div className="mt-16 pt-12 border-t border-white/5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-md">
            <h3 className="text-cream-50 font-display text-xl mb-2">Stay in Touch</h3>
            <p className="text-ink-400 font-body text-sm">
              Subscribe to our newsletter for exclusive collections, private events, and the latest news from Aurum.
            </p>
          </div>
          <form className="w-full lg:w-auto flex flex-col sm:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Your email address" 
              className="bg-transparent border border-white/10 rounded-sm px-4 py-3 text-cream-50 font-body text-sm w-full sm:w-72 focus:outline-none focus:border-gold-500 transition-colors"
              required
            />
            <button 
              type="submit"
              className="bg-gold-500 text-ink-950 font-semibold px-8 py-3 rounded-sm uppercase tracking-widest text-sm hover:bg-gold-300 transition-colors duration-300"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-body text-ink-500">
          <p>© {new Date().getFullYear()} AURUM. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gold-500 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gold-500 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
