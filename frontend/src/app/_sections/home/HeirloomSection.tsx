'use client';

import SectionHeading from '@/components/ui/SectionHeading';
import CTAButton from '@/components/ui/CTAButton';
import HeirloomRedesign from '@/components/ui/HeirloomRedesign';
import WaxSealReveal from '@/components/motion/WaxSealReveal';

/**
 * What to do with something you did not choose.
 *
 * Sits directly after provenance and the ledger, which is the right neighbour
 * for it: those two sections are about where a piece came from and what the house
 * can prove about it, and this is the same question asked from the other end —
 * somebody is holding an object with a history nobody recorded, and has to decide
 * what happens to it next.
 *
 * The seal is not decoration here. Four of the five routes below are
 * irreversible, and the section is deliberately behind a gesture the visitor has
 * to make themselves rather than one the scroll makes for them. Breaking a seal
 * to read about breaking something up is the whole argument of the page,
 * compressed into one click.
 */
export default function HeirloomSection() {
  return (
    <section id="heirloom" className="relative overflow-hidden bg-canvas-alt py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading
          eyebrow="Inherited"
          title="Four of these five cannot be undone"
          highlightWords={['cannot']}
          subtitle="A ring arrives from a grandmother, unwearable as it is, and five things can be done with it. Only one of them leaves the object intact, and nobody is told which four do not — so here they are, ordered by how much of the original survives rather than by what we would rather sell."
        />

        <div className="mt-14">
          <WaxSealReveal
            monogram="A"
            invitation="The five routes, sealed"
            action="Break the seal to read them"
          >
            <div className="pt-6">
              <HeirloomRedesign />

              <div className="mt-14 grid gap-8 rounded-2xl border border-hairline bg-surface-raised/40 p-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-8">
                <p className="font-display text-xl italic leading-snug text-primary md:text-2xl">
                  Bring it in unaltered. Everything on this list is still possible then, and only
                  then.
                </p>
                <div className="flex flex-wrap gap-4">
                  <CTAButton variant="secondary" href="/services" size="sm" showArrow>
                    The restoration bench
                  </CTAButton>
                  <CTAButton variant="ghost" href="/contact" size="sm">
                    Bring it to us
                  </CTAButton>
                </div>
              </div>
            </div>
          </WaxSealReveal>
        </div>
      </div>
    </section>
  );
}
