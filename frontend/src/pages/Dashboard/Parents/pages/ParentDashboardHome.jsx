import React from 'react';
import { Users, BookOpen, Calendar, MessageSquare, TrendingUp, Bell, CheckCircle2 } from 'lucide-react';

const ParentDashboardHome = () => {
    // Simulated data for parent dashboard
    const stats = [
        { label: 'Children Enrolled', value: '2', change: 'Active', icon: Users, color: 'text-blue-500' },
        { label: 'Avg. Attendance', value: '94%', change: '+2%', icon: CheckCircle2, color: 'text-emerald-500' },
        { label: 'Next Payment', value: '$1,200', change: 'Due in 5 days', icon: Calendar, color: 'text-yellow-500' },
        { label: 'Unread Notices', value: '3', change: 'New', icon: Bell, color: 'text-red-500' },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Parent Overview</h1>
                    <p className="text-slate-500 text-sm font-medium">Monitor your children's progress and activities</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">Live Updates</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className="p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-sm shadow-sm group hover:border-blue-600/30 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2 bg-slate-100 dark:bg-zinc-800 rounded-md ${stat.color} group-hover:bg-opacity-80 transition-colors`}>
                                <stat.icon className="size-5" />
                            </div>
                            <span className={`text-xs font-bold ${stat.change.includes('Due') ? 'text-amber-500' : 'text-slate-500'}`}>
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-slate-500 dark:text-zinc-500 text-xs font-black uppercase tracking-widest mb-1">{stat.label}</h3>
                        <p className="text-2xl font-mono font-bold text-slate-900 dark:text-white">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Charts & Updates Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Performance Chart Area */}
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-sm p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
                            <TrendingUp className="size-4 text-blue-600" />
                            Academic Performance
                        </h2>
                        <select className="bg-slate-50 dark:bg-zinc-950 border-none text-xs font-bold rounded-sm px-2 py-1 outline-none text-slate-600 cursor-pointer">
                            <option>Mid Term</option>
                            <option>Finals</option>
                        </select>
                    </div>
                    {/* Placeholder for Chart Visual */}
                    <div className="h-64 w-full bg-slate-50 dark:bg-zinc-950/50 rounded-sm flex items-end justify-between px-8 pb-0 pt-8 gap-6">
                         {[65, 78, 85, 92, 88].map((h, i) => (
                             <div key={i} className="w-full bg-blue-600/10 hover:bg-blue-600/20 transition-colors rounded-t-sm relative group" style={{ height: `${h}%` }}>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    Subject {i + 1}: {h}%
                                </div>
                             </div>
                         ))}
                    </div>
                    <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4">
                        <span>Math</span><span>Sci</span><span>Eng</span><span>Hist</span><span>Art</span>
                    </div>
                </div>

                {/* Recent Updates Feed */}
                <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-sm p-6 shadow-sm">
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <MessageSquare className="size-4 text-blue-600" />
                        Recent Updates
                    </h2>
                    <div className="space-y-6">
                        {[
                            { msg: "Q1 Report Card Released", time: "Yesterday", type: "academic" },
                            { msg: "School Trip Payment Due", time: "2 days ago", type: "fee" },
                            { msg: "Parent-Teacher Meeting", time: "Oct 15th", type: "event" },
                            { msg: "Math Assignment Submitted", time: "Today, 10:30 AM", type: "academic" }
                        ].map((log, i) => (
                            <div key={i} className="flex gap-4 group cursor-pointer">
                                <div className="mt-0.5">
                                    <div className="size-2 rounded-full bg-slate-300 group-hover:bg-blue-600 transition-colors mt-1.5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-800 dark:text-zinc-200 group-hover:text-blue-600 transition-colors">{log.msg}</p>
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

export default ParentDashboardHome;