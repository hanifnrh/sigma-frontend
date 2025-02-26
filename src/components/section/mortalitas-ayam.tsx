import { BsHeartPulse } from "react-icons/bs";
const MortalitasAyam = () => {
    return (
        <div className="flex justify-between items-center">
            <div className="w-full flex">
                <div className="relative flex flex-grow flex-row items-center justify-center rounded-[10px] border-[1px] border-gray-200 bg-white bg-clip-border shadow-md shadow-[#F3F3F3] dark:border-[#ffffff33] dark:bg-black dark:text-white dark:shadow-none py-7 px-10">
                    <div className="flex h-[90px] w-auto flex-row items-center">
                        <div className="rounded-full bg-lightPrimary  dark:bg-navy-700">
                            <span className="flex items-center text-brand-500 dark:text-white">
                                <BsHeartPulse   size={50} />
                            </span>
                        </div>
                    </div>
                    <div className="h-50 ml-4 flex w-auto flex-col justify-center">
                        <p className="font-dm text-2xl font-medium text-gray-600 dark:text-white">Mortalitas Ayam</p>
                        <h4 className="text-4xl body-bold text-blue-500 dark:text-blue-700">0.5%</h4>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MortalitasAyam;
