'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

type Subject = 'ring' | 'pendant' | 'earring' | 'bangle';

interface SilverpointSketchProps {
  subject?: Subject;
  className?: string;
  /** Caption printed under the sheet. */
  caption?: string;
}

/**
 * Outlines on a 200 × 200 box, kept as single paths so a stroke can draw
 * itself without jumping between subpaths.
 */
const SUBJECTS: Record<Subject, { outline: string; detail: string; title: string }> = {
  ring: {
    title: 'Solitaire, four claw',
    outline:
      'M 100 168 C 62 168 40 142 40 112 C 40 82 62 60 100 60 C 138 60 160 82 160 112 C 160 142 138 168 100 168 Z',
    detail:
      'M 78 66 L 90 34 L 110 34 L 122 66 M 90 34 L 100 20 L 110 34 M 84 50 L 116 50',
  },
  pendant: {
    title: 'Drop, bezel set',
    outline:
      'M 100 32 C 118 60 138 92 138 118 C 138 148 122 168 100 168 C 78 168 62 148 62 118 C 62 92 82 60 100 32 Z',
    detail: 'M 100 32 L 100 168 M 74 108 C 86 96 114 96 126 108',
  },
  earring: {
    title: 'Hoop, hinged',
    outline:
      'M 100 40 C 138 40 164 74 164 112 C 164 150 138 176 100 176 C 62 176 36 150 36 112 C 36 74 62 40 100 40 Z',
    detail: 'M 100 40 L 100 62 M 86 52 L 114 52 M 62 88 C 80 76 120 76 138 88',
  },
  bangle: {
    title: 'Bangle, hollow',
    outline:
      'M 100 30 C 142 30 176 66 176 106 C 176 146 142 178 100 178 C 58 178 24 146 24 106 C 24 66 58 30 100 30 Z',
    detail:
      'M 100 52 C 130 52 154 76 154 106 C 154 136 130 156 100 156 C 70 156 46 136 46 106 C 46 76 70 52 100 52 Z',
  },
};

/**
 * A drawing being made in silverpoint, as the page is scrolled.
 *
 * Silverpoint is a silver stylus dragged across a ground of bone ash and gum.
 * It is what everybody drew with before graphite arrived in the sixteenth
 * century, and it is worth showing on a jeweller's site for one reason: it is
 * the only drawing medium that behaves like the material it is used to draw.
 *
 * Two of its properties decide how this is animated, and both are unusual:
 *
 *   1. **It cannot be erased.** The stylus abrades silver into the ground and
 *      nothing takes it out again. So there is no correction, no rubbing back,
 *      and a drawing is built as a sequence of committed lines. Which is why
 *      this draws forward only, and why the outline completes before the
 *      shading starts rather than the two arriving together.
 *   2. **It cannot be made darker by pressing harder.** The stylus lays down a
 *      fixed amount of metal per pass. Tone comes from *more lines*, never from
 *      more pressure. That is the reason the shading here is a mask sliding over
 *      a hatch field rather than an opacity ramp — an opacity ramp would be a
 *      drawing fading in, and what actually happens is an unfinished drawing
 *      getting more lines in it.
 *
 * The last property is the one that makes it a jeweller's medium rather than a
 * curiosity. Silverpoint *tarnishes*. A drawing made today is grey and, over
 * about six months, it warms into a soft brown as the silver oxidises — the
 * same reaction, on paper, that is happening on the piece it describes.
 */
export default function SilverpointSketch({
  subject = 'ring',
  className = '',
  caption,
}: SilverpointSketchProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const spec = SUBJECTS[subject];

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'end 0.4'],
  });

  // Outline first and complete, then detail, then tone. Three ranges rather than
  // one, because a draughtsman does not do all three at once.
  const outline = useTransform(scrollYProgress, [0, 0.42], [0, 1]);
  const detail = useTransform(scrollYProgress, [0.36, 0.7], [0, 1]);
  const hatch = useTransform(scrollYProgress, [0.62, 1], ['0%', '100%']);
  // The tarnish. Six months of oxidation, compressed into the last of the
  // scroll — grey to warm brown, which is what silverpoint actually does.
  const tarnish = useTransform(scrollYProgress, [0.7, 1], [0, 1]);
  const hue = useTransform(tarnish, (t) => `sepia(${t * 0.55}) saturate(${1 + t * 0.5})`);

  return (
    <figure ref={ref} className={className}>
      <div className="paper-stock relative overflow-hidden rounded-sm px-6 py-8 shadow-lift">
        <motion.svg
          viewBox="0 0 200 200"
          className="mx-auto block h-auto w-full max-w-xs"
          style={reduced ? undefined : { filter: hue }}
          aria-label={`${spec.title}, drawn in silverpoint`}
          role="img"
        >
          {/* The ground. A prepared sheet is not white — it is a warm, slightly
              gritty off-white, and a silverpoint line on true white looks like
              a pencil line. */}
          <rect width="200" height="200" fill="rgb(var(--cream-100))" fillOpacity={0.5} />

          {/* Construction lines, laid first and left in. Nobody erases them in
              silverpoint because nobody can, and every surviving Renaissance
              sheet has them. */}
          <g stroke="rgb(var(--ink-400))" strokeOpacity={0.28} strokeWidth={0.5}>
            <line x1="100" y1="8" x2="100" y2="192" />
            <line x1="8" y1="112" x2="192" y2="112" />
          </g>

          {/* The tone, under the line work. Hatching goes down before the final
              contour is strengthened, which is the order that keeps the contour
              from being buried. */}
          <motion.foreignObject x="20" y="20" width="160" height="160" style={{ opacity: 0.5 }}>
            <motion.div
              className="silverpoint-hatch h-full w-full"
              style={
                reduced
                  ? { ['--hatch' as string]: '100%' }
                  : { ['--hatch' as string]: hatch }
              }
            />
          </motion.foreignObject>

          <motion.path
            d={spec.outline}
            fill="none"
            stroke="rgb(var(--ink-600))"
            strokeWidth={1.4}
            strokeLinecap="round"
            style={reduced ? { pathLength: 1 } : { pathLength: outline }}
          />

          <motion.path
            d={spec.detail}
            fill="none"
            stroke="rgb(var(--ink-500))"
            strokeWidth={1}
            strokeLinecap="round"
            style={reduced ? { pathLength: 1 } : { pathLength: detail }}
          />
        </motion.svg>

        <p className="mt-4 text-center font-accent text-[9px] uppercase tracking-luxe text-faint">
          {spec.title} · silverpoint on prepared ground
        </p>
      </div>

      <figcaption className="mt-3 max-w-xl font-sans text-sm font-light leading-relaxed text-muted">
        {caption ??
          'Silver on bone ash. It cannot be erased, it cannot be pressed darker, and over about six months it warms from grey to brown as the line tarnishes — the same reaction, on paper, that is happening on the piece it describes.'}
      </figcaption>
    </figure>
  );
}
