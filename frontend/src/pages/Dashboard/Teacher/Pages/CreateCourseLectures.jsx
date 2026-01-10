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
    // Load sections when course is loaded
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
        <Button
          variant="ghost"
          onClick={() => navigate('/teacher/courses')}
          className="mb-4 gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Courses
        </Button>

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
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sections.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Lectures
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLectures}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Free Previews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Array.isArray(sections) ? sections.reduce((total, section) =>
                total + (section.lectures?.filter(l => l.isPreviewFree)?.length || 0), 0
              ) : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4 mb-6">
        <Dialog open={showSectionDialog} onOpenChange={setShowSectionDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <FolderPlus className="h-4 w-4" />
              Add Section
            </Button>
          </DialogTrigger>
          <DialogContent>
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
            <Button variant="outline" className="gap-2">
              <Video className="h-4 w-4" />
              Add Lecture
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingLecture ? 'Edit Lecture' : 'Create New Lecture'}
              </DialogTitle>
              <DialogDescription>
                Add a video lecture to your course. You can upload a video file or provide a video URL.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleLectureSubmit}>
              <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                <div className="space-y-2">
                  <Label htmlFor="lecture-title">Lecture Title</Label>
                  <Input
                    id="lecture-title"
                    value={lectureForm.title}
                    onChange={(e) => setLectureForm({ ...lectureForm, title: e.target.value })}
                    placeholder="e.g., Introduction to Components"
                    required
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
        <Card className="text-center py-12">
          <CardContent>
            <FileVideo className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Sections Yet</h3>
            <p className="text-muted-foreground mb-4">
              Start by creating your first section to organize your lectures.
            </p>
            <Button onClick={() => setShowSectionDialog(true)}>
              <FolderPlus className="mr-2 h-4 w-4" />
              Create First Section
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {sections.map((section, sectionIndex) => (
            <Card key={section._id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Section {sectionIndex + 1}: {section.sectionTitle}
                      <Badge variant="outline">
                        {section.lectures?.length || 0} lectures
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {section.description || 'No description provided'}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openSectionDialog(section)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteSection(section._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {!section.lectures || section.lectures.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Video className="h-8 w-8 mx-auto mb-2" />
                    <p>No lectures in this section yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {section.lectures.map((lecture) => (
                      <div
                        key={lecture._id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <FileVideo className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{lecture.title}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
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
                              {lecture.videoUrl && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-xs"
                                  onClick={() => window.open(lecture.videoUrl, '_blank')}
                                >
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  View
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openLectureDialog(lecture)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteLecture(lecture._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  onClick={() => openLectureDialog(null, section._id)}
                  className="w-full gap-2"
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