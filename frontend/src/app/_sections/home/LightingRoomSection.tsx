'use client';

import SectionHeading from '@/components/ui/SectionHeading';
import CTAButton from '@/components/ui/CTAButton';
import LightingSimulator from '@/components/ui/LightingSimulator';
import MagneticFieldLines from '@/components/motion/MagneticFieldLines';
import GoldDivider from '@/components/ui/GoldDivider';

/**
 * The room the piece will actually be looked at in.
 *
 * The light study further up the page explains what light does *inside* a cut
 * stone — brilliance, fire, scintillation. The 4Cs section grades it. Neither
 * addresses the thing that decides whether somebody is happy with a purchase
 * three days later: the light in the room where it now lives.
 *
 * It sits here, immediately after the stone library, because that is the point
 * on the page where a visitor has just been given a dozen mineral names and four
 * grading dials, and is at maximum risk of believing that a stone can be chosen
 * on paper. The honest correction is that our showroom halogen is the most
 * flattering light this piece will ever be in, and we would rather say so on our
 * own website than have it discovered at a desk under an LED panel.
 *
 * The field lines behind it are the only decoration and they earn their place:
 * they bend away from the pointer, which is the same idea the section is about —
 * light responding to where you are standing.
 */
export default function LightingRoomSection() {
  return (
    <section id="lighting" className="relative overflow-hidden bg-canvas py-24 md:py-32">
      <MagneticFieldLines lines={22} radius={260} strength={30} className="opacity-70" />

      <div className="relative mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="The Room, Not The Report"
          title="Our showroom light is the best light this will ever have"
          highlightWords={['best']}
          subtitle="Every jeweller in the world lights a showroom at around 3000 kelvin, because it flatters gold and still makes a stone flash. Here is the same piece under the four other lights it will spend its life in — and what each one gives and takes."
        />

        <div className="mt-16">
          <LightingSimulator />
        </div>

        <GoldDivider variant="ornate" className="my-16" />

        <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <p className="max-w-2xl font-display text-2xl italic leading-snug text-primary md:text-3xl">
            Ask any jeweller to carry the piece to the window before you decide. If they hesitate,
            that is the answer to a different question.
          </p>

          <div className="flex flex-wrap gap-4">
            <CTAButton variant="secondary" href="/experiences" size="sm" showArrow>
              See it in our light
            </CTAButton>
            <CTAButton variant="ghost" href="#stones" size="sm">
              Back to the stones
            </CTAButton>
          </div>
        </div>
      </div>
    </section>
  );
}
