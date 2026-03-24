"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaCheckCircle, FaUserShield, FaAward, FaHospitalSymbol } from "react-icons/fa";

const AboutSection = () => {
  return (
    <section className="relative py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "circOut" }}
            className="relative"
          >
            <div className="relative z-10 grid grid-cols-12 gap-4">
              <div className="col-span-8">
                <img 
                  src="https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=800" 
                  alt="Main Care" 
                  className="rounded-xl shadow-2xl w-full h-[500px] object-cover"
                />
              </div>
              <div className="col-span-4 self-end">
                <img 
                  src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=400" 
                  alt="Detail Care" 
                  className="rounded-xl shadow-xl w-full h-[250px] object-cover mb-4"
                />
                <div className="bg-primary p-6 rounded-xl text-white shadow-xl">
                  <p className="text-4xl font-black italic">99%</p>
                  <p className="text-[10px] uppercase font-bold tracking-tighter">Client Satisfaction</p>
                </div>
              </div>
            </div>
            <div className="absolute -top-20 -left-20 text-[12rem] font-black text-slate-50 -z-10 select-none">
              CARE
            </div>
          </motion.div>

          <div className="space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter">
                We Build <br />
                <span className="text-primary italic">The Bridge.</span>
              </h2>
            </motion.div>

            <p className="text-slate-500 text-xl leading-relaxed font-medium max-w-xl">
              In a world where finding reliable medical help is a struggle, Care.Bridge stands as the gold standard. We don't just connect people; we verify, train, and monitor every interaction to guarantee hospital-grade care in your bedroom.
            </p>

            <div className="grid sm:grid-cols-2 gap-8 py-6">
              {[
                { icon: <FaUserShield />, title: "3-Layer Vetting", desc: "NID, Criminal, & Medical license verification." },
                { icon: <FaAward />, title: "Certified Staff", desc: "Only Top 5% of applicants pass our training." },
                { icon: <FaHospitalSymbol />, title: "24/7 Monitoring", desc: "Our medical board is always on standby." },
                { icon: <FaCheckCircle />, title: "Instant Booking", desc: "Get a caregiver confirmed in under 10 minutes." }
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="text-primary text-2xl">{item.icon}</div>
                  <h4 className="font-bold text-slate-900 text-lg">{item.title}</h4>
                  <p className="text-sm text-slate-500 leading-snug">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-8 pt-4">
              <Link href="/about">
                <button className="primary-btn rounded-xl! px-10! py-5! text-lg">Read Our Full Story</button>
              </Link>
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <img key={i} className="w-12 h-12 rounded-full border-4 border-white object-cover" src={`https://i.pravatar.cc/100?img=${i+20}`} alt="user" />
                ))}
                <div className="w-12 h-12 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">+12k</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;