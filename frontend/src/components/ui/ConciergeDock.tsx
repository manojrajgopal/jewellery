'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen,
  CalendarHeart,
  Gem,
  Headset,
  Mail,
  Phone,
  Ruler,
  Sparkles,
  X,
} from 'lucide-react';
import { openWishlist } from '@/components/providers/KeyboardLayer';
import { brandData } from '@/data/brand';

interface Action {
  label: string;
  detail: string;
  icon: typeof Gem;
  href?: string;
  onClick?: () => void;
  external?: boolean;
}

/** Boutique hours, in 24h local time. Used only to word the status honestly. */
const OPENS = 11;
const CLOSES = 20;

/**
 * The concierge dock: one floating control that opens onto the handful of things a
 * visitor most often wants and cannot find from where they are standing.
 *
 * It says whether the boutique is actually open, computed from the hours in the brand
 * data rather than hard-coded as "we are here to help". That is the difference between
 * a concierge and a chat bubble — if the answer is "not until eleven tomorrow", saying
 * so is more useful than implying somebody is waiting.
 *
 * Deliberately not a chat widget. There is no one behind it, and a text box that looks
 * like a live conversation and silently goes nowhere is worse than no box at all. It
 * offers a telephone number, an address, and the four tools people ask for by name.
 *
 * Hidden on /contact, where every one of these is already on the page.
 */
export default function ConciergeDock() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<{ open: boolean; text: string } | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Computed after mount. A static export would otherwise bake the build-time hour
  // into the HTML and cheerfully tell a 3am visitor that the boutique is open.
  useEffect(() => {
    const read = () => {
      const now = new Date();
      const hour = now.getHours();
      const sunday = now.getDay() === 0;

      if (sunday) {
        setStatus({ open: false, text: 'Sunday — by appointment only' });
        return;
      }
      if (hour >= OPENS && hour < CLOSES) {
        setStatus({ open: true, text: `Open now until ${CLOSES - 12}pm` });
        return;
      }
      setStatus({
        open: false,
        text: hour < OPENS ? `Opens at ${OPENS}am` : 'Closed — opens 11am tomorrow',
      });
    };
    read();
    // Re-read on the hour rather than per minute: the wording only changes on an
    // hour boundary, and a minute timer running all session for that is waste.
    const t = window.setInterval(read, 60 * 60 * 1000);
    return () => window.clearInterval(t);
  }, []);

  // Close on Escape and on a click outside, the same contract as the site's dialogs.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onDown = (e: PointerEvent) => {
      if (!panelRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    // Deferred a tick, or the click that opened the dock immediately closes it.
    const t = window.setTimeout(() => window.addEventListener('pointerdown', onDown), 0);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onDown);
      window.clearTimeout(t);
    };
  }, [open]);

  // Route change should never leave the panel hanging over a new page.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // The footer opens the dock through an event rather than by prop-drilling a
  // setter up through the layout — the same pattern the wishlist drawer uses.
  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener('aurum-open-concierge', onOpen);
    return () => window.removeEventListener('aurum-open-concierge', onOpen);
  }, []);

  if (pathname === '/contact') return null;

  const actions: Action[] = [
    {
      label: 'Telephone the house',
      detail: brandData.contact.phone,
      icon: Phone,
      href: `tel:${brandData.contact.phone.replace(/\s/g, '')}`,
      external: true,
    },
    {
      label: 'Write to the concierge',
      detail: brandData.contact.email,
      icon: Mail,
      href: `mailto:${brandData.contact.email}`,
      external: true,
    },
    {
      label: 'Book a private viewing',
      detail: 'One hour, by appointment, no obligation',
      icon: CalendarHeart,
      href: '/contact',
    },
    {
      label: 'Find your size',
      detail: 'Ring sizer and chain lengths',
      icon: Ruler,
      href: '/care',
    },
    {
      label: 'Commission something',
      detail: 'Six to fourteen weeks at the bench',
      icon: Sparkles,
      href: '/bespoke',
    },
    {
      label: 'Read the lookbook',
      detail: 'Twelve plates, bound',
      icon: BookOpen,
      href: '/lookbook',
    },
    {
      label: 'Your saved pieces',
      detail: 'Open the drawer',
      icon: Gem,
      onClick: openWishlist,
    },
  ];

  return (
    // bottom-24 rather than bottom-6: BackToTop already owns the bottom-left corner
    // at bottom-6, and it is 3.5rem tall, so this clears it and the two stack. The
    // z sits above BackToTop and below the toasts and the compare tray, both of
    // which are meant to win.
    <div className="pointer-events-none fixed bottom-24 left-6 z-[115] flex flex-col items-start gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-label="Concierge"
            initial={{ opacity: 0, y: 20, scale: 0.94, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 14, scale: 0.96, filter: 'blur(6px)' }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            className="glass-strong pointer-events-auto w-[min(88vw,21rem)] overflow-hidden rounded-2xl"
          >
            {/* Ambient wash */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gold-mesh opacity-40"
            />

            <header className="relative border-b border-hairline p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-display text-lg font-light text-primary">
                    The Concierge
                  </p>
                  {status && (
                    <p className="mt-1 flex items-center gap-2 font-accent text-[9px] uppercase tracking-luxe">
                      <span
                        aria-hidden="true"
                        className={`block h-1.5 w-1.5 rounded-full ${
                          status.open
                            ? 'animate-pulse-dot bg-jade-300'
                            : 'bg-burgundy-300'
                        }`}
                      />
                      <span className={status.open ? 'text-jade-300' : 'text-muted'}>
                        {status.text}
                      </span>
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close the concierge"
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-hairline text-faint transition-colors hover:border-gold-500/40 hover:text-accent"
                >
                  <X size={14} strokeWidth={1.9} />
                </button>
              </div>
            </header>

            <div className="relative max-h-[60vh] overflow-y-auto scrollbar-gold p-2">
              {actions.map((action, i) => {
                const Icon = action.icon;
                const body = (
                  <motion.span
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.045, duration: 0.35 }}
                    className="flex w-full items-center gap-3.5 rounded-xl p-3 transition-colors duration-300 hover:bg-gold-500/[0.07]"
                  >
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-hairline text-accent/80">
                      <Icon size={14} strokeWidth={1.7} />
                    </span>
                    <span className="min-w-0 flex-1 text-left">
                      <span className="block font-sans text-[13px] font-light text-primary">
                        {action.label}
                      </span>
                      <span className="mt-0.5 block truncate font-sans text-[11px] font-light text-faint">
                        {action.detail}
                      </span>
                    </span>
                  </motion.span>
                );

                if (action.onClick) {
                  return (
                    <button
                      key={action.label}
                      onClick={() => {
                        action.onClick?.();
                        setOpen(false);
                      }}
                      className="block w-full"
                    >
                      {body}
                    </button>
                  );
                }

                if (action.external) {
                  return (
                    <a key={action.label} href={action.href} className="block w-full">
                      {body}
                    </a>
                  );
                }

                return (
                  <Link key={action.label} href={action.href ?? '/'} className="block w-full">
                    {body}
                  </Link>
                );
              })}
            </div>

            <footer className="relative border-t border-hairline p-4">
              <p className="font-sans text-[10px] font-light italic leading-relaxed text-faint">
                No robots. Telephone or write and a person answers — {brandData.contact.hours}
                .
              </p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The dock button */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? 'Close the concierge' : 'Open the concierge'}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="hud pointer-events-auto group relative flex h-12 items-center gap-3 rounded-full pl-3.5 pr-5 shadow-lift"
      >
        {/* Live rim while closed, so the dock reads as available rather than decorative */}
        {!open && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full opacity-60"
          >
            <span className="rim-live absolute inset-0 rounded-full" />
          </span>
        )}

        <span className="relative flex h-7 w-7 items-center justify-center rounded-full border border-gold-500/35 text-accent">
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                className="flex"
              >
                <X size={14} strokeWidth={2} />
              </motion.span>
            ) : (
              <motion.span
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                className="flex"
              >
                <Headset size={14} strokeWidth={1.8} />
              </motion.span>
            )}
          </AnimatePresence>
        </span>

        <span className="relative hidden font-accent text-[10px] uppercase tracking-luxe text-primary sm:block">
          Concierge
        </span>

        {/* Status pip, mirroring the panel header */}
        {status && !open && (
          <span
            aria-hidden="true"
            className={`relative block h-1.5 w-1.5 rounded-full ${
              status.open ? 'animate-pulse-dot bg-jade-300' : 'bg-burgundy-300'
            }`}
          />
        )}
      </motion.button>
    </div>
  );
}

/** Opened from the footer, so the dock does not have to be found first. */
export const openConcierge = () =>
  window.dispatchEvent(new CustomEvent('aurum-open-concierge'));
