import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../ui/button';
import { 
    LogOut, 
    User, 
    LogIn, 
    UserPlus, 
    GraduationCap, 
    Search,
    Menu,
    X,
    Bell,
    Sun,
    Moon,
    Monitor,
    ShieldCheck,
    LayoutDashboard,
    BookOpen
} from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const Navbar = () => {
    const { authUser, logout } = useAuthStore();
    const { theme, setTheme } = useThemeStore();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Courses', path: '/courses' },
    ];

    // Add Teacher Dashboard if user is a teacher or admin
    if (authUser && (authUser.role === 'teacher' || authUser.role === 'admin')) {
        navLinks.push({ name: 'Dashboard', path: '/teacher/dashboard' });
    }

    return (
        <header 
            className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 border-b mb-0 ${
                isScrolled 
                ? 'bg-white/90 dark:bg-zinc-950/95 backdrop-blur-md py-3 shadow-md border-border/50' 
                : 'bg-white/90 dark:bg-zinc-950/95 py-5 border-transparent'
            }`}
        >
            <div className="container mx-auto px-4 flex items-center justify-between">
                {/* Logo Section */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="size-10 bg-red-600 rounded-md flex items-center justify-center shadow-lg shadow-red-600/20 group-hover:scale-105 transition-transform duration-300">
                        <GraduationCap className="size-6 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-black leading-tight tracking-tight dark:text-white uppercase italic">Lincoln</span>
                        <span className="text-[10px] font-black text-red-600 leading-tight tracking-widest uppercase">LMS Portal</span>
                    </div>
                </Link>

                {/* Desktop Navigation Links */}
                <nav className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link 
                            key={link.name} 
                            to={link.path}
                            className={`text-xs font-black uppercase tracking-widest transition-all hover:scale-105 ${
                                location.pathname === link.path 
                                ? 'text-red-600' 
                                : 'text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-600'
                            }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* Desktop Right Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <button className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-md transition-colors group">
                        <Search className="size-5 group-hover:text-red-600 transition-colors" />
                    </button>
                    
                    <div className="h-6 w-px bg-slate-200 dark:bg-zinc-800 mx-1"></div>

                    {/* Theme Toggle */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-md hover:bg-slate-100 dark:hover:bg-zinc-900">
                                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-red-600" />
                                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-red-600" />
                                <span className="sr-only">Toggle theme</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 rounded-md p-2">
                            <DropdownMenuItem 
                                onClick={() => setTheme("light")} 
                                className={`gap-2 rounded-md cursor-pointer ${theme === 'light' ? 'bg-slate-100 dark:bg-zinc-900' : ''}`}
                            >
                                <Sun className="size-4 text-red-600" /> Light
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                onClick={() => setTheme("dark")} 
                                className={`gap-2 rounded-md cursor-pointer ${theme === 'dark' ? 'bg-slate-100 dark:bg-zinc-900' : ''}`}
                            >
                                <Moon className="size-4 text-red-600" /> Dark
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                onClick={() => setTheme("system")} 
                                className={`gap-2 rounded-md cursor-pointer ${theme === 'system' ? 'bg-slate-100 dark:bg-zinc-900' : ''}`}
                            >
                                <Monitor className="size-4 text-red-600" /> System
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="h-6 w-px bg-slate-200 dark:bg-zinc-800 mx-1"></div>

                    {authUser ? (
                        <div className="flex items-center gap-3">
                            {authUser.isVerified ? (
                                <>
                                    <button className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-md transition-colors relative group">
                                        <Bell className="size-5 group-hover:text-red-600 transition-colors" />
                                        <span className="absolute top-1.5 right-1.5 size-2 bg-red-600 rounded-md border-2 border-white dark:border-zinc-950 animate-pulse"></span>
                                    </button>
                                    
                                    <Link to="/profile">
                                        <Button variant="ghost" size="sm" className="gap-2 font-black uppercase tracking-widest dark:text-white hover:text-red-600 group">
                                            <div className="size-8 bg-slate-200 dark:bg-zinc-900 rounded-md flex items-center justify-center group-hover:bg-red-600/10 transition-colors">
                                                <User className="size-4" />
                                            </div>
                                            <span className="hidden lg:inline text-xs">Profile</span>
                                        </Button>
                                    </Link>
                                </>
                            ) : (
                                <Link to="/verify-email">
                                    <Button className="bg-amber-500 hover:bg-amber-600 text-white font-black h-10 px-6 rounded-md shadow-lg shadow-amber-500/20 animate-pulse text-[10px] uppercase tracking-widest">
                                        <ShieldCheck className="size-4 mr-2" />
                                        Verify Account
                                    </Button>
                                </Link>
                            )}
                            
                            <Link to={`/${authUser?.role}/dashboard`}>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="gap-2 text-rose-600 border-rose-600/20 hover:bg-rose-50 dark:hover:bg-rose-950/20 font-black uppercase tracking-widest rounded-md text-[10px] px-5"
                                >
                                    <LayoutDashboard className="size-4 text-rose-600" />
                                    <span className="hidden lg:inline">Dashboard</span>
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/login">
                                <Button variant="ghost" className="font-black uppercase tracking-widest dark:text-white hover:text-red-600 text-xs">
                                    Login
                                </Button>
                            </Link>
                            <Link to="/signup">
                                <Button className="bg-red-600 hover:bg-red-700 text-white font-black h-10 px-8 rounded-md shadow-lg shadow-red-600/20 transition-all hover:-translate-y-0.5 uppercase text-[10px] tracking-widest">
                                    Join Now
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button 
                    className="md:hidden p-2 text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-zinc-900 rounded-md"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-b border-border animate-in slide-in-from-top duration-300">
                    <div className="container mx-auto px-4 py-8 flex flex-col gap-6">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.name} 
                                to={link.path}
                                className="text-lg font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 active:text-red-600 py-2 border-b border-slate-100 dark:border-zinc-900 last:border-0"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        {!authUser && (
                            <div className="flex flex-col gap-4 mt-4">
                                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button variant="outline" className="w-full h-14 rounded-md font-black uppercase tracking-widest text-xs">
                                        Login
                                    </Button>
                                </Link>
                                <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-black h-14 rounded-md shadow-lg shadow-red-600/20 text-xs uppercase tracking-widest">
                                        Access Portal
                                    </Button>
                                </Link>
                            </div>
                        )}
                        {authUser && (
                             <Button 
                                variant="outline" 
                                className="w-full h-14 rounded-md font-black uppercase tracking-widest text-rose-600 border-rose-600/20"
                                onClick={() => {
                                    logout();
                                    setIsMobileMenuOpen(false);
                                }}
                            >
                                <LogOut className="size-5 mr-3" /> Logout
                            </Button>
                        )}
            
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
