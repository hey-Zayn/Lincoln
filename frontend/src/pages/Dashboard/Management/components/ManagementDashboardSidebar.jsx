import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Users, 
    PieChart, 
    FileBarChart, 
    Building2,
    LogOut,
    ShieldAlert,
    ScrollText
} from 'lucide-react';
import { useAuthStore } from '../../../../store/useAuthStore';
import { Button } from '../../../../components/ui/button';

const ManagementDashboardSidebar = () => {
    const { logout } = useAuthStore();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/management/dashboard' },
        { icon: Users, label: 'Staff Directory', path: '/management/staff' },
        { icon: PieChart, label: 'Financials', path: '/management/finance' },
        { icon: FileBarChart, label: 'Performance Reports', path: '/management/reports' },
        { icon: ScrollText, label: 'Policy Center', path: '/management/policies' },
        { icon: Building2, label: 'Campus Facility', path: '/management/facilities' },
    ];

    return (
        <aside className="w-64 min-h-screen bg-zinc-950 border-r border-zinc-800 flex-col text-white hidden lg:flex fixed left-0 top-0 bottom-0 z-50">
            {/* Logo Section */}
            <div className="h-16 flex items-center px-6 border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <div className="size-8 bg-amber-600 rounded-sm flex items-center justify-center shadow-lg shadow-amber-600/20">
                        <Building2 className="size-5 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-black uppercase tracking-tight leading-none text-white">Lincoln</span>
                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] leading-none mt-0.5">Management</span>
                    </div>
                </div>
            </div>

            {/* Navigation Section */}
            <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-3 mb-2">Operations</div>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-bold transition-all duration-200
                            ${isActive 
                                ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/20' 
                                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                            }
                        `}
                    >
                        <item.icon className="size-4" />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </div>

            {/* User & Footer Section */}
            <div className="p-4 border-t border-zinc-900 bg-zinc-950">
                <div className="flex items-center gap-3 px-3 mb-4">
                    <div className="size-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                        <ShieldAlert className="size-4 text-amber-500" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-white">Manager Access</span>
                        <span className="text-[9px] font-medium text-amber-500 uppercase tracking-wider">Authorized</span>
                    </div>
                </div>
                <Button 
                    variant="outline" 
                    className="w-full justify-start gap-3 border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-red-500 hover:bg-zinc-900 hover:border-red-600/20 transition-all font-bold text-xs uppercase tracking-widest h-10"
                    onClick={logout}
                >
                    <LogOut className="size-4" />
                    <span>Log Out</span>
                </Button>
            </div>
        </aside>
    );
};

export default ManagementDashboardSidebar;