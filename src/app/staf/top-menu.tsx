"use client"

// Context for data fetching
import { useNotifications } from "@/components/context/NotificationContext";

// UI Components
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from '@/components/ui/mode-toggle';

// Libraries
import { deleteCookie, setCookie } from "cookies-next";

// Icons
import { LogOut, UserRoundPen } from "lucide-react";
import { GrMapLocation } from "react-icons/gr";
import { IoIosNotificationsOutline } from "react-icons/io";
import { RiArrowDropDownLine } from "react-icons/ri";

// Private route for disallow unauthenticated users
import { getCookie } from "cookies-next";
import Image from "next/image";
import { useEffect, useState } from "react";


type Notification = {
    parameter: string;
    status: string;
    timestamp: Date;
    message: string;
    icon: React.ReactNode;
    color: string;
};

const TopMenu = () => {
    const { notifications } = useNotifications();
    const [username, setUsername] = useState<string | null>(null);
    const [fullName, setFullName] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [selectedAvatar, setSelectedAvatar] = useState<string>("PP1");

    useEffect(() => {
        if (typeof window !== "undefined") {
            const user = getCookie("username") as string | undefined;
            const userRole = getCookie("role") as string | undefined;

            setUsername(user ?? null);
            setRole(userRole ?? null);
        }
    }, []);

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
                const res = await fetchWithToken(token);
                if (res.status === 401) {
                    const newToken = await fetchAccessToken();
                    if (!newToken) throw new Error("Gagal refresh token.");

                    setCookie("accessToken", newToken, { path: "/" });
                    const newRes = await fetchWithToken(newToken);
                    if (newRes.ok) {
                        const data = await newRes.json();
                        setFullName(data.full_name || "");

                        // Mapping profile_picture ID to the correct image
                        const profilePictureMap: { [key: number]: string } = {
                            1: "PP1",
                            2: "PP2",
                            3: "PP3",
                            4: "PP4",
                            5: "PP5",
                        };

                        const profilePicture = profilePictureMap[data.profile_picture] || "PP1"; // Default to PP1 if undefined
                        setSelectedAvatar(profilePicture);
                    }
                } else if (res.ok) {
                    const data = await res.json();
                    setFullName(data.full_name || "");

                    // Mapping profile_picture ID to the correct image
                    const profilePictureMap: { [key: number]: string } = {
                        1: "PP1",
                        2: "PP2",
                        3: "PP3",
                        4: "PP4",
                        5: "PP5",
                    };

                    const profilePicture = profilePictureMap[data.profile_picture] || "PP1"; // Default to PP1 if undefined
                    setSelectedAvatar(profilePicture);
                } else {
                    throw new Error(`Gagal fetch profile. Status: ${res.status}`);
                }
            } catch (error) {
                console.error("Error saat fetch profile:", error);
            }
        };

        fetchProfile();
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

            } catch (error) {
                console.error("Error saat fetch profile:", error);
            }
        };

        fetchProfile();
    }, []);


    return (
        <>
            {/* Desktop */}
            <div className="hidden sm:flex header w-full py-2 px-4 font-semibold justify-between items-center border-b bg-white">
                <div className='flex items-center navbar-title font-semibold'>
                    <GrMapLocation className='text-xl' />
                    <span className='ml-2 dark:text-white text-xs sm:text-sm'>
                        Lokasi: Penggung, Kecamatan Musuk, Boyolali, Jawa Tengah
                    </span>
                </div>
                <div className="flex justify-center items-center text-4xl relative">
                    <div className="relative mr-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger className='p-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'>
                                <IoIosNotificationsOutline className="dark:text-white cursor-pointer text-xl sm:text-2xl" onClick={() => alert(notifications.map(notif => `${notif.data}: ${notif.status} - ${notif.timestamp.toLocaleTimeString()}`).join("\n"))} />
                                {/* Notification Badge */}
                                {notifications.length > 0 && (
                                    <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500"></span>
                                )}
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className='font-semibold w-72'>
                                <DropdownMenuLabel>Notifikasi</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {notifications.map((notif, index) => (
                                    <DropdownMenuItem key={index} className='flex justify-center items-center border-b'>
                                        <div className='mx-2'>
                                            {notif.icon}
                                        </div>
                                        <div className='flex flex-col items-start w-full'>
                                            <div>
                                                {notif.data}: <span className={`${notif.color} font-bold`}>{notif.status}</span> - {notif.timestamp.toLocaleTimeString()}
                                            </div>
                                            <div>
                                                {notif.message}
                                            </div>
                                        </div>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <ModeToggle />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="flex items-center border-l ml-3 pl-5 gap-2 cursor-pointer">
                                <div className="flex items-center font-semibold text-base gap-2">
                                    <p className="font-semibold bg-emerald-100 text-emerald-600 rounded-md px-3 flex justify-center items-center">
                                        {role}
                                    </p>
                                    <p className="">
                                        {(fullName?.split(" ")[0]) || username || "User"}
                                    </p>
                                </div>
                                <Image
                                    src={`/profile/${selectedAvatar}.jpg`}
                                    alt="Profile Picture"
                                    className="w-8 h-8 rounded-full"
                                    width={32}
                                    height={32}
                                />
                                <RiArrowDropDownLine className="dark:text-white mx-1 text-2xl" />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="font-semibold w-48">
                            <DropdownMenuLabel>Profil</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => window.location.href = '/staf/profile'}>
                                <div className="flex items-center gap-2">
                                    <UserRoundPen />
                                    Edit Profil
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                                deleteCookie("accessToken");
                                deleteCookie("refreshToken");
                                deleteCookie("role");
                                deleteCookie("username");
                                window.location.href = '/login';
                            }}
                                className="text-red-500 "
                            >
                                <div className="flex items-center gap-2">
                                    <LogOut />
                                    Keluar
                                </div>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Mobile */}
            <div className="flex sm:hidden header w-full py-2 px-4 font-semibold justify-between items-center border-b bg-white">
                <div className="w-full flex justify-between items-center text-4xl relative">
                    <div className="flex items-center">
                        <div className="relative mr-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger className='p-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'>
                                    <IoIosNotificationsOutline className="dark:text-white cursor-pointer text-xl sm:text-2xl" onClick={() => alert(notifications.map(notif => `${notif.data}: ${notif.status} - ${notif.timestamp.toLocaleTimeString()}`).join("\n"))} />
                                    {/* Notification Badge */}
                                    {notifications.length > 0 && (
                                        <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500"></span>
                                    )}
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className='font-semibold w-72'>
                                    <DropdownMenuLabel>Notifikasi</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {notifications.map((notif, index) => (
                                        <DropdownMenuItem key={index} className='flex justify-center items-center border-b'>
                                            <div className='mx-2'>
                                                {notif.icon}
                                            </div>
                                            <div className='flex flex-col items-start w-full'>
                                                <div>
                                                    {notif.data}: <span className={`${notif.color} font-bold`}>{notif.status}</span> - {notif.timestamp.toLocaleTimeString()}
                                                </div>
                                                <div>
                                                    {notif.message}
                                                </div>
                                            </div>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <ModeToggle />
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="flex items-center gap-2 cursor-pointer">
                                <div className="flex items-center font-semibold text-base gap-2">
                                    <p className="font-semibold bg-emerald-100 text-emerald-600 rounded-md px-3 flex justify-center items-center">
                                        {role}
                                    </p>
                                    <p className="">
                                        {(fullName?.split(" ")[0]) || username || "User"}
                                    </p>
                                </div>
                                <Image
                                    src={`/profile/${selectedAvatar}.jpg`}
                                    alt="Profile Picture"
                                    className="w-8 h-8 rounded-full"
                                    width={32}
                                    height={32}
                                />
                                <RiArrowDropDownLine className="dark:text-white text-2xl" />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="font-semibold w-48">
                            <DropdownMenuLabel>Profil</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => window.location.href = '/staf/profile'}>
                                <div className="flex items-center gap-2">
                                    <UserRoundPen />
                                    Edit Profil
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                                deleteCookie("accessToken");
                                deleteCookie("refreshToken");
                                deleteCookie("role");
                                deleteCookie("username");
                                window.location.href = '/login';
                            }}
                                className="text-red-500 "
                            >
                                <div className="flex items-center gap-2">
                                    <LogOut />
                                    Keluar
                                </div>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </>
    );
};

export default TopMenu;
