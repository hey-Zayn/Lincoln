import React from 'react'
import { Bell, ChevronDown, Home, LogOut, Monitor, Moon, Settings, Sun, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import { useAuthStore } from '../../../../store/useAuthStore'
import { useThemeStore } from '../../../../store/useThemeStore'
import { Link } from 'react-router-dom'
import { SidebarTrigger } from "@/components/ui/sidebar"

const TeacherTopbar = () => {
    const { logout, authUser } = useAuthStore();
    const { theme, setTheme } = useThemeStore();
    return (
        <div className='sticky top-0 z-30 w-full h-16 flex items-center justify-between px-6 border-b border-zinc-900/50 dark:border-zinc-800/50 dark:bg-zinc-950/50 
        bg-zinc-200/50 backdrop-blur-md'>
            <div className='flex items-center gap-3'>
                <SidebarTrigger className="text-zinc-400 hover:text-white" />
                <Link to="/">
                    <Button variant="outline" className="">
                        <Home className="size-4" />
                        <span className="text-sm font-medium">LMS Home</span>
                    </Button>
                </Link>
            </div>

            <div className='flex items-center gap-2'>
                <Button variant="ghost" size="icon" className='text-zinc-400 hover:text-white hover:bg-white/5 rounded-md transition-all'>
                    <Bell className="size-4" />
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className='text-zinc-400 hover:text-white hover:bg-white/5 rounded-md transition-all'>
                            {theme === 'light' ? <Sun className="size-4" /> : theme === 'dark' ? <Moon className="size-4" /> : <Monitor className="size-4" />}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-36 bg-zinc-950 border-zinc-800 text-zinc-100 shadow-2xl rounded-md p-1 mt-2" align="end">
                        <DropdownMenuItem onClick={() => setTheme('light')} className='gap-3 focus:bg-white/5 focus:text-white cursor-pointer px-2 py-1.5 rounded-md'>
                            <Sun className="size-4 text-orange-500" />
                            <span className='text-sm font-medium'>Light</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme('dark')} className='gap-3 focus:bg-white/5 focus:text-white cursor-pointer px-2 py-1.5 rounded-md'>
                            <Moon className="size-4 text-blue-500" />
                            <span className='text-sm font-medium'>Dark</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme('system')} className='gap-3 focus:bg-white/5 focus:text-white cursor-pointer px-2 py-1.5 rounded-md'>
                            <Monitor className="size-4 text-zinc-500" />
                            <span className='text-sm font-medium'>System</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-3 hover:bg-white/5 pl-2 pr-4 py-1.5 rounded-md cursor-pointer outline-none transition-all group border border-transparent hover:border-zinc-800/50">
                            <Avatar className="size-8 border border-zinc-800 group-hover:border-zinc-700 transition-colors">
                                <AvatarImage src={authUser?.profilePicture} />
                                <AvatarFallback className="bg-zinc-800 text-zinc-400 text-xs font-bold">
                                    {authUser?.firstName?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className='hidden md:flex flex-col items-start'>
                                <span className='text-xs font-bold text-white'>{authUser?.firstName} {authUser?.lastName}</span>
                                <span className='text-[10px] font-medium text-zinc-500 uppercase tracking-tighter'>Instructor</span>
                            </div>
                            <ChevronDown className="size-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-zinc-950 border-zinc-800 text-zinc-100 shadow-2xl rounded-md p-2 mt-2" align="end">
                        <DropdownMenuLabel className='text-zinc-500 font-bold text-[10px] uppercase tracking-widest px-3 py-2'>Manage Account</DropdownMenuLabel>
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
                        <DropdownMenuItem
                            onClick={logout}
                            className='gap-3 focus:bg-red-500/10 focus:text-red-500 text-red-400 cursor-pointer p-2 rounded-md'
                        >
                            <LogOut className="size-4" />
                            <span className='text-sm'>Logout</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};

export default TeacherTopbar;