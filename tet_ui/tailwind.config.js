/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "custom-pink": "#FF9F9F",
        "custom-red": "#FF2C61",
        yellow: {
          500: "#FBBF24",
        },
      },
    },
  },
  plugins: [],
};
