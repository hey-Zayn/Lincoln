import React, { useState, useEffect } from 'react'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from "@/components/ui/textarea"
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
    Building,
    Users,
    Calendar,
    Clock,
    BookOpen,
    Plus,
    Edit,
    Trash2,
    Search,
    Filter,
    GraduationCap,
    ChevronRight,
    Download,
    Upload,
    Copy,
    Eye,
    BarChart3,
    Settings,
    Loader2
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useManagementStore } from '@/store/useManagementStore'
import { useAuthStore } from '@/store/useAuthStore'

const ManagementClasses = () => {
    const [activeTab, setActiveTab] = useState('classes')
    const [searchQuery, setSearchQuery] = useState('')

    const {
        departments,
        classes,
        timetables,
        fetchDepartments,
        fetchClasses,
        fetchTimetable,
        isLoading
    } = useManagementStore()
    // console.log(classes);
    const { managmentUsers, getAllManagementUsers } = useAuthStore()

    useEffect(() => {
        fetchDepartments()
        fetchClasses()
        getAllManagementUsers()
    }, [fetchDepartments, fetchClasses, getAllManagementUsers])

    // Fetch timetables for all classes (lazy loading in detailed view might be better for scale, but manageable here)
    useEffect(() => {
        if (classes.length > 0) {
            classes.forEach(cls => {
                if (!timetables[cls._id]) {
                    fetchTimetable(cls._id)
                }
            })
        }
    }, [classes, fetchTimetable, timetables])

    // Flatten all timetables into a single array for the view
    const allTimetableEntries = Object.values(timetables).flat()

    const getDayColor = (day) => {
        const colors = {
            Monday: 'bg-blue-500/10 text-blue-600 border-blue-200',
            Tuesday: 'bg-purple-500/10 text-purple-600 border-purple-200',
            Wednesday: 'bg-green-500/10 text-green-600 border-green-200',
            Thursday: 'bg-orange-500/10 text-orange-600 border-orange-200',
            Friday: 'bg-red-500/10 text-red-600 border-red-200',
            Saturday: 'bg-indigo-500/10 text-indigo-600 border-indigo-200',
            Sunday: 'bg-gray-500/10 text-gray-600 border-gray-200',
        }
        return colors[day] || 'bg-gray-500/10 text-gray-600 border-gray-200'
    }

    const getTimePeriod = (time) => {
        const hour = parseInt(time.split(':')[0])
        if (hour < 12) return 'Morning'
        if (hour < 17) return 'Afternoon'
        return 'Evening'
    }

    const getTeacherName = (id) => {
        const teacher = managmentUsers.find(u => u._id === id)
        return teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Unassigned'
    }

    const getDepartmentName = (id) => {
        const dept = departments.find(d => d._id === id)
        return dept ? dept.name : 'Unknown Dept'
    }

    const getClassName = (id) => {
        const cls = classes.find(c => c._id === id)
        return cls ? cls.className : 'Unknown Class'
    }

    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-7xl">
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">Academic Management</h1>
                        <p className="text-muted-foreground">
                            Manage departments, classes, and timetables across the institution
                        </p>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Card className="border-border/50">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-bold">{departments.length}</p>
                                    <p className="text-sm font-medium text-muted-foreground mt-1">Departments</p>
                                </div>
                                <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                    <Building className="h-6 w-6 text-blue-500" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-bold">{classes.length}</p>
                                    <p className="text-sm font-medium text-muted-foreground mt-1">Active Classes</p>
                                </div>
                                <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                                    <BookOpen className="h-6 w-6 text-green-500" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-bold">
                                        {/* Sum of students in all classes */}
                                        {classes.reduce((acc, curr) => acc + (curr.students?.length || 0), 0)}
                                    </p>
                                    <p className="text-sm font-medium text-muted-foreground mt-1">Total Enrollments</p>
                                </div>
                                <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                    <Users className="h-6 w-6 text-purple-500" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-bold">{allTimetableEntries.length}</p>
                                    <p className="text-sm font-medium text-muted-foreground mt-1">Scheduled Sessions</p>
                                </div>
                                <div className="h-12 w-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
                                    <Calendar className="h-6 w-6 text-orange-500" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Main Content */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <TabsList className="grid grid-cols-3">
                        <TabsTrigger value="classes" className="gap-2">
                            <BookOpen className="h-4 w-4" />
                            Classes
                        </TabsTrigger>
                        <TabsTrigger value="departments" className="gap-2">
                            <Building className="h-4 w-4" />
                            Departments
                        </TabsTrigger>
                        <TabsTrigger value="timetable" className="gap-2">
                            <Calendar className="h-4 w-4" />
                            Timetable
                        </TabsTrigger>
                    </TabsList>

                    <div className="flex gap-3">
                        <div className="relative flex-1 sm:w-64">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </div>

                {/* Classes Tab */}
                <TabsContent value="classes" className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-semibold">Class Management</h2>
                            <p className="text-sm text-muted-foreground">Create and manage academic classes</p>
                        </div>
                        <Link to="/management/classes/new">
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" />
                                Add New Class
                            </Button>
                        </Link>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {classes.filter(c => c.className.toLowerCase().includes(searchQuery.toLowerCase())).map(cls => (
                                <Card key={cls._id} className="hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-2">
                                                <CardTitle className="text-lg">{cls.className}</CardTitle>
                                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                    <Badge variant="outline" className="gap-1">
                                                        <Building className="h-3 w-3" />
                                                        {getDepartmentName(cls.department)}
                                                    </Badge>
                                                    <span className="flex items-center gap-1">
                                                        <GraduationCap className="h-3.5 w-3.5" />
                                                        {getTeacherName(cls.teacher)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <Edit className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm">Enrollment</span>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-semibold">{cls.students?.length || 0}/{cls.capacity || 50} students</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {Math.round(((cls.students?.length || 0) / (cls.capacity || 50)) * 100)}% capacity
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary rounded-full relative"
                                                    style={{ width: `${((cls.students?.length || 0) / (cls.capacity || 50)) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="pt-4 border-t">
                                        <Button variant="outline" size="sm" className="w-full gap-2">
                                            <Eye className="h-4 w-4" />
                                            View Details
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                            {classes.length === 0 && (
                                <div className="col-span-2 text-center py-12 text-muted-foreground">
                                    No classes found. Create one to get started.
                                </div>
                            )}
                        </div>
                    )}
                </TabsContent>

                {/* Departments Tab */}
                <TabsContent value="departments" className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-semibold">Department Management</h2>
                            <p className="text-sm text-muted-foreground">Organize academic departments and faculties</p>
                        </div>
                        <Link to={'/management/departments'}>
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" />
                                Add Department
                            </Button>
                        </Link>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {departments.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase())).map(dept => (
                                <Card key={dept._id} className="hover:shadow-md transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-2">
                                                <CardTitle className="text-lg flex items-center gap-2">
                                                    {dept.name}
                                                </CardTitle>
                                                <CardDescription>{dept.description}</CardDescription>
                                            </div>
                                            <div className="flex gap-1">
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <Edit className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardFooter className="pt-4 border-t">
                                        <div className="flex gap-2 w-full">
                                            <Button variant="outline" size="sm" className="flex-1 gap-2">
                                                <Users className="h-4 w-4" />
                                                Details
                                            </Button>
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))}
                            {departments.length === 0 && (
                                <div className="col-span-2 text-center py-12 text-muted-foreground">
                                    No departments found. Create one to get started.
                                </div>
                            )}
                        </div>
                    )}
                </TabsContent>

                {/* Timetable Tab */}
                <TabsContent value="timetable" className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-semibold">Timetable Management</h2>
                            <p className="text-sm text-muted-foreground">Schedule and manage class sessions</p>
                        </div>
                        <div className="flex gap-3">
                            <Link to={'/management/timetable'}>
                                <Button className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Add Session
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Weekly Timetable View */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Weekly Schedule
                            </CardTitle>
                            <CardDescription>
                                View all scheduled sessions for the current week
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Day Headers */}
                                <div className="grid grid-cols-7 gap-2 mb-4">
                                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                                        <div key={day} className="text-center p-3 rounded-lg bg-muted/50 hidden sm:block">
                                            <div className="font-medium text-sm">{day.slice(0, 3)}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {allTimetableEntries.filter(t => t.day === day).length} sessions
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Timetable Sessions */}
                                <div className="space-y-3">
                                    {allTimetableEntries.length > 0 ? allTimetableEntries.map(session => (
                                        <div
                                            key={session._id}
                                            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors gap-4"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`h-12 w-12 rounded-lg flex items-center justify-center shrink-0 ${getDayColor(session.day)}`}>
                                                    <Calendar className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <div className="font-medium">{session.className || getClassName(session.class)}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {session.subject}
                                                    </div>
                                                    <div className="flex items-center gap-3 mt-1 text-xs">
                                                        <Badge variant="outline" className="gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            {session.startTime} - {session.endTime}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 justify-between sm:justify-end w-full sm:w-auto">
                                                <Badge className={getDayColor(session.day)}>
                                                    {session.day}
                                                </Badge>
                                                <div className="flex gap-1">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <Edit className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="text-center py-8 text-muted-foreground">
                                            No sessions scheduled.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default ManagementClasses