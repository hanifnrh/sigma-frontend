import { CalendarIcon, FileTextIcon } from "@radix-ui/react-icons";
import { BellIcon, Share2Icon } from "lucide-react";

import { AnimatedBeamMultipleOutputDemo } from "@/components/magicui/animated-beam-demo";
import { AnimatedListDemo } from "@/components/magicui/animated-list-demo";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import { Marquee } from "@/components/magicui/marquee";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const files = [
    {
        name: "amonia.xlsx",
        body: "Kondisi amonia disimpan dalam file dalam setiap kurun waktu tertentu dan dapat diunduh.",
    },
    {
        name: "jumlah-ayam.xlsx",
        body: "Data jumlah ayam dihitung dan diolah untuk menentukan mortalitas dan batas aman.",
    },
    {
        name: "temperatur.xlsx",
        body: "Temperatur kandang dapat dipantau dan tercatat dalam file terstruktur untuk memantau tingkat suhu kandang.",
    },
    {
        name: "humidity.xlsx",
        body: "Kelembapan kandang dicatat dalam database dan terstruktur. Data dapat diunduh kapanpun.",
    },
    {
        name: "usia-ayam.tsx",
        body: "Usia ayam otomatis terbuat dan menjadi satu tabel dengan data yang lain, dapat diunduh sehingga mudah dilihat.",
    },
];

const features = [
    {
        Icon: FileTextIcon,
        name: "Penyimpanan riwayat",
        description: "Riwayat keadaan kandang tersimpan secara otomatis.",
        href: "/login",
        cta: "Selengkapnya",
        className: "col-span-3 lg:col-span-1",
        background: (
            <Marquee
                pauseOnHover
                className="absolute top-10 [--duration:20s] [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] "
            >
                {files.map((f, idx) => (
                    <figure
                        key={idx}
                        className={cn(
                            "relative w-32 cursor-pointer overflow-hidden rounded-xl border p-4",
                            "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
                            "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
                            "transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none",
                        )}
                    >
                        <div className="flex flex-row items-center gap-2">
                            <div className="flex flex-col">
                                <figcaption className="text-sm font-medium dark:text-white ">
                                    {f.name}
                                </figcaption>
                            </div>
                        </div>
                        <blockquote className="mt-2 text-xs">{f.body}</blockquote>
                    </figure>
                ))}
            </Marquee>
        ),
    },
    {
        Icon: BellIcon,
        name: "Notifikasi",
        description: "Sistem akan memberikan notifikasi jika kadar parameter melewati batas aman ataupun ketika sudah waktu panen.",
        href: "/login",
        cta: "Selengkapnya",
        className: "col-span-3 lg:col-span-2",
        background: (
            <AnimatedListDemo className="absolute right-2 top-4 h-[300px] w-full scale-75 border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-90" />
        ),
    },
    {
        Icon: Share2Icon,
        name: "Integrasi",
        description: "Menggunakan teknologi terbaik yang diintegrasikan demi kenyamanan pengguna.",
        href: "/login",
        cta: "Selengkapnya",
        className: "col-span-3 lg:col-span-2",
        background: (
            <AnimatedBeamMultipleOutputDemo className="absolute right-2 top-4 h-[300px] border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105" />
        ),
    },
    {
        Icon: CalendarIcon,
        name: "Kendali Panen",
        description: "Kendalikan jadwal panen ayam untuk mendapatkan notifikasi.",
        className: "col-span-3 lg:col-span-1",
        href: "/login",
        cta: "Selengkapnya",
        background: (
            <Calendar
                mode="single"
                selected={new Date(2022, 4, 11, 0, 0, 0)}
                className="absolute right-0 top-10 origin-top scale-75 rounded-md border transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] group-hover:scale-90"
            />
        ),
    },
];

export function BentoDemo() {
    return (
        <BentoGrid>
            {features.map((feature, idx) => (
                <BentoCard key={idx} {...feature} />
            ))}
        </BentoGrid>
    );
}
