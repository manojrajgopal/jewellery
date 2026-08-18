'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

/**
 * Single-open accordion. The marker rotates from + to ×, and a gold rail
 * grows down the left edge of whichever panel is open.
 */
export default function FAQAccordion({
  items,
  className = '',
}: {
  items: FAQItem[];
  className?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className={`space-y-4 ${className}`}>
      {items.map((item, index) => {
        const open = openIndex === index;

        return (
          <motion.div
            key={item.question}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
            className={`relative overflow-hidden rounded-2xl border bg-surface-raised/60 backdrop-blur-sm transition-colors duration-500 ${
              open ? 'border-gold-500/35' : 'border-hairline'
            }`}
          >
            {/* Left rail */}
            <motion.span
              aria-hidden="true"
              initial={false}
              animate={{ scaleY: open ? 1 : 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-y-0 left-0 w-0.5 origin-top bg-gradient-to-b from-gold-300 to-gold-700"
            />

            <button
              onClick={() => setOpenIndex(open ? null : index)}
              aria-expanded={open}
              className="group flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span
                className={`font-display text-lg transition-colors duration-300 ${
                  open ? 'text-accent' : 'text-primary group-hover:text-accent'
                }`}
              >
                {item.question}
              </span>

              <motion.span
                animate={{ rotate: open ? 135 : 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-hairline text-accent transition-colors duration-300 group-hover:border-gold-500/45"
              >
                <Plus size={15} strokeWidth={1.8} />
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="px-6 pb-6 font-sans text-sm font-light leading-relaxed text-muted">
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
