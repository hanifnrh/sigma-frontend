// context/alat/AlatContext.tsx
"use client";

import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

interface AlatData {
    alat_id: string;
    battery_level: number;
    status: string;
}

interface AlatContextProps {
    alatList: AlatData[];
    loading: boolean;
}

const AlatContext = createContext<AlatContextProps>({
    alatList: [],
    loading: true,
});

export const useAlatContext = () => useContext(AlatContext);

export function AlatProvider({ children }: { children: React.ReactNode }) {
    const [alatList, setAlatList] = useState<AlatData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAlat() {
            try {
                const response = await axios.get("https://sigma-backend-production.up.railway.app/alat/list/");
                setAlatList(response.data);
            } catch (error) {
                console.error("Error fetching alat list:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchAlat();
    }, []);

    return (
        <AlatContext.Provider value={{ alatList, loading }}>
            {children}
        </AlatContext.Provider>
    );
}
