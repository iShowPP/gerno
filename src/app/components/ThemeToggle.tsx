'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(false);
    const [mounted, setMounted] = useState(false);

    // On mount, read saved preference or system preference
    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem('gerno-theme');
        if (saved === 'dark') {
            setIsDark(true);
            document.documentElement.setAttribute('data-theme', 'dark');
        } else if (!saved) {
            // Follow OS preference if nothing saved
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                setIsDark(true);
                document.documentElement.setAttribute('data-theme', 'dark');
            }
        }
    }, []);

    const toggle = () => {
        const next = !isDark;
        setIsDark(next);
        if (next) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('gerno-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('gerno-theme', 'light');
        }
    };

    // Avoid hydration mismatch
    if (!mounted) return null;

    return (
        <button
            onClick={toggle}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="
                relative w-10 h-10 flex items-center justify-center
                rounded-full border border-border/60
                bg-paper/60 backdrop-blur-md
                text-foreground/60 hover:text-foreground
                hover:border-foreground/20 hover:bg-accent/60
                transition-all duration-300 hover:scale-105 active:scale-95
                shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)]
            "
        >
            {isDark ? (
                /* Sun icon */
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
            ) : (
                /* Moon icon */
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
            )}
        </button>
    );
}
