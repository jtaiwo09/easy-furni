/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      Roboto: ["Roboto", "sans-serif"],
      Poppins: ["Poppins", "sans-serif"],
    },
    extend: {
      screens: {
        xs: "450px",
      },
      backgroundImage: {},
      colors: {
        primary: "#202020",
        "text-hover": "#f63b60",
        "faded-primary": "rgba(112,112,112,1)",
      },
      borderColor: {
        "form-border": "#ddd",
        borderCol: "rgba(215,215,215,1)",
      },
    },
  },
  plugins: [],
};
