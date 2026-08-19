'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const STORAGE_KEY = 'aurum-cinema';

export type CinemaState = 'on' | 'off';

interface CinemaContextValue {
  cinema: boolean;
  toggleCinema: () => void;
  setCinema: (on: boolean) => void;
  /** True once the OS preference and stored choice have been read. */
  mounted: boolean;
  /** Mirrors prefers-reduced-motion, so components can branch without their
      own matchMedia listener. */
  reduced: boolean;
}

const CinemaContext = createContext<CinemaContextValue>({
  cinema: false,
  toggleCinema: () => {},
  setCinema: () => {},
  mounted: false,
  reduced: false,
});

export const useCinema = () => useContext(CinemaContext);

/**
 * Inlined in <head>. The grain, vignette and letterbox are all driven by CSS
 * variables keyed off `data-cinema`, so the attribute has to land before the
 * first paint — otherwise the page renders ungraded and then visibly darkens.
 *
 * Cinema mode is opt-in rather than default-on: the effect is beautiful on a
 * large screen and merely noisy on a phone, and it is the kind of thing a
 * visitor should choose. Reduced-motion users are never opted in.
 */
export const cinemaInitScript = `
(function(){
  var root = document.documentElement;
  try {
    var stored = localStorage.getItem('${STORAGE_KEY}');
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    root.setAttribute('data-cinema', stored === 'on' && !reduced ? 'on' : 'off');
  } catch (e) {
    root.setAttribute('data-cinema','off');
  }
})();
`;

export default function CinemaProvider({ children }: { children: React.ReactNode }) {
  const [cinema, setCinemaState] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);

    // Adopt whatever the init script already painted rather than re-deriving
    // it, so the React state and the DOM attribute can never disagree.
    setCinemaState(document.documentElement.getAttribute('data-cinema') === 'on');
    setMounted(true);

    // A visitor can turn reduced motion on mid-session; cinema mode has to
    // stand down when they do.
    const onChange = (e: MediaQueryListEvent) => {
      setReduced(e.matches);
      if (e.matches) {
        document.documentElement.setAttribute('data-cinema', 'off');
        setCinemaState(false);
      }
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const setCinema = useCallback(
    (on: boolean) => {
      const next = on && !reduced;
      document.documentElement.setAttribute('data-cinema', next ? 'on' : 'off');
      try {
        localStorage.setItem(STORAGE_KEY, next ? 'on' : 'off');
      } catch {
        /* private mode — the choice still holds for this session */
      }
      setCinemaState(next);
    },
    [reduced]
  );

  const toggleCinema = useCallback(() => setCinema(!cinema), [cinema, setCinema]);

  const value = useMemo(
    () => ({ cinema, toggleCinema, setCinema, mounted, reduced }),
    [cinema, toggleCinema, setCinema, mounted, reduced]
  );

  return <CinemaContext.Provider value={value}>{children}</CinemaContext.Provider>;
}
