"use client";

import ButtonLogout from "@/components/ui/buttons/button-logout";
import { deleteCookie } from "cookies-next";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";

const dummyAvatars = [
    "/gradient1.png",
    "/gradient2.png",
    "/gradient3.png",
];

export default function Profile() {
    const [name, setName] = useState("John Doe");
    const [selectedAvatar, setSelectedAvatar] = useState("/profile.png");
    const router = useRouter();

    // Load dari localStorage saat page dibuka
    useEffect(() => {
        const storedName = localStorage.getItem("displayName");
        const storedAvatar = localStorage.getItem("avatar");

        if (storedName) setName(storedName);
        if (storedAvatar) setSelectedAvatar(storedAvatar);
    }, []);

    // Handle simpan profile
    const handleSave = () => {
        localStorage.setItem("displayName", name);
        localStorage.setItem("avatar", selectedAvatar);
        alert("Profile berhasil disimpan!");
        router.back();
    };

    // Handle logout
    const handleLogout = () => {
        deleteCookie("accessToken");
        deleteCookie("refreshToken");
        deleteCookie("role");
        deleteCookie("username");
        router.push("/login");
    };

    return (
        <div className="p-8 mt-10 max-w-xl mx-auto border rounded-xl">
            {/* Tombol Kembali */}
            <button onClick={() => router.back()} className="mb-4 flex items-center text-blue-500">
                <IoArrowBackOutline className="mr-1" /> Kembali
            </button>

            <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

            {/* Input Nama */}
            <div className="mb-6">
                <label className="block mb-2">Nama</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border rounded"
                />
            </div>

            {/* Pilih Avatar */}
            <div className="mb-6">
                <label className="block mb-2">Pilih Avatar</label>
                <div className="flex gap-4">
                    {dummyAvatars.map((avatar) => (
                        <Image
                            key={avatar}
                            src={avatar}
                            alt="Avatar"
                            width={64}
                            height={64}
                            className={`cursor-pointer border-2 rounded-full ${selectedAvatar === avatar ? "border-blue-500" : "border-transparent"
                                }`}
                            onClick={() => setSelectedAvatar(avatar)}
                        />
                    ))}
                </div>
            </div>

            {/* Tombol Simpan */}
            <button
                onClick={handleSave}
                className="w-full bg-blue-600 text-white py-2 rounded font-semibold mb-4"
            >
                Simpan
            </button>

            {/* Tombol Logout */}
            <ButtonLogout
                className="w-full body-bold"
                onClick={handleLogout}
            />
        </div>
    );
}
