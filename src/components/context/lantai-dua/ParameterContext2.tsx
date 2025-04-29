"use client"

import { useNotifications } from "@/components/context/NotificationContext";
import { getCookie, setCookie } from "cookies-next";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { FaTemperatureHigh, FaTemperatureLow } from "react-icons/fa";
import { IoWater } from "react-icons/io5";
import { TbAtom2Filled } from "react-icons/tb";

type Status = { text: string; color: string };

interface ParameterData {
    timestamp: string;
    ammonia: number;
    temperature: number;
    humidity: number;
    score: number;
    status: string;
    ammonia_status: string;
    temperature_status: string;
    humidity_status: string;
    ammonia_color: string;
    temperature_color: string;
    humidity_color: string;
    color: string;
}

type ParameterContextType = {
    timestamp: Date | null;
    setTimestamp: (timestamp: Date | null) => void;
    ammonia: number | null;
    setAmmonia: (value: number | null) => void;
    temperature: number | null;
    setTemperature: (value: number | null) => void;
    humidity: number | null;
    setHumidity: (value: number | null) => void;
    averageScore: number | null;
    setAverageScore: (averageScore: number | null) => void;

    // New states for colors
    ammoniaColor: string;
    setAmmoniaColor: (color: string) => void;
    temperatureColor: string;
    setTemperatureColor: (color: string) => void;
    humidityColor: string;
    setHumidityColor: (color: string) => void;
    overallColor: string;
    setOverallColor: (color: string) => void;

    // Device Status
    sensorDFRobotStatus: string;
    sensorDHT22Status: string;

    ammoniaStatus: string;
    setAmmoniaStatus: (status: string) => void;
    temperatureStatus: string;
    setTemperatureStatus: (status: string) => void;
    humidityStatus: string;
    setHumidityStatus: (status: string) => void;

    overallStatus: string;
    setOverallStatus: (status: string) => void;

    warnings: { ammonia: string; temperature: string; humidity: string };

    statusAndColor: { status: string; color: string } | null;

    historyParameter: ParameterData[];
    setHistoryParameter: (historyParameter: ParameterData[]) => void;
};


type Notification = {
    data: string;
    status: string;
    timestamp: Date;
    message: string;
    icon: React.ReactNode;
    color: string;
};

const ParameterContext2 = createContext<ParameterContextType | undefined>(undefined);

export const useParameterContext2 = () => {
    const context = useContext(ParameterContext2);
    if (!context) {
        throw new Error("useParameterContext must be used within a ParameterProvider2");
    }
    return context;
};

interface ParameterProvider2Props {
    children: ReactNode;
}

export const ParameterProvider2: React.FC<ParameterProvider2Props> = ({ children }) => {
    const { addNotification } = useNotifications();

    // Parameter data states
    const [timestamp, setTimestamp] = useState<Date | null>(null);
    const [ammonia, setAmmonia] = useState<number | null>(null);
    const [temperature, setTemperature] = useState<number | null>(null);
    const [humidity, setHumidity] = useState<number | null>(null);
    const [averageScore, setAverageScore] = useState<number | null>(null);
    const [overallStatus, setOverallStatus] = useState<string>("");

    // const [overallStatus, setOverallStatus] = useState<Status>({ text: "Error", color: "text-red-500" });
    const [latestData, setLatestData] = useState<ParameterData | null>(null);
    const [historyParameter, setHistoryParameter] = useState<ParameterData[]>([]);

    const [sensorDFRobotStatus, setSensorDFRobotStatus] = useState<string>("Aktif");
    const [sensorDHT22Status, setSensorDHT22Status] = useState<string>("Aktif");

    // const [historyParameter, setHistoryParameter] = useState<ParameterData[]>([]);
    const [ammoniaStatus, setAmmoniaStatus] = useState<string>("");
    const [temperatureStatus, setTemperatureStatus] = useState<string>("");
    const [humidityStatus, setHumidityStatus] = useState<string>("");

    const [ammoniaColor, setAmmoniaColor] = useState<string>("");
    const [temperatureColor, setTemperatureColor] = useState<string>("");
    const [humidityColor, setHumidityColor] = useState<string>("");

    const [overallColor, setOverallColor] = useState<string>("");


    // Functions handle

    async function sendSMS(message: string) {
        try {
            await fetch('/api/smsinactive', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message,
                    to: '+6285794202130',
                }),
            });
        } catch (error) {
            console.error('Failed to send SMS message:', error);
        }
    }

    const sendNotification = (notification: Notification) => {
        addNotification(notification);
    };

    const fetchAccessToken = async () => {
        try {
            const response = await fetch("/api/refresh", {
                method: "POST",
                credentials: "include", // 🛠️ Pastikan cookies dikirim!
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                let token = getCookie("accessToken");

                // Jika token tidak ada atau kadaluarsa, refresh token
                if (!token) {
                    token = await fetchAccessToken();
                    if (!token) throw new Error("Failed to obtain new access token.");
                    setCookie("accessToken", token, { path: "/" });
                }

                const response = await fetch("https://sigma-backend-production.up.railway.app/api/parameters/floor/2/", {
                    credentials: "include",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });

                // Jika token kadaluarsa, coba refresh token dan ulang request
                if (response.status === 401) {
                    const newToken = await fetchAccessToken();
                    if (!newToken) throw new Error("Failed to refresh token.");

                    setCookie("accessToken", newToken, { path: "/" });

                    const newResponse = await fetch("https://sigma-backend-production.up.railway.app/api/parameters/floor/2/", {
                        credentials: "include",
                        headers: {
                            "Authorization": `Bearer ${newToken}`,
                        },
                    });

                    if (!newResponse.ok) {
                        throw new Error(`HTTP error! Status: ${newResponse.status}`);
                    }

                    const newData = await newResponse.json();
                    processSensorData(newData);
                    return;
                }

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
                }

                const data: ParameterData[] = await response.json();
                processSensorData(data);
            } catch (error) {
                console.error("Error fetching parameter data:", error);
            }
        };

        const processSensorData = (data: ParameterData[]) => {
            if (data.length) {
                const sortedData = data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

                // Ambil data terbaru untuk pengecekan sensor
                const latestData = sortedData[0];
                const lastUpdated = new Date(latestData.timestamp).getTime();
                const now = new Date().getTime();
                const isSensorOffline = now - lastUpdated > 20 * 60 * 1000;

                const statusDHT22 = latestData.temperature !== null && latestData.humidity !== null;
                const statusDFRobot = latestData.ammonia !== null;

                setHistoryParameter(sortedData);
                setLatestData(latestData);
                setAmmonia(latestData.ammonia);
                setTemperature(latestData.temperature);
                setHumidity(latestData.humidity);
                setAverageScore(latestData.score);
                setOverallStatus(latestData.status);
                setAmmoniaStatus(latestData.ammonia_status);
                setTemperatureStatus(latestData.temperature_status);
                setHumidityStatus(latestData.humidity_status);
                setAmmoniaColor(latestData.ammonia_color);
                setTemperatureColor(latestData.temperature_color);
                setHumidityColor(latestData.humidity_color);
                setOverallColor(latestData.color);
                if (isSensorOffline) {
                    setSensorDFRobotStatus("Mati");
                    setSensorDHT22Status("Mati");
                }

                setSensorDFRobotStatus(statusDFRobot ? "Aktif" : "Mati");
                setSensorDHT22Status(statusDHT22 ? "Aktif" : "Mati");
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 300000);
        return () => clearInterval(interval);
    }, []);


    const getStatusAndColor = (score: number): { status: string; color: string } => {
        if (score >= 90) {
            return { status: "Sangat Baik", color: "text-green-500" };
        } else if (score >= 75) {
            return { status: "Baik", color: "text-blue-500" };
        } else if (score >= 50) {
            return { status: "Buruk", color: "text-yellow-500" };
        } else {
            return { status: "Bahaya", color: "text-red-500" };
        }
    };

    const statusAndColor = averageScore !== null ? getStatusAndColor(averageScore) : null;

    const getTemperatureIcon = (temp: number) =>
        temp > 32 ? <FaTemperatureHigh /> : <FaTemperatureLow />;

    const [warnings, setWarnings] = useState({
        ammonia: "",
        temperature: "",
        humidity: "",
    });

    useEffect(() => {
        if (ammonia === null || temperature === null || humidity === null) return;

        // Create a new warnings object based on the current statuses
        const newWarnings = {
            ammonia: (ammoniaStatus === "Buruk" || ammoniaStatus === "Bahaya")
                ? "Segera bersihkan kandang!"
                : "",
            temperature: (temperatureStatus === "Buruk" || temperatureStatus === "Bahaya")
                ? "Segera atur suhu kandang!"
                : "",
            humidity: (humidityStatus === "Buruk" || humidityStatus === "Bahaya")
                ? "Segera atur ventilasi kandang!"
                : "",
        };

        // Compare the new warnings with the current warnings to avoid unnecessary state updates
        if (
            newWarnings.ammonia !== warnings.ammonia ||
            newWarnings.temperature !== warnings.temperature ||
            newWarnings.humidity !== warnings.humidity
        ) {
            setWarnings(newWarnings);

            // Send notifications only when warnings are updated
            if (newWarnings.ammonia) {
                sendNotification({
                    data: "Amonia Lt. 2",
                    status: ammoniaStatus,
                    timestamp: new Date(),
                    message: newWarnings.ammonia,
                    icon: <TbAtom2Filled />,
                    color: ammoniaColor,
                });
                sendSMS(`🚨 Peringatan Amonia Lt. 2: Tingkat amonia ${ammonia} ppm. ${newWarnings.ammonia}`);
            }
            if (newWarnings.temperature) {
                sendNotification({
                    data: "Suhu Lt. 2",
                    status: temperatureStatus,
                    timestamp: new Date(),
                    message: newWarnings.temperature,
                    icon: getTemperatureIcon(temperature),
                    color: temperatureColor,
                });
                sendSMS(`🔥 Peringatan Suhu Lt. 2: Tingkat suhu ${temperature} °C. ${newWarnings.temperature}`);
            }
            if (newWarnings.humidity) {
                sendNotification({
                    data: "Kelembapan Lt. 2",
                    status: humidityStatus,
                    timestamp: new Date(),
                    message: newWarnings.humidity,
                    icon: <IoWater />,
                    color: humidityColor,
                });
                sendSMS(`💧 Peringatan Kelembapan Lt. 1: Tingkat kelembapan ${humidity}%. ${newWarnings.humidity}`);
            }
        }
    }, [ammonia, temperature, humidity, ammoniaStatus, temperatureStatus, humidityStatus]);

    return (
        <ParameterContext2.Provider
            value={{
                // Stats data
                timestamp,
                setTimestamp,
                ammonia,
                setAmmonia,
                temperature,
                setTemperature,
                humidity,
                setHumidity,
                overallStatus,
                setOverallStatus,
                warnings,
                averageScore,
                setAverageScore,
                statusAndColor,
                historyParameter,
                setHistoryParameter,

                // Color states for parameters
                ammoniaColor,
                setAmmoniaColor,
                temperatureColor,
                setTemperatureColor,
                humidityColor,
                setHumidityColor,
                overallColor,
                setOverallColor,

                // Device status
                sensorDFRobotStatus,
                sensorDHT22Status,

                // Statuses for each parameter
                ammoniaStatus,
                setAmmoniaStatus,
                temperatureStatus,
                setTemperatureStatus,
                humidityStatus,
                setHumidityStatus,
            }}
        >
            {children}
        </ParameterContext2.Provider>

    );
};