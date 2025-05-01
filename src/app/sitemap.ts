import { MetadataRoute } from "next";

export const baseUrl = "https://www.sigma-ta.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

    const staticRoutes = [
        { url: `${baseUrl}/`, lastModified: new Date().toISOString() },
        { url: `${baseUrl}/tentang`, lastModified: new Date().toISOString() },
        { url: `${baseUrl}/bantuan`, lastModified: new Date().toISOString() },
        { url: `${baseUrl}/login`, lastModified: new Date().toISOString() },
        { url: `${baseUrl}/staf/dashboard`, lastModified: new Date().toISOString() },
        { url: `${baseUrl}/staf/data-ayam`, lastModified: new Date().toISOString() },
        { url: `${baseUrl}/staf/grafik`, lastModified: new Date().toISOString() },
        { url: `${baseUrl}/staf/informasi`, lastModified: new Date().toISOString() },
        { url: `${baseUrl}/staf/perangkat-keras`, lastModified: new Date().toISOString() },
        { url: `${baseUrl}/staf/profile`, lastModified: new Date().toISOString() },
        { url: `${baseUrl}/staf/riwayat`, lastModified: new Date().toISOString() },
        { url: `${baseUrl}/staf/standar-operasional`, lastModified: new Date().toISOString() },
        { url: `${baseUrl}/staf/umpan-balik`, lastModified: new Date().toISOString() },
        { url: `${baseUrl}/pemilik/dashboard`, lastModified: new Date().toISOString() },
        { url: `${baseUrl}/pemilik/data-ayam`, lastModified: new Date().toISOString() },
        { url: `${baseUrl}/pemilik/grafik`, lastModified: new Date().toISOString() },
        { url: `${baseUrl}/pemilik/informasi`, lastModified: new Date().toISOString() },
        { url: `${baseUrl}/pemilik/perangkat-keras`, lastModified: new Date().toISOString() },
        { url: `${baseUrl}/pemilik/profile`, lastModified: new Date().toISOString() },
        { url: `${baseUrl}/pemilik/riwayat`, lastModified: new Date().toISOString() },
        { url: `${baseUrl}/pemilik/standar-operasional`, lastModified: new Date().toISOString() },
        { url: `${baseUrl}/pemilik/umpan-balik`, lastModified: new Date().toISOString() },
        { url: `${baseUrl}/tamu/dashboard`, lastModified: new Date().toISOString() },
        { url: `${baseUrl}/tamu/data-ayam`, lastModified: new Date().toISOString() },
        { url: `${baseUrl}/tamu/grafik`, lastModified: new Date().toISOString() },
        { url: `${baseUrl}/tamu/informasi`, lastModified: new Date().toISOString() },
        { url: `${baseUrl}/tamu/perangkat-keras`, lastModified: new Date().toISOString() },
        { url: `${baseUrl}/tamu/profile`, lastModified: new Date().toISOString() },
        { url: `${baseUrl}/tamu/riwayat`, lastModified: new Date().toISOString() },
        { url: `${baseUrl}/tamu/standar-operasional`, lastModified: new Date().toISOString() },
        { url: `${baseUrl}/tamu/umpan-balik`, lastModified: new Date().toISOString() },
        
    ];


    return [...staticRoutes];
}
