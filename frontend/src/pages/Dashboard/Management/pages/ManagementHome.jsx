import React from 'react';
import { Users, PieChart, FileText, Building2, TrendingUp, Bell, CheckCircle2, AlertTriangle } from 'lucide-react';

const ManagementHome = () => {
    // Simulated data for management dashboard
    const stats = [
        { label: 'Total Staff', value: '142', change: '12 On Leave', icon: Users, color: 'text-blue-500' },
        { label: 'Budget Utilized', value: '$45.2k', change: '65% of Q3', icon: PieChart, color: 'text-amber-500' },
        { label: 'Pending Reports', value: '8', change: 'Needs Review', icon: FileText, color: 'text-red-500' },
        { label: 'Facility Status', value: '98%', change: 'Operational', icon: Building2, color: 'text-emerald-500' },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Management Overview</h1>
                    <p className="text-slate-500 text-sm font-medium">Operational metrics and resource management</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="flex size-2 rounded-full bg-amber-500 animate-pulse"></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-500">System Live</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className="p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-sm shadow-sm group hover:border-amber-600/30 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2 bg-slate-100 dark:bg-zinc-800 rounded-md ${stat.color} group-hover:bg-opacity-80 transition-colors`}>
                                <stat.icon className="size-5" />
                            </div>
                            <span className={`text-xs font-bold ${stat.change.includes('Review') ? 'text-red-500' : 'text-slate-500'}`}>
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
                {/* Financial Overview Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-sm p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
                            <TrendingUp className="size-4 text-amber-600" />
                            Financial Overview
                        </h2>
                        <select className="bg-slate-50 dark:bg-zinc-950 border-none text-xs font-bold rounded-sm px-2 py-1 outline-none text-slate-600 cursor-pointer">
                            <option>Q3 2024</option>
                            <option>Q2 2024</option>
                        </select>
                    </div>
                    {/* Placeholder for Chart Visual */}
                    <div className="h-64 w-full bg-slate-50 dark:bg-zinc-950/50 rounded-sm flex items-end justify-between px-8 pb-0 pt-8 gap-6">
                         {[45, 60, 75, 50, 80, 65].map((h, i) => (
                             <div key={i} className="w-full bg-amber-600/10 hover:bg-amber-600/20 transition-colors rounded-t-sm relative group" style={{ height: `${h}%` }}>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    ${h}k
                                </div>
                             </div>
                         ))}
                    </div>
                    <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4">
                        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                    </div>
                </div>

                {/* Operational Updates Feed */}
                <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-sm p-6 shadow-sm">
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <Bell className="size-4 text-amber-600" />
                        Operational Updates
                    </h2>
                    <div className="space-y-6">
                        {[
                            { title: "Q3 Budget Review", status: "Due Tomorrow", icon: AlertTriangle, color: "text-amber-500" },
                            { title: "New Lab Equipment Arrived", status: "Verified", icon: CheckCircle2, color: "text-emerald-500" },
                            { title: "Staff Meeting: Policy Update", status: "Scheduled 2pm", icon: Users, color: "text-blue-500" },
                            { title: "Maintenance: Server Room", status: "In Progress", icon: Building2, color: "text-slate-500" }
                        ].map((update, i) => (
                            <div key={i} className="flex gap-4 group cursor-pointer">
                                <div className="mt-0.5">
                                    <update.icon className={`size-4 ${update.color}`} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-800 dark:text-zinc-200 group-hover:text-amber-600 transition-colors">{update.title}</p>
                                    <p className="text-[10px] font-medium text-slate-400 mt-0.5">{update.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagementHome;