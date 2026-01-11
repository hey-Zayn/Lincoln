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
  BarChart3,
} from 'lucide-react';
import { toast } from 'sonner';
import axiosInstance from '../../../../axios/axiosInstance';

const CourseLecturesPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCourseById, currentCourse, isLoading, togglePublish } = useCourseStore();

  const [sections, setSections] = useState([]);
  const [editingSection, setEditingSection] = useState(null);
  const [editingLecture, setEditingLecture] = useState(null);
  const [showSectionDialog, setShowSectionDialog] = useState(false);
  const [showLectureDialog, setShowLectureDialog] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const [sectionForm, setSectionForm] = useState({
    title: '',
  });

  const [lectureForm, setLectureForm] = useState({
    title: '',
    description: '',
    videoFile: null,
    videoUrl: '',
    isPreviewFree: false,
  });

  useEffect(() => {
    if (id) {
      getCourseById(id);
    }
  }, [id, getCourseById]);

  useEffect(() => {
    if (currentCourse?._id) {
      fetchSections();
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

      if (lectureForm.videoFile) {
        videoUrl = await handleVideoUpload(lectureForm.videoFile);
        if (!videoUrl) return;
      }

      if (editingLecture) {
        await axiosInstance.put(`/lectures/${editingLecture._id}`, {
          title: lectureForm.title,
          description: lectureForm.description,
          videoUrl: videoUrl,
          isPreviewFree: lectureForm.isPreviewFree,
        });
        toast.success('Lecture updated successfully');
      } else {
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

  if (isLoading || !currentCourse) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading course content...</p>
        </div>
      </div>
    );
  }

  const totalLectures = Array.isArray(sections) ? sections.reduce((total, section) =>
    total + (section.lectures?.length || 0), 0
  ) : 0;

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/teacher/courses')}
          className="mb-6 gap-2 pl-0 hover:pl-2 transition-all"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Courses
        </Button>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">Course Curriculum</h1>
              <Badge
                variant={currentCourse.isPublished ? "default" : "secondary"}
                className="h-fit"
              >
                {currentCourse.isPublished ? 'Published' : 'Draft'}
              </Badge>
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-medium text-foreground">{currentCourse.title}</h2>
              <p className="text-sm text-muted-foreground">
                {totalLectures} lectures • {sections.length} sections
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={() => window.open(`/courses/${id}`, '_blank')}
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              Preview Course
            </Button>
            <Button
              onClick={handleTogglePublish}
              variant={currentCourse.isPublished ? "outline" : "default"}
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
                  Publish Course
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Sections</p>
                <p className="text-2xl font-bold">{sections.length}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Lectures</p>
                <p className="text-2xl font-bold">{totalLectures}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Video className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Free Previews</p>
                <p className="text-2xl font-bold">
                  {Array.isArray(sections) ? sections.reduce((total, section) =>
                    total + (section.lectures?.filter(l => l.isPreviewFree)?.length || 0), 0
                  ) : 0}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Globe className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Status</p>
                <p className="text-lg font-semibold capitalize">
                  {currentCourse.isPublished ? 'Published' : 'Draft'}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 p-6 bg-card border rounded-lg">
        <div className="space-y-1 flex-1">
          <h3 className="font-semibold">Manage Course Content</h3>
          <p className="text-sm text-muted-foreground">
            Organize your course into sections and add lectures with video content
          </p>
        </div>
        <div className="flex gap-3">
          <Dialog open={showSectionDialog} onOpenChange={setShowSectionDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <FolderPlus className="h-4 w-4" />
                Add Section
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingSection ? 'Edit Section' : 'Create New Section'}
                </DialogTitle>
                <DialogDescription>
                  Sections help organize your course content into logical groups.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSectionSubmit}>
                <div className="space-y-4 py-4">
                  <div className="space-y-3">
                    <Label htmlFor="title">Section Title</Label>
                    <Input
                      id="title"
                      value={sectionForm.title}
                      onChange={(e) => setSectionForm({ title: e.target.value })}
                      placeholder="e.g., Introduction to React"
                      required
                      className="h-10"
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
              <Button variant="outline" className="gap-2">
                <Video className="h-4 w-4" />
                Add Lecture
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {editingLecture ? 'Edit Lecture' : 'Create New Lecture'}
                </DialogTitle>
                <DialogDescription>
                  Add a video lecture to your course. You can upload a video file or provide a video URL.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleLectureSubmit}>
                <div className="space-y-6 py-4 max-h-[60vh] overflow-y-auto pr-2">
                  <div className="space-y-3">
                    <Label htmlFor="lecture-title">Lecture Title</Label>
                    <Input
                      id="lecture-title"
                      value={lectureForm.title}
                      onChange={(e) => setLectureForm({ ...lectureForm, title: e.target.value })}
                      placeholder="e.g., Introduction to Components"
                      required
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="lecture-description">Description (Optional)</Label>
                    <Textarea
                      id="lecture-description"
                      value={lectureForm.description}
                      onChange={(e) => setLectureForm({ ...lectureForm, description: e.target.value })}
                      placeholder="Brief description of what students will learn in this lecture..."
                      rows={3}
                      className="resize-none"
                    />
                  </div>

                  <div className="space-y-4">
                    <Label>Video Content</Label>

                    <div className="space-y-4">
                      <div className="space-y-3">
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
                            className="cursor-pointer h-10"
                          />
                        </div>
                        {lectureForm.videoFile && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <FileVideo className="h-4 w-4" />
                            {lectureForm.videoFile.name}
                          </div>
                        )}
                      </div>

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <Separator />
                        </div>
                        <div className="relative flex justify-center text-xs">
                          <span className="bg-background px-3 text-muted-foreground">OR</span>
                        </div>
                      </div>

                      <div className="space-y-3">
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
                          className="h-10"
                        />
                      </div>
                    </div>

                    {isUploading && (
                      <div className="space-y-3 border rounded-lg p-4 bg-muted/50">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Uploading...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <Progress value={uploadProgress} className="h-2" />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                    <div className="space-y-1">
                      <Label htmlFor="preview-access" className="font-medium">
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
                <DialogFooter className="pt-4 border-t">
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
      </div>

      {/* Sections List */}
      {sections.length === 0 ? (
        <Card className="text-center py-16 border-dashed">
          <CardContent className="space-y-4">
            <div className="h-12 w-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <FileVideo className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">No Sections Created</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Start by creating sections to organize your course content. Sections help students follow along in a logical sequence.
              </p>
            </div>
            <Button onClick={() => setShowSectionDialog(true)} className="mt-4">
              <FolderPlus className="mr-2 h-4 w-4" />
              Create First Section
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {sections.map((section, sectionIndex) => (
            <Card key={section._id} className="overflow-hidden border-border/50">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">{sectionIndex + 1}</span>
                      </div>
                      <div>
                        <CardTitle className="text-lg">{section.sectionTitle}</CardTitle>
                        <CardDescription>
                          {section.description || 'No description provided'}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="w-fit">
                      {section.lectures?.length || 0} lectures
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openSectionDialog(section)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSection(section._id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {!section.lectures || section.lectures.length === 0 ? (
                  <div className="py-8 text-center border-2 border-dashed rounded-lg">
                    <Video className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground mb-4">No lectures in this section yet</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openLectureDialog(null, section._id)}
                      className="gap-2"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add First Lecture
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {section.lectures.map((lecture) => (
                      <div
                        key={lecture._id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors group"
                      >
                        <div className="flex items-start gap-4">
                          <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <FileVideo className="h-4 w-4 text-primary" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{lecture.title}</span>
                              <Badge
                                variant={lecture.isPreviewFree ? "default" : "outline"}
                                className="h-5 text-xs"
                              >
                                {lecture.isPreviewFree ? (
                                  <span className="flex items-center gap-1">
                                    <Globe className="h-3 w-3" />
                                    Free Preview
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1">
                                    <Lock className="h-3 w-3" />
                                    Enrolled Only
                                  </span>
                                )}
                              </Badge>
                            </div>
                            {lecture.description && (
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {lecture.description}
                              </p>
                            )}
                            {lecture.videoUrl && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-xs -ml-2"
                                onClick={() => window.open(lecture.videoUrl, '_blank')}
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                View Video
                              </Button>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openLectureDialog(lecture)}
                            className="h-8 w-8"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteLecture(lecture._id)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>

              <CardFooter className="border-t pt-4">
                <Button
                  variant="ghost"
                  onClick={() => openLectureDialog(null, section._id)}
                  className="gap-2 w-full hover:bg-muted/50"
                >
                  <Plus className="h-4 w-4" />
                  Add Lecture to This Section
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseLecturesPage;