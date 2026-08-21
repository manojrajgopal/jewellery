'use client';

import { motion } from 'framer-motion';
import { Ban, Droplets, Sparkles, Wrench } from 'lucide-react';

import PageBanner from '@/components/ui/PageBanner';
import SectionHeading from '@/components/ui/SectionHeading';
import GoldDivider from '@/components/ui/GoldDivider';
import CTAButton from '@/components/ui/CTAButton';
import GradientOrb from '@/components/ui/GradientOrb';
import FAQAccordion from '@/components/ui/FAQAccordion';

import CareRitual from '@/components/ui/CareRitual';
import NecklaceLengthGuide from '@/components/ui/NecklaceLengthGuide';
import OccasionReminder from '@/components/ui/OccasionReminder';
import RingSizer from '@/components/ui/RingSizer';

import ScrollAssembleText from '@/components/motion/ScrollAssembleText';
import RippleGrid from '@/components/motion/RippleGrid';
import CausticsCanvas from '@/components/motion/CausticsCanvas';
import ImageCompare from '@/components/motion/ImageCompare';
import CountUp from '@/components/motion/CountUp';
import Marquee from '@/components/motion/Marquee';
import GoldRibbonWeave from '@/components/motion/GoldRibbonWeave';
import PrismDispersion from '@/components/motion/PrismDispersion';
import LightLeakOverlay from '@/components/motion/LightLeakOverlay';
import BokehDrift from '@/components/motion/BokehDrift';
import SmokeVeil from '@/components/motion/SmokeVeil';
import TypeSlamHeading from '@/components/motion/TypeSlamHeading';
import EchoTrailText from '@/components/motion/EchoTrailText';

import StorageAdvisor from '@/components/ui/StorageAdvisor';
import ChainWeaveLibrary from '@/components/ui/ChainWeaveLibrary';
import FingerSizeDrift from '@/components/ui/FingerSizeDrift';
import SkinToneMatcher from '@/components/ui/SkinToneMatcher';
import AppraisalKit from '@/components/ui/AppraisalKit';
import WristFitCalculator from '@/components/ui/WristFitCalculator';
import EarringComfortAdvisor from '@/components/ui/EarringComfortAdvisor';
import PatinaTimeline from '@/components/ui/PatinaTimeline';
import ElasticRail from '@/components/motion/ElasticRail';
import StitchPathReveal from '@/components/motion/StitchPathReveal';
import ScrollBlurFocus from '@/components/motion/ScrollBlurFocus';
import MetalAllergyAdvisor from '@/components/ui/MetalAllergyAdvisor';
import ChainStrengthGauge from '@/components/ui/ChainStrengthGauge';
import ResizeFeasibility from '@/components/ui/ResizeFeasibility';

/** The five stories every jeweller has. Rendered as warnings, not as anecdotes. */
const DISASTERS = [
  {
    icon: Droplets,
    title: 'The open drain',
    body: 'A ring rinsed over an unplugged sink, and a plumbing job that sometimes recovers it. Close the plug. That is the whole lesson.',
  },
  {
    icon: Ban,
    title: 'Sanitiser on white gold',
    body: 'Alcohol strips rhodium faster than anything else in ordinary life. Rings off before the pump, every time.',
  },
  {
    icon: Sparkles,
    title: 'Pearls in a sealed bag',
    body: 'Nacre needs some humidity. Sealed away it dries, crazes, and does not come back. A soft pouch, not plastic.',
  },
  {
    icon: Wrench,
    title: 'The clasp that had been catching',
    body: 'It catches for a month before it lets go. We check clasps free, for the life of anything we made — bring it in the first time it snags.',
  },
];

const CARE_FAQ = [
  {
    question: 'How often does a piece worn daily actually need servicing?',
    answer:
      'Once a year for anything with stones in prongs, and every two for bezels and closed settings. The service is prongs checked, seats tightened and a professional polish, and it is free for the life of anything we made — whether or not you were the person who bought it.',
  },
  {
    question: 'Can I use an ultrasonic cleaner at home?',
    answer:
      'On diamond, sapphire, ruby and plain gold, yes. On emerald, opal, pearl, tanzanite or anything fracture-filled, never — an ultrasonic tank opens existing fissures and there is no repair for that. The care ritual above will grey out the soak entirely if you tell it what your stone is.',
  },
  {
    question: 'My white gold has gone slightly yellow. Is it fake?',
    answer:
      'No — it is doing exactly what white gold does. White gold is yellow gold alloyed pale and then rhodium plated, and the plating wears through in two to four years of daily wear. Replating is routine and inexpensive. If you would rather never think about it again, platinum is the answer.',
  },
  {
    question: 'How do I know my ring size will not change?',
    answer:
      'It will. Fingers swell in heat and after salt, and most people move half a size across their life. Size to a warm hand at the end of the day rather than a cold one in the morning, and we resize free within the first year.',
  },
  {
    question: 'Is it worth insuring, and what do you need to provide?',
    answer:
      'Anything above roughly a month of your income, yes. Insurers want an independent valuation, not a receipt — our gemmologists issue one with a full grading report and photographs at forty magnifications, and we will reissue it every five years so the figure keeps up with the metal rate.',
  },
];

/**
 * Care and sizing — the practical page.
 *
 * Deliberately three tools and a set of warnings rather than an essay. Everything here
 * answers a question somebody asks across the counter, and the two that get asked most
 * — what size am I, and can I clean this — are the two at the top.
 *
 * The sizing tools sit together on purpose. A visitor measuring themselves is in a
 * particular frame of mind and will measure everything at once if the instruments are
 * to hand; splitting rings and chains across two pages means the chain never gets
 * measured at all.
 */
/**
 * The care year, one job a month.
 *
 * Written as twelve small obligations rather than as a seasonal routine, because
 * a seasonal routine is four things nobody does and twelve one-minute jobs are
 * twelve things that get done. Every entry is timed honestly — the longest is
 * eleven minutes — and several are deliberately "look at it and do nothing",
 * which is a real instruction and the hardest one to follow.
 */
const CARE_YEAR = [
  { month: 'January', job: 'Check every clasp', why: 'Cold weather means layers, and layers are what open a spring ring without anybody noticing.', minutes: 4 },
  { month: 'February', job: 'Wash the diamonds', why: 'Warm water, a drop of dish soap, a soft brush behind the stone rather than on it. This is where the light went.', minutes: 8 },
  { month: 'March', job: 'Look at the claws under a light', why: 'Not a loupe — a bright lamp and a good look. A lifted claw catches the light differently from the other three.', minutes: 3 },
  { month: 'April', job: 'Rotate what is in the drawer', why: 'Whatever has been at the bottom for a year is being pressed by everything above it. Move it up.', minutes: 5 },
  { month: 'May', job: 'Do nothing at all', why: 'Genuinely. Pearls and opals want humidity and this is the month they have it — leave them out of the safe and in the room.', minutes: 0 },
  { month: 'June', job: 'Dry everything properly', why: 'Monsoon. Silver tarnishes fastest now, and a closed box with damp in it is worse than an open shelf.', minutes: 6 },
  { month: 'July', job: 'Photograph what you own', why: 'On a plain sheet, in daylight, with a ruler beside it. An insurer will not accept a claim on a memory.', minutes: 11 },
  { month: 'August', job: 'Re-tie any strung pearls', why: 'Silk stretches. If the knots between the pearls have gone slack, the string is a year from breaking in a lift.', minutes: 2 },
  { month: 'September', job: 'Check the ring against your finger', why: 'Fingers change size over a year, mostly upward. A ring that spins is a ring that will be caught on something.', minutes: 2 },
  { month: 'October', job: 'Bring in anything set with a soft stone', why: 'Festival season is when pieces are worn hardest. Emeralds and opals should be looked at before that rather than after.', minutes: 5 },
  { month: 'November', job: 'Polish only what should be polished', why: 'Gold and silver, yes. Platinum, no — read the panel above before reaching for a cloth.', minutes: 7 },
  { month: 'December', job: 'Write down what changed', why: 'One line per piece. In ten years this is the only record of when a stone was reset or a clasp replaced.', minutes: 4 },
] as const;

export default function CareClient() {
  return (
    <>
      <PageBanner
        title="Care & Sizing"
        subtitle="Twenty-four minutes a season, and the piece outlives all of us"
        breadcrumbs={[{ label: 'Care' }]}
        backgroundImage="/images/products/necklace.jpg"
      />

      <div className="overflow-hidden bg-canvas">
        {/* ---- Opening ---- */}
        <section className="relative py-20 md:py-24">
          <GradientOrb color="gold" size="lg" position="top-right" intensity={0.09} />
          <RippleGrid spacing={44} reach={180} dot={1.1} />

          <div className="relative z-10 mx-auto max-w-4xl px-6 text-center md:px-12">
            <ScrollAssembleText
              text="Almost all lost brilliance is film, not damage"
              as="h2"
              highlightWords={['film,']}
              spread={74}
              className="mx-auto max-w-3xl font-display text-3xl font-light leading-[1.12] text-primary sm:text-4xl md:text-5xl"
            />

            <p className="mx-auto mt-7 max-w-2xl font-sans text-base font-light leading-relaxed text-muted md:text-lg">
              A stone that has stopped sparkling has almost never lost anything. It has a
              film of soap and skin oil on its pavilion — the underside nobody thinks to
              clean — and the light that used to come back at you is being absorbed there
              instead. Four minutes with a soft brush from beneath will usually restore it
              completely.
            </p>

            <dl className="mx-auto mt-12 grid max-w-2xl grid-cols-3 gap-6 border-y border-hairline py-8">
              {[
                { k: 'Minutes a season', v: 24, s: '' },
                { k: 'Cost of a service', v: 0, s: '' },
                { k: 'Pieces restored', v: 4200, s: '+' },
              ].map((row) => (
                <div key={row.k}>
                  <dd className="nums-tabular font-display text-3xl text-accent md:text-4xl">
                    <CountUp end={row.v} duration={2} suffix={row.s} separator />
                  </dd>
                  <dt className="mt-2 font-accent text-[9px] uppercase tracking-luxe text-faint">
                    {row.k}
                  </dt>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ---- The ritual ---- */}
        <section className="relative border-y border-hairline bg-surface-raised/30 py-20 md:py-28">
          <CausticsCanvas intensity={0.3} lobes={5} speed={34} />

          <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
            <SectionHeading
              eyebrow="The Ritual"
              title="Six steps, adapted to your stone"
              highlightWords={['your']}
              subtitle="Tell it what you own and it will strike out the steps that stone cannot take. The soak alone is unsafe for four of the twelve gems we set."
              align="center"
              className="mb-14"
            />

            <CareRitual />
          </div>
        </section>

        {/* ---- Sizing ---- */}
        <section className="relative py-20 md:py-28">
          <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
            <SectionHeading
              eyebrow="Measure Once"
              title="Sizing, both kinds"
              highlightWords={['both']}
              subtitle="Rings by diameter, chains by where they fall. Measure a warm hand at the end of the day, never a cold one in the morning."
              align="center"
              className="mb-14"
            />

            <div className="grid gap-8 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 34 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <RingSizer />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 34 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <NecklaceLengthGuide />
              </motion.div>
            </div>
          </div>
        </section>

        <GoldDivider variant="jewel" />

        {/* ---- The wrist ----
             Rings are sized by diameter and chains by where they fall, both of
             which the section above covers. The wrist is the gap, and it is the
             one that most needs explaining: the same 165mm wrist wants four
             different figures depending on what is going round it, and one of
             them is not measured at the wrist at all. */}
        <section className="relative py-20 md:py-28">
          <BokehDrift count={9} className="opacity-50" />
          <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
            <SectionHeading
              eyebrow="The Third Measurement"
              title="One wrist, four different numbers"
              highlightWords={['four']}
              subtitle="A tennis bracelet, a chain, a rigid bangle and a cuff all sit on the same wrist and none of them is sized to it the same way — the bangle is not sized to the wrist at all. Each allowance is a structural requirement rather than a preference, and getting one wrong is why bracelets end up in drawers."
              align="center"
              className="mb-14"
            />
            <WristFitCalculator />
          </div>
        </section>

        <GoldRibbonWeave className="px-6" height={90} />

        {/* ---- The lobe ----
             The quietest failure in jewellery: an earring that goes on perfectly
             and then is never chosen again. Nobody returns them, so nobody in the
             trade hears about it, and the cause is almost always the fitting
             rather than the earring. */}
        <section className="relative border-y border-hairline bg-canvas py-20 md:py-28">
          <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
            <SectionHeading
              eyebrow="Grams, Not Taste"
              title="The earring that goes on perfectly and is never worn again"
              highlightWords={['never']}
              subtitle="Nobody returns a heavy earring. It simply stops being chosen, and the wearer concludes heavy earrings do not suit them — when what happened is that a four-gram pair was sold on a two-gram fitting. Six fittings, with what each one actually carries all day."
              align="center"
              className="mb-14"
            />
            <EarringComfortAdvisor />
          </div>
        </section>

        {/* ---- Twenty years ----
             Every care page on the internet explains how to keep jewellery
             looking new. Three of these five metals are not trying to, and one of
             them is actively ruined by the attempt — which is the more useful and
             much less frequently published half of the subject. */}
        <section className="relative overflow-hidden bg-canvas-alt py-20 md:py-28">
          <SmokeVeil className="opacity-40" />
          <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
            <SectionHeading
              eyebrow="What Twenty Years Does"
              title="Two of these want polishing. One is destroyed by it"
              highlightWords={['destroyed']}
              subtitle="A platinum patina takes fifteen years to acquire and forty seconds to remove, and collectors pay for it. Drag the years and watch five metals age — then read which of them is asking to be left alone."
              align="center"
              className="mb-14"
            />

            <PatinaTimeline />

            <div className="mt-20 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,18rem)] lg:items-center">
              <ScrollBlurFocus
                lines={[
                  'A scratch on gold removes metal.',
                  'A scratch on platinum moves it sideways.',
                  'That is the whole difference, and it decides everything else.',
                ]}
                depth={0.9}
              />

              <div className="rounded-2xl border border-hairline bg-surface-raised/35 p-7">
                <StitchPathReveal motif="chevron" pitch={6} duration={2.4}>
                  <p className="mt-4 font-accent text-[10px] uppercase tracking-luxe text-accent">
                    On every case we make
                  </p>
                  <p className="mt-2 font-sans text-xs font-light leading-relaxed text-secondary">
                    The chevron is stitched into the lining edge of every case that leaves this
                    bench, and it is there for a practical reason: it is where the thread ends,
                    and a lining that comes away takes the piece against bare board.
                  </p>
                </StitchPathReveal>
              </div>
            </div>
          </div>
        </section>

        {/* ---- The five disasters ---- */}
        {/* ---- The drawer ----
             The ritual above is what happens for twenty-four minutes a month. This is
             what happens for the other forty-three thousand: a drawer, in the dark,
             with everything touching everything else. Most damage we see arrives that
             way rather than from wear. */}
        <section className="relative border-y border-hairline bg-canvas py-20 md:py-28">
          <PrismDispersion at={{ x: 0.86, y: 0.24 }} size={120} rays={20} interactive={false} />
          <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
            <SectionHeading
              eyebrow="The Other Forty Thousand Hours"
              title="Nothing is damaged as often as it is stored"
              highlightWords={['stored']}
              subtitle="Hardness decides who may share a compartment, and humidity decides which compartment that is. Tick what you own and the drawer rearranges itself."
              align="center"
              className="mb-14"
            />
            <StorageAdvisor />
          </div>
        </section>

        <GoldRibbonWeave className="px-6" height={100} />

        <section className="relative bg-canvas-alt py-20 md:py-28">
          <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
            <SectionHeading
              eyebrow="Avoid These"
              title="The five stories every jeweller has"
              highlightWords={['five']}
              subtitle="Four of them are preventable in under a minute. The fifth is why we check clasps for free."
              align="center"
              className="mb-14"
            />

            <div className="grid gap-5 sm:grid-cols-2">
              {DISASTERS.map((d, i) => {
                const Icon = d.icon;
                return (
                  <motion.article
                    key={d.title}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-10%' }}
                    transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    className="group relative flex gap-4 overflow-hidden rounded-2xl border border-burgundy-500/20 bg-burgundy-900/[0.05] p-6 transition-colors duration-500 hover:border-burgundy-500/40"
                  >
                    <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-burgundy-500/30 text-burgundy-300">
                      <Icon size={17} strokeWidth={1.6} />
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-light text-primary">
                        {d.title}
                      </h3>
                      <p className="mt-2 font-sans text-sm font-light leading-relaxed text-muted">
                        {d.body}
                      </p>
                    </div>

                    {/* Index, faint, so the set reads as a numbered list of warnings */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -bottom-4 right-3 font-display text-5xl leading-none text-burgundy-300/[0.08]"
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---- The bench ---- */}
        <section className="relative border-y border-hairline py-20 md:py-28">
          <CausticsCanvas intensity={0.26} lobes={5} />

          <div className="relative z-10 mx-auto grid max-w-6xl gap-14 px-6 md:px-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="mb-5 font-accent text-[10px] uppercase tracking-luxest text-accent">
                When It Is Too Late For A Brush
              </p>
              <h2 className="font-display text-3xl font-light leading-tight text-primary md:text-4xl">
                Forty years comes off at the bench, not the sink
              </h2>
              <div className="mt-6 space-y-5 font-sans text-base font-light leading-relaxed text-muted">
                <p>
                  There is a point past which cleaning is not the answer: a worn seat, a
                  thinned prong, a chain that has stretched at one link. Those are bench
                  work, and the honest advice is to bring the piece in rather than to keep
                  polishing something that is structurally tired.
                </p>
                <p>
                  Our restoration room has an eighteen-month queue and we have never
                  advertised it. Drag the handle across and see why.
                </p>
              </div>

              <div className="mt-9">
                <CTAButton variant="primary" size="md" href="/services" showArrow>
                  What the bench does
                </CTAButton>
              </div>
            </div>

            <ImageCompare
              beforeImage="/images/collections/heritage.jpg"
              afterImage="/images/collections/statement.jpg"
              beforeLabel="As received"
              afterLabel="After the bench"
              className="h-80 md:h-96"
            />
          </div>
        </section>

        {/* ---- Dates ---- */}
        <section className="relative py-20 md:py-28">
          <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
            <SectionHeading
              eyebrow="Lead Times"
              title="Dates worth keeping"
              highlightWords={['Dates']}
              subtitle="A commission needs six weeks and engraving needs ten days. Keep a date here and we will tell you which is still possible — the list never leaves your browser."
              align="center"
              className="mb-14"
            />

            <OccasionReminder />

            {/* The year, as a rail rather than as a list. A care calendar is
                twelve short instructions and a list of twelve makes none of them
                feel like an appointment — thrown sideways, each is one card the
                reader has to pass. */}
            <div className="mt-16">
              <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
                And the year itself
              </p>
              <p className="mt-2 max-w-2xl font-sans text-sm font-light leading-relaxed text-secondary">
                Twelve months of it, thrown rather than listed. Drag it — there is real weight in
                the rail, and it springs back at both ends.
              </p>

              <ElasticRail label="The care year, month by month" className="mt-8" gap={20}>
                {CARE_YEAR.map((month, i) => (
                  <article
                    key={month.month}
                    className="w-64 flex-shrink-0 rounded-2xl border border-hairline bg-surface-raised/40 p-5"
                  >
                    <p className="nums-tabular font-accent text-[10px] uppercase tracking-luxe text-faint">
                      {String(i + 1).padStart(2, '0')} · {month.month}
                    </p>
                    <p className="mt-2.5 font-display text-xl leading-tight text-primary">
                      {month.job}
                    </p>
                    <p className="mt-2 font-sans text-xs font-light leading-relaxed text-secondary">
                      {month.why}
                    </p>
                    <p className="mt-3 border-t border-hairline pt-3 nums-tabular font-accent text-[9px] uppercase tracking-luxe text-accent">
                      {month.minutes} minutes
                    </p>
                  </article>
                ))}
              </ElasticRail>
            </div>
          </div>
        </section>

        {/* ---- Services ticker ---- */}
        <div className="relative border-y border-hairline py-5">
          <Marquee speed="slow" pauseOnHover>
            {[
              'Prong retipping',
              'Rhodium replating',
              'Stone replacement',
              'Chain soldering',
              'Pearl restringing',
              'Clasp renewal',
              'Antique cleaning',
              'Enamel repair',
              'Resizing',
              'Valuation',
              'Laser welding',
            ].map((service) => (
              <span
                key={service}
                className="mx-8 inline-flex items-center gap-8 font-accent text-sm uppercase tracking-luxe text-muted"
              >
                {service}
                <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-accent/50" />
              </span>
            ))}
          </Marquee>
        </div>


        {/* ---- Which metal, against you ----
             Care is mostly about what a piece survives; this is the other half,
             which is whether it gets worn at all. A ring that does not suit the
             wearer's colouring lives in a drawer, and a piece in a drawer needs no
             care and gives no pleasure.

             The vein test is the primary route in because it is the only at-home
             check that works and it costs nothing. Depth of complexion is
             deliberately not asked about \u2014 it barely matters here, and every
             tool that leads with it gets olive undertones backwards. */}
        <section className="relative overflow-hidden border-y border-hairline bg-canvas-alt/50 py-20 md:py-28">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <BokehDrift count={18} intensity={0.4} speed={0.6} blades={7} />
            <LightLeakOverlay intensity={0.26} interval={12} />
          </div>

          <div className="relative z-10 mx-auto max-w-5xl px-6 md:px-12">
            <SectionHeading
              eyebrow="Against The Skin"
              title="Which metal is actually yours"
              highlightWords={['yours']}
              subtitle="Not how light or dark you are \u2014 that barely matters. What decides this is undertone, and a deep cool complexion and a fair cool complexion want exactly the same metals. Turn your wrist over in daylight and look at the veins."
              align="center"
              className="mb-14"
            />

            <SkinToneMatcher />
          </div>
        </section>

        {/* ---- The file ----
             The last piece of care, and the one nobody thinks of as care at all.
             Everything above keeps a piece intact; this is what happens when it
             is not \u2014 and insurance for jewellery fails in a small number of
             entirely predictable ways, all of them avoidable in an afternoon. */}
        <section className="relative overflow-hidden py-20 md:py-28">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <SmokeVeil intensity={0.2} originX={0.24} speed={0.65} count={14} />
          </div>

          <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
            <div className="mb-14 text-center">
              <p className="mb-5 font-accent text-[10px] uppercase tracking-luxest text-accent">
                If the worst happens
              </p>
              <TypeSlamHeading
                lines={['A photograph of you', 'wearing it beats', 'any certificate.']}
                highlightWords={['certificate.']}
                as="h2"
                className="mx-auto max-w-3xl font-display text-3xl leading-[1.12] text-primary md:text-5xl"
              />
              <p className="mx-auto mt-6 max-w-xl font-sans text-base font-light leading-relaxed text-muted">
                Because it establishes possession on a date, which no studio image of the item can.
                Essentially nobody has one, and it is free. Here is the rest of the file, ordered by
                what each item is worth at claim time rather than by how easy it is to get.
              </p>
            </div>

            <AppraisalKit />

            <div className="mt-16 text-center">
              <EchoTrailText
                text="Insured is not the same as covered."
                as="p"
                echoes={2}
                spread={14}
                direction="right"
                persistent
                className="font-display text-2xl leading-snug text-primary md:text-3xl"
              />
              <p className="mx-auto mt-4 max-w-xl font-sans text-sm font-light leading-relaxed text-faint">
                Most contents policies carry a single-article limit and many cover jewellery in the
                house and nowhere else. Both are in the wording rather than the summary, and both
                are the reason a claim fails.
              </p>
            </div>
          </div>
        </section>


        {/* ---- What is in the alloy ----
             The page has covered how metals age and how to store them. It has not
             said what is actually *in* them, and for one adult in seven that is
             the only question on this page that matters. Placed before the FAQ,
             because a nickel reaction is not an occasional question — it is the
             single commonest reason a piece stops being worn. */}
        <section className="relative overflow-hidden border-y border-hairline bg-canvas py-20 md:py-28">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <BokehDrift count={12} />
          </div>

          <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
            <SectionHeading
              eyebrow="What Is In It"
              title="Almost nobody reacts to gold"
              highlightWords={['gold']}
              subtitle="They react to what else is in the alloy — overwhelmingly nickel, and a karat number tells you nothing at all about it. Every alloy we work is below, with the nickel release measured against the only threshold that has a law behind it."
              align="center"
              className="mb-14"
            />

            <MetalAllergyAdvisor />
          </div>
        </section>

        {/* ---- Whether the chain can carry it ----
             The most avoidable loss in the trade, and almost always the shop's
             fault rather than the customer's. Sits next to the alloy disclosure
             because both are cases of a number that exists, is knowable, and is
             simply never quoted across a counter. */}
        <section className="relative overflow-hidden py-20 md:py-28">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <RippleGrid spacing={54} reach={170} dot={1} />
          </div>

          <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
            <SectionHeading
              eyebrow="Load"
              title="The chain is not the part that breaks"
              highlightWords={['breaks']}
              subtitle="The jump ring is. Every chain here is rated by what it will carry for twenty years rather than what it will hold this afternoon — and the number that matters is the shock load when it catches on a coat, which is several times the weight of the pendant."
              align="center"
              className="mb-14"
            />

            <ChainStrengthGauge />
          </div>
        </section>

        {/* ---- Whether it can be sized ----
             Between the two questions above and the FAQ, because it is the same
             kind of answer: a structural fact about a piece that decides what can
             be done to it later, knowable now, and almost never said out loud at
             the point of sale. */}
        <section className="relative overflow-hidden border-y border-hairline bg-canvas-alt/60 py-20 md:py-28">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <CausticsCanvas intensity={0.26} lobes={4} speed={38} />
          </div>

          <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
            <SectionHeading
              eyebrow="Alteration"
              title="Every shop can size that ring"
              highlightWords={['can']}
              subtitle="A meaningful number of them should not. The travel available in a ring is decided by its construction and nothing else, and four of the ten constructions below cannot be sized at all — which is a conversation for before you buy rather than for five years afterwards."
              align="center"
              className="mb-14"
            />

            <ResizeFeasibility />
          </div>
        </section>

        {/* ---- FAQ ---- */}
        <section className="relative py-20 md:py-28">
          <div className="relative z-10 mx-auto max-w-3xl px-6">
            <SectionHeading
              eyebrow="Asked Often"
              title="The questions that come up"
              highlightWords={['questions']}
              align="center"
              className="mb-14"
            />

            <FAQAccordion items={CARE_FAQ} />
          </div>
        </section>

        {/* ---- The chain itself ----
             The care page can already measure a wrist, a neck and a finger,
             and can triage what has broken. What it has never covered is the
             structure of the thing most likely to break — and most chain
             failures are not failures of metal at all. They are kinks, and
             whether a kink is survivable is decided entirely by the weave. */}
        <section className="relative overflow-hidden border-y border-hairline bg-canvas-alt py-24 md:py-32">
          <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
            <SectionHeading
              eyebrow="Eight weaves"
              title="A chain almost never breaks because the gold was weak"
              highlightWords={['weak']}
              subtitle="It breaks because a link was forced out of its plane and the next one then loaded it edge-on. Which weave you own decides whether that is a ten-minute repair or the end of the chain — and one of the eight below carries no pendant at all."
              align="left"
              className="mb-14"
            />

            <ChainWeaveLibrary />
          </div>
        </section>

        {/* ---- The finger that is never the same size twice ----
             Directly after the chain, and immediately before the closing
             invitation, because it is the single most common reason somebody
             walks back through the door. The sizer elsewhere on this page
             gives a number; this gives the window that number sits inside, and
             the window is a size and a half wide. */}
        <section className="relative overflow-hidden bg-canvas py-24 md:py-32">
          <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
            <SectionHeading
              eyebrow="Why it fitted in the shop"
              title="Your finger is not one size, it is a range"
              highlightWords={['range']}
              subtitle="Cold hands take three quarters of a size off. A hot afternoon puts most of it back. Add a wide band, a long flight and a decade, and the honest answer to “what size are you” is a window rather than a number — so here is yours, and where in it to sit a particular ring."
              align="left"
              className="mb-14"
            />

            <FingerSizeDrift />
          </div>
        </section>

        {/* ---- Onward ---- */}
        <section className="relative px-6 pb-28 text-center">
          <SectionHeading
            eyebrow="Bring It In"
            title="Service is free, for ever"
            highlightWords={['free,']}
            subtitle="Anything we made, whether or not you were the one who bought it. No receipt needed and no time limit — the mark inside tells us it is ours."
            align="center"
            className="mb-10"
          />
          <div className="flex flex-wrap justify-center gap-4">
            <CTAButton variant="primary" size="lg" href="/book-appointment" showArrow>
              Book the bench
            </CTAButton>
            <CTAButton variant="secondary" size="lg" href="/gemstones">
              The stone library
            </CTAButton>
          </div>
        </section>
      </div>
    </>
  );
}
