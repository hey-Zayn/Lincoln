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
    CheckCircle2
} from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import RoleSelector from '../../components/auth/RoleSelector';

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
        password: "", 
        role: "student" 
    });
    const { signup, isSigningUp } = useAuthStore();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleRoleChange = (role) => {
        setFormData({ ...formData, role });
    };

    const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await signup(formData);
        if (res?.success) {
            navigate('/verify-email', { state: { email: formData.email } }); 
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
                                        className={`size-2 rounded-md transition-colors duration-300 ${
                                            s === step ? 'bg-red-600 w-6' : 'bg-slate-300 dark:bg-zinc-700'
                                        }`} 
                                    />
                                ))}
                            </div>
                        </div>
                        <CardTitle className="text-3xl font-black dark:text-white tracking-tight">
                            {step === 1 && "Start Your Journey"}
                            {step === 2 && "Tell Us About Yourself"}
                            {step === 3 && "Finalize Your Profile"}
                        </CardTitle>
                        <CardDescription className="text-slate-500 dark:text-slate-400">
                            {step === 1 && "Create your account credentials to get started."}
                            {step === 2 && "Enter your basic contact details for institutional records."}
                            {step === 3 && "Select your role and provide your campus address."}
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
                                            <Label htmlFor="email">Institutional Email</Label>
                                            <div className="relative group">
                                                <Mail className="absolute left-3 top-3 size-4 text-slate-400 group-focus-within:text-red-600 transition-colors" />
                                                <Input 
                                                    id="email" 
                                                    type="email" 
                                                    placeholder="name@university.edu" 
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

                                {step === 2 && (
                                    <Motion.div
                                        key="step2"
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
                                        <div className="p-4 bg-red-600/5 rounded-md border border-red-600/10 flex gap-3">
                                            <CheckCircle2 className="size-5 text-red-600 shrink-0 mt-0.5" />
                                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                                Your data is protected under our institutional privacy policy and will only be used for academic purposes.
                                            </p>
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
                                        <div className="space-y-2">
                                            <Label>Your Role</Label>
                                            <RoleSelector 
                                                selectedRole={formData.role} 
                                                onChange={handleRoleChange} 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="address">Campus/Home Address</Label>
                                            <div className="relative group">
                                                <MapPin className="absolute left-3 top-3 size-4 text-slate-400 group-focus-within:text-red-600 transition-colors" />
                                                <Input 
                                                    id="address" 
                                                    placeholder="Dormitory, Building or Street" 
                                                    className="pl-10 h-11"
                                                    required
                                                    value={formData.address}
                                                    onChange={handleChange}
                                                />
                                            </div>
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
                                                Processing...
                                            </div>
                                        ) : "Register for Access"}
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
