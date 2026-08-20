'use client';

import { useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';

interface StageSweepProps {
  className?: string;
  /** Opacity of the beam at its brightest. */
  intensity?: number;
  /** Beam width as a fraction of the container width. */
  width?: number;
  /** Two beams crossing instead of one. */
  crossed?: boolean;
  /** Seconds for one full sweep when running on a timer rather than on scroll. */
  seconds?: number;
  /** Drive the sweep from scroll position rather than from a clock. */
  scrollDriven?: boolean;
}

/**
 * A theatre spotlight sweeping across the section.
 *
 * A followspot is a cone, not a rectangle, and it is hung above the stage — so
 * it pivots from a point near the top of the frame rather than sliding. That
 * pivot is the entire difference between this and a moving gradient: the beam
 * gets wider and dimmer at the floor, it keeps its apex fixed, and its edge
 * sweeps through an arc.
 *
 * Two touches sell the rest of it. The beam carries a faint hard-edged core
 * inside its soft body, because a real ellipsoidal has a shutter cut that never
 * quite blurs away. And the floor gets a pool of light that tracks the beam's
 * base, at a lower opacity and a warmer tint — light that lands somewhere.
 *
 * Either a clock or the scroll drives it. Scroll is right for a section a
 * visitor moves through; the clock is right for a hero that sits still.
 */
export default function StageSweep({
  className = '',
  intensity = 0.3,
  width = 0.22,
  crossed = false,
  seconds = 14,
  scrollDriven = false,
}: StageSweepProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Scroll runs the beam once across; the clock runs it back and forth forever.
  const angle = useTransform(scrollYProgress, [0, 1], [-26, 26]);

  if (reduced) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <Beam
        angle={scrollDriven ? angle : undefined}
        seconds={seconds}
        from={-24}
        to={24}
        width={width}
        intensity={intensity}
      />
      {crossed && (
        <Beam
          angle={scrollDriven ? angle : undefined}
          seconds={seconds * 1.37}
          from={22}
          to={-22}
          width={width * 0.8}
          intensity={intensity * 0.72}
          mirrored
        />
      )}
    </div>
  );
}

function Beam({
  angle,
  seconds,
  from,
  to,
  width,
  intensity,
  mirrored = false,
}: {
  angle?: MotionValue<number>;
  seconds: number;
  from: number;
  to: number;
  width: number;
  intensity: number;
  mirrored?: boolean;
}) {
  // The apex: just off the top edge, offset to one side so the two beams in a
  // crossed pair are hung from different positions the way real ones are.
  const apex = mirrored ? '72%' : '28%';

  const common = {
    // Pivot at the apex, so the beam swings rather than slides.
    transformOrigin: `${apex} -8%`,
    willChange: 'transform',
  } as const;

  const animate = angle
    ? undefined
    : {
        rotate: [from, to, from],
      };

  const transition = angle
    ? undefined
    : { duration: seconds, repeat: Infinity, ease: 'easeInOut' as const };

  return (
    <>
      <motion.div
        className="absolute inset-0"
        style={{ ...common, rotate: angle }}
        animate={animate}
        transition={transition}
      >
        {/* Body of the cone: a trapezoid, wider at the floor. clip-path is what
            gives it the flare — a plain gradient bar reads as a wipe. */}
        <div
          className="absolute -top-[10%] h-[120%]"
          style={{
            left: apex,
            width: `${width * 340}%`,
            marginLeft: `-${width * 170}%`,
            clipPath: `polygon(${50 - width * 8}% 0%, ${50 + width * 8}% 0%, 100% 100%, 0% 100%)`,
            background: `linear-gradient(to bottom, rgb(var(--gold-100) / ${intensity * 1.15}), rgb(var(--gold-200) / ${intensity * 0.5}) 45%, rgb(var(--gold-300) / 0) 92%)`,
            filter: 'blur(14px)',
          }}
        />

        {/* Shutter cut: the hard-edged core inside the soft body. */}
        <div
          className="absolute -top-[10%] h-[120%]"
          style={{
            left: apex,
            width: `${width * 150}%`,
            marginLeft: `-${width * 75}%`,
            clipPath: 'polygon(46% 0%, 54% 0%, 88% 100%, 12% 100%)',
            background: `linear-gradient(to bottom, rgb(var(--cream-50) / ${intensity * 0.5}), rgb(var(--gold-200) / 0) 70%)`,
            filter: 'blur(3px)',
          }}
        />

        {/* The pool it lands in. Warmer and much dimmer — light that has been
            somewhere is never the colour it started as. */}
        <div
          className="absolute bottom-0 h-[26%]"
          style={{
            left: apex,
            width: `${width * 420}%`,
            marginLeft: `-${width * 210}%`,
            background: `radial-gradient(60% 100% at 50% 100%, rgb(var(--gold-400) / ${intensity * 0.55}), transparent 72%)`,
            filter: 'blur(20px)',
          }}
        />
      </motion.div>
    </>
  );
}
