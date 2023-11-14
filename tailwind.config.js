/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#2D3549",
        secondary: "#202535",
      },
      fontFamily: {
        productSansBlack: ["ProductSansBlack"],
        productSans: ["ProductSans"],
      },
    },
  },
  plugins: [],
};
