// utils/exportHistoryToXLSX.ts
import { getCookie } from 'cookies-next';
import * as XLSX from 'xlsx';

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
        const chickenHistory = await chickenHistoryRes.json();

        // Fetch all parameter history
        const paramRes = await fetch(
            `https://sigma-backend-production.up.railway.app/api/parameters/floor/${floor}/`,
            { credentials: "include", headers: { "Authorization": `Bearer ${token}` } }
        );
        const paramHistory = await paramRes.json();

        // 2. Create a map to combine data by rounded timestamp
        const dataMap = new Map<string, any>();

        // Process parameter data first
        paramHistory.forEach((param: any) => {
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
                // Chicken data will be added later if found
            });
        });

        // Process chicken data
        chickenHistory.forEach((chicken: any) => {
            const roundedTime = new Date(chicken.timestamp);
            roundedTime.setMinutes(Math.floor(roundedTime.getMinutes() / 5) * 5, 0, 0);
            const timeKey = roundedTime.toISOString();

            if (dataMap.has(timeKey)) {
                // Update existing entry with chicken data
                const existing = dataMap.get(timeKey);
                dataMap.set(timeKey, {
                    ...existing,
                    jumlah_ayam: chicken.data_ayam_details?.jumlah_ayam,
                    mortalitas: chicken.data_ayam_details?.mortalitas,
                    usia_ayam: chicken.data_ayam_details?.usia_ayam,
                });
            } else {
                // Create new entry with just chicken data
                dataMap.set(timeKey, {
                    timestamp: chicken.timestamp,
                    jumlah_ayam: chicken.data_ayam_details?.jumlah_ayam,
                    mortalitas: chicken.data_ayam_details?.mortalitas,
                    usia_ayam: chicken.data_ayam_details?.usia_ayam,
                    // Parameters will remain undefined
                });
            }
        });

        // 3. Convert map to array and sort by timestamp
        const combinedData = Array.from(dataMap.values()).sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        // 4. Format for Excel with proper fallbacks
        const excelData = combinedData.map((item) => ({
            "Waktu": item.timestamp ? new Date(item.timestamp).toLocaleString() : "-",
            "Suhu (°C)": item.temperature !== undefined ? item.temperature?.toFixed(2) : "-",
            "Kelembapan (%)": item.humidity !== undefined ? item.humidity?.toFixed(2) : "-",
            "Amonia (ppm)": item.ammonia !== undefined ? item.ammonia?.toFixed(2) : "-",
            "Jumlah Ayam": item.jumlah_ayam !== undefined ? `${item.jumlah_ayam} ekor` : "-",
            "Mortalitas (%)": item.mortalitas !== undefined ? (item.mortalitas * 100).toFixed(2) : "-",
            "Usia Ayam (hari)": item.usia_ayam !== undefined ? item.usia_ayam : "-",
            "Skor": item.score !== undefined ? item.score?.toFixed(2) : "-",
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