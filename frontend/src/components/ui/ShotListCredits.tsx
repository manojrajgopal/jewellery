'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * How each photograph in the season was actually made.
 *
 * The home page already admits that jewellery photography is a construction —
 * `GateSection` shows four exposures of one stone and asks which is the real
 * one. This is the follow-through on that admission, and it belongs to the
 * lookbook rather than to the home page because a lookbook is the place where
 * the construction is most complete and least visible.
 *
 * Every field here is a real production detail. Focal length and aperture are
 * the two that matter and the two nobody publishes: a 100mm macro at f/16 on a
 * ring is a completely different object from the same ring at f/2.8, and the
 * second one is what almost every jeweller shoots because a shallow depth of
 * field hides everything behind the front claw.
 *
 * The `retouch` field is the honest one. Every photograph on this site is
 * retouched and saying otherwise would be a lie, so instead it says *what* was
 * retouched — and the line it draws is the one that matters commercially:
 * dust, sensor spots and the reflection of the photographer are removed, and
 * the stone's own inclusions, colour and proportions are not. That is the whole
 * difference between a clean photograph and a false one.
 */

interface Shot {
  id: string;
  plate: string;
  title: string;
  lens: string;
  aperture: string;
  light: string;
  crew: { role: string; name: string }[];
  retouch: string;
  honest: string;
  /** How many frames were taken to get this one. */
  frames: number;
  /** Hours on set. */
  hours: number;
}

const SHOTS: Shot[] = [
  {
    id: 'plate-01',
    plate: '01',
    title: 'The opening spread',
    lens: '100mm macro',
    aperture: 'f/16, focus-stacked from 14 exposures',
    light: 'One 60cm softbox above, a white card below, and a black flag at the left to give the metal an edge to reflect',
    crew: [
      { role: 'Photography', name: 'Ishaan Mehta' },
      { role: 'Styling', name: 'Priya Nadkarni' },
      { role: 'Bench prep', name: 'Ramesh Iyer' },
    ],
    retouch:
      'Dust, two sensor spots, and the photographer reflected in the table facet. Nothing was done to the stone.',
    honest:
      'Fourteen exposures stacked because at f/16 a macro lens still cannot hold a ring sharp from the front claw to the back of the shank. Anybody showing you a single-frame ring photograph at this magnification is showing you a ring that is half out of focus and hoping you read it as style.',
    frames: 212,
    hours: 5,
  },
  {
    id: 'plate-04',
    plate: '04',
    title: 'The necklace, on the neck',
    lens: '85mm',
    aperture: 'f/4',
    light: 'Window light north-facing, one silver reflector, no flash at all',
    crew: [
      { role: 'Photography', name: 'Ishaan Mehta' },
      { role: 'Model', name: 'Aditi Sharma' },
      { role: 'Styling', name: 'Priya Nadkarni' },
      { role: 'Hair and make-up', name: 'Farah Qureshi' },
    ],
    retouch:
      'Colour balance, and the clasp was rotated in post because it had crept round to the front between frames.',
    honest:
      'Skin was not smoothed and the necklace was not lengthened. The one manipulation is the clasp, and it is exactly the sort of thing that would have been fixed on set if anybody had noticed — we would rather tell you than leave it looking like the chain hangs in a way it does not.',
    frames: 340,
    hours: 4,
  },
  {
    id: 'plate-09',
    plate: '09',
    title: 'Stones on velvet',
    lens: '65mm macro, 1:1',
    aperture: 'f/11, stacked from 8',
    light: 'Two hard sources at 45° to make the facets flash, which is the only way to photograph fire',
    crew: [
      { role: 'Photography', name: 'Ishaan Mehta' },
      { role: 'Gemmology', name: 'Dr Anjali Rao' },
    ],
    retouch: 'Dust on the velvet. The stones are as they came out of the parcel.',
    honest:
      'This is the shot where the temptation lives. Fire is real and it is also entirely a function of where the lamps are — the same stones under a single soft source look dead. We lit for fire, which is what a showroom does too, and the lighting simulator elsewhere on this site exists so you can see the same piece under the light it will actually live in.',
    frames: 96,
    hours: 3,
  },
  {
    id: 'plate-12',
    plate: '12',
    title: 'The bench, mid-morning',
    lens: '35mm',
    aperture: 'f/2',
    light: 'Whatever was there. One bench lamp and a window.',
    crew: [
      { role: 'Photography', name: 'Ishaan Mehta' },
      { role: 'At the bench', name: 'Shalini Rao' },
    ],
    retouch: 'None. Colour as shot.',
    honest:
      'The only unlit photograph in the season and the only one taken in a single frame. The bench is untidy because it is a bench, and we asked nobody to move anything — which turned out to be the argument for the whole approach, because it is the picture people write to us about.',
    frames: 61,
    hours: 1,
  },
];

export default function ShotListCredits({ className = '' }: { className?: string }) {
  const [active, setActive] = useState(SHOTS[0].id);
  const shot = SHOTS.find((s) => s.id === active) ?? SHOTS[0];

  const totalFrames = SHOTS.reduce((sum, s) => sum + s.frames, 0);
  const totalHours = SHOTS.reduce((sum, s) => sum + s.hours, 0);

  return (
    <div className={className}>
      {/* The season in two numbers, which is the fastest way to say that a
          lookbook is a production. */}
      <div className="mb-8 flex flex-wrap gap-x-10 gap-y-4 border-b border-line-subtle pb-6">
        <div>
          <p className="nums-instrument font-display text-4xl text-primary">{totalFrames}</p>
          <p className="font-accent text-[9px] uppercase tracking-luxe text-faint">
            frames taken for {SHOTS.length} plates
          </p>
        </div>
        <div>
          <p className="nums-instrument font-display text-4xl text-primary">{totalHours}</p>
          <p className="font-accent text-[9px] uppercase tracking-luxe text-faint">
            hours on set
          </p>
        </div>
        <div className="max-w-md">
          <p className="font-sans text-sm font-light leading-relaxed text-muted">
            Nothing in a lookbook is found. Every one of these was built, and the
            only useful thing a house can do about that is say how.
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]">
        <div className="space-y-1">
          {SHOTS.map((s) => {
            const isActive = active === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActive(s.id)}
                aria-pressed={isActive}
                className={`flex w-full items-baseline gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors duration-300 ${
                  isActive
                    ? 'border-accent bg-accent/[0.06]'
                    : 'border-transparent hover:border-hairline'
                }`}
              >
                <span
                  className={`nums-instrument flex-none font-accent text-[10px] uppercase tracking-luxe ${
                    isActive ? 'text-accent' : 'text-faint'
                  }`}
                >
                  {s.plate}
                </span>
                <span
                  className={`font-sans text-sm font-light ${
                    isActive ? 'text-primary' : 'text-muted'
                  }`}
                >
                  {s.title}
                </span>
              </button>
            );
          })}
        </div>

        <motion.div
          key={shot.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
            <h3 className="font-display text-3xl text-primary">{shot.title}</h3>
            <span className="nums-instrument font-accent text-[10px] uppercase tracking-luxe text-faint">
              plate {shot.plate} · {shot.frames} frames · {shot.hours}h
            </span>
          </div>

          {/* The camera details, on plates, because they are specifications. */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="spec-plate p-4">
              <p className="font-accent text-[9px] uppercase tracking-luxe text-faint">Lens</p>
              <p className="mt-1 font-display text-lg text-primary">{shot.lens}</p>
            </div>
            <div className="spec-plate p-4">
              <p className="font-accent text-[9px] uppercase tracking-luxe text-faint">
                Aperture
              </p>
              <p className="mt-1 font-display text-lg text-primary">{shot.aperture}</p>
            </div>
            <div className="spec-plate p-4 sm:col-span-2">
              <p className="font-accent text-[9px] uppercase tracking-luxe text-faint">Light</p>
              <p className="mt-1 font-sans text-sm font-light leading-relaxed text-secondary">
                {shot.light}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
                What was retouched
              </p>
              <p className="mt-2 font-sans text-sm font-light leading-relaxed text-muted">
                {shot.retouch}
              </p>
            </div>
            <div>
              <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
                The part nobody prints
              </p>
              <p className="mt-2 font-sans text-sm font-light leading-relaxed text-muted">
                {shot.honest}
              </p>
            </div>
          </div>

          {/* Credits, by name. A production is people. */}
          <div className="mt-8 border-t border-line-subtle pt-5">
            <p className="font-accent text-[10px] uppercase tracking-luxe text-faint">Credits</p>
            <div className="mt-3 flex flex-wrap gap-x-8 gap-y-3">
              {shot.crew.map((c) => (
                <div key={c.role}>
                  <p className="font-accent text-[9px] uppercase tracking-luxe text-faint">
                    {c.role}
                  </p>
                  <p className="mt-0.5 font-display text-base text-primary">{c.name}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-10 rounded-2xl border border-accent/25 bg-accent/[0.04] p-6">
        <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
          The line we draw
        </p>
        <p className="mt-3 max-w-3xl font-sans text-sm font-light leading-relaxed text-muted">
          Dust goes. Sensor spots go. The photographer reflected in a table facet
          goes. Inclusions, colour, proportion and the actual size of a stone
          against a hand stay exactly as they were, in every frame, without
          exception — and if a photograph flatters a piece more than the shop
          light will, the lighting simulator on the care page will show you the
          difference before you buy it rather than after.
        </p>
      </div>
    </div>
  );
}
