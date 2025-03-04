"use client";

// UI Components
import Navbar from "@/components/section/navbar-home";
import { AuroraBackground } from "@/components/ui/aurora-background";

export default function Tentang() {
  return (
    <main className="w-full flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-900 transition-colors duration-300 z-20">
      <Navbar />
      <AuroraBackground className="h-full w-full px-4 md:px-10 xl:px-20 py-40">
        <div
          className="relative flex flex-col gap-6 items-start justify-center px-4 text-left"
        >
          <div className="overflow-visible text-5xl font-bold bg-gradient-to-b from-fuchsia-700 to-indigo-400/40 bg-clip-text text-transparent leading-none text-center w-full">
            Tentang SIGMA
          </div>
          <p className="text-lg dark:text-neutral-200">
            SIGMA adalah <span className="font-semibold">Sistem IoT Terintegrasi Monitoring Kandang Ayam</span> yang dikembangkan untuk membantu pemantauan kandang <span className="italic">closed house</span>. Dengan SIGMA, peternak dapat melihat statistik dan data parameter kandang secara real-time, memastikan lingkungan tetap optimal untuk pertumbuhan ayam.
          </p>
          <p className="text-lg dark:text-neutral-200">
            Proyek ini merupakan bagian dari <span className="font-semibold">Capstone Project Kelompok 23</span> yang menjadi syarat kelulusan bagi mahasiswa Teknik Komputer, Universitas Diponegoro. Tim pengembang terdiri dari:
          </p>
          <ul className="text-lg dark:text-neutral-200 list-disc list-inside">
            <li>Nurrahmat Hanif</li>
            <li>Muhammad Rayhan Khadafi</li>
            <li>Farrel Asyraf Abrar</li>
          </ul>
          <p className="text-lg dark:text-neutral-200">
            SIGMA dibangun menggunakan kombinasi teknologi canggih untuk memastikan kehandalan sistem:
          </p>
          <ul className="text-lg dark:text-neutral-200 list-disc list-inside">
            <li>
              <span className="font-semibold">Perangkat Keras:</span> Menggunakan <span className="font-semibold">ESP32</span> sebagai otak utama, dengan sensor <span className="font-semibold">DFRobot</span> dan <span className="font-semibold">DHT22</span> untuk memantau suhu, kelembaban, dan kadar amonia.
            </li>
            <li>
              <span className="font-semibold">Backend:</span> Dibangun dengan <span className="font-semibold">Django</span> dan <span className="font-semibold">PostgreSQL</span> untuk pengelolaan data yang efisien.
            </li>
            <li>
              <span className="font-semibold">Deployment Backend:</span> Menggunakan <span className="font-semibold">Railway</span> untuk kestabilan akses data.
            </li>
            <li>
              <span className="font-semibold">Frontend:</span> Dikembangkan dengan <span className="font-semibold">Next.js</span> untuk antarmuka pengguna yang modern dan responsif.
            </li>
            <li>
              <span className="font-semibold">Deployment Frontend:</span> Dihosting di <span className="font-semibold">Vercel</span> untuk performa yang optimal.
            </li>
          </ul>
          <p className="text-lg dark:text-neutral-200">
            Dengan pendekatan berbasis teknologi ini, SIGMA hadir sebagai solusi inovatif untuk industri peternakan ayam. Sistem ini membantu peternak dalam mengontrol kondisi kandang dengan lebih mudah, meningkatkan efisiensi produksi, serta menjaga kesehatan ayam secara lebih efektif.
          </p>
        </div>
      </AuroraBackground>
    </main>
  );
}
