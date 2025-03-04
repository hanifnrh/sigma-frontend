import { ChickenProvider } from "@/components/context/ChickenContext";
import { NotificationProvider } from "@/components/context/NotificationContext";
import { ParameterProvider2 } from "@/components/context/lantai-dua/ParameterContext2";
import { ParameterProvider } from "@/components/context/lantai-satu/ParameterContext";

export default function PemilikLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <NotificationProvider>
            <ParameterProvider>
                <ParameterProvider2>
                    <ChickenProvider>
                        {children}
                    </ChickenProvider>
                </ParameterProvider2>
        </NotificationProvider>
    );
}
