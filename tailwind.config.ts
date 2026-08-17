import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#0085B7",       // MedisPharm blue (sampled from the logo)
        "brand-deep": "#025573", // darker shade, used for gradients/depth
        "brand-light": "#4FB8E5", // lighter tint, used for hovers/glows
        navy: "#0B2A3B",         // near-black navy for text on white
        ivory: "#FFFFFF",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      backgroundImage: {
        grain: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};
export default config;
