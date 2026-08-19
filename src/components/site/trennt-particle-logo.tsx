"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/components/site/reveal";

interface Particle {
    id: number;
    targetX: number;
    targetY: number;
    startX: number;
    startY: number;
    delay: number;
    size: number;
}

// Generate point coordinates outlining TRENNT in a 400x120 SVG viewport grid
const LOGO_POINTS: [number, number][] = [
    // Letter T
    [20, 25], [35, 25], [50, 25], [65, 25], [80, 25],
    [50, 40], [50, 55], [50, 70], [50, 85], [50, 100],

    // Letter R
    [95, 25], [95, 40], [95, 55], [95, 70], [95, 85], [95, 100],
    [110, 25], [125, 25], [135, 35], [135, 50], [125, 60], [110, 60],
    [115, 75], [125, 88], [135, 100],

    // Letter E
    [150, 25], [150, 40], [150, 55], [150, 70], [150, 85], [150, 100],
    [165, 25], [180, 25], [190, 25],
    [165, 60], [180, 60],
    [165, 100], [180, 100], [190, 100],

    // Letter N (First)
    [205, 25], [205, 40], [205, 55], [205, 70], [205, 85], [205, 100],
    [217, 45], [228, 65], [238, 85],
    [250, 25], [250, 40], [250, 55], [250, 70], [250, 85], [250, 100],

    // Letter N (Second)
    [265, 25], [265, 40], [265, 55], [265, 70], [265, 85], [265, 100],
    [277, 45], [288, 65], [298, 85],
    [310, 25], [310, 40], [310, 55], [310, 70], [310, 85], [310, 100],

    // Letter T (Second)
    [325, 25], [340, 25], [355, 25], [370, 25], [385, 25],
    [355, 40], [355, 55], [355, 70], [355, 85], [355, 100],
];

const emptySubscribe = () => () => { };

export function TrenntParticleLogo({ className }: { className?: string }) {
    const reduced = useReducedMotion();
    const mounted = React.useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false
    );

    // Generate deterministic particles with integer starting offsets
    const particles = React.useMemo<Particle[]>(() => {
        return LOGO_POINTS.map(([x, y], idx) => {
            // Integer deterministic pseudorandom scatter generator
            const seed1 = Math.sin(idx + 1) * 10000;
            const seed2 = Math.cos(idx + 1) * 10000;
            const randX = Math.round((seed1 - Math.floor(seed1)) * 140 - 70);
            const randY = Math.round((seed2 - Math.floor(seed2)) * 140 - 70);
            const delay = Math.round(((idx * 37) % 400)) / 1000;

            return {
                id: idx,
                targetX: x,
                targetY: y,
                startX: x + randX,
                startY: y + randY,
                delay,
                size: idx % 3 === 0 ? 4.8 : 3.6,
            };
        });
    }, []);

    if (!mounted) {
        return <div className={`relative w-full max-w-[420px] aspect-[400/120] ${className || ""}`} />;
    }

    return (
        <div className={`relative w-full max-w-[420px] aspect-[400/120] ${className || ""}`}>
            <svg
                viewBox="0 0 400 125"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full overflow-visible"
            >
                {/* Ambient Subtle Solid Fill Reveal After Convergence */}
                <motion.text
                    x="200"
                    y="102"
                    textAnchor="middle"
                    fontSize="92"
                    fontWeight="900"
                    letterSpacing="0.08em"
                    className="font-sans select-none"
                    fill="#00313C"
                    initial={reduced ? { opacity: 0.15 } : { opacity: 0 }}
                    whileInView={reduced ? { opacity: 0.15 } : { opacity: 0.18 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 1, delay: reduced ? 0 : 0.7 }}
                >
                    TRENNT
                </motion.text>

                {/* Converging Elongated Particles */}
                {particles.map((p) => (
                    <motion.rect
                        key={p.id}
                        width={p.id % 3 === 0 ? 4.2 : 3.2}
                        height={p.id % 3 === 0 ? 8.5 : 6.5}
                        rx="2"
                        fill={p.id % 2 === 0 ? "#00313C" : "#005A58"}
                        initial={
                            reduced
                                ? { x: p.targetX - 2, y: p.targetY - 4, opacity: 0.7 }
                                : { x: p.startX - 2, y: p.startY - 4, opacity: 0, scale: 0.4 }
                        }
                        whileInView={
                            reduced
                                ? { x: p.targetX - 2, y: p.targetY - 4, opacity: 0.7 }
                                : { x: p.targetX - 2, y: p.targetY - 4, opacity: 0.85, scale: 1 }
                        }
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{
                            duration: reduced ? 0 : 0.75,
                            delay: reduced ? 0 : p.delay,
                            ease: [0.16, 1, 0.3, 1],
                        }}
                    />
                ))}
            </svg>
        </div>
    );
}
