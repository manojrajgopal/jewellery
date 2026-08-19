'use client';

import SectionHeading from '@/components/ui/SectionHeading';
import BoutiqueLocator from '@/components/ui/BoutiqueLocator';
import GodRays from '@/components/motion/GodRays';
import Marquee from '@/components/motion/Marquee';

const CITIES = [
  'Mumbai · 1892',
  'Jaipur · 1906',
  'New Delhi · 1948',
  'Chennai · 1971',
  'Hyderabad · 1994',
  'Bengaluru · 2009',
];

/**
 * Where the houses are. Sits just before the appointment form, so that
 * "book a visit" has somewhere concrete to point at.
 */
export default function BoutiqueSection() {
  return (
    <section
      id="boutiques"
      className="relative overflow-hidden bg-canvas py-28 md:py-36"
    >
      <GodRays intensity="soft" originX={16} originY={-8} />

      <div className="relative mx-auto max-w-7xl px-6 md:px-12">
        <SectionHeading
          eyebrow="The Houses"
          title="Six benches, one hand at each"
          highlightWords={['one']}
          subtitle="We have never franchised, and we have never opened a counter inside somebody else's shop. Every boutique below has a working goldsmith on the premises."
          className="mb-16"
        />

        <BoutiqueLocator className="mb-20" />
      </div>

      {/* Ticker of the cities and the year each opened */}
      <div className="border-y border-hairline py-5">
        <Marquee speed="slow" pauseOnHover>
          {CITIES.map((c) => (
            <span
              key={c}
              className="mx-8 font-accent text-xs uppercase tracking-luxer text-faint"
            >
              {c}
              <span className="ml-8 inline-block h-1 w-1 rotate-45 bg-accent align-middle" />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
