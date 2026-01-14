import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../../components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import {
    Mail,
    Lock,
    User,
    Eye,
    EyeOff,
    UserPlus,
    ChevronRight,
    ChevronLeft,
    Phone,
    MapPin,
    AtSign,
    CheckCircle2,
    Fingerprint,
    GraduationCap,
    BookOpen,
    Briefcase,
    School,
    Users
} from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';

const Signup = () => {
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        userName: "",
        email: "",
        phone: "",
        address: "",
        nationalID: "",
        password: "",
        role: "", // Empty initially, user will choose
        expertise: "", // For teachers
        institution: "", // For teachers/students
    });
    const { signup, isSigningUp } = useAuthStore();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleRoleChange = (value) => {
        setFormData({ ...formData, role: value });
    };

    const nextStep = () => {
        // Validate current step before proceeding
        if (step === 1 && !formData.role) {
            alert("Please select an account type to continue");
            return;
        }
        setStep(prev => Math.min(prev + 1, 3));
    };

    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all required fields
        if (!formData.role) {
            alert("Please select an account type");
            return;
        }

        const res = await signup(formData);
        if (res?.success) {
            const redirectPath = formData.role === 'teacher' ? '/teacher/dashboard' : '/verify-email';
            navigate(redirectPath, { state: { email: formData.email, role: formData.role } });
        }
    };

    const stepVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-slate-50 dark:bg-zinc-950 transition-colors duration-500">
            <div className="w-full max-w-xl relative">
                {/* Background Decoration */}
                <div className="absolute -top-20 -left-20 size-64 bg-red-600/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-20 -right-20 size-64 bg-red-600/5 rounded-full blur-3xl" />

                <Card className="shadow-2xl border-border/50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl relative z-10 overflow-hidden">
                    <div className="h-2 w-full bg-slate-100 dark:bg-zinc-800">
                        <Motion.div
                            className="h-full bg-red-600"
                            initial={{ width: "33%" }}
                            animate={{ width: `${(step / 3) * 100}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>

                    <CardHeader className="space-y-1 pb-8">
                        <div className="flex items-center justify-between mb-4">
                            <div className="size-12 bg-red-600 rounded-md flex items-center justify-center shadow-lg shadow-red-600/20">
                                <UserPlus className="size-6 text-white" />
                            </div>
                            <div className="flex gap-2">
                                {[1, 2, 3].map((s) => (
                                    <div
                                        key={s}
                                        className={`size-2 rounded-md transition-colors duration-300 ${s === step ? 'bg-red-600 w-6' : 'bg-slate-300 dark:bg-zinc-700'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                        <CardTitle className="text-3xl font-black dark:text-white tracking-tight">
                            {step === 1 && "Choose Your Account Type"}
                            {step === 2 && "Create Your Account"}
                            {step === 3 && "Complete Your Profile"}
                        </CardTitle>
                        <CardDescription className="text-slate-500 dark:text-slate-400">
                            {step === 1 && "Select whether you want to join as a student or teacher"}
                            {step === 2 && "Enter your basic account credentials"}
                            {step === 3 && "Provide additional information to complete registration"}
                        </CardDescription>
                    </CardHeader>

                    <form onSubmit={handleSubmit}>
                        <CardContent className="min-h-[350px]">
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <Motion.div
                                        key="step1"
                                        variants={stepVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        className="space-y-6"
                                    >
                                        <div className="space-y-3">
                                            <Label className="text-lg font-semibold">I want to join as a:</Label>
                                            <RadioGroup
                                                value={formData.role}
                                                onValueChange={handleRoleChange}
                                                className="grid gap-4"
                                            >
                                                {/* Student Option */}
                                                <div className={`
                          relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-300
                          ${formData.role === 'student'
                                                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/30 ring-2 ring-blue-600/20'
                                                        : 'border-gray-200 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-600'
                                                    }
                        `}>
                                                    <RadioGroupItem value="student" id="student" className="sr-only" />
                                                    <Label
                                                        htmlFor="student"
                                                        className="flex items-center gap-4 cursor-pointer w-full"
                                                    >
                                                        <div className={`
                              size-12 rounded-full flex items-center justify-center
                              ${formData.role === 'student'
                                                                ? 'bg-blue-100 dark:bg-blue-900'
                                                                : 'bg-gray-100 dark:bg-zinc-800'
                                                            }
                            `}>
                                                            <GraduationCap className={`
                                size-6
                                ${formData.role === 'student'
                                                                    ? 'text-blue-600 dark:text-blue-400'
                                                                    : 'text-gray-500 dark:text-gray-400'
                                                                }
                              `} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="font-bold text-lg">Student</div>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                                Enroll in courses, complete assignments, and track your learning progress
                                                            </p>
                                                        </div>
                                                        {formData.role === 'student' && (
                                                            <CheckCircle2 className="size-6 text-blue-600 dark:text-blue-400" />
                                                        )}
                                                    </Label>
                                                </div>

                                                {/* Teacher Option */}
                                                <div className={`
                          relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-300
                          ${formData.role === 'teacher'
                                                        ? 'border-red-600 bg-red-50 dark:bg-red-950/30 ring-2 ring-red-600/20'
                                                        : 'border-gray-200 dark:border-zinc-700 hover:border-red-400 dark:hover:border-red-600'
                                                    }
                        `}>
                                                    <RadioGroupItem value="teacher" id="teacher" className="sr-only" />
                                                    <Label
                                                        htmlFor="teacher"
                                                        className="flex items-center gap-4 cursor-pointer w-full"
                                                    >
                                                        <div className={`
                              size-12 rounded-full flex items-center justify-center
                              ${formData.role === 'teacher'
                                                                ? 'bg-red-100 dark:bg-red-900'
                                                                : 'bg-gray-100 dark:bg-zinc-800'
                                                            }
                            `}>
                                                            <BookOpen className={`
                                size-6
                                ${formData.role === 'teacher'
                                                                    ? 'text-red-600 dark:text-red-400'
                                                                    : 'text-gray-500 dark:text-gray-400'
                                                                }
                              `} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="font-bold text-lg">Teacher / Instructor</div>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                                Create and manage courses, teach students, and grow your educational impact
                                                            </p>
                                                        </div>
                                                        {formData.role === 'teacher' && (
                                                            <CheckCircle2 className="size-6 text-red-600 dark:text-red-400" />
                                                        )}
                                                    </Label>
                                                </div>
                                            </RadioGroup>
                                        </div>

                                        {/* Role-specific additional info */}
                                        {formData.role === 'teacher' && (
                                            <div className="space-y-3 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                                                <div className="flex items-center gap-2">
                                                    <Briefcase className="size-4 text-red-600 dark:text-red-400" />
                                                    <Label htmlFor="expertise">Area of Expertise</Label>
                                                </div>
                                                <Input
                                                    id="expertise"
                                                    placeholder="e.g., Web Development, Data Science, Mathematics"
                                                    value={formData.expertise}
                                                    onChange={handleChange}
                                                    className="bg-white dark:bg-zinc-800"
                                                />
                                            </div>
                                        )}

                                        {formData.role === 'student' && (
                                            <div className="space-y-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                                <div className="flex items-center gap-2">
                                                    <School className="size-4 text-blue-600 dark:text-blue-400" />
                                                    <Label htmlFor="institution">Educational Institution (Optional)</Label>
                                                </div>
                                                <Input
                                                    id="institution"
                                                    placeholder="e.g., University Name"
                                                    value={formData.institution}
                                                    onChange={handleChange}
                                                    className="bg-white dark:bg-zinc-800"
                                                />
                                            </div>
                                        )}
                                    </Motion.div>
                                )}

                                {step === 2 && (
                                    <Motion.div
                                        key="step2"
                                        variants={stepVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        className="space-y-4"
                                    >
                                        <div className="space-y-2">
                                            <Label htmlFor="userName">Username</Label>
                                            <div className="relative group">
                                                <AtSign className="absolute left-3 top-3 size-4 text-slate-400 group-focus-within:text-red-600 transition-colors" />
                                                <Input
                                                    id="userName"
                                                    placeholder="johndoe123"
                                                    className="pl-10 h-11"
                                                    required
                                                    value={formData.userName}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <div className="relative group">
                                                <Mail className="absolute left-3 top-3 size-4 text-slate-400 group-focus-within:text-red-600 transition-colors" />
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder={formData.role === 'student' ? "student@university.edu" : "teacher@institution.edu"}
                                                    className="pl-10 h-11"
                                                    required
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="password">Password</Label>
                                            <div className="relative group">
                                                <Lock className="absolute left-3 top-3 size-4 text-slate-400 group-focus-within:text-red-600 transition-colors" />
                                                <Input
                                                    id="password"
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Min. 8 characters"
                                                    className="pl-10 pr-10 h-11"
                                                    required
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-3 text-slate-400 hover:text-red-600"
                                                >
                                                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                                </button>
                                            </div>
                                        </div>
                                    </Motion.div>
                                )}

                                {step === 3 && (
                                    <Motion.div
                                        key="step3"
                                        variants={stepVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        className="space-y-4"
                                    >
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="firstName">First Name</Label>
                                                <Input
                                                    id="firstName"
                                                    placeholder="John"
                                                    className="h-11"
                                                    required
                                                    value={formData.firstName}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="lastName">Last Name</Label>
                                                <Input
                                                    id="lastName"
                                                    placeholder="Doe"
                                                    className="h-11"
                                                    required
                                                    value={formData.lastName}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <div className="relative group">
                                                <Phone className="absolute left-3 top-3 size-4 text-slate-400 group-focus-within:text-red-600 transition-colors" />
                                                <Input
                                                    id="phone"
                                                    placeholder="+1 (555) 000-0000"
                                                    className="pl-10 h-11"
                                                    required
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="nationalID">National ID / CNIC</Label>
                                            <div className="relative group">
                                                <Fingerprint className="absolute left-3 top-3 size-4 text-slate-400 group-focus-within:text-red-600 transition-colors" />
                                                <Input
                                                    id="nationalID"
                                                    placeholder="00000-0000000-0"
                                                    className="pl-10 h-11"
                                                    required
                                                    value={formData.nationalID}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="address">{formData.role === 'student' ? "Campus/Home Address" : "Institution Address"}</Label>
                                            <div className="relative group">
                                                <MapPin className="absolute left-3 top-3 size-4 text-slate-400 group-focus-within:text-red-600 transition-colors" />
                                                <Input
                                                    id="address"
                                                    placeholder={formData.role === 'student' ? "Dormitory, Building or Street" : "Institution Building, Street"}
                                                    className="pl-10 h-11"
                                                    required
                                                    value={formData.address}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="p-4 bg-red-600/5 rounded-md border border-red-600/10 flex gap-3">
                                            <CheckCircle2 className="size-5 text-red-600 shrink-0 mt-0.5" />
                                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                                Your data is protected under our privacy policy and will only be used for educational purposes.
                                            </p>
                                        </div>
                                    </Motion.div>
                                )}
                            </AnimatePresence>
                        </CardContent>

                        <CardFooter className="flex flex-col gap-4 mt-8">
                            <div className="flex w-full gap-3">
                                {step > 1 && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="h-12 px-6 font-bold"
                                        onClick={prevStep}
                                        disabled={isSigningUp}
                                    >
                                        <ChevronLeft className="size-4 mr-2" /> Back
                                    </Button>
                                )}

                                {step < 3 ? (
                                    <Button
                                        type="button"
                                        className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white font-bold transition-all hover:translate-x-1"
                                        onClick={nextStep}
                                        disabled={step === 1 && !formData.role}
                                    >
                                        Continue <ChevronRight className="size-4 ml-2" />
                                    </Button>
                                ) : (
                                    <Button
                                        type="submit"
                                        className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-600/30"
                                        disabled={isSigningUp}
                                    >
                                        {isSigningUp ? (
                                            <div className="flex items-center gap-2">
                                                <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Creating Account...
                                            </div>
                                        ) : formData.role === 'teacher' ? "Register as Teacher" : "Register as Student"}
                                    </Button>
                                )}
                            </div>

                            <p className="text-center text-sm text-slate-500">
                                Already have an account?{" "}
                                <Link to="/login" className="text-red-600 font-bold hover:underline underline-offset-4">
                                    Sign In
                                </Link>
                            </p>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default Signup;