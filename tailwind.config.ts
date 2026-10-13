import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: { DEFAULT: "1.25rem", md: "2rem" }, screens: { "2xl": "1280px" } },
    extend: {
      colors: {
        bg: "#070908",
        surface: "#0c100e",
        surface2: "#111714",
        line: "#1b2420",
        "line-strong": "#28352e",
        ink: "#e7ece8",
        muted: "#93a097",
        dim: "#76847c", // 5.1:1 on bg, 4.6:1 on surface2 — keep ≥4.5:1 everywhere (WCAG AA)
        accent: "#34d27b",
        "accent-strong": "#22c55e",
        "accent-deep": "#0f3d24",
        neon: "#86ffb8",
        warn: "#e5b84a",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: { label: "0.18em" },
      keyframes: {
        sweep: { to: { transform: "rotate(360deg)" } },
        gridpan: { to: { backgroundPosition: "48px 48px" } },
        blink: { "50%": { opacity: "0.25" } },
        dash: { to: { strokeDashoffset: "0" } },
        marquee: { to: { transform: "translateX(-50%)" } },
        scan: { "0%": { transform: "translateY(-120%)" }, "100%": { transform: "translateY(560%)" } },
        aurora: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(40px, -30px) scale(1.08)" },
          "66%": { transform: "translate(-30px, 24px) scale(0.95)" },
        },
        shimmer: { to: { backgroundPosition: "200% center" } },
        led: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgb(52 210 123 / 0)", borderColor: "rgb(52 210 123 / 0.35)", color: "#e7ece8" },
          "50%": { boxShadow: "0 0 16px 1px rgb(52 210 123 / 0.35)", borderColor: "rgb(134 255 184 / 0.9)", color: "#86ffb8" },
        },
        float: { "0%, 100%": { translate: "0 0" }, "50%": { translate: "0 -6px" } },
        sweepx: { "0%": { transform: "translateX(-120%) skewX(-12deg)" }, "100%": { transform: "translateX(260%) skewX(-12deg)" } },
        blob: {
          "0%, 100%": { borderRadius: "58% 42% 55% 45% / 48% 56% 44% 52%" },
          "33%": { borderRadius: "45% 55% 48% 52% / 55% 45% 58% 42%" },
          "66%": { borderRadius: "52% 48% 42% 58% / 44% 52% 48% 56%" },
        },
      },
      animation: {
        sweep: "sweep 6s linear infinite",
        gridpan: "gridpan 8s linear infinite",
        blink: "blink 2.4s ease-in-out infinite",
        draw: "dash 10s ease-in-out infinite alternate",
        marquee: "marquee 36s linear infinite",
        scan: "scan 5.5s ease-in-out infinite",
        "spin-slower": "sweep 10s linear infinite",
        aurora: "aurora 14s ease-in-out infinite",
        shimmer: "shimmer 3.2s linear infinite",
        blob: "blob 12s ease-in-out infinite",
        led: "led 3.4s ease-in-out infinite",
        sweepx: "sweepx 1.1s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "orbit-in": "sweep 32s linear infinite",
        "orbit-in-rev": "sweep 32s linear infinite reverse",
        "orbit-out": "sweep 52s linear infinite reverse",
        "orbit-out-rev": "sweep 52s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
