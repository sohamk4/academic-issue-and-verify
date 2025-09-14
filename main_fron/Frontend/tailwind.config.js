// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Add paths to all your JS/JSX/TS/TSX files
    "./public/index.html", // Add your HTML file if needed
  ],
  theme: {
    extend: {
      colors: {
        // Add custom colors if needed
        primary: "#0b193f",
        secondary: "#09132d",
      },
    },
  },
  plugins: [],
};