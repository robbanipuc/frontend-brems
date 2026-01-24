import React from 'react';
import { FaTrain } from 'react-icons/fa';

const Preloader = () => {
    return (
        <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center">
            <div className="relative">
                {/* Pulsing Green Circle */}
                <div className="absolute inset-0 bg-railway-green opacity-20 rounded-full animate-ping"></div>
                <div className="relative bg-white p-6 rounded-full shadow-xl border-4 border-railway-green animate-bounce">
                    <FaTrain className="text-5xl text-railway-green" />
                </div>
            </div>
            <h2 className="mt-6 text-xl font-bold text-gray-800 tracking-widest uppercase">
                Bangladesh <span className="text-railway-red">Railway</span>
            </h2>
            <div className="w-48 h-1 bg-gray-200 mt-4 rounded-full overflow-hidden">
                <div className="h-full bg-railway-green animate-[shimmer_1.5s_infinite] w-1/2 rounded-full"></div>
            </div>
            <p className="text-xs text-gray-400 mt-2 font-mono">Loading ERP System...</p>
            
            <style>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(200%); }
                }
            `}</style>
        </div>
    );
};

export default Preloader;