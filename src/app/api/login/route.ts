"use server";

import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();

        const response = await fetch("https://sigma-backend-production.up.railway.app/api/login/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            return new Response(JSON.stringify({ error: "Invalid username or password." }), { status: 401 });
        }

        const data = await response.json();
        console.log("Response Data:", data);

        // Simpan token di cookie
        const cookieStore = await cookies();
        cookieStore.set("accessToken", data.access, {
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });
        cookieStore.set("refreshToken", data.refresh, {
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });
        cookieStore.set("role", data.user.role, {
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });

        console.log("Tokens saved successfully.");
        return new Response(JSON.stringify({ success: true, role: data.user.role }), { status: 200 });
    } catch (error) {
        console.error("Login Error:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}
