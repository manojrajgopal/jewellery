'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'aurum-theme';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: (origin?: { x: number; y: number }) => void;
  setTheme: (t: Theme) => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {},
  mounted: false,
});

export const useTheme = () => useContext(ThemeContext);

export const DEFAULT_THEME: Theme = 'light';

/** Browser-UI colour per theme, kept in step with --canvas. */
const THEME_COLOR: Record<Theme, string> = { light: '#faf6ef', dark: '#080706' };

/**
 * Inlined in <head> so the correct theme is painted before first frame —
 * without it the page flashes the default before switching to a stored theme.
 * Light is the default: a stored choice still wins, but the OS preference no
 * longer decides, so a first-time visitor always arrives in light.
 */
export const themeInitScript = `(function(){try{var s=localStorage.getItem('${STORAGE_KEY}');var t=s==='dark'?'dark':'light';document.documentElement.setAttribute('data-theme',t);var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',t==='dark'?'${THEME_COLOR.dark}':'${THEME_COLOR.light}');}catch(e){document.documentElement.setAttribute('data-theme','${DEFAULT_THEME}');}})();`;

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME);
  const [mounted, setMounted] = useState(false);

  // Adopt whatever the init script already painted.
  useEffect(() => {
    const attr = document.documentElement.getAttribute('data-theme');
    setThemeState(attr === 'dark' ? 'dark' : 'light');
    setMounted(true);
  }, []);

  const applyTheme = useCallback((next: Theme) => {
    document.documentElement.setAttribute('data-theme', next);
    // Keep the browser's own chrome in step, so the surround matches the page.
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', THEME_COLOR[next]);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* private mode — the theme still applies for this session */
    }
    setThemeState(next);
  }, []);

  const setTheme = useCallback((t: Theme) => applyTheme(t), [applyTheme]);

  const toggleTheme = useCallback(
    (origin?: { x: number; y: number }) => {
      const next: Theme = theme === 'dark' ? 'light' : 'dark';

      // Circular View Transition radiating from the toggle, where supported.
      const doc = document as Document & {
        startViewTransition?: (cb: () => void) => { ready: Promise<void> };
      };
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (!doc.startViewTransition || reduced || !origin) {
        applyTheme(next);
        return;
      }

      const { x, y } = origin;
      const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const transition = doc.startViewTransition(() => applyTheme(next));
      transition.ready
        .then(() => {
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${radius}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 620,
              easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
              pseudoElement: '::view-transition-new(root)',
            }
          );
        })
        .catch(() => {
          /* transition unsupported mid-flight — theme is already applied */
        });
    },
    [theme, applyTheme]
  );

  const value = useMemo(
    () => ({ theme, toggleTheme, setTheme, mounted }),
    [theme, toggleTheme, setTheme, mounted]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
