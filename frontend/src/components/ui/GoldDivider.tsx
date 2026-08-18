'use client';

import React from 'react';
import { motion } from 'framer-motion';

type Variant = 'simple' | 'ornate' | 'wide';

interface GoldDividerProps {
  variant?: Variant;
  className?: string;
}

export default function GoldDivider({ variant = 'ornate', className = '' }: GoldDividerProps) {
  const isWide = variant === 'wide';
  const showDiamond = variant === 'ornate';

  return (
    <div className={`relative flex items-center justify-center py-4 ${isWide ? 'w-full' : 'w-full max-w-md mx-auto'} ${className}`}>
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#d4a843] to-transparent origin-center"
      />
      {showDiamond && (
        <motion.div
          initial={{ scale: 0, opacity: 0, rotate: 45 }}
          whileInView={{ scale: 1, opacity: 1, rotate: 45 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.5, ease: "backOut" }}
          className="absolute w-2 h-2 bg-[#d4a843] shadow-[0_0_8px_rgba(212,168,67,0.8)]"
        />
      )}
    </div>
  );
}
