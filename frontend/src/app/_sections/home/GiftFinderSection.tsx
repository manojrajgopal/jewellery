'use client';

import SectionHeading from '@/components/ui/SectionHeading';
import GiftFinder from '@/components/ui/GiftFinder';
import ParticleField from '@/components/motion/ParticleField';
import GradientOrb from '@/components/ui/GradientOrb';
import ScrollZoomFrame from '@/components/motion/ScrollZoomFrame';

/**
 * The concierge quiz. Sits between the patrons' testimonials and the services
 * list, where a visitor who has been convinced by other people's stories is
 * looking for a way in to their own.
 */
export default function GiftFinderSection() {
  return (
    <section
      id="gift-finder"
      className="relative overflow-hidden bg-canvas-alt py-28 md:py-36"
    >
      <div className="pointer-events-none absolute inset-0">
        <ParticleField count={38} rise />
        <GradientOrb color="gold" size="lg" position="left" />
        <GradientOrb color="amethyst" size="md" position="bottom-right" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 md:px-12">
        <SectionHeading
          eyebrow="The Concierge"
          title="Four questions, three answers"
          highlightWords={['three']}
          subtitle="Tell us about the person rather than the present. The catalogue is scored against what you say, and every suggestion comes with its reason attached."
          className="mb-16"
        />

        <ScrollZoomFrame inset={6} from={1.06} radius={44}>
          <div className="plate-metal rounded-4xl p-7 sm:p-10 md:p-14">
            <GiftFinder />
          </div>
        </ScrollZoomFrame>
      </div>
    </section>
  );
}
