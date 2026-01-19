import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
    hover?: boolean;
}

export default function GlassCard({
    children,
    className,
    hover = true,
    ...props
}: GlassCardProps) {
    return (
        <div
            className={cn(
                "glass-card",
                hover &&
                "transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
