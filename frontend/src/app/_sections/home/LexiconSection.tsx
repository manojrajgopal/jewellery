'use client';

import SectionHeading from '@/components/ui/SectionHeading';
import CTAButton from '@/components/ui/CTAButton';
import AtelierGlossary from '@/components/ui/AtelierGlossary';
import TypeSlamHeading from '@/components/motion/TypeSlamHeading';
import GemFacetTunnel from '@/components/motion/GemFacetTunnel';
import SmokeVeil from '@/components/motion/SmokeVeil';

/**
 * The vocabulary, handed over.
 *
 * Placed straight after the stone school and the stone library, where the
 * visitor has just been given four grading dials and a dozen mineral names and
 * is at their most aware of how much of this language they do not have. Any
 * earlier and it reads as homework; any later and they have already stopped
 * asking.
 *
 * The facet tunnel behind it is the only place on the site it appears at full
 * strength. It reads as falling into a stone, which is the right feeling for a
 * section about going deeper rather than looking.
 */
export default function LexiconSection() {
  return (
    <section
      id="lexicon"
      className="relative overflow-hidden border-y border-hairline bg-canvas py-24 md:py-32"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <GemFacetTunnel rings={12} sides={8} intensity={0.4} twist={30} />
        <SmokeVeil intensity={0.22} originX={0.18} speed={0.7} count={16} />
        {/* Keeps the tunnel from competing with the type at the top and bottom
            of the section, where the headline and the CTA sit. */}
        <div className="absolute inset-0 bg-gradient-to-b from-canvas via-transparent to-canvas" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
        <SectionHeading
          eyebrow="The Lexicon"
          title="The words the counter uses"
          highlightWords={['words']}
          subtitle="A jewellery counter runs on vocabulary the customer does not have, and the gap is where the margin lives. So here is the vocabulary, with the part that is usually left unsaid printed underneath each one."
          align="center"
          className="mb-14"
        />

        <AtelierGlossary />

        <div className="mt-20 grid gap-10 border-t border-line-subtle pt-16 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <TypeSlamHeading
            lines={['Nobody should need', 'a translator', 'to buy a ring.']}
            highlightWords={['translator']}
            as="h3"
            className="font-display text-3xl leading-[1.12] text-primary md:text-5xl"
          />

          <div className="flex flex-wrap gap-4">
            <CTAButton variant="primary" size="md" href="/gemstones" showArrow>
              The stone library
            </CTAButton>
            <CTAButton variant="secondary" size="md" href="/contact">
              Ask us instead
            </CTAButton>
          </div>
        </div>
      </div>
    </section>
  );
}
