"use client";

// UI Components
import { BentoDemo } from '@/components/landing/bento/bento';
import { Feature } from '@/components/landing/feature/feature';
import { AuroraBackground } from '@/components/ui/aurora-background';
import SwipeButton from '../components/ui/swipe-button';

// Libraries

import Navbar from '@/components/landing/navbar-home';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="w-full flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-900 transition-colors duration-300 z-20">
      <Navbar />
      <AuroraBackground className='w-full px-4 md:px-10 xl:px-20'>
        <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="relative flex flex-col gap-4 items-center justify-center px-4"
        >
          <div className="overflow-visible text-3xl md:text-7xl font-bold bg-gradient-to-b from-fuchsia-700 to-indigo-400/40 bg-clip-text text-transparent leading-none text-center">
            Selamat Datang di SIGMA
          </div>
          <div className="text-center body-light w-2/3 text-base md:text-2xl dark:text-neutral-200 py-4">
            Sistem IoT Terintegrasi Monitoring Kandang Ayam. SIGMA membantu pemantauan kandang ayam closed house untuk melihat statistik dan data parameter.
          </div>
          <Link href="/login">
            <SwipeButton className='border-1 border-indigo-600'>Cek Kandang</SwipeButton>
          </Link>
        </motion.div>
      </AuroraBackground>

      <BentoDemo />

      <Feature />

    </main>
  );
}
