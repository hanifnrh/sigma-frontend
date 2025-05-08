"use client";

// UI Components
import { SensorStatus } from '@/components/pages/perangkat-keras/sensor-status';
import Navbar from "../navbar";

// Libraries

// Icons
import { FaTemperatureLow } from "react-icons/fa";
import { TbAtom2Filled } from "react-icons/tb";

// Private route for disallow unauthenticated users
import { SensorStatus2 } from '@/components/pages/perangkat-keras/sensor-status2';
import PrivateRoute from '@/components/PrivateRoute';
import TopMenu from '../top-menu';

export default function PerangkatKeras() {

    return (
        <PrivateRoute>
            <main className="w-full bg-white dark:bg-zinc-950 relative">
                <Navbar />
                <div className='flex flex-col mt-10 sm:mt-0 sm:pl-44 md:pl-56 xl:pl-64 w-full'>
                    <div className="sticky top-10 sm:top-0 z-10">
                        <TopMenu />
                        <div className="flex header py-2 px-4 font-semibold justify-between items-center border-b bg-white dark:bg-zinc-950">
                            <div className='flex font-bold text-xl sm:text-2xl'>
                                Perangkat Keras
                            </div>
                        </div>
                    </div>

                    <div className="page flex items-center justify-between p-4">
                        <div className="flex flex-col justify-between items-center w-full">
                            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 w-full'>
                                <div className="relative flex flex-grow !flex-row items-center justify-center rounded-[10px] border-[1px] border-gray-200 bg-white dark:bg-zinc-950 bg-clip-border shadow-md shadow-[#F3F3F3] dark:border-[#ffffff33] dark:text-white dark:shadow-none p-7">
                                    <div className="flex h-[90px] w-auto flex-row items-center">
                                        <div className="rounded-full bg-lightPrimary  dark:bg-navy-700">
                                            <span className="flex items-center text-brand-500 dark:text-white">
                                                <FaTemperatureLow size={30} />
                                            </span>
                                        </div>
                                    </div>
                                    <div className="h-50 ml-4 flex w-auto flex-col justify-center">
                                        <p className="font-dm text-lg sm:text-xl font-semibold text-gray-600 dark:text-white">Suhu & Kelembapan DHT 22</p>
                                        <h4 className="text-xl sm:text-3xl font-bold">4 buah</h4>
                                    </div>
                                </div>
                                <div className="relative flex flex-grow !flex-row items-center justify-center rounded-[10px] border-[1px] border-gray-200 bg-white bg-clip-border shadow-md shadow-[#F3F3F3] dark:border-[#ffffff33] dark:bg-zinc-950 dark:text-white dark:shadow-none p-7">
                                    <div className="flex h-[90px] w-auto flex-row items-center">
                                        <div className="rounded-full bg-lightPrimary  dark:bg-navy-700">
                                            <span className="flex items-center text-brand-500 dark:text-white">
                                                <TbAtom2Filled size={30} />
                                            </span>
                                        </div>
                                    </div>
                                    <div className="h-50 ml-4 flex w-auto flex-col justify-center">
                                        <p className="font-dm text-lg sm:text-xl font-semibold text-gray-600 dark:text-white">Amonia DFRobot MiCS-5524</p>
                                        <h4 className="text-xl sm:text-3xl font-bold">2 buah</h4>
                                    </div>
                                </div>
                            </div>

                            <div className='mt-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-4'>
                                <div className='w-full h-full'>
                                    <p className='navbar-title font-bold text-sm sm:text-xs mb-2'>
                                        LANTAI 1
                                    </p>
                                    <SensorStatus></SensorStatus>
                                </div>
                                <div className='w-full h-full'>
                                    <p className='navbar-title font-bold text-sm sm:text-xs mb-2'>
                                        LANTAI 2
                                    </p>
                                    <SensorStatus2></SensorStatus2>
                                </div>
                                {/* <div className='w-full h-full'>
                                    <p className='navbar-title font-bold text-sm sm:text-xs mb-2'>
                                        DAYA PERANGKAT
                                    </p>
                                    <div className='border rounded-lg p-6'>
                                        <SensorBattery2></SensorBattery2>
                                    </div>
                                </div> */}
                            </div>

                        </div>
                    </div>
                </div>
            </main>
        </PrivateRoute>
    );
}
