'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import Breadcrumbs from './Breadcrumbs';
import SplitText from '@/components/motion/SplitText';
import DiamondSparkles from '@/components/motion/DiamondSparkles';
import AuroraBackground from '@/components/motion/AuroraBackground';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageBannerProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  breadcrumbs: BreadcrumbItem[];
  className?: string;
  compact?: boolean;
}

/**
 * Shared page header: parallaxed photograph, jewel-tone wash, split-character
 * title, and a gold rule that draws across the base.
 */
export default function PageBanner({
  title,
  subtitle,
  backgroundImage = '/images/hero/hero-main.jpg',
  breadcrumbs,
  className = '',
  compact = false,
}: PageBannerProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '38%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <section
      ref={ref}
      className={`relative overflow-hidden ${
        compact ? 'pb-16 pt-32 md:pb-20 md:pt-40' : 'pb-20 pt-36 md:pb-28 md:pt-44'
      } ${className}`}
    >
      {/* Backdrop — graded and veiled in the current theme, so the plate reads
          as obsidian in dark and as a luminous cream wash in light. */}
      <motion.div style={{ y: imageY, scale: imageScale }} className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt=""
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="media-veil absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-tr from-gold-900/30 to-amethyst-900/25 opacity-[var(--bloom)] mix-blend-overlay" />
      </motion.div>

      <AuroraBackground intensity="subtle" parallax={false} className="z-[1]" />
      <DiamondSparkles density={20} className="z-[2]" />

      {/* Content */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8"
      >
        <Breadcrumbs items={breadcrumbs} onMedia className="mb-7" />

        <SplitText
          text={title}
          as="h1"
          mode="chars"
          delay={0.15}
          className="mb-4 font-display text-4xl font-light leading-[1.05] text-on-media md:text-5xl lg:text-6xl"
        />

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl font-sans text-lg font-light text-on-media-soft md:text-xl"
          >
            {subtitle}
          </motion.p>
        )}
      </motion.div>

      {/* Base rule */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-500/60 to-transparent"
      />
    </section>
  );
}
