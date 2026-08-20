'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';

import { easeLens } from '@/lib/motion';

export interface FocusPlate {
  src: string;
  alt: string;
  /** The line of copy that belongs to this plate, shown while it is sharp. */
  caption: string;
  /** Short label for the focus mark along the barrel. */
  mark: string;
}

interface RackFocusPlatesProps {
  plates: FocusPlate[];
  className?: string;
  /** Aspect of the frame, as a class so the caller owns it. */
  frameClassName?: string;
}

/**
 * A rack focus, driven by scroll and steerable by hand.
 *
 * Plates are stacked in one frame and exactly one is sharp at a time. Scrolling
 * the section pulls focus from the first plate to the last; the marks along the
 * barrel underneath let a visitor take the ring themselves and hold it.
 *
 * What makes it read as a lens rather than as a crossfade is breathing: a real
 * focus pull changes the field of view slightly, so each plate also scales by
 * ~5% across its transition. Without that the eye sees two images dissolving.
 * With it, it sees one camera changing its mind.
 *
 * The scroll position is quantised to 1% before it reaches React — the plates
 * then animate through plain CSS transitions on a composited layer, which is
 * far cheaper than driving one filter spring per plate every frame.
 */
export default function RackFocusPlates({
  plates,
  className = '',
  frameClassName = 'aspect-[16/10]',
}: RackFocusPlatesProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  /** null follows the scroll; a number means the visitor is holding focus. */
  const [held, setHeld] = useState<number | null>(null);
  const [drift, setDrift] = useState(0);
  const lastRef = useRef(-1);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 80%', 'end 30%'],
  });

  const scrolled = useTransform(scrollYProgress, [0.08, 0.92], [0, plates.length - 1]);

  useMotionValueEvent(scrolled, 'change', (v) => {
    const q = Math.round(v * 100) / 100;
    if (q !== lastRef.current) {
      lastRef.current = q;
      setDrift(q);
    }
  });

  const active = held ?? drift;
  const glide =
    'filter 520ms cubic-bezier(0.16,0.84,0.24,1), opacity 520ms cubic-bezier(0.16,0.84,0.24,1), transform 640ms cubic-bezier(0.16,0.84,0.24,1)';

  return (
    <div ref={ref} className={className}>
      <div
        className={`relative overflow-hidden rounded-3xl border border-hairline bg-surface-sunken ${frameClassName}`}
      >
        {plates.map((plate, i) => {
          /** Distance from focus in plates: 0 is sharp, 1+ is fully soft. */
          const off = Math.min(Math.abs(active - i), 1.4);
          const sharp = 1 - Math.min(off, 1);

          return (
            <div
              key={plate.mark}
              aria-hidden={off > 0.5}
              className="absolute inset-0"
              style={{
                // Nearer-to-focus plates sit on top, so the sharp one is never
                // occluded by a blurred neighbour drawn after it.
                zIndex: 10 - Math.round(off * 6),
                filter: reduced ? undefined : `blur(${off * 13}px) saturate(${1 - off * 0.28})`,
                opacity: reduced ? (off < 0.5 ? 1 : 0) : 0.26 + sharp * 0.74,
                transform: `scale(${1 + off * 0.055})`,
                transition: reduced ? 'opacity 200ms linear' : glide,
                willChange: 'filter, transform, opacity',
              }}
            >
              <Image
                src={plate.src}
                alt={plate.alt}
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
              />
            </div>
          );
        })}

        {/* Veil, so the caption always has something to sit on. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-2/5 bg-gradient-to-t from-[rgb(var(--media-veil))]/90 to-transparent" />

        {/* Captions are stacked in one grid cell so the frame never resizes as
            they swap lengths — only their opacity changes. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 grid p-6 md:p-8">
          {plates.map((plate, i) => {
            const on = Math.abs(active - i) < 0.5;
            return (
              <p
                key={plate.mark}
                className="col-start-1 row-start-1 max-w-xl font-display text-xl leading-snug text-on-media md:text-2xl"
                style={{
                  opacity: on ? 1 : 0,
                  transform: on ? 'translateY(0)' : 'translateY(10px)',
                  transition: 'opacity 420ms ease, transform 420ms cubic-bezier(0.16,0.84,0.24,1)',
                }}
              >
                {plate.caption}
              </p>
            );
          })}
        </div>

        {/* Focus-distance readout — the one piece of chrome that says "lens". */}
        <div className="pointer-events-none absolute right-5 top-5 z-30 rounded-full border-on-media border bg-[rgb(var(--media-veil))]/55 px-3 py-1 backdrop-blur-sm">
          <span className="font-accent text-[10px] uppercase tracking-luxer text-on-media-soft nums-tabular">
            f/1.4 · {(1.2 + active * 2.4).toFixed(1)}m
          </span>
        </div>
      </div>

      {/* ---- The barrel ---- */}
      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="font-accent text-[10px] uppercase tracking-luxer text-faint">Focus</span>
        <div className="flex flex-1 flex-wrap items-center gap-2">
          {plates.map((plate, i) => {
            const on = Math.abs(active - i) < 0.5;
            return (
              <button
                key={plate.mark}
                type="button"
                onClick={() => setHeld(held === i ? null : i)}
                aria-pressed={on}
                className={`rounded-full border px-3 py-1.5 font-accent text-[10px] uppercase tracking-luxe transition-all duration-500 ${
                  on
                    ? 'border-accent bg-accent text-onaccent'
                    : 'border-hairline text-muted hover:border-accent/50 hover:text-accent'
                }`}
              >
                {plate.mark}
              </button>
            );
          })}
        </div>
        {held !== null && (
          <motion.button
            type="button"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: easeLens.focusRing }}
            onClick={() => setHeld(null)}
            className="font-accent text-[10px] uppercase tracking-luxe text-accent underline-offset-4 hover:underline"
          >
            Release
          </motion.button>
        )}
      </div>
    </div>
  );
}
