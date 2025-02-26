
"use client";

// Context for data fetching
import { useChickenContext } from "@/components/context/ChickenContext";

// UI Components
import AyamCounter from '@/components/section/ayam-counter';
import DataAyamCard from '@/components/section/data-ayam-card';
import GrafikCard from "@/components/section/grafik-card";
import { Button } from '@/components/ui/button';
import { Calendar } from "@/components/ui/calendar";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Navbar from "../navbar";

// Libraries
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import dynamic from 'next/dynamic';
import { useState } from "react";

// Icons
import { CalendarIcon } from "lucide-react";
import { BsHeartPulse } from "react-icons/bs";
import { FaPlay, FaRegCalendarAlt, FaStop } from "react-icons/fa";
import { GiRooster } from "react-icons/gi";

// Private route for disallow unauthenticated users
import PrivateRoute from "@/components/PrivateRoute";
import TopMenu from "../top-menu";

const AreaChart = dynamic(() => import('@/components/ui/area-chart'), { ssr: false });

export default function DataAyam() {
    // Use context values
    const { jumlahAyam, setJumlahAyam, mortalitas, setMortalitas, ageInDays, setAgeInDays, jumlahAwalAyam, setJumlahAwalAyam, tanggalMulai, setTanggalMulai, targetTanggal, setTargetTanggal, farmingStarted, setFarmingStarted, ayamDecreasePercentage, daysToTarget, statusAyam, ayamId, handleHarvest, confirmHarvest, showConfirmHarvestDialog, setShowConfirmHarvestDialog, updateAgeInDays, postJumlahAyam, handleStartFarming, updateJumlahAyam, updateMortalitas, jumlahAyamInput, setJumlahAyamInput, handleParameterPanen, countdown, setCountdown } = useChickenContext();

    // Component-specific state
    const [harvested, setHarvested] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [harvestDialogOpen, setHarvestDialogOpen] = useState(false);

    const grafikData = [
        {
            title: "Mortalitas",
            value: mortalitas ?? 0, // Contoh rata-rata
            statusColor: statusAyam.mortalitas.color || "text-gray-500",
            statusText: statusAyam.mortalitas.text || "N/A",
            chartId: "mortalitas",
            apiUrl: `http://localhost:8000/api/data-ayam/${ayamId}/history/`,
            dataType: "mortalitas",
        }
    ];

    const getAgeStatusColor = () => {
        if (daysToTarget !== null) {
            if (daysToTarget > 14) return "text-red-500";
            if (daysToTarget > 7) return "text-yellow-500";
            if (daysToTarget > 0) return "text-blue-500";
            return "text-green-500";
        }
        return "text-black";
    };

    const generalCards = [
        {
            title: "MORTALITAS AYAM",
            label: "Mortalitas Ayam",
            value: `${mortalitas}%`,
            icon: <BsHeartPulse />,
            statusColor: mortalitas > 5 ? "text-red-500" : "text-green-500",
            warning: mortalitas > 5 ? "Bahaya, mortalitas ayam sudah melewati batas!" : "",
        },
        {
            title: "JUMLAH AYAM",
            label: "Jumlah Ayam",
            value: `${jumlahAyam}`,
            icon: <GiRooster />,
            statusColor: ayamDecreasePercentage > 5 ? "text-red-500" : "text-green-500",
            warning:
                ayamDecreasePercentage > 5 ? "Bahaya, jumlah ayam berkurang banyak!" : "",
        },
        {
            title: "USIA AYAM",
            label: "Usia Ayam",
            value: `${ageInDays} hari`,
            icon: <FaRegCalendarAlt />,
            statusColor: getAgeStatusColor(),
            warning:
                farmingStarted && daysToTarget !== null
                    ? daysToTarget > 0
                        ? `${daysToTarget} hari lagi untuk panen.`
                        : daysToTarget === 0
                            ? "Hari ini adalah hari panen."
                            : ""
                    : farmingStarted && !targetTanggal
                        ? "Target panen belum diatur."
                        : "", // Default: No warning if farming has not started
        },

    ];

    return (
        <PrivateRoute>
            <main className="w-full bg-white dark:bg-zinc-900 relative">
                <Navbar />
                <div className='flex flex-col mt-10 sm:mt-0 sm:pl-44 md:pl-56 xl:pl-64 w-full'>
                    <div className="sticky top-10 sm:top-0 z-10">
                        <TopMenu/>
                        <div className="flex header py-2 px-4 body-light justify-between items-center border-b bg-white">
                            <div className='flex body-bold text-2xl'>
                                Data Ayam
                            </div>
                        </div>
                    </div>
                    <div className="page flex items-center justify-between p-4 w-full">
                        <div className="flex flex-col justify-between items-center w-full">
                            <div className='grid grid-cols-1 xl:grid-cols-2 gap-y-10 w-full'>
                                <div className='grid grid-cols-2 gap-y-4 w-full xl:w-96'>
                                    <div className='flex flex-col justify-center sm:justify-start sm:items-start items-center w-full xl:w-44 h-full'>
                                        <div className='h-full flex justify-center items-center text-xl'>
                                            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                                                <DialogTrigger disabled={farmingStarted}>
                                                    <div onClick={() => setDialogOpen(true)} className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'>
                                                        <div className={`flex items-center justify-center text-white ${farmingStarted ? 'bg-customGreen opacity-50' : 'bg-customGreen'} mulaiTernak h-full px-4 py-2 rounded-lg text-sm sm:text-xl`}>
                                                            <FaPlay className='mr-2' />
                                                            Mulai Ternak
                                                        </div>
                                                    </div>
                                                </DialogTrigger>

                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Mulai Ternak</DialogTitle>
                                                        <DialogDescription>
                                                            Isi jumlah ayam dan target tanggal panen
                                                        </DialogDescription>
                                                        <div>
                                                            <label className="block mb-2">Jumlah Ayam Awal:</label>
                                                            <Input
                                                                type="number"
                                                                value={jumlahAyamInput}
                                                                onChange={(e) => setJumlahAyamInput(parseInt(e.target.value))}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block mb-2">Tanggal Panen:</label>
                                                            <Popover>
                                                                <PopoverTrigger asChild>
                                                                    <Button
                                                                        variant={"outline"}
                                                                        className={cn(
                                                                            "w-full justify-start text-left font-normal",
                                                                            !targetTanggal && "text-muted-foreground"
                                                                        )}
                                                                    >
                                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                                        {targetTanggal ? format(targetTanggal, "PPP") : <span>Pilih target waktu panen</span>}
                                                                    </Button>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-auto p-0" align="start">
                                                                    <Calendar
                                                                        mode="single"
                                                                        selected={targetTanggal || undefined} // Ensure selected is Date | undefined
                                                                        onSelect={(date) => setTargetTanggal(date || null)} // Convert undefined to null
                                                                        initialFocus
                                                                    />
                                                                </PopoverContent>
                                                            </Popover>

                                                            <Button
                                                                variant={'blue'}
                                                                onClick={() => {
                                                                    // Ensure targetTanggal is defined before proceeding
                                                                    if (targetTanggal) {
                                                                        handleStartFarming(jumlahAyamInput, targetTanggal);
                                                                        setDialogOpen(false);
                                                                    } else {
                                                                        // Handle the case where targetTanggal is undefined
                                                                        alert("Please select a valid date.");
                                                                    }
                                                                }}
                                                                type='submit'
                                                                className='w-full mt-4'
                                                                disabled={!targetTanggal || jumlahAyamInput <= 0}
                                                            >
                                                                Mulai
                                                            </Button>
                                                        </div>

                                                    </DialogHeader>
                                                    <DialogClose asChild>
                                                        <Button type="button" variant="secondary">
                                                            Tutup
                                                        </Button>
                                                    </DialogClose>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                        {farmingStarted && (
                                            <p className="text-green-500 mt-2 text-sm sm:text-md text-center">Ternak telah dimulai</p>
                                        )}
                                        {!farmingStarted && (
                                            <p className="text-black mt-2 text-sm sm:text-md text-center">Ternak belum dimulai</p>
                                        )}
                                    </div>
                                    <div className='flex flex-col justify-start sm:items-end 2xl:items-start items-center w-full xl:w-44 h-full'>
                                        <Dialog open={harvestDialogOpen} onOpenChange={setHarvestDialogOpen}>
                                            <DialogTrigger disabled={!farmingStarted} >
                                                <div className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'>
                                                    <div onClick={() => setHarvestDialogOpen(true)} className={`flex items-center justify-center text-white ${farmingStarted ? 'bg-customRed' : 'bg-customRed opacity-50'} panen h-full px-4 py-2 rounded-lg text-sm sm:text-xl`} >
                                                        <FaStop className='mr-2' />
                                                        Panen
                                                    </div>
                                                </div>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Apakah Anda yakin ingin panen sekarang?</DialogTitle>
                                                    <DialogDescription>
                                                        Aksi tidak dapat dibatalkan jika sudah dilakukan
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <Button
                                                    variant={"blue"}
                                                    onClick={() => {
                                                        handleHarvest(); // This will call confirmHarvest if the date has arrived
                                                        setHarvestDialogOpen(false); // Close the dialog
                                                    }}
                                                    type="submit"
                                                    disabled={!farmingStarted}
                                                >
                                                    Ya, saya yakin
                                                </Button>
                                                <DialogClose asChild>
                                                    <Button type="button" variant="secondary">
                                                        Tutup
                                                    </Button>
                                                </DialogClose>
                                            </DialogContent>
                                        </Dialog>
                                        {harvested && <p className='mt-2 text-sm sm:text-md text-center'>Sudah panen.</p>}
                                    </div>

                                    <Dialog open={showConfirmHarvestDialog} onOpenChange={setShowConfirmHarvestDialog}>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Konfirmasi Panen</DialogTitle>
                                                <DialogDescription>
                                                    Tanggal panen belum tiba. Apakah Anda yakin ingin panen?
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="flex justify-between items-center">
                                                <Button variant={"blue"} onClick={confirmHarvest} className='w-full' type="submit">
                                                    Ya, Panen
                                                </Button>
                                            </div>
                                            <DialogClose asChild>
                                                <Button type="button" variant="secondary">
                                                    Tutup
                                                </Button>
                                            </DialogClose>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                <div className='flex flex-col sm:flex-row justify-center xl:justify-end items-center sm:items-start w-full'>
                                    {!harvested && countdown && <div className='flex sm:justify-start justify-center items-start w-full lg:w-72 mb-2 sm:mb-0'>
                                        <div className='text-sm sm:text-xl flex justify-center items-center text-center px-4 py-2'>
                                            {countdown}
                                        </div>
                                    </div>}

                                    <div className='flex justify-end items-start'>
                                        <Button variant={"jumlahAyam"} className='w-full lg:w-72'>
                                            <div className='text-sm sm:text-xl'>
                                                Jumlah ayam awal: {jumlahAwalAyam}
                                            </div>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center w-full mt-10">
                                <div className="w-full grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                                    {generalCards.map(({ title, label, value, icon, statusColor, warning }) => (
                                        <DataAyamCard key={label} title={title} label={label} value={value} icon={icon} statusColor={statusColor} warning={warning} />
                                    ))}
                                </div>
                            </div>
                            <div className='mt-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-4'>
                                <div className='w-full h-full'>
                                    <p className='navbar-title body-bold text-sm sm:text-xs mb-2'>
                                        GRAFIK MORTALITAS
                                    </p>
                                    {grafikData.map((grafik) => (
                                        <div key={grafik.chartId}>
                                            <GrafikCard {...grafik} />
                                        </div>
                                    ))}
                                </div>
                                <div className='w-full h-full'>
                                    <p className='navbar-title body-bold text-sm sm:text-xs mb-2'>
                                        KENDALI JUMLAH AYAM
                                    </p>
                                    <div className='border rounded-lg'>
                                        <AyamCounter jumlahAyam={jumlahAyam} jumlahAwalAyam={jumlahAwalAyam} onUpdateJumlahAyam={updateJumlahAyam} updateMortalitas={updateMortalitas} farmingStarted={farmingStarted} />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
        </PrivateRoute>
    );
}
