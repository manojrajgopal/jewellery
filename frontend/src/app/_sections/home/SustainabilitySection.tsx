'use client';

import SectionHeading from '@/components/ui/SectionHeading';
import CTAButton from '@/components/ui/CTAButton';
import SustainabilityLedger from '@/components/ui/SustainabilityLedger';
import StitchPathReveal from '@/components/motion/StitchPathReveal';
import ScrollBlurFocus from '@/components/motion/ScrollBlurFocus';

/**
 * The environmental ledger.
 *
 * Placed immediately after the provenance ledger, on purpose: that section audits
 * what the house can prove about where its materials came from, and this one
 * audits what it can measure about the cost of getting them here. The two are the
 * same discipline applied to two different questions, and separating them across
 * the page would let each borrow credibility from the other without earning it.
 *
 * The passage above the ledger uses the exclusive focus treatment rather than the
 * cumulative one, because these four lines are an argument in sequence and the
 * reader should be in exactly one of them at a time. The last line is the point of
 * the section and it is the only one left in focus at the end.
 */
export default function SustainabilitySection() {
  return (
    <section id="sustainability" className="relative overflow-hidden bg-canvas py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="What We Can Measure"
          title="Two of these eight are answers we do not have"
          highlightWords={['not']}
          subtitle="Sorted by confidence rather than by flattery, so the lines this house cannot answer sit in the same typeface as the ones it is pleased with. Every entry carries what it does not cover, including the good ones."
        />

        <div className="mt-16 grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:items-start">
          <div className="space-y-14">
            <ScrollBlurFocus
              lines={[
                'Recycled gold is not carbon-free gold.',
                'It is mining that has already happened.',
                'The honest claim is that we did not cause more of it.',
                'Anything beyond that is a sentence we have not earned.',
              ]}
              depth={0.85}
            />

            <SustainabilityLedger />
          </div>

          {/* The house's mark, stitched. A motif being worked by hand is the
              right neighbour for a page about what is actually done rather than
              what is claimed. */}
          <div className="lg:sticky lg:top-28">
            <div className="rounded-2xl border border-hairline bg-surface-raised/35 p-8">
              <StitchPathReveal motif="monogram" pitch={6} duration={3.2}>
                <p className="mt-4 font-accent text-[10px] uppercase tracking-luxe text-accent">
                  Worked by hand, recorded by hand
                </p>
                <p className="mt-2 font-sans text-xs font-light leading-relaxed text-secondary">
                  The refinery invoices behind the first two lines of the ledger are kept as paper
                  in a drawer at the Bandra bench and can be read by anybody who asks to see them.
                  There is no dashboard behind this section.
                </p>
              </StitchPathReveal>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <CTAButton variant="secondary" href="#provenance" size="sm" showArrow>
                The provenance ledger
              </CTAButton>
              <CTAButton variant="ghost" href="/contact" size="sm">
                Ask to see the invoices
              </CTAButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
