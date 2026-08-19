'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

export interface LookbookLeaf {
  id: string;
  /** Right-hand face — seen before the leaf is turned. */
  recto: LookbookFace;
  /** Left-hand face — seen after the leaf is turned. */
  verso: LookbookFace;
}

export interface LookbookFace {
  image?: string;
  kicker?: string;
  title?: string;
  body?: string;
  /** Rendered as a pull-quote rather than as body copy. */
  quote?: string;
  /** Small facts printed in the page margin. */
  notes?: string[];
  plate?: string;
}

interface LookbookFlipProps {
  leaves: LookbookLeaf[];
  className?: string;
  /** Printed on the cover and in the running head. */
  title?: string;
}

/**
 * A bound lookbook whose leaves actually turn.
 *
 * The geometry is the thing worth explaining. Every leaf lives in the right half
 * of the spread, hinged on its left edge, and turning it sweeps it 180° into the
 * left half — so a turned leaf shows its verso and an unturned one shows its
 * recto. Stacking is explicit and mirrored either side of the hinge: unturned
 * leaves stack front-to-back from the top of the pile, turned ones stack the
 * other way, or the leaf mid-turn passes *through* the pages it should be
 * passing over.
 *
 * Turning is one leaf per gesture on purpose. A book that flips three pages on
 * a trackpad flick is a book nobody can read.
 */
export default function LookbookFlip({ leaves, className = '', title = 'The Lookbook' }: LookbookFlipProps) {
  // Number of leaves turned. 0 is the cover spread, leaves.length is the back.
  const [turned, setTurned] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const reduced = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const cooldown = useRef(0);

  const total = leaves.length;

  const go = useCallback(
    (dir: 1 | -1) => {
      // A turn takes ~1.1s and overlapping turns look like a shuffle, so the
      // gesture is gated rather than queued.
      const now = Date.now();
      if (now < cooldown.current) return;
      setTurned((t) => {
        const next = t + dir;
        if (next < 0 || next > total) return t;
        cooldown.current = now + (reduced ? 0 : 700);
        setFlipping(true);
        window.setTimeout(() => setFlipping(false), reduced ? 0 : 760);
        return next;
      });
    },
    [total, reduced]
  );

  // Keyboard, but only while the book itself holds focus — arrow keys belong to
  // the page otherwise.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (!el.contains(document.activeElement)) return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        go(1);
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        go(-1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  const progress = total === 0 ? 0 : turned / total;

  return (
    <div className={`relative ${className}`}>
      {/* Running head */}
      <div className="mb-5 flex items-end justify-between gap-6">
        <div className="flex items-center gap-3">
          <BookOpen size={16} strokeWidth={1.6} className="text-accent" />
          <span className="font-accent text-[10px] uppercase tracking-luxest text-accent">
            {title}
          </span>
        </div>
        <span className="nums-tabular font-sans text-[11px] font-light text-faint">
          {String(Math.min(turned * 2 + 1, total * 2)).padStart(2, '0')} —{' '}
          {String(total * 2).padStart(2, '0')}
        </span>
      </div>

      <div
        ref={stageRef}
        tabIndex={0}
        role="group"
        aria-roledescription="lookbook"
        aria-label={`${title}, ${turned} of ${total} leaves turned`}
        className="book-stage relative mx-auto aspect-[3/2] w-full max-w-5xl rounded-2xl outline-none ring-offset-4 ring-offset-canvas focus-visible:ring-1 focus-visible:ring-gold-500/50"
      >
        {/* Board and gutter. The board is what gives the leaves something to
            cast onto — a book without one reads as floating cards. */}
        <div className="book-gutter absolute inset-0 overflow-hidden rounded-2xl border border-hairline bg-surface-sunken shadow-cinema">
          <div aria-hidden="true" className="absolute inset-0 paper-stock opacity-70" />
          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-gold-500/25 to-transparent"
          />
        </div>

        {/* Left half: the backs of turned leaves. Rendered separately from the
            hinged stack so the settled pages are flat, cheap and always crisp. */}
        <div className="absolute inset-y-0 left-0 w-1/2 overflow-hidden rounded-l-2xl">
          {turned > 0 ? (
            <Face face={leaves[turned - 1].verso} side="left" index={turned * 2} />
          ) : (
            <EndPaper side="left" label={title} />
          )}
        </div>

        {/* Right half: the fronts of untured leaves. */}
        <div className="absolute inset-y-0 right-0 w-1/2 overflow-hidden rounded-r-2xl">
          {turned < total ? (
            <Face face={leaves[turned].recto} side="right" index={turned * 2 + 1} />
          ) : (
            <EndPaper side="right" label="Fin" />
          )}
        </div>

        {/* The hinged stack. Only the leaf adjacent to the hinge on each side
            animates; the rest sit at their resting angle and hold the stacking
            order so a turn passes over them rather than through them. */}
        {leaves.map((leaf, i) => {
          const isTurned = i < turned;
          // The two leaves either side of the hinge are the only ones that can
          // ever be mid-flight, so everything else can skip compositing.
          const live = i === turned || i === turned - 1;
          if (!live) return null;

          return (
            <motion.div
              key={leaf.id}
              aria-hidden="true"
              className="book-leaf pointer-events-none absolute inset-y-0 left-1/2 w-1/2"
              initial={false}
              animate={{ rotateY: isTurned ? -180 : 0 }}
              transition={
                reduced
                  ? { duration: 0 }
                  : { duration: 1.05, ease: [0.65, 0, 0.35, 1] }
              }
              style={{ zIndex: isTurned ? 30 : 40 }}
            >
              {/* Recto — faces the reader before the turn */}
              <div className="absolute inset-0 backface-hidden overflow-hidden rounded-r-2xl">
                <Face face={leaf.recto} side="right" index={i * 2 + 1} />
              </div>

              {/* Verso — pre-rotated so it reads the right way round after the turn */}
              <div className="absolute inset-0 rotate-y-180 backface-hidden overflow-hidden rounded-l-2xl">
                <Face face={leaf.verso} side="left" index={i * 2 + 2} />
              </div>

              {/* Paper shadow that deepens through the middle of the arc, which
                  is what stops the leaf reading as a flat rotating rectangle. */}
              <motion.span
                className="pointer-events-none absolute inset-0"
                animate={{ opacity: flipping ? 0.5 : 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                style={{
                  background:
                    'linear-gradient(90deg, rgb(var(--shadow-color) / 0.7), transparent 55%)',
                }}
              />
            </motion.div>
          );
        })}

        {/* Page-edge stack, so the book has visible thickness on both sides */}
        <Edges side="left" count={turned} />
        <Edges side="right" count={total - turned} />

        {/* Hit targets. Full-height halves rather than small buttons: a book is
            turned by reaching for the page, not by finding a control. */}
        <button
          onClick={() => go(-1)}
          disabled={turned === 0}
          aria-label="Previous spread"
          className="absolute inset-y-0 left-0 z-50 w-[22%] cursor-w-resize disabled:cursor-default"
          data-cursor="Back"
        />
        <button
          onClick={() => go(1)}
          disabled={turned === total}
          aria-label="Next spread"
          className="absolute inset-y-0 right-0 z-50 w-[22%] cursor-e-resize disabled:cursor-default"
          data-cursor="Turn"
        />
      </div>

      {/* Controls and a ribbon progress bar */}
      <div className="mx-auto mt-7 flex max-w-5xl items-center gap-5">
        <button
          onClick={() => go(-1)}
          disabled={turned === 0}
          aria-label="Previous spread"
          className="group flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-hairline text-muted transition-all duration-300 hover:border-gold-500/50 hover:text-accent disabled:opacity-30 disabled:hover:border-hairline disabled:hover:text-muted"
        >
          <ChevronLeft
            size={18}
            strokeWidth={1.6}
            className="transition-transform group-enabled:group-hover:-translate-x-0.5"
          />
        </button>

        <div className="relative h-px flex-1 bg-line">
          <motion.span
            className="absolute inset-y-0 left-0 origin-left bg-gradient-to-r from-gold-600 via-gold-300 to-gold-500"
            animate={{ scaleX: progress }}
            style={{ width: '100%' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
          {/* The bookmark ribbon rides the progress */}
          <motion.span
            aria-hidden="true"
            className="absolute -top-2 h-4 w-1.5 rounded-b-sm bg-accent shadow-gold"
            animate={{ left: `${progress * 100}%` }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

        <button
          onClick={() => go(1)}
          disabled={turned === total}
          aria-label="Next spread"
          className="group flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-hairline text-muted transition-all duration-300 hover:border-gold-500/50 hover:text-accent disabled:opacity-30 disabled:hover:border-hairline disabled:hover:text-muted"
        >
          <ChevronRight
            size={18}
            strokeWidth={1.6}
            className="transition-transform group-enabled:group-hover:translate-x-0.5"
          />
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Face({
  face,
  side,
  index,
}: {
  face: LookbookFace;
  side: 'left' | 'right';
  index: number;
}) {
  const imageOnly = Boolean(face.image) && !face.title && !face.body && !face.quote;

  return (
    <div className="paper-stock relative h-full w-full">
      {face.image && (
        <>
          <Image
            src={face.image}
            alt={face.title ?? face.plate ?? 'Lookbook plate'}
            fill
            sizes="50vw"
            className={`object-cover ${imageOnly ? '' : 'opacity-95'}`}
          />
          {!imageOnly && <div className="media-veil-soft absolute inset-0" />}
        </>
      )}

      {/* Editorial content */}
      {!imageOnly && (
        <div
          className={`relative flex h-full flex-col justify-end p-6 sm:p-8 md:p-10 ${
            side === 'left' ? 'items-start text-left' : 'items-start text-left'
          }`}
        >
          {face.kicker && (
            <span className="mb-3 font-accent text-[9px] uppercase tracking-luxest text-accent">
              {face.kicker}
            </span>
          )}

          {face.title && (
            <h3
              className={`mb-3 font-display font-light leading-[1.1] ${
                face.image ? 'text-on-media' : 'text-primary'
              } text-xl sm:text-2xl md:text-3xl`}
            >
              {face.title}
            </h3>
          )}

          {face.quote && (
            <blockquote
              className={`mb-3 border-l border-gold-500/40 pl-4 font-display text-base italic leading-snug sm:text-lg ${
                face.image ? 'text-on-media-soft' : 'text-secondary'
              }`}
            >
              {face.quote}
            </blockquote>
          )}

          {face.body && (
            <p
              className={`max-w-prose font-sans text-[11px] font-light leading-relaxed sm:text-xs md:text-sm ${
                face.image ? 'text-on-media-muted' : 'text-muted'
              }`}
            >
              {face.body}
            </p>
          )}

          {face.notes && face.notes.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5">
              {face.notes.map((n) => (
                <li
                  key={n}
                  className={`font-accent text-[8px] uppercase tracking-luxe sm:text-[9px] ${
                    face.image ? 'text-on-media-muted' : 'text-faint'
                  }`}
                >
                  {n}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Plate number, printed in the outer margin the way a catalogue does */}
      <span
        className={`nums-tabular pointer-events-none absolute bottom-4 font-accent text-[9px] uppercase tracking-luxe ${
          face.image ? 'text-on-media-muted' : 'text-faint'
        } ${side === 'left' ? 'left-5' : 'right-5'}`}
      >
        {face.plate ?? String(index).padStart(2, '0')}
      </span>
    </div>
  );
}

/** The marbled endpaper behind the cover and after the last leaf. */
function EndPaper({ side, label }: { side: 'left' | 'right'; label: string }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-surface-sunken">
      <div aria-hidden="true" className="absolute inset-0 bg-gold-mesh opacity-40" />
      <div
        aria-hidden="true"
        className="absolute inset-0 animate-foil-shift foil-holo opacity-[0.18]"
      />
      <div className="relative flex flex-col items-center gap-4 px-8 text-center">
        <span
          aria-hidden="true"
          className="block h-2.5 w-2.5 rotate-45 bg-accent shadow-[0_0_14px_3px_rgb(var(--gold-500)/0.5)]"
        />
        <span className="font-accent text-[11px] uppercase tracking-luxest text-accent">
          {label}
        </span>
        <span className="block h-px w-16 bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
        <span className="font-sans text-[10px] font-light italic text-faint">
          {side === 'left' ? 'Aurum, established 1892' : 'Turn back to begin again'}
        </span>
      </div>
    </div>
  );
}

/** Stacked page edges, drawn as hairlines so the book has real thickness. */
function Edges({ side, count }: { side: 'left' | 'right'; count: number }) {
  const shown = Math.min(count, 6);
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-y-3 z-[45] ${
        side === 'left' ? 'left-0' : 'right-0'
      }`}
    >
      {Array.from({ length: shown }).map((_, i) => (
        <span
          key={i}
          className="absolute inset-y-0 w-px bg-gradient-to-b from-transparent via-gold-500/20 to-transparent"
          style={{ [side]: `${-i * 1.6 - 1}px` } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
