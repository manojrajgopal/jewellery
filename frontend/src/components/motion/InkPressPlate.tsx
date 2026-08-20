'use client';

import { useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

interface InkPressPlateProps {
  /** The words, one line per press. A press takes one line at a time. */
  lines: string[];
  className?: string;
  /** How hard the platen comes down, 0–1. Real presses are set by hand. */
  impression?: number;
  /** Show the impression control. */
  controls?: boolean;
}

/**
 * Type pressed into paper, rather than printed onto it.
 *
 * The site already has ink *bleeding* into a sheet (`InkBleedReveal`) and gold
 * leaf being *laid on* one (`GoldLeafGild`). Both of those are things that
 * happen on the surface. Letterpress is the opposite: the sheet is deformed,
 * and the type is visible because there is a dent in the paper where the metal
 * hit it, not because there is more ink there.
 *
 * That distinction is the whole component, and it explains the one detail
 * everybody gets wrong. Debossed type does not get *darker* — it gets a
 * highlight on one edge and a shadow on the other, exactly as a physical dent
 * would. So the animation here changes shadows and never changes the fill.
 *
 * The impression control is the genuinely interesting part, because it is the
 * argument that has run in printing for a hundred and forty years. A press set
 * light gives a crisp, almost flat impression, which is what letterpress
 * actually looked like when it was simply how printing was done — a deep bite
 * was a fault, and a pressman who left one was told about it. A press set heavy
 * gives the deep, tactile punch that everybody now associates with the word,
 * which is a modern taste for a historical mistake. Both are on the slider, and
 * the panel says which is which rather than pretending there is a right answer.
 *
 * Lines strike in sequence because a hand press takes one pull at a time, and
 * the paper is repositioned between them.
 */
export default function InkPressPlate({
  lines,
  className = '',
  impression = 0.55,
  controls = true,
}: InkPressPlateProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: '-18% 0px -18% 0px' });
  const [depth, setDepth] = useState(impression);

  // Shadow geometry, derived from one number so the highlight and the shadow
  // can never disagree about how deep the dent is.
  const shadowY = (0.6 + depth * 2.2).toFixed(2);
  const shadowBlur = (0.6 + depth * 2).toFixed(2);
  const shadowAlpha = (0.18 + depth * 0.42).toFixed(2);
  const highlightAlpha = (0.1 + depth * 0.24).toFixed(2);

  return (
    <div ref={ref} className={className}>
      <div className="paper-stock relative overflow-hidden rounded-sm px-8 py-12 shadow-lift sm:px-12 sm:py-16">
        {/* The platen coming down. One pass across the whole forme, which is
            what a platen press does — a cylinder press would roll. */}
        {!reduced && (
          <motion.div
            aria-hidden="true"
            initial={{ y: '-120%' }}
            animate={inView ? { y: ['-120%', '0%', '-120%'] } : {}}
            transition={{
              duration: 0.9,
              times: [0, 0.42, 1],
              ease: [0.5, 0, 0.2, 1],
            }}
            className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(180deg,rgb(var(--ink-800)/0.9),rgb(var(--ink-950)/0.7))]"
          />
        )}

        <div className="relative">
          {lines.map((line, i) => (
            <motion.p
              key={line}
              initial={{ opacity: reduced ? 1 : 0 }}
              animate={inView || reduced ? { opacity: 1 } : {}}
              transition={{ duration: 0.18, delay: reduced ? 0 : 0.42 + i * 0.16 }}
              className="font-display text-3xl leading-[1.15] text-ink-800 sm:text-4xl md:text-5xl"
              style={{
                // No fill change anywhere. A dent is two shadows and nothing
                // else, and adding darkness to the glyph is the tell that
                // separates a real letterpress treatment from a fake one.
                textShadow: `0 ${shadowY}px ${shadowBlur}px rgba(11,9,8,${shadowAlpha}), 0 -1px 0 rgba(255,255,255,${highlightAlpha})`,
              }}
            >
              {line}
            </motion.p>
          ))}
        </div>

        {/* The bite: the faint rectangle of the forme itself, pressed into the
            sheet around the type. A real letterpress sheet shows this on the
            back and, in raking light, on the front. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-6 rounded-[1px]"
          style={{
            boxShadow: `inset 0 0 0 1px rgba(11,9,8,${(depth * 0.09).toFixed(3)})`,
          }}
        />
      </div>

      {controls && (
        <div className="mt-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <label
              htmlFor="press-impression"
              className="font-accent text-[10px] uppercase tracking-luxe text-faint"
            >
              Impression
            </label>
            <span className="nums-instrument font-accent text-[10px] uppercase tracking-luxe text-accent">
              {depth < 0.3 ? 'Kiss' : depth < 0.62 ? 'Light bite' : 'Deep bite'}
            </span>
          </div>
          <input
            id="press-impression"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={depth}
            onChange={(e) => setDepth(Number(e.target.value))}
            className="range-overlay mt-3 w-full"
          />
          <p className="mt-4 max-w-2xl font-sans text-sm font-light leading-relaxed text-muted">
            {depth < 0.3
              ? 'A kiss impression — the type barely touches the sheet. This is what letterpress looked like when it was simply how printing was done, and a pressman who left more than this was told about it.'
              : depth < 0.62
                ? 'A light bite. Enough to feel with a thumb in raking light, not enough to show on the reverse. This is where we set ours.'
                : 'A deep bite. Everything the word letterpress now means to most people, and a fault by the standards of every pressman who ever did it for a living. It is also lovely, which is why nobody argues about it any more.'}
          </p>
        </div>
      )}
    </div>
  );
}
