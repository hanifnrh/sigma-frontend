"use client";

import ButtonLogout from "@/components/ui/buttons/button-logout";
import ButtonSave from "@/components/ui/buttons/button-save";
import { useToast } from "@/hooks/use-toast";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";

const avatarMap = {
    PP1: 1,
    PP2: 2,
    PP3: 3,
    PP4: 4,
    PP5: 5,
};

type AvatarKey = keyof typeof avatarMap;
const avatarList = Object.keys(avatarMap) as AvatarKey[];

export default function Profile() {
    const { toast } = useToast();
    const [fullName, setFullName] = useState<string | null>(null);
    const [selectedAvatar, setSelectedAvatar] = useState<AvatarKey>("PP1");
    const [username, setUsername] = useState<string | null>(null);
    const router = useRouter();

    const handleLogout = () => {
        deleteCookie("accessToken");
        deleteCookie("refreshToken");
        deleteCookie("role");
        deleteCookie("username");
        router.push('/login');
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            const user = getCookie("username") as string | undefined;
            const userRole = getCookie("role") as string | undefined;
            setUsername(user ?? null);
        }
    }, []);

    const fetchAccessToken = async () => {
        try {
            const response = await fetch("/api/refresh", {
                method: "POST",
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to refresh token.");
            }

            return data.accessToken;
        } catch (error) {
            console.error("Error refreshing token:", error);
            return null;
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            let token = getCookie("accessToken") as string | undefined;

            // Jika token tidak ada atau kadaluarsa, refresh token
            if (!token) {
                token = await fetchAccessToken();
                if (!token) {
                    console.error("Gagal mendapatkan access token.");
                    return;
                }
                setCookie("accessToken", token, { path: "/" });
            }

            const fetchWithToken = async (accessToken: string) => {
                return await fetch("https://sigma-backend-production.up.railway.app/api/user/profile/update/", {
                    credentials: "include",
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                    },
                });
            };

            try {
                let res = await fetchWithToken(token);

                // Coba refresh token jika 401
                if (res.status === 401) {
                    const newToken = await fetchAccessToken();
                    if (!newToken) throw new Error("Gagal refresh token.");

                    setCookie("accessToken", newToken, { path: "/" });

                    res = await fetchWithToken(newToken);
                }

                if (!res.ok) {
                    throw new Error(`Gagal fetch profile. Status: ${res.status}`);
                }

                const data = await res.json();
                setFullName(data.full_name || "");
                setSelectedAvatar(data.profile_picture?.toString() || "PP1");

            } catch (error) {
                console.error("Error saat fetch profile:", error);
            }
        };

        fetchProfile();
    }, []);

    const handleSave = async () => {
        let token = getCookie("accessToken");

        if (!token) {
            token = await fetchAccessToken();
            if (!token) {
                alert("Token tidak valid. Silakan login ulang.");
                return;
            }
            setCookie("accessToken", token, { path: "/" });
        }

        const bodyData = {
            full_name: fullName,
            profile_picture: avatarMap[selectedAvatar],
        };

        let res = await fetch("https://sigma-backend-production.up.railway.app/api/user/profile/update/", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(bodyData),
        });

        if (res.status === 401) {
            token = await fetchAccessToken();
            if (!token) {
                alert("Gagal memperbarui profil. Silakan login ulang.");
                return;
            }
            setCookie("accessToken", token, { path: "/" });

            res = await fetch("https://sigma-backend-production.up.railway.app/api/user/profile/update/", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(bodyData),
            });
        }

        if (res.ok) {
            setCookie("full_name", fullName ?? "", { path: "/" });
            setCookie("profile_picture", selectedAvatar, { path: "/" });
            toast({
                title: "Berhasil!",
                description: "Profil berhasil diperbarui.",
                variant: "success",
            });
        } else {
            toast({
                title: "Gagal",
                description: "Gagal menyimpan perubahan.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="p-8 my-10 max-w-xl mx-auto border rounded-xl">
            <button onClick={() => router.push('/tamu/dashboard')} className="mb-4 flex items-center text-blue-500">
                <IoArrowBackOutline className="mr-1" /> Kembali
            </button>

            <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

            {/* Username */}
            <div className="flex flex-col gap-2 mb-6">
                <div className="flex items-center gap-2">
                    <label className="text-base">Username</label>
                    <p className="text-base font-semibold text-red-500">
                        &#42;Tidak dapat diganti
                    </p>
                </div>
                <input
                    type="text"
                    value={username || ""}
                    disabled
                    className="w-full p-2 font-semibold border rounded-lg bg-gray-100 text-gray-600"
                />
            </div>

            {/* Full Name */}
            <div className="flex flex-col gap-2 mb-6">
                <label className="text-base">Nama Lengkap</label>
                <input
                    type="text"
                    value={fullName ?? ""}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={fullName ?? "Nama lengkap"}
                    className="w-full p-2 border rounded-lg font-semibold"
                />
            </div>

            {/* Avatar Selection */}
            <div className="mb-6">
                <label className="block mb-2">Pilih Avatar</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                    {avatarList.map((avatar) => (
                        <Image
                            key={avatar}
                            src={`/profile/${avatar}.jpg`}
                            alt={avatar}
                            width={64}
                            height={64}
                            className={`cursor-pointer border-2 rounded-full ${selectedAvatar === avatar ? "border-violet-600 border-3" : "border-transparent"
                                }`}
                            onClick={() => setSelectedAvatar(avatar)}
                        />
                    ))}

                </div>
            </div>

            <ButtonSave className='w-full mt-5 font-bold' onClick={handleSave} />

            <ButtonLogout className='w-full mt-5 font-bold' onClick={handleLogout} />
        </div>
    );
}
