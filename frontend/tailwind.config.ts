import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "rgb(var(--ink-50) / <alpha-value>)",
          100: "rgb(var(--ink-100) / <alpha-value>)",
          200: "rgb(var(--ink-200) / <alpha-value>)",
          300: "rgb(var(--ink-300) / <alpha-value>)",
          400: "rgb(var(--ink-400) / <alpha-value>)",
          500: "rgb(var(--ink-500) / <alpha-value>)",
          600: "rgb(var(--ink-600) / <alpha-value>)",
          700: "rgb(var(--ink-700) / <alpha-value>)",
          800: "rgb(var(--ink-800) / <alpha-value>)",
          900: "rgb(var(--ink-900) / <alpha-value>)",
          950: "rgb(var(--ink-950) / <alpha-value>)",
        },
        cream: {
          50: "rgb(var(--cream-50) / <alpha-value>)",
          100: "rgb(var(--cream-100) / <alpha-value>)",
          200: "rgb(var(--cream-200) / <alpha-value>)",
        },
        gold: {
          100: "rgb(var(--gold-100) / <alpha-value>)",
          200: "rgb(var(--gold-200) / <alpha-value>)",
          300: "rgb(var(--gold-300) / <alpha-value>)",
          400: "rgb(var(--gold-400) / <alpha-value>)",
          500: "rgb(var(--gold-500) / <alpha-value>)",
          600: "rgb(var(--gold-600) / <alpha-value>)",
          700: "rgb(var(--gold-700) / <alpha-value>)",
        },
        rosegold: {
          DEFAULT: "rgb(var(--rosegold) / <alpha-value>)",
        },
        platinum: {
          DEFAULT: "rgb(var(--platinum) / <alpha-value>)",
        },
        diamond: {
          DEFAULT: "rgb(var(--diamond) / <alpha-value>)",
        },
        burgundy: {
          DEFAULT: "rgb(var(--burgundy) / <alpha-value>)",
          light: "rgb(var(--burgundy-light) / <alpha-value>)",
        },
        canvas: {
          DEFAULT: "rgb(var(--canvas) / <alpha-value>)",
        },
        surface: {
          DEFAULT: "rgb(var(--surface) / <alpha-value>)",
          raised: "rgb(var(--surface-raised) / <alpha-value>)",
        },
        onaccent: "#0c0c0a",
      },
      fontFamily: {
        display: ["Cormorant Garamond", "serif"],
        sans: ["Inter", "sans-serif"],
        accent: ["Cinzel", "serif"],
      },
      backgroundImage: {
        "grain": "url('/noise.svg')",
        "gold-radial": "radial-gradient(circle at center, rgb(var(--gold-500) / 0.15) 0%, transparent 70%)",
        "gold-mesh": "radial-gradient(at 40% 20%, rgb(var(--gold-500) / 0.1) 0px, transparent 50%), radial-gradient(at 80% 0%, rgb(var(--ink-800) / 0.5) 0px, transparent 50%), radial-gradient(at 0% 50%, rgb(var(--gold-300) / 0.05) 0px, transparent 50%)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translate3d(0,-14px,0)" },
          "50%": { transform: "translate3d(0,0px,0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        orbit: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        sparkle: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.5" },
          "50%": { transform: "scale(1.2)", opacity: "1" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 10px rgb(var(--gold-500) / 0.2), 0 0 20px rgb(var(--gold-500) / 0.1)" },
          "50%": { boxShadow: "0 0 20px rgb(var(--gold-500) / 0.4), 0 0 40px rgb(var(--gold-500) / 0.2)" },
        },
        "ken-burns": {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.08)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 3.5s linear infinite",
        orbit: "orbit 24s linear infinite",
        marquee: "marquee 38s linear infinite",
        sparkle: "sparkle 2s ease-in-out infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "ken-burns": "ken-burns 20s ease-in-out infinite alternate",
      },
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
  ],
};

export default config;
