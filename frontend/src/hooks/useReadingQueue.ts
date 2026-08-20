'use client';

import { useCallback, useEffect, useState } from 'react';

const KEY = 'aurum-reading-queue';
const EVENT = 'aurum-reading-queue-change';

export interface QueuedRead {
  /** The journal entry's slug. */
  slug: string;
  title: string;
  /** Minutes, as printed on the entry. */
  minutes: number;
  /** When it was added, as an epoch millisecond. Used only for ordering. */
  added: number;
  /** Marked read rather than removed, so the list keeps a record. */
  read: boolean;
}

const isQueued = (v: unknown): v is QueuedRead => {
  if (!v || typeof v !== 'object') return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.slug === 'string' &&
    typeof o.title === 'string' &&
    typeof o.minutes === 'number' &&
    typeof o.added === 'number' &&
    typeof o.read === 'boolean'
  );
};

const read = (): QueuedRead[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    // Filtered rather than cast, on the same principle the occasions list
    // follows: this drives a running total, and one malformed entry from an
    // older build would throw inside a render.
    return Array.isArray(parsed) ? parsed.filter(isQueued) : [];
  } catch {
    return [];
  }
};

const write = (list: QueuedRead[]) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* blocked storage — the session list still works from memory */
  }
  window.dispatchEvent(new CustomEvent(EVENT));
};

/**
 * The journal entries the visitor has put aside to read.
 *
 * Worth having for a reason specific to this journal: the entries are long, they
 * are written by the bench rather than by a marketing desk, and they are
 * genuinely not skimmable — which means somebody who finds three of them
 * interesting on one visit will read none of them. A queue turns that into one
 * they read now and two they come back for.
 *
 * Entries are marked read rather than deleted, so the list becomes a record of
 * what has been read as well as a list of what has not. The distinction matters
 * on a site where several entries argue with each other and the order they were
 * read in changes the argument.
 *
 * Local-only and never sent anywhere, like everything else this browser is asked
 * to remember. The panel that uses it says so.
 */
export function useReadingQueue() {
  const [items, setItems] = useState<QueuedRead[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(read());
    setHydrated(true);

    const sync = () => setItems(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const add = useCallback((entry: Omit<QueuedRead, 'added' | 'read'>) => {
    const current = read();
    // Adding something already queued is a no-op rather than a duplicate — the
    // button that calls this is on the entry itself and is easy to press twice.
    if (current.some((q) => q.slug === entry.slug)) return;
    const next = [...current, { ...entry, added: Date.now(), read: false }];
    write(next);
    setItems(next);
  }, []);

  const remove = useCallback((slug: string) => {
    const next = read().filter((q) => q.slug !== slug);
    write(next);
    setItems(next);
  }, []);

  const toggleRead = useCallback((slug: string) => {
    const next = read().map((q) => (q.slug === slug ? { ...q, read: !q.read } : q));
    write(next);
    setItems(next);
  }, []);

  const clear = useCallback(() => {
    write([]);
    setItems([]);
  }, []);

  const has = useCallback((slug: string) => items.some((q) => q.slug === slug), [items]);

  const pending = items.filter((q) => !q.read).sort((a, b) => a.added - b.added);
  const finished = items.filter((q) => q.read).sort((a, b) => b.added - a.added);

  return {
    items,
    pending,
    finished,
    add,
    remove,
    toggleRead,
    clear,
    has,
    /** Minutes of reading still owed, which is the only useful total. */
    minutes: pending.reduce((total, q) => total + q.minutes, 0),
    count: items.length,
    hydrated,
  };
}
