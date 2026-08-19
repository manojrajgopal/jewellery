'use client';

import { useMemo, useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';

interface ShatterImageProps {
  src: string;
  alt: string;
  className?: string;
  /** Grid resolution. 5 → 25 facets. */
  grid?: number;
  /** Seconds between the first and last facet landing. */
  spread?: number;
  /** 'assemble' flies facets in; 'dissolve' plays it as a departure on hover. */
  mode?: 'assemble' | 'dissolve';
  priority?: boolean;
  sizes?: string;
}

/** Deterministic pseudo-random from a cell index, so SSR and client agree. */
const rand = (i: number, salt: number) => {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/**
 * An image that assembles from faceted tiles, the way a stone is read as a set
 * of planes rather than a surface.
 *
 * Every tile carries the *whole* image as a background, offset so that its own
 * region shows through — that is what keeps the seams invisible once assembled.
 * Tiles fly in from randomised offsets and rotations, and the diagonal ordering
 * gives the assembly a direction instead of looking like static noise resolving.
 *
 * Randomness is derived from the cell index rather than Math.random at render
 * time, so the server and client produce identical markup.
 */
export default function ShatterImage({
  src,
  alt,
  className = '',
  grid = 5,
  spread = 1.1,
  mode = 'assemble',
  priority = false,
  sizes = '(min-width: 1024px) 50vw, 100vw',
}: ShatterImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-12%' });

  const cells = useMemo(() => {
    const out: {
      key: string;
      row: number;
      col: number;
      dx: number;
      dy: number;
      rot: number;
      delay: number;
    }[] = [];
    for (let row = 0; row < grid; row++) {
      for (let col = 0; col < grid; col++) {
        const i = row * grid + col;
        out.push({
          key: `${row}-${col}`,
          row,
          col,
          dx: (rand(i, 1) - 0.5) * 90,
          dy: (rand(i, 2) - 0.5) * 90,
          rot: (rand(i, 3) - 0.5) * 34,
          // Diagonal wavefront plus a little jitter, so the sweep has a
          // direction without marching in a perfectly straight line.
          delay: ((row + col) / (grid * 2 - 2)) * spread + rand(i, 4) * 0.14,
        });
      }
    }
    return out;
  }, [grid, spread]);

  const step = 100 / grid;

  return (
    <div
      ref={ref}
      className={`group relative overflow-hidden ${className}`}
      style={{ perspective: '1400px' }}
    >
      {/* The real image carries alt text and loading; the facets are decoration
          layered over it, and it shows through once they have settled. */}
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover opacity-0 motion-reduce:opacity-100"
      />

      <div aria-hidden="true" className="absolute inset-0 preserve-3d">
        {cells.map((c) => (
          <motion.span
            key={c.key}
            initial={{
              opacity: 0,
              x: c.dx,
              y: c.dy,
              rotate: c.rot,
              scale: 0.72,
              filter: 'blur(6px)',
            }}
            animate={
              inView
                ? { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1, filter: 'blur(0px)' }
                : undefined
            }
            transition={{ duration: 1.05, delay: c.delay, ease: [0.22, 1, 0.36, 1] }}
            whileHover={
              mode === 'dissolve'
                ? { x: c.dx * 0.22, y: c.dy * 0.22, rotate: c.rot * 0.3, opacity: 0.55 }
                : undefined
            }
            className="absolute block will-change-transform"
            style={{
              left: `${c.col * step}%`,
              top: `${c.row * step}%`,
              width: `calc(${step}% + 1px)`,
              height: `calc(${step}% + 1px)`,
              backgroundImage: `url(${src})`,
              backgroundSize: `${grid * 100}% ${grid * 100}%`,
              backgroundPosition: `${(c.col / (grid - 1)) * 100}% ${(c.row / (grid - 1)) * 100}%`,
            }}
          />
        ))}
      </div>

      {/* A single light sweep across the assembled plate, once, as it lands. */}
      <motion.span
        aria-hidden="true"
        initial={{ x: '-120%' }}
        animate={inView ? { x: '120%' } : undefined}
        transition={{ duration: 1.4, delay: spread + 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-gold-100/25 to-transparent"
      />
    </div>
  );
}
