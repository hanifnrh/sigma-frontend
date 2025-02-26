import { Card, CardContent } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Button } from "../ui/button"

const sensors = [
    {
        sensor: "Suhu & Kelembapan DHT22 - 1",
        status: "Aktif",
    },
    {
        sensor: "Suhu & Kelembapan DHT22 - 2",
        status: "Aktif",
    },
    {
        sensor: "Suhu & Kelembapan DHT22 - 3",
        status: "Mati",
    },
    {
        sensor: "Suhu & Kelembapan DHT22 - 4",
        status: "Aktif",
    },
    {
        sensor: "Amonia DFRobot MEMS NH3 - 1",
        status: "Mati",
    },
    {
        sensor: "Amonia DFRobot MEMS NH3 - 2",
        status: "Aktif",
    },
]

export function SensorStatus() {
    return (
        <Card className="w-full">
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
                                <TableCell className="font-medium">{sensor.sensor}</TableCell>
                                <TableCell className={`px-2 py-1 font-medium rounded-lg"
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
