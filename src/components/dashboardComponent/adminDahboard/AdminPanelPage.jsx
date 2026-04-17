"use client";
import { getAdminDashboardStats } from '@/action/server/adminStusts';
import React, { useEffect, useState } from 'react';
import { FaWallet, FaChartLine, FaArrowUp, FaCrown, FaFire, FaClock, FaUsers } from 'react-icons/fa';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


const AdminPanelPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const res = await getAdminDashboardStats();
            if (res.success) setData(res);
            setLoading(false);
        };
        fetchStats();
    }, []);

    if (loading) return <div className="flex justify-center py-20"><span className="loading loading-spinner loading-lg text-primary"></span></div>;

    const earnings = [
        { label: "Today", value: data.stats.today, color: "from-emerald-500 to-teal-600" },
        { label: "This Week", value: data.stats.week, color: "from-blue-500 to-indigo-600" },
        { label: "This Month", value: data.stats.month, color: "from-violet-500 to-purple-600" },
        { label: "This Year", value: data.stats.year, color: "from-slate-700 to-slate-900" },
    ];

    const maxCount = Math.max(...data.demandingServices.map(s => s.count), 1);

    return (
        <div className="w-full font-poppins pb-20 px-4">
            <header className="mb-10">
                <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Financial Overview</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Real-time revenue tracking and service demand analytics.</p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {earnings.map((item, i) => (
                    <div key={i} className={`relative overflow-hidden bg-linear-to-br ${item.color} p-6 rounded-4xl shadow-xl shadow-slate-200 text-white`}>
                        <FaWallet className="absolute -right-4 -top-4 text-white/10 text-8xl rotate-12" />
                        <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">{item.label}</p>
                        <h3 className="text-3xl font-black tracking-tighter">৳{item.value.toLocaleString()}</h3>
                        <div className="mt-4 flex items-center gap-2 text-[10px] font-bold bg-white/20 w-fit px-2 py-1 rounded-full">
                            <FaArrowUp /> +12% Growth
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                <FaChartLine className="text-primary" /> Booking Velocity
                            </h3>
                            <div className="flex gap-2 items-center">
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Metrics</span>
                            </div>
                        </div>
                        <div className="w-full h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data?.chartData}>
                                    <defs>
                                        <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} dy={10} />
                                    <YAxis hide />
                                    <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                                    <Area type="monotone" dataKey="bookings" stroke="#3b82f6" strokeWidth={4} fill="url(#colorPrimary)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm h-fit">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-orange-100 text-orange-500 rounded-2xl">
                            <FaFire />
                        </div>
                        <h3 className="font-black text-slate-800 dark:text-slate-100 text-lg">Top Services</h3>
                    </div>
                    
                    <div className="space-y-6">
                        {data.demandingServices.map((service, index) => (
                            <div key={index} className="group">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-sm font-bold text-slate-700">
                                        {index === 0 && <FaCrown className="inline mr-2 text-yellow-400" />}
                                        {service.name}
                                    </span>
                                    <span className="text-[10px] font-black text-slate-400 uppercase">
                                        {service.count} Orders
                                    </span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full transition-all duration-1000 ease-out ${
                                            index === 0 ? 'bg-orange-500' : 'bg-primary'
                                        }`} 
                                        style={{ width: `${(service.count / maxCount) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 p-6 bg-slate-900 dark:bg-slate-800 rounded-4xl text-white">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <FaUsers className="text-primary" />
                                <span className="text-xs font-bold uppercase tracking-tighter">Total Users</span>
                            </div>
                            <span className="text-xl font-black">{data.stats.totalUsers}</span>
                        </div>
                        <button className="btn btn-primary btn-sm w-full rounded-xl normal-case font-bold h-10 shadow-lg shadow-primary/20">
                            View Detailed Stats
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanelPage;