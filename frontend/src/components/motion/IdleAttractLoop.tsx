'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import { easeCine } from '@/lib/motion';

interface IdleAttractLoopProps {
  /** Seconds of no input before the invitation appears. */
  after?: number;
  /** Lines cycled through while idle. */
  lines?: string[];
  /** Seconds each line is held. */
  hold?: number;
}

const DEFAULT_LINES = [
  'Every stone here was chosen by one of six people, by hand',
  'Press ⌘K to search the house — pieces, stones, services',
  'The atelier is a real room. Come and stand in it',
  'Nothing on this page was retouched. That is the point',
  'Four generations, one window, and the only good light in the building',
];

/**
 * The attract loop.
 *
 * Borrowed from the one place this pattern is genuinely well solved: a museum
 * kiosk, or an arcade cabinet with nobody at it. After a long stretch of no
 * input, the screen stops waiting and starts saying something — and the moment
 * anybody touches anything, it stops instantly and does not come back for a
 * while.
 *
 * The rules are the whole design, because an attract loop that gets any of them
 * wrong is an interruption rather than an invitation:
 *
 *  - It only appears after a *long* idle (75 seconds by default). Somebody
 *    reading a paragraph is not idle.
 *  - Any input at all dismisses it: pointer, key, wheel, touch, scroll. It does
 *    not need to be dismissed *at*; there is no close button, because there is
 *    nothing to close.
 *  - After a dismissal the timer restarts from a longer base, so a visitor who
 *    is reading slowly is not repeatedly told the site is still here.
 *  - It never covers anything. It is a bar at the bottom edge and a very slight
 *    vignette, both pointer-transparent, and it is `aria-hidden` — a screen
 *    reader user has no idle state for this to be about.
 *  - Reduced motion switches it off entirely. An unrequested animation appearing
 *    on its own is the single clearest case of motion somebody did not ask for.
 */
export default function IdleAttractLoop({
  after = 75,
  lines = DEFAULT_LINES,
  hold = 6.5,
}: IdleAttractLoopProps) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(false);
  const [index, setIndex] = useState(0);
  // Grows each time the loop has been dismissed, so a slow reader is asked once
  // and then progressively left alone.
  const patience = useRef(after);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const arm = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setActive(true), patience.current * 1000);
  }, []);

  useEffect(() => {
    if (reduced) return;

    const wake = () => {
      setActive((wasActive) => {
        if (wasActive) patience.current = Math.min(patience.current * 1.6, 420);
        return false;
      });
      arm();
    };

    const events: (keyof WindowEventMap)[] = [
      'pointerdown',
      'pointermove',
      'keydown',
      'wheel',
      'touchstart',
      'scroll',
    ];

    events.forEach((e) => window.addEventListener(e, wake, { passive: true }));
    arm();

    return () => {
      events.forEach((e) => window.removeEventListener(e, wake));
      if (timer.current) clearTimeout(timer.current);
    };
  }, [reduced, arm]);

  // Cycle the lines only while the loop is up. A timer running behind a hidden
  // element is a timer nobody is watching.
  useEffect(() => {
    if (!active || lines.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % lines.length), hold * 1000);
    return () => clearInterval(id);
  }, [active, hold, lines.length]);

  if (reduced) return null;

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="attract"
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45 } }}
          transition={{ duration: 1.6, ease: easeCine.glass }}
          className="pointer-events-none fixed inset-0 z-[95]"
        >
          {/* The vignette. Deliberately weak: it is a change in the light in the
              room, not a scrim over the page. */}
          <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_50%,transparent_38%,rgb(var(--shadow-color)/0.34))]" />

          {/* A single travelling glint across the top edge — the only thing on
              screen that moves quickly, so the eye is given somewhere to go. */}
          <div className="absolute inset-x-0 top-0 h-px overflow-hidden">
            <motion.span
              className="absolute inset-y-0 w-1/3 bg-[linear-gradient(90deg,transparent,rgb(var(--gold-300)/0.9),transparent)]"
              animate={{ x: ['-120%', '420%'] }}
              transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>

          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 pb-10">
            <AnimatePresence mode="wait">
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -14, filter: 'blur(6px)' }}
                transition={{ duration: 1, ease: easeCine.glass }}
                className="max-w-xl px-6 text-center font-display text-lg italic leading-snug text-on-media-soft md:text-2xl"
              >
                {lines[index]}
              </motion.p>
            </AnimatePresence>

            <span className="font-accent text-[9px] uppercase tracking-luxest text-faint">
              Move to continue
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
