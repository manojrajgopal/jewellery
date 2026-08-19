'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Clock, MapPin, Phone, Sparkles } from 'lucide-react';

interface Boutique {
  id: string;
  city: string;
  district: string;
  address: string;
  phone: string;
  hours: string;
  opened: number;
  speciality: string;
  /** Position on the schematic map, in percent of the frame. */
  x: number;
  y: number;
  flagship?: boolean;
}

const BOUTIQUES: Boutique[] = [
  {
    id: 'mumbai',
    city: 'Mumbai',
    district: 'Bandra West',
    address: 'Aurum House, 15 Luxury Boulevard, Bandra West, Mumbai 400050',
    phone: '+91 800 123 4567',
    hours: 'Mon–Sat 11:00–20:00 · Sun by appointment',
    opened: 1892,
    speciality: 'The original bench. Bridal commissions and the archive vault.',
    x: 27,
    y: 63,
    flagship: true,
  },
  {
    id: 'delhi',
    city: 'New Delhi',
    district: 'Chanakyapuri',
    address: 'The Aurum Salon, 4 Malcha Marg, Chanakyapuri, New Delhi 110021',
    phone: '+91 800 123 4571',
    hours: 'Tue–Sun 11:00–20:00',
    opened: 1948,
    speciality: 'Polki and kundan. Two full-time uncut-stone setters.',
    x: 38,
    y: 30,
  },
  {
    id: 'jaipur',
    city: 'Jaipur',
    district: 'Johari Bazaar',
    address: 'Haveli No. 7, Johari Bazaar, Jaipur 302003',
    phone: '+91 800 123 4573',
    hours: 'Mon–Sat 10:30–19:30',
    opened: 1906,
    speciality: 'Coloured stones. Where the house buys its emeralds.',
    x: 31,
    y: 38,
  },
  {
    id: 'bengaluru',
    city: 'Bengaluru',
    district: 'Vittal Mallya Road',
    address: '22 Vittal Mallya Road, Bengaluru 560001',
    phone: '+91 800 123 4575',
    hours: 'Mon–Sun 11:00–21:00',
    opened: 2009,
    speciality: 'Contemporary settings and the ateliers CAD studio.',
    x: 35,
    y: 82,
  },
  {
    id: 'chennai',
    city: 'Chennai',
    district: 'Boat Club Road',
    address: '9 Boat Club Road, R.A. Puram, Chennai 600028',
    phone: '+91 800 123 4577',
    hours: 'Mon–Sat 10:00–20:00',
    opened: 1971,
    speciality: 'Temple jewellery and antique restoration.',
    x: 43,
    y: 84,
  },
  {
    id: 'hyderabad',
    city: 'Hyderabad',
    district: 'Banjara Hills',
    address: 'Road No. 12, Banjara Hills, Hyderabad 500034',
    phone: '+91 800 123 4579',
    hours: 'Mon–Sat 11:00–20:30',
    opened: 1994,
    speciality: 'Nizami work. Pearls strung on the premises.',
    x: 40,
    y: 71,
  },
];

/**
 * The boutique map.
 *
 * The outline is a deliberately loose schematic rather than a survey-accurate
 * coastline — the point is to locate six cities relative to each other, and a
 * precise vector of the subcontinent would be an enormous path for no gain in
 * that. Pins are positioned in percent, so the whole thing scales freely.
 *
 * Selecting a pin does three things at once: the pin blooms, a hairline
 * connects it to the detail card, and the card cross-fades. The connector is
 * what keeps the two halves feeling like one object on wide screens.
 */
export default function BoutiqueLocator({ className = '' }: { className?: string }) {
  const [selected, setSelected] = useState<string>('mumbai');
  const [hovered, setHovered] = useState<string | null>(null);

  const active = BOUTIQUES.find((b) => b.id === selected) ?? BOUTIQUES[0];

  return (
    <div className={`grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-12 ${className}`}>
      {/* ---------------- Map ---------------- */}
      <div className="vitrine-glass relative overflow-hidden rounded-4xl border border-line bg-surface/30 p-6 sm:p-10">
        <div className="relative mx-auto aspect-[3/4] w-full max-w-[420px]">
          <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
            <defs>
              <linearGradient id="loc-land" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="rgb(var(--gold-500) / 0.16)" />
                <stop offset="100%" stopColor="rgb(var(--gold-800) / 0.1)" />
              </linearGradient>
            </defs>

            {/* Landmass, drawn on as the block scrolls in */}
            <motion.path
              d="M31 6 C40 4 48 8 52 14 C57 12 62 15 61 21 C66 22 68 27 65 32 C69 36 70 42 66 47 C68 54 64 61 58 65 C55 74 50 84 45 92 C42 97 38 97 36 92 C31 82 26 72 22 63 C18 57 16 50 19 44 C15 39 15 32 20 28 C19 21 23 15 29 14 Z"
              fill="url(#loc-land)"
              stroke="rgb(var(--gold-500) / 0.4)"
              strokeWidth={0.5}
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
            />

            {/* Latitude hairlines, purely decorative */}
            {[24, 40, 56, 72].map((y, i) => (
              <motion.line
                key={y}
                x1={8}
                x2={78}
                y1={y}
                y2={y}
                stroke="rgb(var(--hairline) / 0.07)"
                strokeWidth={0.3}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, delay: 0.6 + i * 0.12 }}
                style={{ transformOrigin: 'left center' }}
              />
            ))}

            {/* Great-circle style arcs between the flagship and the rest — the
                house's own network, and a reason for the eye to travel. */}
            {BOUTIQUES.filter((b) => !b.flagship).map((b, i) => {
              const from = BOUTIQUES[0];
              const mx = (from.x + b.x) / 2 + (b.y - from.y) * 0.18;
              const my = (from.y + b.y) / 2 - (b.x - from.x) * 0.18;
              return (
                <motion.path
                  key={b.id}
                  d={`M${from.x} ${from.y} Q${mx} ${my} ${b.x} ${b.y}`}
                  fill="none"
                  stroke="rgb(var(--gold-400) / 0.3)"
                  strokeWidth={0.28}
                  strokeDasharray="1.4 1.6"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.6, delay: 1 + i * 0.12, ease: 'easeOut' }}
                  opacity={selected === b.id || selected === 'mumbai' ? 1 : 0.35}
                />
              );
            })}
          </svg>

          {/* Pins are HTML rather than SVG so they can carry buttons, focus
              rings and tooltips without fighting the viewBox. */}
          {BOUTIQUES.map((b, i) => {
            const on = b.id === selected;
            const near = b.id === hovered;
            return (
              <motion.button
                key={b.id}
                onClick={() => setSelected(b.id)}
                onPointerEnter={() => setHovered(b.id)}
                onPointerLeave={() => setHovered(null)}
                aria-pressed={on}
                aria-label={`${b.city} boutique`}
                initial={{ opacity: 0, scale: 0, y: -20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 18,
                  delay: 1.2 + i * 0.1,
                }}
                style={{ left: `${b.x}%`, top: `${b.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2"
              >
                {/* Pulse ring on the selected pin */}
                {on && (
                  <motion.span
                    className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold-300"
                    animate={{ scale: [1, 3.4], opacity: [0.7, 0] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
                  />
                )}

                <motion.span
                  animate={{
                    scale: on ? 1.5 : near ? 1.25 : 1,
                    backgroundColor: on
                      ? 'rgb(var(--gold-300))'
                      : 'rgb(var(--gold-600))',
                  }}
                  transition={{ type: 'spring', stiffness: 340, damping: 22 }}
                  className={`block h-2.5 w-2.5 rotate-45 ${
                    on ? 'shadow-[0_0_18px_5px_rgb(var(--gold-400)/0.6)]' : ''
                  } ${b.flagship ? 'ring-1 ring-gold-100/60 ring-offset-2 ring-offset-transparent' : ''}`}
                />

                <AnimatePresence>
                  {(on || near) && (
                    <motion.span
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 whitespace-nowrap font-accent text-[9px] uppercase tracking-luxe text-accent"
                    >
                      {b.city}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>

        <p className="mt-6 text-center font-sans text-[10px] leading-relaxed text-faint">
          Schematic. Six boutiques, one bench in each, and the archive vault under
          the Mumbai house.
        </p>
      </div>

      {/* ---------------- Detail ---------------- */}
      <div>
        <div className="mb-6 flex flex-wrap gap-2">
          {BOUTIQUES.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelected(b.id)}
              className={`relative rounded-full px-4 py-2 font-accent text-[10px] uppercase tracking-luxe transition-colors duration-300 ${
                b.id === selected ? 'text-onaccent' : 'text-muted hover:text-accent'
              }`}
            >
              {b.id === selected && (
                <motion.span
                  layoutId="boutique-pill"
                  transition={{ type: 'spring', stiffness: 340, damping: 30 }}
                  className="absolute inset-0 rounded-full bg-accent shadow-gold"
                />
              )}
              <span className="relative">{b.city}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.article
            key={active.id}
            initial={{ opacity: 0, x: 26, filter: 'blur(8px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: -26, filter: 'blur(8px)' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="plate-metal rounded-4xl p-7 sm:p-9"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <span className="mb-2 block font-accent text-[10px] uppercase tracking-luxer text-accent">
                  {active.flagship ? 'Flagship · The original house' : 'Boutique'}
                </span>
                <h3 className="font-display text-3xl leading-tight text-primary md:text-4xl">
                  {active.city}
                </h3>
                <p className="mt-1 font-accent text-xs uppercase tracking-luxe text-muted">
                  {active.district}
                </p>
              </div>
              <span className="shrink-0 text-right">
                <span className="block font-display text-2xl text-accent">
                  {active.opened}
                </span>
                <span className="font-accent text-[9px] uppercase tracking-luxe text-faint">
                  Opened
                </span>
              </span>
            </div>

            <p className="mb-7 flex gap-2.5 font-sans text-sm leading-relaxed text-secondary">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.5} />
              {active.speciality}
            </p>

            <ul className="space-y-4 border-t border-hairline pt-6">
              {[
                { icon: MapPin, value: active.address },
                { icon: Phone, value: active.phone },
                { icon: Clock, value: active.hours },
              ].map(({ icon: Icon, value }, i) => (
                <motion.li
                  key={value}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
                  className="flex items-start gap-3 font-sans text-xs leading-relaxed text-muted"
                >
                  <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" strokeWidth={1.6} />
                  {value}
                </motion.li>
              ))}
            </ul>
          </motion.article>
        </AnimatePresence>
      </div>
    </div>
  );
}
