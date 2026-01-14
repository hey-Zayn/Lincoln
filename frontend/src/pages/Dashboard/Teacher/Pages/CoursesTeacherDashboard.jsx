import React, { useEffect } from 'react';
import { BookOpen, Edit, Filter, Layers2, LayoutGrid, Loader2, Menu, Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useCourseStore } from '@/store/useCourseStore';
import { Link, useNavigate } from 'react-router-dom';

const CoursesTeacherDashboard = () => {
    const { userCourses, getAllCoursesByUser, isLoading } = useCourseStore();
    const navigate = useNavigate();

    useEffect(() => {
        getAllCoursesByUser();
    }, [getAllCoursesByUser]);

    if (isLoading) {
        return (
            <div className="w-full min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-50 p-6 lg:p-10 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div className="flex items-center gap-4">
                        <div className="size-12 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-sm flex items-center justify-center shadow-sm">
                            <Layers2 className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white">Course Inventory</h1>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Operational Assets:</span>
                                <Badge variant="secondary" className="rounded-none px-2 py-0 h-4 font-black bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 text-[10px]">
                                    {userCourses?.length || 0}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="icon" className="h-12 w-12 border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-sm hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all">
                            <Filter className="w-4 h-4" />
                        </Button>
                        <Link to="/teacher/courses/create">
                            <Button className="h-12 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest italic px-8 rounded-sm shadow-xl shadow-red-600/20 gap-3">
                                <Plus className="w-4 h-4" />
                                Initiate Deployment
                            </Button>
                        </Link>
                    </div>
                </div>

                {userCourses?.length === 0 ? (
                    <Card className="border-dashed border-2 border-slate-200 dark:border-zinc-800 py-32 bg-white/50 dark:bg-zinc-900/20 rounded-sm flex flex-col items-center justify-center text-center">
                        <div className="size-20 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-sm flex items-center justify-center mb-8 shadow-inner">
                            <LayoutGrid className="w-10 h-10 text-slate-300 dark:text-zinc-700 opacity-50" />
                        </div>
                        <h3 className="text-xl font-black italic uppercase tracking-tight text-slate-900 dark:text-white mb-2">Vault Empty</h3>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-10 max-w-sm mx-auto leading-relaxed">No instructional protocols detected. Deploy your first asset to begin operations.</p>
                        <Link to="/teacher/courses/create">
                            <Button className="bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest italic px-10 h-12 rounded-sm shadow-xl shadow-red-600/20">Initiate Protocol</Button>
                        </Link>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {userCourses.map((course) => (
                            <Card
                                key={course._id}
                                onClick={() => navigate(`/teacher/courses/${course._id}/edit`)}
                                className="group hover:shadow-2xl hover:shadow-red-600/5 transition-all duration-500 cursor-pointer border-slate-200 dark:border-zinc-800 dark:bg-zinc-900 rounded-sm overflow-hidden"
                            >
                                <CardContent className="p-0">
                                    <div className="relative">
                                        <div className="w-full h-48 bg-slate-100 dark:bg-zinc-950 overflow-hidden">
                                            {course.thumbnail ? (
                                                <img
                                                    src={course.thumbnail}
                                                    alt={course.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-200 dark:text-zinc-800">
                                                    <LayoutGrid className="w-16 h-16" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute top-4 left-4 flex gap-1">
                                            <Badge className="bg-white/95 dark:bg-zinc-900/95 text-slate-900 dark:text-white border-slate-200 dark:border-zinc-800 backdrop-blur-md text-[8px] font-black uppercase tracking-widest rounded-none px-2 shadow-sm">
                                                {course.category}
                                            </Badge>
                                        </div>
                                        <div className="absolute bottom-4 right-4">
                                            <Badge className={`backdrop-blur-md border-none text-[8px] font-black uppercase tracking-widest rounded-none px-2 shadow-lg ${course.isPublished ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                                                {course.isPublished ? 'Deployed' : 'Draft Mode'}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="p-6 space-y-6">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[8px] font-black text-red-600 uppercase tracking-widest italic opacity-50">Protocol:</span>
                                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest truncate">{course._id}</span>
                                            </div>
                                            <h3 className="font-black italic uppercase tracking-tight text-slate-900 dark:text-white text-base leading-[1.3] line-clamp-2 min-h-[3rem] group-hover:text-red-600 transition-colors">
                                                {course.title}
                                            </h3>
                                            <div className="flex items-center gap-4 text-slate-400">
                                                <div className="flex items-center gap-2 bg-slate-50 dark:bg-zinc-950/50 px-2 py-1 border border-slate-100 dark:border-zinc-800/50 rounded-none shadow-inner">
                                                    <Menu className="w-3 h-3 text-red-600" />
                                                    <span className="text-[9px] font-black uppercase tracking-widest">{course.lectures?.length || 0} Modules</span>
                                                </div>
                                                <div className="flex items-center gap-2 bg-slate-50 dark:bg-zinc-950/50 px-2 py-1 border border-slate-100 dark:border-zinc-800/50 rounded-none shadow-inner">
                                                    <Users className="w-3 h-3 text-blue-600" />
                                                    <span className="text-[9px] font-black uppercase tracking-widest">{course.studentsEnrolled?.length || 0} Assets</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-zinc-800/50">
                                            <Badge variant="secondary" className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-none bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 shadow-sm">
                                                Level {course.courseLevel}
                                            </Badge>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-9 w-9 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-sm text-slate-400 hover:text-white hover:bg-blue-600 hover:border-blue-700 transition-all"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/teacher/courses/${course._id}/edit`);
                                                    }}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-9 w-9 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-sm text-slate-400 hover:text-white hover:bg-red-600 hover:border-red-700 transition-all"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/teacher/courses/${course._id}/curriculum`);
                                                    }}
                                                >
                                                    <BookOpen className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoursesTeacherDashboard;
