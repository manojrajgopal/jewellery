'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Clock, X } from 'lucide-react';

import { products } from '@/data/products';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';

/**
 * The pieces this visitor has looked at, as a horizontal rail.
 *
 * Renders nothing until it has something to show — and nothing at all on the
 * first visit, which is the point. A "recently viewed" strip that appears empty
 * with a placeholder is a worse first impression than no strip.
 */
export default function RecentlyViewed({ className = '' }: { className?: string }) {
  const { ids, clear, hydrated } = useRecentlyViewed();

  const seen = ids
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (!hydrated || seen.length < 2) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Recently viewed"
      className={`relative border-y border-hairline bg-surface-raised/30 py-10 ${className}`}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-6 flex items-center justify-between gap-4">
          <span className="flex items-center gap-2 font-accent text-[10px] uppercase tracking-luxer text-accent">
            <Clock className="h-3.5 w-3.5" /> Recently viewed
          </span>
          <button
            onClick={clear}
            className="flex items-center gap-1.5 font-accent text-[10px] uppercase tracking-luxe text-faint transition-colors hover:text-accent"
          >
            <X className="h-3 w-3" /> Clear
          </button>
        </div>

        <ul className="scrollbar-hide -mx-1 flex gap-4 overflow-x-auto px-1 pb-1">
          <AnimatePresence initial={false}>
            {seen.map((p, i) => (
              <motion.li
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.85, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{
                  type: 'spring',
                  stiffness: 280,
                  damping: 26,
                  delay: i * 0.04,
                }}
                className="shrink-0"
              >
                <Link
                  href={`/collections/${p.collection}`}
                  className="group block w-36 sm:w-44"
                >
                  <span className="relative mb-2.5 block aspect-square overflow-hidden rounded-2xl border border-line transition-colors duration-500 group-hover:border-accent/50">
                    <Image
                      src={p.images?.[0] ?? '/images/hero/hero-main.jpg'}
                      alt={p.name}
                      fill
                      sizes="176px"
                      className="media-tone object-cover transition-transform duration-[1100ms] ease-luxury group-hover:scale-110"
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-ink-950/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </span>
                  <span className="block truncate font-display text-sm text-primary transition-colors group-hover:text-accent">
                    {p.name}
                  </span>
                  <span className="block font-accent text-[10px] tracking-luxe text-faint">
                    {p.formattedPrice ?? p.price}
                  </span>
                </Link>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </motion.section>
  );
}
