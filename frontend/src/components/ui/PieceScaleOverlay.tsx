'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * A piece at its true size on your own screen.
 *
 * Every product photograph on every jeweller's site in the world is the same
 * size, which means a 4mm stud and a 22mm cocktail ring look identical until
 * the parcel arrives. It is the single commonest cause of disappointment in
 * this trade and it is entirely solvable, because a screen has a known physical
 * pixel density and a credit card is a legally standardised object.
 *
 * ID-1, the card format, is 85.60mm × 53.98mm and has been since 1985. Every
 * debit card, credit card, driving licence and most national identity cards in
 * the world are cut to it. So: hold a card against the screen, drag until the
 * outline matches, and the browser now knows how many CSS pixels make a
 * millimetre on this particular display. Everything below is then drawn at life
 * size and stays there.
 *
 * The calibration is kept in component state rather than written anywhere. It
 * is a five-second gesture, it is different on every device somebody owns, and
 * a stale calibration silently carried over from a phone to a desktop would be
 * worse than no calibration at all.
 */

interface Reference {
  id: string;
  label: string;
  /** Real width in millimetres. */
  mm: number;
  note: string;
}

/** Things a person can hold up to compare against. Every figure is real. */
const REFERENCES: Reference[] = [
  { id: 'none', label: 'Nothing', mm: 0, note: '' },
  {
    id: 'grain',
    label: 'A grain of rice',
    mm: 6,
    note: 'About six millimetres. Roughly a 0.75ct round diamond face-up, which surprises almost everybody.',
  },
  {
    id: 'pencil',
    label: 'A pencil',
    mm: 7,
    note: 'Seven millimetres across the flats. A useful check for a band width — most people who ask for a "wide" band mean about this.',
  },
  {
    id: 'coin',
    label: 'A ten-rupee coin',
    mm: 27,
    note: 'Twenty-seven millimetres. Bigger than almost any ring anybody actually wears, which is worth knowing before choosing a cocktail piece.',
  },
];

interface Piece {
  id: string;
  name: string;
  /** Face-up width in millimetres. */
  mm: number;
  kind: 'stone' | 'ring' | 'stud' | 'pendant';
  note: string;
}

const PIECES: Piece[] = [
  { id: 's-025', name: '0.25ct round', mm: 4.1, kind: 'stone', note: 'A quarter carat. The size most people picture when they say "a small diamond", and smaller than they picture.' },
  { id: 's-050', name: '0.50ct round', mm: 5.2, kind: 'stone', note: 'Half a carat is not half the width of a carat — a carat is a weight and width goes as the cube root of it. This is the single most misunderstood fact about stone sizes.' },
  { id: 's-100', name: '1.00ct round', mm: 6.5, kind: 'stone', note: 'The reference stone. Twice the weight of the half carat above it and only a quarter wider.' },
  { id: 's-200', name: '2.00ct round', mm: 8.2, kind: 'stone', note: 'Twice the weight again, and again only a quarter wider. This is why the price per carat climbs — the visible difference is far smaller than the weight difference.' },
  { id: 'stud', name: 'Everyday stud', mm: 4.5, kind: 'stud', note: 'What most people mean by a diamond stud. Anything much larger stops reading as everyday and starts reading as a statement.' },
  { id: 'band', name: 'Court band, 4mm', mm: 4, kind: 'ring', note: 'The commonest wedding band width, and the one that suits most hands. Wider is not more substantial, it is simply wider.' },
  { id: 'signet', name: 'Signet face', mm: 14, kind: 'ring', note: 'Fourteen millimetres across the face. Big enough to engrave properly and small enough to wear at a desk.' },
  { id: 'cocktail', name: 'Cocktail ring', mm: 22, kind: 'ring', note: 'Twenty-two millimetres. This is genuinely large — hold your own hand up to it before deciding.' },
  { id: 'pendant', name: 'Locket', mm: 19, kind: 'pendant', note: 'Nineteen millimetres. A locket smaller than about sixteen cannot take a photograph, which is the point of a locket.' },
];

/** ID-1, the card standard. 85.60mm wide, unchanged since 1985. */
const CARD_MM = 85.6;

export default function PieceScaleOverlay({ className = '' }: { className?: string }) {
  // CSS pixels per millimetre. The starting guess is a 96dpi display, which is
  // right for a surprising number of monitors and wrong for every phone.
  const [pxPerMm, setPxPerMm] = useState(3.78);
  const [calibrating, setCalibrating] = useState(true);
  const [selected, setSelected] = useState<string[]>(['s-100', 's-050']);
  const [reference, setReference] = useState('none');

  const cardWidth = CARD_MM * pxPerMm;
  const ref = REFERENCES.find((r) => r.id === reference);

  const toggle = (id: string) =>
    setSelected((current) =>
      current.includes(id)
        ? current.filter((v) => v !== id)
        : [...current.slice(-2), id]
    );

  return (
    <div className={className}>
      {/* Calibration. */}
      <div className="rounded-2xl border border-hairline bg-canvas-alt p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
            {calibrating ? 'One gesture, then everything below is life size' : 'Calibrated'}
          </p>
          <button
            type="button"
            onClick={() => setCalibrating((v) => !v)}
            className="font-accent text-[10px] uppercase tracking-luxe text-muted transition-colors hover:text-accent"
          >
            {calibrating ? 'Done' : 'Calibrate again'}
          </button>
        </div>

        {calibrating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden"
          >
            <p className="mt-3 max-w-2xl font-sans text-sm font-light leading-relaxed text-muted">
              Hold any bank card, driving licence or identity card flat against
              the screen and drag until the outline is exactly its width. Every
              card in the world is 85.6mm across — it has been the standard since
              1985 — so this one gesture tells the page how big a millimetre is
              on your particular display.
            </p>

            <div className="mt-6 overflow-x-auto">
              <motion.div
                className="relative flex-none rounded-lg border-2 border-dashed border-accent/70 bg-accent/[0.04]"
                style={{ width: cardWidth, height: cardWidth * (53.98 / 85.6) }}
                animate={{ width: cardWidth, height: cardWidth * (53.98 / 85.6) }}
                transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              >
                <span className="absolute bottom-2 left-3 font-accent text-[9px] uppercase tracking-luxe text-accent">
                  85.60 mm
                </span>
              </motion.div>
            </div>

            <input
              type="range"
              min={2}
              max={9}
              step={0.01}
              value={pxPerMm}
              onChange={(e) => setPxPerMm(Number(e.target.value))}
              aria-label="Match the outline to a bank card"
              className="range-overlay mt-5 w-full max-w-md"
            />
            <p className="nums-instrument mt-2 font-accent text-[9px] uppercase tracking-luxe text-faint">
              {pxPerMm.toFixed(2)} px per mm · about {Math.round(pxPerMm * 25.4)} dpi
            </p>
          </motion.div>
        )}
      </div>

      {/* The pieces, at true size. */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]">
        <div>
          <p className="font-accent text-[10px] uppercase tracking-luxe text-muted">
            Compare up to three
          </p>
          <div className="mt-3 space-y-1">
            {PIECES.map((p) => {
              const on = selected.includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => toggle(p.id)}
                  aria-pressed={on}
                  className={`flex w-full items-baseline justify-between gap-3 rounded-lg border px-3 py-2 text-left transition-colors duration-300 ${
                    on ? 'border-accent bg-accent/[0.06]' : 'border-transparent hover:border-hairline'
                  }`}
                >
                  <span
                    className={`font-sans text-sm font-light ${on ? 'text-primary' : 'text-muted'}`}
                  >
                    {p.name}
                  </span>
                  <span className="nums-instrument flex-none font-accent text-[10px] uppercase tracking-luxe text-faint">
                    {p.mm.toFixed(1)}mm
                  </span>
                </button>
              );
            })}
          </div>

          <p className="mt-6 font-accent text-[10px] uppercase tracking-luxe text-muted">
            Something to hold up
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {REFERENCES.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setReference(r.id)}
                aria-pressed={reference === r.id}
                className={`rounded-full border px-3 py-1.5 font-accent text-[10px] uppercase tracking-luxe transition-colors duration-300 ${
                  reference === r.id
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-hairline text-muted hover:border-accent/50 hover:text-accent'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
          {ref?.note && (
            <p className="mt-3 font-sans text-xs font-light leading-relaxed text-faint">
              {ref.note}
            </p>
          )}
        </div>

        <div>
          <div className="velvet-bed relative flex min-h-[16rem] flex-wrap items-center justify-center gap-8 overflow-x-auto rounded-2xl border border-hairline p-8">
            {selected.length === 0 && (
              <p className="font-sans text-sm font-light text-on-media-muted">
                Choose something on the left.
              </p>
            )}

            {selected.map((id) => {
              const p = PIECES.find((x) => x.id === id);
              if (!p) return null;
              const size = p.mm * pxPerMm;
              return (
                <motion.div
                  key={id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 240, damping: 28 }}
                  className="flex flex-col items-center gap-3"
                >
                  <div
                    className="flex-none rounded-full"
                    style={{
                      width: size,
                      height: size,
                      background:
                        p.kind === 'stone' || p.kind === 'stud'
                          ? 'radial-gradient(circle at 36% 30%, rgb(var(--cream-50)), rgb(var(--diamond)) 34%, rgb(var(--ink-200)) 72%, rgb(var(--ink-400)))'
                          : 'radial-gradient(circle at 36% 30%, rgb(var(--gold-100)), rgb(var(--gold-400)) 42%, rgb(var(--gold-700)))',
                      boxShadow: '0 8px 22px -10px rgb(var(--shadow-color)/0.8)',
                    }}
                  />
                  <span className="nums-instrument font-accent text-[9px] uppercase tracking-luxe text-on-media-soft">
                    {p.name} · {p.mm.toFixed(1)}mm
                  </span>
                </motion.div>
              );
            })}

            {ref && ref.mm > 0 && (
              <div className="flex flex-col items-center gap-3">
                <div
                  className="flex-none rounded-sm border border-dashed border-on-media"
                  style={{ width: ref.mm * pxPerMm, height: ref.mm * pxPerMm }}
                />
                <span className="nums-instrument font-accent text-[9px] uppercase tracking-luxe text-on-media-muted">
                  {ref.label} · {ref.mm}mm
                </span>
              </div>
            )}
          </div>

          {/* One millimetre rule under the tray, so the calibration is
              checkable rather than trusted. */}
          <div className="mt-4 flex items-center gap-3">
            <div className="relative h-4" style={{ width: 10 * pxPerMm }}>
              <div className="absolute inset-x-0 top-2 h-px bg-accent/60" />
              {Array.from({ length: 11 }, (_, i) => (
                <span
                  key={i}
                  className="absolute top-0 w-px bg-accent/60"
                  style={{ left: i * pxPerMm, height: i % 5 === 0 ? 8 : 4 }}
                />
              ))}
            </div>
            <span className="font-accent text-[9px] uppercase tracking-luxe text-faint">
              One centimetre — check it against a ruler
            </span>
          </div>

          {selected.length > 0 && (
            <p className="mt-5 border-t border-line-subtle pt-5 font-sans text-sm font-light leading-relaxed text-muted">
              {PIECES.find((p) => p.id === selected[selected.length - 1])?.note}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
