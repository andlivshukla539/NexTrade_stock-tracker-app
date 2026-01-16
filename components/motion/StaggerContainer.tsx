"use client";

import { motion } from "framer-motion";

export const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

export const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function StaggerContainer({ children, className = "" }: { children: React.ReactNode, className?: string }) {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className={className}
        >
            {children}
        </motion.div>
    );
}
