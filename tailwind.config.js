const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // borderWidth: {
    //   DEFAULT: '1.5px',
    // },
    extend: {},
    fontFamily: {
      sans: ['var(--inter-font)', ...fontFamily.sans],
      mono: ['var(--jetbrains-mono-font)', ...fontFamily.mono],
      display: ['var(--display-font)', ...fontFamily.sans],
    },
  },
  plugins: [],
}
