"use client";

// Context for data fetching
import { useParameterContext2 } from "@/components/context/lantai-dua/ParameterContext2";
import { useParameterContext } from "@/components/context/lantai-satu/ParameterContext";

// UI Components
import Navbar from "@/app/pemilik/navbar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

// Libraries

// Icons
import { MdOutlineFileDownload } from "react-icons/md";
import { RiArrowDropDownLine } from "react-icons/ri";

// Private route for disallow unauthenticated users
import GrafikParameterCard from "@/components/pages/grafik-parameter/grafik-parameter-card";
import PrivateRoute from "@/components/PrivateRoute";
import ButtonDownload from "@/components/ui/buttons/button-download";
import { getCookie, setCookie } from "cookies-next";
import { useState } from "react";
import { utils, writeFile } from "xlsx";
import TopMenu from "../top-menu";

interface ParameterData {
    id: number;
    timestamp: string; // Jika formatnya ISO string dari API
    ammonia: number;
    temperature: number;
    humidity: number;
    ammonia_status: string;
    temperature_status: string;
    humidity_status: string;
    status: string;
    score: number;
}

export default function Grafik() {
    const [lantai, setLantai] = useState<1 | 2>(1);
    const parameterLantai1 = useParameterContext();
    const parameterLantai2 = useParameterContext2();
    const { ammonia, temperature, humidity, overallStatus, overallColor, averageScore, ammoniaColor, humidityColor, temperatureColor, ammoniaStatus, humidityStatus, temperatureStatus } = lantai === 1 ? parameterLantai1 : parameterLantai2;

    const grafikData = [
        {
            title: "Skor Total",
            value: averageScore ?? 0,
            statusColor: overallColor || "text-gray-500",
            statusText: overallStatus || "N/A",
            chartId: "overall",
            apiUrl: `https://sigma-backend-production.up.railway.app/api/parameters/floor/${lantai}/`,
            dataType: "score",
        },
        {
            title: "Amonia",
            value: ammonia ?? 0,
            statusColor: ammoniaColor || "text-gray-500",
            statusText: ammoniaStatus || "N/A",
            chartId: "ammonia",
            apiUrl: `https://sigma-backend-production.up.railway.app/api/parameters/floor/${lantai}/`,
            dataType: "ammonia",
        },
        {
            title: "Suhu",
            value: temperature ?? 0,
            statusColor: temperatureColor || "text-gray-500",
            statusText: temperatureStatus || "N/A",
            chartId: "temperature",
            apiUrl: `https://sigma-backend-production.up.railway.app/api/parameters/floor/${lantai}/`,
            dataType: "temperature",
        },
        {
            title: "Kelembapan",
            value: humidity ?? 0,
            statusColor: humidityColor || "text-gray-500",
            statusText: humidityStatus || "N/A",
            chartId: "humidity",
            apiUrl: `https://sigma-backend-production.up.railway.app/api/parameters/floor/${lantai}/`,
            dataType: "humidity",
        },
    ];

    const durationMap: Record<string, string> = {
        "30 Menit": "30m",
        "1 Jam": "1h",
        "1 Hari": "1d",
        "1 Minggu": "1w",
        "1 Bulan": "1mo",
        "Semua": "all" // Sesuaikan dengan backend
    };

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

    const [durasi, setDurasi] = useState("30 Menit"); // Default ke "30 Menit"

    const handleDownload = async () => {
        try {
            const durationParam = durationMap[durasi] || "30m";
            const apiUrl = `https://sigma-backend-production.up.railway.app/api/parameters/floor/${lantai}/?duration=${durationParam}`;

            let token = getCookie("accessToken");

            // Kalau token kosong atau kadaluarsa, refresh dulu
            if (!token) {
                token = await fetchAccessToken();
                if (!token) throw new Error("Gagal mendapatkan token baru.");
                setCookie("accessToken", token, { path: "/" });
            }

            console.log("Fetching data from:", apiUrl);

            const response = await fetch(apiUrl, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            // Kalau token expired, coba refresh token dan ulang request
            if (response.status === 401) {
                const newToken = await fetchAccessToken();
                if (!newToken) throw new Error("Gagal refresh token.");
                setCookie("accessToken", newToken, { path: "/" });

                const newResponse = await fetch(apiUrl, {
                    headers: {
                        "Authorization": `Bearer ${newToken}`,
                    },
                });

                if (!newResponse.ok) throw new Error(`HTTP error! Status: ${newResponse.status}`);
                const newData = await newResponse.json();
                return processDownload(newData);
            }

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data: ParameterData[] = await response.json();

            processDownload(data);
        } catch (error) {
            console.error("Error downloading data:", error);
            alert("Gagal mengunduh data!");
        }
    };

    // Fungsi buat memproses data jadi Excel
    const processDownload = (data: ParameterData[]) => {
        if (typeof window === "undefined") return;

        if (!data.length) {
            alert("Data kosong!");
            return;
        }

        const formattedData = data.map(({ id, timestamp, ammonia, temperature, humidity, ammonia_status, temperature_status, humidity_status, status, score }) => ({
            ID: id,
            Timestamp: timestamp,
            Amonia: ammonia,
            Suhu: temperature,
            Kelembapan: humidity,
            "Status Amonia": ammonia_status,
            "Status Suhu": temperature_status,
            "Status Kelembapan": humidity_status,
            "Status Total": status,
            "Skor Total": score
        }));

        const ws = utils.json_to_sheet(formattedData);
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, `Parameter Data Lantai ${lantai}`);

        writeFile(wb, `DataGrafik_Lantai${lantai}_${durationMap[durasi]}.xlsx`);
    };


    return (
        <PrivateRoute>
            <main className="bg-white dark:bg-zinc-900 w-full relative">
                <Navbar />
                <div className='flex flex-col mt-10 sm:mt-0 sm:pl-44 md:pl-56 xl:pl-64 w-full'>
                    <div className="sticky top-10 sm:top-0 z-10">
                        <TopMenu />
                        <div className="flex header py-2 px-4 body-light justify-between items-center border-b bg-white">
                            <div className='flex body-bold text-2xl'>
                                Grafik
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-4xl">
                                <DropdownMenu>
                                    <DropdownMenuTrigger className='border p-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'>
                                        Lantai {lantai}
                                        <RiArrowDropDownLine className="dark:text-white text-center text-2xl" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className='body-light'>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => setLantai(1)}>Lantai 1</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setLantai(2)}>Lantai 2</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className='border p-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'>
                                        {durasi}
                                        <RiArrowDropDownLine className="dark:text-white text-center text-2xl" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className='body-light'>
                                        <DropdownMenuSeparator />
                                        {Object.keys(durationMap).map((key) => (
                                            <DropdownMenuItem key={key} onClick={() => setDurasi(key)}>
                                                {key}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <ButtonDownload onClick={handleDownload}>
                                    <MdOutlineFileDownload className='text-4xl pr-2' />
                                    Unduh data
                                </ButtonDownload>
                            </div>
                        </div>
                    </div>

                    <div className="page flex justify-between w-full">
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 p-4 w-full">
                            {grafikData.map((grafik) => (
                                <div key={grafik.chartId}>
                                    <GrafikParameterCard
                                        {...grafik}
                                        lantai={lantai}
                                        durasi={durasi}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </main>
        </PrivateRoute>
    );
}
