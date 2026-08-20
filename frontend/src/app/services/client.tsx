'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Gem, ShieldCheck, Sparkles, Wrench } from 'lucide-react';
import PageBanner from '@/components/ui/PageBanner';
import CTAButton from '@/components/ui/CTAButton';
import SectionHeading from '@/components/ui/SectionHeading';
import GoldDivider from '@/components/ui/GoldDivider';
import GradientOrb from '@/components/ui/GradientOrb';
import FAQAccordion from '@/components/ui/FAQAccordion';
import SpotlightCard from '@/components/motion/SpotlightCard';
import CausticsCanvas from '@/components/motion/CausticsCanvas';
import ScrollStackCards from '@/components/motion/ScrollStackCards';
import ScrollAssembleText from '@/components/motion/ScrollAssembleText';
import RippleGrid from '@/components/motion/RippleGrid';
import GoldRibbonWeave from '@/components/motion/GoldRibbonWeave';
import CinematicLetterbox from '@/components/motion/CinematicLetterbox';
import ScrollSpineTimeline, { type SpineNode } from '@/components/motion/ScrollSpineTimeline';
import TypeSlamHeading from '@/components/motion/TypeSlamHeading';
import EchoTrailText from '@/components/motion/EchoTrailText';
import MetaballGold from '@/components/motion/MetaballGold';
import SmokeVeil from '@/components/motion/SmokeVeil';
import StageSweep from '@/components/motion/StageSweep';
import VertigoZoom from '@/components/motion/VertigoZoom';
import RepairTriage from '@/components/ui/RepairTriage';
import SavingsPlanner from '@/components/ui/SavingsPlanner';
import PackagingConfigurator from '@/components/ui/PackagingConfigurator';
import BuybackLadder from '@/components/ui/BuybackLadder';
import ScrollBlurFocus from '@/components/motion/ScrollBlurFocus';
import SolderWeldPath from '@/components/motion/SolderWeldPath';
import { Reveal, StaggerContainer, StaggerItem } from '@/components/animations/Reveal';

/**
 * Real lead times, queue included.
 *
 * Published as a stack rather than a table because each one needs a sentence of
 * explanation — a bare "18 months" against restoration reads as incompetence, and the
 * reason it is eighteen months is the thing that makes it acceptable.
 */
const LEAD_TIMES = [
  {
    id: 'lt1',
    kicker: 'Cleaning & polish',
    title: 'Same day, while you wait',
    body: 'Ultrasonic where the stone allows it, hand-cleaned where it does not, then a professional polish. Free for anything we made, and free for anything we did not if you are in the boutique anyway.',
    image: '/images/products/ring.jpg',
    meta: ['Same day', 'No charge'],
    accent: 'jade' as const,
  },
  {
    id: 'lt2',
    kicker: 'Resizing & engraving',
    title: 'Seven to ten working days',
    body: 'A resize is a cut, a solder and a full refinish, and the refinish is what takes the time. Engraving is ten days because the engraver works two days a week and will not be hurried.',
    image: '/images/products/bracelet.jpg',
    meta: ['7–10 days', 'Free within the first year'],
    accent: 'gold' as const,
  },
  {
    id: 'lt3',
    kicker: 'Retipping & stone replacement',
    title: 'Two to four weeks, longer if we are matching',
    body: 'The bench work is two days. The wait is sourcing a stone that matches the ones already in the piece — and if the piece is forty years old, matching an old cut can take a month of looking.',
    image: '/images/collections/gemstone.jpg',
    meta: ['2–4 weeks', 'Longer to match'],
    accent: 'amethyst' as const,
  },
  {
    id: 'lt4',
    kicker: 'Bespoke commission',
    title: 'Six to fourteen weeks, and we will not compress it',
    body: 'Two weeks of drawing, a week of your revisions, then the bench. Fourteen at the top end means handwork — kundan, granulation, repoussé. We have never met a deadline by cutting a stage and we are not going to start.',
    image: '/images/collections/bridal.jpg',
    meta: ['6–14 weeks', 'Drawing included'],
    accent: 'burgundy' as const,
  },
  {
    id: 'lt5',
    kicker: 'Full restoration',
    title: 'Eighteen months, and there is a queue',
    body: 'One bench, one artisan, thirty-six years of Victorian and Edwardian work, and no way to add capacity without adding someone who cannot yet do it. We have never advertised this service and the queue is still eighteen months.',
    image: '/images/collections/heritage.jpg',
    meta: ['18-month queue', 'Joseph Fernandes'],
    accent: 'rose' as const,
  },
];

const SERVICES = [
  {
    icon: Gem,
    title: 'Bespoke Design',
    description:
      'Transform your vision into reality with our master artisans. We guide you through every step, from initial sketches to selecting the perfect stones, ensuring your custom piece is as unique as your story.',
    features: [
      'Private consultation',
      'Hand-drawn sketches',
      '3D CAD rendering',
      'Stone selection viewing',
    ],
  },
  {
    icon: Wrench,
    title: 'Restoration & Repair',
    description:
      'Breathe new life into cherished heirlooms. Our delicate restoration process preserves the character of vintage pieces while ensuring their longevity for generations to come.',
    features: [
      'Prong retipping',
      'Stone replacement',
      'Polishing & rhodium plating',
      'Resizing & adjustments',
    ],
  },
  {
    icon: ShieldCheck,
    title: 'Appraisal & Valuation',
    description:
      'Receive comprehensive documentation for your precious pieces. Our certified gemologists provide detailed reports for insurance, estate planning, or personal peace of mind.',
    features: [
      'Certified gemologists',
      'Detailed grading reports',
      'Market value assessment',
      'Laser inscription checks',
    ],
  },
  {
    icon: Sparkles,
    title: 'Jewellery Spa',
    description:
      'Experience our ultrasonic deep cleaning service that returns your pieces to their original brilliance. We meticulously check settings and restore that day-one sparkle.',
    features: [
      'Ultrasonic cleaning',
      'Steam purification',
      'Setting integrity check',
      'Complimentary for AURUM pieces',
    ],
  },
];

const PROCESS = [
  { num: '01', title: 'Consultation', desc: 'Discuss your vision, budget, and timeline in a private setting.' },
  { num: '02', title: 'Design', desc: 'Review custom sketches and 3D renderings of your unique piece.' },
  { num: '03', title: 'Creation', desc: 'Our master craftsmen bring the design to life using ancient techniques.' },
  { num: '04', title: 'Delivery', desc: 'Unveil your finished masterpiece in a celebratory presentation.' },
];

const FAQS = [
  {
    question: 'How long does a bespoke commission take?',
    answer:
      'Most bespoke pieces take eight to twelve weeks from approved design to delivery. Complex settings or rare stone sourcing can extend this to sixteen weeks — we will always confirm a timeline before work begins.',
  },
  {
    question: 'Do you work with stones I already own?',
    answer:
      'Yes. We regularly reset inherited stones into contemporary designs. Every stone is examined and graded first, and we will tell you honestly if a stone is too fragile to reset safely.',
  },
  {
    question: 'Is restoration ever declined?',
    answer:
      'Occasionally. Where a repair would destroy the historical integrity of an antique piece, we will say so and suggest conservation instead of restoration.',
  },
  {
    question: 'What does the lifetime care programme include?',
    answer:
      'Annual ultrasonic cleaning, setting inspection, and re-polishing for any AURUM piece, at no charge, for as long as you own it.',
  },
];

/**
 * What actually happens to a piece between the counter and the collection call.
 *
 * Written as the sequence rather than as a list of services, because the anxiety
 * a customer has when handing over something irreplaceable is not about the price
 * list \u2014 it is about where the piece is and who has it. Every entry names the
 * point at which the customer is told something, for the same reason.
 *
 * `aside` carries the honest timing, including the two places where the answer is
 * that it waits.
 */
const BENCH_SEQUENCE: SpineNode[] = [
  {
    marker: 'At the counter',
    title: 'Weighed, photographed, receipted',
    body: 'Before it leaves your hands: total weight to two decimal places, photographs from six angles including any inscription, and a written note of every existing chip and worn claw. You keep a copy.',
    aside: 'Takes about eight minutes and settles most of what people worry about',
  },
  {
    marker: 'Same day',
    title: 'Assessed under ten magnifications',
    body: 'A bench jeweller \u2014 not a counter assistant \u2014 looks at what you have described and at what you have not. Most pieces come in for one fault and have two.',
    aside: 'You are told the second one before any work starts, not after',
  },
  {
    marker: 'Before anything is done',
    title: 'The quote, itemised by operation',
    body: 'Not a single figure. Each operation priced separately, so you can decline the polish and keep the re-tipping, or take the structural work now and the cosmetic work later.',
    aside: 'Nothing is begun without a yes to a specific line',
  },
  {
    marker: 'Day 1 to 14',
    title: 'On the bench, or waiting for stone',
    body: 'Straightforward work is done within a fortnight. Where a stone has to be matched, the piece waits in the strongroom rather than sitting part-finished on a bench \u2014 and matching a stone honestly can take months.',
    aside: 'The two-week figure is for the work, not for the waiting',
  },
  {
    marker: 'On completion',
    title: 'Checked by someone who did not do it',
    body: 'A second bench jeweller inspects the work, because the person who set a stone is the worst-placed person to notice they set it a degree off.',
    aside: 'It is why the last day of a repair is a day of doing nothing',
  },
  {
    marker: 'Back at the counter',
    title: 'Photographed again, weighed again',
    body: 'The same six angles and the same scale, handed to you beside the originals. Any weight difference is explained \u2014 polishing removes metal, and you should be told how much.',
    aside: 'The only claim we make about our own work that you can check yourself',
  },
];

export default function ServicesClient() {
  return (
    <main className="min-h-screen bg-canvas">
      <PageBanner
        title="Our Services"
        subtitle="Beyond the showcase — excellence in every detail"
        breadcrumbs={[{ label: 'Services' }]}
        backgroundImage="/images/hero/craftsmanship.jpg"
      />

      {/* Service cards */}
      <section className="relative px-6 py-24 md:px-12 lg:px-24">
        <GradientOrb color="gold" size="xl" position="top-left" intensity={0.09} blur="3xl" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Expertise"
            title="Exceptional Services"
            highlightWords={['Exceptional']}
            subtitle="Tailored care for your most precious possessions."
            align="center"
            className="mb-16"
          />

          <StaggerContainer staggerChildren={0.12} className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {SERVICES.map((service) => {
              const Icon = service.icon;
              return (
                <StaggerItem key={service.title} className="h-full">
                  <SpotlightCard
                    radius={420}
                    className="h-full border border-hairline bg-surface-raised/60 backdrop-blur-xl"
                  >
                    <div className="group flex h-full flex-col p-8 md:p-12">
                      <motion.div
                        whileHover={{ rotate: -8, scale: 1.1 }}
                        transition={{ type: 'spring', stiffness: 250, damping: 15 }}
                        className="mb-6 w-fit rounded-2xl border border-gold-500/20 bg-gold-500/10 p-4 text-accent"
                      >
                        <Icon className="h-9 w-9" strokeWidth={1.3} />
                      </motion.div>

                      <h3 className="mb-4 font-display text-3xl text-primary transition-colors duration-300 group-hover:text-accent">
                        {service.title}
                      </h3>

                      <p className="mb-8 flex-grow font-sans text-sm font-light leading-relaxed text-muted md:text-base">
                        {service.description}
                      </p>

                      <ul className="mb-8 space-y-3">
                        {service.features.map((feature, idx) => (
                          <motion.li
                            key={feature}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.15 + idx * 0.07, duration: 0.45 }}
                            className="flex items-center gap-3 font-sans text-sm text-secondary"
                          >
                            <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-accent" strokeWidth={1.8} />
                            {feature}
                          </motion.li>
                        ))}
                      </ul>

                      <CTAButton variant="ghost" size="sm" href="/contact" showArrow className="self-start">
                        Learn More
                      </CTAButton>
                    </div>
                  </SpotlightCard>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      <GoldDivider variant="jewel" />

      {/* Process */}
      <section className="relative overflow-hidden bg-surface-raised/40 py-24">
        <CausticsCanvas intensity={0.3} lobes={5} speed={34} />

        <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
          <SectionHeading
            eyebrow="The Journey"
            title="How We Work"
            highlightWords={['Work']}
            subtitle="A transparent, collaborative process built to make absolute perfection routine."
            align="center"
            className="mb-20"
          />

          <div className="relative">
            {/* Connecting rail that draws itself in */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-0 top-12 hidden w-full origin-left border-t border-dashed border-gold-700/40 lg:block"
            />

            <div className="relative grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
              {PROCESS.map((step, index) => (
                <Reveal key={step.num} delay={index * 0.18}>
                  <div className="group relative flex flex-col items-center text-center">
                    <motion.div
                      whileHover={{ scale: 1.07 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                      className="relative z-10 mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-gold-500/25 bg-canvas transition-colors duration-500 group-hover:border-gold-500/60"
                    >
                      <span className="font-display text-3xl text-accent">{step.num}</span>
                      <span className="absolute inset-0 rounded-full border border-gold-500/20 opacity-0 transition-opacity duration-500 group-hover:animate-scale-pulse group-hover:opacity-100" />
                    </motion.div>

                    <h4 className="mb-3 font-display text-2xl text-primary">{step.title}</h4>
                    <p className="max-w-[250px] font-sans text-sm font-light leading-relaxed text-muted">
                      {step.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What each service actually costs in time. The cards above say what we do;
          this says how long you will be without the piece, which is the question
          people are too polite to ask and then resent the answer to. */}
      <section className="relative overflow-hidden border-y border-hairline bg-canvas-alt py-24 md:py-32">
        <RippleGrid spacing={48} reach={190} dot={1} />

        <div className="relative z-10 mx-auto max-w-5xl px-6 md:px-12">
          <div className="mb-16 text-center">
            <p className="mb-5 font-accent text-[10px] uppercase tracking-luxest text-accent">
              Lead Times, Honestly
            </p>
            <ScrollAssembleText
              text="How long you will be without it"
              as="h2"
              highlightWords={['without']}
              spread={72}
              className="mx-auto max-w-2xl font-display text-3xl font-light leading-[1.12] text-primary sm:text-4xl md:text-5xl"
            />
            <p className="mx-auto mt-5 max-w-xl font-sans text-sm font-light leading-relaxed text-muted">
              Every figure here is the real one, including the queue. We would rather
              disappoint you now than at the counter in three weeks.
            </p>
          </div>

          <div className="pb-[28vh]">
            <ScrollStackCards cards={LEAD_TIMES} offset={22} shrink={0.05} />
          </div>
        </div>
      </section>

      {/* ---- Triage ----
           The lead times above say what the workshop does and how long each job takes.
           They cannot answer the question people actually walk in with, which is
           whether the thing they have noticed is serious. Nine complaints in the words
           they are said in, and what each one really is. */}
      <CinematicLetterbox slate="Is This Serious" slateNote="Nine complaints, translated" barHeight={0.08}>
        <section className="relative overflow-hidden bg-canvas-alt py-24 md:py-32">
          <RippleGrid spacing={46} reach={160} push={9} />
          <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
            <SectionHeading
              eyebrow="Triage"
              title="Three of these mean take it off now"
              highlightWords={['now']}
              subtitle="Described the way it is described at the counter, answered with what it actually is, what happens to it, roughly what it costs and how long it takes."
              align="center"
              className="mb-14"
            />
            <RepairTriage />
          </div>
        </section>
      </CinematicLetterbox>

      <GoldRibbonWeave className="px-6" height={100} />

      {/* Paying for it over time */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <CausticsCanvas intensity={0.28} lobes={5} speed={34} />

        <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
          <SectionHeading
            eyebrow="Paying For It"
            title="Set aside monthly, spend it whenever"
            highlightWords={['monthly,']}
            subtitle="A deposit scheme rather than an instrument with a yield — we add instalments at maturity, and the panel below says exactly what that is and is not."
            align="center"
            className="mb-14"
          />

          <SavingsPlanner />
        </div>
      </section>

      {/* What arrives at the end of it */}
      <section className="relative overflow-hidden border-y border-hairline bg-surface-raised/30 py-24 md:py-32">
        <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
          <SectionHeading
            eyebrow="And Then"
            title="What it comes back in"
            highlightWords={['back']}
            subtitle="A serviced piece is returned in a fresh case, cleaned, and photographed at forty magnifications so you have a record of the condition it left us in."
            align="center"
            className="mb-14"
          />

          <PackagingConfigurator />
        </div>
      </section>


      {/* ---- The sequence ----
           The cards above say what we do; this says what happens, in order, to
           the specific object you handed over. That is a different anxiety and
           it is the one people actually have \u2014 nobody hesitates over the price
           of a re-tip, they hesitate over letting go of the ring.

           Drawn rather than listed, so the line reaches each stage as you scroll
           to it. A repair is a sequence with waiting in it, and a bulleted list
           flattens the waiting out of it. */}
      <section className="relative overflow-hidden border-y border-hairline bg-canvas py-24 md:py-32">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <MetaballGold count={5} intensity={0.24} step={4} attract={false} />
          <SmokeVeil intensity={0.2} originX={0.24} speed={0.65} count={15} />
          <div className="absolute inset-0 bg-gradient-to-b from-canvas via-canvas/40 to-canvas" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-6 md:px-12">
          <div className="mb-16 text-center">
            <p className="mb-5 font-accent text-[10px] uppercase tracking-luxest text-accent">
              After you hand it over
            </p>
            <TypeSlamHeading
              lines={['Nobody hesitates', 'over the price.', 'They hesitate over letting go.']}
              highlightWords={['go.']}
              as="h2"
              gap={0.17}
              className="mx-auto max-w-4xl font-display text-3xl leading-[1.1] text-primary md:text-5xl"
            />
            <p className="mx-auto mt-6 max-w-xl font-sans text-base font-light leading-relaxed text-muted">
              So here is every step between the counter and the collection call, including the two
              places where the honest answer is that your piece is sitting in the strongroom waiting
              for a stone to be matched properly.
            </p>
          </div>

          <ScrollSpineTimeline nodes={BENCH_SEQUENCE} />
        </div>
      </section>

      {/* ---- What it is worth coming back ----
           Every house in this trade operates a buy-back and almost none publish
           the arithmetic, which is how a customer finds out at the counter that
           the eighty-five per cent they were told about is eighty-five per cent
           of something they had assumed meant the price they paid.

           Placed after the repair and restoration run rather than beside the
           savings plan, because those two sections are about money going in and
           this is the only one on the site about money coming out. */}
      <section className="relative overflow-hidden border-y border-hairline bg-canvas py-24 md:py-28">
        <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
          <SectionHeading
            eyebrow="The Other Direction"
            title="Metal, making and stones come back at three different rates"
            highlightWords={['three']}
            subtitle="Which is the whole reason exchange rates look generous and cash rates look mean — they are the same policy seen from two ends. Set your own figures below and watch the three components separate."
            align="center"
            className="mb-14"
          />

          <BuybackLadder />

          <div className="mt-20 grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
            <ScrollBlurFocus
              lines={[
                'A buy-back figure is not a discount.',
                'It is the resale value of an object.',
                'Publishing it is the only way to tell whether the first price was fair.',
              ]}
              depth={0.85}
            />

            <div className="rounded-2xl border border-hairline bg-surface-raised/35 p-7">
              <SolderWeldPath join="link" duration={2.4} loop />
              <p className="mt-3 font-sans text-xs font-light leading-relaxed text-faint">
                And this is what a restoration actually is: two hundred and sixty joins on a 45cm
                chain, each one hand-fed and closed. It is why a chain repair is quoted by the
                inch and not by the piece.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- The guarantee ----
           One held shot before the questions. Everything above is procedure;
           this is the single sentence the procedure exists to make true. */}
      <section className="relative overflow-hidden bg-surface-sunken py-28 md:py-36">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <StageSweep intensity={0.24} width={0.3} crossed seconds={17} />
          <div className="absolute inset-0 bg-[radial-gradient(58%_46%_at_50%_50%,rgb(var(--canvas)/0.8),transparent_78%)]" />
        </div>

        <VertigoZoom intensity={0.7} className="relative z-10">
          <div className="mx-auto max-w-3xl px-6 text-center md:px-12">
            <EchoTrailText
              text="Anything we made, for as long as it exists."
              as="h2"
              echoes={3}
              spread={18}
              direction="left"
              persistent
              className="font-display text-3xl leading-snug text-primary md:text-5xl"
            />
            <p className="mx-auto mt-8 max-w-xl font-sans text-base font-light leading-relaxed text-secondary md:text-lg">
              Whether or not you were the one who bought it, whether or not you have a receipt, and
              with no time limit at all. The mark inside the shank tells us it is ours, which is the
              only proof the guarantee has ever required.
            </p>
          </div>
        </VertigoZoom>
      </section>

      {/* FAQ */}
      <section className="px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            eyebrow="Good to Know"
            title="Questions We Are Asked"
            highlightWords={['Questions']}
            align="center"
            className="mb-14"
          />
          <FAQAccordion items={FAQS} />
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-28 text-center">
        <Reveal>
          <SectionHeading
            eyebrow="Begin"
            title="Ready to begin?"
            highlightWords={['begin?']}
            subtitle="Schedule a private consultation with our artisans and take the first step towards your bespoke masterpiece."
            align="center"
            className="mb-10"
          />
          <CTAButton href="/contact" variant="primary" size="lg" showArrow>
            Book an Appointment
          </CTAButton>
        </Reveal>
      </section>
    </main>
  );
}
