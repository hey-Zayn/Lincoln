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
  Flag,
  Send,
  Reply,
  ThumbsUp,
  Edit2,
  Trash2
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';



const LecturesPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getCourseById,
    currentCourse,
    isLoading,
    getCourseProgress,
    updateLectureProgress,
    courseProgress,
    getMaterials,
    getQuizzes,
    getQuizById,
    submitQuiz,
    getComments,
    addComment,
    updateComment,
    deleteComment,
    toggleLike,
    getUserNote,
    upsertUserNote
  } = useCourseStore();

  const { authUser } = useAuthStore();
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [materials, setMaterials] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [activeTab, setActiveTab] = useState("description");

  // Discussion state
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [isPostingComment, setIsPostingComment] = useState(false);

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  // Notes state
  const [noteContent, setNoteContent] = useState("");
  const [isSavingNote, setIsSavingNote] = useState(false);

  // Quiz taking state
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);

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
    getCourseProgress(id);

    const fetchMaterials = async () => {
      const mats = await getMaterials(id);
      setMaterials(mats);
    };

    const fetchQuizzes = async () => {
      const qzs = await getQuizzes(id);
      setQuizzes(qzs);
    };

    // Fetch materials and quizzes
    fetchMaterials();
    fetchQuizzes();
  }, [id, getCourseById, getCourseProgress, getMaterials, getQuizzes]);

  useEffect(() => {
    if (selectedLecture?._id && activeTab === "discussion") {
      getComments(id, selectedLecture._id).then(setComments);
    }
  }, [id, selectedLecture?._id, activeTab, getComments]);

  useEffect(() => {
    if (selectedLecture?._id) {
      getUserNote(id, selectedLecture._id).then(note => {
        setNoteContent(note?.content || "");
      });
    }
  }, [id, selectedLecture?._id, getUserNote]);

  const handleSaveNote = async () => {
    if (!selectedLecture?._id) return;
    setIsSavingNote(true);
    try {
      await upsertUserNote(id, selectedLecture._id, noteContent);
      toast.success("Note saved");
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedLecture?._id) return;
    setIsPostingComment(true);
    try {
      const comment = await addComment(id, selectedLecture._id, { content: newComment });
      if (comment) {
        setComments([comment, ...comments]);
        setNewComment("");
      }
    } finally {
      setIsPostingComment(false);
    }
  };

  const handleReplySubmit = async (parentCommentId) => {
    if (!replyContent.trim() || !selectedLecture?._id) return;
    setIsPostingComment(true);
    try {
      const reply = await addComment(id, selectedLecture._id, {
        content: replyContent,
        parentCommentId
      });
      if (reply) {
        setComments(comments.map(c =>
          c._id === parentCommentId
            ? { ...c, replies: [...(c.replies || []), reply] }
            : c
        ));
        setReplyTo(null);
        setReplyContent("");
      }
    } finally {
      setIsPostingComment(false);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editingContent.trim()) return;
    setIsPostingComment(true);
    try {
      const updated = await updateComment(commentId, editingContent);
      if (updated) {
        setComments(comments.map(c => {
          if (c._id === commentId) return updated;
          if (c.replies) {
            return {
              ...c,
              replies: c.replies.map(r => r._id === commentId ? updated : r)
            };
          }
          return c;
        }));
        setEditingCommentId(null);
        setEditingContent("");
      }
    } finally {
      setIsPostingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    const success = await deleteComment(commentId);
    if (success) {
      setComments(comments.filter(c => c._id !== commentId).map(c => ({
        ...c,
        replies: c.replies?.filter(r => r._id !== commentId) || []
      })));
    }
  };

  const handleToggleLike = async (commentId) => {
    const data = await toggleLike(commentId);
    if (data) {
      setComments(comments.map(c => {
        if (c._id === commentId) {
          return { ...c, likes: data.likes };
        }
        if (c.replies) {
          return {
            ...c,
            replies: c.replies.map(r => r._id === commentId ? { ...r, likes: data.likes } : r)
          };
        }
        return c;
      }));
    }
  };

  const isSectionLocked = (sIndex) => {
    if (sIndex === 0) return false;
    const prevSection = currentCourse.sections[sIndex - 1];
    if (prevSection.quiz) {
      const quizId = typeof prevSection.quiz === 'object' ? prevSection.quiz._id : prevSection.quiz;
      const quizProg = courseProgress?.quizProgress?.find(qp => qp.quizId === quizId || qp.quizId?._id === quizId);
      if (!quizProg?.passed) return true;
    }
    return isSectionLocked(sIndex - 1);
  };

  const isLectureLocked = (lectureId, sectionIndex) => {
    if (isSectionLocked(sectionIndex)) return true;
    return false;
  };

  const handleLectureSelect = (lecture, section, sIndex) => {
    if (isLectureLocked(lecture._id, sIndex)) {
      toast.error("Please pass the previous section's quiz to unlock this content.");
      return;
    }
    setSelectedLecture(lecture);
    setSelectedSection(section);
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const handleMarkComplete = async () => {
    if (selectedLecture) {
      await updateLectureProgress(id, selectedLecture._id);
      toast.success("Lecture marked as completed");

      // Check if it was the last lecture of the section
      const sectionLectures = selectedSection?.lectures || [];
      const isLastInSection = sectionLectures[sectionLectures.length - 1]?._id === selectedLecture._id;

      if (isLastInSection && selectedSection?.quiz) {
        const quizId = typeof selectedSection.quiz === 'object' ? selectedSection.quiz._id : selectedSection.quiz;
        const quizProg = courseProgress?.quizProgress?.find(qp => qp.quizId === quizId || qp.quizId?._id === quizId);
        if (!quizProg?.passed) {
          setTimeout(() => {
            toast.info("Section completed! Time for a quiz.");
            handleStartQuiz(quizId);
          }, 1500);
        }
      }
    }
  };

  const calculateTotalDuration = (lectures) => {
    // Mock calculation - in real app, get duration from video metadata
    return (lectures?.length || 0) * 15; // 15 minutes per lecture
  };

  const getAllLectures = () => {
    if (!currentCourse?.sections) return [];
    return currentCourse.sections.flatMap(section => section.lectures || []);
  };

  const handleNextLecture = () => {
    const allLectures = getAllLectures();
    const currentIndex = allLectures.findIndex(l => l._id === selectedLecture?._id);
    if (currentIndex < allLectures.length - 1) {
      const nextLecture = allLectures[currentIndex + 1];
      // Find the section and its index for this lecture
      let nextSIndex = -1;
      const nextSection = currentCourse.sections.find((s, idx) => {
        if (s.lectures?.some(l => l._id === nextLecture._id)) {
          nextSIndex = idx;
          return true;
        }
        return false;
      });

      if (isLectureLocked(nextLecture._id, nextSIndex)) {
        // If locked, check if there's a quiz to prompt
        if (selectedSection?.quiz) {
          const quizId = typeof selectedSection.quiz === 'object' ? selectedSection.quiz._id : selectedSection.quiz;
          const quizProg = courseProgress?.quizProgress?.find(qp => qp.quizId === quizId || qp.quizId?._id === quizId);
          if (!quizProg?.passed) {
            toast.info("Section completed! Please pass the quiz to continue.");
            handleStartQuiz(quizId);
            return;
          }
        }
        toast.error("Please pass the previous section's quiz to unlock this content.");
        return;
      }
      handleLectureSelect(nextLecture, nextSection, nextSIndex);
    } else {
      toast.info("You've reached the end of the course!");
    }
  };

  const handlePrevLecture = () => {
    const allLectures = getAllLectures();
    const currentIndex = allLectures.findIndex(l => l._id === selectedLecture?._id);
    if (currentIndex > 0) {
      const prevLecture = allLectures[currentIndex - 1];
      const prevSection = currentCourse.sections.find(s =>
        s.lectures?.some(l => l._id === prevLecture._id)
      );
      handleLectureSelect(prevLecture, prevSection);
    }
  };

  const getTotalLectures = () => {
    if (!currentCourse?.sections) return 0;
    return currentCourse.sections.reduce((total, section) =>
      total + (section.lectures?.length || 0), 0
    );
  };

  const handleStartQuiz = async (quizId) => {
    const quiz = await getQuizById(quizId);
    if (quiz) {
      setActiveQuiz(quiz);
      setQuizAnswers({});
      setQuizResult(null);
    }
  };

  const handleQuizSubmit = async () => {
    if (!activeQuiz) return;

    // Check if all questions are answered
    if (Object.keys(quizAnswers).length < activeQuiz.questions.length) {
      toast.error("Please answer all questions before submitting.");
      return;
    }

    setIsSubmittingQuiz(true);
    try {
      const result = await submitQuiz(activeQuiz._id, quizAnswers);
      if (result) {
        setQuizResult(result);
        if (result.passed) {
          toast.success(`Congratulations! You passed with ${result.percentage}%`);
          // Refresh progress to unlock content
          getCourseProgress(id);
        } else {
          toast.error(`You scored ${result.percentage}%. You need ${activeQuiz.passingScore || 70}% to pass.`);
        }
      }
    } catch {
      toast.error("Failed to submit quiz");
    } finally {
      setIsSubmittingQuiz(false);
    }
  };


  if (isLoading || !currentCourse) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
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
        ${isSidebarOpen ? 'translate-x-0 w-full lg:w-80' : '-translate-x-full lg:translate-x-0 lg:w-0'} 
        fixed lg:relative z-40 h-full bg-slate-50 dark:bg-zinc-950 border-r border-slate-200 dark:border-zinc-800 transition-all duration-300 flex flex-col shadow-xl lg:shadow-none
      `}>
          {isSidebarOpen && (
            <>
              {/* Header */}
              <div className="p-6 border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
                <div className="flex items-center justify-between mb-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/courses/${id}`)}
                    className="gap-2 text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800 px-0"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span className="font-bold uppercase tracking-widest text-[10px]">Back to Course</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSidebarOpen(false)}
                    className="lg:hidden text-slate-400"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <h1 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white leading-tight mb-2">
                  {currentCourse.title}
                </h1>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <Clock className="size-3" />
                  <span>{getTotalLectures()} LECTURES</span>
                  <span className="size-1 rounded-full bg-slate-300"></span>
                  <span>{currentCourse.sections?.length || 0} SECTIONS</span>
                </div>
              </div>

              {/* Progress Section */}
              <div className="p-6 border-b border-slate-200 dark:border-zinc-800 bg-white/50 dark:bg-transparent">
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Course Progress</span>
                    <span className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-500">{courseProgress?.progress || 0}%</span>
                  </div>
                  <Progress value={courseProgress?.progress || 0} className="h-1.5 bg-slate-200 dark:bg-zinc-800" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                    {courseProgress?.completedLectures?.length || 0} / {getTotalLectures()} COMPLETED
                  </p>
                </div>
              </div>

              {/* Sections List */}
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-8">
                  {currentCourse.sections?.map((section, sIndex) => (
                    <div key={section._id || sIndex} className="space-y-4">
                      <div className="px-2">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1 flex items-center justify-between">
                          <span>SECTION {sIndex + 1}</span>
                          <span className="text-slate-300">{section.lectures?.length || 0} ITEMS</span>
                        </h3>
                        <p className="text-xs font-bold text-slate-900 dark:text-white uppercase truncate">
                          {section.sectionTitle || `Untitled Section`}
                        </p>
                      </div>

                      <div className="space-y-1">
                        {section.lectures?.map((lecture, lIndex) => {
                          const isSelected = selectedLecture?._id === lecture._id;
                          const isLocked = isLectureLocked(lecture._id, sIndex);
                          const isCompleted = courseProgress?.completedLectures?.includes(lecture._id);

                          return (
                            <Button
                              key={lecture._id || lIndex}
                              variant="ghost"
                              className={`
                                w-full justify-start h-auto py-3 px-3 rounded-md transition-all duration-200
                                ${isSelected ? 'bg-emerald-600/10 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-500' : 'hover:bg-slate-200/50 dark:hover:bg-zinc-800/50'}
                                ${isLocked ? "opacity-50 grayscale cursor-not-allowed" : ""}
                              `}
                              onClick={() => handleLectureSelect(lecture, section, sIndex)}
                            >
                              <div className="flex items-start gap-3 w-full">
                                <div className={`
                                  shrink-0 mt-0.5 size-5 rounded-sm flex items-center justify-center text-[10px] font-black border
                                  ${isCompleted
                                    ? 'bg-emerald-500 text-white border-emerald-500'
                                    : isSelected
                                      ? 'bg-emerald-600 text-white border-emerald-600'
                                      : 'bg-slate-100 dark:bg-zinc-800 text-slate-400 border-slate-200 dark:border-zinc-700'
                                  }
                                `}>
                                  {isLocked ? (
                                    <Lock className="h-3 w-3" />
                                  ) : isCompleted ? (
                                    <CheckCircle2 className="h-3 w-3" />
                                  ) : (
                                    lIndex + 1
                                  )}
                                </div>
                                <div className="flex-1 text-left min-w-0">
                                  <p className={`text-xs font-bold leading-tight ${isSelected ? 'text-emerald-600 dark:text-emerald-500' : 'text-slate-700 dark:text-zinc-300'}`}>
                                    {lecture.title}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1 opacity-60">
                                    <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                                      <Play className="size-2.5" />
                                      <span>15 MIN</span>
                                    </div>
                                    {lecture.isPreviewFree && (
                                      <span className="text-[8px] font-black bg-slate-900 text-white dark:bg-white dark:text-black px-1 py-0.5 rounded-sm">FREE</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </Button>
                          );
                        })}

                        {/* Section Quiz in Sidebar */}
                        {section.quiz && (
                          <Button
                            variant="ghost"
                            className={`
                              w-full justify-start h-auto py-3 px-3 mt-2 rounded-md border border-dashed transition-all duration-200
                              ${courseProgress?.quizProgress?.find(qp => (qp.quizId === section.quiz || qp.quizId?._id === section.quiz) && qp.passed)
                                ? 'bg-emerald-50/50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/5 dark:border-emerald-500/20 dark:text-emerald-500'
                                : 'bg-orange-50/50 border-orange-200 text-orange-700 dark:bg-orange-500/5 dark:border-orange-500/20 dark:text-orange-500 hover:bg-orange-100/50'
                              }
                              ${isSectionLocked(sIndex) ? "opacity-50 grayscale cursor-not-allowed" : ""}
                            `}
                            onClick={() => {
                              if (isSectionLocked(sIndex)) {
                                toast.error("Complete previous content to unlock this quiz.");
                              } else {
                                handleStartQuiz(typeof section.quiz === 'object' ? section.quiz._id : section.quiz);
                              }
                            }}
                          >
                            <div className="flex items-start gap-3 w-full">
                              <div className={`
                                shrink-0 mt-0.5 size-5 rounded-sm flex items-center justify-center text-[10px] font-black border
                                ${courseProgress?.quizProgress?.find(qp => (qp.quizId === section.quiz || qp.quizId?._id === section.quiz) && qp.passed)
                                  ? 'bg-emerald-500 text-white border-emerald-500'
                                  : 'bg-orange-100 dark:bg-orange-950 text-orange-600 border-orange-200 dark:border-orange-900'
                                }
                              `}>
                                {courseProgress?.quizProgress?.find(qp => (qp.quizId === section.quiz || qp.quizId?._id === section.quiz) && qp.passed)
                                  ? <CheckCircle2 className="h-3 w-3" />
                                  : <HelpCircle className="h-3 w-3" />
                                }
                              </div>
                              <div className="flex-1 text-left min-w-0">
                                <p className="text-xs font-bold leading-tight">SECTION QUIZ</p>
                                <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Pass to Continue</p>
                              </div>
                            </div>
                          </Button>
                        )}
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
        <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-zinc-950">
          {/* Video Player Header */}
          <div className="border-b border-slate-200 dark:border-zinc-800 px-8 py-5">
            <div className="flex items-center justify-between gap-8">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1.5 overflow-hidden">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 shrink-0">Now Watching</span>
                  <span className="text-[10px] text-slate-300">•</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 truncate">
                    {selectedSection?.sectionTitle}
                  </span>
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white truncate">
                  {selectedLecture?.title || 'Select a lecture'}
                </h2>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-2 mr-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Live Session</span>
                </div>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                  <Settings className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Video Player Area */}
          <div className="flex-1 p-8 overflow-auto custom-scrollbar">
            {selectedLecture ? (
              <div className="max-w-6xl mx-auto space-y-10">
                {/* Video Player */}
                <div className="space-y-6">
                  <div className="aspect-video bg-slate-900 dark:bg-black relative rounded-sm overflow-hidden shadow-2xl border border-slate-200 dark:border-zinc-800">
                    {selectedLecture.videoUrl ? (
                      <video
                        src={selectedLecture.videoUrl}
                        controls
                        onEnded={handleMarkComplete}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                        <div className="size-20 bg-slate-800 rounded-full flex items-center justify-center mb-4 border border-zinc-700 shadow-inner">
                          <Play className="h-8 w-8 text-emerald-500" />
                        </div>
                        <p className="text-sm font-black uppercase tracking-widest text-zinc-400">CONTENT PREVIEW UNAVAILABLE</p>
                        <p className="text-[10px] font-bold uppercase tracking-tight text-zinc-600 mt-2">The instructor is processing this media</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-6">
                    <div className="flex items-center gap-4">
                      <Button
                        onClick={handleMarkComplete}
                        className={`
                          h-10 px-6 rounded-sm font-black uppercase tracking-widest text-[10px] transition-all
                          ${courseProgress?.completedLectures?.includes(selectedLecture?._id)
                            ? "bg-slate-100 dark:bg-zinc-800 text-slate-400 border border-slate-200 dark:border-zinc-700"
                            : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20"}
                        `}
                        disabled={courseProgress?.completedLectures?.includes(selectedLecture?._id)}
                      >
                        <CheckCircle2 className={`h-3 w-3 mr-2 ${courseProgress?.completedLectures?.includes(selectedLecture?._id) ? "text-emerald-500" : "text-white"}`} />
                        {courseProgress?.completedLectures?.includes(selectedLecture?._id) ? "COMPLETED" : "MARK AS COMPLETE"}
                      </Button>
                      <Button variant="outline" size="icon" className="h-10 w-10 border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800">
                        <Bookmark className="h-4 w-4 text-slate-500" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button variant="ghost" size="sm" className="gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
                        <Share2 className="h-3.5 w-3.5" />
                        Share
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
                        <Flag className="h-3.5 w-3.5" />
                        Report
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Lecture Content Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                  <TabsList className="bg-slate-100 dark:bg-zinc-900 p-1 h-12 rounded-sm border border-slate-200 dark:border-zinc-800">
                    {["description", "discussion", "resources", "quizzes", "notes"].map((tab) => (
                      <TabsTrigger
                        key={tab}
                        value={tab}
                        className="rounded-sm px-6 font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 transition-all h-full"
                      >
                        {tab}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  <TabsContent value="description" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="md:col-span-2 space-y-8">
                        <div className="space-y-4">
                          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">About this lecture</h3>
                          <p className="text-sm leading-relaxed text-slate-600 dark:text-zinc-400 font-medium">
                            {selectedLecture.description ||
                              "This lecture covers essential concepts and practical applications. You'll gain hands-on experience through examples and exercises designed to reinforce learning objectives."}
                          </p>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Learning Objectives</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                              "Understand core concepts presented in the session",
                              "Apply knowledge to practical workplace scenarios",
                              "Complete exercises to reinforce key principles",
                              "Master the tools and techniques discussed"
                            ].map((objective, i) => (
                              <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-sm">
                                <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                                <span className="text-[11px] font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-tight">{objective}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="p-6 bg-slate-900 text-white rounded-sm shadow-xl">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-4">Instructor Note</h4>
                          <div className="flex items-start gap-3 mb-4">
                            <Avatar className="size-8 border-2 border-slate-800">
                              <AvatarFallback className="bg-slate-800 text-xs">AI</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-xs font-bold leading-tight">Focus on the architectural patterns discussed in the middle section of the video.</p>
                            </div>
                          </div>
                          <Button variant="ghost" className="w-full text-slate-400 hover:text-white hover:bg-white/5 border border-white/10 h-8 text-[10px] font-black uppercase tracking-widest">
                            Contact Support
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="resources" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Resource Library</h3>
                        <Badge variant="outline" className="text-[10px] font-black uppercase border-slate-200 dark:border-zinc-800">
                          {materials.length} ASSETS
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {materials.filter(m =>
                          !m.lecture && !m.sectionId ||
                          (m.lecture === selectedLecture?._id || m.lecture?._id === selectedLecture?._id) ||
                          (m.sectionId === selectedSection?._id || m.sectionId?._id === selectedSection?._id)
                        ).length === 0 ? (
                          <div className="col-span-full py-20 text-center border border-dashed border-slate-200 dark:border-zinc-800 rounded-sm">
                            <FileText className="h-10 w-10 mx-auto mb-4 text-slate-300" />
                            <p className="text-xs font-black uppercase tracking-widest text-slate-400">NO RESOURCES ATTACHED</p>
                          </div>
                        ) : (
                          materials
                            .filter(m =>
                              !m.lecture && !m.sectionId ||
                              (m.lecture === selectedLecture?._id || m.lecture?._id === selectedLecture?._id) ||
                              (m.sectionId === selectedSection?._id || m.sectionId?._id === selectedSection?._id)
                            )
                            .map((m) => (
                              <div key={m._id} className="flex items-center justify-between p-5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-sm hover:border-emerald-500/30 transition-all group shadow-sm">
                                <div className="flex items-center gap-4">
                                  <div className={`size-10 rounded-sm flex items-center justify-center border ${m.type === 'video' ? 'bg-red-50 text-red-500 border-red-100 dark:bg-red-950/20 dark:border-red-900/30' : 'bg-blue-50 text-blue-500 border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/30'}`}>
                                    <FileText className="size-5" />
                                  </div>
                                  <div>
                                    <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tight">{m.title}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5 tracking-widest">
                                      {m.type} • {m.lecture ? 'LECTURE SPECIFIC' : m.sectionId ? 'SECTION RESOURCE' : 'GENERAL'}
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
                                  onClick={() => window.open(m.url, '_blank')}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            ))
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="quizzes" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Knowledge Assessments</h3>
                        <Badge variant="outline" className="text-[10px] font-black uppercase border-slate-200 dark:border-zinc-800">
                          {quizzes.length} MODULES
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        {quizzes.length === 0 ? (
                          <div className="py-20 text-center border border-dashed border-slate-200 dark:border-zinc-800 rounded-sm">
                            <HelpCircle className="h-10 w-10 mx-auto mb-4 text-slate-200" />
                            <p className="text-xs font-black uppercase tracking-widest text-slate-400 tracking-[0.2em]">NO ASSESSMENTS DEPLOYED</p>
                          </div>
                        ) : (
                          quizzes.map((quiz) => (
                            <div key={quiz._id} className="flex items-center justify-between p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-sm hover:border-orange-500/30 transition-all group shadow-sm">
                              <div className="flex items-center gap-5">
                                <div className="size-12 rounded-sm flex items-center justify-center bg-orange-50 text-orange-500 border border-orange-100 dark:bg-orange-950/20 dark:border-orange-900/30">
                                  <HelpCircle className="size-6" />
                                </div>
                                <div>
                                  <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{quiz.title}</p>
                                  <div className="flex items-center gap-3 mt-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{quiz.questions?.length || 0} QUESTIONS</span>
                                    <span className="size-1 rounded-full bg-slate-300" />
                                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">PASSING SCORE: {quiz.passingScore || 70}%</span>
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="default"
                                size="sm"
                                className="bg-orange-600 hover:bg-orange-700 text-white rounded-sm text-[10px] font-black uppercase tracking-widest h-10 px-8 transition-all shadow-lg shadow-orange-600/10"
                                onClick={() => handleStartQuiz(quiz._id)}
                              >
                                Initialize Assessment
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="discussion" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-8">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Community Discussion</h3>
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                              <Avatar key={i} className="size-6 border-2 border-white dark:border-zinc-950">
                                <AvatarFallback className="bg-slate-200 text-[8px] font-black">U{i}</AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                          <span className="text-[10px] font-bold text-slate-400">12 MEMBERS ACTIVE</span>
                        </div>
                      </div>

                      <div className="bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 rounded-sm p-6">
                        <form onSubmit={handleCommentSubmit} className="space-y-4">
                          <div className="flex gap-4">
                            <Avatar className="h-10 w-10 shrink-0 border border-slate-200 dark:border-zinc-700 rounded-sm">
                              <AvatarImage src={authUser?.profilePicture} className="rounded-sm" />
                              <AvatarFallback className="rounded-sm">{authUser?.firstName?.[0]}</AvatarFallback>
                            </Avatar>
                            <textarea
                              placeholder="Add to the conversation..."
                              className="flex-1 p-4 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-sm resize-none focus:ring-1 focus:ring-emerald-500/50 transition-all outline-none text-sm font-medium shadow-inner"
                              rows={3}
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                            />
                          </div>
                          <div className="flex justify-end">
                            <Button
                              disabled={!newComment.trim() || isPostingComment}
                              className="bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 px-8 rounded-sm text-[10px] font-black uppercase tracking-[0.2em]"
                            >
                              {isPostingComment ? <Loader2 className="h-3 w-3 animate-spin" /> : "Dispatch Comment"}
                            </Button>
                          </div>
                        </form>
                      </div>

                      {/* Comments List */}
                      <div className="space-y-6 max-h-[800px] overflow-y-auto pr-4 custom-scrollbar">
                        {comments.length === 0 ? (
                          <div className="py-20 text-center border border-dashed border-slate-200 dark:border-zinc-800 rounded-sm">
                            <MessageSquare className="h-10 w-10 mx-auto mb-4 text-slate-200" />
                            <p className="text-xs font-black uppercase tracking-widest text-slate-400 tracking-[0.2em]">Zero Activity Recorded</p>
                            <p className="text-[10px] font-bold text-slate-300 mt-2 uppercase">Initiate the first discussion thread</p>
                          </div>
                        ) : (
                          comments.map((comment) => (
                            <div key={comment._id} className="group animate-in fade-in slide-in-from-left-2 duration-300">
                              <div className="flex items-start gap-4">
                                <Avatar className="h-10 w-10 shrink-0 rounded-sm border border-slate-200 dark:border-zinc-800 shadow-sm">
                                  <AvatarImage src={comment.author?.profilePicture} className="rounded-sm" />
                                  <AvatarFallback className="rounded-sm font-black text-xs">{comment.author?.firstName?.[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-baseline justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                      <p className="text-xs font-black uppercase tracking-tight text-slate-900 dark:text-white">
                                        {comment.author?.firstName} {comment.author?.lastName}
                                      </p>
                                      <span className="text-[10px] font-bold text-slate-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                    </div>
                                  </div>

                                  <div className="p-4 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-sm hover:border-slate-300 dark:hover:border-zinc-700 transition-all shadow-xs group-hover:shadow-md">
                                    {editingCommentId === comment._id ? (
                                      <div className="space-y-4">
                                        <textarea
                                          className="w-full p-3 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-sm text-xs outline-none focus:ring-1 focus:ring-emerald-500/50 font-medium"
                                          value={editingContent}
                                          onChange={(e) => setEditingContent(e.target.value)}
                                          rows={2}
                                          autoFocus
                                        />
                                        <div className="flex gap-2 justify-end">
                                          <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest h-8" onClick={() => setEditingCommentId(null)}>Cancel</Button>
                                          <Button size="sm" className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest h-8" onClick={() => handleEditComment(comment._id)}>Update</Button>
                                        </div>
                                      </div>
                                    ) : (
                                      <>
                                        <p className="text-sm leading-relaxed text-slate-700 dark:text-zinc-300 font-medium whitespace-pre-wrap">{comment.content}</p>
                                        {comment.isEdited && <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-2 block opacity-50 italic">Edited Payload</span>}
                                      </>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-6 mt-3 ml-1">
                                    <button
                                      onClick={() => handleToggleLike(comment._id)}
                                      className={`group/like flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${comment.likes?.includes(authUser?._id) ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-900'}`}
                                    >
                                      <ThumbsUp className={`h-3 w-3 transition-transform group-hover/like:scale-110 ${comment.likes?.includes(authUser?._id) ? 'fill-emerald-600' : ''}`} />
                                      <span>{comment.likes?.length || 0} LIKES</span>
                                    </button>
                                    <button
                                      onClick={() => setReplyTo(replyTo === comment._id ? null : comment._id)}
                                      className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all"
                                    >
                                      <Reply className="h-3 w-3" />
                                      <span>REPLY</span>
                                    </button>
                                    {authUser?._id === comment.author?._id && !editingCommentId && (
                                      <div className="flex items-center gap-4 border-l border-slate-200 dark:border-zinc-800 pl-4 h-3">
                                        <button
                                          onClick={() => {
                                            setEditingCommentId(comment._id);
                                            setEditingContent(comment.content);
                                          }}
                                          className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 transition-all"
                                        >
                                          EDIT
                                        </button>
                                        <button
                                          onClick={() => handleDeleteComment(comment._id)}
                                          className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-all"
                                        >
                                          DELETE
                                        </button>
                                      </div>
                                    )}
                                  </div>

                                  {/* Reply Input */}
                                  {replyTo === comment._id && (
                                    <div className="mt-6 p-4 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-sm animate-in zoom-in-95 duration-200 shadow-inner">
                                      <div className="flex gap-3">
                                        <Avatar className="h-8 w-8 shrink-0 rounded-sm">
                                          <AvatarImage src={authUser?.profilePicture} className="rounded-sm" />
                                          <AvatarFallback className="rounded-sm bg-slate-200 text-[10px] font-black">{authUser?.firstName?.[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 space-y-3">
                                          <textarea
                                            placeholder={`Write a response...`}
                                            className="w-full p-3 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-sm resize-none focus:ring-1 focus:ring-emerald-500/50 outline-none text-xs font-medium"
                                            rows={2}
                                            value={replyContent}
                                            onChange={(e) => setReplyContent(e.target.value)}
                                            autoFocus
                                          />
                                          <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => setReplyTo(null)} className="text-[10px] font-black uppercase tracking-widest h-8 px-4">Cancel</Button>
                                            <Button
                                              disabled={!replyContent.trim() || isPostingComment}
                                              size="sm"
                                              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-sm text-[10px] font-black uppercase tracking-widest h-8 px-6"
                                              onClick={() => handleReplySubmit(comment._id)}
                                            >
                                              {isPostingComment ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Deploy Response'}
                                            </Button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Replies List */}
                                  {comment.replies?.length > 0 && (
                                    <div className="mt-6 ml-6 pl-8 border-l-2 border-slate-100 dark:border-zinc-800 space-y-6">
                                      {comment.replies.map((reply) => (
                                        <div key={reply._id} className="flex items-start gap-3">
                                          <Avatar className="h-8 w-8 shrink-0 rounded-sm border border-slate-200 dark:border-zinc-800">
                                            <AvatarImage src={reply.author?.profilePicture} className="rounded-sm" />
                                            <AvatarFallback className="rounded-sm bg-slate-100 text-[10px] font-black">{reply.author?.firstName?.[0]}</AvatarFallback>
                                          </Avatar>
                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-1">
                                              <p className="text-[11px] font-black uppercase tracking-tight text-slate-700 dark:text-zinc-300">
                                                {reply.author?.firstName} {reply.author?.lastName}
                                              </p>
                                              <span className="text-[9px] font-bold text-slate-400 uppercase">{new Date(reply.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className="p-3 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-sm">
                                              {editingCommentId === reply._id ? (
                                                <div className="space-y-3">
                                                  <textarea
                                                    className="w-full p-2 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-sm text-xs outline-none font-medium"
                                                    value={editingContent}
                                                    onChange={(e) => setEditingContent(e.target.value)}
                                                    rows={1}
                                                    autoFocus
                                                  />
                                                  <div className="flex gap-2 justify-end">
                                                    <Button variant="ghost" size="xs" className="h-6 text-[9px] font-black uppercase tracking-widest" onClick={() => setEditingCommentId(null)}>Cancel</Button>
                                                    <Button size="xs" className="h-6 text-[9px] font-black uppercase tracking-widest bg-slate-900 text-white" onClick={() => handleEditComment(reply._id)}>Save</Button>
                                                  </div>
                                                </div>
                                              ) : (
                                                <>
                                                  <p className="text-xs leading-relaxed text-slate-600 dark:text-zinc-400 font-medium opacity-90">{reply.content}</p>
                                                  {reply.isEdited && <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 mt-1 block italic opacity-50">Modified Data</span>}
                                                </>
                                              )}
                                            </div>
                                            <div className="flex items-center gap-4 mt-2 ml-1">
                                              <button
                                                onClick={() => handleToggleLike(reply._id)}
                                                className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest transition-all ${reply.likes?.includes(authUser?._id) ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-900'}`}
                                              >
                                                <ThumbsUp className={`h-2.5 w-2.5 ${reply.likes?.includes(authUser?._id) ? 'fill-emerald-600' : ''}`} />
                                                <span>{reply.likes?.length || 0}</span>
                                              </button>
                                              {authUser?._id === reply.author?._id && !editingCommentId && (
                                                <div className="flex items-center gap-3 border-l border-slate-200 dark:border-zinc-800 pl-3 h-2">
                                                  <button
                                                    onClick={() => {
                                                      setEditingCommentId(reply._id);
                                                      setEditingContent(reply.content);
                                                    }}
                                                    className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600"
                                                  >
                                                    EDIT
                                                  </button>
                                                  <button
                                                    onClick={() => handleDeleteComment(reply._id)}
                                                    className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500"
                                                  >
                                                    DELETE
                                                  </button>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="notes" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Personal Cipher Notes</h3>
                        <Button
                          onClick={handleSaveNote}
                          disabled={isSavingNote}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-sm text-[10px] font-black uppercase tracking-widest px-6 h-9 transition-all shadow-lg shadow-emerald-600/10"
                        >
                          {isSavingNote ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" /> : <Bookmark className="h-3.5 w-3.5 mr-2" />}
                          Sync to Cloud
                        </Button>
                      </div>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-sm" />
                        <textarea
                          placeholder="Initiate entry. All data is encrypted and private to your account..."
                          className="w-full min-h-[500px] p-8 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-sm focus:ring-1 focus:ring-emerald-500/50 transition-all outline-none text-sm leading-relaxed resize-none font-medium shadow-inner"
                          value={noteContent}
                          onChange={(e) => setNoteContent(e.target.value)}
                        />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">END OF PAYLOAD • SECURE STORAGE ACTIVE</p>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-6 border-t">
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={handlePrevLecture}
                    disabled={getAllLectures().findIndex(l => l._id === selectedLecture?._id) === 0}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous Lecture
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    Lecture {getAllLectures().findIndex(l => l._id === selectedLecture?._id) + 1} of {getTotalLectures()}
                  </div>
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={handleNextLecture}
                    disabled={getAllLectures().findIndex(l => l._id === selectedLecture?._id) === getAllLectures().length - 1}
                  >
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

      {/* Quiz Modal */}
      <Dialog open={!!activeQuiz} onOpenChange={(open) => !open && setActiveQuiz(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{activeQuiz?.title}</DialogTitle>
            <DialogDescription>
              Answer all questions and submit to see your result.
            </DialogDescription>
          </DialogHeader>

          {!quizResult ? (
            <div className="space-y-8 py-4">
              {activeQuiz?.questions?.map((q, qIndex) => (
                <div key={qIndex} className="space-y-4">
                  <p className="font-semibold text-lg">{qIndex + 1}. {q.question}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {q?.options?.map((option, oIndex) => (
                      <Button
                        key={oIndex}
                        variant={quizAnswers[qIndex] === oIndex ? "default" : "outline"}
                        className={`justify-start h-auto py-4 px-6 text-left whitespace-normal ${quizAnswers[qIndex] === oIndex ? "border-primary" : ""
                          }`}
                        onClick={() => setQuizAnswers({ ...quizAnswers, [qIndex]: oIndex })}
                      >
                        <span className="mr-3 font-bold opacity-50">{String.fromCharCode(65 + oIndex)}.</span>
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
              <DialogFooter className="sticky bottom-0 bg-background pt-4 border-t">
                <Button variant="outline" onClick={() => setActiveQuiz(null)}>Cancel</Button>
                <Button onClick={handleQuizSubmit} disabled={isSubmittingQuiz}>
                  {isSubmittingQuiz ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Submit Quiz"}
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <div className="py-12 text-center space-y-6">
              <div className={`mx-auto size-20 rounded-full flex items-center justify-center ${(quizResult.score / quizResult.totalQuestions) >= 0.7 ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"
                }`}>
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Quiz Completed!</h3>
                <p className="text-muted-foreground mt-2">
                  You scored <span className="text-foreground font-bold">{quizResult.score}</span> out of <span className="text-foreground font-bold">{quizResult.totalQuestions}</span>
                </p>
                <p className="text-sm font-medium mt-1">
                  ({Math.round((quizResult.score / quizResult.totalQuestions) * 100)}%)
                </p>
              </div>

              <div className="space-y-4 max-w-md mx-auto">
                <Progress value={(quizResult.score / quizResult.totalQuestions) * 100} className="h-3" />
                <p className="text-sm text-balance">
                  {(quizResult.score / quizResult.totalQuestions) >= 0.7
                    ? "Great job! You have a solid understanding of this topic."
                    : "You might want to review the material and try again to improve your score."}
                </p>
              </div>

              <Button className="w-full max-w-xs" onClick={() => setActiveQuiz(null)}>
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LecturesPage;