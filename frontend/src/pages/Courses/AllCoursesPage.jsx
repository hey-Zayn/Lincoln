import React, { useEffect, useState } from 'react';
import { useCourseStore } from '../../store/useCourseStore';
import CourseCard from '../../components/courses/CourseCard';
import { Search, Loader, BookOpen, Users, Award, Sparkles, Filter } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';

const AllCoursesPage = () => {
  const { courses, getAllCourses, isLoading } = useCourseStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    getAllCourses();
  }, [getAllCourses]);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         course.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "All" || course.category === filter;
    return matchesSearch && matchesFilter;
  });

  const categories = ["All", ...new Set(courses.map(c => c.category))];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-slate-900 dark:text-white pb-20 transition-colors duration-500">
      {/* Cinematic Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none">
          <div className="absolute inset-0 bg-linear-to-b from-red-500/10 via-red-500/5 to-transparent blur-3xl opacity-50 dark:opacity-100" />
          <Motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-[-10%] left-[-10%] size-[500px] bg-red-600/10 rounded-md blur-[120px]" 
          />
          <Motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 10, repeat: Infinity, delay: 1 }}
            className="absolute bottom-0 right-[-5%] size-[400px] bg-red-500/10 rounded-md blur-[100px]" 
          />
        </div>
        
        <div className="max-w-7xl mx-auto relative">
          <Motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-red-100 dark:bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
              <Sparkles className="size-3" />
              Elevate Your Knowledge
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter uppercase italic">
              Future-Proof <br /> 
              <span className="text-transparent bg-clip-text bg-linear-to-r from-red-600 to-red-400">
                Your Career
              </span>
            </h1>
            
            <p className="text-slate-600 dark:text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
              Join thousands of professionals mastering high-demand skills with our expert-led, industry-recognized certification programs.
            </p>
          </Motion.div>

          {/* Stats Grid */}
          <Motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-6 mb-20"
          >
            {[
              { icon: BookOpen, label: "60+ Modules", value: "Curated Content" },
              { icon: Users, label: "15k+ Learners", value: "Global Community" },
              { icon: Award, label: "Verified Certificates", value: "Skill Validation" }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center gap-1 group">
                <div className="flex items-center gap-4 px-8 py-5 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border border-slate-200 dark:border-zinc-800 rounded-md shadow-xl shadow-black/5 group-hover:border-red-500/50 transition-all duration-300 group-hover:-translate-y-1">
                  <div className="size-12 rounded-md bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-600/30">
                    <stat.icon className="size-6" />
                  </div>
                  <div>
                    <div className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white leading-tight">{stat.label}</div>
                    <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-500 tracking-tighter">{stat.value}</div>
                  </div>
                </div>
              </div>
            ))}
          </Motion.div>

          {/* Search & Filter Bar */}
          <Motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="max-w-5xl mx-auto space-y-8"
          >
            <div className="flex flex-col md:flex-row gap-6">
              {/* Search */}
              <div className="flex-1 relative group">
                <div className="absolute -inset-1 bg-linear-to-r from-red-600 to-red-400 rounded-md opacity-0 group-focus-within:opacity-20 transition-opacity blur-lg" />
                <div className="relative flex items-center">
                  <Search className="absolute left-6 size-5 text-slate-400 dark:text-zinc-500 group-focus-within:text-red-600 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search by keyword, role, or category..."
                    className="w-full pl-16 pr-6 py-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md focus:outline-none focus:border-red-500 dark:focus:border-red-500 transition-all text-slate-900 dark:text-white font-medium shadow-sm hover:border-slate-300 dark:hover:border-zinc-700"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Mobile Filter Toggle (Visible on small screens) */}
              <div className="md:hidden flex items-center justify-between px-2">
                 <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest opacity-60">
                    <Filter className="size-4" /> Filter
                 </div>
              </div>
            </div>

            {/* Categories Pills */}
            <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar -mx-6 px-6 md:mx-0 md:px-0">
               <AnimatePresence mode="popLayout">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`relative px-8 py-3.5 rounded-md text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap overflow-hidden group ${
                      filter === cat 
                      ? "text-white" 
                      : "text-slate-500 dark:text-zinc-500 hover:text-red-900 dark:hover:text-zinc-300 bg-slate-50 dark:bg-zinc-900/50 border border-slate-100 dark:border-zinc-800"
                    }`}
                  >
                    {filter === cat && (
                        <Motion.div 
                            layoutId="active-pill"
                            className="absolute inset-0 bg-red-600"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    <span className="relative z-10">{cat}</span>
                  </button>
                ))}
              </AnimatePresence>
            </div>
          </Motion.div>
        </div>
      </section>

      {/* Course Grid Area */}
      <div className="max-w-7xl mx-auto px-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="relative">
                <div className="size-20 border-4 border-red-500/20 border-t-red-500 rounded-md animate-spin" />
                <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-6 text-red-500 animate-pulse" />
            </div>
            <p className="mt-8 text-slate-400 dark:text-zinc-500 font-black uppercase tracking-widest text-[10px]">Assembling Catalog...</p>
          </div>
        ) : (
          <div className="space-y-12">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-black uppercase tracking-tighter italic">
                    Discovery <span className="text-red-600">Results</span> ({filteredCourses.length})
                </h2>
                <div className="h-px flex-1 mx-8 bg-linear-to-r from-slate-100 dark:from-zinc-800 to-transparent" />
            </div>

            {filteredCourses.length > 0 ? (
              <Motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              >
                {filteredCourses.map((course, index) => (
                  <CourseCard key={course._id} course={course} index={index} />
                ))}
              </Motion.div>
            ) : (
              <Motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-32 rounded-md border-2 border-dashed border-slate-100 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-900/20"
              >
                <div className="size-24 bg-white dark:bg-zinc-900 rounded-md flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-black/5 ring-1 ring-slate-100 dark:ring-zinc-800">
                  <Search className="size-10 text-slate-300 dark:text-zinc-700" />
                </div>
                <h3 className="text-2xl font-black uppercase italic mb-3">Void Detected</h3>
                <p className="text-slate-500 dark:text-zinc-500 font-medium max-w-sm mx-auto">
                  Your search parameters yielded no results. Try recalibrating your filters or exploring new categories.
                </p>
                <button 
                    onClick={() => {setSearchTerm(""); setFilter("All")}}
                    className="mt-8 px-8 py-3 bg-red-600 text-white rounded-md text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-colors shadow-xl shadow-red-600/20"
                >
                    Reset Parameters
                </button>
              </Motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};


export default AllCoursesPage;
