'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Clock } from 'lucide-react';

import PageBanner from '@/components/ui/PageBanner';
import GoldDivider from '@/components/ui/GoldDivider';
import CTAButton from '@/components/ui/CTAButton';
import GradientOrb from '@/components/ui/GradientOrb';

import LiquidDistortHover from '@/components/motion/LiquidDistortHover';
import ScrollAssembleText from '@/components/motion/ScrollAssembleText';
import CylinderMarquee from '@/components/motion/CylinderMarquee';
import RippleGrid from '@/components/motion/RippleGrid';
import FoilCard from '@/components/motion/FoilCard';
import CausticsCanvas from '@/components/motion/CausticsCanvas';

import { journal, journalTopics, type JournalEntry } from '@/data/editorial';

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

/**
 * The journal index.
 *
 * The lead article gets the whole width and the distortion treatment; the rest run as
 * a grid. That hierarchy is the only editorial decision on the page, and it is worth
 * making explicitly — a journal where every entry is the same size is a list, and a
 * reader has no way in.
 */
export default function JournalClient() {
  const [topic, setTopic] = useState<string>('All');

  const visible = useMemo(
    () => (topic === 'All' ? journal : journal.filter((j) => j.topic === topic)),
    [topic]
  );

  // The lead is the newest entry in the *unfiltered* set, so it stays the lead even
  // while a filter is applied — the filter narrows the grid, not the masthead.
  const lead = journal[0];
  const rest = visible.filter((j) => j.id !== lead.id);
  const leadInFilter = visible.some((j) => j.id === lead.id);

  const totalMinutes = journal.reduce((sum, j) => sum + j.read, 0);

  return (
    <>
      <PageBanner
        title="The Journal"
        subtitle="Notes from the bench, written by the people at it"
        breadcrumbs={[{ label: 'Journal' }]}
        backgroundImage="/images/hero/craftsmanship.jpg"
      />

      <div className="overflow-hidden bg-canvas">
        {/* ---- Masthead ---- */}
        <section className="relative py-16 md:py-20">
          <RippleGrid spacing={42} reach={180} dot={1.1} />

          <div className="relative z-10 mx-auto max-w-5xl px-6 text-center md:px-12">
            <ScrollAssembleText
              text="Six pieces on why the bench does what it does"
              as="h2"
              highlightWords={['why']}
              spread={72}
              className="mx-auto max-w-3xl font-display text-3xl font-light leading-[1.12] text-primary sm:text-4xl md:text-5xl"
            />

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 font-accent text-[9px] uppercase tracking-luxe text-faint">
              <span className="nums-tabular">{journal.length} entries</span>
              <span aria-hidden="true" className="h-1 w-1 rotate-45 bg-accent/50" />
              <span className="nums-tabular">{totalMinutes} minutes in total</span>
              <span aria-hidden="true" className="h-1 w-1 rotate-45 bg-accent/50" />
              <span>Written at the bench</span>
            </div>
          </div>
        </section>

        {/* ---- Topics ---- */}
        <section className="relative px-6 md:px-12">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-2 border-y border-hairline py-5">
            {journalTopics.map((t) => (
              <button
                key={t}
                onClick={() => setTopic(t)}
                aria-pressed={topic === t}
                className={`relative rounded-full px-5 py-2.5 font-accent text-[10px] uppercase tracking-luxe transition-colors duration-300 ${
                  topic === t ? 'text-onaccent' : 'text-muted hover:text-accent'
                }`}
              >
                {topic === t && (
                  <motion.span
                    layoutId="journal-topic-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-accent shadow-gold"
                    transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                  />
                )}
                {t}
              </button>
            ))}
          </div>
        </section>

        {/* ---- Lead ---- */}
        {leadInFilter && (
          <section className="relative py-16 md:py-24">
            <GradientOrb color="gold" size="lg" position="top-right" intensity={0.09} />

            <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
              <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
                <Link href={`/journal/${lead.slug}`} data-cursor="Read">
                  <LiquidDistortHover
                    src={lead.image}
                    alt={lead.title}
                    aspect="4 / 3"
                    strength={20}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </Link>

                <div>
                  <p className="flex items-center gap-3 font-accent text-[10px] uppercase tracking-luxest text-accent">
                    {lead.kicker}
                    <span aria-hidden="true" className="block h-px w-8 bg-accent/50" />
                    <span className="text-faint">Latest</span>
                  </p>

                  <h2 className="mt-5 font-display text-3xl font-light leading-[1.1] text-primary md:text-5xl">
                    <Link
                      href={`/journal/${lead.slug}`}
                      className="link-underline transition-colors hover:text-accent"
                    >
                      {lead.title}
                    </Link>
                  </h2>

                  <p className="mt-5 max-w-prose font-display text-lg italic leading-snug text-secondary md:text-xl">
                    {lead.standfirst}
                  </p>

                  <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 font-sans text-[11px] font-light text-faint">
                    <span>{lead.author}</span>
                    <span aria-hidden="true" className="h-1 w-1 rotate-45 bg-accent/50" />
                    <span className="nums-tabular">{fmtDate(lead.date)}</span>
                    <span aria-hidden="true" className="h-1 w-1 rotate-45 bg-accent/50" />
                    <span className="nums-tabular flex items-center gap-1.5">
                      <Clock size={11} strokeWidth={1.8} />
                      {lead.read} min
                    </span>
                  </div>

                  <div className="mt-9">
                    <CTAButton variant="primary" size="md" href={`/journal/${lead.slug}`} showArrow>
                      Read this one
                    </CTAButton>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <GoldDivider variant="jewel" />

        {/* ---- Grid ---- */}
        <section className="relative py-16 md:py-24">
          <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
            <motion.div layout className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {rest.map((entry, i) => (
                  <EntryCard key={entry.id} entry={entry} index={i} />
                ))}
              </AnimatePresence>
            </motion.div>

            {rest.length === 0 && !leadInFilter && (
              <p className="py-10 text-center font-sans text-sm font-light italic text-faint">
                Nothing filed under {topic} yet. The bench is working on it.
              </p>
            )}
          </div>
        </section>

        {/* ---- The pull-quote drum ---- */}
        <section className="relative border-y border-hairline bg-surface-raised/30 py-16 md:py-24">
          <CausticsCanvas intensity={0.26} lobes={5} />
          <div className="relative z-10 mx-auto max-w-5xl px-6">
            <p className="mb-8 text-center font-accent text-[10px] uppercase tracking-luxest text-accent">
              Lines worth pulling out
            </p>
            <CylinderMarquee
              items={journal.filter((j) => j.pull).map((j) => j.pull as string)}
              radius={170}
              speed={9}
            />
          </div>
        </section>

        {/* ---- Subscribe, as a foil card ---- */}
        <section className="relative py-20 md:py-28">
          <div className="relative z-10 mx-auto max-w-3xl px-6">
            <FoilCard tilt={6}>
              <div className="flex flex-col items-center gap-5 p-9 text-center md:p-12">
                <span
                  aria-hidden="true"
                  className="block h-2.5 w-2.5 rotate-45 bg-accent shadow-[0_0_14px_3px_rgb(var(--gold-500)/0.5)]"
                />
                <h2 className="text-emboss-gold font-display text-2xl font-light md:text-3xl">
                  The journal, four times a year
                </h2>
                <p className="max-w-md font-sans text-sm font-light leading-relaxed text-muted">
                  Printed and posted, not emailed. Six pages, no offers, and the bench
                  writes all of it. Ask for a copy at the boutique or leave an address
                  with the concierge.
                </p>
                <div className="mt-2 flex flex-wrap justify-center gap-3">
                  <CTAButton variant="primary" size="md" href="/contact" showArrow>
                    Ask for a copy
                  </CTAButton>
                  <CTAButton variant="secondary" size="md" href="/lookbook">
                    See the lookbook
                  </CTAButton>
                </div>
              </div>
            </FoilCard>
          </div>
        </section>
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */

function EntryCard({ entry, index }: { entry: JournalEntry; index: number }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.55, delay: (index % 6) * 0.06, ease: [0.22, 1, 0.36, 1] }}
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

        <h3 className="mt-3 font-display text-xl font-light leading-snug text-primary md:text-2xl">
          <Link
            href={`/journal/${entry.slug}`}
            className="transition-colors group-hover:text-accent"
          >
            {entry.title}
          </Link>
        </h3>

        <p className="mt-3 line-clamp-3 font-sans text-sm font-light leading-relaxed text-muted">
          {entry.standfirst}
        </p>

        <div className="mt-auto flex items-center justify-between gap-4 border-t border-hairline pt-4 mt-5">
          <span className="font-sans text-[10px] font-light text-faint">
            {entry.author} · {fmtDate(entry.date)}
          </span>
          <span className="nums-tabular flex items-center gap-1.5 font-accent text-[9px] uppercase tracking-luxe text-faint">
            {entry.read} min
            <ArrowUpRight
              size={12}
              className="text-accent opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
            />
          </span>
        </div>
      </div>
    </motion.article>
  );
}
