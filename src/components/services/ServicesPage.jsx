"use client";
import Link from 'next/link';
import { FaCheckCircle } from 'react-icons/fa';

const ServicesPage = ({ services }) => {
  return (
    <div className="min-h-screen py-12 px-4 md:px-12 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Our Care Services</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Choose the right care for your family. All our caregivers are verified, 
            highly trained, and ready to support your needs.
          </p>
          <div className="w-24 h-1.5 bg-primary mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service._id} className="group bg-white rounded-4xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col">
              <div className="h-64 overflow-hidden relative">
                <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 right-4">
                  <span className="badge badge-primary py-4 px-6 font-bold border-none shadow-lg">{service.tag}</span>
                </div>
              </div>
              
              <div className="p-8 flex-1 flex flex-col">
                <h2 className="text-2xl font-black text-slate-800 mb-3 line-clamp-1">{service.title}</h2>
                <p className="text-slate-500 mb-6 line-clamp-3 text-sm leading-relaxed">{service.description}</p>

                <div className="mt-auto pt-6 border-t border-slate-50 flex justify-between items-end">
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1">Starting From</span>
                    <p className="text-3xl font-black text-slate-900">৳{service.hourly_rate}<span className="text-xs font-bold text-slate-400 ml-1">/hr</span></p>
                  </div>
                  <Link href={`/services/${service._id}`} className="btn btn-primary rounded-2xl px-8 h-14 text-white border-none shadow-lg shadow-primary/20">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;