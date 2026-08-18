'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import MotionCard from '@/components/motion/MotionCard';
import RevealImage from '@/components/motion/RevealImage';
import Badge from '@/components/ui/Badge';
import GradientOrb from '@/components/ui/GradientOrb';
import { products } from '@/data/products';

const CATEGORIES = ['All', 'Necklaces', 'Rings', 'Bracelets', 'Earrings'];

export default function SignaturePieces() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProducts = products.filter(product => 
    activeCategory === 'All' ? true : product.category === activeCategory
  ).slice(0, 8); // show up to 8

  return (
    <section id="pieces" className="py-24 bg-ink-950 relative overflow-hidden">
      <GradientOrb color="gold-700" size="xl" position="right" blur="3xl" className="opacity-10" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <SectionHeading
          eyebrow="THE VAULT"
          title="Signature Pieces"
          highlightWords={['Signature']}
          subtitle="Handpicked masterworks representing the pinnacle of our artisanal heritage."
          align="center"
          className="mb-12"
        />

        {/* Category Tabs */}
        <div className="flex justify-start md:justify-center overflow-x-auto pb-4 mb-12 scrollbar-hide space-x-2 md:space-x-4">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`relative px-6 py-2 rounded-full font-accent text-sm tracking-widest uppercase whitespace-nowrap transition-colors duration-300 ${
                activeCategory === category ? 'text-ink-950' : 'text-white/60 hover:text-white'
              }`}
            >
              {activeCategory === category && (
                <motion.div
                  layoutId="product-tab"
                  className="absolute inset-0 bg-gold-500 rounded-full"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{category}</span>
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
              >
                <MotionCard className="group h-full flex flex-col">
                  <Link href={`/products/${product.id}`} className="block relative aspect-square rounded-xl overflow-hidden mb-4 bg-ink-900/50">
                    <RevealImage
                      src={product.image || '/images/products/ring.jpg'}
                      alt={product.name}
                      aspectRatio="square"
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                      {product.isNew && <Badge variant="gold" className="text-[10px]">New Arrival</Badge>}
                      {product.isBestseller && <Badge variant="default" className="text-[10px]">Bestseller</Badge>}
                    </div>
                  </Link>
                  
                  <div className="flex flex-col flex-grow">
                    <span className="font-accent text-xs tracking-widest text-gold-500 uppercase mb-1">
                      {product.collection}
                    </span>
                    <Link href={`/products/${product.id}`}>
                      <h3 className="font-display text-xl text-white group-hover:text-gold-300 transition-colors mb-2">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="mt-auto flex items-center justify-between pt-4">
                      <span className="font-body text-white/80 font-medium">
                        ${product.price?.toLocaleString()}
                      </span>
                      <Link 
                        href={`/products/${product.id}`}
                        className="flex items-center gap-2 text-sm font-accent tracking-widest uppercase text-gold-500 group-hover:text-gold-300 transition-colors"
                      >
                        View <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </MotionCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
