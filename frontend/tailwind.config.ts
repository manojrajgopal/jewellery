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
      },
    },
  },
  plugins: [require("@tailwindcss/container-queries")],
};

export default config;
