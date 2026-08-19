'use client';

import { useId } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import type { MetalOption, StoneOption } from '@/data/bespoke';

interface RingPreviewProps {
  metal: MetalOption;
  stone: StoneOption;
  setting: string;
  band: string;
  carat: number;
  engraving?: string;
  className?: string;
  /** Slowly turn the whole assembly, as though on a display spindle. */
  spin?: boolean;
}

/**
 * A ring drawn entirely in SVG from the studio's current selections.
 *
 * Every choice changes real geometry rather than swapping a photograph: the
 * metal drives three gradient stops, the cut supplies the table outline and its
 * facet lines, the carat scales the crown, the setting decides what surrounds
 * it, and the band style redraws the shank. That is the reason for doing this in
 * vector — a photographic configurator can only show combinations someone has
 * already shot, and this one has 5 × 6 × 5 × 5 × 6 = 4,500 of them.
 *
 * Facet groups are keyed on the option id so framer-motion cross-fades them
 * rather than snapping, which reads as the stone being changed out by hand.
 */
export default function RingPreview({
  metal,
  stone,
  setting,
  band,
  carat,
  engraving = '',
  className = '',
  spin = true,
}: RingPreviewProps) {
  // Gradients are per-instance: two previews on one page would otherwise share
  // the first one's defs and both render in the same metal.
  const uid = useId().replace(/:/g, '');
  const gMetal = `m-${uid}`;
  const gStone = `s-${uid}`;
  const gRim = `r-${uid}`;
  const gPrism = `p-${uid}`;
  const fGlow = `g-${uid}`;
  const arcId = `arc-${uid}`;

  // Carat drives the crown's apparent size. Diameter scales with the cube root
  // of weight, so a 3ct is not six times the width of a 0.5ct.
  const crown = 15 * Math.cbrt(carat / 0.5);
  const shank = BAND_PATHS[band] ?? BAND_PATHS.court;

  return (
    <div className={`relative ${className}`}>
      <motion.svg
        viewBox="0 0 200 220"
        className="h-full w-full overflow-visible"
        animate={spin ? { rotateY: [0, 9, 0, -9, 0] } : undefined}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformStyle: 'preserve-3d' }}
        role="img"
        aria-label={`${metal.label} ring with a ${carat} carat ${stone.label} in a ${setting} setting`}
      >
        <defs>
          <linearGradient id={gMetal} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={metal.stops[0]} />
            <stop offset="46%" stopColor={metal.stops[1]} />
            <stop offset="100%" stopColor={metal.stops[2]} />
          </linearGradient>

          <linearGradient id={gRim} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor={metal.stops[2]} />
            <stop offset="50%" stopColor={metal.stops[0]} />
            <stop offset="100%" stopColor={metal.stops[1]} />
          </linearGradient>

          <radialGradient id={gStone} cx="38%" cy="30%" r="78%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="34%" stopColor="#ECF4FF" stopOpacity="0.7" />
            <stop offset="72%" stopColor="#BFD4F2" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#7F9BC4" stopOpacity="0.5" />
          </radialGradient>

          <linearGradient id={gPrism} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8A5CC7" />
            <stop offset="30%" stopColor="#1A8A6F" />
            <stop offset="58%" stopColor="#EFCE78" />
            <stop offset="82%" stopColor="#DB9A82" />
            <stop offset="100%" stopColor="#8A5CC7" />
          </linearGradient>

          <filter id={fGlow} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2.4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ---------- Shank ---------- */}
        <motion.g
          key={`band-${band}`}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <path
            d={shank.outer}
            fill="none"
            stroke={`url(#${gMetal})`}
            strokeWidth={shank.width}
            strokeLinecap="round"
          />
          {/* Specular line along the crest of the band, which is what tells the
              eye the shank is round rather than flat. */}
          <path
            d={shank.outer}
            fill="none"
            stroke={`url(#${gRim})`}
            strokeWidth={shank.width * 0.28}
            strokeLinecap="round"
            opacity={0.75}
          />
          {shank.detail && (
            <path
              d={shank.detail}
              fill="none"
              stroke={metal.stops[0]}
              strokeWidth={0.9}
              strokeDasharray={band === 'milgrain' ? '0.2 2.6' : undefined}
              strokeLinecap="round"
              opacity={0.85}
            />
          )}
        </motion.g>

        {/* ---------- Setting furniture, behind and around the stone ---------- */}
        <AnimatePresence mode="wait">
          <motion.g
            key={`setting-${setting}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.12 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: '100px 74px' }}
          >
            {setting === 'halo' &&
              Array.from({ length: 18 }).map((_, i) => {
                const a = (i / 18) * Math.PI * 2;
                return (
                  <circle
                    key={i}
                    cx={100 + Math.cos(a) * (crown + 6)}
                    cy={74 + Math.sin(a) * (crown + 6)}
                    r={2.1}
                    fill={`url(#${gStone})`}
                    stroke={metal.stops[1]}
                    strokeWidth={0.4}
                  />
                );
              })}

            {setting === 'trilogy' && (
              <>
                <ellipse
                  cx={100 - crown - 9}
                  cy={80}
                  rx={6}
                  ry={7.4}
                  fill={`url(#${gStone})`}
                  stroke={metal.stops[1]}
                  strokeWidth={0.6}
                />
                <ellipse
                  cx={100 + crown + 9}
                  cy={80}
                  rx={6}
                  ry={7.4}
                  fill={`url(#${gStone})`}
                  stroke={metal.stops[1]}
                  strokeWidth={0.6}
                />
              </>
            )}

            {setting === 'cathedral' && (
              <path
                d={`M${100 - crown - 22} 130 Q${100 - crown - 4} 94 ${100 - crown + 2} 78 M${100 + crown + 22} 130 Q${100 + crown + 4} 94 ${100 + crown - 2} 78`}
                fill="none"
                stroke={`url(#${gMetal})`}
                strokeWidth={5}
                strokeLinecap="round"
              />
            )}

            {setting === 'bezel' && (
              <circle
                cx={100}
                cy={74}
                r={crown + 3.4}
                fill="none"
                stroke={`url(#${gMetal})`}
                strokeWidth={5}
              />
            )}

            {setting === 'solitaire' &&
              Array.from({ length: 6 }).map((_, i) => {
                const a = (i / 6) * Math.PI * 2 + Math.PI / 12;
                return (
                  <path
                    key={i}
                    d={`M100 98 L${100 + Math.cos(a) * (crown + 1)} ${74 + Math.sin(a) * (crown + 1)}`}
                    stroke={`url(#${gMetal})`}
                    strokeWidth={2.4}
                    strokeLinecap="round"
                  />
                );
              })}
          </motion.g>
        </AnimatePresence>

        {/* ---------- The stone ---------- */}
        <motion.g
          animate={{ scale: crown / 15 }}
          transition={{ type: 'spring', stiffness: 160, damping: 20 }}
          style={{ transformOrigin: '100px 74px' }}
        >
          <g transform="translate(70, 44) scale(0.6)">
            <AnimatePresence mode="wait">
              <motion.g
                key={stone.id}
                initial={{ opacity: 0, rotate: -25, scale: 0.7 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 25, scale: 0.7 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: '50px 50px' }}
              >
                <path
                  d={stone.path}
                  fill={`url(#${gStone})`}
                  stroke="#FFFFFF"
                  strokeOpacity={0.55}
                  strokeWidth={1.4}
                  filter={`url(#${fGlow})`}
                />
                <path
                  d={stone.facets}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeOpacity={0.45}
                  strokeWidth={0.8}
                />

                {/* Fire — a slow prismatic wash for the brilliant cuts, and one
                    steady sheet for the step and flat cuts, which is genuinely
                    how those behave in the light. */}
                {stone.refraction === 'high' ? (
                  <motion.path
                    d={stone.path}
                    fill={`url(#${gPrism})`}
                    animate={{ opacity: [0.16, 0.48, 0.16] }}
                    transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ mixBlendMode: 'screen' }}
                  />
                ) : (
                  <path d={stone.path} fill="#FFFFFF" opacity={0.1} />
                )}
              </motion.g>
            </AnimatePresence>
          </g>

          {/* Specular star, brightest on the high-refraction cuts. */}
          <motion.g
            animate={{
              opacity:
                stone.refraction === 'high' ? [0.35, 1, 0.35] : [0.18, 0.48, 0.18],
              rotate: [0, 90],
            }}
            transition={{
              opacity: { duration: 3.1, repeat: Infinity, ease: 'easeInOut' },
              rotate: { duration: 26, repeat: Infinity, ease: 'linear' },
            }}
            style={{ transformOrigin: '100px 74px' }}
          >
            <path
              d="M100 62 L101.4 72.6 L112 74 L101.4 75.4 L100 86 L98.6 75.4 L88 74 L98.6 72.6 Z"
              fill="#FFFFFF"
              filter={`url(#${fGlow})`}
            />
          </motion.g>
        </motion.g>

        {/* ---------- Engraving, curved along the inside of the shank ---------- */}
        <path id={arcId} d="M54 152 A50 50 0 0 0 146 152" fill="none" />
        <AnimatePresence>
          {engraving.trim() && (
            <motion.text
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              exit={{ opacity: 0 }}
              fontSize="8"
              letterSpacing="1.6"
              fill={metal.stops[0]}
              className="font-accent uppercase"
            >
              <textPath href={`#${arcId}`} startOffset="50%" textAnchor="middle">
                {engraving.slice(0, 24)}
              </textPath>
            </motion.text>
          )}
        </AnimatePresence>

        {/* Hallmark punch at the foot of the shank */}
        <text
          x="100"
          y="208"
          textAnchor="middle"
          fontSize="6.5"
          letterSpacing="2"
          fill={metal.stops[1]}
          opacity={0.75}
          className="font-accent"
        >
          {metal.hallmark}
        </text>
      </motion.svg>
    </div>
  );
}

/**
 * Shank geometry per band style. `outer` is the stroked centreline of the band,
 * `width` its thickness, and `detail` an optional overlay — the pavé bead line,
 * the knife-edge spine, the milgrain dashes.
 */
const BAND_PATHS: Record<string, { outer: string; width: number; detail?: string }> = {
  court: {
    outer: 'M100 96 A52 52 0 1 0 100 200 A52 52 0 1 0 100 96',
    width: 9,
  },
  knife: {
    outer: 'M100 96 A52 52 0 1 0 100 200 A52 52 0 1 0 100 96',
    width: 8,
    detail: 'M100 96 A52 52 0 1 0 100 200 A52 52 0 1 0 100 96',
  },
  pave: {
    outer: 'M100 96 A52 52 0 1 0 100 200 A52 52 0 1 0 100 96',
    width: 10,
    detail: 'M62 118 A52 52 0 0 0 48 152 M138 118 A52 52 0 0 1 152 152',
  },
  twist: {
    outer: 'M100 96 A52 52 0 1 0 100 200 A52 52 0 1 0 100 96',
    width: 7,
    detail: 'M100 103 A45 45 0 1 0 100 193 A45 45 0 1 0 100 103',
  },
  milgrain: {
    outer: 'M100 96 A52 52 0 1 0 100 200 A52 52 0 1 0 100 96',
    width: 9.5,
    detail: 'M100 91 A57 57 0 1 0 100 205 A57 57 0 1 0 100 91',
  },
};
