"use client";

// UI Components
import ButtonLogin from "@/components/ui/buttons/button-login";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

// Libraries
import { cn } from "@/lib/utils";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";

// Schema Validasi
const LoginSchema = z.object({
    username: z.string().min(2, { message: "Username setidaknya harus 2 karakter." }),
    password: z.string().min(6, { message: "Password setidaknya harus 6 karakter." }),
});

export default function Login() {
    const { toast } = useToast();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState({ username: "", password: "" });
    const router = useRouter();
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);


    useEffect(() => {
        const savedUsername = localStorage.getItem('rememberedUsername');
        if (savedUsername) {
            setUsername(savedUsername);
            setRememberMe(true);
        }
    }, []);

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

        // Jika remember me dicentang, simpan username di localStorage
        if (rememberMe) {
            localStorage.setItem('rememberedUsername', username);
        } else {
            localStorage.removeItem('rememberedUsername');
        }

        // Jika validasi sukses, lanjutkan dengan login
        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password, rememberMe }),
            });

            const result = await response.json();

            if (!response.ok) {
                setError({ username: result.error || "Login failed", password: "" });
                toast({
                    variant: "destructive",
                    title: "Login Gagal",
                    description: "Username atau password salah.",
                });
                return;
            }

            // Redirect berdasarkan role
            let redirectPath = "/";
            switch (result.role.toLowerCase()) {
                case "pemilik":
                    redirectPath = "/pemilik/dashboard";
                    break;
                case "staf":
                    redirectPath = "/staf/dashboard";
                    break;
                case "tamu":
                    redirectPath = "/tamu/dashboard";
                    break;
                default:
                    redirectPath = "/";
                    break;
            }

            toast({
                variant: "success",
                title: "Login berhasil",
                description: "Anda akan diarahkan ke halaman dasbor.",
            });
            router.push(redirectPath);

        } catch (error) {
            console.error("Login Error:", error);
            setError({ username: "Terdapat masalah. Harap coba lagi.", password: "" });
            toast({
                variant: "destructive",
                title: "Terjadi Kesalahan",
                description: "Gagal terhubung ke server. Coba lagi nanti.",
            });
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
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 items-center gap-8">
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
                                <label className="block text-gray-700 font-semibold">Username</label>
                                <Input
                                    type="text"
                                    placeholder="Masukkan username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="font-semibold"
                                />
                                {error.username && <p className="text-red-500 text-sm">{error.username}</p>}
                            </div>

                            {/* Password Field */}
                            <div className="flex flex-col gap-2 relative">
                                <label className="block text-gray-700 font-semibold">Password</label>
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Masukkan password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="font-semibold pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-3 top-[50px] transform -translate-y-1/2 text-zinc-600 hover:text-zinc-800"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                                {error.password && <p className="text-red-500 text-sm">{error.password}</p>}
                            </div>

                        </div>


                        <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
                            <ButtonLogin type="submit" className="w-full rounded-xl" />
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-3 text-sm text-gray-800">
                                    Ingat saya
                                </label>
                            </div>
                            {/* <div>
                                <a href="#" className="text-blue-600 text-sm hover:underline">
                                    Lupa Password?
                                </a>
                            </div> */}
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
