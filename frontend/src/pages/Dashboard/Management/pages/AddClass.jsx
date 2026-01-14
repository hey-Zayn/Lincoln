import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Building,
    Users,
    BookOpen,
    UserCheck,
    ArrowLeft,
    Save,
    X,
    AlertCircle,
    Plus,
    Trash2,
    User,
    GraduationCap,
    Loader2,
    CheckCircle2
} from 'lucide-react'
import { toast } from 'sonner'
import { useManagementStore } from '@/store/useManagementStore'
import { useAuthStore } from '@/store/useAuthStore'

const AddClass = () => {
    const navigate = useNavigate()
    const { departments, fetchDepartments, createClass, assignTeacher, addStudents, isCreating } = useManagementStore()
    const { managmentUsers, getAllManagementUsers } = useAuthStore()

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [createdClass, setCreatedClass] = useState(null)
    const [formData, setFormData] = useState({
        className: '',
        department: '',
        teacher: '',
        capacity: 50,
        description: '',
        assignedStudents: [],
    })

    useEffect(() => {
        fetchDepartments()
        getAllManagementUsers()
    }, [fetchDepartments, getAllManagementUsers])

    const teachers = managmentUsers.filter(u => u.role === 'teacher')
    const students = managmentUsers.filter(u => u.role === 'student')

    const availableStudents = students.filter(s => !formData.assignedStudents.some(as => as._id === s._id))

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleAddStudent = async (student) => {
        if (!createdClass) return

        if (formData.assignedStudents.length >= formData.capacity) {
            toast.error('Class capacity reached!')
            return
        }

        // Optimistic update
        setFormData(prev => ({
            ...prev,
            assignedStudents: [...prev.assignedStudents, student]
        }))

        // Call API
        const res = await addStudents({
            classId: createdClass._id || createdClass.class._id,
            studentIds: [student._id]
        })

        if (!res) {
            // Revert if failed
            setFormData(prev => ({
                ...prev,
                assignedStudents: prev.assignedStudents.filter(s => s._id !== student._id)
            }))
        } else {
            toast.success(`${student.firstName} ${student.lastName} added to class`)
        }
    }

    const handleRemoveStudent = (studentId) => {
        toast.info("To remove a student, please use the class management details page.")
    }

    const handleCreateClass = async (e) => {
        e.preventDefault()
        if (!formData.className || !formData.department) {
            toast.error('Please fill in all required fields')
            return
        }

        setIsSubmitting(true)
        const payload = {
            className: formData.className,
            department: formData.department,
            description: formData.description
        }

        const res = await createClass(payload)
        setIsSubmitting(false)

        if (res && res.success) {
            setCreatedClass(res.class) // Assuming res.class contains the object
            toast.success("Class created! Now you can assign teachers and students.")
        }
    }

    const handleAssignTeacher = async (teacherId) => {
        if (!createdClass) return;

        handleInputChange('teacher', teacherId); // Update local state for UI

        if (teacherId && teacherId !== 'none') {
            await assignTeacher({
                classId: createdClass._id || createdClass.class._id,
                teacherId: teacherId
            })
        }
    }

    const handleReset = () => {
        setFormData({
            className: '',
            department: '',
            teacher: '',
            capacity: 50,
            description: '',
            assignedStudents: [],
        })
        setCreatedClass(null)
        toast.info('Form reset')
    }

    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-6xl">
            {/* Header */}
            <div className="mb-8">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/management/classes')}
                    className="mb-6 gap-2 pl-0 hover:pl-2 transition-all"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Classes
                </Button>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">Create New Class</h1>
                        <p className="text-muted-foreground">
                            {createdClass ? "Step 2: Assign Members" : "Step 1: Class Details"}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        {!createdClass && (
                            <Button
                                variant="outline"
                                onClick={handleReset}
                                className="gap-2"
                                disabled={isSubmitting || isCreating}
                            >
                                <X className="h-4 w-4" />
                                Reset
                            </Button>
                        )}
                        {createdClass ? (
                            <Button
                                onClick={() => navigate('/management/classes')}
                                className="gap-2 bg-green-600 hover:bg-green-700"
                            >
                                <CheckCircle2 className="h-4 w-4" />
                                Finish & View Classes
                            </Button>
                        ) : (
                            <Button
                                onClick={handleCreateClass}
                                className="gap-2 bg-amber-600 hover:bg-amber-700"
                                disabled={isSubmitting || isCreating}
                            >
                                {isSubmitting || isCreating ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}
                                {isSubmitting || isCreating ? 'Creating...' : 'Create Class'}
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                {/* Class Information */}
                <Card className={createdClass ? "opacity-75 pointer-events-none" : ""}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-amber-600" />
                            Class Information
                        </CardTitle>
                        <CardDescription>
                            Basic details about the new class
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="className">Class Name *</Label>
                                    <Input
                                        id="className"
                                        value={formData.className}
                                        onChange={(e) => handleInputChange('className', e.target.value)}
                                        placeholder="e.g., CS-101: Intro to Programming"
                                        required
                                        disabled={!!createdClass}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="department">Department *</Label>
                                    <Select
                                        value={formData.department}
                                        onValueChange={(value) => handleInputChange('department', value)}
                                        disabled={!!createdClass}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select department" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {departments.map(dept => (
                                                <SelectItem key={dept._id} value={dept._id}>
                                                    <div className="flex items-center gap-2">
                                                        <Building className="h-4 w-4" />
                                                        {dept.name}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="capacity">Class Capacity</Label>
                                    <Input
                                        id="capacity"
                                        type="number"
                                        min="1"
                                        max="200"
                                        value={formData.capacity}
                                        onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || 0)}
                                        disabled={!!createdClass}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description (Optional)</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        placeholder="Brief description..."
                                        rows={4}
                                        disabled={!!createdClass}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Teacher & Student Assignment - Only visible/enabled after class creation */}
                <div className={!createdClass ? "opacity-50 pointer-events-none grayscale" : ""}>

                    <div className="grid grid-cols-1 gap-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <GraduationCap className="h-5 w-5 text-amber-600" />
                                    Assign Teacher
                                </CardTitle>
                                <CardDescription>Associate a teacher with this class</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="max-w-md space-y-2">
                                    <Label htmlFor="teacher">Teacher</Label>
                                    <Select
                                        value={formData.teacher}
                                        onValueChange={handleAssignTeacher}
                                        disabled={!createdClass}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select teacher (optional)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">No teacher assigned</SelectItem>
                                            {teachers.map(teacher => (
                                                <SelectItem key={teacher._id} value={teacher._id}>
                                                    <div className="flex items-center gap-2">
                                                        <GraduationCap className="h-4 w-4" />
                                                        {teacher.firstName} {teacher.lastName}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-amber-600" />
                                    Student Assignment
                                </CardTitle>
                                <CardDescription>
                                    Select students to enroll in this class
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Available Students */}
                                    <div className="space-y-4">
                                        <h3 className="font-medium">Available Students ({availableStudents.length})</h3>
                                        <div className="border rounded-lg max-h-64 overflow-y-auto">
                                            {availableStudents.length > 0 ? (
                                                <div className="divide-y">
                                                    {availableStudents.map(student => (
                                                        <div
                                                            key={student._id}
                                                            className="flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                                    <User className="h-4 w-4 text-primary" />
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium text-sm">{student.firstName} {student.lastName}</div>
                                                                    <div className="text-xs text-muted-foreground">{student.email}</div>
                                                                </div>
                                                            </div>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                type="button"
                                                                onClick={() => handleAddStudent(student)}
                                                                disabled={formData.assignedStudents.length >= formData.capacity || !createdClass}
                                                                className="h-8 w-8 p-0"
                                                            >
                                                                <Plus className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="p-8 text-center">
                                                    <p className="text-muted-foreground">No students available</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Assigned Students */}
                                    <div className="space-y-4">
                                        <h3 className="font-medium">Assigned Students ({formData.assignedStudents.length})</h3>
                                        <div className="border rounded-lg max-h-64 overflow-y-auto">
                                            {formData.assignedStudents.length > 0 ? (
                                                <div className="divide-y">
                                                    {formData.assignedStudents.map(student => (
                                                        <div
                                                            key={student._id}
                                                            className="flex items-center justify-between p-3"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
                                                                    <UserCheck className="h-4 w-4 text-green-600" />
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium text-sm">{student.firstName} {student.lastName}</div>
                                                                    <div className="text-xs text-muted-foreground">{student.email}</div>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="p-8 text-center">
                                                    <p className="text-muted-foreground">No students assigned yet</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddClass