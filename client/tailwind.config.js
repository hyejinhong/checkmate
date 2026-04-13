/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#79E5CB",
        "primary-container": "#69f6b8",
        "on-primary-container": "#005a3c",
        "surface": "#f5f7f9",
        "on-surface": "#2c2f31",
        "on-surface-variant": "#595c5e",
        "on-secondary-container": "#5d5000",
        "on-tertiary-container": "#295568",
      },
      fontFamily: {
        headline: ["Plus Jakarta Sans", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}