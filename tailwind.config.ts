import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--color-background)",
                foreground: "var(--color-foreground)",
                accent:     "var(--color-accent)",
                border:     "var(--color-border)",
                paper:      "var(--color-paper)",
                muted:      "var(--color-muted)",
            },
            fontFamily: {
                serif: ["var(--font-playfair-display)", "serif"],
                sans:  ["var(--font-inter)", "sans-serif"],
            },
            animation: {
                "fade-in-up": "fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            },
            keyframes: {
                fadeInUp: {
                    "0%":   { opacity: "0", transform: "translateY(16px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
            },
        },
    },
    plugins: [],
};
export default config;
