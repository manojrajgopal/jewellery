'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

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

  // The idle rotation, advanced by rAF. Held in state because the per-face
  // opacity has to be recomputed from it, which React has to see.
  const [spin, setSpin] = useState(0);
  const [visible, setVisible] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });
  // A third of a turn across the whole pass — enough that scrolling clearly
  // drives the drum, not so much that it spins into a blur.
  const scrollSpin = useTransform(scrollYProgress, [0, 1], [0, reverse ? -120 : 120]);

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
    let raf = 0;
    let last = performance.now();
    const dir = reverse ? -1 : 1;

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      // Wrapped at 360 so the accumulated value never grows large enough to lose
      // precision over a long session.
      setSpin((s) => (s + dir * speed * dt) % 360);
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [reduced, visible, speed, reverse, count]);

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
        <div
          className="absolute inset-0"
          style={{ transformStyle: 'preserve-3d', transform: `rotateX(${spin}deg)` }}
        >
          {items.map((item, i) => {
            const angle = i * step;
            // Signed angle from the front of the drum, wrapped to −180…180.
            let facing = (angle + spin) % 360;
            if (facing > 180) facing -= 360;
            if (facing < -180) facing += 360;
            const away = Math.abs(facing) / 180;

            return (
              <div
                key={`${item}-${i}`}
                aria-hidden={away > 0.35}
                className="absolute inset-x-0 top-1/2 flex items-center justify-center"
                style={{
                  transform: `translateY(-50%) rotateX(${-angle}deg) translateZ(${radius}px)`,
                  opacity: Math.max(1 - away * 1.5, 0),
                  filter: `blur(${(away * 3.4).toFixed(2)}px)`,
                  // Back faces must not intercept the pointer, or the drum eats
                  // clicks meant for whatever is drawn in front of it.
                  pointerEvents: away < 0.2 ? 'auto' : 'none',
                }}
              >
                <span
                  className="whitespace-nowrap px-6 text-center font-display text-3xl font-light leading-none sm:text-4xl md:text-5xl"
                  style={{
                    // The front face is gold, the turning ones fall back to ink,
                    // so the drum has one clear focal point at any moment.
                    color:
                      away < 0.12
                        ? 'rgb(var(--accent))'
                        : `rgb(var(--text-secondary) / ${(1 - away).toFixed(2)})`,
                  }}
                >
                  {item}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Front rule, marking the reading line */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 z-10 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-gold-500/25 to-transparent"
      />
    </div>
  );
}
