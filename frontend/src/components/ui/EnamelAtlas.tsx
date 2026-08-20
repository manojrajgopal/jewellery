'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { easeCine } from '@/lib/motion';

/**
 * The five enamels, and why four of them nearly died out.
 *
 * Enamel is glass fused to metal at around 800°C, and it is the only decorative
 * technique in the trade where the *maker* takes all the risk: the piece is
 * finished, engraved, set up and complete before it goes into the kiln, and if
 * the enamel crazes it is gone. There is no repair. That single fact explains
 * everything about the craft's economics — including why plique-à-jour, which is
 * enamel with no metal behind it at all, is now practised by perhaps a few dozen
 * people in the world.
 *
 * Each technique is drawn rather than photographed. The drawing is the
 * explanation: the difference between cloisonné and champlevé is entirely a
 * question of whether the walls holding the glass were *added* to the surface or
 * *carved out* of it, and no photograph of a finished piece can show you that,
 * because the finished pieces look identical.
 *
 * The firing count is the number that costs money. Each colour has its own
 * melting point and they have to be fired hottest-first, so a six-colour
 * cloisonné panel goes through the kiln six times — and every single firing is
 * another chance to lose the whole piece.
 */
interface Technique {
  id: string;
  name: string;
  french: string;
  /** Kiln passes for a typical piece. */
  firings: [number, number];
  /** Failure rate at the bench, as a percentage of pieces started. */
  loss: number;
  /** Living practitioners, order of magnitude. The honest scarcity figure. */
  practitioners: string;
  principle: string;
  detail: string;
  /** Whether we take commissions in it. */
  offered: 'yes' | 'limited' | 'no';
}

const TECHNIQUES: Technique[] = [
  {
    id: 'cloisonne',
    name: 'Cloisonné',
    french: 'partitioned',
    firings: [4, 8],
    loss: 12,
    practitioners: 'hundreds',
    principle:
      'Fine wire is bent to the drawing and soldered upright onto the surface, making cells. The cells are filled with ground glass and fired.',
    detail:
      'The wires stay visible in the finished piece as bright lines between the colours, which is how you identify it. Every wire has to be soldered without moving the ones already placed — a panel the size of a thumbnail can take forty separate wires and a full day before any glass goes near it.',
    offered: 'yes',
  },
  {
    id: 'champleve',
    name: 'Champlevé',
    french: 'raised field',
    firings: [3, 6],
    loss: 8,
    practitioners: 'thousands',
    principle:
      'Cells are cut *down into* the metal with a graver, leaving the walls standing as part of the original surface. Then filled and fired.',
    detail:
      'Structurally the stronger of the two, because there is no solder anywhere and the walls are solid metal rather than wire. It also needs thicker stock to carve into, so a champlevé piece is heavier than a cloisonné one of the same size — which is a reliable way to tell them apart by hand.',
    offered: 'yes',
  },
  {
    id: 'guilloche',
    name: 'Guilloché',
    french: 'engine-turned',
    firings: [1, 2],
    loss: 18,
    practitioners: 'dozens',
    principle:
      'A geometric pattern is cut into the metal by a rose engine, then covered with a single layer of *transparent* enamel so the pattern shows through and moves as the piece turns.',
    detail:
      'The technique the Fabergé workshop is known for, and the one most dependent on a machine nobody makes any more. A working rose engine is a nineteenth-century lathe with a rocking headstock; there are perhaps a few hundred left in working order and no new ones. The enamel itself is the easy part.',
    offered: 'limited',
  },
  {
    id: 'plique',
    name: 'Plique-à-jour',
    french: 'letting in daylight',
    firings: [4, 9],
    loss: 45,
    practitioners: 'a few dozen',
    principle:
      'Cells with no backing at all. The enamel is held only by surface tension against the cell walls and light passes straight through it, like a miniature stained-glass window.',
    detail:
      'Nearly half of all attempts fail, because there is nothing supporting the glass — it is fired on a temporary mica backing that is peeled away afterwards, and the piece either holds or it does not. This is the reason Art Nouveau plique-à-jour sells for what it does: almost nobody will take the risk on commission, and we will only take it on a piece where we have agreed in advance what happens if it fails.',
    offered: 'limited',
  },
  {
    id: 'basse-taille',
    name: 'Basse-taille',
    french: 'low cut',
    firings: [2, 4],
    loss: 15,
    practitioners: 'hundreds',
    principle:
      'The metal underneath is carved in low relief — deeper where the colour should read darker — and then flooded with translucent enamel of a single colour.',
    detail:
      'One colour, and the whole tonal range comes from how deep the carving is under it, because a thicker layer of the same glass reads darker. It is the only enamel technique where the modelling is done entirely before any colour exists, which means the carver has to work in a tonal scale they cannot see until the kiln has been and gone.',
    offered: 'yes',
  },
];

/** The cell geometry each technique produces, drawn in section. */
function Section({ id, reduced }: { id: string; reduced: boolean }) {
  const stroke = 'rgb(var(--gold-500))';
  const glass = 'rgb(var(--jade-500))';

  /* One SVG per technique rather than a parameterised drawing. These five
     sections differ in what they *are*, not in a value — a single drawing with
     a switch in it would end up drawing none of them properly. */
  const draw = () => {
    switch (id) {
      case 'cloisonne':
        return (
          <>
            {/* Base plate */}
            <rect x={10} y={54} width={200} height={14} fill={stroke} fillOpacity={0.85} />
            {/* Wires standing on it */}
            {[40, 80, 120, 160].map((x) => (
              <rect key={x} x={x} y={30} width={4} height={24} fill={stroke} />
            ))}
            {/* Glass in the cells */}
            {[44, 84, 124].map((x, i) => (
              <motion.rect
                key={x}
                x={x}
                y={34}
                width={36}
                height={20}
                fill={glass}
                fillOpacity={0.5 + i * 0.12}
                initial={reduced ? false : { height: 0, y: 54 }}
                animate={{ height: 20, y: 34 }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: easeCine.glass }}
              />
            ))}
            <text x={10} y={88} fill="rgb(var(--text-faint))" fontSize={8} letterSpacing={1.6}>
              WIRE SOLDERED ON — WALLS SIT ABOVE THE PLATE
            </text>
          </>
        );
      case 'champleve':
        return (
          <>
            {/* Thick stock with cells carved out of it */}
            <path
              d="M 10 30 L 40 30 L 40 48 L 76 48 L 76 30 L 112 30 L 112 48 L 148 48 L 148 30 L 210 30 L 210 68 L 10 68 Z"
              fill={stroke}
              fillOpacity={0.85}
            />
            {[40, 112].map((x, i) => (
              <motion.rect
                key={x}
                x={x}
                y={48}
                width={36}
                height={0}
                fill={glass}
                fillOpacity={0.55 + i * 0.15}
                initial={reduced ? false : { height: 0, y: 68 }}
                animate={{ height: 20, y: 48 }}
                transition={{ duration: 0.6, delay: i * 0.14, ease: easeCine.glass }}
              />
            ))}
            <text x={10} y={88} fill="rgb(var(--text-faint))" fontSize={8} letterSpacing={1.6}>
              CELLS CARVED DOWN — WALLS ARE THE ORIGINAL SURFACE
            </text>
          </>
        );
      case 'guilloche':
        return (
          <>
            {/* Engine-turned surface: a wave cut into the metal */}
            <path
              d="M 10 56 Q 22 44 34 56 Q 46 68 58 56 Q 70 44 82 56 Q 94 68 106 56 Q 118 44 130 56 Q 142 68 154 56 Q 166 44 178 56 Q 190 68 202 56 L 210 56 L 210 70 L 10 70 Z"
              fill={stroke}
              fillOpacity={0.85}
            />
            {/* One transparent layer over it */}
            <motion.rect
              x={10}
              y={34}
              width={200}
              height={22}
              fill={glass}
              fillOpacity={0.32}
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: easeCine.glass }}
            />
            <text x={10} y={88} fill="rgb(var(--text-faint))" fontSize={8} letterSpacing={1.6}>
              ONE TRANSPARENT LAYER OVER A TURNED PATTERN
            </text>
          </>
        );
      case 'plique':
        return (
          <>
            {/* Walls only — no plate at all */}
            {[40, 80, 120, 160].map((x) => (
              <rect key={x} x={x} y={30} width={4} height={30} fill={stroke} />
            ))}
            {[44, 84, 124].map((x, i) => (
              <motion.rect
                key={x}
                x={x}
                y={30}
                width={36}
                height={30}
                fill={glass}
                fillOpacity={0.28}
                initial={reduced ? false : { opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 30 }}
                transition={{ duration: 0.7, delay: i * 0.14, ease: easeCine.glass }}
              />
            ))}
            {/* Light coming through from behind, which is the entire point */}
            {!reduced &&
              [50, 90, 130].map((x, i) => (
                <motion.line
                  key={x}
                  x1={x + 14}
                  y1={62}
                  x2={x + 14}
                  y2={80}
                  stroke="rgb(var(--gold-200))"
                  strokeWidth={1}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.8, 0.3] }}
                  transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.4 }}
                />
              ))}
            <text x={10} y={94} fill="rgb(var(--text-faint))" fontSize={8} letterSpacing={1.6}>
              NO BACKING — LIGHT PASSES THROUGH THE GLASS
            </text>
          </>
        );
      default:
        return (
          <>
            {/* Relief carved to varying depths under one flood of colour */}
            <path
              d="M 10 68 L 10 52 L 46 42 L 82 58 L 118 36 L 154 54 L 190 46 L 210 56 L 210 68 Z"
              fill={stroke}
              fillOpacity={0.85}
            />
            <motion.rect
              x={10}
              y={32}
              width={200}
              height={36}
              fill={glass}
              fillOpacity={0.4}
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: easeCine.glass }}
            />
            <text x={10} y={88} fill="rgb(var(--text-faint))" fontSize={8} letterSpacing={1.6}>
              ONE COLOUR — TONE COMES FROM THE DEPTH BENEATH IT
            </text>
          </>
        );
    }
  };

  return (
    <svg viewBox="0 0 220 100" className="w-full" role="img" aria-label="Section through the enamel">
      {draw()}
    </svg>
  );
}

export default function EnamelAtlas() {
  const [id, setId] = useState('plique');
  const reduced = useReducedMotion();
  const t = TECHNIQUES.find((x) => x.id === id)!;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Enamel techniques">
        {TECHNIQUES.map((x) => {
          const on = x.id === id;
          return (
            <button
              key={x.id}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setId(x.id)}
              className={`rounded-full border px-5 py-2 font-accent text-[10px] uppercase tracking-luxe transition-colors duration-300 ${
                on
                  ? 'border-accent bg-accent text-onaccent'
                  : 'border-hairline text-muted hover:border-accent/50 hover:text-accent'
              }`}
            >
              {x.name}
            </button>
          );
        })}
      </div>

      <motion.div
        key={t.id}
        initial={reduced ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: easeCine.glass }}
        className="mt-10 grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-14"
      >
        {/* The section drawing — the actual explanation. */}
        <div>
          <div className="rounded-2xl border border-hairline bg-surface-sunken/60 p-6">
            <Section id={t.id} reduced={!!reduced} />
          </div>

          {/* The three numbers that decide whether it can be commissioned. */}
          <dl className="mt-6 grid grid-cols-3 gap-4">
            <div>
              <dt className="font-accent text-[9px] uppercase tracking-luxe text-faint">
                Kiln passes
              </dt>
              <dd className="nums-instrument mt-1 font-display text-2xl text-primary">
                {t.firings[0]}&ndash;{t.firings[1]}
              </dd>
            </div>
            <div>
              <dt className="font-accent text-[9px] uppercase tracking-luxe text-faint">
                Lost at the bench
              </dt>
              <dd className="nums-instrument mt-1 font-display text-2xl text-accent">{t.loss}%</dd>
            </div>
            <div>
              <dt className="font-accent text-[9px] uppercase tracking-luxe text-faint">
                Still practising
              </dt>
              <dd className="mt-1 font-display text-lg leading-tight text-primary">
                {t.practitioners}
              </dd>
            </div>
          </dl>

          {/* Loss rate as a bar, because 45% next to 8% in the same typeface does
              not land until you see the length of it. */}
          <div className="mt-5">
            <span className="block h-1 rounded-full bg-line/50">
              <motion.span
                className="block h-full rounded-full bg-burgundy-500"
                initial={false}
                animate={{ width: `${t.loss * 2}%` }}
                transition={reduced ? { duration: 0 } : { duration: 0.6, ease: easeCine.glass }}
              />
            </span>
            <p className="mt-2 font-accent text-[9px] uppercase tracking-luxe text-faint">
              proportion of pieces lost in the kiln — there is no repair
            </p>
          </div>
        </div>

        <div>
          <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
            {t.french}
          </p>
          <h3 className="mt-2 font-display text-3xl text-primary">{t.name}</h3>

          <p className="mt-5 font-display text-lg italic leading-snug text-primary">
            {t.principle}
          </p>

          <p className="mt-5 font-sans text-base font-light leading-relaxed text-muted">
            {t.detail}
          </p>

          <p className="mt-6 inline-flex items-baseline gap-3 rounded-full border border-hairline px-4 py-2">
            <span className="font-accent text-[9px] uppercase tracking-luxe text-faint">
              Commissions
            </span>
            <span
              className={`font-accent text-[10px] uppercase tracking-luxe ${
                t.offered === 'yes'
                  ? 'text-jade-500'
                  : t.offered === 'limited'
                    ? 'text-accent'
                    : 'text-burgundy-500'
              }`}
            >
              {t.offered === 'yes'
                ? 'Open'
                : t.offered === 'limited'
                  ? 'By discussion only'
                  : 'Not offered'}
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
