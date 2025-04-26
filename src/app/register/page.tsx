"use client";

// UI Components
import ButtonRegister from "@/components/ui/buttons/button-register";
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
const RegisterSchema = z.object({
    username: z.string().min(2, { message: "Username must be at least 2 characters." }),
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export default function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState({ username: "", email: "", password: "" });
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validasi dengan Zod
        const validationResult = RegisterSchema.safeParse({ username, email, password });

        if (!validationResult.success) {
            const fieldErrors = validationResult.error.format();
            setError({
                username: fieldErrors.username?._errors[0] || "",
                email: fieldErrors.email?._errors[0] || "",
                password: fieldErrors.password?._errors[0] || "",
            });
            return;
        }

        // Jika validasi sukses, lanjutkan dengan register
        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });

            const result = await response.json();

            if (!response.ok) {
                setError({ username: result.error || "Registration failed", email: "", password: "" });
                return;
            }

            // Redirect ke halaman login setelah berhasil register
            router.push("/login");
        } catch (error) {
            console.error("Registration Error:", error);
            setError({ username: "Something went wrong. Please try again.", email: "", password: "" });
        }
    };

    return (
        <main className="w-full h-screen flex flex-col items-center justify-center">
            <Image
                src="https://images.unsplash.com/photo-1618397746666-63405ce5d015?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                width={1000}
                height={1000}
                alt="Register Image"
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
                    <div className="hidden lg:block relative w-full">
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
                            <h1 className="font-bold text-white text-5xl xl:text-7xl">
                                Daftar Sekarang!
                            </h1>
                        </div>
                        <Image
                            src="https://images.unsplash.com/photo-1618397746666-63405ce5d015?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            width={1000}
                            height={1000}
                            alt="Register Image"
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
                                <h3 className="text-gray-800 text-3xl font-extrabold">Daftar</h3>
                                <p className="text-sm text-gray-800">
                                    Sudah punya akun?{" "}
                                    <Link href="/login" className="text-blue-600 hover:underline ml-1">
                                        Masuk di sini
                                    </Link>
                                </p>
                            </div>
                        </div>

                        {/* Form Field */}
                        <div className="flex flex-col gap-4">
                            <Input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                            {error.username && <p className="text-red-500 text-sm">{error.username}</p>}
                            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            {error.email && <p className="text-red-500 text-sm">{error.email}</p>}
                            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            {error.password && <p className="text-red-500 text-sm">{error.password}</p>}
                        </div>

                        <ButtonRegister type="submit" className="w-full rounded-xl" />
                    </form>
                </div>
            </div>
        </main>
    );
}
