import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        slu: {
          blue: "#0770BD",
          "blue-light": "#0A8FE0",
          "blue-dark": "#055A94",
          navy: "#0A1929",
          gold: "#D4A843",
          offwhite: "#F0F0F0",
          black: "#0A0A0A",
          "gray-100": "#F5F5F5",
          "gray-200": "#E5E5E5",
          "gray-300": "#D4D4D4",
          "gray-400": "#A3A3A3",
          "gray-500": "#737373",
          "gray-600": "#525252",
          "gray-700": "#404040",
          "gray-800": "#262626",
          "gray-900": "#171717",
        },
      },
      fontFamily: {
        sans: ["var(--font-aileron)", "system-ui", "sans-serif"],
        display: ["var(--font-aileron)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-in-left": "slideInLeft 0.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
