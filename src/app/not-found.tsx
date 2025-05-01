import { GradientButton } from "@/components/ui/gradient-button";
import { House } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
    return (
        <main>
            <section className="h-screen flex items-center z-10">
                <div className="w-full h-fit text-purple-600 gap-x-12 flex items-center justify-center p-8 pb-0 sm:py-20 gap-16 px-8 md:px-20 2xl:px-52">
                    <div className="flex flex-col w-full justify-center items-center space-y-5 sm:max-w-lg md:px-0 lg:max-w-xl">
                        <h1 className="text-4xl sm:text-3xl lg:text-5xl">
                            ⛔
                        </h1>
                        <h2 className="font-semibold text-4xl sm:text-3xl font-semibold tracking-tighter lg:text-5xl text-transparent bg-clip-text bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)]">
                            404 Page Not Found
                        </h2>
                        <p className="font-semibold text-center text-zinc-700 text-md lg:text-lg">
                            Halaman yang Anda cari tidak ditemukan. Mungkin sudah dihapus, namanya diubah, atau tidak tersedia sementara.
                        </p>
                        <div className="flex gap-2">
                            <Link
                                href="/"
                                rel="canonical"
                            >
                                <GradientButton> <House className="mr-2" />Kembali ke halaman utama</GradientButton>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}