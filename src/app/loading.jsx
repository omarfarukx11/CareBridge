import React from 'react';
import { FaHeartbeat } from 'react-icons/fa';

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-100 w-full bg-white/50 backdrop-blur-sm animate-in fade-in duration-500">
      <div className="relative flex items-center justify-center">
        {/* Outer Ripples */}
        <div className="absolute w-24 h-24 bg-primary/20 rounded-full animate-ping"></div>
        <div className="absolute w-32 h-32 bg-primary/10 rounded-full animate-pulse"></div>
        
        {/* Main Icon Container */}
        <div className="relative z-10 w-20 h-20 bg-primary rounded-[30px] shadow-2xl shadow-primary/40 flex items-center justify-center border-4 border-white">
          <FaHeartbeat className="text-white text-3xl animate-bounce" />
        </div>
      </div>

      {/* Text Elements */}
      <div className="mt-12 text-center">
        <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">
          Care<span className="text-primary">.</span>Bridge
        </h3>
        <div className="flex items-center justify-center gap-1 mt-2">
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
        </div>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-4">
          Connecting you to care
        </p>
      </div>
    </div>
  );
};

export default Loader;