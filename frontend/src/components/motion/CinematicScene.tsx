'use client';

import { useRef } from 'react';
import Image from 'next/image';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';

export interface Shot {
  /** Image path under /public. */
  image: string;
  /** Overline — small caps above the title. */
  kicker: string;
  title: string;
  body: string;
  /** How the camera behaves on this shot. */
  move?: 'push-in' | 'pull-out' | 'pan-left' | 'pan-right';
}

interface CinematicSceneProps {
  shots: Shot[];
  /** Viewport heights of scroll allotted per shot. Higher holds each shot longer. */
  heightPerShot?: number;
  className?: string;
  id?: string;
}

/**
 * A pinned sequence of shots that cross-dissolve as the visitor scrolls — the
 * closest thing to a film sequence the web has.
 *
 * The section is tall; a sticky child fills the viewport and holds while the
 * page scrolls past it. Progress through that scroll drives which shot is
 * visible, so the visitor is scrubbing a timeline rather than scrolling a list.
 *
 * Every shot is mounted the whole time and cross-faded on opacity, not
 * swapped. Mounting on demand means a fresh <Image> decode mid-dissolve, which
 * is exactly where a flash of empty frame comes from.
 */
export default function CinematicScene({
  shots,
  heightPerShot = 0.85,
  className = '',
  id,
}: CinematicSceneProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 400, damping: 38, mass: 0.3 });

  // Overall scene height: one viewport for the pin plus the allotted scrub.
  const heightVh = 100 + shots.length * heightPerShot * 100;

  return (
    <section
      id={id}
      ref={ref}
      className={`relative bg-canvas ${className}`}
      style={{ height: `${heightVh}vh` }}
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* ---- Shots ---- */}
        {shots.map((shot, i) => (
          <ShotLayer key={shot.image + i} shot={shot} index={i} total={shots.length} progress={progress} />
        ))}

        {/* ---- Static frame furniture ---- */}
        {/* Letterbox bars, always on inside the scene — this is the one place
            the cinematic frame is the content rather than an optional grade. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-[7svh] bg-ink-950" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-[7svh] bg-ink-950" />

        {/* Shot counter and a scrub bar, styled as a viewfinder readout */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[7svh] z-40 px-6 pb-6 md:px-12">
          <div className="mx-auto flex max-w-7xl items-end justify-between gap-6">
            <ShotCounter total={shots.length} progress={progress} />

            <div className="mb-1 h-px flex-1 bg-on-media-wash">
              <motion.div
                style={{ scaleX: progress }}
                className="h-full origin-left bg-gradient-to-r from-gold-700 via-gold-300 to-gold-500"
              />
            </div>

            <span className="font-accent text-[9px] uppercase tracking-luxer text-on-media-muted">
              Scroll to advance
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

/** Start and end of the camera move for each shot type. */
const MOVES: Record<
  NonNullable<Shot['move']>,
  { scale: [number, number]; x: [string, string] }
> = {
  'push-in': { scale: [1.02, 1.2], x: ['0%', '0%'] },
  'pull-out': { scale: [1.24, 1.03], x: ['0%', '0%'] },
  'pan-left': { scale: [1.14, 1.14], x: ['4%', '-4%'] },
  'pan-right': { scale: [1.14, 1.14], x: ['-4%', '4%'] },
};

function ShotLayer({
  shot,
  index,
  total,
  progress,
}: {
  shot: Shot;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  // Each shot owns a window of the scroll range. The windows deliberately
  // overlap at the edges so one shot is fading up while the last fades down.
  const unit = 1 / total;
  const start = index * unit;
  const end = start + unit;
  const fade = unit * 0.32;

  // First and last shots hold at full opacity at the very ends of the range,
  // so the scene never opens or closes on a half-faded frame.
  const opacity = useTransform(
    progress,
    index === 0
      ? [start, end - fade, end]
      : index === total - 1
        ? [start, start + fade, end]
        : [start, start + fade, end - fade, end],
    index === 0 ? [1, 1, 0] : index === total - 1 ? [0, 1, 1] : [0, 1, 1, 0]
  );

  const move = MOVES[shot.move ?? 'push-in'];
  // The camera move runs across the shot's own window plus a little either
  // side, so it is still moving as it dissolves rather than freezing first.
  const scale = useTransform(progress, [start - fade, end + fade], move.scale);
  const x = useTransform(progress, [start - fade, end + fade], move.x);

  // Copy arrives a beat after the image and leaves a beat before it.
  const copyOpacity = useTransform(
    progress,
    [start, start + fade * 1.3, end - fade * 1.3, end],
    [0, 1, 1, 0]
  );
  const copyY = useTransform(progress, [start, start + fade * 1.6], [42, 0]);

  return (
    <motion.div style={{ opacity }} className="absolute inset-0">
      <motion.div style={{ scale, x }} className="absolute inset-0">
        <Image
          src={shot.image}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          quality={88}
          // The first shot is above the fold once the scene pins, the rest are
          // not — but all of them must be decoded before their dissolve.
          priority={index === 0}
        />
      </motion.div>

      {/* Legibility veil, theme-aware so the copy flips with the mode */}
      <div className="media-veil-hero absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-tr from-gold-900/20 via-transparent to-amethyst-900/20 opacity-[var(--bloom)] mix-blend-overlay" />

      {/* Copy */}
      <motion.div
        style={{ opacity: copyOpacity, y: copyY }}
        className="absolute inset-0 z-20 flex items-center px-6 md:px-12"
      >
        <div className="mx-auto w-full max-w-7xl">
          <div className="max-w-xl">
            <div className="mb-5 flex items-center gap-4">
              <span className="font-accent text-[10px] uppercase tracking-luxest text-accent">
                {shot.kicker}
              </span>
              <span className="h-px w-14 bg-gradient-to-r from-gold-400/70 to-transparent" />
            </div>

            <h3 className="mb-5 font-display text-4xl font-light leading-[1.02] text-on-media md:text-6xl">
              {shot.title}
            </h3>

            <p className="max-w-md font-sans text-base font-light leading-relaxed text-on-media-soft md:text-lg">
              {shot.body}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ShotCounter({ total, progress }: { total: number; progress: MotionValue<number> }) {
  // Floors to the shot whose window the scroll is currently inside, so the
  // readout matches what is on screen rather than lagging behind the dissolve.
  // Formatted in the same transform: a MotionValue<string> can be rendered as
  // a child directly, which keeps the counter off React's render path.
  const label = useTransform(progress, (p) => {
    const shot = Math.min(total, Math.max(1, Math.floor(p * total) + 1));
    return String(shot).padStart(2, '0');
  });

  return (
    <div className="flex items-baseline gap-2">
      <motion.span className="font-display text-3xl text-accent tabular-nums md:text-4xl">
        {label}
      </motion.span>
      <span className="font-sans text-xs text-on-media-muted">
        / {String(total).padStart(2, '0')}
      </span>
    </div>
  );
}
