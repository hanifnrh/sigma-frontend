"use client";

// UI Components
import Navbar from "@/components/section/navbar-home";
import { AuroraBackground } from "@/components/ui/aurora-background";

export default function Bantuan() {
  return (
    <main className="w-full flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-900 transition-colors duration-300 z-20">
      <Navbar />
      <AuroraBackground className="h-full w-full px-4 md:px-10 xl:px-20 py-40">
        <div
          className="relative flex flex-col gap-6 items-start justify-center px-4 text-left"
        >
          <div className="overflow-visible text-5xl font-bold bg-gradient-to-b from-fuchsia-700 to-indigo-400/40 bg-clip-text text-transparent leading-none text-center w-full">
            Bantuan SIGMA
          </div>
          <p className="text-lg dark:text-neutral-200">
            Halaman ini berisi panduan lengkap dalam menggunakan <span className="font-semibold">SIGMA</span>, mulai dari cara mengakses sistem, memahami data yang ditampilkan, hingga troubleshooting apabila terjadi kendala.
          </p>
          <p className="text-lg dark:text-neutral-200 font-semibold">Cara Menggunakan SIGMA:</p>
          <ul className="text-lg dark:text-neutral-200 list-disc list-inside">
            <li>Masuk ke platform SIGMA melalui website resmi.</li>
            <li>Login menggunakan akun yang telah didaftarkan.</li>
            <li>Akses dashboard untuk melihat parameter kandang secara real-time.</li>
            <li>Gunakan fitur riwayat untuk melihat data yang telah tersimpan.</li>
            <li>Pastikan perangkat keras berfungsi dengan baik agar data yang diterima akurat.</li>
          </ul>
          <p className="text-lg dark:text-neutral-200 font-semibold">Troubleshooting:</p>
          <ul className="text-lg dark:text-neutral-200 list-disc list-inside">
            <li><span className="font-semibold">Tidak bisa login?</span> Pastikan email dan password sudah benar atau reset password jika lupa.</li>
            <li><span className="font-semibold">Data tidak muncul?</span> Periksa koneksi internet dan pastikan perangkat keras terhubung dengan baik.</li>
            <li><span className="font-semibold">Notifikasi error?</span> Cek pesan error yang muncul atau hubungi tim teknis.</li>
          </ul>
          <p className="text-lg dark:text-neutral-200">
            Jika Anda mengalami kendala lain atau membutuhkan bantuan lebih lanjut, hubungi tim dukungan SIGMA melalui email <span className="font-semibold">support@sigma.com</span> atau melalui halaman kontak pada website kami.
          </p>
        </div>
      </AuroraBackground>
    </main>
  );
}
