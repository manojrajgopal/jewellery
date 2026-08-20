'use client';

import { ReactNode, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

import { creaseOpen, creaseShade } from '@/lib/motion';

interface FoldedNoteUnfoldProps {
  /** The three panels, top to bottom. A letter folded in three has three. */
  panels: [ReactNode, ReactNode, ReactNode];
  /** Signed at the foot, in the display italic. */
  signature?: string;
  /** Who it is from, in small caps under the signature. */
  role?: string;
  className?: string;
  /** Paper stock. Matches the existing note stocks used elsewhere. */
  stock?: 'ruled' | 'plain' | 'laid';
}

/**
 * A letter folded in three, opening.
 *
 * A trifold is the fold every letter in the world uses and almost nobody thinks
 * about: the sheet is folded so that the *bottom* panel goes up first and the
 * *top* panel comes down over it, which means that when it is opened the top
 * panel lifts away before the bottom one drops. The panels therefore do not
 * unfold in reading order, and getting that backwards is the thing that makes
 * an animated letter feel like a stack of cards.
 *
 * The other half of it is shade. A raised leaf throws a shadow onto the leaf
 * underneath, that shadow is deepest exactly while the fold is moving, and it
 * is gone the instant the sheet is flat. Without it, paper reads as a hinged
 * plastic panel — which is why `creaseShade` exists alongside `creaseOpen`
 * rather than the fold being one variant.
 *
 * Deliberately distinct from `HeirloomNote` and `WaxSealReveal`. The first is a
 * tool for *writing* a note and the second is a seal being broken. This is the
 * sheet itself, and the only thing it does is open.
 */

const STOCKS: Record<string, string> = {
  ruled: 'stock-ruled',
  plain: 'paper-stock',
  laid: 'paper-stock guilloche-field',
};

export default function FoldedNoteUnfold({
  panels,
  signature,
  role,
  className = '',
  stock = 'plain',
}: FoldedNoteUnfoldProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: '-18% 0px -18% 0px' });
  const state = reduced || inView ? 'visible' : 'hidden';

  // Opening order, not reading order: the top leaf lifts first, then the
  // bottom, and the middle panel was never folded at all.
  const order = [1, 0, 2];

  return (
    <div ref={ref} className={`perspective-1200 ${className}`}>
      <div
        className={`${STOCKS[stock]} relative mx-auto max-w-xl overflow-hidden rounded-sm shadow-lift`}
      >
        {panels.map((panel, i) => (
          <motion.div
            key={i}
            initial="hidden"
            animate={state}
            variants={reduced ? undefined : creaseOpen(order[i])}
            style={{
              transformOrigin: i === 0 ? 'bottom center' : i === 2 ? 'top center' : 'center',
              transformStyle: 'preserve-3d',
            }}
            className="relative px-7 py-6"
          >
            {panel}

            {/* The shade the fold throws while it is moving. Sits over the panel
                below rather than over its own, which is what a real fold does. */}
            {!reduced && i !== 1 && (
              <motion.span
                aria-hidden="true"
                initial="hidden"
                animate={state}
                variants={creaseShade(order[i])}
                className="fold-crease pointer-events-none absolute inset-x-0 bottom-0 h-16"
                style={{ ['--fold-shade' as string]: 1 }}
              />
            )}

            {/* The crease itself stays visible after it has opened. Paper
                remembers a fold, and a letter with no crease in it is a letter
                that was never sent. */}
            {i !== 2 && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-6 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgb(var(--shadow-color)/0.22)_18%,rgb(var(--shadow-color)/0.22)_82%,transparent)]"
              />
            )}
          </motion.div>
        ))}

        {(signature || role) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={state === 'visible' ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: reduced ? 0 : 1.1 }}
            className="px-7 pb-8"
          >
            {signature && (
              <p className="font-display text-2xl italic leading-none text-primary">
                {signature}
              </p>
            )}
            {role && (
              <p className="mt-2 font-accent text-[10px] uppercase tracking-luxe text-faint">
                {role}
              </p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
