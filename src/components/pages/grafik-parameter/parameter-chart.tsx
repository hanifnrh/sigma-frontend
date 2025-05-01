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

interface ParameterChartProps {
    id: string;
    color: string;
    apiUrl: string;
    dataType: keyof Omit<DataItem, "timestamp">;
    lantai: number;
    durasi: string;
    onLoaded?: () => void;
}

const durationMap: Record<string, string> = {
    "30 Menit": "30m",
    "1 Jam": "1h",
    "1 Hari": "1d",
    "1 Minggu": "1w",
    "1 Bulan": "1mo",
    Semua: "all",
};

const dataTypeMapping: Record<string, string> = {
    ammonia: "amonia dalam ppm",
    temperature: "suhu dalam °C",
    humidity: "kelembapan dalam %",
    score: "Skor",
    mortalitas: "mortalitas dalam %",
};

const ParameterChart: React.FC<ParameterChartProps> = ({ color, dataType, lantai, durasi, onLoaded }) => {
    const [seriesData, setSeriesData] = useState<number[]>([]);
    const [categories, setCategories] = useState<string[]>([]);

    const dataTypeLabel = dataTypeMapping[dataType] || "Data";

    const apiUrl = durasi === "Semua"
        ? `https://sigma-backend-production.up.railway.app/api/parameters/floor/${lantai}/`
        : `https://sigma-backend-production.up.railway.app/api/parameters/floor/${lantai}/?time_range=${durationMap[durasi]}`;

    const fetchAccessToken = async () => {
        try {
            const res = await fetch("/api/refresh", {
                method: "POST",
                credentials: "include",
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Gagal refresh token");
            return data.accessToken;
        } catch (err) {
            console.error("Refresh token error:", err);
            return null;
        }
    };

    const processChartData = (data: DataItem[]) => {
        const sorted = data.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        setSeriesData(sorted.map((d) => (typeof d[dataType] === "number" ? d[dataType] as number : 0)));
        setCategories(sorted.map((d) => new Date(d.timestamp).toLocaleString()));
        if (onLoaded) onLoaded();
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                let token = getCookie("accessToken");
                if (!token) {
                    token = await fetchAccessToken();
                    if (!token) throw new Error("Token gagal diperbarui");
                    setCookie("accessToken", token, { path: "/" });
                }

                let res = await fetch(apiUrl, {
                    credentials: "include",
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (res.status === 401) {
                    const newToken = await fetchAccessToken();
                    if (!newToken) throw new Error("Token tidak valid");
                    setCookie("accessToken", newToken, { path: "/" });

                    res = await fetch(apiUrl, {
                        credentials: "include",
                        headers: { Authorization: `Bearer ${newToken}` },
                    });
                }

                if (!res.ok) throw new Error("Gagal fetch data");

                const json = await res.json();
                processChartData(json);
            } catch (err) {
                console.error("Error fetching chart data:", err);
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
                        style: { fontFamily: "Lexend, sans-serif", fontWeight: "light", fontSize: "14px", color: "#333" },
                    },
                },
                yaxis: {
                    title: {
                        text: `Tingkat ${dataTypeLabel}`,
                        style: { fontFamily: "Lexend, sans-serif", fontWeight: "light", fontSize: "14px", color: "#333" },
                    },
                    labels: { show: false },
                },
                tooltip: {
                    y: {
                        formatter: (val: number) => val.toFixed(2),
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

export default ParameterChart;
