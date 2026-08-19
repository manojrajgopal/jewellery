'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Diamond } from 'lucide-react';
import DiamondSparkles from '@/components/motion/DiamondSparkles';
import AuroraBackground from '@/components/motion/AuroraBackground';
import SplitText from '@/components/motion/SplitText';
import CTAButton from '@/components/ui/CTAButton';
import FadeInOnView from '@/components/animations/FadeInOnView';
import CausticsCanvas from '@/components/motion/CausticsCanvas';
import LensFlare from '@/components/motion/LensFlare';
import MetalText from '@/components/motion/MetalText';
import RotatingWords3D from '@/components/motion/RotatingWords3D';

export default function CTASection() {
  return (
    <section
      id="cta"
      className="relative flex w-full items-center justify-center overflow-hidden bg-canvas py-28 md:py-40"
    >
      <AuroraBackground intensity="bold" grid />
      <CausticsCanvas intensity={0.6} lobes={7} speed={22} />
      <LensFlare intensity={0.4} originX={50} originY={22} follow={false} />
      <DiamondSparkles density={28} shape="star" className="z-[2] opacity-70" />

      {/* Concentric facet rings */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center"
      >
        {[300, 480, 680, 900].map((size, i) => (
          <motion.span
            key={size}
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.3, delay: i * 0.14, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: size, height: size }}
            className={`absolute rotate-45 rounded-[18%] border border-gold-500/10 ${
              i % 2 ? 'animate-breathe' : 'animate-spin-slow'
            }`}
          />
        ))}
      </div>

      <div className="container relative z-10 mx-auto flex flex-col items-center px-4 text-center sm:px-6 lg:px-8">
        <FadeInOnView direction="down" delay={0.05}>
          <motion.span
            animate={{ rotate: [0, 180, 360] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
            className="mb-8 block"
          >
            <Diamond className="h-9 w-9 text-accent" strokeWidth={0.9} />
          </motion.span>
        </FadeInOnView>

        <SplitText
          text="Begin Your Story with AURUM"
          as="h2"
          mode="chars"
          highlightWords={['AURUM']}
          className="mx-auto mb-7 max-w-4xl font-display text-4xl leading-[1.05] text-primary md:text-6xl"
        />

        <FadeInOnView direction="up" delay={0.3}>
          <p className="mx-auto mb-6 max-w-2xl font-sans text-lg font-light text-muted md:text-xl">
            Every piece tells a story. Let us craft yours. Experience the pinnacle of fine
            jewellery craftsmanship.
          </p>
        </FadeInOnView>

        {/* The house's disciplines, tumbling on a split-flap */}
        <FadeInOnView direction="up" delay={0.35}>
          <p className="mb-12 flex items-baseline justify-center gap-3 font-accent text-xs uppercase tracking-luxe text-faint">
            We work in
            <MetalText as="span" alloy="gold" className="font-display text-lg normal-case tracking-normal">
              <RotatingWords3D
                words={['uncut polki', 'Ceylon sapphire', 'Colombian emerald', 'south sea pearl', 'old-mine diamond']}
                hold={2600}
              />
            </MetalText>
          </p>
        </FadeInOnView>

        <FadeInOnView
          direction="up"
          delay={0.4}
          className="flex flex-col items-center justify-center gap-5 sm:flex-row"
        >
          <CTAButton variant="primary" size="lg" href="/collections" showArrow>
            Explore Collections
          </CTAButton>
          <CTAButton variant="secondary" size="lg" href="/contact">
            Speak to a Jeweller
          </CTAButton>
        </FadeInOnView>
      </div>
    </section>
  );
}
