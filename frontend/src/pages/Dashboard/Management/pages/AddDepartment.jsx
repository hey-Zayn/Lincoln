import React, { useState } from 'react'
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
import { Building, ArrowLeft, Save, X, Loader2 } from 'lucide-react'
import { useManagementStore } from '@/store/useManagementStore'

const AddDepartment = () => {
    const navigate = useNavigate()
    const { createDepartment, isCreating } = useManagementStore()
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    })

    const handleInputChange = (e) => {
        const { id, value } = e.target
        setFormData(prev => ({
            ...prev,
            [id]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const success = await createDepartment(formData)
        if (success) {
            navigate('/management/dashboard')
        }
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-2xl">
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
                            <Building className="h-5 w-5 text-amber-600" />
                            Add New Department
                        </CardTitle>
                        <CardDescription>
                            Create a new academic department in the system.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Department Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="e.g. Computer Science"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Briefly describe the department..."
                                rows={4}
                            />
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
                            Save Department
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    )
}

export default AddDepartment