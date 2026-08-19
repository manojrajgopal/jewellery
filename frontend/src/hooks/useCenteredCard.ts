'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Tracks which child card is currently sitting nearest the centre of the
 * viewport, so a grid can spotlight it as the visitor scrolls.
 *
 * Children opt in by carrying a `data-card-id` attribute. The winner is chosen
 * on vertical distance first — so the focused *row* is settled before anything
 * else — and horizontal distance only breaks ties within that row. On a single
 * column that reduces to "the card you are looking at"; on a four-up grid it
 * picks the one nearest the middle of the row in view.
 *
 * Measuring is gated behind an IntersectionObserver on the container: while the
 * grid is off-screen no scroll handler is attached at all.
 */
/**
 * Where the element sits in the document according to layout alone.
 *
 * Deliberately not getBoundingClientRect: that reports the *transformed* box,
 * which here would mean measuring cards mid-reveal, and would let the spotlit
 * card's own scale-up feed back into the next measurement. offsetTop/offsetLeft
 * are untouched by transforms, so the geometry stays stable while things move.
 */
function layoutCentre(el: HTMLElement) {
  let top = 0;
  let left = 0;
  let node: HTMLElement | null = el;
  while (node) {
    top += node.offsetTop;
    left += node.offsetLeft;
    node = node.offsetParent as HTMLElement | null;
  }
  return {
    x: left + el.offsetWidth / 2 - window.scrollX,
    y: top + el.offsetHeight / 2 - window.scrollY,
  };
}

export function useCenteredCard<T extends HTMLElement>() {
  const containerRef = useRef<T | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let raf = 0;
    let watching = false;

    const measure = () => {
      raf = 0;
      const cards = container.querySelectorAll<HTMLElement>('[data-card-id]');
      const centreX = window.innerWidth / 2;
      const centreY = window.innerHeight / 2;

      let winner: string | null = null;
      let winnerDy = Infinity;
      let bestScore = Infinity;

      cards.forEach((card) => {
        const centre = layoutCentre(card);
        const dy = Math.abs(centre.y - centreY);
        const dx = Math.abs(centre.x - centreX);
        // Row first, then position within the row — dx can never outweigh dy.
        const score = dy * 10000 + dx;
        if (score < bestScore) {
          bestScore = score;
          winnerDy = dy;
          winner = card.dataset.cardId ?? null;
        }
      });

      // Nothing is meaningfully centred — e.g. the grid is only clipping the
      // edge of the screen. Better to spotlight nothing than the wrong card.
      setActiveId(winnerDy > window.innerHeight * 0.55 ? null : winner);
    };

    const schedule = () => {
      if (raf || !watching) return;
      raf = requestAnimationFrame(measure);
    };

    const startWatching = () => {
      if (watching) return;
      watching = true;
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', schedule);
      schedule();
    };

    const stopWatching = () => {
      if (!watching) return;
      watching = false;
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      setActiveId(null);
    };

    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? startWatching() : stopWatching()),
      { rootMargin: '10% 0px' }
    );
    observer.observe(container);

    // Rows resize as images arrive, and filtering swaps the cards out entirely
    // — both move the grid under a stationary visitor, so re-measure. Without
    // the childList watch, filtering would leave activeId pointing at a card
    // that no longer exists and every remaining card would sit dimmed.
    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(container);
    const mutationObserver = new MutationObserver(schedule);
    mutationObserver.observe(container, { childList: true });

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      stopWatching();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return { containerRef, activeId };
}
