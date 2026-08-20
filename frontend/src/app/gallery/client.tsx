'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { Expand } from 'lucide-react';
import PageBanner from '@/components/ui/PageBanner';
import Lightbox from '@/components/ui/Lightbox';
import CausticsCanvas from '@/components/motion/CausticsCanvas';
import ParticleField from '@/components/motion/ParticleField';
import CTAButton from '@/components/ui/CTAButton';
import FilmstripScroller from '@/components/motion/FilmstripScroller';
import JewellerLoupe from '@/components/motion/JewellerLoupe';
import ScrollAssembleText from '@/components/motion/ScrollAssembleText';
import CylinderMarquee from '@/components/motion/CylinderMarquee';
import RippleGrid from '@/components/motion/RippleGrid';
import InkBleedReveal from '@/components/motion/InkBleedReveal';
import KaleidoscopeGem from '@/components/motion/KaleidoscopeGem';
import CinematicLetterbox from '@/components/motion/CinematicLetterbox';
import SilkWave from '@/components/motion/SilkWave';
import VertigoZoom from '@/components/motion/VertigoZoom';
import ChromaSplit from '@/components/motion/ChromaSplit';
import LightLeakOverlay from '@/components/motion/LightLeakOverlay';
import BokehDrift from '@/components/motion/BokehDrift';
import EchoTrailText from '@/components/motion/EchoTrailText';
import TypeSlamHeading from '@/components/motion/TypeSlamHeading';
import { contactSheet } from '@/data/editorial';

const CATEGORIES = ['All', 'Necklaces', 'Rings', 'Earrings', 'Bracelets', 'Collections'];

const GALLERY = [
  { src: '/images/hero/hero-main.jpg', alt: 'The AURUM signature gold suite', category: 'Collections' },
  { src: '/images/products/ring.jpg', alt: 'Solitaire diamond ring', category: 'Rings' },
  { src: '/images/collections/bridal.jpg', alt: 'Bridal kundan set', category: 'Collections' },
  { src: '/images/products/necklace.jpg', alt: 'Handwoven gold necklace', category: 'Necklaces' },
  { src: '/images/products/earrings.jpg', alt: 'Pearl drop earrings', category: 'Earrings' },
  { src: '/images/collections/heritage.jpg', alt: 'Heritage collection centrepiece', category: 'Collections' },
  { src: '/images/products/bracelet.jpg', alt: 'Diamond tennis bracelet', category: 'Bracelets' },
  { src: '/images/collections/statement.jpg', alt: 'Statement emerald piece', category: 'Collections' },
  { src: '/images/hero/craftsmanship.jpg', alt: 'An artisan at the bench', category: 'Collections' },
  { src: '/images/collections/everyday.jpg', alt: 'Everyday luxe stack', category: 'Collections' },
  { src: '/images/collections/gemstone.jpg', alt: 'Gemstone cocktail ring', category: 'Rings' },
  { src: '/images/collections/mens.jpg', alt: "Men's signet collection", category: 'Collections' },
];

export default function GalleryClient() {
  const [activeTab, setActiveTab] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const filtered = useMemo(
    () => (activeTab === 'All' ? GALLERY : GALLERY.filter((g) => g.category === activeTab)),
    [activeTab]
  );

  return (
    <main className="min-h-screen bg-canvas">
      <PageBanner
        title="Gallery"
        subtitle="A visual journey through our finest creations"
        breadcrumbs={[{ label: 'Gallery' }]}
      />

      <section className="relative mx-auto max-w-[1600px] overflow-hidden px-6 py-16 md:px-12 lg:px-24">
        <CausticsCanvas intensity={0.28} lobes={6} speed={30} />
        <ParticleField count={34} rise />

        {/* Filter rail */}
        <div className="mb-16 flex flex-wrap justify-center gap-3">
          {CATEGORIES.map((category) => {
            const isActive = activeTab === category;
            return (
              <button
                key={category}
                onClick={() => setActiveTab(category)}
                aria-pressed={isActive}
                className={`relative rounded-full px-6 py-2.5 font-accent text-[11px] uppercase tracking-luxe transition-colors duration-300 ${
                  isActive ? 'text-onaccent' : 'text-muted hover:text-accent'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="gallery-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-accent shadow-gold"
                    transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                  />
                )}
                {category}
              </button>
            );
          })}
        </div>

        {/* Masonry */}
        <div className="columns-1 gap-6 space-y-6 sm:columns-2 lg:columns-3 xl:columns-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((image, i) => (
              <motion.button
                layout
                key={image.src}
                initial={{ opacity: 0, scale: 0.92, filter: 'blur(8px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.55, delay: (i % 8) * 0.05, ease: [0.22, 1, 0.36, 1] }}
                onClick={() =>
                  setLightboxIndex(GALLERY.findIndex((g) => g.src === image.src))
                }
                data-cursor="View"
                aria-label={`Open ${image.alt}`}
                className="group relative mb-6 block w-full break-inside-avoid overflow-hidden rounded-xl border border-hairline"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={800}
                  height={1000}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="h-auto w-full object-cover transition-transform duration-[1100ms] ease-luxury group-hover:scale-110"
                />

                {/* Hover veil */}
                <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-canvas/0 transition-colors duration-500 group-hover:bg-canvas/55">
                  <span className="flex h-12 w-12 translate-y-4 items-center justify-center rounded-full border border-gold-400/60 text-accent opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <Expand size={17} />
                  </span>
                  <span className="translate-y-4 px-4 text-center font-accent text-[10px] uppercase tracking-luxe text-gold-100 opacity-0 transition-all duration-500 delay-75 group-hover:translate-y-0 group-hover:opacity-100">
                    {image.alt}
                  </span>
                </span>

                {/* Hairline frame that draws in */}
                <span className="pointer-events-none absolute inset-3 border border-gold-400/0 transition-colors duration-700 group-hover:border-gold-400/45" />
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* The contact sheet — the shoot in shoot order, which is a different way of
          reading the same portfolio than the filtered masonry above. The masonry is
          for finding a piece; this is for seeing how the pictures were made. */}
      <section className="relative overflow-hidden border-y border-hairline bg-surface-raised/30 py-20 md:py-28">
        <div className="relative z-10 mx-auto max-w-[1600px] px-6 md:px-12 lg:px-24">
          <div className="mb-12">
            <p className="mb-5 font-accent text-[10px] uppercase tracking-luxest text-accent">
              Unedited
            </p>
            <ScrollAssembleText
              text="Every frame, in the order it was shot"
              as="h2"
              highlightWords={['order']}
              spread={70}
              className="max-w-2xl font-display text-3xl font-light leading-[1.12] text-primary sm:text-4xl"
            />
            <p className="mt-5 max-w-xl font-sans text-sm font-light leading-relaxed text-muted">
              Slate codes, edge marks and all. Scroll and the strip runs through the gate.
            </p>
          </div>

          <FilmstripScroller
            frames={contactSheet}
            height={360}
            travel={0.8}
            title="Aurum · Season Shoot"
          />
        </div>
      </section>

      {/* One plate, under the loupe */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <RippleGrid spacing={46} reach={190} dot={1.1} />

        <div className="relative z-10 mx-auto grid max-w-6xl gap-14 px-6 md:px-12 lg:grid-cols-2 lg:items-center">
          <JewellerLoupe
            src="/images/hero/craftsmanship.jpg"
            alt="A goldsmith raising a hollow form at the bench"
            zoom={2.5}
            size={195}
            readout="Bench detail"
            aspect="4 / 3"
          />

          <div>
            <p className="mb-5 font-accent text-[10px] uppercase tracking-luxest text-accent">
              Photographed At Forty Times
            </p>
            <h2 className="font-display text-2xl font-light leading-tight text-primary md:text-4xl">
              Nothing in this gallery has been retouched
            </h2>
            <div className="mt-5 space-y-5 font-sans text-base font-light leading-relaxed text-muted">
              <p>
                Colour is graded to match the piece under showroom light and nothing else
                is done. No stones added, no prongs straightened, no inclusions painted
                out — which is why some of these frames show a tool mark or a fingerprint
                on the metal.
              </p>
              <p>
                Move across the plate and look for yourself. If a photograph will not
                survive a loupe, it should not be selling anything.
              </p>
            </div>

            <div className="mt-9 flex flex-wrap gap-4">
              <CTAButton variant="primary" size="md" href="/lookbook" showArrow>
                The bound lookbook
              </CTAButton>
              <CTAButton variant="secondary" size="md" href="/craftsmanship">
                Pan the workshop
              </CTAButton>
            </div>
          </div>
        </div>
      </section>

      {/* ---- The darkroom ----
           The gallery above is the finished portfolio. This is how the frames come
           out of it: printed wet, mirrored on the light table, and finally covered
           over. Three ways of looking at pictures that are not "a grid of them",
           which is what every other section of this page already is. */}
      <CinematicLetterbox slate="The Darkroom" slateNote="Contact prints, wet" barHeight={0.09}>
        <section className="relative overflow-hidden bg-canvas-alt py-20 md:py-28">
          <div className="relative z-10 mx-auto max-w-[1600px] px-6 md:px-12 lg:px-24">
            <div className="mb-14 max-w-2xl">
              <p className="mb-5 font-accent text-[10px] uppercase tracking-luxest text-accent">
                Off The Line
              </p>
              <h2 className="font-display text-3xl font-light leading-[1.12] text-primary sm:text-4xl">
                Three ways to look at a photograph that is not a grid
              </h2>
              <p className="mt-5 font-sans text-sm font-light leading-relaxed text-muted">
                A print soaking up from the bottom of the paper, the same frame through
                fourteen mirrors on the light table, and a plate under the cloth it is
                stored beneath.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              <figure>
                <InkBleedReveal
                  src="/images/collections/heritage.jpg"
                  alt="A heritage suite, printed wet"
                  ratio={4 / 5}
                  className="rounded-2xl border border-hairline"
                />
                <figcaption className="mt-4">
                  <span className="font-accent text-[10px] uppercase tracking-luxer text-accent">
                    Wet print
                  </span>
                  <p className="mt-1 font-sans text-xs font-light leading-relaxed text-muted">
                    The edge is where ink meets damp fibre. Displaced noise on the mask, never on
                    the photograph — the picture behind it stays perfectly sharp.
                  </p>
                </figcaption>
              </figure>

              <figure className="flex flex-col items-center justify-center rounded-2xl border border-hairline bg-surface-sunken/40 p-6">
                <KaleidoscopeGem
                  src="/images/products/earrings.jpg"
                  segments={14}
                  spin={8}
                  caption="Fourteen mirrors"
                  className="w-full max-w-[18rem]"
                />
                <figcaption className="mt-4 text-center">
                  <span className="font-accent text-[10px] uppercase tracking-luxer text-accent">
                    Light table
                  </span>
                  <p className="mt-1 font-sans text-xs font-light leading-relaxed text-muted">
                    Alternate wedges are mirrored rather than repeated, which is the difference
                    between a kaleidoscope and a pinwheel.
                  </p>
                </figcaption>
              </figure>

              <figure>
                <SilkWave
                  src="/images/collections/statement.jpg"
                  alt="A statement piece under its storage cloth"
                  ratio={4 / 5}
                  panels={12}
                  className="rounded-2xl border border-hairline"
                />
                <figcaption className="mt-4">
                  <span className="font-accent text-[10px] uppercase tracking-luxer text-accent">
                    Under cloth
                  </span>
                  <p className="mt-1 font-sans text-xs font-light leading-relaxed text-muted">
                    Every plate in the archive lives under tissue. The panels release from the
                    middle outward, the way hanging fabric actually falls.
                  </p>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>
      </CinematicLetterbox>

      {/* What is in the frame, on a drum */}
      <section className="relative overflow-hidden border-t border-hairline py-16 md:py-20">
        <CausticsCanvas intensity={0.24} lobes={4} speed={40} />
        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <p className="mb-8 text-center font-accent text-[10px] uppercase tracking-luxest text-accent">
            What is in the frame
          </p>
          <CylinderMarquee
            items={[
              'Raking light',
              'Dark ground',
              'On the hand',
              'On velvet',
              'At the bench',
              'Sorting tray',
            ]}
            radius={128}
            speed={11}
            reverse
          />
        </div>
      </section>


      {/* ---- The lens itself ----
           Every other section on this page is about what was photographed. This
           one is about the glass it was photographed through, which is the half
           of a picture nobody credits.

           Three optical faults, reproduced rather than described: the aberration
           that appears when the page is moving quickly, the leaks that come in
           when a camera back is not light-tight, and the dolly zoom, which is the
           only one of the three that was ever done on purpose. */}
      <section className="relative overflow-hidden border-y border-hairline bg-surface-sunken py-24 md:py-32">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <BokehDrift count={22} intensity={0.48} speed={0.7} blades={7} />
          <LightLeakOverlay intensity={0.44} interval={8} onClick />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center md:px-12">
          <ChromaSplit amount={7} saturateAt={1800}>
            <p className="mb-6 font-accent text-[10px] uppercase tracking-luxest text-accent">
              Faults, on purpose
            </p>
            <h2 className="mx-auto max-w-3xl font-display text-3xl leading-tight text-primary md:text-5xl">
              Scroll quickly and the colours come apart
            </h2>
          </ChromaSplit>

          <p className="mx-auto mt-6 max-w-xl font-sans text-base font-light leading-relaxed text-muted">
            Cheap glass cannot bring red and blue to the same focal plane, so a fast pan smears them
            in opposite directions. The heading above does it in proportion to how fast this page is
            actually moving \u2014 stop, and it converges. Tap anywhere for a light leak.
          </p>

          <VertigoZoom intensity={0.9} className="mt-20">
            <TypeSlamHeading
              lines={['The room falls away.', 'The subject does not.']}
              highlightWords={['not.']}
              as="h3"
              className="font-display text-2xl leading-[1.15] text-primary md:text-4xl"
            />
            <p className="mx-auto mt-6 max-w-lg font-sans text-sm font-light leading-relaxed text-muted">
              A dolly zoom: the camera tracks in while the lens zooms out, so the subject holds its
              size and the world behind it collapses. Invented for a film about vertigo, and still
              the only shot that makes a still room feel unsafe.
            </p>
          </VertigoZoom>

          <div className="mt-20">
            <EchoTrailText
              text="Half of every photograph here is glass."
              as="p"
              echoes={3}
              spread={17}
              direction="right"
              persistent
              className="font-display text-2xl leading-snug text-primary md:text-3xl"
            />
          </div>
        </div>
      </section>

      <Lightbox
        images={GALLERY}
        initialIndex={lightboxIndex === -1 ? 0 : lightboxIndex}
        isOpen={lightboxIndex !== -1}
        onClose={() => setLightboxIndex(-1)}
      />
    </main>
  );
}
