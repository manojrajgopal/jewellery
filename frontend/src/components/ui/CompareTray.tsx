'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeftRight, X } from 'lucide-react';

import { products } from '@/data/products';
import { COMPARE_LIMIT, openCompare, useCompare } from '@/hooks/useCompare';
import CompareModal from '@/components/ui/CompareModal';

/**
 * The docked comparison tray, plus the table it opens.
 *
 * It lives at the root and shows itself only when something is in it, so it
 * costs nothing on a page where nobody has compared anything. Slots are drawn
 * for the empty positions as well as the filled ones — an incomplete tray that
 * shows its capacity invites the third pick, where three floating thumbnails
 * just look like a mistake.
 */
export default function CompareTray() {
  const { ids, remove, clear, count, hydrated } = useCompare();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener('aurum-open-compare', onOpen);
    return () => window.removeEventListener('aurum-open-compare', onOpen);
  }, []);

  // Closing the tray entirely should close the table with it, or the table is
  // left showing a comparison of nothing.
  useEffect(() => {
    if (!count) setOpen(false);
  }, [count]);

  const picked = ids
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <>
      <AnimatePresence>
        {hydrated && count > 0 && (
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            className="fixed inset-x-0 bottom-0 z-[190] px-4 pb-4 sm:px-6 sm:pb-6"
          >
            <div className="hud mx-auto flex max-w-3xl items-center gap-4 rounded-full py-3 pl-4 pr-3 shadow-cinema">
              <span className="hidden shrink-0 font-accent text-[10px] uppercase tracking-luxe text-accent sm:block">
                Compare
              </span>

              <ul className="flex flex-1 items-center gap-2">
                {Array.from({ length: COMPARE_LIMIT }).map((_, i) => {
                  const p = picked[i];
                  return (
                    <li key={i} className="relative">
                      <AnimatePresence mode="wait">
                        {p ? (
                          <motion.span
                            key={p.id}
                            initial={{ scale: 0.5, opacity: 0, rotate: -12 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            exit={{ scale: 0.5, opacity: 0, rotate: 12 }}
                            transition={{ type: 'spring', stiffness: 340, damping: 22 }}
                            className="group relative block h-11 w-11 overflow-hidden rounded-xl border border-gold-500/30 sm:h-12 sm:w-12"
                          >
                            <Image
                              src={p.images?.[0] ?? '/images/hero/hero-main.jpg'}
                              alt={p.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                            <button
                              onClick={() => remove(p.id)}
                              aria-label={`Remove ${p.name} from comparison`}
                              className="absolute inset-0 flex items-center justify-center bg-ink-950/70 opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus-visible:opacity-100"
                            >
                              <X className="h-3.5 w-3.5 text-cream-50" />
                            </button>
                          </motion.span>
                        ) : (
                          <motion.span
                            key={`empty-${i}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            aria-hidden="true"
                            className="block h-11 w-11 rounded-xl border border-dashed border-line-strong sm:h-12 sm:w-12"
                          />
                        )}
                      </AnimatePresence>
                    </li>
                  );
                })}
              </ul>

              <button
                onClick={clear}
                className="shrink-0 font-accent text-[10px] uppercase tracking-luxe text-faint transition-colors hover:text-accent"
              >
                Clear
              </button>

              <button
                onClick={openCompare}
                disabled={count < 2}
                className="flex shrink-0 items-center gap-2 rounded-full bg-accent px-5 py-2.5 font-accent text-[10px] uppercase tracking-luxe text-onaccent shadow-gold transition-shadow hover:shadow-gold-lg disabled:pointer-events-none disabled:opacity-40"
              >
                <ArrowLeftRight className="h-3.5 w-3.5" />
                {count < 2 ? 'Pick one more' : 'Compare'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CompareModal open={open} onClose={() => setOpen(false)} products={picked} />
    </>
  );
}
