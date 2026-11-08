'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface ThemeContextType {
    isDark: boolean;
    toggleTheme: () => void;
    wallpaper: string;
    setWallpaper: (w: string) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [isDark, setIsDark] = useState(false);
    const [wallpaper, setWallpaper] = useState('default');

    useEffect(() => {
        const savedTheme = localStorage.getItem('knobly-theme');
        const savedWallpaper = localStorage.getItem('knobly-wallpaper');
        if (savedTheme) setIsDark(savedTheme === 'dark');
        if (savedWallpaper) setWallpaper(savedWallpaper);
    }, []);

    useEffect(() => {
        localStorage.setItem('knobly-theme', isDark ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', isDark);
        // Original uses light-mode class on body for CSS overrides
        document.body.classList.toggle('light-mode', !isDark);
    }, [isDark]);

    useEffect(() => {
        localStorage.setItem('knobly-wallpaper', wallpaper);
        // Apply wallpaper class to body like original does
        const body = document.body;
        body.className = body.className.replace(/wallpaper-\S+/g, '').trim();
        body.classList.add(`wallpaper-${wallpaper}`);
    }, [wallpaper]);

    const toggleTheme = () => setIsDark((prev) => !prev);

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme, wallpaper, setWallpaper }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within ThemeProvider');
    return context;
}
