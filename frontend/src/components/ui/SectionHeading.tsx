'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  highlightWords?: string[];
  align?: 'left' | 'center';
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  highlightWords = [],
  align = 'center',
  className = '',
}: SectionHeadingProps) {
  const alignClass = align === 'center' ? 'text-center items-center' : 'text-left items-start';

  // Helper to render title with highlights
  const renderTitle = () => {
    if (!highlightWords.length) return title;
    
    let renderedTitle: React.ReactNode[] = [title];
    
    highlightWords.forEach(word => {
      const newRendered: React.ReactNode[] = [];
      renderedTitle.forEach(part => {
        if (typeof part === 'string') {
          const split = part.split(new RegExp(`(${word})`, 'gi'));
          split.forEach((segment, i) => {
            if (segment.toLowerCase() === word.toLowerCase()) {
              newRendered.push(
                <span key={`${word}-${i}`} className="text-[#d4a843] italic font-medium">
                  {segment}
                </span>
              );
            } else if (segment) {
              newRendered.push(segment);
            }
          });
        } else {
          newRendered.push(part);
        }
      });
      renderedTitle = newRendered;
    });
    
    return renderedTitle;
  };

  return (
    <div className={`flex flex-col ${alignClass} ${className}`}>
      {eyebrow && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-4"
        >
          {align === 'center' && <span className="w-8 h-[1px] bg-[#d4a843]/40" />}
          <span className="font-cinzel text-xs sm:text-sm uppercase tracking-[0.2em] text-[#d4a843]">
            {eyebrow}
          </span>
          <span className="w-8 h-[1px] bg-[#d4a843]/40" />
        </motion.div>
      )}

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="font-cormorant text-4xl sm:text-5xl md:text-6xl text-white mb-6 leading-tight"
      >
        {renderTitle()}
      </motion.h2>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-inter text-[#c0c0c8] text-base sm:text-lg max-w-2xl leading-relaxed"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
