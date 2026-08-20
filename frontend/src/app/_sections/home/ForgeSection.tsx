'use client';

import SectionHeading from '@/components/ui/SectionHeading';
import CTAButton from '@/components/ui/CTAButton';
import AnnealGlowText from '@/components/motion/AnnealGlowText';
import RollingMillPass from '@/components/motion/RollingMillPass';
import WireDrawBench from '@/components/motion/WireDrawBench';
import HeatShimmer from '@/components/motion/HeatShimmer';

/**
 * Metal, before it is a thing.
 *
 * The middle of the atelier run and the loudest part of it. Every craft section
 * this site has run so far shows a finished object being refined — a stone set,
 * a seam soldered, a surface polished. None of them shows the two days before
 * any of that, when the material is not yet an object at all: a cast ingot is
 * squeezed thinner between rollers, a rod is dragged through a hole smaller
 * than itself until it is wire, and between every third operation the whole lot
 * goes back to the torch because it has hardened to the point where it will
 * crack rather than move.
 *
 * The three scenes are scroll-driven rather than looping, which is the point —
 * the visitor turns the handle, and the numbers change under their own hand.
 * They are also in the true order: heat, then roll, then draw.
 *
 * The annealing at the top is the section's argument. It is the only heat in
 * the whole process that leaves no mark. A piece that has been annealed looks
 * exactly like a piece that has not, and it is the difference between metal
 * that can be worked and metal that is about to split — which makes it the
 * invisible half of the craft and the reason two days disappear into a ring
 * with nothing to show for them.
 */
export default function ForgeSection() {
  return (
    <section
      id="forge"
      className="relative overflow-hidden border-y border-hairline bg-canvas py-24 md:py-32"
    >
      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
        <SectionHeading
          eyebrow="Two days nobody photographs"
          title="Before it is a ring it is a bar, and the bar fights back"
          highlightWords={['fights']}
          subtitle="Metal work-hardens as it is moved. Every third operation it has to be heated until the grain relaxes, quenched, and started again — and that stop is where the hours actually go."
          align="left"
          className="mb-16"
        />

        {/* The heat, and the colour it is read by. Wrapped in the shimmer
            because this is the one block on the page where the air above the
            work should be moving — the mill and the draw bench are cold
            operations and giving them heat haze would be a lie about both. */}
        <div className="mb-20">
          <HeatShimmer strength={1.1} embers quench reading="650°C · annealed">
            <div className="px-6 py-14 md:px-10 md:py-20">
              <AnnealGlowText
                text="Straw, brown, purple, cherry."
                as="h3"
                className="font-display text-4xl leading-[1.1] md:text-6xl"
              />
            </div>
          </HeatShimmer>

          <p className="mt-8 max-w-2xl font-sans text-base font-light leading-relaxed text-muted">
            A bench does not use a thermometer for this. The smith watches the
            oxide colour crawl across the surface and calls the temperature off
            it — one of the last places in any trade where a colour is a
            measurement. Then it goes into water, and the abruptness of that is
            the only thing on this page that does not ease.
          </p>
        </div>

        {/* The mill. Scroll it and the arithmetic does the uncomfortable part. */}
        <div className="grid gap-10 border-t border-line-subtle pt-16 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:items-center">
          <div>
            <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
              The rolling mill
            </p>
            <h3 className="mt-4 font-display text-3xl leading-[1.14] text-primary md:text-4xl">
              Squeeze it thinner and it gets longer. There is nowhere else for it
              to go.
            </h3>
            <p className="mt-5 font-sans text-sm font-light leading-relaxed text-muted">
              Metal is conserved, which is a sentence everybody agrees with and
              nobody expects. Take a 6mm ingot down to 1.2mm and it does not
              simply get thinner — it becomes five times longer, and it leaves
              the rollers faster than it went in. It is the one machine on a
              bench that people are taught to respect before they are taught to
              use.
            </p>
          </div>

          <RollingMillPass from={6} to={1.2} height={320} />
        </div>

        {/* The draw bench. */}
        <div className="mt-20 grid gap-10 border-t border-line-subtle pt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:items-center">
          <WireDrawBench from={3} to={0.6} />

          <div>
            <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
              The draw bench
            </p>
            <h3 className="mt-4 font-display text-3xl leading-[1.14] text-primary md:text-4xl">
              Fourteen holes to turn a rod into wire.
            </h3>
            <p className="mt-5 font-sans text-sm font-light leading-relaxed text-muted">
              Rolling gives you strip. Drawing gives you round section, which is
              the only way to make a chain link, a claw or a shank that is the
              same all the way round. And it is not one pull — a single pass can
              only take about a fifth of the cross-section before the wire snaps
              at the grip, so a 3mm rod reaches 0.6mm through fourteen
              successively smaller holes with a stop at the torch every third
              one.
            </p>
            <p className="mt-4 font-sans text-sm font-light leading-relaxed text-muted">
              Nothing is cut away. A die squeezes rather than shaves, so every
              gram that goes into the first hole comes out of the last — which is
              why a draw plate is bought once in a working life.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <CTAButton variant="secondary" href="/craftsmanship" size="sm" showArrow>
                The rest of the bench
              </CTAButton>
              <CTAButton variant="ghost" href="/experiences" size="sm">
                Come and watch it
              </CTAButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
