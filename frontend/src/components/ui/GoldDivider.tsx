'use client';

import React from 'react';
import { motion } from 'framer-motion';

type Variant = 'simple' | 'ornate' | 'wide' | 'jewel';

interface GoldDividerProps {
  variant?: Variant;
  className?: string;
}

/**
 * Section rule. The 'ornate' and 'jewel' variants centre a faceted mark that
 * scales in after the line has drawn.
 */
export default function GoldDivider({ variant = 'ornate', className = '' }: GoldDividerProps) {
  const wide = variant === 'wide';
  const jewel = variant === 'jewel';
  const showMark = variant === 'ornate' || jewel;

  return (
    <div
      className={`relative flex items-center justify-center py-4 ${
        wide ? 'w-full' : 'mx-auto w-full max-w-md'
      } ${className}`}
    >
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="h-px w-full origin-center bg-gradient-to-r from-transparent via-accent to-transparent"
      />

      {showMark && (
        <motion.div
          initial={{ scale: 0, opacity: 0, rotate: 0 }}
          whileInView={{ scale: 1, opacity: 1, rotate: 45 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, delay: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
          className="absolute flex items-center justify-center"
        >
          <span className="block h-2 w-2 bg-accent shadow-[0_0_10px_2px_rgb(var(--gold-500)/0.7)]" />
          {jewel && (
            <>
              <span className="absolute h-5 w-5 animate-scale-pulse rounded-sm border border-accent/40" />
              <span className="absolute h-8 w-8 rotate-45 border border-accent/15" />
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}
