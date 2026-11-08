'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const TEXT = "KNOBLY";

export default function BootScreen({ onComplete }: { onComplete: () => void }) {

    const letters = TEXT.split("");

    const [visibleLetters, setVisibleLetters] = useState(0);
    const [progress, setProgress] = useState(0);
    const [exit, setExit] = useState(false);
    const [isDark, setIsDark] = useState(true);
    const [textDone, setTextDone] = useState(false);
    const [startLoader, setStartLoader] = useState(false);

    /* =========================
       THEME SYNC
    ========================= */

    useEffect(() => {
        const checkTheme = () => {
            setIsDark(document.documentElement.classList.contains("dark"));
        };

        checkTheme();

        const observer = new MutationObserver(checkTheme);

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);

    /* =========================
       TEXT ANIMATION
    ========================= */

    useEffect(() => {
        const timers: any[] = [];

        timers.push(
            setTimeout(() => {
                letters.forEach((_, i) => {
                    timers.push(
                        setTimeout(() => {
                            setVisibleLetters(i + 1);

                            if (i === letters.length - 1) {
                                setTextDone(true);

                                setTimeout(() => {
                                    setStartLoader(true);
                                }, 1000); // pause
                            }

                        }, i * 150)
                    );
                });
            }, 300)
        );

        return () => timers.forEach(clearTimeout);
    }, []);

    /* =========================
       SMOOTH LOADER
    ========================= */

    useEffect(() => {
        if (!startLoader) return;

        let value = 0;

        const interval = setInterval(() => {
            value += 2.2;

            if (value > 100) value = 100;

            setProgress(Math.floor(value));

            if (value >= 100) {
                clearInterval(interval);

                setTimeout(() => {
                    setExit(true);
                    setTimeout(onComplete, 700);
                }, 400);
            }

        }, 30);

        return () => clearInterval(interval);
    }, [startLoader, onComplete]);

    /* =========================
       COLORS
    ========================= */

    const bg = isDark ? "#000000" : "#ffffff";
    const text = isDark ? "#ffffff" : "#000000";
    const barBg = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
    const barFill = isDark ? "#ffffff" : "#000000";

    return (
        <motion.div
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
            style={{ backgroundColor: bg }}
            animate={
                exit
                    ? { opacity: 0, scale: 1.02, filter: "blur(8px)" }
                    : { opacity: 1 }
            }
            transition={{ duration: 1 }}
        >

            {/* =========================
         TEXT (BOLDER)
      ========================= */}

            <motion.div
                className="flex mb-14"
                animate={
                    textDone
                        ? { letterSpacing: "0.18em", scale: 1.02 }
                        : { letterSpacing: "0.12em", scale: 1 }
                }
                transition={{ duration: 0.6 }}
            >

                {letters.map((letter, i) => {
                    const visible = i < visibleLetters;

                    return (
                        <motion.span
                            key={i}
                            style={{
                                color: text,
                                fontSize: "clamp(3rem, 10vw, 6rem)",
                            }}
                            className="font-bold" // 🔥 bold
                            initial={{ opacity: 0, y: 40 }}
                            animate={visible ? { opacity: 1, y: 0 } : {}}
                            transition={{
                                duration: 0.6,
                                ease: [0.16, 1, 0.3, 1],
                            }}
                        >
                            {letter}
                        </motion.span>
                    );
                })}

            </motion.div>

            {/* =========================
         LOADER (STYLISH)
      ========================= */}

            {startLoader && (
                <>
                    <div
                        className="relative w-64 h-[4px] rounded-full overflow-hidden"
                        style={{ backgroundColor: barBg }}
                    >

                        {/* glow background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-20" />

                        {/* progress fill */}
                        <motion.div
                            className="h-full relative"
                            style={{
                                background: `linear-gradient(90deg, ${barFill}, ${barFill})`,
                                boxShadow: isDark
                                    ? "0 0 12px rgba(255,255,255,0.4)"
                                    : "0 0 8px rgba(0,0,0,0.2)",
                            }}
                            animate={{ width: `${progress}%` }}
                            transition={{ ease: "linear" }}
                        />

                    </div>

                    <motion.div
                        className="mt-5 text-[10px] font-mono tracking-[0.25em]"
                        style={{ color: text + "66" }}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        {progress}%
                    </motion.div>
                </>
            )}

        </motion.div>
    );
}