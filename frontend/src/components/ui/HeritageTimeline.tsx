'use client';

import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

import Odometer from '@/components/motion/Odometer';
import MetalText from '@/components/motion/MetalText';

interface Era {
  year: number;
  title: string;
  body: string;
  marker: string;
}

const ERAS: Era[] = [
  {
    year: 1892,
    title: 'A bench in Zaveri Bazaar',
    body: 'Hiralal Shah takes a two-man workshop behind the pearl market, cutting settings for other people’s stones. The ledger from that first year survives; the handwriting is unreadable and the arithmetic is perfect.',
    marker: 'Founded',
  },
  {
    year: 1906,
    title: 'The Jaipur buying house',
    body: 'Rather than buy coloured stones through Bombay brokers, the house opens its own room in Johari Bazaar. Emeralds have been bought at source ever since — a decision that looked eccentric for about fifteen years.',
    marker: 'Expansion',
  },
  {
    year: 1931,
    title: 'The Baroda commission',
    body: 'Two hundred and eleven uncut stones, one necklace, eight months. Photographed once, worn twice, and returned to the family vault. The gouache rendering hangs in the Mumbai house.',
    marker: 'Commission',
  },
  {
    year: 1948,
    title: 'Delhi, and a second generation',
    body: 'The Chanakyapuri salon opens with two full-time polki setters. Uncut work becomes the house’s second discipline rather than an occasional favour.',
    marker: 'Second house',
  },
  {
    year: 1971,
    title: 'South, and temple work',
    body: 'Chennai brings a tradition the Bombay bench had never worked in. Three artisans move down for what was meant to be a season and stay for their careers.',
    marker: 'Third house',
  },
  {
    year: 1994,
    title: 'Nizami revival',
    body: 'Hyderabad opens as the archive is catalogued for the first time. Nineteen designs from the 1930s go back into production, largely unchanged.',
    marker: 'Archive',
  },
  {
    year: 2009,
    title: 'The CAD studio',
    body: 'Bengaluru adds computer modelling to the workflow — and, more usefully, wax printing. The bench still finishes everything by hand; the wax simply removes a fortnight of guesswork.',
    marker: 'Modernisation',
  },
  {
    year: 2024,
    title: 'Fourth generation, same bench',
    body: 'Devrath Shah takes over the Mumbai workshop. The 1892 ledger is still in the safe, and the arithmetic still checks out.',
    marker: 'Today',
  },
];

/**
 * The house history as a scroll-scrubbed rail.
 *
 * The spine fills in proportion to scroll rather than each entry animating
 * independently, so progress through 132 years is legible at a glance — you can
 * see how far through the story you are without reading a single date.
 *
 * Entries alternate sides on desktop and stack on mobile. The alternation is
 * done with grid column placement rather than absolute positioning, so a long
 * entry simply grows and the spine stays welded to the middle.
 */
export default function HeritageTimeline({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 70%', 'end 60%'],
  });
  const fill = useSpring(scrollYProgress, { stiffness: 60, damping: 26 });
  const glowY = useTransform(fill, [0, 1], ['0%', '100%']);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Spine */}
      <div className="pointer-events-none absolute bottom-0 left-4 top-0 w-px bg-line md:left-1/2 md:-translate-x-1/2">
        <motion.span
          style={{ scaleY: fill }}
          className="block h-full w-px origin-top bg-gradient-to-b from-gold-600 via-gold-300 to-gold-500"
        />
        {/* Travelling bead at the head of the fill */}
        <motion.span
          style={{ top: glowY }}
          className="absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-gold-200 shadow-[0_0_20px_6px_rgb(var(--gold-400)/0.6)]"
        />
      </div>

      <ol className="space-y-14 md:space-y-24">
        {ERAS.map((era, i) => (
          <EraRow key={era.year} era={era} index={i} />
        ))}
      </ol>
    </div>
  );
}

function EraRow({ era, index }: { era: Era; index: number }) {
  const left = index % 2 === 0;

  return (
    <li className="relative grid grid-cols-[2rem_1fr] gap-4 md:grid-cols-2 md:gap-14">
      {/* Node */}
      <motion.span
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: '-20%' }}
        transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
        aria-hidden="true"
        className="absolute left-4 top-3 z-10 h-3 w-3 -translate-x-1/2 rotate-45 border border-gold-200/70 bg-gradient-to-br from-gold-200 to-gold-600 shadow-[0_0_16px_4px_rgb(var(--gold-400)/0.4)] md:left-1/2"
      />

      {/* Spacer so the entry lands on the correct side of the spine */}
      {!left && <span className="hidden md:block" aria-hidden="true" />}

      <motion.div
        initial={{ opacity: 0, x: left ? -46 : 46, filter: 'blur(10px)' }}
        whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-15%' }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className={`col-start-2 md:col-start-auto ${left ? 'md:text-right' : ''}`}
      >
        <span
          className={`mb-3 flex items-baseline gap-3 ${
            left ? 'md:justify-end' : ''
          }`}
        >
          <MetalText
            as="span"
            alloy="gold"
            className="font-display text-4xl leading-none md:text-5xl"
          >
            <Odometer value={era.year} duration={1.4} />
          </MetalText>
          <span className="font-accent text-[10px] uppercase tracking-luxer text-accent">
            {era.marker}
          </span>
        </span>

        <h3 className="mb-3 font-display text-2xl leading-snug text-primary md:text-3xl">
          {era.title}
        </h3>

        <p className="max-w-md font-sans text-sm leading-relaxed text-muted md:text-[15px]">
          {era.body}
        </p>

        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden="true"
          className={`mt-5 block h-px w-24 bg-gradient-to-r from-accent to-transparent ${
            left ? 'md:ml-auto md:bg-gradient-to-l' : ''
          }`}
        />
      </motion.div>
    </li>
  );
}
