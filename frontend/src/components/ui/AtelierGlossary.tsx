'use client';

import { useDeferredValue, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, ArrowRight, Search, X } from 'lucide-react';

import { glossary, glossarySenses, type GlossarySense, type GlossaryTerm } from '@/data/glossary';
import { easeLens, springsHeavy } from '@/lib/motion';

interface AtelierGlossaryProps {
  className?: string;
}

/** Match on term, alias and definition, so a half-remembered phrase still lands. */
const matches = (t: GlossaryTerm, q: string) => {
  if (!q) return true;
  const hay = `${t.term} ${t.alias ?? ''} ${t.definition} ${t.candour ?? ''}`.toLowerCase();
  // Every word must appear somewhere, in any order — a phrase search would fail
  // on 'carat weight total' and people type in the order they remember.
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((w) => hay.includes(w));
};

/**
 * The house's vocabulary, published rather than withheld.
 *
 * A jewellery counter runs on words the customer does not have, and the gap is
 * not accidental — it is where the margin lives. So this is a glossary with a
 * second field on most entries: `candour`, the part of the term that is usually
 * left unsaid. 'Total carat weight' is a true number that answers a question
 * nobody asked. Rhodium plating wears through in eighteen months. A full
 * eternity band cannot be resized. Those lines are set apart in amber, because
 * they are the reason to read this at all.
 *
 * Three ways in, because people arrive knowing different amounts. Search, if
 * they have a word. The alphabet, if they are browsing. The five senses of the
 * trade — stone, metal, making, paper, wearing — if they only know which part of
 * the transaction confused them.
 *
 * Cross-references resolve by id rather than by label and are rendered as
 * buttons that jump the reader on, so a chain of unfamiliar terms can be walked
 * without going back to the search field. The search input drives a deferred
 * value, so a fast typist never waits on the list re-filtering.
 */
export default function AtelierGlossary({ className = '' }: AtelierGlossaryProps) {
  const [query, setQuery] = useState('');
  const deferred = useDeferredValue(query);
  const [sense, setSense] = useState<GlossarySense | 'all'>('all');
  const [letter, setLetter] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const byId = useMemo(() => new Map(glossary.map((t) => [t.id, t])), []);

  /** Letters that actually have entries, so no dead keys are offered. */
  const letters = useMemo(() => {
    const set = new Set(glossary.map((t) => t.term[0].toUpperCase()));
    return Array.from(set).sort();
  }, []);

  const shown = useMemo(() => {
    const out = glossary
      .filter((t) => (sense === 'all' ? true : t.sense === sense))
      .filter((t) => (letter ? t.term[0].toUpperCase() === letter : true))
      .filter((t) => matches(t, deferred));
    return out.sort((a, b) => a.term.localeCompare(b.term));
  }, [sense, letter, deferred]);

  /** Jump to a cross-reference: clear every filter that could hide it. */
  const jumpTo = (id: string) => {
    const target = byId.get(id);
    if (!target) return;
    setQuery('');
    setSense('all');
    setLetter(null);
    setOpenId(id);
    // Scroll after the filters have been dropped and the row exists again.
    requestAnimationFrame(() => {
      document.getElementById(`glossary-${id}`)?.scrollIntoView({
        block: 'center',
        behavior: 'smooth',
      });
    });
  };

  const filtered = sense !== 'all' || letter !== null || query !== '';

  return (
    <div className={className}>
      {/* ---- Search ---- */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Girdle, rhodium, total carat weight…"
          aria-label="Search the glossary"
          className="w-full rounded-full border border-hairline bg-canvas-alt/60 py-4 pl-13 pr-12 font-sans text-sm font-light text-primary outline-none transition-colors duration-300 placeholder:text-faint focus:border-accent/60"
          style={{ paddingLeft: '3.25rem' }}
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Clear search"
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-faint transition-colors hover:text-accent"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* ---- The five senses of the trade ---- */}
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSense('all')}
          aria-pressed={sense === 'all'}
          className={`rounded-full border px-4 py-2 font-accent text-[10px] uppercase tracking-luxe transition-all duration-300 ${
            sense === 'all'
              ? 'border-accent bg-accent text-onaccent'
              : 'border-hairline text-muted hover:border-accent/50 hover:text-accent'
          }`}
        >
          Everything
        </button>
        {glossarySenses.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSense(sense === s.id ? 'all' : s.id)}
            aria-pressed={sense === s.id}
            title={s.note}
            className={`rounded-full border px-4 py-2 font-accent text-[10px] uppercase tracking-luxe transition-all duration-300 ${
              sense === s.id
                ? 'border-accent bg-accent text-onaccent'
                : 'border-hairline text-muted hover:border-accent/50 hover:text-accent'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* ---- The alphabet ---- */}
      <div className="mt-4 flex flex-wrap items-center gap-x-1 gap-y-1">
        {letters.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLetter(letter === l ? null : l)}
            aria-pressed={letter === l}
            className={`h-8 w-8 rounded-full font-accent text-xs transition-all duration-300 ${
              letter === l
                ? 'bg-accent text-onaccent'
                : 'text-faint hover:bg-accent/10 hover:text-accent'
            }`}
          >
            {l}
          </button>
        ))}
        {filtered && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSense('all');
              setLetter(null);
            }}
            className="ml-2 font-accent text-[10px] uppercase tracking-luxe text-accent underline-offset-4 hover:underline"
          >
            Reset
          </button>
        )}
      </div>

      {/* ---- Count, announced as well as drawn ---- */}
      <p aria-live="polite" className="mt-6 font-accent text-[10px] uppercase tracking-luxer text-faint nums-tabular">
        {shown.length} {shown.length === 1 ? 'term' : 'terms'}
        {sense !== 'all' && ` · ${glossarySenses.find((s) => s.id === sense)?.note}`}
      </p>

      {/* ---- The list ---- */}
      <div ref={listRef} className="mt-4 divide-y divide-line-subtle border-y border-line-subtle">
        {shown.length === 0 && (
          <p className="py-10 text-center font-sans text-sm font-light text-muted">
            Nothing under that. Ask us at the counter and we will add it.
          </p>
        )}

        {shown.map((t, i) => {
          const open = openId === t.id;
          return (
            <div key={t.id} id={`glossary-${t.id}`}>
              <motion.button
                type="button"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                // Capped so a long list does not have a visible loading sweep.
                transition={{ duration: 0.4, delay: Math.min(i * 0.02, 0.3) }}
                onClick={() => setOpenId(open ? null : t.id)}
                aria-expanded={open}
                className="group flex w-full items-baseline gap-4 py-5 text-left"
              >
                <span className="flex-1">
                  <span className="font-display text-xl text-primary transition-colors duration-300 group-hover:text-accent md:text-2xl">
                    {t.term}
                  </span>
                  {t.alias && (
                    <span className="ml-3 font-accent text-[10px] uppercase tracking-luxe text-faint">
                      {t.alias}
                    </span>
                  )}
                </span>

                {t.candour && (
                  <AlertTriangle
                    aria-hidden="true"
                    className={`h-3.5 w-3.5 shrink-0 transition-colors duration-300 ${
                      open ? 'text-accent' : 'text-accent/40'
                    }`}
                  />
                )}

                <span className="shrink-0 font-accent text-[9px] uppercase tracking-luxer text-faint">
                  {glossarySenses.find((s) => s.id === t.sense)?.label}
                </span>
              </motion.button>

              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.45, ease: easeLens.focusRing }}
                    className="overflow-hidden"
                  >
                    <div className="pb-7 pr-4">
                      <p className="max-w-2xl font-sans text-base font-light leading-relaxed text-secondary">
                        {t.definition}
                      </p>

                      {t.candour && (
                        <motion.div
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ ...springsHeavy.leaf, delay: 0.1 }}
                          className="mt-5 flex max-w-2xl gap-3 rounded-2xl border border-accent/25 bg-accent/[0.06] p-4"
                        >
                          <AlertTriangle
                            aria-hidden="true"
                            className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                          />
                          <p className="font-sans text-sm font-light leading-relaxed text-secondary">
                            <span className="font-accent text-[10px] uppercase tracking-luxe text-accent">
                              What is usually left unsaid ·{' '}
                            </span>
                            {t.candour}
                          </p>
                        </motion.div>
                      )}

                      {t.seeAlso && t.seeAlso.length > 0 && (
                        <div className="mt-5 flex flex-wrap items-center gap-2">
                          <span className="font-accent text-[10px] uppercase tracking-luxer text-faint">
                            See also
                          </span>
                          {t.seeAlso.map((id) => {
                            const ref = byId.get(id);
                            if (!ref) return null;
                            return (
                              <button
                                key={id}
                                type="button"
                                onClick={() => jumpTo(id)}
                                className="group inline-flex items-center gap-1.5 rounded-full border border-hairline px-3 py-1.5 font-accent text-[10px] uppercase tracking-luxe text-muted transition-all duration-300 hover:border-accent/50 hover:text-accent"
                              >
                                {ref.term}
                                <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
