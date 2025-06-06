import { cn } from "@/lib/utils";

const StatusIndicator = ({
    children = "Status",
    status = "error",
    className,
}: {
    children?: React.ReactNode;
    status?: "success" | "warning" | "error" | "info";
    className?: string;
}) => {
    const backgroundColors = {
        success: "bg-green-500",
        warning: "bg-yellow-500",
        error: "bg-red-500",
        info: "bg-blue-500",
    };

    const textColors = {
        success: "text-green-800 dark:text-green-400",
        warning: "text-yellow-800 dark:text-yellow-400",
        error: "text-red-800 dark:text-red-400",
        info: "text-blue-800 dark:text-blue-400",
    };

    const backgroundClass = backgroundColors[status];
    const textClass = textColors[status];

    return (
        <div
            className={cn(
                "font-semibold relative flex items-center gap-x-2.5 px-6 py-3 cursor-pointer",
                textClass,
                className
            )}
        >
            <div
                className={cn(
                    "h-3 w-3 animate-ping rounded-full",
                    backgroundClass
                )}
            />
            <div
                className={cn(
                    "absolute left-6 h-3 w-3 rounded-full",
                    backgroundClass
                )}
            />
            <span>{children}</span>
        </div>
    );
};

export default StatusIndicator;
