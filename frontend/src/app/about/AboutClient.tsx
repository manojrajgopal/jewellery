'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
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
import HeritageTimeline from '@/components/ui/HeritageTimeline';
import CausticsCanvas from '@/components/motion/CausticsCanvas';
import { brandData } from '@/data/brand';

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
