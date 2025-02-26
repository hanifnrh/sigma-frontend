"use client";

import { motion } from "framer-motion";

const Dynamic = () => {
    const circles = Array.from({ length: 4 });

    return (
        <div className="relative h-10 w-10 overflow-hidden rounded-lg">
            <div className="absolute z-10 flex h-full w-full items-end justify-center gap-x-[3px] p-2 bg-blend-difference">
                {circles.map((_, index) => (
                    <motion.div
                        key={index}
                        animate={{
                            height: [6, 16, 6],
                            backgroundColor: ["white", "white", "white"],
                        }}
                        transition={{
                            duration: 1.2,
                            delay: (1.2 / 3) * index,
                            repeat: Infinity,
                            ease: "easeOut",
                        }}
                        className="w-1.5 shrink-0 rounded-full"
                    />
                ))}
            </div>
        </div>
    );
};

export default Dynamic;
