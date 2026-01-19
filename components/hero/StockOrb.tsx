"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere } from "@react-three/drei";
import { Mesh } from "three";

function AnimatedOrb() {
    const meshRef = useRef<Mesh>(null);
    const mousePosition = useRef({ x: 0, y: 0 });

    // Track mouse movement
    if (typeof window !== "undefined") {
        window.addEventListener("mousemove", (e) => {
            mousePosition.current = {
                x: (e.clientX / window.innerWidth) * 2 - 1,
                y: -(e.clientY / window.innerHeight) * 2 + 1,
            };
        });
    }

    useFrame((state) => {
        if (!meshRef.current) return;

        const time = state.clock.getElapsedTime();

        // Rotate based on time
        meshRef.current.rotation.x = time * 0.2;
        meshRef.current.rotation.y = time * 0.3;

        // Tilt based on mouse
        meshRef.current.rotation.z = mousePosition.current.x * 0.1;
    });

    // Mock sentiment color (can be replaced with real data)
    const sentimentColor = useMemo(() => {
        const sentiment = Math.random();
        if (sentiment > 0.6) return "#2AFF9D"; // Green (bullish)
        if (sentiment < 0.4) return "#EF4444"; // Red (bearish)
        return "#38BDF8"; // Blue (neutral)
    }, []);

    return (
        <Sphere ref={meshRef} args={[1, 64, 64]}>
            <MeshDistortMaterial
                color={sentimentColor}
                attach="material"
                distort={0.4}
                speed={1.5}
                roughness={0.2}
                metalness={0.8}
            />
        </Sphere>
    );
}

export default function StockOrb() {
    return (
        <div className="w-full h-[400px] md:h-[600px]">
            <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />
                <AnimatedOrb />
            </Canvas>
        </div>
    );
}
