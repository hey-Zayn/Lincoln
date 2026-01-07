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
    ShieldCheck
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
        { name: 'Campus Life', path: '#' },
        { name: 'Academics', path: '#' },
        { name: 'Research', path: '#' },
        { name: 'News & Events', path: '#' },
    ];

    return (
        <header 
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300  border-b ${
                isScrolled 
                ? 'bg-white/90 dark:bg-zinc-900/95 backdrop-blur-md py-3 shadow-md border-border/50' 
                : 'bg-transparent py-5 border-transparent '
            }`}
        >
            <div className="container mx-auto px-4 flex items-center justify-between">
                {/* Logo Section */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="size-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/20 group-hover:scale-105 transition-transform duration-300">
                        <GraduationCap className="size-6 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-black leading-tight tracking-tight dark:text-white">University</span>
                        <span className="text-sm font-bold text-red-600 leading-tight">LMS Portal</span>
                    </div>
                </Link>

                {/* Desktop Navigation Links */}
                <nav className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a 
                            key={link.name} 
                            href={link.path}
                            className={`text-sm font-bold tracking-wide transition-colors ${
                                location.pathname === link.path 
                                ? 'text-red-600' 
                                : 'text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-600'
                            }`}
                        >
                            {link.name}
                        </a>
                    ))}
                </nav>

                {/* Desktop Right Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <button className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                        <Search className="size-5" />
                    </button>
                    
                    <div className="h-6 w-px bg-slate-200 dark:bg-zinc-800 mx-1"></div>

                    {/* Theme Toggle */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                <span className="sr-only">Toggle theme</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                                onClick={() => setTheme("light")} 
                                className={`gap-2 ${theme === 'light' ? 'bg-slate-100 dark:bg-zinc-800' : ''}`}
                            >
                                <Sun className="size-4" /> Light
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                onClick={() => setTheme("dark")} 
                                className={`gap-2 ${theme === 'dark' ? 'bg-slate-100 dark:bg-zinc-800' : ''}`}
                            >
                                <Moon className="size-4" /> Dark
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                onClick={() => setTheme("system")} 
                                className={`gap-2 ${theme === 'system' ? 'bg-slate-100 dark:bg-zinc-800' : ''}`}
                            >
                                <Monitor className="size-4" /> System
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="h-6 w-px bg-slate-200 dark:bg-zinc-800 mx-1"></div>

                    {authUser ? (
                        <div className="flex items-center gap-3">
                            {authUser.isVerified ? (
                                <>
                                    <button className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition-colors relative">
                                        <Bell className="size-5" />
                                        <span className="absolute top-1.5 right-1.5 size-2 bg-red-600 rounded-full border-2 border-white dark:border-zinc-900"></span>
                                    </button>
                                    
                                    <Link to="/profile">
                                        <Button variant="ghost" size="sm" className="gap-2 font-bold dark:text-white">
                                            <User className="size-4" />
                                            <span className="hidden lg:inline">Profile</span>
                                        </Button>
                                    </Link>
                                </>
                            ) : (
                                <Link to="/verify-email">
                                    <Button className="bg-amber-500 hover:bg-amber-600 text-white font-bold h-10 px-6 rounded-full shadow-lg shadow-amber-500/20 animate-pulse">
                                        <ShieldCheck className="size-4 mr-2" />
                                        Verify Account
                                    </Button>
                                </Link>
                            )}
                            
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="gap-2 text-red-600 border-red-600/20 hover:bg-red-50 dark:hover:bg-red-950/20 font-bold"
                                onClick={logout}
                            >
                                <LogOut className="size-4" />
                                <span className="hidden lg:inline">Logout</span>
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/login">
                                <Button variant="ghost" className="font-bold dark:text-white">
                                    <LogIn className="size-4 mr-2" />
                                    Login
                                </Button>
                            </Link>
                            <Link to="/signup">
                                <Button className="bg-red-600 hover:bg-red-700 text-white font-bold h-10 px-6 rounded-full shadow-lg shadow-red-600/20 transition-all hover:-translate-y-0.5">
                                    <UserPlus className="size-4 mr-2" />
                                    Access Portal
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button 
                    className="md:hidden p-2 text-slate-600 dark:text-slate-400"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white dark:bg-zinc-900 border-b border-border animate-fade-in">
                    <div className="container mx-auto px-4 py-8 flex flex-col gap-6">
                        {navLinks.map((link) => (
                            <a 
                                key={link.name} 
                                href={link.path}
                                className="text-lg font-bold text-slate-600 dark:text-slate-300 active:text-red-600"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.name}
                            </a>
                        ))}
                        <hr className="border-border" />
                        {!authUser && (
                            <div className="flex flex-col gap-4">
                                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button variant="outline" className="w-full justify-start font-bold">
                                        <LogIn className="size-4 mr-2" />
                                        Login
                                    </Button>
                                </Link>
                                <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-12 rounded-xl">
                                        <UserPlus className="size-4 mr-2" />
                                        Access Portal
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;

