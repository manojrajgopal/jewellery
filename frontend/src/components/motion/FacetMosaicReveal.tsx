'use client';

import { useMemo, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

import { easeCine, staggerWave2D } from '@/lib/motion';

type Order = 'radial' | 'diagonal' | 'random';

interface FacetMosaicRevealProps {
  src: string;
  alt: string;
  className?: string;
  /** Cells across. Cells down is derived from the aspect ratio. */
  columns?: number;
  /** Which way the reveal travels across the plate. */
  order?: Order;
  /** Aspect ratio of the frame, width / height. */
  ratio?: number;
  /** Caption under the plate. */
  caption?: string;
}

/**
 * Deterministic pseudo-random from two indices, so the server and the client
 * agree on the scatter. `Math.random` here would produce a different delay on
 * each render and a visible re-shuffle on hydration.
 */
const jitter = (a: number, b: number) => {
  const n = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453;
  return n - Math.floor(n);
};

/**
 * A photograph assembled out of triangular facets.
 *
 * Distinct from the two neighbours it sits near in this folder. `MosaicShuffle`
 * uses square tiles that flip; `ShatterImage` breaks a plate apart and lets the
 * pieces leave. This one *builds* — and it builds out of triangles, which is the
 * whole reason it exists, because a triangle is the unit a brilliant cut is
 * actually divided into and a square is not.
 *
 * Each cell is the same image with its `background-position` and `background-size`
 * set so that its own quarter of the frame lands under it — one network request
 * for the lot, and the positions are percentages so the plate is fully
 * responsive. Each cell is then clipped to one of two triangles, upper-left or
 * lower-right, alternating like the diagonals of a quad mesh.
 *
 * The interesting parameter is `order`. A radial order reads as light spreading
 * out from the table of a stone; a diagonal one reads as a raking light crossing
 * the plate; random reads as an image resolving out of noise. They are three
 * different sentences told with identical geometry.
 */
export default function FacetMosaicReveal({
  src,
  alt,
  className = '',
  columns = 8,
  order = 'radial',
  ratio = 4 / 5,
  caption,
}: FacetMosaicRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-12% 0px -12% 0px' });
  const reduced = useReducedMotion();

  const rows = Math.max(2, Math.round(columns / ratio / 1.6));

  const cells = useMemo(() => {
    const out: {
      key: string;
      col: number;
      row: number;
      half: 0 | 1;
      delay: number;
    }[] = [];

    const centre = (columns - 1) / 2;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        for (const half of [0, 1] as const) {
          // Distance from the plate's centre, in cells. A true 2D distance,
          // rather than the 1D index distance the shared helpers give.
          const dx = col - centre;
          const dy = row - (rows - 1) / 2;
          const dist = Math.hypot(dx, dy);

          const delay =
            order === 'radial'
              ? dist * 0.05 + half * 0.02
              : order === 'diagonal'
                ? staggerWave2D(col, row, 34, 0.05) + half * 0.03
                : jitter(col + half * 31, row) * 0.7;

          out.push({ key: `${col}-${row}-${half}`, col, row, half, delay });
        }
      }
    }

    return out;
  }, [columns, rows, order]);

  return (
    <figure className={`relative ${className}`}>
      <div
        ref={ref}
        className="relative overflow-hidden rounded-2xl border border-hairline bg-surface-sunken"
        style={{ aspectRatio: `${ratio}` }}
      >
        {/* A dim copy underneath. Without it the plate is empty until the first
            facets land, and an empty rectangle for 200ms reads as a broken
            image rather than as a reveal. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center opacity-[0.12] blur-sm"
          style={{ backgroundImage: `url(${src})` }}
        />

        {cells.map((cell) => (
          <motion.span
            key={cell.key}
            aria-hidden="true"
            initial={reduced ? undefined : { opacity: 0, scale: 0.72, filter: 'brightness(2.2)' }}
            animate={
              reduced || inView
                ? { opacity: 1, scale: 1, filter: 'brightness(1)' }
                : undefined
            }
            transition={{ duration: 0.62, delay: reduced ? 0 : cell.delay, ease: easeCine.glass }}
            className="absolute block bg-cover"
            style={{
              // Cell geometry, as percentages of the plate.
              left: `${(cell.col / columns) * 100}%`,
              top: `${(cell.row / rows) * 100}%`,
              width: `${100 / columns}%`,
              height: `${100 / rows}%`,
              // The image, scaled to the plate and offset to this cell.
              backgroundImage: `url(${src})`,
              backgroundSize: `${columns * 100}% ${rows * 100}%`,
              backgroundPosition: `${(cell.col / Math.max(1, columns - 1)) * 100}% ${
                (cell.row / Math.max(1, rows - 1)) * 100
              }%`,
              // Two triangles per cell, meeting on the cell's diagonal.
              clipPath:
                cell.half === 0
                  ? 'polygon(0 0, 100% 0, 0 100%)'
                  : 'polygon(100% 0, 100% 100%, 0 100%)',
              transformOrigin: cell.half === 0 ? '0% 0%' : '100% 100%',
            }}
          />
        ))}

        {/* The plate's own furniture: a vitrine gradient and a hairline, so the
            assembled image sits in a frame rather than floating. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-vitrine"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-[rgb(var(--hairline)/0.14)]"
        />

        {/* The accessible copy. Everything above is decoration by construction,
            so the real image is here, visually hidden but present for assistive
            technology and for a failed CSS load. */}
        <span className="sr-only">{alt}</span>
      </div>

      {caption && (
        <figcaption className="mt-3 font-accent text-[10px] uppercase tracking-luxe text-faint">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
