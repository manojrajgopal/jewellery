'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Eye, Heart } from 'lucide-react';
import MotionCard from '@/components/motion/MotionCard';
import RevealImage from '@/components/motion/RevealImage';
import Badge from '@/components/ui/Badge';
import { useWishlist } from '@/hooks/useWishlist';
import { useToast } from '@/components/providers/ToastProvider';
import type { Product } from '@/types';

/** Products carry an `images` array; `image` never existed on the type. */
export const productImage = (p: Product) =>
  p.images?.[0] ?? p.image ?? '/images/products/ring.jpg';

/** Prices are pre-formatted strings ('₹8,45,000') — never re-format them. */
export const productPrice = (p: Product) => p.formattedPrice ?? p.price;

interface ProductCardProps {
  product: Product;
  index?: number;
  onQuickView?: (product: Product) => void;
  priority?: boolean;
  /**
   * Presents the card as if it were hovered — actions revealed, title in gold.
   * Grids that spotlight the card nearest the viewport centre use this so the
   * affordances also reach touch visitors, who never get a hover state.
   */
  active?: boolean;
}

export default function ProductCard({
  product,
  index = 0,
  onQuickView,
  priority = false,
  active = false,
}: ProductCardProps) {
  const { has, toggle } = useWishlist();
  const { toast } = useToast();
  const saved = has(product.id);

  // Hover still works on its own; `active` only ever reveals things early.
  const revealed = active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100';

  const href = `/collections/${product.collection}`;

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nowSaved = toggle(product.id);
    toast({
      kind: nowSaved ? 'luxe' : 'info',
      title: nowSaved ? 'Saved to wishlist' : 'Removed from wishlist',
      message: product.name,
    });
  };

  return (
    <MotionCard className="group h-full" tiltAmount={6} lift={10}>
      <div className="flex h-full flex-col">
        <div className="relative mb-4 overflow-hidden rounded-xl bg-surface-raised">
          <Link href={href} className="block" aria-label={product.name}>
            <RevealImage
              src={productImage(product)}
              alt={product.name}
              aspectRatio="square"
              priority={priority}
              curtain={index < 4}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          </Link>

          {/* Status badges */}
          <div className="pointer-events-none absolute left-4 top-4 z-30 flex flex-col gap-2">
            {product.isNew && <Badge variant="new">New Arrival</Badge>}
            {product.isBestseller && <Badge variant="bestseller">Bestseller</Badge>}
            {product.inStock === false && <Badge variant="default">Made to Order</Badge>}
          </div>

          {/* Hover actions */}
          <div className="absolute right-4 top-4 z-30 flex flex-col gap-2">
            <motion.button
              onClick={handleSave}
              whileTap={{ scale: 0.85 }}
              aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name}`}
              aria-pressed={saved}
              className={`flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300 ${
                saved
                  ? 'border-gold-400/60 bg-gold-500/20 text-gold-300'
                  : `border-white/15 bg-black/40 text-white/70 hover:text-gold-300 ${revealed}`
              }`}
            >
              <Heart size={15} strokeWidth={1.8} fill={saved ? 'currentColor' : 'none'} />
            </motion.button>

            {onQuickView && (
              <motion.button
                onClick={(e) => {
                  e.preventDefault();
                  onQuickView(product);
                }}
                whileTap={{ scale: 0.85 }}
                aria-label={`Quick view ${product.name}`}
                data-cursor="View"
                className={`flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/70 backdrop-blur-md transition-all duration-300 hover:text-gold-300 ${revealed}`}
              >
                <Eye size={15} strokeWidth={1.8} />
              </motion.button>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-grow flex-col px-1">
          <span className="mb-1 font-accent text-[10px] uppercase tracking-luxe text-accent">
            {product.collection.replace(/-/g, ' ')}
          </span>

          <Link href={href}>
            <h3
              className={`mb-1 font-display text-xl transition-colors duration-300 group-hover:text-accent ${
                active ? 'text-accent' : 'text-primary'
              }`}
            >
              {product.name}
            </h3>
          </Link>

          {product.gemstone && (
            <p className="mb-2 font-sans text-xs font-light text-faint">{product.gemstone}</p>
          )}

          <div className="mt-auto flex items-center justify-between border-t border-hairline pt-4">
            <span className="font-display text-lg text-secondary">{productPrice(product)}</span>
            <Link
              href={href}
              className="flex items-center gap-1.5 font-accent text-[10px] uppercase tracking-luxe text-accent transition-colors hover:text-accent-soft"
            >
              View
              <ArrowRight
                className={`h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 ${
                  active ? 'translate-x-1' : ''
                }`}
              />
            </Link>
          </div>
        </div>
      </div>
    </MotionCard>
  );
}
