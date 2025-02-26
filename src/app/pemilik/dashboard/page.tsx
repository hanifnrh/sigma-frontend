"use client"

// Context for data fetching
import { useChickenContext } from "@/components/context/ChickenContext";
import { useNotifications } from "@/components/context/NotificationContext";
import { useParameterContext } from "@/components/context/ParameterContext";

// UI Components
import GrafikCard from "@/components/section/grafik-card";
import { SensorBattery } from '@/components/section/sensor-battery-1';
import { SensorStatus } from "@/components/section/sensor-status";
import StatCard from '@/components/section/stat-card';
import { Button } from '@/components/ui/button';
import StatusIndicator from '@/components/ui/status-indicator';

// Libraries
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { utils, writeFile } from "xlsx";

// Icons
import { BsHeartPulse } from "react-icons/bs";
import { FaRegCalendarAlt, FaTemperatureHigh, FaTemperatureLow } from "react-icons/fa";
import { GiRooster } from "react-icons/gi";
import { IoWater } from "react-icons/io5";
import { MdOutlineFileDownload } from "react-icons/md";
import { TbAtom2Filled } from "react-icons/tb";

// Private route for disallow unauthenticated users
import PrivateRoute from "@/components/PrivateRoute";
import Navbar from "../navbar";
import TopMenu from "../top-menu";

const AreaChart = dynamic(() => import('@/components/ui/area-chart'), { ssr: false });

type Notification = {
    parameter: string;
    status: string;
    timestamp: Date;
    message: string;
    icon: React.ReactNode;
    color: string;
};

export default function Dashboard() {
    const { jumlahAyam, setJumlahAyam, mortalitas, setMortalitas, ageInDays, setAgeInDays, jumlahAwalAyam, targetTanggal } = useChickenContext();
    const { statusAndColor, averageScore } = useParameterContext();
    const pathname = usePathname(); // Get the current pathname
    const { notifications } = useNotifications();
    const {
        ammonia,
        temperature,
        humidity,
        setAmmonia,
        setTemperature,
        setHumidity,
        overallStatus,
        setOverallStatus,
        warnings,
        ammoniaColor,
        temperatureColor,
        humidityColor,
        overallColor
    } = useParameterContext();

    const grafikData = [
        {
            title: "Skor Keseluruhan",
            value: averageScore ?? 0, // Contoh rata-rata
            statusColor: overallColor || "text-gray-500",
            statusText: overallStatus || "N/A",
            chartId: "overall",
            apiUrl: "https://sigma-backend-production.up.railway.app/api/parameters/",
            dataType: "score",
        }
    ];

    const getTemperatureIcon = (temp: number) =>
        temp > 32 ? <FaTemperatureHigh /> : <FaTemperatureLow />;

    const parameterCards = [
        {
            label: "Amonia",
            value: `${ammonia ?? 0} ppm`,
            icon: <TbAtom2Filled />,
            statusColor: ammoniaColor,
            warning: warnings.ammonia,
        },
        {
            label: "Suhu",
            value: `${temperature ?? 0} °C`,
            icon: getTemperatureIcon(temperature ?? 0),
            statusColor: temperatureColor,
            warning: warnings.temperature,
        },
        {
            label: "Kelembapan",
            value: `${humidity ?? 0}%`,
            icon: <IoWater />,
            statusColor: humidityColor,
            warning: warnings.humidity,
        },
    ];

    const ayamDecreasePercentage =
        jumlahAwalAyam > 0 ? ((jumlahAwalAyam - jumlahAyam) / jumlahAwalAyam) * 100 : 0;

    const daysToTarget = targetTanggal
        ? Math.floor((targetTanggal.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) - ageInDays
        : null;

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
            label: "Mortalitas Ayam",
            value: `${mortalitas}%`,
            icon: <BsHeartPulse />,
            statusColor: mortalitas > 5 ? "text-red-500" : "text-green-500",
            warning: mortalitas > 5 ? "Bahaya, mortalitas ayam sudah melewati batas!" : "",
        },
        {
            label: "Jumlah Ayam",
            value: `${jumlahAyam}`,
            icon: <GiRooster />,
            statusColor: ayamDecreasePercentage > 5 ? "text-red-500" : "text-green-500",
            warning:
                ayamDecreasePercentage > 5 ? "Bahaya, jumlah ayam berkurang banyak!" : "",
        },
        {
            label: "Usia Ayam",
            value: `${ageInDays} hari`,
            icon: <FaRegCalendarAlt />,
            statusColor: getAgeStatusColor(),
            warning:
                daysToTarget !== null
                    ? daysToTarget > 0
                        ? `${daysToTarget} hari lagi untuk panen.`
                        : daysToTarget === 0
                            ? "Hari ini adalah hari panen."
                            : "" // Tidak tampilkan jika negatif
                    : "", // Tidak tampilkan jika null
        },

    ];

    const getStatusGradient = (statusText: string) => {
        switch (statusText) {
            case "Sangat Baik":
                return "bg-[linear-gradient(107deg,#16CC53_8.32%,#108496_60.18%,#35B6CA_105.75%)]";
            case "Baik":
                return "bg-[linear-gradient(107deg,#3B82F6_8.32%,#1D4ED8_60.18%,#1E40AF_105.75%)]";
            case "Buruk":
                return "bg-[linear-gradient(107deg,#FBBF24_8.32%,#F59E0B_60.18%,#D97706_105.75%)]";
            case "Bahaya":
                return "bg-[linear-gradient(107deg,#EF4444_8.32%,#B91C1C_60.18%,#7F1D1D_105.75%)]";
            default:
                return "bg-[linear-gradient(107deg,#16CC53_8.32%,#108496_60.18%,#35B6CA_105.75%)]";
        }
    };
    const handleDownload = () => {
        const timestamp = new Date().toLocaleString();
        const data = [
            {
                Amonia: ammonia,
                Suhu: temperature,
                Kelembapan: humidity,
                UsiaAyam: ageInDays,
                Mortalitas: mortalitas,
                JumlahAyam: jumlahAyam,
                Timestamp: timestamp,
            },
        ];
        const ws = utils.json_to_sheet(data);
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, "StatsData");
        writeFile(wb, "Dashboard.xlsx");
    };

    return (
        <PrivateRoute>
            <main className="bg-white dark:bg-zinc-900 w-full">
                <Navbar />
                <div className='flex flex-col mt-10 sm:mt-0 sm:pl-44 md:pl-56 xl:pl-64 w-full'>
                    <div className="sticky top-10 sm:top-0 z-10">
                        <TopMenu />
                        <div className="flex header py-2 px-4 body-light justify-between items-center border-b bg-white">
                            <div className='flex body-bold text-2xl'>
                                Dasbor
                            </div>
                            <div className="flex justify-center items-center text-4xl">
                                <Button variant={"green"} onClick={handleDownload}>
                                    <MdOutlineFileDownload className='text-4xl pr-2' />
                                    Unduh data
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="page flex flex-col lg:flex-row items-start justify-between w-full">
                        <div className="container-left flex flex-col justify-center items-center w-full border-r">
                            <div className='flex justify-between items-center py-5 px-4 w-full border-b'>
                                <div>
                                    <span
                                        className={`text-2xl md:text-4xl body-bold ${getStatusGradient(overallStatus)
                                            } cliptext text-transparent`}
                                    >
                                        Status Keseluruhan: {overallStatus || "-"}
                                    </span>
                                </div>
                                <div className='border-l px-5'>
                                    <div className='navbar-title body-bold text-sm sm:text-xs'>
                                        SKOR TOTAL
                                    </div>
                                    <div className={`text-2xl md:text-4xl body-bold ${overallColor}`}>
                                        {averageScore?.toFixed(0) || "-"}<span className="text-lg">/100</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center w-full p-4">
                                <div className="w-full grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                                    {parameterCards.map(({ label, value, icon, statusColor, warning }) => (
                                        <StatCard key={label} label={label} value={value} icon={icon} statusColor={statusColor} warning={warning} />
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-between items-center w-full p-4">
                                <div className="w-full grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                                    {generalCards.map(({ label, value, icon, statusColor, warning }) => (
                                        <StatCard key={label} label={label} value={value} icon={icon} statusColor={statusColor} warning={warning} />
                                    ))}
                                </div>
                            </div>


                            <div className="status-container flex items-center justify-center py-4 border-b w-full">
                                <div className="status-wrapper grid grid-cols-2 xl:grid-cols-4 gap-4">
                                    <div className="status flex items-center justify-center">
                                        <StatusIndicator status="success">Sangat Baik</StatusIndicator>
                                    </div>
                                    <div className="status flex items-center justify-center">
                                        <StatusIndicator status="info">Baik</StatusIndicator>
                                    </div>
                                    <div className="status flex items-center justify-center">
                                        <StatusIndicator status="warning">Buruk</StatusIndicator>
                                    </div>
                                    <div className="status flex items-center justify-center">
                                        <StatusIndicator status="error">Bahaya</StatusIndicator>
                                    </div>

                                </div>
                            </div>
                            <div className='grid grid-cols-1 xl:grid-cols-2 gap-x-4 gap-y-8 w-full p-4 justify-between'>
                                <div className='w-full'>
                                    <p className='navbar-title body-bold text-sm sm:text-xs mb-2'>
                                        PERANGKAT
                                    </p>
                                    <SensorStatus />
                                </div>
                                <div className='w-full'>
                                    <p className='navbar-title body-bold text-sm sm:text-xs mb-2'>
                                        GRAFIK KESELURUHAN
                                    </p>
                                    {grafikData.map((grafik) => (
                                        <div key={grafik.chartId}>
                                            <GrafikCard {...grafik} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="container-right flex flex-col items-start justify-center px-5 py-5 h-full lg:mt-0 mt-10">
                            <div className='navbar-title body-bold text-sm sm:text-xs '>
                                DAYA PERANGKAT
                            </div>
                            <div>
                                <SensorBattery />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </PrivateRoute>
    );
}
