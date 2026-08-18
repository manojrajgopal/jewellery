'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Breadcrumbs from './Breadcrumbs';
import DiamondSparkles from '@/components/motion/DiamondSparkles';

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

export default function PageBanner({
  title,
  subtitle,
  backgroundImage = '/images/hero/hero-main.jpg',
  breadcrumbs,
  className = '',
  compact = false,
}: PageBannerProps) {
  return (
    <section
      className={`relative overflow-hidden ${compact ? 'pt-32 pb-16 md:pt-40 md:pb-20' : 'pt-36 pb-20 md:pt-44 md:pb-28'} ${className}`}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt=""
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/90 via-ink-950/80 to-ink-950" />
      </div>

      {/* Diamond Sparkles */}
      <DiamondSparkles density={15} className="absolute inset-0 z-[1]" />

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Breadcrumbs items={breadcrumbs} className="mb-6" />

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-cream-50 mb-4"
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg md:text-xl text-ink-400 max-w-2xl font-sans"
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      {/* Bottom Gold Line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent"
      />
    </section>
  );
}
