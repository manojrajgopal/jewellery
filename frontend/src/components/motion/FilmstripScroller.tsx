'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';

export interface FilmFrame {
  src: string;
  alt: string;
  /** Slate line printed under the frame, e.g. a shot description. */
  slate?: string;
  /** Scene/take, printed in the sprocket margin. */
  code?: string;
}

interface FilmstripScrollerProps {
  frames: FilmFrame[];
  className?: string;
  /** Height of the strip in px, sprocket margins included. */
  height?: number;
  /** How far the strip travels across the scroll pass, as a multiple of width. */
  travel?: number;
  title?: string;
}

/**
 * A length of 35mm film pulled sideways as the page scrolls.
 *
 * The strip is one wide row translated on X against the section's own scroll
 * progress, so nothing scrolls horizontally — there is no nested scroll container
 * to fight the page for the wheel, which is what makes most horizontal galleries
 * unusable on a trackpad.
 *
 * The travel is put through a spring rather than read raw. A raw scroll mapping
 * is rigid: it stops dead the instant the wheel stops, and film has weight. The
 * spring gives the strip a short glide out, and the same value drives a slight
 * skew so the frames lean into the pull.
 *
 * Sprocket holes are generated from the strip's width rather than per frame,
 * because real perforations are on a fixed pitch and do not line up with frame
 * boundaries — matching them to frames is the tell that gives away a fake strip.
 */
export default function FilmstripScroller({
  frames,
  className = '',
  height = 340,
  travel = 0.72,
  title = 'Contact Sheet',
}: FilmstripScrollerProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [current, setCurrent] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Travel expressed in percent of the strip's own width, so it scales with the
  // number of frames instead of needing a pixel figure per instance.
  const rawX = useTransform(scrollYProgress, [0, 1], ['12%', `${-travel * 100}%`]);
  const x = useSpring(rawX, { stiffness: 120, damping: 26, mass: 0.6 });

  // Lean into the direction of travel. Small — past ~2° it reads as a broken
  // transform rather than as momentum.
  const skew = useTransform(scrollYProgress, [0, 0.5, 1], [1.4, 0, -1.4]);

  // Which frame is centred, for the slate readout underneath.
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const i = Math.round(p * (frames.length - 1));
    setCurrent(Math.max(0, Math.min(frames.length - 1, i)));
  });

  const perfs = Math.max(frames.length * 8, 40);

  return (
    <div ref={sectionRef} className={`relative ${className}`}>
      {/* Slate */}
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4 px-1">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="block h-1.5 w-1.5 animate-pulse-dot rounded-full bg-burgundy-500"
          />
          <span className="font-accent text-[10px] uppercase tracking-luxest text-accent">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-4 font-sans text-[11px] font-light text-faint">
          <span className="nums-tabular">
            {frames[current]?.code ?? String(current + 1).padStart(3, '0')}
          </span>
          <span className="hidden sm:inline">{frames[current]?.slate}</span>
        </div>
      </div>

      <div
        className="relative overflow-hidden rounded-lg bg-ink-950"
        style={{ height }}
      >
        {/* Sprocket margins */}
        <Perforations count={perfs} edge="top" />
        <Perforations count={perfs} edge="bottom" />

        {/* The strip */}
        <motion.div
          className="absolute inset-y-0 left-0 flex h-full items-center gap-2 px-2 py-9 will-transform"
          style={reduced ? undefined : { x, skewY: skew }}
        >
          {frames.map((frame, i) => (
            <div
              key={`${frame.src}-${i}`}
              className="group relative h-full flex-shrink-0 overflow-hidden"
              style={{ aspectRatio: '3 / 2' }}
            >
              <Image
                src={frame.src}
                alt={frame.alt}
                fill
                sizes="(max-width: 768px) 60vw, 34vw"
                className="object-cover brightness-[0.88] saturate-[0.9] transition-all duration-700 group-hover:brightness-100 group-hover:saturate-100"
              />

              {/* Frame line — the black bar between exposures */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 right-0 w-0.5 bg-ink-950"
              />

              {/* Edge code, printed in the margin the way film is */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-1.5 top-1.5 font-sans text-[8px] uppercase tracking-widest text-gold-200/40"
              >
                {frame.code ?? `A${String(i + 1).padStart(2, '0')}`}
              </span>

              {/* Caption, on hover */}
              <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-3 bg-gradient-to-t from-ink-950/85 to-transparent p-3 font-sans text-[10px] font-light text-gold-100/85 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                {frame.slate ?? frame.alt}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Gate weave: a faint vertical jitter over the whole strip, which is the
            single most recognisable artefact of film running through a projector. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 animate-flicker bg-gradient-to-b from-transparent via-gold-100/[0.02] to-transparent"
        />

        {/* Edge vignette */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 shadow-[inset_0_0_80px_-20px_rgb(0_0_0/0.9)]"
        />
      </div>
    </div>
  );
}

/** One sprocket margin. Holes are on a fixed pitch, independent of the frames. */
function Perforations({ count, edge }: { count: number; edge: 'top' | 'bottom' }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 z-10 flex h-7 items-center gap-2.5 overflow-hidden px-2 ${
        edge === 'top' ? 'top-0' : 'bottom-0'
      }`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="h-3 w-4 flex-shrink-0 rounded-[2px] bg-canvas/85"
        />
      ))}
    </div>
  );
}
