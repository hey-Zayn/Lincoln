import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCourseStore } from '../../../store/useCourseStore';
import { 
  ChevronLeft, 
  Upload, 
  X, 
  Save, 
  BookOpen, 
  Layout, 
  IndianRupee,
  Layers,
  FileText,
  Loader
} from 'lucide-react';

const CreateCoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { createCourse, updateCourse, getCourseById, isCreating, isUpdating } = useCourseStore();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    courseLevel: "Beginner",
    coursePrice: "",
    courseThumbnail: ""
  });

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (id) {
      getCourseById(id).then(course => {
        if (course) {
          setFormData({
            title: course.title,
            description: course.description,
            category: course.category,
            courseLevel: course.courseLevel,
            coursePrice: course.coursePrice,
            courseThumbnail: course.courseThumbnail
          });
          setPreview(course.courseThumbnail);
        }
      });
    }
  }, [id, getCourseById]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleThumbnailChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, courseThumbnail: value });
    setPreview(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let success;
    if (id) {
      success = await updateCourse(id, formData);
    } else {
      success = await createCourse(formData);
    }
    
    if (success) {
      navigate('/teacher/dashboard');
    }
  };

  const isPending = isCreating || isUpdating;

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-slate-900 dark:text-white pt-24 pb-20 px-6 transition-colors duration-500">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 text-slate-400 hover:text-red-600 mb-10 transition-all group uppercase text-[10px] font-black tracking-widest"
        >
          <ChevronLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
          Abort To Dashboard
        </button>

        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-md overflow-hidden shadow-2xl shadow-black/5">
          <div className="p-10 md:p-14 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50">
            <h1 className="text-4xl font-black mb-3 uppercase italic tracking-tight">
              {id ? "Modify" : "Initialize"} <span className="text-red-600">Course</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Define the technical parameters and curriculum architecture for your next instructional objective.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-10 md:p-14 space-y-12">
            {/* Basic Info */}
            <section className="space-y-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="size-10 bg-red-100 dark:bg-red-600/10 rounded-md flex items-center justify-center shadow-inner">
                  <BookOpen className="size-5 text-red-600" />
                </div>
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Tactical Specifications</h2>
              </div>
              
              <div className="grid grid-cols-1 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Asset Identity (Title)</label>
                  <input 
                    type="text" 
                    name="title"
                    required
                    placeholder="e.g. ADVANCED NEURAL ARCHITECTURES"
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all font-medium"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Operational Briefing (Description)</label>
                  <textarea 
                    name="description"
                    required
                    rows="5"
                    placeholder="Articulate the core value proposition and learning outcomes..."
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all resize-none font-medium leading-relaxed"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </section>

            {/* Categorization & Metadata */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="size-10 bg-blue-100 dark:bg-blue-500/10 rounded-md flex items-center justify-center shadow-inner">
                    <Layers className="size-5 text-blue-600" />
                  </div>
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Classification</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Sector (Category)</label>
                    <div className="relative">
                      <select 
                        name="category"
                        required
                        className="w-full px-6 py-4 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-md focus:outline-none focus:border-red-600 transition-all appearance-none font-bold text-xs uppercase tracking-widest cursor-pointer"
                        value={formData.category}
                        onChange={handleChange}
                      >
                        <option value="">Select Sector</option>
                        <option value="Web Development">Frontend/Backend</option>
                        <option value="Mobile Development">Mobile Systems</option>
                        <option value="Data Science">Data Intelligence</option>
                        <option value="Design">Visual Design</option>
                        <option value="Marketing">Growth Ops</option>
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                         <Layers className="size-4" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Difficulty Tier</label>
                    <div className="flex gap-2">
                      {["Beginner", "Medium", "Advance"].map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setFormData({...formData, courseLevel: lvl})}
                          className={`flex-1 py-3 rounded-md border-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                            formData.courseLevel === lvl 
                            ? "bg-red-600 text-white border-red-600 shadow-lg shadow-red-600/20" 
                            : "bg-slate-50 dark:bg-zinc-950 text-slate-400 border-slate-100 dark:border-zinc-800 hover:border-red-600/30"
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="size-10 bg-emerald-100 dark:bg-emerald-500/10 rounded-md flex items-center justify-center shadow-inner">
                    <IndianRupee className="size-5 text-emerald-600" />
                  </div>
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Valuation</h2>
                </div>
                
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Asset Value (INR)</label>
                  <div className="relative group">
                    <IndianRupee className="absolute left-6 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                    <input 
                      type="number" 
                      name="coursePrice"
                      placeholder="0"
                      className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all font-black italic text-lg"
                      value={formData.coursePrice}
                      onChange={handleChange}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 ml-1 font-bold italic uppercase tracking-tighter">Enter 0 for community redistribution.</p>
                </div>
              </div>
            </section>

            {/* Media */}
            <section className="space-y-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="size-10 bg-purple-100 dark:bg-purple-500/10 rounded-md flex items-center justify-center shadow-inner">
                  <Layout className="size-5 text-purple-600" />
                </div>
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Visual Identification</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Thumbnail Source URL</label>
                    <input 
                      type="text" 
                      name="courseThumbnail"
                      placeholder="https://source.unsplash.com/..."
                      className="w-full px-6 py-4 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-md focus:outline-none focus:border-red-600 transition-all mb-4 font-medium"
                      value={formData.courseThumbnail}
                      onChange={handleThumbnailChange}
                    />
                    <div className="p-6 bg-slate-50 dark:bg-zinc-950/50 border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-md flex items-center gap-6">
                      <div className="size-12 bg-white dark:bg-zinc-900 rounded-md flex items-center justify-center shadow-sm">
                        <Upload className="size-6 text-slate-400" />
                      </div>
                      <div className="text-[10px] uppercase font-black tracking-widest text-slate-500">
                        <p className="text-red-600 mb-1">Direct Upload Restricted</p>
                        <p className="opacity-60">Use authenticated CDN links only.</p>
                      </div>
                    </div>
                 </div>

                 <div className="relative aspect-video rounded-md border border-slate-200 dark:border-zinc-800 overflow-hidden bg-slate-50 dark:bg-zinc-950 flex flex-col items-center justify-center group shadow-inner">
                    {preview ? (
                      <img src={preview} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <div className="text-center group-hover:scale-110 transition-transform">
                        <Upload className="size-12 text-slate-300 dark:text-zinc-800 mb-4 mx-auto" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Imaging Feed Offline</p>
                      </div>
                    )}
                 </div>
              </div>
            </section>

            {/* Submit */}
            <div className="pt-12 border-t border-slate-100 dark:border-zinc-800">
              <button 
                type="submit"
                disabled={isPending}
                className="w-full py-6 bg-red-600 hover:bg-red-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-black uppercase tracking-[0.3em] rounded-md flex items-center justify-center gap-4 transition-all shadow-2xl shadow-red-600/20 active:scale-[0.98] ring-offset-2 ring-red-600/20 focus:ring-4"
              >
                {isPending ? <Loader className="animate-spin size-6" /> : <Save className="size-6" />}
                {id ? "Override Course Data" : "Deploy Tactical Objective"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCoursePage;
