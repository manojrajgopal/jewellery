'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Crown, Gem, Leaf, ScrollText, ShieldCheck } from 'lucide-react';
import PageBanner from '@/components/ui/PageBanner';
import CTAButton from '@/components/ui/CTAButton';
import SectionHeading from '@/components/ui/SectionHeading';
import GoldDivider from '@/components/ui/GoldDivider';
import GradientOrb from '@/components/ui/GradientOrb';
import SpotlightCard from '@/components/motion/SpotlightCard';
import CurtainReveal from '@/components/motion/CurtainReveal';
import Parallax from '@/components/motion/Parallax';
import CountUp from '@/components/motion/CountUp';
import FadeInOnView from '@/components/animations/FadeInOnView';
import HeritageTimeline from '@/components/ui/HeritageTimeline';
import CausticsCanvas from '@/components/motion/CausticsCanvas';
import ScrollStackCards from '@/components/motion/ScrollStackCards';
import ScrollAssembleText from '@/components/motion/ScrollAssembleText';
import CylinderMarquee from '@/components/motion/CylinderMarquee';
import RippleGrid from '@/components/motion/RippleGrid';
import FoilCard from '@/components/motion/FoilCard';
import FlipClock from '@/components/motion/FlipClock';
import InkBleedReveal from '@/components/motion/InkBleedReveal';
import GoldRibbonWeave from '@/components/motion/GoldRibbonWeave';
import CinematicLetterbox from '@/components/motion/CinematicLetterbox';
import MosaicShuffle from '@/components/motion/MosaicShuffle';
import ScrollSpineTimeline, { type SpineNode } from '@/components/motion/ScrollSpineTimeline';
import TypeSlamHeading from '@/components/motion/TypeSlamHeading';
import EchoTrailText from '@/components/motion/EchoTrailText';
import VertigoZoom from '@/components/motion/VertigoZoom';
import StageSweep from '@/components/motion/StageSweep';
import SmokeVeil from '@/components/motion/SmokeVeil';
import MetaballGold from '@/components/motion/MetaballGold';
import { brandData } from '@/data/brand';
import ScrollBlurFocus from '@/components/motion/ScrollBlurFocus';
import StitchPathReveal from '@/components/motion/StitchPathReveal';
import CulturalMotifAtlas from '@/components/ui/CulturalMotifAtlas';
import FoldedNoteUnfold from '@/components/motion/FoldedNoteUnfold';
import FacetMosaicReveal from '@/components/motion/FacetMosaicReveal';
import ElasticRail from '@/components/motion/ElasticRail';
import GoldLeafGild from '@/components/motion/GoldLeafGild';
import ArchiveDrawer from '@/components/ui/ArchiveDrawer';
import SustainabilitySection from '@/app/_sections/home/SustainabilitySection';
import ProvenanceSection from '@/app/_sections/home/ProvenanceSection';

/**
 * The four portraits, and the one decision each generation is remembered for.
 * Dates match the heritage timeline above; the faces are the part a timeline
 * cannot carry. Named PORTRAITS rather than GENERATIONS because the stack-card
 * table further down already owns that name and carries the arguments instead.
 */
const PORTRAITS = [
  {
    year: '1892',
    name: 'Raghunath',
    src: '/images/hero/craftsmanship.jpg',
    line: 'Opened with one bench, a foot-treadle lathe and a borrowed safe.',
  },
  {
    year: '1934',
    name: 'Sharada',
    src: '/images/collections/heritage.jpg',
    line: 'Took the house through two currency collapses without selling a stone.',
  },
  {
    year: '1971',
    name: 'Anand',
    src: '/images/collections/bridal.jpg',
    line: 'Added the setting bench, and the rule that filings are weighed back in.',
  },
  {
    year: '2008',
    name: 'Ila',
    src: '/images/collections/statement.jpg',
    line: 'Published the lead times, including the eighteen-month one.',
  },
] as const;

const VALUES = [
  {
    icon: ShieldCheck,
    title: 'Integrity',
    description: 'Uncompromising ethical standards in sourcing and creating every single piece.',
  },
  {
    icon: Gem,
    title: 'Artistry',
    description: 'A relentless pursuit of perfection in both design and execution.',
  },
  {
    icon: Crown,
    title: 'Legacy',
    description: 'Crafting heirlooms designed to be passed down through generations.',
  },
  {
    icon: Leaf,
    title: 'Responsibility',
    description: 'Recycled metals, traceable stones, and a workshop that gives more than it takes.',
  },
];

const STATS = [
  { label: 'Years of Heritage', value: 130, suffix: '+' },
  { label: 'Master Artisans', value: 45, suffix: '' },
  { label: 'Awards Won', value: 120, suffix: '+' },
  { label: 'Unique Designs', value: 5000, suffix: '+' },
];

/**
 * What each generation changed. Deliberately not a second chronology — the
 * timeline above already carries the dates, so these carry the arguments, and each
 * one is framed as a break with the generation before it.
 */
const GENERATIONS = [
  {
    id: 'g1',
    kicker: 'First Generation · 1892',
    title: 'Refused to buy rough he had not seen',
    body: 'The house was founded on an inconvenience: every parcel inspected in person before purchase, at a time when the trade bought sight-unseen on a broker\'s word. It halved the volume and it is the reason there is a fourth generation.',
    image: '/images/collections/heritage.jpg',
    meta: ['Founded 1892', 'The first ledger'],
    accent: 'gold' as const,
  },
  {
    id: 'g2',
    kicker: 'Second Generation · 1931',
    title: 'Bought the bench, and kept the ledger of who sat at it',
    body: 'A plain steel-topped bench, bought secondhand in 1904 and still in the restoration room. Recording every artisan who worked at it seemed sentimental at the time. It is now how we service a piece set fifty years ago.',
    image: '/images/hero/craftsmanship.jpg',
    meta: ['Bench acquired 1904', 'Ledger begun 1931'],
    accent: 'burgundy' as const,
  },
  {
    id: 'g3',
    kicker: 'Third Generation · 1968',
    title: 'Stopped grading our own goods',
    body: 'The most expensive decision the house has taken. Sending every stone above 0.30ct to an independent laboratory meant admitting our own grades had been generous — and it is the only reason a customer has any reason to believe the next one.',
    image: '/images/collections/gemstone.jpg',
    meta: ['Independent grading', 'Every stone above 0.30ct'],
    accent: 'jade' as const,
  },
  {
    id: 'g4',
    kicker: 'Fourth Generation · 2011',
    title: 'Published the chain, including the parts that flatter nobody',
    body: 'Full traceability means publishing rough-to-polished weight loss, named sites of extraction, and the artisan\'s mark. It invites questions we then have to answer. That is the point of it.',
    image: '/images/collections/bridal.jpg',
    meta: ['RJC certified', 'Passport on every piece'],
    accent: 'amethyst' as const,
  },
];

/** The original charter, five clauses, never amended. */
const CHARTER = [
  'No parcel of rough shall be purchased unseen, whatever the discount offered.',
  'No stone shall be graded by the hand that stands to profit from the grade.',
  'The proportion that returns light shall be preferred to the proportion that returns weight.',
  'Every piece shall carry the mark of the person who finished it.',
  'Any piece of this house shall be serviced without charge for as long as it exists, whoever brings it in.',
];

/**
 * The house's own turning points, chosen for what they cost rather than for what
 * they achieved.
 *
 * A heritage timeline that lists only expansions is a brochure. These are the six
 * decisions that were genuinely difficult at the time \u2014 including the two that
 * lost money for a decade \u2014 because a house's character is visible in what it
 * declined to do, and nowhere else.
 *
 * The dates are the house's own. `aside` carries the cost, where there was one.
 */
const TURNING_POINTS: SpineNode[] = [
  {
    marker: '1892',
    title: 'One bench, above a grain merchant',
    body: 'Ramanathan opened with a single bench, a foot-treadle lathe and no shopfront. Work came in through the merchant downstairs, who took a cut for the introduction.',
    aside: 'No shopfront for the first nineteen years',
  },
  {
    marker: '1926',
    title: 'The house refuses machine-set work',
    body: 'Mechanical setting arrived and halved the price of a pav\u00e9 band overnight. The second generation declined it, on the grounds that a machine cannot feel a stone seat.',
    aside: 'Cost the house most of its middle-market trade for a decade',
  },
  {
    marker: '1947',
    title: 'The archive is started',
    body: 'Every piece leaving the bench photographed, weighed and drawn to scale. Nobody asked for it and it slowed the workshop down by a day a week.',
    aside: 'It is the only reason we can still repair something from 1940',
  },
  {
    marker: '1968',
    title: 'Salaried, not piece-rate',
    body: 'The bench moved off piece-rate, which is what produces the fourteen-hour days this trade is known for. Output fell by a fifth and stayed there.',
    aside: 'The single most expensive decision in the ledger',
  },
  {
    marker: '1994',
    title: 'Every stone above 0.30ct certified',
    body: 'Independent grading on everything above a third of a carat, whether or not the customer asked. It meant publishing grades on stones we had previously described in adjectives.',
    aside: 'Several long-standing suppliers stopped selling to us',
  },
  {
    marker: '2019',
    title: 'The buy-back, with no time limit',
    body: 'Anything this house has ever made, taken back at the day\u2019s metal rate, from anyone, for ever. It caps what a piece can lose and it is a permanent liability on the balance sheet.',
    aside: 'Regardless of who owns it now, or whether they bought it here',
  },
];

/**
 * Five things the house stopped doing.
 *
 * Kept as data because the rail reads it, and written as reversals rather than as
 * milestones on purpose: a heritage page is a list of beginnings, and beginnings
 * are the half of a history that cost nothing to publish. Every entry here has a
 * `cost` field and none of them is zero.
 */
const REVERSALS = [
  {
    year: '1974',
    what: 'Stopped buying Burmese ruby',
    why: 'Not on ethical grounds — those came later, and we would be flattering ourselves. The parcels simply stopped being traceable, and we had been telling customers they were.',
    cost: 'The best coloured stone in the trade, and about a fifth of the bridal book for six years.',
  },
  {
    year: '1989',
    what: 'Stopped machine-setting pavé',
    why: 'We had bought the machine and said in print that it was as good as a hand. Three years of returns said otherwise: the beads were uniform and shallow, and stones came out of them.',
    cost: 'The machine, and the advertisement we had run in every wedding supplement in the city.',
  },
  {
    year: '2003',
    what: 'Stopped quoting a blended buy-back percentage',
    why: 'It was true and it was designed to be misread. Metal, making and stones come back at three different rates, and one figure conceals which one you are being paid.',
    cost: 'A number that sounded generous, replaced by three that sound fair.',
  },
  {
    year: '2011',
    what: 'Stopped the “certified natural” claim on small coloured stones',
    why: 'For anything under two carats the parcel is the unit of trade and a parcel has no single origin. We had been repeating our supplier’s language without checking what it could mean.',
    cost: 'Nothing financially. It took two years to admit, which is the real cost.',
  },
  {
    year: '2019',
    what: 'Stopped polishing platinum as standard',
    why: 'Every serviced piece came back mirror-bright, including fifteen-year patinas that clients had not asked us to remove and could not get back.',
    cost: 'Four complaints from people who wanted the shine, against everything we had quietly destroyed before that.',
  },
] as const;

export default function AboutClient() {
  return (
    <>
      <PageBanner
        title="Our Heritage"
        subtitle="Four generations of master artisans"
        breadcrumbs={[{ label: 'About' }]}
        backgroundImage="/images/hero/craftsmanship.jpg"
      />

      <div className="overflow-hidden bg-canvas">
        {/* Story */}
        <section className="relative mx-auto max-w-7xl px-6 py-24 md:px-12 lg:px-24">
          <GradientOrb color="gold" size="lg" position="top-right" intensity={0.1} />

          <div className="relative z-10 grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <CurtainReveal
              direction="up"
              className="relative aspect-[3/4] overflow-hidden rounded-2xl"
            >
              <Parallax speed={0.28} scaleRange={[1, 1.1]} className="h-full w-full">
                <Image
                  src="/images/hero/craftsmanship.jpg"
                  alt="A master craftsman at the bench"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </Parallax>
              <span className="pointer-events-none absolute inset-6 rounded-xl border border-gold-500/25" />
            </CurtainReveal>

            <div>
              <SectionHeading
                eyebrow="The House"
                title="A Legacy of Light"
                highlightWords={['Light']}
                align="left"
                ornament={false}
                className="mb-8"
              />

              <FadeInOnView direction="up" delay={0.25}>
                <div className="space-y-6 font-sans text-base font-light leading-relaxed text-muted lg:text-lg">
                  <p>{brandData.description}</p>
                  <p>
                    Every gemstone we select tells a story of the earth, and every setting we craft
                    is a testament to human ingenuity. Our artisans spend thousands of hours
                    perfecting techniques passed down through generations.
                  </p>
                  <p>
                    We are more than jewellers; we are custodians of legacy, capturing your most
                    precious moments in enduring brilliance.
                  </p>
                </div>
              </FadeInOnView>
            </div>
          </div>
        </section>

        <GoldDivider variant="jewel" />

        {/* Timeline — the full house chronology, scroll-scrubbed */}
        <section className="relative overflow-hidden border-y border-hairline bg-surface-raised/40 py-24 md:py-32">
          <CausticsCanvas intensity={0.3} lobes={5} />

          <div className="relative mx-auto max-w-5xl px-6">
            <SectionHeading
              eyebrow="Milestones"
              title="One hundred and thirty-two years"
              highlightWords={['thirty-two']}
              align="center"
              className="mb-20"
            />

            <HeritageTimeline />
          </div>
        </section>

        {/* Values */}
        <section className="mx-auto max-w-7xl px-6 py-24">
          <SectionHeading
            eyebrow="What Guides Us"
            title="Our Core Values"
            highlightWords={['Core']}
            subtitle="The principles behind every decision we make and every piece we create."
            align="center"
            className="mb-16"
          />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value, index) => {
              const Icon = value.icon;
              return (
                <FadeInOnView key={value.title} delay={index * 0.12} className="h-full">
                  <SpotlightCard className="h-full border border-hairline bg-surface-raised/60 backdrop-blur-xl">
                    <div className="group flex h-full flex-col items-center p-8 text-center">
                      <motion.div
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        transition={{ type: 'spring', stiffness: 250, damping: 15 }}
                        className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-gold-500/30 bg-gold-900/25 text-accent-soft"
                      >
                        <Icon size={28} strokeWidth={1.4} />
                      </motion.div>
                      <h3 className="mb-3 font-display text-2xl text-primary">{value.title}</h3>
                      <p className="font-sans text-sm font-light leading-relaxed text-muted">
                        {value.description}
                      </p>
                    </div>
                  </SpotlightCard>
                </FadeInOnView>
              );
            })}
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-hairline bg-surface-raised/40 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4 md:gap-4">
              {STATS.map((stat, index) => (
                <FadeInOnView key={stat.label} delay={index * 0.1}>
                  <div className="group flex flex-col items-center">
                    <div className="mb-2 flex items-center justify-center font-display text-4xl text-accent md:text-5xl">
                      <CountUp end={stat.value} duration={2.5} suffix={stat.suffix} />
                    </div>
                    <span className="mb-2 block h-px w-8 bg-accent/40 transition-all duration-500 group-hover:w-16" />
                    <div className="font-accent text-[10px] uppercase tracking-luxe text-muted">
                      {stat.label}
                    </div>
                  </div>
                </FadeInOnView>
              ))}
            </div>
          </div>
        </section>

        {/* Four generations, as a stack the reader scrolls through. The timeline
            above covers dates; this covers what each generation actually changed,
            which is the part a chronology cannot carry. */}
        <section className="relative overflow-hidden bg-canvas-alt py-24 md:py-32">
          <RippleGrid spacing={48} reach={190} dot={1} />

          <div className="relative z-10 mx-auto max-w-5xl px-6 md:px-12">
            <div className="mb-16 text-center">
              <p className="mb-5 font-accent text-[10px] uppercase tracking-luxest text-accent">
                Four Generations
              </p>
              <ScrollAssembleText
                text="Each one changed something the last would have refused"
                as="h2"
                highlightWords={['refused']}
                spread={74}
                className="mx-auto max-w-3xl font-display text-3xl font-light leading-[1.12] text-primary sm:text-4xl md:text-5xl"
              />
            </div>

            {/* Extra bottom room so the last card has scroll left to stick against */}
            <div className="pb-[28vh]">
              <ScrollStackCards cards={GENERATIONS} offset={22} shrink={0.05} />
            </div>
          </div>
        </section>

        {/* The charter, struck on foil */}
        <section className="relative overflow-hidden py-24 md:py-28">
          <CausticsCanvas intensity={0.26} lobes={5} speed={36} />

          <div className="relative z-10 mx-auto max-w-4xl px-6">
            <FoilCard tilt={5} travel={85}>
              <div className="p-8 md:p-12">
                <p className="mb-6 flex items-center gap-2.5 font-accent text-[10px] uppercase tracking-luxest text-accent">
                  <ScrollText size={13} strokeWidth={1.8} />
                  The House Charter, 1892
                </p>

                <ol className="flex flex-col gap-5">
                  {CHARTER.map((clause, i) => (
                    <motion.li
                      key={clause}
                      initial={{ opacity: 0, x: -18 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                      className="flex gap-4 border-b border-hairline pb-5 last:border-0 last:pb-0"
                    >
                      <span className="nums-tabular flex-shrink-0 font-display text-2xl leading-none text-accent/50">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <p className="font-display text-base font-light italic leading-snug text-secondary md:text-lg">
                        {clause}
                      </p>
                    </motion.li>
                  ))}
                </ol>

                <p className="mt-8 font-sans text-[10px] font-light leading-relaxed text-faint">
                  Written by hand in the first ledger and never amended. The fifth clause
                  is why the restoration bench has never charged for a service.
                </p>
              </div>
            </FoilCard>
          </div>
        </section>

        {/* ---- Four generations, as four photographs ----
             The timeline earlier on this page is dates. This is faces, and the two do
             different work: a date tells you the house is old, a photograph tells you
             it is the same family. Printed wet, because the originals are. */}
        <CinematicLetterbox
          slate="The Family, In Four Prints"
          slateNote="1892 / 1934 / 1971 / 2008"
          barHeight={0.09}
        >
          <section className="relative overflow-hidden bg-canvas-alt py-20 md:py-28">
            <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
              <SectionHeading
                eyebrow="The Same Hands"
                title="Four generations, four prints, one bench"
                highlightWords={['one']}
                subtitle="Every one of these was taken at the same window, because it is the only good light in the building and nobody has ever moved the bench out of it."
                align="center"
                className="mb-16"
              />

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {PORTRAITS.map((gen, i) => (
                  <motion.figure
                    key={gen.year}
                    initial={{ opacity: 0, y: 26 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-8%' }}
                    transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <InkBleedReveal
                      src={gen.src}
                      alt={`${gen.name}, ${gen.year}`}
                      ratio={3 / 4}
                      duration={1.6 + i * 0.2}
                      className="rounded-2xl border border-hairline"
                    />
                    <figcaption className="mt-4">
                      <span className="font-accent text-[10px] uppercase tracking-luxer text-accent nums-tabular">
                        {gen.year}
                      </span>
                      <span className="mt-1 block font-display text-xl text-primary">
                        {gen.name}
                      </span>
                      <span className="mt-1.5 block font-sans text-xs font-light leading-relaxed text-muted">
                        {gen.line}
                      </span>
                    </figcaption>
                  </motion.figure>
                ))}
              </div>
            </div>
          </section>
        </CinematicLetterbox>

        <GoldRibbonWeave className="px-6" height={110} ribbons={4} />

        {/* ---- The archive wall ----
             One photograph from the archive, assembling out of its own tiles. Sits
             between the family prints and the countdown as the page's one wordless
             beat. */}
        <section className="relative overflow-hidden py-16 md:py-24">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:px-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
            <div>
              <p className="font-accent text-[10px] uppercase tracking-luxest text-accent">
                The Archive
              </p>
              <h3 className="mt-4 font-display text-3xl font-light leading-tight text-primary">
                Eleven thousand commissions, and a drawing for every one
              </h3>
              <p className="mt-5 font-sans text-sm font-light leading-relaxed text-secondary">
                Every piece the house has made exists twice: once in somebody&rsquo;s drawer and
                once as a gouache in the archive. Bring in something of ours from any decade and we
                can usually put the original drawing on the counter beside it &mdash; which is how a
                restoration gets done properly rather than approximately.
              </p>
              <p className="mt-4 font-accent text-[10px] uppercase tracking-luxer text-faint">
                Hover a tile to lift it out of the wall
              </p>
            </div>
            <MosaicShuffle
              src="/images/hero/hero-main.jpg"
              alt="The archive wall, assembling"
              columns={9}
              ratio={16 / 10}
              from="top-left"
              className="rounded-3xl border border-hairline"
            />
          </div>
        </section>

        {/* The 135th, counted down */}
        <section className="relative overflow-hidden border-y border-hairline bg-surface-raised/30 py-20 md:py-24">
          <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-8 px-6 text-center">
            <p className="font-accent text-[10px] uppercase tracking-luxest text-accent">
              The Hundred and Thirty-Fifth Year
            </p>
            <h2 className="max-w-2xl font-display text-2xl font-light leading-snug text-primary md:text-4xl">
              We open the first ledger to the public in
            </h2>

            {/* A fixed date, not one derived from load time — a countdown that resets
                on reload tells the visitor immediately that it is theatre. */}
            <FlipClock to="2027-03-04T11:00:00" expiredLabel="The ledger is on the table" />

            <p className="max-w-xl font-sans text-sm font-light leading-relaxed text-muted">
              Every commission since 1892, in the original hand, on the original bench.
              One week only, and the fourth generation will be reading from it.
            </p>
          </div>
        </section>

        {/* The values, on a drum */}
        <section className="relative overflow-hidden py-16 md:py-20">
          <div className="relative z-10 mx-auto max-w-4xl px-6">
            <p className="mb-8 text-center font-accent text-[10px] uppercase tracking-luxest text-accent">
              What has not changed
            </p>
            <CylinderMarquee
              items={[
                'Integrity',
                'Artistry',
                'Legacy',
                'Responsibility',
                'Patience',
                'Restraint',
              ]}
              radius={125}
              speed={10}
            />
          </div>
        </section>


        {/* ---- The turning points ----
             The archive wall above is what the house kept; this is what it chose,
             which is a different and more revealing list. Every entry here cost
             something at the time, and two of them lost money for a decade \u2014 a
             heritage timeline made only of expansions is a brochure.

             Drawn rather than listed: the spine reaches each entry as you scroll
             to it, so the six decisions read as a sequence with consequences
             rather than as six achievements laid side by side. */}
        <section className="relative overflow-hidden border-y border-hairline bg-canvas py-24 md:py-32">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <MetaballGold count={5} intensity={0.24} step={4} attract={false} />
            <SmokeVeil intensity={0.2} originX={0.78} speed={0.6} count={14} />
            <div className="absolute inset-0 bg-gradient-to-b from-canvas via-canvas/40 to-canvas" />
          </div>

          <div className="relative z-10 mx-auto max-w-5xl px-6 md:px-12">
            <div className="mb-16 text-center">
              <p className="mb-5 font-accent text-[10px] uppercase tracking-luxest text-accent">
                What it cost
              </p>
              <TypeSlamHeading
                lines={['A house is what', 'it turned down.']}
                highlightWords={['down.']}
                as="h2"
                className="mx-auto max-w-3xl font-display text-3xl leading-[1.1] text-primary md:text-6xl"
              />
              <p className="mx-auto mt-6 max-w-xl font-sans text-base font-light leading-relaxed text-muted">
                Six decisions, chosen for what they cost rather than for what they achieved. Two of
                them lost money for a decade. They are the reason everything above this line is
                still true.
              </p>
            </div>

            <ScrollSpineTimeline nodes={TURNING_POINTS} />
          </div>
        </section>

        {/* ---- What we stopped doing ----
             A heritage page is a list of things a house started. This is the
             list of things it stopped, which is both rarer and considerably more
             informative: every entry is a decision that cost money at the time,
             and four of the five were the house admitting it had been wrong.

             Placed after the turning points rather than among them, because the
             timeline above is what happened and this is what was learned — and a
             page that mixes the two lets the second borrow the first's
             inevitability. */}
        <section className="relative overflow-hidden bg-canvas py-20 md:py-28">
          <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
            <SectionHeading
              eyebrow="The Reversals"
              title="Five things this house stopped doing"
              highlightWords={['stopped']}
              subtitle="Every heritage page is a list of beginnings. These are the endings — each one a decision that cost money at the time, and four of them the house admitting it had been wrong about something it had said in public."
              align="center"
              className="mb-14"
            />

            <ElasticRail label="Five things the house stopped doing" gap={20}>
              {REVERSALS.map((item, i) => (
                <article
                  key={item.year}
                  className="stub-tear w-80 flex-shrink-0 border border-hairline bg-surface-raised/40 p-6"
                >
                  <p className="nums-tabular font-display text-4xl leading-none text-accent">
                    {item.year}
                  </p>
                  <p className="mt-4 font-display text-xl leading-snug text-primary">
                    {item.what}
                  </p>
                  <p className="mt-3 font-sans text-xs font-light leading-relaxed text-secondary">
                    {item.why}
                  </p>
                  <p className="mt-4 border-t border-hairline pt-3 font-sans text-[11px] font-light leading-relaxed text-faint">
                    <span className="text-burgundy-300">Cost:</span> {item.cost}
                  </p>
                  <p className="nums-tabular mt-2 font-accent text-[9px] uppercase tracking-luxe text-faint">
                    Reversal {String(i + 1).padStart(2, '0')} of{' '}
                    {String(REVERSALS.length).padStart(2, '0')}
                  </p>
                </article>
              ))}
            </ElasticRail>

            <div className="mt-20 grid items-start gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
              <ScrollBlurFocus
                lines={[
                  'A house that has never reversed itself has never been tested.',
                  'Or it is not telling you about the tests.',
                  'These five cost us money and two of them cost us customers.',
                  'We would make every one of them again.',
                ]}
                depth={0.85}
              />

              <div className="space-y-8">
                <FacetMosaicReveal
                  src="/images/hero/craftsmanship.jpg"
                  alt="The bench at the window, assembled facet by facet"
                  columns={7}
                  order="random"
                  ratio={4 / 5}
                  caption="The same window, 1892 to now"
                />

                <div className="rounded-2xl border border-hairline bg-surface-raised/35 p-6">
                  <StitchPathReveal motif="seam" pitch={6} duration={2.6}>
                    <p className="mt-4 font-accent text-[10px] uppercase tracking-luxe text-accent">
                      The charter, stitched rather than framed
                    </p>
                    <p className="mt-2 font-sans text-xs font-light leading-relaxed text-secondary">
                      It hangs by the door of the Bandra workshop, worked in thread by the fourth
                      generation because the third had it printed and nobody read it. Thread was
                      chosen deliberately: it can be unpicked, and a charter that cannot be
                      changed is a charter nobody has looked at since it was written.
                    </p>
                  </StitchPathReveal>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ---- The holdings ----
             The history is argued twice above: once as a timeline and once as a
             set of claims with evidence behind them. This is neither. It is the
             inventory of what physically survives in the room upstairs, drawer
             by drawer, including the drawer that is empty.

             Placed immediately before the wager, because the wager is a promise
             about the future and this is the only honest measure of whether the
             house has kept the same promise before. A heading laid in gold leaf
             over a cabinet of gaps is the argument in one image. */}
        <section className="relative overflow-hidden border-y border-hairline bg-canvas py-24 md:py-32">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <SmokeVeil intensity={0.2} />
          </div>

          <div className="relative z-10 mx-auto max-w-5xl px-6 md:px-12">
            <div className="mb-14 text-center">
              <p className="mb-6 font-accent text-[10px] uppercase tracking-luxest text-accent">
                The archive, drawer by drawer
              </p>

              <GoldLeafGild
                text="What survives"
                as="h2"
                flakes={7}
                className="mx-auto text-5xl md:text-7xl"
              />

              <p className="mx-auto mt-8 max-w-2xl font-sans text-base font-light leading-relaxed text-muted md:text-lg">
                Every heritage house has gaps in its archive and almost none of them are published,
                which is what lets a shop imply a continuity it cannot document. Ours has a five-year
                hole in the middle of the 1940s and six hundred drawings nobody can attribute. Both
                are in the cabinet below, in their own drawers, labelled.
              </p>
            </div>

            <ArchiveDrawer />
          </div>
        </section>

        {/* ---- Where the vocabulary came from ----
             Placed after the archive and before the wager, because the archive
             is the honest account of what this house has kept and this is the
             honest account of what it did not invent.

             A Bombay house that has been trading since 1892 learned almost
             everything it knows from somewhere else in this country, and
             saying "heritage" without naming those places is the polite way of
             taking credit for them. So this names them — the town, the
             century, the technique — and it publishes the number nobody
             publishes, which is how many people can still do each one.

             The fragility figures are the point of the whole section. Thewa is
             one extended family. Bidri is under a hundred. A trade that cannot
             say those numbers out loud will find them out by their absence. */}
        <section className="relative overflow-hidden bg-canvas-alt py-24 md:py-32">
          <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
            <SectionHeading
              eyebrow="What we did not invent"
              title="Seven traditions, and how many people are left who can do them"
              highlightWords={['left']}
              subtitle="Almost everything this house knows was carried here from somewhere else — Pratapgarh, Cuttack, Bidar, Jaipur, Thanjavur. Naming the places is the least a shop can do. Counting the people who are still doing it is the part that should worry everybody."
              align="left"
              className="mb-14"
            />

            <CulturalMotifAtlas />
          </div>
        </section>

        {/* ---- The letter ----
             One sheet, folded in three, opening. It sits between the atlas and
             the wager because both of those are arguments and this is a person
             — and a page about four generations should at some point let one
             of them speak in the first person rather than being described.

             The trifold is the real one: the bottom panel goes up first and the
             top comes down over it, so opening lifts the top leaf before the
             bottom drops. That is why the panels arrive out of reading order. */}
        <section className="relative overflow-hidden border-y border-hairline bg-canvas py-24 md:py-32">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="absolute inset-0 bg-[radial-gradient(50%_40%_at_50%_30%,rgb(var(--gold-500)/0.08),transparent_74%)]" />
          </div>

          <div className="relative z-10 mx-auto max-w-4xl px-6 md:px-12">
            <p className="mb-12 text-center font-accent text-[10px] uppercase tracking-luxest text-accent">
              Found in the 1974 order book, in the margin
            </p>

            <FoldedNoteUnfold
              stock="ruled"
              signature="Vasant Aurum"
              role="Third generation — written to his daughter, and never sent"
              panels={[
                <p key="a" className="font-display text-xl italic leading-relaxed text-ink-800 md:text-2xl">
                  You will be told that this trade is about beautiful things. It
                  is not. It is about somebody walking back through that door in
                  thirty years holding something we made, and finding that we are
                  still able to mend it.
                </p>,
                <p key="b" className="font-sans text-sm font-light leading-relaxed text-ink-700 md:text-base">
                  Everything else — the window, the boxes, the way we speak to
                  people — is arrangement. The only question that has ever
                  mattered in this building is whether the person who made a
                  thing has passed on how to repair it, and there have been two
                  years in my life when the answer was no. I would rather you
                  knew that than inherited a nice story about us.
                </p>,
                <p key="c" className="font-sans text-sm font-light leading-relaxed text-ink-700 md:text-base">
                  So: keep the drawings, even the ones nobody can attribute. Keep
                  the ledgers, especially the bad years. And never let anybody
                  polish a piece so hard it loses the marks of the hand that made
                  it — those marks are the only signature we have that cannot
                  be forged.
                </p>,
              ]}
            />
          </div>
        </section>

        {/* ---- The wager ----
             One held shot between the timeline and the closing invitation. No
             controls and nothing to read carefully \u2014 the page has been dense
             for a while and the CTA below lands harder after a pause. */}
        <section className="relative overflow-hidden bg-surface-sunken py-28 md:py-36">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <StageSweep intensity={0.24} width={0.3} crossed seconds={17} />
            <div className="absolute inset-0 bg-[radial-gradient(58%_46%_at_50%_50%,rgb(var(--canvas)/0.8),transparent_78%)]" />
          </div>

          <VertigoZoom intensity={0.7} className="relative z-10">
            <div className="mx-auto max-w-3xl px-6 text-center md:px-12">
              <EchoTrailText
                text="Four generations is not a boast."
                as="h2"
                echoes={3}
                spread={18}
                direction="left"
                persistent
                className="font-display text-3xl leading-snug text-primary md:text-5xl"
              />
              <p className="mx-auto mt-8 max-w-xl font-sans text-base font-light leading-relaxed text-secondary md:text-lg">
                It is a wager that the person who made your ring will not be the last person who can
                repair it. Everything on this page is in service of keeping that bet.
              </p>
            </div>
          </VertigoZoom>
        </section>

        <ProvenanceSection />

        <SustainabilitySection />

        {/* CTA */}
        <section className="px-6 py-32 text-center">
          <SectionHeading
            eyebrow="Come and See"
            title="Experience Our Boutique"
            highlightWords={['Boutique']}
            subtitle="Step into our world and discover the artistry behind every piece firsthand. Our expert advisors await to guide your journey."
            align="center"
            className="mb-10"
          />
          <CTAButton variant="primary" size="lg" href="/contact" showArrow>
            Find a Boutique
          </CTAButton>
        </section>
      </div>
    </>
  );
}
