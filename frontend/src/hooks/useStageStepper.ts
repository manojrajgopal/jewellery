'use client';

import { useEffect, useRef, useState } from 'react';

import { releaseScrollControl, takeScrollControl } from '@/lib/scrollControl';

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/**
 * Turns a tall pinned section into discrete stages, advanced one at a time.
 *
 * Binding the stage to raw scroll progress means a single flick can cross
 * several stages at once — the visitor never sees the ones in between. While
 * the section fills the viewport this hook takes the gesture instead: one
 * wheel notch or one swipe moves exactly one stage, however hard it was
 * thrown, and the page scroll is driven to that stage's anchor so the two stay
 * in agreement. At either end the gesture is handed back untouched, so
 * scrolling out of the section stays completely normal.
 *
 * Returns a ref for the tall container and the current stage index.
 */
export function useStageStepper(count: number, options: { instant?: boolean } = {}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [stage, setStage] = useState(0);
  const instant = options.instant ?? false;

  // Read inside listeners without re-registering them on every change.
  const stageRef = useRef(0);
  const instantRef = useRef(instant);
  instantRef.current = instant;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const last = count - 1;
    if (last < 1) return;

    const token = Symbol('stage-stepper');
    // Held longer than the panel takes to settle, so a stage is always framed
    // and readable before the next one can be asked for. Anything arriving
    // inside the hold is dropped, never queued — that is what keeps a hard
    // flick from running through several stages.
    const HOLD_MS = 900;
    const GLIDE_MS = 520;
    // A wheel gesture is a burst of events, not one. Treating a quiet moment as
    // the boundary between gestures is what makes one flick worth exactly one
    // stage, however long its tail of inertial events runs on for.
    const GESTURE_GAP_MS = 140;
    // A steady wheel turn or any trackpad emits events closer together than the
    // gap above, so a burst can last as long as the visitor keeps scrolling.
    // Without this ceiling such a burst never ends, and the section swallows
    // every event: no stage advances and the page cannot be left either.
    const MAX_BURST_MS = 900;

    let raf = 0;
    let lockedUntil = 0;
    let lastWheelAt = 0;
    let burstStartedAt = 0;
    let controlling = false;

    const metrics = () => {
      const rect = container.getBoundingClientRect();
      return {
        rect,
        docTop: rect.top + window.scrollY,
        travel: Math.max(1, container.offsetHeight - window.innerHeight),
      };
    };

    const anchorFor = (index: number) => {
      const { docTop, travel } = metrics();
      return docTop + (travel * index) / last;
    };

    /** True while the sticky panel is the only thing on screen. */
    const isPinned = () => {
      const { rect } = metrics();
      return rect.top <= 1 && rect.bottom >= window.innerHeight - 1;
    };

    const claim = () => {
      if (controlling) return;
      controlling = true;
      takeScrollControl(token);
    };

    const relinquish = () => {
      if (!controlling) return;
      controlling = false;
      releaseScrollControl(token);
    };

    const glideTo = (y: number, duration: number, done: () => void) => {
      if (raf) cancelAnimationFrame(raf);
      const from = window.scrollY;
      const delta = y - from;
      if (instantRef.current || duration <= 0 || Math.abs(delta) < 1) {
        window.scrollTo(0, y);
        raf = 0;
        done();
        return;
      }
      const started = performance.now();
      const ease = (t: number) => 1 - Math.pow(1 - t, 3);
      const frame = (now: number) => {
        const t = Math.min(1, (now - started) / duration);
        window.scrollTo(0, from + delta * ease(t));
        if (t < 1) {
          raf = requestAnimationFrame(frame);
        } else {
          raf = 0;
          done();
        }
      };
      raf = requestAnimationFrame(frame);
    };

    const goTo = (index: number, duration: number) => {
      const next = clamp(index, 0, last);
      stageRef.current = next;
      setStage(next);
      lockedUntil = performance.now() + (instantRef.current ? 250 : HOLD_MS);
      claim();
      glideTo(anchorFor(next), duration, () => {});
    };

    const onWheel = (e: WheelEvent) => {
      // Leave pinch-zoom and sideways trackpad gestures alone.
      if (e.ctrlKey || e.metaKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      const now = performance.now();
      // Every event seen counts toward the burst, including ones outside the
      // section — a flick that starts above it is still one flick.
      const startsBurst = now - lastWheelAt >= GESTURE_GAP_MS;
      lastWheelAt = now;
      if (startsBurst) burstStartedAt = now;

      // A step is earned at the start of a burst, or once a burst has outlived
      // the ceiling — sustained scrolling is deliberate input, not a flick's
      // tail, and must keep advancing rather than locking the page up.
      const earnsStep = startsBurst || now - burstStartedAt >= MAX_BURST_MS;
      if (earnsStep && !startsBurst) burstStartedAt = now; // restart the clock

      const { rect } = metrics();
      const viewport = window.innerHeight;
      const direction = e.deltaY > 0 ? 1 : -1;
      const pinned = rect.top <= 1 && rect.bottom >= viewport - 1;

      // Take the gesture just before the section pins, so the visitor is never
      // dropped into the middle of it by momentum built up on the way in.
      const arrivingDown = direction > 0 && rect.top > 1 && rect.top < viewport * 0.85;
      const arrivingUp =
        direction < 0 && rect.bottom < viewport - 1 && rect.bottom > viewport * 0.15;

      if (!pinned && !arrivingDown && !arrivingUp) {
        // Outside the section entirely — never keep hold of the scroll here,
        // or SmoothScroll would stay stood down and the page would not move.
        if (!raf) relinquish();
        return;
      }

      const held = now < lockedUntil;

      // Leaving needs only the current stage to have had its moment. Gating
      // this on the gesture as well was what let a burst that never ended trap
      // the visitor: no stage advanced and the page could not be left either.
      if (pinned && !held) {
        const next = stageRef.current + direction;
        // First stage scrolling up, last stage scrolling down: let go, so
        // leaving the section is an ordinary scroll.
        if (next < 0 || next > last) {
          relinquish();
          return;
        }
      }

      // Ours to handle — keep it away from SmoothScroll entirely.
      claim();
      e.preventDefault();
      e.stopImmediatePropagation();

      if (held) return;

      // Landing on the first or last stage is an entry, not an advance, so it
      // is allowed mid-gesture: a hard flick from outside settles on the near
      // end of the section instead of stalling against a frozen page.
      if (arrivingDown) return goTo(0, 420);
      if (arrivingUp) return goTo(last, 420);

      // One stage per gesture. The rest of the burst is dropped.
      if (!earnsStep) return;
      goTo(stageRef.current + direction, GLIDE_MS);
    };

    let touchAnchor = 0;

    const onTouchStart = (e: TouchEvent) => {
      touchAnchor = e.touches[0]?.clientY ?? 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY ?? 0;
      const travelled = touchAnchor - y;
      if (Math.abs(travelled) < 10) return;
      if (!isPinned()) return;

      const held = performance.now() < lockedUntil;
      const direction = travelled > 0 ? 1 : -1;
      const next = stageRef.current + direction;
      // At the ends, hand the drag back as soon as the stage has had its
      // moment. The hold alone paces the stepping: a short swipe is worth one
      // stage, and a long drag keeps advancing instead of freezing the page.
      if (!held && (next < 0 || next > last)) return;

      e.preventDefault();
      if (held) return;
      touchAnchor = y;
      goTo(next, GLIDE_MS);
    };

    // Scrollbar drags, keyboard paging and in-page anchor jumps all bypass the
    // gesture handlers; keep the stage honest about where the page actually is.
    // Skipping this while control was claimed left the stage stale, so the next
    // gesture stepped from a stale index and glided to the wrong panel.
    const onScroll = () => {
      if (raf) return; // our own glide is driving the scroll

      // Equally, the claim must not outlive the section. Leaving it by any
      // route other than a wheel event — a nav link, a keyboard page — would
      // otherwise keep SmoothScroll stood down for the rest of the session.
      if (!isPinned()) relinquish();

      const { rect, travel } = metrics();
      const progress = clamp(-rect.top / travel, 0, 1);
      const derived = Math.round(progress * last);
      if (derived !== stageRef.current) {
        stageRef.current = derived;
        setStage(derived);
      }
    };

    window.addEventListener('wheel', onWheel, { capture: true, passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { capture: true, passive: false });
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      if (raf) cancelAnimationFrame(raf);
      relinquish();
      window.removeEventListener('wheel', onWheel, { capture: true });
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove, { capture: true });
      window.removeEventListener('scroll', onScroll);
    };
  }, [count]);

  return { containerRef, stage };
}
