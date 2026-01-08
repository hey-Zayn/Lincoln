import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourseStore } from '../../store/useCourseStore';
import { 
  Loader, 
  Menu, 
  X, 
  Play, 
  CheckCircle2, 
  Lock, 
  ChevronLeft,
  FileText,
  MessageSquare,
  HelpCircle
} from 'lucide-react';

const LecturesPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCourseById, currentCourse, isLoading } = useCourseStore();
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    getCourseById(id).then(course => {
      if (course && course.lectures?.length > 0) {
        setSelectedLecture(course.lectures[0]);
      }
    });
  }, [id, getCourseById]);

  if (isLoading || !currentCourse) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
        <Loader className="size-12 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white dark:bg-zinc-950 text-slate-900 dark:text-white pt-16 overflow-hidden transition-colors duration-500">
      {/* Sidebar Overlay for Mobile */}
      {!isSidebarOpen && (
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden absolute bottom-8 right-8 z-50 size-14 bg-red-600 rounded-md flex items-center justify-center shadow-2xl shadow-red-600/20 active:scale-95 transition-transform"
        >
          <Menu className="size-6 text-white" />
        </button>
      )}

      {/* Sidebar */}
      <div className={`
        ${isSidebarOpen ? 'w-full lg:w-96' : 'w-0'} 
        fixed lg:relative z-40 h-full bg-slate-50 dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 transition-all duration-300 overflow-hidden
      `}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black uppercase italic tracking-tight flex items-center gap-3">
              <button 
                onClick={() => navigate(`/course/${id}`)}
                className="p-2 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-md transition-colors"
              >
                <ChevronLeft className="size-5" />
              </button>
              Modules
            </h2>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-md text-slate-500">
              <X className="size-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {currentCourse.lectures?.map((lecture, i) => (
              <button
                key={lecture._id}
                onClick={() => {
                  setSelectedLecture(lecture);
                  if (window.innerWidth < 1024) setIsSidebarOpen(false);
                }}
                className={`w-full text-left p-4 rounded-md border-2 transition-all flex items-center gap-4 group ${
                  selectedLecture?._id === lecture._id
                  ? 'bg-red-600/5 border-red-600 text-red-600 shadow-lg shadow-red-600/5'
                  : 'bg-white dark:bg-zinc-900/50 border-slate-100 dark:border-zinc-800 text-slate-600 dark:text-slate-400 hover:border-red-600/30'
                }`}
              >
                <div className={`size-10 rounded-md flex items-center justify-center font-black italic text-sm shrink-0 shadow-inner transition-colors ${
                  selectedLecture?._id === lecture._id ? 'bg-red-600 text-white' : 'bg-slate-100 dark:bg-zinc-800 text-slate-400'
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-xs uppercase italic truncate mb-1">{lecture.title}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">12:45 min</span>
                    <span className="text-[10px] opacity-20">•</span>
                    {lecture.isPreviewFree && (
                      <span className="text-[10px] uppercase font-black text-emerald-600 tracking-wider">Unlocked</span>
                    )}
                  </div>
                </div>
                <Play className={`size-4 transition-all ${selectedLecture?._id === lecture._id ? 'opacity-100 scale-110' : 'opacity-0 group-hover:opacity-40'}`} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto bg-white dark:bg-zinc-950">
        <div className="max-w-5xl mx-auto w-full p-6 lg:p-12">
          {selectedLecture ? (
            <>
              {/* Video Player Mockup/Real */}
              <div className="aspect-video w-full bg-slate-900 rounded-md overflow-hidden mb-12 shadow-2xl border border-slate-200 dark:border-zinc-800 relative group ring-1 ring-slate-100 dark:ring-zinc-800">
                {selectedLecture.videoUrl ? (
                  <video 
                    src={selectedLecture.videoUrl} 
                    controls 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                    <div className="size-24 bg-zinc-900 rounded-md flex items-center justify-center mb-6 border border-zinc-800 shadow-inner">
                      <Play className="size-10 text-red-600 fill-red-600 animate-pulse" />
                    </div>
                    <p className="font-black uppercase italic tracking-widest text-xs">Signal Lost</p>
                    <p className="text-[10px] mt-2 font-medium text-slate-600 uppercase tracking-widest">Awaiting feed from instructor</p>
                  </div>
                )}
                
                <div className="absolute top-8 left-8 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                  <div className="px-4 py-2 bg-black/80 backdrop-blur-xl rounded-md text-[10px] font-black uppercase tracking-[0.2em] text-red-600 border border-red-600/30 shadow-2xl">
                    Live Session • Module {currentCourse.lectures.indexOf(selectedLecture) + 1}
                  </div>
                </div>
              </div>

              {/* Lecture Details */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="md:col-span-3">
                  <h1 className="text-4xl font-black uppercase italic tracking-tight mb-6 text-slate-900 dark:text-white">{selectedLecture.title}</h1>
                  <div className="flex flex-wrap items-center gap-6 mb-10">
                    <button className="flex items-center gap-3 px-4 py-2 bg-slate-100 dark:bg-zinc-800 hover:bg-red-600/10 rounded-md transition-colors group">
                      <div className="size-8 rounded-md bg-white dark:bg-zinc-900 flex items-center justify-center text-red-600 shadow-sm">
                        <FileText className="size-4" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 group-hover:text-red-600">Assets (2)</span>
                    </button>
                    <button className="flex items-center gap-3 px-4 py-2 bg-slate-100 dark:bg-zinc-800 hover:bg-emerald-600/10 rounded-md transition-colors group">
                      <div className="size-8 rounded-md bg-white dark:bg-zinc-900 flex items-center justify-center text-emerald-600 shadow-sm">
                        <CheckCircle2 className="size-4" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 group-hover:text-emerald-600">Complete</span>
                    </button>
                  </div>

                  <div className="space-y-6">
                     <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Briefing:</h3>
                     <div className="text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-zinc-900/50 p-8 rounded-md border border-slate-100 dark:border-zinc-800 font-medium italic">
                       {selectedLecture.description || "In this module, we dissect the strategic frameworks defined in the catalog. You will gain tactical insight through practical implementation and peer-reviewed collaboration."}
                     </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <button className="w-full p-5 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-md flex items-center gap-4 hover:border-red-600/50 transition-all text-left shadow-sm hover:shadow-xl hover:shadow-red-600/5 group">
                    <div className="size-10 rounded-md bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
                        <MessageSquare className="size-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-slate-200">Terminal</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Open Comm-Link</p>
                    </div>
                  </button>
                  <button className="w-full p-5 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-md flex items-center gap-4 hover:border-red-600/50 transition-all text-left shadow-sm hover:shadow-xl hover:shadow-red-600/5 group">
                    <div className="size-10 rounded-md bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center shrink-0">
                        <HelpCircle className="size-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-slate-200">Support</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Signal Ops</p>
                    </div>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="h-[500px] flex flex-col items-center justify-center text-slate-400 italic bg-slate-50 dark:bg-zinc-900/30 rounded-md border-2 border-dashed border-slate-200 dark:border-zinc-800 p-12 text-center">
               <div className="size-20 bg-white dark:bg-zinc-900 rounded-md flex items-center justify-center mb-8 shadow-2xl shadow-black/5 ring-1 ring-slate-100 dark:ring-zinc-800">
                    <Lock className="size-10 opacity-20" />
               </div>
               <h3 className="text-2xl font-black uppercase italic mb-4">Awaiting Selection</h3>
               <p className="max-w-sm text-sm font-medium">Please initiate a module from the roster to begin your educational advancement.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LecturesPage;