"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaCalendarCheck, FaUser, FaSignOutAlt, FaHandHoldingHeart } from 'react-icons/fa';
import { signOut } from 'next-auth/react';

const DashboardLayout = ({ children }) => {
    const pathname = usePathname();

    const menuItems = [
        { name: 'My Bookings', icon: <FaCalendarCheck />, path: '/dashboard/myBooking' },
        { name: 'Back to Home', icon: <FaHome />, path: '/' },
    ];

    return (
        <div className="drawer lg:drawer-open bg-slate-50 min-h-screen font-poppins ">
            <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
            
            <div className="drawer-content flex flex-col">
                <div className="w-full navbar bg-white border-b border-slate-200 lg:hidden px-4">
                    <label htmlFor="dashboard-drawer" className="btn btn-ghost drawer-button lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </label>
                    <div className="flex-1 font-bold text-xl">Care.Bridge</div>
                </div>

                <main className="p-4 md:p-8">
                    {children}
                </main>
            </div>

            <div className="drawer-side z-50">
                <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
                <div className="menu p-6 w-80 min-h-full bg-slate-900 text-white">
                    <div className="flex items-center gap-2 text-2xl font-black mb-10 px-4">
                        <FaHandHoldingHeart className="text-primary" />
                        <span>Care.Bridge</span>
                    </div>

                    <ul className="space-y-2">
                        {menuItems.map((item) => (
                            <li key={item.path}>
                                <Link 
                                    href={item.path}
                                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                                        pathname === item.path 
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                    }`}
                                >
                                    {item.icon}
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-auto pt-10">
                        <button 
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="flex items-center gap-4 px-4 py-3 w-full text-error hover:bg-error/10 rounded-xl transition-all font-bold"
                        >
                            <FaSignOutAlt />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;