import type { Config } from 'tailwindcss'

const config: Config = {
 content: [
  './src/**/*.{js,ts,jsx,tsx,mdx}',
  './pages/**/*.{js,ts,jsx,tsx,mdx}',
  './components/**/*.{js,ts,jsx,tsx,mdx}',
  './app/**/*.{js,ts,jsx,tsx,mdx}'
 ],
 theme: {
  extend: {
   backgroundImage: {
    'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
    'gradient-conic':
     'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
    'bg-header': 'url("/images/background-header.webp")'
   },
   colors: {
    orangeCt: '#fcaf17',
    levender: '#f8f8f8',
    textBlueCt: '#11006F'
   }
  }
 },
 plugins: []
}
export default config
