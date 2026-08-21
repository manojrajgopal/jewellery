'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';

import { onFrame } from '@/lib/frameLoop';
import { getPerfBudget } from '@/lib/perf';

interface CylinderMarqueeProps {
  items: string[];
  className?: string;
  /** Radius of the drum in px. Also sets how tall the component reads. */
  radius?: number;
  /** Degrees per second when idling. */
  speed?: number;
  /** Couple rotation to scroll position as well as to the idle spin. */
  scrollCoupled?: boolean;
  /** Reverse the direction of both the idle spin and the scroll coupling. */
  reverse?: boolean;
}

/**
 * One word on the drum's surface.
 *
 * Split into its own component for one reason: every visual property of a face —
 * how far it has turned away, and therefore its opacity, its blur and its colour
 * — is derived from the drum's angle, and deriving those through motion values
 * means the browser writes them straight to the element. The alternative, and
 * what this used to do, is hold the angle in React state and re-render the whole
 * drum on every frame. That is a full reconciliation of every face, sixty times
 * a second, to change three numbers per face.
 */
function Face({
  item,
  angle,
  radius,
  spin,
}: {
  item: string;
  angle: number;
  radius: number;
  spin: MotionValue<number>;
}) {
  /** Signed angle from the front of the drum, wrapped to −180…180, as 0–1. */
  const away = useTransform(spin, (s) => {
    let facing = (angle + s) % 360;
    if (facing > 180) facing -= 360;
    if (facing < -180) facing += 360;
    return Math.abs(facing) / 180;
  });

  const opacity = useTransform(away, (a) => Math.max(1 - a * 1.5, 0));
  const blurPx = useTransform(away, (a) => a * 3.4);
  const filter = useMotionTemplate`blur(${blurPx}px)`;
  // Back faces must not intercept the pointer, or the drum eats clicks meant
  // for whatever is drawn in front of it.
  const pointerEvents = useTransform(away, (a) => (a < 0.2 ? 'auto' : 'none'));
  // The front face is gold, the turning ones fall back to ink, so the drum has
  // one clear focal point at any moment.
  const color = useTransform(away, (a) =>
    a < 0.12 ? 'rgb(var(--accent))' : `rgb(var(--text-secondary) / ${(1 - a).toFixed(2)})`
  );

  return (
    <motion.div
      className="absolute inset-x-0 top-1/2 flex items-center justify-center"
      style={{
        transform: `translateY(-50%) rotateX(${-angle}deg) translateZ(${radius}px)`,
        opacity,
        filter,
        pointerEvents,
      }}
    >
      <motion.span
        className="whitespace-nowrap px-6 text-center font-display text-3xl font-light leading-none sm:text-4xl md:text-5xl"
        style={{ color }}
      >
        {item}
      </motion.span>
    </motion.div>
  );
}

/**
 * Words arranged around a horizontal drum, turning past the viewer.
 *
 * Each face is pushed out to the drum's surface by `rotateX(θ) translateZ(r)` —
 * the standard carousel transform, applied on the X axis so the drum turns like
 * a rolling pin rather than a lazy susan. The parent holds the perspective and
 * `preserve-3d`; the faces themselves must not, or each one flattens into its own
 * plane and the drum collapses into a stack.
 *
 * Faces are dimmed and blurred by how far they have turned away from the front,
 * computed from the running angle rather than from a CSS selector. That is the
 * part that sells the volume: a drum whose back faces are as crisp as its front
 * reads as a flat ring of text.
 */
export default function CylinderMarquee({
  items,
  className = '',
  radius = 150,
  speed = 14,
  scrollCoupled = true,
  reverse = false,
}: CylinderMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // The idle rotation. A motion value rather than state: the faces read it
  // directly, so advancing it costs a handful of style writes instead of a
  // React render of the whole drum.
  const spin = useMotionValue(0);
  const [visible, setVisible] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });
  // A third of a turn across the whole pass — enough that scrolling clearly
  // drives the drum, not so much that it spins into a blur.
  const scrollSpin = useTransform(scrollYProgress, [0, 1], [0, reverse ? -120 : 120]);
  const idleRotate = useTransform(spin, (s) => s);

  const count = items.length;
  const step = count > 0 ? 360 / count : 0;

  // Only spin while on screen. A dozen of these on a long page all turning off
  // screen is a real cost for something nobody is looking at.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      threshold: 0.01,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduced || !visible || count === 0) return;
    const dir = reverse ? -1 : 1;

    return onFrame(
      (dt) => {
        // Wrapped at 360 so the accumulated value never grows large enough to
        // lose precision over a long session.
        const advance = (dir * speed * dt) / 1000;
        spin.set((spin.get() + advance) % 360);
      },
      { fps: getPerfBudget().fps, order: 110 }
    );
  }, [reduced, visible, speed, reverse, count, spin]);

  if (count === 0) return null;

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ height: radius * 1.9 }}
      aria-label={items.join(', ')}
    >
      {/* Top and bottom fades, so faces leave the drum rather than being cut off */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-1/4 bg-fade-bottom"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-1/4 bg-fade-top"
      />

      <motion.div
        className="absolute inset-0"
        style={{
          perspective: 1400,
          transformStyle: 'preserve-3d',
          // Both sources of rotation are summed here, so scrolling nudges the
          // same drum the idle loop is already turning.
          rotateX: scrollCoupled && !reduced ? scrollSpin : 0,
        }}
      >
        <motion.div
          className="absolute inset-0"
          style={{ transformStyle: 'preserve-3d', rotateX: idleRotate }}
        >
          {items.map((item, i) => (
            <Face
              key={`${item}-${i}`}
              item={item}
              angle={i * step}
              radius={radius}
              spin={spin}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Front rule, marking the reading line */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 z-10 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-gold-500/25 to-transparent"
      />
    </div>
  );
}
