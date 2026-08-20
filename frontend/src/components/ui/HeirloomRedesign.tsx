'use client';

import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Clock, IndianRupee, Scissors } from 'lucide-react';

import { easeCine } from '@/lib/motion';

/**
 * What can actually be done with an inherited piece, in increasing order of how
 * much of the original survives being done to it.
 *
 * `keeps` and `loses` are the whole point and they are stated as facts rather
 * than as features. Every route below destroys something, and a workshop that
 * does not say which thing is a workshop that will surprise somebody with it
 * afterwards.
 *
 * `days` and `from` are the bench's real figures. `from` is in rupees and is a
 * floor rather than an estimate — the honest phrasing at a counter is "not less
 * than", because the number depends on what the piece turns out to be once it is
 * opened up.
 */
interface Route {
  id: string;
  name: string;
  summary: string;
  keeps: string[];
  loses: string[];
  days: number;
  from: number;
  /** How much of the original object still exists afterwards, 0–1. */
  survives: number;
  /** Who this is genuinely the right answer for. */
  right: string;
}

const ROUTES: Route[] = [
  {
    id: 'restore',
    name: 'Restore it',
    summary:
      'Nothing is redesigned. Claws are rebuilt, worn shanks are laser-built back up, stones are re-seated and the whole piece is re-polished to the finish it left the bench with.',
    keeps: ['Every original component', 'The maker’s marks', 'Any hallmark', 'Its value as an object with a history'],
    loses: ['The patina, if you asked for a full polish', 'Nothing else'],
    days: 21,
    from: 18000,
    survives: 1,
    right:
      'A piece that is still wearable as designed, and anything signed or hallmarked. Redesigning a signed piece destroys most of its value and it cannot be undone.',
  },
  {
    id: 'reset',
    name: 'Reset the stones',
    summary:
      'The stones come out and go into a new setting of your choosing. The original metal is weighed, refined and credited against the new piece.',
    keeps: ['Every stone', 'The stones’ own certificates, if there were any', 'The metal’s value, as credit'],
    loses: ['The original setting entirely', 'Any hallmark, which was struck on the metal', 'The object your grandmother actually held'],
    days: 42,
    from: 46000,
    survives: 0.45,
    right:
      'An unwearable or badly dated setting holding stones that are genuinely good. This is the most common route and it is the one people most often regret, so we insist on photographing the original at forty magnifications first.',
  },
  {
    id: 'divide',
    name: 'Divide it',
    summary:
      'One piece becomes several — a heavy necklace into three pendants, a brooch into two pairs of studs — so it can be worn by more than one person at once.',
    keeps: ['Every stone', 'Most of the metal, redistributed'],
    loses: ['The original as a single object, permanently', 'Usually the design’s proportion, which was drawn for one piece'],
    days: 56,
    from: 62000,
    survives: 0.3,
    right:
      'Three siblings and one necklace. It is a solution to a family problem rather than a jewellery problem, and it is often the correct answer to that problem.',
  },
  {
    id: 'copy',
    name: 'Copy it, keep the original',
    summary:
      'The piece is measured, photographed and reproduced in new metal with new stones. The original goes back in the box untouched.',
    keeps: ['The original, completely', 'The design, now wearable daily'],
    loses: ['Nothing — except that the copy is a copy, and everyone in the family will know which is which'],
    days: 70,
    from: 140000,
    survives: 1,
    right:
      'A fragile or very valuable piece somebody wants to wear without risking. Expensive, and the only route on this list with no regret attached to it.',
  },
  {
    id: 'melt',
    name: 'Melt it down',
    summary:
      'The metal is refined to its pure weight and credited in full against something new. The stones are returned to you loose, in a paper.',
    keeps: ['The gold’s weight and value', 'The stones, loose'],
    loses: ['The piece. All of it. There is no version of this that is reversible.'],
    days: 14,
    from: 0,
    survives: 0,
    right:
      'A piece with no design merit and no sentiment attached — a broken chain, a lone earring, an unwearable gift. We will say so if that is what it is, and we will say the opposite just as plainly.',
  },
];

const RUPEES = (n: number) =>
  n === 0
    ? 'Credit only'
    : `₹${n.toLocaleString('en-IN')}`;

/**
 * What to do with something you did not choose.
 *
 * Almost every jeweller's website answers this with the word "bespoke" and a
 * form. The real question a person arrives with is narrower and much harder:
 * they have their mother's ring, they cannot wear it, and they do not know which
 * of five irreversible things to ask for — or that four of the five are
 * irreversible at all.
 *
 * So the interface is built round the one axis that actually matters, which is
 * how much of the original object still exists at the end. The bar under each
 * route is that fraction, drawn to scale, and it is the first thing shown rather
 * than the last. Price and lead time are secondary and are presented as such.
 *
 * The `melt` route is on the list deliberately. Leaving it off would make the
 * page a sales instrument rather than an answer, and a house that will not name
 * the destructive option is a house that ends up performing it without having
 * named it.
 */
export default function HeirloomRedesign({ className = '' }: { className?: string }) {
  const reduced = useReducedMotion();
  const [openId, setOpenId] = useState<string | null>(ROUTES[1].id);

  // Sorted by how much survives, descending. The order is the argument: the
  // conservative answers are read first.
  const ordered = useMemo(() => [...ROUTES].sort((a, b) => b.survives - a.survives), []);

  return (
    <div className={`space-y-4 ${className}`}>
      {ordered.map((route, i) => {
        const open = openId === route.id;
        return (
          <motion.div
            key={route.id}
            initial={reduced ? undefined : { opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-8% 0px' }}
            transition={{ duration: 0.6, delay: reduced ? 0 : i * 0.06, ease: easeCine.glass }}
            className={`overflow-hidden rounded-2xl border transition-colors duration-500 ${
              open ? 'border-accent/50 bg-surface-raised/70' : 'border-hairline bg-surface-raised/25'
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenId(open ? null : route.id)}
              aria-expanded={open}
              className="block w-full p-6 text-left md:p-7"
            >
              <span className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                <span className={`font-display text-2xl ${open ? 'text-accent' : 'text-primary'}`}>
                  {route.name}
                </span>

                <span className="flex flex-wrap items-center gap-x-5 gap-y-1 font-accent text-[10px] uppercase tracking-luxe text-faint">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3" aria-hidden="true" />
                    <span className="nums-tabular">{route.days} days</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <IndianRupee className="h-3 w-3" aria-hidden="true" />
                    <span className="nums-tabular">
                      {route.from === 0 ? 'credit only' : `from ${RUPEES(route.from)}`}
                    </span>
                  </span>
                </span>
              </span>

              {/* The survival bar. Drawn first and drawn to scale, because it is
                  the only figure on the row that cannot be recovered from. */}
              <span className="mt-4 block">
                <span className="flex items-baseline justify-between gap-3">
                  <span className="font-accent text-[9px] uppercase tracking-luxe text-accent">
                    How much of the original survives
                  </span>
                  <span className="nums-tabular font-accent text-[9px] text-faint">
                    {Math.round(route.survives * 100)}%
                  </span>
                </span>
                <span className="mt-2 block h-1.5 w-full overflow-hidden rounded-full bg-[rgb(var(--hairline)/0.14)]">
                  <motion.span
                    initial={reduced ? false : { scaleX: 0 }}
                    whileInView={{ scaleX: route.survives }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: easeCine.glass, delay: reduced ? 0 : 0.2 }}
                    style={{ transformOrigin: '0% 50%' }}
                    className={`block h-full w-full rounded-full ${
                      route.survives === 0
                        ? 'bg-burgundy-300'
                        : route.survives < 0.5
                          ? 'bg-gold-500'
                          : 'bg-jade-300'
                    }`}
                  />
                </span>
              </span>
            </button>

            <motion.div
              initial={false}
              animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
              transition={{ duration: reduced ? 0 : 0.55, ease: easeCine.curtain }}
              className="overflow-hidden"
            >
              <div className="space-y-6 border-t border-hairline px-6 py-6 md:px-7">
                <p className="font-sans text-sm font-light leading-relaxed text-secondary">
                  {route.summary}
                </p>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="font-accent text-[10px] uppercase tracking-luxe text-jade-300">
                      Survives
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {route.keeps.map((k) => (
                        <li
                          key={k}
                          className="flex gap-2 font-sans text-xs font-light leading-relaxed text-secondary"
                        >
                          <ArrowRight className="mt-1 h-3 w-3 flex-shrink-0 text-jade-300" aria-hidden="true" />
                          {k}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-accent text-[10px] uppercase tracking-luxe text-burgundy-300">
                      Does not
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {route.loses.map((l) => (
                        <li
                          key={l}
                          className="flex gap-2 font-sans text-xs font-light leading-relaxed text-secondary"
                        >
                          <Scissors className="mt-1 h-3 w-3 flex-shrink-0 text-burgundy-300" aria-hidden="true" />
                          {l}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <p className="border-t border-hairline pt-5 font-display text-lg italic leading-snug text-primary">
                  {route.right}
                </p>
              </div>
            </motion.div>
          </motion.div>
        );
      })}

      <p className="pt-2 font-sans text-xs font-light leading-relaxed text-faint">
        Every route except restoration begins with the same forty minutes: the piece is
        photographed at forty magnifications, weighed, and its marks recorded, and you are given
        that file whether or not you go ahead. It is the only part of this that cannot be done
        again later.
      </p>
    </div>
  );
}
