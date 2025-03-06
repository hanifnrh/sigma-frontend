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
import { useChickenContext } from "../../context/ChickenContext";

type Aktivitas = {
    timestamp: string;
    perubahan: number;
};

export function Aktivitas() {
    const { historyData } = useChickenContext();
    const [aktivitasList, setAktivitasList] = useState<Aktivitas[]>([]);

    useEffect(() => {
        const trackAktivitas = () => {
            if (!historyData || historyData.length === 0) return;

            // Urutkan data dari yang paling lama ke terbaru
            const sortedHistory = [...historyData].sort(
                (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
            );

            const aktivitas: Aktivitas[] = [];
            let prevJumlahAyam = sortedHistory[0].data_ayam_details.jumlah_ayam || 0;

            for (let i = 1; i < sortedHistory.length; i++) {
                const currJumlahAyam = sortedHistory[i].data_ayam_details.jumlah_ayam || 0;

                if (currJumlahAyam < prevJumlahAyam) {
                    aktivitas.push({
                        timestamp: new Date(sortedHistory[i].timestamp).toLocaleString(),
                        perubahan: prevJumlahAyam - currJumlahAyam,
                    });
                }

                prevJumlahAyam = currJumlahAyam;
            }

            setAktivitasList(aktivitas);
        };

        trackAktivitas();
    }, [historyData]);

    return (
        <Card className="w-full">
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Aktivitas</TableHead>
                            <TableHead>Waktu</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {aktivitasList.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">
                                    Jumlah ayam berkurang {item.perubahan}
                                </TableCell>
                                <TableCell className="font-medium">
                                    {item.timestamp}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
