'use client';

import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

import CTAButton from '@/components/ui/CTAButton';
import CylinderMarquee from '@/components/motion/CylinderMarquee';
import ParallaxColumns from '@/components/motion/ParallaxColumns';
import ScrollAssembleText from '@/components/motion/ScrollAssembleText';
import RippleGrid from '@/components/motion/RippleGrid';
import { lookbookLeaves } from '@/data/editorial';

/** Six plates, one per chapter — the wall version of the bound book. */
const PLATES = [
  { src: '/images/collections/bridal.jpg', alt: 'Bridal suite', caption: 'I · Vows', href: '/lookbook' },
  { src: '/images/collections/heritage.jpg', alt: 'Heritage choker', caption: 'II · The Nizam Line', href: '/lookbook' },
  { src: '/images/products/ring.jpg', alt: 'Solitaire', caption: 'III · The Solitaire', href: '/lookbook' },
  { src: '/images/collections/statement.jpg', alt: 'Statement collar', caption: 'IV · Statement', href: '/lookbook' },
  { src: '/images/collections/everyday.jpg', alt: 'Everyday stack', caption: 'V · Everyday', href: '/lookbook' },
  { src: '/images/hero/craftsmanship.jpg', alt: 'The bench', caption: 'Colophon', href: '/lookbook' },
];

/**
 * The lookbook, teased rather than reproduced.
 *
 * Deliberately does not embed the book itself. A page-turning book inside a scrolling
 * page is two competing gestures in the same rectangle — the visitor reaches to turn a
 * leaf and scrolls past it instead. The bound version lives on its own page where it
 * has the room; here it is a wall of plates and a word drum, which read at a glance.
 */
export default function LookbookSection() {
  return (
    <section id="lookbook" className="relative overflow-hidden bg-canvas py-24 md:py-32">
      <RippleGrid spacing={46} reach={200} dot={1.1} />

      <div className="relative z-10 mx-auto max-w-[1500px] px-6 md:px-12">
        <div className="mb-16 grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <p className="mb-5 flex items-center gap-3 font-accent text-[10px] uppercase tracking-luxest text-accent">
              <BookOpen size={13} strokeWidth={1.7} />
              The Season, Bound
            </p>

            <ScrollAssembleText
              text="Twelve plates and five arguments"
              as="h2"
              highlightWords={['arguments']}
              spread={78}
              className="max-w-2xl font-display text-3xl font-light leading-[1.1] text-primary sm:text-4xl md:text-5xl"
            />

            <p className="mt-6 max-w-xl font-sans text-base font-light leading-relaxed text-muted">
              Each chapter takes a position and the next one argues with it. Turn the
              leaves at your own pace, or read the contact sheet as it came off the shoot.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex flex-wrap gap-4"
          >
            <CTAButton variant="primary" size="md" href="/lookbook" showArrow>
              Open the lookbook
            </CTAButton>
            <CTAButton variant="secondary" size="md" href="/journal">
              The journal
            </CTAButton>
          </motion.div>
        </div>

        <ParallaxColumns plates={PLATES} columns={3} depth={120} />

        {/* The season, as words on a drum */}
        <div className="mt-20">
          <p className="mb-6 text-center font-accent text-[10px] uppercase tracking-luxest text-accent">
            {lookbookLeaves.length} spreads · what the season is about
          </p>
          <CylinderMarquee
            items={['Proportion', 'Restraint', 'Weight', 'Foil', 'Symmetry', 'Patina', 'Light']}
            radius={130}
            speed={11}
          />
        </div>
      </div>
    </section>
  );
}
