import { getCookie, setCookie } from "cookies-next";

export const refreshAccessToken = async () => {
    const refreshToken = getCookie("refreshToken");

    if (!refreshToken) {
        throw new Error("No refresh token available.");
    }

    const response = await fetch("https://sigma-backend-production.up.railway.app/api/token/refresh/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
        throw new Error("Failed to refresh token.");
    }

    const data = await response.json();

    // Simpan accessToken baru di cookies
    setCookie("accessToken", data.access, {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });

    return data.access; // Kembalikan accessToken baru
};