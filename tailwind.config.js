/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', "sans-serif"],
        body: ['"Karla"', "sans-serif"],
        serif: ['"Newsreader"', "serif"],
      },
      colors: {
        surface: {
          DEFAULT: "#050508",
          50: "#0b0b10",
          100: "#111118",
          200: "#1a1a24",
          300: "#242430",
        },
        accent: {
          ember: "#ff7849",
          lavender: "#a78bfa",
          mint: "#2dd4bf",
        },
      },
    },
  },
  plugins: [],
};
