import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { useChickenContext } from "../../../components/context/ChickenContext";
import { useParameterContext } from "../../../components/context/lantai-satu/ParameterContext";
import { Button } from "../../../components/ui/buttons/button";

type CombinedHistory = {
    timestamp: string; // Ubah dari Date | undefined ke string
    temperature?: number | null;
    humidity?: number | null;
    ammonia?: number | null;
    score?: number | null;
    status?: string | null;
    jumlah_ayam?: number | null;
    mortalitas?: number | null;
    usia_ayam?: number | null;
};

// Helper function to round timestamp to the nearest 5 minutes
const roundToNearest5Minutes = (timestamp: Date) => {
    const newTimestamp = new Date(timestamp.getTime()); // Buat salinan objek Date
    const minutes = Math.floor(newTimestamp.getMinutes() / 5) * 5;
    newTimestamp.setMinutes(minutes, 0, 0);
    return newTimestamp;
};


export function RiwayatTable() {
    const { historyParameter } = useParameterContext();
    const { historyData } = useChickenContext();

    const [combinedHistory, setCombinedHistory] = useState<CombinedHistory[]>([]);

    useEffect(() => {
        const mergeData = () => {
            const dataMap = new Map<string, CombinedHistory>();
            let lastChickenData: { jumlah_ayam?: number; mortalitas?: number; usia_ayam?: number } | null = null;

            // Urutkan historyParameter terbaru ke terlama
            historyParameter.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

            // Simpan data parameter duluan biar gak ketimpa
            historyParameter.forEach((param) => {
                const roundedTimestamp = roundToNearest5Minutes(new Date(param.timestamp)).toISOString();

                if (!dataMap.has(roundedTimestamp)) {
                    dataMap.set(roundedTimestamp, {
                        timestamp: roundedTimestamp,
                        temperature: param.temperature,
                        humidity: param.humidity,
                        ammonia: param.ammonia,
                        score: param.score,
                        status: param.status,
                    });
                }
            });

            // Urutkan historyData dari terbaru ke terlama
            historyData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

            historyData.forEach((ayam) => {
                const roundedTimestamp = roundToNearest5Minutes(new Date(ayam.timestamp)).toISOString();

                lastChickenData = {
                    jumlah_ayam: ayam.data_ayam_details.jumlah_ayam,
                    mortalitas: ayam.data_ayam_details.mortalitas,
                    usia_ayam: ayam.data_ayam_details.usia_ayam,
                };

                if (dataMap.has(roundedTimestamp)) {
                    const existingData = dataMap.get(roundedTimestamp)!;
                    dataMap.set(roundedTimestamp, {
                        ...existingData,
                        ...lastChickenData,
                    });
                } else {
                    dataMap.set(roundedTimestamp, {
                        timestamp: roundedTimestamp,
                        ...lastChickenData,
                    });
                }
            });

            // Terapkan carry forward jika ada data parameter yang belum punya data ayam
            let lastKnownChickenData: Pick<CombinedHistory, 'jumlah_ayam' | 'mortalitas' | 'usia_ayam'> | undefined = undefined;

            Array.from(dataMap.entries()).reverse().forEach(([timestamp, data]) => {
                if (!data.jumlah_ayam && lastKnownChickenData) {
                    dataMap.set(timestamp, {
                        ...data,
                        ...lastKnownChickenData,
                    });
                } else if (data.jumlah_ayam) {
                    lastKnownChickenData = {
                        jumlah_ayam: data.jumlah_ayam,
                        mortalitas: data.mortalitas,
                        usia_ayam: data.usia_ayam,
                    };
                }
            });

            // Convert Map ke array dan urutkan dari terbaru ke terlama
            const mergedArray = Array.from(dataMap.values()).sort(
                (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );

            setCombinedHistory(mergedArray);
        };

        mergeData();
    }, [historyParameter, historyData]);

    const getButtonVariant = (status: string) => {
        switch (status) {
            case "Sangat Baik":
                return "sangatBaik";
            case "Baik":
                return "baik";
            case "Buruk":
                return "buruk";
            case "Bahaya":
                return "bahaya";
            default:
                return "default";
        }
    };

    return (
        <Card className="w-full">
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Waktu</TableHead>
                            <TableHead>Suhu</TableHead>
                            <TableHead>Kelembapan</TableHead>
                            <TableHead>Amonia</TableHead>
                            <TableHead>Jumlah Ayam</TableHead>
                            <TableHead>Mortalitas</TableHead>
                            <TableHead>Usia Ayam</TableHead>
                            <TableHead>Skor</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {combinedHistory.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">
                                    {item.timestamp ? new Date(item.timestamp).toLocaleString() : '-'}
                                </TableCell>
                                <TableCell className="font-medium">
                                    {item.temperature !== undefined && item.temperature !== null ? `${item.temperature.toFixed(2)} °C` : '-'}
                                </TableCell>
                                <TableCell className="font-medium">
                                    {item.humidity !== undefined && item.humidity !== null ? `${item.humidity.toFixed(2)} %` : '-'}
                                </TableCell>
                                <TableCell className="font-medium">
                                    {item.ammonia !== undefined && item.ammonia !== null ? `${item.ammonia.toFixed(2)} ppm` : '-'}
                                </TableCell>
                                <TableCell className="font-medium">
                                    {item.jumlah_ayam !== undefined && item.usia_ayam !== null ? `${item.jumlah_ayam} ekor` : '-'}
                                </TableCell>
                                <TableCell className="font-medium">
                                    {item.mortalitas !== undefined && item.mortalitas !== null ? `${item.mortalitas.toFixed(2)} %` : '-'}
                                </TableCell>
                                <TableCell className="font-medium">
                                    {item.usia_ayam !== undefined && item.usia_ayam !== null ? `${item.usia_ayam} hari` : '-'}
                                </TableCell>
                                <TableCell className="font-medium">
                                    {typeof item.score === 'number' && !isNaN(item.score) ? item.score.toFixed(2) : '-'}
                                </TableCell>
                                <TableCell>
                                    <Button variant={getButtonVariant(item.status ?? "default")}>
                                        {item.status ?? '-'}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}