"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Import Next.js Image
import { motion } from 'framer-motion';

const ServiceSkeleton = () => (
  <div className="bg-white rounded-xl overflow-hidden border border-slate-100 animate-pulse">
    <div className="h-44 bg-slate-200"></div>
    <div className="p-5 space-y-4">
      <div className="h-5 bg-slate-200 rounded w-3/4"></div>
      <div className="space-y-2">
        <div className="h-2.5 bg-slate-200 rounded"></div>
        <div className="h-2.5 bg-slate-200 rounded w-5/6"></div>
      </div>
      <div className="pt-4 flex justify-between items-center">
        <div className="h-8 bg-slate-200 rounded w-16"></div>
        <div className="h-8 bg-slate-200 rounded w-20"></div>
      </div>
    </div>
  </div>
);

const ServicesPage = ({ services, isLoading }) => {
  return (
    <div className="min-h-screen py-10 px-4 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-primary font-black uppercase tracking-widest text-[10px] bg-primary/5 px-4 py-2 rounded-lg"
          >
            Care.Bridge Solutions
          </motion.span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mt-6 mb-4 tracking-tight">
            Our Care Services
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto font-medium text-sm">
            Professional, verified, and compassionate care tailored for your family.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          
          {isLoading ? (
            Array.from({ length: 10 }).map((_, i) => <ServiceSkeleton key={i} />)
          ) : (
            services?.map((service, i) => (
              <motion.div 
                key={service._id} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 flex flex-col"
              >
                {/* IMAGE CONTAINER */}
                <div className="h-44 overflow-hidden relative">
                  <Image 
                    src={service.image} 
                    alt={service.title} 
                    fill 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw" 
                    className="object-cover group-hover:scale-110 transition-transform duration-700" 
                    priority={i < 5} 
                  />
                  <div className="absolute top-3 right-3 z-10">
                    <span className="bg-primary/90 backdrop-blur-sm text-white text-[9px] font-black uppercase tracking-widest py-1.5 px-3 rounded-md shadow-sm">
                      {service.tag}
                    </span>
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <h2 className="text-lg font-bold text-slate-800 mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                    {service.title}
                  </h2>
                  <p className="text-slate-500 mb-5 line-clamp-2 text-[11px] leading-relaxed font-medium">
                    {service.description}
                  </p>

                  <div className="mt-auto pt-4 border-t border-slate-50 flex justify-between items-center">
                    <div>
                      <p className="text-xl font-black text-slate-900">
                        ৳{service.hourly_rate}
                        <span className="text-[9px] font-bold text-slate-400 ml-0.5">/hr</span>
                      </p>
                    </div>
                    <Link href={`/services/${service._id}`}>
                      <button className='primary-btn'>
                        Details
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {!isLoading && (
          <div className="mt-20 p-10 bg-[#0f172a] rounded-xl text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
            <h3 className="text-2xl font-bold text-white relative z-10">Don't see what you're looking for?</h3>
            <p className="text-slate-400 mt-2 mb-8 relative z-10">We offer custom care plans for unique medical requirements.</p>
            <Link href="/contact">
              <button className="bg-primary text-white font-bold px-8 py-3 rounded-lg hover:bg-white hover:text-primary transition-all relative z-10">
                Contact Our Medical Board
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;