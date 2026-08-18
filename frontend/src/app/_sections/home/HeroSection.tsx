'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronDown, Diamond } from 'lucide-react';
import TextReveal from '@/components/motion/TextReveal';
import DiamondSparkles from '@/components/motion/DiamondSparkles';
import CTAButton from '@/components/ui/CTAButton';
import GlassPanel from '@/components/ui/GlassPanel';
import GradientOrb from '@/components/ui/GradientOrb';

export default function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen overflow-hidden flex items-center justify-center bg-ink-950">
      {/* Background Image with Ken Burns */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero/hero-main.jpg"
          alt="AURUM Luxury Gold Jewellery"
          fill
          className="object-cover animate-ken-burns"
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80" />
      </div>

      <GradientOrb color="gold-500" size="lg" position="center" blur="xl" className="opacity-30 z-0" />
      <DiamondSparkles density={30} className="z-10" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-center min-h-screen pt-20 pb-32">
        <div className="max-w-4xl text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex items-center justify-center md:justify-start gap-3 mb-6"
          >
            <Diamond className="w-4 h-4 text-gold-500" />
            <span className="font-accent text-sm tracking-[0.3em] text-gold-500 uppercase">
              SINCE 1892
            </span>
          </motion.div>

          <TextReveal
            text="Timeless Elegance, Crafted in Gold"
            as="h1"
            className="font-display text-5xl md:text-7xl lg:text-8xl font-light text-white mb-8"
            highlightWords={['Gold']}
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="text-lg md:text-xl text-cream-100/80 mb-10 max-w-2xl mx-auto md:mx-0 font-body"
          >
            Four generations of master artisans dedicating their lives to transforming the world&apos;s most precious materials into enduring legacies.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row items-center gap-6 justify-center md:justify-start"
          >
            <CTAButton href="/collections" variant="primary" size="lg" showArrow>
              Explore Collections
            </CTAButton>
            <CTAButton href="/heritage" variant="secondary" size="lg">
              Our Heritage
            </CTAButton>
          </motion.div>
        </div>
      </div>

      {/* Floating Glass Stat Cards */}
      <div className="absolute bottom-16 left-0 right-0 z-20 px-6 hidden md:block">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Legacy', value: '130+ Years' },
            { label: 'Portfolio', value: '10,000+ Creations' },
            { label: 'Quality', value: 'GIA Certified' }
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 + i * 0.1, ease: 'easeOut' }}
            >
              <GlassPanel variant="default" className="p-6 flex flex-col items-center justify-center text-center">
                <span className="font-accent text-xs tracking-widest text-gold-500 mb-2 uppercase">{stat.label}</span>
                <span className="font-display text-2xl text-white">{stat.value}</span>
              </GlassPanel>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center"
      >
        <span className="font-accent text-[10px] tracking-[0.2em] text-white/50 uppercase mb-2">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5 text-gold-500" />
        </motion.div>
      </motion.div>
    </section>
  );
}
