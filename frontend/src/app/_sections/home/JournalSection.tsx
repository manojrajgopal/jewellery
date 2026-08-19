'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Clock } from 'lucide-react';

import SectionHeading from '@/components/ui/SectionHeading';
import CTAButton from '@/components/ui/CTAButton';
import LiquidDistortHover from '@/components/motion/LiquidDistortHover';
import ScrollStackCards from '@/components/motion/ScrollStackCards';
import { journal } from '@/data/editorial';

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });

/**
 * Three journal entries, and the house's positions stacked behind them.
 *
 * The stack carries the arguments rather than the articles. An article teaser has to
 * earn a click; a position does not — it either lands or it does not, and putting the
 * four sharpest ones in a pile the visitor scrolls through is a faster way to say what
 * kind of jeweller this is than three paragraphs of standfirst.
 */
const POSITIONS = [
  {
    id: 'p1',
    kicker: 'On cutting',
    title: 'We give up twelve per cent of the weight on purpose',
    body: 'A cutter paid by yield keeps the pavilion deep and the table wide. We cut to the proportions that return light, log the loss on the passport, and let the stone argue its own case in the showroom.',
    accent: 'gold' as const,
    meta: ['Rough-to-polished logged'],
  },
  {
    id: 'p2',
    kicker: 'On grading',
    title: 'We never grade our own goods',
    body: 'Every stone above 0.30ct goes to a laboratory with no commercial relationship to the house. A jeweller grading their own inventory is not a grading report, it is a price list with letters on it.',
    accent: 'jade' as const,
    meta: ['Third-party report on every stone'],
  },
  {
    id: 'p3',
    kicker: 'On matched sets',
    title: 'A perfectly matched suite is an aesthetic dead end',
    body: 'Matching six stones takes months of sourcing and produces a piece with no internal argument. We build the deliberate mismatch in — one stone a shade deeper, set where the eye lands last.',
    accent: 'amethyst' as const,
    meta: ['Colour deliberately uneven'],
  },
  {
    id: 'p4',
    kicker: 'On service',
    title: 'Service is free for ever, receipt or not',
    body: 'Anything we made, whether or not you were the person who bought it. The mark inside tells us it is ours, and the ledger tells us who set it — which is how a fifty-year-old retip gets done properly.',
    accent: 'burgundy' as const,
    meta: ['No time limit', 'No receipt needed'],
  },
];

export default function JournalSection() {
  const featured = journal.slice(0, 3);

  return (
    <section
      id="journal"
      className="relative overflow-hidden border-y border-hairline bg-canvas-alt py-24 md:py-32"
    >
      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
        <SectionHeading
          eyebrow="From The Bench"
          title="Four positions we will defend"
          highlightWords={['defend']}
          subtitle="Written by the people at the bench, about the decisions that cost us money and are still the right ones."
          align="center"
          className="mb-16"
        />

        {/* The positions, as a stack. Extra bottom room so the last card has scroll
            left to stick against. */}
        <div className="mb-24 pb-[25vh]">
          <ScrollStackCards cards={POSITIONS} offset={20} shrink={0.05} />
        </div>

        {/* Three entries */}
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6 border-t border-hairline pt-12">
          <div>
            <p className="font-accent text-[10px] uppercase tracking-luxest text-accent">
              The Journal
            </p>
            <h3 className="mt-3 font-display text-2xl font-light leading-snug text-primary md:text-3xl">
              Six pieces, none of them about buying anything
            </h3>
          </div>
          <CTAButton variant="secondary" size="md" href="/journal" showArrow>
            All entries
          </CTAButton>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {featured.map((entry, i) => (
            <motion.article
              key={entry.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.65, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
              className="group flex flex-col"
            >
              <Link href={`/journal/${entry.slug}`} data-cursor="Read" className="block">
                <LiquidDistortHover
                  src={entry.image}
                  alt={entry.title}
                  aspect="4 / 3"
                  strength={16}
                  frequency={0.016}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </Link>

              <div className="flex flex-1 flex-col pt-5">
                <p className="font-accent text-[9px] uppercase tracking-luxest text-accent">
                  {entry.kicker}
                </p>

                <h4 className="mt-3 font-display text-xl font-light leading-snug text-primary">
                  <Link
                    href={`/journal/${entry.slug}`}
                    className="transition-colors group-hover:text-accent"
                  >
                    {entry.title}
                  </Link>
                </h4>

                <p className="mt-3 line-clamp-3 font-sans text-sm font-light leading-relaxed text-muted">
                  {entry.standfirst}
                </p>

                <div className="mt-auto flex items-center justify-between gap-4 border-t border-hairline pt-4 mt-5">
                  <span className="font-sans text-[10px] font-light text-faint">
                    {entry.author} · {fmtDate(entry.date)}
                  </span>
                  <span className="nums-tabular flex items-center gap-1.5 font-accent text-[9px] uppercase tracking-luxe text-faint">
                    <Clock size={10} strokeWidth={1.9} />
                    {entry.read} min
                    <ArrowUpRight
                      size={12}
                      className="text-accent opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
