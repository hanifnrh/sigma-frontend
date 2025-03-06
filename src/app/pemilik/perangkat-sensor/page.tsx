"use client";

// UI Components
import { SensorBattery2 } from '@/components/section/sensor-battery-2';
import { SensorStatus } from '@/components/section/sensor-status';
import Navbar from "../navbar";

// Libraries

// Icons
import { FaTemperatureLow } from "react-icons/fa";
import { MdOutlineFileDownload } from "react-icons/md";
import { TbAtom2Filled } from "react-icons/tb";

// Private route for disallow unauthenticated users
import PrivateRoute from '@/components/PrivateRoute';
import ButtonDownload from '@/components/ui/buttons/button-download';
import TopMenu from '../top-menu';

export default function PerangkatSensor() {

    return (
        <PrivateRoute>
            <main className="w-full bg-white dark:bg-zinc-900 relative">
                <Navbar />
                <div className='flex flex-col mt-10 sm:mt-0 sm:pl-44 md:pl-56 xl:pl-64 w-full'>
                    <div className="sticky top-10 sm:top-0 z-10">
                        <TopMenu />
                        <div className="flex header py-2 px-4 body-light justify-between items-center border-b bg-white">
                            <div className='flex body-bold text-2xl w-32 lg:w-56'>
                                Perangkat Keras
                            </div>
                            <div className="flex justify-center items-center text-4xl">
                                <ButtonDownload>
                                    <MdOutlineFileDownload className='text-4xl pr-2' />
                                    Unduh data
                                </ButtonDownload>
                            </div>
                        </div>
                    </div>

                    <div className="page flex items-center justify-between p-4">
                        <div className="flex flex-col justify-between items-center w-full">
                            <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 w-full'>
                                <div className="relative flex flex-grow !flex-row items-center justify-center rounded-[10px] border-[1px] border-gray-200 bg-white bg-clip-border shadow-md shadow-[#F3F3F3] dark:border-[#ffffff33] dark:bg-black dark:text-white dark:shadow-none p-7">
                                    <div className="flex h-[90px] w-auto flex-row items-center">
                                        <div className="rounded-full bg-lightPrimary  dark:bg-navy-700">
                                            <span className="flex items-center text-brand-500 dark:text-white">
                                                <FaTemperatureLow size={30} />
                                            </span>
                                        </div>
                                    </div>
                                    <div className="h-50 ml-4 flex w-auto flex-col justify-center">
                                        <p className="font-dm text-xl font-medium text-gray-600 dark:text-white">Suhu & Kelembapan DHT 22</p>
                                        <h4 className="text-3xl body-bold">4 buah</h4>
                                    </div>
                                </div>
                                <div className="relative flex flex-grow !flex-row items-center justify-center rounded-[10px] border-[1px] border-gray-200 bg-white bg-clip-border shadow-md shadow-[#F3F3F3] dark:border-[#ffffff33] dark:bg-black dark:text-white dark:shadow-none p-7">
                                    <div className="flex h-[90px] w-auto flex-row items-center">
                                        <div className="rounded-full bg-lightPrimary  dark:bg-navy-700">
                                            <span className="flex items-center text-brand-500 dark:text-white">
                                                <TbAtom2Filled size={30} />
                                            </span>
                                        </div>
                                    </div>
                                    <div className="h-50 ml-4 flex w-auto flex-col justify-center">
                                        <p className="font-dm text-xl font-medium text-gray-600 dark:text-white">Amonia DFRobot MEMS NH3</p>
                                        <h4 className="text-3xl body-bold">2 buah</h4>
                                    </div>
                                </div>
                            </div>

                            <div className='mt-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-10'>
                                <div className='w-full h-full'>
                                    <p className='navbar-title body-bold text-sm sm:text-xs mb-2'>
                                        PERANGKAT
                                    </p>
                                    <SensorStatus></SensorStatus>
                                </div>
                                <div className='w-full h-full'>
                                    <p className='navbar-title body-bold text-sm sm:text-xs mb-2'>
                                        DAYA PERANGKAT
                                    </p>
                                    <div className='border rounded-lg p-6'>
                                        <SensorBattery2></SensorBattery2>
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
