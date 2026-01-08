import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCourseStore } from '../../../store/useCourseStore';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Users, 
  BookOpen, 
  TrendingUp,
  LayoutGrid,
  List
} from 'lucide-react';

const TeacherDashboard = () => {
  const { userCourses, getAllCoursesByUser, deleteCourse } = useCourseStore();

  useEffect(() => {
    getAllCoursesByUser();
  }, [getAllCoursesByUser]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
      deleteCourse(id);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-slate-900 dark:text-white pt-24 pb-20 px-6 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
          <div>
            <h1 className="text-4xl font-black mb-3 flex items-center gap-4 uppercase italic tracking-tight">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            { label: "Active Cohort", value: "1,284", icon: Users, color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-500/10" },
            { label: "Operative Assets", value: userCourses.length, icon: BookOpen, color: "text-red-600", bg: "bg-red-100 dark:bg-red-500/10" },
            { label: "Revenue Stream", value: "₹45,280", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-500/10" }
          ].map((stat, i) => (
            <div key={i} className="bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-8 rounded-md shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all group">
              <div className="flex items-center gap-5 mb-6">
                <div className={`size-14 rounded-md ${stat.bg} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`size-7 ${stat.color}`} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{stat.label}</span>
              </div>
              <p className="text-4xl font-black italic tracking-tighter text-slate-900 dark:text-white">{stat.value}</p>
            </div>
          ))}
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
                className="pl-12 pr-4 py-3 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 text-[10px] font-black uppercase tracking-widest w-full md:w-80 shadow-inner transition-all"
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
                          to={`/teacher/courses/edit/${course._id}`}
                          className="p-3 bg-slate-100 dark:bg-zinc-800 hover:bg-red-600 hover:text-white text-slate-500 dark:text-slate-400 rounded-md transition-all shadow-sm hover:shadow-xl hover:shadow-red-600/20 active:scale-90"
                          title="Edit Objective"
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
    </div>
  );
};

export default TeacherDashboard;
