'use client';

import { ReactNode, useCallback, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

interface Mark {
  id: number;
  x: number;
  y: number;
  angle: number;
  length: number;
}

interface VelvetPileSweepProps {
  children?: ReactNode;
  className?: string;
  /** How long a brush mark takes to stand back up, in seconds. */
  recovery?: number;
  height?: number | string;
}

/**
 * Velvet, with a nap that remembers where your hand went.
 *
 * The site has a velvet *tray* — a case that opens to show the piece inside —
 * and a velvet rope, and both of them treat velvet as a colour. It is not a
 * colour. Velvet is a pile fabric, which means it is a forest of short upright
 * fibres, and the entire reason it has been the surface every jeweller in the
 * world displays on for four hundred years is that this forest does two things
 * nothing else does:
 *
 *   - It absorbs almost all the light that hits it, which is why a stone on
 *     velvet looks brighter than the same stone on silk. There is no competing
 *     specular highlight anywhere in the frame.
 *   - It takes a mark. Brush it one way and the fibres lie down and it goes
 *     pale; brush it back and it goes dark again. That is why a display tray in
 *     a good shop is always brushed in one direction before it is put out, and
 *     it is why yours arrives that way.
 *
 * So the interaction is not a hover glow. It is a directional mark, drawn along
 * the axis the pointer was actually travelling, that fades over seconds as the
 * pile stands back up. The angle is taken from the movement vector rather than
 * from the pointer position, which is the whole difference between this and a
 * spotlight that follows a cursor.
 *
 * Under a reduced-motion preference the surface keeps its pile and loses the
 * marks entirely, which is what a display tray looks like before anybody has
 * touched it.
 */
export default function VelvetPileSweep({
  children,
  className = '',
  recovery = 2.4,
  height = 420,
}: VelvetPileSweepProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [marks, setMarks] = useState<Mark[]>([]);
  const last = useRef<{ x: number; y: number; t: number } | null>(null);
  const counter = useRef(0);

  const onMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (reduced) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const now = performance.now();
      const prev = last.current;

      // One mark per ~14px of travel. Sampling on distance rather than on time
      // is what keeps a slow sweep from laying down a hundred overlapping marks
      // and a fast one from laying down two.
      if (prev) {
        const dx = x - prev.x;
        const dy = y - prev.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 14) return;

        const id = ++counter.current;
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        setMarks((current) => [
          // Capped, because the marks are DOM nodes and a long sweep across a
          // wide tray would otherwise leave several hundred of them alive at
          // once for no visible gain.
          ...current.slice(-28),
          { id, x, y, angle, length: Math.min(120, 34 + dist * 1.6) },
        ]);
        window.setTimeout(
          () => setMarks((c) => c.filter((m) => m.id !== id)),
          recovery * 1000
        );
      }

      last.current = { x, y, t: now };
    },
    [reduced, recovery]
  );

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={() => {
        last.current = null;
      }}
      className={`velvet-nap relative overflow-hidden rounded-2xl border border-hairline ${className}`}
      style={{ height }}
    >
      {/* The pile itself. A very fine, very low-contrast noise, which is the
          only honest way to draw a surface made of ten thousand fibres. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(94deg, rgb(var(--hairline)/0.5) 0 1px, transparent 1px 3px)',
        }}
      />

      {/* The marks. Each is a soft, elongated wash rotated onto the direction of
          travel — brushed pile is a streak, never a circle. */}
      <AnimatePresence>
        {marks.map((mark) => (
          <motion.span
            key={mark.id}
            aria-hidden="true"
            initial={{ opacity: 0.62, scaleX: 0.7 }}
            animate={{ opacity: 0, scaleX: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: recovery, ease: 'easeOut' }}
            className="pointer-events-none absolute rounded-full blur-[6px]"
            style={{
              left: mark.x,
              top: mark.y,
              width: mark.length,
              height: 26,
              marginLeft: -mark.length / 2,
              marginTop: -13,
              rotate: `${mark.angle}deg`,
              background:
                'linear-gradient(90deg, transparent, rgb(var(--hairline)/0.34) 32%, rgb(var(--hairline)/0.42) 52%, transparent)',
            }}
          />
        ))}
      </AnimatePresence>

      {/* The lamp. One, above and slightly left, which is where every jewellery
          photograph in history has had it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(52%_46%_at_42%_16%,rgb(var(--gold-200)/0.12),transparent_74%)]"
      />

      <div className="relative z-10 h-full">{children}</div>

      {!reduced && (
        <p className="pointer-events-none absolute bottom-4 right-5 font-accent text-[9px] uppercase tracking-luxe text-on-media-muted">
          Sweep it — the pile lies down
        </p>
      )}
    </div>
  );
}
