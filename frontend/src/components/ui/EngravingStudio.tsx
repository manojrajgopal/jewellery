'use client';

import { useEffect, useId, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, PenLine, RotateCcw, Type } from 'lucide-react';
import { useToast } from '@/components/providers/ToastProvider';

type Face = 'inner' | 'outer';

interface Script {
  id: string;
  label: string;
  /** Resolves to one of the three faces the site already loads. */
  family: string;
  /** Optical size adjustment, since the three faces are not the same height. */
  scale: number;
  /** Extra tracking, in em. Script faces need less, romans need more. */
  tracking: number;
  note: string;
  /** Some scripts cannot be cut below a certain depth without closing up. */
  minDepth: number;
}

const SCRIPTS: Script[] = [
  {
    id: 'roman',
    label: 'Roman Capitals',
    family: 'var(--font-accent), Marcellus, Georgia, serif',
    scale: 1,
    tracking: 0.18,
    note: 'Cut with a graver. The traditional hand for initials and dates.',
    minDepth: 1,
  },
  {
    id: 'didone',
    label: 'Italic Didone',
    family: 'var(--font-display), "Playfair Display", Georgia, serif',
    scale: 1.08,
    tracking: 0.02,
    note: 'High contrast. Beautiful at depth, fragile if cut shallow.',
    minDepth: 2,
  },
  {
    id: 'geometric',
    label: 'Geometric Sans',
    family: 'var(--font-sans), Jost, system-ui, sans-serif',
    scale: 0.94,
    tracking: 0.12,
    note: 'Laser-cut. The only hand that holds at very small sizes.',
    minDepth: 1,
  },
];

/** Depth in thousandths of an inch, which is how the bench actually specifies it. */
const DEPTHS = [
  { value: 1, label: 'Whisper', thou: 3, note: 'Visible only in raking light' },
  { value: 2, label: 'Standard', thou: 6, note: 'The house default' },
  { value: 3, label: 'Deep', thou: 10, note: 'Reads across a room' },
];

const MAX_INNER = 30;
const MAX_OUTER = 18;

/**
 * The engraving bench, with the inscription set live on the band.
 *
 * The preview is real type on a real curve — an SVG `textPath` following an arc
 * whose radius matches the band's — rather than a flat line of text laid over a
 * picture of a ring. That distinction is the whole value of the tool: a customer
 * needs to see that "For Anjali, always" will not fit around the inside of a
 * 2.4mm band before they commission it, and only actual arc length can tell them.
 *
 * Two constraints are enforced rather than merely mentioned, because they are the
 * two that come back as disappointments: the character limit for the chosen face
 * and the minimum depth that face can be cut at. An italic didone cut at three
 * thousandths closes up into an illegible groove, so the tool refuses it.
 */
export default function EngravingStudio({ className = '' }: { className?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const { toast } = useToast();

  const [face, setFace] = useState<Face>('inner');
  const [scriptId, setScriptId] = useState(SCRIPTS[0].id);
  const [depth, setDepth] = useState(2);
  const [text, setText] = useState('For Anjali · 09 · 04 · 26');
  const [committed, setCommitted] = useState(false);

  const script = SCRIPTS.find((s) => s.id === scriptId) ?? SCRIPTS[0];
  const max = face === 'inner' ? MAX_INNER : MAX_OUTER;

  // Depth is clamped up, never silently ignored: switching to a face that cannot
  // hold a whisper cut has to visibly move the control.
  useEffect(() => {
    if (depth < script.minDepth) setDepth(script.minDepth);
  }, [script.minDepth, depth]);

  // Trimmed to the limit rather than blocked at it, so pasting a long line gives
  // the visitor the part that fits instead of nothing at all.
  const shown = useMemo(() => text.slice(0, max), [text, max]);
  const overflowed = text.length > max;

  const depthSpec = DEPTHS.find((d) => d.value === depth) ?? DEPTHS[1];

  // Arc the type is set on. The inner face is a tighter radius and reads
  // right-way-up from below, which is why the two paths sweep opposite ways.
  const arc =
    face === 'inner'
      ? 'M 32 128 A 78 78 0 0 0 208 128'
      : 'M 30 118 A 82 82 0 0 1 210 118';

  const commit = () => {
    setCommitted(true);
    toast({
      kind: 'luxe',
      title: 'Inscription noted',
      message: `${script.label}, ${depthSpec.label.toLowerCase()} cut, ${face === 'inner' ? 'inner' : 'outer'} face. Our engraver will confirm the arc length.`,
    });
    window.setTimeout(() => setCommitted(false), 2600);
  };

  const reset = () => {
    setText('');
    setFace('inner');
    setScriptId(SCRIPTS[0].id);
    setDepth(2);
  };

  return (
    <div
      className={`plate-metal relative overflow-hidden rounded-2xl p-6 md:p-8 ${className}`}
    >
      {/* Bench light */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-spotlight-soft opacity-[var(--bloom)]"
      />

      <header className="relative mb-7 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-gold-500/30 text-accent">
            <PenLine size={16} strokeWidth={1.7} />
          </span>
          <div>
            <h3 className="font-display text-xl font-light text-primary md:text-2xl">
              The Engraving Bench
            </h3>
            <p className="mt-0.5 font-sans text-[11px] font-light text-muted">
              Set your inscription on the band and see it before it is cut.
            </p>
          </div>
        </div>

        <button
          onClick={reset}
          aria-label="Clear the inscription"
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-hairline text-faint transition-colors hover:border-gold-500/40 hover:text-accent"
        >
          <RotateCcw size={14} strokeWidth={1.7} />
        </button>
      </header>

      <div className="relative grid gap-8 lg:grid-cols-2">
        {/* ---- The band ---- */}
        <div className="flex flex-col items-center">
          <div className="relative w-full max-w-[18rem]">
            <svg viewBox="0 0 240 240" className="w-full overflow-visible">
              <defs>
                <linearGradient id={`band-${uid}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="rgb(var(--gold-200))" />
                  <stop offset="30%" stopColor="rgb(var(--gold-500))" />
                  <stop offset="52%" stopColor="rgb(var(--gold-100))" />
                  <stop offset="74%" stopColor="rgb(var(--gold-500))" />
                  <stop offset="100%" stopColor="rgb(var(--gold-800))" />
                </linearGradient>

                {/* The cut. A dark stroke offset down and a light one offset up
                    is what makes engraving read as removed metal rather than as
                    printed ink — the groove has a lit wall and a shadowed one. */}
                <filter id={`cut-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
                  <feOffset in="SourceAlpha" dx="0" dy={depth * 0.5} result="lo" />
                  <feFlood floodColor="rgb(var(--gold-900))" floodOpacity={0.55 + depth * 0.12} />
                  <feComposite in2="lo" operator="in" result="shadow" />
                  <feOffset in="SourceAlpha" dx="0" dy={-depth * 0.4} result="hi" />
                  <feFlood floodColor="rgb(var(--gold-50))" floodOpacity={0.3 + depth * 0.1} />
                  <feComposite in2="hi" operator="in" result="light" />
                  <feMerge>
                    <feMergeNode in="shadow" />
                    <feMergeNode in="light" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                <path id={`arc-${uid}`} d={arc} fill="none" />
              </defs>

              {/* Shank */}
              <circle
                cx="120"
                cy="120"
                r="86"
                fill="none"
                stroke={`url(#band-${uid})`}
                strokeWidth="26"
              />
              {/* Inner and outer edge highlights */}
              <circle cx="120" cy="120" r="99" fill="none" stroke="rgb(var(--gold-100))" strokeOpacity="0.28" strokeWidth="1" />
              <circle cx="120" cy="120" r="73" fill="none" stroke="rgb(var(--gold-900))" strokeOpacity="0.45" strokeWidth="1" />

              {/* Travelling specular band on the metal */}
              <circle
                cx="120"
                cy="120"
                r="86"
                fill="none"
                stroke="rgb(var(--gold-50))"
                strokeOpacity="0.4"
                strokeWidth="26"
                strokeDasharray="40 500"
                className="animate-spool-unwind"
              />

              {/* The inscription */}
              <text
                filter={`url(#cut-${uid})`}
                fill={
                  face === 'inner' ? 'rgb(var(--gold-800))' : 'rgb(var(--gold-900))'
                }
                fillOpacity={0.9}
                style={{
                  fontFamily: script.family,
                  fontSize: `${11 * script.scale}px`,
                  letterSpacing: `${script.tracking}em`,
                  textTransform: script.id === 'roman' ? 'uppercase' : 'none',
                }}
              >
                <textPath
                  href={`#arc-${uid}`}
                  startOffset="50%"
                  textAnchor="middle"
                  // spacing/method left at defaults: 'stretch' distorts the
                  // glyphs to fill the arc, which is exactly what an engraver
                  // cannot do.
                >
                  {shown}
                </textPath>
              </text>

              {/* Hallmark and artisan mark, always struck on the inner face */}
              <text
                fill="rgb(var(--gold-800))"
                fillOpacity="0.5"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '7px',
                  letterSpacing: '0.14em',
                }}
              >
                <textPath href={`#arc-${uid}`} startOffset="8%">
                  916 · AU
                </textPath>
              </text>
            </svg>

            {/* Face label under the drawing */}
            <p className="mt-2 text-center font-accent text-[9px] uppercase tracking-luxest text-faint">
              {face === 'inner' ? 'Inner face — worn against the skin' : 'Outer face — visible'}
            </p>
          </div>

          {/* Live spec readout */}
          <dl className="mt-6 grid w-full max-w-[18rem] grid-cols-3 gap-3 border-t border-hairline pt-4 text-center">
            {[
              { k: 'Characters', v: `${shown.length}/${max}` },
              { k: 'Depth', v: `${depthSpec.thou} thou` },
              { k: 'Hand', v: script.label.split(' ')[0] },
            ].map((row) => (
              <div key={row.k}>
                <dd className="nums-tabular font-display text-base text-primary">{row.v}</dd>
                <dt className="mt-0.5 font-accent text-[8px] uppercase tracking-luxe text-faint">
                  {row.k}
                </dt>
              </div>
            ))}
          </dl>
        </div>

        {/* ---- Controls ---- */}
        <div className="flex flex-col gap-6">
          {/* Text */}
          <div>
            <label
              htmlFor={`engraving-${uid}`}
              className="mb-2 flex items-center justify-between font-accent text-[10px] uppercase tracking-luxe text-muted"
            >
              <span>Inscription</span>
              <span
                className={`nums-tabular ${
                  overflowed ? 'text-burgundy-300' : 'text-faint'
                }`}
              >
                {text.length}/{max}
              </span>
            </label>
            <input
              id={`engraving-${uid}`}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="A name, a date, a line worth keeping"
              className="input-gold w-full rounded-lg px-4 py-3 text-sm"
            />
            <AnimatePresence>
              {overflowed && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 font-sans text-[11px] font-light text-burgundy-300"
                >
                  The {face} face of this band holds {max} characters. The preview shows
                  what will fit.
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Face */}
          <Group label="Face">
            {(['inner', 'outer'] as Face[]).map((f) => (
              <Chip key={f} active={face === f} onClick={() => setFace(f)}>
                {f === 'inner' ? 'Inner' : 'Outer'}
              </Chip>
            ))}
          </Group>

          {/* Script */}
          <Group label="Hand" hint={script.note}>
            {SCRIPTS.map((s) => (
              <Chip key={s.id} active={s.id === scriptId} onClick={() => setScriptId(s.id)}>
                <span style={{ fontFamily: s.family }}>{s.label}</span>
              </Chip>
            ))}
          </Group>

          {/* Depth */}
          <Group label="Depth of cut" hint={depthSpec.note}>
            {DEPTHS.map((d) => {
              const blocked = d.value < script.minDepth;
              return (
                <Chip
                  key={d.value}
                  active={depth === d.value}
                  disabled={blocked}
                  onClick={() => setDepth(d.value)}
                  title={
                    blocked
                      ? `${script.label} closes up below ${DEPTHS.find((x) => x.value === script.minDepth)?.thou} thou`
                      : undefined
                  }
                >
                  {d.label}
                </Chip>
              );
            })}
          </Group>

          {/* Commit */}
          <button
            onClick={commit}
            disabled={shown.trim().length === 0}
            className="group relative mt-2 inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full bg-accent px-7 py-3.5 font-accent text-[11px] uppercase tracking-luxe text-onaccent shadow-gold transition-shadow duration-300 hover:shadow-gold-lg disabled:opacity-40 disabled:shadow-none"
          >
            <span className="relative z-10 flex items-center gap-2.5">
              <AnimatePresence mode="wait" initial={false}>
                {committed ? (
                  <motion.span
                    key="done"
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0 }}
                    className="flex"
                  >
                    <Check size={14} strokeWidth={2.2} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="idle"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="flex"
                  >
                    <Type size={14} strokeWidth={1.9} />
                  </motion.span>
                )}
              </AnimatePresence>
              {committed ? 'Noted' : 'Send to the engraver'}
            </span>
            <span className="absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </button>

          <p className="font-sans text-[10px] font-light italic leading-relaxed text-faint">
            Engraving is included on every commission and cannot be undone — our
            engraver will read the arc length back to you before a graver touches
            the band.
          </p>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Group({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-2 font-accent text-[10px] uppercase tracking-luxe text-muted">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
      {hint && (
        <AnimatePresence mode="wait">
          <motion.p
            key={hint}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-2 font-sans text-[11px] font-light text-faint"
          >
            {hint}
          </motion.p>
        </AnimatePresence>
      )}
    </div>
  );
}

function Chip({
  active,
  disabled,
  onClick,
  children,
  title,
}: {
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-pressed={active}
      className={`relative rounded-full border px-4 py-2 font-accent text-[10px] uppercase tracking-luxe transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-30 ${
        active
          ? 'border-gold-500/60 text-accent'
          : 'border-hairline text-muted hover:border-gold-500/40 hover:text-accent'
      }`}
    >
      {/* Not a shared layoutId: several chip groups sit in one column here, and a
          layoutId scoped per group would still fly the pill between groups the
          moment two of them re-render together. A local scale-in is honest. */}
      <AnimatePresence>
        {active && (
          <motion.span
            initial={{ opacity: 0, scale: 0.86 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="absolute inset-0 -z-10 rounded-full bg-gold-500/12"
          />
        )}
      </AnimatePresence>
      {children}
    </button>
  );
}
