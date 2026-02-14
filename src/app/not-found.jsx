import Link from "next/link";
import { FaArrowLeft, FaHeartbeat } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6 relative overflow-hidden">
      
      {/* Background Decorative Text - Ultra Light Blue/Slate */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="text-[18rem] md:text-[28rem] font-black text-slate-50 leading-none tracking-tighter">
          404
        </span>
      </div>

      <div className="relative z-10 max-w-xl w-full text-center">
        
        {/* Heartbeat Icon Container */}
        <div className="flex justify-center mb-10">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
            <div className="w-24 h-24 rounded-[35px] bg-primary flex items-center justify-center border-4 border-white shadow-2xl relative z-10 -rotate-6 hover:rotate-0 transition-transform duration-500">
              <FaHeartbeat className="text-white text-4xl" />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter mb-4">
          Lost your <span className="text-primary">Way?</span>
        </h1>
        
        <p className="text-slate-500 text-lg md:text-xl mb-10 font-medium max-w-md mx-auto leading-relaxed">
          The caregiver or service page you are looking for isn't here. Let's get you back to the heart of the bridge.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            href="/" 
            className="w-full sm:w-56 py-4.5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-primary/90 transition-all active:scale-95 flex items-center justify-center gap-3 shadow-lg shadow-primary/25"
          >
            <FaArrowLeft className="text-xs" /> Back to Home
          </Link>

          <Link 
            href="/services" 
            className="w-full sm:w-56 py-4.5 bg-white text-slate-900 border-2 border-slate-100 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-slate-50 hover:border-slate-200 transition-all active:scale-95 flex items-center justify-center"
          >
            Explore Services
          </Link>
        </div>

        {/* Branding Subtext */}
        <div className="mt-20 flex flex-col items-center gap-2">
          <div className="w-12 h-1 bg-slate-100 rounded-full"></div>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">
            Care.Bridge • Trusted Healthcare Support
          </p>
        </div>
      </div>
    </div>
  );
}