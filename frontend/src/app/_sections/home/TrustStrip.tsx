'use client';

import Marquee from '@/components/motion/Marquee';
import { brandData } from '@/data/brand';

const FALLBACK = [
  'Conflict-Free Diamonds',
  'Sustainable Gold',
  'Lifetime Warranty',
  'Free Secure Shipping',
  'GIA Certified',
];

/**
 * A thin accolade ticker between the hero and the rest of the page.
 *
 * This used to run on `ScrollVelocityRow`, which drives the strip from a
 * per-frame `useAnimationFrame` loop plus a scroll-velocity spring — a constant
 * main-thread cost that, right under the hero, made the top of the page feel
 * heavy. It now uses the plain CSS `Marquee` (a GPU-composited keyframe
 * translate, no JavaScript per frame), which is exactly how the reference build
 * keeps its equivalent strip smooth. The former shimmer wash — a continuously
 * repainting animated background — was removed for the same reason.
 */
export default function TrustStrip() {
  const badges = brandData.trustBadges?.length ? brandData.trustBadges : FALLBACK;

  return (
    <section
      id="trust"
      className="relative overflow-hidden border-y border-gold-700/25 bg-surface-raised/60 py-7"
    >
      <Marquee speed="slow" pauseOnHover>
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
      </Marquee>
    </section>
  );
}
