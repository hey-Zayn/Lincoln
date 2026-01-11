import React from 'react'
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
import {
    BookOpen,
    Clock,
    Calendar,
    Star,
    TrendingUp,
    Award,
    PlayCircle,
    ChevronRight,
    Users,
    FileText,
    CheckCircle2,
    BookMarked,
    Download,
    Share2,
    MoreVertical,
    BarChart3,
    Target,
} from 'lucide-react'

const StudentMyCourses = () => {
    // Mock data for enrolled courses
    const enrolledCourses = [
        {
            id: 1,
            title: "Advanced React Patterns",
            instructor: "Sarah Johnson",
            category: "Frontend Development",
            progress: 75,
            duration: "24 hours",
            lessons: 48,
            enrolledStudents: 2541,
            rating: 4.8,
            lastAccessed: "2 hours ago",
            status: "In Progress",
            thumbnailColor: "bg-blue-500",
            completionDate: "Estimated: Dec 15, 2024",
            nextLesson: "State Management with Zustand",
        },
        {
            id: 2,
            title: "Full-Stack Web Development",
            instructor: "Michael Chen",
            category: "Full Stack",
            progress: 30,
            duration: "42 hours",
            lessons: 96,
            enrolledStudents: 1872,
            rating: 4.9,
            lastAccessed: "1 day ago",
            status: "In Progress",
            thumbnailColor: "bg-green-500",
            completionDate: "Estimated: Jan 20, 2025",
            nextLesson: "Building REST APIs with Node.js",
        },
        {
            id: 3,
            title: "UI/UX Design Fundamentals",
            instructor: "Alex Rodriguez",
            category: "Design",
            progress: 100,
            duration: "18 hours",
            lessons: 32,
            enrolledStudents: 3120,
            rating: 4.7,
            lastAccessed: "Completed: Oct 28, 2024",
            status: "Completed",
            thumbnailColor: "bg-purple-500",
            completionDate: "Completed: Oct 28, 2024",
            certificate: true,
        },
        {
            id: 4,
            title: "Data Structures & Algorithms",
            instructor: "Dr. James Wilson",
            category: "Computer Science",
            progress: 15,
            duration: "36 hours",
            lessons: 72,
            enrolledStudents: 4215,
            rating: 4.6,
            lastAccessed: "3 days ago",
            status: "In Progress",
            thumbnailColor: "bg-orange-500",
            completionDate: "Estimated: Feb 10, 2025",
            nextLesson: "Binary Search Trees",
        },
        {
            id: 5,
            title: "DevOps Essentials",
            instructor: "Priya Sharma",
            category: "DevOps",
            progress: 0,
            duration: "28 hours",
            lessons: 56,
            enrolledStudents: 1568,
            rating: 4.8,
            lastAccessed: "Not started",
            status: "Not Started",
            thumbnailColor: "bg-red-500",
            completionDate: "Start learning today",
        },
        {
            id: 6,
            title: "Mobile App Development",
            instructor: "David Kim",
            category: "Mobile",
            progress: 90,
            duration: "32 hours",
            lessons: 64,
            enrolledStudents: 2893,
            rating: 4.9,
            lastAccessed: "Yesterday",
            status: "In Progress",
            thumbnailColor: "bg-indigo-500",
            completionDate: "Estimated: Nov 30, 2024",
            nextLesson: "App Store Deployment",
        },
    ]

    // Stats data
    const stats = [
        {
            title: "Active Courses",
            value: "4",
            icon: BookOpen,
            description: "Currently enrolled",
            color: "bg-blue-500/10",
            textColor: "text-blue-500",
        },
        {
            title: "Hours Studied",
            value: "156",
            icon: Clock,
            description: "This month",
            color: "bg-green-500/10",
            textColor: "text-green-500",
        },
        {
            title: "Completion Rate",
            value: "82%",
            icon: TrendingUp,
            description: "Overall progress",
            color: "bg-purple-500/10",
            textColor: "text-purple-500",
        },
        {
            title: "Achievements",
            value: "12",
            icon: Award,
            description: "Badges earned",
            color: "bg-orange-500/10",
            textColor: "text-orange-500",
        },
    ]

    // Recent activity
    const recentActivity = [
        {
            id: 1,
            action: "Completed lesson",
            course: "Advanced React Patterns",
            lesson: "Custom Hooks Deep Dive",
            time: "2 hours ago",
            icon: CheckCircle2,
        },
        {
            id: 2,
            action: "Submitted assignment",
            course: "Full-Stack Web Development",
            lesson: "CRUD API Implementation",
            time: "1 day ago",
            icon: FileText,
        },
        {
            id: 3,
            action: "Earned badge",
            course: "UI/UX Design Fundamentals",
            lesson: "Prototyping Master",
            time: "2 days ago",
            icon: Award,
        },
        {
            id: 4,
            action: "Joined course",
            course: "DevOps Essentials",
            lesson: "Course Introduction",
            time: "3 days ago",
            icon: BookMarked,
        },
    ]

    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-7xl">
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
                        <p className="text-muted-foreground">
                            Track your learning progress and continue your journey
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="gap-2">
                            <Download className="h-4 w-4" />
                            Certificates
                        </Button>
                        <Button className="gap-2">
                            <BookOpen className="h-4 w-4" />
                            Browse Courses
                        </Button>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat, index) => (
                        <Card key={index} className="border-border/50 hover:border-border transition-colors">
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

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Course List - 2/3 width */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-semibold">Enrolled Courses</h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                {enrolledCourses.filter(c => c.status === "In Progress").length} in progress • {enrolledCourses.filter(c => c.status === "Completed").length} completed
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                                All Courses
                            </Button>
                            <Button variant="outline" size="sm">
                                In Progress
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {enrolledCourses.map((course) => (
                            <Card key={course.id} className="overflow-hidden border-border/50 hover:shadow-md transition-shadow">
                                <div className="flex flex-col sm:flex-row">
                                    {/* Thumbnail */}
                                    <div className={`${course.thumbnailColor} sm:w-48 flex items-center justify-center p-8`}>
                                        <div className="text-center">
                                            <BookOpen className="h-12 w-12 text-white/90 mx-auto mb-3" />
                                            <span className="text-white/90 font-semibold text-sm">{course.category}</span>
                                        </div>
                                    </div>

                                    {/* Course Details */}
                                    <div className="flex-1">
                                        <CardHeader className="pb-4">
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <CardTitle className="text-lg">{course.title}</CardTitle>
                                                        <Badge
                                                            variant={
                                                                course.status === "Completed" ? "default" :
                                                                    course.status === "In Progress" ? "secondary" :
                                                                        "outline"
                                                            }
                                                            className="capitalize"
                                                        >
                                                            {course.status}
                                                        </Badge>
                                                    </div>
                                                    <CardDescription className="flex items-center gap-4">
                                                        <span className="flex items-center gap-1">
                                                            <Users className="h-3.5 w-3.5" />
                                                            {course.enrolledStudents.toLocaleString()} students
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                                            {course.rating}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="h-3.5 w-3.5" />
                                                            {course.duration}
                                                        </span>
                                                    </CardDescription>
                                                </div>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="pb-4">
                                            <div className="space-y-4">
                                                {/* Progress Bar */}
                                                <div>
                                                    <div className="flex justify-between text-sm mb-2">
                                                        <span className="font-medium">Progress</span>
                                                        <span className="text-muted-foreground">{course.progress}%</span>
                                                    </div>
                                                    <Progress value={course.progress} className="h-2" />
                                                </div>

                                                {/* Course Info */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <BookOpen className="h-4 w-4" />
                                                            <span>{course.lessons} lessons</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <Calendar className="h-4 w-4" />
                                                            <span>{course.completionDate}</span>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {course.nextLesson && (
                                                            <div className="flex items-center gap-2">
                                                                <PlayCircle className="h-4 w-4 text-primary" />
                                                                <span className="font-medium">Next: {course.nextLesson}</span>
                                                            </div>
                                                        )}
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <Clock className="h-4 w-4" />
                                                            <span>Last accessed: {course.lastAccessed}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>

                                        <CardFooter className="border-t pt-4">
                                            <div className="flex w-full justify-between">
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant={course.status === "Not Started" ? "default" : "outline"}
                                                        size="sm"
                                                        className="gap-2"
                                                    >
                                                        <PlayCircle className="h-4 w-4" />
                                                        {course.status === "Not Started" ? "Start Learning" : "Continue"}
                                                    </Button>
                                                    {course.certificate && (
                                                        <Button variant="ghost" size="sm" className="gap-2">
                                                            <Award className="h-4 w-4" />
                                                            View Certificate
                                                        </Button>
                                                    )}
                                                </div>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <Share2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </CardFooter>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Sidebar - 1/3 width */}
                <div className="space-y-6">
                    {/* Upcoming Deadlines */}
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Upcoming Deadlines
                            </CardTitle>
                            <CardDescription>Assignments and course milestones</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { course: "Full-Stack Web Development", task: "Final Project Submission", due: "in 3 days", priority: "high" },
                                { course: "Data Structures & Algorithms", task: "Mid-term Exam", due: "in 1 week", priority: "medium" },
                                { course: "Mobile App Development", task: "App Prototype", due: "in 2 weeks", priority: "medium" },
                            ].map((deadline, index) => (
                                <div key={index} className="space-y-2 pb-4 border-b last:border-0 last:pb-0">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="font-medium text-sm">{deadline.task}</p>
                                            <p className="text-sm text-muted-foreground">{deadline.course}</p>
                                        </div>
                                        <Badge
                                            variant={deadline.priority === "high" ? "destructive" : "outline"}
                                            className="text-xs"
                                        >
                                            {deadline.due}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full gap-2">
                                View All Deadlines
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Recent Activity */}
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <BarChart3 className="h-5 w-5" />
                                Recent Activity
                            </CardTitle>
                            <CardDescription>Your learning journey</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {recentActivity.map((activity) => (
                                <div key={activity.id} className="flex gap-3 pb-4 border-b last:border-0 last:pb-0">
                                    <div className={`h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0`}>
                                        <activity.icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-medium text-sm">{activity.action}</p>
                                        <p className="text-sm text-muted-foreground">{activity.lesson}</p>
                                        <p className="text-xs text-muted-foreground">{activity.course} • {activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                        <CardFooter>
                            <Button variant="ghost" className="w-full gap-2">
                                View Full History
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Learning Goals */}
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Target className="h-5 w-5" />
                                Learning Goals
                            </CardTitle>
                            <CardDescription>Track your monthly targets</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {[
                                { goal: "Complete 2 courses", progress: 50, current: "1/2 courses" },
                                { goal: "Spend 40 hours learning", progress: 78, current: "31.2/40 hours" },
                                { goal: "Complete all assignments", progress: 60, current: "3/5 assignments" },
                            ].map((goal, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium">{goal.goal}</span>
                                        <span className="text-muted-foreground">{goal.current}</span>
                                    </div>
                                    <Progress value={goal.progress} className="h-2" />
                                </div>
                            ))}
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" size="sm" className="w-full">
                                Update Goals
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default StudentMyCourses