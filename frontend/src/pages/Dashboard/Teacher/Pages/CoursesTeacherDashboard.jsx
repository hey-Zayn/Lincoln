import React, { useEffect } from 'react';
import { Filter, Layers2, LayoutGrid, Loader2, Menu, Plus, Users } from 'lucide-react';
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
        <div className="w-full min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-50 p-6 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-black uppercase tracking-tight">Your Courses</h1>
                        <Badge variant="outline" className="rounded-full px-3 font-bold border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900">
                            {userCourses?.length || 0}
                        </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link to="/teacher/courses/create">
                            <Button className="bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 font-bold gap-2">
                                <Plus className="w-4 h-4" />
                                Create New
                            </Button>
                        </Link>
                        <Button variant="outline" size="icon" className="border-zinc-200 dark:border-zinc-800">
                            <Filter className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {userCourses?.length === 0 ? (
                    <Card className="border-dashed border-2 py-20 bg-transparent flex flex-col items-center justify-center text-center">
                        <div className="size-12 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-4">
                            <LayoutGrid className="w-6 h-6 text-zinc-400" />
                        </div>
                        <h3 className="text-lg font-bold">No courses yet</h3>
                        <p className="text-zinc-500 text-sm mb-6 max-w-xs">You haven't created any courses. Start your journey by creating your first course.</p>
                        <Link to="/teacher/courses/create">
                            <Button variant="outline" className="font-bold">Create Course</Button>
                        </Link>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {userCourses.map((course) => (
                            <Card
                                key={course._id}
                                onClick={() => navigate(`/teacher/courses/${course._id}/edit`)}
                                className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-zinc-200 dark:border-zinc-800 dark:bg-[#0c0c0e] overflow-hidden"
                            >
                                <CardContent className="p-0">
                                    <div className="relative">
                                        <div className="w-full h-44 bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
                                            {course.thumbnail ? (
                                                <img
                                                    src={course.thumbnail}
                                                    alt={course.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-zinc-300 dark:text-zinc-700">
                                                    <LayoutGrid className="w-12 h-12" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute top-2 left-2 flex gap-1">
                                            <Badge className="bg-white/90 dark:bg-black/80 text-zinc-900 dark:text-zinc-100 border-none backdrop-blur-sm text-[10px] font-bold">
                                                {course.category}
                                            </Badge>
                                        </div>
                                        <div className="absolute bottom-2 right-2">
                                            <Badge className={`backdrop-blur-sm border-none text-[10px] font-black uppercase ${course.isPublished ? 'bg-green-500/90 text-white' : 'bg-orange-500/90 text-white'}`}>
                                                {course.isPublished ? 'Published' : 'Draft'}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="p-4 space-y-4">
                                        <div className="space-y-1.5">
                                            <h3 className="font-bold text-zinc-900 dark:text-white text-base leading-snug line-clamp-2 min-h-[2.5rem]">
                                                {course.title.slice(0, 20) + '...'}
                                            </h3>
                                            <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400">
                                                <div className="flex items-center gap-1.5">
                                                    <Menu className="w-3.5 h-3.5" />
                                                    <span className="text-[11px] font-bold uppercase tracking-tight">{course.lectures?.length || 0} Lessons</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Users className="w-3.5 h-3.5" />
                                                    <span className="text-[11px] font-bold uppercase tracking-tight">{course.studentsEnrolled?.length || 0} Students</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-1 border-t border-zinc-100 dark:border-zinc-800/50">
                                            <Badge variant="secondary" className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300">
                                                {course.courseLevel}
                                            </Badge>
                                            <span className="text-sm font-black text-zinc-900 dark:text-white">
                                                {course.price === 0 ? 'Free' : `$${course.price}`}
                                            </span>
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
