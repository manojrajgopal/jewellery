'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface LensFlareProps {
  className?: string;
  /** 0–1 strength of the whole assembly. */
  intensity?: number;
  /** Follow the pointer, or sit at a fixed origin. */
  follow?: boolean;
  /** Fixed origin as a percentage of the frame, used when follow is false. */
  originX?: number;
  originY?: number;
}

/** Ghosts are placed along the optical axis, mirrored through the frame centre. */
const GHOSTS = [
  { at: -0.42, size: 34, alpha: 0.3, tint: 'var(--gold-200)' },
  { at: -0.2, size: 16, alpha: 0.22, tint: 'var(--jade-300)' },
  { at: 0.26, size: 22, alpha: 0.26, tint: 'var(--amethyst-300)' },
  { at: 0.55, size: 44, alpha: 0.18, tint: 'var(--gold-300)' },
  { at: 0.82, size: 12, alpha: 0.3, tint: 'var(--rose-300)' },
] as const;

/**
 * An anamorphic lens flare: horizontal streak, warm bloom, and a row of
 * coloured ghosts strung along the line from the light source through the centre
 * of the frame.
 *
 * The ghosts are the part that sells it. Real flare artefacts are internal
 * reflections between lens elements, so they always fall on the axis joining the
 * source to the optical centre, and they move *opposite* to the source. Both of
 * those fall out of deriving every ghost position from the same source offset.
 */
export default function LensFlare({
  className = '',
  intensity = 1,
  follow = true,
  originX = 50,
  originY = 30,
}: LensFlareProps) {
  const [enabled, setEnabled] = useState(false);

  // Source position in percent of the frame.
  const x = useMotionValue(originX);
  const y = useMotionValue(originY);
  const sx = useSpring(x, { stiffness: 55, damping: 22, mass: 0.9 });
  const sy = useSpring(y, { stiffness: 55, damping: 22, mass: 0.9 });

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    setEnabled(true);
    if (!follow || !fine) return;

    const onMove = (e: PointerEvent) => {
      x.set((e.clientX / window.innerWidth) * 100);
      y.set((e.clientY / window.innerHeight) * 100);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [follow, x, y]);

  const left = useTransform(sx, (v) => `${v}%`);
  const top = useTransform(sy, (v) => `${v}%`);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden mix-blend-screen ${className}`}
      style={{ opacity: intensity }}
    >
      {/* Warm bloom at the source */}
      <motion.span
        style={{ left, top }}
        className="absolute h-[36vmin] w-[36vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(var(--gold-100)/0.34),rgb(var(--gold-400)/0.12)_38%,transparent_70%)] blur-xl"
      />

      {/* Anamorphic streak — wide, thin, and locked to the source's height */}
      <motion.span
        style={{ top }}
        animate={{ opacity: [0.35, 0.6, 0.35], scaleX: [0.94, 1.04, 0.94] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-x-[-10%] h-[1.5vmin] -translate-y-1/2 bg-[linear-gradient(90deg,transparent,rgb(var(--gold-200)/0.28)_28%,rgb(var(--gold-100)/0.6)_50%,rgb(var(--gold-200)/0.28)_72%,transparent)] blur-[6px]"
      />

      {/* Four-point starburst */}
      <motion.span
        style={{ left, top }}
        animate={{ rotate: [0, 12, 0], opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute h-[22vmin] w-[22vmin] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,transparent_0deg,rgb(var(--gold-100)/0.4)_4deg,transparent_10deg,transparent_86deg,rgb(var(--gold-100)/0.3)_90deg,transparent_96deg,transparent_176deg,rgb(var(--gold-100)/0.4)_180deg,transparent_186deg,transparent_266deg,rgb(var(--gold-100)/0.3)_270deg,transparent_276deg)] blur-[3px]"
      />

      {/* Ghosts, reflected through the centre of the frame */}
      {GHOSTS.map((g, i) => (
        <Ghost key={i} sx={sx} sy={sy} {...g} />
      ))}
    </div>
  );
}

function Ghost({
  sx,
  sy,
  at,
  size,
  alpha,
  tint,
}: {
  sx: ReturnType<typeof useSpring>;
  sy: ReturnType<typeof useSpring>;
  at: number;
  size: number;
  alpha: number;
  tint: string;
}) {
  // 50 is the optical centre; `at` slides the ghost along the axis through it,
  // so a source at 20% puts its ghosts past 50% on the far side.
  const left = useTransform(sx, (v) => `${50 + (50 - v) * (1 + at * 2)}%`);
  const top = useTransform(sy, (v) => `${50 + (50 - v) * (1 + at * 2)}%`);

  return (
    <motion.span
      style={{
        left,
        top,
        width: `${size / 4}vmin`,
        height: `${size / 4}vmin`,
        opacity: alpha,
        background: `radial-gradient(circle, rgb(${tint} / 0.55), rgb(${tint} / 0.12) 55%, transparent 72%)`,
      }}
      className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full blur-[2px]"
    />
  );
}
