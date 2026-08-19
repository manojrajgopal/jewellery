import type { Config } from "tailwindcss";

/** Build an 'rgb(var(--x) / <alpha-value>)' ramp from a list of stops. */
const ramp = (name: string, stops: (number | string)[]) =>
  Object.fromEntries(
    stops.map((s) => [s, `rgb(var(--${name}-${s}) / <alpha-value>)`])
  ) as Record<string, string>;

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: ramp("ink", [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]),
        cream: ramp("cream", [50, 100, 200]),
        gold: ramp("gold", [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]),
        champagne: ramp("champagne", [100, 300, 500, 700]),
        rose: ramp("rose", [100, 300, 500, 700]),
        jade: ramp("jade", [100, 300, 500, 700, 900]),
        amethyst: ramp("amethyst", [300, 500, 700, 900]),
        burgundy: {
          ...ramp("burgundy", [300, 500, 700, 900]),
          DEFAULT: "rgb(var(--burgundy-700) / <alpha-value>)",
          light: "rgb(var(--burgundy-500) / <alpha-value>)",
        },

        // Legacy alias kept so existing markup keeps rendering.
        rosegold: {
          DEFAULT: "rgb(var(--rose-300) / <alpha-value>)",
          ...ramp("rose", [100, 300, 500, 700]),
        },

        platinum: { DEFAULT: "rgb(var(--platinum) / <alpha-value>)" },
        diamond: { DEFAULT: "rgb(var(--diamond) / <alpha-value>)" },

        // Semantic tokens
        canvas: {
          DEFAULT: "rgb(var(--canvas) / <alpha-value>)",
          alt: "rgb(var(--canvas-alt) / <alpha-value>)",
        },
        surface: {
          DEFAULT: "rgb(var(--surface) / <alpha-value>)",
          raised: "rgb(var(--surface-raised) / <alpha-value>)",
          sunken: "rgb(var(--surface-sunken) / <alpha-value>)",
        },
        line: {
          DEFAULT: "rgb(var(--border) / <alpha-value>)",
          subtle: "rgb(var(--border-subtle) / <alpha-value>)",
          strong: "rgb(var(--border-strong) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          soft: "rgb(var(--accent-soft) / <alpha-value>)",
          deep: "rgb(var(--accent-deep) / <alpha-value>)",
        },
        onaccent: "rgb(var(--on-accent) / <alpha-value>)",
      },

      fontFamily: {
        // Wired to the next/font CSS variables declared in layout.tsx.
        display: ["var(--font-display)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Jost", "system-ui", "sans-serif"],
        accent: ["var(--font-accent)", "Marcellus", "Georgia", "serif"],
        // Aliases used across the existing markup — all resolve to real faces.
        body: ["var(--font-sans)", "Jost", "system-ui", "sans-serif"],
        inter: ["var(--font-sans)", "Jost", "system-ui", "sans-serif"],
        cormorant: ["var(--font-display)", "Playfair Display", "Georgia", "serif"],
        cinzel: ["var(--font-accent)", "Marcellus", "Georgia", "serif"],
      },

      letterSpacing: {
        luxe: "0.2em",
        luxer: "0.28em",
        luxest: "0.42em",
      },

      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.75rem",
      },

      boxShadow: {
        gold: "0 10px 40px -12px rgb(var(--gold-500) / 0.45)",
        "gold-lg": "0 24px 70px -20px rgb(var(--gold-500) / 0.55)",
        jewel: "0 0 0 1px rgb(var(--gold-500) / 0.16), 0 24px 60px -28px rgb(var(--gold-500) / 0.55)",
        inset: "inset 0 1px 0 0 rgb(var(--hairline) / 0.12)",
        lift: "0 30px 60px -28px rgb(var(--shadow-color) / 0.55)",
        "gold-bloom":
          "0 0 0 1px rgb(var(--gold-500) / 0.22), 0 0 30px -4px rgb(var(--gold-400) / 0.45), 0 0 90px -20px rgb(var(--gold-300) / 0.35)",
        "inner-gold": "inset 0 0 24px -6px rgb(var(--gold-400) / 0.4)",
        cinema: "0 40px 120px -40px rgb(0 0 0 / 0.7)",
      },

      transitionTimingFunction: {
        luxury: "cubic-bezier(0.22, 1, 0.36, 1)",
        silk: "cubic-bezier(0.65, 0, 0.35, 1)",
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },

      backgroundImage: {
        "gold-radial":
          "radial-gradient(circle at center, rgb(var(--gold-500) / 0.15) 0%, transparent 70%)",
        "gold-mesh":
          "radial-gradient(at 40% 20%, rgb(var(--gold-500) / 0.12) 0px, transparent 50%), radial-gradient(at 80% 0%, rgb(var(--amethyst-700) / 0.14) 0px, transparent 50%), radial-gradient(at 0% 50%, rgb(var(--jade-700) / 0.10) 0px, transparent 50%), radial-gradient(at 80% 80%, rgb(var(--burgundy-700) / 0.12) 0px, transparent 50%)",
        "gold-sheen":
          "linear-gradient(110deg, transparent 20%, rgb(var(--gold-100) / 0.18) 42%, rgb(var(--gold-100) / 0.35) 50%, rgb(var(--gold-100) / 0.18) 58%, transparent 80%)",
        "metal-bar":
          "linear-gradient(90deg, rgb(var(--gold-800)), rgb(var(--gold-400)) 25%, rgb(var(--gold-100)) 50%, rgb(var(--gold-400)) 75%, rgb(var(--gold-800)))",
        "fade-top": "linear-gradient(to top, rgb(var(--canvas)), transparent)",
        "fade-bottom": "linear-gradient(to bottom, rgb(var(--canvas)), transparent)",
        "grid-hairline":
          "linear-gradient(rgb(var(--hairline) / 0.05) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--hairline) / 0.05) 1px, transparent 1px)",
        // Shafts of light falling across a vitrine.
        "god-rays":
          "repeating-linear-gradient(100deg, transparent 0px, rgb(var(--gold-200) / 0.10) 2px, transparent 6px, transparent 42px, rgb(var(--gold-100) / 0.07) 46px, transparent 52px, transparent 96px)",
        "conic-gold":
          "conic-gradient(from 0deg, transparent 0%, rgb(var(--gold-500) / 0.55) 12%, transparent 26%, transparent 55%, rgb(var(--gold-300) / 0.4) 68%, transparent 84%)",
        prism:
          "linear-gradient(115deg, rgb(var(--amethyst-500) / 0.25), rgb(var(--jade-500) / 0.22) 28%, rgb(var(--gold-300) / 0.3) 52%, rgb(var(--rose-500) / 0.24) 74%, rgb(var(--amethyst-500) / 0.25))",
        "spotlight-soft":
          "radial-gradient(60% 50% at 50% 40%, rgb(var(--gold-200) / 0.16), transparent 72%)",
        vitrine:
          "linear-gradient(180deg, rgb(var(--hairline) / 0.06), transparent 32%, transparent 68%, rgb(var(--shadow-color) / 0.22))",
      },

      backgroundSize: {
        grid: "64px 64px",
        "size-200": "200% 200%",
        "size-300": "300% 300%",
      },

      keyframes: {
        float: {
          "0%, 100%": { transform: "translate3d(0,-14px,0)" },
          "50%": { transform: "translate3d(0,0,0)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translate3d(0,-24px,0) rotate(-1.5deg)" },
          "50%": { transform: "translate3d(0,10px,0) rotate(1.5deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        orbit: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "orbit-reverse": {
          "0%": { transform: "rotate(360deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
        sparkle: {
          "0%, 100%": { transform: "scale(1) rotate(0deg)", opacity: "0.45" },
          "50%": { transform: "scale(1.25) rotate(45deg)", opacity: "1" },
        },
        "glow-pulse": {
          "0%, 100%": {
            boxShadow:
              "0 0 12px rgb(var(--gold-500) / 0.2), 0 0 26px rgb(var(--gold-500) / 0.08)",
          },
          "50%": {
            boxShadow:
              "0 0 26px rgb(var(--gold-500) / 0.45), 0 0 56px rgb(var(--gold-500) / 0.22)",
          },
        },
        "ken-burns": {
          "0%": { transform: "scale(1) translate3d(0,0,0)" },
          "100%": { transform: "scale(1.12) translate3d(-1.5%, -1.5%, 0)" },
        },
        "aurora-drift": {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1)" },
          "33%": { transform: "translate3d(6%,-8%,0) scale(1.12)" },
          "66%": { transform: "translate3d(-7%,5%,0) scale(0.94)" },
        },
        "gradient-pan": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "border-flow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "scale-pulse": {
          "0%, 100%": { transform: "scale(1)", opacity: "0.7" },
          "50%": { transform: "scale(1.6)", opacity: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-down": {
          "0%": { opacity: "0", transform: "translateY(-12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        tick: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "caret-blink": {
          "0%, 45%, 100%": { opacity: "1" },
          "50%, 95%": { opacity: "0" },
        },

        /* ---------- Cinematic atmosphere ---------- */
        // The grain texture is generated once and jittered, which is far
        // cheaper than regenerating noise on every frame.
        "grain-shift": {
          "0%":   { transform: "translate3d(0,0,0)" },
          "10%":  { transform: "translate3d(-3%,-4%,0)" },
          "20%":  { transform: "translate3d(-8%,2%,0)" },
          "30%":  { transform: "translate3d(4%,-6%,0)" },
          "40%":  { transform: "translate3d(-2%,7%,0)" },
          "50%":  { transform: "translate3d(-9%,-3%,0)" },
          "60%":  { transform: "translate3d(6%,5%,0)" },
          "70%":  { transform: "translate3d(-5%,-8%,0)" },
          "80%":  { transform: "translate3d(2%,4%,0)" },
          "90%":  { transform: "translate3d(-6%,-2%,0)" },
          "100%": { transform: "translate3d(0,0,0)" },
        },
        scanline: {
          "0%":   { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "42%": { opacity: "1" },
          "45%": { opacity: "0.82" },
          "47%": { opacity: "1" },
          "72%": { opacity: "0.9" },
          "74%": { opacity: "1" },
        },
        "god-ray": {
          "0%, 100%": { opacity: "0.28", transform: "translateX(-4%) scaleY(1) skewX(-6deg)" },
          "50%":      { opacity: "0.62", transform: "translateX(4%) scaleY(1.08) skewX(-2deg)" },
        },
        "iris-open": {
          "0%":   { clipPath: "circle(0% at 50% 50%)" },
          "100%": { clipPath: "circle(150% at 50% 50%)" },
        },
        "letterbox-open": {
          "0%":   { transform: "scaleY(1)" },
          "100%": { transform: "scaleY(0)" },
        },

        /* ---------- Light and metal ---------- */
        "light-sweep": {
          "0%":   { transform: "translateX(-130%) skewX(-18deg)", opacity: "0" },
          "12%":  { opacity: "1" },
          "88%":  { opacity: "1" },
          "100%": { transform: "translateX(130%) skewX(-18deg)", opacity: "0" },
        },
        "facet-glint": {
          "0%, 82%, 100%": { opacity: "0", transform: "scale(0.4) rotate(0deg)" },
          "88%":           { opacity: "1", transform: "scale(1.15) rotate(35deg)" },
          "94%":           { opacity: "0.2", transform: "scale(0.8) rotate(60deg)" },
        },
        refract: {
          "0%, 100%": { filter: "hue-rotate(0deg) saturate(1)" },
          "50%":      { filter: "hue-rotate(22deg) saturate(1.35)" },
        },
        "conic-spin": {
          "0%":   { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "prism-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%", filter: "hue-rotate(0deg)" },
          "50%":      { backgroundPosition: "100% 50%", filter: "hue-rotate(-18deg)" },
        },

        /* ---------- Entrances ---------- */
        "blur-in": {
          "0%":   { opacity: "0", filter: "blur(14px)", transform: "scale(1.04)" },
          "100%": { opacity: "1", filter: "blur(0px)", transform: "scale(1)" },
        },
        "elastic-in": {
          "0%":   { opacity: "0", transform: "scale(0.72) translateY(28px)" },
          "62%":  { opacity: "1", transform: "scale(1.045) translateY(-6px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        "unfurl-x": {
          "0%":   { transform: "scaleX(0)", opacity: "0" },
          "100%": { transform: "scaleX(1)", opacity: "1" },
        },
        "flip-in": {
          "0%":   { opacity: "0", transform: "perspective(1200px) rotateY(-72deg)" },
          "100%": { opacity: "1", transform: "perspective(1200px) rotateY(0deg)" },
        },

        /* ---------- Ambient idles ---------- */
        breathe: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.55" },
          "50%":      { transform: "scale(1.06)", opacity: "0.95" },
        },
        "drift-x": {
          "0%, 100%": { transform: "translate3d(-2%,0,0)" },
          "50%":      { transform: "translate3d(2%,0,0)" },
        },
        swing: {
          "0%, 100%": { transform: "rotate(-3.5deg)" },
          "50%":      { transform: "rotate(3.5deg)" },
        },
        wobble: {
          "0%, 100%": { transform: "rotate3d(1,1,0,0deg)" },
          "25%":      { transform: "rotate3d(1,1,0,7deg)" },
          "75%":      { transform: "rotate3d(1,1,0,-7deg)" },
        },
        "zoom-drift": {
          "0%":   { transform: "scale(1.04) translate3d(1%,1%,0)" },
          "100%": { transform: "scale(1.16) translate3d(-2%,-2%,0)" },
        },
        "dust-rise": {
          "0%":   { transform: "translateY(0) scale(0.6)", opacity: "0" },
          "18%":  { opacity: "0.9" },
          "100%": { transform: "translateY(-140px) scale(1.1)", opacity: "0" },
        },
        "pulse-ring": {
          "0%":   { transform: "scale(0.75)", opacity: "0.7" },
          "70%":  { opacity: "0" },
          "100%": { transform: "scale(2.1)", opacity: "0" },
        },
        "sparkle-pop": {
          "0%":   { transform: "scale(0) rotate(0deg)", opacity: "0" },
          "35%":  { transform: "scale(1.25) rotate(60deg)", opacity: "1" },
          "100%": { transform: "scale(0.2) rotate(150deg)", opacity: "0" },
        },

        /* ---------- Mechanism and readouts ---------- */
        "digit-roll": {
          "0%":   { transform: "translateY(0)" },
          "100%": { transform: "translateY(-90%)" },
        },
        "ticker-flash": {
          "0%":   { backgroundColor: "rgb(var(--gold-500) / 0.28)" },
          "100%": { backgroundColor: "rgb(var(--gold-500) / 0)" },
        },
        "needle-settle": {
          "0%":   { transform: "rotate(-28deg)" },
          "58%":  { transform: "rotate(6deg)" },
          "78%":  { transform: "rotate(-3deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        "scan-sweep": {
          "0%":   { transform: "translateY(-110%)", opacity: "0" },
          "12%":  { opacity: "1" },
          "88%":  { opacity: "1" },
          "100%": { transform: "translateY(110%)", opacity: "0" },
        },
        "stamp-in": {
          "0%":   { opacity: "0", transform: "scale(2.4) rotate(-14deg)", filter: "blur(10px)" },
          "62%":  { opacity: "1", transform: "scale(0.94) rotate(3deg)", filter: "blur(0px)" },
          "100%": { opacity: "1", transform: "scale(1) rotate(0deg)" },
        },

        /* ---------- Optics ---------- */
        "flare-drift": {
          "0%, 100%": { transform: "translate3d(-3%, 0, 0) scaleX(0.96)", opacity: "0.4" },
          "50%":      { transform: "translate3d(3%, 0, 0) scaleX(1.05)", opacity: "0.75" },
        },
        "bokeh-float": {
          "0%":   { transform: "translate3d(0, 0, 0) scale(0.9)", opacity: "0" },
          "20%":  { opacity: "0.6" },
          "80%":  { opacity: "0.45" },
          "100%": { transform: "translate3d(6%, -120%, 0) scale(1.25)", opacity: "0" },
        },
        "caustic-pool": {
          "0%, 100%": { transform: "translate3d(-4%, 2%, 0) scale(1.04) rotate(0deg)" },
          "50%":      { transform: "translate3d(5%, -3%, 0) scale(1.14) rotate(4deg)" },
        },
        "aperture-blink": {
          "0%, 92%, 100%": { transform: "scaleY(1)" },
          "96%":           { transform: "scaleY(0.02)" },
        },
        "chroma-split": {
          "0%, 100%": { textShadow: "0 0 0 rgb(255 45 85 / 0), 0 0 0 rgb(0 229 255 / 0)" },
          "50%":      { textShadow: "-3px 0 0 rgb(255 45 85 / 0.6), 3px 0 0 rgb(0 229 255 / 0.6)" },
        },

        /* ---------- Craft and material ---------- */
        "anvil-strike": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "12%":      { transform: "translateY(-18%) rotate(-9deg)" },
          "26%":      { transform: "translateY(0) rotate(0deg)" },
          "30%":      { transform: "translateY(-3%) rotate(-1deg)" },
          "36%":      { transform: "translateY(0) rotate(0deg)" },
        },
        "molten-flow": {
          "0%":   { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "300% 50%" },
        },
        "polish-buff": {
          "0%, 100%": { transform: "translateX(-8%) rotate(-2deg)" },
          "50%":      { transform: "translateX(8%) rotate(2deg)" },
        },
        "engrave-cut": {
          "0%":   { clipPath: "inset(0 100% 0 0)" },
          "100%": { clipPath: "inset(0 0 0 0)" },
        },
        "solder-glow": {
          "0%, 100%": { opacity: "0.25", filter: "blur(6px)" },
          "50%":      { opacity: "0.95", filter: "blur(2px)" },
        },

        /* ---------- Structure ---------- */
        "shelf-open": {
          "0%":   { transform: "rotateX(-84deg)", opacity: "0", transformOrigin: "top center" },
          "100%": { transform: "rotateX(0deg)", opacity: "1", transformOrigin: "top center" },
        },
        "drawer-slide": {
          "0%":   { transform: "translateY(-12%) scaleY(0.9)", opacity: "0" },
          "100%": { transform: "translateY(0) scaleY(1)", opacity: "1" },
        },
        "ripple-out": {
          "0%":   { transform: "scale(0.2)", opacity: "0.55" },
          "100%": { transform: "scale(2.6)", opacity: "0" },
        },
        "tilt-idle": {
          "0%, 100%": { transform: "perspective(1000px) rotateX(0.8deg) rotateY(-1.4deg)" },
          "50%":      { transform: "perspective(1000px) rotateX(-1deg) rotateY(1.6deg)" },
        },
        "path-dash": {
          "0%":   { strokeDashoffset: "220" },
          "100%": { strokeDashoffset: "0" },
        },
        "hue-cycle": {
          "0%, 100%": { filter: "hue-rotate(0deg)" },
          "50%":      { filter: "hue-rotate(40deg)" },
        },

        /* ======================================================================
           MOTION LAYER v4 — foil, mechanism, fabric and optics
           Added alongside the v3 set rather than replacing any of it: several
           existing components target these names as strings, so a rename is a
           breaking change even when the curve is identical.
           ====================================================================== */

        /* ---------- Holographic foil and metal ---------- */
        /* Two things move at once: the gradient slides and the hue turns. Foil
           that only slides reads as plastic; the hue turn is what sells leaf. */
        "foil-shift": {
          "0%":   { backgroundPosition: "0% 50%", filter: "hue-rotate(-16deg) saturate(1.15)" },
          "50%":  { backgroundPosition: "100% 50%", filter: "hue-rotate(18deg) saturate(1.4)" },
          "100%": { backgroundPosition: "0% 50%", filter: "hue-rotate(-16deg) saturate(1.15)" },
        },
        "sheen-diagonal": {
          "0%":   { transform: "translate3d(-140%, -140%, 0) rotate(28deg)" },
          "100%": { transform: "translate3d(140%, 140%, 0) rotate(28deg)" },
        },
        "emboss-press": {
          "0%":   { transform: "translateY(-2px)", filter: "brightness(1.12)" },
          "55%":  { transform: "translateY(1px)", filter: "brightness(0.94)" },
          "100%": { transform: "translateY(0)", filter: "brightness(1)" },
        },
        "neon-gold": {
          "0%, 100%": { textShadow: "0 0 6px rgb(var(--gold-400) / 0.55), 0 0 22px rgb(var(--gold-500) / 0.3)" },
          "48%":      { textShadow: "0 0 3px rgb(var(--gold-400) / 0.3), 0 0 10px rgb(var(--gold-500) / 0.14)" },
          "52%":      { textShadow: "0 0 10px rgb(var(--gold-300) / 0.8), 0 0 34px rgb(var(--gold-400) / 0.45)" },
        },

        /* ---------- The loupe ----------
           A jeweller lens throws a crescent of light across what it magnifies. */
        "loupe-flare": {
          "0%, 100%": { transform: "translate3d(-14%, -8%, 0) rotate(-8deg)", opacity: "0.35" },
          "50%":      { transform: "translate3d(12%, 6%, 0) rotate(6deg)", opacity: "0.8" },
        },
        "laser-scan": {
          "0%":   { transform: "translateY(-6%)", opacity: "0" },
          "10%":  { opacity: "1" },
          "90%":  { opacity: "1" },
          "100%": { transform: "translateY(106%)", opacity: "0" },
        },
        "radar-sweep": {
          "0%":   { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },

        /* ---------- Paper, leaf and fabric ---------- */
        "page-turn": {
          "0%":   { transform: "perspective(1600px) rotateY(0deg)", filter: "brightness(1)" },
          "45%":  { filter: "brightness(0.86)" },
          "100%": { transform: "perspective(1600px) rotateY(-172deg)", filter: "brightness(1)" },
        },
        "leaf-flip-down": {
          "0%":   { transform: "perspective(420px) rotateX(0deg)" },
          "100%": { transform: "perspective(420px) rotateX(-90deg)" },
        },
        "leaf-flip-up": {
          "0%":   { transform: "perspective(420px) rotateX(90deg)" },
          "100%": { transform: "perspective(420px) rotateX(0deg)" },
        },
        "velvet-fold": {
          "0%":   { transform: "perspective(900px) rotateX(-72deg) scaleY(0.6)", opacity: "0" },
          "60%":  { transform: "perspective(900px) rotateX(8deg) scaleY(1.02)", opacity: "1" },
          "100%": { transform: "perspective(900px) rotateX(0deg) scaleY(1)", opacity: "1" },
        },
        "curtain-part-l": {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-101%)" },
        },
        "curtain-part-r": {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(101%)" },
        },
        "wipe-diagonal": {
          "0%":   { clipPath: "polygon(0 0, 0 0, 0 0, 0 0)" },
          "100%": { clipPath: "polygon(0 0, 140% 0, 140% 140%, 0 140%)" },
        },

        /* ---------- Sound and signal ---------- */
        "wave-ride": {
          "0%":   { transform: "translateX(0) scaleY(1)" },
          "50%":  { transform: "translateX(-25%) scaleY(0.72)" },
          "100%": { transform: "translateX(-50%) scaleY(1)" },
        },
        "eq-bar": {
          "0%, 100%": { transform: "scaleY(0.28)" },
          "22%":      { transform: "scaleY(1)" },
          "48%":      { transform: "scaleY(0.46)" },
          "71%":      { transform: "scaleY(0.86)" },
        },
        "pulse-dot": {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%":      { transform: "scale(0.55)", opacity: "0.45" },
        },

        /* ---------- Mechanism ---------- */
        pendulum: {
          "0%, 100%": { transform: "rotate(-11deg)" },
          "50%":      { transform: "rotate(11deg)" },
        },
        "spool-unwind": {
          "0%":   { strokeDashoffset: "0" },
          "100%": { strokeDashoffset: "-460" },
        },
        "thread-stitch": {
          "0%":   { strokeDashoffset: "180", opacity: "0" },
          "14%":  { opacity: "1" },
          "100%": { strokeDashoffset: "0", opacity: "1" },
        },
        "blueprint-draw": {
          "0%":   { strokeDashoffset: "1200", opacity: "0.2" },
          "100%": { strokeDashoffset: "0", opacity: "1" },
        },

        /* ---------- Stones in space ---------- */
        "gem-tumble": {
          "0%":   { transform: "rotate3d(1, 1, 0.4, 0deg)" },
          "100%": { transform: "rotate3d(1, 1, 0.4, 360deg)" },
        },
        "facet-spin-3d": {
          "0%":   { transform: "rotateY(0deg) rotateX(9deg)" },
          "100%": { transform: "rotateY(360deg) rotateX(9deg)" },
        },
        "crown-rise": {
          "0%":   { transform: "translateY(38%) scale(0.82) rotateX(28deg)", opacity: "0" },
          "100%": { transform: "translateY(0) scale(1) rotateX(0deg)", opacity: "1" },
        },

        /* ---------- Type and heat ---------- */
        "glyph-jitter": {
          "0%, 100%": { transform: "translate3d(0,0,0)" },
          "25%":      { transform: "translate3d(-0.6px, 0.8px, 0)" },
          "50%":      { transform: "translate3d(0.8px, -0.5px, 0)" },
          "75%":      { transform: "translate3d(-0.4px, -0.7px, 0)" },
        },
        "heat-haze": {
          "0%, 100%": { transform: "skewX(0deg) scaleY(1)", filter: "blur(0px)" },
          "35%":      { transform: "skewX(0.7deg) scaleY(1.012)", filter: "blur(0.4px)" },
          "70%":      { transform: "skewX(-0.6deg) scaleY(0.99)", filter: "blur(0.3px)" },
        },
        "melt-down": {
          "0%":   { clipPath: "inset(0 0 0 0)", filter: "blur(0px)" },
          "100%": { clipPath: "inset(0 0 100% 0)", filter: "blur(6px)" },
        },

        /* ---------- Cards and shelves ---------- */
        "card-deal": {
          "0%":   { transform: "translate3d(-46%, 26%, 0) rotate(-16deg) scale(0.9)", opacity: "0" },
          "100%": { transform: "translate3d(0,0,0) rotate(0deg) scale(1)", opacity: "1" },
        },
        "pin-drop": {
          "0%":   { transform: "translateY(-140%) scale(0.6)", opacity: "0" },
          "58%":  { transform: "translateY(0) scale(1.12)", opacity: "1" },
          "76%":  { transform: "translateY(-12%) scale(0.96)" },
          "100%": { transform: "translateY(0) scale(1)", opacity: "1" },
        },
        "depth-push": {
          "0%":   { transform: "perspective(1200px) translateZ(0)" },
          "100%": { transform: "perspective(1200px) translateZ(-140px)" },
        },
        "iris-close": {
          "0%":   { clipPath: "circle(150% at 50% 50%)" },
          "100%": { clipPath: "circle(0% at 50% 50%)" },
        },

        /* ---------- Vertical rails ---------- */
        "marquee-y": {
          "0%":   { transform: "translateY(0)" },
          "100%": { transform: "translateY(-50%)" },
        },
        "marquee-y-reverse": {
          "0%":   { transform: "translateY(-50%)" },
          "100%": { transform: "translateY(0)" },
        },
      },

      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float-slow 11s ease-in-out infinite",
        shimmer: "shimmer 3.5s linear infinite",
        orbit: "orbit 24s linear infinite",
        "orbit-slow": "orbit 48s linear infinite",
        "orbit-reverse": "orbit-reverse 24s linear infinite",
        marquee: "marquee 38s linear infinite",
        "marquee-reverse": "marquee-reverse 38s linear infinite",
        sparkle: "sparkle 2.4s ease-in-out infinite",
        "glow-pulse": "glow-pulse 3.4s ease-in-out infinite",
        "ken-burns": "ken-burns 24s ease-in-out infinite alternate",
        "aurora-drift": "aurora-drift 26s ease-in-out infinite",
        "gradient-pan": "gradient-pan 9s ease infinite",
        "border-flow": "border-flow 6s linear infinite",
        "scale-pulse": "scale-pulse 2.4s ease-out infinite",
        "fade-up": "fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both",
        "slide-down": "slide-down 0.45s cubic-bezier(0.22,1,0.36,1) both",
        "spin-slow": "spin-slow 18s linear infinite",
        tick: "tick 2.6s ease-in-out infinite",
        "caret-blink": "caret-blink 1.1s steps(1) infinite",

        /* ---------- Cinematic atmosphere ---------- */
        "grain-shift": "grain-shift 700ms steps(6) infinite",
        scanline: "scanline 7s linear infinite",
        flicker: "flicker 6s ease-in-out infinite",
        "god-ray": "god-ray 14s ease-in-out infinite",
        "iris-open": "iris-open 1.1s cubic-bezier(0.22,1,0.36,1) forwards",
        "letterbox-open": "letterbox-open 1.2s cubic-bezier(0.76,0,0.24,1) forwards",

        /* ---------- Light and metal ---------- */
        "light-sweep": "light-sweep 3.6s cubic-bezier(0.4,0,0.2,1) infinite",
        "facet-glint": "facet-glint 5.5s ease-in-out infinite",
        refract: "refract 9s ease-in-out infinite",
        "conic-spin": "conic-spin 8s linear infinite",
        "conic-spin-slow": "conic-spin 22s linear infinite",
        "prism-shift": "prism-shift 12s ease-in-out infinite",

        /* ---------- Entrances ---------- */
        "blur-in": "blur-in 1s cubic-bezier(0.22,1,0.36,1) both",
        "elastic-in": "elastic-in 0.9s cubic-bezier(0.34,1.56,0.64,1) both",
        "unfurl-x": "unfurl-x 0.9s cubic-bezier(0.22,1,0.36,1) both",
        "flip-in": "flip-in 0.95s cubic-bezier(0.22,1,0.36,1) both",

        /* ---------- Ambient idles ---------- */
        breathe: "breathe 7s ease-in-out infinite",
        "drift-x": "drift-x 18s ease-in-out infinite",
        swing: "swing 5.5s ease-in-out infinite",
        wobble: "wobble 12s ease-in-out infinite",
        "zoom-drift": "zoom-drift 30s ease-in-out infinite alternate",
        "dust-rise": "dust-rise 6s ease-out infinite",
        "pulse-ring": "pulse-ring 2.8s cubic-bezier(0.22,1,0.36,1) infinite",
        "sparkle-pop": "sparkle-pop 900ms cubic-bezier(0.22,1,0.36,1) forwards",

        /* ---------- Mechanism and readouts ---------- */
        "digit-roll": "digit-roll 1.1s cubic-bezier(0.22,1,0.36,1) both",
        "ticker-flash": "ticker-flash 1.1s ease-out both",
        "needle-settle": "needle-settle 1.3s cubic-bezier(0.22,1,0.36,1) both",
        "scan-sweep": "scan-sweep 2.4s cubic-bezier(0.4,0,0.2,1) infinite",
        "stamp-in": "stamp-in 0.8s cubic-bezier(0.34,1.56,0.64,1) both",

        /* ---------- Optics ---------- */
        "flare-drift": "flare-drift 11s ease-in-out infinite",
        "bokeh-float": "bokeh-float 14s linear infinite",
        "caustic-pool": "caustic-pool 24s ease-in-out infinite",
        "aperture-blink": "aperture-blink 9s ease-in-out infinite",
        "chroma-split": "chroma-split 5s ease-in-out infinite",

        /* ---------- Craft and material ---------- */
        "anvil-strike": "anvil-strike 2.6s ease-in-out infinite",
        "molten-flow": "molten-flow 8s linear infinite",
        "polish-buff": "polish-buff 3.2s ease-in-out infinite",
        "engrave-cut": "engrave-cut 1.6s cubic-bezier(0.76,0,0.24,1) both",
        "solder-glow": "solder-glow 2.2s ease-in-out infinite",

        /* ---------- Structure ---------- */
        "shelf-open": "shelf-open 0.9s cubic-bezier(0.22,1,0.36,1) both",
        "drawer-slide": "drawer-slide 0.6s cubic-bezier(0.22,1,0.36,1) both",
        "ripple-out": "ripple-out 1.6s cubic-bezier(0.22,1,0.36,1) infinite",
        "tilt-idle": "tilt-idle 14s ease-in-out infinite",
        "path-dash": "path-dash 2.4s cubic-bezier(0.22,1,0.36,1) both",
        "hue-cycle": "hue-cycle 16s ease-in-out infinite",

        /* ---------- v4: foil and metal ---------- */
        "foil-shift": "foil-shift 9s ease-in-out infinite",
        "sheen-diagonal": "sheen-diagonal 2.6s cubic-bezier(0.4,0,0.2,1) infinite",
        "emboss-press": "emboss-press 340ms cubic-bezier(0.22,1,0.36,1) both",
        "neon-gold": "neon-gold 7s ease-in-out infinite",

        /* ---------- v4: the loupe ---------- */
        "loupe-flare": "loupe-flare 8s ease-in-out infinite",
        "laser-scan": "laser-scan 3.2s cubic-bezier(0.4,0,0.2,1) infinite",
        "radar-sweep": "radar-sweep 5.5s linear infinite",

        /* ---------- v4: paper and fabric ---------- */
        "page-turn": "page-turn 1.15s cubic-bezier(0.65,0,0.35,1) forwards",
        "leaf-flip-down": "leaf-flip-down 320ms cubic-bezier(0.65,0,0.35,1) forwards",
        "leaf-flip-up": "leaf-flip-up 320ms cubic-bezier(0.22,1,0.36,1) forwards",
        "velvet-fold": "velvet-fold 1s cubic-bezier(0.22,1,0.36,1) both",
        "curtain-part-l": "curtain-part-l 1.3s cubic-bezier(0.76,0,0.24,1) forwards",
        "curtain-part-r": "curtain-part-r 1.3s cubic-bezier(0.76,0,0.24,1) forwards",
        "wipe-diagonal": "wipe-diagonal 1.1s cubic-bezier(0.76,0,0.24,1) both",

        /* ---------- v4: sound and signal ---------- */
        "wave-ride": "wave-ride 9s ease-in-out infinite",
        "eq-bar": "eq-bar 1.1s ease-in-out infinite",
        "pulse-dot": "pulse-dot 1.8s ease-in-out infinite",

        /* ---------- v4: mechanism ---------- */
        pendulum: "pendulum 4.2s ease-in-out infinite",
        "spool-unwind": "spool-unwind 14s linear infinite",
        "thread-stitch": "thread-stitch 2s cubic-bezier(0.22,1,0.36,1) both",
        "blueprint-draw": "blueprint-draw 3s cubic-bezier(0.22,1,0.36,1) both",

        /* ---------- v4: stones in space ---------- */
        "gem-tumble": "gem-tumble 26s linear infinite",
        "facet-spin-3d": "facet-spin-3d 18s linear infinite",
        "crown-rise": "crown-rise 1.1s cubic-bezier(0.22,1,0.36,1) both",

        /* ---------- v4: type and heat ---------- */
        "glyph-jitter": "glyph-jitter 3.4s steps(4) infinite",
        "heat-haze": "heat-haze 6s ease-in-out infinite",
        "melt-down": "melt-down 1.4s cubic-bezier(0.76,0,0.24,1) forwards",

        /* ---------- v4: cards and shelves ---------- */
        "card-deal": "card-deal 0.85s cubic-bezier(0.22,1,0.36,1) both",
        "pin-drop": "pin-drop 0.9s cubic-bezier(0.34,1.56,0.64,1) both",
        "depth-push": "depth-push 1.2s cubic-bezier(0.22,1,0.36,1) both",
        "iris-close": "iris-close 1s cubic-bezier(0.76,0,0.24,1) forwards",

        /* ---------- v4: vertical rails ---------- */
        "marquee-y": "marquee-y 34s linear infinite",
        "marquee-y-reverse": "marquee-y-reverse 34s linear infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/container-queries")],
};

export default config;
