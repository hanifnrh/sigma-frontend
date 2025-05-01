"use client";

// Context for data fetching

// UI Components
import ContactForm from '@/components/ui/contact-form';
import Navbar from "../navbar";

// Libraries

// Icons
import TopMenu from '../top-menu';

// Private route for disallow unauthenticated users

export default function UmpanBalik() {
    return (
        <main className="w-full bg-white dark:bg-zinc-900 relative">
            <Navbar />
            <div className='flex flex-col mt-10 sm:mt-0 sm:pl-44 md:pl-56 xl:pl-64 w-full'>
                <div className="sticky top-10 sm:top-0 z-10">
                    <TopMenu />
                    <div className="flex header py-2 px-4 font-semibold justify-between items-center border-b bg-white">
                        <div className='flex font-bold text-2xl'>
                            Umpan Balik
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2  w-full h-full">
                    <div className="heading-hero p-4">
                        <ContactForm></ContactForm>
                    </div>
                    <div className="wrapper flex justify-start lg:justify-center w-full p-4 gap-3">
                        <div className="heading-hero text-center flex flex-col justify-center">
                            <h1 className={`bg-clip-text text-transparent bg-[linear-gradient(107deg,#802696_8.32%,#6348CF_60.18%,#5DAEDB_105.75%)] text-3xl font-bold lg:text-6xl text-center md:text-start relative font-semibold tracking-[-0.04em] col-span-12 lg:col-span-6 lg:leading-[60px] xl:col-span-4`}>
                                Umpan Balik
                            </h1>
                            <p className='font-semibold text-center md:text-start text-sm lg:text-xl'>
                                Berikan umpan balik terkait sistem SIGMA. Segala kritik dan masukan akan diterima dan dipertimbangkan.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
