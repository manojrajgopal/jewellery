'use client';

import { useId, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';

interface GoldRibbonWeaveProps {
  className?: string;
  /** How many ribbons are woven through each other. Three reads as braid. */
  ribbons?: number;
  /** Height of the band in px. The width is fluid. */
  height?: number;
  /** Draw the ribbons as scroll advances rather than on entry. */
  scrollDriven?: boolean;
}

/**
 * A braid of gold ribbon that draws itself across the page.
 *
 * Each ribbon is one cubic path with the same wavelength but a different phase,
 * so they cross rather than run parallel. The crossings are the whole point: a
 * band of parallel sine waves reads as a graph, and the over-under is what makes
 * it read as woven metal. It is drawn in two passes for that reason — the
 * even-indexed ribbons after the odd ones, so the later pass wins every crossing
 * and the braid has a consistent front. Each ribbon also carries a darker stroke
 * two pixels below itself, which is what gives a flat line a rolled edge.
 *
 * `pathLength` is normalised to 1 so the stroke draws proportionally regardless of
 * how long the geometry actually is; without that, a longer ribbon appears to
 * draw more slowly than a short one at the same duration.
 *
 * Used as a section rule where a plain gold divider is not enough — a chapter
 * break, or the join between two halves of a page.
 */
export default function GoldRibbonWeave({
  className = '',
  ribbons = 3,
  height = 120,
  scrollDriven = true,
}: GoldRibbonWeaveProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.95', 'center 0.55'],
  });
  const p = useSpring(scrollYProgress, { stiffness: 70, damping: 22 });
  const draw = useTransform(p, [0, 1], [0, 1]);

  const w = 1200;
  const h = height;
  const mid = h / 2;

  /** One ribbon: four half-waves across the full width, phase-shifted by index. */
  const pathFor = (i: number) => {
    const amp = h * 0.3 * (1 - i * 0.16);
    const phase = (i / ribbons) * Math.PI;
    const seg = w / 4;
    const yAt = (n: number) => mid + Math.sin(phase + n * Math.PI * 0.5) * amp;
    let d = `M 0 ${yAt(0).toFixed(1)}`;
    for (let n = 0; n < 4; n++) {
      const x0 = n * seg;
      const x1 = (n + 1) * seg;
      d += ` C ${(x0 + seg * 0.35).toFixed(1)} ${yAt(n).toFixed(1)}, ${(x1 - seg * 0.35).toFixed(1)} ${yAt(n + 1).toFixed(1)}, ${x1.toFixed(1)} ${yAt(n + 1).toFixed(1)}`;
    }
    return d;
  };

  const strand = (i: number) => {
    const id = `${uid}-r${i}`;
    const common = {
      d: pathFor(i),
      fill: 'none' as const,
      strokeLinecap: 'round' as const,
      // Wider ribbons behind narrower ones, so the braid has an obvious front.
      strokeWidth: 10 - i * 2.2,
      pathLength: 1,
    };

    /**
     * Two drive modes, and they must not both be wired up on one path. Scroll-driven
     * takes a MotionValue through `style`; entry-driven animates from a plain
     * `initial`. Setting both leaves framer arbitrating between a value that follows
     * the scrollbar and a keyframe that does not, which reads as a stutter at the
     * top of the section.
     */
    const drive =
      reduced || !scrollDriven
        ? {
            initial: reduced ? undefined : { pathLength: 0 },
            animate: reduced ? undefined : { pathLength: 1 },
          }
        : { style: { pathLength: draw } };
    return (
      <g key={id}>
        {/* The dark under-edge, drawn first and offset by a pixel. It is what
            gives a flat stroke the impression of a rolled edge. */}
        <motion.path
          {...common}
          {...drive}
          stroke="rgb(var(--gold-800) / 0.55)"
          transform="translate(0, 2.5)"
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 }}
        />
        <motion.path
          {...common}
          {...drive}
          stroke={`url(#grad-${uid})`}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 }}
        />
      </g>
    );
  };

  const odd = Array.from({ length: ribbons }, (_, i) => i).filter((i) => i % 2 === 0);
  const even = Array.from({ length: ribbons }, (_, i) => i).filter((i) => i % 2 === 1);

  return (
    <div ref={ref} className={`relative w-full ${className}`} aria-hidden="true">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }} preserveAspectRatio="none">
        <defs>
          <linearGradient id={`grad-${uid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgb(var(--gold-700))" />
            <stop offset="22%" stopColor="rgb(var(--gold-300))" />
            <stop offset="50%" stopColor="rgb(var(--gold-100))" />
            <stop offset="78%" stopColor="rgb(var(--gold-400))" />
            <stop offset="100%" stopColor="rgb(var(--gold-700))" />
          </linearGradient>
        </defs>

        {/* Pass one: the ribbons that pass behind. */}
        {odd.map(strand)}
        {/* Pass two: the ribbons that pass in front. Drawn after, so they win the
            crossings — which is the over-under the braid is made of. */}
        {even.map(strand)}
      </svg>

      {/* A travelling glint along the band, independent of the draw. Keeps the
          rule alive after it has finished drawing without redrawing anything. */}
      {!reduced && (
        <motion.span
          initial={{ x: '-30%', opacity: 0 }}
          whileInView={{ x: '130%', opacity: [0, 0.6, 0] }}
          viewport={{ once: false, margin: '10% 0px 10% 0px' }}
          transition={{ duration: 3.4, repeat: Infinity, repeatDelay: 2.2, ease: 'linear' }}
          className="pointer-events-none absolute inset-y-0 w-1/5 bg-gradient-to-r from-transparent via-white/25 to-transparent blend-screen"
        />
      )}
    </div>
  );
}
