import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm, calm palette — this pathway leans on a validating, unhurried tone.
        plum: {
          50: "#faf7fb",
          100: "#f3ecf6",
          200: "#e6d7ec",
          300: "#d2b8dd",
          400: "#b88fc9",
          500: "#9c69b0",
          600: "#824f96",
          700: "#6b3f7b",
          800: "#593566",
          900: "#4b2e55",
        },
        clay: {
          50: "#fdf8f4",
          100: "#f9ece1",
          200: "#f1d6c2",
          300: "#e6b899",
          400: "#d9926a",
          500: "#cd7448",
          600: "#bd5d36",
          700: "#9d492d",
          800: "#7f3d2a",
          900: "#683425",
        },
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      maxWidth: {
        prose: "42rem",
      },
    },
  },
  plugins: [],
};

export default config;
