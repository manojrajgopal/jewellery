'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type AnimationPlaybackControls,
} from 'framer-motion';
import { BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

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

/** A leaf in flight: which one, and which way it is going. */
interface Turn {
  dir: 1 | -1;
  leaf: number;
}

/** Seconds for a full 180° turn. Partial turns are scaled from this. */
const TURN_S = 0.95;

/**
 * The turn's curve.
 *
 * Paper has weight, so the shape matters more than the duration. This is an
 * ease-in-out with a long tail: a little inertia while the leaf is lifted off the
 * stack, fastest as it passes vertical, then a decelerating settle onto the other
 * side. Sampling the previous curve — a high first control point — showed it
 * covering three quarters of the arc in the first third of the time and then
 * crawling the last twenty degrees, which reads as a snap followed by a stall
 * rather than as a page falling over.
 */
const TURN_EASE = [0.5, 0.02, 0.22, 1] as const;
/** Fraction of the arc a drag must cover before releasing commits the turn. */
const COMMIT_AT = 0.4;

/**
 * A bound lookbook whose leaves actually turn.
 *
 * ---------------------------------------------------------------------------
 * Why a settled index plus an in-flight turn, and not one "pages turned" counter
 * ---------------------------------------------------------------------------
 * The obvious model — a single `turned` index with both halves of the spread
 * rendered from it — produces a book that jump-cuts. The index changes the instant
 * the gesture starts, so both halves immediately show the *destination* spread and
 * the rotating leaf is then animated over the top of pages the reader can already
 * see. The turn becomes decoration painted over a cut.
 *
 * A real turn is asymmetric, and that asymmetry is the entire mechanism:
 *
 *   Turning forward, the incoming right-hand page lies *underneath* the leaf, so it
 *   is uncovered immediately — correctly. But the incoming left-hand page is printed
 *   on the *back of the leaf itself*, so it must not appear until the leaf has
 *   landed on top of the old one.
 *
 *   Turning backward the mirror holds: the left half uncovers at once, and the right
 *   half must wait for the leaf to arrive.
 *
 * So one half commits when the gesture starts and the other when the animation ends.
 * There is no way to get that from a single counter, which is why this component
 * carries `settled` and `turn` separately.
 *
 * ---------------------------------------------------------------------------
 * Why the angle is a MotionValue rather than a variant
 * ---------------------------------------------------------------------------
 * Four things must stay locked to the leaf's real rotation: the shadow it casts on
 * the page it is uncovering, the shading across its own surface, the specular line
 * on its leading edge, and the gutter crease. Driving those from a boolean on a
 * timer makes them peak when the timer says rather than when the leaf is actually
 * edge-on, and linger after it has landed. Deriving all four from the one angle
 * makes desynchronisation impossible — and it is the only way the same code can
 * also serve a drag, where there is no timeline to key off at all.
 */
export default function LookbookFlip({
  leaves,
  className = '',
  title = 'The Lookbook',
}: LookbookFlipProps) {
  const total = leaves.length;

  /** Leaves fully turned and at rest. 0 is the opening spread, `total` the back. */
  const [settled, setSettled] = useState(0);
  /** The leaf currently in flight, if any. */
  const [turn, setTurn] = useState<Turn | null>(null);

  const reduced = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);

  /** Live angle of the leaf in flight. 0° = lying in the right half, −180° = left. */
  const angle = useMotionValue(0);
  const playback = useRef<AnimationPlaybackControls | null>(null);

  /* ---------------------------------------------------------------------------
     Everything visual about the turn, derived from that one angle
  --------------------------------------------------------------------------- */
  const arc = useTransform(angle, (a) => Math.abs(a) / 180);
  /** Peaks when the leaf is edge-on, which is when a real page casts furthest. */
  const castOpacity = useTransform(arc, [0, 0.5, 1], [0, 0.45, 0]);
  /** The leaf's own surface darkens as it turns out of the room's light. */
  const leafShade = useTransform(arc, [0, 0.5, 1], [0, 0.36, 0]);
  /** A specular line down the leading edge — the tell that the sheet has thickness. */
  const curlOpacity = useTransform(arc, [0, 0.3, 0.7, 1], [0, 0.6, 0.6, 0]);
  /** The crease deepens while a leaf is standing up out of it. */
  const creaseOpacity = useTransform(arc, [0, 0.5, 1], [0.24, 0.62, 0.24]);
  /**
   * Counter-scale against perspective magnification.
   *
   * A leaf hinged at the spine swings its outer edge a half-width toward the camera,
   * and the perspective divisor makes it bigger as it comes — so without this the
   * turning page grows visibly past the board it is bound into, which is the one
   * thing that gives away a fake book. Cancelling it completely would look wrong too
   * (the lift is real and worth seeing), so this removes most of it and leaves a few
   * per cent of genuine growth at the midpoint.
   */
  const counterScale = useTransform(arc, [0, 0.5, 1], [1, 0.9, 1]);
  const leafShadeBg = useMotionTemplate`linear-gradient(90deg, rgb(var(--shadow-color) / ${leafShade}), transparent 64%)`;

  /* ---------------------------------------------------------------------------
     Which faces each half shows
  --------------------------------------------------------------------------- */

  /**
   * Bottom-to-top leaf indices for each half.
   *
   * The neighbour underneath stays mounted at all times rather than being added when
   * a turn begins. Mounting it late means its photograph starts downloading at the
   * exact moment it is uncovered — a blank page for as long as the fetch takes. It is
   * also simply what a book is: a stack, with the next page already under this one.
   */
  const rightStack = useMemo(() => {
    // Forward: the leaf at `settled` has lifted off, exposing the page beneath.
    if (turn?.dir === 1) return [settled + 1];
    // Otherwise the current recto stays on top. During a backward turn the arriving
    // leaf carries its own recto, so this half must not pre-empt it.
    return [settled + 1, settled];
  }, [settled, turn]);

  const leftStack = useMemo(() => {
    // Backward: the leaf at `settled − 1` has lifted, exposing the verso beneath.
    if (turn?.dir === -1) return [settled - 2];
    // Forward: the old verso stays until the leaf lands on top of it.
    return [settled - 2, settled - 1];
  }, [settled, turn]);

  /* ---------------------------------------------------------------------------
     Turning
  --------------------------------------------------------------------------- */

  const finish = useCallback(
    (t: Turn, commit: boolean) => {
      if (commit) setSettled((s) => s + t.dir);
      setTurn(null);
      angle.set(0);
    },
    [angle]
  );

  /** Animate the in-flight leaf home, then either commit the turn or abandon it. */
  const release = useCallback(
    (t: Turn, commit: boolean) => {
      const to = commit ? (t.dir === 1 ? -180 : 0) : t.dir === 1 ? 0 : -180;

      if (reduced) {
        finish(t, commit);
        return;
      }

      // Scaled by the distance still to travel, so a leaf released near the end of
      // its arc falls the last few degrees quickly instead of taking a full second.
      const remaining = Math.abs(to - angle.get()) / 180;

      playback.current?.stop();
      playback.current = animate(angle, to, {
        duration: Math.max(0.2, TURN_S * remaining),
        // A leaf released part-way is already moving, so it should not ease *in*
        // again from a standstill — only the tail of the curve applies.
        ease: remaining > 0.9 ? [...TURN_EASE] : [0.22, 0.61, 0.24, 1],
        onComplete: () => finish(t, commit),
      });
    },
    [angle, reduced, finish]
  );

  /**
   * A turn started by a click or a key, as opposed to a drag.
   *
   * The animation is not started here. It is started by the effect below, once the
   * leaf has actually mounted at its start angle — kicking it off in the same tick
   * as `setTurn` means the value is already moving before the element exists to
   * follow it, and the first frames of the turn are lost.
   */
  const pending = useRef<Turn | null>(null);

  const go = useCallback(
    (dir: 1 | -1) => {
      // Gated on the real in-flight state, not on a timer. The previous version used
      // a 700ms cooldown against a 1050ms animation, so a second turn could begin
      // while the first was still visibly moving.
      if (turn) return;
      const next = settled + dir;
      if (next < 0 || next > total) return;

      if (reduced) {
        setSettled(next);
        return;
      }

      const t: Turn = { dir, leaf: dir === 1 ? settled : settled - 1 };
      angle.set(dir === 1 ? 0 : -180);
      pending.current = t;
      setTurn(t);
    },
    [turn, settled, total, angle, reduced]
  );

  useEffect(() => {
    if (!turn || pending.current !== turn) return;
    pending.current = null;
    release(turn, true);
  }, [turn, release]);

  useEffect(() => () => playback.current?.stop(), []);

  /* ---------------------------------------------------------------------------
     Drag, swipe and tap
  --------------------------------------------------------------------------- */

  const drag = useRef<{
    id: number;
    startX: number;
    startY: number;
    /** Half the stage's width — the travel that maps to a full 180°. */
    reach: number;
    dir: 1 | -1;
    /** Set once the gesture has proved itself a horizontal page drag. */
    locked: boolean;
    /** Set once we have handed the gesture back, e.g. it was a scroll. */
    abandoned: boolean;
    turn: Turn | null;
  } | null>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    if (turn || e.button !== 0) return;
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    // Which half was grabbed decides the direction — reaching for the right-hand
    // page turns forward, the left-hand page turns back.
    const dir: 1 | -1 = e.clientX - r.left > r.width / 2 ? 1 : -1;
    const next = settled + dir;
    if (next < 0 || next > total) return;

    drag.current = {
      id: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      reach: r.width / 2,
      dir,
      locked: false,
      abandoned: false,
      turn: null,
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId || d.abandoned) return;

    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;

    if (!d.locked) {
      // Direction lock. Until a gesture proves itself horizontal it belongs to the
      // page, so a vertical swipe over the book scrolls instead of tearing at a leaf.
      // `touch-action: pan-y` on the stage is the other half of this contract.
      if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) {
        d.abandoned = true;
        return;
      }
      if (Math.abs(dx) < 8) return;
      // A forward turn is a leftward drag and vice versa. Dragging the wrong way is
      // not a turn — hand it back rather than starting one that cannot commit.
      if ((d.dir === 1 && dx > 0) || (d.dir === -1 && dx < 0)) {
        d.abandoned = true;
        return;
      }

      d.locked = true;

      // The turn is set up *before* capture is attempted, and capture is wrapped.
      // `setPointerCapture` throws NotFoundError whenever the pointer is no longer
      // active — a fast flick whose pointerup has already been delivered, a
      // synthesised event, some pen and touch stacks. Calling it first meant that
      // throw escaped the handler and left `d.locked` true with `d.turn` still null,
      // so the release path fell through to "this was a tap" and turned a whole page
      // for what the reader intended as a short drag. Capture is a nicety here; the
      // handlers are on the stage and the gesture survives without it.
      const t: Turn = { dir: d.dir, leaf: d.dir === 1 ? settled : settled - 1 };
      d.turn = t;
      angle.set(d.dir === 1 ? 0 : -180);
      setTurn(t);

      try {
        (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
      } catch {
        /* pointer already gone — the drag still tracks via the stage handlers */
      }
    }

    // Horizontal travel across half the book maps onto the full arc.
    const travelled = Math.min(Math.abs(dx) / d.reach, 1);
    angle.set(d.dir === 1 ? -180 * travelled : -180 * (1 - travelled));
  };

  const endDrag = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;

    if (d.abandoned) return;

    // Never travelled far enough to lock, so it was a tap on that half. Readers
    // reach for a page far more often than they drag it, so this is the common path.
    if (!d.locked || !d.turn) {
      go(d.dir);
      return;
    }

    // How far the leaf actually got, measured in the direction of travel. Getting
    // this the wrong way round for backward turns is easy: a backward turn *starts*
    // at a full arc of 1 and works down toward 0, so its progress is the complement.
    const arcNow = Math.abs(angle.get()) / 180;
    const travelled = d.dir === 1 ? arcNow : 1 - arcNow;
    release(d.turn, travelled > COMMIT_AT);
  };

  /* ---------------------------------------------------------------------------
     Keyboard
  --------------------------------------------------------------------------- */
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (!el.contains(document.activeElement)) return;
      switch (e.key) {
        case 'ArrowRight':
        case 'PageDown':
          e.preventDefault();
          go(1);
          break;
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          go(-1);
          break;
        case 'Home':
          e.preventDefault();
          if (!turn) setSettled(0);
          break;
        case 'End':
          e.preventDefault();
          if (!turn) setSettled(total);
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, turn, total]);

  /* ---------------------------------------------------------------------------
     Labels
  --------------------------------------------------------------------------- */

  // A spread shows the verso of leaf settled−1 on the left and the recto of leaf
  // settled on the right — printed pages 2·settled and 2·settled+1.
  const leftPage = settled === 0 ? null : settled * 2;
  const rightPage = settled === total ? null : settled * 2 + 1;
  const spreadLabel =
    leftPage && rightPage
      ? `Pages ${leftPage} and ${rightPage} of ${total * 2}`
      : rightPage
        ? `Front endpaper and page ${rightPage} of ${total * 2}`
        : `Page ${leftPage} of ${total * 2}, and the back endpaper`;

  const progress = total === 0 ? 0 : settled / total;
  const flying = turn ? leaves[turn.leaf] : null;

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
          {leftPage ? String(leftPage).padStart(2, '0') : '—'}
          {' · '}
          {rightPage ? String(rightPage).padStart(2, '0') : '—'}
          <span className="ml-2 opacity-70">of {String(total * 2).padStart(2, '0')}</span>
        </span>
      </div>

      {/* The spread, announced politely so a reader turning several pages in a row is
          not interrupted on every one. */}
      <p aria-live="polite" className="sr-only">
        {spreadLabel}
      </p>

      <div
        ref={stageRef}
        tabIndex={0}
        role="group"
        aria-roledescription="lookbook"
        aria-label={`${title}. ${spreadLabel}. Drag a page, click either side, or use the arrow keys.`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        // pan-y, not none: vertical scrolling over the book has to keep working, and
        // the direction lock above claims only horizontal gestures.
        style={{ touchAction: 'pan-y' }}
        className="book-stage relative mx-auto aspect-[3/2] w-full max-w-5xl cursor-grab-x select-none rounded-2xl outline-none ring-offset-4 ring-offset-canvas focus-visible:ring-1 focus-visible:ring-gold-500/50"
      >
        {/* Board. The leaves need something to cast onto, or they read as floating
            cards rather than as bound paper. */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl border border-hairline bg-surface-sunken shadow-cinema">
          <div aria-hidden="true" className="absolute inset-0 paper-stock opacity-70" />
        </div>

        {/* ---- Left half ----
            `data-book` marks the three surfaces whose *timing* is the mechanism of
            this component: the two settled halves and the leaf between them. They are
            here so the asymmetric commit — left waits for the leaf, right uncovers at
            once — can be asserted from outside rather than eyeballed. */}
        <div
          data-book="left"
          className="absolute inset-y-0 left-0 z-10 w-1/2 overflow-hidden rounded-l-2xl"
        >
          {leftStack.map((i) => (
            <div key={`l-${i}`} className="absolute inset-0">
              {i >= 0 && i < total ? (
                <Face face={leaves[i].verso} side="left" page={i * 2 + 2} />
              ) : i < 0 ? (
                <EndPaper side="left" label={title} />
              ) : null}
            </div>
          ))}
        </div>

        {/* ---- Right half ---- */}
        <div
          data-book="right"
          className="absolute inset-y-0 right-0 z-10 w-1/2 overflow-hidden rounded-r-2xl"
        >
          {rightStack.map((i) => (
            <div key={`r-${i}`} className="absolute inset-0">
              {i >= 0 && i < total ? (
                <Face face={leaves[i].recto} side="right" page={i * 2 + 1} />
              ) : i >= total ? (
                <EndPaper side="right" label="Fin" />
              ) : null}
            </div>
          ))}
        </div>

        {/* ---- Cast shadow ----
            What the standing leaf throws across the page it is uncovering. It belongs
            to the half being revealed, so it sits above the settled pages and below
            the leaf, and it is anchored at the gutter. */}
        {turn && (
          <motion.div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-y-0 z-20 w-1/2 ${
              turn.dir === 1 ? 'right-0' : 'left-0'
            }`}
            style={{
              opacity: castOpacity,
              background:
                turn.dir === 1
                  ? 'linear-gradient(90deg, rgb(var(--shadow-color) / 0.9), transparent 58%)'
                  : 'linear-gradient(270deg, rgb(var(--shadow-color) / 0.9), transparent 58%)',
            }}
          />
        )}

        {/* ---- The leaf in flight ----
            Exactly one, and only while a turn is happening. The previous version kept
            two leaves permanently mounted at their resting angles, which duplicated
            whatever the static halves were already showing and left two compositor
            layers rotating where one belongs. */}
        {flying && turn && (
          <motion.div
            key={flying.id}
            aria-hidden="true"
            data-book="leaf"
            data-dir={turn.dir}
            className="book-leaf pointer-events-none absolute inset-y-0 left-1/2 z-30 w-1/2"
            style={{ rotateY: angle, scale: counterScale }}
          >
            {/* The faces are square-cornered on purpose. Rounding them put a notch at
                the spine, where a bound page is cut straight — and which local corner
                maps to the outer edge differs between the recto and the mirrored
                verso, so "round the outside" is not one rule. The rounded silhouette
                belongs to the settled halves, which are not transformed. */}
            <div className="book-face">
              <Face face={flying.recto} side="right" page={turn.leaf * 2 + 1} />
            </div>

            {/* Verso — pre-flipped so the leaf's own −180° leaves it readable */}
            <div className="book-face book-face-verso">
              <Face face={flying.verso} side="left" page={turn.leaf * 2 + 2} />
            </div>

            {/* Shading across the leaf's own surface */}
            <motion.span
              className="pointer-events-none absolute inset-0"
              style={{ background: leafShadeBg }}
            />

            {/* Specular line on the leading edge */}
            <motion.span
              className="pointer-events-none absolute inset-y-0 right-0 w-[3px] bg-gradient-to-l from-gold-100/80 to-transparent"
              style={{ opacity: curlOpacity }}
            />
          </motion.div>
        )}

        {/* ---- Gutter crease ----
            Above the pages so it creases them, below the leaf so a leaf standing out
            of the gutter is not darkened by the crease it has just left. */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-1/2 z-[25] w-24 -translate-x-1/2"
          style={{ opacity: creaseOpacity }}
        >
          <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-l from-ink-950/45 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-r from-ink-950/45 to-transparent" />
          <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-gold-500/25 to-transparent" />
        </motion.div>

        {/* Page-edge stack, so the book has visible thickness on both sides */}
        <Edges side="left" count={settled} />
        <Edges side="right" count={total - settled} />

        {/* Reach affordances. Cursor and hover hint only — deliberately *not*
            buttons with click handlers. A transparent button over the leaf would fire
            its own click after a drag released on top of it, turning two pages for one
            gesture. Taps are handled by the pointer handlers on the stage, which
            already know whether the gesture became a drag. */}
        <div
          aria-hidden="true"
          data-cursor="Back"
          className={`absolute inset-y-0 left-0 z-[26] w-[20%] ${
            settled === 0 ? '' : 'cursor-w-resize'
          }`}
        />
        <div
          aria-hidden="true"
          data-cursor="Turn"
          className={`absolute inset-y-0 right-0 z-[26] w-[20%] ${
            settled === total ? '' : 'cursor-e-resize'
          }`}
        />
      </div>

      {/* Controls and a ribbon that rides the progress */}
      <div className="mx-auto mt-7 flex max-w-5xl items-center gap-5">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={settled === 0 || Boolean(turn)}
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
            className="absolute inset-y-0 left-0 w-full origin-left bg-gradient-to-r from-gold-600 via-gold-300 to-gold-500"
            animate={{ scaleX: progress }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
          {/* The bookmark rides a full-width carrier on `x`, so the percentage
              resolves against the rail and the whole thing stays a transform.
              Animating the marker's own `left` meant a layout pass per frame. */}
          <motion.div
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-full"
            animate={{ x: `${progress * 100}%` }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="absolute -top-2 left-0 h-4 w-1.5 -translate-x-1/2 rounded-b-sm bg-accent shadow-gold" />
          </motion.div>
        </div>

        <button
          type="button"
          onClick={() => go(1)}
          disabled={settled === total || Boolean(turn)}
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

      <p className="mx-auto mt-4 max-w-5xl text-center font-sans text-[10px] font-light italic text-faint">
        Drag a page across, press either side, or use the arrow keys.
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Face({
  face,
  side,
  page,
}: {
  face: LookbookFace;
  side: 'left' | 'right';
  page: number;
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
            sizes="(max-width: 1024px) 50vw, 512px"
            draggable={false}
            className={`drag-none object-cover ${imageOnly ? '' : 'opacity-95'}`}
          />
          {!imageOnly && <div className="media-veil-soft absolute inset-0" />}
        </>
      )}

      {!imageOnly && (
        <div className="relative flex h-full flex-col items-start justify-end p-6 text-left sm:p-8 md:p-10">
          {face.kicker && (
            <span className="mb-3 font-accent text-[9px] uppercase tracking-luxest text-accent">
              {face.kicker}
            </span>
          )}

          {face.title && (
            <h3
              className={`mb-3 font-display text-xl font-light leading-[1.1] sm:text-2xl md:text-3xl ${
                face.image ? 'text-on-media' : 'text-primary'
              }`}
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

      {/* Folio, printed in the outer margin the way a catalogue does */}
      <span
        className={`nums-tabular pointer-events-none absolute bottom-4 font-accent text-[9px] uppercase tracking-luxe ${
          face.image ? 'text-on-media-muted' : 'text-faint'
        } ${side === 'left' ? 'left-5' : 'right-5'}`}
      >
        {face.plate ?? String(page).padStart(2, '0')}
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

/**
 * Stacked page edges, so the book has visible thickness that grows as it is read.
 *
 * Drawn *inside* the outer margin rather than outside it. The previous version
 * offset them negatively, which put every hairline beyond the board's own edge where
 * nothing was rendered — the block was invisible at every position, so the book
 * always looked one page thick.
 */
function Edges({ side, count }: { side: 'left' | 'right'; count: number }) {
  const shown = Math.min(count, 5);
  if (shown === 0) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-y-2 z-[15] ${
        side === 'left' ? 'left-0' : 'right-0'
      }`}
    >
      {Array.from({ length: shown }).map((_, i) => (
        <span
          key={i}
          className="absolute inset-y-0 w-px bg-gradient-to-b from-transparent via-gold-200/30 to-transparent"
          style={
            {
              // Innermost line faintest, so the block recedes rather than reading as
              // a set of evenly-weighted rules.
              [side]: `${i * 1.8 + 1}px`,
              opacity: 1 - i * 0.16,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
