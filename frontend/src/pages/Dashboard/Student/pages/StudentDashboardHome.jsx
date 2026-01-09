import React from 'react';
import { BookOpen, GraduationCap, Clock, CheckCircle2, TrendingUp, AlertCircle, Calendar } from 'lucide-react';

const StudentDashboardHome = () => {
    // Simulated data for student dashboard
    const stats = [
        { label: 'Courses Enrolled', value: '6', change: '2 Active', icon: BookOpen, color: 'text-blue-500' },
        { label: 'Current GPA', value: '3.8', change: 'Top 10%', icon: GraduationCap, color: 'text-emerald-500' },
        { label: 'Assignments', value: '4', change: '2 Due Soon', icon: AlertCircle, color: 'text-red-500' },
        { label: 'Study Hours', value: '28h', change: 'This Week', icon: Clock, color: 'text-purple-500' },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Student Overview</h1>
                    <p className="text-slate-500 text-sm font-medium">Track your academic progress and upcoming tasks</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">Session Active</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className="p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-sm shadow-sm group hover:border-emerald-600/30 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2 bg-slate-100 dark:bg-zinc-800 rounded-md ${stat.color} group-hover:bg-opacity-80 transition-colors`}>
                                <stat.icon className="size-5" />
                            </div>
                            <span className={`text-xs font-bold ${stat.change.includes('Due') ? 'text-red-500' : 'text-slate-500'}`}>
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-slate-500 dark:text-zinc-500 text-xs font-black uppercase tracking-widest mb-1">{stat.label}</h3>
                        <p className="text-2xl font-mono font-bold text-slate-900 dark:text-white">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Charts & Tasks Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Learning Activity Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-sm p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
                            <TrendingUp className="size-4 text-emerald-600" />
                            Learning Activity
                        </h2>
                        <select className="bg-slate-50 dark:bg-zinc-950 border-none text-xs font-bold rounded-sm px-2 py-1 outline-none text-slate-600 cursor-pointer">
                            <option>This Week</option>
                            <option>This Month</option>
                        </select>
                    </div>
                    {/* Placeholder for Chart Visual */}
                    <div className="h-64 w-full bg-slate-50 dark:bg-zinc-950/50 rounded-sm flex items-end justify-between px-4 pb-0 pt-8 gap-2">
                         {[60, 45, 80, 55, 90, 70, 40].map((h, i) => (
                             <div key={i} className="w-full bg-emerald-600/10 hover:bg-emerald-600/20 transition-colors rounded-t-sm relative group" style={{ height: `${h}%` }}>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {h} mins
                                </div>
                             </div>
                         ))}
                    </div>
                    <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                </div>

                {/* Upcoming Deadlines */}
                <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-sm p-6 shadow-sm">
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <Calendar className="size-4 text-emerald-600" />
                        Upcoming Deadlines
                    </h2>
                    <div className="space-y-6">
                        {[
                            { title: "React Project Final", due: "Tomorrow, 11:59 PM", type: "assignment" },
                            { title: "Calculus Quiz", due: "Fri, 10:00 AM", type: "exam" },
                            { title: "Physics Lab Report", due: "Next Mon, 5:00 PM", type: "assignment" },
                            { title: "History Essay Draft", due: "Next Wed, 12:00 PM", type: "assignment" }
                        ].map((task, i) => (
                            <div key={i} className="flex gap-4 group cursor-pointer border-l-2 border-transparent hover:border-emerald-500 pl-0 hover:pl-2 transition-all">
                                <div className="mt-0.5">
                                    <div className="p-1.5 bg-slate-100 dark:bg-zinc-800 rounded-md text-slate-500 group-hover:text-emerald-600 transition-colors">
                                        <Clock className="size-3" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-800 dark:text-zinc-200 group-hover:text-emerald-600 transition-colors">{task.title}</p>
                                    <p className={`text-[10px] font-medium mt-0.5 ${task.due.includes('Tomorrow') ? 'text-red-500' : 'text-slate-400'}`}>{task.due}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboardHome;