"use client";

import ApexCharts from "apexcharts";
import { getCookie, setCookie } from "cookies-next";
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
    dataType: keyof Omit<DataItem, "timestamp">;
}

const AreaChart: React.FC<AreaChartProps> = ({ id, color, apiUrl, dataType }) => {
    const [chartData, setChartData] = useState<{ seriesData: number[]; categories: string[] }>({
        seriesData: [],
        categories: [],
    });

    const dataTypeMapping: Record<string, string> = {
        score: "skor dalam satuan",
    };

    const dataTypeLabel = dataTypeMapping[dataType] || "Data";

    const fetchAccessToken = async () => {
        try {
            const response = await fetch("/api/refresh", {
                method: "POST",
                credentials: "include", // 🛠️ Pastikan cookies dikirim!
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to refresh token.");
            }

            return data.accessToken;
        } catch (error) {
            console.error("Error refreshing token:", error);
            return null;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                let token = getCookie("accessToken");

                // Jika token tidak ada atau kadaluarsa, refresh token
                if (!token) {
                    token = await fetchAccessToken();
                    if (!token) throw new Error("Failed to obtain new access token.");
                    setCookie("accessToken", token, { path: "/" });
                }

                const response = await fetch(apiUrl, {
                    credentials: "include",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    }
                });

                // Jika token kadaluarsa, coba refresh token dan ulangi request
                if (response.status === 401) {
                    const newToken = await fetchAccessToken();
                    if (!newToken) throw new Error("Failed to refresh token.");

                    setCookie("accessToken", newToken, { path: "/" });

                    const newResponse = await fetch(apiUrl, {
                        credentials: "include",
                        headers: {
                            "Authorization": `Bearer ${newToken}`,
                        }
                    });

                    if (!newResponse.ok) {
                        throw new Error(`HTTP error! Status: ${newResponse.status}`);
                    }

                    const newData: DataItem[] = await newResponse.json();
                    processChartData(newData);
                    return;
                }

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data: DataItem[] = await response.json();
                processChartData(data);
            } catch (error) {
                console.log("Error fetching chart data:", error);
            }
        };

        const processChartData = (data: DataItem[]) => {
            console.log("Fetched data:", data);

            const sortedData = data.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

            // Pastikan nilai yang diambil adalah number
            const seriesData = sortedData.map((item) => (typeof item[dataType] === "number" ? item[dataType] as number : 0));
            const categories = sortedData.map((item) => new Date(item.timestamp).toLocaleString());

            setChartData({ seriesData, categories });
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
            stroke: { width: 4, colors: [color] },
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
                    text: "Garis horizontal menunjukkan waktu tiap 5 menit",
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
