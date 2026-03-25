"use client";
import React from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import Swal from 'sweetalert2';

const SocialButton = () => {
    const searchParams = useSearchParams();

    const callbackUrl = searchParams.get('callbackUrl') || '/';

    const handleGoogleLogin = async () => {
        try {

            await signIn("google", { 
                callbackUrl: callbackUrl, 
                redirect: true 
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Authentication failed. Please try again.',
                confirmButtonColor: '#3b82f6',
                customClass: { popup: 'rounded-2xl' }
            });
        }
    };

    return (
        <div className="w-full space-y-4">
            <div className="divider text-[10px] font-black text-slate-400 uppercase tracking-[3px]">
                Or continue with
            </div>
            
            <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center gap-3 transition-all hover:bg-slate-50 active:scale-[0.98] outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            >
                <FcGoogle className="text-2xl" />
                <span className="text-sm font-black text-slate-700 uppercase tracking-tight">
                    Sign in with Google
                </span>
            </button>
        </div>
    );
};

export default SocialButton;