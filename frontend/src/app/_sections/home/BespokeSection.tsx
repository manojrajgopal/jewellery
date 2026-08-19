'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

import SectionHeading from '@/components/ui/SectionHeading';
import BespokeStudio from '@/components/ui/BespokeStudio';
import GodRays from '@/components/motion/GodRays';
import ParticleField from '@/components/motion/ParticleField';
import ScrollPathDraw from '@/components/motion/ScrollPathDraw';

/**
 * The commissioning bench, dropped into the home page between the atelier tools
 * and the testimonials.
 *
 * It sits here rather than higher up on purpose: by this point the visitor has
 * seen the film, the stone and the workshop, so "design your own" reads as an
 * invitation rather than as a form to fill in.
 */
export default function BespokeSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const glowY = useTransform(scrollYProgress, [0, 1], ['-12%', '12%']);

  return (
    <section
      ref={ref}
      id="bespoke"
      className="relative overflow-hidden bg-canvas-alt py-28 md:py-36"
    >
      {/* Atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <GodRays intensity="soft" originX={82} originY={-10} />
        <ParticleField count={40} rise link />
        <motion.div
          style={{ y: glowY }}
          className="absolute left-1/2 top-1/3 h-[46rem] w-[46rem] -translate-x-1/2 rounded-full bg-gold-radial opacity-70 blur-3xl"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-16 flex flex-col items-center">
          <SectionHeading
            eyebrow="The Commission"
            title="Draw it before we cut it"
            highlightWords={['cut']}
            subtitle="Every choice below changes the drawing beside it and the number under it. Build the piece you actually want, then send the specification to our design bench — no obligation, no deposit, no salesperson."
          />

          {/* A single ruled flourish that draws itself as the heading settles. */}
          <ScrollPathDraw
            d="M2 20 C 26 4, 48 34, 74 18 S 122 4, 148 20"
            viewBox="0 0 150 40"
            strokeWidth={0.9}
            className="mt-2 h-10 w-full max-w-md"
            offset={['start 90%', 'center 60%']}
          />
        </div>

        <BespokeStudio />
      </div>
    </section>
  );
}
