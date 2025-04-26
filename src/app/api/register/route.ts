"use server";


export async function POST(req: Request) {
    try {
        const { username, email, password } = await req.json();

        const response = await fetch("https://sigma-backend-production.up.railway.app/api/register/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return new Response(JSON.stringify({ error: errorData.error || "Registration failed." }), { status: 400 });
        }

        const data = await response.json();
        console.log("Registration Response Data:", data);

        // (Opsional) Kalau backend langsung login-in setelah register, bisa langsung set cookie:
        // const cookieStore = await cookies();
        // cookieStore.set("accessToken", data.access, { ... });
        // cookieStore.set("refreshToken", data.refresh, { ... });
        // cookieStore.set("role", data.user.role, { ... });
        // cookieStore.set("username", data.user.username, { ... });

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error("Registration Error:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}
