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
        // ── Exact Heimstadt color tokens ──────────────────
        hm: {
          // Primary — deep navy
          primary:              "#002046",
          "primary-container":  "#1b365d",
          "on-primary":         "#ffffff",
          "on-primary-container": "#87a0cd",
          "primary-fixed":      "#d6e3ff",
          "primary-fixed-dim":  "#aec7f7",
          "inverse-primary":    "#aec7f7",

          // Secondary — golden amber
          secondary:            "#735c00",
          "secondary-container":"#fed65b",
          "on-secondary":       "#ffffff",
          "on-secondary-container": "#745c00",
          "secondary-fixed":    "#ffe088",
          "secondary-fixed-dim":"#e9c349",

          // Tertiary — warm brown
          tertiary:             "#321c00",
          "tertiary-container": "#4f2f00",
          "on-tertiary-container": "#c6965e",

          // Background / surface
          bg:                   "#f8f9ff",
          surface:              "#f8f9ff",
          "surface-dim":        "#cbdbf5",
          "surface-variant":    "#d3e4fe",
          "surface-container":  "#e5eeff",
          "surface-container-low":    "#eff4ff",
          "surface-container-high":   "#dce9ff",
          "surface-container-highest":"#d3e4fe",
          "surface-container-lowest": "#ffffff",
          "surface-tint":       "#465f88",

          // Text
          "on-bg":              "#0b1c30",
          "on-surface":         "#0b1c30",
          "on-surface-variant": "#44474e",
          "inverse-surface":    "#213145",
          "inverse-on-surface": "#eaf1ff",

          // Borders
          outline:              "#74777f",
          "outline-variant":    "#c4c6cf",

          // Error
          error:                "#ba1a1a",
          "error-container":    "#ffdad6",
          "on-error-container": "#93000a",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm:   "0.25rem",
        lg:   "0.5rem",
        xl:   "0.75rem",
        "2xl":"1rem",
        full: "9999px",
      },
      boxShadow: {
        card:    "0 1px 3px 0 rgb(0 32 70 / 0.06), 0 1px 2px -1px rgb(0 32 70 / 0.04)",
        "card-md":"0 4px 12px 0 rgb(0 32 70 / 0.08), 0 2px 4px -2px rgb(0 32 70 / 0.05)",
        "card-lg":"0 8px 24px 0 rgb(0 32 70 / 0.10), 0 4px 8px -4px rgb(0 32 70 / 0.06)",
      },
      animation: {
        "fade-in":    "fadeIn 0.3s ease-out",
        "slide-down": "slideDown 0.35s cubic-bezier(0.4,0,0.2,1)",
      },
      keyframes: {
        fadeIn:    { from: { opacity: "0" }, to: { opacity: "1" } },
        slideDown: { from: { transform: "translateY(-12px)", opacity: "0" }, to: { transform: "translateY(0)", opacity: "1" } },
      },
    },
  },
  plugins: [],
};

export default config;
