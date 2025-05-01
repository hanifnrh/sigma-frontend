"use client";

import { getCookie, setCookie } from "cookies-next";
import { useEffect, useState } from "react";
import Chart from "react-apexcharts";

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
    onLoaded?: () => void;
}

const dataTypeMapping: Record<string, string> = {
    score: "skor dalam satuan",
    ammonia: "amonia dalam ppm",
    temperature: "suhu dalam °C",
    humidity: "kelembapan dalam %",
    mortalitas: "mortalitas dalam %",
};

const AreaChart: React.FC<AreaChartProps> = ({ id, color, apiUrl, dataType, onLoaded }) => {
    const [seriesData, setSeriesData] = useState<number[]>([]);
    const [categories, setCategories] = useState<string[]>([]);

    const dataTypeLabel = dataTypeMapping[dataType] || "Data";

    const fetchAccessToken = async () => {
        try {
            const response = await fetch("/api/refresh", {
                method: "POST",
                credentials: "include",
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

    const processChartData = (data: DataItem[]) => {
        console.log("Fetched data:", data);

        const sortedData = data.sort((a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

        const processedSeriesData = sortedData.map((item) =>
            typeof item[dataType] === "number" ? item[dataType] as number : 0
        );

        const processedCategories = sortedData.map((item) =>
            new Date(item.timestamp).toLocaleString()
        );

        setSeriesData(processedSeriesData);
        setCategories(processedCategories);
        if (onLoaded) onLoaded();
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                let token = getCookie("accessToken");

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

        fetchData();
    }, [apiUrl, dataType]);

    return (
        <Chart
            options={{
                chart: {
                    type: "area",
                    toolbar: { show: false },
                    fontFamily: "Lexend, sans-serif",
                },
                fill: {
                    type: "gradient",
                    gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0.55,
                        opacityTo: 0,
                        stops: [0, 100],
                        gradientToColors: [color],
                    },
                },
                colors: [color],
                stroke: { width: 4, colors: [color] },
                dataLabels: { enabled: false },
                xaxis: {
                    categories,
                    labels: { show: false },
                    title: {
                        text: "Garis horizontal menunjukkan waktu tiap 5 menit",
                        style: {
                            fontFamily: "Lexend, sans-serif",
                            fontWeight: "light",
                            fontSize: "14px",
                            color: "#333"
                        },
                    },
                },
                yaxis: {
                    title: {
                        text: `Tingkat ${dataTypeLabel}`,
                        style: {
                            fontFamily: "Lexend, sans-serif",
                            fontWeight: "light",
                            fontSize: "14px",
                            color: "#333"
                        },
                    },
                    labels: { show: false },
                },
                tooltip: {
                    y: {
                        formatter: (val: number) => {
                            const suffix = dataType === "temperature" ? "°C" :
                                dataType === "humidity" ? "%" :
                                    dataType === "ammonia" ? "ppm" :
                                        dataType === "mortalitas" ? "%" : "";
                            return `${val.toFixed(2)}${suffix}`;
                        },
                    },
                },
                grid: {
                    show: false,
                },
            }}
            series={[
                {
                    name: dataTypeLabel,
                    data: seriesData,
                },
            ]}
            type="area"
            height="300"
        />
    );
};

export default AreaChart;