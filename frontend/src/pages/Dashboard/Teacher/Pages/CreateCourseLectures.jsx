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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  ChevronLeft,
  Loader2,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  FileVideo,
  Lock,
  Globe,
  MoreVertical,
  ExternalLink,
  Upload,
  CheckCircle2,
  XCircle,
  FolderPlus,
  Video,
  FileText,
  HelpCircle,
  Download,
} from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from 'sonner';
import axiosInstance from '../../../../axios/axiosInstance';

const CourseLecturesPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCourseById, currentCourse, isLoading, togglePublish, getMaterials, uploadMaterial, getQuizzes, createQuiz, deleteMaterial, deleteQuiz } = useCourseStore();

  const [sections, setSections] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [activeTab, setActiveTab] = useState("curriculum");

  const [editingSection, setEditingSection] = useState(null);
  const [editingLecture, setEditingLecture] = useState(null);
  const [showSectionDialog, setShowSectionDialog] = useState(false);
  const [showLectureDialog, setShowLectureDialog] = useState(false);
  const [showMaterialDialog, setShowMaterialDialog] = useState(false);
  const [showQuizDialog, setShowQuizDialog] = useState(false);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [sectionForm, setSectionForm] = useState({
    title: '',
  });

  const [lectureForm, setLectureForm] = useState({
    title: '',
    description: '',
    videoFile: null,
    videoUrl: '',
    isPreviewFree: false,
    sectionId: '',
  });

  const [materialForm, setMaterialForm] = useState({
    title: '',
    type: 'document',
    file: null,
    lectureId: '',
    sectionId: ''
  });

  const [quizForm, setQuizForm] = useState({
    title: '',
    sectionId: '',
    passingScore: 70,
    questions: [
      { question: '', options: ['', '', '', ''], correctIndex: 0 }
    ]
  });

  useEffect(() => {
    if (id) {
      getCourseById(id);
    }
  }, [id, getCourseById]);

  useEffect(() => {
    // Load content when course is loaded
    if (currentCourse?._id) {
      fetchSections();
      fetchMaterials();
      fetchQuizzes();
    }
  }, [currentCourse]);

  const fetchSections = async () => {
    try {
      const response = await axiosInstance.get(`/sections/course/${id}`);
      setSections(response.data.sections || []);
    } catch (error) {
      console.error('Failed to fetch sections:', error);
      setSections([]);
    }
  };

  const fetchMaterials = async () => {
    try {
      const mats = await getMaterials(id);
      setMaterials(mats);
    } catch (error) {
      console.error('Failed to fetch materials:', error);
    }
  };

  const fetchQuizzes = async () => {
    try {
      const qzs = await getQuizzes(id);
      setQuizzes(qzs);
    } catch (error) {
      console.error('Failed to fetch quizzes:', error);
    }
  };

  const handleTogglePublish = async () => {
    if (!currentCourse) return;
    try {
      await togglePublish(id, !currentCourse.isPublished);
      toast.success(`Course ${currentCourse.isPublished ? 'unpublished' : 'published'} successfully`);
    } catch (error) {
      toast.error('Failed to update course status');
    }
  };

  const handleSectionSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSection) {
        await axiosInstance.put(`/sections/${editingSection._id}`, {
          sectionTitle: sectionForm.title,
        });
        toast.success('Section updated successfully');
      } else {
        await axiosInstance.post('/sections', {
          courseId: id,
          sectionTitle: sectionForm.title,
        });
        toast.success('Section created successfully');
      }

      setShowSectionDialog(false);
      setEditingSection(null);
      setSectionForm({ title: '' });
      fetchSections();
    } catch (error) {
      toast.error('Failed to save section');
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (!window.confirm('Are you sure you want to delete this section? All lectures in this section will also be deleted.')) {
      return;
    }

    try {
      await axiosInstance.delete(`/sections/${sectionId}`);
      toast.success('Section deleted successfully');
      fetchSections();
    } catch (error) {
      toast.error('Failed to delete section');
    }
  };

  const handleVideoUpload = async (file) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append('video', file);

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const response = await axiosInstance.post('/lectures/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      setIsUploading(false);
      setUploadProgress(100);
      return response.data.videoUrl;
    } catch (error) {
      setIsUploading(false);
      toast.error('Failed to upload video');
      return null;
    }
  };

  const handleLectureSubmit = async (e) => {
    e.preventDefault();

    try {
      let videoUrl = lectureForm.videoUrl;

      // Upload video file if provided
      if (lectureForm.videoFile) {
        videoUrl = await handleVideoUpload(lectureForm.videoFile);
        if (!videoUrl) return;
      }

      if (editingLecture) {
        // Update existing lecture
        await axiosInstance.put(`/lectures/${editingLecture._id}`, {
          title: lectureForm.title,
          description: lectureForm.description,
          videoUrl: videoUrl,
          isPreviewFree: lectureForm.isPreviewFree,
        });
        toast.success('Lecture updated successfully');
      } else {
        // Create new lecture
        await axiosInstance.post('/lectures', {
          title: lectureForm.title,
          description: lectureForm.description,
          videoUrl: videoUrl,
          isPreviewFree: lectureForm.isPreviewFree,
          sectionId: lectureForm.sectionId,
        });
        toast.success('Lecture created successfully');
      }

      setShowLectureDialog(false);
      setEditingLecture(null);
      setLectureForm({
        title: '',
        description: '',
        videoFile: null,
        videoUrl: '',
        isPreviewFree: false,
      });
      fetchSections();
    } catch (error) {
      toast.error('Failed to save lecture');
    }
  };

  const handleDeleteLecture = async (lectureId) => {
    if (!window.confirm('Are you sure you want to delete this lecture?')) {
      return;
    }

    try {
      await axiosInstance.delete(`/lectures/${lectureId}`);
      toast.success('Lecture deleted successfully');
      fetchSections();
    } catch (error) {
      toast.error('Failed to delete lecture');
    }
  };

  const openSectionDialog = (section = null) => {
    setEditingSection(section);
    setSectionForm({
      title: section?.sectionTitle || '',
    });
    setShowSectionDialog(true);
  };

  const openLectureDialog = (lecture = null, sectionId = null) => {
    setEditingLecture(lecture);
    setLectureForm({
      title: lecture?.title || '',
      description: lecture?.description || '',
      videoFile: null,
      videoUrl: lecture?.videoUrl || '',
      isPreviewFree: lecture?.isPreviewFree || false,
      sectionId: sectionId || lecture?.sectionId || '',
    });
    setShowLectureDialog(true);
  };

  const handleMaterialSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('title', materialForm.title);
      formData.append('type', materialForm.type);
      if (materialForm.file) formData.append('file', materialForm.file);
      if (materialForm.lectureId) formData.append('lectureId', materialForm.lectureId);
      if (materialForm.sectionId) formData.append('sectionId', materialForm.sectionId);

      await uploadMaterial(id, formData);
      setShowMaterialDialog(false);
      setMaterialForm({ title: '', type: 'document', file: null, lectureId: '', sectionId: '' });
      fetchMaterials();
    } catch (error) {
      toast.error('Failed to upload material');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMaterial = async (matId) => {
    if (!window.confirm('Delete this resource?')) return;
    try {
      await deleteMaterial(id, matId);
      fetchMaterials();
    } catch (err) {
      toast.error('Failed to delete material');
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm('Delete this quiz?')) return;
    try {
      await deleteQuiz(id, quizId);
      fetchQuizzes();
    } catch (err) {
      toast.error('Failed to delete quiz');
    }
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await createQuiz(id, quizForm);
      setShowQuizDialog(false);
      setQuizForm({ title: '', sectionId: '', passingScore: 70, questions: [{ question: '', options: ['', '', '', ''], correctIndex: 0 }] });
      fetchQuizzes();
      fetchSections(); // Refresh sections to show linked quizzes
    } catch (error) {
      toast.error('Failed to create quiz');
    } finally {
      setIsSaving(false);
    }
  };

  const addQuizQuestion = () => {
    setQuizForm({
      ...quizForm,
      questions: [...quizForm.questions, { question: '', options: ['', '', '', ''], correctIndex: 0 }]
    });
  };

  const removeQuizQuestion = (index) => {
    setQuizForm({
      ...quizForm,
      questions: quizForm.questions.filter((_, i) => i !== index)
    });
  };

  const updateQuizQuestion = (index, field, value) => {
    const newQuestions = [...quizForm.questions];
    newQuestions[index][field] = value;
    setQuizForm({ ...quizForm, questions: newQuestions });
  };

  const updateQuizOption = (qIndex, oIndex, value) => {
    const newQuestions = [...quizForm.questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuizForm({ ...quizForm, questions: newQuestions });
  };

  if (isLoading || !currentCourse) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const totalLectures = Array.isArray(sections) ? sections.reduce((total, section) =>
    total + (section.lectures?.length || 0), 0
  ) : 0;

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/teacher/courses')}
            className="gap-2 px-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Courses
          </Button>
          <div className="h-4 w-px bg-border mx-1" />
          <Button
            variant="ghost"
            onClick={() => navigate(`/teacher/courses/${id}/edit`)}
            className="gap-2 px-2 text-muted-foreground hover:text-foreground"
          >
            Course Details
          </Button>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold tracking-tight">Course Curriculum</h1>
              <Badge variant={currentCourse.isPublished ? "default" : "secondary"}>
                {currentCourse.isPublished ? 'Published' : 'Draft'}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {currentCourse.title} • {totalLectures} lectures • {sections.length} sections
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => window.open(`/courses/${id}`, '_blank')}
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            <Button
              onClick={handleTogglePublish}
              variant={currentCourse.isPublished ? "destructive" : "default"}
              className="gap-2"
            >
              {currentCourse.isPublished ? (
                <>
                  <EyeOff className="h-4 w-4" />
                  Unpublish
                </>
              ) : (
                <>
                  <Globe className="h-4 w-4" />
                  Publish
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black text-slate-400 uppercase tracking-widest italic">
              Sections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black italic text-slate-900 dark:text-white">{sections.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black text-slate-400 uppercase tracking-widest italic">
              Total Lectures
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black italic text-slate-900 dark:text-white">{totalLectures}</div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black text-slate-400 uppercase tracking-widest italic">
              Free Previews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black italic text-slate-900 dark:text-white">
              {Array.isArray(sections) ? sections.reduce((total, section) =>
                total + (section.lectures?.filter(l => l.isPreviewFree)?.length || 0), 0
              ) : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-8 p-1 bg-slate-100/50 dark:bg-zinc-950/50 border border-slate-200 dark:border-zinc-800 h-12 rounded-sm">
          <TabsTrigger value="curriculum" className="gap-2 px-8 font-black uppercase tracking-widest italic text-[10px] data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-red-600 transition-all rounded-sm">
            <Video className="h-4 w-4" />
            Curriculum
          </TabsTrigger>
          <TabsTrigger value="resources" className="gap-2 px-8 font-black uppercase tracking-widest italic text-[10px] data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-red-600 transition-all rounded-sm">
            <FileText className="h-4 w-4" />
            Resources
          </TabsTrigger>
          <TabsTrigger value="quizzes" className="gap-2 px-8 font-black uppercase tracking-widest italic text-[10px] data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-red-600 transition-all rounded-sm">
            <HelpCircle className="h-4 w-4" />
            Quizzes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="curriculum">
          <div className="flex gap-4 mb-6">
            <Dialog open={showSectionDialog} onOpenChange={setShowSectionDialog}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest italic rounded-sm shadow-xl shadow-red-600/20">
                  <FolderPlus className="h-4 w-4" />
                  Add Section
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-sm">
                <DialogHeader>
                  <DialogTitle className="text-xl font-black italic uppercase tracking-tight text-slate-900 dark:text-white">
                    {editingSection ? 'Modify Section' : 'Initiate Section'}
                  </DialogTitle>
                  <DialogDescription>
                    Sections help organize your course content into logical groups.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSectionSubmit}>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Section Title</Label>
                      <Input
                        id="title"
                        value={sectionForm.title}
                        onChange={(e) => setSectionForm({ title: e.target.value })}
                        placeholder="e.g., Introduction to React"
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowSectionDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingSection ? 'Update Section' : 'Create Section'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={showLectureDialog} onOpenChange={setShowLectureDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 border-slate-200 dark:border-zinc-800 font-black uppercase tracking-widest italic rounded-sm hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all">
                  <Video className="h-4 w-4" />
                  Add Lecture
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-sm">
                <DialogHeader>
                  <DialogTitle className="text-xl font-black italic uppercase tracking-tight text-slate-900 dark:text-white">
                    {editingSection ? 'Refine Objective' : 'Deploy Objective'}
                  </DialogTitle>
                  <DialogDescription>
                    Add a video lecture to your course. You can upload a video file or provide a video URL.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleLectureSubmit}>
                  <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                    <div className="space-y-2">
                      <Label htmlFor="lecture-title" className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Lecture Title</Label>
                      <Input
                        id="lecture-title"
                        value={lectureForm.title}
                        onChange={(e) => setLectureForm({ ...lectureForm, title: e.target.value })}
                        placeholder="e.g., Introduction to Components"
                        required
                        className="h-12 bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 font-bold"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lecture-description">Description (Optional)</Label>
                      <Textarea
                        id="lecture-description"
                        value={lectureForm.description}
                        onChange={(e) => setLectureForm({ ...lectureForm, description: e.target.value })}
                        placeholder="Brief description of what students will learn in this lecture..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Section</Label>
                      <Select
                        value={lectureForm.sectionId}
                        onValueChange={(val) => setLectureForm({ ...lectureForm, sectionId: val })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a section" />
                        </SelectTrigger>
                        <SelectContent>
                          {sections.map(s => (
                            <SelectItem key={s._id} value={s._id}>{s.sectionTitle}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4">
                      <Label>Video Content</Label>

                      {/* File Upload */}
                      <div className="space-y-2">
                        <Label htmlFor="video-upload" className="text-sm font-medium">
                          Upload Video File
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id="video-upload"
                            type="file"
                            accept="video/*"
                            onChange={(e) => setLectureForm({
                              ...lectureForm,
                              videoFile: e.target.files[0],
                              videoUrl: ''
                            })}
                            className="cursor-pointer"
                          />
                        </div>
                        {lectureForm.videoFile && (
                          <div className="text-sm text-muted-foreground">
                            Selected: {lectureForm.videoFile.name}
                          </div>
                        )}
                      </div>

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">OR</span>
                        </div>
                      </div>

                      {/* Video URL */}
                      <div className="space-y-2">
                        <Label htmlFor="video-url" className="text-sm font-medium">
                          Video URL
                        </Label>
                        <Input
                          id="video-url"
                          type="url"
                          value={lectureForm.videoUrl}
                          onChange={(e) => setLectureForm({
                            ...lectureForm,
                            videoUrl: e.target.value,
                            videoFile: null
                          })}
                          placeholder="https://example.com/video.mp4"
                        />
                      </div>

                      {/* Upload Progress */}
                      {isUploading && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Uploading...</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <Progress value={uploadProgress} className="h-2" />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-0.5">
                        <Label htmlFor="preview-access" className="text-base">
                          Free Preview
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Allow non-enrolled students to view this lecture
                        </p>
                      </div>
                      <Switch
                        id="preview-access"
                        checked={lectureForm.isPreviewFree}
                        onCheckedChange={(checked) => setLectureForm({ ...lectureForm, isPreviewFree: checked })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowLectureDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isUploading}>
                      {isUploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : editingLecture ? (
                        'Update Lecture'
                      ) : (
                        'Create Lecture'
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Sections List */}
          {sections.length === 0 ? (
            <Card className="text-center py-24 bg-slate-50/50 dark:bg-zinc-950/30 border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-sm">
              <CardContent>
                <div className="size-20 bg-slate-100 dark:bg-zinc-900 rounded-sm flex items-center justify-center mx-auto mb-8 shadow-inner ring-1 ring-slate-200 dark:ring-zinc-800">
                  <FileVideo className="h-10 w-10 text-slate-300 dark:text-zinc-700 opacity-50" />
                </div>
                <h3 className="text-xl font-black italic uppercase tracking-tight text-slate-900 dark:text-white mb-2">Curriculum Depleted</h3>
                <p className="text-muted-foreground mb-8 text-xs font-bold uppercase tracking-widest max-w-sm mx-auto leading-relaxed">
                  Initiate your first section to organize tactical course objectives.
                </p>
                <Button
                  onClick={() => setShowSectionDialog(true)}
                  className="bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest italic rounded-sm shadow-xl shadow-red-600/20 px-8 h-12"
                >
                  <FolderPlus className="mr-3 h-4 w-4" />
                  Initiate First Section
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {sections.map((section, sectionIndex) => (
                <Card key={section._id} className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden group/section">
                  <CardHeader className="bg-slate-50/50 dark:bg-black/20 border-b border-slate-100 dark:border-zinc-800/50 py-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-4 text-slate-900 dark:text-white">
                          <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em] bg-red-600/5 px-3 py-1 border border-red-600/10 rounded-sm">
                            Module {sectionIndex + 1}
                          </span>
                          <span className="font-black italic uppercase tracking-tight">{section.sectionTitle}</span>
                          <Badge variant="outline" className="rounded-sm border-slate-200 dark:border-zinc-800 text-[10px] font-black uppercase tracking-widest italic opacity-50">
                            {section.lectures?.length || 0} OBJECTIVES
                          </Badge>
                        </CardTitle>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openSectionDialog(section)}
                          className="size-10 rounded-sm hover:bg-red-600 hover:text-white transition-all"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteSection(section._id)}
                          className="size-10 rounded-sm hover:bg-rose-600 hover:text-white transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 bg-white dark:bg-zinc-900">
                    {!section.lectures || section.lectures.length === 0 ? (
                      <div className="text-center py-12 text-slate-400 border-2 border-dashed border-slate-100 dark:border-zinc-800/50 m-6 rounded-sm bg-slate-50/30 dark:bg-black/10">
                        <Video className="h-8 w-8 mx-auto mb-3 opacity-20" />
                        <p className="text-[10px] font-black uppercase tracking-widest italic">Zero Objectives Deployed</p>
                      </div>
                    ) : (
                      <div className="space-y-0 divide-y divide-slate-100 dark:divide-zinc-800/50">
                        {section.lectures.map((lecture) => (
                          <div
                            key={lecture._id}
                            className="flex items-center justify-between p-6 hover:bg-slate-50/50 dark:hover:bg-zinc-800/20 transition-all group/lecture"
                          >
                            <div className="flex items-center gap-4">
                              <div className="size-10 bg-slate-100 dark:bg-zinc-950 rounded-sm flex items-center justify-center border border-slate-200 dark:border-zinc-800 shadow-sm group-hover/lecture:border-red-600/30 transition-colors">
                                <Video className="h-4 w-4 text-slate-400 group-hover/lecture:text-red-600 transition-colors" />
                              </div>
                              <div>
                                <h4 className="font-black italic uppercase tracking-tight text-slate-900 dark:text-white group-hover/lecture:text-red-600 transition-colors">
                                  {lecture.title}
                                </h4>
                                <div className="flex items-center gap-3 mt-1">
                                  {lecture.isPreviewFree && (
                                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[8px] font-black uppercase tracking-widest rounded-none px-2">
                                      Public Access
                                    </Badge>
                                  )}
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    {lecture.videoUrl ? 'Video Stream' : 'Resource Node'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover/lecture:opacity-100 transition-all">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openLectureDialog(lecture, section._id)}
                                className="size-9 rounded-sm hover:bg-blue-600 hover:text-white transition-all"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteLecture(section._id, lecture._id)}
                                className="size-9 rounded-sm hover:bg-rose-600 hover:text-white transition-all"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Linked Quiz in Curriculum */}
                    {section.quiz && (
                      <div className="p-6 border-t border-slate-100 dark:border-zinc-800/50 bg-amber-50/30 dark:bg-amber-950/10">
                        <div className="flex items-center justify-between p-4 bg-white dark:bg-zinc-950 border border-amber-200 dark:border-amber-900/30 rounded-sm shadow-sm ring-1 ring-amber-500/10">
                          <div className="flex items-center gap-3">
                            <div className="size-10 bg-amber-100 dark:bg-amber-900/30 rounded-sm flex items-center justify-center border border-amber-200 dark:border-amber-800">
                              <HelpCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                              <div className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-0.5">Section Evaluator</div>
                              <div className="font-black italic uppercase tracking-tight text-slate-900 dark:text-white">
                                {quizzes.find(q => q._id === section.quiz || (typeof section.quiz === 'object' && section.quiz._id === q._id))?.title || 'Protocol Quiz'}
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline" className="border-amber-200 dark:border-amber-800 text-[10px] font-black uppercase tracking-widest opacity-50">Critical Path</Badge>
                        </div>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="p-4 bg-slate-50/30 dark:bg-black/10 border-t border-slate-100 dark:border-zinc-800/50">
                    <Button
                      variant="ghost"
                      onClick={() => openLectureDialog(null, section._id)}
                      className="w-full gap-3 font-black uppercase tracking-widest italic text-[10px] hover:bg-red-600 hover:text-white transition-all rounded-sm h-12 border border-dashed border-slate-200 dark:border-zinc-800"
                    >
                      <Plus className="h-4 w-4" />
                      Deploy Objectives to Module
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="resources">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Course Resources</h2>
            <Button onClick={() => setShowMaterialDialog(true)} className="gap-2">
              <Upload className="h-4 w-4" />
              Upload Material
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {materials.length === 0 ? (
              <div className="col-span-full text-center py-20 border-2 border-dashed rounded-xl">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No materials uploaded yet</h3>
                <p className="text-muted-foreground">Upload documents, notes, or extra videos for your students.</p>
              </div>
            ) : (
              materials.map((m) => (
                <Card key={m._id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-600">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="flex gap-2 items-center">
                        <Badge variant="outline" className="capitalize">{m.type}</Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-white hover:bg-destructive"
                          onClick={() => handleDeleteMaterial(m._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="text-lg mt-3 line-clamp-1">{m.title}</CardTitle>
                    <CardDescription>
                      {m.lecture?.title ? `Lecture: ${m.lecture.title}` :
                        m.sectionId ? `Section: ${sections.find(s => s._id === m.sectionId)?.sectionTitle || 'Linked Section'}` :
                          'General Course Resource'}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="bg-muted/30 pt-3">
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() => window.open(m.url, '_blank')}
                    >
                      <Download className="h-4 w-4" />
                      View / Download
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="quizzes">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Course Quizzes</h2>
            <Button onClick={() => setShowQuizDialog(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Quiz
            </Button>
          </div>

          <div className="space-y-4">
            {quizzes.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed rounded-xl">
                <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No quizzes created yet</h3>
                <p className="text-muted-foreground">Add interactive assessments to check your students' knowledge.</p>
              </div>
            ) : (
              quizzes.map((q) => (
                <Card key={q._id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{q.title}</CardTitle>
                        <CardDescription>{q.questions.length} Questions</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDeleteQuiz(q._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs >

      {/* Materials Dialog */}
      <Dialog open={showMaterialDialog} onOpenChange={setShowMaterialDialog}>
        <DialogContent className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-sm">
          <DialogHeader>
            <DialogTitle className="text-xl font-black italic uppercase tracking-tight text-slate-900 dark:text-white">
              Initiate Asset Upload
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleMaterialSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Resource Title</Label>
              <Input
                value={materialForm.title}
                onChange={e => setMaterialForm({ ...materialForm, title: e.target.value })}
                placeholder="e.g. Protocol Summary PDF"
                required
                className="h-12 bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 font-bold"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={materialForm.type}
                  onValueChange={val => setMaterialForm({ ...materialForm, type: val })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="document">Document (PDF/Doc)</SelectItem>
                    <SelectItem value="note">Note / Text</SelectItem>
                    <SelectItem value="video">Extra Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Link to Lecture (Optional)</Label>
                <Select
                  value={materialForm.lectureId}
                  onValueChange={val => setMaterialForm({ ...materialForm, lectureId: val, sectionId: '' })}
                >
                  <SelectTrigger><SelectValue placeholder="General" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (General)</SelectItem>
                    {sections.flatMap(s => s.lectures || []).map(l => (
                      <SelectItem key={l._id} value={l._id}>{l.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Link to Section (Optional)</Label>
              <Select
                value={materialForm.sectionId}
                onValueChange={val => setMaterialForm({ ...materialForm, sectionId: val, lectureId: '' })}
              >
                <SelectTrigger><SelectValue placeholder="General" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (General)</SelectItem>
                  {sections.map(s => (
                    <SelectItem key={s._id} value={s._id}>{s.sectionTitle}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Target File</Label>
              <Input
                type="file"
                onChange={e => setMaterialForm({ ...materialForm, file: e.target.files[0] })}
                required
                className="h-12 bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 font-bold file:bg-red-600 file:text-white file:font-black file:uppercase file:tracking-widest file:text-[10px] file:h-full file:border-0 file:px-4 cursor-pointer"
              />
            </div>
            <DialogFooter className="bg-slate-50 dark:bg-zinc-950 -mx-6 -mb-6 p-6 border-t border-slate-100 dark:border-zinc-800/50 mt-6">
              <Button type="button" variant="ghost" onClick={() => setShowMaterialDialog(false)} className="font-black uppercase tracking-widest italic text-[10px]">Cancel</Button>
              <Button type="submit" disabled={isSaving} className="bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest italic rounded-sm shadow-xl shadow-red-600/20 px-8">
                {isSaving ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                Execute Upload
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog >

      {/* Quiz Dialog */}
      <Dialog open={showQuizDialog} onOpenChange={setShowQuizDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-sm">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black italic uppercase tracking-tight text-slate-900 dark:text-white">
              Initialize Evaluator
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleQuizSubmit} className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Evaluator Title</Label>
              <Input
                value={quizForm.title}
                onChange={e => setQuizForm({ ...quizForm, title: e.target.value })}
                placeholder="e.g. Master Proficiency Exam"
                required
                className="h-12 bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 font-bold"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Link to Section (Optional)</Label>
                <Select
                  value={quizForm.sectionId}
                  onValueChange={val => setQuizForm({ ...quizForm, sectionId: val })}
                >
                  <SelectTrigger><SelectValue placeholder="Course Level Quiz" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (Course Level)</SelectItem>
                    {sections.map(s => (
                      <SelectItem key={s._id} value={s._id}>{s.sectionTitle}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Passing Score (%)</Label>
                <Input
                  type="number"
                  value={quizForm.passingScore}
                  onChange={e => setQuizForm({ ...quizForm, passingScore: e.target.value })}
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-bold">Questions</Label>
                <Button type="button" variant="outline" size="sm" onClick={addQuizQuestion}>
                  <Plus className="h-4 w-4 mr-2" /> Add Question
                </Button>
              </div>

              {quizForm.questions.map((q, qIndex) => (
                <Card key={qIndex} className="p-4 bg-muted/20 relative">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-destructive"
                    onClick={() => removeQuizQuestion(qIndex)}
                    disabled={quizForm.questions.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Question {qIndex + 1}</Label>
                      <Input
                        value={q.question}
                        onChange={e => updateQuizQuestion(qIndex, 'question', e.target.value)}
                        placeholder="What is..."
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {q.options.map((opt, oIndex) => (
                        <div key={oIndex} className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Option {oIndex + 1}</Label>
                          <div className="flex gap-2">
                            <Input
                              value={opt}
                              onChange={e => updateQuizOption(qIndex, oIndex, e.target.value)}
                              placeholder={`Option ${oIndex + 1}`}
                              required
                            />
                            <Button
                              type="button"
                              className={`shrink-0 ${q.correctIndex === oIndex ? 'bg-green-600' : 'bg-muted'}`}
                              size="icon"
                              onClick={() => updateQuizQuestion(qIndex, 'correctIndex', oIndex)}
                            >
                              {q.correctIndex === oIndex ? <CheckCircle2 className="h-4 w-4 text-white" /> : <XCircle className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <DialogFooter className="sticky bottom-0 bg-background pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setShowQuizDialog(false)}>Cancel</Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : 'Create Quiz'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseLecturesPage;