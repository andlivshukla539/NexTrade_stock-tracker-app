"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

// Dynamically import the 3D component (desktop only)
const StockOrb = dynamic(() => import("./StockOrb"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[400px] md:h-[600px] flex items-center justify-center">
            <div className="animate-pulse text-gray-400">Loading...</div>
        </div>
    ),
});

// Fallback gradient for mobile
function MobileFallback() {
    return (
        <div className="w-full h-[400px] relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/20 via-neon-green/20 to-neon-yellow/20 animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 rounded-full bg-gradient-to-br from-[#2AFF9D] via-[#38BDF8] to-[#FACC15] opacity-30 blur-3xl" />
            </div>
        </div>
    );
}

export default function StockOrbLoader() {
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        // Check if desktop
        const checkDesktop = () => {
            const desktop = window.innerWidth >= 1024;
            setIsDesktop(desktop);
        };

        checkDesktop();
        window.addEventListener("resize", checkDesktop);

        return () => window.removeEventListener("resize", checkDesktop);
    }, []);

    return isDesktop ? <StockOrb /> : <MobileFallback />;
}

