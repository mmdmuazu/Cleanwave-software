module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#1f7a4c", // Deep green from logo
          secondary: "#4a7c59", // Moss green derived
          accent: "#a67c52", // Earth brown/gold derived
          background: "#faf9f6", // Soft sand/off-white
          text: "#2c2c2c", // Dark charcoal
        },
      },
    },
  },
  plugins: [],
};
