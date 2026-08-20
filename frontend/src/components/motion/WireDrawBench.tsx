'use client';

import { useRef, useState } from 'react';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';

interface WireDrawBenchProps {
  className?: string;
  /** Diameter the rod starts at, in millimetres. */
  from?: number;
  /** Diameter wanted at the end, in millimetres. */
  to?: number;
}

/**
 * A draw bench: gold rod pulled through a hole smaller than itself, over and
 * over, until it is wire.
 *
 * The neighbouring `RollingMillPass` squeezes metal between two rollers; this
 * pulls it through a plate. They look like the same operation and they are not,
 * and the difference is the reason both exist on a bench. Rolling puts the
 * metal in compression, so it spreads sideways as well as lengthways and you
 * get *strip*. Drawing puts it in tension through a converging die, so it can
 * only go forwards, and you get *round section* — which is the only way to make
 * a chain link, a claw, or a ring shank that is the same all the way round.
 *
 * Two things here are true and slightly hard to believe. The first is that a
 * die does not cut: the hole is a smooth taper and the metal is squeezed
 * through it, so nothing is removed and no gold is lost, which is why a draw
 * plate has thirty holes in it and a jeweller owns one for life. The second is
 * the count — going from a 3mm rod to 0.6mm wire is not one pull, it is around
 * fourteen, because a single pass can only reduce the *area* by about a fifth
 * before the wire snaps at the grip.
 *
 * So the readout below counts holes, not millimetres. That is the number a
 * bench actually thinks in, and it is the honest measure of how long this takes.
 */
export default function WireDrawBench({
  className = '',
  from = 3,
  to = 0.6,
}: WireDrawBenchProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'end 0.3'],
  });

  const diameter = useTransform(scrollYProgress, [0, 1], [from, to]);
  // Thickness on screen, in px, so the wire has a floor and never disappears.
  const thickness = useTransform(diameter, (d) => Math.max(1.5, (d / from) * 16));
  // The drawn length runs away to the right as the section falls. Area ratio,
  // not diameter ratio — the wire lengthens by the square.
  const drawn = useTransform(diameter, (d) => `${Math.min(64, ((from / d) ** 2 - 1) * 9)}%`);
  const grip = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);

  const [mm, setMm] = useState(from);
  const [holes, setHoles] = useState(0);

  useMotionValueEvent(diameter, 'change', (d) => {
    setMm(Math.round(d * 1000) / 1000);
    // Each pull takes about 20% of the cross-sectional area, so the count is a
    // log in area rather than in diameter. This is why the number climbs so
    // much faster than the picture suggests it should.
    const areaRatio = (d / from) ** 2;
    setHoles(Math.max(0, Math.round(Math.log(areaRatio) / Math.log(0.8))));
  });

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div className="relative overflow-hidden rounded-2xl border border-hairline bg-canvas-alt px-6 py-12">
        <div className="relative flex items-center">
          {/* The coil the rod comes off. */}
          <div
            aria-hidden="true"
            className="relative h-20 w-20 flex-none rounded-full border-4 border-gold-700/60 bg-[radial-gradient(circle_at_38%_34%,rgb(var(--gold-300)/0.5),rgb(var(--gold-800)/0.9)_66%)]"
          >
            <span className="absolute inset-4 rounded-full border border-gold-500/40" />
          </div>

          {/* Rod, before the die. Full section. */}
          <motion.div
            aria-hidden="true"
            style={{ height: 16 }}
            className="flex-1 rounded-[1px] bg-[linear-gradient(180deg,rgb(var(--gold-200)),rgb(var(--gold-500))_48%,rgb(var(--gold-800)))]"
          />

          {/* The draw plate. The taper is drawn as a wedge because that is
              literally the shape of the hole — a die that was a straight
              cylinder would seize on the first pull. */}
          <div className="draw-die relative z-10 flex h-24 w-14 flex-none items-center justify-center rounded-sm">
            <span
              aria-hidden="true"
              className="block h-0 w-0 border-y-[18px] border-r-[14px] border-y-transparent border-r-canvas-alt"
            />
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-accent text-[9px] uppercase tracking-luxe text-faint">
              Die
            </span>
          </div>

          {/* Wire, after the die. Thinner, and getting away from us. */}
          <motion.div
            aria-hidden="true"
            style={reduced ? { height: 4 } : { height: thickness }}
            className="flex-1 rounded-[1px] bg-[linear-gradient(180deg,rgb(var(--gold-100)),rgb(var(--gold-400))_48%,rgb(var(--gold-700)))]"
          />

          {/* The draw tongs. They travel, which is the only moving part of a
              draw bench that a person actually operates. */}
          <motion.div
            aria-hidden="true"
            style={reduced ? undefined : { x: grip }}
            className="relative z-10 h-10 w-10 flex-none rounded-sm bg-[linear-gradient(180deg,rgb(var(--ink-300)),rgb(var(--ink-700)))] shadow-lift"
          >
            <span className="absolute left-0 top-1/2 h-1 w-3 -translate-x-full -translate-y-1/2 bg-ink-500" />
          </motion.div>
        </div>

        {/* How far past the die it has run. A bar rather than a number, because
            the length is the one figure here nobody has intuition for. */}
        <div className="mt-10 border-t border-line-subtle pt-6">
          <div className="flex items-center justify-between font-accent text-[9px] uppercase tracking-luxe text-faint">
            <span>Length off one rod</span>
            <span className="nums-instrument text-accent">
              &times;{((from / Math.max(0.01, mm)) ** 2).toFixed(1)}
            </span>
          </div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface-sunken">
            <motion.div
              style={reduced ? { width: '64%' } : { width: drawn }}
              className="h-full rounded-full bg-gradient-to-r from-gold-700 via-gold-400 to-gold-200"
            />
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="spec-plate px-3 py-2">
            <p className="font-accent text-[9px] uppercase tracking-luxe text-faint">
              Section now
            </p>
            <p className="nums-instrument font-display text-2xl text-primary">
              {mm.toFixed(2)}
              <span className="ml-1 font-accent text-xs text-muted">mm</span>
            </p>
          </div>
          <div className="spec-plate px-3 py-2">
            <p className="font-accent text-[9px] uppercase tracking-luxe text-faint">
              Holes pulled through
            </p>
            <p className="nums-instrument font-display text-2xl text-primary">{holes}</p>
          </div>
          <div className="spec-plate px-3 py-2">
            <p className="font-accent text-[9px] uppercase tracking-luxe text-faint">
              Gold lost
            </p>
            <p className="nums-instrument font-display text-2xl text-primary">
              0.00<span className="ml-1 font-accent text-xs text-muted">g</span>
            </p>
          </div>
        </div>

        <p className="mt-5 max-w-xl font-sans text-sm font-light leading-relaxed text-muted">
          Nothing is cut away. A die squeezes rather than shaves, so every gram
          that goes into the first hole comes out of the last one — which is the
          reason a draw plate is the one tool on a bench that is bought once and
          buried with you.
        </p>
      </div>
    </div>
  );
}
