import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, User, IndianRupee, ArrowRight, Play } from 'lucide-react';
import { motion as Motion } from 'framer-motion';

const CourseCard = ({ course, index }) => {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md overflow-hidden hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-16/10 overflow-hidden">
        <img
          src={course.courseThumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60"}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
             <div className="size-12 bg-red-600 rounded-md flex items-center justify-center text-white transform scale-0 group-hover:scale-100 transition-transform duration-500 delay-100 shadow-xl shadow-red-600/40">
                <Play className="size-5 fill-current ml-1" />
             </div>
        </div>

        <div className="absolute top-4 left-4">
          <span className="px-3 py-1.5 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md text-red-600 dark:text-red-500 text-[10px] font-black uppercase tracking-wider rounded-md border border-red-500/20 shadow-sm">
            {course.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-4">
          <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
            course.courseLevel === 'Beginner' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
            course.courseLevel === 'Medium' ? 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400' :
            'bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'
          }`}>
            {course.courseLevel}
          </span>
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-zinc-400 text-[11px] font-medium italic">
            <BookOpen className="size-3.5 text-red-600" />
            {course.lectures?.length || 0} Modules
          </div>
        </div>

        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3 line-clamp-2 leading-tight group-hover:text-red-600 transition-colors uppercase italic">
          {course.title}
        </h3>
        
        <p className="text-slate-600 dark:text-zinc-400 text-sm line-clamp-2 mb-6 leading-relaxed font-medium">
          {course.description}
        </p>

        <div className="mt-auto">
          <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-zinc-800/50">
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-md bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-500 dark:text-zinc-400 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300 shadow-inner">
                <User className="size-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase font-black tracking-widest leading-none mb-1">Mentor</span>
                <span className="text-xs text-slate-900 dark:text-zinc-200 font-bold">Industry Expert</span>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
                <span className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase font-black tracking-widest leading-none mb-1">Tuition</span>
                <div className="flex items-center text-red-600 font-black text-lg italic">
                    <IndianRupee className="size-4 -mt-0.5" />
                    <span>{course.coursePrice || "Free"}</span>
                </div>
            </div>
          </div>

          <Link 
            to={`/course/${course._id}`}
            className="mt-6 w-full flex items-center justify-center gap-2 py-3.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-[0.2em] rounded-md transition-all duration-300 shadow-xl shadow-red-600/20 group/btn"
          >
            Explore Course
            <ArrowRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-2" />
          </Link>
        </div>
      </div>
    </Motion.div>
  );
};


export default CourseCard;

