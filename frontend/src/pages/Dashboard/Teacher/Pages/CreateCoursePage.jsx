import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCourseStore } from '../../../../store/useCourseStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  Loader2,
  Plus,
  Trash2,
  Upload,
  CheckCircle2,
  BookOpen,
  IndianRupee,
  Video,
  Image as ImageIcon,
  Save,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';

const CreateCoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCourseById, createCourse, updateCourse, isLoading, isCreating, isUpdating } = useCourseStore();

  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: '',
    courseLevel: 'Beginner',
    CourseLanguage: 'English',
    price: 0,
    thumbnail: '',
    previewVideo: '',
    learningOutcomes: [''],
    requirements: [''],
  });

  const categories = [
    "Web Development", "Mobile Development", "Data Science",
    "Machine Learning", "Design", "Business", "Marketing", "Other"
  ];

  useEffect(() => {
    if (id) {
      const fetchCourse = async () => {
        const data = await getCourseById(id);
        if (data) {
          setCourseData({
            title: data.title || '',
            description: data.description || '',
            category: data.category || '',
            courseLevel: data.courseLevel || 'Beginner',
            CourseLanguage: data.CourseLanguage || 'English',
            price: data.price || 0,
            thumbnail: data.thumbnail || '',
            previewVideo: data.previewVideo || '',
            learningOutcomes: data.learningOutcomes?.length > 0 ? data.learningOutcomes : [''],
            requirements: data.requirements?.length > 0 ? data.requirements : [''],
          });
        }
      };
      fetchCourse();
    }
  }, [id, getCourseById]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (index, value, field) => {
    const newArray = [...courseData[field]];
    newArray[index] = value;
    setCourseData(prev => ({ ...prev, [field]: newArray }));
  };

  const addArrayItem = (field) => {
    setCourseData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayItem = (index, field) => {
    if (courseData[field].length <= 1) return;
    const newArray = courseData[field].filter((_, i) => i !== index);
    setCourseData(prev => ({ ...prev, [field]: newArray }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCourseData(prev => ({ ...prev, [field]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!courseData.title || !courseData.description || !courseData.category) {
      return toast.error("Please fill in all required fields");
    }

    try {
      if (id) {
        await updateCourse(id, courseData);
        toast.success("Course updated successfully");
      } else {
        const newCourse = await createCourse(courseData);
        if (newCourse?._id) {
          toast.success("Course details saved!");
          // Navigate to curriculum stage
          navigate(`/teacher/courses/${newCourse._id}/curriculum`);
        }
      }
    } catch (error) {
      console.error("Course Save Error:", error);
      toast.error("Failed to save course");
    }
  };

  // If we are in edit mode and loading, show spinner
  if (id && isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <Button
            variant="ghost"
            onClick={() => navigate('/teacher/courses')}
            className="-ml-3 gap-2 opacity-70 hover:opacity-100"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-black uppercase tracking-tight italic">
            {id ? 'Edit Course Details' : 'Create New Course'}
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            Stage 1: Define your course information and settings
          </p>
        </div>

        {id && (
          <Button
            variant="outline"
            className="gap-2 font-bold uppercase tracking-wider text-xs border-zinc-800"
            onClick={() => navigate(`/teacher/courses/${id}/curriculum`)}
          >
            Go to Curriculum
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm">
            <CardHeader className="border-b border-slate-100 dark:border-zinc-800/50 bg-slate-50/50 dark:bg-zinc-950/30">
              <CardTitle className="text-lg font-bold uppercase italic flex items-center gap-2 text-slate-900 dark:text-white">
                <BookOpen className="h-5 w-5 text-red-600" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="font-bold uppercase text-[11px] tracking-widest text-muted-foreground">Course Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={courseData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Master React with Advanced Patterns"
                  className="font-bold text-lg bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="font-bold uppercase text-[11px] tracking-widest text-muted-foreground">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={courseData.description}
                  onChange={handleInputChange}
                  placeholder="Tell your students what this course is about..."
                  rows={6}
                  className="resize-none leading-relaxed bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category" className="font-bold uppercase text-[11px] tracking-widest text-muted-foreground">Category</Label>
                  <Select
                    value={courseData.category}
                    onValueChange={(val) => setCourseData(prev => ({ ...prev, category: val }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="courseLevel" className="font-bold uppercase text-[11px] tracking-widest text-muted-foreground">Level</Label>
                  <Select
                    value={courseData.courseLevel}
                    onValueChange={(val) => setCourseData(prev => ({ ...prev, courseLevel: val }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="CourseLanguage" className="font-bold uppercase text-[11px] tracking-widest text-muted-foreground">Language</Label>
                  <Input
                    id="CourseLanguage"
                    name="CourseLanguage"
                    value={courseData.CourseLanguage}
                    onChange={handleInputChange}
                    placeholder="English"
                    className="bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price" className="font-bold uppercase text-[11px] tracking-widest text-muted-foreground">Price (INR)</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={courseData.price}
                      onChange={handleInputChange}
                      className="pl-9 font-black bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Outcomes & Requirements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-slate-200 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm">
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-zinc-800/50 bg-slate-50/50 dark:bg-zinc-950/30 mb-4">
                <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 text-slate-900 dark:text-white">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  What they'll learn
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {courseData.learningOutcomes.map((outcome, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      value={outcome}
                      onChange={(e) => handleArrayChange(idx, e.target.value, 'learningOutcomes')}
                      placeholder="e.g., Build 5 real-world projects"
                      className="text-sm h-9"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeArrayItem(idx, 'learningOutcomes')}
                      className="h-9 w-9 shrink-0 text-muted-foreground hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem('learningOutcomes')}
                  className="w-full mt-2 border-dashed gap-2 text-xs font-bold uppercase py-4"
                >
                  <Plus className="h-3 w-3" /> Add Outcome
                </Button>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm">
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-zinc-800/50 bg-slate-50/50 dark:bg-zinc-950/30 mb-4">
                <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 text-slate-900 dark:text-white">
                  <Plus className="h-4 w-4 text-blue-500" />
                  Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {courseData.requirements.map((req, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      value={req}
                      onChange={(e) => handleArrayChange(idx, e.target.value, 'requirements')}
                      placeholder="e.g., Basic JavaScript knowledge"
                      className="text-sm h-9"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeArrayItem(idx, 'requirements')}
                      className="h-9 w-9 shrink-0 text-muted-foreground hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem('requirements')}
                  className="w-full mt-2 border-dashed gap-2 text-xs font-bold uppercase py-4"
                >
                  <Plus className="h-3 w-3" /> Add Requirement
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar: Media & Publish */}
        <div className="space-y-6">
          <Card className="border-slate-200 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50 dark:bg-zinc-950 border-b border-slate-100 dark:border-zinc-800">
              <CardTitle className="text-sm font-bold uppercase italic tracking-widest flex items-center gap-2 text-slate-900 dark:text-white">
                <ImageIcon className="h-4 w-4 text-red-600" />
                Thumbnail
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="aspect-video w-full bg-slate-100 dark:bg-zinc-950 rounded-sm border-2 border-dashed border-slate-200 dark:border-zinc-800 flex flex-col items-center justify-center overflow-hidden relative group transition-colors">
                {courseData.thumbnail ? (
                  <>
                    <img src={courseData.thumbnail} alt="Thumbnail preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Label htmlFor="thumbnail" className="cursor-pointer bg-white text-black px-4 py-2 rounded-md font-bold text-xs uppercase shadow-xl">
                        Change Image
                      </Label>
                    </div>
                  </>
                ) : (
                  <Label htmlFor="thumbnail" className="flex flex-col items-center gap-2 cursor-pointer p-4 text-center">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Upload Thumbnail</span>
                  </Label>
                )}
                <Input
                  id="thumbnail"
                  type="file"
                  onChange={(e) => handleFileChange(e, 'thumbnail')}
                  className="hidden"
                  accept="image/*"
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-4 text-center font-medium">
                Standard ratio: 16:9 • Suggested size: 1280x720
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50 dark:bg-zinc-950 border-b border-slate-100 dark:border-zinc-800">
              <CardTitle className="text-sm font-bold uppercase italic tracking-widest flex items-center gap-2 text-slate-900 dark:text-white">
                <Video className="h-4 w-4 text-blue-600" />
                Preview Video
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="aspect-video w-full bg-slate-100 dark:bg-zinc-950 rounded-sm border-2 border-dashed border-slate-200 dark:border-zinc-800 flex flex-col items-center justify-center overflow-hidden relative group transition-colors">
                {courseData.previewVideo ? (
                  <div className="w-full h-full relative">
                    <video src={courseData.previewVideo} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Label htmlFor="previewVideo" className="cursor-pointer bg-white text-black px-4 py-2 rounded-md font-bold text-xs uppercase shadow-xl">
                        Replace Video
                      </Label>
                    </div>
                  </div>
                ) : (
                  <Label htmlFor="previewVideo" className="flex flex-col items-center gap-2 cursor-pointer p-4 text-center">
                    <Video className="h-8 w-8 text-muted-foreground" />
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Upload Promo Video</span>
                  </Label>
                )}
                <Input
                  id="previewVideo"
                  type="file"
                  onChange={(e) => handleFileChange(e, 'previewVideo')}
                  className="hidden"
                  accept="video/*"
                />
              </div>
            </CardContent>
          </Card>

          <div className="sticky top-8 space-y-4">
            <Button
              type="submit"
              className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest italic shadow-xl shadow-red-600/20 gap-3"
              disabled={isCreating || isUpdating}
            >
              {(isCreating || isUpdating) ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Save className="h-5 w-5" />
              )}
              {id ? 'Update Course' : 'Create Course'}
            </Button>

            <p className="text-[10px] text-center text-muted-foreground font-black uppercase tracking-widest">
              By submitting, you agree to our Instructor Terms of Service.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateCoursePage;