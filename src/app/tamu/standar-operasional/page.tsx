"use client";

import { Construction, FolderKanban, Variable, Waves } from "lucide-react";
// UI Components
import Navbar from "../navbar";
import TopMenu from "../top-menu";

export default function SOP() {
    return (
        <main className="w-full bg-white dark:bg-zinc-950 relative">
            <Navbar />
            <div className='flex flex-col mt-10 sm:mt-0 sm:pl-44 md:pl-56 xl:pl-64 w-full'>
                <div className="sticky top-10 sm:top-0 z-10">
                    <TopMenu />
                    <div className="flex header py-2 px-4 font-semibold justify-between items-center border-b bg-white dark:bg-zinc-950">
                        <h1 className='font-bold text-2xl'>Standar Operasional</h1>
                    </div>
                </div>
                <div className="flex flex-col gap-4 w-full h-full p-4 pb-10">
                    <h1 className="text-indigo-600 text-xl font-bold">
                        Standar Operasional Sistem SIGMA
                    </h1>
                    <p className="font-semibold">
                        Standar operasional ini bertujuan untuk memastikan bahwa kandang ayam dikelola dengan efisien dan sesuai dengan prosedur terbaik. Berikut adalah panduan operasional dalam menggunakan sistem SIGMA:
                    </p>

                    <section>
                        <h2 className="w-fit flex items-center gap-2 text-lg font-semibold bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-400 px-4 py-2 rounded-md mt-6 mb-3">
                            <Variable />
                            Pemantauan Parameter
                        </h2>
                        <ul className="list-disc list-inside font-semibold">
                            <li>Data suhu, kelembaban, dan amonia diperbarui setiap 5 menit.</li>
                            <li>Jika ada parameter di luar batas normal, segera lakukan tindakan sesuai rekomendasi sistem.</li>
                            <li>Peternak wajib mengecek notifikasi dari sistem minimal 2 kali sehari.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="w-fit flex items-center gap-2 text-lg font-semibold bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-400 px-4 py-2 rounded-md mt-6 mb-3">
                            <Waves />
                            Pembersihan Kandang
                        </h2>
                        <ul className="list-disc list-inside font-semibold">
                            <li>Pembersihan kotoran ayam dilakukan setiap 6 jam sekali.</li>
                            <li>Penyemprotan disinfektan dilakukan setiap 2 hari sekali.</li>
                            <li>Pengecekan ventilasi dan kondisi kandang dilakukan setiap pagi dan sore.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="w-fit flex items-center gap-2 text-lg font-semibold bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-400 px-4 py-2 rounded-md mt-6 mb-3">
                            <FolderKanban />
                            Manajemen Ayam
                        </h2>
                        <ul className="list-disc list-inside font-semibold">
                            <li>Penghitungan ayam dilakukan setiap hari untuk mendeteksi kematian.</li>
                            <li>Input data ayam mati langsung dilakukan di sistem SIGMA untuk memperbarui tingkat mortalitas.</li>
                            <li>Panen dilakukan sesuai dengan jadwal yang direkomendasikan berdasarkan data pertumbuhan ayam.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="w-fit flex items-center gap-2 text-lg font-semibold bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-400 px-4 py-2 rounded-md mt-6 mb-3">
                            <Construction />
                            Pemeliharaan Perangkat Keras
                        </h2>
                        <ul className="list-disc list-inside font-semibold">
                            <li>Pengecekan status sensor dilakukan setiap pagi.</li>
                            <li>Kalibrasi sensor dilakukan setiap bulan untuk menjaga akurasi data.</li>
                            <li>Jika status perangkat pada web mati, segera charge perangkat.</li>
                            <li>Jika sensor mati atau tidak berfungsi, segera lakukan penggantian atau perbaikan.</li>
                        </ul>
                    </section>
                </div>
            </div>
        </main>
    );
}
