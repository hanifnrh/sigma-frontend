import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import "./globals.css";
import { baseUrl } from "./sitemap";

export const metadata: Metadata = {
  metadataBase: baseUrl ? new URL(baseUrl) : undefined,
  applicationName: "SIGMA",
  title: {
    default: "SIGMA - Sistem IoT Terintegrasi Monitoring Kandang Ayam",
    template: "%s - SIGMA",
  },
  keywords: [
    "SIGMA",
    "SIGMA TA",
    "SIGMA TA UNDIP",
    "Capstone UNDIP",
    "Nurrahmat Hanif",
    "Muhammad Rayhan Khadafi",
    "Farrel Asyraf Abrar",
  ],
  verification: {
    google: "",
  },
  icons: {
    icon: `/favicon.ico`,
  },
  description:
    "SIGMA adalah IoT-based integrated system untuk monitoring peternakan ayam, menyajikan data real-time dan analisis untuk meningkatkan efisiensi dan produktivitas.",
  openGraph: {
    title: "SIGMA - Sistem IoT Terintegrasi Monitoring Kandang Ayam",
    url: baseUrl,
    siteName: "SIGMA",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `/sigmadasbor.png`,
        alt: "SIGMA",
        width: 1200,
        height: 1100,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SIGMA - Sistem IoT Terintegrasi Monitoring Kandang Ayam",
    images: [`/sigmadasbor.png`],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
