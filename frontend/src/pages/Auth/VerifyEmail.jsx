import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
    ShieldCheck, 
    Mail, 
    ArrowRight, 
    RefreshCw,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';

const VerifyEmail = () => {
    const [code, setCode] = useState("");
    const { verifyEmail, isVerifying, authUser } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Get email from state or authUser
    const email = location.state?.email || authUser?.email;

    useEffect(() => {
        if (!email) {
            navigate('/login');
        }
        if (authUser?.isVerified) {
            navigate('/');
        }
    }, [email, authUser, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (code.length < 6) return;
        
        const res = await verifyEmail({ email, code });
        if (res?.success) {
            navigate('/');
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-slate-50 dark:bg-zinc-950 transition-colors duration-500">
            <div className="w-full max-w-md relative">
                {/* Background Decoration */}
                <div className="absolute -top-10 -right-10 size-48 bg-red-600/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -left-10 size-48 bg-red-600/5 rounded-full blur-3xl" />

                <Card className="shadow-2xl border-border/50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl relative z-10 overflow-hidden">
                    <div className="h-1.5 w-full bg-red-600" />
                    
                    <CardHeader className="space-y-1 pb-8 text-center">
                        <div className="flex justify-center mb-6">
                            <Motion.div 
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="size-16 bg-red-600 rounded-md flex items-center justify-center shadow-lg shadow-red-600/20"
                            >
                                <ShieldCheck className="size-8 text-white" />
                            </Motion.div>
                        </div>
                        <CardTitle className="text-3xl font-black dark:text-white tracking-tight">Verify Your Account</CardTitle>
                        <CardDescription className="text-slate-500 dark:text-slate-400">
                            We've sent a 6-digit verification code to
                        </CardDescription>
                        <div className="flex items-center justify-center gap-2 mt-2 px-3 py-1.5 bg-red-600/5 rounded-md border border-red-600/10 w-fit mx-auto">
                            <Mail className="size-3.5 text-red-600" />
                            <span className="text-sm font-bold text-red-600">{email}</span>
                        </div>
                    </CardHeader>

                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-6">
                            <div className="space-y-3">
                                <Label htmlFor="code" className="text-center block text-sm font-bold uppercase tracking-widest text-slate-500">
                                    Verification Code
                                </Label>
                                <div className="flex justify-center">
                                    <Input 
                                        id="code"
                                        type="text"
                                        maxLength={6}
                                        placeholder="000000"
                                        className="h-14 text-2xl font-black text-center tracking-[0.5em] border-2 focus-visible:ring-red-600/20 focus-visible:border-red-600 transition-all uppercase"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
                                        required
                                        autoFocus
                                    />
                                </div>
                                <p className="text-center text-xs text-slate-400">
                                    Check your inbox and spam folder for the code.
                                </p>
                            </div>

                            <div className="p-4 bg-amber-500/5 rounded-md border border-amber-500/10 flex gap-3">
                                <AlertCircle className="size-5 text-amber-500 shrink-0 mt-0.5" />
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Access is restricted until your account is verified. This ensures the security of our institutional records.
                                </p>
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col gap-4 pt-2">
                            <Button 
                                type="submit" 
                                className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-600/30 transition-all active:scale-95"
                                disabled={isVerifying || code.length < 6}
                            >
                                {isVerifying ? (
                                    <div className="flex items-center gap-2">
                                        <RefreshCw className="size-4 animate-spin" />
                                        Verifying...
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-2">
                                        Confirm Verification <ArrowRight className="size-4" />
                                    </div>
                                )}
                            </Button>
                            
                            <button 
                                type="button"
                                className="text-sm font-bold text-slate-500 hover:text-red-600 transition-colors flex items-center justify-center gap-2"
                                onClick={() => {/* Placeholder for resend logic */}}
                            >
                                Didn't receive the code? Resend
                            </button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default VerifyEmail;
