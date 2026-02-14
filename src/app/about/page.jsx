"use client";
import React from 'react';
import Link from 'next/link';
import { 
  FaShieldAlt, 
  FaHeart, 
  FaUserCheck, 
  FaClock, 
  FaQuoteLeft, 
  FaArrowRight 
} from "react-icons/fa";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white font-poppins">
      
      {/* 1. HERO SECTION */}
      <section className="relative py-24 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <span className="inline-block py-1 px-4 rounded-full bg-primary/20 text-primary text-sm font-bold mb-6 border border-primary/30">
            About Care.Bridge
          </span>
          <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight">
            Compassion Meets <br />
            <span className="text-primary text-glow">Professional Care</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">
            We started with a simple goal: to ensure that every family in Bangladesh can access high-quality healthcare and caregiving services within the comfort of their own homes.
          </p>
        </div>
      </section>

      {/* 2. STATS BAR */}
      <div className="max-w-6xl mx-auto px-6 -mt-12 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Verified Caregivers', value: '500+' },
            { label: 'Happy Families', value: '12k+' },
            { label: 'Years Experience', value: '8+' },
            { label: 'Success Rate', value: '99%' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 text-center">
              <h3 className="text-2xl md:text-3xl font-black text-slate-800">{stat.value}</h3>
              <p className="text-xs uppercase tracking-widest font-bold text-slate-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. MISSION & STORY */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
            <img 
              src="https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=800" 
              alt="Medical Support" 
              className="rounded-[40px] shadow-2xl relative z-10 grayscale hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute -bottom-6 -right-6 bg-primary p-8 rounded-3xl shadow-2xl text-white hidden md:block z-20">
              <FaQuoteLeft className="text-3xl opacity-50 mb-4" />
              <p className="font-medium italic max-w-[200px]">"Changing the way we look at home-based healthcare."</p>
            </div>
          </div>
          
          <div className="space-y-8">
            <h2 className="text-4xl font-black text-slate-800 leading-tight">
              Our Mission is to <br />
              <span className="text-primary underline decoration-slate-200 underline-offset-8">Simplify Healthcare</span>
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              Care.Bridge was founded in 2024 to solve the struggle families face when finding reliable medical help. We handle the vetting, the booking, and the management, so you can focus on what matters most—your loved ones.
            </p>
            <ul className="space-y-4">
              {['Rigorous 5-Step Background Checks', 'Certified Medical Professionals Only', 'Transparent Billing & Instant Booking'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 font-bold text-slate-700">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs">✓</div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 4. CORE VALUES SECTION */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-black text-slate-800">Our Core Pillars</h2>
            <p className="text-slate-500 mt-4">These values define every interaction we have with our patients and partners.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <FaShieldAlt />, title: "Trust & Security", desc: "Every caregiver is ID-verified and background checked for your peace of mind." },
              { icon: <FaHeart />, title: "Human Connection", desc: "We don't just provide medical aid; we provide emotional support and empathy." },
              { icon: <FaUserCheck />, title: "Medical Precision", desc: "Our services are delivered by trained specialists following strict protocols." },
            ].map((v, i) => (
              <div key={i} className="bg-white p-10 rounded-[40px] shadow-sm hover:shadow-2xl transition-all duration-500 group border border-slate-100">
                <div className="text-4xl text-primary mb-6 group-hover:scale-110 transition-transform">{v.icon}</div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">{v.title}</h3>
                <p className="text-slate-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TEAM/LEADERSHIP SECTION */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="text-4xl font-black text-slate-800 mb-4">The Faces Behind Care.Bridge</h2>
              <p className="text-slate-500">A dedicated team of healthcare experts and tech innovators working for you.</p>
            </div>
            <button className="btn btn-primary rounded-2xl px-8 h-14 text-white gap-2">
              Join Our Team <FaArrowRight />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="group">
                <div className="aspect-[4/5] rounded-[32px] overflow-hidden bg-slate-200 mb-6 shadow-lg">
                  <img 
                    src={`https://i.pravatar.cc/400?img=${i+10}`} 
                    alt="Team Member" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <h4 className="text-xl font-bold text-slate-800">Team Member {i}</h4>
                <p className="text-primary text-sm font-semibold">Department Head</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CTA SECTION */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-slate-900 rounded-[60px] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-primary/20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"></div>
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
                Want to become a <span className="text-primary">Verified Caregiver?</span>
              </h2>
              <p className="text-slate-400 text-lg mb-10 font-light">
                Join our network of healthcare professionals and help us change lives across the country.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <Link href="/register" className="btn btn-primary btn-lg rounded-2xl px-12 text-white border-none shadow-lg shadow-primary/20">
                  Register as Caregiver
                </Link>
                <Link href="/contact" className="btn btn-outline border-white/20 text-white btn-lg rounded-2xl px-12 hover:bg-white hover:text-slate-900">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;