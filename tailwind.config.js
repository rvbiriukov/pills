/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#0ea5e9', // Sky 500
                    hover: '#0284c7',   // Sky 600
                },
                secondary: {
                    DEFAULT: '#64748b', // Slate 500
                },
                background: '#f8fafc', // Slate 50
                surface: '#ffffff',
            }
        },
    },
    plugins: [],
}
