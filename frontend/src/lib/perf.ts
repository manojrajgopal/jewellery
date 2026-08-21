/**
 * One answer to "how much can this device take?", shared by every effect on the
 * site.
 *
 * The home page mounts around thirty-five independent canvas scenes, forty-five
 * scroll-linked transforms and a handful of very large CSS blurs. On a desktop
 * that is fine. On a 2GB Android or a smart-TV browser it is not, and the failure
 * mode is the worst one available: everything still runs, so nothing looks
 * broken, it is simply unusable.
 *
 * The fix is not to drop features — it is to spend a fixed frame budget rather
 * than an unbounded one. Every scene keeps its behaviour and its look; what
 * scales is how *finely* it is sampled. A field of fifty-four motes at 60fps and
 * a field of twenty at 30fps read as the same field. A canvas at devicePixelRatio
 * 2 and one at 1 read as the same canvas at arm's length. What does not survive
 * scaling is the number of *things happening*, and that is exactly what we keep.
 *
 * Tier is decided once, before first paint, from signals that are cheap and
 * available synchronously — memory, cores, pointer type, viewport. It is then
 * confirmed (and only ever lowered) by a short live frame-rate probe, because the
 * static signals lie in both directions: a four-core phone with 4GB can be fast,
 * and a ten-year-old desktop reporting eight cores can be slower than either.
 */

export type PerfTier = 'low' | 'mid' | 'high';

const ATTR = 'data-perf';

/* ---------------------------------------------------------------------------
   Pre-paint classification

   Inlined into <head> so `data-perf` is on <html> before the first frame. CSS
   reads it directly (see the perf tier block in globals.css), which means the
   very expensive declarations — 120px+ blurs, backdrop-filters, multi-layer
   shadows — are never even computed on a low-tier device, let alone painted.
   Doing this from React instead would paint one full frame at desktop cost,
   which on the devices that need this most is a a visible half-second stall.
--------------------------------------------------------------------------- */

/**
 * Kept deliberately small and dependency-free: it runs before anything else on
 * the page and must never be the reason first paint is late.
 *
 * `deviceMemory` is the strongest single signal available and is Chromium-only,
 * which is fine — the browsers that lack it (Safari, Firefox) do not run on the
 * hardware this is protecting against nearly as often, and the core count and
 * pointer checks still catch those.
 */
export const perfInitScript = `(function(){try{
var n=navigator,d=document.documentElement;
var mem=n.deviceMemory||0,cores=n.hardwareConcurrency||0;
var coarse=window.matchMedia('(pointer: coarse)').matches;
var narrow=window.innerWidth<768;
var save=(n.connection&&n.connection.saveData)||false;
var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var t='high';
if(mem&&mem<=2)t='low';
else if(cores&&cores<=2)t='low';
else if(save)t='low';
else if(mem&&mem<=4)t='mid';
else if(cores&&cores<=4)t='mid';
else if(coarse&&narrow)t='mid';
if(reduced&&t==='high')t='mid';
d.setAttribute('${ATTR}',t);
}catch(e){document.documentElement.setAttribute('${ATTR}','mid');}})();`;

/* ---------------------------------------------------------------------------
   Reading the tier
--------------------------------------------------------------------------- */

const ORDER: Record<PerfTier, number> = { low: 0, mid: 1, high: 2 };

let cached: PerfTier | null = null;
const listeners = new Set<(t: PerfTier) => void>();

function parse(value: string | null): PerfTier {
  return value === 'low' || value === 'mid' || value === 'high' ? value : 'mid';
}

/**
 * The current tier. Safe to call during render on the server, where it answers
 * 'high' — server output is markup only, and every consumer re-reads on mount
 * before it starts spending frames.
 */
export function getPerfTier(): PerfTier {
  if (typeof document === 'undefined') return 'high';
  if (cached) return cached;
  cached = parse(document.documentElement.getAttribute(ATTR));
  return cached;
}

/** Lower the tier. Never raises: a device that has stuttered once will again. */
export function demotePerfTier(to: PerfTier) {
  const current = getPerfTier();
  if (ORDER[to] >= ORDER[current]) return;
  cached = to;
  document.documentElement.setAttribute(ATTR, to);
  listeners.forEach((fn) => fn(to));
}

export function onPerfTierChange(fn: (t: PerfTier) => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/* ---------------------------------------------------------------------------
   Budgets

   These are the numbers every scene multiplies its own settings by, so the
   whole site scales from one place rather than from thirty-five magic numbers.
--------------------------------------------------------------------------- */

export interface PerfBudget {
  tier: PerfTier;
  /** Multiplier for particle counts, ray counts, node counts. */
  density: number;
  /** Hard ceiling on canvas devicePixelRatio. */
  dpr: number;
  /** Frames per second a decorative loop is allowed to ask for. */
  fps: number;
  /**
   * Whether scroll-linked CSS filters are affordable. A filter animated against
   * scroll cannot be composited — it re-rasterises its whole subtree every
   * frame — so this is the one visual property that is genuinely dropped rather
   * than scaled on weak hardware.
   */
  scrollFilters: boolean;
  /** How far ahead of the viewport work is prepared, in CSS pixels. */
  prefetchMargin: number;
}

const BUDGETS: Record<PerfTier, PerfBudget> = {
  // A 2GB phone or a TV browser. Everything still happens; it happens coarsely.
  low: {
    tier: 'low',
    density: 0.34,
    dpr: 1,
    fps: 30,
    scrollFilters: false,
    prefetchMargin: 400,
  },
  // Mid-range phone, older laptop, or anything we are unsure about.
  mid: {
    tier: 'mid',
    density: 0.62,
    dpr: 1.5,
    fps: 48,
    scrollFilters: true,
    prefetchMargin: 700,
  },
  // What the site was authored against.
  high: {
    tier: 'high',
    density: 1,
    dpr: 2,
    fps: 60,
    scrollFilters: true,
    prefetchMargin: 1000,
  },
};

export function getPerfBudget(tier: PerfTier = getPerfTier()): PerfBudget {
  return BUDGETS[tier];
}

/**
 * Scale a count the page was authored with, never below a floor that keeps the
 * effect legible. A field of five motes is not a cheaper field, it is a bug that
 * looks like one — so the floor is what stops density scaling from crossing into
 * removal.
 */
export function scaleCount(authored: number, floor = 6, tier?: PerfTier): number {
  const { density } = getPerfBudget(tier);
  return Math.max(Math.min(authored, floor), Math.round(authored * density));
}

/** Canvas backing-store ratio, capped by tier and by the device's own value. */
export function canvasDpr(tier?: PerfTier): number {
  const max = getPerfBudget(tier).dpr;
  const real = typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1;
  return Math.min(real, max);
}

/* ---------------------------------------------------------------------------
   Live confirmation

   The static signals are a guess. This is the correction: sample real frame
   intervals for a couple of seconds after the page settles and demote if the
   device cannot in fact hold the rate. Runs once per session, costs one rAF
   subscription, and only ever moves the tier down.
--------------------------------------------------------------------------- */

let probed = false;

export function probeFrameRate() {
  if (probed || typeof window === 'undefined') return;
  probed = true;

  // Wait for the load burst to finish — measuring during hydration measures
  // hydration, and would demote every device on the first visit.
  const begin = () => {
    let frames = 0;
    let slow = 0;
    let last = performance.now();
    const started = last;

    const step = (now: number) => {
      const dt = now - last;
      last = now;
      frames += 1;
      // 20ms is the threshold where a 60fps target has already been missed.
      if (dt > 20) slow += 1;

      if (now - started < 2000) {
        requestAnimationFrame(step);
        return;
      }

      const ratio = frames ? slow / frames : 0;
      const fps = (frames / (now - started)) * 1000;

      // Two independent reasons to demote: sustained low average, or a jittery
      // average that happens to land near target. The second is the one users
      // describe as "lagging" even when a counter reads 55fps.
      if (fps < 26 || ratio > 0.6) demotePerfTier('low');
      else if (fps < 46 || ratio > 0.3) demotePerfTier('mid');
    };

    requestAnimationFrame(step);
  };

  // `requestIdleCallback` alone is exactly the wrong tool here, and finding that
  // out was instructive: on a page that is already saturated the browser never
  // reports an idle period, so the callback never fires and the probe never runs
  // — on precisely the devices it exists to detect. Measured on a 2x-throttled
  // run of the home page, the tier stayed at 'high' while the page held 5fps.
  // The timeout is therefore the primary path, not the fallback.
  let started = false;
  const schedule = () => {
    const runOnce = () => {
      if (started) return;
      started = true;
      begin();
    };
    const idle = (
      window as unknown as { requestIdleCallback?: (cb: () => void) => void }
    ).requestIdleCallback;
    if (idle) idle(runOnce);
    window.setTimeout(runOnce, 2500);
  };

  if (document.readyState === 'complete') schedule();
  else window.addEventListener('load', schedule, { once: true });
}
