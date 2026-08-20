'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useVelocity } from 'framer-motion';

import { useOnScreen } from '@/hooks/useOnScreen';

interface GravityChainRailProps {
  className?: string;
  /** Links along the span. More is smoother and heavier to animate. */
  links?: number;
  /** How deep the chain hangs at rest, as a fraction of its own width. */
  sag?: number;
  /** Charms hung at fractions along the span. */
  charms?: { at: number; label: string }[];
  /** Height of the box the chain hangs in, in px. */
  height?: number;
}

/**
 * A chain hung between two posts, which swings when the page moves.
 *
 * The resting curve is a real catenary — `cosh`, not a parabola. The difference
 * is small and it is the whole reason this looks like a chain: a parabola is
 * fractionally too full at the shoulders, and a hanging chain has a visibly
 * tighter shoulder and a flatter belly than one. Nobody can name the difference
 * and everybody can see it.
 *
 * Scroll velocity is fed in as a horizontal acceleration and the chain responds
 * as a damped pendulum: one state variable for the swing angle and one for its
 * rate, integrated on every frame. That is the second thing that makes it read
 * as a physical object — the chain keeps moving after the scroll stops, and it
 * overshoots before it settles, neither of which a scroll-linked transform can
 * do because a transform has no memory.
 *
 * Links are drawn as a run of small ellipses rather than as a stroked path, so
 * the chain has *links* — a stroke would be a cable, and the difference is
 * exactly the sort of thing a jeweller's site should not get wrong.
 */
export default function GravityChainRail({
  className = '',
  links = 42,
  sag = 0.22,
  charms = [],
  height = 220,
}: GravityChainRailProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);

  // The pendulum's state. Held in refs, because these are integrated every
  // frame and React state would re-render sixty times a second for nothing.
  const swing = useRef(0);
  const rate = useRef(0);
  const [angle, setAngle] = useState(0);
  // This is the most expensive of the three permanent loops on the site — a
  // damped integrator plus a React publish — so it is the one that most needs
  // to stop when the chain is not on screen. It resumes from wherever it was,
  // which is correct: a chain left swinging is still swinging when you look back.
  const onScreen = useOnScreen(ref, '150px');

  useEffect(() => {
    if (reduced || !onScreen) return;
    let raf = 0;
    let last = 0;

    const step = (now: number) => {
      const dt = Math.min(0.04, last ? (now - last) / 1000 : 0.016);
      last = now;

      // Scroll velocity in px/s → a lateral impulse. The divisor is the chain's
      // mass, in the only sense that matters here: how much of the page's
      // movement it actually takes up.
      const impulse = (velocity.get() / 14000) * dt * 60;

      // Damped harmonic motion: a restoring force toward zero, a drag term, and
      // the impulse. Explicit Euler is fine at 60fps for a spring this soft.
      const restore = -swing.current * 9.2;
      const drag = -rate.current * 2.4;
      rate.current += (restore + drag) * dt + impulse;
      swing.current += rate.current * dt;

      // Clamp so a violent flick cannot fold the chain over the posts.
      swing.current = Math.max(-0.34, Math.min(0.34, swing.current));

      // Only publish to React when the change is visible. Below a thousandth of
      // a radian nothing moves on screen and the render is wasted.
      setAngle((prev) => (Math.abs(prev - swing.current) > 0.001 ? swing.current : prev));

      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [reduced, onScreen, velocity]);

  // Geometry on a 1000-wide box. The catenary is scaled so its lowest point
  // reaches `sag` of the span.
  const span = 1000;
  const a = 340; // catenary parameter — larger is a flatter, tauter chain
  const raw = (x: number) => a * Math.cosh((x - span / 2) / a) - a;
  const depth = raw(0) || 1;
  const scale = (sag * span) / depth;

  const points = Array.from({ length: links }, (_, i) => {
    const t = i / (links - 1);
    const x = t * span;
    const y = raw(x) * scale;
    // The swing tilts the whole chain about its centre and shears it with
    // distance from the posts — a chain does not swing as a rigid bar, so the
    // middle travels furthest.
    const travel = Math.sin(t * Math.PI) * angle * 260;
    return { t, x: x + travel, y };
  });

  const linkPath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ');

  return (
    <div ref={ref} className={`relative w-full ${className}`} style={{ height }}>
      <svg
        viewBox={`-20 -20 ${span + 40} ${sag * span + 120}`}
        className="h-full w-full overflow-visible"
        aria-hidden="true"
      >
        {/* The shadow the chain throws on the wall behind it — offset down and
            softened, and it swings with the chain rather than against it. */}
        <path
          d={linkPath}
          fill="none"
          stroke="rgb(var(--shadow-color))"
          strokeOpacity={0.18}
          strokeWidth={7}
          strokeLinecap="round"
          transform="translate(10 16)"
          style={{ filter: 'blur(3px)' }}
        />

        {/* The links. An ellipse each, alternately upright and flat, which is how
            a cable chain actually sits — every other link turned ninety degrees. */}
        {points.map((p, i) => (
          <ellipse
            key={i}
            cx={p.x}
            cy={p.y}
            rx={i % 2 ? 9 : 5.5}
            ry={i % 2 ? 5.5 : 9}
            fill="none"
            stroke="rgb(var(--gold-400))"
            strokeOpacity={0.72}
            strokeWidth={2.6}
          />
        ))}

        {/* The two posts. */}
        {[0, span].map((x) => (
          <g key={x}>
            <circle cx={x} cy={0} r={7} fill="rgb(var(--gold-600))" />
            <circle cx={x} cy={0} r={3} fill="rgb(var(--gold-100))" fillOpacity={0.7} />
          </g>
        ))}

        {/* Charms hang from wherever they are pinned, and they hang *down* — the
            chain swings but a charm on it stays vertical, which is the detail
            that makes the swing legible. */}
        {charms.map((charm) => {
          const near = points.reduce((best, p) =>
            Math.abs(p.t - charm.at) < Math.abs(best.t - charm.at) ? p : best
          );
          return (
            <g key={charm.label} transform={`translate(${near.x} ${near.y})`}>
              <line x1={0} y1={0} x2={0} y2={26} stroke="rgb(var(--gold-500))" strokeWidth={1.6} />
              <path
                d="M 0 26 L 13 44 L 0 62 L -13 44 Z"
                fill="rgb(var(--gold-300))"
                fillOpacity={0.32}
                stroke="rgb(var(--gold-300))"
                strokeWidth={1.4}
              />
              <text
                x={0}
                y={82}
                textAnchor="middle"
                className="font-accent"
                fontSize={19}
                letterSpacing={3}
                fill="rgb(var(--accent))"
                fillOpacity={0.85}
              >
                {charm.label.toUpperCase()}
              </text>
            </g>
          );
        })}
      </svg>

      {/* A quiet note that the chain is doing something, for anybody who has not
          scrolled yet. Fades out once it has been moved. */}
      {!reduced && (
        <motion.span
          initial={{ opacity: 0.6 }}
          animate={{ opacity: Math.abs(angle) > 0.02 ? 0 : 0.6 }}
          transition={{ duration: 0.6 }}
          className="pointer-events-none absolute bottom-0 right-0 font-accent text-[9px] uppercase tracking-luxe text-faint"
        >
          Scroll — it swings
        </motion.span>
      )}
    </div>
  );
}
