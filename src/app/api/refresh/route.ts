import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        // ✅ Ambil refresh token dari cookies
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get("refreshToken")?.value;

        console.log("Refresh Token from Cookie:", refreshToken); // 🔍 Log untuk debugging

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
        console.log("New Access Token:", data.access); // 🔍 Debugging

        // ✅ Set accessToken baru di cookies
        (await
            // ✅ Set accessToken baru di cookies
            cookies()).set("accessToken", data.access, {
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });

        return NextResponse.json({ accessToken: data.access }, { status: 200 });
    } catch (error) {
        console.error("Error in /api/refresh:", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
