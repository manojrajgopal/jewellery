'use client';

import SectionHeading from '@/components/ui/SectionHeading';
import SilhouetteAdvisor from '@/components/ui/SilhouetteAdvisor';
import GoldRibbonWeave from '@/components/motion/GoldRibbonWeave';
import RippleGrid from '@/components/motion/RippleGrid';

/**
 * What to wear it with.
 *
 * Placed after the gift finder and before the services block, which is where a
 * visitor stops asking "which piece" and starts asking "will it work" — the two
 * questions need different tools and the site only had one of them.
 *
 * Deliberately not another filter over the catalogue. The gift finder scores pieces
 * against an occasion; this scores the *wearer's* three constraints against the
 * pieces, and answers with a length in inches and an earring outline. Where the
 * honest answer is to wear nothing at the throat, it says so.
 */
export default function StylingSection() {
  return (
    <section id="styling" className="relative overflow-hidden bg-canvas py-24 md:py-32">
      <RippleGrid spacing={46} reach={160} push={10} />

      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Worn, Not Displayed"
          title="Three questions the catalogue cannot answer"
          highlightWords={['cannot']}
          subtitle="Every piece here is photographed alone on a plinth, and nobody wears jewellery alone on a plinth. Tell it what you are wearing and where you are going."
        />

        <SilhouetteAdvisor className="mt-16" />

        <GoldRibbonWeave className="mt-20" height={90} ribbons={3} />
      </div>
    </section>
  );
}
