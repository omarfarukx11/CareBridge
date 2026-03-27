"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa6';
import { HiOutlineArrowRight } from 'react-icons/hi2';

const TopServicesPage = ({ services = [] }) => {
  const topServices = services?.slice(0, 6);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h4 className="text-primary font-bold uppercase tracking-widest text-sm mb-3">
              Our Specialized Care
            </h4>
            <h2 className="text-4xl md:text-5xl font-black text-neutral-900 leading-tight">
              Top Rated Services for <br /> Your Loved Ones
            </h2>
          </div>
          <Link href="/services" className="group flex items-center gap-3 font-bold text-primary hover:text-neutral-900 transition-colors">
            View All Services 
            <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topServices.map((service, index) => (
            <motion.div
              key={service._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative bg-neutral-50 rounded-xl overflow-hidden border border-neutral-100 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500"
            >
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={service.image || service.img}
                  alt={service.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              <div className="p-5">
                <div className="mb-4">
                  <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase">
                    {service.category || "Care Service"}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-3 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-neutral-600 line-clamp-2 mb-6 text-sm leading-relaxed">
                  {service.description || "Providing professional and compassionate care tailored to your specific needs."}
                </p>
                
                <Link 
                  href={`/services/${service._id}`}
                  className="inline-flex items-center gap-2 font-bold text-neutral-900 border-b-2 border-primary/20 hover:border-primary transition-all pb-1"
                >
                  Learn More <HiOutlineArrowRight />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopServicesPage;