'use client';

import { ReactNode, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Lock, Unlock } from 'lucide-react';

interface VaultDoorRevealProps {
  children: ReactNode;
  /** Stamped across the doors before they open. */
  label?: string;
  /** Line under the label — what is behind the door. */
  note?: string;
  className?: string;
  /** Height of the scene. The doors finish opening at the top of the last third. */
  minHeight?: string;
}

/**
 * Two steel leaves that part as the section is scrolled through, revealing
 * whatever is inside them.
 *
 * Scroll-driven rather than triggered on entry, because a door is a mechanism and
 * a mechanism should respond to the hand on it. The visitor's scroll *is* the
 * hand: keep scrolling and it opens, scroll back and it closes again. An entry
 * trigger would make it a video of a door.
 *
 * Three things move on the same progress value, which is what makes it read as
 * one object: the leaves travel outward, the dial spins (faster than the leaves,
 * and it keeps its last angle rather than resetting), and the seam of light
 * between them brightens then dies as the gap grows past it.
 *
 * The content behind the doors is always in the DOM and never transformed, so it
 * is fully readable to a screen reader and to a visitor with reduced motion
 * on — for whom the doors are not rendered at all.
 */
export default function VaultDoorReveal({
  children,
  label = 'The Vault',
  note = 'Scroll to open',
  className = '',
  minHeight = 'min-h-[92vh]',
}: VaultDoorRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Starts when the section's top reaches three-quarters of the viewport and
  // completes well before it leaves, so the payload gets a clear held beat on
  // screen with the doors fully out of the way.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'center 0.4'],
  });

  // Smoothed, because the leaves are large and any scroll jitter is legible as
  // a shudder across a surface that wide.
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.7 });

  const leftX = useTransform(p, [0, 1], ['0%', '-102%']);
  const rightX = useTransform(p, [0, 1], ['0%', '102%']);
  const dial = useTransform(p, [0, 1], [0, 430]);
  // The seam is brightest just as the leaves crack apart, then gone.
  const seam = useTransform(p, [0, 0.12, 0.38, 0.6], [0, 1, 0.85, 0]);
  const seamW = useTransform(p, [0, 1], ['2px', '34%']);
  const stamp = useTransform(p, [0, 0.3], [1, 0]);
  const contentScale = useTransform(p, [0, 1], [0.94, 1]);
  const contentOpacity = useTransform(p, [0.1, 0.55], [0.25, 1]);
  // Hoisted rather than written inline on the marker below: that JSX sits inside
  // a conditional branch, and a hook called from there would run on some renders
  // and not others.
  const openMark = useTransform(p, [0.72, 1], [0, 1]);

  return (
    <div
      ref={ref}
      className={`relative isolate-blend flex ${minHeight} items-center overflow-hidden ${className}`}
    >
      {/* The payload. Scaled and faded rather than clipped, so nothing inside it
          is ever unreachable by keyboard while the doors are shut. */}
      <motion.div
        style={reduced ? undefined : { scale: contentScale, opacity: contentOpacity }}
        className="relative z-0 w-full"
      >
        {children}
      </motion.div>

      {!reduced && (
        <>
          {/* Left leaf */}
          <motion.div
            aria-hidden="true"
            style={{ x: leftX }}
            className="vault-leaf pointer-events-none absolute inset-y-0 left-0 z-20 w-1/2 will-change-transform"
          >
            {/* Rivet column along the hinge edge. Drawn, not imaged, so it scales. */}
            <div className="absolute inset-y-8 left-4 flex flex-col justify-between">
              {Array.from({ length: 9 }).map((_, i) => (
                <span
                  key={i}
                  className="block h-2 w-2 rounded-full bg-gold-300/35 shadow-[inset_0_-1px_2px_rgb(0_0_0/0.6)]"
                />
              ))}
            </div>
            <motion.div
              style={{ opacity: stamp }}
              className="absolute inset-0 flex flex-col items-end justify-center pr-10 text-right"
            >
              <span className="font-accent text-[10px] uppercase tracking-luxest text-gold-200/70">
                Aurum
              </span>
              <span className="mt-1 font-display text-3xl text-gold-100/85 md:text-5xl">
                {label}
              </span>
            </motion.div>
          </motion.div>

          {/* Right leaf, with the dial */}
          <motion.div
            aria-hidden="true"
            style={{ x: rightX }}
            className="vault-leaf pointer-events-none absolute inset-y-0 right-0 z-20 w-1/2 will-change-transform"
          >
            <div className="absolute inset-y-8 right-4 flex flex-col justify-between">
              {Array.from({ length: 9 }).map((_, i) => (
                <span
                  key={i}
                  className="block h-2 w-2 rounded-full bg-gold-300/35 shadow-[inset_0_-1px_2px_rgb(0_0_0/0.6)]"
                />
              ))}
            </div>

            <div className="absolute inset-0 flex flex-col items-start justify-center pl-10">
              <motion.div
                style={{ rotate: dial }}
                className="vault-dial relative grid h-24 w-24 place-items-center rounded-full md:h-32 md:w-32"
              >
                {/* Index mark, so the rotation is visible on a radially
                    symmetrical object — without it the dial looks static. */}
                <span className="absolute top-1 h-4 w-[3px] rounded-full bg-ink-950/70" />
                <span className="h-8 w-8 rounded-full bg-ink-900/70 shadow-[inset_0_0_12px_rgb(0_0_0/0.9)] md:h-10 md:w-10" />
              </motion.div>

              <motion.div style={{ opacity: stamp }} className="mt-5 max-w-[16rem]">
                <span className="inline-flex items-center gap-2 font-accent text-[10px] uppercase tracking-luxer text-gold-200/70">
                  <Lock className="h-3 w-3" aria-hidden="true" />
                  Sealed
                </span>
                <p className="mt-2 font-sans text-sm font-light leading-relaxed text-cream-100/60">
                  {note}
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* The seam. Sits above both leaves so the light appears to come from
              between them rather than from either one. */}
          <motion.span
            aria-hidden="true"
            style={{ opacity: seam, width: seamW }}
            className="vault-seam pointer-events-none absolute inset-y-0 left-1/2 z-30 -translate-x-1/2"
          />

          {/* Opened state marker. Fades in as the stamp fades out, so the scene
              always says which state it is in. */}
          <motion.span
            aria-hidden="true"
            style={{ opacity: openMark }}
            className="pointer-events-none absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full border border-hairline bg-canvas/70 px-4 py-1.5 backdrop-blur-md"
          >
            <Unlock className="h-3 w-3 text-accent" aria-hidden="true" />
            <span className="font-accent text-[10px] uppercase tracking-luxer text-muted">
              Open
            </span>
          </motion.span>
        </>
      )}
    </div>
  );
}
