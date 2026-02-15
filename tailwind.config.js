/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Syne"', "sans-serif"],
        body: ['"DM Sans"', "sans-serif"],
        serif: ['"Instrument Serif"', "serif"],
      },
      colors: {
        surface: {
          DEFAULT: "#030303",
          50: "#0a0a0a",
          100: "#111111",
          200: "#1a1a1a",
          300: "#222222",
        },
        accent: {
          teal: "#00d4aa",
          violet: "#7c5bf5",
          blue: "#00a8e8",
        },
      },
    },
  },
  plugins: [],
};
