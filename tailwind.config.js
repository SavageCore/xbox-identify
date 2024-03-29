module.exports = {
  content: ['./src/**/*.{html,ts}', './projects/**/*.{html,ts}'],
  darkMode: 'class',
  theme: {
    fontFamily: {
      display: ['Oswald', 'sans-serif'],
      body: ['Poppins', 'sans-serif'],
    },
    container: {
      center: true,
      padding: '1.5rem',
    },
    extend: {
      colors: {
        inherit: 'inherit',
        transparent: 'transparent',
        current: 'currentColor',

        white: '#fff',
        black: '#000',
        xbox: '#99c741',

        background: 'var(--bg)',
        accent: 'var(--accent)',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',

        gray: {
          100: '#e8eaed',
          200: '#d1d6db',
          300: '#bac1c8',
          400: '#a3adb6',
          500: '#8c98a4',
          600: '#707a83',
          700: '#545b62',
          800: '#383d42',
          900: '#1c1e21',
        },
        primary: {
          100: '#d7e5ff',
          200: '#afcbff',
          300: '#87b1ff',
          400: '#5f97ff',
          500: '#377dff',
          600: '#2c64cc',
          700: '#214b99',
          800: '#163266',
          900: '#0b1933',
        },
        success: {
          100: '#ccf4ed',
          200: '#99e9dc',
          300: '#66dfca',
          400: '#33d4b9',
          500: '#00c9a7',
          600: '#00a186',
          700: '#007964',
          800: '#005043',
          900: '#002821',
        },
        warning: {
          100: '#fdf4eb',
          200: '#fbead6',
          300: '#f9dfc2',
          400: '#f7d5ad',
          500: '#f5ca99',
          600: '#c4a27a',
          700: '#93795c',
          800: '#62513d',
          900: '#31281f',
        },
        danger: {
          100: '#fcd8e2',
          200: '#f9b1c5',
          300: '#f58ba7',
          400: '#f2648a',
          500: '#ef3d6d',
          600: '#bf3157',
          700: '#8f2541',
          800: '#60182c',
          900: '#300c16',
        },
      },
    },
  },
  plugins: [],
};
