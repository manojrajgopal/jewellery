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
import { Reveal, StaggerContainer, StaggerItem } from '@/components/animations/Reveal';

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
