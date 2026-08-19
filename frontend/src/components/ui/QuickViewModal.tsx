'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Heart, ArrowRight, Gem, ShieldCheck, Truck } from 'lucide-react';
import RevealImage from '@/components/motion/RevealImage';
import Badge from '@/components/ui/Badge';
import CTAButton from '@/components/ui/CTAButton';
import { productImage, productPrice } from '@/components/ui/ProductCard';
import { useWishlist } from '@/hooks/useWishlist';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { useToast } from '@/components/providers/ToastProvider';
import type { Product } from '@/types';

const ASSURANCES = [
  { icon: ShieldCheck, label: 'BIS Hallmarked & GIA Certified' },
  { icon: Gem, label: 'Conflict-free stones, ethically sourced' },
  { icon: Truck, label: 'Insured delivery, 30-day returns' },
];

/**
 * Peek at a piece without leaving the grid. Escape closes, the backdrop
 * closes, and the panel springs in from below.
 */
export default function QuickViewModal({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const { has, toggle } = useWishlist();
  const { record } = useRecentlyViewed();
  const { toast } = useToast();

  // Opening the quick view is the strongest signal of interest the grid
  // produces, so it — rather than a hover or a scroll-past — is what counts
  // as having viewed a piece.
  useEffect(() => {
    if (product) record(product.id);
  }, [product, record]);

  useEffect(() => {
    if (!product) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [product, onClose]);

  const saved = product ? has(product.id) : false;

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 z-[140] flex items-center justify-center px-4 py-10"
        >
          <div className="absolute inset-0 bg-canvas/85 backdrop-blur-2xl" />

          <motion.div
            initial={{ opacity: 0, y: 48, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 32, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={product.name}
            className="glass-strong relative z-10 grid max-h-[86vh] w-full max-w-4xl grid-cols-1 overflow-y-auto md:grid-cols-2"
          >
            <button
              onClick={onClose}
              aria-label="Close quick view"
              className="absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-hairline bg-canvas/60 text-primary backdrop-blur-md transition-colors hover:border-gold-500/40 hover:text-accent"
            >
              <X size={18} />
            </button>

            {/* Imagery */}
            <div className="relative">
              <RevealImage
                src={productImage(product)}
                alt={product.name}
                aspectRatio="4/5"
                curtain={false}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute left-4 top-4 z-30 flex flex-col gap-2">
                {product.isNew && <Badge variant="new">New Arrival</Badge>}
                {product.isBestseller && <Badge variant="bestseller">Bestseller</Badge>}
              </div>
            </div>

            {/* Details */}
            <div className="flex flex-col justify-center p-8 md:p-10">
              <span className="mb-3 font-accent text-[10px] uppercase tracking-luxer text-accent">
                {product.collection.replace(/-/g, ' ')} · {product.category}
              </span>

              <h3 className="mb-4 font-display text-3xl leading-tight text-primary md:text-4xl">
                {product.name}
              </h3>

              <p className="mb-6 font-sans text-sm font-light leading-relaxed text-muted">
                {product.description}
              </p>

              <div className="mb-6 flex flex-wrap gap-2">
                {product.metal && <Badge variant="outline">{product.metal.replace('-', ' ')}</Badge>}
                {product.karat && <Badge variant="outline">{product.karat}</Badge>}
                {product.gemstone && <Badge variant="jade">{product.gemstone}</Badge>}
              </div>

              <div className="mb-7 border-y border-hairline py-4">
                <span className="font-accent text-[10px] uppercase tracking-luxe text-faint">
                  Price on enquiry
                </span>
                <p className="mt-1 font-display text-3xl text-accent">{productPrice(product)}</p>
              </div>

              <ul className="mb-8 space-y-2.5">
                {ASSURANCES.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-3 font-sans text-xs text-muted">
                    <Icon size={15} className="flex-shrink-0 text-accent" strokeWidth={1.6} />
                    {label}
                  </li>
                ))}
              </ul>

              <div className="flex flex-col gap-3 sm:flex-row">
                <CTAButton
                  variant="primary"
                  size="md"
                  href="/contact"
                  showArrow
                  className="flex-1 justify-center"
                >
                  Enquire
                </CTAButton>

                <button
                  onClick={() => {
                    const nowSaved = toggle(product.id);
                    toast({
                      kind: nowSaved ? 'luxe' : 'info',
                      title: nowSaved ? 'Saved to wishlist' : 'Removed from wishlist',
                      message: product.name,
                    });
                  }}
                  aria-pressed={saved}
                  className={`flex items-center justify-center gap-2 rounded-full border px-6 py-3 font-accent text-sm uppercase tracking-luxe transition-all duration-300 ${
                    saved
                      ? 'border-gold-400/60 bg-gold-500/15 text-accent'
                      : 'border-hairline text-muted hover:border-gold-500/40 hover:text-accent'
                  }`}
                >
                  <Heart size={15} fill={saved ? 'currentColor' : 'none'} strokeWidth={1.8} />
                  {saved ? 'Saved' : 'Save'}
                </button>
              </div>

              <Link
                href={`/collections/${product.collection}`}
                className="mt-5 inline-flex items-center gap-1.5 font-accent text-[10px] uppercase tracking-luxe text-faint transition-colors hover:text-accent"
              >
                View full collection <ArrowRight size={12} />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
