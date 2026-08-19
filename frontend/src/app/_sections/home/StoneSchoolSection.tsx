'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

import SectionHeading from '@/components/ui/SectionHeading';
import FourCsExplorer from '@/components/ui/FourCsExplorer';
import CausticsCanvas from '@/components/motion/CausticsCanvas';
import LensFlare from '@/components/motion/LensFlare';
import ScrollTextMask from '@/components/motion/ScrollTextMask';

/**
 * The stone school: the 4Cs handed over as a toy rather than a table.
 *
 * Placed straight after the showcase, where the visitor has just watched a
 * single stone turn in the light and is at their most curious about why one is
 * worth six times another.
 */
export default function StoneSchoolSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const veil = useTransform(scrollYProgress, [0, 0.4, 1], [0.9, 0.2, 0.9]);

  return (
    <section
      ref={ref}
      id="stone-school"
      className="relative overflow-hidden bg-canvas py-28 md:py-36"
    >
      <div className="pointer-events-none absolute inset-0">
        <CausticsCanvas intensity={0.4} lobes={6} speed={32} />
        <LensFlare intensity={0.35} originX={78} originY={18} follow={false} />
        <motion.div
          style={{ opacity: veil }}
          className="absolute inset-0 bg-gradient-to-b from-canvas via-transparent to-canvas"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-14">
          <SectionHeading
            eyebrow="The Stone School"
            title="Move a dial, watch the price move"
            highlightWords={['price']}
            subtitle="Four grades decide what a diamond costs, and only one of them was decided by a person. Play with all four and you will find the trade-off the trade already knows."
          />
        </div>

        <FourCsExplorer className="mb-20" />

        <div className="mx-auto max-w-3xl text-center">
          <ScrollTextMask
            text="Nobody has ever looked across a dinner table and noticed clarity. They notice the cut, because the cut is what throws light. Spend there first, take an eye-clean stone, and let the two grades nobody can see fund a better setting instead."
            highlightWords={['cut', 'light.', 'setting']}
            className="font-display text-2xl leading-relaxed md:text-3xl"
          />
        </div>
      </div>
    </section>
  );
}
