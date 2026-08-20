'use client';

import { useRef, useState } from 'react';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';

interface AnnealGlowTextProps {
  text: string;
  /** Rendered element. */
  as?: 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  /** Show the temperature readout under the type. */
  readout?: boolean;
}

/**
 * Type brought up to annealing heat and then quenched, as the section scrolls.
 *
 * The site already has several gold treatments and every one of them is a
 * *finish*: leaf laid on (`GoldLeafGild`), a specular band moved across a
 * struck face (`MetalText`), molten metal poured into a mould (`MoltenPour`).
 * This is the one process that is not a finish at all. Annealing does not
 * change what the metal looks like when it has cooled — it changes what the
 * metal *is*, by letting a strained grain structure recrystallise so the piece
 * can be worked again without cracking.
 *
 * Which makes it the only heat on the site that leaves no mark, and the reason
 * it is worth drawing: it is the invisible half of the work.
 *
 * The colour ramp is the real one. A bench does not use a pyrometer for this;
 * a smith reads the *colour* of the surface oxide and decides the temperature
 * from it — straw at about 220°C, brown, then purple, then the dull cherry red
 * at around 650°C that says a gold alloy has soaked long enough. It is one of
 * the last places in any trade where a colour is a measurement, and the whole
 * component is built around showing that: the readout under the type is driven
 * by the same scroll progress as the gradient, so the number and the colour can
 * never disagree.
 *
 * The quench at the end is deliberately abrupt. Everything else on this site
 * eases out; water does not.
 */

/** Oxide colour → temperature, as a bench reads it. */
const HEAT_STOPS: { at: number; label: string; celsius: number }[] = [
  { at: 0.0, label: 'Cold', celsius: 20 },
  { at: 0.22, label: 'Straw', celsius: 220 },
  { at: 0.42, label: 'Brown', celsius: 265 },
  { at: 0.58, label: 'Purple', celsius: 290 },
  { at: 0.74, label: 'Blue', celsius: 320 },
  { at: 0.9, label: 'Dull cherry', celsius: 650 },
];

export default function AnnealGlowText({
  text,
  as = 'h2',
  className = '',
  readout = true,
}: AnnealGlowTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Measured across the element's own pass through the viewport rather than the
  // section's, so a heading low in a tall section still completes its ramp.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'end 0.35'],
  });

  // The gradient runs forward to the cherry and then, in the last fifth, snaps
  // back to the cold end — which is the quench. Nothing eases it; the times
  // array does the work, and the last two entries are adjacent on purpose.
  const position = useTransform(
    scrollYProgress,
    [0, 0.78, 0.82, 1],
    ['0%', '86%', '4%', '0%']
  );

  const glow = useTransform(
    scrollYProgress,
    [0, 0.4, 0.78, 0.82, 1],
    [0, 0.35, 0.75, 0.06, 0]
  );

  // Published to React rather than kept as a motion value, because the readout
  // is six discrete labels rather than a continuous number — and a subscription
  // per label would be six hooks inside a loop, which React does not allow and
  // which would re-render the whole row on every frame anyway.
  const [heatIndex, setHeatIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    // Past the quench everything is cold again, which is the first stop.
    const next =
      p > 0.8
        ? 0
        : HEAT_STOPS.reduce((best, stop, i) => (p >= stop.at ? i : best), 0);
    setHeatIndex((prev) => (prev === next ? prev : next));
  });

  const Tag = as;

  // Reduced motion gets the finished object rather than the process: the metal
  // is cold, which is what it is for all but ninety seconds of its life.
  if (reduced) {
    return (
      <div ref={ref} className={className}>
        <Tag className="gold-gradient-text">{text}</Tag>
        {readout && (
          <p className="mt-3 font-accent text-[10px] uppercase tracking-luxe text-faint">
            Annealed at 650°C, then quenched
          </p>
        )}
      </div>
    );
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* The heat bloom behind the glyphs. Sits under the type rather than over
          it, because a hot object lights the air around itself and does not
          wash out its own edges. */}
      <motion.span
        aria-hidden="true"
        style={{ opacity: glow }}
        className="pointer-events-none absolute -inset-x-6 -inset-y-4 -z-10 rounded-full bg-[radial-gradient(60%_60%_at_50%_50%,rgb(var(--burgundy-500)/0.5),rgb(var(--gold-500)/0.22)_46%,transparent_74%)] blur-2xl"
      />

      <motion.span
        style={{ backgroundPosition: position }}
        className="anneal-skin block"
      >
        <Tag className="inline">{text}</Tag>
      </motion.span>

      {readout && (
        <div className="mt-4 flex items-baseline gap-3 border-t border-line-subtle pt-3">
          <span className="font-accent text-[10px] uppercase tracking-luxe text-faint">
            Surface oxide
          </span>
          {HEAT_STOPS.map((stop, i) => (
            <motion.span
              key={stop.label}
              animate={{ opacity: heatIndex === i ? 1 : 0.22 }}
              transition={{ duration: 0.25 }}
              className="nums-instrument font-accent text-[10px] uppercase tracking-luxe text-accent"
            >
              {stop.label}
              <span className="ml-1 text-faint">{stop.celsius}°</span>
            </motion.span>
          ))}
        </div>
      )}
    </div>
  );
}
