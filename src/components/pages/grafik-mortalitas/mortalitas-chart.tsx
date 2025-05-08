"use client";

import { getCookie, setCookie } from "cookies-next";
import { useEffect, useState } from "react";
import Chart from "react-apexcharts";

interface DataItem {
    id: number;
    data_ayam_id: number;
    data_ayam_details: {
        jumlah_ayam: number;
        mortalitas: number;
        usia_ayam: number;
        tanggal_mulai: string;
        jumlah_ayam_awal: number;
        tanggal_panen: string;
    };
    timestamp: string | number;
}

interface MortalitasChartProps {
    id: string;
    color: string;
    apiUrl: string;
    dataType: keyof DataItem["data_ayam_details"];
    onLoaded?: () => void;
}

const dataTypeMapping: Record<string, string> = {
    mortalitas: "mortalitas dalam %",
};

const MortalitasChart: React.FC<MortalitasChartProps> = ({ id, color, dataType, apiUrl, onLoaded }) => {
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

        // Filter out items with invalid or missing timestamp
        const validData = data.filter((item) => {
            return item.timestamp !== undefined && item.timestamp !== null;
        });

        // Sort data by timestamp
        const sortedData = validData.sort((a, b) => {
            const timestampA = new Date(a.timestamp as string | number).getTime();
            const timestampB = new Date(b.timestamp as string | number).getTime();
            return timestampA - timestampB;
        });

        // Get all data
        const processedSeriesData = sortedData.map((item) => {
            const value = item.data_ayam_details[dataType as keyof typeof item.data_ayam_details];
            if (typeof value === "number" && !isNaN(value)) {
                return dataType === "mortalitas" ? value * 100 : value;
            }
            return 0;
        });

        const processedCategories = sortedData.map((item) =>
            new Date(item.timestamp as string | number).toLocaleString()
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
                        text: "Garis horizontal menunjukkan waktu",
                        style: {
                            fontFamily: "Lexend, sans-serif",
                            fontWeight: "light",
                            fontSize: "14px",
                            color: "#a1a1aa"
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
                            color: "#a1a1aa"
                        },
                    },
                    labels: { show: false },
                },
                tooltip: {
                    y: {
                        formatter: (val: number) => `${val.toFixed(2)}${dataType === "mortalitas" ? "%" : ""}`,
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

export default MortalitasChart;