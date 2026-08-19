'use client';

import CinematicScene, { type Shot } from '@/components/motion/CinematicScene';

/**
 * The house's story told as a scroll-scrubbed film sequence — five shots that
 * cross-dissolve as the visitor scrolls, each with its own camera move.
 *
 * Placed between the collections and the atelier, where the page has earned
 * enough attention to hold a long pinned section but has not yet asked for a
 * decision.
 */
const SHOTS: Shot[] = [
  {
    image: '/images/hero/craftsmanship.jpg',
    kicker: 'Reel One',
    title: 'It begins in the rough',
    body: 'Every AURUM piece starts as unremarkable stone. What separates a gem from a mineral is the judgement of the hand that reads it — where the light will enter, and where it will leave.',
    move: 'push-in',
  },
  {
    image: '/images/collections/heritage.jpg',
    kicker: 'Reel Two',
    title: 'Four generations of hands',
    body: 'The techniques in our workshop were not learned from a manual. They were shown, corrected, and shown again — passed down since 1892 in a language of pressure and patience.',
    move: 'pan-right',
  },
  {
    image: '/images/collections/bridal.jpg',
    kicker: 'Reel Three',
    title: 'Eighty hours for one setting',
    body: 'A single bridal setting takes a master artisan close to a fortnight. Each claw is raised, shaped and burnished by hand, because a machine cannot feel when a stone has seated.',
    move: 'pull-out',
  },
  {
    image: '/images/collections/gemstone.jpg',
    kicker: 'Reel Four',
    title: 'Then the stone speaks',
    body: 'Fire, brilliance, scintillation — the three ways a cut stone returns light. Getting all three from one piece of rough is the whole art, and the reason no two of ours are identical.',
    move: 'pan-left',
  },
  {
    image: '/images/collections/statement.jpg',
    kicker: 'Reel Five',
    title: 'And it outlives us all',
    body: 'We build for the third owner, not the first. Every AURUM piece carries a lifetime of servicing, because an heirloom that cannot be repaired was never an heirloom.',
    move: 'push-in',
  },
];

export default function FilmSection() {
  return <CinematicScene id="film" shots={SHOTS} heightPerShot={0.9} />;
}
