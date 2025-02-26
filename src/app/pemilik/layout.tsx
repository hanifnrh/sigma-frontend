import { ChickenProvider } from "@/components/context/ChickenContext";
import { NotificationProvider } from "@/components/context/NotificationContext";
import { ParameterProvider } from "@/components/context/ParameterContext";

export default function PemilikLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <NotificationProvider>
            <ParameterProvider>
                <ChickenProvider>
                    {children}
                </ChickenProvider>
            </ParameterProvider>
        </NotificationProvider>
    );
}
