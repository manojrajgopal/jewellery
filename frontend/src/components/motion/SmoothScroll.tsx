'use client';

import { useEffect } from 'react';

import { onFrame } from '@/lib/frameLoop';
import { getPerfTier } from '@/lib/perf';
import { isScrollControlled } from '@/lib/scrollControl';

/**
 * Lightweight inertial scrolling — no extra dependency.
 * Intercepts wheel input and eases window.scrollY toward a target, which gives
 * the whole site the slow, weighted feel of a luxury showcase. Disabled for
 * touch, reduced-motion, and any element that scrolls internally.
 *
 * Two things about it were expensive enough to matter, and both are fixed here
 * without touching how it feels.
 *
 * The first is the internal-scroller check. It walked from the event target to
 * the body calling getComputedStyle on every ancestor, on every wheel event —
 * each call a forced style resolution, and a wheel gesture fires dozens of
 * events. On a page with eight thousand nodes and a deep tree that was the
 * single most expensive thing happening during a scroll. The answer, though, is
 * a property of the element, not of the gesture: it is cached per element and
 * invalidated when the layout could have changed.
 *
 * The second is that easing the scroll in JavaScript means every scroll-linked
 * transform on the page — and there are dozens — recomputes on a frame the main
 * thread is already holding. On a capable device that is a fair trade for the
 * feel. On a low-tier device it is the difference between smooth and unusable,
 * and the native scroller is already smooth there because the compositor owns
 * it. So low-tier devices keep native scrolling rather than a worse imitation
 * of it.
 */
export default function SmoothScroll({ strength = 0.085 }: { strength?: number }) {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    if (reduced || coarse) return;
    // Hand the scroll back to the compositor on devices that need the main
    // thread for everything else.
    if (getPerfTier() === 'low') return;

    let target = window.scrollY;
    let current = window.scrollY;
    let stopLoop: (() => void) | null = null;
    let lastWritten = -1;

    /* --- the dead man's switch ------------------------------------------
       This component cancels the wheel event and takes responsibility for
       moving the page. If it then fails to move the page, the site cannot be
       scrolled with a mouse at all — which is exactly what happened when the
       frame scheduler silently declined to run the easer. A decorative
       inertia effect must never be able to cost the page its scrolling.

       So: every wheel gesture arms a check. If no frame has run by the time it
       fires, the interception is torn down for good and the browser's own
       scrolling takes over. Losing the weighted feel is a small price; losing
       the scroll is not a trade worth making. */
    let ticked = false;
    let watchdog = 0;
    let surrendered = false;

    const surrender = () => {
      if (surrendered) return;
      surrendered = true;
      stopLoop?.();
      stopLoop = null;
      window.clearTimeout(watchdog);
      window.removeEventListener('wheel', onWheel);
      document.documentElement.classList.remove('has-smooth-scroll');
    };

    const maxScroll = () =>
      Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    /* --- cached scrollability -------------------------------------------- */

    // `overflow-y` cannot change without a style change, and the only thing
    // that invalidates the height comparison is a resize or a reflow, so a
    // WeakMap keyed on the element is safe for the life of a layout.
    let scrollableCache = new WeakMap<HTMLElement, boolean>();

    const isInternallyScrollable = (node: HTMLElement) => {
      const cached = scrollableCache.get(node);
      if (cached !== undefined) return cached;
      const style = getComputedStyle(node);
      const result =
        /(auto|scroll|overlay)/.test(style.overflowY) &&
        node.scrollHeight > node.clientHeight + 1;
      scrollableCache.set(node, result);
      return result;
    };

    const ownsScroll = (from: EventTarget | null) => {
      let node = from instanceof HTMLElement ? from : null;
      // A bounded walk: the deepest trees on the site are around twenty levels,
      // and an unbounded loop over a detached node would spin.
      let depth = 0;
      while (node && node !== document.body && depth < 40) {
        if (isInternallyScrollable(node)) return true;
        node = node.parentElement;
        depth += 1;
      }
      return false;
    };

    /* --- the easer -------------------------------------------------------- */

    const step = (dt: number) => {
      ticked = true;

      // Another component is driving the scroll — stop writing, or the two
      // fight for the last window.scrollTo of every frame.
      if (isScrollControlled()) {
        stopLoop?.();
        stopLoop = null;
        return;
      }

      // Time-scaled so the weight of the easing is the same on a 60Hz display
      // and a 120Hz one. The original fixed 0.085 per frame made the site
      // noticeably twitchier on high-refresh screens.
      const ease = 1 - Math.pow(1 - strength, dt / 16.667);
      current += (target - current) * ease;

      if (Math.abs(target - current) < 0.4) {
        current = target;
        window.scrollTo(0, current);
        lastWritten = current;
        stopLoop?.();
        stopLoop = null;
        return;
      }

      // Sub-pixel writes cost a full scroll dispatch and change nothing that
      // can be seen, and every one of them wakes every scroll listener on the
      // page.
      const rounded = Math.round(current * 2) / 2;
      if (rounded !== lastWritten) {
        window.scrollTo(0, rounded);
        lastWritten = rounded;
      }
    };

    const start = () => {
      if (stopLoop) return;
      // fps 0 — uncapped. The scroll position is not decoration; it must be
      // written on every frame the display offers or the page stutters.
      // order: 0 — the scroll position for the frame must be settled before any
      // scene reads it, or every scroll-linked transform lags by one frame.
      stopLoop = onFrame(step, { fps: 0, order: 0 });

      window.clearTimeout(watchdog);
      watchdog = window.setTimeout(() => {
        if (!ticked) surrender();
      }, 150);
    };

    function onWheel(e: WheelEvent) {
      if (surrendered) return;

      // Let modifier gestures (pinch-zoom, horizontal trackpad) behave natively.
      if (e.ctrlKey || e.metaKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      // Hand over cleanly: drop any momentum still in flight so the section
      // taking control does not have to scroll against it.
      if (isScrollControlled()) {
        stopLoop?.();
        stopLoop = null;
        target = window.scrollY;
        current = window.scrollY;
        return;
      }

      // Respect anything with its own scrollbar (modals, code blocks, tab rails).
      if (ownsScroll(e.target)) return;

      e.preventDefault();
      target = Math.min(maxScroll(), Math.max(0, target + e.deltaY));
      start();
    }

    // Keyboard, anchor jumps and programmatic scrolls resync the target.
    const resync = () => {
      if (!stopLoop) {
        target = window.scrollY;
        current = window.scrollY;
        lastWritten = -1;
      }
    };

    const onResize = () => {
      // Every cached answer depended on a layout that no longer exists.
      scrollableCache = new WeakMap();
      resync();
    };

    document.documentElement.classList.add('has-smooth-scroll');
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('resize', onResize);
    window.addEventListener('keydown', resync);
    window.addEventListener('touchstart', resync, { passive: true });
    window.addEventListener('scroll', resync, { passive: true });

    return () => {
      stopLoop?.();
      window.clearTimeout(watchdog);
      document.documentElement.classList.remove('has-smooth-scroll');
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('keydown', resync);
      window.removeEventListener('touchstart', resync);
      window.removeEventListener('scroll', resync);
    };
  }, [strength]);

  return null;
}
