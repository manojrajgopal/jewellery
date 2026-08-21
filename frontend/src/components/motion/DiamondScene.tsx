'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';

import { useOnScreen } from '@/hooks/useOnScreen';
import { onFrame } from '@/lib/frameLoop';
import { getPerfBudget } from '@/lib/perf';

interface DiamondSceneProps {
  size?: number;
  className?: string;
  /** Drag to rotate. Off makes it a purely ambient ornament. */
  interactive?: boolean;
  /** Orbiting satellite stones. */
  satellites?: number;
}

/**
 * A brilliant-cut stone, drawn as SVG facets and rotated in 3D.
 *
 * Every facet is a separate polygon with its own gradient, so the light moves
 * across the crown rather than the whole shape lightening at once — that is the
 * difference between "a rotating icon" and "a stone catching the light". A
 * caustic pool underneath and a prism flare complete the read.
 *
 * Drag rotates it; released, it eases back to a slow idle spin. Touch devices
 * get the idle spin without the drag, and reduced-motion gets a still stone.
 */
export default function DiamondScene({
  size = 320,
  className = '',
  interactive = true,
  satellites = 3,
}: DiamondSceneProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);
  const [dragging, setDragging] = useState(false);

  // Manual rotation, in degrees, accumulated from drags.
  const spinY = useMotionValue(0);
  const tiltX = useMotionValue(-8);

  const sSpinY = useSpring(spinY, { stiffness: 90, damping: 18, mass: 0.8 });
  const sTiltX = useSpring(tiltX, { stiffness: 110, damping: 20 });

  // The specular highlight tracks the rotation, so the bright facet is always
  // the one facing the light rather than a fixed one on the sprite.
  const lightX = useTransform(sSpinY, (deg) => 50 + Math.sin((deg * Math.PI) / 180) * 34);
  const lightY = useTransform(sTiltX, (deg) => 34 - deg * 0.6);
  const specular = useMotionTemplate`radial-gradient(38% 34% at ${lightX}% ${lightY}%, rgb(var(--gold-50) / 0.85), rgb(var(--gold-200) / 0.25) 42%, transparent 72%)`;

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const onScreen = useOnScreen(ref, '200px');

  // Idle spin — a slow continuous drift, paused while the visitor is dragging
  // so their input is not fighting an animation, and paused again whenever the
  // stone is off screen. The drift feeds a spring, so an unwatched stone was
  // keeping two animation loops alive rather than one.
  useEffect(() => {
    if (reduced || dragging || !onScreen) return;
    return onFrame(
      (dt) => {
        // Per-millisecond rather than per-frame, so the stone turns at the same
        // rate whatever frame rate the device is holding.
        spinY.set(spinY.get() + 0.16 * (dt / 16.667));
      },
      { fps: getPerfBudget().fps, order: 110 }
    );
  }, [reduced, dragging, onScreen, spinY]);

  // Pointer drag → rotation. Pointer capture keeps the gesture alive when the
  // pointer leaves the stone, which is what makes a flick feel right.
  useEffect(() => {
    if (!interactive || reduced) return;
    const node = ref.current;
    if (!node) return;

    let last: { x: number; y: number } | null = null;

    const onDown = (e: PointerEvent) => {
      last = { x: e.clientX, y: e.clientY };
      setDragging(true);
      node.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!last) return;
      spinY.set(spinY.get() + (e.clientX - last.x) * 0.55);
      // Tilt is clamped: past about 34° the flat SVG facets stop reading as a
      // solid and the illusion collapses.
      tiltX.set(Math.max(-34, Math.min(34, tiltX.get() - (e.clientY - last.y) * 0.35)));
      last = { x: e.clientX, y: e.clientY };
    };
    const onUp = (e: PointerEvent) => {
      last = null;
      setDragging(false);
      tiltX.set(-8);
      if (node.hasPointerCapture(e.pointerId)) node.releasePointerCapture(e.pointerId);
    };

    node.addEventListener('pointerdown', onDown);
    node.addEventListener('pointermove', onMove);
    node.addEventListener('pointerup', onUp);
    node.addEventListener('pointercancel', onUp);
    return () => {
      node.removeEventListener('pointerdown', onDown);
      node.removeEventListener('pointermove', onMove);
      node.removeEventListener('pointerup', onUp);
      node.removeEventListener('pointercancel', onUp);
    };
  }, [interactive, reduced, spinY, tiltX]);

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Caustic pool cast on the surface below the stone */}
      <motion.div
        aria-hidden="true"
        animate={reduced ? {} : { scale: [1, 1.12, 1], opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[6%] h-[18%] w-[62%] rounded-[50%] bg-gold-400/30 blur-2xl"
        style={{ opacity: 'var(--bloom)' }}
      />

      {/* Bloom behind the stone */}
      <div
        aria-hidden="true"
        className="absolute inset-[8%] rounded-full bg-gold-radial blur-2xl"
        style={{ opacity: 'var(--bloom)' }}
      />

      {/* Orbiting satellites, on rings that sit behind and in front */}
      {!reduced &&
        Array.from({ length: satellites }).map((_, i) => (
          <motion.div
            key={i}
            aria-hidden="true"
            animate={{ rotate: 360 }}
            transition={{
              duration: 16 + i * 7,
              repeat: Infinity,
              ease: 'linear',
              delay: -i * 3,
            }}
            className="absolute inset-0"
            style={{ rotate: i * 40 }}
          >
            <span
              className="absolute left-1/2 top-0 block h-2 w-2 -translate-x-1/2 rotate-45 bg-gradient-to-br from-gold-100 to-gold-500 shadow-[0_0_12px_2px_rgb(var(--gold-400)/0.6)]"
              style={{ top: `${i * 5}%` }}
            />
          </motion.div>
        ))}

      {/* The stone */}
      <motion.div
        ref={ref}
        style={{
          rotateY: sSpinY,
          rotateX: sTiltX,
          transformStyle: 'preserve-3d',
          perspective: 900,
        }}
        className={`relative h-full w-full ${
          interactive && !reduced ? 'cursor-grab active:cursor-grabbing' : ''
        }`}
        data-cursor={interactive && !reduced ? 'Rotate' : undefined}
      >
        <svg viewBox="0 0 200 200" className="h-full w-full overflow-visible" aria-hidden="true">
          <defs>
            {/* Table — the flat top, catching the most light */}
            <linearGradient id="ds-table" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(var(--gold-50))" stopOpacity="0.95" />
              <stop offset="45%" stopColor="rgb(var(--gold-200))" stopOpacity="0.7" />
              <stop offset="100%" stopColor="rgb(var(--gold-500))" stopOpacity="0.55" />
            </linearGradient>
            {/* Crown facets, alternating light and shadow around the girdle */}
            <linearGradient id="ds-crown-a" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(var(--gold-100))" stopOpacity="0.8" />
              <stop offset="100%" stopColor="rgb(var(--gold-600))" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="ds-crown-b" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(var(--champagne-300))" stopOpacity="0.6" />
              <stop offset="100%" stopColor="rgb(var(--gold-800))" stopOpacity="0.55" />
            </linearGradient>
            {/* Pavilion — the deep cone below the girdle */}
            <linearGradient id="ds-pav-a" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(var(--gold-400))" stopOpacity="0.62" />
              <stop offset="100%" stopColor="rgb(var(--gold-900))" stopOpacity="0.85" />
            </linearGradient>
            <linearGradient id="ds-pav-b" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(var(--gold-200))" stopOpacity="0.5" />
              <stop offset="100%" stopColor="rgb(var(--gold-700))" stopOpacity="0.9" />
            </linearGradient>
            {/* The dispersion a real stone throws — never pure white */}
            <linearGradient id="ds-fire" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(var(--amethyst-300))" stopOpacity="0.55" />
              <stop offset="40%" stopColor="rgb(var(--jade-300))" stopOpacity="0.4" />
              <stop offset="70%" stopColor="rgb(var(--gold-200))" stopOpacity="0.6" />
              <stop offset="100%" stopColor="rgb(var(--rose-300))" stopOpacity="0.5" />
            </linearGradient>
          </defs>

          {/* ---- Pavilion (drawn first: it sits behind) ---- */}
          <polygon points="20,74 100,190 100,74" fill="url(#ds-pav-a)" />
          <polygon points="100,74 100,190 180,74" fill="url(#ds-pav-b)" />
          <polygon points="20,74 100,190 60,74" fill="url(#ds-pav-b)" opacity="0.55" />
          <polygon points="140,74 100,190 180,74" fill="url(#ds-pav-a)" opacity="0.5" />

          {/* ---- Girdle: the bright hairline where crown meets pavilion ---- */}
          <line
            x1="20"
            y1="74"
            x2="180"
            y2="74"
            stroke="rgb(var(--gold-100))"
            strokeWidth="1.2"
            opacity="0.85"
          />

          {/* ---- Crown ---- */}
          <polygon points="20,74 52,36 68,74" fill="url(#ds-crown-a)" />
          <polygon points="52,36 100,36 100,74 68,74" fill="url(#ds-crown-b)" />
          <polygon points="100,36 148,36 132,74 100,74" fill="url(#ds-crown-a)" />
          <polygon points="148,36 180,74 132,74" fill="url(#ds-crown-b)" />
          <polygon points="20,74 68,74 44,74" fill="url(#ds-crown-b)" opacity="0.4" />

          {/* ---- Table ---- */}
          <polygon points="52,36 148,36 132,74 68,74" fill="url(#ds-table)" />
          <polygon
            points="52,36 148,36 132,74 68,74"
            fill="none"
            stroke="rgb(var(--gold-100))"
            strokeWidth="0.7"
            opacity="0.7"
          />

          {/* ---- Facet hairlines ---- */}
          <g stroke="rgb(var(--gold-100))" strokeWidth="0.5" opacity="0.42" fill="none">
            <path d="M52 36 L68 74 M148 36 L132 74 M100 36 L100 74" />
            <path d="M20 74 L100 190 M180 74 L100 190 M60 74 L100 190 M140 74 L100 190" />
          </g>

          {/* ---- Fire: a dispersion flare that sweeps the crown ---- */}
          <motion.polygon
            points="52,36 148,36 132,74 68,74"
            fill="url(#ds-fire)"
            animate={reduced ? {} : { opacity: [0, 0.65, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', times: [0, 0.45, 1] }}
            style={{ mixBlendMode: 'screen' }}
          />

          {/* ---- Glints: brief points of light at the facet junctions ---- */}
          {!reduced &&
            [
              { cx: 68, cy: 74, delay: 0 },
              { cx: 132, cy: 74, delay: 1.8 },
              { cx: 100, cy: 36, delay: 3.1 },
              { cx: 100, cy: 190, delay: 4.4 },
            ].map((g) => (
              <motion.g
                key={`${g.cx}-${g.cy}`}
                animate={{ opacity: [0, 1, 0], scale: [0.4, 1.4, 0.4] }}
                transition={{
                  duration: 2.2,
                  delay: g.delay,
                  repeat: Infinity,
                  repeatDelay: 3.4,
                  ease: 'easeInOut',
                }}
                style={{ transformOrigin: `${g.cx}px ${g.cy}px` }}
              >
                <path
                  d={`M${g.cx} ${g.cy - 9} L${g.cx + 1.6} ${g.cy - 1.6} L${g.cx + 9} ${g.cy} L${g.cx + 1.6} ${g.cy + 1.6} L${g.cx} ${g.cy + 9} L${g.cx - 1.6} ${g.cy + 1.6} L${g.cx - 9} ${g.cy} L${g.cx - 1.6} ${g.cy - 1.6} Z`}
                  fill="rgb(var(--gold-50))"
                />
              </motion.g>
            ))}
        </svg>

        {/* Specular sheen, tracking the rotation. Sits above the SVG in screen
            blend so it adds light rather than painting over the facets. */}
        <motion.div
          aria-hidden="true"
          className="clip-diamond pointer-events-none absolute inset-0 mix-blend-screen"
          style={{ backgroundImage: specular, opacity: 'var(--bloom)' }}
        />
      </motion.div>

      {/* Drag affordance — fades once the visitor has grabbed it */}
      {interactive && !reduced && (
        <motion.span
          animate={{ opacity: dragging ? 0 : 1 }}
          transition={{ duration: 0.4 }}
          className="pointer-events-none absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap font-accent text-[9px] uppercase tracking-luxer text-faint"
        >
          Drag to rotate
        </motion.span>
      )}
    </div>
  );
}
