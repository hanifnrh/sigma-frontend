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

// Icons
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
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const user = getCookie("username") as string | undefined;
            const userRole = getCookie("role") as string | undefined;
            setUsername(user ?? null);
            setRole(userRole ?? null);
        }
    }, []);

    return (
        <div className="flex header w-full py-2 px-4 body-light justify-between items-center border-b bg-white">
            <div className='flex items-center navbar-title body-light'>
                <GrMapLocation className='text-xl' />
                <span className='ml-2 dark:text-white text-xs sm:text-sm'>
                    Lokasi: Kecamatan Musuk, Boyolali, Jawa Tengah
                </span>
            </div>
            <div className="flex justify-center items-center text-4xl relative">
                <div className="relative mr-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger className='p-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'>
                            <IoIosNotificationsOutline className="dark:text-white cursor-pointer text-xl sm:text-2xl" onClick={() => alert(notifications.map(notif => `${notif.data}: ${notif.status} - ${notif.timestamp.toLocaleTimeString()}`).join("\n"))} />
                            {/* Notification Badge */}
                            {notifications.length > 0 && (
                                <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500"></span>
                            )}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className='body-light w-72'>
                            <DropdownMenuLabel>Notifikasi</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {notifications.map((notif, index) => (
                                <DropdownMenuItem key={index} className='flex justify-center items-center border-b'>
                                    <div className='mx-2'>
                                        {notif.icon}
                                    </div>
                                    <div className='flex flex-col items-start w-full'>
                                        <div>
                                            {notif.data}: <span className={`${notif.color} body-bold`}>{notif.status}</span> - {notif.timestamp.toLocaleTimeString()}
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
                <div className="flex items-center border-l ml-3 pl-5 gap-2">
                    <p className="body text-base">
                        {role} | {username}
                    </p>
                    <Image
                        src="/profile.png" alt="Profile Picture" className='w-8 h-auto' width={500} height={500}
                    />
                </div>
                <RiArrowDropDownLine className="dark:text-white mx-1" />
            </div>
        </div>
    );
};

export default TopMenu;
