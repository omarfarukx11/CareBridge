"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaCalendarCheck, FaSignOutAlt, FaBars } from 'react-icons/fa';
import { signOut } from 'next-auth/react';

const DashboardLayout = ({ children }) => {
    const pathname = usePathname();

    const menuItems = [
        { name: 'My Bookings', icon: <FaCalendarCheck />, path: '/dashboard/myBooking' },
        { name: 'Back to Home', icon: <FaHome />, path: '/' },
    ];

    return (
        <div className="drawer lg:drawer-open bg-slate-50 min-h-screen font-poppins max-w-7xl mx-auto">
            <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
            
            <div className="drawer-content flex flex-col">
                <div className="w-full navbar bg-white border-b border-slate-200 lg:hidden px-4 sticky top-0 z-30">
                    <div className="flex-none">
                        <label htmlFor="dashboard-drawer" className="btn btn-ghost btn-square lg:hidden">
                            <FaBars className="text-xl" />
                        </label>
                    </div>
                    <div className="flex-1 font-bold text-xl ml-2">Care.Bridge</div>
                </div>

                <main className="p-4 md:p-8">
                    {children}
                </main>
            </div>

            <div className="drawer-side z-50">
                <label htmlFor="dashboard-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                
                <div className="menu p-6 w-[70%] md:w-80 min-h-full bg-black text-white flex flex-col">
                    <Link href={'/'} className="flex items-center gap-2 text-2xl font-black mb-10 px-4">
                        <span>Care.Bridge</span>
                    </Link>

                    <ul className="space-y-2 grow">
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
                            className="flex items-center gap-4 px-4 py-3 w-full text-error hover:bg-error/10 rounded-xl transition-all font-bold cursor-pointer"
                        >
                            <FaSignOutAlt />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* 4. Scroll Lock Logic (CSS-only for DaisyUI drawer) */}
            <style jsx global>{`
                /* When the drawer checkbox is checked, lock the body scroll */
                body:has(#dashboard-drawer:checked) {
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
};

export default DashboardLayout;