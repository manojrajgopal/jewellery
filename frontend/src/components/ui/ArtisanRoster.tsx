'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import CountUp from '@/components/motion/CountUp';
import { artisans, type Artisan } from '@/data/atelier';

interface ArtisanRosterProps {
  className?: string;
}

/**
 * The bench, by name.
 *
 * Rendered as a set of vertical plates that widen when hovered rather than as a
 * grid of cards. The reason is editorial: an atelier's value is the *depth* of any
 * one person's practice, and a grid gives every artisan the same 240 pixels
 * regardless. Expanding one plate at a time means whoever the visitor is looking at
 * gets the room to say something, and the others recede to a name and a discipline
 * — which is how a roster is read anyway.
 *
 * Collapses to a plain stacked list below the breakpoint where the expansion has
 * anywhere to expand into. A row of six accordion panels on a phone is six panels
 * nobody can open.
 */
export default function ArtisanRoster({ className = '' }: ArtisanRosterProps) {
  const [open, setOpen] = useState<string>(artisans[0].id);

  return (
    <div className={className}>
      {/* ---- Wide: expanding plates ---- */}
      <div className="hidden gap-2 lg:flex lg:h-[30rem]">
        {artisans.map((artisan) => {
          const on = open === artisan.id;
          return (
            <motion.button
              key={artisan.id}
              onMouseEnter={() => setOpen(artisan.id)}
              onFocus={() => setOpen(artisan.id)}
              onClick={() => setOpen(artisan.id)}
              aria-expanded={on}
              layout
              transition={{ type: 'spring', stiffness: 180, damping: 26 }}
              className={`group relative overflow-hidden rounded-2xl border text-left transition-colors duration-500 ${
                on
                  ? 'border-gold-500/45 bg-surface-raised'
                  : 'border-hairline bg-surface-raised/50 hover:border-gold-500/30'
              }`}
              style={{ flex: on ? 4.2 : 1 }}
            >
              <PlateBody artisan={artisan} expanded={on} />
            </motion.button>
          );
        })}
      </div>

      {/* ---- Narrow: stacked list ---- */}
      <div className="flex flex-col gap-3 lg:hidden">
        {artisans.map((artisan) => {
          const on = open === artisan.id;
          return (
            <button
              key={artisan.id}
              onClick={() => setOpen(on ? '' : artisan.id)}
              aria-expanded={on}
              className={`overflow-hidden rounded-2xl border text-left transition-colors duration-500 ${
                on ? 'border-gold-500/45 bg-surface-raised' : 'border-hairline bg-surface-raised/50'
              }`}
            >
              <div className="flex items-center gap-4 p-5">
                <Portrait artisan={artisan} size={52} />
                <div className="min-w-0 flex-1">
                  <p className="font-display text-lg font-light leading-tight text-primary">
                    {artisan.name}
                  </p>
                  <p className="mt-0.5 font-accent text-[9px] uppercase tracking-luxe text-accent">
                    {artisan.discipline}
                  </p>
                </div>
                <span className="nums-tabular flex-shrink-0 font-display text-xl text-accent">
                  {artisan.years}
                  <span className="ml-1 font-accent text-[8px] uppercase tracking-luxe text-faint">
                    yrs
                  </span>
                </span>
              </div>

              <AnimatePresence initial={false}>
                {on && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-hairline px-5 pb-5 pt-4">
                      <Detail artisan={artisan} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function PlateBody({ artisan, expanded }: { artisan: Artisan; expanded: boolean }) {
  return (
    <>
      {/* Portrait, or the initial plate */}
      {artisan.portrait ? (
        <>
          <Image
            src={artisan.portrait}
            alt={artisan.name}
            fill
            sizes="40vw"
            className={`object-cover transition-all duration-[1200ms] ease-luxury ${
              expanded ? 'scale-100 opacity-45' : 'scale-110 opacity-25 grayscale'
            }`}
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-surface-raised via-surface-raised/70 to-transparent"
          />
        </>
      ) : (
        <span
          aria-hidden="true"
          className={`absolute inset-0 facet-fan transition-opacity duration-700 ${
            expanded ? 'opacity-30' : 'opacity-12'
          }`}
        />
      )}

      {/* Collapsed: the name set vertically, which is what makes a narrow plate
          readable at all rather than a column of one-letter lines. */}
      <span
        className={`absolute inset-0 flex items-end justify-center pb-8 transition-opacity duration-300 ${
          expanded ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
      >
        <span
          className="whitespace-nowrap font-accent text-[11px] uppercase tracking-luxest text-secondary"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          {artisan.name}
        </span>
      </span>

      {/* Collapsed: generation mark at the top */}
      <span
        className={`absolute left-1/2 top-6 -translate-x-1/2 font-display text-2xl transition-opacity duration-300 ${
          expanded ? 'opacity-0' : 'text-accent/50 opacity-100'
        }`}
      >
        {'I'.repeat(artisan.generation)}
      </span>

      {/* Expanded */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex flex-col justify-end p-7"
          >
            <div className="mb-auto flex items-start justify-between gap-4">
              <Portrait artisan={artisan} size={56} />
              <span className="text-right">
                <span className="nums-tabular block font-display text-3xl text-accent">
                  <CountUp end={artisan.years} duration={1.2} />
                </span>
                <span className="block font-accent text-[8px] uppercase tracking-luxe text-faint">
                  years at the bench
                </span>
              </span>
            </div>

            <p className="font-accent text-[9px] uppercase tracking-luxest text-accent">
              Generation {artisan.generation}
            </p>
            <h3 className="mt-2 font-display text-2xl font-light leading-tight text-primary">
              {artisan.name}
            </h3>
            <p className="mt-1 font-sans text-xs font-light text-muted">
              {artisan.discipline}
            </p>

            <Detail artisan={artisan} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hairline that travels the top edge of the live plate */}
      {expanded && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent"
        />
      )}
    </>
  );
}

function Detail({ artisan }: { artisan: Artisan }) {
  return (
    <>
      <blockquote className="mt-4 flex gap-2.5 border-l border-gold-500/40 pl-4">
        <Quote size={12} strokeWidth={2} className="mt-1 flex-shrink-0 text-accent/60" />
        <p className="font-display text-sm italic leading-snug text-secondary">
          {artisan.quote}
        </p>
      </blockquote>

      <p className="mt-4 font-sans text-[11px] font-light leading-relaxed text-muted">
        <span className="font-accent uppercase tracking-luxe text-faint">Authority on </span>
        {artisan.speciality}
      </p>

      <ul className="mt-4 flex flex-wrap gap-1.5">
        {artisan.skills.map((skill, i) => (
          <motion.li
            key={skill}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.05, duration: 0.3 }}
            className="rounded-full border border-hairline px-2.5 py-1 font-accent text-[8px] uppercase tracking-luxe text-muted"
          >
            {skill}
          </motion.li>
        ))}
      </ul>
    </>
  );
}

function Portrait({ artisan, size }: { artisan: Artisan; size: number }) {
  if (artisan.portrait) {
    return (
      <span
        className="relative flex-shrink-0 overflow-hidden rounded-full border border-gold-500/30"
        style={{ width: size, height: size }}
      >
        <Image src={artisan.portrait} alt={artisan.name} fill sizes="60px" className="object-cover" />
      </span>
    );
  }
  return (
    <span
      className="flex flex-shrink-0 items-center justify-center rounded-full border border-gold-500/30 bg-gold-900/25 font-accent text-sm uppercase tracking-luxe text-accent"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {artisan.initials}
    </span>
  );
}
