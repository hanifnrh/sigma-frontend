"use client";

import { AuroraBackground } from "@/components/ui/aurora-background";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Libraries
import { loginUser } from "@/app/api/login/route";
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
    const [redirectPath, setRedirectPath] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = await loginUser(username, password);

        if (result?.error) {
            setError({ username: result.error, password: "" }); // Pastikan sesuai dengan struktur objek
        } else {
            const redirectPath = result.role.toLowerCase() === "pemilik" ? "/pemilik/dashboard" : "/staf/dashboard";
            router.push(redirectPath);
        }
    };


    return (
        <main className="w-full flex flex-col items-center justify-center">
            <AuroraBackground className='w-full'>
                <div
                    className="w-full relative flex flex-col gap-4 items-center justify-center"
                >

                    <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <Image
                            src="/sigmalogonobg.png"
                            alt="Logo"
                            width={256}
                            height={256}
                            className="w-20 h-auto"
                        />
                        <p className='font-bold text-5xl bg-clip-text text-transparent bg-[linear-gradient(107deg,#802696_8.32%,#6348CF_60.18%,#5DAEDB_105.75%)]'>
                            SIGMA
                        </p>
                    </Link>
                    <div className="grid items-center gap-4 w-4/6 p-4 m-4 border rounded-xl shadow-xl">
                        <div className="w-full px-4 py-4">
                            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                                <h3 className="text-gray-800 text-3xl font-extrabold">Masuk</h3>
                                <p className="text-sm mt-4 text-gray-800">
                                    Belum punya akun?{" "}
                                    <Link href="/register" className="text-blue-600 hover:underline ml-1">
                                        Daftar di sini
                                    </Link>
                                </p>

                                {/* Username Field */}
                                <div>
                                    <label className="block text-gray-700 font-medium">Username</label>
                                    <Input
                                        type="text"
                                        placeholder="Masukkan username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                    {error.username && <p className="text-red-500 text-sm">{error.username}</p>}
                                </div>

                                {/* Password Field */}
                                <div>
                                    <label className="block text-gray-700 font-medium">Password</label>
                                    <Input
                                        type="password"
                                        placeholder="Masukkan password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    {error.password && <p className="text-red-500 text-sm">{error.password}</p>}
                                </div>

                                <Button variant={"blue"} type="submit" className="w-full">
                                    Masuk
                                </Button>



                                <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
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
                </div>
            </AuroraBackground>
        </main>
    );
}
