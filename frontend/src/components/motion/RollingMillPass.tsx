'use client';

import { useRef, useState } from 'react';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';

interface RollingMillPassProps {
  className?: string;
  /** Starting thickness of the ingot, in millimetres. */
  from?: number;
  /** Thickness wanted at the end, in millimetres. */
  to?: number;
  /** How tall the bench is, in px. */
  height?: number;
}

/**
 * An ingot going through a rolling mill, and the arithmetic that makes it
 * uncomfortable.
 *
 * Metal is conserved. That single fact is what nobody expects when they watch
 * this happen for the first time: squeeze a 6mm bar down to 1.2mm and it does
 * not simply get thinner, it gets *five times longer*, because the volume has
 * nowhere else to go. A 40mm ingot leaves the mill as a 200mm strip, and it
 * leaves faster than it went in, which is why a rolling mill is the one machine
 * on a bench that everybody is taught to respect before they are taught to use.
 *
 * The scene is driven by scroll rather than by a timer, so the visitor is the
 * one turning the handle. Three things are read off the same progress value and
 * therefore cannot contradict each other:
 *
 *   - the gap between the rollers, which is what is actually being set
 *   - the section of the strip, which follows the gap
 *   - the length, which follows from conservation and nothing else
 *
 * The pass counter matters too. A mill is not closed from 6mm to 1.2mm in one
 * movement — the metal would split. It is closed in reductions of about a
 * quarter, and between every third pass the piece has to be annealed because it
 * has work-hardened to the point of cracking. The counter says which pass is
 * being watched, and it says when the strip has to go back to the torch, which
 * is the bit of the process that never appears in a film about jewellery
 * because it is somebody standing still for four minutes.
 */
export default function RollingMillPass({
  className = '',
  from = 6,
  to = 1.2,
  height = 300,
}: RollingMillPassProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'end 0.25'],
  });

  // Thickness, as a fraction of where it started.
  const ratio = useTransform(scrollYProgress, [0, 1], [1, to / from]);
  // Length is the reciprocal, because volume is conserved. This is the whole
  // component in one line.
  const stretch = useTransform(ratio, (r) => 1 / r);
  const gap = useTransform(ratio, (r) => `${r * 26}px`);
  const rollerTurn = useTransform(scrollYProgress, [0, 1], [0, 900]);
  // The lower roller turns the other way. Hoisted rather than written inline,
  // because a hook behind a ternary is a hook that sometimes does not run.
  const rollerTurnReverse = useTransform(rollerTurn, (v) => -v);

  const [pass, setPass] = useState(1);
  const [mm, setMm] = useState(from);

  useMotionValueEvent(ratio, 'change', (r) => {
    const thickness = from * r;
    setMm(Math.round(thickness * 100) / 100);
    // Reductions of roughly a quarter per pass, which is what a mill is
    // actually closed by between stops.
    const passes = Math.max(1, Math.ceil(Math.log(r) / Math.log(0.75)) || 1);
    setPass(Math.min(9, passes));
  });

  // Every third pass the metal has to be softened again before it will take
  // another. Stated rather than implied, because it is the part of the process
  // that costs the time.
  const needsAnneal = pass > 1 && pass % 3 === 0;

  return (
    <div ref={ref} className={`relative ${className}`} style={{ minHeight: height }}>
      <div className="relative flex h-full items-center justify-center overflow-hidden rounded-2xl border border-hairline bg-canvas-alt px-6 py-10">
        {/* The mill frame — two housings and the rollers between them. */}
        <div className="relative flex w-full max-w-2xl items-center justify-center">
          {/* Top roller */}
          <motion.div
            aria-hidden="true"
            style={reduced ? undefined : { rotate: rollerTurn }}
            className="absolute left-1/2 top-0 h-16 w-16 -translate-x-1/2 rounded-full border border-hairline"
          >
            <div className="mill-roller h-full w-full rounded-full" />
            {/* One scored line, so the rotation has something to be read from.
                A featureless cylinder turning is a cylinder standing still. */}
            <span className="absolute left-1/2 top-1 h-3 w-px -translate-x-1/2 bg-gold-200/70" />
          </motion.div>

          {/* The strip. Anchored left so it grows to the right — a mill feeds
              one way, and a strip that grew from its centre would be wrong in a
              way anybody who has used one would notice immediately. */}
          <motion.div
            style={
              reduced
                ? { scaleY: to / from, scaleX: from / to }
                : { scaleY: ratio, scaleX: stretch }
            }
            className="relative z-10 h-6 w-40 origin-left rounded-[2px] bg-[linear-gradient(180deg,rgb(var(--gold-300)),rgb(var(--gold-500))_46%,rgb(var(--gold-700)))] shadow-gold"
          >
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px bg-gold-100/60"
            />
          </motion.div>

          {/* Bottom roller */}
          <motion.div
            aria-hidden="true"
            style={reduced ? undefined : { rotate: rollerTurnReverse }}
            className="absolute bottom-0 left-1/2 h-16 w-16 -translate-x-1/2 rounded-full border border-hairline"
          >
            <div className="mill-roller h-full w-full rounded-full" />
            <span className="absolute bottom-1 left-1/2 h-3 w-px -translate-x-1/2 bg-gold-200/70" />
          </motion.div>

          {/* The gap being set, drawn as a dimension between the rollers. */}
          <motion.div
            aria-hidden="true"
            style={reduced ? undefined : { height: gap }}
            className="absolute left-[8%] top-1/2 w-px -translate-y-1/2 bg-accent/50"
          />
        </div>

        {/* The readout. Everything here is derived from one scroll value, so the
            numbers cannot drift out of agreement with the picture. */}
        <div className="pointer-events-none absolute inset-x-6 bottom-5 flex flex-wrap items-end justify-between gap-4">
          <div className="spec-plate px-3 py-2">
            <p className="font-accent text-[9px] uppercase tracking-luxe text-faint">Section</p>
            <p className="nums-instrument font-display text-2xl text-primary">
              {mm.toFixed(2)}
              <span className="ml-1 font-accent text-xs text-muted">mm</span>
            </p>
          </div>

          <div className="spec-plate px-3 py-2 text-right">
            <p className="font-accent text-[9px] uppercase tracking-luxe text-faint">Length</p>
            <p className="nums-instrument font-display text-2xl text-primary">
              &times;{(from / Math.max(0.01, mm)).toFixed(1)}
            </p>
          </div>

          <div className="spec-plate w-full px-3 py-2 sm:w-auto">
            <p className="font-accent text-[9px] uppercase tracking-luxe text-faint">Pass</p>
            <p className="nums-instrument font-display text-2xl text-primary">{pass}</p>
          </div>
        </div>

        {/* The stop nobody films. */}
        <motion.p
          animate={{ opacity: needsAnneal ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className="pointer-events-none absolute right-6 top-5 max-w-[15rem] text-right font-accent text-[10px] uppercase leading-relaxed tracking-luxe text-accent"
        >
          Work-hardened — back to the torch before the next pass
        </motion.p>
      </div>
    </div>
  );
}
