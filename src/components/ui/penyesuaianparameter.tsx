import FlickeringGrid from "@/components/ui/flickering-grid";
import { cn } from "@/lib/utils";
import React, { forwardRef } from "react";
import { TbAtom2Filled } from "react-icons/tb";

const Circle = forwardRef<
    HTMLDivElement,
    { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                "z-10 flex size-12 items-center justify-center rounded-full border border-red-200 bg-white p-3 shadow-[0_0_20px_-12px_rgba(185,28,28,0.8)]",
                className,
            )}
        >
            {children}
        </div>
    );
});

export function PenyesuaianParameter() {
    return (
        <div className="relative h-full rounded-xl w-full bg-background border-2 border-red-300 overflow-hidden flex items-center justify-center shadow-lg shadow-red-200">
            <FlickeringGrid
                className="z-0 absolute inset-0 size-full"
                squareSize={4}
                gridGap={6}
                color="red"
                maxOpacity={0.5}
                flickerChance={0.1}
                height={800}
                width={800}
            />
            <Circle className="size-16 text-red-700">
                <TbAtom2Filled size={100} />
            </Circle>
        </div>
    );
}
