import { useParameterContext2 } from "@/components/context/lantai-dua/ParameterContext2";
import { Card, CardContent } from "@/components/ui/card";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useChickenContext } from "../../context/ChickenContext";
import { useParameterContext } from "../../context/lantai-satu/ParameterContext";
import { Button } from "../../ui/buttons/button";

interface RiwayatTableRef {
    getFilteredData: () => CombinedHistory[];
}

type RiwayatTableProps = {
    lantai: number;
    selectedTime: string;
};

export type CombinedHistory = {
    timestamp: string;
    temperature?: number | null;
    humidity?: number | null;
    ammonia?: number | null;
    score?: number | null;
    status?: string | null;
    jumlah_ayam?: number | null;
    mortalitas?: number | null;
    usia_ayam?: number | null;
};

const roundToNearest5Minutes = (timestamp: Date) => {
    const newTimestamp = new Date(timestamp.getTime());
    const minutes = Math.floor(newTimestamp.getMinutes() / 5) * 5;
    newTimestamp.setMinutes(minutes, 0, 0);
    return newTimestamp;
};


export const RiwayatTable = forwardRef<RiwayatTableRef, RiwayatTableProps>(
    function RiwayatTable({ lantai, selectedTime }, ref) {
        const { historyParameter: historyParameter1 } = useParameterContext();
        const { historyParameter: historyParameter2 } = useParameterContext2();
        const { historyData } = useChickenContext();

        const [combinedHistory, setCombinedHistory] = useState<CombinedHistory[]>([]);

        const [currentPage, setCurrentPage] = useState(1);
        const itemsPerPage = 10;

        useEffect(() => {
            const historyParameter = lantai === 1 ? historyParameter1 : historyParameter2;

            const mergeData = () => {
                const dataMap = new Map<string, CombinedHistory>();
                const historyParameter = lantai === 1 ? historyParameter1 : historyParameter2;

                // 1. Process all parameter data first
                historyParameter.forEach(param => {
                    const roundedTimestamp = roundToNearest5Minutes(new Date(param.timestamp)).toISOString();
                    dataMap.set(roundedTimestamp, {
                        timestamp: param.timestamp, // Keep original timestamp for display
                        temperature: param.temperature,
                        humidity: param.humidity,
                        ammonia: param.ammonia,
                        score: param.score,
                        status: param.status,
                        // Initialize chicken data as undefined
                        jumlah_ayam: undefined,
                        mortalitas: undefined,
                        usia_ayam: undefined
                    });
                });

                // 2. Process all chicken data
                historyData.forEach(ayam => {
                    const roundedTimestamp = roundToNearest5Minutes(new Date(ayam.timestamp)).toISOString();
                    const existingEntry = dataMap.get(roundedTimestamp);

                    if (existingEntry) {
                        // Update existing entry with chicken data
                        dataMap.set(roundedTimestamp, {
                            ...existingEntry,
                            jumlah_ayam: ayam.data_ayam_details.jumlah_ayam,
                            mortalitas: ayam.data_ayam_details.mortalitas,
                            usia_ayam: ayam.data_ayam_details.usia_ayam
                        });
                    } else {
                        // Create new entry with just chicken data
                        dataMap.set(roundedTimestamp, {
                            timestamp: ayam.timestamp, // Keep original timestamp
                            temperature: undefined,
                            humidity: undefined,
                            ammonia: undefined,
                            score: undefined,
                            status: undefined,
                            jumlah_ayam: ayam.data_ayam_details.jumlah_ayam,
                            mortalitas: ayam.data_ayam_details.mortalitas,
                            usia_ayam: ayam.data_ayam_details.usia_ayam
                        });
                    }
                });

                // 3. Convert to array and sort by timestamp (newest first)
                const mergedArray = Array.from(dataMap.values()).sort(
                    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                );

                console.log('Merged data:', mergedArray);
                setCombinedHistory(mergedArray);
            };
            // error bugging
            console.log('History Parameter 1:', historyParameter1);
            console.log('History Parameter 2:', historyParameter2);
            console.log('History Chicken Data:', historyData);
            console.log(`Selected historyParameter for floor ${lantai}:`, historyParameter);

            mergeData();
        }, [historyParameter1, historyParameter2, lantai, historyData]);

        const filterDataByTime = (data: CombinedHistory[]) => {
            if (selectedTime === "all") return data;

            const now = new Date().getTime();
            const timeLimit = {
                "1h": 1 * 60 * 60 * 1000,
                "1d": 24 * 60 * 60 * 1000,
                "1w": 7 * 24 * 60 * 60 * 1000,
            }[selectedTime];

            if (timeLimit === undefined) return data;
            return data.filter((item) => {
                const itemTime = new Date(item.timestamp).getTime();
                return now - itemTime <= timeLimit;
            });
        };


        const filteredHistory = filterDataByTime(combinedHistory);

        // Hitung data yang akan ditampilkan berdasarkan halaman saat ini
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = filteredHistory.slice(indexOfFirstItem, indexOfLastItem);

        useEffect(() => {
            setCurrentPage(1);
        }, [selectedTime, combinedHistory]);

        // Hitung total halaman
        const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

        // Fungsi untuk mengubah halaman
        const handlePageChange = (page: number) => {
            setCurrentPage(page);
        };

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
                    return "empty";
            }
        };

        useImperativeHandle(ref, () => ({
            getFilteredData: () => {
                return filteredHistory.map(item => ({
                    timestamp: item.timestamp,
                    temperature: item.temperature,
                    humidity: item.humidity,
                    ammonia: item.ammonia,
                    jumlah_ayam: item.jumlah_ayam,
                    mortalitas: item.mortalitas,
                    usia_ayam: item.usia_ayam,
                    score: item.score,
                    status: item.status
                }));
            }
        }));


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
                            {currentItems.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-semibold">
                                        {item.timestamp ? new Date(item.timestamp).toLocaleString() : '-'}
                                    </TableCell>
                                    <TableCell className="font-semibold">
                                        {item.temperature !== undefined && item.temperature !== null ? `${item.temperature.toFixed(2)} °C` : '-'}
                                    </TableCell>
                                    <TableCell className="font-semibold">
                                        {item.humidity !== undefined && item.humidity !== null ? `${item.humidity.toFixed(2)} %` : '-'}
                                    </TableCell>
                                    <TableCell className="font-semibold">
                                        {item.ammonia !== undefined && item.ammonia !== null ? `${item.ammonia.toFixed(2)} ppm` : '-'}
                                    </TableCell>
                                    <TableCell className="font-semibold">
                                        {item.jumlah_ayam !== undefined && item.jumlah_ayam !== null ? `${item.jumlah_ayam} ekor` : '-'}
                                    </TableCell>
                                    <TableCell className="font-semibold">
                                        {item.mortalitas !== undefined && item.mortalitas !== null ? `${((item.mortalitas) * 100).toFixed(2)} %` : '-'}
                                    </TableCell>
                                    <TableCell className="font-semibold">
                                        {item.usia_ayam !== undefined && item.usia_ayam !== null ? `${item.usia_ayam} hari` : '-'}
                                    </TableCell>
                                    <TableCell className="font-semibold">
                                        {typeof item.score === 'number' && !isNaN(item.score) ? item.score.toFixed(2) : '-'}
                                    </TableCell>
                                    <TableCell>
                                        <Button variant={getButtonVariant(item.status ?? "empty")}>
                                            {item.status ?? 'N/A'}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Pagination className="hidden sm:block mt-4">
                        <PaginationContent>
                            {/* Tombol Previous */}
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    aria-disabled={currentPage === 1}
                                    className={currentPage === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                                    size={undefined}
                                />
                            </PaginationItem>

                            {/* Nomor Halaman */}
                            {totalPages > 1 && (
                                <>
                                    {/* Halaman pertama selalu tampil */}
                                    <PaginationItem>
                                        <PaginationLink
                                            onClick={() => handlePageChange(1)}
                                            isActive={currentPage === 1}
                                        >
                                            1
                                        </PaginationLink>
                                    </PaginationItem>

                                    {/* Ellipsis jika currentPage lebih dari 3 */}
                                    {currentPage > 3 && (
                                        <PaginationItem>
                                            <PaginationEllipsis />
                                        </PaginationItem>
                                    )}

                                    {/* 2 halaman sebelum & setelah halaman aktif */}
                                    {Array.from({ length: totalPages }, (_, index) => index + 1)
                                        .filter(
                                            (page) =>
                                                page !== 1 &&
                                                page !== totalPages &&
                                                Math.abs(currentPage - page) <= 2
                                        )
                                        .map((page) => (
                                            <PaginationItem key={page}>
                                                <PaginationLink
                                                    onClick={() => handlePageChange(page)}
                                                    isActive={currentPage === page}
                                                >
                                                    {page}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}

                                    {/* Ellipsis sebelum halaman terakhir */}
                                    {currentPage < totalPages - 2 && (
                                        <PaginationItem>
                                            <PaginationEllipsis />
                                        </PaginationItem>
                                    )}

                                    {/* Halaman terakhir selalu tampil */}
                                    <PaginationItem>
                                        <PaginationLink
                                            onClick={() => handlePageChange(totalPages)}
                                            isActive={currentPage === totalPages}
                                        >
                                            {totalPages}
                                        </PaginationLink>
                                    </PaginationItem>
                                </>
                            )}


                            {/* Tombol Next */}
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    aria-disabled={currentPage === totalPages}
                                    className={currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                                    size={undefined}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>

                    <Pagination className="sm:hidden mt-4">
                        <PaginationContent>
                            {/* Tombol Previous */}
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    aria-disabled={currentPage === 1}
                                    className={currentPage === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                                />
                            </PaginationItem>

                            {/* Page 1 (kalau bukan halaman aktif) */}
                            {currentPage !== 1 && (
                                <PaginationItem>
                                    <PaginationLink onClick={() => handlePageChange(1)}>
                                        1
                                    </PaginationLink>
                                </PaginationItem>
                            )}

                            {/* Current Page */}
                            <PaginationItem>
                                <PaginationLink isActive>
                                    {currentPage}
                                </PaginationLink>
                            </PaginationItem>

                            {/* Page terakhir (kalau bukan halaman aktif) */}
                            {currentPage !== totalPages && (
                                <PaginationItem>
                                    <PaginationLink onClick={() => handlePageChange(totalPages)}>
                                        {totalPages}
                                    </PaginationLink>
                                </PaginationItem>
                            )}

                            {/* Tombol Next */}
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    aria-disabled={currentPage === totalPages}
                                    className={currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>

                </CardContent>
            </Card>
        );
    })