import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
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
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  ChevronRight,
  ChevronLeft,
  Save,
  Trash2,
  Upload,
  Eye,
} from 'lucide-react';
import { toast } from 'sonner';

const STEPS = [
  { id: 'basic', title: 'Basic Info', description: 'Course title and basic details' },
  { id: 'content', title: 'Content', description: 'Course description and curriculum' },
  { id: 'media', title: 'Media', description: 'Upload course thumbnail and preview' },
];

const CreateCoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { createCourse, updateCourse, getCourseById, isCreating, isUpdating } = useCourseStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    courseLevel: "Beginner",
    CourseLanguage: "English",
    price: 0,
    thumbnail: "",
    previewVideo: "",
    learningOutcomes: [""],
    requirements: [""],
    isPublished: false
  });

  const [isEditing, setIsEditing] = useState(false);

  // Load course data if editing
  useEffect(() => {
    if (id) {
      setIsEditing(true);
      getCourseById(id).then(course => {
        if (course) {
          setFormData({
            title: course.title || "",
            description: course.description || "",
            category: course.category || "",
            courseLevel: course.courseLevel || "Beginner",
            CourseLanguage: course.CourseLanguage || "English",
            price: course.price || 0,
            thumbnail: course.thumbnail || "",
            previewVideo: course.previewVideo || "",
            learningOutcomes: course.learningOutcomes?.length ? [...course.learningOutcomes] : [""],
            requirements: course.requirements?.length ? [...course.requirements] : [""],
            isPublished: course.isPublished || false
          });
        }
      });
    }
  }, [id, getCourseById]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (index, value, field) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const addItem = (field) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const removeItem = (index, field) => {
    if (formData[field].length > 1) {
      const newArray = formData[field].filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, [field]: newArray }));
    }
  };

  const handleFileUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result }));
        toast.success("File uploaded successfully");
      };
      reader.readAsDataURL(file);
    }
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 0:
        if (!formData.title.trim()) {
          toast.error("Please enter a course title");
          return false;
        }
        if (!formData.category) {
          toast.error("Please select a category");
          return false;
        }
        return true;

      case 1:
        if (!formData.description.trim()) {
          toast.error("Please enter a course description");
          return false;
        }
        // Check if at least one learning outcome is filled
        const hasLearningOutcomes = formData.learningOutcomes.some(item => item.trim());
        if (!hasLearningOutcomes) {
          toast.error("Please add at least one learning outcome");
          return false;
        }
        return true;

      case 2:
        if (!formData.thumbnail) {
          toast.error("Please upload a course thumbnail");
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const validateAllSteps = () => {
    // Validate all steps
    for (let i = 0; i < STEPS.length; i++) {
      switch (i) {
        case 0:
          if (!formData.title.trim()) {
            toast.error("Please enter a course title");
            return false;
          }
          if (!formData.category) {
            toast.error("Please select a category");
            return false;
          }
          break;

        case 1:
          if (!formData.description.trim()) {
            toast.error("Please enter a course description");
            return false;
          }
          const hasLearningOutcomes = formData.learningOutcomes.some(item => item.trim());
          if (!hasLearningOutcomes) {
            toast.error("Please add at least one learning outcome");
            return false;
          }
          break;

        case 2:
          if (!formData.thumbnail) {
            toast.error("Please upload a course thumbnail");
            return false;
          }
          break;
      }
    }
    return true;
  };

  const handleSaveDraft = async () => {
    if (!validateCurrentStep()) return;

    try {
      const cleanData = {
        ...formData,
        learningOutcomes: formData.learningOutcomes.filter(item => item.trim()),
        requirements: formData.requirements.filter(item => item.trim()),
        price: parseFloat(formData.price) || 0,
        isPublished: false
      };

      if (isEditing) {
        await updateCourse(id, cleanData);
        toast.success("Draft saved successfully");
      } else {
        await createCourse(cleanData);
        toast.success("Course draft created successfully");
      }
    } catch (error) {
      toast.error("Failed to save draft");
      console.error(error);
    }
  };

  const nextStep = () => {
    if (!validateCurrentStep()) return;

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handlePublish = async () => {
    // Validate all steps before publishing
    if (!validateAllSteps()) return;

    try {
      const cleanData = {
        ...formData,
        learningOutcomes: formData.learningOutcomes.filter(item => item.trim()),
        requirements: formData.requirements.filter(item => item.trim()),
        price: parseFloat(formData.price) || 0,
        isPublished: true
      };

      if (isEditing) {
        await updateCourse(id, cleanData);
        toast.success("Course published successfully!");
        navigate('/teacher/courses');
      } else {
        await createCourse(cleanData);
        toast.success("Course created and published successfully!");
        navigate('/teacher/courses');
      }
    } catch (error) {
      toast.error(error.message || "Failed to publish course");
      console.error(error);
    }
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Course Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter course title"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Web Development">Web Development</SelectItem>
                    <SelectItem value="Mobile Development">Mobile Development</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="courseLevel">Difficulty Level</Label>
                  <Select
                    value={formData.courseLevel}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, courseLevel: value }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="CourseLanguage">Language</Label>
                  <Select
                    value={formData.CourseLanguage}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, CourseLanguage: value }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Urdu">Urdu</SelectItem>
                      <SelectItem value="Hindi">Hindi</SelectItem>
                      <SelectItem value="Spanish">Spanish</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="description">Course Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your course in detail..."
                className="mt-1 min-h-[200px]"
                required
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Learning Outcomes *</Label>
                  <p className="text-sm text-muted-foreground">What students will learn</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addItem('learningOutcomes')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>

              <div className="space-y-3">
                {formData.learningOutcomes.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={item}
                      onChange={(e) => handleArrayChange(index, e.target.value, 'learningOutcomes')}
                      placeholder="e.g., Build a complete web application"
                      required={index === 0}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index, 'learningOutcomes')}
                      disabled={formData.learningOutcomes.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Requirements (Optional)</Label>
                  <p className="text-sm text-muted-foreground">Prerequisites for this course</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addItem('requirements')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>

              <div className="space-y-3">
                {formData.requirements.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={item}
                      onChange={(e) => handleArrayChange(index, e.target.value, 'requirements')}
                      placeholder="e.g., Basic programming knowledge"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index, 'requirements')}
                      disabled={formData.requirements.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Thumbnail Upload */}
              <Card>
                <CardHeader>
                  <CardTitle>Course Thumbnail *</CardTitle>
                  <CardDescription>Upload an image for your course</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {formData.thumbnail ? (
                      <div className="relative aspect-video rounded-lg overflow-hidden border">
                        <img
                          src={formData.thumbnail}
                          alt="Course thumbnail"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video border-2 border-dashed rounded-lg flex flex-col items-center justify-center">
                        <Upload className="h-12 w-12 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">No thumbnail uploaded</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'thumbnail')}
                        className="hidden"
                        id="thumbnail-upload"
                      />
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => document.getElementById('thumbnail-upload').click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {formData.thumbnail ? 'Change Image' : 'Upload Image'}
                      </Button>

                      {formData.thumbnail && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => window.open(formData.thumbnail, '_blank')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Preview Video Upload */}
              <Card>
                <CardHeader>
                  <CardTitle>Preview Video (Optional)</CardTitle>
                  <CardDescription>Optional course preview video</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {formData.previewVideo ? (
                      <div className="relative aspect-video rounded-lg overflow-hidden border">
                        <video
                          src={formData.previewVideo}
                          className="w-full h-full object-cover"
                          controls
                        />
                      </div>
                    ) : (
                      <div className="aspect-video border-2 border-dashed rounded-lg flex flex-col items-center justify-center">
                        <Upload className="h-12 w-12 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">No video uploaded</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Input
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleFileUpload(e, 'previewVideo')}
                        className="hidden"
                        id="video-upload"
                      />
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => document.getElementById('video-upload').click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {formData.previewVideo ? 'Change Video' : 'Upload Video'}
                      </Button>

                      {formData.previewVideo && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => window.open(formData.previewVideo, '_blank')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline">
            {isEditing ? 'Editing Course' : 'Creating Course'}
          </Badge>
          <Badge variant="secondary">
            Step {currentStep + 1} of {STEPS.length}
          </Badge>
        </div>

        <h1 className="text-3xl font-bold tracking-tight">
          {isEditing ? 'Edit Course' : 'Create New Course'}
        </h1>
        <p className="text-muted-foreground mt-2">
          {STEPS[currentStep].description}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-sm font-medium">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />

        {/* Step Indicators */}
        <div className="flex justify-between mt-6">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center mb-2
                ${currentStep >= index
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
                }
              `}>
                {index + 1}
              </div>
              <span className={`
                text-sm font-medium
                ${currentStep >= index ? 'text-foreground' : 'text-muted-foreground'}
              `}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{STEPS[currentStep].title}</CardTitle>
          <CardDescription>
            Complete all required fields to proceed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="min-h-[400px]">
            {renderStep()}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {isEditing && (
            <Link to={`/teacher/courses/${id}/curriculum`}>
              <Button variant="outline">
                Manage Curriculum
              </Button>
            </Link>
          )}
          <Button
            variant="ghost"
            onClick={() => navigate('/teacher/courses')}
          >
            Cancel
          </Button>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          {currentStep < STEPS.length - 1 ? (
            <Button
              onClick={nextStep}
              className="gap-2"
            >
              Next Step
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                disabled={isCreating || isUpdating}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                Save as Draft
              </Button>
              <Button
                onClick={handlePublish}
                disabled={isCreating || isUpdating}
              >
                {isCreating || isUpdating ? 'Publishing...' : (isEditing ? 'Update Course' : 'Publish Course')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateCoursePage;