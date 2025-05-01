import { useAlatContext } from "@/components/context/DeviceContext";
import BatteryGauge from "react-battery-gauge";

export function SensorBattery2() {
    const { alatList, loading } = useAlatContext();

    if (loading) {
        return <div>Loading...</div>;
    }

    const dht22 = alatList.find(alat => alat.alat_id === "alat_dht22");
    const dfrobot = alatList.find(alat => alat.alat_id === "alat_dfrobot");

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col justify-center items-start">
                <div className="font-semibold">Suhu & Kelembapan DHT 22</div>
                <div>
                    <BatteryGauge
                        className="mt-2"
                        value={dht22?.battery_level ?? 0}
                        size={150}
                        padding={0}
                        aspectRatio={0.23}
                        customization={{
                            batteryBody: { strokeWidth: 2, cornerRadius: 6, fill: 'none', strokeColor: '#aeaec0' },
                            batteryCap: { fill: 'none', strokeWidth: 2, strokeColor: '#aeaec0', cornerRadius: 2, capToBodyRatio: 0.4 },
                            batteryMeter: { fill: '#00B548', lowBatteryValue: 15, lowBatteryFill: 'red', outerGap: 1, noOfCells: 1, interCellsGap: 1 },
                            readingText: { lightContrastColor: '#111', darkContrastColor: '#fff', lowBatteryColor: 'red', fontFamily: 'Lexend', fontSize: 10, showPercentage: true },
                            chargingFlash: { fill: 'orange', animated: true, animationDuration: 1000 },
                        }}
                    />
                </div>
            </div>
            <div className="flex flex-col justify-center items-start">
                <div className="font-semibold">Amonia DFRobot</div>
                <div>
                    <BatteryGauge
                        className="mt-2"
                        value={dfrobot?.battery_level ?? 0}
                        size={150}
                        padding={0}
                        aspectRatio={0.23}
                        customization={{
                            batteryBody: { strokeWidth: 2, cornerRadius: 6, fill: 'none', strokeColor: '#aeaec0' },
                            batteryCap: { fill: 'none', strokeWidth: 2, strokeColor: '#aeaec0', cornerRadius: 2, capToBodyRatio: 0.4 },
                            batteryMeter: { fill: '#00B548', lowBatteryValue: 15, lowBatteryFill: 'red', outerGap: 1, noOfCells: 1, interCellsGap: 1 },
                            readingText: { lightContrastColor: '#111', darkContrastColor: '#fff', lowBatteryColor: 'red', fontFamily: 'Lexend', fontSize: 10, showPercentage: true },
                            chargingFlash: { fill: 'orange', animated: true, animationDuration: 1000 },
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
