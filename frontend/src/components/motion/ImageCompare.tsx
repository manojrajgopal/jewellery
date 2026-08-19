'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MoveHorizontal } from 'lucide-react';

interface ImageCompareProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
  /** Starting handle position, 0–100. */
  initial?: number;
  /** Sweep the handle once on first view, to show it is draggable. */
  demo?: boolean;
}

/**
 * Before-and-after wipe with a draggable handle — restoration, polishing,
 * a stone reset.
 *
 * The handle is a real range input underneath the styled furniture, so it comes
 * with keyboard control, arrow-key stepping and screen-reader semantics for
 * free. Hand-rolling drag handling here is how these widgets end up
 * mouse-only.
 */
export default function ImageCompare({
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After',
  className = '',
  initial = 50,
  demo = true,
}: ImageCompareProps) {
  const [position, setPosition] = useState(initial);
  const [dragging, setDragging] = useState(false);
  const [demoed, setDemoed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // A single sweep on first view, so the affordance is obvious without a
  // permanent animation drawing the eye away from the images.
  useEffect(() => {
    if (!demo || demoed) return;
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setDemoed(true);

        // Ease out to 74, back to 30, settle at the initial position.
        const keys = [initial, 74, 30, initial];
        let leg = 0;
        const step = () => {
          if (leg >= keys.length - 1) return;
          const from = keys[leg];
          const to = keys[leg + 1];
          const startedAt = performance.now();
          const legDuration = 620;

          const tick = (now: number) => {
            const t = Math.min(1, (now - startedAt) / legDuration);
            // easeInOutCubic
            const eased = t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
            setPosition(from + (to - from) * eased);
            if (t < 1) requestAnimationFrame(tick);
            else {
              leg += 1;
              step();
            }
          };
          requestAnimationFrame(tick);
        };
        window.setTimeout(step, 420);
      },
      { threshold: 0.45 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [demo, demoed, initial]);

  // Any manual input cancels the demo sweep for good.
  const onInput = useCallback((value: number) => {
    setDemoed(true);
    setPosition(value);
  }, []);

  return (
    <div
      ref={ref}
      className={`group relative overflow-hidden rounded-2xl border border-hairline shadow-cinema ${className}`}
    >
      {/* After — the full-frame base layer */}
      <Image
        src={afterImage}
        alt={afterLabel}
        fill
        sizes="(max-width: 768px) 100vw, 60vw"
        className="object-cover"
      />

      {/* Before — clipped to the handle position */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image
          src={beforeImage}
          alt={beforeLabel}
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover"
        />
        {/* Graded cooler and flatter, so "before" reads as before even when the
            two photographs are similar. */}
        <div className="absolute inset-0 bg-ink-950/25 mix-blend-multiply" />
      </div>

      {/* Seam */}
      <div
        className="pointer-events-none absolute inset-y-0 z-20 w-px bg-gradient-to-b from-transparent via-gold-300 to-transparent shadow-[0_0_16px_2px_rgb(var(--gold-400)/0.6)]"
        style={{ left: `${position}%` }}
      />

      {/* Handle */}
      <motion.div
        animate={{ scale: dragging ? 1.12 : 1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 24 }}
        className="pointer-events-none absolute top-1/2 z-30 -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${position}%` }}
      >
        <span className="glass-strong flex h-12 w-12 items-center justify-center rounded-full text-accent">
          <MoveHorizontal size={18} strokeWidth={1.7} />
        </span>
        {/* Pulse ring, only while idle */}
        {!dragging && (
          <span className="animate-pulse-ring absolute inset-0 rounded-full border border-gold-300/50" />
        )}
      </motion.div>

      {/* Labels */}
      <span className="hud absolute left-4 top-4 z-20 rounded-full px-3.5 py-1.5 font-accent text-[10px] uppercase tracking-luxer text-on-media">
        {beforeLabel}
      </span>
      <span className="hud absolute right-4 top-4 z-20 rounded-full px-3.5 py-1.5 font-accent text-[10px] uppercase tracking-luxer text-accent">
        {afterLabel}
      </span>

      {/* The actual control. Transparent and full-bleed, so the whole plate is
          draggable, with the styled furniture above it purely visual. */}
      <input
        type="range"
        min={0}
        max={100}
        step={0.1}
        value={position}
        onChange={(e) => onInput(Number(e.target.value))}
        onPointerDown={() => setDragging(true)}
        onPointerUp={() => setDragging(false)}
        onKeyDown={() => setDemoed(true)}
        aria-label={`Compare ${beforeLabel} and ${afterLabel}`}
        aria-valuetext={`${Math.round(position)}% ${beforeLabel}`}
        className="absolute inset-0 z-40 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0"
      />
    </div>
  );
}
