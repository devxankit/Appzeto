/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Custom brand colors
        brand: {
          'light-sea-green': '#07beb8',
          'robin-egg-blue': '#3dccc7',
          'tiffany-blue': '#68d8d6',
          'celeste': '#9ceaefff',
          'celeste-2': '#c4fff9',
          50: '#c4fff9',
          100: '#9ceaefff',
          200: '#68d8d6',
          300: '#3dccc7',
          400: '#07beb8',
          500: '#07beb8',
          600: '#06a8a3',
          700: '#05928e',
          800: '#047c79',
          900: '#036664',
        },
        // Supporting colors for tiles
        tile: {
          'payment': '#07beb8',
          'demo': '#f59e0b',
          'tasks': '#8b5cf6',
          'meetings': '#ef4444',
        },
      },
      animation: {
        'marquee': 'marquee var(--duration, 40s) infinite linear',
        'marquee-vertical': 'marquee-vertical var(--duration, 40s) infinite linear',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - var(--gap, 1rem)))' },
        },
        'marquee-vertical': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(calc(-100% - var(--gap, 1rem)))' },
        },
      },
    },
  },
  plugins: [],
}
