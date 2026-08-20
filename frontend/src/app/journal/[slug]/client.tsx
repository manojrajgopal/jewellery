'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, Clock, Quote } from 'lucide-react';

import Breadcrumbs from '@/components/ui/Breadcrumbs';
import GoldDivider from '@/components/ui/GoldDivider';
import CTAButton from '@/components/ui/CTAButton';
import CausticsCanvas from '@/components/motion/CausticsCanvas';
import SplitText from '@/components/motion/SplitText';
import ParticleField from '@/components/motion/ParticleField';
import InkBleedReveal from '@/components/motion/InkBleedReveal';
import GoldRibbonWeave from '@/components/motion/GoldRibbonWeave';
import HoverPeelCard from '@/components/motion/HoverPeelCard';
import { journal } from '@/data/editorial';

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

/**
 * One journal entry.
 *
 * The reading-progress rail is scoped to the *article* rather than to the document,
 * which is the difference between a bar that tells a reader how much of the piece is
 * left and one that includes the footer and the three related entries underneath. The
 * second is the common implementation and it always reads as though the article is
 * longer than it is.
 */
export default function ArticleClient({ slug }: { slug: string }) {
  const entry = journal.find((j) => j.slug === slug);
  const articleRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: articleRef,
    // 'start start' → 'end end' measures the article's own extent, so the rail
    // completes exactly as the last line leaves the viewport.
    offset: ['start start', 'end end'],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 });

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(heroScroll, [0, 1], ['0%', '24%']);
  const heroScale = useTransform(heroScroll, [0, 1], [1, 1.14]);

  if (!entry) return null;

  const index = journal.findIndex((j) => j.id === entry.id);
  const next = journal[(index + 1) % journal.length];
  const related = journal
    .filter((j) => j.id !== entry.id && j.topic === entry.topic)
    .slice(0, 2);

  return (
    <>
      {/* Reading progress for this article only */}
      <motion.div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-[95] h-[2px] origin-left bg-gradient-to-r from-gold-700 via-gold-300 to-gold-500"
        style={{ scaleX: progress }}
      />

      {/* ---- Hero ---- */}
      <header ref={heroRef} className="relative overflow-hidden pb-16 pt-32 md:pb-20 md:pt-40">
        <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0">
          <Image
            src={entry.image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="media-veil absolute inset-0" />
        </motion.div>

        <ParticleField count={22} rise />

        <div className="container relative z-10 mx-auto max-w-4xl px-6">
          <Breadcrumbs
            items={[{ label: 'Journal', href: '/journal' }, { label: entry.title }]}
            onMedia
            className="mb-7"
          />

          <p className="mb-5 font-accent text-[10px] uppercase tracking-luxest text-accent">
            {entry.kicker}
          </p>

          <SplitText
            text={entry.title}
            as="h1"
            mode="words"
            delay={0.12}
            className="mb-5 font-display text-3xl font-light leading-[1.08] text-on-media md:text-5xl lg:text-6xl"
          />

          <motion.p
            initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl font-display text-lg italic leading-snug text-on-media-soft md:text-2xl"
          >
            {entry.standfirst}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 font-sans text-[11px] font-light text-on-media-muted"
          >
            <span>{entry.author}</span>
            <span aria-hidden="true" className="h-1 w-1 rotate-45 bg-accent/60" />
            <span className="nums-tabular">{fmtDate(entry.date)}</span>
            <span aria-hidden="true" className="h-1 w-1 rotate-45 bg-accent/60" />
            <span className="nums-tabular flex items-center gap-1.5">
              <Clock size={11} strokeWidth={1.8} />
              {entry.read} minute read
            </span>
          </motion.div>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-500/60 to-transparent" />
      </header>

      {/* ---- Body ---- */}
      <div ref={articleRef} className="relative bg-canvas py-16 md:py-24">
        <CausticsCanvas intensity={0.22} lobes={4} speed={38} />

        <article className="relative z-10 mx-auto max-w-2xl px-6">
          {entry.body.map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-12% 0px' }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className={`font-sans font-light leading-[1.85] text-secondary ${
                i === 0
                  ? 'text-lg first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-[3.6rem] first-letter:leading-[0.82] first-letter:text-accent md:text-xl'
                  : 'mt-7 text-base md:text-lg'
              }`}
            >
              {para}
            </motion.p>
          ))}

          {/* Pull quote, set after the second paragraph rather than at the end, which
              is where a reader's attention actually needs the lift. */}
          {entry.pull && (
            <motion.blockquote
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative my-12 border-y border-hairline py-9"
            >
              <Quote
                size={16}
                strokeWidth={2}
                className="mb-4 text-accent/60"
                aria-hidden="true"
              />
              <p className="font-display text-2xl font-light italic leading-snug text-primary md:text-3xl">
                {entry.pull}
              </p>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-3 -top-4 font-display text-[6rem] leading-none text-accent/[0.06]"
              >
                &rdquo;
              </span>
            </motion.blockquote>
          )}

          {/* Byline block */}
          <div className="mt-14 flex items-start gap-4 rounded-2xl border border-hairline bg-surface-raised/50 p-6 backdrop-blur-xl">
            <span
              aria-hidden="true"
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-gold-500/30 bg-gold-900/20 font-accent text-xs uppercase tracking-luxe text-accent"
            >
              {entry.author
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </span>
            <div>
              <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
                {entry.author}
              </p>
              <p className="mt-1.5 font-sans text-xs font-light leading-relaxed text-muted">
                Filed under {entry.topic}. Written at the bench in Mumbai — come and argue
                with it in person if you disagree.
              </p>
            </div>
          </div>
        </article>
      </div>

      <GoldDivider variant="jewel" />

      {/* ---- As it was printed ----
           Every entry here appeared in the quarterly first, and the printed version is
           the one the bench actually signed off. Showing the plate as a wet proof is
           not decoration: it is the difference between a blog with a serif font and a
           journal that exists on paper. */}
      <section className="relative overflow-hidden border-y border-hairline bg-canvas-alt py-16 md:py-24">
        <div className="mx-auto grid max-w-5xl items-center gap-12 px-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
          <div>
            <p className="font-accent text-[10px] uppercase tracking-luxest text-accent">
              In Print First
            </p>
            <h2 className="mt-4 font-display text-2xl font-light leading-tight text-primary md:text-3xl">
              This one ran on paper before it ran here
            </h2>
            <p className="mt-5 font-sans text-sm font-light leading-relaxed text-secondary">
              Six pages, letterpress, nine hundred copies, hand-addressed. The plate opposite is
              the proof as it came off the press &mdash; damp, because ink sits differently on damp
              stock and a plate approved dry comes back half a stop darker.
            </p>

            <div className="mt-7">
              <HoverPeelCard
                className="min-h-[8.5rem]"
                corner={{ rest: 22, open: 112 }}
                underside={
                  <p className="font-sans text-sm font-light leading-relaxed text-secondary">
                    Ask at the boutique or leave an address with the concierge. There is no digital
                    edition and no list to join online &mdash; which is deliberate, and is why the
                    print run has not grown in nine years.
                  </p>
                }
              >
                <div className="p-6">
                  <span className="font-accent text-[10px] uppercase tracking-luxer text-accent">
                    How to get a copy
                  </span>
                  <p className="mt-2 font-display text-xl leading-snug text-primary">
                    Not by subscribing
                  </p>
                </div>
              </HoverPeelCard>
            </div>
          </div>

          <InkBleedReveal
            src={entry.image}
            alt={`${entry.title}, as printed`}
            ratio={4 / 3}
            roughness={20}
            className="rounded-3xl border border-hairline"
          />
        </div>
      </section>

      <GoldRibbonWeave className="px-6" height={100} />

      {/* ---- Related ---- */}
      {related.length > 0 && (
        <section className="relative bg-canvas px-6 py-16 md:py-24">
          <div className="mx-auto max-w-4xl">
            <p className="mb-8 font-accent text-[10px] uppercase tracking-luxest text-accent">
              More on {entry.topic}
            </p>

            <div className="grid gap-6 sm:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/journal/${r.slug}`}
                  data-cursor="Read"
                  className="group flex gap-4 rounded-xl border border-hairline p-5 transition-colors duration-500 hover:border-gold-500/40"
                >
                  <span className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={r.image}
                      alt={r.title}
                      fill
                      sizes="80px"
                      className="object-cover transition-transform duration-[1100ms] ease-luxury group-hover:scale-110"
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-base font-light leading-snug text-primary transition-colors group-hover:text-accent">
                      {r.title}
                    </span>
                    <span className="nums-tabular mt-2 block font-accent text-[9px] uppercase tracking-luxe text-faint">
                      {r.read} min · {fmtDate(r.date)}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---- Onward ---- */}
      <section className="relative border-t border-hairline bg-surface-raised/30 px-6 py-16">
        <div className="mx-auto flex max-w-4xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/journal"
            className="group inline-flex items-center gap-2.5 font-accent text-[10px] uppercase tracking-luxe text-muted transition-colors hover:text-accent"
          >
            <ArrowLeft
              size={14}
              strokeWidth={1.8}
              className="transition-transform group-hover:-translate-x-1"
            />
            All entries
          </Link>

          <Link
            href={`/journal/${next.slug}`}
            data-cursor="Next"
            className="group text-left sm:text-right"
          >
            <span className="block font-accent text-[9px] uppercase tracking-luxe text-faint">
              Read next
            </span>
            <span className="mt-1.5 flex items-center gap-2 font-display text-lg font-light text-primary transition-colors group-hover:text-accent sm:justify-end">
              {next.title}
              <ArrowUpRight
                size={15}
                strokeWidth={1.8}
                className="text-accent transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </span>
          </Link>
        </div>
      </section>

      <section className="bg-canvas px-6 py-20 text-center">
        <h2 className="mx-auto max-w-xl font-display text-2xl font-light leading-snug text-primary md:text-3xl">
          Everything here started as a question someone asked across the counter.
        </h2>
        <p className="mx-auto mt-4 max-w-md font-sans text-sm font-light text-muted">
          Bring us yours.
        </p>
        <div className="mt-8">
          <CTAButton variant="primary" size="lg" href="/contact" showArrow>
            Come and ask
          </CTAButton>
        </div>
      </section>
    </>
  );
}
