'use client';
// Context for data fetching


// UI Components
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Libraries
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCookie } from "cookies-next";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { refreshAccessToken } from "../api/refresh/route";

// Icons


// Private route for disallow unauthenticated users



const RegisterSchema = z.object({
    username: z.string().min(2, { message: "Username must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
    role: z.string().min(1, { message: "Role is required." })
});

type RegisterFormValues = z.infer<typeof RegisterSchema>;

function Register() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            role: "staf", // Default role
        },
    });

    const handleSubmit = async (data: RegisterFormValues) => {
        try {
            // Ambil token dari localStorage
            let token = getCookie("accessToken");

            // Jika token tidak ada atau kadaluarsa, refresh token
            if (!token) {
                token = await refreshAccessToken();
            }

            // Cek apakah token ada
            if (!token) {
                toast({
                    title: "Error",
                    description: "Token tidak ditemukan. Silakan login terlebih dahulu.",
                    variant: "destructive",
                });
                return;
            }

            // Kirim request POST untuk registrasi dengan header Authorization
            const response = await fetch("https://sigma-backend-production.up.railway.app/api/register ", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            const responseData = await response.json();

            if (response.ok) {
                toast({
                    title: "Registration Successful!",
                    description: "You can now log in to your account.",
                });
                router.push("/login"); // Redirect to login page after successful registration
            } else {
                toast({
                    title: "Registration Failed",
                    description: responseData.detail || "An error occurred during registration.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong during registration.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <div className="grid md:grid-cols-2 items-center gap-4 max-md:gap-8 max-w-6xl max-md:max-w-lg w-full p-4 m-4 shadow rounded-md">
                <div className="md:max-w-md w-full px-4 py-4">

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 mt-4">
                            <div className="">
                                <h3 className="text-gray-800 text-3xl font-extrabold">Daftar</h3>
                                <p className="text-sm mt-4 text-gray-800">
                                    Sudah punya akun?{' '}
                                    <a
                                        href="/login"
                                        className="text-blue-600 body hover:underline ml-1 whitespace-nowrap"
                                    >
                                        Masuk di sini
                                    </a>
                                </p>
                            </div>
                            {/* Username Field */}
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Masukkan username" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Email Field */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="Masukkan email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Password Field */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Masukkan password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Role Field */}
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Role</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Masukkan role (pemilik/staf)" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button variant={"blue"} type="submit" className="w-full">
                                Daftar
                            </Button>
                        </form>
                    </Form>

                </div>
            </div>
        </div>
    );
}

export default Register;
