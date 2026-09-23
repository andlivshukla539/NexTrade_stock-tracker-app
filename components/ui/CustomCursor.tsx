"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// The actual cursor implementation with framer-motion
const AnimatedCursor = dynamic(() => import("./AnimatedCursor"), { ssr: false });

export default function CustomCursor() {
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return <AnimatedCursor />;
}