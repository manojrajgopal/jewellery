'use client';

import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

interface HorizontalScrollSceneProps {
  children: React.ReactNode;
  /** Multiplies the scroll length. 1 travels exactly the overflow width. */
  travel?: number;
  className?: string;
  /** Rail heading, pinned to the left while the panels pass. */
  heading?: React.ReactNode;
  /**
   * Full-bleed atmosphere behind the rail — light shafts, a wash, a texture.
   * A separate slot because anything placed among the children would be
   * translated sideways with them, and a backdrop that scrolls with the
   * content is not a backdrop.
   */
  backdrop?: React.ReactNode;
  id?: string;
}

/**
 * Vertical scroll translated into horizontal travel: the section pins and its
 * children slide sideways past the viewport.
 *
 * The travel distance is derived from the actual content width at runtime
 * rather than hard-coded, so adding a panel does not silently leave the last
 * one unreachable — the usual failure mode of this pattern.
 */
export default function HorizontalScrollScene({
  children,
  travel = 1,
  className = '',
  heading,
  backdrop,
  id,
}: HorizontalScrollSceneProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 28, mass: 0.5 });

  // Measured on every frame of the transform rather than stored in state: the
  // rail's width changes with the viewport, and a resize listener writing to
  // state would re-render the whole rail on every pixel of a window drag.
  const x = useTransform(progress, (p) => {
    const rail = railRef.current;
    if (!rail) return '0px';
    const overflow = Math.max(0, rail.scrollWidth - window.innerWidth);
    return `${-p * overflow * travel}px`;
  });

  return (
    <section
      id={id}
      ref={sectionRef}
      // Tall enough that the pin has scroll to consume. 300vh gives a
      // comfortable pace for three to five panels.
      className={`relative h-[320vh] bg-canvas ${className}`}
    >
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        {backdrop && (
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
            {backdrop}
          </div>
        )}

        {heading && (
          <div className="pointer-events-none absolute inset-x-0 top-[14svh] z-20 px-6 md:px-12">
            <div className="mx-auto max-w-7xl">{heading}</div>
          </div>
        )}

        <motion.div
          ref={railRef}
          style={{ x }}
          className="flex w-max items-center gap-6 px-6 will-change-transform md:gap-10 md:px-12"
        >
          {children}
        </motion.div>

        {/* Travel indicator */}
        <div className="absolute inset-x-0 bottom-[10svh] z-20 px-6 md:px-12">
          <div className="mx-auto flex max-w-7xl items-center gap-4">
            <span className="font-accent text-[9px] uppercase tracking-luxer text-faint">
              Drag the page
            </span>
            <div className="h-px flex-1 bg-line">
              <motion.div
                style={{ scaleX: progress }}
                className="h-full origin-left bg-gradient-to-r from-gold-700 via-gold-300 to-gold-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
