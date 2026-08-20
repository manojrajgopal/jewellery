'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Seven traditions, where each one is from, and which of them are nearly gone.
 *
 * This house is in Bombay and has been since 1892, which means almost
 * everything it knows came from somewhere else in this country and was carried
 * here by somebody. Saying "heritage" without naming those places is the polite
 * version of taking credit for them, so this names them: the town, the century,
 * the technique, and — the field that makes the panel worth building — how many
 * people can still do it.
 *
 * The `holders` figure is the uncomfortable one and it is deliberately
 * uncomfortable. Thewa is practised by a handful of families in one town in
 * Rajasthan and has been for three hundred years. Genuine Jadau setting, done
 * with pure gold foil and no solder, is a skill measured in workshops rather
 * than in people. A trade that cannot say these numbers out loud is a trade
 * that will discover them by their absence.
 *
 * The motifs are drawn rather than photographed, as flat SVG patterns on the
 * house's own palette. That is a deliberate limit: these are diagrams of a
 * structure, not reproductions of anybody's work, and a diagram cannot be
 * mistaken for a claim to own the thing it describes.
 */

interface Tradition {
  id: string;
  name: string;
  place: string;
  century: string;
  /** How many practitioners are left, said plainly. */
  holders: string;
  /** 1 thriving, 5 nearly gone. Drives the meter, never colour alone. */
  fragility: number;
  technique: string;
  tell: string;
  /** The motif, as an SVG fragment on a 100 × 100 box. */
  motif: React.ReactNode;
}

const TRADITIONS: Tradition[] = [
  {
    id: 'temple',
    name: 'Temple',
    place: 'Thanjavur and Madurai, Tamil Nadu',
    century: 'Ninth century onward',
    holders: 'Several hundred, and the number is stable',
    fragility: 2,
    technique:
      'Repoussé in high-karat gold: the form is raised from the back with punches against a pitch bowl, so the piece is hollow and light for its size. Deities and temple architecture, rendered at a scale a person can wear.',
    tell: 'Turn it over. A genuine repoussé piece is a negative of its own front — every raised detail is a hollow on the reverse. A cast copy is flat behind and weighs half again as much.',
    motif: (
      <>
        <path
          d="M50 14 L60 34 L82 37 L66 52 L70 74 L50 63 L30 74 L34 52 L18 37 L40 34 Z"
          fill="rgb(var(--gold-400))"
          fillOpacity={0.4}
          stroke="rgb(var(--gold-500))"
          strokeWidth={1.4}
        />
        <path d="M32 82 Q50 92 68 82" stroke="rgb(var(--gold-500))" strokeWidth={1.6} fill="none" />
        <circle cx={50} cy={45} r={7} fill="rgb(var(--burgundy-500))" fillOpacity={0.7} />
      </>
    ),
  },
  {
    id: 'kundan',
    name: 'Kundan',
    place: 'Jaipur and Delhi',
    century: 'Sixteenth, from the Mughal court',
    holders: 'Thousands, though far fewer working in pure gold',
    fragility: 2,
    technique:
      'Stones set with no claws and no solder. Strips of 24K gold foil are pressed round the stone at room temperature until the metal cold-welds to itself — pure gold is the only metal that will do this, which is why the technique cannot be done in 22K.',
    tell: 'The setting line should be a continuous mirror-bright band with no join visible under a loupe. If you can see a seam, it is foil over a base rather than kundan.',
    motif: (
      <>
        <rect x={26} y={26} width={48} height={48} rx={6} fill="none" stroke="rgb(var(--gold-500))" strokeWidth={2} />
        <rect x={34} y={34} width={32} height={32} rx={4} fill="rgb(var(--jade-500))" fillOpacity={0.5} stroke="rgb(var(--gold-300))" strokeWidth={1.6} />
        {[20, 50, 80].map((p) => (
          <circle key={p} cx={p} cy={14} r={4} fill="rgb(var(--gold-400))" fillOpacity={0.7} />
        ))}
        {[20, 50, 80].map((p) => (
          <circle key={`b-${p}`} cx={p} cy={86} r={4} fill="rgb(var(--gold-400))" fillOpacity={0.7} />
        ))}
      </>
    ),
  },
  {
    id: 'meenakari',
    name: 'Meenakari',
    place: 'Jaipur, brought from Lahore in 1590',
    century: 'Sixteenth',
    holders: 'A few hundred, concentrated in one city',
    fragility: 3,
    technique:
      'Vitreous enamel fused into engraved cells at around 800°C. The colours go in hardest first and coolest last, because every firing re-melts everything below it — so a five-colour piece is five trips to the kiln in a fixed order, and a mistake on the fourth destroys the first three.',
    tell: 'Look at the back of a good Jaipur piece. The enamel is on the reverse, where only the wearer sees it, which is the entire philosophy of the craft in one detail.',
    motif: (
      <>
        <circle cx={50} cy={50} r={34} fill="none" stroke="rgb(var(--gold-500))" strokeWidth={2} />
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const a = (i / 6) * Math.PI * 2;
          const tones = ['--jade-500', '--burgundy-500', '--amethyst-500', '--gold-400', '--jade-700', '--rose-500'];
          return (
            <circle
              key={i}
              cx={50 + Math.cos(a) * 19}
              cy={50 + Math.sin(a) * 19}
              r={9}
              fill={`rgb(var(${tones[i]}))`}
              fillOpacity={0.72}
              stroke="rgb(var(--gold-300))"
              strokeWidth={1.2}
            />
          );
        })}
      </>
    ),
  },
  {
    id: 'jadau',
    name: 'Jadau',
    place: 'Bikaner and Jaipur',
    century: 'Seventeenth',
    holders: 'Workshops rather than individuals — perhaps forty in the country',
    fragility: 4,
    technique:
      'Uncut stones bedded into gold that has been softened by heat rather than melted, then locked in with pure gold foil behind them to throw light back through the stone. The foil is the point: an uncut polki has no pavilion to return light, so the setting has to do it.',
    tell: 'A jadau piece is heavy, warm and slightly irregular, and the stones sit at very slightly different heights. Perfect uniformity means machine setting, which means it is not this.',
    motif: (
      <>
        <path d="M50 12 L74 30 L84 58 L64 82 L36 82 L16 58 L26 30 Z" fill="rgb(var(--gold-600))" fillOpacity={0.28} stroke="rgb(var(--gold-500))" strokeWidth={1.8} />
        {[[50, 34], [36, 54], [64, 54], [50, 70]].map(([cx, cy], i) => (
          <polygon
            key={i}
            points={`${cx},${cy - 9} ${cx + 8},${cy} ${cx},${cy + 9} ${cx - 8},${cy}`}
            fill="rgb(var(--diamond))"
            fillOpacity={0.5}
            stroke="rgb(var(--gold-200))"
            strokeWidth={1.2}
          />
        ))}
      </>
    ),
  },
  {
    id: 'thewa',
    name: 'Thewa',
    place: 'Pratapgarh, Rajasthan',
    century: 'Eighteenth — 1707, by family record',
    holders: 'One extended family. Fewer than thirty people alive can do it.',
    fragility: 5,
    technique:
      'A sheet of 23K gold is pierced into a scene so fine it is worked under magnification, then fused to molten coloured glass. The join is made at the temperature where the glass will accept the gold and the gold will not sag, and that window is a matter of seconds.',
    tell: 'Hold it to a light. Real thewa glows through — the glass is the ground and the gold is a screen over it, so the picture is lit from behind. Anything opaque is enamel pretending.',
    motif: (
      <>
        <circle cx={50} cy={50} r={36} fill="rgb(var(--jade-700))" fillOpacity={0.55} />
        <path
          d="M50 20 C62 32 66 44 62 56 C58 68 50 76 50 76 C50 76 42 68 38 56 C34 44 38 32 50 20 Z"
          fill="none"
          stroke="rgb(var(--gold-300))"
          strokeWidth={1.4}
        />
        {[26, 38, 50, 62, 74].map((y) => (
          <line key={y} x1={22} y1={y} x2={78} y2={y} stroke="rgb(var(--gold-300))" strokeWidth={0.5} strokeOpacity={0.6} />
        ))}
        <circle cx={50} cy={50} r={36} fill="none" stroke="rgb(var(--gold-500))" strokeWidth={2.2} />
      </>
    ),
  },
  {
    id: 'filigree',
    name: 'Filigree',
    place: 'Cuttack, Odisha',
    century: 'Twelfth, and unbroken since',
    holders: 'Around two thousand, and falling by a generation',
    fragility: 4,
    technique:
      'Wire drawn to a fifth of a millimetre, twisted in pairs, flattened, then coiled and laid into a frame and fused — with no solder at the joins, because solder at that gauge would flood the pattern. A single tarakasi piece can be four thousand separate placements.',
    tell: 'Count the frame. In Cuttack work the outer frame is a single unbroken wire and every internal element touches it. Imported filigree is soldered in sections and you can see the seams.',
    motif: (
      <>
        <circle cx={50} cy={50} r={36} fill="none" stroke="rgb(var(--gold-500))" strokeWidth={2} />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const a = (i / 8) * Math.PI * 2;
          return (
            <circle
              key={i}
              cx={50 + Math.cos(a) * 21}
              cy={50 + Math.sin(a) * 21}
              r={10}
              fill="none"
              stroke="rgb(var(--gold-400))"
              strokeWidth={1}
            />
          );
        })}
        <circle cx={50} cy={50} r={8} fill="none" stroke="rgb(var(--gold-300))" strokeWidth={1.2} />
      </>
    ),
  },
  {
    id: 'bidri',
    name: 'Bidri',
    place: 'Bidar, Karnataka',
    century: 'Fourteenth',
    holders: 'Under a hundred families, and it is a registered geographical indication',
    fragility: 5,
    technique:
      'Silver inlaid into a zinc-copper alloy, which is then blackened with a paste made from the soil of Bidar fort — soil that contains the exact nitrates the reaction needs and that has been dug from the same place for six hundred years. Nowhere else works.',
    tell: 'The black is matt and absolute, and the silver against it is startling. If the ground is glossy it has been lacquered, which means the patina was not made this way.',
    motif: (
      <>
        <rect x={16} y={16} width={68} height={68} rx={4} fill="rgb(var(--ink-950))" />
        {[0, 1, 2, 3].map((r) =>
          [0, 1, 2, 3].map((c) => (
            <path
              key={`${r}-${c}`}
              d={`M ${26 + c * 16} ${26 + r * 16} l 5 -5 l 5 5 l -5 5 Z`}
              fill="rgb(var(--platinum))"
              fillOpacity={0.85}
            />
          ))
        )}
        <rect x={16} y={16} width={68} height={68} rx={4} fill="none" stroke="rgb(var(--platinum))" strokeWidth={1.4} strokeOpacity={0.6} />
      </>
    ),
  },
];

export default function CulturalMotifAtlas({ className = '' }: { className?: string }) {
  const [open, setOpen] = useState<string | null>('thewa');

  return (
    <div className={className}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TRADITIONS.map((t) => {
          const isOpen = open === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setOpen(isOpen ? null : t.id)}
              aria-expanded={isOpen}
              className={`motif-tile group rounded-xl p-4 text-left transition-all duration-400 ${
                isOpen ? 'ring-1 ring-accent' : 'hover:-translate-y-1'
              }`}
            >
              <svg viewBox="0 0 100 100" className="mx-auto h-24 w-24" aria-hidden="true">
                <motion.g
                  animate={isOpen ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 22, repeat: isOpen ? Infinity : 0, ease: 'linear' }}
                  style={{ transformOrigin: '50px 50px' }}
                >
                  {t.motif}
                </motion.g>
              </svg>

              <p
                className={`mt-3 font-display text-xl transition-colors ${
                  isOpen ? 'text-accent' : 'text-primary group-hover:text-accent'
                }`}
              >
                {t.name}
              </p>
              <p className="mt-1 font-accent text-[9px] uppercase leading-relaxed tracking-luxe text-faint">
                {t.place}
              </p>

              {/* How endangered it is. A meter with a written label beside it —
                  the number is never carried by length alone. */}
              <div className="mt-3 flex items-center gap-2">
                <span className="flex gap-0.5" aria-hidden="true">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span
                      key={n}
                      className="h-1 w-3 rounded-full"
                      style={{
                        background:
                          n <= t.fragility
                            ? 'rgb(var(--series-4))'
                            : 'rgb(var(--surface-sunken))',
                      }}
                    />
                  ))}
                </span>
                <span className="font-accent text-[8px] uppercase tracking-luxe text-faint">
                  {t.fragility >= 5
                    ? 'Nearly gone'
                    : t.fragility >= 4
                      ? 'At risk'
                      : t.fragility >= 3
                        ? 'Thinning'
                        : 'Holding'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {open && (
          <motion.div
            key={open}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            {(() => {
              const t = TRADITIONS.find((x) => x.id === open)!;
              return (
                <div className="mt-8 grid gap-8 border-t border-line-subtle pt-8 md:grid-cols-3">
                  <div>
                    <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
                      The technique
                    </p>
                    <p className="mt-2 font-sans text-sm font-light leading-relaxed text-muted">
                      {t.technique}
                    </p>
                  </div>
                  <div>
                    <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
                      How to tell it is real
                    </p>
                    <p className="mt-2 font-sans text-sm font-light leading-relaxed text-muted">
                      {t.tell}
                    </p>
                  </div>
                  <div>
                    <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
                      Who is left
                    </p>
                    <p className="mt-2 font-sans text-sm font-light leading-relaxed text-muted">
                      {t.holders}
                    </p>
                    <p className="mt-3 nums-instrument font-accent text-[9px] uppercase tracking-luxe text-faint">
                      {t.century}
                    </p>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-10 max-w-3xl border-t border-line-subtle pt-6 font-sans text-sm font-light leading-relaxed text-muted">
        We commission from five of these seven and we do not pretend to practise
        any of them in this building. The motifs above are diagrams of a
        structure rather than reproductions of anybody’s work — a house that made
        its name in Bombay should be able to name where its vocabulary came from
        without also implying it invented it.
      </p>
    </div>
  );
}
