import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    FileText,
    Clock,
    Calendar,
    Upload,
    CheckCircle2,
    AlertCircle,
    XCircle,
    Download,
    Eye,
    Edit,
    FileUp,
    CalendarDays,
    Award,
    BarChart3,
    Filter,
    Search,
    SortAsc,
    Paperclip,
    Link,
    BookOpen,
    Users,
    Timer,
    Send,
    FileCheck,
    FileX,
    MoreVertical, // Added the missing import
} from 'lucide-react'

const StudentAssignment = () => {
    const [selectedTab, setSelectedTab] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [submissionDialogOpen, setSubmissionDialogOpen] = useState(false)
    const [selectedAssignment, setSelectedAssignment] = useState(null)
    const [submissionText, setSubmissionText] = useState('')
    const [attachedFiles, setAttachedFiles] = useState([])

    // Mock assignments data
    const assignments = [
        {
            id: 1,
            title: "React Component Architecture",
            course: "Advanced React Patterns",
            status: "submitted",
            grade: "A-",
            dueDate: "2024-11-15",
            submittedDate: "2024-11-14",
            instructor: "Sarah Johnson",
            description: "Create a reusable component library with proper TypeScript types and Storybook documentation.",
            points: 100,
            earnedPoints: 92,
            feedback: "Excellent work! Great attention to component composition and TypeScript implementation.",
            attachments: ["design-specs.pdf", "requirements.md"],
            studentAttachments: ["component-library.zip"],
            submissionType: "file",
            difficulty: "medium",
            estimatedTime: "8-10 hours",
        },
        {
            id: 2,
            title: "REST API Implementation",
            course: "Full-Stack Web Development",
            status: "pending",
            grade: null,
            dueDate: "2024-11-20",
            submittedDate: null,
            instructor: "Michael Chen",
            description: "Build a complete CRUD API with authentication, validation, and proper error handling.",
            points: 150,
            earnedPoints: null,
            feedback: null,
            attachments: ["api-spec.json", "database-schema.sql"],
            studentAttachments: [],
            submissionType: "code",
            difficulty: "high",
            estimatedTime: "12-15 hours",
            daysLeft: 3,
        },
        {
            id: 3,
            title: "UI Design System",
            course: "UI/UX Design Fundamentals",
            status: "graded",
            grade: "A",
            dueDate: "2024-11-10",
            submittedDate: "2024-11-08",
            instructor: "Alex Rodriguez",
            description: "Design and prototype a complete design system including typography, colors, and components.",
            points: 120,
            earnedPoints: 118,
            feedback: "Outstanding work! Your design system is production-ready and well-documented.",
            attachments: ["design-brief.pdf", "style-guide.fig"],
            studentAttachments: ["design-system.fig", "documentation.pdf"],
            submissionType: "design",
            difficulty: "medium",
            estimatedTime: "10-12 hours",
        },
        {
            id: 4,
            title: "Binary Search Trees",
            course: "Data Structures & Algorithms",
            status: "overdue",
            grade: null,
            dueDate: "2024-11-05",
            submittedDate: null,
            instructor: "Dr. James Wilson",
            description: "Implement BST operations with proper time complexity analysis and test cases.",
            points: 80,
            earnedPoints: null,
            feedback: null,
            attachments: ["bst-requirements.pdf", "test-cases.java"],
            studentAttachments: [],
            submissionType: "code",
            difficulty: "high",
            estimatedTime: "6-8 hours",
            daysOverdue: 10,
        },
        {
            id: 5,
            title: "DevOps Pipeline",
            course: "DevOps Essentials",
            status: "draft",
            grade: null,
            dueDate: "2024-11-25",
            submittedDate: null,
            instructor: "Priya Sharma",
            description: "Set up a CI/CD pipeline with automated testing, building, and deployment.",
            points: 200,
            earnedPoints: null,
            feedback: null,
            attachments: ["pipeline-spec.yml", "infrastructure.md"],
            studentAttachments: ["pipeline-setup.zip"],
            submissionType: "file",
            difficulty: "high",
            estimatedTime: "15-20 hours",
            daysLeft: 7,
        },
        {
            id: 6,
            title: "App Prototype",
            course: "Mobile App Development",
            status: "graded",
            grade: "B+",
            dueDate: "2024-11-12",
            submittedDate: "2024-11-12",
            instructor: "David Kim",
            description: "Create a functional app prototype with at least 5 screens and user interactions.",
            points: 100,
            earnedPoints: 88,
            feedback: "Good work on the interactions. Consider improving the user flow in the onboarding screens.",
            attachments: ["app-requirements.pdf", "design-assets.zip"],
            studentAttachments: ["prototype.fig", "demo.mp4"],
            submissionType: "design",
            difficulty: "medium",
            estimatedTime: "8-10 hours",
        },
    ]

    // Statistics data
    const stats = [
        {
            title: "Total Assignments",
            value: assignments.length.toString(),
            icon: FileText,
            description: "This semester",
            color: "bg-blue-500/10",
            textColor: "text-blue-500",
        },
        {
            title: "Submitted",
            value: assignments.filter(a => a.status === "submitted" || a.status === "graded").length.toString(),
            icon: CheckCircle2,
            description: "On time",
            color: "bg-green-500/10",
            textColor: "text-green-500",
        },
        {
            title: "Pending",
            value: assignments.filter(a => a.status === "pending" || a.status === "draft").length.toString(),
            icon: Clock,
            description: "To be submitted",
            color: "bg-yellow-500/10",
            textColor: "text-yellow-500",
        },
        {
            title: "Average Grade",
            value: "A-",
            icon: Award,
            description: "Current standing",
            color: "bg-purple-500/10",
            textColor: "text-purple-500",
        },
    ]

    // Filter assignments based on tab and search
    const filteredAssignments = assignments.filter(assignment => {
        const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            assignment.course.toLowerCase().includes(searchQuery.toLowerCase())

        if (selectedTab === 'all') return matchesSearch
        if (selectedTab === 'pending') return matchesSearch && (assignment.status === 'pending' || assignment.status === 'draft')
        if (selectedTab === 'submitted') return matchesSearch && (assignment.status === 'submitted' || assignment.status === 'graded')
        if (selectedTab === 'graded') return matchesSearch && assignment.status === 'graded'
        if (selectedTab === 'overdue') return matchesSearch && assignment.status === 'overdue'

        return matchesSearch
    })

    const handleSubmitAssignment = (assignment) => {
        setSelectedAssignment(assignment)
        setSubmissionDialogOpen(true)
    }

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files)
        setAttachedFiles(prev => [...prev, ...files.map(file => ({
            name: file.name,
            size: file.size,
            type: file.type.split('/')[1] || 'file'
        }))])
    }

    const removeFile = (index) => {
        setAttachedFiles(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmission = () => {
        // In a real app, this would submit to an API
        console.log('Submitting:', { submissionText, attachedFiles })
        setSubmissionDialogOpen(false)
        setSubmissionText('')
        setAttachedFiles([])
    }

    const getStatusBadge = (status) => {
        switch (status) {
            case 'graded':
                return <Badge className="bg-green-500/20 text-green-600 hover:bg-green-500/30 border-green-200">Graded</Badge>
            case 'submitted':
                return <Badge className="bg-blue-500/20 text-blue-600 hover:bg-blue-500/30 border-blue-200">Submitted</Badge>
            case 'pending':
                return <Badge className="bg-yellow-500/20 text-yellow-600 hover:bg-yellow-500/30 border-yellow-200">Pending</Badge>
            case 'draft':
                return <Badge variant="outline" className="border-dashed">Draft</Badge>
            case 'overdue':
                return <Badge variant="destructive">Overdue</Badge>
            default:
                return null
        }
    }

    const getDifficultyBadge = (difficulty) => {
        switch (difficulty) {
            case 'low':
                return <Badge variant="outline" className="text-green-600 border-green-200">Easy</Badge>
            case 'medium':
                return <Badge variant="outline" className="text-yellow-600 border-yellow-200">Medium</Badge>
            case 'high':
                return <Badge variant="outline" className="text-red-600 border-red-200">Hard</Badge>
            default:
                return null
        }
    }

    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-7xl">
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>
                        <p className="text-muted-foreground">
                            Track, submit, and review your course assignments
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="gap-2">
                            <Download className="h-4 w-4" />
                            Export Grades
                        </Button>
                        <Button className="gap-2">
                            <CalendarDays className="h-4 w-4" />
                            Calendar View
                        </Button>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat, index) => (
                        <Card key={index} className="border-border/50">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-2xl font-bold">{stat.value}</p>
                                        <p className="text-sm font-medium text-muted-foreground mt-1">{stat.title}</p>
                                        <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                                    </div>
                                    <div className={`h-12 w-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                                        <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search assignments or courses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
                <div className="flex gap-3">
                    <Select defaultValue="all">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Due Date</SelectItem>
                            <SelectItem value="course">Course</SelectItem>
                            <SelectItem value="status">Status</SelectItem>
                            <SelectItem value="grade">Grade</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" className="gap-2">
                        <Filter className="h-4 w-4" />
                        Filter
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab} className="mb-8">
                <TabsList className="grid grid-cols-5 lg:w-auto">
                    <TabsTrigger value="all" className="gap-2">
                        <FileText className="h-4 w-4" />
                        All
                    </TabsTrigger>
                    <TabsTrigger value="pending" className="gap-2">
                        <Clock className="h-4 w-4" />
                        Pending
                    </TabsTrigger>
                    <TabsTrigger value="submitted" className="gap-2">
                        <Upload className="h-4 w-4" />
                        Submitted
                    </TabsTrigger>
                    <TabsTrigger value="graded" className="gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Graded
                    </TabsTrigger>
                    <TabsTrigger value="overdue" className="gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Overdue
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            {/* Assignments Grid */}
            {filteredAssignments.length === 0 ? (
                <Card className="text-center py-16 border-dashed">
                    <CardContent className="space-y-4">
                        <div className="h-12 w-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                            <FileCheck className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">No assignments found</h3>
                            <p className="text-muted-foreground max-w-md mx-auto">
                                {searchQuery ? 'No assignments match your search' : 'You have no assignments in this category'}
                            </p>
                        </div>
                        {searchQuery && (
                            <Button variant="outline" onClick={() => setSearchQuery('')} className="mt-4">
                                Clear Search
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredAssignments.map((assignment) => (
                        <Card key={assignment.id} className="overflow-hidden border-border/50 hover:shadow-md transition-shadow">
                            <CardHeader className="pb-4">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <CardTitle className="text-lg">{assignment.title}</CardTitle>
                                            {getStatusBadge(assignment.status)}
                                        </div>
                                        <div className="flex items-center gap-4 text-sm">
                                            <span className="flex items-center gap-1 text-muted-foreground">
                                                <BookOpen className="h-4 w-4" />
                                                {assignment.course}
                                            </span>
                                            <span className="flex items-center gap-1 text-muted-foreground">
                                                <Users className="h-4 w-4" />
                                                {assignment.instructor}
                                            </span>
                                        </div>
                                    </div>
                                    {assignment.grade && (
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-primary">{assignment.grade}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {assignment.earnedPoints}/{assignment.points} pts
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardHeader>

                            <CardContent className="pb-4 space-y-4">
                                <p className="text-sm text-muted-foreground line-clamp-2">{assignment.description}</p>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <div className="font-medium">Due Date</div>
                                                <div className={`text-sm ${assignment.status === 'overdue' ? 'text-destructive' : 'text-muted-foreground'}`}>
                                                    {new Date(assignment.dueDate).toLocaleDateString()}
                                                    {assignment.daysLeft && (
                                                        <span className="ml-2 text-yellow-600">({assignment.daysLeft} days left)</span>
                                                    )}
                                                    {assignment.daysOverdue && (
                                                        <span className="ml-2 text-destructive">({assignment.daysOverdue} days overdue)</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {assignment.submittedDate && (
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                <div>
                                                    <div className="font-medium">Submitted</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {new Date(assignment.submittedDate).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Timer className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <div className="font-medium">Estimated Time</div>
                                                <div className="text-sm text-muted-foreground">{assignment.estimatedTime}</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <div className="font-medium">Difficulty</div>
                                                {getDifficultyBadge(assignment.difficulty)}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Attachments */}
                                {assignment.attachments && assignment.attachments.length > 0 && (
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium">Provided Files</div>
                                        <div className="flex flex-wrap gap-2">
                                            {assignment.attachments.map((file, index) => (
                                                <Badge key={index} variant="outline" className="gap-1">
                                                    <Paperclip className="h-3 w-3" />
                                                    {file}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Feedback */}
                                {assignment.feedback && (
                                    <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                                        <div className="flex items-start gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <div className="font-medium text-green-800 dark:text-green-300 mb-1">Instructor Feedback</div>
                                                <p className="text-sm text-green-700 dark:text-green-400">{assignment.feedback}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>

                            <CardFooter className="border-t pt-4">
                                <div className="flex w-full gap-3">
                                    {(assignment.status === 'pending' || assignment.status === 'draft' || assignment.status === 'overdue') && (
                                        <Button
                                            onClick={() => handleSubmitAssignment(assignment)}
                                            className="gap-2 flex-1"
                                        >
                                            {assignment.status === 'draft' ? 'Continue Submission' : 'Submit Assignment'}
                                        </Button>
                                    )}

                                    {assignment.status === 'submitted' && (
                                        <Button variant="outline" className="gap-2 flex-1">
                                            <Eye className="h-4 w-4" />
                                            View Submission
                                        </Button>
                                    )}

                                    {assignment.status === 'graded' && (
                                        <Button variant="outline" className="gap-2 flex-1">
                                            <FileCheck className="h-4 w-4" />
                                            Review Feedback
                                        </Button>
                                    )}

                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[400px]">
                                            <DialogHeader>
                                                <DialogTitle>Assignment Actions</DialogTitle>
                                            </DialogHeader>
                                            <div className="space-y-2">
                                                <Button variant="ghost" className="w-full justify-start gap-2">
                                                    <Download className="h-4 w-4" />
                                                    Download Materials
                                                </Button>
                                                <Button variant="ghost" className="w-full justify-start gap-2">
                                                    <Link className="h-4 w-4" />
                                                    Request Extension
                                                </Button>
                                                <Button variant="ghost" className="w-full justify-start gap-2 text-destructive">
                                                    <FileX className="h-4 w-4" />
                                                    {assignment.status === 'submitted' ? 'Withdraw Submission' : 'Mark as Incomplete'}
                                                </Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            {/* Submission Dialog */}
            <Dialog open={submissionDialogOpen} onOpenChange={setSubmissionDialogOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Submit Assignment</DialogTitle>
                        <DialogDescription>
                            {selectedAssignment?.title} • {selectedAssignment?.course}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {/* Assignment Info */}
                        <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-semibold">{selectedAssignment?.title}</h4>
                                    <p className="text-sm text-muted-foreground">{selectedAssignment?.course}</p>
                                </div>
                                <Badge variant="outline" className="text-destructive">
                                    Due: {selectedAssignment && new Date(selectedAssignment.dueDate).toLocaleDateString()}
                                </Badge>
                            </div>
                            <p className="text-sm">{selectedAssignment?.description}</p>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-muted-foreground">Points: </span>
                                    <span className="font-medium">{selectedAssignment?.points}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Type: </span>
                                    <span className="font-medium capitalize">{selectedAssignment?.submissionType}</span>
                                </div>
                            </div>
                        </div>

                        {/* Submission Text */}
                        <div className="space-y-3">
                            <Label htmlFor="submission-text">Submission Notes (Optional)</Label>
                            <Textarea
                                id="submission-text"
                                placeholder="Add any comments or explanations about your submission..."
                                value={submissionText}
                                onChange={(e) => setSubmissionText(e.target.value)}
                                rows={4}
                                className="resize-none"
                            />
                        </div>

                        {/* File Upload */}
                        <div className="space-y-3">
                            <Label>Attach Files</Label>
                            <div className="border-2 border-dashed rounded-lg p-6 text-center">
                                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
                                <p className="text-sm text-muted-foreground mb-3">
                                    Drag and drop files here, or click to browse
                                </p>
                                <Input
                                    type="file"
                                    multiple
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    id="file-upload"
                                />
                                <Label htmlFor="file-upload">
                                    <Button variant="outline" type="button" className="cursor-pointer gap-2">
                                        <FileUp className="h-4 w-4" />
                                        Browse Files
                                    </Button>
                                </Label>
                            </div>
                        </div>

                        {/* Attached Files List */}
                        {attachedFiles.length > 0 && (
                            <div className="space-y-3">
                                <Label>Attached Files ({attachedFiles.length})</Label>
                                <div className="space-y-2">
                                    {attachedFiles.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
                                                    <FileText className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <div className="font-medium">{file.name}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {(file.size / 1024).toFixed(1)} KB • {file.type}
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeFile(index)}
                                                className="h-8 w-8 text-destructive hover:text-destructive"
                                            >
                                                <XCircle className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Submission Agreement */}
                        <div className="p-4 border rounded-lg bg-muted/30">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <p className="font-medium">Submission Agreement</p>
                                    <p className="text-sm text-muted-foreground">
                                        By submitting this assignment, you confirm that this is your own work and
                                        complies with academic integrity policies.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setSubmissionDialogOpen(false)}
                        >
                            Save as Draft
                        </Button>
                        <Button onClick={handleSubmission} className="gap-2">
                            <Send className="h-4 w-4" />
                            Submit Assignment
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default StudentAssignment