import type { Config } from 'tailwindcss';

const config = {
  darkMode: ['class'],
  content: [
    './Pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          '100': '#fff0e5',
          '400': '#ffa666',
          '500': '#FF6900',
          '600': '#ea580c',
          '800': '#ff334b',
          '950': '#1a1a1a',
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '95rem',
      },
      fontFamily: {
        inter: ['var(--font-inter)'],
        playfair: ['var(--font-playfair)'],
        spaceGrotesk: ['var(--font-spaceGrotesk)'],
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        enterFromRight: {
          from: {
            opacity: '0',
            transform: 'translateX(200px)',
          },
          to: {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        enterFromLeft: {
          from: {
            opacity: '0',
            transform: 'translateX(-200px)',
          },
          to: {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        exitToRight: {
          from: {
            opacity: '1',
            transform: 'translateX(0)',
          },
          to: {
            opacity: ' 0',
            transform: 'translateX(200px)',
          },
        },
        exitToLeft: {
          from: {
            opacity: '1',
            transform: 'translateX(0)',
          },
          to: {
            opacity: ' 0',
            transform: 'translateX(-200px)',
          },
        },
        scaleIn: {
          from: {
            opacity: '0',
            transform: 'rotateX(-10deg) scale(0.9)',
          },
          to: {
            opacity: '1',
            transform: 'rotateX(0deg) scale(1)',
          },
        },
        scaleOut: {
          from: {
            opacity: '1',
            transform: 'rotateX(0deg) scale(1)',
          },
          to: {
            opacity: '0',
            transform: 'rotateX(-10deg) scale(0.8)',
          },
        },
        fadeIn: {
          from: {
            opacity: '0',
          },
          to: {
            opacity: '1',
          },
        },
        fadeOut: {
          from: {
            opacity: '1',
          },
          to: {
            opacity: '0',
          },
        },
        marquee: {
          from: {
            transform: 'translateX(0)',
          },
          to: {
            transform: 'translateX(calc(-100% - var(--gap)))',
          },
        },
        'marquee-vertical': {
          from: {
            transform: 'translateY(0)',
          },
          to: {
            transform: 'translateY(calc(-100% - var(--gap)))',
          },
        },
      },
      transitionDuration: {
        '250': '250ms',
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        scaleIn: 'scaleIn 200ms ease',
        scaleOut: 'scaleOut 300ms ease-out',
        fadeIn: 'fadeIn 200ms ease',
        fadeOut: 'fadeOut 200ms ease-out',
        enterFromLeft: 'enterFromLeft 250ms ease',
        enterFromRight: 'enterFromRight 250ms ease',
        exitToLeft: 'exitToLeft 250ms ease',
        exitToRight: 'exitToRight 250ms ease',
        marquee: 'marquee var(--duration) infinite linear',
        'marquee-vertical': 'marquee-vertical var(--duration) linear infinite',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
} satisfies Config;

export default config;
