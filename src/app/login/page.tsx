"use client";


// UI Components
import ButtonLogin from "@/components/ui/buttons/button-login";
import { Input } from "@/components/ui/input";

// Libraries
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

// Schema Validasi
const LoginSchema = z.object({
    username: z.string().min(2, { message: "Username must be at least 2 characters." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState({ username: "", password: "" });
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validasi dengan Zod
        const validationResult = LoginSchema.safeParse({ username, password });

        if (!validationResult.success) {
            const fieldErrors = validationResult.error.format();
            setError({
                username: fieldErrors.username?._errors[0] || "",
                password: fieldErrors.password?._errors[0] || "",
            });
            return;
        }

        // Jika validasi sukses, lanjutkan dengan login
        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const result = await response.json();

            if (!response.ok) {
                setError({ username: result.error || "Login failed", password: "" });
                return;
            }

            // Redirect berdasarkan role
            const redirectPath = result.role.toLowerCase() === "pemilik" ? "/pemilik/dashboard" : "/staf/dashboard";
            router.push(redirectPath);
        } catch (error) {
            console.error("Login Error:", error);
            setError({ username: "Something went wrong. Please try again.", password: "" });
        }
    };



    return (
        <main className="w-full h-screen flex flex-col items-center justify-center">
            <Image
                src="https://images.unsplash.com/photo-1618397746666-63405ce5d015?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                width={1000}
                height={1000}
                alt="Login Image"
                className="absolute inset-0 -z-10 h-full w-full"
            />
            <div
                className={cn(
                    "w-5/6 flex justify-center",
                    "rounded-2xl p-10",
                    "bg-white dark:bg-zinc-900",
                    "border border-zinc-200 dark:border-zinc-800",
                    "shadow-xs"
                )}
            >
                <div className="w-full grid grid-cols-2 items-center gap-8">
                    <div className="relative w-full">
                        <div className="flex items-center gap-2 z-50 absolute top-10 left-10">
                            <Image
                                src="/sigmalogonobg.png"
                                alt="Logo"
                                width={256}
                                height={256}
                                className="w-12 h-auto"
                            />
                            <p className='font-bold text-xl text-white'>
                                SIGMA
                            </p>
                        </div>
                        <div className="absolute top-32 left-10 z-50">
                            <h1 className="font-bold text-white text-7xl">
                                Selamat Datang!
                            </h1>
                        </div>
                        <Image
                            src="https://images.unsplash.com/photo-1618397746666-63405ce5d015?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            width={1000}
                            height={1000}
                            alt="Login Image"
                            className="w-full h-auto aspect-square object-cover rounded-xl z-0 brightness-90"
                        />
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-8 mt-4">
                        <div className="flex flex-col items-start gap-6">
                            <Link href="/" className="w-full flex items-center justify-start space-x-3 rtl:space-x-reverse">
                                <div className="p-2 rounded-xl border border-zinc-300 shadow-sm text-zinc-800 hover:bg-zinc-100 transition-all">
                                    <ChevronLeft size={20} />
                                </div>
                            </Link>
                            <div className="flex flex-col">
                                <h3 className="text-gray-800 text-3xl font-extrabold">Masuk</h3>
                                <p className="text-sm text-gray-800">
                                    Belum punya akun?{" "}
                                    <Link href="/register" className="text-blue-600 hover:underline ml-1">
                                        Daftar di sini
                                    </Link>
                                </p>

                            </div>
                        </div>

                        {/* Form Field */}
                        <div className="flex flex-col gap-4">
                            {/* Username Field */}
                            <div className="flex flex-col gap-2">
                                <label className="block text-gray-700 font-medium">Username</label>
                                <Input
                                    type="text"
                                    placeholder="Masukkan username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="body-light"
                                />
                                {error.username && <p className="text-red-500 text-sm">{error.username}</p>}
                            </div>

                            {/* Password Field */}
                            <div className="flex flex-col gap-2">
                                <label className="block text-gray-700 font-medium">Password</label>
                                <Input
                                    type="password"
                                    placeholder="Masukkan password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="body-light"
                                />
                                {error.password && <p className="text-red-500 text-sm">{error.password}</p>}
                            </div>
                        </div>


                        <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
                            <ButtonLogin type="submit" className="w-full rounded-xl" />
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-3 text-sm text-gray-800">
                                    Ingat saya
                                </label>
                            </div>
                            <div>
                                <a href="#" className="text-blue-600 text-sm hover:underline">
                                    Lupa Password?
                                </a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
