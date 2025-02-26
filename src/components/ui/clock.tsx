"use client";

import { useEffect, useState } from "react";

export default function Clock() {
    const [date, setDate] = useState<Date | null>(null);
    const days = ["MIN", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"];

    useEffect(() => {
        const timerId = setInterval(() => {
            setDate(new Date());
        }, 1000);

        return () => {
            clearInterval(timerId);
        };
    }, []);

    return (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "white", fontSize: "x-large" }}>
            {date ? (
                <>
                    <div style={{ textAlign: "center" }}>
                        <h2>{days[date.getDay()]}</h2>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <h2>
                            {date.getHours().toString().padStart(2, "0")}
                        </h2>
                    </div>
                    <div>
                        <p>:</p>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <h2>
                            {date.getMinutes().toString().padStart(2, "0")}
                        </h2>
                    </div>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}
