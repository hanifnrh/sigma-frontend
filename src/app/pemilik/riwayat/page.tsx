"use client";

// Context for data fetching
import { useParameterContext } from "@/components/context/lantai-satu/ParameterContext";

// UI Components
import Navbar from "@/app/pemilik/navbar";
import { RiwayatTable } from '@/app/pemilik/riwayat/riwayat-table';
import GrafikCard from "@/components/pages/grafik-total/grafik-card";
import { Aktivitas } from "@/components/pages/riwayat/aktivitas";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

// Libraries

// Icons
import ButtonDownload from "@/components/ui/buttons/button-download";
import { useState } from "react";
import { MdOutlineFileDownload } from "react-icons/md";
import { RiArrowDropDownLine } from "react-icons/ri";
import TopMenu from "../top-menu";

// Private route for disallow unauthenticated users

export default function Riwayat() {
    const { overallColor, overallStatus, averageScore } = useParameterContext();
    const grafikData = [
        {
            title: "Skor Total",
            value: averageScore ?? 0, // Contoh rata-rata
            statusColor: overallColor || "text-gray-500",
            statusText: overallStatus || "N/A",
            chartId: "overall",
            apiUrl: "https://sigma-backend-production.up.railway.app/api/parameters/floor/1/",
            dataType: "score",
        }
    ];

    const [lantai, setLantai] = useState(1); // Default lantai 1

    const handleFloorChange = (floor: number) => {
        setLantai(floor);
    };

    return (
        <main className="w-full bg-white dark:bg-zinc-900 relative">
            <Navbar />
            <div className='flex flex-col mt-10 sm:mt-0 sm:pl-44 md:pl-56 xl:pl-64 w-full'>
                <div className="sticky top-10 sm:top-0 z-10">
                    <TopMenu />
                    <div className="flex header py-2 px-4 body-light justify-between items-center border-b bg-white">
                        <div className='flex body-bold text-2xl'>
                            Riwayat
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-4xl">
                            <DropdownMenu>
                                <DropdownMenuTrigger className='border p-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'>
                                    {`Lantai ${lantai}`}
                                    <RiArrowDropDownLine className="dark:text-white text-center text-2xl" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className='body-light'>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => handleFloorChange(1)}>Lantai 1</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleFloorChange(2)}>Lantai 2</DropdownMenuItem>
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
                                    <DropdownMenuItem>Semua</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <ButtonDownload>
                                <MdOutlineFileDownload className='text-4xl pr-2' />
                                Unduh data
                            </ButtonDownload>
                        </div>
                    </div>
                </div>

                <div className="page flex items-center justify-between p-4">
                    <div className="flex flex-col justify-between items-center w-full">
                        <RiwayatTable lantai={lantai} />

                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 w-full mt-10'>
                            <div className='w-full h-full'>
                                <p className='navbar-title body-bold text-sm sm:text-xs mb-2'>
                                    GRAFIK TOTAL
                                </p>
                                {grafikData.map((grafik) => (
                                    <div key={grafik.chartId}>
                                        <GrafikCard {...grafik} />
                                    </div>
                                ))}
                            </div>
                            <div className='w-full'>
                                <p className='navbar-title body-bold text-sm sm:text-xs mb-2'>
                                    AKTIVITAS
                                </p>
                                <Aktivitas />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </main>
    );
}
