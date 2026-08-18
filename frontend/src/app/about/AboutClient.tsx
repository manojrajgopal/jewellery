'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Crown, Gem, Leaf, ShieldCheck } from 'lucide-react';
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
import { brandData } from '@/data/brand';

const MILESTONES = [
  {
    year: '1892',
    title: 'Founded by a Master Goldsmith',
    description:
      'Our first boutique opens in the heart of the city, establishing a tradition of excellence that would outlast its founder by more than a century.',
  },
  {
    year: '1940',
    title: 'The Second Generation',
    description:
      'The craft expands into rare gemstones and complex settings, earning the house its first royal patronage.',
  },
  {
    year: '1978',
    title: 'The Third Generation',
    description:
      'International recognition arrives alongside the establishment of our signature diamond cut.',
  },
  {
    year: '2010',
    title: 'The Fourth Generation',
    description:
      'Digital innovation joins ancestral technique — CAD modelling beside the same hand tools used in 1892.',
  },
];

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

export default function AboutClient() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 65%', 'end 60%'],
  });
  // The vertical rail fills as the reader descends the timeline.
  const railScale = useSpring(scrollYProgress, { stiffness: 90, damping: 30 });

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

        {/* Timeline */}
        <section className="border-y border-hairline bg-surface-raised/40 py-24">
          <div className="mx-auto max-w-4xl px-6">
            <SectionHeading
              eyebrow="Milestones"
              title="The Journey"
              highlightWords={['Journey']}
              align="center"
              className="mb-20"
            />

            <div ref={timelineRef} className="relative">
              {/* Track + progress rail */}
              <div className="absolute bottom-0 left-[27px] top-0 w-px bg-line md:left-1/2" />
              <motion.div
                style={{ scaleY: railScale }}
                className="absolute bottom-0 left-[27px] top-0 w-px origin-top bg-gradient-to-b from-gold-300 via-gold-500 to-gold-700 md:left-1/2"
              />

              <div className="space-y-24">
                {MILESTONES.map((milestone, index) => {
                  const flipped = index % 2 !== 0;

                  return (
                    <FadeInOnView
                      key={milestone.year}
                      delay={index * 0.1}
                      className="relative flex flex-col items-start gap-8 md:flex-row md:items-center md:gap-0"
                    >
                      {/* The year marker is absolutely positioned, so it does not
                          occupy a flex slot. Without this spacer the copy has no
                          sibling to be ordered against and every entry stacks on
                          the left instead of alternating. */}
                      {flipped && <div className="hidden md:block md:w-1/2" aria-hidden="true" />}

                      <div
                        className={`flex pl-20 md:w-1/2 md:pl-0 ${
                          flipped ? 'md:justify-start md:pl-16' : 'md:justify-end md:pr-16'
                        }`}
                      >
                        <div className={`text-left ${flipped ? '' : 'md:text-right'}`}>
                          <h3 className="mb-2 font-display text-2xl text-accent-soft">
                            {milestone.title}
                          </h3>
                          <p className="font-sans text-sm font-light leading-relaxed text-muted">
                            {milestone.description}
                          </p>
                        </div>
                      </div>

                      <motion.div
                        whileHover={{ scale: 1.09 }}
                        className="absolute left-0 z-10 flex h-14 w-14 items-center justify-center rounded-full border border-gold-500/50 bg-canvas font-display text-sm text-gold-100 shadow-[0_0_20px_-4px_rgb(var(--gold-500)/0.45)] md:left-1/2 md:-translate-x-1/2"
                      >
                        {milestone.year}
                        <span className="absolute inset-0 animate-scale-pulse rounded-full border border-gold-500/30" />
                      </motion.div>
                    </FadeInOnView>
                  );
                })}
              </div>
            </div>
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
