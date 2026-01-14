import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCourseStore } from '../../../../store/useCourseStore';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
    PieChart, Pie
} from 'recharts';
import {
    Plus,
    Search,
    Edit3,
    Trash2,
    Users,
    BookOpen,
    TrendingUp,
    LayoutGrid,
    Loader2,
    DollarSign,
    ChevronRight
} from 'lucide-react';

const TeacherDashboardHome = () => {
    const { userCourses, getAllCoursesByUser, deleteCourse, getTeacherDashboardStats } = useCourseStore();
    const [statsData, setStatsData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            setIsLoading(true);
            await getAllCoursesByUser();
            const stats = await getTeacherDashboardStats();
            if (stats?.success) {
                setStatsData(stats);
            }
            setIsLoading(false);
        };
        fetchAll();
    }, [getAllCoursesByUser, getTeacherDashboardStats]);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
            deleteCourse(id);
        }
    };

    const iconMap = {
        Users,
        BookOpen,
        TrendingUp,
        DollarSign
    };

    if (isLoading) {
        return (
            <div className="space-y-12 animate-pulse">
                <div className="flex justify-between items-center">
                    <div className="space-y-3">
                        <div className="h-10 w-96 bg-slate-200 dark:bg-zinc-800 rounded-md"></div>
                        <div className="h-4 w-72 bg-slate-100 dark:bg-zinc-900 rounded-md"></div>
                    </div>
                    <div className="h-14 w-48 bg-slate-200 dark:bg-zinc-800 rounded-md"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-40 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-md"></div>
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="h-80 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-md"></div>
                    <div className="h-80 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-md"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black mb-3 flex items-center gap-4 uppercase italic tracking-tight text-slate-900 dark:text-white">
                        Command <span className="text-red-600">Center</span>
                        <span className="text-red-500 font-black text-[10px] bg-red-600/10 px-3 py-1 rounded-md border border-red-600/20 uppercase tracking-[0.2em] italic">Authority</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl">Architect your curriculum, monitor operative progress, and scale your educational influence from a single viewport.</p>
                </div>
                <Link
                    to="/teacher/courses/create"
                    className="flex items-center justify-center gap-3 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest rounded-md transition-all shadow-xl shadow-red-600/20 active:scale-95 whitespace-nowrap"
                >
                    <Plus className="size-5" /> Initiate New Course
                </Link>
            </div>

            {/* Analytics Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {(statsData?.stats || [
                    { label: "Active Cohort", value: "0", icon: Users, color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-500/10" },
                    { label: "Operative Assets", value: userCourses.length.toString(), icon: BookOpen, color: "text-red-600", bg: "bg-red-100 dark:bg-red-500/10" },
                    { label: "Revenue Stream", value: "₹0", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-500/10" }
                ]).map((stat, i) => {
                    const Icon = typeof stat.icon === 'string' ? iconMap[stat.icon] || BookOpen : stat.icon;
                    return (
                        <div key={i} className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-8 rounded-md shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all group">
                            <div className="flex items-center gap-5 mb-6">
                                <div className={`size-14 rounded-md ${stat.bg} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                                    <Icon className={`size-7 ${stat.color}`} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{stat.label}</span>
                            </div>
                            <p className="text-4xl font-black italic tracking-tighter text-slate-900 dark:text-white">{stat.value}</p>
                        </div>
                    );
                })}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Enrollment Trend Bar Chart */}
                <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-8 rounded-md shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white mb-2">Enrollment Flux</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Performance metrics for current cycle</p>
                        </div>
                        <TrendingUp className="size-5 text-red-600" />
                    </div>

                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={statsData?.enrollmentTrend || []}>
                                <XAxis
                                    dataKey="day"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }}
                                    dy={10}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(220, 38, 38, 0.05)' }}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-white dark:bg-zinc-950 text-slate-900 dark:text-white p-3 rounded-sm border border-slate-200 dark:border-zinc-800 shadow-2xl">
                                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-50">{payload[0].payload.day}</p>
                                                    <p className="text-lg font-black text-red-600 italic">+{payload[0].value} STUDENTS</p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar dataKey="students" radius={[4, 4, 0, 0]} barSize={24}>
                                    {(statsData?.enrollmentTrend || []).map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.students > 15 ? '#dc2626' : '#94a3b8'}
                                            className="dark:fill-zinc-800 transition-all duration-500"
                                            fillOpacity={entry.students > 15 ? 1 : 0.3}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Course Distribution (Pie or Horizontal Bar Chart) */}
                <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-8 rounded-md shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white mb-2">Operational Reach</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Cohort distribution across assets</p>
                        </div>
                        <LayoutGrid className="size-5 text-blue-600" />
                    </div>

                    <div className="space-y-6">
                        {(statsData?.courseDistribution || []).map((course, i) => (
                            <div key={i} className="group">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[11px] font-black uppercase tracking-tight text-slate-700 dark:text-slate-300 group-hover:text-red-600 transition-colors">{course.name}</span>
                                    <span className="text-[10px] font-black italic text-slate-400">{course.students} ENLISTED</span>
                                </div>
                                <div className="w-full h-2 bg-slate-100 dark:bg-zinc-950 rounded-full overflow-hidden shadow-inner ring-1 ring-slate-200 dark:ring-zinc-800">
                                    <div
                                        className="h-full bg-red-600 transition-all duration-1000 shadow-[0_0_15px_rgba(220,38,38,0.4)]"
                                        style={{ width: `${Math.min((course.students / (statsData?.stats[0]?.value || 100)) * 100, 100)}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                        {statsData?.courseDistribution?.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center py-12 text-slate-400">
                                <p className="text-xs font-black uppercase tracking-widest italic">Insufficient intelligence data</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Course List Section */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-md overflow-hidden shadow-2xl shadow-black/5">
                <div className="p-8 border-b border-slate-100 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/50 dark:bg-zinc-900/50">
                    <h2 className="text-xl font-black uppercase italic tracking-tight text-slate-900 dark:text-white">Active Inventory</h2>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-red-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Locate course asset..."
                            className="pl-12 pr-4 py-3 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 text-[10px] font-black uppercase tracking-widest w-full md:w-80 shadow-inner transition-all text-slate-900 dark:text-white"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-zinc-950/50 text-slate-400 uppercase text-[10px] font-black tracking-[0.2em] italic">
                                <th className="px-10 py-5">Course Definition</th>
                                <th className="px-10 py-5 text-center">Cohort</th>
                                <th className="px-10 py-5 text-center">Modules</th>
                                <th className="px-10 py-5 text-center">Valuation</th>
                                <th className="px-10 py-5 text-right">Ops</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                            {userCourses.length > 0 ? userCourses.map((course) => (
                                <tr key={course._id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-all group">
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-6">
                                            <div className="size-20 rounded-md overflow-hidden border border-slate-200 dark:border-zinc-800 shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-500">
                                                <img
                                                    src={course.courseThumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&auto=format&fit=crop&q=60"}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 dark:text-slate-200 group-hover:text-red-600 transition-colors uppercase italic tracking-tight">{course.title}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-[10px] text-red-600 font-black uppercase tracking-widest bg-red-600/5 px-2 py-0.5 rounded-md border border-red-600/10">{course.category}</span>
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">• Updated 2d ago</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-center">
                                        <span className="text-sm font-black text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-zinc-800 px-3 py-1 rounded-md shadow-inner">{course.studentsEnrolled?.length || 0}</span>
                                    </td>
                                    <td className="px-10 py-8 text-center">
                                        <div className="flex flex-col items-center">
                                            <span className="text-sm font-black text-slate-600 dark:text-slate-400">{course.lectures?.length || 0}</span>
                                            <div className="w-12 h-1 bg-slate-100 dark:bg-zinc-800 rounded-full mt-2 overflow-hidden">
                                                <div className="h-full bg-red-600 w-2/3 shadow-glow-red" />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-center">
                                        <span className="text-md font-black text-emerald-600 italic">₹{course.coursePrice || 0}</span>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <Link
                                                to={`/teacher/courses/${course._id}/curriculum`}
                                                className="p-3 bg-slate-100 dark:bg-zinc-800 hover:bg-orange-600 hover:text-white text-slate-500 dark:text-slate-400 rounded-md transition-all shadow-sm hover:shadow-xl hover:shadow-orange-600/20 active:scale-90"
                                                title="Knowledge Curriculum"
                                            >
                                                <LayoutGrid className="size-4" />
                                            </Link>
                                            <Link
                                                to={`/teacher/courses/${course._id}/edit`}
                                                className="p-3 bg-slate-100 dark:bg-zinc-800 hover:bg-red-600 hover:text-white text-slate-500 dark:text-slate-400 rounded-md transition-all shadow-sm hover:shadow-xl hover:shadow-red-600/20 active:scale-90"
                                                title="Edit Metadata"
                                            >
                                                <Edit3 className="size-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(course._id)}
                                                className="p-3 bg-slate-100 dark:bg-zinc-800 hover:bg-rose-600 hover:text-white text-slate-500 dark:text-slate-400 rounded-md transition-all shadow-sm hover:shadow-xl hover:shadow-rose-600/20 active:scale-90"
                                                title="Purge Asset"
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-10 py-32 text-center text-slate-400">
                                        <div className="size-20 bg-slate-50 dark:bg-zinc-950 rounded-md flex items-center justify-center mx-auto mb-8 shadow-inner ring-1 ring-slate-100 dark:ring-zinc-800">
                                            <LayoutGrid className="size-10 opacity-10" />
                                        </div>
                                        <p className="text-xl font-black uppercase italic text-slate-900 dark:text-slate-200 mb-2">Inventory Depleted</p>
                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Initiate your first pedagogical objective to begin operations.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboardHome;