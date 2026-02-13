"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation"; // Added useSearchParams
import { useForm } from "react-hook-form";
import { FaEnvelope, FaLock, FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import { signIn } from "next-auth/react"; 
import Swal from "sweetalert2"; 

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get the redirect path from URL (e.g., /services/123) or default to home
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false, 
    });

    if (result?.error) {
      Swal.fire({
        title: "Login Failed",
        text: result.error === "CredentialsSignin" ? "Invalid email or password" : result.error,
        icon: "error",
        confirmButtonColor: "#3b82f6",
      });
    } else {
      Swal.fire({
        title: "Welcome Back!",
        text: "Login successful.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      // Redirect to the callbackUrl (the previous page)
      router.push(callbackUrl); 
      router.refresh(); 
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-poppins">
      {/* ... (Existing JSX remains exactly the same) ... */}
      <div className="max-w-5xl w-full bg-white rounded-xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        <div className="hidden lg:flex bg-slate-900 relative p-12 flex-col justify-between text-white">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
          <Link href="/" className="flex items-center gap-2 text-2xl font-black relative z-10">
            <div className="bg-primary p-2 rounded-xl text-white"><FaArrowLeft className="text-sm" /></div>
            Care.Bridge
          </Link>
          <div className="relative z-10">
            <h2 className="text-4xl font-black leading-tight mb-4">Welcome Back to <span className="text-primary">Care.Bridge</span></h2>
            <p className="text-slate-400 text-lg font-light">Your trusted partner in family care. Log in to manage your bookings.</p>
          </div>
          <div className="relative z-10 p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm text-sm italic opacity-80">
            The booking process was so simple. I found a verified nurse for my father within minutes.
          </div>
        </div>

        <div className="p-8 md:p-16 flex flex-col justify-center">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-black text-slate-800 mb-2">Sign In</h1>
            <p className="text-slate-500">Please enter your credentials to continue.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="form-control">
              <label className="label text-sm font-bold text-slate-700">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" {...register("email", { required: "Email is required" })} className="input input-bordered w-full pl-12 bg-slate-50 border-none" />
              </div>
            </div>

            <div className="form-control">
              <label className="label text-sm font-bold text-slate-700">Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type={showPassword ? "text" : "password"} {...register("password", { required: "Password is required" })} className="input input-bordered w-full pl-12 bg-slate-50 border-none" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2">{showPassword ? <FaEyeSlash /> : <FaEye />}</button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full rounded-2xl h-14 text-white">Log In</button>
            <p className="text-center text-sm mt-8">Don't have an account? <Link href="/register" className="text-primary font-bold">Register for Free</Link></p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;