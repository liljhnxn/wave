import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: "#0b0c0e",
          900: "#111215",
          850: "#16181d",
          800: "#1d1f26",
          700: "#272a33",
          600: "#383c48",
        },
        purple: {
          accent: "#8b5cf6",
          hover: "#7c3aed",
          light: "#a78bfa",
          dim: "rgba(139, 92, 246, 0.12)",
          border: "rgba(139, 92, 246, 0.25)",
        },
        emerald: {
          accent: "#10b981",
          dim: "rgba(16, 185, 129, 0.12)",
          border: "rgba(16, 185, 129, 0.25)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
      },
      animation: {
        "wave-hand": "wave 1.8s infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        wave: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "20%": { transform: "rotate(14deg)" },
          "40%": { transform: "rotate(-10deg)" },
          "60%": { transform: "rotate(14deg)" },
          "80%": { transform: "rotate(-4deg)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
