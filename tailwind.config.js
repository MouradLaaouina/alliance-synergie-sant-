/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./index.tsx",
        "./App.tsx",
        "./pages/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                emerald: {
                    50: '#f4faf2',
                    100: '#e6f3e1',
                    200: '#cce6c3',
                    300: '#abd19b',
                    400: '#86b86e',
                    500: '#5bb847',
                    600: '#5bb947',
                    700: '#3a7d2d',
                    800: '#306427',
                    900: '#285322',
                    950: '#132d10',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
            },
            animation: {
                'aurora-drift-slow': 'aurora-drift 40s ease-in-out infinite',
                'text-shine': 'text-shine 5s linear infinite',
                'shine-fast': 'shine-fast 2s ease-in-out infinite',
            },
            keyframes: {
                'aurora-drift': {
                    '0%': { transform: 'translate(-6%, -4%) rotate(0deg) scale(1)', opacity: '0.5' },
                    '50%': { transform: 'translate(4%, 4%) rotate(6deg) scale(1.05)', opacity: '0.7' },
                    '100%': { transform: 'translate(-6%, -4%) rotate(0deg) scale(1)', opacity: '0.5' },
                },
                'text-shine': {
                    '0%': { backgroundPosition: '0% 50%' },
                    '100%': { backgroundPosition: '200% 50%' },
                },
                'shine-fast': {
                    '0%': { transform: 'skewX(-12deg) translateX(-100%)' },
                    '100%': { transform: 'skewX(-12deg) translateX(200%)' },
                },
            },
        },
    },
    plugins: [],
}
