"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
    const [isMounted, setIsMounted] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(true);
    
    // Position of the mouse
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth physics-based trailing cursor
    const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    useEffect(() => {
        setIsMounted(true);
        setIsMobile(window.innerWidth < 768);

        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);

        const updateMousePosition = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseEnter = () => setIsVisible(true);

        window.addEventListener("mousemove", updateMousePosition);
        document.body.addEventListener("mouseleave", handleMouseLeave);
        document.body.addEventListener("mouseenter", handleMouseEnter);

        if (window.innerWidth >= 768) {
            document.documentElement.classList.add('custom-cursor-active');
        }

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", updateMousePosition);
            document.body.removeEventListener("mouseleave", handleMouseLeave);
            document.body.removeEventListener("mouseenter", handleMouseEnter);
            document.documentElement.classList.remove('custom-cursor-active');
        };
    }, [mouseX, mouseY, isVisible]);

    // To prevent hydration mismatch, return null on server AND on first client render.
    if (!isMounted || isMobile) return null;

    return (
        <>
            <motion.div
                className="pointer-events-none fixed z-[9999] rounded-full border border-emerald-400/50 bg-emerald-400/10 mix-blend-screen"
                style={{
                    x: cursorX,
                    y: cursorY,
                    width: 32,
                    height: 32,
                    translateX: "-50%",
                    translateY: "-50%",
                    opacity: isVisible ? 1 : 0,
                    transition: "opacity 0.2s"
                }}
            />
            <motion.div
                className="pointer-events-none fixed z-[10000] rounded-full bg-emerald-400"
                style={{
                    x: mouseX,
                    y: mouseY,
                    width: 6,
                    height: 6,
                    translateX: "-50%",
                    translateY: "-50%",
                    opacity: isVisible ? 1 : 0,
                    transition: "opacity 0.1s"
                }}
            />
        </>
    );
}