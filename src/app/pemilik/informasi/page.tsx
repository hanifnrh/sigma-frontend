"use client";

import { BetweenHorizontalStart, FileClock, LayoutDashboard, SmartphoneCharging } from "lucide-react";
// UI Components
import Navbar from "../navbar";
import TopMenu from "../top-menu";

export default function Informasi() {
    return (
        <main className="w-full bg-white dark:bg-zinc-900 relative">
            <Navbar />
            <div className='flex flex-col mt-10 sm:mt-0 sm:pl-44 md:pl-56 xl:pl-64 w-full'>
                <div className="sticky top-10 sm:top-0 z-10">
                    <TopMenu />
                    <div className="flex header py-2 px-4 font-semibold justify-between items-center border-b bg-white">
                        <h1 className='font-bold text-2xl'>Informasi</h1>
                    </div>
                </div>
                <div className="flex flex-col gap-4 w-full h-full p-4">
                    <h1 className="text-indigo-600 text-xl font-bold">
                        Panduan Penggunaan Sistem Monitoring Kandang Ayam
                    </h1>
                    <p className="font-semibold">
                        Sistem ini dirancang untuk membantu peternak dalam memantau kondisi kandang ayam secara real-time. Berikut adalah beberapa fitur utama dan cara penggunaannya:
                    </p>

                    <section>
                        <h2 className="w-fit flex items-center gap-2 text-lg font-semibold bg-violet-100 text-violet-800 px-4 py-2 rounded-md mt-6">
                            <LayoutDashboard />
                            Dasbor
                        </h2>
                        <h3 className="w-fit text-base font-semibold mt-6">
                            Fungsi Dasbor
                        </h3>
                        <ul className="list-disc list-inside font-semibold">
                            <li>Menampilkan data total dari kandang.</li>
                            <li>Menyediakan grafik parameter utama seperti suhu, kelembaban, dan kadar amonia.</li>
                            <li>Notifikasi jika ada parameter yang berada di luar batas normal.</li>
                        </ul>
                        <h3 className="w-fit text-base font-semibold rounded-md mt-6">
                            Penggunaan Dasbor
                        </h3>
                        <ul className="list-disc list-inside font-semibold">
                            <li>Untuk mengatur tampilan berdasarkan lantai, klik tombol lantai pada bagian atas layar. Pilih lantai berapa yang ingin dilihat.</li>
                            <li>Untuk mengunduh data, klik tombol unduh pada bagian atas layar.</li>
                            <li>Rincian data parameter dan data ayam terdapat pada halaman masing-masing yang dapat diakses melalui bar navigasi.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="w-fit flex items-center gap-2 text-lg font-semibold bg-violet-100 text-violet-800 px-4 py-2 rounded-md mt-6">
                            <BetweenHorizontalStart />
                            Data Ayam
                        </h2>
                        <h3 className="w-fit text-base font-semibold mt-6">
                            Fungsi Data Ayam
                        </h3>
                        <ul className="list-disc list-inside font-semibold">
                            <li>Digunakan untuk mengelola jumlah ayam dalam kandang.</li>
                            <li>Memantau kapan waktu panen dan kapan perlu melakukan restock ayam baru.</li>
                            <li>Jika ada ayam yang mati, dapat langsung diinput agar sistem menghitung tingkat mortalitas.</li>
                        </ul>
                        <h3 className="w-fit text-base font-semibold mt-6">
                            Penggunaan Data Ayam
                        </h3>
                        <ul className="list-disc list-inside font-semibold">
                            <li>Untuk memulai periode ternak, klik tombol mulai ternak pada bagian atas layar. Isi data yang diperlukan seperti jumlah ayam dan target tanggal panen.</li>
                            <li>Anda dapat klik tombol panen jika sudah waktunya panen. Di bawah tombol akan terdapat perhitungan mundur waktu panen.</li>
                            <li>Jika ingin mengubah tanggal panen sewaktu-waktu, klik tombol tanggal panen di samping jumlah ayam awal.</li>
                            <li>Jika ada ayam mati, Anda dapat memasukkan data ayam yang mati ke dalam tombol kendali jumlah ayam. Tingkat mortalitas akan berubah jika ada ayam yang mati.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="w-fit flex items-center gap-2 text-lg font-semibold bg-violet-100 text-violet-800 px-4 py-2 rounded-md mt-6">
                            <SmartphoneCharging />
                            Perangkat Keras
                        </h2>
                        <h3 className="w-fit text-base font-semibold mt-6">
                            Fungsi Perangkat Keras
                        </h3>
                        <ul className="list-disc list-inside font-semibold">
                            <li>Menampilkan status perangkat yang digunakan dalam kandang apakah aktif atau mati.</li>
                            <li>Memberikan peringatan jika ada perangkat yang tidak berfungsi.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="w-fit flex items-center gap-2 text-lg font-semibold bg-violet-100 text-violet-800 px-4 py-2 rounded-md mt-6">
                            <FileClock />
                            Riwayat
                        </h2>
                        <h3 className="w-fit text-base font-semibold mt-6">
                            Fungsi Riwayat
                        </h3>
                        <ul className="list-disc list-inside font-semibold">
                            <li>Menyediakan log data parameter dari waktu ke waktu.</li>
                            <li>Grafik perubahan suhu, kelembaban, dan amonia dalam periode tertentu.</li>
                            <li>Catatan mortalitas ayam dan kinerja kandang berdasarkan data historis.</li>
                        </ul>
                        <h3 className="w-fit text-base font-semibold mt-6">
                            Penggunaan Riwayat
                        </h3>
                        <ul className="list-disc list-inside font-semibold">
                            <li>Untuk mengatur tampilan berdasarkan lantai, klik tombol lantai pada bagian atas layar. Pilih lantai berapa yang ingin dilihat.</li>
                            <li>Untuk mengunduh data, klik tombol unduh pada bagian atas layar.</li>
                            <li>Pada tampilan smartphone, tabel riwayat harus digeser dan klik tombol panah untuk melihat data halaman selanjutnya.</li>
                        </ul>
                    </section>
                </div>
            </div>
        </main>
    );
}
