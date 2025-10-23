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
      {React.Children.map(children, (child, i) => (
        <div key={i}>{child}</div>
      ))}
    </section>
  );
}
