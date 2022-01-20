module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        body: "Montserrat",
        timer: "Orbitron",
      },
      colors: {
        primaryLight: "#FF7C77",
        primary: "#F0827D",
        primaryDark: "#FF534D",
        altText: "#B1B0B0",
        background: "#16151F",

        // gray: colors.trueGray,
        // coolGray: colors.coolGray,
      },
      width: {
        '68': '17rem',
      },
    },
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '1890px',
    }
  },
  plugins: [],
}
