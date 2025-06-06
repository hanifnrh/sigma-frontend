"use client";

// UI Components
import ButtonRegister from "@/components/ui/buttons/button-register";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

// Libraries
import { cn } from "@/lib/utils";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

// Schema Validasi
const RegisterSchema = z.object({
    username: z.string().min(2, { message: "Username setidaknya harus 2 karakter." }),
    email: z.string().email({ message: "Alamat email invalid." }),
    password: z.string().min(6, { message: "Password setidaknya harus 6 karakter." }),
});

export default function Register() {
    const { toast } = useToast();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState({ username: "", email: "", password: "", confirmPassword: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const RegisterSchema = z
            .object({
                username: z.string().min(2, { message: "Username setidaknya harus 2 karakter." }),
                email: z.string().email({ message: "Alamat email invalid." }),
                password: z.string().min(6, { message: "Password setidaknya harus 6 karakter." }),
                confirmPassword: z.string(),
            })
            .refine((data) => data.password === data.confirmPassword, {
                message: "Konfirmasi password tidak cocok.",
                path: ["confirmPassword"],
            });

        // Validasi dengan Zod
        const validationResult = RegisterSchema.safeParse({ username, email, password, confirmPassword });

        if (!validationResult.success) {
            const fieldErrors = validationResult.error.format();
            setError({
                username: fieldErrors.username?._errors[0] || "",
                email: fieldErrors.email?._errors[0] || "",
                password: fieldErrors.password?._errors[0] || "",
                confirmPassword: fieldErrors.confirmPassword?._errors[0] || "",
            });

            toast({
                variant: "destructive",
                title: "Validasi Gagal",
                description:
                    fieldErrors.username?._errors[0] ||
                    fieldErrors.email?._errors[0] ||
                    fieldErrors.password?._errors[0] ||
                    fieldErrors.confirmPassword?._errors[0] ||
                    "Cek kembali inputan kamu.",
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
                setError({ username: "Registrasi gagal", email: "", password: "", confirmPassword: "" });

                toast({
                    variant: "destructive",
                    title: "Registrasi gagal",
                    description: "Terdapat masalah. Harap coba lagi.",
                });
                return;
            }

            // Redirect ke halaman login setelah berhasil register
            toast({
                variant: "success",
                title: "Berhasil membuat akun",
                description: "Anda akan diarahkan ke halaman login.",
            });
            router.push("/login");
        } catch (error) {
            console.error("Registration Error:", error);
            setError({ username: "Terdapat masalah. Harap coba lagi.", email: "", password: "", confirmPassword: "" });
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
                            <Link href="/login" className="w-full flex items-center justify-start space-x-3 rtl:space-x-reverse">
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
                            <div className="flex flex-col gap-2 relative">
                                <label className="block text-gray-700 font-semibold">Username</label>
                                <Input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                                {error.username && <p className="text-red-500 text-sm">{error.username}</p>}
                            </div>

                            <div className="flex flex-col gap-2 relative">
                                <label className="block text-gray-700 font-semibold">Email</label>
                                <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                {error.email && <p className="text-red-500 text-sm">{error.email}</p>}
                            </div>

                            <div className="flex flex-col gap-2 relative">
                                <label className="block text-gray-700 font-semibold">Password</label>
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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

                            <div className="flex flex-col gap-2 relative">
                                <label className="block text-gray-700 font-semibold">Konfirmasi Password</label>
                                <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Konfirmasi Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                {error.confirmPassword && <p className="text-red-500 text-sm">{error.confirmPassword}</p>}
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    className="absolute right-3 top-[50px] transform -translate-y-1/2 text-zinc-600 hover:text-zinc-800"
                                    tabIndex={-1}
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                        </div>

                        <ButtonRegister type="submit" className="w-full rounded-xl" />
                    </form>
                </div>
            </div>
        </main>
    );
}
