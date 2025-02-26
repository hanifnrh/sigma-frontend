"use client";

import ApexCharts from "apexcharts";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";

interface DataItem {
    timestamp: string;
    ammonia?: number;
    temperature?: number;
    humidity?: number;
    score?: number;
    mortalitas?: number;
    [key: string]: string | number | undefined;
}

interface AreaChartProps {
    id: string;
    color: string;
    apiUrl: string;
    dataType: keyof Omit<DataItem, "timestamp">; // Hanya mengizinkan properti numerik
}

const AreaChart: React.FC<AreaChartProps> = ({ id, color, apiUrl, dataType }) => {
    const [chartData, setChartData] = useState<{ seriesData: number[]; categories: string[] }>({
        seriesData: [],
        categories: [],
    });

    const dataTypeMapping: Record<string, string> = {
        ammonia: "Amonia",
        temperature: "Suhu",
        humidity: "Kelembapan",
        score: "Skor",
        mortalitas: "Mortalitas",
    };

    const dataTypeLabel = dataTypeMapping[dataType] || "Data";

    useEffect(() => {
        const token = getCookie("accessToken");

        const fetchData = async () => {
            try {
                const response = await fetch(apiUrl, {
                    credentials: "include",
                    headers: {
                        "Authorization": token ? `Bearer ${token}` : "",
                    }
                });
                const data: DataItem[] = await response.json();

                console.log("Fetched data:", data);

                const sortedData = data.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
                const lastFiveData = sortedData.slice(-5);

                // Pastikan nilai yang diambil adalah number
                const seriesData = lastFiveData.map((item) => (typeof item[dataType] === "number" ? item[dataType] as number : 0));
                const categories = lastFiveData.map((item) => new Date(item.timestamp).toLocaleString());

                setChartData({ seriesData, categories });
            } catch (error) {
                console.log("Data grafik kosong");
            }
        };

        fetchData();
    }, [apiUrl, dataType]);

    useEffect(() => {
        const label = dataTypeMapping[dataType] || "Data";
        const options = {
            chart: {
                maxHeight: "100%",
                maxWidth: "100%",
                type: "area",
                fontFamily: "Body Light, sans-serif",
                dropShadow: { enabled: false },
                toolbar: { show: false },
            },
            tooltip: {
                enabled: true,
                x: { show: false },
                y: {
                    formatter: (value: number) => value.toFixed(2),
                },
            },
            fill: {
                type: "gradient",
                gradient: { opacityFrom: 0.55, opacityTo: 0, shade: color, gradientToColors: [color] },
            },
            dataLabels: { enabled: false },
            stroke: { width: 6, colors: [color] },
            grid: {
                show: false,
                strokeDashArray: 4,
                padding: { left: 2, right: 2, top: 0 },
            },
            series: [
                {
                    name: label,
                    data: chartData.seriesData,
                    color: color,
                },
            ],
            xaxis: {
                categories: chartData.categories,
                labels: { show: false },
                axisBorder: { show: false },
                axisTicks: { show: false },
                title: {
                    text: "Garis horizontal menunjukkan waktu",
                    style: { fontFamily: "Body Light, sans-serif", fontWeight: "light", fontSize: "14px", color: "#333" },
                },
            },
            yaxis: {
                title: {
                    text: `Tingkat ${label}`,
                    style: { fontFamily: "Body Light, sans-serif", fontWeight: "light", fontSize: "14px", color: "#333" },
                },
                labels: { show: false },
            },
        };

        if (typeof window !== "undefined" && document.getElementById(id)) {
            const chart = new ApexCharts(document.getElementById(id), options);
            chart.render();

            return () => {
                chart.destroy();
            };
        }
    }, [id, color, chartData, dataType]);

    return <div id={id} className="h-full" />;
};

export default AreaChart;
