import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Users, 
    BookOpen, 
    Settings, 
    LogOut, 
    GraduationCap,
    BarChart3,
    EllipsisVertical,
    Plus,
    Monitor,
    HelpCircle,
    Activity,
    UserCircle
} from 'lucide-react';
import { useAuthStore } from '../../../../store/useAuthStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";

const Sidebar = () => {
    const { logout, authUser } = useAuthStore();
    const navigate = useNavigate();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: Users, label: 'User Management', path: '/admin/users', hasDropdown: true },
        { icon: BookOpen, label: 'Course Registry', path: '/admin/courses' },
        { icon: BarChart3, label: 'System Analytics', path: '/admin/analytics' },
        // Settings moved to footer dropdown
    ];

    return (
        <aside className="w-64 h-screen bg-zinc-950 border-r border-zinc-800 flex flex-col text-white hidden lg:flex fixed left-0 top-0 bottom-0 z-50 shadow-2xl shadow-black">
            {/* Logo Section */}
            <div className="h-20 flex items-center px-6 border-b border-zinc-900 bg-zinc-950">
                <div className="flex items-center gap-4">
                    <div className="size-10 bg-gradient-to-br from-red-600 to-red-800 rounded-sm flex items-center justify-center shadow-lg shadow-red-900/40 ring-1 ring-red-500/20">
                        <GraduationCap className="size-6 text-white" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-black uppercase tracking-tight leading-none text-white">Lincoln</span>
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.25em] leading-none">Admin Core</span>
                    </div>
                </div>
            </div>

            {/* Navigation Section */}
            <div className="flex-1 py-8 px-3 space-y-1.5 overflow-y-auto custom-scrollbar">
                <div className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] px-4 mb-4">Operations</div>
                {navItems.map((item) => (
                    <div key={item.path} className="relative group">
                        {item.hasDropdown ? (
                             <div className="flex items-center gap-1">
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) => `
                                        flex-1 flex items-center gap-3 px-4 py-3 rounded-sm text-xs font-bold transition-all duration-300 border-l-2
                                        ${isActive 
                                            ? 'bg-zinc-900 text-white border-red-600 shadow-inner' 
                                            : 'border-transparent text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50 hover:border-zinc-700'
                                        }
                                    `}
                                >
                                    <item.icon className="size-4" />
                                    <span className="uppercase tracking-wide">{item.label}</span>
                                </NavLink>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className={`
                                            h-[42px] px-2 rounded-sm transition-all duration-300 border border-transparent
                                            ${window.location.pathname.startsWith(item.path)
                                                ? 'bg-zinc-900 text-white border-zinc-800'
                                                : 'text-zinc-500 hover:text-white hover:bg-zinc-900'
                                            }
                                        `}>
                                            <EllipsisVertical className="size-4" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56 bg-zinc-950 border-zinc-800 p-1 shadow-xl shadow-black font-sans">
                                        <DropdownMenuItem 
                                            onClick={() => navigate('/admin/users/add')}
                                            className="text-zinc-300 hover:text-white hover:bg-zinc-900 focus:bg-zinc-900 focus:text-white cursor-pointer py-2.5"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="size-6 rounded bg-red-600/10 flex items-center justify-center border border-red-600/20">
                                                    <Plus className="size-3 text-red-500" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold uppercase tracking-wide">Add Personnel</span>
                                                    <span className="text-[10px] text-zinc-500">Create new user profile</span>
                                                </div>
                                            </div>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                             </div>
                        ) : (
                            <NavLink
                                to={item.path}
                                className={({ isActive }) => `
                                    flex items-center gap-3 px-4 py-3 rounded-sm text-xs font-bold transition-all duration-300 border-l-2
                                    ${isActive 
                                        ? 'bg-zinc-900 text-white border-red-600 shadow-inner' 
                                        : 'border-transparent text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50 hover:border-zinc-700'
                                    }
                                `}
                            >
                                <item.icon className="size-4" />
                                <span className="uppercase tracking-wide">{item.label}</span>
                            </NavLink>
                        )}
                    </div>
                ))}
            </div>

            {/* Footer Section */}
            <div className="p-4 border-t border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
                <div className="bg-zinc-900/50 rounded-md border border-zinc-800 p-3 flex items-center justify-between group hover:border-zinc-700 transition-colors">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="relative shrink-0">
                            <div className="size-9 rounded-sm bg-gradient-to-tr from-zinc-800 to-zinc-700 flex items-center justify-center border border-white/5 ring-1 ring-black/50 shadow-inner group-hover:border-zinc-600 transition-colors">
                                <span className="text-xs font-black text-white shadow-sm">{authUser?.firstName?.charAt(0) || 'A'}</span>
                            </div>
                            <span className="absolute -bottom-0.5 -right-0.5 size-2.5 bg-emerald-500 border-2 border-zinc-950 rounded-full animate-pulse shadow-md shadow-emerald-900/50"></span>
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-xs font-bold text-zinc-200 group-hover:text-white transition-colors truncate uppercase tracking-tight">
                                {authUser?.firstName || 'Administrator'}
                            </span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[9px] font-black text-red-500 bg-red-500/10 px-1 py-px rounded-[1px] border border-red-500/10 uppercase tracking-widest">
                                    Admin
                                </span>
                                <span className="text-[9px] font-medium text-zinc-600 font-mono">
                                    #{authUser?._id?.slice(-4) || '8080'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="p-2 hover:bg-zinc-800 rounded-sm text-zinc-400 hover:text-white transition-all duration-200 focus:outline-none">
                                <Settings className="size-4 animate-spin-slow group-hover:text-red-500" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" sideOffset={12} className="w-64 bg-zinc-950 border-zinc-800 p-1.5 shadow-2xl shadow-black/80">
                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-500 px-2 py-1.5">System Control</DropdownMenuLabel>
                            
                            <DropdownMenuItem className="py-2.5 px-2 text-zinc-400 hover:bg-zinc-900 hover:text-white focus:bg-zinc-900 focus:text-white rounded-sm cursor-pointer gap-3 transition-colors">
                                <UserCircle className="size-4" />
                                <span className="text-xs font-bold">Profile Settings</span>
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem className="py-2.5 px-2 text-zinc-400 hover:bg-zinc-900 hover:text-white focus:bg-zinc-900 focus:text-white rounded-sm cursor-pointer gap-3 transition-colors">
                                <Monitor className="size-4" />
                                <span className="text-xs font-bold">Theme Preference</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem className="py-2.5 px-2 text-zinc-400 hover:bg-zinc-900 hover:text-white focus:bg-zinc-900 focus:text-white rounded-sm cursor-pointer gap-3 transition-colors">
                                <Activity className="size-4" />
                                <span className="text-xs font-bold">System Diagnostics</span>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator className="bg-zinc-800 my-1" />
                            
                            <DropdownMenuItem className="py-2.5 px-2 text-zinc-400 hover:bg-zinc-900 hover:text-white focus:bg-zinc-900 focus:text-white rounded-sm cursor-pointer gap-3 transition-colors">
                                <HelpCircle className="size-4" />
                                <span className="text-xs font-bold">Help Center</span>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator className="bg-zinc-800 my-1" />

                            <DropdownMenuItem 
                                onClick={logout}
                                className="py-2.5 px-2 text-red-500 hover:bg-red-500/10 hover:text-red-400 focus:bg-red-500/10 focus:text-red-400 rounded-sm cursor-pointer gap-3 transition-colors"
                            >
                                <LogOut className="size-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">Terminate Session</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;