import { type Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

export const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    fontFamily: {
      sans: 'var(--font-geist-sans)',
      mono: 'var(--font-geist-mono)',
    },
    boxShadow: ({ theme }) => ({
      DEFAULT: `0 4px 0 ${theme('colors.zinc.900/0.1')}`,
      key: `0 1px 0 2px ${theme('colors.zinc.400')}`,
    }),
    extend: {
      colors: ({ colors }) => ({
        accent: colors.sky[500],
      }),
      keyframes: {
        float: {
          from: { transform: 'translateY(-4px)' },
          to: { transform: 'translateY(4px)' },
        },
      },
      animation: {
        float: 'float 2s ease-in-out infinite alternate',
      },
    },
  },
  plugins: [
    plugin(({ addComponents, matchVariant }) => {
      addComponents({
        '.hopper': {
          display: 'grid',
          gridTemplateAreas: '"hopper"',
          '& > *': {
            gridArea: 'hopper',
          },
        },
      }),
        matchVariant('not', (v) => `&:not(${v})`)
    }),
    // Container queries plugin modified for "@max-*", source: https://github.com/tailwindlabs/tailwindcss-container-queries.
    plugin(
      ({ matchUtilities, matchVariant, theme }) => {
        let values: Record<string, string> = theme('containers') ?? {}

        function parseValue(value: string) {
          let numericValue = value.match(/^(\d+\.\d+|\d+|\.\d+)\D+/)?.[1] ?? null
          if (numericValue === null) return null
          return parseFloat(value)
        }

        matchUtilities(
          {
            '@container': (value, { modifier }) => {
              return {
                'container-type': value,
                'container-name': modifier,
              }
            },
          },
          {
            values: {
              DEFAULT: 'inline-size',
              normal: 'normal',
              size: 'size',
            },
            modifiers: 'any',
          },
        )

        const sort: (a: { value: string; modifier: string | null }, b: { value: string; modifier: string | null }) => number = (aVariant, zVariant) => {
          let a = parseFloat(aVariant.value)
          let z = parseFloat(zVariant.value)

          if (a === null || z === null) return 0

          // Sort values themselves regardless of unit
          if (a - z !== 0) return a - z

          let aLabel = aVariant.modifier ?? ''
          let zLabel = zVariant.modifier ?? ''

          // Explicitly move empty labels to the end
          if (aLabel === '' && zLabel !== '') {
            return 1
          } else if (aLabel !== '' && zLabel === '') {
            return -1
          }

          // Sort labels alphabetically in the English locale
          // We are intentionally overriding the locale because we do not want the sort to
          // be affected by the machine's locale (be it a developer or CI environment)
          return aLabel.localeCompare(zLabel, 'en', { numeric: true })
        }

        matchVariant(
          '@',
          (value = '', { modifier }) => {
            let parsed = parseValue(value)

            return parsed !== null ? `@container ${modifier ?? ''} (min-width: ${value})` : []
          },
          {
            values,
            sort,
          },
        )

        matchVariant(
          '@max',
          (value = '', { modifier }) => {
            let parsed = parseValue(value)

            return parsed !== null ? `@container ${modifier ?? ''} (max-width: ${value})` : []
          },
          {
            values,
            sort,
          },
        )
      },
      {
        theme: {
          containers: {
            xs: '20rem',
            sm: '24rem',
            md: '28rem',
            lg: '32rem',
            xl: '36rem',
            '2xl': '42rem',
            '3xl': '48rem',
            '4xl': '56rem',
            '5xl': '64rem',
            '6xl': '72rem',
            '7xl': '80rem',
          },
        },
      },
    ),
  ],
}
export default config
