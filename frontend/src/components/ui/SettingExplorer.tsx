'use client';

import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Activity, Eye, ShieldCheck, Wrench } from 'lucide-react';

import { easeLens, springsHeavy } from '@/lib/motion';

/**
 * The settings, scored on the four things that actually differ between them.
 *
 * Every score here is a trade-off rather than a quality: a bezel scores highest
 * on security and lowest on light, and that is not a fault, it is what a bezel
 * is for. Presenting these as stars out of five — which is how they are usually
 * shown — hides the fact that improving one necessarily costs another.
 *
 * `snag` is the number a customer needs and never gets: how likely the setting is
 * to catch on wool, hair and car upholstery. It is the single most common reason
 * a ring stops being worn daily.
 */
interface Setting {
  id: string;
  name: string;
  /** The bench's own name for it, where it differs. */
  alias?: string;
  /** 1–5. How well it holds the stone against knocks. */
  security: number;
  /** 1–5. How much light reaches the pavilion. */
  light: number;
  /** 1–5. How much of the stone you can see. */
  exposure: number;
  /** 1–5, where 5 means it snags constantly. */
  snag: number;
  description: string;
  /** Who it is genuinely right for. */
  suits: string;
  /** The honest downside. */
  cost: string;
  /** SVG path fragment describing the setting's cross-section. */
  profile: 'prong' | 'bezel' | 'pave' | 'channel' | 'tension' | 'halo' | 'flush';
}

const SETTINGS: Setting[] = [
  {
    id: 'prong-4',
    name: 'Four-claw prong',
    alias: 'four-claw',
    security: 3,
    light: 5,
    exposure: 5,
    snag: 4,
    description:
      'Four metal fingers bent over the girdle. The least metal that will hold a stone, which is exactly why it shows the most of one.',
    suits: 'A stone worth looking at, on a hand that is not doing manual work.',
    cost: 'The highest-snagging setting there is, and a bent claw is how most stones are lost.',
    profile: 'prong',
  },
  {
    id: 'prong-6',
    name: 'Six-claw prong',
    security: 4,
    light: 4,
    exposure: 4,
    snag: 4,
    description:
      'The same idea with two more fingers. Losing one claw of six is survivable; losing one of four usually is not.',
    suits: 'Anyone who wants a classic solitaire but will actually wear it every day.',
    cost: 'Two more shadows across the crown, and slightly less stone visible.',
    profile: 'prong',
  },
  {
    id: 'bezel',
    name: 'Bezel',
    alias: 'rub-over',
    security: 5,
    light: 2,
    exposure: 3,
    snag: 1,
    description:
      'A continuous rim of metal folded over the girdle all the way round. Nothing can reach the stone from the side.',
    suits: 'Surgeons, gardeners, parents, anyone with an emerald or an opal — soft stones and busy hands.',
    cost: 'Light only enters from the top, so a stone that depends on brilliance loses some of it.',
    profile: 'bezel',
  },
  {
    id: 'halo',
    name: 'Halo',
    security: 4,
    light: 3,
    exposure: 4,
    snag: 3,
    description:
      'A ring of small stones set close around the centre, which optically enlarges it by around half a carat of apparent size.',
    suits: 'Getting the look of a much larger centre stone for a fraction of the step in price.',
    cost: 'Twenty extra settings to maintain, and the halo dates a ring to the decade it was bought in.',
    profile: 'halo',
  },
  {
    id: 'pave',
    name: 'Pavé',
    security: 3,
    light: 4,
    exposure: 5,
    snag: 3,
    description:
      'Small stones held by raised beads of metal, set so close that the band beneath nearly disappears.',
    suits: 'A band that should read as light rather than as metal.',
    cost: 'Beads wear down. Expect to have a pavé band tightened every few years, and to lose the occasional stone before you notice.',
    profile: 'pave',
  },
  {
    id: 'channel',
    name: 'Channel',
    security: 5,
    light: 3,
    exposure: 3,
    snag: 1,
    description:
      'Stones dropped into a groove between two walls of metal, touching each other and held by the walls alone.',
    suits: 'An eternity band that has to survive being worn next to a solitaire.',
    cost: 'Almost impossible to resize, and a single cracked stone means dismantling the run to replace it.',
    profile: 'channel',
  },
  {
    id: 'tension',
    name: 'Tension',
    security: 2,
    light: 5,
    exposure: 5,
    snag: 2,
    description:
      'The stone is held by the spring of the metal itself, compressed against the girdle. There is no visible setting at all.',
    suits: 'Someone who wants the stone to appear to float, and understands the bargain.',
    cost: 'Cannot be resized, at all. The tension is calibrated to one diameter and altering the shank releases the stone.',
    profile: 'tension',
  },
  {
    id: 'flush',
    name: 'Flush',
    alias: 'gypsy',
    security: 5,
    light: 1,
    exposure: 2,
    snag: 1,
    description:
      'The stone is sunk into a drilled seat so its table sits level with the metal surface. Nothing protrudes anywhere.',
    suits: 'Men\'s bands, working hands, and anyone who has already snagged one ring.',
    cost: 'The least light of any setting. A brilliant set flush loses most of what it was cut to do.',
    profile: 'flush',
  },
];

/** The four dimensions, in the order they matter to most people. */
const AXES = [
  { key: 'security', label: 'Holds the stone', icon: ShieldCheck, invert: false },
  { key: 'light', label: 'Lets light in', icon: Eye, invert: false },
  { key: 'exposure', label: 'Shows the stone', icon: Activity, invert: false },
  { key: 'snag', label: 'Catches on things', icon: Wrench, invert: true },
] as const;

interface SettingExplorerProps {
  className?: string;
}

/**
 * The settings, as a set of trade-offs rather than a menu.
 *
 * A setting is not a style decision, it is a decision about which of four things
 * you are willing to give up. So the display leads with the four bars and they
 * are drawn against each other, not against an absolute — pick a bezel and
 * security goes to full while light drops to two, and both movements happen in
 * the same animation so the exchange is visible as an exchange.
 *
 * The `snag` axis is inverted on purpose. Every other axis is better higher, and
 * showing snagging the same way would mean a full bar meant something bad. So it
 * is drawn as "catches on things" with the bar filling toward trouble, and the
 * colour shifts as it fills. This is the axis that decides whether a ring gets
 * worn, and it is the one nobody is told about.
 *
 * The cross-section is drawn rather than photographed. A photograph of a setting
 * shows the stone; a section shows the *metal*, which is the thing being chosen.
 */
export default function SettingExplorer({ className = '' }: SettingExplorerProps) {
  const reduced = useReducedMotion();
  const [id, setId] = useState('prong-6');
  const [compareId, setCompareId] = useState<string | null>('bezel');

  const setting = SETTINGS.find((s) => s.id === id) ?? SETTINGS[0];
  const other = compareId ? SETTINGS.find((s) => s.id === compareId) : null;

  /** The single sentence that follows from the four scores. */
  const verdict = useMemo(() => {
    if (setting.snag >= 4 && setting.security <= 3)
      return 'Beautiful and demanding. Take it off for anything physical.';
    if (setting.security >= 5 && setting.light <= 2)
      return 'This will outlast you. It will also never sparkle the way a claw setting does.';
    if (setting.security <= 2) return 'Understand the bargain before you agree to it.';
    if (setting.light >= 4 && setting.security >= 4)
      return 'The compromise most people should make.';
    return 'A sound choice with nothing dramatic about it either way.';
  }, [setting]);

  return (
    <div className={className}>
      {/* ---- Pick one ---- */}
      <div className="flex flex-wrap gap-2">
        {SETTINGS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setId(s.id)}
            aria-pressed={s.id === id}
            className={`rounded-full border px-3.5 py-2 font-accent text-[10px] uppercase tracking-luxe transition-all duration-300 ${
              s.id === id
                ? 'border-accent bg-accent text-onaccent'
                : 'border-hairline text-muted hover:border-accent/50 hover:text-accent'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="mt-9 grid gap-8 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
        {/* ================= The section drawing ================= */}
        <div className="rounded-3xl border border-hairline bg-surface-sunken p-6">
          <span className="font-accent text-[10px] uppercase tracking-luxer text-faint">
            In section
          </span>

          <div className="mt-4 aspect-square">
            <SettingSection profile={setting.profile} reduced={!!reduced} />
          </div>

          <p className="mt-4 font-sans text-xs font-light leading-relaxed text-muted">
            Cut through the shank and looked at end-on. The metal is what you are choosing between —
            a photograph would only show you the stone.
          </p>
        </div>

        {/* ================= The trade-offs ================= */}
        <div className="space-y-7">
          <div>
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <h3 className="font-display text-3xl text-primary md:text-4xl">{setting.name}</h3>
              {setting.alias && (
                <span className="font-accent text-[10px] uppercase tracking-luxer text-faint">
                  at the bench: {setting.alias}
                </span>
              )}
            </div>
            <p className="mt-3 max-w-xl font-sans text-base font-light leading-relaxed text-secondary">
              {setting.description}
            </p>
          </div>

          {/* ---- The four bars ---- */}
          <div className="space-y-4">
            {AXES.map((axis) => {
              const value = setting[axis.key];
              const otherValue = other ? other[axis.key] : null;
              const Icon = axis.icon;
              // The snagging axis fills toward trouble, so it is coloured by how
              // full it is rather than in the accent like the others.
              const bad = axis.invert && value >= 4;

              return (
                <div key={axis.key}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="flex items-center gap-2 font-accent text-[10px] uppercase tracking-luxe text-muted">
                      <Icon aria-hidden="true" className="h-3.5 w-3.5" />
                      {axis.label}
                    </span>
                    <span
                      className={`font-accent text-[10px] nums-tabular ${
                        bad ? 'text-burgundy-300' : 'text-accent'
                      }`}
                    >
                      {value} / 5
                    </span>
                  </div>

                  <div className="relative mt-2 h-2 overflow-hidden rounded-full bg-surface-sunken">
                    {/* The comparison sits behind as a ghost, so the exchange
                        between two settings is one glance rather than two. */}
                    {otherValue !== null && (
                      <motion.span
                        initial={false}
                        animate={{ scaleX: otherValue / 5 }}
                        transition={reduced ? { duration: 0 } : springsHeavy.leaf}
                        className="absolute inset-0 origin-left rounded-full border border-dashed border-accent/30"
                      />
                    )}
                    <motion.span
                      initial={false}
                      animate={{ scaleX: value / 5 }}
                      transition={reduced ? { duration: 0 } : springsHeavy.tray}
                      className={`absolute inset-0 origin-left rounded-full ${
                        bad
                          ? 'bg-gradient-to-r from-accent/40 to-burgundy-500'
                          : 'bg-gradient-to-r from-accent/50 to-accent'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* ---- Compare against ---- */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-accent text-[10px] uppercase tracking-luxer text-faint">
              Ghost bars show
            </span>
            {SETTINGS.filter((s) => s.id !== id)
              .slice(0, 4)
              .map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setCompareId(compareId === s.id ? null : s.id)}
                  aria-pressed={compareId === s.id}
                  className={`rounded-full border px-3 py-1 font-accent text-[9px] uppercase tracking-luxe transition-all duration-300 ${
                    compareId === s.id
                      ? 'border-accent/60 bg-accent/10 text-accent'
                      : 'border-hairline text-faint hover:border-accent/40 hover:text-accent'
                  }`}
                >
                  {s.name}
                </button>
              ))}
          </div>

          {/* ---- Suits / costs ---- */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-hairline bg-canvas-alt/60 p-5">
              <span className="font-accent text-[10px] uppercase tracking-luxer text-accent">
                Right for
              </span>
              <p className="mt-2 font-sans text-sm font-light leading-relaxed text-secondary">
                {setting.suits}
              </p>
            </div>
            <div className="rounded-2xl border border-accent/25 bg-accent/[0.06] p-5">
              <span className="font-accent text-[10px] uppercase tracking-luxer text-accent">
                What it costs you
              </span>
              <p className="mt-2 font-sans text-sm font-light leading-relaxed text-secondary">
                {setting.cost}
              </p>
            </div>
          </div>

          <motion.p
            key={setting.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeLens.focusRing }}
            className="border-l border-accent/40 pl-5 font-display text-xl leading-snug text-primary"
          >
            {verdict}
          </motion.p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   The cross-sections. Drawn as SVG rather than shipped as assets, so they
   inherit the theme tokens and animate between states.
   ========================================================================= */
function SettingSection({
  profile,
  reduced,
}: {
  profile: Setting['profile'];
  reduced: boolean;
}) {
  const metal = 'rgb(var(--gold-500))';
  const metalDeep = 'rgb(var(--gold-700))';
  const stone = 'rgb(var(--diamond))';

  const spring = reduced ? { duration: 0 } : springsHeavy.tray;

  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" role="img" aria-label={`${profile} setting, in cross-section`}>
      <defs>
        <linearGradient id="section-metal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={metal} stopOpacity="0.95" />
          <stop offset="100%" stopColor={metalDeep} stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="section-stone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stone} stopOpacity="0.9" />
          <stop offset="100%" stopColor="rgb(var(--gold-200))" stopOpacity="0.35" />
        </linearGradient>
      </defs>

      {/* The finger, for scale. Always drawn — the whole point of a section is
          knowing which side the hand is on. */}
      <path
        d="M20 168 Q100 150 180 168 L180 200 L20 200 Z"
        fill="rgb(var(--ink-700))"
        opacity="0.35"
      />
      <text
        x="100"
        y="192"
        textAnchor="middle"
        className="font-accent"
        fontSize="9"
        letterSpacing="2"
        fill="rgb(var(--text-faint))"
      >
        FINGER
      </text>

      {/* The shank */}
      <motion.path
        initial={false}
        animate={{
          d:
            profile === 'flush'
              ? 'M28 118 Q100 100 172 118 L172 158 Q100 142 28 158 Z'
              : profile === 'channel' || profile === 'pave'
                ? 'M30 124 Q100 108 170 124 L170 156 Q100 142 30 156 Z'
                : 'M38 128 Q100 114 162 128 L162 156 Q100 144 38 156 Z',
        }}
        transition={spring}
        fill="url(#section-metal)"
      />

      {/* ---- The stone and the metal that holds it ---- */}
      {profile === 'prong' && (
        <>
          <motion.polygon
            initial={false}
            animate={{ points: '70,88 130,88 100,124' }}
            transition={spring}
            fill="url(#section-stone)"
          />
          <rect x="66" y="76" width="8" height="46" rx="3" fill="url(#section-metal)" />
          <rect x="126" y="76" width="8" height="46" rx="3" fill="url(#section-metal)" />
          <line x1="70" y1="88" x2="130" y2="88" stroke={metal} strokeWidth="3" />
        </>
      )}

      {profile === 'bezel' && (
        <>
          <motion.polygon
            initial={false}
            animate={{ points: '72,90 128,90 100,124' }}
            transition={spring}
            fill="url(#section-stone)"
          />
          {/* The rim, folded over the girdle on both sides and closed underneath. */}
          <path
            d="M62 80 L62 126 Q100 138 138 126 L138 80 L128 80 L128 90 L72 90 L72 80 Z"
            fill="url(#section-metal)"
          />
        </>
      )}

      {profile === 'halo' && (
        <>
          <motion.polygon
            initial={false}
            animate={{ points: '76,86 124,86 100,122' }}
            transition={spring}
            fill="url(#section-stone)"
          />
          <rect x="72" y="76" width="6" height="42" rx="2" fill="url(#section-metal)" />
          <rect x="122" y="76" width="6" height="42" rx="2" fill="url(#section-metal)" />
          {/* The ring of small stones, seen edge-on either side. */}
          {[56, 64, 136, 144].map((x) => (
            <polygon
              key={x}
              points={`${x - 5},96 ${x + 5},96 ${x},110`}
              fill="url(#section-stone)"
              opacity="0.8"
            />
          ))}
        </>
      )}

      {profile === 'pave' && (
        <>
          {[52, 76, 100, 124, 148].map((x) => (
            <g key={x}>
              <polygon
                points={`${x - 7},112 ${x + 7},112 ${x},128`}
                fill="url(#section-stone)"
                opacity="0.9"
              />
              {/* The beads — tiny raised burrs of metal, which is exactly why
                  they wear down. */}
              <circle cx={x - 9} cy="111" r="3" fill="url(#section-metal)" />
              <circle cx={x + 9} cy="111" r="3" fill="url(#section-metal)" />
            </g>
          ))}
        </>
      )}

      {profile === 'channel' && (
        <>
          {/* Two walls, with the stones sitting between them touching. */}
          <rect x="30" y="104" width="12" height="30" rx="3" fill="url(#section-metal)" />
          <rect x="158" y="104" width="12" height="30" rx="3" fill="url(#section-metal)" />
          {[58, 82, 106, 130].map((x) => (
            <polygon
              key={x}
              points={`${x - 12},110 ${x + 12},110 ${x},132`}
              fill="url(#section-stone)"
              opacity="0.9"
            />
          ))}
        </>
      )}

      {profile === 'tension' && (
        <>
          <motion.polygon
            initial={false}
            animate={{ points: '74,86 126,86 100,126' }}
            transition={spring}
            fill="url(#section-stone)"
          />
          {/* The shank ends, pressing inward. The gap is the whole design. */}
          <path d="M38 96 L70 96 L70 128 L38 138 Z" fill="url(#section-metal)" />
          <path d="M130 96 L162 96 L162 138 L130 128 Z" fill="url(#section-metal)" />
          {/* Arrows showing where the load is. */}
          <path d="M52 152 L68 152 M64 148 L68 152 L64 156" stroke="rgb(var(--accent))" strokeWidth="1.5" fill="none" />
          <path d="M148 152 L132 152 M136 148 L132 152 L136 156" stroke="rgb(var(--accent))" strokeWidth="1.5" fill="none" />
        </>
      )}

      {profile === 'flush' && (
        <>
          {/* Sunk into a drilled seat: the table is level with the metal. */}
          <motion.polygon
            initial={false}
            animate={{ points: '80,108 120,108 100,132' }}
            transition={spring}
            fill="url(#section-stone)"
          />
          <line x1="78" y1="108" x2="122" y2="108" stroke="rgb(var(--gold-200))" strokeWidth="2" />
        </>
      )}
    </svg>
  );
}
