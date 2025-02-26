import { Card, CardContent } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"

const items = [
    {
        aktivitas: "Jumlah ayam berkurang 1",
        waktu: "13/10/24 09.00",
    },
    {
        aktivitas: "Jumlah ayam berkurang 1",
        waktu: "13/10/24 09.00",
    },
    {
        aktivitas: "Jumlah ayam berkurang 1",
        waktu: "13/10/24 09.00",
    },
    {
        aktivitas: "Jumlah ayam berkurang 1",
        waktu: "13/10/24 09.00",
    },
    {
        aktivitas: "Jumlah ayam berkurang 1",
        waktu: "13/10/24 09.00",
    },
    {
        aktivitas: "Jumlah ayam berkurang 1",
        waktu: "13/10/24 09.00",
    },
]

export function Aktivitas() {
    return (
        <Card className="w-full">
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Aktivitas</TableHead>
                            <TableHead>Waktu</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{item.aktivitas}</TableCell>
                                <TableCell className="font-medium">{item.waktu}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
