"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

export default function AnimatedCounter({ value, prefix = "", className = "" }: { value: number, prefix?: string, className?: string }) {
    const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
    const display = useTransform(spring, (current) =>
        `${prefix}${current.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    );

    useEffect(() => {
        spring.set(value);
    }, [spring, value]);

    return <motion.span className={className}>{display}</motion.span>;
}
