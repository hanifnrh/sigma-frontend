import { DasborMonitoring } from "./dasbor-monitoring";
import { EvaluasiMortalitas } from "./evaluasimortalitas";
import { Notifikasi } from "./notifikasi";
import { PenyesuaianParameter } from "./penyesuaianparameter";



export function Feature() {
    return (
        <main className="z-30 flex flex-col items-center w-5/6 sm:w-4/6">
            <div className='w-fit p-16'>
                <div className='grid grid-cols-3'>
                    <svg className='-mx-2' xmlns="http://www.w3.org/2000/svg" width="74" height="74" viewBox="0 0 74 74" fill="none">
                        <circle cx="36.5742" cy="36.5742" r="36.5742" fill="#69A5EB" fillOpacity="0.4" />
                    </svg>
                    <svg className='-mx-2' xmlns="http://www.w3.org/2000/svg" width="74" height="74" viewBox="0 0 74 74" fill="none">
                        <circle cx="37" cy="36.5742" r="36.5742" fill="#38BE9A" fillOpacity="0.4" />
                    </svg>
                    <svg className='-mx-2' xmlns="http://www.w3.org/2000/svg" width="74" height="74" viewBox="0 0 74 74" fill="none">
                        <circle cx="37.4258" cy="36.5742" r="36.5742" fill="#8735EB" fillOpacity="0.7" />
                    </svg>
                </div>
            </div>

            <div className=''>
                <div className='mb-10 text-center text-3xl lg:text-5xl font-bold text-transparent cliptext bg-[linear-gradient(107deg,#802696_8.32%,#6348CF_60.18%,#5DAEDB_105.75%)]'>
                    Monitor Kandang <br />
                    Ayam Anda
                </div>
                <div className='text-justify font-normal text-xl'>
                    Sigma adalah solusi digital yang dirancang khusus untuk memantau kondisi lingkungan di dalam kandang ayam. Dengan menggunakan sensor yang terintegrasi, Sigma memungkinkan pemantauan real-time terhadap beberapa parameter penting seperti kadar amonia, kadar oksigen, dan tingkat kelembaban.
                </div>
            </div>

            <div className="w-full mt-10">
                <div className='w-full grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-10 pb-20 justify-items-center justify-between'>
                    <div className='w-full h-72'>
                        <DasborMonitoring/>
                    </div>
                    <div className='flex flex-col justify-center items-center text-center lg:text-start'>
                        <div>
                            <div className='font-bold text-3xl'>
                                Dasbor Monitoring
                            </div>
                            <div className='text-3xl text-slate-400'>
                                Fitur
                            </div>
                            <div className='text-xl font-normal mt-5 w-full'>
                                Pantau parameter lingkungan secara visual melalui grafik yang mudah dipahami.
                            </div>
                        </div>
                    </div>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-20  gap-y-10 pb-20 justify-items-center'>
                    <div className='flex flex-col justify-center items-center text-center lg:text-start order-2 lg:order-1'>
                        <div>
                            <div className='font-bold text-3xl'>
                                Evaluasi Mortalitas
                            </div>
                            <div className='text-3xl text-slate-400'>
                                Fitur
                            </div>
                            <div className='text-xl font-normal mt-5 w-full'>
                                Fitur yang menghitung jumlah ayam yang mati untuk membantu mengevaluasi indeks performa kandang.
                            </div>
                        </div>
                    </div>
                    <div className='w-full h-72 order-1 lg:order-2'>
                        <EvaluasiMortalitas />
                    </div>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-20  gap-y-10 pb-20 justify-items-center'>
                    <div className='w-full h-72'>
                        <PenyesuaianParameter />
                    </div>
                    <div className='flex flex-col justify-center items-center text-center lg:text-start'>
                        <div>
                            <div className='font-bold text-3xl'>
                                Penyesuaian Parameter
                            </div>
                            <div className='text-3xl text-slate-400'>
                                Fitur
                            </div>
                            <div className='text-xl font-normal mt-5 w-full'>
                                Parameter lingkungan akan disesuaikan secara otomatis berdasarkan usia ayam, memberikan kondisi optimal sesuai kebutuhan.
                            </div>
                        </div>
                    </div>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-20  gap-y-10 pb-20 justify-items-center'>
                    <div className='flex flex-col justify-center items-center text-center lg:text-start order-2 lg:order-1'>
                        <div>
                            <div className='font-bold text-3xl'>
                                Notifikasi Cepat
                            </div>
                            <div className='text-3xl text-slate-400'>
                                Fitur
                            </div>
                            <div className='text-xl font-normal mt-5 w-full'>
                                Dapatkan pemberitahuan segera jika salah satu parameter melewati batas aman, memastikan tindakan cepat dan tepat.
                            </div>
                        </div>
                    </div>
                    <div className='w-full h-72 order-1 lg:order-2'>
                        <Notifikasi />
                    </div>
                </div>
            </div>
        </main>
    );
}
