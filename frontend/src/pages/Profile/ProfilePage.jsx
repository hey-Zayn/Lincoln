import React, { useState, memo, useMemo } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import {
    User, Mail, Phone, MapPin, Calendar, Shield, Camera,
    Edit2, Users, GraduationCap, UserCheck, Briefcase,
    Activity, Lock, ChevronRight, ExternalLink, Sparkles,
    CheckCircle2, Clock, Map, Fingerprint, Info, ShieldCheck,
    ArrowUpRight, Bookmark, Settings, Loader, X, LogOut, Key,
    Image as ImageIcon, Save, Upload, ShieldAlert,
    AtSign, Globe, TrendingUp, Heart
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Dialog, DialogContent } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";

// --- Theme Config ---
const ROLE_THEMES = {
    admin: { color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/10', border: 'border-red-100 dark:border-red-900/20', icon: Shield, hex: '#dc2626', label: 'AUTHORITY NODE' },
    teacher: { color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/10', border: 'border-orange-100 dark:border-orange-900/20', icon: GraduationCap, hex: '#ea580c', label: 'FACULTY NODE' },
    parent: { color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/10', border: 'border-blue-100 dark:border-blue-900/20', icon: Users, hex: '#2563eb', label: 'GUARDIAN NODE' },
    student: { color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/10', border: 'border-emerald-100 dark:border-emerald-900/20', icon: UserCheck, hex: '#059669', label: 'LEARNER NODE' },
};

// --- Reusable Professional Components ---

const DetailCard = memo(({ children, title, icon: Icon, className = "" }) => (
    <div className={`bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-sm shadow-sm overflow-hidden flex flex-col group/card hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-black/50 transition-all duration-500 ${className}`}>
        {title && (
            <div className="px-5 py-4 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    {Icon && <Icon className="size-4 text-slate-400 group-hover/card:text-red-600 transition-colors" />}
                    <h4 className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] italic">{title}</h4>
                </div>
                <div className="size-1.5 rounded-full bg-slate-200 dark:bg-zinc-800" />
            </div>
        )}
        <div className="flex-1">
            {children}
        </div>
    </div>
));

const InfoItem = memo(({ label, value, icon: Icon }) => (
    <div className="flex items-start gap-4 p-5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-all border-b last:border-0 border-slate-100 dark:border-zinc-800/50 group/item">
        <div className="size-10 min-w-10 rounded-sm bg-slate-100 dark:bg-zinc-800 flex items-center justify-center border border-slate-200 dark:border-zinc-700 group-hover/item:border-red-600/30 transition-colors">
            {Icon && <Icon className="size-4 text-slate-500 group-hover/item:text-red-600 transition-colors" />}
        </div>
        <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
            <span className="text-sm font-black italic tracking-tight text-slate-900 dark:text-zinc-100 uppercase">{value || "NOT SPECIFIED"}</span>
        </div>
    </div>
));

const UserListTile = memo(({ name, detail, colorClass, icon: Icon = User }) => (
    <div className="flex items-center justify-between p-4 rounded-sm bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 hover:border-red-600/30 dark:hover:border-red-600/30 transition-all group/tile cursor-pointer shadow-sm hover:shadow-md">
        <div className="flex items-center gap-4">
            <div className={`size-11 rounded-sm ${colorClass} flex items-center justify-center border border-slate-200/50 dark:border-zinc-700 shadow-inner overflow-hidden relative`}>
                <div className="absolute inset-0 bg-white/20 dark:bg-black/20 opacity-0 group-hover/tile:opacity-100 transition-opacity" />
                <Icon className="size-5" />
            </div>
            <div className="flex flex-col">
                <span className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase italic tracking-tight">{name || "LINKED NODE"}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">{detail}</span>
            </div>
        </div>
        <ArrowUpRight className="size-4 text-slate-300 group-hover/tile:text-red-600 group-hover/tile:translate-x-0.5 group-hover/tile:-translate-y-0.5 transition-all" />
    </div>
));

// --- Main Page Component ---

const ProfilePage = () => {
    const { authUser, updateProfile, isUpdatingProfile, updatePassword, isUpdatingPassword, logout } = useAuthStore();
    const [selectedImage, setSelectedImage] = useState(null);
    const [activeTab, setActiveTab] = useState("overview");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [profileData, setProfileData] = useState({
        firstName: authUser?.firstName || "",
        lastName: authUser?.lastName || "",
        userName: authUser?.userName || "",
        phone: authUser?.phone || "",
        address: authUser?.address || "",
        bio: authUser?.bio || "",
    });

    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const role = authUser?.role || 'student';
    // const theme = ROLE_THEMES[role];

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return toast.error("Passwords do not match");
        }
        const success = await updatePassword({
            oldPassword: passwordData.oldPassword,
            newPassword: passwordData.newPassword
        });
        if (success) {
            setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
            setIsPasswordModalOpen(false);
        }
    };

    const handleImageSelection = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64Image = reader.result;
            setSelectedImage(base64Image);
        };
        reader.readAsDataURL(file);
    };

    const handleImageUpload = async () => {
        if (!selectedImage) return;
        const success = await updateProfile({ profilePicture: selectedImage });
        if (success) {
            setIsImageModalOpen(false);
            setSelectedImage(null);
        }
    };

    const handleUpdateProfile = async (e) => {
        if (e) e.preventDefault();
        const submissionData = { ...profileData };
        if (selectedImage) {
            submissionData.profilePicture = selectedImage;
        }

        const success = await updateProfile(submissionData);
        if (success) {
            setIsEditModalOpen(false);
            setIsImageModalOpen(false);
            setSelectedImage(null);
        }
    };

    const handleCancel = () => {
        setProfileData({
            firstName: authUser?.firstName || "",
            lastName: authUser?.lastName || "",
            userName: authUser?.userName || "",
            phone: authUser?.phone || "",
            address: authUser?.address || "",
            bio: authUser?.bio || "",
        });
        setSelectedImage(null);
        setIsEditModalOpen(false);
        setIsPasswordModalOpen(false);
        setIsImageModalOpen(false);
    };

    // Meta metadata
    const registeredAt = useMemo(() =>
        new Date(authUser?.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        , [authUser?.createdAt]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 selection:bg-red-600 selection:text-white dark:selection:bg-red-600 dark:selection:text-white font-sans transition-colors duration-500">

            {/* Header Section: Identity Hub */}
            <header className="bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 pt-20 pb-16 relative overflow-hidden">
                {/* Background Accents */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50/50 dark:bg-zinc-950/20 skew-x-12 translate-x-20 pointer-events-none" />
                <div className="absolute -bottom-10 left-0 w-64 h-64 bg-red-600/5 blur-3xl rounded-full pointer-events-none" />

                <div className="container mx-auto px-6 max-w-6xl relative z-10">
                    <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-12">

                        <div className="flex flex-col md:flex-row items-center gap-10">
                            {/* Profile Image - High Tech Avatar */}
                            <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-tr from-red-600 to-slate-200 dark:to-zinc-800 rounded-sm opacity-20 blur-[2px]" />
                                <div className="size-40 rounded-sm overflow-hidden border border-slate-200 dark:border-zinc-800 shadow-2xl bg-white dark:bg-zinc-900 relative group">
                                    <img
                                        src={selectedImage || authUser?.profilePicture || "/avatar.png"}
                                        className="size-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
                                        alt="Personnel Identifier"
                                    />
                                    <div
                                        onClick={() => setIsImageModalOpen(true)}
                                        className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm cursor-pointer"
                                    >
                                        <Camera className="size-6 text-red-600 mb-2 animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Update ID</span>
                                    </div>

                                    {/* Scanline Effect */}
                                    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%] opacity-20" />
                                </div>
                                {authUser?.isVerified && (
                                    <div className="absolute -bottom-3 -right-3 size-12 bg-white dark:bg-zinc-900 rounded-sm border border-slate-200 dark:border-zinc-700 flex items-center justify-center shadow-2xl transform rotate-12 transition-transform hover:rotate-0">
                                        <ShieldCheck className="size-6 text-red-600" />
                                    </div>
                                )}
                            </div>

                            {/* Identity Metadata */}
                            <div className="text-center md:text-left space-y-4">
                                <div className="space-y-1">
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                        <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white">
                                            {authUser?.firstName} <span className="text-red-600 font-black">{authUser?.lastName}</span>
                                        </h1>
                                        <Badge className="bg-red-600/10 text-red-600 border-red-600/20 px-3 py-1 italic">
                                            {ROLE_THEMES[role]?.label || "AUTHORIZED NODE"}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-center md:justify-start gap-4">
                                        <div className="flex items-center gap-1.5 text-xs font-black text-slate-400 uppercase tracking-widest">
                                            <span className="text-red-600">@</span>{authUser?.userName}
                                        </div>
                                        <div className="size-1 rounded-full bg-slate-300 dark:bg-zinc-700" />
                                        <div className="flex items-center gap-1.5 text-xs font-black text-slate-400 uppercase tracking-widest">
                                            <Fingerprint className="size-3 text-slate-400" />
                                            MK-{authUser?._id?.substring(0, 6).toUpperCase()}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Registry Date</span>
                                        <span className="text-xs font-black italic text-slate-700 dark:text-slate-300 uppercase">{registeredAt}</span>
                                    </div>
                                    <div className="w-px h-8 bg-slate-200 dark:bg-zinc-800" />
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Access Level</span>
                                        <span className="text-xs font-black italic text-red-600 uppercase tracking-tighter">Terminal Command Tier 1</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Global Actions */}
                        <div className="flex items-center gap-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="rounded-sm h-14 px-8 border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all text-[10px] font-black uppercase tracking-[0.2em] italic group shadow-xl shadow-slate-200/50 dark:shadow-none"
                                    >
                                        <Settings className="size-4 mr-3 text-slate-400 group-hover:text-red-600 transition-colors" />
                                        System Config
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-64 bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 p-3 rounded-sm shadow-2xl ring-1 ring-slate-100 dark:ring-zinc-800">
                                    <div className="px-3 py-3 border-b border-slate-50 dark:border-zinc-800 mb-2">
                                        <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Access Control</h4>
                                    </div>

                                    <DropdownMenuItem
                                        onClick={() => setIsEditModalOpen(true)}
                                        className="gap-4 py-4 rounded-sm cursor-pointer group focus:bg-slate-50 dark:focus:bg-zinc-800 transition-all"
                                    >
                                        <div className="size-10 rounded-sm bg-slate-100 dark:bg-zinc-800 flex items-center justify-center border border-slate-200 dark:border-zinc-700 group-focus:border-red-600 group-focus:bg-red-600 transition-all">
                                            <Edit2 className="size-4 text-slate-500 group-focus:text-white" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-black text-[10px] uppercase tracking-wider text-slate-900 dark:text-white">Patch Personnel</span>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Identity Overwrite</span>
                                        </div>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        onClick={() => setIsPasswordModalOpen(true)}
                                        className="gap-4 py-4 rounded-sm cursor-pointer group focus:bg-slate-50 dark:focus:bg-zinc-800 transition-all"
                                    >
                                        <div className="size-10 rounded-sm bg-slate-100 dark:bg-zinc-800 flex items-center justify-center border border-slate-200 dark:border-zinc-700 group-focus:border-red-600 group-focus:bg-red-600 transition-all">
                                            <Key className="size-4 text-slate-500 group-focus:text-white" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-black text-[10px] uppercase tracking-wider text-slate-900 dark:text-white">Security Keys</span>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Encryption Cycle</span>
                                        </div>
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator className="bg-slate-100 dark:bg-zinc-800 my-2" />

                                    <DropdownMenuItem onClick={logout} className="gap-4 py-4 rounded-sm cursor-pointer group focus:bg-red-50 dark:focus:bg-red-950/20 transition-all">
                                        <div className="size-10 rounded-sm bg-slate-100 dark:bg-zinc-800 flex items-center justify-center border border-slate-200 dark:border-zinc-700 group-focus:border-red-600 group-focus:bg-red-600 transition-all">
                                            <LogOut className="size-4 text-slate-500 group-focus:text-white" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-black text-[10px] uppercase tracking-wider text-slate-900 dark:text-white">Terminate</span>
                                            <span className="text-[9px] font-bold text-red-600 uppercase tracking-tight">Secure Signout</span>
                                        </div>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-16 max-w-6xl relative">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-12 outline-none">

                    <div className="flex justify-center border-b border-slate-200 dark:border-zinc-900 mb-12">
                        <TabsList className="bg-transparent h-auto p-0 gap-8 lg:gap-16 flex-wrap justify-center">
                            {['overview', 'details', 'connectivity', 'security'].map((tab) => (
                                <TabsTrigger
                                    key={tab}
                                    value={tab}
                                    className="px-6 py-5 mb-0 text-[10px] font-black uppercase tracking-[0.3em] italic relative data-[state=active]:text-red-600 data-[state=active]:shadow-none bg-transparent transition-all border-b-2 border-transparent data-[state=active]:border-red-600 rounded-none cursor-pointer hover:text-red-600/70"
                                >
                                    {tab}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>

                    <AnimatePresence mode="wait">
                        <TabsContent value="overview" className="mt-0 outline-none">
                            <Motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="grid grid-cols-1 md:grid-cols-12 gap-8"
                            >
                                {/* Bio & Core Stats */}
                                <div className="md:col-span-8 space-y-8">
                                    <DetailCard title="Personnel Intelligence Summary" icon={Bookmark}>
                                        <div className="p-10 relative overflow-hidden group/bio">
                                            {/* Decorative marks */}
                                            <div className="absolute top-0 left-0 size-8 border-t-2 border-l-2 border-slate-100 dark:border-zinc-800 opacity-0 group-hover/bio:opacity-100 transition-all duration-700" />
                                            <div className="absolute bottom-0 right-0 size-8 border-b-2 border-r-2 border-slate-100 dark:border-zinc-800 opacity-0 group-hover/bio:opacity-100 transition-all duration-700" />

                                            <p className="text-slate-600 dark:text-slate-400 font-bold leading-relaxed italic text-xl border-l-[6px] border-red-600/20 dark:border-red-600/10 pl-10 py-2 relative">
                                                <span className="absolute -left-3 top-0 text-6xl text-slate-100 dark:text-zinc-800 font-black select-none pointer-events-none opacity-50">"</span>
                                                {authUser?.bio || "Professional summary transmission not yet initialized. Establishing core biographical data enhances cross-departmental coordination."}
                                                <span className="absolute -right-3 bottom-0 text-6xl text-slate-100 dark:text-zinc-800 font-black select-none pointer-events-none opacity-50">"</span>
                                            </p>
                                        </div>
                                    </DetailCard>

                                    {/* Critical Data Points */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-8 rounded-sm shadow-sm hover:shadow-xl transition-all group/stat relative overflow-hidden">
                                            <div className="absolute right-0 top-0 size-16 bg-slate-50 dark:bg-zinc-950 -translate-y-1/2 translate-x-1/2 rotate-45 pointer-events-none" />
                                            <div className="flex items-center gap-6">
                                                <div className="size-14 rounded-sm bg-slate-100 dark:bg-zinc-800 flex items-center justify-center border border-slate-200 dark:border-zinc-700 group-hover/stat:border-red-500/30 transition-all shadow-inner">
                                                    <Mail className="size-6 text-slate-400 group-hover/stat:text-red-600 transition-colors" />
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Active Comms</span>
                                                    <span className="text-sm font-black text-slate-900 dark:text-white truncate max-w-[180px]">{authUser?.email}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-8 rounded-sm shadow-sm hover:shadow-xl transition-all group/stat relative overflow-hidden">
                                            <div className="absolute right-0 top-0 size-16 bg-slate-50 dark:bg-zinc-950 -translate-y-1/2 translate-x-1/2 rotate-45 pointer-events-none" />
                                            <div className="flex items-center gap-6">
                                                <div className="size-14 rounded-sm bg-slate-100 dark:bg-zinc-800 flex items-center justify-center border border-slate-200 dark:border-zinc-700 group-hover/stat:border-red-500/30 transition-all shadow-inner">
                                                    <Phone className="size-6 text-slate-400 group-hover/stat:text-red-600 transition-colors" />
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Secure Line</span>
                                                    <span className="text-sm font-black text-slate-900 dark:text-white">{authUser?.phone || "UNVERIFIED"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Performance Grid */}
                                    <DetailCard title="Operational Performance Tracking" icon={Activity}>
                                        <div className="p-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
                                            <div className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-zinc-950 rounded-sm border border-slate-100 dark:border-zinc-800 group/perf hover:border-emerald-600/30 transition-all">
                                                <CheckCircle2 className="size-8 text-emerald-600 mb-4 group-hover/perf:scale-110 transition-transform" />
                                                <span className="text-3xl font-black italic tracking-tighter text-slate-900 dark:text-white">
                                                    {authUser?.courseProgress?.filter(cp => cp.progress === 100).length || 0}
                                                </span>
                                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mt-2">Certified</span>
                                            </div>

                                            <div className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-zinc-950 rounded-sm border border-slate-100 dark:border-zinc-800 group/perf hover:border-blue-600/30 transition-all">
                                                <Clock className="size-8 text-blue-600 mb-4 group-hover/perf:scale-110 transition-transform" />
                                                <span className="text-3xl font-black italic tracking-tighter text-slate-900 dark:text-white">
                                                    {authUser?.courseProgress?.filter(cp => cp.progress > 0 && cp.progress < 100).length || 0}
                                                </span>
                                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mt-2">Active Flux</span>
                                            </div>

                                            <div className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-zinc-950 rounded-sm border border-slate-100 dark:border-zinc-800 group/perf hover:border-red-600/30 transition-all">
                                                <Sparkles className="size-8 text-red-600 mb-4 group-hover/perf:scale-110 transition-transform" />
                                                <span className="text-3xl font-black italic tracking-tighter text-slate-900 dark:text-white">
                                                    {authUser?.enrolledcourses?.length || 0}
                                                </span>
                                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mt-2">Deployment</span>
                                            </div>
                                        </div>
                                    </DetailCard>
                                </div>

                                {/* Registry Metadata Sidebar */}
                                <div className="md:col-span-4 space-y-8">
                                    <DetailCard title="System Integrity Status" icon={ShieldCheck}>
                                        <div className="p-8 space-y-6">
                                            <div className="flex justify-between items-center group/meta">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Sync</span>
                                                <div className="flex items-center gap-2">
                                                    <div className="size-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                                    <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase italic">Active</span>
                                                </div>
                                            </div>
                                            <div className="h-px bg-slate-100 dark:bg-zinc-800" />
                                            <div className="flex justify-between items-center group/meta">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Auth Tier</span>
                                                <span className="text-[10px] font-black text-red-600 uppercase italic">Level 04 Accredited</span>
                                            </div>
                                            <div className="h-px bg-slate-100 dark:bg-zinc-800" />
                                            <div className="flex justify-between items-center group/meta">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Access</span>
                                                <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase italic">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} Terminal</span>
                                            </div>
                                        </div>
                                    </DetailCard>

                                    {/* Identity Seal */}
                                    <div className="bg-red-600 p-8 rounded-sm shadow-2xl shadow-red-600/20 relative overflow-hidden group/seal">
                                        <div className="absolute top-0 right-0 size-32 bg-white/5 -translate-y-1/2 translate-x-1/2 rotate-45 pointer-events-none group-hover/seal:bg-white/10 transition-all duration-700" />
                                        <div className="relative z-10 space-y-6">
                                            <div className="flex items-center justify-between">
                                                <Shield className="size-10 text-white/20 group-hover/seal:scale-110 transition-transform duration-700" />
                                                <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/60 bg-white/10 px-3 py-1 border border-white/20 rounded-sm">Primary Core</span>
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="text-2xl font-black italic text-white tracking-tighter uppercase leading-none">Identity Certified</h4>
                                                <p className="text-[10px] text-white/60 font-black uppercase tracking-[0.2em]">Verified Lincoln Operative</p>
                                            </div>
                                            <div className="pt-4 flex items-center gap-4 text-white/40">
                                                <Users className="size-4" />
                                                <div className="h-px flex-1 bg-white/10" />
                                                <span className="text-[9px] font-black">LINCOLN_LMS_2026</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Motion.div>
                        </TabsContent>

                        <TabsContent value="details" className="mt-0 outline-none">
                            <Motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-8"
                            >
                                <DetailCard title="Personal Registry" icon={User}>
                                    <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                                        <InfoItem label="First Identifier" value={authUser?.firstName} icon={Fingerprint} />
                                        <InfoItem label="Last Identifier" value={authUser?.lastName} icon={Fingerprint} />
                                        <InfoItem label="System Alias" value={authUser?.userName} icon={AtSign} />
                                        <InfoItem label="Assigned Role" value={ROLE_THEMES[role]?.label || "AUTHORIZED NODE"} icon={Shield} />
                                    </div>
                                </DetailCard>

                                <DetailCard title="Communication Channels" icon={Globe}>
                                    <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                                        <InfoItem label="Primary Comms" value={authUser?.email} icon={Mail} />
                                        <InfoItem label="Secondary Line" value={authUser?.phone} icon={Phone} />
                                        <InfoItem label="Geographic Node" value={authUser?.location || "REGIONAL_CORE_NODE"} icon={MapPin} />
                                        <InfoItem label="Time Horizon" value={registeredAt} icon={Clock} />
                                    </div>
                                </DetailCard>
                            </Motion.div>
                        </TabsContent>

                        <TabsContent value="connectivity" className="mt-0 outline-none">
                            <Motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8"
                            >
                                {/* Role-based Connectivity Headers */}
                                <div className="flex items-center gap-6 mb-4">
                                    <div className="h-px flex-1 bg-slate-200 dark:bg-zinc-800" />
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic">Established Node Links</h3>
                                    <div className="h-px flex-1 bg-slate-200 dark:bg-zinc-800" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {role === 'student' && (
                                        <>
                                            <DetailCard title="Parent Nodes" icon={Users}>
                                                <div className="p-6 space-y-4">
                                                    {authUser?.parents?.length > 0 ? (
                                                        authUser.parents.map(parent => (
                                                            <UserListTile
                                                                key={parent._id}
                                                                name={`${parent.firstName} ${parent.lastName}`}
                                                                detail="Primary Guardian"
                                                                colorClass="bg-blue-600/10 text-blue-600"
                                                                icon={Heart}
                                                            />
                                                        ))
                                                    ) : (
                                                        <div className="p-10 border-2 border-dashed border-slate-100 dark:border-zinc-800 rounded-sm flex flex-col items-center justify-center opacity-40">
                                                            <Users className="size-8 mb-4" />
                                                            <span className="text-[10px] font-black uppercase tracking-widest leading-loose text-center">No Guardian Nodes Detected<br />In Sector</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </DetailCard>
                                            <DetailCard title="Assigned Faculty" icon={GraduationCap}>
                                                <div className="p-6 space-y-4">
                                                    <UserListTile name="Command Center" detail="Academic Supervisor" colorClass="bg-red-600/10 text-red-600" icon={Shield} />
                                                </div>
                                            </DetailCard>
                                        </>
                                    )}

                                    {role === 'parent' && (
                                        <DetailCard title="Linked Learners" icon={Users}>
                                            <div className="p-6 space-y-4">
                                                {authUser?.students?.length > 0 ? (
                                                    authUser.students.map(student => (
                                                        <UserListTile
                                                            key={student._id}
                                                            name={`${student.firstName} ${student.lastName}`}
                                                            detail="Active Learner"
                                                            colorClass="bg-emerald-600/10 text-emerald-600"
                                                            icon={GraduationCap}
                                                        />
                                                    ))
                                                ) : (
                                                    <div className="p-10 border-2 border-dashed border-slate-100 dark:border-zinc-800 rounded-sm flex flex-col items-center justify-center opacity-40">
                                                        <Users className="size-8 mb-4" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-center">No Dependent Nodes Linked</span>
                                                    </div>
                                                )}
                                            </div>
                                        </DetailCard>
                                    )}

                                    {role === 'teacher' && (
                                        <DetailCard title="Active Flux Subscriptions" icon={TrendingUp} className="md:col-span-2">
                                            <div className="p-10 border-2 border-dashed border-slate-100 dark:border-zinc-800 rounded-sm flex flex-col items-center justify-center opacity-40">
                                                <Activity className="size-8 mb-4 animate-pulse" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-center">Operational Data Aggregating...</span>
                                            </div>
                                        </DetailCard>
                                    )}
                                </div>
                            </Motion.div>
                        </TabsContent>

                        <TabsContent value="security" className="mt-0 outline-none">
                            <Motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="grid grid-cols-1 md:grid-cols-3 gap-8"
                            >
                                <DetailCard title="Access Credentials" icon={Key} className="md:col-span-2">
                                    <div className="p-12 space-y-10 group/sec relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                                        <div className="flex items-start gap-8">
                                            <div className="size-20 rounded-sm bg-slate-900 flex items-center justify-center border-b-4 border-red-600 shrink-0 shadow-2xl">
                                                <Lock className="size-8 text-white animate-bounce-slow" />
                                            </div>
                                            <div className="space-y-4">
                                                <h3 className="text-3xl font-black italic text-slate-900 dark:text-white uppercase tracking-tighter">Encryption Shield</h3>
                                                <p className="text-slate-500 font-medium max-w-lg leading-relaxed">System passwords are encrypted using SHA-256 with salting protocols. Last rotation detected 42 days ago.</p>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setIsPasswordModalOpen(true)}
                                                    className="rounded-sm h-12 px-8 border-red-600 text-red-600 font-black uppercase tracking-widest italic hover:bg-red-600 hover:text-white transition-all active:scale-95"
                                                >
                                                    Initiate Rotation
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6">
                                            <div className="p-6 bg-slate-50 dark:bg-zinc-950 rounded-sm border-l-2 border-red-600">
                                                <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">MFA Status</span>
                                                <span className="text-xs font-black italic text-emerald-600 uppercase">Authenticated</span>
                                            </div>
                                            <div className="p-6 bg-slate-50 dark:bg-zinc-950 rounded-sm border-l-2 border-slate-300 dark:border-zinc-800">
                                                <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Session Protocol</span>
                                                <span className="text-xs font-black italic text-slate-700 dark:text-slate-300 uppercase">JWT_HS256_SECURED</span>
                                            </div>
                                        </div>
                                    </div>
                                </DetailCard>

                                <DetailCard title="Security Logs" icon={ShieldAlert}>
                                    <div className="p-8 space-y-6">
                                        {[
                                            { event: 'PORTAL_ACCESS', status: 'SUCCESS', time: '02M AGO' },
                                            { event: 'DATA_DECRYPTION', status: 'AUTHORIZED', time: '14M AGO' },
                                            { event: 'PROTOCOL_SYNC', status: 'COMPLETE', time: '1H AGO' },
                                            { event: 'IDENTITY_PATCH', status: 'PENDING', time: '2H AGO' },
                                        ].map((log, i) => (
                                            <div key={i} className="flex justify-between items-center group/log">
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-black text-slate-900 dark:text-slate-100 uppercase italic leading-none mb-1 group-hover/log:text-red-600 transition-colors">{log.event}</span>
                                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{log.time}</span>
                                                </div>
                                                <Badge className="bg-slate-100 dark:bg-zinc-800 text-[8px] border-0 text-slate-500 font-black tracking-widest uppercase py-0.5">{log.status}</Badge>
                                            </div>
                                        ))}
                                        <Button variant="ghost" className="w-full text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-red-600 mt-2">View Full Audit Trail</Button>
                                    </div>
                                </DetailCard>
                            </Motion.div>
                        </TabsContent>
                    </AnimatePresence>
                </Tabs>
            </main>

            {/* --- Modals --- */}

            {/* --- Modals: Tactical Interfaces --- */}

            {/* Update Personnel Record (Edit Profile) */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-2xl bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 p-0 overflow-hidden shadow-2xl">
                    <div className="bg-slate-900 dark:bg-black p-8 border-b border-red-600/30 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter leading-none mb-2">Patch Personnel Records</h2>
                            <p className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em]">Sector 04 // Identity Overwrite Protocol</p>
                        </div>
                        <Fingerprint className="size-10 text-red-600/40" />
                    </div>

                    <form onSubmit={handleUpdateProfile} className="p-10 space-y-8">
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic ml-1">Given Name</label>
                                <Input
                                    value={profileData.firstName}
                                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                                    className="h-14 bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 focus:border-red-600 focus:ring-red-600/20 rounded-sm font-black uppercase text-sm italic transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic ml-1">Family Name</label>
                                <Input
                                    value={profileData.lastName}
                                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                                    className="h-14 bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 focus:border-red-600 focus:ring-red-600/20 rounded-sm font-black uppercase text-sm italic transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic ml-1">Personnel Intelligence (Bio)</label>
                            <Textarea
                                value={profileData.bio}
                                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                className="min-h-[140px] bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 focus:border-red-600 focus:ring-red-600/20 rounded-sm font-bold text-slate-700 dark:text-slate-300 italic transition-all leading-relaxed"
                                placeholder="Establish core biographical data..."
                            />
                        </div>

                        <div className="bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800 p-6 rounded-sm flex items-center gap-4">
                            <ShieldAlert className="size-5 text-red-600 shrink-0" />
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">All identity patches are logged in the global audit trail and broadcasted to authorized oversight nodes.</p>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsEditModalOpen(false)}
                                className="flex-1 h-14 rounded-sm border-slate-200 dark:border-zinc-800 font-black uppercase tracking-widest italic hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all active:scale-95 text-xs"
                            >
                                Abort
                            </Button>
                            <Button
                                type="submit"
                                disabled={isUpdatingProfile}
                                className="flex-1 h-14 rounded-sm bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest italic shadow-xl shadow-red-600/20 transition-all active:scale-95 text-xs flex items-center justify-center gap-3"
                            >
                                {isUpdatingProfile ? (
                                    <>
                                        <Loader className="size-4 animate-spin" />
                                        Syncing...
                                    </>
                                ) : (
                                    <>
                                        <Save className="size-4" />
                                        Update Record
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modify Access Credentials (Update Password) */}
            <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
                <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 p-0 overflow-hidden shadow-2xl">
                    <div className="bg-slate-900 dark:bg-black p-8 border-b border-red-600/30 flex items-center gap-6">
                        <div className="size-12 rounded-sm bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/20">
                            <Key className="size-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black italic text-white uppercase tracking-tighter leading-none mb-1">Rotation Protocol</h2>
                            <p className="text-[9px] font-black text-red-600 uppercase tracking-[0.2em]">Credential Encryption Cycle</p>
                        </div>
                    </div>

                    <form onSubmit={handleUpdatePassword} className="p-8 space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Current Key</label>
                                <Input
                                    type="password"
                                    value={passwordData.oldPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                    className="h-12 bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 focus:border-red-600 focus:ring-red-600/20 rounded-sm font-black uppercase text-xs italic transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic ml-1">New Descriptor</label>
                                <Input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    className="h-12 bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 focus:border-red-600 focus:ring-red-600/20 rounded-sm font-black uppercase text-xs italic transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsPasswordModalOpen(false)}
                                className="flex-1 h-12 rounded-sm border-slate-200 dark:border-zinc-800 font-black uppercase tracking-widest italic text-[10px]"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isUpdatingPassword}
                                className="flex-1 h-12 rounded-sm bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest italic text-[10px] flex items-center justify-center gap-3"
                            >
                                {isUpdatingPassword ? <Loader className="size-4 animate-spin" /> : "Commit Change"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Update Visual Identity (Change Image) */}
            <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
                <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 p-0 overflow-hidden shadow-2xl">
                    <div className="bg-slate-900 dark:bg-black p-8 border-b border-white/10 flex items-center gap-6">
                        <Camera className="size-8 text-white/40" />
                        <div>
                            <h2 className="text-xl font-black italic text-white uppercase tracking-tighter leading-none mb-1">Optical Calibration</h2>
                            <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Identity Imaging Protocol</p>
                        </div>
                    </div>

                    <div className="p-10 flex flex-col items-center">
                        <div className="relative mb-10 group">
                            <div className="absolute -inset-4 bg-gradient-to-tr from-red-600 to-transparent rounded-full opacity-20 blur-2xl group-hover:opacity-40 transition-opacity" />
                            <div className="size-48 rounded-sm overflow-hidden border-2 border-slate-200 dark:border-zinc-800 shadow-2xl bg-slate-50 relative z-10">
                                <img
                                    src={selectedImage || authUser?.profilePicture || "/avatar.png"}
                                    alt="Preview"
                                    className="size-full object-cover grayscale-[0.2]"
                                />
                                {isUpdatingProfile && (
                                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
                                        <Loader className="size-10 text-red-600 animate-spin" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="w-full space-y-6">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-sm bg-slate-50 dark:bg-zinc-950/50 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-all cursor-pointer group/upload">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="size-6 text-slate-400 group-hover/upload:text-red-600 group-hover/upload:scale-110 transition-all mb-3" />
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Upload New ID Matrix</p>
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageSelection} />
                            </label>

                            <div className="flex gap-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsImageModalOpen(false)}
                                    className="flex-1 h-12 rounded-sm border-slate-200 dark:border-zinc-800 font-black uppercase tracking-widest italic text-[10px]"
                                >
                                    Abort
                                </Button>
                                <Button
                                    onClick={handleImageUpload}
                                    disabled={!selectedImage || isUpdatingProfile}
                                    className="flex-1 h-12 rounded-sm bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest italic text-[10px] shadow-xl shadow-red-600/20 disabled:opacity-50"
                                >
                                    Confirm Update
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Final Registry Footer */}
            <footer className="container mx-auto px-6 py-24 max-w-6xl text-center relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="flex flex-col items-center gap-8 relative z-10">
                    <div className="group/logo relative cursor-pointer">
                        <div className="absolute -inset-2 bg-red-600 blur opacity-0 group-hover/logo:opacity-20 transition-opacity" />
                        <div className="size-14 bg-red-600 rounded-sm flex items-center justify-center font-black text-white text-2xl shadow-2xl scale-100 group-hover/logo:scale-110 transition-all duration-500">
                            L
                        </div>
                    </div>

                    <div className="space-y-4">
                        <p className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-[0.5em] italic">Established 2024 // Lincoln Core Operative Network</p>
                        <div className="flex items-center justify-center gap-6 text-[9px] font-black text-slate-300 dark:text-zinc-800 uppercase tracking-widest">
                            <span className="hover:text-red-600 cursor-pointer transition-colors">Privacy Protocol</span>
                            <div className="size-1 bg-slate-200 dark:bg-zinc-800 rounded-full" />
                            <span className="hover:text-red-600 cursor-pointer transition-colors">Registry Terms</span>
                            <div className="size-1 bg-slate-200 dark:bg-zinc-800 rounded-full" />
                            <span className="hover:text-red-600 cursor-pointer transition-colors">Sector Status: Core Hub v4.2.0_SECURED</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

// Sub-components: Tactical UI Tokens
const Badge = memo(({ children, className = "" }) => (
    <span className={`px-3 py-1 rounded-sm text-[9px] font-black uppercase tracking-widest border border-slate-200 dark:border-zinc-800 shadow-sm ${className}`}>
        {children}
    </span>
));

export default ProfilePage;
