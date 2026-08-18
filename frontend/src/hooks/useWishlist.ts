'use client';

import { useCallback, useEffect, useState } from 'react';

const KEY = 'aurum-wishlist';
const EVENT = 'aurum-wishlist-change';

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
    /* storage full or blocked — the in-memory list still updates this session */
  }
  window.dispatchEvent(new CustomEvent(EVENT));
};

/**
 * Saved pieces, persisted to localStorage and shared across every mounted
 * component via a custom event (plus 'storage' for other tabs).
 *
 * `ids` starts empty on the server and fills after mount, so anything rendered
 * from it must tolerate an empty first paint.
 */
export function useWishlist() {
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

  const toggle = useCallback((id: string) => {
    const current = read();
    const next = current.includes(id)
      ? current.filter((v) => v !== id)
      : [...current, id];
    write(next);
    setIds(next);
    return next.includes(id);
  }, []);

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  const clear = useCallback(() => {
    write([]);
    setIds([]);
  }, []);

  return { ids, has, toggle, clear, count: ids.length, hydrated };
}
