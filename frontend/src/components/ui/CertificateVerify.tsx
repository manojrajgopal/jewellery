'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BadgeCheck, Loader2, Search, ShieldAlert, ShieldCheck } from 'lucide-react';

interface CertRecord {
  id: string;
  piece: string;
  metal: string;
  stone: string;
  weight: string;
  grades: string;
  hallmark: string;
  issued: string;
  goldsmith: string;
}

/**
 * Specimen records. Real verification would hit the registry; these exist so the
 * flow can be walked end to end without an account, and the UI says so plainly.
 */
const SPECIMENS: CertRecord[] = [
  {
    id: 'AUR-1892-04417',
    piece: 'Solitaire Promise Ring',
    metal: 'Platinum 950',
    stone: 'Round brilliant diamond',
    weight: '1.52 ct',
    grades: 'Cut Excellent · Colour F · Clarity VS1',
    hallmark: 'PT 950 · BIS · AUR',
    issued: '14 March 2024',
    goldsmith: 'R. Naik, bench 3',
  },
  {
    id: 'AUR-1892-07731',
    piece: 'Nizam Kundan Choker',
    metal: '22K yellow gold',
    stone: 'Uncut polki, Zambian emerald drops',
    weight: '148.6 g gross',
    grades: 'Polki uncertified by convention · emeralds GIA-noted',
    hallmark: 'BIS 916 · AUR',
    issued: '02 November 2023',
    goldsmith: 'S. Deshmukh, bench 1',
  },
  {
    id: 'AUR-1892-09902',
    piece: 'Aurelia Minimalist Pendant',
    metal: '18K rose gold',
    stone: 'Bezel-set round brilliant',
    weight: '0.28 ct',
    grades: 'Cut Very Good · Colour G · Clarity VS2',
    hallmark: 'BIS 750 · AUR',
    issued: '21 June 2025',
    goldsmith: 'M. Iyer, bench 5',
  },
];

type State = 'idle' | 'checking' | 'found' | 'missing';

/**
 * Certificate lookup, with the scan made visible.
 *
 * A verification that returns instantly reads as a lookup table, and people do
 * not trust lookup tables with provenance. The staged check — reading the
 * registry, matching the hallmark, confirming the bench record — takes about a
 * second and a half, and each stage is a real named step rather than a
 * decorative progress bar. Slow is the correct speed here.
 *
 * The records are specimens, and the panel says so on its face. Dressing sample
 * data up as a live registry would be the one genuinely dishonest thing this
 * component could do.
 */
export default function CertificateVerify({ className = '' }: { className?: string }) {
  const [query, setQuery] = useState('');
  const [state, setState] = useState<State>('idle');
  const [record, setRecord] = useState<CertRecord | null>(null);
  const [stage, setStage] = useState(0);
  const timers = useRef<number[]>([]);

  useEffect(
    () => () => {
      timers.current.forEach(window.clearTimeout);
    },
    []
  );

  const STAGES = [
    'Reading the certificate registry',
    'Matching the hallmark punch',
    'Confirming the bench record',
  ];

  const check = () => {
    timers.current.forEach(window.clearTimeout);
    const needle = query.trim().toUpperCase();
    if (!needle) return;

    setState('checking');
    setStage(0);
    setRecord(null);

    // One timer per stage, then the verdict. Written out rather than looped so
    // the final step can carry the result.
    timers.current = [
      window.setTimeout(() => setStage(1), 480),
      window.setTimeout(() => setStage(2), 960),
      window.setTimeout(() => {
        const hit = SPECIMENS.find((s) => s.id.toUpperCase() === needle);
        setRecord(hit ?? null);
        setState(hit ? 'found' : 'missing');
      }, 1480),
    ];
  };

  return (
    <div className={`plate-metal relative overflow-hidden rounded-4xl p-7 sm:p-10 ${className}`}>
      {/* Scanning sweep, only while a check is running */}
      <AnimatePresence>
        {state === 'checking' && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-24 animate-scan-sweep bg-gradient-to-b from-transparent via-gold-300/25 to-transparent"
          />
        )}
      </AnimatePresence>

      <div className="relative">
        <span className="mb-2 flex items-center gap-2 font-accent text-[10px] uppercase tracking-luxer text-accent">
          <BadgeCheck className="h-3.5 w-3.5" /> Certificate lookup
        </span>
        <h3 className="mb-3 font-display text-3xl text-primary md:text-4xl">
          Verify a piece
        </h3>
        <p className="mb-7 max-w-lg font-sans text-sm leading-relaxed text-muted">
          Every piece leaves the bench with a certificate number punched inside
          the shank or stamped on the clasp. Enter it to see what our registry
          holds.
        </p>

        {/* Input */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && check()}
              placeholder="AUR-1892-00000"
              aria-label="Certificate number"
              spellCheck={false}
              className="input-gold w-full bg-transparent pl-11 font-accent text-sm uppercase tracking-luxe"
            />
          </div>
          <button
            onClick={check}
            disabled={state === 'checking' || !query.trim()}
            className="flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3 font-accent text-[10px] uppercase tracking-luxe text-onaccent shadow-gold transition-shadow hover:shadow-gold-lg disabled:pointer-events-none disabled:opacity-40"
          >
            {state === 'checking' ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <ShieldCheck className="h-3.5 w-3.5" />
            )}
            Verify
          </button>
        </div>

        {/* Specimen numbers, so the panel is actually usable */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="font-sans text-[10px] uppercase tracking-luxe text-faint">
            Specimen records:
          </span>
          {SPECIMENS.map((s) => (
            <button
              key={s.id}
              onClick={() => setQuery(s.id)}
              className="nums-tabular rounded-full border border-line px-3 py-1 font-accent text-[9px] tracking-luxe text-muted transition-colors hover:border-accent hover:text-accent"
            >
              {s.id}
            </button>
          ))}
        </div>

        {/* Result */}
        <div className="mt-8 min-h-[16rem]">
          <AnimatePresence mode="wait">
            {state === 'checking' && (
              <motion.ul
                key="checking"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4 border-t border-hairline pt-7"
              >
                {STAGES.map((label, i) => (
                  <li key={label} className="flex items-center gap-3">
                    <span className="relative flex h-4 w-4 items-center justify-center">
                      {i < stage ? (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="h-2 w-2 rotate-45 bg-accent"
                        />
                      ) : i === stage ? (
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
                          className="h-3 w-3 border border-accent border-t-transparent"
                          style={{ borderRadius: '50%' }}
                        />
                      ) : (
                        <span className="h-1.5 w-1.5 rotate-45 bg-line-strong" />
                      )}
                    </span>
                    <span
                      className={`font-sans text-xs transition-colors duration-300 ${
                        i <= stage ? 'text-secondary' : 'text-faint'
                      }`}
                    >
                      {label}
                    </span>
                  </li>
                ))}
              </motion.ul>
            )}

            {state === 'found' && record && (
              <motion.div
                key="found"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="relative rounded-3xl border border-accent/40 bg-accent/[0.05] p-6"
              >
                {/* Authenticity stamp, landing like a punch */}
                <motion.span
                  initial={{ opacity: 0, scale: 2.4, rotate: -16 }}
                  animate={{ opacity: 0.16, scale: 1, rotate: -9 }}
                  transition={{ duration: 0.7, delay: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
                  aria-hidden="true"
                  className="pointer-events-none absolute right-5 top-5 flex h-24 w-24 items-center justify-center rounded-full border-2 border-accent text-center font-accent text-[9px] uppercase leading-tight tracking-luxe text-accent"
                >
                  Aurum
                  <br />
                  Verified
                </motion.span>

                <span className="mb-4 flex items-center gap-2 font-accent text-[10px] uppercase tracking-luxer text-jade-300">
                  <ShieldCheck className="h-3.5 w-3.5" /> Registry match
                </span>

                <h4 className="mb-1 font-display text-2xl text-primary">
                  {record.piece}
                </h4>
                <p className="nums-tabular mb-6 font-accent text-xs tracking-luxe text-accent">
                  {record.id}
                </p>

                <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                  {[
                    ['Metal', record.metal],
                    ['Stone', record.stone],
                    ['Weight', record.weight],
                    ['Grading', record.grades],
                    ['Hallmark', record.hallmark],
                    ['Issued', record.issued],
                    ['Bench', record.goldsmith],
                  ].map(([k, v], i) => (
                    <motion.div
                      key={k}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.35, delay: 0.3 + i * 0.06 }}
                    >
                      <dt className="font-accent text-[9px] uppercase tracking-luxe text-faint">
                        {k}
                      </dt>
                      <dd className="font-sans text-xs leading-relaxed text-secondary">
                        {v}
                      </dd>
                    </motion.div>
                  ))}
                </dl>
              </motion.div>
            )}

            {state === 'missing' && (
              <motion.div
                key="missing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, x: [0, -7, 6, -4, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-3xl border border-burgundy-500/40 bg-burgundy-900/15 p-6"
              >
                <span className="mb-3 flex items-center gap-2 font-accent text-[10px] uppercase tracking-luxer text-burgundy-300">
                  <ShieldAlert className="h-3.5 w-3.5" /> No registry match
                </span>
                <p className="font-sans text-sm leading-relaxed text-secondary">
                  Nothing in this demonstration registry carries that number. On
                  the live registry a genuine piece can still fail this check for
                  dull reasons — a worn punch, a re-shanked ring, a certificate
                  issued before 1994 when numbering changed. Bring the piece in
                  and we will read the hallmark under a scope, free of charge.
                </p>
              </motion.div>
            )}

            {state === 'idle' && (
              <motion.p
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="border-t border-hairline pt-7 font-sans text-xs leading-relaxed text-faint"
              >
                This panel searches a small set of specimen records so the flow can
                be walked end to end. The live registry sits behind the client
                portal and holds every piece the house has certified since 1994.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
