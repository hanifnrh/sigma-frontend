import { cn } from "@/lib/utils";
import React, { useState } from "react";

interface StatCardProps {
    label: string;
    value: string | number;
    unit: string
    icon: React.ReactNode;
    statusColor?: string;
    warning?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, unit, icon, statusColor, warning }) => {
    const [isHovering, setIsHovering] = useState<string | null>(null);
    const colorMap: Record<string, string> = {
        "text-red-500": "border-red-500",
        "text-green-500": "border-green-500",
        "text-blue-500": "border-blue-500",
        "text-yellow-500": "border-yellow-500",
    };
    const borderClass = statusColor && colorMap[statusColor] ? colorMap[statusColor] : "border-gray-500";

    return (
        <div className="w-full grid grid-cols-1 gap-4 items-center justify-center">
            <div
                className="relative flex flex-col items-center"
                onMouseEnter={() => setIsHovering(label)}
                onMouseLeave={() => setIsHovering(null)}
            >
                <div className="relative w-32 h-32">
                    <div className="absolute inset-0 z-0 rounded-full border-4 border-zinc-200 dark:border-zinc-800/50" />
                    <div
                        className={cn(
                            "absolute inset-0 rounded-full border-4 transition-all duration-500",
                            borderClass,
                            isHovering === label && "scale-105"
                        )}
                        style={{
                            clipPath: `polygon(0 0, 100% 0, 100% ${Number(value) || 0}%, 0 ${Number(value) || 0}%)`
                        }}
                    />

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-2xl font-bold ${statusColor}`}>{value}</span>
                        <span className="text-sm text-zinc-500 dark:text-zinc-400">{unit}</span>
                    </div>
                </div>
                <span className="mt-3 text-base font-medium text-zinc-700 dark:text-zinc-300">{label}</span>
                {warning && <p className={`${statusColor} text-base text-center`}>{warning}</p>}
            </div>
        </div>
    );
};

export default StatCard;