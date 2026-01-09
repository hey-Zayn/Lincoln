import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useCourseStore } from '../../../../store/useCourseStore';
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
  Loader,
  Sparkles,
  Info,
  Settings,
  Eye,
  EyeOff,
  Globe
} from 'lucide-react';
import { toast } from 'sonner';

const CreateCoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { createCourse, updateCourse, getCourseById, isCreating, isUpdating, currentCourse, togglePublish } = useCourseStore();

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
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        return toast.error("Image size must be less than 5MB");
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, courseThumbnail: reader.result });
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let result;
    if (id) {
      result = await updateCourse(id, formData);
    } else {
      result = await createCourse(formData);
    }
    
    if (result) {
      toast.success(id ? "Course updated!" : "Course created successfully!");
      // If creating, navigate to edit page to add lectures
      if (!id && result._id) {
          navigate(`/teacher/courses/${result._id}/curriculum`);
      } else {
          navigate('/teacher/dashboard');
      }
    }
  };

  const isPending = isCreating || isUpdating;

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-50 pt-24 pb-20 px-4 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        
        {/* Management Header Tabs */}
        {id && (
          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900/50 p-1.5 rounded-2xl w-fit mb-10 border border-zinc-200 dark:border-zinc-800">
             <button 
                onClick={() => navigate(`/teacher/courses/${id}/edit`)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest bg-white dark:bg-zinc-800 shadow-sm border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
             >
                <Settings className="size-3.5 text-orange-600" />
                Management
             </button>
             <button 
                onClick={() => navigate(`/teacher/courses/${id}/curriculum`)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
             >
                <Layers className="size-3.5" />
                Curriculum
             </button>
          </div>
        )}

        <button 
          onClick={() => navigate('/teacher/dashboard')}
          className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 mb-8 transition-all group font-medium text-sm"
        >
          <ChevronLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main Form Area */}
          <div className="flex-1">
            <div className="mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider mb-4 border border-orange-200 dark:border-orange-900/50">
                    <Sparkles className="size-3" />
                    Course Architect
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight mb-3">
                    {id ? "Optimize" : "Assemble"} Your <span className="text-orange-600 underline decoration-orange-600/30 underline-offset-8">Curriculum</span>
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
                    Set the foundation for your educational asset. High-quality metadata increases enrollment by up to 45%.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Basic Information Section */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="size-8 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center">
                        <Info className="size-4 text-zinc-600 dark:text-zinc-400" />
                    </div>
                    <h2 className="text-lg font-bold">Core Specifications</h2>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Course Identifier (Title)</label>
                        <input 
                            type="text" 
                            name="title"
                            required
                            placeholder="e.g. Master Class: Advanced System Design"
                            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all font-medium"
                            value={formData.title}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Operational Briefing (Description)</label>
                        <textarea 
                            name="description"
                            required
                            rows="6"
                            placeholder="Provide a comprehensive breakdown of the course objectives and learning outcomes..."
                            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all resize-none font-medium leading-relaxed"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>
                </div>
              </div>

              {/* Categorization & Metadata */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <Layers className="size-4 text-zinc-400" />
                            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500">Classification</h3>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase">Sector</label>
                                <select 
                                    name="category"
                                    required
                                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-orange-600 transition-all font-bold text-sm"
                                    value={formData.category}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Category</option>
                                    <option value="Web Development">Software Engineering</option>
                                    <option value="Mobile Development">Mobile Systems</option>
                                    <option value="Data Science">Artificial Intelligence</option>
                                    <option value="Design">Digital Arts</option>
                                    <option value="Marketing">Business Operations</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase">Proficiency Tier</label>
                                <div className="flex gap-2 p-1 bg-zinc-100 dark:bg-zinc-950 rounded-xl">
                                    {["Beginner", "Medium", "Advance"].map((lvl) => (
                                        <button
                                            key={lvl}
                                            type="button"
                                            onClick={() => setFormData({...formData, courseLevel: lvl})}
                                            className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                                formData.courseLevel === lvl 
                                                ? "bg-white dark:bg-zinc-800 text-orange-600 shadow-sm border border-zinc-200 dark:border-zinc-700" 
                                                : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                                            }`}
                                        >
                                            {lvl}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <IndianRupee className="size-4 text-zinc-400" />
                            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500">Valuation</h3>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase">Monetization (INR)</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-zinc-400 group-focus-within:text-orange-600 transition-colors">₹</div>
                                    <input 
                                        type="number" 
                                        name="coursePrice"
                                        placeholder="0"
                                        className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all font-bold text-lg"
                                        value={formData.coursePrice}
                                        onChange={handleChange}
                                    />
                                </div>
                                <p className="text-[10px] text-zinc-400 italic">Leave empty or 0 for community redistribution.</p>
                            </div>
                        </div>
                    </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex items-center gap-4 pt-4">
                  <button 
                    type="submit"
                    disabled={isPending}
                    className="flex-1 py-4 bg-orange-600 hover:bg-orange-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-800 text-white font-bold uppercase tracking-widest rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-orange-600/20 active:scale-[0.98]"
                  >
                    {isPending ? <Loader className="animate-spin size-5" /> : <Save className="size-5" />}
                    {id ? "Commit Updates" : "Initialize Objective"}
                  </button>
              </div>
            </form>
          </div>

          {/* Side Panel: Media & Assets */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm sticky top-28">
                <div className="flex items-center gap-2 mb-6 uppercase tracking-tighter font-black text-xs text-zinc-400">
                    <Layout className="size-3" />
                    Visual Branding
                </div>

                <div className="space-y-6">
                    <div 
                        className="relative group cursor-pointer"
                        onClick={() => document.getElementById('thumbnail-input').click()}
                    >
                        <div className={`aspect-4/3 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all overflow-hidden bg-zinc-50 dark:bg-zinc-950 ${preview ? 'border-zinc-200 dark:border-zinc-800' : 'border-zinc-200 dark:border-zinc-800 hover:border-orange-500/50'}`}>
                            {preview ? (
                                <img src={preview} alt="Thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                                <>
                                    <div className="size-12 bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:text-orange-600 transition-colors">
                                        <Upload className="size-6" />
                                    </div>
                                    <p className="text-[10px] font-bold text-zinc-500 uppercase">Upload Cover</p>
                                </>
                            )}
                            
                            {preview && (
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <p className="text-white text-xs font-bold uppercase tracking-widest">Change Image</p>
                                </div>
                            )}
                        </div>
                        <input 
                            id="thumbnail-input"
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleThumbnailChange}
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-xl border border-orange-100 dark:border-orange-900/30">
                            <h4 className="text-xs font-bold text-orange-800 dark:text-orange-400 mb-1 flex items-center gap-1">
                                <Sparkles className="size-3" />
                                Pro Tip
                            </h4>
                            <p className="text-[10px] text-orange-700/80 dark:text-orange-400/80 leading-relaxed font-medium">
                                Use a 16:9 high-contrast image (1280x720) with minimal text for maximum visibility in the explore feed.
                            </p>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                             <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className={`size-2 rounded-full ${currentCourse?.isPublished ? 'bg-green-500 animate-pulse' : 'bg-zinc-400'}`} />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Course Status</span>
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${currentCourse?.isPublished ? 'text-green-600' : 'text-zinc-500'}`}>
                                    {currentCourse?.isPublished ? 'Live' : 'Draft'}
                                </span>
                             </div>

                             <button 
                                onClick={(e) => { e.preventDefault(); togglePublish(id, !currentCourse?.isPublished); }}
                                className={`w-full h-12 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
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

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-zinc-500">
                                <div className="size-1.5 rounded-full bg-green-500" />
                                <span className="text-[10px] font-bold uppercase tracking-tight">System Status: Ready</span>
                            </div>
                            <div className="flex items-center gap-2 text-zinc-500">
                                <div className="size-1.5 rounded-full bg-zinc-400" />
                                <span className="text-[10px] font-bold uppercase tracking-tight">Auto-Save: Active</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCoursePage;
