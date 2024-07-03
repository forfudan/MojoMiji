/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        './components/**/*.{ts,tsx,vue}',
        './src/**/*.{ts,tsx,vue}',
    ],
    theme: {
        extend: {
            flex: {
                '5': '0.5 0.5 0%',
                '2': '2 2 0%'
            }
        }
    },
    plugins: [require("daisyui")],
}