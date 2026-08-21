'use client';

import { useEffect } from 'react';

/**
 * Pauses CSS animations inside sections that are nowhere near the viewport.
 *
 * This is the CSS half of a job the JavaScript half already does. Every canvas
 * scene on the site now stops painting when its section scrolls away; CSS
 * animations had no equivalent, and there are a great many of them — a measured
 * 236 running at once on the home page, across drifting aurora blooms, shimmer
 * sweeps, ken-burns pans, orbiting marks and pulsing dots.
 *
 * An offscreen CSS animation is cheaper than an offscreen canvas but it is not
 * free. Each one keeps its element on the compositor's active list, ticks every
 * frame, and — when it animates anything other than transform or opacity —
 * invalidates style or paint on every tick. Two hundred of those in sections
 * nobody is looking at is two hundred reasons for the browser to do work.
 *
 * `animation-play-state: paused` is exactly the right instrument: the animation
 * holds its current position rather than resetting, so resuming is invisible.
 * A visitor scrolling back up finds the shimmer where they left it.
 *
 * ----------------------------------------------------------------------------
 * Two details that took measuring to get right
 * ----------------------------------------------------------------------------
 * It marks with an attribute, not a class. The first version added a class and
 * it silently stopped working: the class was applied to all fifty-one offscreen
 * sections and had vanished from fifty of them a second later. `className` is a
 * React-managed prop on those sections, so React rewrites it from props and
 * takes any externally-added class with it. Nobody's props mention
 * `data-anim-idle`, so React leaves it alone.
 *
 * And it re-observes. Anything that replaces a section's DOM — a route
 * transition, a remount, a client re-render after a hydration mismatch — quietly
 * orphans an observer watching the old node: the attribute stays behind on a node
 * that is no longer in the document, and the observer never fires for its
 * replacement. A throttled sweep on scroll picks up any section that is not
 * currently being watched, which makes this self-healing without needing to know
 * when a swap happened.
 */

/** Marked on a section while it is far enough away to hold its animations. */
const ATTR = 'data-anim-idle';

/**
 * Any section, not only the ones with anchor ids. The first version required an
 * id because the home page's section rail happens to give every section one —
 * and every other page on the site was left out of the optimisation entirely,
 * marking only its footer. There was never a reason for the requirement.
 */
const SELECTOR =
  'main section:not(.no-anim-pause), footer:not(.no-anim-pause), [data-anim-scope]:not(.no-anim-pause)';

export default function OffscreenAnimationPause({
  /** How far outside the viewport animations keep running, in CSS pixels. */
  margin = 800,
}: {
  margin?: number;
}) {
  useEffect(() => {
    // Under a reduced-motion preference the global stylesheet has already
    // stopped everything; there is nothing to pause and no point observing.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) el.removeAttribute(ATTR);
          else el.setAttribute(ATTR, '');
        }
      },
      { rootMargin: `${margin}px 0px` }
    );

    // Which nodes are already being watched. A WeakSet rather than a list so a
    // replaced node is collectable the moment the document lets go of it.
    const watched = new WeakSet<Element>();
    let marked: Element[] = [];

    const sweep = () => {
      const found = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR));
      for (const el of found) {
        if (watched.has(el)) continue;
        watched.add(el);
        observer.observe(el);
      }
      // Kept for cleanup only.
      marked = found;
    };

    sweep();

    // Re-sweep as the page moves, throttled hard — a swap can only happen when
    // a section wakes, and a section can only wake when the visitor scrolls.
    let queued = false;
    const onScroll = () => {
      if (queued) return;
      queued = true;
      window.setTimeout(() => {
        queued = false;
        sweep();
      }, 350);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      marked.forEach((el) => el.removeAttribute(ATTR));
    };
  }, [margin]);

  return null;
}
