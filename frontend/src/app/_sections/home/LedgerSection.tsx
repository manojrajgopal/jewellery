'use client';

import SectionHeading from '@/components/ui/SectionHeading';
import CTAButton from '@/components/ui/CTAButton';
import ProvenanceLedger from '@/components/ui/ProvenanceLedger';
import EchoTrailText from '@/components/motion/EchoTrailText';
import MetaballGold from '@/components/motion/MetaballGold';
import LightLeakOverlay from '@/components/motion/LightLeakOverlay';

/**
 * The sourcing ledger, including the rows the house fails.
 *
 * Placed immediately after the provenance section, which makes the custody claim,
 * and before the practical tools. The order is the argument: here is where the
 * material came from, here is what that claim is actually worth as evidence, and
 * here are the two entries we cannot produce.
 *
 * The molten-gold field behind it is the only appearance of the metaball layer on
 * the home page. It reads as material rather than as light, which is right for a
 * section about where the metal came from — every other atmospheric layer on the
 * site is about illumination.
 */
export default function LedgerSection() {
  return (
    <section
      id="ledger"
      className="relative overflow-hidden border-y border-hairline bg-canvas py-24 md:py-32"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <MetaballGold count={6} intensity={0.3} step={4} />
        <LightLeakOverlay intensity={0.28} interval={13} />
        <div className="absolute inset-0 bg-gradient-to-b from-canvas via-canvas/50 to-canvas" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
        <SectionHeading
          eyebrow="The Ledger"
          title="Including the rows we fail"
          highlightWords={['fail']}
          subtitle="Every jeweller publishes an ethics page and they are all the same page, because they all list only what the house can claim. A page with no negative entries carries no information. Here is the whole ledger, weighted by what each claim is actually worth as evidence."
          align="center"
          className="mb-14"
        />

        <ProvenanceLedger />

        <div className="mt-20 grid gap-10 border-t border-line-subtle pt-16 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <EchoTrailText
            text="A claim you cannot check is a slogan."
            as="h3"
            echoes={3}
            spread={16}
            direction="left"
            persistent
            className="max-w-xl font-display text-3xl leading-[1.15] text-primary md:text-4xl"
          />

          <div className="flex flex-wrap gap-4">
            <CTAButton variant="primary" size="md" href="/craftsmanship" showArrow>
              Come and check
            </CTAButton>
            <CTAButton variant="secondary" size="md" href="/services">
              What we guarantee
            </CTAButton>
          </div>
        </div>
      </div>
    </section>
  );
}
