'use client';

import { useMemo, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

import { ease, gridDelay, tileFlip } from '@/lib/motion';

interface MosaicShuffleProps {
  /** The image the tiles resolve into. */
  src: string;
  alt: string;
  /** Tiles across. Rows are derived from the aspect ratio so tiles stay square. */
  columns?: number;
  className?: string;
  /** Ratio of the frame, width / height. */
  ratio?: number;
  /** Which corner the assembly starts from. */
  from?: 'top-left' | 'centre' | 'bottom-right';
  /** Let a hover on one tile lift it out of the picture. */
  interactive?: boolean;
}

/**
 * One photograph assembled out of tiles, each turning over as it lands.
 *
 * Every tile is the *same* image with its background-position offset to its own
 * cell, which is why this costs one network request rather than N crops. The
 * offsets are expressed in percentages of an oversized background, so the mosaic
 * stays aligned at any container width without measuring anything in JavaScript.
 *
 * Tiles arrive on a distance-from-origin delay rather than in DOM order — a plain
 * stagger sweeps across a grid like a typewriter, which reads as a loading state
 * rather than as an image assembling. `gridDelay` is shared with the rest of the
 * site so every grid on the page waves the same way.
 *
 * Hovering a tile lifts it a few pixels and brightens it, which is the only
 * interaction: the picture is the point, and anything more turns it into a toy.
 */
export default function MosaicShuffle({
  src,
  alt,
  columns = 6,
  className = '',
  ratio = 3 / 2,
  from = 'centre',
  interactive = true,
}: MosaicShuffleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: '-10% 0px -10% 0px' });
  const [lifted, setLifted] = useState<number | null>(null);

  const rows = Math.max(1, Math.round(columns / ratio));
  const total = columns * rows;

  // Positions are stable per (columns, rows) pair, so they are computed once
  // rather than on every render — a re-render that reshuffled the offsets would
  // visibly tear the assembled picture.
  const cells = useMemo(
    () =>
      Array.from({ length: total }, (_, i) => {
        const c = i % columns;
        const r = Math.floor(i / columns);
        return {
          i,
          // Divide by (n - 1) so the last column/row lands exactly on 100%.
          x: columns > 1 ? (c / (columns - 1)) * 100 : 50,
          y: rows > 1 ? (r / (rows - 1)) * 100 : 50,
        };
      }),
    [columns, rows, total]
  );

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio: `${ratio}` }}
      role="img"
      aria-label={alt}
    >
      <div
        className="grid h-full w-full"
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
      >
        {cells.map(({ i, x, y }) => (
          <motion.span
            key={i}
            variants={reduced ? undefined : tileFlip}
            custom={gridDelay(i, columns, total, from, 0.045)}
            initial={reduced ? undefined : 'hidden'}
            animate={reduced || inView ? 'visible' : 'hidden'}
            onPointerEnter={interactive ? () => setLifted(i) : undefined}
            onPointerLeave={interactive ? () => setLifted((v) => (v === i ? null : v)) : undefined}
            className="relative block h-full w-full will-change-transform"
            style={{
              backgroundImage: `url(${src})`,
              // The background is sized to the whole mosaic and positioned per
              // cell; that is what makes the tiles read as one picture.
              backgroundSize: `${columns * 100}% ${rows * 100}%`,
              backgroundPosition: `${x}% ${y}%`,
              // A hairline of the canvas colour between tiles, so the grid stays
              // legible as a grid without drawing borders that shift layout.
              boxShadow: 'inset 0 0 0 0.5px rgb(var(--canvas) / 0.35)',
              transform: lifted === i ? 'translateZ(0) scale(1.04)' : undefined,
              filter: lifted === i ? 'brightness(1.16) saturate(1.08)' : undefined,
              zIndex: lifted === i ? 2 : 1,
              transition: `transform 420ms cubic-bezier(${ease.luxury.join(',')}), filter 420ms linear`,
            }}
          />
        ))}
      </div>

      {/* Seam light across the assembled picture, once. It fires on the same
          in-view flag as the tiles, so it always trails the last one. */}
      {!reduced && (
        <motion.span
          aria-hidden="true"
          initial={{ x: '-120%', opacity: 0 }}
          animate={inView ? { x: '120%', opacity: [0, 0.55, 0] } : {}}
          transition={{ duration: 1.5, delay: 0.5, ease: ease.curtain }}
          className="pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/35 to-transparent blend-screen"
        />
      )}
    </div>
  );
}
