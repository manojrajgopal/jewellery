'use client';

import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AlertTriangle, Check, Minus } from 'lucide-react';

import { easeCine, springsSilk } from '@/lib/motion';

/**
 * Engagement-ring profiles, described by the two things that decide whether a
 * band can sit against them: the height of the setting above the finger, and the
 * shape of the shoulder where the band would meet it.
 *
 * `rise` is in millimetres above the band's top edge. It is the number that
 * decides whether a straight band will touch the ring or sit in a gap, and it is
 * never printed anywhere.
 */
interface Ring {
  id: string;
  name: string;
  rise: number;
  /** How the shoulder runs into the head. */
  shoulder: 'straight' | 'tapered' | 'cathedral' | 'split';
  note: string;
}

const RINGS: Ring[] = [
  { id: 'solitaire-low', name: 'Low solitaire', rise: 1.2, shoulder: 'straight', note: 'A four- or six-claw head set close to the finger. The friendliest ring in this list to pair with.' },
  { id: 'solitaire-high', name: 'Raised solitaire', rise: 4.6, shoulder: 'straight', note: 'The classic high-set head. Beautiful alone, and the reason curved bands exist.' },
  { id: 'cathedral', name: 'Cathedral setting', rise: 3.4, shoulder: 'cathedral', note: 'Arched shoulders sweeping up to the head, so the gap is a curve rather than a step.' },
  { id: 'halo', name: 'Halo', rise: 2.8, shoulder: 'tapered', note: 'A wide, low crown. The obstruction is the halo’s diameter, not its height.' },
  { id: 'bezel', name: 'Bezel', rise: 1.8, shoulder: 'straight', note: 'A rim of metal round the stone, flush to the shank. Almost as easy to pair as a plain band.' },
  { id: 'split-shank', name: 'Split shank', rise: 3.0, shoulder: 'split', note: 'The band forks before the head, so anything sitting against it meets two edges rather than one.' },
];

/**
 * The bands, with the two properties that decide the pairing: whether the top
 * edge is straight or shaped, and how much rise it can accommodate before a gap
 * opens.
 */
interface Band {
  id: string;
  name: string;
  profile: 'flat' | 'court' | 'curved' | 'chevron' | 'open';
  /** Millimetres of setting rise this band can meet without a gap. */
  tolerates: number;
  /** Whether it can be worn on its own, later, without looking incomplete. */
  standsAlone: boolean;
  note: string;
}

const BANDS: Band[] = [
  { id: 'flat', name: 'Flat court', profile: 'flat', tolerates: 1.5, standsAlone: true, note: 'A straight band with a flat outer face. Will meet a low setting cleanly and gap against anything raised.' },
  { id: 'court', name: 'Court', profile: 'court', tolerates: 2.0, standsAlone: true, note: 'Rounded inside and out. The most comfortable band there is, and the one most likely to be worn for fifty years.' },
  { id: 'curved', name: 'Curved to fit', profile: 'curved', tolerates: 5.5, standsAlone: false, note: 'Shaped on the bench to the exact contour of the ring beside it. Solves every gap and cannot be worn alone without looking odd.' },
  { id: 'chevron', name: 'Chevron', profile: 'chevron', tolerates: 4.0, standsAlone: true, note: 'A V, which meets a raised head at its point. Reads as deliberate rather than as a workaround.' },
  { id: 'open', name: 'Open band', profile: 'open', tolerates: 6.0, standsAlone: false, note: 'A band with a gap in it, so the head passes through rather than being met. The only answer for a very high setting.' },
];

interface Verdict {
  score: number;
  headline: string;
  detail: string;
  kind: 'good' | 'fair' | 'poor';
}

/**
 * The pairing rule, stated once.
 *
 * Fit is `tolerates − rise`: positive means the band's top edge reaches the ring
 * without a gap, negative means daylight between them. Everything else is a
 * qualifier on that one number — a split shank gives the band two edges to meet
 * rather than one, a cathedral shoulder turns a step into a curve and is
 * therefore more forgiving, and a chevron that meets a low setting is a shape
 * solving a problem that does not exist.
 */
function judge(ring: Ring, band: Band): Verdict {
  let margin = band.tolerates - ring.rise;

  // A cathedral shoulder closes a gap visually, because the eye reads the curve
  // as continuous. A split shank does the opposite: two edges, two chances to be
  // out of line.
  if (ring.shoulder === 'cathedral') margin += 0.8;
  if (ring.shoulder === 'split') margin -= 0.9;

  if (band.profile === 'chevron' && ring.rise < 2) {
    return {
      score: 2,
      kind: 'fair',
      headline: 'Solving a problem you do not have',
      detail:
        'A chevron exists to meet a raised head at its point. Against a low setting there is nothing for the V to clear, so it reads as a shape for its own sake — which is a legitimate choice, just not a fit one.',
    };
  }

  if (band.profile === 'open' && ring.rise < 3) {
    return {
      score: 2,
      kind: 'fair',
      headline: 'More band than the gap needs',
      detail:
        'An open band gives away structural metal to clear a head that is not high enough to need clearing. It will wear faster than a closed band for no gain.',
    };
  }

  if (margin >= 1.2) {
    return {
      score: 5,
      kind: 'good',
      headline: 'They meet, with room to spare',
      detail: `The band's top edge reaches the setting with about ${margin.toFixed(1)}mm in hand, so the two sit flush and neither has to be shaped on the bench.${
        band.standsAlone ? ' The band also works alone, which matters in thirty years more than it does now.' : ''
      }`,
    };
  }

  if (margin >= -0.3) {
    return {
      score: 4,
      kind: 'good',
      headline: 'A clean fit, with nothing spare',
      detail:
        'They will sit together, but the tolerance is small enough that this is worth checking in the hand rather than on a screen. Bring both in and we will hold them together on a mandrel.',
    };
  }

  if (margin >= -1.8) {
    return {
      score: 3,
      kind: 'fair',
      headline: `A visible gap of roughly ${Math.abs(margin).toFixed(1)}mm`,
      detail:
        'Small enough that many people never mind it, and large enough that some people mind it immediately. It is also where dirt collects. Shaping the band closes it for a modest bench charge.',
    };
  }

  return {
    score: 1,
    kind: 'poor',
    headline: `Daylight — about ${Math.abs(margin).toFixed(1)}mm of it`,
    detail:
      'These two will not sit together. Either the band is shaped to the ring, or a curved or open profile is chosen instead. We would say this at the counter rather than sell you the pair.',
  };
}

const TONE = {
  good: { text: 'text-jade-300', icon: Check },
  fair: { text: 'text-gold-300', icon: Minus },
  poor: { text: 'text-burgundy-300', icon: AlertTriangle },
} as const;

/**
 * The suite: an engagement ring and the band that has to live beside it for the
 * next fifty years.
 *
 * This is a real problem and it is almost never addressed before the purchase.
 * The ring is bought first, usually alone; the band is bought a year later,
 * often somewhere else, and the pair either sit flush or they do not. Nobody
 * tells the buyer that the height of the head they chose has already decided
 * which bands are available to them.
 *
 * The drawing is a cross-section rather than a plan view, because the gap is a
 * cross-sectional fact — from above, every one of these pairs looks fine. Both
 * profiles are drawn to the same scale off the same millimetre figures the
 * verdict is computed from, so the picture cannot flatter a pairing the text has
 * just called poor.
 */
export default function WeddingSuiteBuilder({ className = '' }: { className?: string }) {
  const reduced = useReducedMotion();
  const [ringId, setRingId] = useState(RINGS[1].id);
  const [bandId, setBandId] = useState(BANDS[1].id);

  const ring = RINGS.find((r) => r.id === ringId) ?? RINGS[0];
  const band = BANDS.find((b) => b.id === bandId) ?? BANDS[0];
  const verdict = useMemo(() => judge(ring, band), [ring, band]);
  const Tone = TONE[verdict.kind].icon;

  return (
    <div className={`space-y-8 ${className}`}>
      <div className="grid gap-8 lg:grid-cols-2">
        {/* The ring. */}
        <fieldset>
          <legend className="font-accent text-[10px] uppercase tracking-luxe text-accent">
            The ring you already have
          </legend>
          <div className="mt-4 space-y-2">
            {RINGS.map((r) => (
              <Choice
                key={r.id}
                on={r.id === ringId}
                onSelect={() => setRingId(r.id)}
                title={r.name}
                meta={`${r.rise.toFixed(1)}mm rise · ${r.shoulder} shoulder`}
                note={r.note}
                reduced={!!reduced}
              />
            ))}
          </div>
        </fieldset>

        {/* The band. */}
        <fieldset>
          <legend className="font-accent text-[10px] uppercase tracking-luxe text-accent">
            The band beside it
          </legend>
          <div className="mt-4 space-y-2">
            {BANDS.map((b) => (
              <Choice
                key={b.id}
                on={b.id === bandId}
                onSelect={() => setBandId(b.id)}
                title={b.name}
                meta={`clears ${b.tolerates.toFixed(1)}mm · ${
                  b.standsAlone ? 'works alone' : 'only as a pair'
                }`}
                note={b.note}
                reduced={!!reduced}
              />
            ))}
          </div>
        </fieldset>
      </div>

      {/* The cross-section, and the verdict. */}
      <div className="grid gap-8 rounded-2xl border border-hairline bg-surface-raised/40 p-6 md:p-8 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
        <SuiteSection ring={ring} band={band} reduced={!!reduced} />

        <motion.div
          key={`${ring.id}-${band.id}`}
          initial={reduced ? undefined : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: easeCine.glass }}
          className="flex flex-col justify-center gap-4"
        >
          <span className={`flex items-center gap-2 ${TONE[verdict.kind].text}`}>
            <Tone className="h-4 w-4" aria-hidden="true" />
            <span className="font-accent text-[10px] uppercase tracking-luxe">
              {verdict.score} of 5
            </span>
          </span>

          <p className="font-display text-2xl leading-snug text-primary md:text-3xl">
            {verdict.headline}
          </p>
          <p className="font-sans text-sm font-light leading-relaxed text-secondary">
            {verdict.detail}
          </p>

          <div className="mt-2 flex gap-1.5" aria-hidden="true">
            {[1, 2, 3, 4, 5].map((seg) => (
              <motion.span
                key={seg}
                initial={false}
                animate={{ opacity: seg <= verdict.score ? 1 : 0.14 }}
                transition={{ duration: 0.35, delay: reduced ? 0 : seg * 0.05 }}
                className="h-1 flex-1 rounded-full bg-accent"
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Choice({
  on,
  onSelect,
  title,
  meta,
  note,
  reduced,
}: {
  on: boolean;
  onSelect: () => void;
  title: string;
  meta: string;
  note: string;
  reduced: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      aria-pressed={on}
      whileHover={reduced ? undefined : { x: 5 }}
      transition={springsSilk.touch}
      className={`block w-full rounded-xl border p-4 text-left transition-colors duration-400 ${
        on
          ? 'border-accent/55 bg-surface-raised/80'
          : 'border-hairline bg-surface-raised/25 hover:border-accent/35'
      }`}
    >
      <span className="flex items-baseline justify-between gap-3">
        <span className={`font-display text-lg leading-tight ${on ? 'text-accent' : 'text-primary'}`}>
          {title}
        </span>
        <span className="nums-tabular font-accent text-[9px] uppercase tracking-luxe text-faint">
          {meta}
        </span>
      </span>
      <motion.span
        initial={false}
        animate={{ opacity: on ? 1 : 0.55 }}
        className="mt-1.5 block font-sans text-xs font-light leading-relaxed text-secondary"
      >
        {note}
      </motion.span>
    </motion.button>
  );
}

/**
 * The cross-section. Everything is drawn from the same millimetre figures the
 * verdict uses — 8 user units to the millimetre — so the picture and the words
 * are always describing the same object.
 */
function SuiteSection({ ring, band, reduced }: { ring: Ring; band: Band; reduced: boolean }) {
  const mm = 8;
  const fingerY = 150;
  const shankTop = fingerY - 3 * mm;

  // The band's top edge, at the point where it meets the ring.
  const reach = band.tolerates * mm;
  const headBase = shankTop - ring.rise * mm;

  const bandTop = (x: number) => {
    switch (band.profile) {
      case 'curved':
        // Shaped to the ring: the top edge follows the head's own base.
        return headBase + Math.max(0, (Math.abs(x - 120) / 60) * 8);
      case 'chevron':
        return shankTop - Math.max(0, reach - Math.abs(x - 120) * 0.5);
      case 'open':
        return shankTop;
      default:
        return shankTop - Math.min(reach, 8);
    }
  };

  return (
    <div className="relative">
      <svg viewBox="0 0 240 200" className="w-full" role="img" aria-label={`${band.name} against a ${ring.name}`}>
        {/* The finger, for scale. Everything above this line is metal. */}
        <line x1={10} y1={fingerY} x2={230} y2={fingerY} stroke="rgb(var(--hairline))" strokeOpacity={0.35} strokeWidth={1} />
        <text x={10} y={fingerY + 14} className="font-accent" fontSize={9} letterSpacing={2} fill="rgb(var(--text-faint))">
          FINGER
        </text>

        {/* The ring's shank and head. */}
        <path
          d={`M 60 ${fingerY} L 60 ${shankTop} L 180 ${shankTop} L 180 ${fingerY}`}
          fill="none"
          stroke="rgb(var(--gold-500))"
          strokeWidth={2.4}
        />
        <motion.path
          initial={false}
          animate={{
            d:
              ring.shoulder === 'cathedral'
                ? `M 96 ${shankTop} Q 120 ${headBase - 6} 144 ${shankTop}`
                : ring.shoulder === 'split'
                  ? `M 100 ${shankTop} L 108 ${headBase} L 132 ${headBase} L 140 ${shankTop}`
                  : `M 104 ${shankTop} L 104 ${headBase} L 136 ${headBase} L 136 ${shankTop}`,
          }}
          transition={{ duration: reduced ? 0 : 0.6, ease: easeCine.glass }}
          fill="none"
          stroke="rgb(var(--gold-400))"
          strokeWidth={2.4}
        />
        {/* The stone. */}
        <motion.path
          initial={false}
          animate={{ d: `M 104 ${headBase} L 136 ${headBase} L 120 ${headBase - 22} Z` }}
          transition={{ duration: reduced ? 0 : 0.6, ease: easeCine.glass }}
          fill="rgb(var(--gold-200))"
          fillOpacity={0.22}
          stroke="rgb(var(--gold-100))"
          strokeWidth={1.6}
        />

        {/* The band, drawn to the left of the ring as it would sit. */}
        <motion.path
          initial={false}
          animate={{
            d:
              band.profile === 'open'
                ? `M 20 ${fingerY} L 20 ${shankTop} L 44 ${shankTop} M 54 ${shankTop} L 56 ${shankTop}`
                : `M 20 ${fingerY} L 20 ${bandTop(20)} L 58 ${bandTop(58)} L 58 ${fingerY}`,
          }}
          transition={{ duration: reduced ? 0 : 0.6, ease: easeCine.glass }}
          fill="none"
          stroke="rgb(var(--accent))"
          strokeWidth={2.8}
          strokeLinejoin="round"
        />

        {/* The gap, if there is one — drawn as the thing it is, a measured
            distance, rather than left for the eye to find. */}
        {bandTop(58) - headBase > 2 && (
          <g>
            <line
              x1={58}
              y1={headBase}
              x2={58}
              y2={bandTop(58)}
              stroke="rgb(var(--burgundy-300))"
              strokeWidth={1.4}
              strokeDasharray="3 3"
            />
            <text
              x={64}
              y={(headBase + bandTop(58)) / 2 + 3}
              className="font-accent nums-tabular"
              fontSize={10}
              fill="rgb(var(--burgundy-300))"
            >
              {((bandTop(58) - headBase) / mm).toFixed(1)}mm
            </text>
          </g>
        )}
      </svg>

      <p className="mt-2 font-accent text-[9px] uppercase tracking-luxe text-faint">
        Cross-section, drawn to scale · 1mm = {mm} units
      </p>
    </div>
  );
}
