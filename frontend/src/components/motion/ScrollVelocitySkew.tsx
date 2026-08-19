'use client';

import { useEffect } from 'react';

/**
 * Global scroll-inertia: fast scrolling skews and squashes the page a touch,
 * and it settles as the scroll does.
 *
 * Mounted once at the root. Rather than wrapping the tree in a transform — which
 * would create a containing block and break every `fixed` element on the site —
 * this writes two CSS variables that individual opted-in elements read via the
 * `.velocity-skew` utility. Nothing moves unless it asked to.
 */
export default function ScrollVelocitySkew({ max = 4 }: { max?: number }) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let last = window.scrollY;
    let velocity = 0;
    let raf = 0;
    const root = document.documentElement;

    const loop = () => {
      const now = window.scrollY;
      const delta = now - last;
      last = now;

      // Low-pass filter. Raw per-frame delta is far too jumpy to drive a
      // transform; the lerp gives the skew weight on the way in and out.
      velocity += (delta - velocity) * 0.14;
      const clamped = Math.max(-max, Math.min(max, velocity * 0.32));

      root.style.setProperty('--scroll-skew', `${clamped.toFixed(3)}deg`);
      root.style.setProperty(
        '--scroll-squash',
        (1 - Math.min(Math.abs(clamped) / 100, 0.03)).toFixed(4)
      );
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      root.style.removeProperty('--scroll-skew');
      root.style.removeProperty('--scroll-squash');
    };
  }, [max]);

  return null;
}
