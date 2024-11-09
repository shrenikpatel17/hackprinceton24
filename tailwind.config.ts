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
        MonoSemiBold: ["MonoSemiBold"],
        MonoReg: ["MonoReg"],
        RalewayReg: ["RalewayReg"],
        RalewayThin: ["RalewayThin"],
        RalewayVThin: ["RalewayVThin"],
        RalewayMed: ["RalewayMed"]

      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'grad-light': '#F1F6F0',
        'grad-dark' : '#C1D1BE',
        'text-green': '#044723',
        'hover-dark-green':'#003318',
        'icon-color': '#547A51',
        'bg-color': '#FEFFFC',
        'hover-light':'#f2f9f0',
        'text' : '#1D2B4E',
        'purple-bg' : '#E5ECFF',
        'orange' : '#FF751F'
      },
    },
  },
  plugins: [],
} satisfies Config;
