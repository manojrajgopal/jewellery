'use client';

import SectionHeading from '@/components/ui/SectionHeading';
import CTAButton from '@/components/ui/CTAButton';
import HallmarkPunch from '@/components/motion/HallmarkPunch';
import GoldDivider from '@/components/ui/GoldDivider';

/**
 * The last thing done to a finished piece is to hit it.
 *
 * The close of the atelier run, and deliberately the last making section on the
 * page: hallmarking is genuinely the final operation, after the polishing,
 * after everything. Somebody takes a ring that has just had three hours of
 * finishing put into it and strikes it four times with hardened steel.
 *
 * The site can already decode a hallmark elsewhere — that panel enlarges a
 * finished stamp and names the four marks on it. This is the event rather than
 * the object, and the difference matters, because reading a hallmark makes it
 * look like a printed label and watching one being struck makes it obvious that
 * it is a wound.
 *
 * The honest note at the foot is the reason the section is worth having at all.
 * Of the four marks, exactly one is a legal requirement, one says where the
 * piece was tested rather than where it was made, and one is the only mark this
 * house cuts itself — which is also the only one it can be prosecuted over.
 * Very few customers know any of that, and all three facts change how the stamp
 * on the inside of their own ring should be read.
 */
export default function StrikeSection() {
  return (
    <section
      id="strike"
      className="relative overflow-hidden border-y border-hairline bg-canvas py-24 md:py-32"
    >
      <div className="relative z-10 mx-auto max-w-5xl px-6 md:px-12">
        <SectionHeading
          eyebrow="The last operation"
          title="Three hours of polishing, and then somebody hits it"
          highlightWords={['hits']}
          subtitle="A hallmark is not printed and it is not engraved. It is a hardened steel punch driven into finished metal, four separate blows, with the piece reseated on the stake between each one."
          align="center"
          className="mb-16"
        />

        <HallmarkPunch />

        <GoldDivider variant="ornate" className="my-16" />

        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
              One of them is the law
            </p>
            <p className="mt-3 font-sans text-sm font-light leading-relaxed text-muted">
              Only the bureau mark is a legal requirement. The other three are
              conventions — universally observed, entirely voluntary, and a piece
              missing any of them is not necessarily wrong. It is, however, worth
              asking about.
            </p>
          </div>
          <div>
            <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
              One says where, and not where you think
            </p>
            <p className="mt-3 font-sans text-sm font-light leading-relaxed text-muted">
              The assay office code says where the piece was tested. It is almost
              never the building it was made in, and a mark from one city on a
              piece made in another is completely ordinary rather than a warning.
            </p>
          </div>
          <div>
            <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
              One is ours, and it is the one with teeth
            </p>
            <p className="mt-3 font-sans text-sm font-light leading-relaxed text-muted">
              The maker’s mark is the only punch we cut ourselves and the only
              one we can be prosecuted over. Which is the correct arrangement:
              the mark that identifies us is the mark we carry the liability for.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-8 rounded-2xl border border-hairline bg-surface-raised/40 p-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-8">
          <p className="font-display text-xl italic leading-snug text-primary md:text-2xl">
            Bring in anything, from anywhere, and we will read the marks inside
            it and tell you what they actually say — including when they say
            nothing at all.
          </p>
          <div className="flex flex-wrap gap-4">
            <CTAButton variant="secondary" href="/gemstones" size="sm" showArrow>
              Decode a hallmark
            </CTAButton>
            <CTAButton variant="ghost" href="/contact" size="sm">
              Bring it in
            </CTAButton>
          </div>
        </div>
      </div>
    </section>
  );
}
