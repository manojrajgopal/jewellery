'use client';

import { useEffect, useState, type RefObject } from 'react';

/**
 * Whether an element the caller already has a ref to is on screen.
 *
 * Distinct from the neighbouring `useInView`, which creates and returns its own
 * ref — that shape is right for a wrapper and wrong for the case this exists
 * for: a component that already holds a ref to its canvas or its SVG and needs
 * to know whether to keep painting it.
 *
 * The reason it exists at all is that three of the newer scenes run a permanent
 * `requestAnimationFrame` loop — a falling field of stones, a hanging chain, a
 * field of hairlines. A permanent loop is fine when it is the only one on the
 * page and is a genuine waste of battery once the section it belongs to has been
 * scrolled past, because nothing it paints is visible. Gating on this cuts those
 * loops to zero the moment their section leaves the viewport.
 *
 * `margin` is generous by default so a loop is already running by the time its
 * section appears, rather than starting visibly from a standstill.
 *
 * `ready` exists for the common shape in this folder: a component that renders
 * nothing at all until it has checked for a reduced-motion preference. On the
 * first pass its ref is null, and an observer effect that only depends on the ref
 * would never run again — so the element would mount and never be observed. Pass
 * the same flag that gates the render and the observer attaches on the pass that
 * creates the element.
 */
export function useOnScreen(
  ref: RefObject<Element | null>,
  margin = '200px',
  ready = true
) {
  const [onScreen, setOnScreen] = useState(false);

  useEffect(() => {
    if (!ready) return;
    const el = ref.current;
    if (!el) return;

    // No observer available (very old browser, or a test environment): assume
    // visible rather than silently never animating.
    if (typeof IntersectionObserver === 'undefined') {
      setOnScreen(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { rootMargin: margin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, margin, ready]);

  return onScreen;
}
