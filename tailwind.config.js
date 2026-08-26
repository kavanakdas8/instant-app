/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-poppins)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        border: "var(--border)",
        accent: {
          pink: "#FF2E93",
          cyan: "#00F0FF",
          purple: "#9D4EDD",
          green: "#00E676",
        }
      },
      animation: {
        "shutter-flash": "shutter-flash 0.15s ease-out forwards",
        "glow-pulse": "glow-pulse 2s infinite ease-in-out",
        "fade-in-up": "fade-in-up 0.3s ease-out forwards",
      },
      keyframes: {
        "shutter-flash": {
          "0%": { opacity: "0" },
          "50%": { opacity: "0.9" },
          "100%": { opacity: "0" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 10px rgba(0, 240, 255, 0.4), 0 0 20px rgba(255, 46, 147, 0.2)" },
          "50%": { boxShadow: "0 0 25px rgba(0, 240, 255, 0.8), 0 0 35px rgba(255, 46, 147, 0.5)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(15px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        }
      }
    },
  },
  plugins: [],
};
