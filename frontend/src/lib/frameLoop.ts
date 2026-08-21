/**
 * One requestAnimationFrame for the whole application.
 *
 * The home page had, at rest, upwards of twenty independent rAF loops running —
 * a canvas per decorative scene, plus the cursor trail, the scroll-skew writer
 * and the smooth-scroll easer. Each was individually cheap and correct. The
 * problem is that rAF callbacks are not free to *schedule*: the browser wakes,
 * runs twenty separate JS entry points, and each one independently touches the
 * DOM or a canvas, so style and layout are invalidated and re-resolved between
 * them. Twenty loops at 60fps is twelve hundred callbacks a second before a
 * single pixel is drawn.
 *
 * Collapsing them into one driver fixes three things at once:
 *
 *   1. One callback per frame instead of twenty, so the reads and writes of
 *      every scene are batched into a single style/layout pass.
 *   2. A per-subscriber frame budget, which is what lets a low-tier device run
 *      thirty-five scenes at 30fps instead of eight scenes at 12fps.
 *   3. A single place to stop everything — a hidden tab, or a device that has
 *      just told us it is struggling.
 *
 * Subscribers are ordinary callbacks that receive the frame's timestamp and the
 * elapsed milliseconds since they themselves last ran, so a scene throttled to
 * 30fps still integrates its physics correctly rather than running at half speed.
 */

import { getPerfBudget } from '@/lib/perf';

export type FrameCallback = (dt: number, now: number) => void;

interface Subscriber {
  fn: FrameCallback;
  /** Minimum milliseconds between invocations. 0 = every frame. */
  interval: number;
  last: number;
  /** Lower runs earlier in the frame. Scroll writers want to go first. */
  order: number;
}

const subscribers = new Set<Subscriber>();
let raf = 0;
let running = false;
let lastFrame = 0;
/** Sorted view of `subscribers`, rebuilt only when membership changes. */
let ordered: Subscriber[] = [];
let dirty = true;

function tick(now: number) {
  raf = 0;

  if (dirty) {
    ordered = Array.from(subscribers).sort((a, b) => a.order - b.order);
    dirty = false;
  }

  const frameDt = lastFrame ? now - lastFrame : 16.7;
  lastFrame = now;

  for (const sub of ordered) {
    const since = sub.last ? now - sub.last : frameDt;
    // A subscriber asking for 30fps is allowed to run when it is within half a
    // frame of its interval — waiting for the strict boundary drops it to 20fps
    // on a 60Hz display, because the next frame always overshoots.
    if (sub.interval && since < sub.interval - 8) continue;
    sub.last = now;
    try {
      sub.fn(since, now);
    } catch {
      // A throwing scene must not take the other thirty-four down with it.
      subscribers.delete(sub);
      dirty = true;
    }
  }

  if (subscribers.size > 0 && running) raf = requestAnimationFrame(tick);
  else running = false;
}

function start() {
  if (running || subscribers.size === 0) return;
  if (typeof document !== 'undefined' && document.hidden) return;
  running = true;
  lastFrame = 0;
  raf = requestAnimationFrame(tick);
}

function stop() {
  running = false;
  if (raf) cancelAnimationFrame(raf);
  raf = 0;
}

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else {
      // Clear the stale timestamps, or every scene receives one enormous dt for
      // the frame the tab came back and jumps forward by however long it was
      // hidden — which looks like a glitch, not a resume.
      subscribers.forEach((s) => {
        s.last = 0;
      });
      start();
    }
  });
}

export interface FrameOptions {
  /**
   * Frames per second to aim for. Defaults to the device's tier budget.
   *
   * Zero — or anything non-finite — means "every frame, uncapped", which is what
   * a caller driving the scroll position needs. That reading is not optional
   * politeness: the first version computed `1000 / fps` unconditionally, so
   * `fps: 0` produced an interval of Infinity and the subscriber was skipped on
   * every frame forever. SmoothScroll passed exactly that, and because it also
   * calls preventDefault on the wheel event, the result was a page that could not
   * be scrolled with a mouse at all.
   */
  fps?: number;
  /** Lower numbers run earlier within the frame. Default 100. */
  order?: number;
}

/**
 * Join the frame loop. Returns an unsubscribe function; the driver stops
 * entirely once the last subscriber leaves, so an idle page costs nothing.
 */
export function onFrame(fn: FrameCallback, options: FrameOptions = {}): () => void {
  const requested = options.fps ?? getPerfBudget().fps;
  // Uncapped when asked for zero, when handed something nonsensical, or when the
  // rate is already at or above display refresh.
  const uncapped = !Number.isFinite(requested) || requested <= 0 || requested >= 60;
  const sub: Subscriber = {
    fn,
    interval: uncapped ? 0 : 1000 / requested,
    last: 0,
    order: options.order ?? 100,
  };

  subscribers.add(sub);
  dirty = true;
  start();

  return () => {
    subscribers.delete(sub);
    dirty = true;
    if (subscribers.size === 0) stop();
  };
}

/** Diagnostic only — how many scenes are currently asking for frames. */
export function frameSubscriberCount() {
  return subscribers.size;
}
