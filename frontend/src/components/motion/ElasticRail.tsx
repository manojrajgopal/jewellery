'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface ElasticRailProps {
  children: React.ReactNode;
  className?: string;
  /** Aria label for the rail, since it is a scrollable region. */
  label: string;
  /** Gap between items, in px. Also used for the snap pitch. */
  gap?: number;
  /** Snap to item edges when the throw ends. */
  snap?: boolean;
  /** Show the tick rail and arrow controls under the strip. */
  controls?: boolean;
}

/**
 * A drag rail with real overscroll.
 *
 * Every horizontal rail on this site so far is either a native scroll container
 * with snap points or a scroll-linked translate. Both are correct and neither
 * has *give*: pull a native container past its end and it simply stops, which
 * on a page about physical objects is the one moment the illusion drops.
 *
 * So the travel here is a motion value this component owns, and the two rules
 * that make it feel like a weighted drawer are:
 *
 *  1. Past either end, the drag is divided rather than clamped. Pulling 200px
 *     beyond the edge moves the strip 60, so the resistance is felt rather
 *     than announced, and the strip springs back on release.
 *  2. The throw carries velocity into a decay, and the resting point is then
 *     snapped to the nearest item edge. Snapping the *target* rather than the
 *     position is what stops the familiar jerk at the end of a flick — the item
 *     is already arriving where it will stop.
 *
 * The strip is also a real focus scope: the arrows move by one page, and the
 * tick rail underneath reports position without being interactive furniture.
 */
export default function ElasticRail({
  children,
  className = '',
  label,
  gap = 24,
  snap = true,
  controls = true,
}: ElasticRailProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const x = useMotionValue(0);
  const smooth = useSpring(x, { stiffness: 220, damping: 32, mass: 0.7 });
  const travel = reduced ? x : smooth;

  const [limit, setLimit] = useState(0);
  const [pos, setPos] = useState(0);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startVal = useRef(0);
  const lastMove = useRef({ t: 0, x: 0, v: 0 });

  const progress = useTransform(travel, (v) => (limit ? Math.min(1, Math.max(0, -v / limit)) : 0));

  /**
   * The tick's own travel. Emitted as a `calc` string rather than px because the
   * distance available to it is the rail's width minus the tick's own, and only
   * CSS knows the first of those. Declared here rather than beside the markup:
   * the tick rail is conditional, and a hook inside a conditional is a hook that
   * sometimes does not run.
   */
  const tickX = useTransform(progress, (v) =>
    limit > 0 ? `calc(${(v * 100).toFixed(2)}% - ${(v * 4).toFixed(2)}rem)` : '0px'
  );

  /** Item pitch: first child's width plus the gap, so snapping lands on edges. */
  const pitch = useCallback(() => {
    const first = trackRef.current?.firstElementChild as HTMLElement | null;
    return first ? first.offsetWidth + gap : 320;
  }, [gap]);

  const measure = useCallback(() => {
    const vp = viewportRef.current;
    const track = trackRef.current;
    if (!vp || !track) return;
    setLimit(Math.max(0, track.scrollWidth - vp.clientWidth));
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (viewportRef.current) ro.observe(viewportRef.current);
    if (trackRef.current) ro.observe(trackRef.current);
    return () => ro.disconnect();
  }, [measure]);

  useEffect(() => {
    const unsub = travel.on('change', (v) => setPos(v));
    return unsub;
  }, [travel]);

  /** Clamp with give: outside the range, movement is divided rather than stopped. */
  const withResistance = (raw: number) => {
    if (raw > 0) return raw / 3.4;
    if (raw < -limit) return -limit + (raw + limit) / 3.4;
    return raw;
  };

  const settle = (target: number) => {
    let next = Math.min(0, Math.max(-limit, target));
    if (snap && limit > 0) {
      const p = pitch();
      next = Math.min(0, Math.max(-limit, -Math.round(-next / p) * p));
    }
    x.set(next);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (limit <= 0) return;
    dragging.current = true;
    startX.current = e.clientX;
    startVal.current = x.get();
    lastMove.current = { t: performance.now(), x: e.clientX, v: 0 };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const now = performance.now();
    const dt = now - lastMove.current.t;
    if (dt > 0) {
      lastMove.current.v = (e.clientX - lastMove.current.x) / dt;
      lastMove.current = { t: now, x: e.clientX, v: lastMove.current.v };
    }
    x.set(withResistance(startVal.current + (e.clientX - startX.current)));
  };

  const onPointerUp = () => {
    if (!dragging.current) return;
    dragging.current = false;
    // Velocity in px/ms → a decay distance. 180 is the constant that makes a
    // flick travel about a screen and a half, which reads as "thrown" without
    // losing the visitor's place in the strip.
    settle(x.get() + lastMove.current.v * 180);
  };

  const page = (dir: -1 | 1) => {
    const vp = viewportRef.current;
    if (!vp) return;
    settle(x.get() - dir * Math.max(pitch(), vp.clientWidth * 0.8));
  };

  const atStart = pos >= -1;
  const atEnd = limit <= 0 || pos <= -limit + 1;

  return (
    <div className={`relative ${className}`}>
      <div
        ref={viewportRef}
        role="group"
        aria-label={label}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className={`mask-fade-x overflow-hidden ${limit > 0 ? 'cursor-grab-x' : ''}`}
      >
        <motion.div
          ref={trackRef}
          style={{ x: travel, gap }}
          className="flex w-max items-stretch will-transform"
        >
          {children}
        </motion.div>
      </div>

      {controls && limit > 0 && (
        <div className="mt-6 flex items-center gap-5">
          {/* The tick rail. Reports position; deliberately not a control — a
              draggable scrollbar under a draggable strip is two mechanisms
              competing for the same gesture. */}
          <div className="relative h-px flex-1 bg-line/60" aria-hidden="true">
            <motion.span
              className="absolute inset-y-[-1px] left-0 block w-16 bg-accent"
              style={{ x: tickX }}
            />
          </div>

          <span className="nums-tabular font-accent text-[10px] uppercase tracking-luxe text-faint">
            {Math.round((limit ? -pos / limit : 0) * 100)}%
          </span>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => page(-1)}
              disabled={atStart}
              aria-label="Previous"
              className="grid h-9 w-9 place-items-center rounded-full border border-hairline text-muted transition-colors duration-300 hover:border-accent/50 hover:text-accent disabled:opacity-30"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => page(1)}
              disabled={atEnd}
              aria-label="Next"
              className="grid h-9 w-9 place-items-center rounded-full border border-hairline text-muted transition-colors duration-300 hover:border-accent/50 hover:text-accent disabled:opacity-30"
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
