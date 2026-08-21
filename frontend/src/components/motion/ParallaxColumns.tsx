'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

export interface ColumnPlate {
  src: string;
  alt: string;
  caption?: string;
  href?: string;
}

interface ParallaxColumnsProps {
  plates: ColumnPlate[];
  className?: string;
  /** Columns on the widest breakpoint. Collapses to 2, then 1. */
  columns?: 2 | 3 | 4;
  /** Peak travel of the outermost column, in px. */
  depth?: number;
}

/**
 * Columns of plates travelling at different rates as the page scrolls.
 *
 * The distribution of speeds is the whole design. Speeds are assigned outward
 * from the centre — the middle column barely moves and the outer ones move most,
 * in alternating directions — which reads as depth. The obvious alternative,
 * giving each column a progressively larger speed left-to-right, reads as a
 * shear: the eye sees the grid sliding apart rather than receding.
 *
 * Columns are built by dealing the plates round-robin rather than by slicing the
 * list into contiguous blocks. Slicing puts the first third of the images in the
 * first column, so a visitor scanning left to right reads them out of order.
 */
export default function ParallaxColumns({
  plates,
  className = '',
  columns = 3,
  depth = 130,
}: ParallaxColumnsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Kept in the API for call-site compatibility; drift is disabled (see below).
  void depth;

  // Deal round-robin so reading order survives the column split.
  const cols: ColumnPlate[][] = Array.from({ length: columns }, () => []);
  plates.forEach((plate, i) => cols[i % columns].push(plate));

  // Distance from the centre of the row, normalised to 0…1.
  const centre = (columns - 1) / 2;

  return (
    <div
      ref={ref}
      className={`grid gap-4 sm:gap-5 ${
        columns === 4
          ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4'
          : columns === 3
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-1 sm:grid-cols-2'
      } ${className}`}
    >
      {cols.map((col, ci) => (
        <Column
          key={ci}
          plates={col}
          progress={scrollYProgress}
          // Column drift disabled: the differing per-column travel made the grid
          // scroll at several speeds at once, which read as inconsistent scroll
          // speed. Pinned to 0 so every column moves 1:1 with the page. The
          // round-robin dealing, alternating aspect ratios and hover effects are
          // all unchanged; `depth` is kept in the API so call sites still compile.
          travel={0}
          direction={ci < centre ? -1 : ci > centre ? 1 : 0}
          reduced={Boolean(reduced)}
          startIndex={ci}
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Column({
  plates,
  progress,
  travel,
  direction,
  reduced,
  startIndex,
}: {
  plates: ColumnPlate[];
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
  travel: number;
  direction: number;
  reduced: boolean;
  startIndex: number;
}) {
  const y = useTransform(progress, [0, 1], [travel * direction, -travel * direction]);

  return (
    <motion.div
      className="flex flex-col gap-4 sm:gap-5"
      style={reduced ? undefined : { y }}
    >
      {plates.map((plate, i) => (
        <Plate key={`${plate.src}-${i}`} plate={plate} index={startIndex + i} />
      ))}
    </motion.div>
  );
}

function Plate({ plate, index }: { plate: ColumnPlate; index: number }) {
  // Alternating aspect ratios, so the columns interlock rather than forming
  // visible horizontal bands across the grid.
  const aspect = index % 3 === 0 ? '3 / 4' : index % 3 === 1 ? '1 / 1' : '4 / 5';

  const body = (
    <div
      className="group relative w-full overflow-hidden rounded-xl border border-hairline bg-surface-sunken"
      style={{ aspectRatio: aspect }}
    >
      <Image
        src={plate.src}
        alt={plate.alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
        className="object-cover transition-transform duration-[1300ms] ease-luxury group-hover:scale-[1.07]"
      />

      {/* Wash that only arrives with the caption, so plates without one stay clean */}
      {plate.caption && (
        <>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-canvas/75 via-transparent to-transparent opacity-0 transition-opacity duration-600 group-hover:opacity-100"
          />
          <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-3 p-4 font-accent text-[9px] uppercase tracking-luxe text-on-media opacity-0 transition-all duration-600 group-hover:translate-y-0 group-hover:opacity-100">
            {plate.caption}
          </span>
        </>
      )}

      {/* Hairline frame drawing in */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-3 border border-gold-400/0 transition-colors duration-700 group-hover:border-gold-400/40"
      />

      {/* One diagonal sheen pass on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <span className="absolute -inset-full bg-gold-sheen opacity-0 transition-opacity duration-300 group-hover:animate-sheen-diagonal group-hover:opacity-60" />
      </span>
    </div>
  );

  if (plate.href) {
    return (
      <a href={plate.href} data-cursor="View" className="block">
        {body}
      </a>
    );
  }
  return body;
}
