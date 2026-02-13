"use client";
import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { FaUser, FaEnvelope, FaLock, FaGoogle, FaArrowLeft } from "react-icons/fa";

const RegisterPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log("Registration Data:", data);

  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-poppins">
      <div className="max-w-5xl w-full bg-white rounded-[40px] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        
        {/* LEFT SIDE: Branding & Image */}
        <div className="hidden lg:flex bg-primary relative p-12 flex-col justify-between text-white">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pattern-dots"></div>
          
          <Link href="/" className="flex items-center gap-2 text-2xl font-black relative z-10">
            <div className="bg-white p-2 rounded-xl text-primary">
               <FaArrowLeft className="text-sm" />
            </div>
            Care.Bridge
          </Link>

          <div className="relative z-10">
            <h2 className="text-4xl font-black leading-tight mb-4">
              Join our community of caregivers.
            </h2>
            <p className="text-primary-content/80 text-lg font-light">
              Start your journey with us today and provide the care your loved ones deserve.
            </p>
          </div>

          <div className="relative z-10 flex gap-4">
             <div className="avatar-group -space-x-6 rtl:space-x-reverse">
                <div className="avatar border-white">
                    <div className="w-12"><img src="https://i.pravatar.cc/100?u=1" /></div>
                </div>
                <div className="avatar border-white">
                    <div className="w-12"><img src="https://i.pravatar.cc/100?u=2" /></div>
                </div>
                <div className="avatar placeholder border-white">
                    <div className="w-12 bg-neutral text-neutral-content"><span>+99</span></div>
                </div>
            </div>
            <p className="text-sm self-center font-medium opacity-80">Trusted by 10k+ families</p>
          </div>
        </div>

        {/* RIGHT SIDE: Register Form */}
        <div className="p-8 md:p-16">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-black text-slate-800 mb-2">Create Account</h1>
            <p className="text-slate-500">Welcome! Please enter your details.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Full Name */}
            <div className="form-control">
              <label className="label text-sm font-bold text-slate-700">Full Name</label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  {...register("name", { required: "Name is required" })}
                  placeholder="John Doe" 
                  className={`input input-bordered w-full pl-12 rounded-2xl bg-slate-50 border-slate-200 focus:bg-white transition-all ${errors.name ? 'border-error' : ''}`} 
                />
              </div>
              {errors.name && <span className="text-error text-xs mt-1">{errors.name.message}</span>}
            </div>

            {/* Email Address */}
            <div className="form-control">
              <label className="label text-sm font-bold text-slate-700">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="email" 
                  {...register("email", { required: "Email is required" })}
                  placeholder="john@example.com" 
                  className="input input-bordered w-full pl-12 rounded-2xl bg-slate-50 border-slate-200 focus:bg-white" 
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label text-sm font-bold text-slate-700">Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="password" 
                  {...register("password", { 
                    required: "Password is required",
                    minLength: { value: 6, message: "Min 6 characters" }
                  })}
                  placeholder="••••••••" 
                  className="input input-bordered w-full pl-12 rounded-2xl bg-slate-50 border-slate-200 focus:bg-white" 
                />
              </div>
              {errors.password && <span className="text-error text-xs mt-1">{errors.password.message}</span>}
            </div>

            <button type="submit" className="btn btn-primary w-full rounded-2xl h-14 text-white text-lg shadow-lg shadow-primary/20">
              Sign Up
            </button>

            <div className="divider text-slate-400 text-xs">OR REGISTER WITH</div>

            <button type="button" className="btn btn-outline w-full rounded-2xl h-14 border-slate-200 hover:bg-slate-50 hover:text-slate-800">
              <FaGoogle className="text-red-500 mr-2" /> Google
            </button>

            <p className="text-center text-slate-500 text-sm mt-8">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-bold hover:underline">
                Log In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;