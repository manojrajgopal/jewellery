'use client';

import { useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Sparkles, Trash2, X } from 'lucide-react';

import { products } from '@/data/products';
import { useWishlist } from '@/hooks/useWishlist';
import { useToast } from '@/components/providers/ToastProvider';
import CTAButton from '@/components/ui/CTAButton';

interface WishlistDrawerProps {
  open: boolean;
  onClose: () => void;
}

/**
 * The saved-pieces drawer. Slides in from the right, staggers its rows in, and
 * offers the one thing a wishlist is actually for on a jeweller's site:
 * carrying the list into an appointment enquiry.
 *
 * Ids are resolved against the product catalogue on every open rather than
 * stored alongside the wishlist. A saved snapshot of name and price goes stale
 * the moment either changes, and a price that is quietly out of date is the
 * worst thing this drawer could show.
 */
export default function WishlistDrawer({ open, onClose }: WishlistDrawerProps) {
  const { ids, toggle, clear, hydrated } = useWishlist();
  const { toast } = useToast();

  const saved = useMemo(
    () =>
      ids
        .map((id) => products.find((p) => p.id === id || p.slug === id))
        .filter((p): p is (typeof products)[number] => Boolean(p)),
    [ids]
  );

  // Escape closes, and the page behind must not scroll while the drawer owns
  // the viewport.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  // Anything the drawer links to leaves the page, so it should not be left open
  // behind the incoming route.
  const enquiryHref = useMemo(() => {
    if (!saved.length) return '/contact';
    const list = saved.map((p) => p.name).join(', ');
    return `/contact?interest=${encodeURIComponent(list)}`;
  }, [saved]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Scrim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={onClose}
            className="fixed inset-0 z-[160] bg-ink-950/60 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Saved pieces"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 240, damping: 30 }}
            className="fixed inset-y-0 right-0 z-[161] flex w-[min(94vw,26rem)] flex-col border-l border-hairline bg-canvas shadow-cinema"
          >
            {/* Ambient wash so the panel does not read as a flat sheet */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gold-mesh opacity-50"
            />

            {/* Header */}
            <header className="relative flex items-center justify-between border-b border-hairline px-6 py-5">
              <div className="flex items-center gap-3">
                <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-gold-500/30 text-accent">
                  <Heart size={15} strokeWidth={1.8} />
                </span>
                <div>
                  <h2 className="font-accent text-sm uppercase tracking-luxe text-primary">
                    Saved Pieces
                  </h2>
                  <p className="font-sans text-[11px] font-light text-muted tabular-nums">
                    {hydrated ? `${saved.length} in your selection` : 'Loading…'}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                aria-label="Close saved pieces"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-muted transition-colors hover:border-gold-500/40 hover:text-accent"
              >
                <X size={17} strokeWidth={1.7} />
              </button>
            </header>

            {/* Rows */}
            <div className="relative flex-1 overflow-y-auto scrollbar-gold">
              {hydrated && saved.length === 0 && <EmptyState onClose={onClose} />}

              <ul className="divide-y divide-[rgb(var(--hairline)/var(--hairline-alpha))]">
                <AnimatePresence initial={false}>
                  {saved.map((product, i) => (
                    <motion.li
                      key={product.id}
                      layout
                      initial={{ opacity: 0, x: 32 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 48, height: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: i * 0.05,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="group relative overflow-hidden"
                    >
                      <div className="flex gap-4 px-6 py-4">
                        <Link
                          href={`/collections/${product.collection}`}
                          onClick={onClose}
                          className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-hairline"
                        >
                          <Image
                            src={product.images?.[0] ?? product.image ?? '/images/products/ring.jpg'}
                            alt={product.name}
                            fill
                            sizes="64px"
                            className="object-cover transition-transform duration-700 ease-luxury group-hover:scale-110"
                          />
                        </Link>

                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/collections/${product.collection}`}
                            onClick={onClose}
                            className="link-underline font-display text-base leading-snug text-primary transition-colors hover:text-accent"
                          >
                            {product.name}
                          </Link>
                          <p className="mt-1 font-accent text-[9px] uppercase tracking-luxe text-faint">
                            {product.category} · {product.metal.replace('-', ' ')}
                          </p>
                          <p className="mt-1.5 font-sans text-sm text-accent tabular-nums">
                            {product.formattedPrice ?? product.price}
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            toggle(product.id);
                            toast({
                              title: 'Removed',
                              message: `${product.name} is no longer saved.`,
                              kind: 'info',
                            });
                          }}
                          aria-label={`Remove ${product.name} from saved pieces`}
                          className="self-start p-1 text-faint transition-colors hover:text-burgundy-300"
                        >
                          <Trash2 size={15} strokeWidth={1.7} />
                        </button>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </div>

            {/* Footer */}
            {saved.length > 0 && (
              <motion.footer
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.45 }}
                className="relative border-t border-hairline px-6 py-5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-accent text-[10px] uppercase tracking-luxe text-muted">
                    Selection
                  </span>
                  <button
                    onClick={() => {
                      clear();
                      toast({
                        title: 'Selection cleared',
                        message: 'Your saved pieces have been emptied.',
                        kind: 'info',
                      });
                    }}
                    className="font-sans text-[11px] tracking-wide text-faint underline-offset-4 transition-colors hover:text-burgundy-300 hover:underline"
                  >
                    Clear all
                  </button>
                </div>

                {/* CTAButton wraps itself in an inline-flex shell when it is a
                    link, so it is centred here rather than stretched. */}
                <div className="flex justify-center">
                  <CTAButton
                    href={enquiryHref}
                    variant="primary"
                    size="md"
                    showArrow
                    onClick={onClose}
                  >
                    Enquire About These
                  </CTAButton>
                </div>

                <p className="mt-3 text-center font-sans text-[10px] font-light text-faint">
                  Our concierge will prepare these for your visit.
                </p>
              </motion.footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function EmptyState({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="flex h-full flex-col items-center justify-center gap-5 px-8 text-center"
    >
      <motion.span
        animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.06, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="flex h-16 w-16 items-center justify-center rounded-full border border-gold-500/25 text-accent"
      >
        <Sparkles size={22} strokeWidth={1.5} />
      </motion.span>

      <div>
        <h3 className="font-display text-xl font-light text-primary">Nothing saved yet</h3>
        <p className="mt-2 font-sans text-sm font-light leading-relaxed text-muted">
          Tap the heart on any piece and it will wait for you here.
        </p>
      </div>

      <CTAButton href="/collections" variant="secondary" size="sm" showArrow onClick={onClose}>
        Browse Collections
      </CTAButton>
    </motion.div>
  );
}
