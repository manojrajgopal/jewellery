'use client';

import { useCallback, useEffect, useState } from 'react';

const KEY = 'aurum-recent';
const EVENT = 'aurum-recent-change';
const LIMIT = 8;

const read = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === 'string') : [];
  } catch {
    return [];
  }
};

const write = (ids: string[]) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    /* blocked storage — the list still works for this session */
  }
  window.dispatchEvent(new CustomEvent(EVENT));
};

/**
 * Recently viewed pieces, most recent first.
 *
 * `record` moves an existing id to the front rather than appending, so the list
 * is genuinely an access order and not a visit log. That matters because the
 * rail is capped at eight: an append-only list would push the piece someone
 * keeps returning to off the end, which is precisely backwards.
 */
export function useRecentlyViewed() {
  const [ids, setIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setIds(read());
    setHydrated(true);

    const sync = () => setIds(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const record = useCallback((id: string) => {
    const current = read();
    const next = [id, ...current.filter((v) => v !== id)].slice(0, LIMIT);
    // Nothing changed and nothing needs to re-render — a product page that
    // records on every mount would otherwise churn every listener on the site.
    if (current[0] === id) return;
    write(next);
    setIds(next);
  }, []);

  const clear = useCallback(() => {
    write([]);
    setIds([]);
  }, []);

  return { ids, record, clear, count: ids.length, hydrated };
}
