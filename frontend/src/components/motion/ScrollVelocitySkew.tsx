'use client';

import { useEffect } from 'react';

import { onFrame } from '@/lib/frameLoop';
import { getPerfBudget } from '@/lib/perf';

/**
 * Global scroll-inertia: fast scrolling skews and squashes the page a touch,
 * and it settles as the scroll does.
 *
 * Mounted once at the root. Rather than wrapping the tree in a transform — which
 * would create a containing block and break every `fixed` element on the site —
 * this writes two CSS variables that individual opted-in elements read via the
 * `.velocity-skew` utility. Nothing moves unless it asked to.
 *
 * The loop is deliberately not permanent. Writing a custom property on the root
 * element invalidates style for every node that could inherit it, which on the
 * home page is the entire document — so a loop that ran unconditionally at 60fps
 * was asking the browser to re-resolve eight thousand elements sixty times a
 * second for the whole life of the page, including while it sat perfectly still.
 * That single detail was the largest fixed cost on the site.
 *
 * So: the loop starts on the first scroll event and retires itself once the
 * filtered velocity has settled and the variables are back at rest. The effect
 * is identical — the skew only ever has a value while the page is moving — but
 * an idle page now costs nothing at all.
 */
export default function ScrollVelocitySkew({ max = 4 }: { max?: number }) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const root = document.documentElement;
    let last = window.scrollY;
    let velocity = 0;
    let stopLoop: (() => void) | null = null;
    // Only write when the rendered value actually changes. At three decimal
    // places a slow scroll produces long runs of identical strings, and each
    // one would otherwise cost a full document style invalidation for nothing.
    let lastSkew = '';
    let lastSquash = '';
    // Frames spent already at rest. One is not enough: the low-pass filter
    // crosses zero on the way through, so a single quiet frame mid-scroll
    // would retire the loop and drop the settle animation.
    let settled = 0;

    const write = (skew: string, squash: string) => {
      if (skew !== lastSkew) {
        root.style.setProperty('--scroll-skew', skew);
        lastSkew = skew;
      }
      if (squash !== lastSquash) {
        root.style.setProperty('--scroll-squash', squash);
        lastSquash = squash;
      }
    };

    const step = (dt: number) => {
      const now = window.scrollY;
      const delta = now - last;
      last = now;

      // Low-pass filter. Raw per-frame delta is far too jumpy to drive a
      // transform; the lerp gives the skew weight on the way in and out.
      // Scaled by elapsed time so a device running the loop at 30fps settles
      // over the same wall-clock duration as one running it at 60.
      const lerp = Math.min(1, 0.14 * (dt / 16.667));
      velocity += (delta - velocity) * lerp;
      const clamped = Math.max(-max, Math.min(max, velocity * 0.32));

      write(
        `${clamped.toFixed(3)}deg`,
        (1 - Math.min(Math.abs(clamped) / 100, 0.03)).toFixed(4)
      );

      if (Math.abs(velocity) < 0.05 && Math.abs(delta) < 0.5) {
        settled += 1;
        if (settled > 8) {
          // Land exactly on rest before leaving, so nothing is left skewed by
          // a rounding-sized amount.
          velocity = 0;
          write('0deg', '1');
          stopLoop?.();
          stopLoop = null;
        }
      } else {
        settled = 0;
      }
    };

    const onScroll = () => {
      if (stopLoop) return;
      last = window.scrollY;
      settled = 0;
      // order: 10 — ahead of the decorative scenes, so any element reading the
      // variables this frame reads the value for this frame rather than the
      // previous one.
      stopLoop = onFrame(step, { fps: getPerfBudget().fps, order: 10 });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // Wheel and touch start the loop a frame earlier than the scroll event
    // does, which is the difference between the skew easing in and appearing.
    window.addEventListener('wheel', onScroll, { passive: true });
    window.addEventListener('touchmove', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', onScroll);
      window.removeEventListener('touchmove', onScroll);
      stopLoop?.();
      root.style.removeProperty('--scroll-skew');
      root.style.removeProperty('--scroll-squash');
    };
  }, [max]);

  return null;
}
