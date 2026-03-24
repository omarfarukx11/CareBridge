"use client";
import React from "react";
import { motion } from "framer-motion";

const SuccessMetrics = () => {
  return (
    <section className="relative py-40 bg-[#0f172a] overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-primary font-black tracking-[0.3em] uppercase text-sm mb-6"
          >
            Our Philosophy
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl md:text-8xl font-black text-white leading-tight tracking-tighter"
          >
            Care is not a service. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">
              It’s a Promise.
            </span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-slate-400 text-xl md:text-2xl max-w-4xl font-light leading-relaxed"
          >
            Since 2024, Care.Bridge has been the silent partner for over 12,000 families in Bangladesh. 
            We don't just send caretakers; we send peace of mind, professional expertise, and 
            unwavering human connection directly to your doorstep.
          </motion.p>
        </div>

        {/* Big Number Stats for "Large Website" Feel */}
        <div className="grid md:grid-cols-3 gap-12 mt-32 border-t border-white/10 pt-20">
          {[
            { number: "24/7", label: "Medical Support Available" },
            { number: "100%", label: "NID Verified Caregivers" },
            { number: "50+", label: "Specialized Care Programs" }
          ].map((item, i) => (
            <div key={i} className="text-center group">
              <h3 className="text-6xl md:text-7xl font-black text-white group-hover:text-primary transition-colors duration-500">
                {item.number}
              </h3>
              <p className="text-slate-500 uppercase tracking-widest font-bold mt-4 text-xs">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessMetrics;