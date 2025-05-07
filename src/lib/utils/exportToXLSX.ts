// utils/exportHistoryToXLSX.ts
import { getCookie } from 'cookies-next';
import * as XLSX from 'xlsx';

interface ParameterData {
    timestamp: string;
    temperature: number | null;
    humidity: number | null;
    ammonia: number | null;
    score: number | null;
    status: string | null;
}

interface ChickenData {
    timestamp: string;
    data_ayam_details: {
        jumlah_ayam: number | null;
        mortalitas: number | null;
        usia_ayam: number | null;
    };
}

interface CombinedData {
    timestamp: string;
    temperature?: number | null;
    humidity?: number | null;
    ammonia?: number | null;
    score?: number | null;
    status?: string | null;
    jumlah_ayam?: number | null;
    mortalitas?: number | null;
    usia_ayam?: number | null;
}

interface ExcelData {
    "Waktu": string;
    "Suhu (°C)": string | number;
    "Kelembapan (%)": string | number;
    "Amonia (ppm)": string | number;
    "Jumlah Ayam": string | number;
    "Mortalitas (%)": string | number;
    "Usia Ayam (hari)": string | number;
    "Skor": string | number;
    "Status": string;
}

export const exportHistoryToXLSX = async (floor: number) => {
    try {
        // 1. Fetch data from both APIs
        const token = getCookie("accessToken");
        if (!token) throw new Error("No access token available");

        // Fetch all chicken history
        const chickenHistoryRes = await fetch(
            `https://sigma-backend-production.up.railway.app/api/data-ayam/history-all/`,
            { credentials: "include", headers: { "Authorization": `Bearer ${token}` } }
        );
        const chickenHistory: ChickenData[] = await chickenHistoryRes.json();

        // Fetch all parameter history
        const paramRes = await fetch(
            `https://sigma-backend-production.up.railway.app/api/parameters/floor/${floor}/`,
            { credentials: "include", headers: { "Authorization": `Bearer ${token}` } }
        );
        const paramHistory: ParameterData[] = await paramRes.json();

        // 2. Create a map to combine data by rounded timestamp
        const dataMap = new Map<string, CombinedData>();

        // Process parameter data first
        paramHistory.forEach((param: ParameterData) => {
            const roundedTime = new Date(param.timestamp);
            roundedTime.setMinutes(Math.floor(roundedTime.getMinutes() / 5) * 5, 0, 0);
            const timeKey = roundedTime.toISOString();

            dataMap.set(timeKey, {
                timestamp: param.timestamp,
                temperature: param.temperature,
                humidity: param.humidity,
                ammonia: param.ammonia,
                score: param.score,
                status: param.status,
            });
        });

        // Process chicken data
        chickenHistory.forEach((chicken: ChickenData) => {
            const roundedTime = new Date(chicken.timestamp);
            roundedTime.setMinutes(Math.floor(roundedTime.getMinutes() / 5) * 5, 0, 0);
            const timeKey = roundedTime.toISOString();

            const existingData = dataMap.get(timeKey);
            dataMap.set(timeKey, {
                ...existingData,
                timestamp: chicken.timestamp,
                jumlah_ayam: chicken.data_ayam_details.jumlah_ayam,
                mortalitas: chicken.data_ayam_details.mortalitas,
                usia_ayam: chicken.data_ayam_details.usia_ayam,
            });
        });

        // 3. Convert map to array and sort by timestamp
        const combinedData = Array.from(dataMap.values()).sort((a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        // 4. Format for Excel with proper fallbacks
        const excelData: ExcelData[] = combinedData.map((item) => ({
            "Waktu": item.timestamp ? new Date(item.timestamp).toLocaleString() : "-",
            "Suhu (°C)": item.temperature !== undefined && item.temperature !== null ? Number(item.temperature.toFixed(2)) : "-",
            "Kelembapan (%)": item.humidity !== undefined && item.humidity !== null ? Number(item.humidity.toFixed(2)) : "-",
            "Amonia (ppm)": item.ammonia !== undefined && item.ammonia !== null ? Number(item.ammonia.toFixed(2)) : "-",
            "Jumlah Ayam": item.jumlah_ayam !== undefined && item.jumlah_ayam !== null ? `${item.jumlah_ayam} ekor` : "-",
            "Mortalitas (%)": item.mortalitas !== undefined && item.mortalitas !== null ? Number((item.mortalitas * 100).toFixed(2)) : "-",
            "Usia Ayam (hari)": item.usia_ayam !== undefined && item.usia_ayam !== null ? item.usia_ayam : "-",
            "Skor": item.score !== undefined && item.score !== null ? Number(item.score.toFixed(2)) : "-",
            "Status": item.status || "N/A"
        }));

        // 5. Create and download Excel file
        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "History Data");
        XLSX.writeFile(wb, `history_lantai_${floor}_${new Date().toISOString().split('T')[0]}.xlsx`);

    } catch (error) {
        console.error("Export failed:", error);
        alert("Export failed. Please check console for details.");
    }
};