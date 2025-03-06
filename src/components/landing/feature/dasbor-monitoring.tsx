"use client";

import { cn } from "@/lib/utils";
import Image from 'next/image';
import React, { forwardRef, useRef } from "react";
import { FaTemperatureHigh } from "react-icons/fa";
import { IoWater } from "react-icons/io5";
import { TbAtom2Filled } from "react-icons/tb";
import { AnimatedBeam } from "../../ui/animated-beam";

const Circle = forwardRef<
    HTMLDivElement,
    { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                "z-10 flex size-12 items-center justify-center rounded-full border border-indigo-100 bg-white p-3 shadow-[0_0_20px_-12px_rgba(67,56,202,0.8)]",
                className,
            )}
        >
            {children}
        </div>
    );
});

Circle.displayName = "Circle";

export function DasborMonitoring({
    className,
}: {
    className?: string;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const div2Ref = useRef<HTMLDivElement>(null);
    const div3Ref = useRef<HTMLDivElement>(null);
    const div4Ref = useRef<HTMLDivElement>(null);
    const div6Ref = useRef<HTMLDivElement>(null);
    const div7Ref = useRef<HTMLDivElement>(null);

    return (
        <div
            className={cn(
                "relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl border-2 border-indigo-700/40 bg-white shadow-lg shadow-indigo-200 p-10",
                className,
            )}
            ref={containerRef}
        >
            <div className="flex size-full flex-row items-stretch justify-between gap-10 max-w-lg text-indigo-700">
                <div className="flex flex-col justify-center gap-2">
                    <Circle ref={div2Ref}>
                        <TbAtom2Filled />
                    </Circle>
                    <Circle ref={div3Ref}>
                        <IoWater />
                    </Circle>
                    <Circle ref={div4Ref}>
                        <FaTemperatureHigh />
                    </Circle>
                </div>
                <div className="flex flex-col justify-center">
                    <Circle ref={div6Ref} className="size-16">
                        <Image
                            src="/sigmalogonobg.png"
                            width={500}
                            height={500}
                            alt="Sigma Logo"
                        />
                    </Circle>
                </div>
                <div className="flex flex-col justify-center">
                    <Circle ref={div7Ref}>
                        <Icons.user />
                    </Circle>
                </div>
            </div>
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div2Ref}
                toRef={div6Ref}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div3Ref}
                toRef={div6Ref}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div4Ref}
                toRef={div6Ref}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div6Ref}
                toRef={div7Ref}
            />
        </div>
    );
}

const Icons = {
    user: () => (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgb(29 78 216)"
            strokeWidth="2"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    ),
};
