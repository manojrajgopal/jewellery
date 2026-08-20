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
import FacetMosaicReveal from '@/components/motion/FacetMosaicReveal';
import ElasticRail from '@/components/motion/ElasticRail';
import CanvasGemRain from '@/components/motion/CanvasGemRain';
import TypeOnPath from '@/components/motion/TypeOnPath';
import ProjectorGate from '@/components/motion/ProjectorGate';
import ContactSheetGrader from '@/components/ui/ContactSheetGrader';
import TiltShiftDiorama from '@/components/motion/TiltShiftDiorama';

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

/**
 * Three reels, in three of the frame formats the house has actually shot in.
 * The formats are the point of the comparison: Academy is the ratio the archive
 * photographs are in, Vista is what the current catalogue is shot at, and Scope
 * is the only one wide enough to hold a whole necklace without cropping a clasp.
 */
const GATE_REELS = [
  {
    src: '/images/hero/craftsmanship.jpg',
    alt: 'The bench, projected in Academy ratio',
    format: 'academy' as const,
    weave: 1.6,
    footage: '00:00:14',
    note: 'Academy, 4:3 — the shape every photograph in the archive is in, because it is the shape the cameras were.',
  },
  {
    src: '/images/collections/heritage.jpg',
    alt: 'A heritage piece, projected in Vista ratio',
    format: 'vista' as const,
    weave: 1.1,
    footage: '00:01:38',
    note: 'Vista, 1.85:1 — what the current catalogue is shot at. Wide enough for a pair, not for a suite.',
  },
  {
    src: '/images/collections/statement.jpg',
    alt: 'A statement piece, projected in Scope ratio',
    format: 'scope' as const,
    weave: 0.8,
    footage: '00:03:52',
    note: 'Scope, 2.35:1 — the only ratio that holds a whole necklace without cropping the clasp, which is why we shoot the long pieces in it.',
  },
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

      {/* ---- The facet wall ----
             Every other section of this page shows photographs as rectangles,
             because that is what photographs are. This one shows them as the unit
             a brilliant cut is actually divided into — triangles — and assembles
             each plate in a different order: outward from the table, across a
             raking light, and out of noise.

             Three orders, identical geometry, three completely different
             sentences. It is the only section here that is about how an image
             arrives rather than about what is in it. */}
      <section className="relative overflow-hidden bg-canvas py-20 md:py-28">
        <CanvasGemRain count={30} speed={40} part={150} className="opacity-55" />

        <div className="relative z-10 mx-auto max-w-[1600px] px-6 md:px-12 lg:px-24">
          <div className="mb-14 max-w-2xl">
            <TypeOnPath
              text="Assembled, not loaded"
              curve="wave"
              size={58}
              travel
              className="mb-6 max-w-lg"
            />
            <p className="font-accent text-[10px] uppercase tracking-luxest text-accent">
              The Facet Wall
            </p>
            <h2 className="mt-4 font-display text-3xl leading-tight text-primary md:text-4xl">
              One photograph, three ways of arriving
            </h2>
            <p className="mt-4 font-sans text-sm font-light leading-relaxed text-secondary">
              Each plate is the same image cut into triangles and rebuilt — outward from the
              centre, across a diagonal, and out of noise. One network request each; every tile is
              the same file offset to its own cell.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <FacetMosaicReveal
              src="/images/products/necklace.jpg"
              alt="A handwoven gold necklace, assembled outward from the centre"
              columns={8}
              order="radial"
              caption="Outward from the table"
            />
            <FacetMosaicReveal
              src="/images/collections/statement.jpg"
              alt="A statement emerald piece, assembled across a raking light"
              columns={8}
              order="diagonal"
              caption="Across a raking light"
            />
            <FacetMosaicReveal
              src="/images/products/earrings.jpg"
              alt="Pearl drop earrings, resolving out of noise"
              columns={8}
              order="random"
              caption="Out of noise"
            />
          </div>

          {/* And the whole set, thrown. A drag rail with real overscroll rather
              than a native scroller, so the wall has weight at both ends. */}
          <div className="mt-20">
            <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
              Every frame, thrown rather than scrolled
            </p>
            <p className="mt-2 max-w-2xl font-sans text-sm font-light leading-relaxed text-secondary">
              Take hold of it and let go. Past either end the rail resists rather than stopping,
              and a flick carries into a snap — which is roughly how a box of prints behaves on a
              light table.
            </p>

            <ElasticRail label="Every frame in the gallery" className="mt-8" gap={16}>
              {GALLERY.map((shot, i) => (
                <button
                  key={shot.src + i}
                  type="button"
                  onClick={() => setLightboxIndex(i)}
                  className="group relative block h-72 w-56 flex-shrink-0 overflow-hidden rounded-xl border border-hairline"
                >
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    fill
                    sizes="224px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span aria-hidden="true" className="absolute inset-0 bg-vitrine" />
                  <span className="absolute inset-x-0 bottom-0 bg-[linear-gradient(0deg,rgb(var(--shadow-color)/0.8),transparent)] p-3 text-left">
                    <span className="block font-accent text-[9px] uppercase tracking-luxe text-on-media-soft">
                      {shot.category}
                    </span>
                  </span>
                </button>
              ))}
            </ElasticRail>
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
      {/* ---- Run through a gate ----
           The page is a contact sheet, a filmstrip and a loupe: every one of them
           treats the image as a still. This is the same photography *projected* —
           which is a different claim, and the last thing the page should say.

           The gate is the mechanism rather than the look. There is an aperture
           plate cropping the frame, a perforation strip running past it, a lamp
           hot-spot behind it, and the claw's mechanical slack making the whole
           image wander a fraction of a percent while it sits there. That last
           detail is the entire difference between a photograph with a filter on
           it and something being projected — a projected frame is never still,
           and it never settles either, which is why the drift here has no spring
           in it. */}
      <section className="relative overflow-hidden border-y border-hairline bg-surface-sunken py-24 md:py-32">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <LightLeakOverlay intensity={0.24} />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
          <div className="mb-16 max-w-2xl">
            <p className="mb-5 font-accent text-[10px] uppercase tracking-luxest text-accent">
              Three reels
            </p>
            <h2 className="font-display text-3xl leading-snug text-primary md:text-5xl">
              The same frames, run through a{' '}
              <span className="italic text-accent">gate</span>
            </h2>
            <p className="mt-6 font-sans text-base font-light leading-relaxed text-muted md:text-lg">
              An aperture plate, two perforation strips, and a lamp behind it. The image wanders
              while it sits there because the claw that advances the film has play in it, and that
              sub-pixel wander is the whole difference between a still and a projection. Nothing here
              is a filter; every part of it is a part of a projector.
            </p>
          </div>

          <div className="grid gap-12 md:grid-cols-3 md:gap-8">
            {GATE_REELS.map((reel, i) => (
              <div key={reel.src} className={i === 1 ? 'md:mt-14' : undefined}>
                <ProjectorGate
                  format={reel.format}
                  weave={reel.weave}
                  footage={reel.footage}
                  tail={i === 2}
                >
                  <Image
                    src={reel.src}
                    alt={reel.alt}
                    width={900}
                    height={600}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="h-full w-full object-cover"
                  />
                </ProjectorGate>
                <p className="mt-4 font-sans text-sm font-light leading-relaxed text-muted">
                  {reel.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

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

      {/* ---- The sheet the selection was made on ----
           A gallery is a finished selection, which means the choosing has
           already happened and is invisible. This hands it back: thirty-six
           frames of one sequence and a chinagraph pencil, and then it shows
           what we marked.

           The comparison is the whole feature. Frame 16 is the technically
           perfect one and it is on the cutting-room floor; frame 22 has motion
           blur in the chain and is the one everybody stops on. A gallery is an
           argument rather than a record, and this is the only honest way to
           say so. */}
      <section className="relative overflow-hidden border-y border-hairline bg-canvas py-24 md:py-32">
        <div className="relative z-10 mx-auto max-w-5xl px-6 md:px-12">
          <div className="mb-14 max-w-2xl">
            <p className="mb-4 font-accent text-[10px] uppercase tracking-luxest text-accent">
              Before anything was hung
            </p>
            <h2 className="font-display text-3xl leading-[1.12] text-primary md:text-5xl">
              Thirty-six frames, and a wax pencil.
            </h2>
            <p className="mt-6 font-sans text-base font-light leading-relaxed text-muted">
              A roll was contact-printed onto one sheet and gone over with a
              chinagraph — a ring meant print it, a cross meant never. Every
              photograph anybody remembers from the last century was chosen this
              way, by two people arguing over one sheet. Mark yours, then see
              what we marked.
            </p>
          </div>

          <ContactSheetGrader />
        </div>
      </section>

      {/* ---- The bench, as a model of itself ----
           A shift lens focuses on a plane that is not parallel to the sensor,
           so only a narrow band of a scene is sharp. An eye reads that as depth
           of field that shallow, which only happens very close to something
           very small — so a real workshop photographs as a diorama of one.

           Which is the correct reading for this particular room. A bench shot
           straight looks like a workplace; shot like this it looks like the
           scale model of a workplace that somebody who has never seen one
           carries around in their head. The band travels with the scroll, so
           the sharp part of the frame is always the part just arrived at. */}
      <section className="relative overflow-hidden bg-canvas-alt py-24 md:py-32">
        <div className="relative z-10 mx-auto max-w-5xl px-6 md:px-12">
          <TiltShiftDiorama
            blur={7}
            caption="The Bandra bench, mid-morning — 35mm, no lights brought in"
          >
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-[linear-gradient(160deg,rgb(var(--ink-800)),rgb(var(--ink-950)))]">
              {/* Drawn rather than photographed: three benches, a window and
                  the one warm lamp, laid out in depth so the band has
                  something to travel across. */}
              <div className="absolute inset-x-0 top-0 h-1/3 bg-[linear-gradient(180deg,rgb(var(--gold-200)/0.18),transparent)]" />
              <div className="absolute left-[8%] top-[42%] h-[34%] w-[26%] rounded-sm bg-[linear-gradient(180deg,rgb(var(--ink-600)),rgb(var(--ink-800)))]" />
              <div className="absolute left-[38%] top-[48%] h-[30%] w-[24%] rounded-sm bg-[linear-gradient(180deg,rgb(var(--ink-500)),rgb(var(--ink-700)))]" />
              <div className="absolute left-[66%] top-[44%] h-[32%] w-[26%] rounded-sm bg-[linear-gradient(180deg,rgb(var(--ink-600)),rgb(var(--ink-800)))]" />
              <div className="absolute left-[44%] top-[30%] h-16 w-16 rounded-full bg-[radial-gradient(circle,rgb(var(--gold-200)/0.9),rgb(var(--gold-600)/0.3)_54%,transparent_74%)]" />
              <div className="absolute inset-x-0 bottom-0 h-1/4 bg-[linear-gradient(0deg,rgb(var(--ink-950)),transparent)]" />
            </div>
          </TiltShiftDiorama>

          <p className="mx-auto mt-8 max-w-2xl text-center font-sans text-base font-light leading-relaxed text-muted">
            The blur is not a filter. It is a masked second copy of the frame,
            feathered so the plane of focus has an edge that falls off the way a
            lens does — and the band moves down the picture as you scroll,
            because a rack focus is a thing somebody does rather than a state a
            photograph is in.
          </p>
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
