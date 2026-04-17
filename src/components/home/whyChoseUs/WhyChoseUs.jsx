"use client";
import React from "react";
import { motion } from "framer-motion";
import { FiShield, FiUsers, FiClock, FiActivity } from "react-icons/fi";

const WhyChooseUs = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" } 
    },
  };

  const features = [
    {
      icon: <FiShield />,
      title: "Vetting Beyond the Basics",
      desc: "We don't just check IDs. We perform deep background checks, verify medical certifications, and conduct 3-stage personality interviews."
    },
    {
      icon: <FiActivity />,
      title: "Real-Time Tracking",
      desc: "Our caregivers use the Care.Bridge app to log medicine timings and vital signs, keeping you updated via SMS or App alerts instantly."
    },
    {
      icon: <FiUsers />,
      title: "Medical Board Oversight",
      desc: "Our nurses are not alone. They are backed by a senior board of doctors available for consultation 24/7 if complications arise."
    },
    {
      icon: <FiClock />,
      title: "Emergency Replacement",
      desc: "If your assigned caregiver has an emergency, our standby 'Rapid Response' team ensures a qualified replacement arrives within 2 hours."
    }
  ];

  return (
    <section className="py-40 bg-slate-50 dark:bg-slate-800 relative overflow-hidden">
      {/* Decorative background text */}
      <div className="absolute top-10 right-10 text-9xl font-black text-slate-100 dark:text-slate-700/50 select-none">
        TRUST
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid lg:grid-cols-3 gap-20"
        >
          {/* Sticky Header Portion */}
          <div className="lg:col-span-1">
            <motion.span variants={cardVariants} className="text-primary font-black uppercase tracking-widest text-xs">
              The Care.Bridge Standard
            </motion.span>
            <motion.h2 variants={cardVariants} className="text-5xl md:text-6xl font-black text-slate-900 dark:text-slate-100 mt-6 leading-tight tracking-tighter">
              Why 12,000+ <br />Families <br />Trust Us.
            </motion.h2>
            <motion.p variants={cardVariants} className="text-slate-600 dark:text-slate-400 mt-8 text-xl font-medium leading-relaxed">
              We have spent years refining a caregiving model that prioritizes your safety and medical precision above all else.
            </motion.p>
            
            <motion.div variants={cardVariants} className="mt-12 p-8 bg-white dark:bg-slate-800 rounded-xl shadow-sm border-l-4 border-primary">
              <p className="text-slate-700 dark:text-slate-300 font-bold italic">
                "Care.Bridge didn't just find us a nurse; they found us a lifeline."
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 font-bold">— The Ahmed Family, Dhaka</p>
            </motion.div>
          </div>

          {/* Animated Grid */}
          <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
            {features.map((f, i) => (
              <motion.div 
                key={i}
                variants={cardVariants}
                whileHover={{ y: -10, backgroundColor: "light" }}
                className="p-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-300 group hover:shadow-2xl hover:border-primary/20"
              >
                <div className="w-16 h-16 bg-slate-900 dark:bg-blue-600 text-white rounded-xl flex items-center justify-center text-3xl mb-8 group-hover:bg-primary transition-colors">
                  {f.icon}
                </div>
                <h4 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 tracking-tight">{f.title}</h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;