'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Search,
  CornerDownLeft,
  Gem,
  Layers,
  Sparkles,
  FileText,
  Diamond,
  Newspaper,
} from 'lucide-react';
import { products } from '@/data/products';
import { collections } from '@/data/collections';
import { services } from '@/data/services';
import { gems } from '@/data/gems';
import { journal } from '@/data/editorial';

interface Entry {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  group: 'Pieces' | 'Collections' | 'Services' | 'Stones' | 'Journal' | 'Pages';
}

const PAGES: Entry[] = [
  { id: 'p-home', title: 'Home', subtitle: 'Timeless elegance, crafted in gold', href: '/', group: 'Pages' },
  { id: 'p-about', title: 'About', subtitle: 'Four generations of brilliance', href: '/about', group: 'Pages' },
  { id: 'p-craft', title: 'Craftsmanship', subtitle: 'Inside the atelier', href: '/craftsmanship', group: 'Pages' },
  { id: 'p-gallery', title: 'Gallery', subtitle: 'The complete portfolio', href: '/gallery', group: 'Pages' },
  { id: 'p-contact', title: 'Contact', subtitle: 'Visit the boutique', href: '/contact', group: 'Pages' },
  { id: 'p-lookbook', title: 'The Lookbook', subtitle: 'Twelve plates, bound', href: '/lookbook', group: 'Pages' },
  { id: 'p-journal', title: 'The Journal', subtitle: 'Notes from the bench', href: '/journal', group: 'Pages' },
  { id: 'p-stones', title: 'Stone Library', subtitle: 'Every gem, honestly graded', href: '/gemstones', group: 'Pages' },
  { id: 'p-care', title: 'Care & Sizing', subtitle: 'The ritual, and how to measure', href: '/care', group: 'Pages' },
  { id: 'p-bespoke', title: 'Bespoke', subtitle: 'Commission a piece', href: '/bespoke', group: 'Pages' },
];

const GROUP_ICON = {
  Pieces: Gem,
  Collections: Layers,
  Services: Sparkles,
  Stones: Diamond,
  Journal: Newspaper,
  Pages: FileText,
} as const;

/**
 * Command palette over the whole catalogue — pieces, collections, services and
 * pages. Opens with ⌘K, filters as you type, and is fully keyboard-driven.
 */
export default function SearchPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const entries = useMemo<Entry[]>(
    () => [
      ...products.map((p) => ({
        id: `prod-${p.id}`,
        title: p.name,
        subtitle: `${p.category} · ${p.formattedPrice ?? p.price}`,
        href: `/collections/${p.collection}`,
        group: 'Pieces' as const,
      })),
      ...collections.map((c) => ({
        id: `coll-${c.id}`,
        title: c.name,
        subtitle: c.tagline ?? c.description.slice(0, 72),
        href: `/collections/${c.id}`,
        group: 'Collections' as const,
      })),
      ...services.map((s) => ({
        id: `svc-${s.id}`,
        title: s.title,
        subtitle: s.description.slice(0, 72),
        href: '/services',
        group: 'Services' as const,
      })),
      // Stones and journal entries are searchable by the thing a visitor would
      // actually type — a stone's name, or a phrase from a headline. Both deep-link
      // to the page that answers, rather than to a generic index.
      ...gems.map((g) => ({
        id: `gem-${g.id}`,
        title: g.name,
        subtitle: `${g.hardness} Mohs · ${g.meaning.split('.')[0]}`,
        href: '/gemstones',
        group: 'Stones' as const,
      })),
      ...journal.map((j) => ({
        id: `jrn-${j.id}`,
        title: j.title,
        subtitle: `${j.topic} · ${j.read} min · ${j.author}`,
        href: `/journal/${j.slug}`,
        group: 'Journal' as const,
      })),
      ...PAGES,
    ],
    []
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries.slice(0, 8);
    return entries
      .filter(
        (e) =>
          e.title.toLowerCase().includes(q) || e.subtitle.toLowerCase().includes(q)
      )
      .slice(0, 12);
  }, [query, entries]);

  useEffect(() => setCursor(0), [query]);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    const focus = window.setTimeout(() => inputRef.current?.focus(), 60);
    document.body.style.overflow = 'hidden';
    return () => {
      window.clearTimeout(focus);
      document.body.style.overflow = '';
    };
  }, [open]);

  const go = (entry: Entry) => {
    onClose();
    router.push(entry.href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') return onClose();
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursor((c) => (results.length ? (c + 1) % results.length : 0));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursor((c) => (results.length ? (c - 1 + results.length) % results.length : 0));
    }
    if (e.key === 'Enter' && results[cursor]) {
      e.preventDefault();
      go(results[cursor]);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[140] flex items-start justify-center px-4 pt-[14vh]"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-canvas/80 backdrop-blur-xl" />

          <motion.div
            initial={{ opacity: 0, y: -24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={onKeyDown}
            role="dialog"
            aria-modal="true"
            aria-label="Search AURUM"
            className="glass-strong relative z-10 w-full max-w-2xl overflow-hidden"
          >
            {/* Input row */}
            <div className="flex items-center gap-3 border-b border-hairline px-5 py-4">
              <Search size={18} className="flex-shrink-0 text-accent" strokeWidth={1.7} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pieces, collections, services…"
                className="w-full bg-transparent font-sans text-base text-primary outline-none placeholder:text-faint"
              />
              <kbd className="hidden rounded border border-hairline px-1.5 py-0.5 font-sans text-[10px] tracking-widest text-faint sm:block">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="scrollbar-gold max-h-[52vh] overflow-y-auto p-2">
              {results.length === 0 && (
                <p className="px-4 py-10 text-center font-sans text-sm text-muted">
                  Nothing matches “{query}”. Try a metal, a gemstone, or a collection name.
                </p>
              )}

              {results.map((entry, i) => {
                const Icon = GROUP_ICON[entry.group];
                const active = i === cursor;
                return (
                  <button
                    key={entry.id}
                    onMouseEnter={() => setCursor(i)}
                    onClick={() => go(entry)}
                    className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors duration-200 ${
                      active ? 'bg-gold-500/10' : 'hover:bg-gold-500/5'
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border transition-colors ${
                        active
                          ? 'border-gold-500/40 text-accent'
                          : 'border-hairline text-muted'
                      }`}
                    >
                      <Icon size={16} strokeWidth={1.6} />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-display text-base text-primary">
                        {entry.title}
                      </span>
                      <span className="block truncate font-sans text-xs capitalize text-muted">
                        {entry.subtitle}
                      </span>
                    </span>

                    <span className="hidden font-accent text-[10px] uppercase tracking-luxe text-faint sm:block">
                      {entry.group}
                    </span>

                    {active && (
                      <CornerDownLeft size={14} className="flex-shrink-0 text-accent" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Footer hints */}
            <div className="flex items-center justify-between border-t border-hairline px-5 py-2.5 font-sans text-[10px] uppercase tracking-luxe text-faint">
              <span>↑ ↓ to navigate</span>
              <span>↵ to open</span>
              <span className="hidden sm:block">{results.length} results</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
