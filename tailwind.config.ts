import type { Config } from "tailwindcss";
const { nextui } = require("@nextui-org/react");

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkGreen: '#647405',
        mediumGreen: '#8FA700',
        lightGreen: '#FAF8EB',
        darkBrown: '#632A09',
        mediumBrown: '#B3583C',
        lightBrown: '#E7AA50',
        darkRed: '#580C1F',
        mediumRed: "#74121D",
        lightRed: '#A7333F',
      },
    },
  },
  plugins: [nextui()],
};
export default config;
