'use client';

import { motion } from "framer-motion";

export function BackgroundScene() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
            {/* Base gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-surface-50 via-white to-gold-50/30 dark:from-surface-950 dark:via-[#0D0D10] dark:to-surface-950" />

            {/* Grid Pattern */}
            <div
                className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
                    backgroundSize: "60px 60px",
                }}
            />

            {/* Floating Orbs */}
            <motion.div
                animate={{ y: [-20, 20, -20], rotate: [0, 3, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[15%] left-[10%] w-96 h-96 rounded-full bg-gradient-to-br from-gold-400/8 to-gold-600/4 dark:from-gold-400/[0.06] dark:to-gold-600/[0.02] blur-3xl"
            />
            <motion.div
                animate={{ y: [15, -15, 15], rotate: [0, -2, 0] }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[20%] right-[5%] w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-gold-300/6 to-amber-400/3 dark:from-gold-400/[0.04] dark:to-amber-500/[0.02] blur-3xl"
            />
            <motion.div
                animate={{ y: [10, -25, 10] }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[50%] left-[40%] w-80 h-80 rounded-full bg-gradient-to-r from-gold-200/5 to-transparent dark:from-gold-500/[0.03] dark:to-transparent blur-3xl"
            />

            {/* Radial vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.02)_70%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_70%)]" />

            {/* Decorative chart line */}
            <svg className="absolute bottom-0 left-0 w-full h-48 opacity-[0.04] dark:opacity-[0.06]" viewBox="0 0 1440 200" fill="none">
                <path
                    d="M0 160 C120 140 240 80 360 100 C480 120 600 40 720 60 C840 80 960 20 1080 50 C1200 80 1320 30 1440 40"
                    stroke="url(#chartGrad)"
                    strokeWidth="2"
                    fill="none"
                />
                <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#E8C547" stopOpacity="0" />
                        <stop offset="30%" stopColor="#E8C547" stopOpacity="1" />
                        <stop offset="70%" stopColor="#E8C547" stopOpacity="1" />
                        <stop offset="100%" stopColor="#E8C547" stopOpacity="0" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
}
