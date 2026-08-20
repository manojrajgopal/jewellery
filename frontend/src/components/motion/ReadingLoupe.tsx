'use client';

import { useCallback, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface ReadingLoupeProps {
  /** The paragraph, as lines. Split by the caller so the bar can snap to one. */
  lines: string[];
  className?: string;
  /** Enlargement of the line under the bar. */
  zoom?: number;
  /** Label for the instrument. */
  label?: string;
}

/**
 * A loupe over text rather than over a stone.
 *
 * The site already has a jeweller's loupe for images: a circular window that
 * magnifies photography under the pointer. Applying the same idea to prose does
 * not work, and the reason is worth writing down — a round magnifier over a
 * paragraph enlarges *fragments of three lines*, which is strictly harder to
 * read than the unmagnified text. Magnification only helps type if it respects
 * the line.
 *
 * So this is a bar, not a circle, and it snaps to whole lines. The line under it
 * is genuinely re-rendered at a larger size and the lines around it are pushed
 * apart to make room, which means nothing is ever occluded — the classic failure
 * of a magnifier over text is that the thing you want to read next is under the
 * lens housing.
 *
 * The push-apart is the detail that makes it usable. Enlarging a line in place
 * either overlaps its neighbours or requires the block to reflow, and reflowing
 * a paragraph as the pointer moves is unreadable. Here every line is its own
 * row, so growing one row moves the others by exactly the difference — a layout
 * change, but a local and monotonic one, and it settles instantly.
 *
 * Keyboard: up and down move the bar a line at a time, so this is a real reading
 * aid rather than a pointer toy. Under a reduced-motion preference the bar is
 * still there and still moves — magnification is an accessibility affordance and
 * removing it would be exactly backwards — but it jumps rather than glides.
 */
export default function ReadingLoupe({
  lines,
  className = '',
  zoom = 1.5,
  label = 'Reading loupe',
}: ReadingLoupeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);

  const fromPointer = useCallback(
    (clientY: number) => {
      const box = ref.current?.getBoundingClientRect();
      if (!box) return;
      const t = (clientY - box.top) / box.height;
      setActive(Math.min(lines.length - 1, Math.max(0, Math.floor(t * lines.length))));
    },
    [lines.length]
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
    e.preventDefault();
    setActive((p) => {
      const next = (p ?? -1) + (e.key === 'ArrowDown' ? 1 : -1);
      return Math.min(lines.length - 1, Math.max(0, next));
    });
  };

  return (
    <div className={className}>
      <div className="mb-3 flex items-center gap-3">
        <span className="font-accent text-[10px] uppercase tracking-luxe text-accent">{label}</span>
        <span aria-hidden="true" className="h-px flex-1 bg-line/50" />
        <span className="nums-instrument font-accent text-[10px] uppercase tracking-luxe text-faint">
          {zoom.toFixed(1)}&times;
        </span>
      </div>

      <div
        ref={ref}
        tabIndex={0}
        role="group"
        aria-label={`${label}. Use the up and down arrows to move the lens between lines.`}
        onPointerMove={(e) => fromPointer(e.clientY)}
        onPointerLeave={() => setActive(null)}
        onKeyDown={onKeyDown}
        className="relative cursor-move-x rounded-sm border border-hairline bg-surface-raised/30 px-5 py-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {lines.map((line, i) => {
          const lit = active === i;
          return (
            <motion.p
              key={i}
              animate={{
                fontSize: lit ? `${zoom}rem` : '1rem',
                opacity: active === null ? 1 : lit ? 1 : 0.42,
                letterSpacing: lit ? '0.005em' : '0em',
              }}
              transition={
                reduced
                  ? { duration: 0 }
                  : { type: 'spring', stiffness: 320, damping: 30, mass: 0.5 }
              }
              className="relative z-10 font-display font-light leading-snug text-primary"
            >
              {line}
            </motion.p>
          );
        })}

        {/* The lens housing. Drawn behind the type — a bar over the words would
            tint exactly what it is meant to be helping with. */}
        {active !== null && (
          <motion.span
            aria-hidden="true"
            layout
            className="loupe-bar pointer-events-none absolute inset-x-2 z-0 rounded-sm"
            style={{
              top: `calc(${(active / lines.length) * 100}% + 0.5rem)`,
              height: `${(1 / lines.length) * 100}%`,
            }}
            transition={
              reduced ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 28 }
            }
          />
        )}
      </div>
    </div>
  );
}
