"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { FaEnvelope, FaLock, FaGoogle, FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log("Login Attempt:", data);
    // Here you will integrate NextAuth signIn('credentials', data)
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-poppins">
      <div className="max-w-5xl w-full bg-white rounded-[40px] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        
        {/* LEFT SIDE: Branding (Hidden on mobile) */}
        <div className="hidden lg:flex bg-slate-900 relative p-12 flex-col justify-between text-white">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
          
          <Link href="/" className="flex items-center gap-2 text-2xl font-black relative z-10">
            <div className="bg-primary p-2 rounded-xl text-white">
               <FaArrowLeft className="text-sm" />
            </div>
            Care.Bridge
          </Link>

          <div className="relative z-10">
            <h2 className="text-4xl font-black leading-tight mb-4">
              Welcome Back to <span className="text-primary">Care.Bridge</span>
            </h2>
            <p className="text-slate-400 text-lg font-light">
              Your trusted partner in family care. Log in to manage your bookings and find the best caregivers.
            </p>
          </div>

          <div className="relative z-10 p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm">
            <p className="text-sm font-medium italic opacity-80">
              "The booking process was so simple. I found a verified nurse for my father within minutes."
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40"></div>
              <div>
                <p className="text-xs font-bold">Sarah Rahman</p>
                <p className="text-[10px] opacity-50">Premium Member</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Login Form */}
        <div className="p-8 md:p-16 flex flex-col justify-center">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-black text-slate-800 mb-2">Sign In</h1>
            <p className="text-slate-500">Please enter your credentials to continue.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Address */}
            <div className="form-control">
              <label className="label text-sm font-bold text-slate-700">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="email" 
                  {...register("email", { 
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                  })}
                  placeholder="name@company.com" 
                  className={`input input-bordered w-full pl-12 rounded-2xl bg-slate-50 border-slate-200 focus:bg-white transition-all ${errors.email ? 'border-error' : ''}`} 
                />
              </div>
              {errors.email && <span className="text-error text-xs mt-1">{errors.email.message}</span>}
            </div>

            {/* Password */}
            <div className="form-control">
              <div className="flex justify-between items-center">
                <label className="label text-sm font-bold text-slate-700">Password</label>
                <Link href="#" className="text-xs text-primary font-semibold hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  {...register("password", { required: "Password is required" })}
                  placeholder="••••••••" 
                  className={`input input-bordered w-full pl-12 pr-12 rounded-2xl bg-slate-50 border-slate-200 focus:bg-white transition-all ${errors.password ? 'border-error' : ''}`} 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <span className="text-error text-xs mt-1">{errors.password.message}</span>}
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input type="checkbox" className="checkbox checkbox-primary checkbox-sm rounded-md" id="remember" />
              <label htmlFor="remember" className="text-sm text-slate-600 cursor-pointer">Remember me for 30 days</label>
            </div>

            <button type="submit" className="btn btn-primary w-full rounded-2xl h-14 text-white text-lg shadow-lg shadow-primary/20 border-none">
              Log In
            </button>

            <div className="divider text-slate-400 text-[10px] font-bold tracking-widest uppercase">Or Secure Login with</div>

            <button type="button" className="btn btn-outline w-full rounded-2xl h-14 border-slate-200 hover:bg-slate-50 hover:text-slate-800 gap-3">
              <FaGoogle className="text-red-500 text-lg" />
              <span>Continue with Google</span>
            </button>

            <p className="text-center text-slate-500 text-sm mt-8">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary font-bold hover:underline">
                Register for Free
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;