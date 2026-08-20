'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import { easeCine } from '@/lib/motion';

interface WaxSealRevealProps {
  children: React.ReactNode;
  /** Two or three letters pressed into the wax. */
  monogram?: string;
  /** Line under the seal, before it is broken. */
  invitation?: string;
  /** Word on the button. */
  action?: string;
  className?: string;
  /** Open on entry rather than waiting to be pressed. */
  auto?: boolean;
}

/**
 * The crack, as two halves of a torn disc. Written as clip-paths on the same
 * circle rather than as two shaped elements, so the break line is guaranteed to
 * be complementary — a hand-drawn pair leaves a hairline gap or an overlap, and
 * both read as a mistake at this size.
 */
const HALVES = [
  'polygon(0 0, 52% 0, 46% 22%, 56% 44%, 44% 68%, 54% 100%, 0 100%)',
  'polygon(52% 0, 100% 0, 100% 100%, 54% 100%, 44% 68%, 56% 44%, 46% 22%)',
] as const;

/**
 * A sealed envelope: press the wax, it cracks, and the contents unfold.
 *
 * This exists because the site has plenty of reveals and no *thresholds*. A
 * curtain, a vault door and a velvet lid all open on scroll or on entry — the
 * visitor is a spectator. A seal has to be broken by hand, and that single
 * requirement changes what the content underneath means: it was addressed to
 * whoever broke it.
 *
 * Three details do the work:
 *
 *  - The two halves rotate about their *outer* edges and travel outward as they
 *    go, so the break opens like a hinge rather than sliding apart. Wax is
 *    brittle; it does not shear cleanly.
 *  - The halves lift on the way out, catching a light that the intact seal did
 *    not have. Broken wax exposes a matte interior and a glossy edge.
 *  - The contents unfold from the fold line rather than fading in, because they
 *    were folded inside the envelope and folded paper has a memory.
 *
 * Keyboard and screen-reader users get a real button with the invitation as its
 * label, and the contents are inert until it is pressed — so this is a
 * disclosure widget wearing a costume rather than a decoration blocking content.
 */
export default function WaxSealReveal({
  children,
  monogram = 'A',
  invitation = 'Sealed for you',
  action = 'Break the seal',
  className = '',
  auto = false,
}: WaxSealRevealProps) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(auto || false);

  return (
    <div className={`relative ${className}`}>
      <AnimatePresence initial={false}>
        {!open && (
          <motion.div
            key="seal"
            exit={{ opacity: 0, transition: { duration: 0.5, delay: reduced ? 0 : 0.5 } }}
            className="relative flex flex-col items-center gap-6 py-10 text-center"
          >
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              className="group relative grid h-32 w-32 place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-4 focus-visible:ring-offset-[rgb(var(--canvas))]"
            >
              <span className="sr-only">{action}</span>

              {/* The intact seal. Two halves, each already clipped, so the break
                  needs no re-layout when it happens. */}
              {HALVES.map((clip, i) => (
                <motion.span
                  key={i}
                  aria-hidden="true"
                  className="wax-seal absolute inset-0"
                  style={{ clipPath: clip, transformOrigin: i === 0 ? '0% 50%' : '100% 50%' }}
                  initial={false}
                  animate={{ rotate: 0, x: 0, y: 0 }}
                  whileHover={reduced ? undefined : { rotate: i === 0 ? -2.5 : 2.5 }}
                  transition={{ duration: 0.5, ease: easeCine.catch }}
                />
              ))}

              <span
                aria-hidden="true"
                className="pointer-events-none relative font-display text-4xl italic text-gold-100 text-shadow-luxe"
              >
                {monogram}
              </span>

              {/* The press cue: a ring that pulses out, so the disc reads as
                  something to be pushed rather than looked at. */}
              {!reduced && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-full border border-accent/40 animate-sonar-out"
                />
              )}
            </button>

            <p className="font-accent text-[10px] uppercase tracking-luxe text-faint">
              {invitation} · <span className="text-accent">{action}</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The broken halves. Rendered only while the break is in flight, then
          unmounted — two absolutely-positioned wax fragments left in the tree
          would sit over the contents and take the clicks. */}
      <AnimatePresence>
        {open && !reduced && (
          <motion.div
            key="shards"
            className="pointer-events-none absolute left-1/2 top-10 z-20 h-32 w-32 -translate-x-1/2"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.9, delay: 0.5 }}
          >
            {HALVES.map((clip, i) => (
              <motion.span
                key={i}
                aria-hidden="true"
                className="wax-seal absolute inset-0"
                style={{ clipPath: clip, transformOrigin: i === 0 ? '0% 50%' : '100% 50%' }}
                initial={{ rotate: 0, x: 0, y: 0, filter: 'brightness(1)' }}
                animate={{
                  rotate: i === 0 ? -34 : 34,
                  x: i === 0 ? -54 : 54,
                  y: 26,
                  filter: 'brightness(1.25)',
                }}
                transition={{ duration: 0.85, ease: easeCine.heavy }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="contents"
            initial={reduced ? { opacity: 0 } : { opacity: 0, scaleY: 0.04, rotateX: -32 }}
            animate={{ opacity: 1, scaleY: 1, rotateX: 0 }}
            transition={{
              duration: reduced ? 0.2 : 1,
              delay: reduced ? 0 : 0.42,
              ease: easeCine.curtain,
            }}
            style={{ transformOrigin: '50% 0%', perspective: 1200 }}
            className="origin-top"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
