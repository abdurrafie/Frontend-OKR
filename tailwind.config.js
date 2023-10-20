/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {

    fontFamily: {
      'Poppins': ["Poppins", "sans-serif"],
    },
    
    extend: {
      colors: {
        'regal-blue': '#6C9BFF',
        'Aga': '#80ffffff',
        'unggu': '#A332C3',
        'Gold-dark': '#F5B625',
        'Gold': '#FFCC33',
        'Merah-muda': '#FFE2E5',
        'Merah': '#FA5A7D',
        'cream': '#FFF4DE',
        'cream-Dark': '#FF947A',
        'Hijau-muda': '#DCFCE7',
        'Hijau-tua': '#3CD856',
        'unggu-muda': '#F3E8FF',
        'unggu-tua': '#BF83FF',
      },
    },
  },
  plugins: [],
}