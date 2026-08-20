'use client';

import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

import { gateWeave, lampBreathe } from '@/lib/motion';

type Format = 'academy' | 'vista' | 'scope' | 'free';

interface ProjectorGateProps {
  children: React.ReactNode;
  className?: string;
  /** Frame format the gate is plated for. 'free' keeps whatever the child is. */
  format?: Format;
  /** Perforation strips down the sides. Off for a frame inside body copy. */
  sprockets?: boolean;
  /** How much play the claw has, in px of drift. 0 stops the weave entirely. */
  weave?: number;
  /** Caption set under the gate, in the projectionist's own shorthand. */
  footage?: string;
  /** Reel-tail scratches along the bottom edge — for the last frame of a run. */
  tail?: boolean;
}

const FORMATS: Record<Format, string> = {
  academy: 'aspect-academy',
  vista: 'aspect-vista',
  scope: 'aspect-scope',
  free: '',
};

/**
 * A projector gate, with the frame running through it.
 *
 * The site already has film *grain* and letterbox *bars*, and both are surface
 * treatments applied on top of a picture. This is the mechanism instead: the
 * aperture plate that crops the frame, the perforation strips that run past it,
 * the lamp hot-spot behind it and the claw's play that makes the whole image
 * drift a fraction of a percent while it sits there.
 *
 * The weave is the part worth explaining. A projected frame is never still —
 * the pull-down claw has mechanical slack, so the image wanders by well under a
 * pixel at viewing distance and never on a period you can count. That
 * sub-pixel wander is the entire difference between "a photograph with a filter
 * on it" and "something being projected", and it is why the drift here is an
 * unsmoothed keyframe list with two mismatched cycle lengths rather than a
 * spring. A spring would settle, and settling is the one thing a gate does not
 * do.
 *
 * The frame line across the top is the second half of the illusion: it is the
 * bottom of the *previous* frame bleeding through, which only happens because a
 * gate is never perfectly registered. Take it away and the crop reads as a CSS
 * border.
 *
 * Under a reduced-motion preference the lamp stays on, the plate stays cropped
 * and the perforations stay printed — the motor simply stops. That is a real
 * state a projector can be in, so nothing about the frame has to be explained
 * away.
 */
export default function ProjectorGate({
  children,
  className = '',
  format = 'vista',
  sprockets = true,
  weave = 1.2,
  footage,
  tail = false,
}: ProjectorGateProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: '-8% 0px -8% 0px' });
  const reduced = useReducedMotion();

  const running = inView && !reduced && weave > 0;

  return (
    <figure ref={ref} className={`relative ${className}`}>
      <div className="relative flex items-stretch gap-2 md:gap-3">
        {/* Perforations stay printed whether or not the motor is running — the
            class carries both the holes and their travel, and the CSS layer
            already stops the travel under a reduced-motion preference. */}
        {sprockets && (
          <div
            aria-hidden="true"
            className="sprocket-strip w-[18px] shrink-0 rounded-sm bg-surface-sunken/60"
          />
        )}

        <div className="relative min-w-0 flex-1 isolate-blend">
          {/* The gate itself. The weave lives on this wrapper rather than on the
              picture, so the aperture crop travels with the frame — a crop that
              stayed put while the image drifted would show the drift as a
              sliding edge, which is the opposite of the illusion. */}
          <motion.div
            variants={gateWeave(weave)}
            initial="hidden"
            animate={running ? 'visible' : 'hidden'}
            className={`gate-aperture relative overflow-hidden rounded-sm bg-black/40 ${FORMATS[format]}`}
          >
            <div className="absolute inset-0 [&>*]:h-full [&>*]:w-full [&_img]:h-full [&_img]:w-full [&_img]:object-cover">
              {children}
            </div>

            {/* Lamp hot-spot. Screen-blended, so it brightens the picture rather
                than washing a grey film over it. */}
            <motion.span
              aria-hidden="true"
              variants={lampBreathe(7.5)}
              initial="hidden"
              animate={reduced ? 'hidden' : 'visible'}
              className="gate-hotspot pointer-events-none absolute inset-0"
            />

            {/* The vignette a condenser lens cannot avoid. Corners only. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_50%,transparent_58%,rgb(var(--shadow-color)/0.42))]"
            />

            {tail && (
              <span
                aria-hidden="true"
                className="reel-tail pointer-events-none absolute inset-x-0 bottom-0 h-8"
              />
            )}
          </motion.div>
        </div>

        {sprockets && (
          <div
            aria-hidden="true"
            className="sprocket-strip w-[18px] shrink-0 rounded-sm bg-surface-sunken/60"
          />
        )}
      </div>

      {footage && (
        <figcaption className="mt-3 flex items-center gap-3 font-accent text-[10px] uppercase tracking-luxe text-faint">
          <span className="nums-instrument">{footage}</span>
          <span aria-hidden="true" className="h-px flex-1 bg-line/50" />
          <span>{format === 'free' ? 'gate' : format}</span>
        </figcaption>
      )}
    </figure>
  );
}
