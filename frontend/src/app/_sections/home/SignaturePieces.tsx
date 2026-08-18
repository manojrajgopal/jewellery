'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';
import ProductCard from '@/components/ui/ProductCard';
import QuickViewModal from '@/components/ui/QuickViewModal';
import CTAButton from '@/components/ui/CTAButton';
import GradientOrb from '@/components/ui/GradientOrb';
import { products } from '@/data/products';
import type { Product } from '@/types';

/**
 * Values match Product['category'] exactly; the labels are what the tabs show.
 * The previous version compared 'Necklaces' against 'necklaces', so every
 * filter except "All" came back empty.
 */
const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'necklaces', label: 'Necklaces' },
  { value: 'rings', label: 'Rings' },
  { value: 'bracelets', label: 'Bracelets' },
  { value: 'earrings', label: 'Earrings' },
  { value: 'sets', label: 'Sets' },
] as const;

export default function SignaturePieces() {
  const [active, setActive] = useState<string>('all');
  const [quickView, setQuickView] = useState<Product | null>(null);

  const filtered = useMemo(
    () =>
      products
        .filter((p) => (active === 'all' ? true : p.category === active))
        .slice(0, 8),
    [active]
  );

  // Only offer a tab if something is actually behind it.
  const availableCategories = useMemo(
    () =>
      CATEGORIES.filter(
        (c) => c.value === 'all' || products.some((p) => p.category === c.value)
      ),
    []
  );

  return (
    <section id="pieces" className="relative overflow-hidden bg-canvas py-24 md:py-32">
      <GradientOrb color="gold" size="xl" position="right" blur="3xl" intensity={0.14} />
      <GradientOrb color="amethyst" size="lg" position="bottom-left" blur="3xl" intensity={0.1} />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="The Vault"
          title="Signature Pieces"
          highlightWords={['Signature']}
          subtitle="Handpicked masterworks representing the pinnacle of our artisanal heritage."
          align="center"
          className="mb-12"
        />

        {/* Filter rail with a shared sliding pill */}
        <div className="scrollbar-hide mb-14 flex justify-start gap-2 overflow-x-auto pb-3 md:justify-center md:gap-3">
          {availableCategories.map((category) => {
            const isActive = active === category.value;
            return (
              <button
                key={category.value}
                onClick={() => setActive(category.value)}
                aria-pressed={isActive}
                className={`relative whitespace-nowrap rounded-full px-6 py-2.5 font-accent text-[11px] uppercase tracking-luxe transition-colors duration-300 ${
                  isActive ? 'text-onaccent' : 'text-muted hover:text-primary'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="signature-tab"
                    transition={{ type: 'spring', bounce: 0.18, duration: 0.6 }}
                    className="absolute inset-0 rounded-full bg-accent shadow-gold"
                  />
                )}
                <span className="relative z-10">{category.label}</span>
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((product, idx) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.92, y: 28, filter: 'blur(6px)' }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.92, y: 20, filter: 'blur(6px)' }}
                transition={{ duration: 0.5, delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProductCard product={product} index={idx} onQuickView={setQuickView} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <p className="py-16 text-center font-sans text-sm text-muted">
            No pieces in this category yet — the atelier is at work.
          </p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-16 flex justify-center"
        >
          <CTAButton variant="secondary" size="lg" href="/collections" showArrow>
            View The Full Portfolio
          </CTAButton>
        </motion.div>
      </div>

      <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />
    </section>
  );
}
