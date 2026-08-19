'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';

import type { Product } from '@/types';
import { modalPop, overlayBackdrop } from '@/lib/motion';

interface CompareModalProps {
  open: boolean;
  onClose: () => void;
  products: Product[];
}

const priceOf = (p: Product) => Number(p.price.replace(/[^\d]/g, '')) || 0;

/** Rows are declared as accessors so the table stays one source of truth. */
const ROWS: { label: string; get: (p: Product) => string }[] = [
  { label: 'Price', get: (p) => p.formattedPrice ?? p.price },
  { label: 'Collection', get: (p) => p.collection.replace(/-/g, ' ') },
  { label: 'Category', get: (p) => p.category },
  { label: 'Metal', get: (p) => p.metal.replace(/-/g, ' ') },
  { label: 'Karat', get: (p) => p.karat ?? '—' },
  { label: 'Gemstone', get: (p) => p.gemstone ?? 'None' },
  { label: 'Availability', get: (p) => (p.inStock === false ? 'Made to order' : 'In the vitrine') },
];

/**
 * Side-by-side comparison.
 *
 * The one piece of real analysis here is the cheapest-column highlight. A
 * comparison table that only restates the cards teaches nothing; marking the
 * lowest price makes the table answer a question rather than just arranging
 * facts. It is deliberately the only judgement the table makes — everything else
 * is a genuine matter of taste and should not be scored.
 */
export default function CompareModal({ open, onClose, products }: CompareModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const cheapest = products.length
    ? products.reduce((a, b) => (priceOf(a) <= priceOf(b) ? a : b)).id
    : null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          variants={overlayBackdrop}
          initial="hidden"
          animate="visible"
          exit="exit"
          role="dialog"
          aria-modal="true"
          aria-label="Compare pieces"
          className="fixed inset-0 z-[240] flex items-center justify-center bg-ink-950/75 p-4 sm:p-8"
          onClick={onClose}
        >
          <motion.div
            variants={modalPop}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="scrollbar-gold hud relative max-h-[88vh] w-full max-w-5xl overflow-y-auto rounded-4xl p-6 shadow-cinema sm:p-9"
          >
            <button
              onClick={onClose}
              aria-label="Close comparison"
              className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-accent"
            >
              <X className="h-4 w-4" />
            </button>

            <span className="mb-2 block font-accent text-[10px] uppercase tracking-luxer text-accent">
              Side by side
            </span>
            <h2 className="mb-8 font-display text-3xl text-primary md:text-4xl">
              {products.length} pieces, one row at a time
            </h2>

            {/* Header row of images */}
            <div
              className="mb-6 grid gap-4"
              style={{ gridTemplateColumns: `7rem repeat(${products.length}, minmax(0,1fr))` }}
            >
              <span aria-hidden="true" />
              {products.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="relative mb-3 block aspect-square overflow-hidden rounded-2xl border border-line">
                    <Image
                      src={p.images?.[0] ?? '/images/hero/hero-main.jpg'}
                      alt={p.name}
                      fill
                      sizes="(min-width: 640px) 25vw, 40vw"
                      className="media-tone object-cover"
                    />
                  </span>
                  <span className="block font-display text-base leading-snug text-primary">
                    {p.name}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Specification rows */}
            <div className="divide-y divide-[rgb(var(--hairline)/var(--hairline-alpha))]">
              {ROWS.map((row, r) => (
                <motion.div
                  key={row.label}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.45, delay: 0.25 + r * 0.05 }}
                  className="grid items-baseline gap-4 py-3.5"
                  style={{
                    gridTemplateColumns: `7rem repeat(${products.length}, minmax(0,1fr))`,
                  }}
                >
                  <span className="font-accent text-[10px] uppercase tracking-luxe text-faint">
                    {row.label}
                  </span>
                  {products.map((p) => {
                    const best = row.label === 'Price' && p.id === cheapest && products.length > 1;
                    return (
                      <span
                        key={p.id}
                        className={`font-sans text-xs capitalize leading-relaxed ${
                          best ? 'font-medium text-accent' : 'text-secondary'
                        }`}
                      >
                        {row.get(p)}
                        {best && (
                          <span className="ml-2 rounded-full border border-accent/40 px-2 py-0.5 font-accent text-[8px] uppercase tracking-luxe">
                            Lowest
                          </span>
                        )}
                      </span>
                    );
                  })}
                </motion.div>
              ))}

              {/* Description row gets its own treatment — it is prose, not a value */}
              <div
                className="grid gap-4 py-5"
                style={{ gridTemplateColumns: `7rem repeat(${products.length}, minmax(0,1fr))` }}
              >
                <span className="font-accent text-[10px] uppercase tracking-luxe text-faint">
                  In short
                </span>
                {products.map((p) => (
                  <p key={p.id} className="font-sans text-[11px] leading-relaxed text-muted">
                    {p.description}
                  </p>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div
              className="mt-6 grid gap-4 border-t border-hairline pt-6"
              style={{ gridTemplateColumns: `7rem repeat(${products.length}, minmax(0,1fr))` }}
            >
              <span aria-hidden="true" />
              {products.map((p) => (
                <Link
                  key={p.id}
                  href={`/collections/${p.collection}`}
                  onClick={onClose}
                  className="group flex items-center gap-1.5 font-accent text-[10px] uppercase tracking-luxe text-accent transition-colors hover:text-accent-soft"
                >
                  View piece
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
