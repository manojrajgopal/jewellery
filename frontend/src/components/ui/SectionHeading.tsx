'use client';

import React from 'react';
import { motion } from 'framer-motion';
import SplitText from '@/components/motion/SplitText';
import ScrambleText from '@/components/motion/ScrambleText';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  highlightWords?: string[];
  align?: 'left' | 'center';
  className?: string;
  /** Decorative facet mark above the eyebrow. */
  ornament?: boolean;
}

/**
 * The shared section opener: scrambling eyebrow, split-character headline with
 * gold italic emphasis, an expanding rule, then the supporting line.
 */
export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  highlightWords = [],
  align = 'center',
  className = '',
  ornament = true,
}: SectionHeadingProps) {
  const centered = align === 'center';

  return (
    <div
      className={`flex flex-col ${
        centered ? 'items-center text-center' : 'items-start text-left'
      } ${className}`}
    >
      {ornament && (
        <motion.span
          initial={{ opacity: 0, rotate: 0, scale: 0.4 }}
          whileInView={{ opacity: 1, rotate: 45, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
          aria-hidden="true"
          className="mb-5 block h-2 w-2 bg-accent shadow-[0_0_12px_2px_rgb(var(--gold-500)/0.5)]"
        />
      )}

      {eyebrow && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-4 flex items-center gap-4"
        >
          {centered && (
            <motion.span
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="block h-px w-8 origin-right bg-accent/50"
            />
          )}
          <ScrambleText
            text={eyebrow}
            className="font-accent text-[11px] uppercase tracking-luxer text-accent sm:text-xs"
          />
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="block h-px w-8 origin-left bg-accent/50"
          />
        </motion.div>
      )}

      <SplitText
        text={title}
        as="h2"
        mode="chars"
        highlightWords={highlightWords}
        delay={0.1}
        className="mb-6 font-display text-4xl leading-[1.08] text-primary sm:text-5xl md:text-6xl"
      />

      <motion.span
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
        className={`mb-6 block h-px w-24 bg-gradient-to-r from-transparent via-accent to-transparent ${
          centered ? 'origin-center' : 'origin-left'
        }`}
      />

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="max-w-2xl font-sans text-base font-light leading-relaxed text-muted sm:text-lg"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
