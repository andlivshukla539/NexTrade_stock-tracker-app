"use client";

import React, { ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string; // Optional extra class names
}

export default function AnimatedSection({
  children,
  className = "",
}: AnimatedSectionProps) {
  return (
    <section className={`grid w-full gap-8 home-section ${className}`}>
      {React.Children.map(children, (child, i) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<React.HTMLAttributes<HTMLElement>>, { key: i });
        }
        return child;
      })}
    </section>
  );
}
