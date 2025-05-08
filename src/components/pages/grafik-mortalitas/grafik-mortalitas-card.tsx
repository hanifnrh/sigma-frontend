"use client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";

const MortalitasChart = dynamic(() => import('@/components/pages/grafik-mortalitas/mortalitas-chart'), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-gray-100 rounded-md animate-pulse" />,
});

const tailwindColorMap: { [key: string]: string } = {
    "text-green-500": "#22C55E",
    "text-blue-500": "#3B82F6",
    "text-yellow-500": "#FACC15",
    "text-red-500": "#EF4444",
};

interface GrafikMortalitasCardProps {
    title: string;
    value: number;
    statusColor: string;
    statusText: string;
    chartId: string;
    dataType: string;
    ayamId: number;
}

const durationMap: Record<string, string> = {
    "30 Menit": "30m",
    "1 Jam": "1h",
    "1 Hari": "1d",
    "1 Minggu": "1w",
    "1 Bulan": "1mo",
    "Semua": "all"
};

export default function GrafikMortalitasCard({
    title,
    value,
    statusColor,
    statusText,
    chartId,
    dataType,
    ayamId,
}: GrafikMortalitasCardProps) {
    const [selectedDurasi, setSelectedDurasi] = useState("Semua");
    const [apiUrl, setApiUrl] = useState("");
    const [chartLoaded, setChartLoaded] = useState(false)

    const chartColor = tailwindColorMap[statusColor] || "#28A745";
    const unit = dataType === "mortalitas" ? "%" : "";

    useEffect(() => {
        const url =
            selectedDurasi === "Semua"
                ? `https://sigma-backend-production.up.railway.app/api/data-ayam/${ayamId}/history/`
                : `https://sigma-backend-production.up.railway.app/api/data-ayam/${ayamId}/history/?time_range=${durationMap[selectedDurasi]}`;
        setApiUrl(url);
    }, [selectedDurasi, ayamId]);

    const handleDurasiChange = (key: string) => {
        setSelectedDurasi(key);
    };

    return (
        <main className="p-6 bg-white dark:bg-zinc-950 border rounded-lg w-full">
            <div className="w-full bg-white rounded-lg dark:bg-zinc-950">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-base font-semibold text-gray-500 dark:text-gray-400">{title}</p>
                        <h5 className={`leading-none text-3xl font-bold ${statusColor} pb-2`}>
                            {value.toFixed(2)} {unit}
                        </h5>
                        <p className={`flex items-center py-0.5 text-base font-semibold ${statusColor} text-center`}>
                            {statusText}
                        </p>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger className='border p-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'>
                            {selectedDurasi}
                            <RiArrowDropDownLine className="dark:text-white text-center text-2xl" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className='font-semibold'>
                            <DropdownMenuSeparator />
                            {Object.keys(durationMap).map((key) => (
                                <DropdownMenuItem key={key} onClick={() => handleDurasiChange(key)}>
                                    {key}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <MortalitasChart
                id={chartId}
                color={chartColor}
                apiUrl={apiUrl}
                dataType="mortalitas"
                onLoaded={() => setChartLoaded(true)}
            />
        </main>
    );
}
