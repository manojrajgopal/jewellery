'use client';

import { useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

import { easeForge, punchImpression, punchStrike, springsBench } from '@/lib/motion';

interface Mark {
  /** What is cut into the punch face. Kept to two characters — a real punch is. */
  glyph: string;
  /** What the mark means, read across a counter. */
  label: string;
  /** The one thing a customer is never told about this mark. */
  note?: string;
}

interface HallmarkPunchProps {
  marks?: Mark[];
  className?: string;
}

/**
 * A hallmark being struck, one punch at a time.
 *
 * The site can already *decode* a hallmark — `HallmarkDecoder` enlarges a
 * finished stamp and names its four marks. What it cannot show, because it is a
 * reading of an object rather than a record of an event, is that a hallmark is
 * a violent thing that happens to a finished piece. Somebody takes a ring that
 * has just been polished for two hours and hits it with a hardened steel punch.
 *
 * Three details make the strike read as metal rather than as a stamp graphic,
 * and all three are in the timing rather than the drawing:
 *
 *   1. The punch stops dead. It does not ease out, because it is not decelerating
 *      — it is colliding. The recoil that follows is small, because most of the
 *      energy went into the work.
 *   2. The impression appears at contact, but the *displaced* metal — the raised
 *      lip around the mark — arrives a beat later, because metal takes a moment
 *      to flow sideways out of the way.
 *   3. The plate itself moves. A struck plate jumps, and a mark that appears on
 *      a perfectly still surface reads as printing.
 *
 * Marks are struck in sequence rather than together, which is also true: a
 * four-mark hallmark is four separate blows, and on a curved surface each one
 * needs the piece reseated on the stake between them.
 */

const DEFAULT_MARKS: Mark[] = [
  {
    glyph: 'BIS',
    label: 'The bureau',
    note: 'The only mark of the four that is a legal requirement rather than a courtesy.',
  },
  {
    glyph: '916',
    label: 'Fineness',
    note: '916 parts gold in 1000 — which is 22 karat said properly, as a fraction rather than as a fraction of 24.',
  },
  {
    glyph: 'A6',
    label: 'The assay office',
    note: 'Says where it was tested, not where it was made. Those are almost never the same building.',
  },
  {
    glyph: 'AU',
    label: "The maker's mark",
    note: 'Ours. It is the only one of the four we are allowed to cut ourselves, and the only one we can be prosecuted for.',
  },
];

export default function HallmarkPunch({
  marks = DEFAULT_MARKS,
  className = '',
}: HallmarkPunchProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: '-18% 0px -18% 0px' });
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* The stake the work is laid on. Everything above it jumps; this does
          not, which is what gives the jump something to be measured against. */}
      <div className="relative mx-auto max-w-3xl">
        <div className="relative overflow-hidden rounded-lg border border-hairline bg-[linear-gradient(180deg,rgb(var(--gold-600)),rgb(var(--gold-800))_54%,rgb(var(--gold-900)))] px-4 py-10 shadow-inset sm:px-8">
          {/* The polished surface the marks are going into. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(104deg,transparent_18%,rgb(var(--gold-100)/0.28)_44%,rgb(var(--gold-50)/0.4)_50%,rgb(var(--gold-100)/0.24)_57%,transparent_82%)]"
          />

          <motion.div
            // The plate jump. One frame of movement per blow, and it is the
            // whole reason the marks read as struck rather than as printed.
            animate={
              reduced || !inView
                ? {}
                : { y: [0, 2.5, 0, 2.5, 0, 2.5, 0, 2.5, 0] }
            }
            transition={{
              duration: marks.length * 0.34,
              times: Array.from({ length: 9 }, (_, i) => i / 8),
              ease: easeForge.strike,
            }}
            className="relative flex flex-wrap items-center justify-center gap-3 sm:gap-5"
          >
            {marks.map((mark, i) => (
              <div key={mark.glyph} className="relative">
                {/* The punch itself, descending. Removed from the flow so it
                    cannot shift the mark it is about to make. */}
                {!reduced && (
                  <motion.span
                    aria-hidden="true"
                    initial="hidden"
                    animate={inView ? 'visible' : 'hidden'}
                    variants={punchStrike}
                    transition={{ delay: i * 0.34 }}
                    className="pointer-events-none absolute inset-x-1 -top-1 bottom-1 z-20 rounded-sm bg-[linear-gradient(180deg,rgb(var(--ink-200)),rgb(var(--ink-500))_46%,rgb(var(--ink-800)))] shadow-lift"
                  />
                )}

                <motion.button
                  type="button"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                  initial="hidden"
                  animate={inView || reduced ? 'visible' : 'hidden'}
                  variants={reduced ? undefined : punchImpression}
                  transition={{ delay: i * 0.34 }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="punch-face relative z-10 flex h-16 w-16 items-center justify-center rounded-sm bg-gold-900/60 font-accent text-sm uppercase tracking-luxe text-gold-100 transition-colors hover:bg-gold-900/80 sm:h-20 sm:w-20 sm:text-base"
                >
                  {mark.glyph}
                </motion.button>

                {/* The displaced metal: a lip that rises around the impression
                    once the punch has left. Late by design. */}
                {!reduced && (
                  <motion.span
                    aria-hidden="true"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={inView ? { opacity: 0.7, scale: 1.1 } : {}}
                    transition={{ ...springsBench.punch, delay: i * 0.34 + 0.34 }}
                    className="pointer-events-none absolute inset-0 rounded-sm shadow-[0_0_0_1px_rgb(var(--gold-100)/0.4),0_2px_5px_-1px_rgb(var(--gold-50)/0.35)]"
                  />
                )}
              </div>
            ))}
          </motion.div>
        </div>

        {/* The anvil face. Deliberately unlit — nobody polishes a stake. */}
        <div
          aria-hidden="true"
          className="mx-auto h-3 w-[86%] rounded-b-sm bg-[linear-gradient(180deg,rgb(var(--ink-700)),rgb(var(--ink-900)))]"
        />
      </div>

      {/* What each blow actually means. Opens under the row rather than as a
          tooltip, because three of these are longer than a tooltip should be. */}
      <div className="mx-auto mt-6 max-w-3xl">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {marks.map((mark, i) => (
            <button
              key={mark.label}
              type="button"
              onClick={() => setOpen(open === i ? null : i)}
              className={`font-accent text-[10px] uppercase tracking-luxe transition-colors ${
                open === i ? 'text-accent' : 'text-faint hover:text-accent'
              }`}
            >
              {mark.label}
            </button>
          ))}
        </div>

        <motion.div
          initial={false}
          animate={{ height: open === null ? 0 : 'auto', opacity: open === null ? 0 : 1 }}
          transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
        >
          {open !== null && marks[open].note && (
            <p className="mt-4 border-t border-line-subtle pt-4 text-center font-sans text-sm font-light leading-relaxed text-muted">
              {marks[open].note}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
