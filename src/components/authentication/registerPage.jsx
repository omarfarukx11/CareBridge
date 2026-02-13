"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import { useForm } from "react-hook-form";
import { FaUser, FaEnvelope, FaLock, FaIdCard, FaPhone, FaArrowLeft } from "react-icons/fa";
import { postUser } from "@/action/server/register";
import Swal from "sweetalert2"; // Import SweetAlert2

const RegisterPage = () => {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    const result = await postUser(data);
    
    if (result?.success) {
      // Success Alert
      Swal.fire({
        title: "Registration Successful!",
        text: result.message || "Your account has been created.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      // Redirect to login page after success
      router.push("/login");
    } else {
      // Error Alert
      Swal.fire({
        title: "Registration Failed",
        text: result?.message || "Something went wrong. Please try again.",
        icon: "error",
        confirmButtonColor: "#3b82f6", // Matches your primary blue
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-poppins">
      <div className="max-w-5xl w-full bg-white rounded-lg shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        
        <div className="hidden lg:flex bg-primary relative p-12 flex-col justify-between text-white">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pattern-dots"></div>
          <Link href="/" className="flex items-center gap-2 text-2xl font-black relative z-10">
            <div className="bg-white p-2 rounded-xl text-primary"><FaArrowLeft className="text-sm" /></div>
            Care.Bridge
          </Link>
          <div className="relative z-10">
            <h2 className="text-4xl font-black leading-tight mb-4 text-white">Join our community.</h2>
            <p className="text-primary-content/80 text-lg font-light">Your NID verified account ensures a secure care environment for everyone.</p>
          </div>
          <div className="relative z-10 flex gap-4">
             <p className="text-sm font-medium opacity-80">Secured with NID Verification</p>
          </div>
        </div>

        <div className="p-8 md:p-12 overflow-y-auto max-h-[90vh]">
          <div className="mb-6 text-center lg:text-left">
            <h1 className="text-3xl font-black text-slate-800 mb-2">Create Account</h1>
            <p className="text-slate-500 text-sm">Fill in your NID and contact details.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

               <div className="form-control">
                  <label className="label text-xs font-bold text-slate-700">Full Name</label>
                  <div className="relative">
                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      {...register("name", { required: "Name is required" })}
                      placeholder="John Doe" 
                      className="input input-bordered w-full border-none outline-none pl-5 bg-slate-50 border-slate-200" 
                    />
                  </div>
                  {errors.name && <span className="text-error text-[10px] mt-1">{errors.name.message}</span>}
                </div>

                <div className="form-control">
                  <label className="label text-xs font-bold text-slate-700">NID Number</label>
                  <div className="relative">
                    <FaIdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="number" 
                      {...register("nid", { required: "NID is required", minLength: {value: 10, message: "Invalid NID"} })}
                      placeholder="1234567890" 
                      className="input input-bordered w-full border-none outline-none pl-5 bg-slate-50 border-slate-200" 
                    />
                  </div>
                  {errors.nid && <span className="text-error text-[10px] mt-1">{errors.nid.message}</span>}
                </div>
            </div>

            <div className="form-control">
              <label className="label text-xs font-bold text-slate-700">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="email" 
                  {...register("email", { required: "Email is required" })}
                  placeholder="john@example.com" 
                  className="input input-bordered w-full border-none outline-none pl-5 bg-slate-50 border-slate-200" 
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label text-xs font-bold text-slate-700">Contact Number</label>
              <div className="relative">
                <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="tel" 
                  {...register("contact", { required: "Contact is required" })}
                  placeholder="017XXXXXXXX" 
                  className="input input-bordered w-full border-none outline-none pl-5 bg-slate-50 border-slate-200" 
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label text-xs font-bold text-slate-700">Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="password" 
                  {...register("password", { 
                    required: "Password is required",
                    minLength: { value: 6, message: "Minimum 6 characters" },
                    validate: {
                      uppercase: (v) => /[A-Z]/.test(v) || "Must include an uppercase letter",
                      lowercase: (v) => /[a-z]/.test(v) || "Must include a lowercase letter",
                    }
                  })}
                  placeholder="••••••••" 
                  className="input input-bordered w-full border-none outline-none pl-5 bg-slate-50 border-slate-200" 
                />
              </div>
              {errors.password && <span className="text-error text-[10px] mt-1">{errors.password.message}</span>}
            </div>

            <button type="submit" className="btn btn-primary w-full rounded-lg h-12 text-white text-lg mt-4 border-none">
              Register 
            </button>

            <p className="text-center text-slate-500 text-sm mt-4">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-bold hover:underline">Log In</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;