'use client';

import ScrollVelocityRow from '@/components/motion/ScrollVelocityRow';
import { brandData } from '@/data/brand';

const FALLBACK = [
  'Conflict-Free Diamonds',
  'Sustainable Gold',
  'Lifetime Warranty',
  'Free Secure Shipping',
  'GIA Certified',
];

export default function TrustStrip() {
  const badges = brandData.trustBadges?.length ? brandData.trustBadges : FALLBACK;

  return (
    <section
      id="trust"
      className="relative overflow-hidden border-y border-gold-700/25 bg-surface-raised/60 py-7"
    >
      {/* Faint metallic wash behind the ticker */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gold-sheen bg-size-200 opacity-25 animate-shimmer"
      />

      <ScrollVelocityRow baseVelocity={2.2} skew>
        {badges.map((badge, i) => (
          <span key={`${badge}-${i}`} className="flex items-center whitespace-nowrap">
            <span className="px-8 font-accent text-sm uppercase tracking-luxe text-accent">
              {badge}
            </span>
            <span
              aria-hidden="true"
              className="block h-1.5 w-1.5 rotate-45 bg-gold-600/50"
            />
          </span>
        ))}
      </ScrollVelocityRow>
    </section>
  );
}
