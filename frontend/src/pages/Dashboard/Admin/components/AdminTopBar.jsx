import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
    Search, 
    Bell, 
    Menu,
    ChevronRight,
    HelpCircle
} from 'lucide-react';
import { useAuthStore } from '../../../../store/useAuthStore';
import { Button } from '../../../../components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";

const AdminTopBar = () => {
    const { authUser } = useAuthStore();
    const location = useLocation();
    
    // Generate breadcrumbs from location path
    const getBreadcrumbs = () => {
        const pathnames = location.pathname.split('/').filter((x) => x);
        return pathnames.map((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;
            // Capitalize and format value
            const label = value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ');
            return { label, to, isLast: index === pathnames.length - 1 };
        });
    };

    const breadcrumbs = getBreadcrumbs();
    const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    return (
        <header className="sticky top-0 z-40 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 transition-all">
            <div className="flex h-16 items-center gap-4 px-6 md:px-8">
                {/* Mobile Menu Trigger */}
                <Button variant="ghost" size="icon" className="lg:hidden text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
                    <Menu className="size-5" />
                </Button>

                {/* Breadcrumbs */}
                <div className="hidden md:flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                    <span className="font-bold uppercase tracking-wider text-[10px] text-zinc-400 dark:text-zinc-600">Location</span>
                    <div className="h-4 w-[1px] bg-zinc-300 dark:bg-zinc-700 mx-1"></div>
                    {breadcrumbs.map((crumb, index) => (
                        <div key={crumb.to} className="flex items-center gap-2">
                             {index > 0 && <ChevronRight className="size-3 text-zinc-400" />}
                             {crumb.isLast ? (
                                <span className="font-bold text-zinc-900 dark:text-white">
                                    {crumb.label}
                                </span>
                             ) : (
                                <Link 
                                    to={crumb.to}
                                    className="font-medium text-zinc-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                >
                                    {crumb.label}
                                </Link>
                             )}
                        </div>
                    ))}
                </div>

                <div className="ml-auto flex items-center gap-3">
                    {/* Search Bar */}
                    <div className="relative hidden md:block group">
                        <div className="flex items-center gap-2 bg-white dark:bg-zinc-900/50 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 focus-within:border-red-600/50 focus-within:ring-2 focus-within:ring-red-600/10 focus-within:w-72 w-64 transition-all shadow-sm">
                            <Search className="size-3.5 text-zinc-400 group-focus-within:text-red-500 transition-colors" />
                            <input 
                                type="search" 
                                placeholder="Type to search..." 
                                className="bg-transparent border-none focus:outline-none text-xs font-medium w-full text-zinc-700 dark:text-zinc-200 placeholder:text-zinc-500"
                            />
                            <div className="hidden lg:flex items-center gap-1">
                                <span className="text-[10px] text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700 font-mono">⌘K</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-6 w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-2 hidden sm:block"></div>

                    {/* Quick Actions */}
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="size-9 rounded-full text-zinc-500 hover:text-black hover:bg-zinc-100 dark:hover:text-white dark:hover:bg-zinc-800 transition-all">
                             <HelpCircle className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="size-9 rounded-full text-zinc-500 hover:text-black hover:bg-zinc-100 dark:hover:text-white dark:hover:bg-zinc-800 transition-all relative">
                             <Bell className="size-4" />
                             <span className="absolute top-2 right-2.5 size-1.5 bg-red-600 rounded-full border border-white dark:border-zinc-950 animate-pulse"></span>
                        </Button>
                    </div>

                    {/* Date/Time Widget */}
                    <div className="hidden xl:flex flex-col items-end px-3 py-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md">
                        <div className="text-xs font-bold text-zinc-700 dark:text-zinc-300 font-mono leading-none mt-0.5">
                            {currentDate}
                        </div>
                    </div>

                    {/* Profile Dropdown */}
                    <div className="pl-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 overflow-hidden ring-2 ring-transparent hover:ring-red-600/20 transition-all">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-red-600/20 to-transparent opacity-0 hover:opacity-100 transition-opacity"></div>
                                    <img 
                                        src={authUser?.profileImage || "https://github.com/shadcn.png"} 
                                        alt={authUser?.fullName}
                                        className="h-full w-full object-cover"
                                    />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-60 bg-zinc-950 border-zinc-800 p-2 shadow-2xl shadow-black/50">
                                <div className="flex items-center gap-3 p-2 bg-zinc-900/50 rounded-sm mb-2 border border-zinc-800/50">
                                    <div className="size-8 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden">
                                        <img src={authUser?.profileImage || "https://github.com/shadcn.png"} alt="" className="h-full w-full object-cover" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-white leading-none">{authUser?.fullName}</span>
                                        <span className="text-[10px] text-zinc-500 font-mono mt-1 truncate max-w-[120px]">{authUser?.email}</span>
                                    </div>
                                </div>
                                <DropdownMenuSeparator className="bg-zinc-800" />
                                <DropdownMenuItem className="text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer text-xs font-medium">
                                    Profile Settings
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer text-xs font-medium">
                                    Notifications
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminTopBar;