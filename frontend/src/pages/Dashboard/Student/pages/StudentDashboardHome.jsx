import React, { useEffect, useState } from 'react';
import { BookOpen, GraduationCap, Clock, CheckCircle2, TrendingUp, AlertCircle, Calendar, HelpCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useCourseStore } from '@/store/useCourseStore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const StudentDashboardHome = () => {
    const { getStudentDashboardStats } = useCourseStore();
    const [dashboardData, setDashboardData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setIsLoading(true);
            const data = await getStudentDashboardStats();
            if (data?.success) {
                setDashboardData(data);
            }
            setIsLoading(false);
        };
        fetchStats();
    }, [getStudentDashboardStats]);

    // Simulated fallback data while loading or if error
    const stats = dashboardData?.stats || [
        { label: 'Courses Enrolled', value: '0', change: '--', icon: BookOpen, color: 'text-blue-500' },
        { label: 'Average Progress', value: '0%', change: '--', icon: TrendingUp, color: 'text-emerald-500' },
        { label: 'Upcoming Quizzes', value: '0', change: '--', icon: HelpCircle, color: 'text-orange-500' },
        { label: 'Study Hours', value: '0h', change: 'This Week', icon: Clock, color: 'text-purple-500' },
    ];

    const iconMap = {
        BookOpen,
        GraduationCap,
        Clock,
        AlertCircle,
        HelpCircle,
        TrendingUp
    };

    if (isLoading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="h-8 w-64 bg-slate-200 dark:bg-zinc-800 rounded-sm"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-32 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-sm"></div>
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 h-80 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-sm"></div>
                    <div className="h-80 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-sm"></div>
                </div>
            </div>
        );
    }

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
                {stats.map((stat, index) => {
                    const Icon = typeof stat.icon === 'string' ? iconMap[stat.icon] || BookOpen : stat.icon;
                    return (
                        <div key={index} className="p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-sm shadow-sm group hover:border-emerald-600/30 transition-colors">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-2 bg-slate-100 dark:bg-zinc-800 rounded-md ${stat.color} group-hover:bg-opacity-80 transition-colors`}>
                                    <Icon className="size-5" />
                                </div>
                                <span className={`text-xs font-black uppercase tracking-widest ${stat.change?.includes('Due') ? 'text-red-500' : 'text-slate-400'}`}>
                                    {stat.change}
                                </span>
                            </div>
                            <h3 className="text-slate-500 dark:text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{stat.label}</h3>
                            <p className="text-2xl font-mono font-black text-slate-900 dark:text-white">{stat.value}</p>
                        </div>
                    );
                })}
            </div>

            {/* Charts & Tasks Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Learning Activity Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-sm p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
                                <TrendingUp className="size-4 text-emerald-600" />
                                Activity Flux
                            </h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Learning Momentum Metrics</p>
                        </div>
                        <select className="bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-[10px] font-black uppercase tracking-widest rounded-sm px-3 py-1.5 outline-none text-slate-600 cursor-pointer">
                            <option>Real-time View</option>
                            <option>Historical Data</option>
                        </select>
                    </div>

                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dashboardData?.activityData || []}>
                                <XAxis
                                    dataKey="day"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }}
                                    dy={10}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(16, 185, 129, 0.05)' }}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-slate-900 text-white p-2 px-3 rounded-sm border border-slate-800 shadow-xl">
                                                    <p className="text-[10px] font-black uppercase tracking-widest">{payload[0].payload.day}</p>
                                                    <p className="text-xs font-black text-emerald-400">{payload[0].value} MINUTES</p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar dataKey="mins" radius={[2, 2, 0, 0]} barSize={32}>
                                    {(dashboardData?.activityData || []).map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={index === 4 ? '#10b981' : '#e2e8f0'}
                                            className="dark:fill-zinc-800"
                                            fillOpacity={index === 4 ? 1 : 0.5}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Upcoming Deadlines */}
                <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-sm p-6 shadow-sm">
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white mb-8 flex items-center gap-2">
                        <Calendar className="size-4 text-emerald-600" />
                        Queue: Assessments
                    </h2>
                    <div className="space-y-6">
                        {(dashboardData?.upcomingQuizzes?.length > 0 ? dashboardData.upcomingQuizzes : [
                            { title: "React Architecture Quiz", course: "Frontend Advanced", due: "T + 2 days", type: "quiz" },
                            { title: "Backend Systems Exam", course: "Fullstack Mastery", due: "T + 4 days", type: "exam" },
                        ]).map((task, i) => (
                            <div key={i} className="flex gap-4 group cursor-pointer border-l-2 border-transparent hover:border-emerald-500 pl-0 hover:pl-3 transition-all">
                                <div className="mt-1">
                                    <div className="p-2 bg-slate-50 dark:bg-zinc-800 rounded-sm text-slate-400 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10 group-hover:text-emerald-600 transition-all border border-slate-200 dark:border-zinc-800 group-hover:border-emerald-500/20">
                                        <Clock className="size-3.5" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-emerald-600 transition-colors">{task.title}</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{task.course}</p>
                                    <p className={`text-[10px] font-black uppercase tracking-widest mt-1.5 ${task.due.includes('Tomorrow') ? 'text-red-500' : 'text-emerald-500/70'}`}>{task.due}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Button variant="ghost" className="w-full mt-8 border border-dashed border-slate-200 dark:border-zinc-800 rounded-sm h-10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all">
                        View Full Schedule
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboardHome;