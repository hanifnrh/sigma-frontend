"use client";

import { Button } from "@/components/ui/buttons/button";
import { cn } from "@/lib/utils";
import { Forward } from "lucide-react";

interface ButtonRegisterProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { }

export default function ButtonRegister({ className, ...props }: ButtonRegisterProps) {
    return (
        <Button
            className={cn(
                "min-w-40 relative group",
                "bg-blue-100 dark:bg-blue-950",
                "hover:bg-blue-200 dark:hover:bg-blue-900",
                "text-blue-600 dark:text-blue-300",
                "border border-blue-200 dark:border-blue-800",
                "transition-all duration-300",
                className // Allow external classes to override defaults
            )}
            {...props} // Spread additional props (e.g., type="submit")
        >
            <div className="w-full flex items-center justify-center gap-2">
                <Forward className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                <span>Daftar</span>
            </div>
        </Button>
    );
}
