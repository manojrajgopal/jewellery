'use client';

import { useEffect } from 'react';

/**
 * Lightweight inertial scrolling — no extra dependency.
 * Intercepts wheel input and eases window.scrollY toward a target, which gives
 * the whole site the slow, weighted feel of a luxury showcase. Disabled for
 * touch, reduced-motion, and any element that scrolls internally.
 */
export default function SmoothScroll({ strength = 0.085 }: { strength?: number }) {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    if (reduced || coarse) return;

    let target = window.scrollY;
    let current = window.scrollY;
    let raf = 0;
    let running = false;

    const maxScroll = () =>
      Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    const loop = () => {
      current += (target - current) * strength;
      if (Math.abs(target - current) < 0.4) {
        current = target;
        running = false;
        window.scrollTo(0, current);
        return;
      }
      window.scrollTo(0, current);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };

    const onWheel = (e: WheelEvent) => {
      // Let modifier gestures (pinch-zoom, horizontal trackpad) behave natively.
      if (e.ctrlKey || e.metaKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      // Respect anything with its own scrollbar (modals, code blocks, tab rails).
      let node = e.target as HTMLElement | null;
      while (node && node !== document.body) {
        const style = getComputedStyle(node);
        const scrollable = /(auto|scroll|overlay)/.test(style.overflowY);
        if (scrollable && node.scrollHeight > node.clientHeight + 1) return;
        node = node.parentElement;
      }

      e.preventDefault();
      target = Math.min(maxScroll(), Math.max(0, target + e.deltaY));
      start();
    };

    // Keyboard, anchor jumps and programmatic scrolls resync the target.
    const resync = () => {
      if (!running) {
        target = window.scrollY;
        current = window.scrollY;
      }
    };

    document.documentElement.classList.add('has-smooth-scroll');
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('resize', resync);
    window.addEventListener('keydown', resync);
    window.addEventListener('touchstart', resync, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove('has-smooth-scroll');
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', resync);
      window.removeEventListener('keydown', resync);
      window.removeEventListener('touchstart', resync);
    };
  }, [strength]);

  return null;
}
