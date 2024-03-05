/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'header': "url('https://bizweb.dktcdn.net/100/438/408/themes/936254/assets/background-header.png?1704869161638')",
      },
      colors: {
        orangeCt:"#fcaf17",
        textBlueCt:"#11006F",
      }
    },
    
  },
  plugins: [],
}