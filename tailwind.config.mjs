/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        md: "1.5rem",
        lg: "2rem",
      },
    },
    extend: {
      colors: {
        "twitter-blue": "#1DA1F2",
        navy: "#0a192f",
        "light-navy": "#112240",
        "lightest-navy": "#8892b0",
        slate: "#0a192f",
        "light-slate": "#a8b2d1",
        "lightest-slate": "#ccd6f6",
        white: "#e6f1ff",
        green: "#64ffda",
        purple: "#604CC3",
        orange: "#FF6600",
        "light-text": "#737373",
      },
    },
  },
  plugins: [],
};
