import type { Config } from 'tailwindcss';

/**
 * Tailwind CSS configuration file
 *
 * docs: https://tailwindcss.com/docs/configuration
 * default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */
const sizes = {};
const scale = 1; // 10px => scale = 2 / 5

for (let i = 0; i < 500; i += 1) {
  sizes[i] = `${Number((i * scale).toFixed(4))}rem`;
  sizes[`${i}.5`] = `${Number(((i + 0.5) * scale).toFixed(4))}rem`;
}

export default {
  corePlugins: {
    preflight: true
  },
  content: ['./src/**/*.{ts,js}', './**/*.liquid', './assets/**/*.js'],
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        }
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-in-out'
      },
      height: {
        ...sizes,
        screen: 'var(--screen-height, 100vh)',
        'screen-no-nav': 'calc(var(--screen-height, 100vh) - var(--height-nav))'
      },
      width: {
        ...sizes
      },
      spacing: {
        ...sizes,
        nav: 'var(--height-nav)',
        screen: 'var(--screen-height, 100vh)'
      },
      screens: {
        sm: '32em',
        md: '48em',
        lg: '64em',
        xl: '80em',
        'to-lg': { max: '64em' },
        '2xl': '96em',
        'sm-max': { max: '48em' },
        'sm-only': { min: '32em', max: '48em' },
        'md-only': { min: '48em', max: '64em' },
        'lg-only': { min: '64em', max: '80em' },
        'xl-only': { min: '80em', max: '96em' },
        '2xl-only': { min: '96em' }
      }
      // fontFamily: {
      //   sans: ['Britanica', 'sans-serif'],
      //   britanica: ['Britanica', 'sans-serif']
      // },
    }
  },
  plugins: []
} satisfies Config;
