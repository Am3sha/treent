"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/components/site/reveal";

interface Particle {
    id: number;
    targetX: number;
    targetY: number;
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

    const particles = React.useMemo<Particle[]>(() => {
        return LOGO_POINTS.map(([x, y], idx) => ({
            id: idx,
            targetX: x,
            targetY: y,
        }));
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
                {/* Ambient Subtle Solid Fill Reveal */}
                <motion.text
                    x="200"
                    y="102"
                    textAnchor="middle"
                    fontSize="92"
                    fontWeight="900"
                    letterSpacing="0.08em"
                    className="font-sans select-none"
                    fill="#013D3E"
                    initial={reduced ? { opacity: 0.15 } : { opacity: 0 }}
                    whileInView={reduced ? { opacity: 0.15 } : { opacity: 0.18 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 1, delay: reduced ? 0 : 0.2 }}
                >
                    TRENNT
                </motion.text>

                {/* Composited Single Observer Particle Group */}
                <motion.g
                    initial={reduced ? { opacity: 0.7 } : { opacity: 0, scale: 0.96 }}
                    whileInView={reduced ? { opacity: 0.7 } : { opacity: 0.85, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{
                        duration: reduced ? 0 : 0.75,
                        ease: [0.16, 1, 0.3, 1],
                    }}
                >
                    {particles.map((p) => (
                        <rect
                            key={p.id}
                            x={p.targetX - 2}
                            y={p.targetY - 4}
                            width={p.id % 3 === 0 ? 4.2 : 3.2}
                            height={p.id % 3 === 0 ? 8.5 : 6.5}
                            rx="2"
                            fill={p.id % 2 === 0 ? "#013D3E" : "#005A58"}
                        />
                    ))}
                </motion.g>
            </svg>
        </div>
    );
}
