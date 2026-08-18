'use client';

import Marquee from '@/components/motion/Marquee';
import { brandData } from '@/data/brand';

export default function TrustStrip() {
  const badges = brandData.trustBadges || [
    'Conflict-Free Diamonds',
    'Sustainable Gold',
    'Lifetime Warranty',
    'Free Secure Shipping',
    'GIA Certified'
  ];

  return (
    <section id="trust" className="py-6 bg-ink-900/50 border-y border-gold-700/20 overflow-hidden relative">
      <Marquee speed="normal" pauseOnHover className="flex items-center">
        {badges.map((badge, index) => (
          <div key={index} className="flex items-center mx-8">
            <span className="font-accent text-sm tracking-[0.15em] uppercase text-gold-500 whitespace-nowrap">
              {badge}
            </span>
            <span className="ml-16 text-gold-700/40 text-xs">◆</span>
          </div>
        ))}
      </Marquee>
    </section>
  );
}
