"use client";

// Context for data fetching
import { useParameterContext2 } from "@/components/context/lantai-dua/ParameterContext2";
import { useParameterContext } from "@/components/context/lantai-satu/ParameterContext";

// UI Components
import Navbar from "@/app/pemilik/navbar";
import GrafikCard from "@/components/section/grafik-card";
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
import PrivateRoute from "@/components/PrivateRoute";
import ButtonDownload from "@/components/ui/buttons/button-download";
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
            title: "Skor Keseluruhan",
            value: averageScore ?? 0,
            statusColor: overallColor || "text-gray-500",
            statusText: overallStatus || "N/A",
            chartId: "overall",
            apiUrl: `https://sigma-backend-production.up.railway.app/api/parameters${lantai === 2 ? "2" : ""}/`,
            dataType: "score",
        },
        {
            title: "Amonia",
            value: ammonia ?? 0,
            statusColor: ammoniaColor || "text-gray-500",
            statusText: ammoniaStatus || "N/A",
            chartId: "ammonia",
            apiUrl: `https://sigma-backend-production.up.railway.app/api/parameters${lantai === 2 ? "2" : ""}/`,
            dataType: "ammonia",
        },
        {
            title: "Suhu",
            value: temperature ?? 0,
            statusColor: temperatureColor || "text-gray-500",
            statusText: temperatureStatus || "N/A",
            chartId: "temperature",
            apiUrl: `https://sigma-backend-production.up.railway.app/api/parameters${lantai === 2 ? "2" : ""}/`,
            dataType: "temperature",
        },
        {
            title: "Kelembapan",
            value: humidity ?? 0,
            statusColor: humidityColor || "text-gray-500",
            statusText: humidityStatus || "N/A",
            chartId: "humidity",
            apiUrl: `https://sigma-backend-production.up.railway.app/api/parameters${lantai === 2 ? "2" : ""}/`,
            dataType: "humidity",
        },
    ];

    const handleDownload = async () => {
        try {
            const response = await fetch(`https://sigma-backend-production.up.railway.app/api/parameters${lantai === 2 ? "2" : ""}/`);
            const data: ParameterData[] = await response.json();

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
                "Status Keseluruhan": status,
                "Skor Keseluruhan": score
            }));

            const ws = utils.json_to_sheet(formattedData);
            const wb = utils.book_new();
            utils.book_append_sheet(wb, ws, `Parameter Data Lantai ${lantai}`);

            writeFile(wb, `DataGrafik_Lantai${lantai}.xlsx`);
        } catch (error) {
            console.error("Error downloading data:", error);
            alert("Gagal mengunduh data!");
        }
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
                                        30 menit
                                        <RiArrowDropDownLine className="dark:text-white text-center text-2xl" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className='body-light'>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>30 Menit</DropdownMenuItem>
                                        <DropdownMenuItem>1 Jam</DropdownMenuItem>
                                        <DropdownMenuItem>1 Hari</DropdownMenuItem>
                                        <DropdownMenuItem>1 Minggu</DropdownMenuItem>
                                        <DropdownMenuItem>1 Bulan</DropdownMenuItem>
                                        <DropdownMenuItem>1 Kelompok</DropdownMenuItem>
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
                                    <GrafikCard {...grafik} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>


            </main>
        </PrivateRoute>
    );
}
