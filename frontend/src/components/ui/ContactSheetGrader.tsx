'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { useToast } from '@/components/providers/ToastProvider';

/**
 * A contact sheet, and a chinagraph pencil.
 *
 * Before anybody printed anything, a roll of film was contact-printed onto one
 * sheet at actual size and gone over with a chinagraph — a wax pencil that
 * writes on the emulsion and wipes off. A ring round a frame meant print it, a
 * cross meant never, and a bracket meant crop to here. An editor and a
 * photographer would sit over one sheet and argue, and every photograph
 * anybody remembers from the twentieth century was chosen this way.
 *
 * The gallery on this site is a finished selection, which means the choosing
 * has already been done for the visitor and is invisible. This hands it back:
 * thirty-six frames of the same short sequence, and the visitor marks their own
 * selects. Then — and this is the part worth building — it compares their marks
 * to ours and says where we disagreed.
 *
 * That comparison is the whole feature. It is the only honest way to make the
 * point that a gallery is an argument rather than a record, and it works
 * because people are genuinely surprised by which frames they picked.
 */

type Mark = 'select' | 'maybe' | 'kill';

interface Frame {
  n: number;
  /** The house's own mark on this frame. */
  ours: Mark;
  /** Why, in the words the editor used. Only on the frames worth arguing about. */
  note?: string;
}

/**
 * Thirty-six frames, marked. The distribution is real for a jewellery sequence
 * — three or four keepers out of a roll is a good roll, and the run of kills
 * in the middle is where the light moved.
 */
const FRAMES: Frame[] = [
  { n: 1, ours: 'kill', note: 'Test frame. Everybody shoots one and nobody looks at it.' },
  { n: 2, ours: 'kill' },
  { n: 3, ours: 'maybe' },
  { n: 4, ours: 'maybe', note: 'Nearly. The hand is right and the stone is a degree off the light.' },
  { n: 5, ours: 'select', note: 'The one we printed. Not the sharpest frame on the sheet and the only one where the hand looks like it belongs to somebody.' },
  { n: 6, ours: 'maybe' },
  { n: 7, ours: 'kill' },
  { n: 8, ours: 'kill' },
  { n: 9, ours: 'kill', note: 'The lamp got knocked here. Everything from 9 to 14 is a stop down and slightly warm.' },
  { n: 10, ours: 'kill' },
  { n: 11, ours: 'kill' },
  { n: 12, ours: 'kill' },
  { n: 13, ours: 'kill' },
  { n: 14, ours: 'kill' },
  { n: 15, ours: 'maybe' },
  { n: 16, ours: 'select', note: 'The technically perfect one. Sharp, lit, correct, and it is on the cutting-room floor because it is boring — which is the entire argument this sheet exists to have.' },
  { n: 17, ours: 'maybe' },
  { n: 18, ours: 'kill' },
  { n: 19, ours: 'kill' },
  { n: 20, ours: 'maybe' },
  { n: 21, ours: 'maybe' },
  { n: 22, ours: 'select', note: 'Motion in the chain. A mistake at the time, and the frame everybody stops on.' },
  { n: 23, ours: 'kill' },
  { n: 24, ours: 'kill' },
  { n: 25, ours: 'maybe' },
  { n: 26, ours: 'kill' },
  { n: 27, ours: 'kill' },
  { n: 28, ours: 'maybe', note: 'The safe frame. Every shoot has one and it is what gets used when there is no time to argue.' },
  { n: 29, ours: 'kill' },
  { n: 30, ours: 'kill' },
  { n: 31, ours: 'select', note: 'Last of the roll and the light had gone amber. We kept it for the colour, which is a decision we would lose an argument about.' },
  { n: 32, ours: 'kill' },
  { n: 33, ours: 'kill' },
  { n: 34, ours: 'maybe' },
  { n: 35, ours: 'kill' },
  { n: 36, ours: 'kill', note: 'End of the roll, fogged at the edge. Always is.' },
];

const MARKS: Record<Mark, { label: string; tone: string; glyph: string }> = {
  select: { label: 'Print it', tone: 'var(--series-1)', glyph: '○' },
  maybe: { label: 'Maybe', tone: 'var(--series-2)', glyph: '?' },
  kill: { label: 'Never', tone: 'var(--series-4)', glyph: '✕' },
};

const ORDER: Mark[] = ['select', 'maybe', 'kill'];

export default function ContactSheetGrader({ className = '' }: { className?: string }) {
  const { toast } = useToast();
  const [marks, setMarks] = useState<Record<number, Mark>>({});
  const [compare, setCompare] = useState(false);
  const [note, setNote] = useState<number | null>(null);

  const cycle = (n: number) => {
    setMarks((current) => {
      const now = current[n];
      const next = now === undefined ? ORDER[0] : ORDER[(ORDER.indexOf(now) + 1) % ORDER.length];
      // A fourth press clears it, which is how a chinagraph works — you wipe it.
      if (now === ORDER[ORDER.length - 1]) {
        const rest = { ...current };
        delete rest[n];
        return rest;
      }
      return { ...current, [n]: next };
    });
  };

  const marked = Object.keys(marks).length;

  const agreement = useMemo(() => {
    const entries = Object.entries(marks);
    if (entries.length === 0) return null;
    const same = entries.filter(
      ([n, m]) => FRAMES.find((f) => f.n === Number(n))?.ours === m
    ).length;

    // The interesting number: frames we printed that the visitor killed.
    const missed = FRAMES.filter(
      (f) => f.ours === 'select' && marks[f.n] && marks[f.n] !== 'select'
    );
    const found = FRAMES.filter(
      (f) => f.ours !== 'select' && marks[f.n] === 'select'
    );

    return { same, total: entries.length, missed, found };
  }, [marks]);

  const shown = note !== null ? FRAMES.find((f) => f.n === note) : null;

  return (
    <div className={className}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {ORDER.map((m) => (
            <span
              key={m}
              className="flex items-center gap-2 font-accent text-[9px] uppercase tracking-luxe text-muted"
            >
              <span
                className="series-swatch flex items-center justify-center text-[8px] text-cream-50"
                style={{ background: `rgb(${MARKS[m].tone})` }}
                aria-hidden="true"
              />
              {MARKS[m].label}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <span className="nums-instrument font-accent text-[9px] uppercase tracking-luxe text-faint">
            {marked} of 36 marked
          </span>
          <button
            type="button"
            onClick={() => {
              if (marked < 6) {
                toast({
                  title: 'Mark a few more',
                  message: 'Six frames is enough to have an argument about. You have marked ' + marked + '.',
                  kind: 'info',
                });
                return;
              }
              setCompare((v) => !v);
            }}
            aria-pressed={compare}
            className={`rounded-full border px-4 py-2 font-accent text-[10px] uppercase tracking-luxe transition-colors duration-300 ${
              compare
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-accent bg-accent text-onaccent hover:bg-accent-soft'
            }`}
          >
            {compare ? 'Hide our marks' : 'Show what we chose'}
          </button>
        </div>
      </div>

      {/* The sheet. Six across, six down, the way a 36-exposure roll contacts. */}
      <div className="rounded-2xl border border-hairline bg-ink-950 p-4 sm:p-6">
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 sm:gap-3">
          {FRAMES.map((frame) => {
            const mine = marks[frame.n];
            return (
              <button
                key={frame.n}
                type="button"
                onClick={() => {
                  cycle(frame.n);
                  setNote(frame.note ? frame.n : null);
                }}
                aria-label={`Frame ${frame.n}${mine ? `, marked ${MARKS[mine].label}` : ', unmarked'}`}
                className="group relative aspect-[3/2] overflow-hidden rounded-[2px]"
              >
                {/* The frame itself. Deterministic tonality per frame number so
                    the sheet has the light falling off through the middle that
                    the notes describe. */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(${140 + frame.n * 7}deg, rgb(var(--ink-700)) 0%, rgb(var(--gold-${
                      frame.n >= 9 && frame.n <= 14 ? '800' : '600'
                    })/${frame.n >= 9 && frame.n <= 14 ? 0.34 : 0.6}) 48%, rgb(var(--ink-900)) 100%)`,
                  }}
                />
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    background: `radial-gradient(60% 60% at ${30 + (frame.n % 5) * 12}% ${
                      28 + (frame.n % 4) * 14
                    }%, rgb(var(--gold-100)/0.7), transparent 70%)`,
                  }}
                />

                {/* Frame number, on the rebate, like a real contact sheet. */}
                <span className="nums-instrument absolute bottom-0.5 left-1 font-accent text-[8px] text-cream-50/70">
                  {frame.n}
                </span>

                {/* Our mark, when it is shown. Drawn under the visitor's. */}
                <AnimatePresence>
                  {compare && (
                    <motion.span
                      initial={{ opacity: 0, scale: 1.4 }}
                      animate={{ opacity: 0.85, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="pointer-events-none absolute inset-1 rounded-full border-2"
                      style={{
                        borderColor: `rgb(${MARKS[frame.ours].tone})`,
                        borderRadius: frame.ours === 'select' ? '9999px' : '2px',
                        borderStyle: frame.ours === 'maybe' ? 'dashed' : 'solid',
                        opacity: frame.ours === 'kill' ? 0.35 : 0.85,
                      }}
                    />
                  )}
                </AnimatePresence>

                {/* The visitor's chinagraph. Drawn over everything, in wax. */}
                {mine && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.4, rotate: -12 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    className="pointer-events-none absolute inset-0 flex items-center justify-center font-display text-3xl"
                    style={{
                      color: `rgb(${MARKS[mine].tone})`,
                      textShadow: '0 1px 2px rgba(0,0,0,0.6)',
                    }}
                  >
                    {MARKS[mine].glyph}
                  </motion.span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-3 font-accent text-[9px] uppercase tracking-luxe text-faint">
        Click a frame to cycle — print it, maybe, never, clear. Wipes off, like wax.
      </p>

      {/* The note on the frame just marked. */}
      <AnimatePresence mode="wait">
        {shown?.note && (
          <motion.p
            key={shown.n}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-5 border-l-2 border-accent/40 pl-4 font-sans text-sm font-light leading-relaxed text-muted"
          >
            <span className="nums-instrument font-accent text-[10px] uppercase tracking-luxe text-accent">
              Frame {shown.n} ·{' '}
            </span>
            {shown.note}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Where we disagreed, which is the point. */}
      <AnimatePresence>
        {compare && agreement && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-8 grid gap-6 border-t border-line-subtle pt-6 md:grid-cols-3">
              <div>
                <p className="nums-instrument font-display text-4xl text-primary">
                  {Math.round((agreement.same / agreement.total) * 100)}%
                </p>
                <p className="font-accent text-[9px] uppercase tracking-luxe text-faint">
                  of your marks matched ours
                </p>
              </div>

              <div>
                <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
                  We printed, you did not
                </p>
                <p className="mt-2 font-sans text-sm font-light leading-relaxed text-muted">
                  {agreement.missed.length === 0
                    ? 'None — you found every frame we hung.'
                    : `Frames ${agreement.missed.map((f) => f.n).join(', ')}. Worth looking at them again; two of the four we printed are technically the weaker frame and were chosen anyway.`}
                </p>
              </div>

              <div>
                <p className="font-accent text-[10px] uppercase tracking-luxe text-accent">
                  You printed, we did not
                </p>
                <p className="mt-2 font-sans text-sm font-light leading-relaxed text-muted">
                  {agreement.found.length === 0
                    ? 'None. Which either means we were right or means the sheet is more persuasive than it ought to be.'
                    : `Frames ${agreement.found.map((f) => f.n).join(', ')}. There is no correct answer here — an editor and a photographer disagree over exactly this, every time, and the sheet is where they do it.`}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
