'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useCinema } from '@/components/providers/CinemaProvider';
import { useTheme } from '@/components/providers/ThemeProvider';
import ShortcutsOverlay from '@/components/ui/ShortcutsOverlay';
import WishlistDrawer from '@/components/ui/WishlistDrawer';
import { openCompare } from '@/hooks/useCompare';

/** Second key of a `G`-prefixed sequence → route. */
const GO_TO: Record<string, string> = {
  h: '/',
  c: '/collections',
  a: '/craftsmanship',
  v: '/contact',
  g: '/gallery',
  s: '/services',
  b: '/about',
  d: '/bespoke',
};

/**
 * The site's keyboard layer, and the two overlays it owns.
 *
 * Lives at the root so a shortcut works from anywhere, and holds the drawer and
 * the shortcut sheet itself rather than lifting that state into the layout —
 * they exist only to be opened by a key or by the navbar, and nothing else
 * needs to know about them.
 *
 * Two rules keep this from fighting the page:
 *   - Nothing fires while focus is in a field, or the visitor cannot type "c".
 *   - Nothing fires with a modifier held, so ⌘K and browser shortcuts are the
 *     browser's business. The one exception is Escape, which always closes.
 */
export default function KeyboardLayer() {
  const router = useRouter();
  const { toggleTheme } = useTheme();
  const { toggleCinema } = useCinema();

  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  // A pending `G`, and the timer that forgets it. Without the timeout a stray G
  // pressed minutes earlier would hijack the next letter typed.
  const pendingGo = useRef(false);
  const goTimer = useRef(0);

  const clearPending = useCallback(() => {
    pendingGo.current = false;
    window.clearTimeout(goTimer.current);
  }, []);

  // The navbar and other chrome open these through events rather than by
  // prop-drilling a setter down through the layout.
  useEffect(() => {
    const openWishlist = () => setWishlistOpen(true);
    const openShortcuts = () => setShortcutsOpen(true);
    window.addEventListener('aurum-open-wishlist', openWishlist);
    window.addEventListener('aurum-open-shortcuts', openShortcuts);
    return () => {
      window.removeEventListener('aurum-open-wishlist', openWishlist);
      window.removeEventListener('aurum-open-shortcuts', openShortcuts);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShortcutsOpen(false);
        setWishlistOpen(false);
        clearPending();
        return;
      }

      // Never steal a keystroke meant for a field or a modified combination.
      const target = e.target as HTMLElement | null;
      if (
        target?.closest('input, textarea, select, [contenteditable="true"]') ||
        e.metaKey ||
        e.ctrlKey ||
        e.altKey
      ) {
        return;
      }

      const key = e.key.toLowerCase();

      // Second half of a `G` sequence.
      if (pendingGo.current) {
        clearPending();
        const href = GO_TO[key];
        if (href) {
          e.preventDefault();
          router.push(href);
        }
        return;
      }

      switch (key) {
        case 'g':
          pendingGo.current = true;
          goTimer.current = window.setTimeout(clearPending, 1400);
          break;
        case '?':
          e.preventDefault();
          setShortcutsOpen((v) => !v);
          break;
        case 'w':
          e.preventDefault();
          setWishlistOpen((v) => !v);
          break;
        case 't':
          e.preventDefault();
          // No origin point, so the theme swaps without the radial wipe — the
          // wipe is anchored to the toggle a pointer actually clicked.
          toggleTheme();
          break;
        case 'c':
          e.preventDefault();
          toggleCinema();
          break;
        case 'x':
          // The tray owns the table, so this only asks — nothing opens if
          // nothing has been added to compare.
          e.preventDefault();
          openCompare();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.clearTimeout(goTimer.current);
    };
  }, [router, toggleTheme, toggleCinema, clearPending]);

  return (
    <>
      <WishlistDrawer open={wishlistOpen} onClose={() => setWishlistOpen(false)} />
      <ShortcutsOverlay open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </>
  );
}

/** Fired by the navbar heart and the footer link. */
export const openWishlist = () =>
  window.dispatchEvent(new CustomEvent('aurum-open-wishlist'));

export const openShortcuts = () =>
  window.dispatchEvent(new CustomEvent('aurum-open-shortcuts'));
