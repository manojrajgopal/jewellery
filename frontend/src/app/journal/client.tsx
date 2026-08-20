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
import InkBleedReveal from '@/components/motion/InkBleedReveal';
import GoldRibbonWeave from '@/components/motion/GoldRibbonWeave';
import HoverPeelCard from '@/components/motion/HoverPeelCard';
import EchoTrailText from '@/components/motion/EchoTrailText';
import ChromaSplit from '@/components/motion/ChromaSplit';
import TypeSlamHeading from '@/components/motion/TypeSlamHeading';
import BokehDrift from '@/components/motion/BokehDrift';
import SmokeVeil from '@/components/motion/SmokeVeil';

import { journal, journalTopics, type JournalEntry } from '@/data/editorial';
import ReadingQueue, { QueueToggle } from '@/components/ui/ReadingQueue';
import ElasticRail from '@/components/motion/ElasticRail';
import TypeOnPath from '@/components/motion/TypeOnPath';

/**
 * The four stages of the print run. The front of each card is the claim; the sheet
 * underneath is what the claim costs, which is the half that makes it credible.
 */
const PRESS_RUN = [
  {
    stage: 'One',
    title: 'Written at the bench',
    detail:
      'Nobody on the shop floor writes for it. Every piece is by whoever did the work, transcribed where it has to be, and edited only for length — which is why the grammar is uneven and the technical detail is right.',
  },
  {
    stage: 'Two',
    title: 'Set in metal type',
    detail:
      'Composed by a two-person shop four streets away that still holds a full case of Caslon. A page takes them most of a day to set and about four minutes to print.',
  },
  {
    stage: 'Three',
    title: 'Printed damp',
    detail:
      'The paper is dampened so the type bites into it rather than sitting on top. Damp paper then has to dry flat under weight for five days, and those five days are the whole reason this is quarterly rather than monthly.',
  },
  {
    stage: 'Four',
    title: 'Posted, never emailed',
    detail:
      'Nine hundred copies, hand-addressed. There is no digital edition and no list to join online — ask at the boutique, or leave an address with the concierge.',
  },
] as const;

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
/**
 * Who writes the journal.
 *
 * `filed` is counted off the entries rather than hard-coded, because a hand-typed
 * count is a number that is wrong within a month. `note` is what each person
 * actually does at the bench, which is the only interesting thing about a byline
 * on a house journal — the point of this rail is that none of these people work
 * in marketing.
 */
const BYLINES = Array.from(new Set(journal.map((entry) => entry.author))).map((name) => {
  const filed = journal.filter((entry) => entry.author === name).length;
  const roles: Record<string, { role: string; note: string }> = {
    'Meera Krishnan': {
      role: 'Head of stones',
      note: 'Buys every rough that enters the building and decides how it is cut. Has refused more parcels than she has bought.',
    },
    'Arun Deshpande': {
      role: 'Master setter',
      note: 'Twenty-nine years at the same bench, under the same window. Seats four claws in about forty minutes and will not be hurried.',
    },
    'Kavita Rao': {
      role: 'Restoration',
      note: 'Takes apart pieces made by people who died before she was born, and puts them back the way they were rather than the way she would have made them.',
    },
  };
  const entry = roles[name] ?? {
    role: 'At the bench',
    note: 'Writes when there is something worth writing down, which is not often and is the reason these are worth reading.',
  };
  return { name, filed, ...entry };
});

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


        {/* ---- Put aside ----
             Placed straight after the grid rather than at the foot of the page,
             because this is the exact moment the problem exists: a reader has
             just passed a wall of headlines, three of them are interesting, and
             every one of them is a four-minute read. Without somewhere to put
             them, they read none.

             The total is stated in minutes owed rather than as a count. "Four
             entries" is a number nobody weighs; "nineteen minutes" is a
             decision. */}
        <section className="relative border-y border-hairline bg-canvas-alt py-16 md:py-20">
          <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-start">
              <ReadingQueue />

              <div>
                <TypeOnPath
                  text="Not now, but not lost"
                  curve="rise"
                  size={54}
                  travel
                  className="max-w-sm"
                />
                <p className="mt-4 font-sans text-xs font-light leading-relaxed text-secondary">
                  Nothing here is written to be skimmed — several of these entries argue with each
                  other, and the order they are read in changes the argument. So the list keeps
                  what has been read as well as what has not.
                </p>
              </div>
            </div>

            {/* Who writes them. Thrown sideways rather than listed, because a
                masthead is the least interesting possible layout for the most
                interesting fact about this journal: none of these people work in
                marketing. */}
            <div className="mt-16">
              <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
                Written at the bench, by the bench
              </p>
              <ElasticRail label="The people who write the journal" className="mt-6" gap={20}>
                {BYLINES.map((byline) => (
                  <article
                    key={byline.name}
                    className="w-72 flex-shrink-0 rounded-2xl border border-hairline bg-surface-raised/40 p-5"
                  >
                    <p className="font-display text-xl leading-tight text-primary">{byline.name}</p>
                    <p className="mt-1 font-accent text-[9px] uppercase tracking-luxe text-accent">
                      {byline.role}
                    </p>
                    <p className="mt-3 font-sans text-xs font-light leading-relaxed text-secondary">
                      {byline.note}
                    </p>
                    <p className="mt-3 border-t border-hairline pt-3 nums-tabular font-accent text-[9px] uppercase tracking-luxe text-faint">
                      {byline.filed} filed
                    </p>
                  </article>
                ))}
              </ElasticRail>
            </div>
          </div>
        </section>

        {/* ---- The standing position ----
             The grid above is what the house has written; this is why it writes
             at all. Placed between the archive and the press run, where a reader
             who has scrolled a wall of headlines needs a reason to have read them.

             The type here is the only place on the site where the echo trail runs
             at full strength on a heading \u2014 copies of the line arriving behind
             it, converging faster than the line itself, which is what motion blur
             looks like to the eye without costing a filter pass. */}
        <section className="relative overflow-hidden border-y border-hairline bg-surface-sunken py-24 md:py-32">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <BokehDrift count={16} intensity={0.36} speed={0.55} blades={6} />
            <SmokeVeil intensity={0.2} originX={0.78} speed={0.6} count={14} />
          </div>

          <div className="relative z-10 mx-auto max-w-4xl px-6 text-center md:px-12">
            <ChromaSplit amount={6} saturateAt={2000}>
              <p className="mb-7 font-accent text-[10px] uppercase tracking-luxest text-accent">
                Why we publish
              </p>
            </ChromaSplit>

            <TypeSlamHeading
              lines={['A trade that', 'explains itself', 'sells less.']}
              highlightWords={['less.']}
              as="h2"
              gap={0.17}
              className="font-display text-3xl leading-[1.1] text-primary sm:text-4xl md:text-6xl"
            />

            <div className="mx-auto mt-10 max-w-2xl space-y-6">
              <p className="font-sans text-base font-light leading-relaxed text-secondary md:text-lg">
                Which is the honest reason most jewellers do not. Every piece here gives away
                something that would be easier to keep \u2014 what a certificate does not cover, why
                clarity above eye-clean is money spent on nothing, which of our own claims we cannot
                substantiate.
              </p>

              <EchoTrailText
                text="We would rather have fewer, better-informed customers."
                as="p"
                echoes={3}
                spread={18}
                direction="left"
                persistent
                className="font-display text-2xl leading-snug text-primary md:text-3xl"
              />
            </div>
          </div>
        </section>

        {/* ---- The press run ----
             The journal is printed and posted rather than emailed, which the site
             claimed and never showed. Four stages, each hiding its own cost under a
             lifted corner, beside a proof soaking up the way the real ones do. */}
        <section className="relative overflow-hidden bg-canvas-alt py-20 md:py-28">
          <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
            <div className="mb-14 max-w-2xl">
              <p className="mb-5 font-accent text-[10px] uppercase tracking-luxest text-accent">
                How It Is Made
              </p>
              <h2 className="font-display text-3xl font-light leading-[1.12] text-primary sm:text-4xl">
                Six pages, letterpress, four times a year
              </h2>
              <p className="mt-5 font-sans text-sm font-light leading-relaxed text-muted">
                Lift a corner on any stage to read what it costs us. The reason the journal is
                quarterly is under the third one.
              </p>
            </div>

            <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
              <div className="grid gap-5 sm:grid-cols-2">
                {PRESS_RUN.map((step) => (
                  <HoverPeelCard
                    key={step.stage}
                    className="min-h-[10rem]"
                    corner={{ rest: 24, open: 118 }}
                    underside={
                      <p className="font-sans text-sm font-light leading-relaxed text-secondary">
                        {step.detail}
                      </p>
                    }
                  >
                    <div className="p-6">
                      <span className="font-accent text-[10px] uppercase tracking-luxer text-accent">
                        Stage {step.stage}
                      </span>
                      <h3 className="mt-2 font-display text-2xl leading-tight text-primary">
                        {step.title}
                      </h3>
                    </div>
                  </HoverPeelCard>
                ))}
              </div>

              <figure>
                <InkBleedReveal
                  src="/images/collections/everyday.jpg"
                  alt="A proof page coming off the press"
                  ratio={3 / 4}
                  roughness={22}
                  className="rounded-2xl border border-hairline"
                />
                <figcaption className="mt-4 font-sans text-xs font-light leading-relaxed text-muted">
                  A proof, wet. The ink edge is displaced fractal noise on the mask alone &mdash; the
                  type behind it stays as sharp as the press left it.
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        <GoldRibbonWeave className="px-6" height={100} />

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

        {/* The bookmark. On the card rather than only on the entry, because
            the decision to save something for later is made here — at the point
            of not having time for it. */}
        <div className="mt-4">
          <QueueToggle slug={entry.slug} title={entry.title} minutes={entry.read} />
        </div>

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
