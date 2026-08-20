'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Copy, Feather, Trash2 } from 'lucide-react';

import { useToast } from '@/components/providers/ToastProvider';
import { ease, springs } from '@/lib/motion';

const KEY = 'aurum-heirloom-note';

/** The stocks a note can be written on. Each is a real class from globals.css. */
const STOCKS = [
  { id: 'ruled', label: 'Ruled ledger', cls: 'stock-ruled' },
  { id: 'uncoated', label: 'Uncoated card', cls: 'paper-stock' },
  { id: 'marble', label: 'Marbled', cls: 'plate-marble' },
] as const;

/** Hands, mapped to the three faces the site already loads. */
const HANDS = [
  { id: 'display', label: 'Copperplate', cls: 'font-display italic' },
  { id: 'accent', label: 'Roman', cls: 'font-accent' },
  { id: 'sans', label: 'Plain', cls: 'font-sans font-light' },
] as const;

const MAX = 320;

interface StoredNote {
  body: string;
  to: string;
  from: string;
  stock: string;
  hand: string;
}

/**
 * The note that goes in the box.
 *
 * A piece leaves the boutique with a card in the lid, and the card is the part the
 * recipient keeps in a drawer for thirty years. Nobody writes it well standing at a
 * counter with a pen they have just been handed, so this is somewhere to write it
 * beforehand, see it set in a real hand on real stock, and bring the words in.
 *
 * Persisted to localStorage and nowhere else. A note like this is the most private
 * thing anyone will type on a jeweller's website, and the component says so
 * plainly — a "we'll email this to you" flow would be a reason not to use it.
 *
 * The preview is typeset rather than previewed: the same stock textures and faces
 * the boutique actually prints on, so what appears here is what arrives. The
 * character limit is the real one — 320 characters is what fits the card at a
 * legible size, and letting someone write 800 would be a lie the printer discovers.
 */
export default function HeirloomNote({ className = '' }: { className?: string }) {
  const { toast } = useToast();
  const [note, setNote] = useState<StoredNote>({
    body: '',
    to: '',
    from: '',
    stock: 'ruled',
    hand: 'display',
  });
  const [hydrated, setHydrated] = useState(false);
  const [copied, setCopied] = useState(false);

  // Read after mount only: localStorage does not exist on the server, and
  // rendering from it during the first pass would mismatch.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<StoredNote>;
        setNote((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      /* unreadable or blocked storage — the blank note is a fine starting point */
    }
    setHydrated(true);
  }, []);

  // Written on a debounce rather than per keystroke: a note is typed in bursts and
  // a synchronous write per character is a main-thread stall on a long note.
  useEffect(() => {
    if (!hydrated) return;
    const id = window.setTimeout(() => {
      try {
        localStorage.setItem(KEY, JSON.stringify(note));
      } catch {
        /* storage full — the note is still in memory for this session */
      }
    }, 400);
    return () => window.clearTimeout(id);
  }, [note, hydrated]);

  const stock = STOCKS.find((s) => s.id === note.stock) ?? STOCKS[0];
  const hand = HANDS.find((h) => h.id === note.hand) ?? HANDS[0];

  const remaining = MAX - note.body.length;

  const plain = useMemo(
    () =>
      [note.to && `For ${note.to},`, note.body, note.from && `— ${note.from}`]
        .filter(Boolean)
        .join('\n\n'),
    [note]
  );

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(plain);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
      toast({
        kind: 'success',
        title: 'Copied',
        message: 'Bring it in, or paste it into the appointment form.',
      });
    } catch {
      toast({
        kind: 'error',
        title: 'Could not copy',
        message: 'Your browser blocked clipboard access. Select the text and copy it by hand.',
      });
    }
  }, [plain, toast]);

  return (
    <div className={`grid gap-8 lg:grid-cols-2 ${className}`}>
      {/* ---- Writing ---- */}
      <div className="space-y-5 rounded-3xl border border-hairline bg-canvas-alt/60 p-6 md:p-7">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="font-accent text-[10px] uppercase tracking-luxer text-accent">For</span>
            <input
              value={note.to}
              onChange={(e) => setNote((n) => ({ ...n, to: e.target.value.slice(0, 40) }))}
              placeholder="Ammu"
              className="input-gold mt-1.5"
            />
          </label>
          <label className="block">
            <span className="font-accent text-[10px] uppercase tracking-luxer text-accent">
              From
            </span>
            <input
              value={note.from}
              onChange={(e) => setNote((n) => ({ ...n, from: e.target.value.slice(0, 40) }))}
              placeholder="R."
              className="input-gold mt-1.5"
            />
          </label>
        </div>

        <label className="block">
          <span className="flex items-baseline justify-between">
            <span className="font-accent text-[10px] uppercase tracking-luxer text-accent">
              The note
            </span>
            <span
              className={`font-sans text-[10px] nums-tabular ${
                remaining < 40 ? 'text-burgundy-300' : 'text-faint'
              }`}
            >
              {remaining} left
            </span>
          </span>
          <textarea
            value={note.body}
            onChange={(e) => setNote((n) => ({ ...n, body: e.target.value.slice(0, MAX) }))}
            rows={6}
            placeholder="It was your grandmother's, and it was always going to be yours."
            className="input-gold mt-1.5 resize-none border-b-0 border border-line rounded-xl px-3 py-2.5"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <span className="font-accent text-[10px] uppercase tracking-luxer text-accent">
              Stock
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              {STOCKS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setNote((n) => ({ ...n, stock: s.id }))}
                  aria-pressed={s.id === note.stock}
                  className={`rounded-full border px-3 py-1.5 font-accent text-[10px] uppercase tracking-luxe transition-all duration-300 ${
                    s.id === note.stock
                      ? 'border-accent bg-accent/12 text-accent'
                      : 'border-hairline text-muted hover:text-accent'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="font-accent text-[10px] uppercase tracking-luxer text-accent">
              Hand
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              {HANDS.map((h) => (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => setNote((n) => ({ ...n, hand: h.id }))}
                  aria-pressed={h.id === note.hand}
                  className={`rounded-full border px-3 py-1.5 text-[11px] transition-all duration-300 ${h.cls} ${
                    h.id === note.hand
                      ? 'border-accent bg-accent/12 text-accent'
                      : 'border-hairline text-muted hover:text-accent'
                  }`}
                >
                  {h.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 border-t border-hairline pt-5">
          <button
            type="button"
            onClick={copy}
            disabled={!note.body.trim()}
            className="inline-flex items-center gap-2 rounded-full border border-accent/50 bg-accent/10 px-4 py-2 font-accent text-[10px] uppercase tracking-luxe text-accent transition-colors duration-300 hover:bg-accent hover:text-onaccent disabled:opacity-40"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <Copy className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {copied ? 'Copied' : 'Copy the note'}
          </button>
          <button
            type="button"
            onClick={() => {
              setNote((n) => ({ ...n, body: '', to: '', from: '' }));
              try {
                localStorage.removeItem(KEY);
              } catch {
                /* nothing to remove */
              }
            }}
            disabled={!note.body && !note.to && !note.from}
            className="inline-flex items-center gap-2 rounded-full border border-hairline px-4 py-2 font-accent text-[10px] uppercase tracking-luxe text-muted transition-colors duration-300 hover:border-burgundy-500/50 hover:text-burgundy-300 disabled:opacity-40"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            Erase
          </button>
        </div>

        <p className="font-sans text-[11px] font-light leading-relaxed text-faint">
          Held in this browser and nowhere else. We never see it unless you bring it to us.
        </p>
      </div>

      {/* ---- The card ---- */}
      <div className="flex flex-col">
        <span className="font-accent text-[10px] uppercase tracking-luxer text-faint">
          As it will be printed
        </span>

        <motion.div
          layout
          transition={springs.plate}
          className={`relative mt-3 flex min-h-[22rem] flex-1 flex-col justify-between overflow-hidden rounded-2xl border border-hairline p-7 shadow-lift md:p-9 ${stock.cls}`}
        >
          {/* Deckle edge along the top, so the card reads as cut stock. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-transparent via-gold-300/40 to-transparent"
          />

          <div>
            {note.to && (
              <motion.p
                key={note.to}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: ease.luxury }}
                className={`text-lg text-primary ${hand.cls}`}
              >
                For {note.to},
              </motion.p>
            )}

            <p
              className={`mt-5 whitespace-pre-wrap text-xl leading-relaxed text-secondary ${hand.cls}`}
            >
              {note.body || (
                <span className="text-faint">
                  The note appears here as you write it, set in the hand and on the stock the
                  boutique prints.
                </span>
              )}
            </p>
          </div>

          <div className="mt-8 flex items-end justify-between">
            <p className={`text-lg text-primary ${hand.cls}`}>{note.from && `— ${note.from}`}</p>

            {/* The seal. Pressed rather than printed, which is why it is a
                gradient disc with an inset shadow and a monogram cut into it. */}
            <motion.span
              aria-hidden="true"
              initial={{ scale: 0.6, opacity: 0, rotate: -30 }}
              whileInView={{ scale: 1, opacity: 1, rotate: -8 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
              className="grid h-14 w-14 flex-shrink-0 place-items-center rounded-full bg-gradient-to-br from-burgundy-500 to-burgundy-900 shadow-[inset_0_2px_6px_rgb(255_255_255/0.25),0_10px_20px_-12px_rgb(0_0_0/0.7)]"
            >
              <Feather className="h-5 w-5 text-cream-100/80" aria-hidden="true" />
            </motion.span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
