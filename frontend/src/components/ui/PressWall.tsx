'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Award, Quote } from 'lucide-react';
import FoilCard from '@/components/motion/FoilCard';
import { press, type PressItem } from '@/data/atelier';

interface PressWallProps {
  className?: string;
}

type Filter = 'all' | 'press' | 'award';

/**
 * The press and awards wall.
 *
 * Awards and press notices are drawn differently on purpose. An award is a seal —
 * a mark conferred by a body, with the body's name as the headline — so it gets the
 * foil treatment and a struck medallion. A press notice is somebody's *opinion*, so
 * it gets a quotation mark and the outlet's name in the byline position, where a
 * reader expects attribution rather than endorsement.
 *
 * Collapsing both into one card style is the usual approach and it is subtly
 * dishonest: it lets a favourable review borrow the authority of a certification.
 */
export default function PressWall({ className = '' }: PressWallProps) {
  const [filter, setFilter] = useState<Filter>('all');

  const visible = useMemo(
    () => (filter === 'all' ? press : press.filter((p) => p.kind === filter)),
    [filter]
  );

  const counts = useMemo(
    () => ({
      all: press.length,
      press: press.filter((p) => p.kind === 'press').length,
      award: press.filter((p) => p.kind === 'award').length,
    }),
    []
  );

  return (
    <div className={className}>
      {/* Filter */}
      <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
        {(
          [
            { value: 'all' as Filter, label: 'Everything' },
            { value: 'award' as Filter, label: 'Awards' },
            { value: 'press' as Filter, label: 'In Print' },
          ]
        ).map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            aria-pressed={filter === f.value}
            className={`relative rounded-full px-5 py-2.5 font-accent text-[10px] uppercase tracking-luxe transition-colors duration-300 ${
              filter === f.value ? 'text-onaccent' : 'text-muted hover:text-accent'
            }`}
          >
            {filter === f.value && (
              <motion.span
                layoutId="press-filter-pill"
                className="absolute inset-0 -z-10 rounded-full bg-accent shadow-gold"
                transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              />
            )}
            <span className="relative">
              {f.label}
              <span className="ml-2 nums-tabular opacity-60">{counts[f.value]}</span>
            </span>
          </button>
        ))}
      </div>

      {/* Wall */}
      <motion.div layout className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((item, i) =>
            item.kind === 'award' ? (
              <AwardCard key={item.id} item={item} index={i} />
            ) : (
              <PressCard key={item.id} item={item} index={i} />
            )
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function AwardCard({ item, index }: { item: PressItem; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 28, rotate: -1.5 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.55, delay: (index % 6) * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <FoilCard
        className="h-full"
        tilt={7}
        stamp={
          <span className="nums-tabular font-accent text-[9px] uppercase tracking-luxe text-accent/70">
            {item.year}
          </span>
        }
      >
        <div className="flex h-full flex-col items-center p-7 text-center">
          {/* Struck medallion */}
          <span className="relative mb-5 flex h-16 w-16 items-center justify-center">
            <span
              aria-hidden="true"
              className="absolute inset-0 animate-conic-spin-slow rounded-full bg-conic-gold opacity-70"
            />
            <span className="absolute inset-1 rounded-full border border-gold-400/40 bg-canvas/70 backdrop-blur" />
            <Award size={22} strokeWidth={1.5} className="relative text-accent" />
          </span>

          <span className="font-accent text-[9px] uppercase tracking-luxest text-accent">
            {item.outlet}
          </span>

          <h3 className="text-emboss-gold mt-3 font-display text-xl font-light leading-tight">
            {item.headline}
          </h3>

          <span
            aria-hidden="true"
            className="my-4 block h-px w-12 bg-gradient-to-r from-transparent via-accent/60 to-transparent"
          />

          <p className="font-sans text-xs font-light italic leading-relaxed text-muted">
            {item.quote}
          </p>
        </div>
      </FoilCard>
    </motion.div>
  );
}

function PressCard({ item, index }: { item: PressItem; index: number }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.55, delay: (index % 6) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-hairline bg-surface-raised/60 p-7 backdrop-blur-xl transition-colors duration-500 hover:border-gold-500/35"
    >
      {/* Oversized quotation mark, as a watermark rather than as punctuation */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-2 -top-6 font-display text-[7rem] leading-none text-accent/[0.06]"
      >
        &rdquo;
      </span>

      <Quote size={14} strokeWidth={2} className="mb-4 text-accent/60" />

      <blockquote className="font-display text-lg font-light italic leading-snug text-primary md:text-xl">
        {item.quote}
      </blockquote>

      <h3 className="mt-5 font-sans text-sm font-light leading-relaxed text-muted">
        {item.headline}
      </h3>

      <footer className="mt-auto flex items-baseline justify-between gap-4 border-t border-hairline pt-5">
        <cite className="font-accent text-[10px] uppercase not-italic tracking-luxe text-accent">
          {item.outlet}
        </cite>
        <span className="nums-tabular font-sans text-[11px] font-light text-faint">
          {item.year}
        </span>
      </footer>

      {/* One sheen pass on hover */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="absolute -inset-full bg-gold-sheen opacity-0 transition-opacity duration-300 group-hover:animate-sheen-diagonal group-hover:opacity-50" />
      </span>
    </motion.article>
  );
}
