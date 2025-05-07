"use server";

import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        const { username, password, rememberMe  } = await req.json();

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

        const cookieStore = await cookies();
        const cookieOptions = {
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax" as const,
            httpOnly: false,
            // Jika rememberMe true, set expiry lebih lama (misal 30 hari)
            maxAge: rememberMe ? 30 * 24 * 60 * 60 : undefined
        };

        cookieStore.set("accessToken", data.access, {
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            httpOnly: false,
        });
        cookieStore.set("refreshToken", data.refresh, {
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            httpOnly: false,
        });
        cookieStore.set("role", data.user.role, {
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            httpOnly: false,
        });
        cookieStore.set("username", data.user.username, {
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            httpOnly: false,
        });

        console.log("Tokens saved successfully.");
        return new Response(JSON.stringify({ success: true, role: data.user.role }), { status: 200 });
    } catch (error) {
        console.error("Login Error:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}
