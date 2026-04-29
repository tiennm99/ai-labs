/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Locked palette per autoplan Decision D3 (a11y + SGK tick-marks).
        pair1: '#D7263D',
        pair2: '#1B998B',
        pair3: '#F46036',
      },
      maxWidth: {
        prose: '56ch',
      },
    },
  },
  plugins: [],
};
