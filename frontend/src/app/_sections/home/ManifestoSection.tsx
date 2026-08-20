'use client';

import VertigoZoom from '@/components/motion/VertigoZoom';
import TypeSlamHeading from '@/components/motion/TypeSlamHeading';
import ChromaSplit from '@/components/motion/ChromaSplit';
import EchoTrailText from '@/components/motion/EchoTrailText';
import StageSweep from '@/components/motion/StageSweep';
import SmokeVeil from '@/components/motion/SmokeVeil';
import LightLeakOverlay from '@/components/motion/LightLeakOverlay';
import CTAButton from '@/components/ui/CTAButton';

/**
 * A held breath. One shot, no controls, nothing to read carefully.
 *
 * The page up to here is dense — grading dials, a glossary, a sourcing ledger, a
 * card deck — and the commercial half below is denser still. A visitor arriving
 * at the commission having read all of it needs somewhere to stop, and a divider
 * is not somewhere to stop.
 *
 * So this section deliberately offers nothing to do. It is the only place on the
 * site where the vertigo push runs, and it runs on the whole block rather than
 * on a heading: scrolling through collapses the space around the type while the
 * type itself holds its size, which is unsettling in the way a held note is. The
 * effect resolves at both ends of the section, so a visitor who scrolls past
 * quickly never sees a distorted layout.
 *
 * The three atmospheric layers are stacked here at strengths they never reach
 * elsewhere — the sweep crossed, the smoke rising off-centre, the leaks on a
 * short interval. Everywhere else they are texture under content; here they are
 * the content.
 */
export default function ManifestoSection() {
  return (
    <section
      id="manifesto"
      className="relative overflow-hidden border-y border-hairline bg-surface-sunken py-28 md:py-40"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <StageSweep intensity={0.26} width={0.3} crossed seconds={16} />
        <SmokeVeil intensity={0.3} originX={0.26} speed={0.8} count={22} />
        <LightLeakOverlay intensity={0.42} interval={7} onClick />
        {/* Holds the centre of the frame back so the type never has to compete
            with the beam crossing behind it. */}
        <div className="absolute inset-0 bg-[radial-gradient(58%_46%_at_50%_50%,rgb(var(--canvas)/0.82),transparent_78%)]" />
      </div>

      <VertigoZoom intensity={0.85} className="relative z-10">
        <div className="mx-auto max-w-5xl px-6 text-center md:px-12">
          <ChromaSplit amount={6} saturateAt={1900}>
            <p className="mb-8 font-accent text-[10px] uppercase tracking-luxest text-accent">
              Since 1892
            </p>
          </ChromaSplit>

          <TypeSlamHeading
            lines={['We do not sell', 'objects that', 'get used up.']}
            highlightWords={['used']}
            as="h2"
            gap={0.2}
            className="font-display text-4xl leading-[1.08] text-primary sm:text-5xl md:text-7xl"
          />

          <div className="mx-auto mt-14 max-w-2xl space-y-6">
            <p className="font-sans text-base font-light leading-relaxed text-secondary md:text-lg">
              Everything that leaves this house is designed to be repaired rather than replaced, to
              be resized rather than reordered, and to be inherited rather than depreciated. That is
              a harder business and a much easier promise to keep.
            </p>

            <EchoTrailText
              text="Four generations, and not one piece we would not take back."
              as="p"
              echoes={3}
              spread={18}
              direction="right"
              persistent
              className="font-display text-2xl leading-snug text-primary md:text-3xl"
            />
          </div>

          <div className="mt-14 flex flex-wrap justify-center gap-4">
            <CTAButton variant="primary" size="lg" href="/about" showArrow>
              How we got here
            </CTAButton>
            <CTAButton variant="secondary" size="lg" href="/services">
              What we promise
            </CTAButton>
          </div>
        </div>
      </VertigoZoom>
    </section>
  );
}
