import { Button } from "@/components/ui/buttons/button";
import { Input } from "@/components/ui/input";
import React, { ChangeEvent, useState } from "react";
import { FaUndo } from "react-icons/fa";

interface AyamCounterProps {
    jumlahAyam: number;
    jumlahAwalAyam: number;  // Add jumlahAwalAyam here
    onUpdateJumlahAyam: (jumlahAyamAwal: number, jumlahAyamBaru: number) => void;
    updateMortalitas: (jumlahAyam: number, ayamMati: number) => void;
    farmingStarted: boolean;
}

const AyamCounter: React.FC<AyamCounterProps> = ({ jumlahAyam, jumlahAwalAyam, onUpdateJumlahAyam, updateMortalitas, farmingStarted }) => {
    const [ayamMati, setAyamMati] = useState<number>(0);
    const [history, setHistory] = useState<number[]>([]);

    const handleAyamMatiChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        // Mengonversi nilai input menjadi angka tanpa nol di depan
        const parsedValue = parseInt(value, 10) || 0;
        setAyamMati(parsedValue);
    };

    const handleUpdateAyamMati = () => {
        // Use jumlahAwalAyam for mortality calculation
        const jumlahAyamBaru = jumlahAyam - ayamMati;
        onUpdateJumlahAyam(jumlahAyam, jumlahAyamBaru);
        updateMortalitas(jumlahAwalAyam, ayamMati);  // Pass jumlahAwalAyam instead of jumlahAyam
        setHistory([...history, ayamMati]);  // Save the history
        setAyamMati(0);  // Reset the input
    };

    const handleUndo = () => {
        if (history.length > 0) {
            const lastValue = history[history.length - 1];
            const newHistory = history.slice(0, -1);
    
            // Kembalikan jumlah ayam ke nilai sebelumnya
            onUpdateJumlahAyam(jumlahAyam, jumlahAyam + lastValue);
    
            // Kembalikan data mortalitas ke API
            updateMortalitas(jumlahAwalAyam, -lastValue);  // Mengurangi mortalitas dengan nilai yang di-undo
    
            // Perbarui state history
            setHistory(newHistory);
        }
    };

    return (
        <div className="py-6 px-12 h-full flex justify-center items-center flex-col dark:bg-zinc-950">
            <h2 className="text-xl">Kendali Jumlah Ayam</h2>
            <div className="text-3xl font-bold my-4">{jumlahAyam}</div>

            <div className="flex flex-col items-center mt-4">
                <Input
                    type="number"
                    placeholder="Masukkan jumlah ayam mati"
                    value={ayamMati || ""}
                    onChange={handleAyamMatiChange}
                    className="mb-4"
                />
                <Button
                    disabled={!farmingStarted}
                    variant={'blue'}
                    onClick={handleUpdateAyamMati}
                    className="mb-2 w-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900 transition-all"
                >
                    Kurangi Jumlah Ayam
                </Button>
                <Button
                    disabled={!farmingStarted}
                    onClick={handleUndo}
                    className="w-full bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900 transition-all"
                >
                    <FaUndo className="mr-2" />
                    Undo
                </Button>
            </div>
        </div>
    );
};

export default AyamCounter;
