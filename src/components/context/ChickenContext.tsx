"use client"

import { useNotifications } from "@/components/context/NotificationContext";
import { getCookie, setCookie } from "cookies-next";
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { BsHeartPulse } from "react-icons/bs";
import { FaRegCalendarAlt } from "react-icons/fa";
import { GiRooster } from "react-icons/gi";

type Status = { text: string; color: string };

interface HistoryRecord {
    timestamp: Date;
    jumlah_ayam: number;
    mortalitas: number;
    usia_ayam: number;
}

interface DataAyamContextType {
    // CURRENT DATA
    jumlahAyam: number;
    setJumlahAyam: (jumlahAyam: number) => void;
    mortalitas: number;
    setMortalitas: (mortalitas: number) => void;
    ageInDays: number;
    setAgeInDays: (ageInDays: number) => void;
    jumlahAwalAyam: number;
    setJumlahAwalAyam: (jumlahAwalAyam: number) => void;
    tanggalMulai: Date | null;
    setTanggalMulai: (tanggalMulai: Date) => void;
    targetTanggal: Date | null;
    setTargetTanggal: (targetTanggal: Date | null) => void;
    farmingStarted: boolean;
    setFarmingStarted: (farmingStarted: boolean) => void;
    fetchDataChicken: () => Promise<void>;
    ayamDecreasePercentage: number;
    daysToTarget: number | null;
    statusAyam: { mortalitas: Status; daysToTarget: Status; ayamDecreasePercentage: Status };
    ayamId: number;

    // FUNCTIONS
    harvested: boolean;
    showConfirmHarvestDialog: boolean;
    setHarvested: (value: boolean) => void;
    setShowConfirmHarvestDialog: (value: boolean) => void;
    handleHarvest: () => void;
    confirmHarvest: () => Promise<void>;
    updateAgeInDays: (ageInDays: number) => Promise<void>;
    postJumlahAyam: (jumlahAyam: number, targetTanggal: Date, startDate: Date) => Promise<void>;
    updateJumlahAyam: (jumlahAyamAwal: number, jumlahAyamBaru: number) => Promise<void>;
    updateMortalitas: (JumlahAwalAyam: number, ayamMati: number) => Promise<void>;
    handleStartFarming: (initialCount: number, targetDate: Date | null) => Promise<void>;
    jumlahAyamInput: number;
    setJumlahAyamInput: (value: number) => void;
    handleParameterPanen: () => Promise<void>;
    countdown: string;
    setCountdown: (color: string) => void;
    // HISTORY
    historyData: HistoryRecord[];
    setHistoryData: (historyData: HistoryRecord[]) => void;
}

type Notification = {
    data: string;
    status: string;
    timestamp: Date;
    message: string;
    icon: React.ReactNode;
    color: string;
};

const ChickenContext = createContext<DataAyamContextType | undefined>(undefined);

export const useChickenContext = () => {
    const context = useContext(ChickenContext);
    if (!context) {
        throw new Error("useChickenContext must be used within a ChickenProvider");
    }
    return context;
};

interface ChickenProviderProps {
    children: ReactNode;
}

export const ChickenProvider: React.FC<ChickenProviderProps> = ({ children }) => {
    const { addNotification } = useNotifications();

    // Chicken data states
    const [jumlahAyam, setJumlahAyam] = useState<number>(0);
    const [mortalitas, setMortalitas] = useState<number>(0);
    const [ageInDays, setAgeInDays] = useState<number>(0);
    const [jumlahAwalAyam, setJumlahAwalAyam] = useState<number>(0);
    const [tanggalMulai, setTanggalMulai] = useState<Date | null>(null);
    const [targetTanggal, setTargetTanggal] = useState<Date | null>(null);
    const [farmingStarted, setFarmingStarted] = useState<boolean>(false);
    const [ayamId, setAyamId] = useState<number>(0);

    // Chicken data history states
    const [historyData, setHistoryData] = useState<HistoryRecord[]>([]);

    // Functions handle
    const [countdown, setCountdown] = useState<string>('');
    const [harvested, setHarvested] = useState(false);
    const [showConfirmHarvestDialog, setShowConfirmHarvestDialog] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [harvestDialogOpen, setHarvestDialogOpen] = useState(false);
    const [lastPostedDate, setLastPostedDate] = useState<string>("");
    const { notifications } = useNotifications();
    const sendNotification = (notification: Notification) => {
        addNotification(notification);
    };
    const [jumlahAyamInput, setJumlahAyamInput] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const token = getCookie("accessToken");

    const fetchAccessToken = async () => {
        try {
            const response = await fetch("/api/refresh", {
                method: "POST",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to refresh token.");
            }

            return data.accessToken;
        } catch (error) {
            console.error("Error refreshing token:", error);
            return null;
        }
    };

    const fetchAyamHistory = async () => {
        try {
            // Pastikan token ada
            let token = getCookie("accessToken");

            if (!token) {
                token = await fetchAccessToken();
                if (!token) throw new Error("Failed to obtain new access token.");
                setCookie("accessToken", token, { path: "/" });
            }

            // Fetch data ayam
            const response = await fetch("https://sigma-backend-production.up.railway.app/api/data-ayam/", {
                credentials: "include", // Penting agar cookies dikirim ke backend
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.status === 401) {
                const newToken = await fetchAccessToken();
                if (!newToken) throw new Error("Failed to refresh token.");

                setCookie("accessToken", newToken, { path: "/" });

                const newResponse = await fetch("https://sigma-backend-production.up.railway.app/api/data-ayam/", {
                    credentials: "include",
                    headers: {
                        "Authorization": `Bearer ${newToken}`,
                    },
                });

                if (!newResponse.ok) {
                    throw new Error(`HTTP error! Status: ${newResponse.status}`);
                }

                const newData = await newResponse.json();
                // Proses data baru...
                return;
            }

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
            }

            const allData = await response.json();

            if (allData.length === 0) {
                console.log("No ayam data found.");
                setHistoryData([]); // Set history data ke array kosong
                return;
            }

            // Ambil data pertama
            const record = allData[0];
            const ayamId = record.id;
            setAyamId(ayamId);

            // Fetch history data berdasarkan ayamId (jika diperlukan)
            const historyResponse = await fetch(`https://sigma-backend-production.up.railway.app/api/data-ayam/${ayamId}/history`, {
                credentials: "include", // Penting agar cookies dikirim ke backend
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!historyResponse.ok) {
                throw new Error(`Failed to fetch history for ayam ID: ${ayamId}`);
            }

            const history = await historyResponse.json();

            if (Array.isArray(history)) {
                setHistoryData(history); // Set history data untuk grafik
            } else {
                setHistoryData([]);
                console.log("No history data found.");
            }
        } catch (error) {
            console.error("Error fetching ayam history:", error);
            setHistoryData([]); // Set history data ke array kosong jika terjadi error
        }
    };

    useEffect(() => {
        fetchAyamHistory();
    }, []);

    const handleParameterPanen = async () => {
        setLoading(true);
        setError(null); // Reset error before making the request

        try {
            const response = await fetch('https://sigma-backend-production.up.railway.app/api/parameters/', {
                method: 'DELETE',
                credentials: "include", // Penting agar cookies dikirim ke backend
                headers: {
                    "Authorization": token ? `Bearer ${token}` : "",
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete parameters');
            }

            const data = await response.json();
            alert('All parameters have been deleted!');
            console.log(data); // Response dari server
        } catch (err) {
            setError('Failed to delete parameters');
            console.error('Error deleting parameters:', err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch chicken data
    const fetchDataChicken = useCallback(async () => {
        try {
            const response = await fetch("https://sigma-backend-production.up.railway.app/api/data-ayam/", {
                credentials: "include", // Penting agar cookies dikirim ke backend
                headers: {
                    "Authorization": token ? `Bearer ${token}` : "",
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                const latestData = data[0];
                setJumlahAwalAyam(latestData.jumlah_ayam_awal);
                setTanggalMulai(new Date(latestData.tanggal_mulai));
                setTargetTanggal(new Date(latestData.tanggal_panen));
                setJumlahAyam(latestData.jumlah_ayam);
                setMortalitas(latestData.mortalitas);
                setAgeInDays(latestData.usia_ayam);
                setFarmingStarted(true);
            } else {
                setFarmingStarted(false);
                setJumlahAwalAyam(0);
                setTanggalMulai(new Date());
                setTargetTanggal(new Date());
                setJumlahAyam(0);
                setMortalitas(0);
                setAgeInDays(0);
            }
        } catch (error) {
            console.error('Error fetching ayam data:', error);
            setFarmingStarted(false);
            setJumlahAwalAyam(0);
            setTanggalMulai(new Date());
            setTargetTanggal(new Date());
            setJumlahAyam(0);
            setMortalitas(0);
            setAgeInDays(0);
        }
    }, []);

    useEffect(() => {
        fetchDataChicken();
    }, [fetchDataChicken]);

    const updateAgeInDays = useCallback(async (ageInDays: number) => {
        const data = {
            usia_ayam: ageInDays,  // Send the updated age
        };

        try {
            // Fetch the existing record
            const response = await fetch("https://sigma-backend-production.up.railway.app/api/data-ayam/", {
                credentials: "include", // Penting agar cookies dikirim ke backend
                headers: {
                    "Authorization": token ? `Bearer ${token}` : "",
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch ayam data');
            }

            const allData = await response.json();

            // If there's existing data, update it using the first (or only) record
            if (allData.length > 0) {
                const record = allData[0];  // Assuming there's only one record, we take the first one

                // Send the PATCH request to update the age in the record
                const updateResponse = await fetch(`https://sigma-backend-production.up.railway.app/api/data-ayam/`, {
                    credentials: "include", // Penting agar cookies dikirim ke backend
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": token ? `Bearer ${token}` : "",
                    },
                    body: JSON.stringify(data),
                });

                const result = await updateResponse.json();
                if (!updateResponse.ok) {
                    console.error('Server response error:', result);
                    throw new Error('Failed to update chicken age');
                }

                console.log('Age updated successfully:', result);
            } else {
                console.error('No ayam data found to update.');
            }
        } catch (error) {
            console.error('Error updating age:', error);
            alert('Terjadi kesalahan saat memperbarui usia ayam.');
        }
    }, []);

    const postJumlahAyam = async (jumlahAyam: number, targetTanggal: Date, startDate: Date) => {
        const data = {
            jumlah_ayam_awal: jumlahAyam, // Anggap jumlah ayam awal sama dengan jumlah ayam yang dikirim
            tanggal_mulai: startDate.toISOString().split('T')[0],
            tanggal_panen: targetTanggal.toISOString().split('T')[0], // Hanya ambil bagian tanggal saja
            jumlah_ayam: jumlahAyam, // Jumlah ayam saat ini
            mortalitas: 0, // Nilai default, misalnya 0 untuk awal
            usia_ayam: 0 // Usia awal ayam, diisi 0 misalnya
        };

        try {
            const response = await fetch('https://sigma-backend-production.up.railway.app/api/data-ayam/', {
                credentials: "include", // Penting agar cookies dikirim ke backend
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": token ? `Bearer ${token}` : "",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (!response.ok) {
                console.error('Server response error:', result); // Tampilkan respons server
                throw new Error('Failed to start farming');
            }

            console.log('Farming started:', result);
        } catch (error) {
            console.error('Error:', error);
            alert('Terjadi kesalahan saat memulai ternak.');
        }
    };

    const updateJumlahAyam = async (jumlahAyamAwal: number, jumlahAyamBaru: number) => {
        const data = {
            jumlah_ayam: jumlahAyamBaru // Only the field you want to update
        };

        try {
            // Fetch all data
            const response = await fetch('https://sigma-backend-production.up.railway.app/api/data-ayam/', {
                credentials: "include", // Penting agar cookies dikirim ke backend
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": token ? `Bearer ${token}` : "",
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch ayam data');
            }

            const allData = await response.json();

            // If there's existing data, update it using the first (or only) item
            if (allData.length > 0) {
                const record = allData[0];  // Assuming there's only one record, we take the first one

                // If record exists, we can patch the data
                const updateResponse = await fetch(`https://sigma-backend-production.up.railway.app/api/data-ayam/`, {
                    credentials: "include",
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": token ? `Bearer ${token}` : "",
                    },
                    body: JSON.stringify(data),
                });

                const result = await updateResponse.json();
                if (!updateResponse.ok) {
                    console.error('Server response error:', result);
                    throw new Error('Failed to update chicken count');
                }

                console.log('Chicken count updated:', result);
                setJumlahAyam(jumlahAyamBaru);
            } else {
                // If no existing data, create new data
                const createResponse = await fetch('https://sigma-backend-production.up.railway.app/api/data-ayam/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": token ? `Bearer ${token}` : "",
                    },
                    body: JSON.stringify({
                        jumlah_ayam_awal: jumlahAyamAwal,  // Set initial count
                        jumlah_ayam: jumlahAyamBaru,       // Set new chicken count
                        tanggal_panen: new Date(),         // Set current harvest date
                        mortalitas: 0,                     // Set initial mortalitas (0)
                        usia_ayam: 0                       // Set initial age (0)
                    }),
                });

                const result = await createResponse.json();
                if (!createResponse.ok) {
                    console.error('Server response error:', result);
                    throw new Error('Failed to create new ayam data');
                }

                console.log('New chicken data created:', result);
                setJumlahAyam(jumlahAyamBaru);
            }

        } catch (error) {
            console.error('Error:', error);
            alert('Terjadi kesalahan saat memperbarui jumlah ayam.');
        }
    };

    useEffect(() => {
        // Calculate mortality whenever jumlahAyam changes
        if (jumlahAyam !== jumlahAwalAyam) {
            const mortalityPercentage = (((jumlahAwalAyam - jumlahAyam) / jumlahAwalAyam) * 100).toFixed(1);
            setMortalitas(Number(mortalityPercentage));

            // Update the backend
            updateMortalitas(jumlahAwalAyam, jumlahAyam);
        }
    }, [jumlahAyam, jumlahAwalAyam]); // This effect runs when jumlahAyam or jumlahAwalAyam changes


    const updateMortalitas = useCallback(async (JumlahAwalAyam: number, ayamMati: number) => {
        // Pastikan perhitungan mortalitas tidak menghasilkan nilai yang tidak valid
        const mortalityPercentage = (JumlahAwalAyam > 0 && jumlahAyam > 0)
            ? (((JumlahAwalAyam - jumlahAyam) / JumlahAwalAyam) * 100).toFixed(1)
            : '0'; // Set ke 0 jika perhitungan tidak valid

        const data = {
            mortalitas: parseFloat(mortalityPercentage), // Pastikan nilai mortalitas adalah angka
        };

        try {
            // Ambil data ayam yang ada
            const response = await fetch('https://sigma-backend-production.up.railway.app/api/data-ayam/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": token ? `Bearer ${token}` : "",
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch ayam data');
            }

            const allData = await response.json();
            if (allData.length === 0) {
                console.log('Data ayam tidak ada, kemungkinan panen sudah selesai atau data sudah dihapus.');
                // Buat data baru jika tidak ada data yang ditemukan
                const createResponse = await fetch('http://sigma-backend-production.up.railway.app/api/data-ayam/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": token ? `Bearer ${token}` : "",
                    },
                    body: JSON.stringify({
                        mortalitas: parseFloat(mortalityPercentage) || 0,  // Pastikan mortalitas adalah angka
                        jumlah_ayam: jumlahAyam,                 // Jumlah ayam saat ini
                        jumlah_ayam_awal: JumlahAwalAyam,        // Jumlah ayam awal
                        tanggal_panen: new Date(),               // Tanggal panen sekarang
                        usia_ayam: 0                             // Usia ayam (0 untuk awal)
                    }),
                });

                if (!createResponse.ok) {
                    const errorData = await createResponse.json();
                    console.error('Server response error:', errorData);
                    throw new Error('Failed to create new ayam data');
                }

                const result = await createResponse.json();
                console.log('New mortalitas data created:', result);
                setMortalitas(parseFloat(mortalityPercentage));
                return;  // Keluar dari fungsi setelah membuat data baru
            }

            // Jika data ada, pastikan kita hanya memperbarui jika mortalitas berubah
            const record = allData[0];  // Mengambil data pertama

            // Cek apakah mortalitas perlu diupdate
            if (record.mortalitas !== data.mortalitas) {
                // Jika mortalitas berbeda, lakukan pembaruan
                const updateResponse = await fetch(`http://sigma-backend-production.up.railway.app/api/data-ayam/`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": token ? `Bearer ${token}` : "",
                    },
                    body: JSON.stringify(data),
                });

                if (!updateResponse.ok) {
                    const errorData = await updateResponse.json();
                    console.error('Server response error:', errorData);
                    throw new Error('Failed to update mortalitas');
                }

                const result = await updateResponse.json();
                console.log('Mortalitas updated:', result);
                setMortalitas(parseFloat(mortalityPercentage));
            } else {
                console.log('Mortalitas tidak berubah, tidak perlu update');
            }

        } catch (error) {
            // console.error('Error:', error);
            // alert('Terjadi kesalahan saat memperbarui mortalitas.');
        }
    }, []);

    async function handleDeleteData() {
        try {
            // Ambil semua data ayam
            const response = await fetch(`http://sigma-backend-production.up.railway.app/api/data-ayam/`, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": token ? `Bearer ${token}` : "",
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch ayam data');
            }

            const allData = await response.json();
            if (allData.length > 0) {
                // Mengambil ID ayam pertama yang ditemukan (atau bisa memilih berdasarkan kriteria lainnya)
                const record = allData[0];  // Misalnya Anda ingin menghapus record pertama

                // Kirim permintaan DELETE berdasarkan ID
                const deleteResponse = await fetch(`http://sigma-backend-production.up.railway.app/api/data-ayam/`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": token ? `Bearer ${token}` : "",
                    },
                });

                if (deleteResponse.ok) {
                    console.log('Data ayam berhasil dihapus');

                    // Setelah penghapusan, set mortalitas ke 0
                    await updateMortalitas(0, 0); // Reset mortalitas karena ayam sudah dihapus
                } else {
                    const result = await deleteResponse.json();
                    console.error('Server response error:', result);
                    throw new Error('Failed to delete chicken data');
                }
            } else {
                console.log('Tidak ada data ayam untuk dihapus');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Terjadi kesalahan saat menghapus data ayam.');
        }
    }

    useEffect(() => {
        if (farmingStarted && tanggalMulai && targetTanggal) {
            const calculateAge = () => {
                const startDate = new Date(tanggalMulai);
                const harvestDate = new Date(targetTanggal);
                const now = new Date();

                // Calculate the age in days
                const ageInDays = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                const daysUntilHarvest = Math.floor((harvestDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

                setAgeInDays(ageInDays);
                setCountdown(`Tersisa ${daysUntilHarvest} hari untuk panen`);

                // Cek jika usia ayam sudah berubah dan belum diposting hari ini
                const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
                if (today !== lastPostedDate) {
                    setLastPostedDate(today);
                    updateAgeInDays(ageInDays); // Lakukan post jika tanggal berbeda
                }
            };

            // Initial calculation of age
            calculateAge();

            // Update age every day
            const ageInterval = setInterval(calculateAge, 1000 * 60 * 60 * 24); // Update every day

            return () => clearInterval(ageInterval); // Cleanup when component unmounts
        }
    }, [farmingStarted, tanggalMulai, targetTanggal]);

    async function handleStartFarming(initialCount: number, targetDate: Date | null) {
        if (!targetDate) {
            alert("Please select a harvest date.");
            return;
        }

        const now = new Date();
        const target = new Date(targetDate);

        // Cek jika tanggal yang dipilih kurang dari hari ini
        if (target <= now) {
            alert("Tanggal panen harus lebih dari hari ini.");
            return;
        }

        // Set nilai awal ayam dan tanggal target
        setJumlahAwalAyam(initialCount);
        setJumlahAyam(initialCount);
        setTargetTanggal(target);
        setTanggalMulai(now);
        setCountdown(`Tersisa ${Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))} hari untuk panen`);
        setFarmingStarted(true);
        setDialogOpen(false);

        // Panggil fungsi untuk menyimpan data ke API
        await postJumlahAyam(initialCount, target, now);

        // Set timer countdown untuk menghitung sisa hari hingga panen
        const countdownInterval = setInterval(() => {
            const now = new Date();
            const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

            if (diff < 0) {
                clearInterval(countdownInterval);
                setCountdown('Waktu panen telah tiba!');
            } else {
                setCountdown(`Tersisa ${diff} hari untuk panen`);
            }
        }, 1000 * 60 * 60 * 24); // Update setiap hari
    }

    function handleHarvest() {
        if (targetTanggal) {
            const today = new Date();
            if (today >= targetTanggal) {
                confirmHarvest();
                setHarvested(true);
            } else {
                setShowConfirmHarvestDialog(true); // Open confirmation dialog
            }
        }
    }

    const confirmHarvest = async () => {
        setHarvested(true);
        setShowConfirmHarvestDialog(false);
        setFarmingStarted(false);
        setHarvestDialogOpen(false);
        await handleDeleteData();
        await handleParameterPanen();
        window.location.reload();
    };



    const ayamDecreasePercentage =
        jumlahAwalAyam > 0 ? ((jumlahAwalAyam - jumlahAyam) / jumlahAwalAyam) * 100 : 0;

    const daysToTarget = targetTanggal
        ? Math.floor((targetTanggal.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        : null;

    const [statusAyam, setStatusAyam] = useState({
        mortalitas: { text: "Sangat Baik", color: "text-green-500" },
        daysToTarget: { text: "Baik", color: "text-blue-500" },
        ayamDecreasePercentage: { text: "Baik", color: "text-blue-500" },
    });

    const [warningsAyam, setWarningsAyam] = useState({
        mortalitas: "",
        daysToTarget: "",
        ayamDecreasePercentage: "",
    });

    const [prevStatusAyam, setPrevStatusAyam] = useState({
        mortalitas: "Sangat Baik",
        daysToTarget: "Siap",
        ayamDecreasePercentage: "Baik",
    });

    useEffect(() => {
        const updatedStatusAyam = { ...statusAyam };
        const updatedWarningsAyam = { ...warningsAyam };
        if (mortalitas > 5) {
            updatedStatusAyam.mortalitas = { text: "Bahaya", color: "text-red-500" };
            updatedWarningsAyam.mortalitas = "Segera tinjau kandang";
            if (prevStatusAyam.mortalitas !== updatedStatusAyam.mortalitas.text) {
                sendNotification({
                    data: "Mortalitas",
                    status: "Bahaya",
                    timestamp: new Date(),
                    message: "Segera tinjau kandang!",
                    icon: <BsHeartPulse />,
                    color: updatedStatusAyam.mortalitas.color,
                });
            }
        }
        if (ayamDecreasePercentage > 5) {
            updatedStatusAyam.ayamDecreasePercentage = { text: "Bahaya", color: "text-red-500" };
            updatedWarningsAyam.ayamDecreasePercentage = "Segera tinjau kandang";
            if (prevStatusAyam.ayamDecreasePercentage !== updatedStatusAyam.ayamDecreasePercentage.text) {
                sendNotification({
                    data: "Jumlah Ayam",
                    status: "Bahaya",
                    timestamp: new Date(),
                    message: "Segera tinjau kandang!",
                    icon: <GiRooster />,
                    color: updatedStatusAyam.mortalitas.color,
                });
            }
        }

        if (farmingStarted && daysToTarget !== null && daysToTarget <= 7) {
            updatedStatusAyam.daysToTarget = { text: "Siap", color: "text-green-500" };
            updatedWarningsAyam.daysToTarget = "Sudah dekat tanggal panen";

            // Kirim notifikasi hanya jika status berubah
            if (prevStatusAyam.daysToTarget !== updatedStatusAyam.daysToTarget.text) {
                sendNotification({
                    data: "Usia Ayam",
                    status: "Siap",
                    timestamp: new Date(),
                    message: "Sudah dekat tanggal panen",
                    icon: <FaRegCalendarAlt />,
                    color: updatedStatusAyam.daysToTarget.color,
                });
            }
        }

        if (
            prevStatusAyam.mortalitas !== updatedStatusAyam.mortalitas.text ||
            prevStatusAyam.ayamDecreasePercentage !== updatedStatusAyam.ayamDecreasePercentage.text ||
            prevStatusAyam.daysToTarget !== updatedStatusAyam.daysToTarget.text
        ) {
            setPrevStatusAyam({
                mortalitas: updatedStatusAyam.mortalitas.text,
                ayamDecreasePercentage: updatedStatusAyam.ayamDecreasePercentage.text,
                daysToTarget: updatedStatusAyam.daysToTarget.text,
            });
            setStatusAyam(updatedStatusAyam);
            setWarningsAyam(updatedWarningsAyam);
        }
    }, [mortalitas,
        ayamDecreasePercentage,
        daysToTarget,
        sendNotification,
        farmingStarted,
        prevStatusAyam.ayamDecreasePercentage,
        prevStatusAyam.daysToTarget,
        prevStatusAyam.mortalitas,
        statusAyam,
        warningsAyam]);

    return (
        <ChickenContext.Provider
            value={{
                // Chicken data
                jumlahAyam,
                setJumlahAyam,
                mortalitas,
                setMortalitas,
                ageInDays,
                setAgeInDays,
                jumlahAwalAyam,
                setJumlahAwalAyam,
                tanggalMulai,
                setTanggalMulai,
                targetTanggal,
                setTargetTanggal,
                farmingStarted,
                setFarmingStarted,
                fetchDataChicken,
                ayamDecreasePercentage,
                daysToTarget,
                statusAyam,
                ayamId,

                // FUNCTIONS
                harvested,
                showConfirmHarvestDialog,
                setHarvested,
                setShowConfirmHarvestDialog,
                handleHarvest,
                confirmHarvest,
                updateAgeInDays,
                postJumlahAyam,
                updateJumlahAyam,
                updateMortalitas,
                handleStartFarming,
                jumlahAyamInput,
                setJumlahAyamInput,
                handleParameterPanen,
                countdown,
                setCountdown,

                // Chicken history
                historyData,
                setHistoryData,
            }}
        >
            {children}
        </ChickenContext.Provider>

    );
};