import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          50: '#f9fafb',
          100: '#f3f4f6',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
      },
    },
  },
  plugins: [],
}
export default config
