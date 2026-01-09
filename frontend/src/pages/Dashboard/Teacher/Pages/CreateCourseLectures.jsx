import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCourseStore } from '../../../../store/useCourseStore';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { 
  ChevronLeft, 
  Save, 
  BookOpen, 
  Loader,
  Plus,
  Eye,
  EyeOff,
  Trash2,
  Edit,
  PlayCircle,
  GripVertical,
  Settings,
  MoreVertical,
  PlusCircle,
  ChevronRight,
  FileVideo,
  ExternalLink,
  Lock,
  Globe,
  Layers,
  Layout
} from 'lucide-react';
import { toast } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';
import axiosInstance from '../../../../axios/axiosInstance';

const CreateCourseLectures = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    getCourseById, 
    currentCourse, 
    isLoading, 
    togglePublish,
    addSection,
    updateSection,
    deleteSection,
    createLecture 
  } = useCourseStore();

  const [activeSection, setActiveSection] = useState(null);
  const [showLectureModal, setShowLectureModal] = useState(false);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [sectionForm, setSectionForm] = useState({ sectionTitle: "" });
  const [lectureForm, setLectureForm] = useState({
    title: "",
    description: "",
    videoUrl: "",
    isPreviewFree: false
  });

  useEffect(() => {
    if (id) {
      getCourseById(id);
    }
  }, [id, getCourseById]);

  const handleTogglePublish = async () => {
    if (!currentCourse) return;
    await togglePublish(id, !currentCourse.isPublished);
  };

  const handleSectionSubmit = async (e) => {
    e.preventDefault();
    let success;
    if (editingSection) {
      success = await updateSection(id, editingSection._id, sectionForm.sectionTitle);
    } else {
      success = await addSection(id, sectionForm.sectionTitle);
    }
    if (success) {
      setShowSectionModal(false);
      setEditingSection(null);
      setSectionForm({ sectionTitle: "" });
    }
  };

  const openLectureModal = (lecture = null, sectionId = null) => {
    setActiveSection(sectionId);
    if (lecture) {
      setCurrentLecture(lecture);
      setLectureForm({
        title: lecture.title,
        description: lecture.description || "",
        videoUrl: lecture.videoUrl || "",
        isPreviewFree: lecture.isPreviewFree || false
      });
    } else {
      setCurrentLecture(null);
      setLectureForm({
        title: "",
        description: "",
        videoUrl: "",
        isPreviewFree: false
      });
    }
    setShowLectureModal(true);
  };

  const handleLectureSubmit = async (e) => {
    e.preventDefault();
    if (currentLecture) {
        // Edit logic (via store or direct)
        try {
            await axiosInstance.put(`/courses/lecture/update/${currentLecture._id}`, lectureForm);
            toast.success("Lecture updated");
            getCourseById(id);
        } catch (err) {
            console.error(err);
            toast.error("Failed to update lecture");
        }
    } else {
        const payload = { ...lectureForm, sectionId: activeSection };
        const lecture = await createLecture(id, payload);
        if (lecture) {
            getCourseById(id);
        }
    }
    setShowLectureModal(false);
  };

  const handleDeleteLecture = async (lectureId) => {
      if (!window.confirm("Delete this lecture permanently?")) return;
      try {
          await axiosInstance.delete(`/courses/lecture/delete/${lectureId}`);
          toast.success("Lecture deleted");
          getCourseById(id);
      } catch (err) {
          console.error(err);
          toast.error("Deletion failed");
      }
  };

  if (isLoading || !currentCourse) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <Loader className="size-8 animate-spin text-orange-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-50 pt-24 pb-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Management Header Tabs */}
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900/50 p-1.5 rounded-2xl w-fit mb-10 border border-zinc-200 dark:border-zinc-800">
             <button 
                onClick={() => navigate(`/teacher/courses/${id}/edit`)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
             >
                <Settings className="size-3.5" />
                Management
             </button>
             <button 
                onClick={() => navigate(`/teacher/courses/${id}/curriculum`)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest bg-white dark:bg-zinc-800 shadow-sm border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
             >
                <Layers className="size-3.5 text-orange-600" />
                Curriculum
             </button>
        </div>

        {/* Header Action Bar */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <button 
                onClick={() => navigate('/teacher/dashboard')}
                className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 mb-4 transition-all group font-medium text-sm"
            >
                <ChevronLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
            </button>
            <div className="flex items-center gap-3">
               <h1 className="text-3xl font-extrabold tracking-tight">Curriculum <span className="text-zinc-400 font-medium">Builder</span></h1>
               <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${currentCourse?.isPublished ? 'bg-green-100 dark:bg-green-950/30 text-green-600 border border-green-200 dark:border-green-900/50' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700'}`}>
                {currentCourse?.isPublished ? 'Live' : 'Draft'}
               </div>
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">Design the learning path by organizing modules and assets.</p>
          </div>

          <div className="flex items-center gap-3">
             <Button
                variant="outline"
                className="h-11 px-6 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 font-bold uppercase tracking-widest text-[10px]"
                onClick={() => window.open(`/courses/${id}`, '_blank')}
             >
                <ExternalLink className="size-4 mr-2" />
                Preview
             </Button>
             <Button
                variant={currentCourse?.isPublished ? "destructive" : "default"}
                className={`h-11 px-8 font-bold uppercase tracking-widest text-[10px] shadow-lg ${!currentCourse?.isPublished ? 'bg-orange-600 hover:bg-orange-700 shadow-orange-600/20' : ''}`}
                onClick={handleTogglePublish}
             >
                {currentCourse?.isPublished ? (
                    <><EyeOff className="size-4 mr-2" /> Unpublish</>
                ) : (
                    <><Globe className="size-4 mr-2" /> Publish Course</>
                )}
             </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">
          
          {/* Left Column: Stats & Meta */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6 font-black text-[10px] uppercase tracking-tighter text-zinc-400">
                    <Layout className="size-3" />
                    Structure Metrics
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between items-end border-b border-zinc-50 dark:border-zinc-800 pb-3">
                        <span className="text-sm font-medium text-zinc-500">Modules</span>
                        <span className="text-xl font-bold tracking-tight">{currentCourse?.sections?.length || 0}</span>
                    </div>
                    <div className="flex justify-between items-end border-b border-zinc-50 dark:border-zinc-800 pb-3">
                        <span className="text-sm font-medium text-zinc-500">Lectures</span>
                        <span className="text-xl font-bold tracking-tight">
                            {(currentCourse?.sections || []).reduce((acc, sec) => acc + (sec.lectures?.length || 0), 0)}
                        </span>
                    </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-zinc-50 dark:border-zinc-800 mt-4">
                     <button 
                        onClick={() => {
                            if (currentCourse?.sections?.length === 0) {
                                addSection(id, "Course Introduction").then(() => {
                                    getCourseById(id);
                                    toast.info("Created initial module for you");
                                });
                            } else {
                                openLectureModal(null, currentCourse.sections[0]._id);
                            }
                        }}
                        className="w-full h-12 bg-orange-600/10 hover:bg-orange-600/20 text-orange-600 dark:text-orange-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                     >
                        <PlusCircle className="size-4" />
                        Quick Add Lecture
                     </button>

                     <button 
                        onClick={handleTogglePublish}
                        className={`w-full h-12 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hide-on-mobile flex items-center justify-center gap-2 ${
                            currentCourse?.isPublished 
                            ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 hover:bg-zinc-200 dark:hover:bg-zinc-700" 
                            : "bg-orange-600 text-white shadow-lg shadow-orange-600/20 hover:bg-orange-700"
                        }`}
                     >
                        {currentCourse?.isPublished ? (
                            <><EyeOff className="size-4" /> Unpublish</>
                        ) : (
                            <><Globe className="size-4" /> Publish Now</>
                        )}
                     </button>
                </div>
            </div>

            <Button 
                onClick={() => { setEditingSection(null); setSectionForm({ sectionTitle: "" }); setShowSectionModal(true); }}
                className="w-full h-14 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 font-bold uppercase tracking-widest text-[10px] rounded-2xl"
            >
                <PlusCircle className="size-5 mr-3 text-orange-500" />
                Add New Module
            </Button>
          </aside>

          {/* Right Column: Curriculum List */}
          <main className="lg:col-span-3 space-y-6">
             <AnimatePresence mode="popLayout">
                {currentCourse?.sections?.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-zinc-900 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl py-24 flex flex-col items-center justify-center text-center"
                    >
                        <div className="size-16 bg-zinc-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6">
                            <BookOpen className="size-8 text-zinc-300" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Initialize Your Curriculum</h3>
                        <p className="text-zinc-500 max-w-sm">Create your first module (section) to start adding instructional content.</p>
                        <Button 
                            variant="link" 
                            className="mt-4 text-orange-600 font-bold uppercase tracking-widest text-[10px]"
                            onClick={() => setShowSectionModal(true)}
                        >
                            Start Building Now
                        </Button>
                    </motion.div>
                ) : (
                    currentCourse.sections.map((section, sIndex) => (
                        <motion.div 
                            key={section._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm shadow-black/5"
                        >
                            {/* Section Header */}
                            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/30 dark:bg-zinc-800/20">
                                <div className="flex items-center gap-4">
                                    <div className="size-10 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl flex items-center justify-center font-bold text-zinc-400">
                                       {String(sIndex + 1).padStart(2, '0')}
                                    </div>
                                    <div>
                                        <h3 className="font-extrabold text-lg tracking-tight uppercase">{section.sectionTitle}</h3>
                                        <p className="text-xs text-zinc-500 font-medium">{section.lectures?.length || 0} Lectures Managed</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button size="icon" variant="ghost" className="rounded-lg h-9 w-9 text-zinc-400 hover:text-orange-600 transition-colors" onClick={() => { setEditingSection(section); setSectionForm({ sectionTitle: section.sectionTitle }); setShowSectionModal(true); }}>
                                        <Edit className="size-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="rounded-lg h-9 w-9 text-zinc-400 hover:text-red-600 transition-colors" onClick={() => deleteSection(id, section._id)}>
                                        <Trash2 className="size-4" />
                                    </Button>
                                    <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 mx-2" />
                                    <Button 
                                        onClick={() => openLectureModal(null, section._id)}
                                        className="bg-orange-600/10 hover:bg-orange-600/20 text-orange-600 dark:text-orange-400 border-none h-9 px-4 rounded-xl font-bold uppercase tracking-widest text-[9px]"
                                    >
                                        <Plus className="size-3 mr-2" />
                                        Add Lecture
                                    </Button>
                                </div>
                            </div>

                            {/* Lectures List */}
                            <div className="p-6">
                                {section.lectures?.length === 0 ? (
                                    <div className="py-10 text-center">
                                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">No Lessons Available</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {section.lectures.map((lecture) => (
                                            <div 
                                                key={lecture._id}
                                                className="group flex items-center justify-between p-4 bg-zinc-50/50 dark:bg-zinc-950/30 border border-zinc-100 dark:border-zinc-800 rounded-xl hover:border-orange-500/30 transition-all"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="cursor-grab active:cursor-grabbing text-zinc-300 dark:text-zinc-700">
                                                        <GripVertical className="size-4" />
                                                    </div>
                                                    <div className="size-8 rounded-lg bg-orange-600 text-white flex items-center justify-center">
                                                        <FileVideo className="size-4" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-bold tracking-tight">{lecture.title}</h4>
                                                        <div className="flex items-center gap-3 mt-1">
                                                            {lecture.isPreviewFree ? (
                                                                <span className="flex items-center gap-1 text-[9px] font-black uppercase text-green-500"><Globe className="size-2.5" /> Free Access</span>
                                                            ) : (
                                                                <span className="flex items-center gap-1 text-[9px] font-black uppercase text-zinc-400"><Lock className="size-2.5" /> Locked</span>
                                                            )}
                                                            <span className="text-[9px] text-zinc-400 font-bold uppercase">Public ID: {lecture.publicId || 'N/A'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg" onClick={() => openLectureModal(lecture, section._id)}>
                                                        <Edit className="size-3.5" />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10" onClick={() => handleDeleteLecture(lecture._id)}>
                                                        <Trash2 className="size-3.5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))
                )}
             </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Section Modal */}
      {showSectionModal && (
          <div className="fixed inset-0 bg-[#09090b]/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 w-full max-w-md overflow-hidden"
              >
                  <div className="p-8 pb-4">
                      <h2 className="text-2xl font-extrabold tracking-tight">{editingSection ? "Optimize Module" : "Assemble Module"}</h2>
                      <p className="text-zinc-500 text-sm mt-1">Define a logical organizational unit for your curriculum.</p>
                  </div>
                  <form onSubmit={handleSectionSubmit} className="p-8 pt-4 space-y-6">
                      <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase text-zinc-400">Section Identity</Label>
                          <Input 
                            autoFocus
                            placeholder="e.g. Fundamental Concepts"
                            className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
                            value={sectionForm.sectionTitle}
                            onChange={(e) => setSectionForm({ sectionTitle: e.target.value })}
                            required
                          />
                      </div>
                      <div className="flex gap-3">
                          <Button variant="outline" type="button" onClick={() => setShowSectionModal(false)} className="flex-1 h-12 rounded-xl font-bold uppercase tracking-widest text-[10px]">Cancel</Button>
                          <Button type="submit" className="flex-1 h-12 rounded-xl bg-orange-600 hover:bg-orange-700 font-bold uppercase tracking-widest text-[10px] text-white">
                            {editingSection ? "Update Module" : "Create Module"}
                          </Button>
                      </div>
                  </form>
              </motion.div>
          </div>
      )}

      {/* Lecture Modal */}
      {showLectureModal && (
        <div className="fixed inset-0 bg-[#09090b]/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 w-full max-w-xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="p-8 pb-4 border-b border-zinc-100 dark:border-zinc-800">
               <div className="flex items-center gap-3">
                  <div className="size-10 bg-orange-600 text-white rounded-xl flex items-center justify-center">
                    <FileVideo className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold tracking-tight">{currentLecture ? "Edit Knowledge Asset" : "Deploy Asset"}</h2>
                    <p className="text-zinc-500 text-xs mt-0.5 uppercase font-bold tracking-widest">Configuration Interface</p>
                  </div>
               </div>
            </div>
            
            <form onSubmit={handleLectureSubmit} className="p-8 space-y-6 overflow-y-auto">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-zinc-400">Asset Title</Label>
                <Input
                  required
                  placeholder="e.g. Advanced State Persistence Patterns"
                  className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
                  value={lectureForm.title}
                  onChange={(e) => setLectureForm({...lectureForm, title: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-zinc-400">Knowledge Description</Label>
                <textarea
                  rows="3"
                  placeholder="A brief summary of what students will achieve in this lesson..."
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all text-sm resize-none"
                  value={lectureForm.description}
                  onChange={(e) => setLectureForm({...lectureForm, description: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-zinc-400">Stream Source (Video URL)</Label>
                <div className="relative">
                   <Input
                    type="url"
                    placeholder="https://cloud.cdn.com/assets/video-241"
                    className="h-12 pl-10 rounded-xl bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
                    value={lectureForm.videoUrl}
                    onChange={(e) => setLectureForm({...lectureForm, videoUrl: e.target.value})}
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                    <Globe className="size-4" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                     <div className={`p-2 rounded-lg ${lectureForm.isPreviewFree ? 'bg-green-100 text-green-600' : 'bg-zinc-200 text-zinc-500'}`}>
                        {lectureForm.isPreviewFree ? <Globe className="size-4" /> : <Lock className="size-4" />}
                     </div>
                     <div>
                        <p className="text-sm font-bold">Public Accessibility</p>
                        <p className="text-[10px] text-zinc-500 font-medium">Visible to non-enrolled students</p>
                     </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={lectureForm.isPreviewFree}
                    onChange={(e) => setLectureForm({...lectureForm, isPreviewFree: e.target.checked})}
                    className="size-5 rounded-lg border-zinc-300 text-orange-600 focus:ring-orange-600"
                  />
              </div>

              <div className="flex gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowLectureModal(false)}
                  className="flex-1 h-12 rounded-xl font-bold uppercase tracking-widest text-[10px]"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 h-12 rounded-xl bg-orange-600 hover:bg-orange-700 font-bold uppercase tracking-widest text-[10px] text-white shadow-lg shadow-orange-600/20">
                  {currentLecture ? "Push Changes" : "Deploy Asset"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CreateCourseLectures;
