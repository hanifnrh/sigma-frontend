import { Input } from "@/components/ui/input";
import React, { ChangeEvent, useState } from "react";
import { FaUndo } from "react-icons/fa";
import { Button } from "../ui/button";

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
        const lastValue = history.pop();
        if (lastValue !== undefined) {
            onUpdateJumlahAyam(1, jumlahAyam + lastValue);
            setHistory([...history]);  // Update history after undo
        }
    };

    return (
        <div className="py-6 px-12 h-full flex justify-center items-center flex-col">
            <h2 className="text-xl">Kendali Jumlah Ayam</h2>
            <div className="text-3xl body-bold my-4">{jumlahAyam}</div>

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
                    className="mb-2 w-full"
                >
                    Kurangi Jumlah Ayam
                </Button>
                <Button
                    disabled={!farmingStarted}
                    variant={'baik'}
                    onClick={handleUndo}
                    className="w-full"
                >
                    <FaUndo className="mr-2" />
                    Undo
                </Button>
            </div>
        </div>
    );
};

export default AyamCounter;
