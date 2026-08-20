'use client';

import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { Sun } from 'lucide-react';

interface ShadowStageProps {
  src: string;
  alt: string;
  className?: string;
  /** Caption under the stage. */
  caption?: string;
  /** Height of the stage floor, as a fraction of the frame. */
  floor?: number;
}

/** Where the lamp starts: high and slightly to the left, which is how every
    jewellery photograph in history has been lit and the only position most
    people find flattering without being told why. */
const START = { x: 0.34, y: 0.18 };

/**
 * One object, one lamp, and the lamp can be moved.
 *
 * The site has plenty of light — caustics, god rays, spotlights, a five-source
 * lighting room. Every one of them lights the *frame*. None of them casts a
 * shadow from the object, and a cast shadow is the only thing on a flat screen
 * that tells you an object has a position in space rather than a place on a
 * page.
 *
 * Three things move together when the lamp moves, and animating fewer than
 * three is the reason most draggable-light demos read as a gradient following a
 * cursor:
 *
 *  1. The shadow swings to the opposite side of the object. Obvious, and the
 *     only one usually done.
 *  2. It *lengthens* as the lamp lowers. A lamp near the horizon throws a
 *     shadow several times the height of what casts it; a lamp overhead throws
 *     almost none. This is the single strongest cue for how high the lamp is,
 *     and it is why the vertical axis of the drag controls scale rather than
 *     blur.
 *  3. It softens as it lengthens, because the penumbra grows with distance from
 *     the contact point. A long hard shadow looks like a cut-out; a long soft
 *     one looks like late afternoon.
 *
 * The specular highlight on the object is driven from the same position, on the
 * near side, so the lit face and the shadow can never disagree — which they do
 * in any implementation where the highlight is a separate hover effect.
 *
 * Keyboard users get the arrow keys on the lamp handle, in five-percent steps.
 * Reduced motion parks the lamp at the default position and keeps the whole
 * thing static and legible; the shadow is still there, because a shadow is
 * information rather than movement.
 */
export default function ShadowStage({
  src,
  alt,
  className = '',
  caption,
  floor = 0.22,
}: ShadowStageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [lamp, setLamp] = useState(START);
  const [dragging, setDragging] = useState(false);

  const setFromPointer = useCallback((clientX: number, clientY: number) => {
    const box = ref.current?.getBoundingClientRect();
    if (!box) return;
    setLamp({
      x: Math.min(1, Math.max(0, (clientX - box.left) / box.width)),
      // Clamped short of the floor: a lamp below the object it is lighting is a
      // different photograph entirely, and not one anybody wants of jewellery.
      y: Math.min(0.62, Math.max(0.04, (clientY - box.top) / box.height)),
    });
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setFromPointer(e.clientX, e.clientY);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    setFromPointer(e.clientX, e.clientY);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = 0.05;
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    const move = moves[e.key];
    if (!move) return;
    e.preventDefault();
    setLamp((p) => ({
      x: Math.min(1, Math.max(0, p.x + move[0])),
      y: Math.min(0.62, Math.max(0.04, p.y + move[1])),
    }));
  };

  const pos = reduced ? START : lamp;

  /* The object sits at the centre of the floor line. The shadow is thrown along
     the vector from lamp to object, and its length is a function of how low the
     lamp is — the tangent relationship, flattened so the extremes stay usable. */
  const dx = 0.5 - pos.x;
  const dy = 1 - floor - pos.y;
  const elevation = Math.max(0.08, dy);
  const length = Math.min(3.4, 0.5 / elevation);

  const throwX = dx * 240 * length * 0.4;
  // A floor recedes *upward* in a frame, so a shadow getting longer extends
  // toward the viewer — downward on screen. Zero at the shortest throw, so the
  // near edge stays welded to the contact point however low the lamp goes.
  const throwY = Math.max(0, 14 * (length - 0.6));
  const blur = 6 + length * 9;
  const alpha = Math.max(0.12, 0.46 - length * 0.07);

  /* Where the lamp is, in words. Worth printing: the whole point of the control
     is that a visitor learns the vocabulary while they play with it. */
  const height = pos.y < 0.16 ? 'overhead' : pos.y < 0.34 ? 'high' : pos.y < 0.5 ? 'raking' : 'low';
  const side = pos.x < 0.42 ? 'left' : pos.x > 0.58 ? 'right' : 'front';

  return (
    <figure className={className}>
      <div
        ref={ref}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={() => setDragging(false)}
        onPointerCancel={() => setDragging(false)}
        className={`glass-pane relative aspect-[4/3] w-full select-none overflow-hidden rounded-sm border border-hairline bg-surface-sunken ${
          reduced ? '' : dragging ? 'cursor-grabbing-any' : 'cursor-aim'
        }`}
      >
        {/* The wash the lamp puts on the back wall. Positioned from the lamp, so
            the brightest part of the wall is always directly behind it. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-[background] duration-500"
          style={{
            background: `radial-gradient(58% 52% at ${(pos.x * 100).toFixed(1)}% ${(pos.y * 100).toFixed(1)}%, rgb(var(--gold-100) / 0.24), transparent 68%)`,
          }}
        />

        {/* The floor. A plane, not a line — the shadow needs somewhere to lie. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,rgb(var(--shadow-color)/0.18),rgb(var(--shadow-color)/0.42))]"
          style={{ height: `${floor * 100}%` }}
        />

        {/* The shadow. Its own element rather than a drop-shadow filter on the
            object, because a filter shadow cannot be scaled independently of
            what casts it — and the scaling is the half that carries the lamp
            height. */}
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 origin-bottom"
          animate={{
            x: `calc(-50% + ${throwX.toFixed(1)}px)`,
            y: throwY,
            scaleY: 0.3 + length * 0.34,
            scaleX: 1 + Math.abs(dx) * 0.5,
            opacity: alpha,
            filter: `blur(${blur.toFixed(1)}px)`,
          }}
          transition={
            reduced ? { duration: 0 } : { type: 'spring', stiffness: 150, damping: 24, mass: 0.7 }
          }
          style={{
            bottom: `${floor * 100 - 2}%`,
            width: '46%',
            height: '18%',
            background:
              'radial-gradient(closest-side, rgb(var(--shadow-color) / 0.9), transparent)',
            transformOrigin: '50% 100%',
          }}
        />

        {/* The object. Lit from the lamp's side and lifted off the floor by its
            own contact shadow, which is the small dark one directly underneath
            that never moves much however high the lamp goes. */}
        <div
          className="absolute left-1/2 w-[42%] -translate-x-1/2"
          style={{ bottom: `${floor * 100 - 1}%` }}
        >
          <div className="relative aspect-square">
            <Image src={src} alt={alt} fill sizes="40vw" className="object-contain" />
            {/* Specular side, from the lamp. Screen-blended so it brightens the
                metal rather than fogging the whole cut-out. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 blend-screen transition-[background] duration-500"
              style={{
                background: `radial-gradient(44% 44% at ${(pos.x * 100).toFixed(0)}% ${(pos.y * 130).toFixed(0)}%, rgb(var(--gold-50) / 0.4), transparent 62%)`,
              }}
            />
          </div>
        </div>

        {/* The lamp handle. A real control: draggable, focusable, arrow-keyed. */}
        {!reduced && (
          <button
            type="button"
            onKeyDown={onKeyDown}
            aria-label={`Light source — ${height}, ${side}. Move with the arrow keys.`}
            className="absolute z-20 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-accent/40 bg-surface-raised/70 text-accent backdrop-blur-sm transition-colors duration-300 hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            style={{ left: `${pos.x * 100}%`, top: `${pos.y * 100}%` }}
          >
            <Sun className="h-4 w-4" aria-hidden="true" />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-full shadow-[0_0_28px_6px_rgb(var(--gold-400)/0.45)]"
            />
          </button>
        )}

        {/* The reading. Printed rather than hidden, because the vocabulary is the
            thing being taught. */}
        <div className="absolute bottom-3 left-4 flex items-baseline gap-3 font-accent text-[10px] uppercase tracking-luxe text-faint">
          <span>{height} key</span>
          <span aria-hidden="true">·</span>
          <span>{side}</span>
          <span aria-hidden="true">·</span>
          <span className="nums-instrument">
            shadow {length.toFixed(1)}&times;
          </span>
        </div>
      </div>

      <figcaption className="mt-3 font-sans text-sm font-light leading-relaxed text-muted">
        {caption ??
          'Drag the lamp. The shadow lengthens as you lower it, which is the only cue on a flat screen for how high a light actually is.'}
      </figcaption>
    </figure>
  );
}
