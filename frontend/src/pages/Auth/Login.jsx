import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { 
    Card, 
    CardContent, 
    CardDescription, 
    CardFooter, 
    CardHeader, 
    CardTitle 
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { 
    Mail, 
    Lock, 
    Eye, 
    EyeOff, 
    LogIn, 
    ShieldCheck,
    ChevronRight
} from 'lucide-react';


const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const { login, isLoggingIn } = useAuthStore();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(formData);
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-slate-50 dark:bg-zinc-950 transition-colors duration-500">
            <div className="w-full max-w-md relative">
                {/* Background Decoration */}
                <div className="absolute -top-20 -left-20 size-64 bg-red-600/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-20 -right-20 size-64 bg-red-600/5 rounded-full blur-3xl" />

                <Card className="shadow-2xl border-border/50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl relative z-10 overflow-hidden">
                    <div className="h-1.5 w-full bg-red-600" />
                    
                    <CardHeader className="space-y-1 pb-8">
                        <div className="flex justify-center mb-6">
                            <div className="size-14 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/20 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                                <ShieldCheck className="size-8 text-white" />
                            </div>
                        </div>
                        <CardTitle className="text-3xl font-black text-center dark:text-white tracking-tight">Access Portal</CardTitle>
                        <CardDescription className="text-center text-slate-500 dark:text-slate-400">
                            Enter your institutional credentials to continue
                        </CardDescription>
                    </CardHeader>

                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
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
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <Link 
                                        to="/forgot-password" 
                                        className="text-xs font-bold text-red-600 hover:underline underline-offset-4"
                                    >
                                        Forgot credentials?
                                    </Link>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-3 size-4 text-slate-400 group-focus-within:text-red-600 transition-colors" />
                                    <Input 
                                        id="password" 
                                        type={showPassword ? "text" : "password"} 
                                        placeholder="••••••••" 
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
                        </CardContent>

                        <CardFooter className="flex flex-col gap-6 pt-4">
                            <Button 
                                type="submit" 
                                className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-600/30 transition-all hover:-translate-y-0.5"
                                disabled={isLoggingIn}
                            >
                                {isLoggingIn ? (
                                    <div className="flex items-center gap-2">
                                        <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Authenticating...
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-2">
                                        <LogIn className="size-4" />
                                        Sign In to Portal
                                    </div>
                                )}
                            </Button>
                            
                            <div className="text-center text-sm text-slate-500">
                                New to the institutional portal?{" "}
                                <Link to="/signup" className="text-red-600 font-bold hover:underline underline-offset-4 inline-flex items-center">
                                    Create account <ChevronRight className="size-3 ml-0.5" />
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default Login;
