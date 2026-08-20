'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

interface SilkWaveProps {
  src: string;
  alt: string;
  className?: string;
  /** Number of vertical panels the cloth is cut into. */
  panels?: number;
  /** Ratio of the frame, width / height. */
  ratio?: number;
  /** Keep the cloth breathing after the reveal has finished. */
  live?: boolean;
}

/**
 * A photograph revealed as though a length of silk were being drawn off it, and
 * then left to move in the draught.
 *
 * The cloth is a row of vertical panels over the image. Each falls on a delay
 * derived from a sine of its index, not a linear stagger — a linear stagger reads
 * as a garage door, while a sine gives the middle of the run a head start and lets
 * the ends lag, which is how a hanging fabric actually releases.
 *
 * After the reveal the panels stay in the DOM at zero height and a second, much
 * gentler wave runs on the image itself through a skew and a translate per column.
 * That is the part that sells it: a still photograph behind a finished reveal
 * looks like a slideshow, and the residual movement is what keeps the section
 * feeling like cloth rather than glass.
 */
export default function SilkWave({
  src,
  alt,
  className = '',
  panels = 14,
  ratio = 16 / 10,
  live = true,
}: SilkWaveProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: '-12% 0px -12% 0px' });

  const strips = Array.from({ length: panels }, (_, i) => i);

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio: `${ratio}` }}
    >
      {/* The photograph. Split into the same number of columns as the cloth so
          the residual wave can run across it; each column shows its own slice of
          one background image rather than loading its own copy. */}
      <div className="absolute inset-0 flex">
        {strips.map((i) => (
          <motion.span
            key={i}
            aria-hidden="true"
            className="block h-full flex-1 will-change-transform"
            style={{
              backgroundImage: `url(${src})`,
              backgroundSize: `${panels * 100}% 100%`,
              backgroundPosition: `${panels > 1 ? (i / (panels - 1)) * 100 : 50}% 50%`,
            }}
            animate={
              reduced || !live
                ? undefined
                : {
                    // Amplitude falls off toward the edges, where the cloth
                    // would be pinned.
                    y: [0, Math.sin((i / panels) * Math.PI) * -6, 0],
                    skewY: [0, Math.sin((i / panels) * Math.PI * 2) * 0.6, 0],
                  }
            }
            transition={{
              duration: 6.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.09,
            }}
          />
        ))}
      </div>

      {/* The cloth. Drops away panel by panel. */}
      {!reduced &&
        strips.map((i) => {
          // Sine-weighted delay: middle first, edges last.
          const delay = 0.06 + (1 - Math.sin((i / (panels - 1 || 1)) * Math.PI)) * 0.5;
          return (
            <motion.span
              key={`veil-${i}`}
              aria-hidden="true"
              initial={{ scaleY: 1 }}
              animate={inView ? { scaleY: 0 } : { scaleY: 1 }}
              transition={{ duration: 1.15, delay, ease: [0.76, 0, 0.24, 1] }}
              className="absolute top-0 z-10 h-full origin-bottom"
              style={{
                left: `${(i / panels) * 100}%`,
                width: `${100 / panels + 0.15}%`,
                // Nap: alternate panels catch the light differently, which is
                // what makes a flat colour read as woven.
                backgroundImage:
                  i % 2 === 0
                    ? 'linear-gradient(178deg, rgb(var(--burgundy-700) / 0.96), rgb(var(--burgundy-900)))'
                    : 'linear-gradient(178deg, rgb(var(--burgundy-900)), rgb(var(--burgundy-700) / 0.9))',
                boxShadow: 'inset 1px 0 0 rgb(var(--gold-200) / 0.06)',
              }}
            />
          );
        })}

      {/* Sheen crossing the cloth just before it goes — a light source above the
          fabric, which is why it runs at an angle and fades early. */}
      {!reduced && (
        <motion.span
          aria-hidden="true"
          initial={{ x: '-40%', opacity: 0 }}
          animate={inView ? { x: '140%', opacity: [0, 0.45, 0] } : {}}
          transition={{ duration: 1.4, ease: 'easeOut' }}
          className="pointer-events-none absolute inset-y-0 z-20 w-1/4 -skew-x-6 bg-gradient-to-r from-transparent via-gold-100/40 to-transparent blend-screen"
        />
      )}

      <span className="sr-only">{alt}</span>
    </div>
  );
}
