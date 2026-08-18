'use client';

import React from 'react';
import DiamondSparkles from '@/components/motion/DiamondSparkles';
import CTAButton from '@/components/ui/CTAButton';
import GradientOrb from '@/components/ui/GradientOrb';
import FadeInOnView from '@/components/animations/FadeInOnView';
import { Diamond } from 'lucide-react';

export default function CTASection() {
  return (
    <section id="cta" className="relative w-full py-24 md:py-32 bg-ink-950 overflow-hidden flex items-center justify-center">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold-500/10 via-ink-950 to-ink-950 pointer-events-none" />
      <GradientOrb color="gold" size="lg" position="center" className="opacity-20 mix-blend-screen" />
      
      {/* Sparkles Overlay */}
      <DiamondSparkles density={20} className="opacity-60" color="#fdf3d7" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
        <FadeInOnView direction="down" delay={0.1}>
          <Diamond className="w-8 h-8 text-gold-500 mb-8 mx-auto opacity-80" strokeWidth={1} />
        </FadeInOnView>

        <FadeInOnView direction="up" delay={0.2}>
          <h2 className="font-display text-4xl md:text-6xl text-cream-50 leading-tight mb-6 max-w-4xl mx-auto">
            Begin Your Story with <span className="text-gold-500">AURUM</span>
          </h2>
        </FadeInOnView>

        <FadeInOnView direction="up" delay={0.3}>
          <p className="text-ink-300 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light">
            Every piece tells a story. Let us craft yours. Experience the pinnacle of fine jewelry craftsmanship.
          </p>
        </FadeInOnView>

        <FadeInOnView direction="up" delay={0.4} className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <CTAButton variant="primary" size="lg" href="/collections" showArrow>
            Explore Collections
          </CTAButton>
          <CTAButton variant="secondary" size="lg" href="/contact">
            Contact Us
          </CTAButton>
        </FadeInOnView>
      </div>
    </section>
  );
}
