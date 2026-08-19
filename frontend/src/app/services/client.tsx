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
import SavingsPlanner from '@/components/ui/SavingsPlanner';
import PackagingConfigurator from '@/components/ui/PackagingConfigurator';
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
