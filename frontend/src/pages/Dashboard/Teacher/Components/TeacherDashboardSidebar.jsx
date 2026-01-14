import React, { useMemo } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import {
    Award,
    BookOpen,
    Calendar,
    FileText,
    Folders,
    LayoutDashboard,
    LogOut,
    Plus,
    Search,
    Settings,
    User,
    Users,
    ChevronRight,
} from 'lucide-react';
import { useAuthStore } from '../../../../store/useAuthStore';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuBadge,
    SidebarRail,
} from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion } from 'framer-motion';

const TeacherDashboardSidebar = () => {
    const { logout, authUser } = useAuthStore();
    const location = useLocation();

    const sections = useMemo(() => [
        {
            title: "Main Menu",
            items: [
                { icon: LayoutDashboard, label: 'Dashboard', path: '/teacher/dashboard', badge: null },
                { icon: Folders, label: 'Courses', path: '/teacher/courses', badge: 3 },
                // { icon: Users, label: 'Quizzes', path: '/teacher/quizes', badge: 2 },
            ]
        },
        {
            title: "Management",
            items: [
                { icon: FileText, label: 'Assignments', path: '/teacher/assignments', badge: 5 },
                // { icon: Calendar, label: 'Announcements', path: '/teacher/announcements', badge: null },
            ]
        },
        {
            title: "Learning Services",
            items: [
                { icon: Users, label: 'Students', path: '/teacher/students', badge: null },
                // { icon: Award, label: 'Certificates', path: '/teacher/certificates', badge: 1 },
            ]
        }
    ], []);

    const isActivePath = (path) => {
        return location.pathname === path || location.pathname.startsWith(`${path}/`);
    };

    return (
        <Sidebar collapsible="icon" className="border-r border-zinc-900 bg-zinc-950">
            {/* Header: Logo */}
            <SidebarHeader className="h-16 border-b border-zinc-900/50 flex items-center justify-between px-4">
                <div className="flex items-center gap-3 group cursor-pointer overflow-hidden">
                    <div className="size-8 min-w-8 bg-red-600 rounded-sm flex items-center justify-center shadow-lg shadow-red-600/40 transform transition-transform group-hover:scale-110 group-hover:rotate-3">
                        <BookOpen className="size-5 text-white" />
                    </div>
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className='font-black text-xl tracking-tighter text-white group-data-[collapsible=icon]:hidden whitespace-nowrap'
                    >
                        LINCOLN
                    </motion.span>
                </div>
            </SidebarHeader>

            {/* Content: Search and Nav Links */}
            <SidebarContent className="px-2">
                {/* Search */}
                <SidebarGroup className="group-data-[collapsible=icon]:hidden py-4">
                    <div className='relative group'>
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-red-500 size-4 transition-colors" />
                        <Input
                            placeholder="Search..."
                            className="pl-9 bg-zinc-900/40 border-zinc-800/50 rounded-md text-xs h-9 focus:ring-1 focus:ring-red-500/50 focus:border-red-500/50"
                        />
                    </div>
                </SidebarGroup>

                {/* Nav Links mapping sections */}
                {sections.map((section, idx) => (
                    <SidebarGroup key={idx}>
                        <SidebarGroupLabel className="text-zinc-600 font-bold text-[10px] uppercase tracking-[0.2em] px-2 mb-2 group-data-[collapsible=icon]:hidden">
                            {section.title}
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {section.items.map((item) => (
                                    <SidebarMenuItem key={item.path}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActivePath(item.path)}
                                            tooltip={item.label}
                                            className={`
                                                relative flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-300
                                                ${isActivePath(item.path)
                                                    ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                                                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                                                }
                                            `}
                                        >
                                            <NavLink to={item.path} className="flex items-center w-full gap-3">
                                                <item.icon className="size-4 shrink-0" />
                                                <span className="flex-1 font-medium group-data-[collapsible=icon]:hidden">{item.label}</span>
                                                {item.badge && (
                                                    <SidebarMenuBadge className="bg-red-500 text-white text-[10px] px-1.5 py-0 h-4 border-none min-w-[18px] justify-center group-data-[collapsible=icon]:hidden">
                                                        {item.badge}
                                                    </SidebarMenuBadge>
                                                )}
                                                {isActivePath(item.path) && (
                                                    <div className="absolute left-0 w-1 h-5 bg-red-600 rounded-r-full group-data-[collapsible=icon]:hidden" />
                                                )}
                                            </NavLink>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            {/* Footer: User Profile */}
            <SidebarFooter className="p-4 border-t border-zinc-900/50">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="flex items-center gap-3 rounded-md bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-800/80 hover:border-zinc-700 transition-all outline-none shadow-lg px-2 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center"
                        >
                            <div className="relative shrink-0">
                                <Avatar className="size-8 min-w-8 border-zinc-800 group-hover:border-red-500/50 transition-colors">
                                    <AvatarImage src={authUser?.profilePicture} />
                                    <AvatarFallback className="bg-zinc-800 text-zinc-400 text-xs">
                                        {authUser?.firstName?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className='absolute -bottom-0.5 -right-0.5 size-2.5 bg-green-500 border-2 border-zinc-950 rounded-full group-data-[collapsible=icon]:size-2' />
                            </div>
                            <div className="flex flex-col items-start min-w-0 pr-1 group-data-[collapsible=icon]:hidden">
                                <span className="text-xs font-bold text-white truncate w-full">
                                    {authUser?.firstName} {authUser?.lastName}
                                </span>
                                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Instructor</span>
                            </div>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-zinc-950 border-zinc-800 text-zinc-100 shadow-2xl rounded-md p-2" align="start" side="right" sideOffset={12}>
                        <DropdownMenuLabel className='text-zinc-500 font-bold text-[10px] uppercase tracking-widest px-3 py-2'>Account</DropdownMenuLabel>
                        <DropdownMenuSeparator className='bg-zinc-900' />
                        <DropdownMenuGroup>
                            <Link to="/profile">
                                <DropdownMenuItem className='gap-3 focus:bg-white/5 focus:text-white cursor-pointer p-2 rounded-md'>
                                    <User className="size-4 text-blue-500" />
                                    <span className='text-sm'>Profile</span>
                                </DropdownMenuItem>
                            </Link>
                            <Link to="/setting">
                                <DropdownMenuItem className='gap-3 focus:bg-white/5 focus:text-white cursor-pointer p-2 rounded-md'>
                                    <Settings className="size-4 text-red-500" />
                                    <span className='text-sm'>Settings</span>
                                </DropdownMenuItem>
                            </Link>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator className='bg-zinc-900' />
                        <DropdownMenuItem onClick={logout} className='gap-3 focus:bg-red-500/10 focus:text-red-500 text-red-400 cursor-pointer p-2 rounded-md'>
                            <LogOut className="size-4" />
                            <span className='text-sm'>Sign Out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
};

export default TeacherDashboardSidebar;