import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { useParameterContext } from "../../context/lantai-satu/ParameterContext";
import { Button } from "../../ui/buttons/button";

export function SensorStatus() {
    const { sensorDFRobotStatus, sensorDHT22Status } = useParameterContext();
    const sensors = [
        {
            sensor: "Suhu & Kelembapan DHT22",
            status: sensorDHT22Status,
        },
        {
            sensor: "Amonia DFRobot MiCS-5524", 
            status: sensorDFRobotStatus,
        },
    ]

    return (
        <Card className="w-full dark:bg-zinc-950">
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Sensor</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sensors.map((sensor, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-semibold">{sensor.sensor}</TableCell>
                                <TableCell className={`px-2 py-1 font-semibold rounded-lg"
                                    : "text-red-600 bg-red-100"
                                    }`}>
                                    <Button variant={sensor.status === "Aktif" ? "aktif" : "mati"}>
                                        {sensor.status}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}