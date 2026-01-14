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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Calendar, ArrowLeft, Save, X, Loader2, Clock, BookOpen, User } from 'lucide-react'
import { useManagementStore } from '@/store/useManagementStore'
import { useAuthStore } from '@/store/useAuthStore'

const AddTimetable = () => {
    const navigate = useNavigate()
    const { classes, fetchClasses, createTimetableEntry, isCreating } = useManagementStore()
    const { managmentUsers, getAllManagementUsers } = useAuthStore()

    const [formData, setFormData] = useState({
        classId: '',
        day: '',
        startTime: '',
        endTime: '',
        subject: '',
        teacher: '',
    })

    useEffect(() => {
        fetchClasses()
        getAllManagementUsers()
    }, [fetchClasses, getAllManagementUsers])

    const teachers = managmentUsers.filter(u => u.role === 'teacher')

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const payload = {
            class: formData.classId,
            day: formData.day,
            startTime: formData.startTime,
            endTime: formData.endTime,
            subject: formData.subject,
            teacher: formData.teacher || undefined
        }

        const res = await createTimetableEntry(payload)
        if (res) {
            navigate('/management/dashboard')
        }
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-3xl">
            <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="mb-6 gap-2 pl-0 hover:pl-2 transition-all"
            >
                <ArrowLeft className="h-4 w-4" />
                Back
            </Button>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-amber-600" />
                            Add Timetable Entry
                        </CardTitle>
                        <CardDescription>
                            Schedule a subject for a specific class and time.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="classId">Select Class *</Label>
                                <Select
                                    value={formData.classId}
                                    onValueChange={(v) => handleInputChange('classId', v)}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose a class" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {classes.map(c => (
                                            <SelectItem key={c._id} value={c._id}>
                                                {c.className}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="day">Day of Week *</Label>
                                <Select
                                    value={formData.day}
                                    onValueChange={(v) => handleInputChange('day', v)}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select day" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {days.map(day => (
                                            <SelectItem key={day} value={day}>{day}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="startTime">Start Time *</Label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="startTime"
                                        type="time"
                                        className="pl-10"
                                        value={formData.startTime}
                                        onChange={(e) => handleInputChange('startTime', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="endTime">End Time *</Label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="endTime"
                                        type="time"
                                        className="pl-10"
                                        value={formData.endTime}
                                        onChange={(e) => handleInputChange('endTime', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject *</Label>
                            <div className="relative">
                                <BookOpen className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="subject"
                                    placeholder="e.g. Mathematics"
                                    className="pl-10"
                                    value={formData.subject}
                                    onChange={(e) => handleInputChange('subject', e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="teacher">Teacher (Optional Override)</Label>
                            <Select
                                value={formData.teacher}
                                onValueChange={(v) => handleInputChange('teacher', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select teacher" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Use class default</SelectItem>
                                    {teachers.map(t => (
                                        <SelectItem key={t._id} value={t._id}>
                                            {t.firstName} {t.lastName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-3 border-t pt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate(-1)}
                            disabled={isCreating}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isCreating} className="bg-amber-600 hover:bg-amber-700">
                            {isCreating ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <Save className="h-4 w-4 mr-2" />
                            )}
                            Save Schedule
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    )
}

export default AddTimetable