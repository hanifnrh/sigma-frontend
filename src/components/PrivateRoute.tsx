"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader } from "./ui/loader";

interface PrivateRouteProps {
    children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch("/api/auth/check", { cache: "no-store" });
                const data = await res.json();

                if (!data.isAuthenticated) {
                    router.push("/login");
                } else {
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error("Error checking authentication:", error);
                router.push("/login");
            }
        };

        checkAuth();
    }, [router]);

    if (isAuthenticated === null) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader />
            </div>
        );
    }

    return <>{children}</>;
};

export default PrivateRoute;
