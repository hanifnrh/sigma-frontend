import { getCookie, setCookie } from "cookies-next";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const refreshToken = getCookie("refreshToken");

        if (!refreshToken) {
            return NextResponse.json({ error: "No refresh token available." }, { status: 401 });
        }

        const response = await fetch("https://sigma-backend-production.up.railway.app/api/token/refresh/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh: refreshToken }),
        });

        if (!response.ok) {
            return NextResponse.json({ error: "Failed to refresh token." }, { status: 401 });
        }

        const data = await response.json();

        // Simpan accessToken baru di cookies
        setCookie("accessToken", data.access, {
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });

        return NextResponse.json({ accessToken: data.access }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
