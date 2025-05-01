"use client";
import dynamic from "next/dynamic";

const ParameterChart = dynamic(() => import("@/components/pages/grafik-parameter/parameter-chart"), { ssr: false });

const tailwindColorMap: { [key: string]: string } = {
    "text-green-500": "#22C55E",
    "text-blue-500": "#3B82F6",
    "text-yellow-500": "#FACC15",
    "text-red-500": "#EF4444",
};

interface GrafikParameterCardProps {
    title: string;
    value: number;
    statusColor: string;
    statusText: string;
    chartId: string;
    apiUrl: string;
    dataType: string;
    lantai: number;
    durasi: string;
}

export default function GrafikParameterCard({
    title,
    value,
    statusColor,
    statusText,
    chartId,
    apiUrl,
    dataType,
    lantai,
    durasi,
}: GrafikParameterCardProps) {
    const chartColor = tailwindColorMap[statusColor] || "#28A745";
    let unit = "";
    if (dataType === "ammonia") {
        unit = "ppm";
    } else if (dataType === "humidity") {
        unit = "%";
    } else if (dataType === "temperature") {
        unit = "°C";
    } else if (dataType === "score") {
        unit = ""; // Tidak ada satuan untuk keseluruhan
    }
    return (
        <main className="p-6 bg-white dark:bg-zinc-900 border rounded-lg w-full">
            <div className="w-full bg-white rounded-lg dark:bg-zinc-900">
                <div className="flex justify-between">
                    <div>
                        <p className="text-base font-normal text-gray-500 dark:text-gray-400">{title}</p>
                        <h5 className={`leading-none text-3xl body-bold ${statusColor} pb-2`}>
                            {value ? `${value.toFixed(1)} ${unit}` : "—"}
                        </h5>
                    </div>
                    <div className={`flex items-center px-2.5 py-0.5 text-base body ${statusColor} text-center`}>
                        {statusText}
                    </div>
                </div>
            </div>
            <div className="min-h-[250px]">
                <ParameterChart
                    id={chartId}
                    color={chartColor}
                    apiUrl={apiUrl}
                    dataType={dataType}
                    lantai={lantai}
                    durasi={durasi}
                />
            </div>
        </main>
    );
}
