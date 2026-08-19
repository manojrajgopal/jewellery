'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, BookOpen, ChevronDown, Gem, Newspaper, Sparkles } from 'lucide-react';

export interface DiscoverEntry {
  label: string;
  href: string;
  blurb: string;
  icon: typeof Gem;
}

/**
 * The reference and editorial pages. Kept out of the main navigation bar because
 * they are not part of the primary path through the site — nobody arrives intending
 * to read a grading-report explainer, they arrive at it from a stone they liked.
 */
export const DISCOVER: DiscoverEntry[] = [
  {
    label: 'The Lookbook',
    href: '/lookbook',
    blurb: 'Twelve plates, bound. Turn the leaves at your own pace.',
    icon: BookOpen,
  },
  {
    label: 'The Journal',
    href: '/journal',
    blurb: 'Notes from the bench, written by the people at it.',
    icon: Newspaper,
  },
  {
    label: 'Stone Library',
    href: '/gemstones',
    blurb: 'Every gem we set, with the figures that decide how it wears.',
    icon: Gem,
  },
  {
    label: 'Care & Sizing',
    href: '/care',
    blurb: 'The ritual, adapted to your stone. Rings and chains sized.',
    icon: Sparkles,
  },
];

/**
 * A hover-and-focus menu over the reference pages.
 *
 * Two behaviours are what make a menu like this usable rather than infuriating, and
 * both are easy to leave out:
 *
 * Closing is delayed by a beat. The panel sits below the trigger with a gap between
 * them, and a pointer travelling from one to the other briefly leaves both — without
 * the delay the panel closes out from under the cursor every time.
 *
 * Focus opens it too, and Escape closes it. A pointer-only mega-menu is unreachable
 * by keyboard, which on a site that already ships a full keyboard layer would be an
 * obvious omission.
 */
export default function DiscoverMenu({ className = '' }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const closeTimer = useRef(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  const active = DISCOVER.some((d) => pathname.startsWith(d.href));

  const show = () => {
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  };

  // 160ms is long enough to cross the gap and short enough not to feel sticky.
  const hide = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), 160);
  };

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  // Close on route change, or the panel hangs over the page it just navigated to.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div
      ref={wrapRef}
      className={`relative ${className}`}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={(e) => {
        // Only close when focus has genuinely left the whole menu, not when it moves
        // between the trigger and a link inside the panel.
        if (!wrapRef.current?.contains(e.relatedTarget as Node)) hide();
      }}
    >
      <button
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className={`relative flex items-center gap-1.5 px-3 py-2 font-accent text-[11px] uppercase tracking-luxe transition-colors duration-300 ${
          active || open ? 'text-accent' : 'text-secondary hover:text-primary'
        }`}
      >
        Discover
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown size={12} strokeWidth={2} />
        </motion.span>

        {active && (
          <motion.span
            layoutId="nav-active"
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            className="absolute inset-x-3 -bottom-0.5 h-px bg-gradient-to-r from-transparent via-accent to-transparent"
          />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 8, scale: 0.98, filter: 'blur(5px)' }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="absolute left-1/2 top-full z-50 mt-4 w-[min(90vw,40rem)] -translate-x-1/2"
          >
            {/* Pointer bridge — an invisible strip covering the gap, so the pointer
                never leaves the menu on its way down to the panel. */}
            <span aria-hidden="true" className="absolute inset-x-0 -top-4 h-4" />

            <div className="glass-strong relative overflow-hidden rounded-2xl p-2 shadow-cinema">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gold-mesh opacity-40"
              />

              <div className="relative grid gap-1.5 sm:grid-cols-[minmax(0,1fr)_11rem]">
                {/* Entries */}
                <div className="grid gap-1 sm:grid-cols-2">
                  {DISCOVER.map((entry, i) => {
                    const Icon = entry.icon;
                    const on = pathname.startsWith(entry.href);
                    return (
                      <motion.div
                        key={entry.href}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.04 + i * 0.05, duration: 0.32 }}
                      >
                        <Link
                          href={entry.href}
                          className={`group flex h-full flex-col gap-2 rounded-xl p-4 transition-colors duration-300 ${
                            on ? 'bg-gold-500/[0.1]' : 'hover:bg-gold-500/[0.07]'
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-hairline text-accent/80 transition-colors group-hover:border-gold-500/40">
                              <Icon size={13} strokeWidth={1.7} />
                            </span>
                            <span className="font-accent text-[10px] uppercase tracking-luxe text-primary">
                              {entry.label}
                            </span>
                            <ArrowUpRight
                              size={12}
                              className="ml-auto text-accent opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
                            />
                          </span>
                          <span className="font-sans text-[11px] font-light leading-relaxed text-muted">
                            {entry.blurb}
                          </span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Featured plate */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.18, duration: 0.4 }}
                  className="hidden sm:block"
                >
                  <Link
                    href="/lookbook"
                    data-cursor="Open"
                    className="group relative block h-full overflow-hidden rounded-xl border border-hairline"
                  >
                    <Image
                      src="/images/collections/statement.jpg"
                      alt="The season's lookbook"
                      fill
                      sizes="176px"
                      className="object-cover transition-transform duration-[1200ms] ease-luxury group-hover:scale-110"
                    />
                    <span aria-hidden="true" className="media-veil-soft absolute inset-0" />
                    <span className="absolute inset-x-0 bottom-0 p-3.5">
                      <span className="block font-accent text-[8px] uppercase tracking-luxest text-accent">
                        New
                      </span>
                      <span className="mt-1 block font-display text-sm font-light leading-snug text-on-media">
                        The season, bound
                      </span>
                    </span>
                    {/* One sheen pass on hover */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 overflow-hidden"
                    >
                      <span className="absolute -inset-full bg-gold-sheen opacity-0 transition-opacity duration-300 group-hover:animate-sheen-diagonal group-hover:opacity-60" />
                    </span>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
