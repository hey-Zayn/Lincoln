import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import {
   User,
   Mail,
   Lock,
   Phone,
   MapPin,
   Shield,
   ArrowLeft,
   CheckCircle2,
   FileText,
   Upload,
   ChevronRight,
   ChevronLeft,
   Hash,
   Briefcase,
   Users,
   Building,
   AlertCircle,
   Key,
   Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import axiosInstance from '../../../../axios/axiosInstance';
import { useNavigate } from 'react-router-dom';

const AdminAddNewUser = () => {
   const navigate = useNavigate();
   const [currentStep, setCurrentStep] = useState(1);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [formData, setFormData] = useState({
      // Step 1: Basic Information
      firstName: '',
      lastName: '',
      userName: '',
      email: '',
      phone: '',
      role: 'student',

      // Step 2: Additional Information
      address: '',
      nationalID: '',
      bio: '',

      // Step 3: Security & Verification
      password: '',
      confirmPassword: '',
      isVerified: false,
      profilePicture: '',
      verificationCode: '', // New field for verification code
   });

   const steps = [
      { number: 1, title: 'Basic Information', icon: User },
      { number: 2, title: 'Additional Details', icon: FileText },
      { number: 3, title: 'Security & Access', icon: Shield },
      { number: 4, title: 'Final Review', icon: CheckCircle2 },
   ];

   const handleInputChange = (field, value) => {
      setFormData(prev => ({
         ...prev,
         [field]: value
      }));
   };

   const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
         setFormData(prev => ({ ...prev, profilePicture: reader.result }));
      };
   };

   const handleNext = () => {
      if (currentStep < steps.length) {
         setCurrentStep(currentStep + 1);
      }
   };

   const handlePrevious = () => {
      if (currentStep > 1) {
         setCurrentStep(currentStep - 1);
      }
   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      // Validate all required fields
      if (!validateAllSteps()) {
         toast.error('Please fill all required fields correctly');
         return;
      }

      setIsSubmitting(true);

      try {
         // Prepare form data for API
         const submitData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            userName: formData.userName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            nationalID: formData.nationalID,
            password: formData.password,
            role: formData.role,
            bio: formData.bio || '',
            profilePicture: formData.profilePicture || '',
            isVerified: formData.isVerified,
         };

         // If verification code is provided, include it
         if (formData.verificationCode) {
            submitData.verificationCode = formData.verificationCode;
         }

         console.log('Submitting user data:', submitData);

         const response = await axiosInstance.post('/users/register', submitData);

         if (response.data.success) {
            toast.success('User created successfully!');

            navigate('/admin/users');
         } else {
            toast.error(response.data.message || 'Failed to create user');
         }
      } catch (error) {
         console.error('Registration error:', error);
         const errorMessage = error.response?.data?.message ||
            error.response?.data?.errors?.[0]?.msg ||
            'Failed to create user. Please try again.';
         toast.error(errorMessage);
      } finally {
         setIsSubmitting(false);
      }
   };

   const validateStep = () => {
      switch (currentStep) {
         case 1:
            return formData.firstName && formData.lastName && formData.email && formData.role;
         case 2:
            return formData.address && formData.nationalID;
         case 3:
            return formData.password && formData.confirmPassword &&
               formData.password === formData.confirmPassword &&
               formData.password.length >= 8;
         case 4:
            return true; // Final step just shows review
         default:
            return false;
      }
   };

   const validateAllSteps = () => {
      return formData.firstName &&
         formData.lastName &&
         formData.userName &&
         formData.email &&
         formData.phone &&
         formData.address &&
         formData.nationalID &&
         formData.password &&
         formData.confirmPassword &&
         formData.password === formData.confirmPassword &&
         formData.password.length >= 8;
   };

   const getStepProgress = () => {
      return (currentStep / steps.length) * 100;
   };

   return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-4 md:p-6 lg:p-8">
         <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
               <Link to="/admin/users" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4 group">
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  <span className="font-medium">Back to User Management</span>
               </Link>

               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                     <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Create New User</h1>
                     <p className="text-muted-foreground mt-2">
                        Add a new user to the system with appropriate permissions and access
                     </p>
                  </div>
                  <Badge variant="outline" className="h-fit gap-2 px-3 py-1.5">
                     <Shield className="h-3.5 w-3.5" />
                     Administrative Action
                  </Badge>
               </div>
            </div>

            {/* Progress Steps */}
            <Card className="mb-8">
               <CardContent className="p-6">
                  <div className="mb-4">
                     <Progress value={getStepProgress()} className="h-2" />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     {steps.map((step) => {
                        const StepIcon = step.icon;
                        const isActive = step.number === currentStep;
                        const isCompleted = step.number < currentStep;

                        return (
                           <div
                              key={step.number}
                              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${isActive
                                 ? 'bg-primary/10 border border-primary/20'
                                 : isCompleted
                                    ? 'bg-green-500/10 border border-green-500/20'
                                    : 'bg-muted/50'
                                 }`}
                           >
                              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${isActive
                                 ? 'bg-primary text-primary-foreground'
                                 : isCompleted
                                    ? 'bg-green-500 text-white'
                                    : 'bg-muted text-muted-foreground'
                                 }`}>
                                 <StepIcon className="h-5 w-5" />
                              </div>
                              <div className="flex-1">
                                 <div className="text-sm font-medium">Step {step.number}</div>
                                 <div className="text-xs text-muted-foreground">{step.title}</div>
                              </div>
                              {isCompleted && (
                                 <CheckCircle2 className="h-5 w-5 text-green-500" />
                              )}
                           </div>
                        );
                     })}
                  </div>
               </CardContent>
            </Card>

            <form onSubmit={handleSubmit} className="space-y-8">
               {/* Step 1: Basic Information */}
               {currentStep === 1 && (
                  <Card>
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <User className="h-5 w-5" />
                           Basic Information
                        </CardTitle>
                        <CardDescription>
                           Enter the user's essential personal details
                        </CardDescription>
                     </CardHeader>
                     <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-4">
                              <div className="space-y-2">
                                 <Label htmlFor="firstName" className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    First Name *
                                 </Label>
                                 <Input
                                    id="firstName"
                                    value={formData.firstName}
                                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                                    placeholder="Enter first name"
                                    required
                                 />
                              </div>

                              <div className="space-y-2">
                                 <Label htmlFor="lastName" className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    Last Name *
                                 </Label>
                                 <Input
                                    id="lastName"
                                    value={formData.lastName}
                                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                                    placeholder="Enter last name"
                                    required
                                 />
                              </div>

                              <div className="space-y-2">
                                 <Label htmlFor="userName" className="flex items-center gap-2">
                                    <Hash className="h-4 w-4" />
                                    Username *
                                 </Label>
                                 <Input
                                    id="userName"
                                    value={formData.userName}
                                    onChange={(e) => handleInputChange('userName', e.target.value)}
                                    placeholder="Enter username"
                                    required
                                 />
                              </div>
                           </div>

                           <div className="space-y-4">
                              <div className="space-y-2">
                                 <Label htmlFor="email" className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    Email Address *
                                 </Label>
                                 <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    placeholder="user@example.com"
                                    required
                                 />
                              </div>

                              <div className="space-y-2">
                                 <Label htmlFor="phone" className="flex items-center gap-2">
                                    <Phone className="h-4 w-4" />
                                    Phone Number *
                                 </Label>
                                 <Input
                                    id="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    placeholder="+1 (555) 000-0000"
                                    required
                                 />
                              </div>

                              <div className="space-y-2">
                                 <Label htmlFor="role" className="flex items-center gap-2">
                                    <Briefcase className="h-4 w-4" />
                                    System Role *
                                 </Label>
                                 <Select
                                    value={formData.role}
                                    onValueChange={(value) => handleInputChange('role', value)}
                                 >
                                    <SelectTrigger>
                                       <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                       <SelectItem value="student">Student</SelectItem>
                                       <SelectItem value="teacher">Teacher</SelectItem>
                                       <SelectItem value="parent">Parent</SelectItem>
                                       <SelectItem value="management">Management</SelectItem>
                                       <SelectItem value="admin">Administrator</SelectItem>
                                    </SelectContent>
                                 </Select>
                              </div>
                           </div>
                        </div>

                        {/* Role Description */}
                        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                           <div className="flex items-start gap-3">
                              <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                              <div>
                                 <p className="font-medium mb-1">Role Information</p>
                                 <p className="text-sm text-muted-foreground">
                                    {formData.role === 'student' && 'Students can enroll in courses, submit assignments, and track their progress.'}
                                    {formData.role === 'teacher' && 'Teachers can create courses, manage content, grade assignments, and communicate with students.'}
                                    {formData.role === 'parent' && 'Parents can monitor their children\'s progress, view grades, and receive notifications.'}
                                    {formData.role === 'management' && 'Management can view analytics, generate reports, and oversee system operations.'}
                                    {formData.role === 'admin' && 'Administrators have full system access including user management, settings, and permissions.'}
                                 </p>
                              </div>
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               )}

               {/* Step 2: Additional Details */}
               {currentStep === 2 && (
                  <Card>
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <FileText className="h-5 w-5" />
                           Additional Details
                        </CardTitle>
                        <CardDescription>
                           Provide additional personal and identification information
                        </CardDescription>
                     </CardHeader>
                     <CardContent>
                        <div className="space-y-6">
                           <div className="space-y-2">
                              <Label htmlFor="address" className="flex items-center gap-2">
                                 <MapPin className="h-4 w-4" />
                                 Address *
                              </Label>
                              <Textarea
                                 id="address"
                                 value={formData.address}
                                 onChange={(e) => handleInputChange('address', e.target.value)}
                                 placeholder="Enter complete address"
                                 rows={3}
                                 required
                              />
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                 <Label htmlFor="nationalID" className="flex items-center gap-2">
                                    <Hash className="h-4 w-4" />
                                    National ID / Passport *
                                 </Label>
                                 <Input
                                    id="nationalID"
                                    value={formData.nationalID}
                                    onChange={(e) => handleInputChange('nationalID', e.target.value)}
                                    placeholder="Enter identification number"
                                    required
                                 />
                              </div>

                              <div className="space-y-2">
                                 <Label htmlFor="profilePicture" className="flex items-center gap-2">
                                    <Upload className="h-4 w-4" />
                                    Profile Picture (Optional)
                                 </Label>
                                 <div className="border-2 border-dashed rounded-lg p-6 text-center">
                                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
                                    <p className="text-sm text-muted-foreground mb-3">
                                       Drag and drop image here, or click to browse
                                    </p>
                                    <Input
                                       id="profilePicture"
                                       type="file"
                                       accept="image/*"
                                       className="hidden"
                                       onChange={handleImageChange}
                                    />
                                    <Label htmlFor="profilePicture">
                                       <Button variant="outline" type="button" className="cursor-pointer gap-2">
                                          <Upload className="h-4 w-4" />
                                          Browse Files
                                       </Button>
                                    </Label>
                                    {formData.profilePicture && (
                                       <div className="mt-3 text-sm text-green-600">
                                          ✓ Image selected
                                       </div>
                                    )}
                                 </div>
                              </div>
                           </div>

                           <div className="space-y-2">
                              <Label htmlFor="bio" className="flex items-center gap-2">
                                 <FileText className="h-4 w-4" />
                                 Biography (Optional)
                              </Label>
                              <Textarea
                                 id="bio"
                                 value={formData.bio}
                                 onChange={(e) => handleInputChange('bio', e.target.value)}
                                 placeholder="Tell us about yourself..."
                                 rows={4}
                              />
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               )}

               {/* Step 3: Security & Access */}
               {currentStep === 3 && (
                  <Card>
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <Shield className="h-5 w-5" />
                           Security & Access
                        </CardTitle>
                        <CardDescription>
                           Configure login credentials and account verification
                        </CardDescription>
                     </CardHeader>
                     <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-4">
                              <div className="space-y-2">
                                 <Label htmlFor="password" className="flex items-center gap-2">
                                    <Lock className="h-4 w-4" />
                                    Password *
                                 </Label>
                                 <Input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    placeholder="Create a strong password"
                                    required
                                    minLength={8}
                                 />
                                 <div className="flex items-center gap-2 mt-1">
                                    {formData.password.length >= 8 && (
                                       <CheckCircle2 className="h-3 w-3 text-green-500" />
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                       Minimum 8 characters with letters, numbers, and symbols
                                    </p>
                                 </div>
                              </div>

                              <div className="space-y-2">
                                 <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                                    <Lock className="h-4 w-4" />
                                    Confirm Password *
                                 </Label>
                                 <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                    placeholder="Re-enter your password"
                                    required
                                 />
                                 <div className="flex items-center gap-2 mt-1">
                                    {formData.password && formData.confirmPassword && formData.password === formData.confirmPassword && (
                                       <CheckCircle2 className="h-3 w-3 text-green-500" />
                                    )}
                                    {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                       <p className="text-xs text-destructive">Passwords do not match</p>
                                    )}
                                 </div>
                              </div>
                           </div>

                           <div className="space-y-6">

                              <div className="flex items-center justify-between p-4 border rounded-lg">
                                 <div className="space-y-0.5">
                                    <Label htmlFor="isVerified" className="text-base font-medium">
                                       Account Verification
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                       Mark account as verified immediately
                                    </p>
                                 </div>
                                 <Switch
                                    id="isVerified"
                                    checked={formData.isVerified}
                                    onCheckedChange={(checked) => handleInputChange('isVerified', checked)}
                                 />
                              </div>

                              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                 <div className="flex items-start gap-3">
                                    <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                       <p className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">Security Notice</p>
                                       <p className="text-sm text-yellow-700 dark:text-yellow-400">
                                          The user will receive an email with their credentials and a verification code.
                                          They will be required to verify their account before first login.
                                       </p>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               )}

               {/* Step 4: Final Review & Verification */}
               {currentStep === 4 && (
                  <Card>
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <CheckCircle2 className="h-5 w-5" />
                           Final Review
                        </CardTitle>
                        <CardDescription>
                           Review all information and submit to create the user
                        </CardDescription>
                     </CardHeader>
                     <CardContent>
                        <div className="space-y-6">
                           {/* Review Summary */}
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <Card>
                                 <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium">Personal Information</CardTitle>
                                 </CardHeader>
                                 <CardContent className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                       <span className="text-muted-foreground">Name:</span>
                                       <span className="font-medium">{formData.firstName} {formData.lastName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                       <span className="text-muted-foreground">Username:</span>
                                       <span className="font-medium">{formData.userName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                       <span className="text-muted-foreground">Email:</span>
                                       <span className="font-medium">{formData.email}</span>
                                    </div>
                                    <div className="flex justify-between">
                                       <span className="text-muted-foreground">Phone:</span>
                                       <span className="font-medium">{formData.phone}</span>
                                    </div>
                                    <div className="flex justify-between">
                                       <span className="text-muted-foreground">Role:</span>
                                       <Badge variant="outline" className="capitalize">
                                          {formData.role}
                                       </Badge>
                                    </div>
                                 </CardContent>
                              </Card>

                              <Card>
                                 <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium">Account Details</CardTitle>
                                 </CardHeader>
                                 <CardContent className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                       <span className="text-muted-foreground">Address:</span>
                                       <span className="font-medium truncate max-w-[200px]">{formData.address}</span>
                                    </div>
                                    <div className="flex justify-between">
                                       <span className="text-muted-foreground">National ID:</span>
                                       <span className="font-medium">{formData.nationalID}</span>
                                    </div>
                                    <div className="flex justify-between">
                                       <span className="text-muted-foreground">Verified:</span>
                                       <Badge variant={formData.isVerified ? "default" : "outline"}>
                                          {formData.isVerified ? "Yes" : "No"}
                                       </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                       <span className="text-muted-foreground">Profile Picture:</span>
                                       <span className="font-medium">{formData.profilePicture ? "✓ Uploaded" : "Not provided"}</span>
                                    </div>
                                 </CardContent>
                              </Card>
                           </div>

                           {/* Verification Code Input */}
                           <Card>
                              <CardHeader className="pb-3">
                                 <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <Key className="h-4 w-4" />
                                    Verification Code (Optional)
                                 </CardTitle>
                                 <CardDescription>
                                    Enter a custom verification code. If left empty, a 6-digit code will be auto-generated.
                                 </CardDescription>
                              </CardHeader>
                              <CardContent>
                                 <div className="space-y-3">
                                    <div className="space-y-2">
                                       <Label htmlFor="verificationCode">Custom Verification Code</Label>
                                       <Input
                                          id="verificationCode"
                                          value={formData.verificationCode}
                                          onChange={(e) => handleInputChange('verificationCode', e.target.value)}
                                          placeholder="Leave empty for auto-generation"
                                          maxLength={6}
                                       />
                                       <p className="text-xs text-muted-foreground">
                                          Must be exactly 6 digits if provided. Recommended to leave empty for auto-generation.
                                       </p>
                                    </div>
                                 </div>
                              </CardContent>
                           </Card>

                           {/* Final Notes */}
                           <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                              <div className="flex items-start gap-3">
                                 <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                 <div>
                                    <p className="font-medium mb-1">Ready to Create User</p>
                                    <p className="text-sm text-muted-foreground">
                                       Upon submission, the user will be created in the system and a verification email will be sent to their provided email address.
                                       They will need to verify their account before accessing the system.
                                    </p>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               )}

               {/* Navigation Buttons */}
               <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                     {currentStep > 1 && (
                        <Button
                           type="button"
                           variant="outline"
                           onClick={handlePrevious}
                           className="gap-2"
                           disabled={isSubmitting}
                        >
                           <ChevronLeft className="h-4 w-4" />
                           Previous Step
                        </Button>
                     )}
                  </div>

                  <div className="flex gap-3">
                     <Button
                        type="button"
                        variant="outline"
                        asChild
                        disabled={isSubmitting}
                     >
                        <Link to="/admin/users">
                           Cancel
                        </Link>
                     </Button>

                     {currentStep < steps.length ? (
                        <Button
                           type="button"
                           onClick={handleNext}
                           disabled={!validateStep() || isSubmitting}
                           className="gap-2"
                        >
                           Next Step
                           <ChevronRight className="h-4 w-4" />
                        </Button>
                     ) : (
                        <Button
                           type="submit"
                           className="gap-2"
                           disabled={isSubmitting || !validateAllSteps()}
                        >
                           {isSubmitting ? (
                              <>
                                 <Loader2 className="h-4 w-4 animate-spin" />
                                 Creating User...
                              </>
                           ) : (
                              <>
                                 <CheckCircle2 className="h-4 w-4" />
                                 Create User
                              </>
                           )}
                        </Button>
                     )}
                  </div>
               </div>

               {/* Step Indicators */}
               <div className="text-center">
                  <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                     <span>Step {currentStep} of {steps.length}</span>
                     <Separator orientation="vertical" className="h-4" />
                     <span>{Math.round(getStepProgress())}% Complete</span>
                     <Separator orientation="vertical" className="h-4" />
                     <span className={validateAllSteps() ? "text-green-600" : "text-amber-600"}>
                        {validateAllSteps() ? "✓ All data valid" : "Review required fields"}
                     </span>
                  </div>
               </div>
            </form>
         </div>
      </div>
   );
};

export default AdminAddNewUser;