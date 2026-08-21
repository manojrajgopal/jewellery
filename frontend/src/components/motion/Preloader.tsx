'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Runs in <head> before the first paint, so the decision "does this visit get
 * the intro?" is made before anything renders — never after the page is
 * already on screen. Writes `data-intro` on <html>:
 *   playing → this is a fresh visit; the curtain shows and the page is locked
 *   seen    → already shown this session (or reduced motion); CSS hides the
 *             curtain markup instantly, with no flash and no exit animation
 * The session flag is written up front, so a reload mid-intro does not replay.
 */
export const introInitScript = `
(function(){
  var root = document.documentElement;
  try {
    var seen = sessionStorage.getItem('aurum-intro') === '1';
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (seen || reduced) { root.setAttribute('data-intro','seen'); return; }
    sessionStorage.setItem('aurum-intro','1');
    root.setAttribute('data-intro','playing');
  } catch (e) {
    root.setAttribute('data-intro','seen');
  }
})();
`;

/** Total run time of the intro, in ms. Every beat below is a fraction of this. */
const RUN = 4200;

/**
 * The status line, which is the difference between a spinner and a title
 * sequence: it tells the visitor what the house does while they wait. Fractions
 * are of RUN, so retiming the intro retimes the copy with it.
 */
const BEATS = [
  { at: 0.0, label: 'Opening the vault' },
  { at: 0.26, label: 'Selecting the rough' },
  { at: 0.46, label: 'Cutting the facets' },
  { at: 0.66, label: 'Setting the stones' },
  { at: 0.84, label: 'Polishing to mirror' },
];

/**
 * First-visit title sequence.
 *
 * The choreography, in order:
 *   1. A film countdown ticks 3–2–1 behind the letterbox bars.
 *   2. Gold dust converges from the edges of the frame toward the centre.
 *   3. The AURUM diamond draws itself stroke-first, then its facets fill.
 *   4. The wordmark's letter-spacing collapses from wide to set.
 *   5. A hairline fills as the status line steps through the atelier's stages.
 *   6. The stone flares, and the frame irises open onto the page.
 *
 * The markup is present in the server-rendered HTML so the curtain is the very
 * first thing painted; `introInitScript` has already decided whether it stays.
 * Shown once per tab session, so internal navigation stays instant.
 */
export default function Preloader() {
  // Rendered by default — the head script hides it for repeat visits before
  // paint, and the effect below unmounts it on hydration.
  const [skip, setSkip] = useState(false);
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const rafRef = useRef(0);

  // Dust motes are generated once. Regenerating them on a re-render would
  // restart every mote's flight mid-intro.
  //
  // The values are drawn from a *deterministic* pseudo-random source, not
  // Math.random(). The preloader is server-rendered, so Math.random() produced
  // one set of motes on the server and a different set on the client, and the
  // mismatch made React throw the whole server tree away and re-render on
  // hydration (React error #418) on every page — a visible console error and a
  // real load-time cost. A seeded generator yields identical motes on both
  // sides, so hydration matches; the field still looks scattered.
  const motes = useMemo(() => {
    const rand = (seed: number) => {
      let t = (seed + 0x6d2b79f5) | 0;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    // Round every value to a fixed precision. The raw doubles serialise into the
    // motion style string with one digit more on the client than on the server
    // (Node and the browser stringify the last ULP differently), and that lone
    // trailing digit was enough to fail hydration — the second, subtler half of
    // the same #418. Rounded numbers stringify identically everywhere.
    const r3 = (n: number) => Math.round(n * 1000) / 1000;
    return Array.from({ length: 34 }, (_, i) => {
      const angle = (i / 34) * Math.PI * 2 + rand(i * 6) * 0.4;
      // Start beyond the frame, so they fly in rather than appearing.
      const distance = 46 + rand(i * 6 + 1) * 34;
      return {
        id: i,
        fromX: r3(Math.cos(angle) * distance),
        fromY: r3(Math.sin(angle) * distance),
        size: r3(1.5 + rand(i * 6 + 2) * 3.5),
        delay: r3(0.35 + rand(i * 6 + 3) * 1.1),
        duration: r3(1.5 + rand(i * 6 + 4) * 1.1),
        rotate: r3(rand(i * 6 + 5) * 360),
      };
    });
  }, []);

  const status = BEATS.reduce(
    (current, beat) => (progress / 100 >= beat.at ? beat.label : current),
    BEATS[0].label
  );

  useEffect(() => {
    const root = document.documentElement;

    // Repeat visit or reduced motion: drop the markup outright. Unmounting the
    // whole AnimatePresence skips the exit animation, so nothing flashes.
    if (root.getAttribute('data-intro') !== 'playing') {
      setSkip(true);
      return;
    }

    // Progress is driven off elapsed wall-clock time rather than a frame
    // counter, so a slow first paint does not stretch the intro past its
    // scheduled exit — the bar and the curtain must finish together.
    const started = performance.now();
    const tick = (now: number) => {
      const elapsed = now - started;
      const linear = Math.min(1, elapsed / RUN);
      // easeOutCubic, so the count sprints early and eases into 100 rather
      // than crawling at a uniform rate.
      const eased = 1 - (1 - linear) ** 3;
      setProgress(eased * 100);
      if (linear < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    // Countdown leader: 3, 2, 1, then out of the way before the monogram draws.
    const counts = [
      window.setTimeout(() => setCountdown(2), 520),
      window.setTimeout(() => setCountdown(1), 1040),
      window.setTimeout(() => setCountdown(0), 1560),
    ];

    const done = window.setTimeout(() => {
      // 'exiting' releases the scroll lock while the panels are still parting;
      // 'seen' would hide them mid-animation.
      root.setAttribute('data-intro', 'exiting');
      setVisible(false);
    }, RUN);

    return () => {
      cancelAnimationFrame(rafRef.current);
      counts.forEach(window.clearTimeout);
      window.clearTimeout(done);
      // Deliberately leaves data-intro as 'playing'. Stamping 'exiting' here
      // meant React's development double-invoke — mount, clean up, mount again
      // — left the second mount seeing "not playing", so the curtain never
      // appeared at all in dev. Preloader lives in the root layout for the
      // life of the page, so the only unmount that happens is that remount.
    };
  }, []);

  if (skip) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          id="aurum-preloader"
          className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden"
          exit={{ pointerEvents: 'none' }}
        >
          {/* ---- Parting panels ---- */}
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 bg-canvas"
            exit={{ y: '-100%' }}
            transition={{ duration: 1.15, ease: [0.76, 0, 0.24, 1] }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2 bg-canvas"
            exit={{ y: '100%' }}
            transition={{ duration: 1.15, ease: [0.76, 0, 0.24, 1] }}
          />

          {/* ---- Atmosphere: everything below leaves with the panels ---- */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
          >
            {/* Vignette, so the frame has edges */}
            <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_50%,transparent_38%,rgb(var(--shadow-color)/0.4)_100%)]" />

            {/* Grain — always on during the intro, whatever the cinema setting */}
            <div className="film-grain absolute mix-blend-overlay" style={{ opacity: 0.05 }} />

            {/* Two light shafts raking the empty stage */}
            {[18, 74].map((left, i) => (
              <motion.span
                key={left}
                initial={{ opacity: 0, scaleY: 0.6 }}
                animate={{ opacity: [0, 0.5, 0.28], scaleY: 1 }}
                transition={{ duration: 2.6, delay: 0.6 + i * 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  left: `${left}%`,
                  transform: 'skewX(-13deg)',
                  opacity: 'var(--bloom)',
                }}
                className="absolute top-0 h-full w-[8%] origin-top bg-gradient-to-b from-gold-100/25 via-gold-200/8 to-transparent blur-xl mix-blend-screen"
              />
            ))}

            {/* Letterbox bars, drawing in and then retreating on exit */}
            <motion.div
              initial={{ height: '50%' }}
              animate={{ height: 'clamp(26px, 6vh, 64px)' }}
              transition={{ duration: 1.3, ease: [0.76, 0, 0.24, 1] }}
              className="absolute inset-x-0 top-0 bg-ink-950"
            />
            <motion.div
              initial={{ height: '50%' }}
              animate={{ height: 'clamp(26px, 6vh, 64px)' }}
              transition={{ duration: 1.3, ease: [0.76, 0, 0.24, 1] }}
              className="absolute inset-x-0 bottom-0 bg-ink-950"
            />
          </motion.div>

          {/* ---- Seam glow: the line the panels will part along ---- */}
          <motion.div
            className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ opacity: 0, scaleY: 6, transition: { duration: 0.5 } }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* ---- Countdown leader ---- */}
          <AnimatePresence>
            {countdown > 0 && (
              <motion.div
                key={countdown}
                initial={{ opacity: 0, scale: 1.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                className="absolute z-20 flex items-center justify-center"
              >
                {/* Framing reticle, as on a real countdown leader */}
                <svg width="150" height="150" viewBox="0 0 100 100" aria-hidden="true" className="absolute">
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke="rgb(var(--gold-500))"
                    strokeWidth="0.5"
                    opacity="0.5"
                  />
                  <path
                    d="M50 6 V94 M6 50 H94"
                    stroke="rgb(var(--gold-500))"
                    strokeWidth="0.4"
                    opacity="0.35"
                  />
                  {/* The sweeping wedge that wipes once per count */}
                  <motion.path
                    d="M50 50 L50 6 A44 44 0 0 1 94 50 Z"
                    fill="rgb(var(--gold-500))"
                    opacity="0.1"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.52, ease: 'linear' }}
                    style={{ transformOrigin: '50px 50px' }}
                  />
                </svg>
                <span className="font-display text-6xl font-light text-gradient-static tabular-nums">
                  {countdown}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ---- Converging gold dust ---- */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[5]">
            {motes.map((mote) => (
              <motion.span
                key={mote.id}
                initial={{
                  x: `${mote.fromX}vmin`,
                  y: `${mote.fromY}vmin`,
                  opacity: 0,
                  scale: 0.4,
                  rotate: mote.rotate,
                }}
                animate={{
                  x: 0,
                  y: 0,
                  opacity: [0, 0.95, 0],
                  scale: [0.4, 1, 0.2],
                  rotate: mote.rotate + 220,
                }}
                transition={{
                  duration: mote.duration,
                  delay: mote.delay,
                  ease: [0.4, 0, 0.3, 1],
                }}
                style={{
                  width: mote.size,
                  height: mote.size,
                  left: '50%',
                  top: '50%',
                }}
                className="absolute rotate-45 bg-gradient-to-br from-gold-100 to-gold-500 shadow-[0_0_10px_2px_rgb(var(--gold-400)/0.6)]"
              />
            ))}
          </div>

          {/* ---- The mark ---- */}
          <motion.div
            className="relative z-10 flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.4 } }}
          >
            <div className="relative mb-8">
              {/* Bloom behind the stone, swelling as the intro completes */}
              <motion.span
                aria-hidden="true"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: [0, 0.5, 0.9], scale: [0.6, 1, 1.35] }}
                transition={{ duration: 2.4, delay: 1.6, ease: 'easeOut' }}
                className="absolute inset-0 rounded-full bg-gold-radial blur-2xl"
                style={{ opacity: 'var(--bloom)' }}
              />

              <svg width="132" height="132" viewBox="0 0 100 100" className="relative" aria-hidden="true">
                <defs>
                  <linearGradient id="aurum-intro-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgb(var(--gold-200))" />
                    <stop offset="50%" stopColor="rgb(var(--gold-500))" />
                    <stop offset="100%" stopColor="rgb(var(--gold-700))" />
                  </linearGradient>
                  {/* Fill that washes in behind the stroke once it has drawn */}
                  <linearGradient id="aurum-intro-fill" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgb(var(--gold-200))" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="rgb(var(--gold-700))" stopOpacity="0.08" />
                  </linearGradient>
                </defs>

                {/* Outer rotating reticle */}
                <motion.g
                  initial={{ opacity: 0, rotate: -40 }}
                  animate={{ opacity: 0.4, rotate: 0 }}
                  transition={{ duration: 2, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformOrigin: '50px 50px' }}
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="47"
                    fill="none"
                    stroke="rgb(var(--gold-500))"
                    strokeWidth="0.4"
                    strokeDasharray="2 5"
                  />
                </motion.g>

                {/* Diamond outline, drawing itself */}
                <motion.path
                  d="M50 8 L88 42 L50 92 L12 42 Z"
                  fill="url(#aurum-intro-fill)"
                  stroke="url(#aurum-intro-gold)"
                  strokeWidth="1.5"
                  initial={{ pathLength: 0, opacity: 0, fillOpacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1, fillOpacity: 1 }}
                  transition={{
                    pathLength: { duration: 1.5, delay: 1.55, ease: [0.22, 1, 0.36, 1] },
                    opacity: { duration: 0.3, delay: 1.55 },
                    fillOpacity: { duration: 1, delay: 2.5 },
                  }}
                />

                {/* Facets */}
                <motion.path
                  d="M12 42 H88 M50 8 L32 42 L50 92 M50 8 L68 42 L50 92"
                  fill="none"
                  stroke="url(#aurum-intro-gold)"
                  strokeWidth="0.8"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.65 }}
                  transition={{ duration: 1.3, delay: 2.05, ease: [0.22, 1, 0.36, 1] }}
                />

                {/* Facet glints, once the cut is complete */}
                {[
                  { cx: 32, cy: 42 },
                  { cx: 68, cy: 42 },
                  { cx: 50, cy: 8 },
                ].map((g, i) => (
                  <motion.path
                    key={`${g.cx}-${g.cy}`}
                    d={`M${g.cx} ${g.cy - 7} L${g.cx + 1.4} ${g.cy - 1.4} L${g.cx + 7} ${g.cy} L${g.cx + 1.4} ${g.cy + 1.4} L${g.cx} ${g.cy + 7} L${g.cx - 1.4} ${g.cy + 1.4} L${g.cx - 7} ${g.cy} L${g.cx - 1.4} ${g.cy - 1.4} Z`}
                    fill="rgb(var(--gold-50))"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: [0, 1, 0], scale: [0, 1.3, 0.5] }}
                    transition={{
                      duration: 1.1,
                      delay: 3 + i * 0.22,
                      ease: 'easeOut',
                    }}
                    style={{ transformOrigin: `${g.cx}px ${g.cy}px` }}
                  />
                ))}
              </svg>
            </div>

            {/* Wordmark — spacing collapses from wide to set */}
            <motion.span
              initial={{ opacity: 0, letterSpacing: '1.1em' }}
              animate={{ opacity: 1, letterSpacing: '0.42em' }}
              transition={{ duration: 1.6, delay: 2.2, ease: [0.22, 1, 0.36, 1] }}
              className="font-accent text-2xl uppercase text-gradient-static pl-[0.42em]"
            >
              Aurum
            </motion.span>

            {/* Est. line, unfurling beneath the mark */}
            <motion.span
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.9, delay: 2.9, ease: [0.22, 1, 0.36, 1] }}
              className="mt-3 font-sans text-[9px] uppercase tracking-luxest text-faint"
            >
              Est. 1892
            </motion.span>

            {/* Progress hairline */}
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: '11rem' }}
              transition={{ duration: 0.9, delay: 2.4, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 h-px overflow-hidden bg-line"
            >
              <motion.div
                className="h-full origin-left bg-gradient-to-r from-gold-700 via-gold-300 to-gold-500"
                style={{ scaleX: progress / 100 }}
              />
            </motion.div>

            {/* Status line and percentage */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.6, duration: 0.6 }}
              className="mt-3 flex h-4 items-center gap-3"
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={status}
                  initial={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
                  transition={{ duration: 0.3 }}
                  className="font-sans text-[10px] uppercase tracking-luxer text-faint"
                >
                  {status}
                </motion.span>
              </AnimatePresence>

              <span className="h-2.5 w-px bg-line" />

              <span className="font-sans text-[10px] uppercase tracking-luxer text-accent tabular-nums">
                {String(Math.round(progress)).padStart(3, '0')}%
              </span>
            </motion.div>
          </motion.div>

          {/* ---- Exit flare: the stone catching the light as the frame opens ---- */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-30"
            initial={{ opacity: 0 }}
            exit={{ opacity: [0, 1, 0], transition: { duration: 0.7, times: [0, 0.3, 1] } }}
          >
            <div className="absolute left-1/2 top-1/2 h-px w-[140vw] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-gold-100 to-transparent blur-[2px]" />
            <div className="absolute left-1/2 top-1/2 h-[60vh] w-px -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-gold-200 to-transparent blur-[2px]" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
