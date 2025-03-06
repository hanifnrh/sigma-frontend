"use client";

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
                    <div className="flex header py-2 px-4 body-light justify-between items-center border-b bg-white">
                        <h1 className='body-bold text-2xl'>Informasi</h1>
                    </div>
                </div>
                <div className="flex flex-col gap-4 w-full h-full p-4">
                    <h1 className="text-indigo-600 text-xl body-bold">
                        Panduan Penggunaan Sistem Monitoring Kandang Ayam
                    </h1>
                    <p className="body-light">
                        Sistem ini dirancang untuk membantu peternak dalam memantau kondisi kandang ayam secara real-time. Berikut adalah beberapa fitur utama dan cara penggunaannya:
                    </p>

                    <section>
                        <h2 className="text-lg body">1. Dasbor</h2>
                        <ul className="list-disc list-inside body-light">
                            <li>Menampilkan data keseluruhan dari kandang.</li>
                            <li>Menyediakan grafik parameter utama seperti suhu, kelembaban, dan kadar amonia.</li>
                            <li>Notifikasi jika ada parameter yang berada di luar batas normal.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg body">2. Data Ayam</h2>
                        <ul className="list-disc list-inside body-light">
                            <li>Digunakan untuk mengelola jumlah ayam dalam kandang.</li>
                            <li>Memantau kapan waktu panen dan kapan perlu melakukan restock ayam baru.</li>
                            <li>Jika ada ayam yang mati, dapat langsung diinput agar sistem menghitung tingkat mortalitas.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg body">3. Perangkat Keras</h2>
                        <ul className="list-disc list-inside body-light">
                            <li>Menampilkan status perangkat yang digunakan dalam kandang.</li>
                            <li>Informasi mengenai daya baterai dan apakah perangkat dalam keadaan aktif atau mati.</li>
                            <li>Memberikan peringatan jika ada perangkat yang tidak berfungsi.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg body">4. Riwayat</h2>
                        <ul className="list-disc list-inside body-light">
                            <li>Menyediakan log data parameter dari waktu ke waktu.</li>
                            <li>Grafik perubahan suhu, kelembaban, dan amonia dalam periode tertentu.</li>
                            <li>Catatan mortalitas ayam dan kinerja kandang berdasarkan data historis.</li>
                        </ul>
                    </section>
                </div>
            </div>
        </main>
    );
}
