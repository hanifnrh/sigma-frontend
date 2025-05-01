"use client";

import { easeIn, easeOut, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface SwipeButtonProps {
    className?: string;
    children?: React.ReactNode;
    duration?: number;
}

const SwipeButton = ({
    className,
    children = "Cek Kandang",
    duration = 0.5,
}: SwipeButtonProps) => {
    const sliderVariants = {
        open: {
            width: "176px",
            transition: {
                duration,
                ease: [0.32, 0.72, 0, 1],
            },
        },
        closed: {
            width: "50px",
            transition: {
                duration,
                ease: [0.32, 0.72, 0, 1],
            },
        },
    };

    const textVariants = {
        open: {
            opacity: 0,
            translateX: 10,
            transition: {
                duration: 0.4,
                easeIn,
                bounce: 0,
            },
        },
        closed: {
            opacity: 1,
            translateX: 20,
            transition: {
                duration: 0.4,
                easeOut,
                bounce: 0,
            },
        },
    };

    const buttonVariants = {
        open: {
            opacity: 1,
        },
        closed: {
            opacity: 1,
        },
    };

    const childrenVariants = {
        open: {
            opacity: 1,
            transition: {
                duration: 0.4,
                easeIn,
            },
        },
        closed: {
            opacity: 0,
            transition: {
                duration: 0.4,
                easeOut,
            },
        },
    };

    return (
        <motion.button
            variants={buttonVariants}
            initial="closed"
            whileHover="open"
            whileTap="open"
            className={`relative h-[50px] min-w-[180px] rounded-xl bg-transparent shadow-[0_0_0_2px_#6348CF] ${className}`}
        >
            <motion.div
                variants={sliderVariants}
                className="absolute left-[2px] top-[2px] z-10 flex h-[46px] items-center justify-center -space-x-2 rounded-xl bg-primary bg-[linear-gradient(107deg,#802696_8.10%,#6348CF_60.30%,#5DAEDB_105.75%)]"
            >
                <motion.div variants={childrenVariants} className="h-7 w-7">
                    <ChevronRight className="h-full w-full animate-pulse text-popover" />
                </motion.div>
                <ChevronRight className="h-7 w-7 animate-pulse text-popover delay-150" />
                <motion.div variants={childrenVariants} className="h-7 w-7">
                    <ChevronRight className="h-full w-full animate-pulse text-popover delay-300" />
                </motion.div>
            </motion.div>
            <motion.div
                variants={textVariants}
                className="translate-x-5 font-semibold bg-clip-text text-transparent bg-[linear-gradient(107deg,#802696_8.32%,#6348CF_60.18%,#5DAEDB_105.75%)]"
            >
                {children}
            </motion.div>
        </motion.button>
    );
};


export default SwipeButton;