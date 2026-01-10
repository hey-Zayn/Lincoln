import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourseStore } from '../../store/useCourseStore';
import {
  Loader2,
  Menu,
  X,
  Play,
  CheckCircle2,
  Lock,
  ChevronLeft,
  FileText,
  MessageSquare,
  HelpCircle,
  Clock,
  BookOpen,
  User,
  Download,
  Share2,
  Maximize2,
  Volume2,
  Settings,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Flag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

const LecturesPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCourseById, currentCourse, isLoading } = useCourseStore();
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [progress, setProgress] = useState(35); // Mock progress

  useEffect(() => {
    getCourseById(id).then(course => {
      if (course) {
        // Set first section
        if (course.sections?.length > 0) {
          const firstSection = course.sections[0];
          setSelectedSection(firstSection);

          // Set first lecture from first section
          if (firstSection.lectures?.length > 0) {
            setSelectedLecture(firstSection.lectures[0]);
          }
        } else if (course.lectures?.length > 0) {
          // Fallback for flat structure
          setSelectedLecture(course.lectures[0]);
        }
      }
    });
  }, [id, getCourseById]);

  const handleLectureSelect = (lecture, section) => {
    setSelectedLecture(lecture);
    setSelectedSection(section);
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const handleMarkComplete = () => {
    toast.success("Lecture marked as completed");
    // Here you would update progress in your backend
  };

  const calculateTotalDuration = (lectures) => {
    // Mock calculation - in real app, get duration from video metadata
    return (lectures?.length || 0) * 15; // 15 minutes per lecture
  };

  const calculateCompletedLectures = () => {
    // Mock calculation - in real app, get from user progress
    return Math.floor((progress / 100) * getTotalLectures());
  };

  const getTotalLectures = () => {
    if (!currentCourse?.sections) return 0;
    return currentCourse.sections.reduce((total, section) =>
      total + (section.lectures?.length || 0), 0
    );
  };

  if (isLoading || !currentCourse) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile Sidebar Toggle */}
      <Button
        size="icon"
        variant="secondary"
        className="lg:hidden fixed bottom-4 right-4 z-50 h-12 w-12 shadow-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <div className={`
        ${isSidebarOpen ? 'translate-x-0 w-full lg:w-80' : '-translate-x-full lg:translate-x-0 lg:w-20'} 
        fixed lg:relative z-40 h-full bg-card border-r transition-all duration-300 flex flex-col
      `}>
        {/* Sidebar Header - Collapsed state */}
        {!isSidebarOpen && (
          <div className="p-4 border-b">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(true)}
              className="w-full"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        )}

        {/* Sidebar Content - Expanded state */}
        {isSidebarOpen && (
          <>
            {/* Header */}
            <div className="p-6 border-b">
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/courses/${id}`)}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Course
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSidebarOpen(false)}
                  className="lg:hidden"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <h1 className="text-xl font-bold truncate">{currentCourse.title}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {getTotalLectures()} lectures • {currentCourse.sections?.length || 0} sections
              </p>
            </div>

            {/* Progress Section */}
            <div className="p-6 border-b space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Course Progress</span>
                  <span className="font-semibold">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{calculateCompletedLectures()} of {getTotalLectures()} completed</span>
                <span>{calculateTotalDuration()} min total</span>
              </div>
            </div>

            {/* Sections List */}
            <ScrollArea className="flex-1">
              <div className="p-6 space-y-6">
                {currentCourse.sections?.map((section, sIndex) => (
                  <div key={section._id || sIndex} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <h3 className="font-semibold text-sm">
                          Section {sIndex + 1}: {section.sectionTitle || `Section ${sIndex + 1}`}
                        </h3>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {section.lectures?.length || 0}
                      </Badge>
                    </div>

                    <div className="space-y-2 ">
                      {section.lectures?.map((lecture, lIndex) => (
                        <Button
                          key={lecture._id || lIndex}
                          variant={selectedLecture?._id === lecture._id ? "secondary" : "ghost"}
                          className="w-full justify-start h-auto py-3 px-4 "
                          onClick={() => handleLectureSelect(lecture, section)}
                        >
                          <div className="flex items-start gap-3 w-full">
                            <div className={`
                              flex-shrink-0 mt-0.5 size-6 rounded-full flex items-center justify-center text-xs
                              ${selectedLecture?._id === lecture._id
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground'
                              }
                            `}>
                              {lIndex + 1}
                            </div>
                            <div className="flex-1 text-left min-w-0 ">
                              <p className="font-medium text-sm truncate">{lecture.title}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">15 min</span>
                                {lecture.isPreviewFree && (
                                  <Badge variant="outline" className="text-xs h-5 px-1.5">
                                    Free
                                  </Badge>
                                )}
                              </div>
                            </div>
                            {selectedLecture?._id === lecture._id && (
                              <Play className="h-4 w-4 text-primary flex-shrink-0" />
                            )}
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Instructor Info */}
            <div className="p-6 border-t">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={currentCourse.teacher?.avatar} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Instructor</p>
                  <p className="text-xs text-muted-foreground">
                    {currentCourse.teacher?.name || 'Course Instructor'}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Video Player Header */}
        <div className="border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <h2 className="text-lg font-semibold truncate">
                {selectedLecture?.title || 'Select a lecture'}
              </h2>
              {selectedSection && (
                <p className="text-sm text-muted-foreground truncate">
                  {selectedSection.sectionTitle} • Section {currentCourse.sections?.findIndex(s => s._id === selectedSection._id) + 1}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Volume2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Video Player Area */}
        <div className="flex-1 p-6 overflow-auto">
          {selectedLecture ? (
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Video Player */}
              <Card className="overflow-hidden">
                <div className="aspect-video bg-black relative">
                  {selectedLecture.videoUrl ? (
                    <video
                      src={selectedLecture.videoUrl}
                      controls
                      className="w-full h-full"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                      <div className="size-20 bg-muted rounded-full flex items-center justify-center mb-4">
                        <Play className="h-10 w-10" />
                      </div>
                      <p className="text-lg font-medium">Video content will be available soon</p>
                      <p className="text-sm mt-2">The instructor is preparing this lecture</p>
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button onClick={handleMarkComplete} className="gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Mark Complete
                      </Button>
                      <Button variant="outline" size="icon">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Flag className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        Resources
                      </Button>
                      <Button variant="outline" size="icon">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Lecture Content Tabs */}
              <Tabs defaultValue="description" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                  <TabsTrigger value="discussion">Discussion</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>About this lecture</CardTitle>
                      <CardDescription>
                        What you'll learn in this session
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {selectedLecture.description ||
                          "This lecture covers essential concepts and practical applications. You'll gain hands-on experience through examples and exercises designed to reinforce learning objectives."}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Learning Objectives</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <p>Understand core concepts presented in the lecture</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <p>Apply knowledge to practical scenarios</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <p>Complete exercises to reinforce understanding</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="resources">
                  <Card>
                    <CardHeader>
                      <CardTitle>Lecture Resources</CardTitle>
                      <CardDescription>
                        Downloadable materials for this lecture
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="font-medium">Lecture Slides</p>
                            <p className="text-sm text-muted-foreground">PDF • 2.4 MB</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-green-500" />
                          <div>
                            <p className="font-medium">Exercise Files</p>
                            <p className="text-sm text-muted-foreground">ZIP • 5.7 MB</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="discussion">
                  <Card>
                    <CardHeader>
                      <CardTitle>Discussion Forum</CardTitle>
                      <CardDescription>
                        Ask questions and discuss with other students
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>JD</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">John Doe</p>
                              <span className="text-xs text-muted-foreground">2 hours ago</span>
                            </div>
                            <p className="mt-2">Can someone explain the concept discussed at 12:45?</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>Y</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <textarea
                            placeholder="Add your question or comment..."
                            className="w-full p-3 border rounded-lg resize-none"
                            rows={3}
                          />
                          <div className="flex justify-end">
                            <Button>Post Comment</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Previous Lecture
                </Button>
                <div className="text-sm text-muted-foreground">
                  Lecture {selectedSection?.lectures?.findIndex(l => l._id === selectedLecture._id) + 1} of {selectedSection?.lectures?.length}
                </div>
                <Button variant="outline" className="gap-2">
                  Next Lecture
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto py-12 text-center">
              <div className="size-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Play className="h-12 w-12" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Select a Lecture</h3>
              <p className="text-muted-foreground mb-6">
                Choose a lecture from the sidebar to start learning
              </p>
              <Button onClick={() => setIsSidebarOpen(true)} className="lg:hidden">
                <Menu className="h-4 w-4 mr-2" />
                Open Course Contents
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LecturesPage;