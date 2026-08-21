'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, Diamond } from 'lucide-react';
import SplitText from '@/components/motion/SplitText';
import Typewriter from '@/components/motion/Typewriter';
import CircularText from '@/components/motion/CircularText';
import CountUp from '@/components/motion/CountUp';
import CTAButton from '@/components/ui/CTAButton';
import GlassPanel from '@/components/ui/GlassPanel';

const STATS = [
  { label: 'Legacy', value: 130, suffix: '+ Years' },
  { label: 'Portfolio', value: 10000, suffix: '+ Creations' },
  { label: 'Assurance', value: 100, suffix: '% GIA Certified' },
];

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Every scroll-linked layer is driven straight from the raw scroll progress —
  // no spring. This is the site's entry screen and it must move in perfect
  // lockstep with the scroll: a spring, however snappy, still trails it by a
  // frame or two, which read as "the animation only happens after I stop." Using
  // the value directly means each layer updates on the very frame the scroll
  // does, and it lands on exactly 0 at the top (a spring could settle on a
  // fractional value, which puts the text on half-pixels and looks blurry).
  //
  // Foreground text, backdrop and vignette all move at different rates, so the
  // hero gains depth as it leaves.
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '24%']);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-32%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const statsY = useTransform(scrollYProgress, [0, 1], ['0%', '-70%']);
  // Starts at nothing: .media-veil-hero already carries the copy, so this layer
  // only deepens as the hero scrolls away.
  const veil = useTransform(scrollYProgress, [0, 1], [0, 0.72]);
  // NB: the old rack-focus `filter: blur()` on the *content* wrapper was removed.
  // Animating a blur on an element full of text rasterises that text as a texture
  // and re-does it every scroll frame — so the copy read soft even back at the
  // top (blur(0px) is still a filter, and the layer never de-promotes), and the
  // per-frame re-raster is what made the first scroll stutter. The parallax and
  // fade give the hero its exit; the text now stays perfectly crisp.

  // Compositor-driven scroll parallax. When the browser supports scroll-progress
  // timelines (Chrome/Edge), the CSS in globals.css drives every layer straight
  // off the scroll offset on the compositor thread — perfectly in step with a
  // native scroll, zero main-thread cost, no catch-up. We flip this on only
  // after confirming support (in an effect, so SSR and the first client render
  // agree and there is no hydration mismatch), and while it is on we stop
  // applying the framer values below so there is never a second driver fighting
  // the CSS. Where timelines are unsupported, `sdt` stays false and framer keeps
  // driving the identical motion, exactly as before.
  const [sdt, setSdt] = useState(false);
  useEffect(() => {
    if (typeof CSS !== 'undefined' && CSS.supports('animation-timeline: scroll()')) {
      setSdt(true);
    }
  }, []);

  // Each layer's framer style is applied only in the fallback (non-timeline)
  // path; under the CSS path the property is left to the keyframes.
  const bgStyle = sdt ? undefined : { y: bgY, scale: bgScale };
  const veilStyle = sdt
    ? { backgroundColor: 'rgb(var(--media-veil))' }
    : { opacity: veil, backgroundColor: 'rgb(var(--media-veil))' };
  const contentStyle = sdt ? undefined : { y: contentY, opacity: contentOpacity };
  const statsStyle = sdt ? undefined : { y: statsY };
  const fadeStyle = sdt ? undefined : { opacity: contentOpacity };

  return (
    <section
      ref={ref}
      id="hero"
      className={`relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-canvas ${
        sdt ? 'hero-sdt' : ''
      }`}
    >
      {/* Backdrop — the veil is drawn in the theme's own base colour, so the
          stage is obsidian in dark and a bright cream wash in light, and the
          type over it flips with it rather than against it. */}
      <motion.div data-hero-layer="bg" style={bgStyle} className="absolute inset-0 z-0">
        <Image
          src="/images/hero/hero-main.jpg"
          alt=""
          fill
          className="animate-ken-burns object-cover"
          priority
          quality={90}
          sizes="100vw"
        />
        {/* Legibility veil at full strength — it must never be scaled down by
            scroll, or the copy ends up sitting on bare photograph. */}
        <div className="media-veil-hero absolute inset-0" />
        {/* Separate scroll-driven wash that deepens as the hero leaves. */}
        <motion.div
          data-hero-layer="veil"
          style={veilStyle}
          className="absolute inset-0"
        />
        {/* Warm colour grade over the photograph. A plain gradient, NOT a
            mix-blend layer: a blend mode has to be recomputed against its
            backdrop on every frame the backdrop moves, and the backdrop here is
            the image that scales as you scroll — a real per-frame cost on weak
            GPUs. A normal translucent gradient gives almost the same warmth for
            free. */}
        <div className="absolute inset-0 bg-gradient-to-tr from-gold-900/15 via-transparent to-amethyst-900/15 opacity-[var(--bloom)]" />
      </motion.div>

      {/* Ambient glow — two soft blurred orbs, the same lightweight approach the
          reference build uses to stay smooth. This replaced AuroraBackground (a
          field of four 46vw gaussian blurs that drifted continuously) and GodRays
          (seven light-shafts, each pulsing forever, under a blur + mix-blend). Two
          of those effects running behind the entry screen were the last real cost
          left. These orbs are plain CSS, GPU-composited, tier-scaled via
          `.fx-bloom`; one drifts gently, the other is still. */}
      <div
        aria-hidden="true"
        className="fx-bloom animate-float pointer-events-none absolute -left-[10%] -top-[8%] z-[1] h-[46vw] w-[46vw] rounded-full bg-gold-500/20"
        style={{ ['--fx-r' as string]: '110px' }}
      />
      <div
        aria-hidden="true"
        className="fx-bloom pointer-events-none absolute -bottom-[12%] -right-[8%] z-[1] h-[40vw] w-[40vw] rounded-full bg-amethyst-700/20"
        style={{ ['--fx-r' as string]: '120px' }}
      />

      {/* No per-frame canvas on the entry screen. The hero used to run two
          particle canvases (a 54-mote rising field and a 46-facet sparkle field)
          plus a pointer-tracking lens flare all at once here, which is what made
          the first screen lag on anything but a fast machine. All three were
          removed. The hero's atmosphere now comes entirely from the ambient glow
          and light shafts above, which are pure CSS (GPU-composited and
          essentially free), plus the slow ken-burns on the photograph — so the
          entry point is rich but buttery smooth on every device. */}

      {/* Corner rules */}
      {(
        [
          'left-6 top-24 border-l border-t',
          'right-6 top-24 border-r border-t',
          'bottom-6 left-6 border-b border-l',
          'bottom-6 right-6 border-b border-r',
        ] as const
      ).map((pos, i) => (
        <motion.span
          key={pos}
          aria-hidden="true"
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 0.4, scale: 1 }}
          transition={{ duration: 1.1, delay: 1.4 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
          className={`absolute z-10 hidden h-12 w-12 border-accent/60 md:block ${pos}`}
        />
      ))}

      {/* Content — no scroll-linked filter here, so the copy is always crisp.
          transform: translateZ(0) keeps it on its own layer for smooth parallax
          without ever rasterising the text through a filter. */}
      <motion.div
        data-hero-layer="content"
        style={contentStyle}
        className="relative z-20 mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col justify-center px-6 pb-40 pt-28 md:px-12"
      >
        <div className="max-w-4xl text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mb-7 flex items-center justify-center gap-3 md:justify-start"
          >
            <motion.span
              animate={{ rotate: [0, 180, 360] }}
              transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
            >
              <Diamond className="h-4 w-4 text-accent" strokeWidth={1.5} />
            </motion.span>
            <span className="font-accent text-xs uppercase tracking-luxest text-accent">
              Since 1892
            </span>
            <span className="hidden h-px w-16 bg-gradient-to-r from-gold-400/70 to-transparent md:block" />
          </motion.div>

          <SplitText
            text="Timeless Elegance, Crafted in Gold"
            as="h1"
            mode="chars"
            highlightWords={['Gold']}
            delay={0.25}
            className="mb-8 font-display text-5xl font-light leading-[0.98] text-on-media md:text-7xl lg:text-8xl"
          />

          <motion.p
            initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mb-11 max-w-2xl font-sans text-lg font-light leading-relaxed text-on-media-soft md:mx-0 md:text-xl"
          >
            Four generations of master artisans dedicating their lives to transforming the
            world&apos;s most precious materials into enduring legacies.
          </motion.p>

          {/* Rotating specialisms, so the hero says what the house actually
              makes rather than only how it feels about it. */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.25, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10 flex items-baseline justify-center gap-3 font-accent text-xs uppercase tracking-luxe md:justify-start"
          >
            <span className="text-on-media-muted">Specialists in</span>
            <Typewriter
              phrases={[
                'Bridal commissions',
                'Uncut kundan',
                'Ceylon sapphires',
                'Antique restoration',
                'Bespoke solitaires',
              ]}
              speed={52}
              hold={2200}
              onView={false}
              className="text-accent"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-5 sm:flex-row md:justify-start"
          >
            <CTAButton href="/collections" variant="primary" size="lg" showArrow>
              Explore Collections
            </CTAButton>
            <CTAButton href="/about" variant="outline-light" size="lg">
              Our Heritage
            </CTAButton>
          </motion.div>
        </div>
      </motion.div>

      {/* Maker's seal, in the open space beside the subject. Hidden below xl,
          where the copy column reaches across the full frame. The scroll-out
          fade lives on the outer layer (CSS hero-fade / framer fallback); the
          inner element keeps its scale entrance, so the two never contend for
          the same `opacity` on one node. */}
      <motion.div
        data-hero-layer="fade"
        style={fadeStyle}
        aria-hidden="true"
        className="pointer-events-none absolute right-[6%] top-1/2 z-20 hidden -translate-y-1/2 xl:block"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, delay: 1.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <CircularText text="Aurum · Est. 1892 · Mumbai" size={210} duration={60}>
            <span className="font-display text-3xl font-light text-gradient-static">A</span>
          </CircularText>
        </motion.div>
      </motion.div>

      {/* Floating stat cards */}
      <motion.div
        data-hero-layer="stats"
        style={statsStyle}
        className="absolute inset-x-0 bottom-16 z-20 hidden px-6 md:block"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-3">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{
                duration: 0.9,
                delay: 1.5 + i * 0.14,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <GlassPanel
                variant="default"
                interactive
                className="flex flex-col items-center justify-center p-6 text-center"
              >
                <span className="mb-2 font-accent text-[10px] uppercase tracking-luxer text-accent">
                  {stat.label}
                </span>
                <span className="font-display text-2xl text-on-media">
                  <CountUp end={stat.value} duration={2.2} suffix={stat.suffix} />
                </span>
              </GlassPanel>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Scroll cue. Same split as the seal: the outer layer owns the
          scroll-out fade (CSS hero-fade / framer fallback), the inner anchor
          carries the link and its two looping child animations. */}
      <motion.div
        data-hero-layer="fade"
        style={fadeStyle}
        className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2"
      >
        <a
          href="#trust"
          aria-label="Scroll to next section"
          className="group flex flex-col items-center gap-2"
        >
          <span className="font-accent text-[9px] uppercase tracking-luxer text-on-media-muted transition-colors group-hover:text-accent">
            Scroll
          </span>
          <span className="relative flex h-10 w-px overflow-hidden bg-on-media-wash">
            <motion.span
              animate={{ y: ['-100%', '100%'] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-x-0 h-1/2 bg-gradient-to-b from-transparent via-gold-300 to-transparent"
            />
          </span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="h-4 w-4 text-gold-400" />
          </motion.span>
        </a>
      </motion.div>
    </section>
  );
}
