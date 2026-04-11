"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaStar, FaQuoteLeft } from "react-icons/fa";

const Testimonials = () => {
  const reviews = [
    { name: "Rahim Ahmed", text: "Care.Bridge found a nurse in 2 hours for my father. Highly recommended!", rating: 5, role: "Son of Patient" },
    { name: "Sara Khan", text: "Safe and secure babysitting service. I feel at peace at work.", rating: 5, role: "Working Mother" },
    { name: "Tanvir Hossain", text: "The post-operative care for my mother was exceptional. Truly professional.", rating: 5, role: "Business Owner" },
    { name: "Nusrat Jahan", text: "I was worried about my kids, but the caregiver was so warm and kind.", rating: 5, role: "School Teacher" },
    { name: "Arifur Rahman", text: "Reliable, punctual, and very transparent billing. No hidden costs.", rating: 5, role: "IT Professional" },
    { name: "Mehedi Hasan", text: "The best home-care service in Dhaka. Their medical board is a plus.", rating: 5, role: "Doctor" },
  ];


  const duplicatedReviews = [...reviews, ...reviews];

  return (
    <section className="py-32 bg-[#0f172a] overflow-hidden relative">
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-6 mb-20 text-center relative z-10">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-primary font-black uppercase tracking-[0.3em] text-xs"
        >
          Social Proof
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-7xl font-black text-white mt-6 tracking-tighter"
        >
          Trusted by <span className="text-primary ">12k+</span> Families
        </motion.h2>
      </div>

      <div className="relative flex overflow-hidden py-10">
        <motion.div 
          className="flex gap-8 whitespace-nowrap"
          animate={{
            x: ["0%", "-50%"],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 40,
              ease: "linear",
            },
          }}
          style={{ width: "fit-content" }}
        >
          {duplicatedReviews.map((rev, i) => (
            <div 
              key={i} 
              className="w-100 bg-white/5 backdrop-blur-md p-10 rounded-xl border border-white/10 flex flex-col justify-between hover:bg-white/10 transition-colors group"
            >
              <div>
                <FaQuoteLeft className="text-primary text-3xl mb-6 opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="flex gap-1 mb-4">
                  {[...Array(rev.rating)].map((_, j) => (
                    <FaStar key={j} className="text-orange-400 text-sm" />
                  ))}
                </div>
                <p className="text-xl text-slate-200 font-medium leading-relaxed whitespace-normal ">
                  "{rev.text}"
                </p>
              </div>
              
              <div className="mt-8 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-black text-primary border border-primary/30">
                  {rev.name.charAt(0)}
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-white leading-none">{rev.name}</h4>
                  <p className="text-slate-500 text-xs mt-1 font-bold uppercase tracking-widest">{rev.role}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Gradient Fades for the edges to make it look high-end */}
        <div className="absolute inset-y-0 left-0 w-40 bg-linear-to-r from-[#0f172a] to-transparent z-20 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-40 bg-linear-to-l from-[#0f172a] to-transparent z-20 pointer-events-none"></div>
      </div>

      {/* Stats Counter Section below slider */}
      <div className="max-w-7xl mx-auto px-6 mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { label: "App Store", val: "4.9/5" },
          { label: "Google Review", val: "4.8/5" },
          { label: "Daily Bookings", val: "150+" },
          { label: "Active Nurses", val: "300+" },
        ].map((stat, i) => (
          <div key={i} className="text-center border-r border-white/10 last:border-none">
            <p className="text-2xl font-black text-white">{stat.val}</p>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.2em] mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;