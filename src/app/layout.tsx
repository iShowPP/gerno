import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import ThemeToggle from "./components/ThemeToggle";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair-display", display: "swap" });

export const metadata: Metadata = {
    title: "Gerno | A Shared Memory Ritual",
    description: "A premium minimalist shared journaling platform for tight-knit circles.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
            {/* Prevent flash of wrong theme on page load */}
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function(){
                                try {
                                    var t = localStorage.getItem('gerno-theme');
                                    if (t === 'dark') {
                                        document.documentElement.setAttribute('data-theme', 'dark');
                                    } else if (!t && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                                        document.documentElement.setAttribute('data-theme', 'dark');
                                    }
                                } catch(e) {}
                            })();
                        `,
                    }}
                />
            </head>
            <body className="font-sans min-h-screen relative">
                {/* Floating theme toggle — always visible */}
                <div className="fixed bottom-6 right-6 z-[9999]">
                    <ThemeToggle />
                </div>
                {children}
            </body>
        </html>
    );
}
