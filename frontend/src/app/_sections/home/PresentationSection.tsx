'use client';

import SectionHeading from '@/components/ui/SectionHeading';
import CTAButton from '@/components/ui/CTAButton';
import PackagingConfigurator from '@/components/ui/PackagingConfigurator';
import EngravingStudio from '@/components/ui/EngravingStudio';
import VelvetTray from '@/components/motion/VelvetTray';
import CausticsCanvas from '@/components/motion/CausticsCanvas';
import { products } from '@/data/products';

/**
 * The last mile: what the piece is engraved with, and what it arrives in.
 *
 * Placed after the commission section rather than before it, because both of these are
 * decisions a customer makes once they have chosen something — asking someone to pick a
 * ribbon before they have picked a ring is asking the questions in the wrong order.
 *
 * The case opens on click here rather than on scroll. On a section this far down the page
 * the visitor is browsing deliberately, and a lid that opens itself removes the one bit
 * of theatre the component has.
 */
export default function PresentationSection() {
  const hero = products.find((p) => p.isBestseller) ?? products[0];

  return (
    <section id="presentation" className="relative overflow-hidden bg-canvas py-24 md:py-32">
      <CausticsCanvas intensity={0.3} lobes={5} speed={34} />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
        <SectionHeading
          eyebrow="The Last Mile"
          title="What it says, and what it arrives in"
          highlightWords={['says,']}
          subtitle="Engraving is included on every commission and cannot be undone. The presentation is made to order, in whatever combination you settle on."
          align="center"
          className="mb-16"
        />

        {/* The piece in its case, opened by hand */}
        <div className="mb-16 grid gap-14 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:items-center">
          <VelvetTray
            image={hero.images?.[0] ?? '/images/products/ring.jpg'}
            alt={hero.name}
            title={hero.name}
            subtitle={hero.gemstone ?? 'Presented by hand'}
            meta={[hero.formattedPrice ?? hero.price, hero.metal.replace('-', ' ')]}
            trigger="click"
          />

          <div>
            <p className="mb-5 font-accent text-[10px] uppercase tracking-luxest text-accent">
              Presented By Hand
            </p>
            <h3 className="font-display text-2xl font-light leading-tight text-primary md:text-3xl">
              A case is the first thing anyone touches
            </h3>
            <div className="mt-5 space-y-5 font-sans text-base font-light leading-relaxed text-muted">
              <p>
                It is also the only part of the purchase that gets opened in front of an
                audience. So it is tooled rather than printed, blind-stamped rather than
                foiled, and the lining is chosen against the metal rather than against the
                case — cream velvet under yellow gold, black under platinum.
              </p>
              <p>
                Press the case to open it. Everything below is configurable, and every
                combination is made rather than stocked.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <CTAButton variant="primary" size="md" href="/bespoke" showArrow>
                Start a commission
              </CTAButton>
              <CTAButton variant="secondary" size="md" href="/services">
                What else the bench does
              </CTAButton>
            </div>
          </div>
        </div>

        {/* The two configurators */}
        <div className="grid gap-8">
          <EngravingStudio />
          <PackagingConfigurator />
        </div>
      </div>
    </section>
  );
}
