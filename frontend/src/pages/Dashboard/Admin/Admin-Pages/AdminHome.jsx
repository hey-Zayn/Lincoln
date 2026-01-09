import React from 'react';
import { Users, BookOpen, DollarSign, Activity, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

const AdminHome = () => {
    // Simulated data for the dashboard
    const stats = [
        { label: 'Total Users', value: '1,248', change: '+12%', icon: Users, color: 'text-blue-500' },
        { label: 'Active Courses', value: '48', change: '+4%', icon: BookOpen, color: 'text-emerald-500' },
        { label: 'Total Revenue', value: '$24.5k', change: '+18%', icon: DollarSign, color: 'text-yellow-500' },
        { label: 'System Health', value: '98%', change: 'Stable', icon: Activity, color: 'text-red-500' },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">System Overview</h1>
                    <p className="text-slate-500 text-sm font-medium">Real-time platform metrics and analytics</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">Live Connection</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className="p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-sm shadow-sm group hover:border-red-600/30 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2 bg-slate-100 dark:bg-zinc-800 rounded-md ${stat.color} group-hover:bg-opacity-80 transition-colors`}>
                                <stat.icon className="size-5" />
                            </div>
                            <span className={`text-xs font-bold ${stat.change.includes('+') ? 'text-emerald-500' : 'text-slate-500'}`}>
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-slate-500 dark:text-zinc-500 text-xs font-black uppercase tracking-widest mb-1">{stat.label}</h3>
                        <p className="text-2xl font-mono font-bold text-slate-900 dark:text-white">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Charts & Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Activity Chart Area */}
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-sm p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
                            <TrendingUp className="size-4 text-red-600" />
                            Platform Traffic
                        </h2>
                        <select className="bg-slate-50 dark:bg-zinc-950 border-none text-xs font-bold rounded-sm px-2 py-1 outline-none text-slate-600 cursor-pointer">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                    {/* Placeholder for Chart Visual */}
                    <div className="h-64 w-full bg-slate-50 dark:bg-zinc-950/50 rounded-sm flex items-end justify-between px-4 pb-0 pt-8 gap-2">
                         {[40, 65, 30, 85, 55, 90, 45].map((h, i) => (
                             <div key={i} className="w-full bg-red-600/10 hover:bg-red-600/20 transition-colors rounded-t-sm relative group" style={{ height: `${h}%` }}>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    {h}%
                                </div>
                             </div>
                         ))}
                    </div>
                    <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                </div>

                {/* Recent Activity Feed */}
                <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-sm p-6 shadow-sm">
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <Activity className="size-4 text-red-600" />
                        System Logs
                    </h2>
                    <div className="space-y-6">
                        {[
                            { msg: "New user registration", time: "2 mins ago", status: "success" },
                            { msg: "Server backup completed", time: "1 hour ago", status: "success" },
                            { msg: "Failed login attempt", time: "3 hours ago", status: "warning" },
                            { msg: "Course 'React Basics' updated", time: "5 hours ago", status: "info" }
                        ].map((log, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="mt-0.5">
                                    {log.status === 'success' && <CheckCircle2 className="size-4 text-emerald-500" />}
                                    {log.status === 'warning' && <AlertCircle className="size-4 text-amber-500" />}
                                    {log.status === 'info' && <div className="size-4 rounded-full bg-blue-500/20 border-2 border-blue-500" />}
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-800 dark:text-zinc-200">{log.msg}</p>
                                    <p className="text-[10px] font-medium text-slate-400 mt-0.5">{log.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminHome;