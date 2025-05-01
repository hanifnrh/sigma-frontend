"use client";
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { GradientButton } from '../ui/gradient-button';

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const currentPath = usePathname();

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`top-5 fixed w-full z-50 bg-transparent backdrop-blur-sm px-4 md:px-10 xl:px-20`}>
            <nav className="rounded-2xl sm:rounded-full border border-violet-200">
                <div className="flex flex-wrap items-center justify-between mx-auto px-5 py-3">
                    <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <Image
                            src="/sigmalogonobg.png"
                            alt="Logo"
                            width={256}
                            height={256}
                            className="w-14 h-auto"
                        />
                        <p className='font-bold text-xl bg-clip-text text-transparent bg-[linear-gradient(107deg,#802696_8.32%,#6348CF_60.18%,#5DAEDB_105.75%)]'>
                            SIGMA
                        </p>
                    </Link>
                    <button onClick={toggleNavbar} type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-purple-500 md:hidden" aria-controls="navbar-default" aria-expanded={isOpen}>
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                    <div className={`w-full md:block md:w-auto ${isOpen ? 'block' : 'hidden'}`} id="navbar-default">
                        <ul className="items-center flex flex-col p-4 md:p-0 gap-4 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0">
                            <li>
                                <Link href="/login" className={currentPath === "/login" ? "block py-2 px-3 body-bold text-purple-500 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:p-0 " : "block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:p-0 "}>Dasbor</Link>
                            </li>
                            <li>
                                <Link href="/tentang" className={currentPath === "/tentang" ? "block py-2 px-3 body-bold text-purple-500 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:p-0 " : "block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:p-0 "}>Tentang</Link>
                            </li>
                            <li>
                                <Link href="/bantuan" className={currentPath === "/bantuan" ? "block py-2 px-3 body-bold text-purple-500 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:p-0 " : "block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:p-0 "}>Bantuan</Link>
                            </li>
                            <li>
                                <Link href="/login">
                                    <GradientButton className='border-3 border-violet-200'>Masuk</GradientButton>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
