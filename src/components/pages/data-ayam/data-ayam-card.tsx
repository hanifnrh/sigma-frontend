import React from "react";

interface DataAyamProps {
    title: string;
    label: string;
    value: string | number;
    icon: React.ReactNode;
    statusColor?: string;
    warning?: string;
}

const DataAyam: React.FC<DataAyamProps> = ({ title, label, value, icon, statusColor, warning }) => (
    <div>
        <div className="navbar-title font-bold text-xs sm:text-sm mb-2">
            {title}
        </div>
        <div className="h-44 relative flex flex-grow flex-col items-center justify-center rounded-[10px] border-[1px] border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-7">
            <div className="flex items-center">
                <div className="flex h-[90px] w-auto items-center">
                    <div className="rounded-full bg-lightPrimary dark:bg-navy-700">
                        <span className="flex items-center text-brand-500 dark:text-white text-4xl">
                            {icon}
                        </span>
                    </div>
                </div>
                <div className="ml-4 flex flex-col justify-center">
                    <p className="font-dm text-xl font-semibold text-gray-600 dark:text-white">{label}</p>
                    <h4 className={`text-3xl font-bold ${statusColor}`}>{value}</h4>
                </div>
            </div>
            {warning && <p className={`${statusColor} text-sm text-center`}>{warning}</p>}
        </div>
    </div>
);

export default DataAyam;
