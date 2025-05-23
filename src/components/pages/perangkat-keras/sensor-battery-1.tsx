import BatteryGauge from 'react-battery-gauge';

export function SensorBattery() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 lg:grid-cols-1 gap-4 mt-5">
            <div className='flex flex-col justify-center items-start'>
                <div className='font-semibold'>
                    Suhu & Kelembapan DHT 22
                </div>
                <div>
                    <BatteryGauge
                        className='mt-2'
                        value={100}
                        size={150}
                        padding={0}
                        aspectRatio={0.23}
                        customization={{
                            batteryBody: {
                                strokeWidth: 2,
                                cornerRadius: 6,
                                fill: 'none',
                                strokeColor: '#aeaec0',
                            },
                            batteryCap: {
                                fill: 'none',
                                strokeWidth: 2,
                                strokeColor: '#aeaec0',
                                cornerRadius: 2,
                                capToBodyRatio: 0.4,
                            },
                            batteryMeter: {
                                fill: '#00B548',
                                lowBatteryValue: 15,
                                lowBatteryFill: 'red',
                                outerGap: 1,
                                noOfCells: 1,
                                interCellsGap: 1,
                            },
                            readingText: {
                                lightContrastColor: '#111',
                                darkContrastColor: '#fff',
                                lowBatteryColor: 'red',
                                fontFamily: 'Lexend',
                                fontSize: 10,
                                showPercentage: true,
                            },
                            chargingFlash: {
                                scale: undefined,
                                fill: 'orange',
                                animated: true,
                                animationDuration: 1000,
                            },
                        }}
                    />
                </div>
            </div>

            <div className='flex flex-col justify-center items-start'>
                <div className='font-semibold'>
                    Amonia DFRobot MiCS-5524
                </div>
                <div>
                    <BatteryGauge
                        className='mt-2'
                        value={80}
                        size={150}
                        padding={0}
                        aspectRatio={0.23}
                        customization={{
                            batteryBody: {
                                strokeWidth: 2,
                                cornerRadius: 6,
                                fill: 'none',
                                strokeColor: '#aeaec0',
                            },
                            batteryCap: {
                                fill: 'none',
                                strokeWidth: 2,
                                strokeColor: '#aeaec0',
                                cornerRadius: 2,
                                capToBodyRatio: 0.4,
                            },
                            batteryMeter: {
                                fill: '#00B548',
                                lowBatteryValue: 15,
                                lowBatteryFill: 'red',
                                outerGap: 1,
                                noOfCells: 1,
                                interCellsGap: 1,
                            },
                            readingText: {
                                lightContrastColor: '#111',
                                darkContrastColor: '#fff',
                                lowBatteryColor: 'red',
                                fontFamily: 'Lexend',
                                fontSize: 10,
                                showPercentage: true,
                            },
                            chargingFlash: {
                                scale: undefined,
                                fill: 'orange',
                                animated: true,
                                animationDuration: 1000,
                            },
                        }}
                    />
                </div>
            </div>

        </div>
    );
}
