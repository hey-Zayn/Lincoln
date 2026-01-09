import React from 'react';
import { Search, MoreVertical, Edit, Trash2, Shield, Mail, Phone, Calendar } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";

const AdminUserManagement = () => {
  // Simulated user data
  const users = [
    { id: 1, name: 'Dr. Sarah Wilson', email: 'sarah.w@lincoln.edu', role: 'Teacher', status: 'Active', phone: '+1 (555) 123-4567', joinDate: '2023-08-15', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60' },
    { id: 2, name: 'James Anderson', email: 'j.anderson@student.lincoln.edu', role: 'Student', status: 'Active', phone: '+1 (555) 987-6543', joinDate: '2023-09-01', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop&q=60' },
    { id: 3, name: 'Emily Chen', email: 'emily.chen@lincoln.edu', role: 'Management', status: 'Leave', phone: '+1 (555) 456-7890', joinDate: '2022-03-10', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=60' },
    { id: 4, name: 'Michael Brown', email: 'm.brown@lincoln.edu', role: 'Teacher', status: 'Active', phone: '+1 (555) 234-5678', joinDate: '2023-01-20', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60' },
    { id: 5, name: 'Lisa Taylor', email: 'lisa.t@student.lincoln.edu', role: 'Student', status: 'Inactive', phone: '+1 (555) 876-5432', joinDate: '2023-09-05', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=60' },
  ];

  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'Teacher': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'Student': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'Management': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      default: return 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tight text-slate-900 dark:text-white">
            User <span className="text-red-600">Registry</span>
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 font-medium">Manage personnel access and student records.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-1 rounded-md shadow-sm">
          <Search className="size-4 ml-3 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search users..." 
            className="bg-transparent border-none focus:outline-none text-sm font-medium text-slate-700 dark:text-zinc-200 w-64 p-2 pl-1"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-zinc-950/50 border-b border-slate-200 dark:border-zinc-800">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Personnel</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Contact</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Role</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
              {users.map((user) => (
                <tr key={user.id} className="group hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img src={user.avatar} alt={user.name} className="size-10 rounded-full object-cover border-2 border-slate-100 dark:border-zinc-800 group-hover:border-red-500/50 transition-colors" />
                      <div>
                        <p className="font-bold text-slate-900 dark:text-zinc-100 text-sm">{user.name}</p>
                        <p className="text-xs text-slate-400 font-mono">ID: #{1000 + user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-zinc-400">
                        <Mail className="size-3" /> {user.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-zinc-400">
                        <Phone className="size-3" /> {user.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-sm text-[10px] font-black uppercase tracking-wider border ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`size-2 rounded-full ${user.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                      <span className={`text-xs font-bold ${user.status === 'Active' ? 'text-emerald-600' : 'text-slate-500'}`}>
                        {user.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-zinc-800">
                          <MoreVertical className="h-4 w-4 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                        <DropdownMenuItem className="text-zinc-400 hover:text-white focus:text-white hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" /> Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500 hover:text-red-400 focus:text-red-400 hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer">
                          <Trash2 className="mr-2 h-4 w-4" /> Deactivate User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagement;