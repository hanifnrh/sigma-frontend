"use client";

// Context for data fetching
import { useParameterContext } from "@/components/context/lantai-satu/ParameterContext";

// UI Components
import ButtonLogout from "@/components/ui/buttons/button-logout";
import withIconStyles from "@/components/ui/withIconStyles";
import { deleteCookie } from "cookies-next";

// Libraries
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';

// Icons
import { GiRooster } from "react-icons/gi";
import { GoHistory } from "react-icons/go";
import { HiMenuAlt2, HiX } from "react-icons/hi";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { IoPeopleOutline, IoRocketOutline } from "react-icons/io5";
import { LuBook } from "react-icons/lu";
import { MdAutoGraph, MdOutlineSensors } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const currentPath = usePathname();
    const { overallStatus, overallColor } = useParameterContext();
    const router = useRouter();

    const handleLogout = () => {
        deleteCookie("accessToken");
        deleteCookie("refreshToken");
        deleteCookie("role");
        deleteCookie("username");
        router.push('/login');
    };

    const toggleNavbar = () => setIsOpen(!isOpen);

    const StyledDashboardIcon = withIconStyles(RxDashboard);
    const StyledGraphIcon = withIconStyles(MdAutoGraph);
    const StyledRoosterIcon = withIconStyles(GiRooster);
    const StyledSensorsIcon = withIconStyles(MdOutlineSensors);
    const StyledHistoryIcon = withIconStyles(GoHistory);
    const StyledFeedbackIcon = withIconStyles(IoRocketOutline);
    const StyledInfoIcon = withIconStyles(IoIosInformationCircleOutline);
    const StyledBookIcon = withIconStyles(LuBook);
    const StyledMenuIcon = withIconStyles(HiMenuAlt2);
    const StyledCloseIcon = withIconStyles(HiX);
    const StyledIoPeopleOutlineIcon = withIconStyles(IoPeopleOutline);

    const MenuItem = ({ href, Icon, label }: { href: string; Icon: React.ComponentType; label: string }) => (
        <li>
            <Link href={href} className={`flex items-center p-2 rounded-lg ${currentPath === href ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400' : 'text-gray-900 dark:text-white'} transition-all hover:bg-indigo-50 dark:hover:bg-indigo-900 hover:text-indigo-400 dark:hover:text-indigo-200 group`}>
                <Icon />
                <span>{label}</span>
            </Link>
        </li>
    );

    return (
        <div className="bg-white dark:bg-zinc-950 w-full mx-auto">
            <div className="fixed top-0 z-50 w-full bg-white dark:bg-gray-800 transition-colors">
                <button onClick={toggleNavbar} className="flex justify-start items-center p-2 text-gray-900 sm:hidden dark:text-white z-50 bg-white dark:bg-zinc-950 w-full border-b relative" aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}>
                    {isOpen ? <><StyledCloseIcon /> Tutup Menu</> : <><StyledMenuIcon /> Buka Menu</>}
                </button>

                <aside id="separator-sidebar" className={`fixed top-0 left-0 z-40 w-64 sm:w-44 md:w-56 xl:w-64 h-screen transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0`} aria-label="Sidebar">
                    <div className="flex flex-col justify-between items-stretch h-full px-3 py-4 overflow-y-auto bg-white dark:bg-zinc-950 border-r dark:border-gray-700">
                        <Link href="/" className="flex items-center gap-2 ps-2.5">
                            <Image src="/sigmalogonobg.png" alt="Logo" width={256} height={256} className="h-16 md:h-12 xl:h-16 w-auto mt-8 sm:mt-0" />
                            <p className='mt-8 sm:m-0 font-bold text-xl bg-clip-text text-transparent bg-[linear-gradient(107deg,#802696_8.32%,#6348CF_60.18%,#5DAEDB_105.75%)]'>
                                SIGMA
                            </p>
                        </Link>

                        <ul className="space-y-2 font-semibold mt-5 sm:mt-0">
                            <p className='font-bold navbar-title text-xs mb-2'>MENU UTAMA</p>
                            <MenuItem href="/pemilik/dashboard" Icon={StyledDashboardIcon} label="Dasbor" />
                            <MenuItem href="/pemilik/grafik" Icon={StyledGraphIcon} label="Grafik" />
                            <MenuItem href="/pemilik/data-ayam" Icon={StyledRoosterIcon} label="Data Ayam" />
                            <MenuItem href="/pemilik/perangkat-keras" Icon={StyledSensorsIcon} label="Perangkat Keras" />
                            <MenuItem href="/pemilik/riwayat" Icon={StyledHistoryIcon} label="Riwayat" />
                            <li>
                                <Link
                                    href="https://sigma-backend-production.up.railway.app/admin/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center p-2 rounded-lg text-gray-900 dark:text-white transition-all hover:bg-indigo-50 dark:hover:bg-indigo-900 hover:text-indigo-400 dark:hover:text-indigo-200 group`}
                                >
                                    <StyledIoPeopleOutlineIcon />
                                    <span>Manajemen Akun</span>
                                </Link>
                            </li>

                        </ul>

                        <ul className="pt-4 space-y-2 font-semibold border-t border-gray-200 dark:border-gray-700">
                            <p className='font-bold navbar-title text-xs mb-2'>BANTUAN</p>
                            <MenuItem href="/pemilik/umpan-balik" Icon={StyledFeedbackIcon} label="Umpan balik" />
                            <MenuItem href="/pemilik/informasi" Icon={StyledInfoIcon} label="Informasi" />
                            <MenuItem href="/pemilik/standar-operasional" Icon={StyledBookIcon} label="Standar operasional" />
                        </ul>

                        <div className="status-container w-full relative mt-5 sm:mt-0">
                            <ButtonLogout className='w-full mt-5 font-bold' onClick={handleLogout} />
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Navbar;
