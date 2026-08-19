'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Mail, MapPin, Phone, Send, Twitter, Keyboard } from 'lucide-react';
import SparkleBurst from '@/components/motion/SparkleBurst';
import { useToast } from '@/components/providers/ToastProvider';
import { brandData } from '@/data/brand';
import CinemaToggle from '@/components/ui/CinemaToggle';
import { openShortcuts } from '@/components/providers/KeyboardLayer';
import { collections } from '@/data/collections';
import { services } from '@/data/services';

const SOCIALS = [
  { icon: Instagram, label: 'Instagram', href: brandData.socialLinks?.instagram ?? '#' },
  { icon: Facebook, label: 'Facebook', href: brandData.socialLinks?.facebook ?? '#' },
  { icon: Twitter, label: 'Twitter', href: '#' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [celebrating, setCelebrating] = useState(false);
  const { toast } = useToast();

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setCelebrating(true);
    toast({
      kind: 'luxe',
      title: 'Welcome to the list',
      message: `We will write to ${email} with private previews.`,
    });
    setEmail('');
    window.setTimeout(() => setCelebrating(false), 1400);
  };

  return (
    <footer className="relative overflow-hidden border-t border-hairline bg-surface">
      {/* Metallic top edge */}
      <div className="h-px w-full animate-shimmer bg-metal-bar bg-size-200 opacity-60" />

      {/* Oversized wordmark watermark */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 select-none font-accent text-[22vw] uppercase leading-none tracking-luxe text-accent/[0.035]"
      >
        Aurum
      </span>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 lg:py-24">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="flex flex-col lg:col-span-5">
            <Link href="/" className="mb-4 flex items-center gap-3">
              <motion.span
                whileHover={{ rotate: 135 }}
                transition={{ type: 'spring', stiffness: 250, damping: 15 }}
                aria-hidden="true"
                className="block h-3 w-3 rotate-45 bg-accent shadow-[0_0_12px_2px_rgb(var(--gold-500)/0.5)]"
              />
              <span className="font-accent text-3xl uppercase tracking-luxer text-gradient-static">
                Aurum
              </span>
            </Link>

            <p className="mb-4 font-display text-xl italic text-secondary">
              {brandData.tagline}
            </p>

            <p className="mb-8 max-w-sm font-sans text-sm font-light leading-relaxed text-muted">
              Established in {brandData.established}, AURUM has been curating exceptional pieces
              of fine jewellery that transcend generations. Every piece tells a story of
              extraordinary craftsmanship.
            </p>

            <div className="flex items-center gap-3">
              {SOCIALS.map(({ icon: Icon, label, href }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ y: -4, scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline text-muted transition-colors duration-300 hover:border-gold-500/50 hover:text-accent"
                >
                  <Icon size={17} strokeWidth={1.6} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Collections */}
          <nav className="flex flex-col lg:col-span-2" aria-label="Collections">
            <h3 className="mb-6 font-accent text-[11px] uppercase tracking-luxe text-primary">
              Collections
            </h3>
            <ul className="flex flex-col gap-3">
              {collections.slice(0, 6).map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/collections/${c.id}`}
                    className="link-underline font-sans text-sm font-light text-muted transition-colors duration-300 hover:text-accent"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <nav className="flex flex-col lg:col-span-2" aria-label="Services">
            <h3 className="mb-6 font-accent text-[11px] uppercase tracking-luxe text-primary">
              Services
            </h3>
            <ul className="flex flex-col gap-3">
              {services.map((s) => (
                <li key={s.id}>
                  <Link
                    href={s.link ?? '/services'}
                    className="link-underline font-sans text-sm font-light text-muted transition-colors duration-300 hover:text-accent"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Visit */}
          <div className="flex flex-col lg:col-span-3">
            <h3 className="mb-6 font-accent text-[11px] uppercase tracking-luxe text-primary">
              Visit Us
            </h3>
            <div className="flex flex-col gap-4 font-sans text-sm font-light text-muted">
              <div className="flex items-start gap-3">
                <MapPin size={15} className="mt-0.5 flex-shrink-0 text-accent/70" />
                <span>{brandData.contact.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={15} className="flex-shrink-0 text-accent/70" />
                <a
                  href={`tel:${brandData.contact.phone.replace(/\s/g, '')}`}
                  className="transition-colors hover:text-accent"
                >
                  {brandData.contact.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={15} className="flex-shrink-0 text-accent/70" />
                <a
                  href={`mailto:${brandData.contact.email}`}
                  className="transition-colors hover:text-accent"
                >
                  {brandData.contact.email}
                </a>
              </div>
              <p className="mt-1 italic text-faint">{brandData.contact.hours}</p>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="relative mt-16 flex flex-col items-start justify-between gap-8 border-t border-hairline pt-12 lg:flex-row lg:items-center">
          <SparkleBurst active={celebrating} className="left-auto right-0 w-1/2" />

          <div className="max-w-md">
            <h3 className="mb-2 font-display text-2xl text-primary">Stay in Touch</h3>
            <p className="font-sans text-sm font-light text-muted">
              Private previews, collection launches, and invitations to events at the boutique.
            </p>
          </div>

          <form
            onSubmit={subscribe}
            className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto"
          >
            <label htmlFor="footer-email" className="sr-only">
              Email address
            </label>
            <input
              id="footer-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="w-full rounded-full border border-hairline bg-transparent px-5 py-3 font-sans text-sm text-primary transition-colors duration-300 placeholder:text-faint focus:border-gold-500/60 focus:outline-none sm:w-72"
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-accent px-8 py-3 font-accent text-xs uppercase tracking-luxe text-onaccent shadow-gold transition-shadow duration-300 hover:shadow-gold-lg"
            >
              <span className="relative z-10 flex items-center gap-2">
                Subscribe
                <Send size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              <span className="absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </motion.button>
          </form>
        </div>

        {/* Viewing preferences — the two things that change how the site
            presents itself, put where a visitor goes looking for settings. */}
        <div className="mt-16 flex flex-col items-center justify-between gap-5 border-t border-hairline pt-8 sm:flex-row">
          <div className="flex items-center gap-3">
            <CinemaToggle />
            <div>
              <p className="font-accent text-[10px] uppercase tracking-luxe text-muted">
                Cinema Mode
              </p>
              <p className="font-sans text-[11px] font-light text-faint">
                Film grain, letterbox and a warmer grade
              </p>
            </div>
          </div>

          <button
            onClick={openShortcuts}
            className="group flex items-center gap-2.5 font-sans text-[11px] font-light text-faint transition-colors hover:text-accent"
          >
            <Keyboard size={14} strokeWidth={1.7} />
            Keyboard shortcuts
            <kbd className="rounded border border-hairline px-1.5 py-0.5 font-sans text-[10px] text-muted transition-colors group-hover:border-gold-500/40 group-hover:text-accent">
              ?
            </kbd>
          </button>
        </div>

        {/* Legal */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-hairline pt-8 font-sans text-xs font-light text-faint md:flex-row">
          <p>© {new Date().getFullYear()} {brandData.name}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/contact" className="transition-colors hover:text-accent">
              Privacy Policy
            </Link>
            <Link href="/contact" className="transition-colors hover:text-accent">
              Terms of Service
            </Link>
            <Link href="/contact" className="transition-colors hover:text-accent">
              Care Guide
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
