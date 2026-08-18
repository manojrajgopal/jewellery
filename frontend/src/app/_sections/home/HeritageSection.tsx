'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Parallax from '@/components/motion/Parallax';
import CountUp from '@/components/motion/CountUp';
import CurtainReveal from '@/components/motion/CurtainReveal';
import SectionHeading from '@/components/ui/SectionHeading';
import GoldDivider from '@/components/ui/GoldDivider';
import CTAButton from '@/components/ui/CTAButton';
import FadeInOnView from '@/components/animations/FadeInOnView';
import { brandData } from '@/data/brand';

const STATS = brandData.stats ?? [
  { label: 'Years of Legacy', value: 130, suffix: '+' },
  { label: 'Master Artisans', value: 50, suffix: '+' },
  { label: 'Creations', value: 10000, suffix: '+' },
  { label: 'Ethically Certified', value: 100, suffix: '%' },
];

export default function HeritageSection() {
  return (
    <section id="about" className="relative w-full overflow-hidden bg-canvas py-24 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {/* Imagery */}
          <div className="relative">
            <CurtainReveal
              direction="left"
              className="group relative aspect-[4/5] w-full overflow-hidden rounded-2xl lg:aspect-square"
            >
              <Parallax speed={0.35} scaleRange={[1, 1.12]} className="h-full w-full">
                <Image
                  src="/images/hero/craftsmanship.jpg"
                  alt="An AURUM artisan at the bench"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </Parallax>
              <div className="pointer-events-none absolute inset-0 rounded-2xl border border-gold-500/0 transition-colors duration-700 group-hover:border-gold-500/35" />
            </CurtainReveal>

            {/* Floating est. plaque */}
            <motion.div
              initial={{ opacity: 0, y: 30, rotate: -6 }}
              whileInView={{ opacity: 1, y: 0, rotate: -6 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
              className="glass-strong absolute -bottom-6 -right-4 z-20 hidden animate-float-slow flex-col items-center px-7 py-5 sm:flex"
            >
              <span className="font-accent text-[9px] uppercase tracking-luxer text-muted">
                Established
              </span>
              <span className="font-display text-3xl text-accent">
                {brandData.established ?? 1892}
              </span>
            </motion.div>
          </div>

          {/* Copy */}
          <div className="flex flex-col space-y-10">
            <SectionHeading
              eyebrow="Our Legacy"
              title="Four Generations of Brilliance"
              highlightWords={['Brilliance']}
              align="left"
              ornament={false}
            />

            <FadeInOnView direction="up" delay={0.25}>
              <p className="font-sans text-base font-light leading-relaxed text-muted lg:text-lg">
                {brandData.description}
              </p>
            </FadeInOnView>

            <FadeInOnView direction="up" delay={0.35} className="grid grid-cols-2 gap-x-8 gap-y-10">
              {STATS.map((stat) => (
                <div key={stat.label} className="group flex flex-col">
                  <CountUp
                    end={stat.value}
                    suffix={stat.suffix}
                    duration={2.4}
                    className="font-display text-4xl text-accent transition-transform duration-500 group-hover:translate-x-1 md:text-5xl"
                  />
                  <span className="mt-1 block h-px w-8 bg-accent/40 transition-all duration-500 group-hover:w-16" />
                  <span className="mt-2 font-accent text-[10px] uppercase tracking-luxe text-muted">
                    {stat.label}
                  </span>
                </div>
              ))}
            </FadeInOnView>

            <FadeInOnView direction="up" delay={0.45} className="pt-2">
              <CTAButton variant="primary" size="lg" href="/about" showArrow>
                Discover Our Story
              </CTAButton>
            </FadeInOnView>
          </div>
        </div>
      </div>

      <div className="mt-24">
        <GoldDivider variant="jewel" />
      </div>
    </section>
  );
}
