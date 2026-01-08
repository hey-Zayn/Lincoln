import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourseStore } from '../../store/useCourseStore';
import { useAuthStore } from '../../store/useAuthStore';
import { 
  CheckCircle2, 
  PlayCircle, 
  Clock, 
  Globe, 
  Award, 
  IndianRupee, 
  Loader, 
  ChevronRight,
  ShieldCheck,
  Calendar,
  Users
} from 'lucide-react';

const SingleCoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCourseById, currentCourse, isLoading, enrollInCourse, isEnrolling } = useCourseStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    window.scrollTo(0, 0);
    getCourseById(id);
  }, [id, getCourseById]);

  const isEnrolled = currentCourse && authUser && currentCourse.studentsEnrolled?.includes(authUser._id);

  const handleEnroll = async () => {
    if (!authUser) return navigate('/login');
    const success = await enrollInCourse(id);
    if (success) {
      // Redirect to lectures after successful enrolment
      setTimeout(() => navigate(`/course/${id}/lectures`), 1500);
    }
  };

  if (isLoading || !currentCourse) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
        <Loader className="size-12 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-slate-900 dark:text-white pb-20 transition-colors duration-500">
      {/* Hero Header */}
      <div className="relative bg-slate-50 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="px-3 py-1 bg-red-600/10 text-red-600 text-xs font-bold rounded-md border border-red-600/20 uppercase tracking-wider">
                {currentCourse.category}
              </span>
              <span className="text-slate-400 px-2">•</span>
              <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">{currentCourse.courseLevel} Level</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight tracking-tight uppercase italic text-slate-900 dark:text-white">
              {currentCourse.title}
            </h1>
            
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 leading-relaxed max-w-xl font-medium">
              {currentCourse.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 dark:text-slate-300 font-bold uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <Users className="size-5 text-red-600" />
                <span>{currentCourse.studentsEnrolled?.length || 0} Students</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="size-5 text-red-600" />
                <span>Updated Recently</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="size-5 text-red-600" />
                <span>English</span>
              </div>
            </div>
          </div>

          <div className="lg:justify-self-end">
            <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md overflow-hidden shadow-2xl shadow-red-600/5 sticky top-32">
              <div className="aspect-video relative overflow-hidden group">
                <img 
                   src={currentCourse.courseThumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60"} 
                  alt={currentCourse.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <PlayCircle className="size-16 text-white" />
                </div>
              </div>

              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center text-3xl font-black text-slate-900 dark:text-white italic">
                    <IndianRupee className="size-6 mr-1" />
                    <span>{currentCourse.coursePrice || "Free"}</span>
                  </div>
                  {currentCourse.coursePrice > 0 && (
                    <span className="text-slate-400 line-through text-lg">₹{Math.round(currentCourse.coursePrice * 1.5)}</span>
                  )}
                </div>

                {isEnrolled ? (
                  <button 
                    onClick={() => navigate(`/course/${id}/lectures`)}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest rounded-md flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                  >
                    Go to Dashboard <ChevronRight className="size-5" />
                  </button>
                ) : (
                  <button 
                    onClick={handleEnroll}
                    disabled={isEnrolling}
                    className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-black uppercase tracking-widest rounded-md flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-600/20 active:scale-95"
                  >
                    {isEnrolling ? <Loader className="animate-spin size-5" /> : "Enroll Now"} 
                    {!isEnrolling && <ShieldCheck className="size-5" />}
                  </button>
                )}

                <p className="text-center text-[10px] text-slate-400 mt-6 font-black uppercase tracking-widest">
                  30-Day Money-Back Guarantee • Lifetime Access
                </p>

                <div className="mt-10 space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Course Payload:</h4>
                  {[
                    { icon: PlayCircle, text: `${currentCourse.lectures?.length || 0} Lectures` },
                    { icon: Clock, text: "Full lifetime access" },
                    { icon: Globe, text: "Access on mobile and TV" },
                    { icon: Award, text: "Certificate of completion" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-slate-600 dark:text-slate-300 font-bold group">
                      <div className="size-8 rounded-md bg-slate-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-red-600/10 transition-colors">
                        <item.icon className="size-4 text-red-600" />
                      </div>
                      <span className="text-xs uppercase tracking-wider">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-16">
            {/* What you'll learn */}
            <section className="bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 p-10 rounded-md">
              <h2 className="text-2xl font-black uppercase italic mb-10 text-slate-900 dark:text-white">Knowledge Acquisition</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  "Comprehensive understanding of the subject",
                  "Industry-standard best practices and tools",
                  "Hands-on projects to build your portfolio",
                  "Direct mentorship and Q&A support",
                  "Certificate recognized by top companies",
                  "Exclusive community access for life"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 group">
                    <div className="size-5 rounded-md bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="size-3.5 text-emerald-600" />
                    </div>
                    <span className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Curriculum */}
            <section>
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-black uppercase italic text-slate-900 dark:text-white tracking-tight">Curriculum Breakdown</h2>
                <div className="px-4 py-1.5 bg-slate-100 dark:bg-zinc-800 rounded-md text-[10px] font-black uppercase tracking-widest text-slate-500 shadow-sm border border-slate-200 dark:border-zinc-700">
                    {currentCourse.lectures?.length || 0} Modules
                </div>
              </div>
              <div className="space-y-4">
                {currentCourse.lectures?.length > 0 ? currentCourse.lectures.map((lecture, i) => (
                  <div 
                    key={lecture._id}
                    className="flex items-center justify-between p-5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md group hover:border-red-600/50 transition-all cursor-pointer shadow-sm hover:shadow-xl hover:shadow-red-600/5"
                  >
                    <div className="flex items-center gap-6">
                      <div className="size-12 bg-slate-100 dark:bg-zinc-800 rounded-md flex items-center justify-center text-slate-400 font-black italic text-lg group-hover:bg-red-600/10 group-hover:text-red-600 transition-colors shadow-inner">
                        {i + 1}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 dark:text-slate-200 group-hover:text-red-600 transition-colors uppercase italic">{lecture.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 font-medium">{lecture.description?.substring(0, 80)}...</p>
                      </div>
                    </div>
                    {lecture.isPreviewFree && (
                      <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-md border border-emerald-600/20 shadow-sm">Preview</span>
                    )}
                  </div>
                )) : (
                  <div className="text-center py-20 px-10 bg-slate-50 dark:bg-zinc-900/30 rounded-md border-2 border-dashed border-slate-200 dark:border-zinc-800">
                      <div className="size-16 bg-white dark:bg-zinc-900 rounded-md flex items-center justify-center mx-auto mb-6 shadow-lg shadow-black/5 ring-1 ring-slate-100 dark:ring-zinc-800">
                          <Clock className="size-8 text-slate-300 dark:text-zinc-700" />
                      </div>
                      <h3 className="text-lg font-black uppercase italic mb-2">Curriculum Pending</h3>
                      <p className="text-slate-500 dark:text-zinc-500 text-sm font-medium max-w-sm mx-auto">The instructional structure is currently being updated for the highest educational standards.</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          <div>
             {/* Secondary Sidebar Content if needed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleCoursePage;