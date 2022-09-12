const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

delete colors["lightBlue"];
delete colors["warmGray"];
delete colors["trueGray"];
delete colors["coolGray"];
delete colors["blueGray"];

module.exports = {
  content: ["./src/tests/**/*.html", "./src/js/**/*.{js,jsx,ts,tsx,vue}"],
  theme: {
    colors: colors,
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
