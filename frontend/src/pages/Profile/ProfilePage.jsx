import React, { useState, memo, useMemo } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import {
    User, Mail, Phone, MapPin, Calendar, Shield, Camera,
    Edit2, Users, GraduationCap, UserCheck, Briefcase,
    Activity, Lock, ChevronRight, ExternalLink, Sparkles,
    CheckCircle2, Clock, Map, Fingerprint, Info, ShieldCheck,
    ArrowUpRight, Bookmark, Settings, Loader, X, LogOut, Key, Image as ImageIcon
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

// --- Theme Config ---
const ROLE_THEMES = {
    admin: { color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/10', border: 'border-red-100 dark:border-red-900/20', icon: Shield, hex: '#dc2626' },
    teacher: { color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/10', border: 'border-purple-100 dark:border-purple-900/20', icon: GraduationCap, hex: '#9333ea' },
    parent: { color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/10', border: 'border-blue-100 dark:border-blue-900/20', icon: Users, hex: '#2563eb' },
    student: { color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/10', border: 'border-emerald-100 dark:border-emerald-900/20', icon: UserCheck, hex: '#059669' },
};

// --- Reusable Professional Components ---

const DetailCard = memo(({ children, title, icon: Icon, className = "" }) => (
    <div className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md shadow-sm overflow-hidden flex flex-col ${className}`}>
        {title && (
            <div className="px-5 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 flex items-center gap-2.5">
                {Icon && <Icon className="size-4 text-zinc-400" />}
                <h4 className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">{title}</h4>
            </div>
        )}
        <div className="flex-1">
            {children}
        </div>
    </div>
));

const InfoItem = memo(({ label, value, icon: Icon }) => (
    <div className="flex items-start gap-3 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors border-b last:border-0 border-zinc-100 dark:border-zinc-800/50">
        <div className="size-8 min-w-8 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
            {Icon && <Icon className="size-4 text-zinc-500" />}
        </div>
        <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">{label}</span>
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{value || "Not available"}</span>
        </div>
    </div>
));

const UserListTile = memo(({ name, detail, colorClass }) => (
    <div className="flex items-center justify-between p-3 rounded-md bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all group cursor-pointer">
        <div className="flex items-center gap-3">
            <div className={`size-9 rounded-md ${colorClass} flex items-center justify-center font-bold text-sm shadow-sm uppercase`}>
                {name?.charAt(0) || "?"}
            </div>
            <div className="flex flex-col">
                <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{name || "Linked User"}</span>
                <span className="text-[10px] font-medium text-zinc-500 tracking-tight">{detail}</span>
            </div>
        </div>
        <ArrowUpRight className="size-4 text-zinc-300 group-hover:text-zinc-500 transition-colors" />
    </div>
));

const Modal = ({ isOpen, onClose, title, icon: Icon, children }) => (
    <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <Motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />
                <Motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-md shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800"
                >
                    <div className="h-1 w-full bg-gradient-to-r from-red-600 via-red-500 to-red-600" />
                    <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/30">
                        <div className="flex items-center gap-3">
                            <div className="size-8 rounded-md bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/20">
                                {Icon && <Icon className="size-4 text-white" />}
                            </div>
                            <h3 className="font-black italic text-sm uppercase tracking-widest text-zinc-900 dark:text-white">{title}</h3>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors">
                            <X className="size-4 text-zinc-400" />
                        </button>
                    </div>
                    <div className="p-6">
                        {children}
                    </div>
                </Motion.div>
            </div>
        )}
    </AnimatePresence>
);

// --- Main Page Component ---

const ProfilePage = () => {
    const { authUser, updateProfile, isUpdatingProfile, updatePassword, isUpdatingPassword, logout } = useAuthStore();
    const [selectedImage, setSelectedImage] = useState(null);
    const [activeTab, setActiveTab] = useState("overview");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [formData, setFormData] = useState({
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

    const handlePasswordSubmit = async (e) => {
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

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64Image = reader.result;
            setSelectedImage(base64Image);
            // Proactively update profile picture if not in full edit mode, 
            // or just let the user save it with the rest of the form.
            // In this professional design, we'll allow immediate upload for the avatar
            // as it's a common pattern, or wait for the "Save" button.
            // Let's stick to the "Save" button for consistency with other fields.
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        const submissionData = { ...formData };
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
        setFormData({
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
        <div className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-900 font-sans">

            {/* Header Section */}
            <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 pt-16 pb-12">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-8">

                        <div className="flex flex-col md:flex-row items-center gap-8">
                            {/* Profile Image */}
                            <div className="relative group">
                                <div className="size-36 rounded-md overflow-hidden border-4 border-white dark:border-zinc-800 shadow-xl bg-zinc-50 dark:bg-zinc-800 relative">
                                    <img
                                        src={selectedImage || authUser?.profilePicture || "/avatar.png"}
                                        className="size-full object-cover"
                                        alt="Professional Identity"
                                    />
                                    <div
                                        onClick={() => setIsImageModalOpen(true)}
                                        className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px] cursor-pointer"
                                    >
                                        <Camera className="size-6 text-white mb-1" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-white">Modify ID</span>
                                    </div>
                                </div>
                                {authUser?.isVerified && (
                                    <div className="absolute -bottom-2 -right-2 size-9 bg-white dark:bg-zinc-900 rounded-md border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shadow-lg transform -rotate-3">
                                        <ShieldCheck className="size-5 text-blue-600" />
                                    </div>
                                )}
                            </div>

                            {/* Essential Info */}
                            <div className="text-center md:text-left space-y-2">
                                <div className="flex flex-col items-center md:items-start gap-1">
                                    <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-zinc-900 dark:text-white">
                                        {authUser?.firstName} {authUser?.lastName}
                                    </h1>
                                    <div className="flex items-center gap-2 text-sm font-bold text-zinc-400 dark:text-zinc-500">
                                        <span>@{authUser?.userName}</span>
                                        <Badge className="bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700">{role} Node</Badge>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Set */}
                        <div className="flex items-center gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="rounded-md size-11 p-0 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all text-zinc-400 hover:text-red-600 shadow-sm"
                                    >
                                        <Settings className="size-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-2 rounded-md shadow-2xl">
                                    <h4 className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Settings</h4>
                                    <DropdownMenuItem
                                        onClick={() => setIsEditModalOpen(true)}
                                        className="gap-3 py-3 rounded-md cursor-pointer group focus:bg-red-50 dark:focus:bg-red-900/10 focus:text-red-600"
                                    >
                                        <div className="size-8 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-focus:bg-red-600 transition-colors">
                                            <Edit2 className="size-4 group-focus:text-white" />
                                        </div>
                                        <span className="font-bold text-xs uppercase tracking-wider">Edit Profile</span>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        onClick={() => setIsPasswordModalOpen(true)}
                                        className="gap-3 py-3 rounded-md cursor-pointer group focus:bg-red-50 dark:focus:bg-red-900/10 focus:text-red-600"
                                    >
                                        <div className="size-8 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-focus:bg-red-600 transition-colors">
                                            <Key className="size-4 group-focus:text-white" />
                                        </div>
                                        <span className="font-bold text-xs uppercase tracking-wider">Update Password</span>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        onClick={() => setIsImageModalOpen(true)}
                                        className="gap-3 py-3 rounded-md cursor-pointer group focus:bg-red-50 dark:focus:bg-red-900/10 focus:text-red-600"
                                    >
                                        <div className="size-8 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-focus:bg-red-600 transition-colors">
                                            <ImageIcon className="size-4 group-focus:text-white" />
                                        </div>
                                        <span className="font-bold text-xs uppercase tracking-wider">Change Image</span>
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800 my-2" />

                                    <DropdownMenuItem onClick={logout} className="gap-3 py-3 rounded-md cursor-pointer group focus:bg-rose-50 dark:focus:bg-rose-900/10 focus:text-rose-600">
                                        <div className="size-8 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-focus:bg-rose-600 transition-colors">
                                            <LogOut className="size-4 group-focus:text-white" />
                                        </div>
                                        <span className="font-bold text-xs uppercase tracking-wider">Sign Out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12 max-w-6xl">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8 outline-none">

                    <div className="flex justify-center border-b border-zinc-200 dark:border-zinc-800">
                        <TabsList className="bg-transparent h-auto p-0 gap-2 md:gap-8 flex-wrap justify-center">
                            {['overview', 'details', 'connectivity', 'security'].map((tab) => (
                                <TabsTrigger
                                    key={tab}
                                    value={tab}
                                    className="px-6 py-4 mb-0 text-[10px] font-black uppercase tracking-[0.2em] relative data-[state=active]:text-red-600 data-[state=active]:shadow-none bg-transparent transition-all border-b-2 border-transparent data-[state=active]:border-red-600 rounded-none cursor-pointer hover:text-red-600/70"
                                >
                                    {tab}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>

                    <AnimatePresence mode="wait">
                        <TabsContent value="overview">
                            <Motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="grid grid-cols-1 md:grid-cols-12 gap-8"
                            >
                                {/* Bio Section */}
                                <div className="md:col-span-8 flex flex-col gap-8">
                                    <DetailCard title="Professional Biography" icon={Bookmark}>
                                        <div className="p-8">
                                            <p className="text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed italic text-lg border-l-4 border-zinc-100 dark:border-zinc-800 pl-8">
                                                "{authUser?.bio || "Professional summary not yet provided. Establishing a clear profile helps other members coordinate effectively."}"
                                            </p>
                                        </div>
                                    </DetailCard>

                                    {/* Snapshot Data */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <DetailCard className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="size-12 rounded-md bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center border border-zinc-100 dark:border-zinc-800">
                                                    <Mail className="size-5 text-zinc-400" />
                                                </div>
                                                <div className="flex flex-col flex-1">
                                                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Active Email</span>
                                                    <span className="text-sm font-bold text-zinc-800 dark:text-zinc-100">{authUser?.email}</span>
                                                </div>
                                            </div>
                                        </DetailCard>
                                        <DetailCard className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="size-12 rounded-md bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center border border-zinc-100 dark:border-zinc-800">
                                                    <Phone className="size-5 text-zinc-400" />
                                                </div>
                                                <div className="flex flex-col flex-1">
                                                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Verified Phone</span>
                                                    <span className="text-sm font-bold text-zinc-800 dark:text-zinc-100">{authUser?.phone}</span>
                                                </div>
                                            </div>
                                        </DetailCard>
                                    </div>

                                    {/* Course Progress Stats */}
                                    <DetailCard title="Learning Progress" icon={GraduationCap}>
                                        <div className="p-6 grid grid-cols-2 gap-6">
                                            <div className="flex flex-col items-center justify-center p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-md border border-emerald-100 dark:border-emerald-900/20">
                                                <CheckCircle2 className="size-6 text-emerald-600 mb-2" />
                                                <span className="text-2xl font-black text-emerald-600">
                                                    {authUser?.courseProgress?.filter(cp => cp.progress === 100).length || 0}
                                                </span>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600/70">Completed</span>
                                            </div>
                                            <div className="flex flex-col items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/10 rounded-md border border-blue-100 dark:border-blue-900/20">
                                                <Clock className="size-6 text-blue-600 mb-2" />
                                                <span className="text-2xl font-black text-blue-600">
                                                    {authUser?.courseProgress?.filter(cp => cp.progress > 0 && cp.progress < 100).length || 0}
                                                </span>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600/70">In Progress</span>
                                            </div>
                                        </div>
                                    </DetailCard>
                                </div>

                                {/* Sidebar Meta */}
                                <div className="md:col-span-4 space-y-4">
                                    <DetailCard title="System Identification" icon={Fingerprint}>
                                        <div className="p-5 flex flex-col gap-4">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="font-bold text-zinc-400 uppercase">Unique ID</span>
                                                <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-900 dark:text-zinc-200">{authUser?._id?.toUpperCase()}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="font-bold text-zinc-400 uppercase">Verification</span>
                                                <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-500">
                                                    <CheckCircle2 className="size-3" />
                                                    {authUser?.isVerified ? "Certified" : "Pending"}
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="font-bold text-zinc-400 uppercase">Status</span>
                                                <span className="font-bold text-zinc-900 dark:text-white">Active session</span>
                                            </div>
                                        </div>
                                    </DetailCard>

                                    <DetailCard className="p-4 bg-red-600 text-white border-0 shadow-lg shadow-red-600/20">
                                        <div className="flex flex-col gap-4">
                                            <div className="flex justify-between items-start">
                                                <Shield className="size-8 opacity-20" />
                                                <Badge className="bg-white/10 text-white hover:bg-white/20 border-0">Primary Node</Badge>
                                            </div>
                                            <div>
                                                <h4 className="font-black italic text-xl tracking-tight">Privacy Shield Active</h4>
                                                <p className="text-[10px] opacity-60 font-black uppercase tracking-[0.2em]">Lincoln Encryption Protocol v2.4</p>
                                            </div>
                                        </div>
                                    </DetailCard>
                                </div>
                            </Motion.div>
                        </TabsContent>

                        <TabsContent value="details">
                            <Motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-8"
                            >
                                <DetailCard title="Personal Specifications" icon={User}>
                                    <InfoItem label="Full Legal Name" value={`${authUser?.firstName} ${authUser?.lastName}`} icon={User} />
                                    <InfoItem label="Unique Handle" value={`@${authUser?.userName}`} icon={Fingerprint} />
                                    <InfoItem label="Primary Email" value={authUser?.email} icon={Mail} />
                                    <InfoItem label="Mobile Access" value={authUser?.phone} icon={Phone} />
                                </DetailCard>

                                <DetailCard title="Location & Temporal Metadata" icon={MapPin}>
                                    <div className="flex items-start gap-3 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors border-b border-zinc-100 dark:border-zinc-800/50">
                                        <div className="size-8 min-w-8 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                            <MapPin className="size-4 text-zinc-500" />
                                        </div>
                                        <div className="flex flex-col flex-1">
                                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">Registrated Address</span>
                                            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{authUser?.address || "Not available"}</span>
                                        </div>
                                    </div>
                                    <InfoItem label="Terminal Zone" value="Global/Lincoln Core" icon={Map} />
                                    <InfoItem label="Registry Created" value={registeredAt} icon={Calendar} />
                                    <InfoItem label="Last Protocol Update" value={new Date(authUser?.updatedAt).toLocaleDateString()} icon={Activity} />
                                </DetailCard>
                            </Motion.div>
                        </TabsContent>

                        <TabsContent value="connectivity">
                            <Motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-8"
                            >
                                <div className="flex items-center gap-3 px-1">
                                    <Sparkles className="size-4 text-zinc-400" />
                                    <h3 className="text-sm font-black text-zinc-400 uppercase tracking-[0.2em]">Network Relations</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* Dynamic rendering based on role from schema relational fields */}

                                    {role === 'parent' && (
                                        <DetailCard title="Linked Children" icon={Users} className="md:col-span-2">
                                            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {authUser?.children?.length > 0 ? authUser.children.map((c, i) => (
                                                    <UserListTile key={i} name="Child Profile" detail="Lincoln Student" colorClass="bg-emerald-100 text-emerald-700" icon={User} />
                                                )) : <p className="text-xs font-bold text-zinc-400 italic p-4 text-center">No child nodes linked to this account.</p>}
                                            </div>
                                        </DetailCard>
                                    )}

                                    {role === 'student' && (
                                        <>
                                            <DetailCard title="Primary Guardians" icon={Users}>
                                                <div className="p-4 space-y-3">
                                                    {authUser?.parents?.length > 0 ? authUser.parents.map((p, i) => (
                                                        <UserListTile key={i} name="Guardian Node" detail="Lincoln Registrant" colorClass="bg-blue-100 text-blue-700" icon={User} />
                                                    )) : <p className="text-xs font-bold text-zinc-400 italic p-4 text-center">No guardian nodes detected.</p>}
                                                </div>
                                            </DetailCard>
                                            <DetailCard title="Assigned Teachers" icon={GraduationCap} className="md:col-span-2">
                                                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {authUser?.teachers?.length > 0 ? authUser.teachers.map((t, i) => (
                                                        <UserListTile key={i} name="Faculty Member" detail="Department Head" colorClass="bg-purple-100 text-purple-700" icon={UserCheck} />
                                                    )) : <p className="text-xs font-bold text-zinc-400 italic p-4 text-center">No instructional nodes assigned.</p>}
                                                </div>
                                            </DetailCard>
                                        </>
                                    )}

                                    {role === 'teacher' && (
                                        <DetailCard title="Managed Students" icon={UserCheck} className="md:col-span-3">
                                            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {authUser?.students?.length > 0 ? authUser.students.map((s, i) => (
                                                    <UserListTile key={i} name="Student Node" detail="Class Rank #12" colorClass="bg-emerald-50 text-emerald-600" icon={User} />
                                                )) : <p className="text-xs font-bold text-zinc-400 italic p-4 text-center">Managed student registry is empty.</p>}
                                            </div>
                                            <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-800/30 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                                                <span className="text-[10px] font-bold text-zinc-400">TOTAL REGISTRY: {authUser?.students?.length || 0}</span>
                                                <Button variant="ghost" className="h-7 text-[10px] font-black uppercase text-purple-600 tracking-widest">Export List</Button>
                                            </div>
                                        </DetailCard>
                                    )}

                                    {role === 'admin' && (
                                        <div className="md:col-span-3 p-12 text-center bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-md">
                                            <Shield className="size-12 text-red-500 mx-auto mb-4 opacity-50" />
                                            <h4 className="text-xl font-bold text-zinc-900 dark:text-white">Admin Network Node</h4>
                                            <p className="text-sm text-zinc-500 max-w-sm mx-auto mt-2">Core administrative rights granted. You have access to the global student, teacher, and parent registries through the Central Command module.</p>
                                        </div>
                                    )}
                                </div>
                            </Motion.div>
                        </TabsContent>

                        <TabsContent value="security">
                            <Motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="grid grid-cols-1 md:grid-cols-12 gap-8"
                            >
                                <div className="md:col-span-8 space-y-8">
                                    <DetailCard title="Account Integrity" icon={Shield}>
                                        <div className="p-8 space-y-10">
                                            <div className="flex items-center justify-between">
                                                <div className="flex flex-col gap-1">
                                                    <h5 className="font-bold text-zinc-900 dark:text-white">Profile Encryption</h5>
                                                    <p className="text-xs text-zinc-500 font-medium">Last profile sync: {new Date(authUser?.updatedAt).toLocaleDateString()}</p>
                                                </div>
                                                <Button variant="outline" className="rounded-md font-bold text-xs uppercase tracking-widest border-zinc-200 dark:border-zinc-800">Verified</Button>
                                            </div>
                                            <div className="h-px bg-zinc-100 dark:bg-zinc-800" />
                                            <div className="flex items-center justify-between">
                                                <div className="flex flex-col gap-1">
                                                    <h5 className="font-bold text-zinc-900 dark:text-white">Two-Factor Authentication</h5>
                                                    <p className="text-xs text-emerald-600 font-bold uppercase tracking-tight">Active Coverage</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="size-2 bg-emerald-500 rounded-full animate-pulse" />
                                                    <span className="text-xs font-bold uppercase tracking-widest">Standard</span>
                                                </div>
                                            </div>
                                        </div>
                                    </DetailCard>

                                    <DetailCard title="Modify Access Credentials" icon={Lock}>
                                        <form onSubmit={handlePasswordSubmit} className="p-8 space-y-6">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                <div className="space-y-2 sm:col-span-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Current Password</label>
                                                    <input
                                                        type="password"
                                                        name="oldPassword"
                                                        required
                                                        value={passwordData.oldPassword}
                                                        onChange={handlePasswordChange}
                                                        className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-md px-4 py-3 outline-none focus:border-red-600 transition-all font-medium"
                                                        placeholder="••••••••"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">New Password</label>
                                                    <input
                                                        type="password"
                                                        name="newPassword"
                                                        required
                                                        value={passwordData.newPassword}
                                                        onChange={handlePasswordChange}
                                                        className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-md px-4 py-3 outline-none focus:border-red-600 transition-all font-medium"
                                                        placeholder="••••••••"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Confirm New Password</label>
                                                    <input
                                                        type="password"
                                                        name="confirmPassword"
                                                        required
                                                        value={passwordData.confirmPassword}
                                                        onChange={handlePasswordChange}
                                                        className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-md px-4 py-3 outline-none focus:border-red-600 transition-all font-medium"
                                                        placeholder="••••••••"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-end pt-4">
                                                <Button
                                                    type="submit"
                                                    disabled={isUpdatingPassword}
                                                    className="bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest px-8 rounded-md h-12 shadow-lg shadow-red-600/20 active:scale-95 transition-all"
                                                >
                                                    {isUpdatingPassword ? <Loader className="animate-spin size-4 mr-2" /> : "Update Security Key"}
                                                </Button>
                                            </div>
                                        </form>
                                    </DetailCard>
                                </div>

                                <div className="md:col-span-4 space-y-4">
                                    <DetailCard title="Protocol Log" icon={Clock}>
                                        <div className="p-6 space-y-6">
                                            {[
                                                { event: 'Login attempt', time: '14 mins ago', status: 'SUCCESS' },
                                                { event: 'Profile patch', time: '2 hours ago', status: 'SYNCED' },
                                                { event: 'Verification', time: 'Jan 02', status: 'VERIFIED' },
                                            ].map((log, i) => (
                                                <div key={i} className="flex flex-col gap-1 border-l-2 border-zinc-100 dark:border-zinc-800 pl-4 py-1">
                                                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{log.status}</span>
                                                    <span className="text-sm font-bold text-zinc-800 dark:text-white">{log.event}</span>
                                                    <span className="text-[10px] text-zinc-400 font-bold">{log.time}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </DetailCard>

                                    <DetailCard className="p-6 border-amber-500/20 bg-amber-500/5">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Info className="size-5 text-amber-500" />
                                            <h4 className="text-xs font-black uppercase tracking-widest text-amber-600">Security Advisory</h4>
                                        </div>
                                        <p className="text-[10px] text-zinc-500 font-bold leading-relaxed uppercase tracking-tighter">
                                            Regularly cycling your credentials enhances the integrity of your terminal access points. Ensure your 2FA is active for maximum coverage.
                                        </p>
                                    </DetailCard>
                                </div>
                            </Motion.div>
                        </TabsContent>
                    </AnimatePresence>
                </Tabs>
            </main>

            {/* --- Modals --- */}

            {/* Edit Profile Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={handleCancel}
                title="Update Personnel Record"
                icon={Edit2}
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">First Name</label>
                            <input
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-sm px-3 py-2 text-sm font-bold outline-none focus:border-red-600 transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Last Name</label>
                            <input
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-sm px-3 py-2 text-sm font-bold outline-none focus:border-red-600 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Handle (@)</label>
                        <input
                            value={formData.userName}
                            onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                            className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-sm px-3 py-2 text-sm font-bold outline-none focus:border-red-600 transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Communication Line</label>
                        <input
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-sm px-3 py-2 text-sm font-bold outline-none focus:border-red-600 transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Geographic Node</label>
                        <input
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-sm px-3 py-2 text-sm font-bold outline-none focus:border-red-600 transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Bio Data</label>
                        <textarea
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-sm px-3 py-2 text-sm font-bold outline-none focus:border-red-600 transition-colors min-h-[80px]"
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Button variant="outline" onClick={handleCancel} className="text-xs uppercase font-black tracking-widest">Cancel</Button>
                        <Button onClick={handleSave} disabled={isUpdatingProfile} className="bg-red-600 hover:bg-red-700 text-white text-xs uppercase font-black tracking-widest">
                            {isUpdatingProfile ? "Processing..." : "Commit Changes"}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Update Password Modal */}
            <Modal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                title="Modify Access Credentials"
                icon={Key}
            >
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Current Password</label>
                        <input
                            type="password"
                            name="oldPassword"
                            required
                            value={passwordData.oldPassword}
                            onChange={handlePasswordChange}
                            className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-sm px-3 py-2 text-sm font-bold outline-none focus:border-red-600 transition-colors"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">New Password</label>
                        <input
                            type="password"
                            name="newPassword"
                            required
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-sm px-3 py-2 text-sm font-bold outline-none focus:border-red-600 transition-colors"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            required
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-sm px-3 py-2 text-sm font-bold outline-none focus:border-red-600 transition-colors"
                        />
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => setIsPasswordModalOpen(false)} className="text-xs uppercase font-black tracking-widest">Cancel</Button>
                        <Button type="submit" disabled={isUpdatingPassword} className="bg-red-600 hover:bg-red-700 text-white text-xs uppercase font-black tracking-widest">
                            {isUpdatingPassword ? "Updating..." : "Secure Update"}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Change Image Modal */}
            <Modal
                isOpen={isImageModalOpen}
                onClose={() => setIsImageModalOpen(false)}
                title="Update Visual Identity"
                icon={ImageIcon}
            >
                <div className="flex flex-col items-center gap-6 py-4">
                    <div className="relative group size-48 rounded-md overflow-hidden border-4 border-zinc-100 dark:border-zinc-800 shadow-xl">
                        <img
                            src={selectedImage || authUser?.profilePicture || "/avatar.png"}
                            className="size-full object-cover"
                            alt="Preview"
                        />
                        <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Camera className="size-8 text-white mb-2" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-white">Select File</span>
                            <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                        </label>
                    </div>
                    <div className="text-center space-y-1">
                        <p className="text-sm font-bold text-zinc-900 dark:text-white">Upload New ID Photo</p>
                        <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wide">Supports JPG, PNG (Max 5MB)</p>
                    </div>
                    <div className="flex w-full justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                        <Button variant="outline" onClick={() => { setIsImageModalOpen(false); setSelectedImage(null); }} className="text-xs uppercase font-black tracking-widest">Cancel</Button>
                        <Button onClick={handleSave} disabled={isUpdatingProfile || !selectedImage} className="bg-red-600 hover:bg-red-700 text-white text-xs uppercase font-black tracking-widest">
                            {isUpdatingProfile ? "Uploading..." : "Save Image"}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Final Registry Footer */}
            <footer className="container mx-auto px-4 py-20 max-w-6xl text-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="size-12 bg-red-600 rounded-md flex items-center justify-center font-black text-white text-xl shadow-lg shadow-red-600/20">L</div>
                    <div className="space-y-1">
                        <p className="text-xs font-black text-zinc-400 uppercase tracking-[0.4em]">Lincoln Core Systems &copy; 2024</p>
                        <div className="flex items-center justify-center gap-3 text-[9px] font-bold text-zinc-300 dark:text-zinc-700 uppercase tracking-widest">
                            <span>Privacy Protocol</span>
                            <span className="size-1 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                            <span>Registry Terms</span>
                            <span className="size-1 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                            <span>Sync Status: Core Hub v2.8</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

// Sub-components like Badge can be imported from ui/ if available, or defined here if missing
const Badge = memo(({ children, className = "" }) => (
    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-tight border ${className}`}>
        {children}
    </span>
));

export default ProfilePage;
