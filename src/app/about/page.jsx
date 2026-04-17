"use client";
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { 
  FaShieldAlt, 
  FaHeart, 
  FaUserCheck, 
  FaArrowRight,
  FaCheckCircle
} from "react-icons/fa";

const AboutPage = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-content", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power4.out"
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  const stats = [
    { label: 'Verified Caregivers', value: '500+' },
    { label: 'Happy Families', value: '12k+' },
    { label: 'Years Experience', value: '8+' },
    { label: 'Success Rate', value: '99%' },
  ];

  const pillars = [
    { 
      icon: <FaShieldAlt />, 
      title: "Trust & Security", 
      desc: "Every caregiver undergoes deep NID verification and criminal record checks for your safety." 
    },
    { 
      icon: <FaHeart />, 
      title: "Human Connection", 
      desc: "We pair medical expertise with genuine empathy to ensure emotional wellbeing and comfort." 
    },
    { 
      icon: <FaUserCheck />, 
      title: "Medical Precision", 
      desc: "Strict adherence to international nursing protocols and home-care standards in every visit." 
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 font-sans">
      
      {/* 1. HERO SECTION */}
      <section ref={heroRef} className="relative py-28 bg-[#0f172a] text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-40"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <span className="hero-content inline-block py-2 px-6 rounded-xl bg-white/5 backdrop-blur-md text-primary text-xs font-black uppercase tracking-widest mb-8 border border-white/10">
            About Care.Bridge
          </span>
          <h1 className="hero-content text-5xl md:text-7xl font-bold mb-8 tracking-tighter leading-tight">
            Compassion meets <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">Professional Care</span>
          </h1>
          <p className="hero-content text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            We are redefining home-based healthcare in Bangladesh through verified expertise and deep human empathy.
          </p>
        </div>
      </section>

      {/* 2. STATS FLOATING BOX */}
      <div className="px-6 -mt-12 relative z-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 text-center"
            >
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</h3>
              <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 dark:text-slate-500 mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 3. MISSION SECTION */}
      <section className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img 
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800" 
              alt="Caregiving" 
              className="rounded-xl shadow-2xl relative z-10 aspect-video object-cover"
            />
            <div className="absolute -bottom-6 -right-6 bg-primary p-6 rounded-xl shadow-2xl text-white hidden md:block z-20">
              <p className="font-bold text-lg italic">"Trusted by 12,000+ Families"</p>
            </div>
          </motion.div>
          
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
              Our Mission is to <br />
              <span className="text-primary italic">Simplify Healthcare.</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed font-medium">
              Care.Bridge was founded in 2024 to solve the struggle families face when finding reliable medical help. We handle the vetting, the booking, and the management.
            </p>
            <div className="space-y-4">
              {['Rigorous 5-Step Background Checks', 'Certified Medical Professionals Only', 'Transparent Billing & Instant Booking'].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <FaCheckCircle className="text-primary text-xl flex-shrink-0" />
                  <span className="font-bold text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. CORE PILLARS SECTION (Fixed Visibility) */}
      <section className="py-32 bg-slate-50 dark:bg-slate-800 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Core Pillars of Excellence</h2>
            <div className="h-1.5 w-16 bg-primary mx-auto mt-4 rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {pillars.map((v, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="bg-white dark:bg-slate-800 p-10 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-500 group"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-2xl text-primary mb-8 group-hover:bg-primary group-hover:text-white transition-all">
                  {v.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{v.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CTA SECTION */}
      <section className="py-32 relative z-10 px-6">
        <div className="max-w-7xl mx-auto bg-[#0f172a] rounded-xl p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">
              Ready to join our <br /><span className="text-primary">Medical Network?</span>
            </h2>
            <p className="text-slate-400 text-lg mb-12 font-medium">
              We are always looking for certified nurses and professional caregivers to join our mission of care.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/register">
                <button className="primary-btn !rounded-xl">Register Now</button>
              </Link>
              <Link href="/contact">
                <button className="px-8 py-4 rounded-xl border border-white/20 hover:bg-white/5 transition-all text-white font-bold">
                  Contact Us
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;