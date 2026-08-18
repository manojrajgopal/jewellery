'use client';

import React from 'react';
import Image from 'next/image';
import Parallax from '@/components/motion/Parallax';
import CountUp from '@/components/motion/CountUp';
import SectionHeading from '@/components/ui/SectionHeading';
import GoldDivider from '@/components/ui/GoldDivider';
import CTAButton from '@/components/ui/CTAButton';
import FadeInOnView from '@/components/animations/FadeInOnView';
import { brandData } from '@/data/brand';

export default function HeritageSection() {
  return (
    <section id="about" className="relative w-full py-24 bg-ink-950 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column - Image */}
          <FadeInOnView direction="left" delay={0.2} className="relative w-full aspect-[4/5] lg:aspect-square rounded-2xl overflow-hidden group">
            <Parallax speed={0.3} className="w-full h-full">
              <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                <Image
                  src="/images/hero/craftsmanship.jpg"
                  alt="Craftsmanship"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </Parallax>
            {/* Subtle Gold Border Overlay */}
            <div className="absolute inset-0 border border-gold-500/0 group-hover:border-gold-500/30 transition-colors duration-500 rounded-2xl z-10 pointer-events-none" />
          </FadeInOnView>

          {/* Right Column - Content */}
          <div className="flex flex-col space-y-10">
            <SectionHeading
              eyebrow="OUR LEGACY"
              title="Four Generations of Brilliance"
              highlightWords={['Brilliance']}
              align="left"
            />
            
            <FadeInOnView direction="up" delay={0.3}>
              <p className="text-ink-400 leading-relaxed text-lg">
                {brandData?.description || "Since 1892, AURUM has been the custodian of extraordinary moments. For four generations, our master artisans have pushed the boundaries of high jewelry, uniting traditional goldsmithing techniques with contemporary design. Every piece we create is a testament to our enduring commitment to perfection, ethical sourcing, and the celebration of life's most precious milestones."}
              </p>
            </FadeInOnView>

            <FadeInOnView direction="up" delay={0.4} className="grid grid-cols-2 gap-8">
              <div className="flex flex-col">
                <CountUp end={130} suffix="+" duration={2} className="font-display text-4xl md:text-5xl text-gold-500" />
                <span className="text-sm text-ink-400 mt-2 uppercase tracking-wider">Years of Legacy</span>
              </div>
              <div className="flex flex-col">
                <CountUp end={50} suffix="+" duration={2} className="font-display text-4xl md:text-5xl text-gold-500" />
                <span className="text-sm text-ink-400 mt-2 uppercase tracking-wider">Master Artisans</span>
              </div>
              <div className="flex flex-col">
                <CountUp end={10} suffix=",000+" duration={2.5} className="font-display text-4xl md:text-5xl text-gold-500" />
                <span className="text-sm text-ink-400 mt-2 uppercase tracking-wider">Creations</span>
              </div>
              <div className="flex flex-col">
                <CountUp end={100} suffix="%" duration={2} className="font-display text-4xl md:text-5xl text-gold-500" />
                <span className="text-sm text-ink-400 mt-2 uppercase tracking-wider">Ethically Certified</span>
              </div>
            </FadeInOnView>

            <FadeInOnView direction="up" delay={0.5} className="pt-4">
              <CTAButton variant="primary" size="lg" href="/heritage" showArrow>
                Discover Our Story
              </CTAButton>
            </FadeInOnView>
          </div>
          
        </div>
      </div>
      
      <div className="mt-24">
        <GoldDivider variant="ornate" />
      </div>
    </section>
  );
}
