"use server";

import { cookies } from "next/headers";

export async function loginUser(username: string, password: string) {
    const response = await fetch("https://sigma-backend-production.up.railway.app/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        return { error: "Invalid username or password." };
    }

    const data = await response.json();
    console.log("Response Data:", data);

    // Simpan token di cookie menggunakan cookies() dari next/headers
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
    return { success: true, role: data.user.role };
}