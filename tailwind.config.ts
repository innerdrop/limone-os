import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Paleta de Marca Limoné (Extraída del logo)
                brand: {
                    charcoal: '#2D2D2D', // Texto y contraste
                    purple: '#8E44AD',   // Creatividad
                    red: '#E74C3C',      // Pasión
                    orange: '#F39C12',   // Calidez
                    yellow: '#F1C40F',   // Energía (Corazón de Limoné)
                    green: '#27AE60',    // Frescura
                },
                // Mantenemos las paletas funcionales pero vinculadas a la marca
                lemon: {
                    50: '#FFFEF5',
                    100: '#FFF9C4',
                    200: '#FFF59D',
                    300: '#FFF176',
                    400: '#FFEE58',
                    500: '#F1C40F', // Vinculado a brand.yellow
                    600: '#D4AC0D',
                    700: '#B7950B',
                    800: '#9A7D0A',
                    900: '#7D6608',
                },
                // Paleta Hojas/Verde Orgánico
                leaf: {
                    50: '#F1F8E9',
                    100: '#DCEDC8',
                    200: '#C5E1A5',
                    300: '#AED581',
                    400: '#9CCC65',
                    500: '#27AE60', // Vinculado a brand.green
                    600: '#1E8449',
                    700: '#196F3D',
                    800: '#145A32',
                    900: '#0E3E22',
                },
                // Tonos Canvas/Lienzo
                canvas: {
                    50: '#FEFEFE',
                    100: '#FAF8F5',
                    200: '#F5F0E8',
                    300: '#EBE4D8',
                    400: '#DDD3C0',
                    500: '#C9BBA3',
                },
                // Tonos Neutros Cálidos
                warm: {
                    50: '#FAFAF9',
                    100: '#F5F5F4',
                    200: '#E7E5E4',
                    300: '#D6D3D1',
                    400: '#A8A29E',
                    500: '#78716C',
                    600: '#57534E',
                    700: '#44403C',
                    800: '#2D2D2D', // Vinculado a brand.charcoal
                    900: '#1C1917',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                serif: ['Playfair Display', 'Georgia', 'serif'],
                artistic: ['Caveat', 'cursive'], // Nueva fuente manuscrita
                gigi: ['Gigi', 'cursive'],
            },
            backgroundImage: {
                'canvas-texture': "url('/textures/canvas.png')",
                'paper-texture': "url('/textures/paper.png')",
            },
            boxShadow: {
                'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
                'glow-lemon': '0 0 20px rgba(253, 216, 53, 0.3)',
                'glow-leaf': '0 0 20px rgba(139, 195, 74, 0.3)',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
            },
        },
    },
    plugins: [],
}

export default config
