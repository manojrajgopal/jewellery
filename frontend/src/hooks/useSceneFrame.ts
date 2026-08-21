'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';

import { onFrame, type FrameOptions } from '@/lib/frameLoop';
import { getPerfBudget, getPerfTier, onPerfTierChange, type PerfTier } from '@/lib/perf';

/**
 * The three questions every decorative canvas on this site needs answered, in
 * one place: is my section anywhere near the viewport, how much detail may I
 * draw, and when is my next frame.
 *
 * `useOnScreen` already answered the first for the handful of scenes that
 * thought to ask. The rest painted continuously from mount, which is why a page
 * with thirty-five of them spent its entire frame budget on scenes nobody could
 * see. This makes the gated path the easy one to write.
 */

/** Live perf tier, re-rendering the caller if the device is demoted mid-session. */
export function usePerfTier(): PerfTier {
  const [tier, setTier] = useState<PerfTier>(() => getPerfTier());

  useEffect(() => {
    // The pre-paint script has run by now; the state initialiser may have run
    // during SSR, where it could only guess.
    setTier(getPerfTier());
    const off = onPerfTierChange(setTier);
    return () => {
      off();
    };
  }, []);

  return tier;
}

/** The tier's full budget, as a stable object across re-renders of one tier. */
export function usePerfBudget() {
  const tier = usePerfTier();
  return getPerfBudget(tier);
}

export interface SceneFrameOptions extends FrameOptions {
  /**
   * How far outside the viewport the scene starts painting. Generous by
   * default so a scene is already in motion by the time it is scrolled to —
   * a canvas that starts from a standstill in view is worse than one that
   * never stopped.
   */
  margin?: string;
  /** Pass the same flag that gates the element's render, if it has one. */
  ready?: boolean;
  /** Skip the loop entirely without unmounting (reduced motion, disabled). */
  paused?: boolean;
}

/**
 * Run `draw` on the shared frame loop, but only while `ref`'s element is near
 * the viewport and the tab is visible.
 *
 * `draw` receives a normalised step: 1 means "one 60fps frame's worth of time
 * has passed". Loops that integrate per frame (`x += vx`) multiply by it and
 * keep the same real-world speed whether they are running at 60fps on a desktop
 * or 30fps on a phone, which is what stops throttling from turning into
 * slow motion.
 */
export function useSceneFrame(
  ref: RefObject<Element | null>,
  draw: (step: number, now: number) => void,
  options: SceneFrameOptions = {}
) {
  const { margin, ready = true, paused = false, fps, order } = options;
  const budget = usePerfBudget();
  const resolvedMargin = margin ?? `${Math.round(budget.prefetchMargin * 0.35)}px`;

  const [onScreen, setOnScreen] = useState(false);

  // Held in a ref so a re-created draw closure never restarts the loop — these
  // callbacks close over per-frame state and a restart would visibly reset it.
  const drawRef = useRef(draw);
  drawRef.current = draw;

  useEffect(() => {
    if (!ready) return;
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setOnScreen(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { rootMargin: resolvedMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, resolvedMargin, ready]);

  useEffect(() => {
    if (!ready || paused || !onScreen) return;
    return onFrame((dt, now) => drawRef.current(Math.min(dt / 16.667, 3), now), {
      fps: fps ?? budget.fps,
      order,
    });
  }, [ready, paused, onScreen, fps, order, budget.fps]);

  return onScreen;
}
