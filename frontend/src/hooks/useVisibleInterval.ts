'use client';

import { useEffect, useRef, type RefObject } from 'react';

/**
 * `setInterval`, but only while the thing it updates is somewhere a visitor
 * could see it.
 *
 * This exists because of a measurement that was not what it looked like. Probing
 * the home page while parked at the hero showed twenty-one animations running on
 * elements that were off screen — and the first assumption was that some
 * decorative loop had escaped the visibility gating. It had not. Every one of
 * them was a *one-shot* transition, 300–500ms long, being re-triggered over and
 * over: the testimonials carousel advancing to its next quote, and the live rate
 * readout ticking its digits over. Sections thousands of pixels away were
 * changing their own state on a timer, and each change cost a React render plus a
 * fresh crop of animations, forever, for nobody.
 *
 * A paused CSS animation cannot help with that and neither can a gated canvas
 * loop, because the work does not start in either place — it starts in a timer.
 * So the timer is what has to know whether anyone is watching.
 *
 * Two conditions stop the clock, and both are cases where continuing is pure
 * waste:
 *
 *   The element is far from the viewport. Nothing it changes can be seen, and a
 *   carousel that advanced eleven times while scrolled past has not entertained
 *   anyone — it has just arrived somewhere arbitrary.
 *
 *   The tab is hidden. Browsers already throttle background timers, but throttled
 *   is not stopped, and a throttled tick still renders.
 *
 * On resume the callback is *not* fired to catch up. A carousel should continue
 * from where it was rather than fast-forwarding through the quotes it missed, and
 * a clock reading a live value re-reads it on its next natural tick anyway.
 */
export function useVisibleInterval(
  ref: RefObject<Element | null>,
  callback: () => void,
  /** Milliseconds between ticks. `null` stops the timer entirely. */
  delayMs: number | null,
  options: {
    /** How far outside the viewport the timer keeps running. */
    margin?: string;
    /** Pass the flag that gates the element's render, if it has one. */
    ready?: boolean;
  } = {}
) {
  const { margin = '300px', ready = true } = options;

  // Held in a ref so a re-created callback never restarts the interval — these
  // callbacks close over state setters and a restart would skew the cadence.
  const fn = useRef(callback);
  fn.current = callback;

  useEffect(() => {
    if (!ready || delayMs === null) return;

    const el = ref.current;
    let timer = 0;
    let onScreen = true;

    const tick = () => fn.current();

    const start = () => {
      if (timer) return;
      timer = window.setInterval(tick, delayMs);
    };
    const stop = () => {
      if (!timer) return;
      window.clearInterval(timer);
      timer = 0;
    };

    const sync = () => {
      if (onScreen && !document.hidden) start();
      else stop();
    };

    // No element to observe, or no observer available: behave exactly like a
    // plain interval rather than silently never running.
    let observer: IntersectionObserver | null = null;
    if (el && typeof IntersectionObserver !== 'undefined') {
      onScreen = false;
      observer = new IntersectionObserver(
        ([entry]) => {
          onScreen = entry.isIntersecting;
          sync();
        },
        { rootMargin: margin }
      );
      observer.observe(el);
    }

    document.addEventListener('visibilitychange', sync);
    sync();

    return () => {
      stop();
      observer?.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, [ref, delayMs, margin, ready]);
}
