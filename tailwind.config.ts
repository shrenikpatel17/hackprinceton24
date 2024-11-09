import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        RalewayBold: ["RalewayBold"],
        RalewayExtraBold: ["RalewayExtraBold"],
        RalewayExtraLight: ["RalewayExtraLight"],
        RalewayLight: ["RalewayLight"],
        RalewayMedium: ["RalewayMedium"],
        RalewayRegular: ["RalewayRegular"],
        RalewaySemiBold: ["RalewaySemiBold"],
      },
      colors: {
        'grad-light-blue': '#F1F5FF',
        'grad-dark-blue': '#A5B5DA',
        'box-fill-flue': '#E5ECFF',
        'text-blue': '#1D2B4E',
      },
    },
  },
  plugins: [],
} satisfies Config;
