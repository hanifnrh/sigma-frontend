"use client";
import dynamic from "next/dynamic";
import { useState } from "react";

const AreaChart = dynamic(() => import('@/components/pages/grafik-total/area-chart'), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-gray-100 dark:bg-zinc-900 rounded-md animate-pulse" />,
});

const tailwindColorMap: { [key: string]: string } = {
    "text-green-500": "#22C55E",
    "text-blue-500": "#3B82F6",
    "text-yellow-500": "#FACC15",
    "text-red-500": "#EF4444",
};

interface GrafikCardProps {
    title: string;
    value: number;
    statusColor: string;
    statusText: string;
    chartId: string;
    apiUrl: string;
    dataType: string;
}

export default function GrafikCard({
    title,
    value,
    statusColor,
    statusText,
    chartId,
    apiUrl,
    dataType,
}: GrafikCardProps) {
    const chartColor = tailwindColorMap[statusColor] || "#28A745";
    const [chartLoaded, setChartLoaded] = useState(false)

    let unit = "";
    if (dataType === "ammonia") {
        unit = "ppm";
    } else if (dataType === "humidity") {
        unit = "%";
    } else if (dataType === "temperature") {
        unit = "°C";
    } else if (dataType === "mortalitas") {
        unit = "%";
    } else if (dataType === "score") {
        unit = "";
    }
    return (
        <main className="p-6 bg-white dark:bg-zinc-950 border rounded-lg w-full">
            <div className="w-full bg-white rounded-lg dark:bg-zinc-950">
                <div className="flex justify-between">
                    <div>
                        <p className="text-base font-semibold text-gray-500 dark:text-gray-400">{title}</p>
                        <h5 className={`leading-none text-3xl font-bold ${statusColor} pb-2`}>{value.toFixed(1)} {unit}</h5>
                    </div>
                    <div className={`flex items-center px-2.5 py-0.5 text-base font-semibold ${statusColor} text-center`}>
                        {statusText}
                    </div>
                </div>
            </div>
            <AreaChart
                id={chartId}
                color={chartColor}
                apiUrl={apiUrl}
                dataType={dataType}
                onLoaded={() => setChartLoaded(true)}
            />
        </main>
    );
}
