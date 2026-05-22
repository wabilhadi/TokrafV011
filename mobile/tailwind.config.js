/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}", "./store/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // === Sinkron dengan web frontend ===
        background: "#FFFFFF",
        foreground: "#0A0A0A",
        primary:    "#800000",   // Maroon — warna brand TOKRAF
        secondary:  "#F5F5F5",
        border:     "#E5E5E5",
        muted:      "#F9F9F9",
        card:       "#FFFFFF",
      },
      fontFamily: {
        sans:    ["System"],
        heading: ["System"],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
        "4xl": "32px",
      }
    },
  },
  plugins: [],
}
