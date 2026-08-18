'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ChevronDown, Diamond } from 'lucide-react';
import SplitText from '@/components/motion/SplitText';
import DiamondSparkles from '@/components/motion/DiamondSparkles';
import AuroraBackground from '@/components/motion/AuroraBackground';
import CountUp from '@/components/motion/CountUp';
import CTAButton from '@/components/ui/CTAButton';
import GlassPanel from '@/components/ui/GlassPanel';

const STATS = [
  { label: 'Legacy', value: 130, suffix: '+ Years' },
  { label: 'Portfolio', value: 10000, suffix: '+ Creations' },
  { label: 'Assurance', value: 100, suffix: '% GIA Certified' },
];

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 28 });

  // Foreground text, backdrop and vignette all move at different rates,
  // so the hero gains depth as it leaves.
  const bgY = useTransform(smooth, [0, 1], ['0%', '24%']);
  const bgScale = useTransform(smooth, [0, 1], [1, 1.18]);
  const contentY = useTransform(smooth, [0, 1], ['0%', '-32%']);
  const contentOpacity = useTransform(smooth, [0, 0.65], [1, 0]);
  const statsY = useTransform(smooth, [0, 1], ['0%', '-70%']);
  const veil = useTransform(smooth, [0, 1], [0.45, 0.9]);

  return (
    <section
      ref={ref}
      id="hero"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-ink-950"
    >
      {/* Backdrop */}
      <motion.div style={{ y: bgY, scale: bgScale }} className="absolute inset-0 z-0">
        <Image
          src="/images/hero/hero-main.jpg"
          alt=""
          fill
          className="animate-ken-burns object-cover"
          priority
          quality={90}
          sizes="100vw"
        />
        <motion.div
          style={{ opacity: veil }}
          className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/35 to-black/90"
        />
        {/* Warm colour grade over the photograph */}
        <div className="absolute inset-0 bg-gradient-to-tr from-gold-900/25 via-transparent to-amethyst-900/25 mix-blend-overlay" />
      </motion.div>

      <AuroraBackground intensity="medium" parallax={false} className="z-[1]" />
      <DiamondSparkles density={46} shape="mixed" className="z-[2]" />

      {/* Corner rules */}
      {(
        [
          'left-6 top-24 border-l border-t',
          'right-6 top-24 border-r border-t',
          'bottom-6 left-6 border-b border-l',
          'bottom-6 right-6 border-b border-r',
        ] as const
      ).map((pos, i) => (
        <motion.span
          key={pos}
          aria-hidden="true"
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 0.4, scale: 1 }}
          transition={{ duration: 1.1, delay: 1.4 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
          className={`absolute z-10 hidden h-12 w-12 border-gold-400/60 md:block ${pos}`}
        />
      ))}

      {/* Content */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-20 mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col justify-center px-6 pb-40 pt-28 md:px-12"
      >
        <div className="max-w-4xl text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mb-7 flex items-center justify-center gap-3 md:justify-start"
          >
            <motion.span
              animate={{ rotate: [0, 180, 360] }}
              transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
            >
              <Diamond className="h-4 w-4 text-gold-400" strokeWidth={1.5} />
            </motion.span>
            <span className="font-accent text-xs uppercase tracking-luxest text-gold-300">
              Since 1892
            </span>
            <span className="hidden h-px w-16 bg-gradient-to-r from-gold-400/70 to-transparent md:block" />
          </motion.div>

          <SplitText
            text="Timeless Elegance, Crafted in Gold"
            as="h1"
            mode="chars"
            highlightWords={['Gold']}
            delay={0.25}
            className="mb-8 font-display text-5xl font-light leading-[0.98] text-white md:text-7xl lg:text-8xl"
          />

          <motion.p
            initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mb-11 max-w-2xl font-sans text-lg font-light leading-relaxed text-cream-100/85 md:mx-0 md:text-xl"
          >
            Four generations of master artisans dedicating their lives to transforming the
            world&apos;s most precious materials into enduring legacies.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-5 sm:flex-row md:justify-start"
          >
            <CTAButton href="/collections" variant="primary" size="lg" showArrow>
              Explore Collections
            </CTAButton>
            <CTAButton href="/about" variant="outline-light" size="lg">
              Our Heritage
            </CTAButton>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating stat cards */}
      <motion.div
        style={{ y: statsY }}
        className="absolute inset-x-0 bottom-16 z-20 hidden px-6 md:block"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-3">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{
                duration: 0.9,
                delay: 1.5 + i * 0.14,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <GlassPanel
                variant="default"
                interactive
                className="flex flex-col items-center justify-center p-6 text-center"
              >
                <span className="mb-2 font-accent text-[10px] uppercase tracking-luxer text-gold-400">
                  {stat.label}
                </span>
                <span className="font-display text-2xl text-white">
                  <CountUp end={stat.value} duration={2.2} suffix={stat.suffix} />
                </span>
              </GlassPanel>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.a
        href="#trust"
        aria-label="Scroll to next section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        style={{ opacity: contentOpacity }}
        className="group absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="font-accent text-[9px] uppercase tracking-luxer text-white/50 transition-colors group-hover:text-gold-300">
          Scroll
        </span>
        <span className="relative flex h-10 w-px overflow-hidden bg-white/20">
          <motion.span
            animate={{ y: ['-100%', '100%'] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-x-0 h-1/2 bg-gradient-to-b from-transparent via-gold-300 to-transparent"
          />
        </span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="h-4 w-4 text-gold-400" />
        </motion.span>
      </motion.a>
    </section>
  );
}
