'use client';

import SectionHeading from '@/components/ui/SectionHeading';
import CTAButton from '@/components/ui/CTAButton';
import BlueprintDimensioning from '@/components/motion/BlueprintDimensioning';
import CaliperMeasure from '@/components/motion/CaliperMeasure';

/**
 * The drawing, before any of it is metal.
 *
 * Placed at the head of the atelier run, immediately after the bench has been
 * introduced by name, because this is what actually happens first and the page
 * has never said so. Every other section in this run shows material being
 * changed — heated, rolled, drawn, struck, set. All of that is downstream of
 * somebody at a board deciding six numbers, and those six numbers, rather than
 * any of the craft that follows, are what decide whether a ring is still
 * wearable in 2060.
 *
 * The two halves are deliberately different in kind. The drawing dimensions
 * itself, which is a document. The calipers underneath are three separate
 * measurements taken off finished work, which is a check. A drawing office and
 * a bench disagree constantly and both of them are always right, and putting
 * the two side by side is the only way to say that without a paragraph.
 *
 * The three calipered figures are chosen because each one is under a
 * millimetre and each one decides something a customer would care enormously
 * about if anybody had ever told them it existed.
 */
export default function BlueprintSection() {
  return (
    <section
      id="blueprint"
      className="relative overflow-hidden border-y border-hairline bg-canvas py-24 md:py-32"
    >
      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
        <SectionHeading
          eyebrow="Before the metal"
          title="Six numbers decide a ring, and you are quoted one of them"
          highlightWords={['numbers']}
          subtitle="A commission does not begin at a bench. It begins at a board, where somebody sets a section height and an inner radius and an edge break — and settles, in an afternoon, whether the thing wears out in eight years or in fifty."
          align="left"
          className="mb-14"
        />

        <BlueprintDimensioning />

        {/* Three measurements off finished work. Small numbers, large
            consequences, and none of them ever appears on a price tag. */}
        <div className="mt-20 border-t border-line-subtle pt-16">
          <p className="mb-10 max-w-2xl font-display text-2xl italic leading-snug text-primary md:text-3xl">
            Everything a bench argues about is under a millimetre.
          </p>

          <div className="grid gap-8 lg:grid-cols-3">
            <CaliperMeasure
              label="Claw tip"
              mm={0.82}
              span={0.16}
              tolerance={0.03}
              note="Any thinner and it will not survive being knocked; any thicker and it sits over the stone like a thumb. Three hundredths of a millimetre either side of this is the whole difference between a setting that disappears and one you keep noticing."
            />
            <CaliperMeasure
              label="Bezel wall"
              mm={0.5}
              span={0.11}
              tolerance={0.04}
              note="Half a millimetre of gold holding a stone in, burnished over by hand. It is the most secure setting there is and it is made of less metal than a claw setting, which surprises everybody who is told it."
            />
            <CaliperMeasure
              label="Shank at the base"
              mm={1.6}
              span={0.34}
              tolerance={0.05}
              note="The bottom of the ring, where it rests against the palm and wears fastest. A fifth of a millimetre taken off here to hit a price is invisible on the day and it is the reason a band wears through in a decade instead of a lifetime."
            />
          </div>
        </div>

        <div className="mt-16 grid gap-8 rounded-2xl border border-hairline bg-surface-raised/40 p-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-8">
          <p className="font-display text-xl italic leading-snug text-primary md:text-2xl">
            Ask any jeweller for the section height of the band they are selling
            you. The answer, or the pause before it, tells you most of what you
            need to know.
          </p>
          <div className="flex flex-wrap gap-4">
            <CTAButton variant="secondary" href="/bespoke" size="sm" showArrow>
              Draw one with us
            </CTAButton>
            <CTAButton variant="ghost" href="/craftsmanship" size="sm">
              The workshop
            </CTAButton>
          </div>
        </div>
      </div>
    </section>
  );
}
