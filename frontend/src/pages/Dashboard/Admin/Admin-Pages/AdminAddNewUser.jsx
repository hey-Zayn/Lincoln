import React from 'react';
import { User, Mail, Lock, Phone, Calendar, Shield, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../../../components/ui/button';

const AdminAddNewUser = () => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
           <Link to="/admin/users" className="flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors mb-2 text-sm font-bold uppercase tracking-wider">
              <ArrowLeft className="size-4" /> Back to Registry
           </Link>
           <h1 className="text-3xl font-black uppercase italic tracking-tight text-slate-900 dark:text-white">
            Initiate <span className="text-red-600">Personnel</span>
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 font-medium">Create a new system access profile.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md shadow-lg overflow-hidden">
         <div className="p-8 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 flex items-center justify-between">
            <h2 className="text-lg font-black uppercase tracking-widest text-slate-700 dark:text-zinc-300">Profile Configuration</h2>
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 uppercase tracking-wider">
               <Shield className="size-3" /> Secure Entry
            </span>
         </div>
         
         <form className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="space-y-6">
               <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 dark:border-zinc-800 pb-2 mb-4">Identity</h3>
               
               <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider">Full Name</label>
                  <div className="relative group">
                     <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-red-600 transition-colors" />
                     <input type="text" className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-sm py-2.5 pl-10 pr-4 text-sm font-medium focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/20 transition-all" placeholder="e.g. Dr. Sarah Connor" />
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider">Email Address</label>
                  <div className="relative group">
                     <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-red-600 transition-colors" />
                     <input type="email" className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-sm py-2.5 pl-10 pr-4 text-sm font-medium focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/20 transition-all" placeholder="e.g. sarah@lincoln.edu" />
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider">Phone Contact</label>
                  <div className="relative group">
                     <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-red-600 transition-colors" />
                     <input type="tel" className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-sm py-2.5 pl-10 pr-4 text-sm font-medium focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/20 transition-all" placeholder="+1 (555) 000-0000" />
                  </div>
               </div>
            </div>

            {/* Account Details */}
            <div className="space-y-6">
               <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 dark:border-zinc-800 pb-2 mb-4">Credentials</h3>

               <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider">System Role</label>
                  <div className="relative">
                     <select className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-sm py-2.5 pl-4 pr-10 text-sm font-medium focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/20 transition-all appearance-none cursor-pointer">
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="management">Management</option>
                        <option value="admin">Administrator</option>
                     </select>
                     <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <Shield className="size-4 text-slate-400" />
                     </div>
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider">Initial Password</label>
                  <div className="relative group">
                     <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-red-600 transition-colors" />
                     <input type="password" className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-sm py-2.5 pl-10 pr-4 text-sm font-medium focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/20 transition-all" placeholder="••••••••" />
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider">Join Date</label>
                  <div className="relative group">
                     <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-red-600 transition-colors" />
                     <input type="date" className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-sm py-2.5 pl-10 pr-4 text-sm font-medium focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/20 transition-all" />
                  </div>
               </div>
            </div>

            <div className="md:col-span-2 pt-6 border-t border-slate-100 dark:border-zinc-800 flex justify-end gap-4">
               <Button variant="ghost" className="text-slate-500 hover:text-slate-900 hover:bg-slate-100">Cancel Operation</Button>
               <Button className="bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider gap-2">
                  <CheckCircle2 className="size-4" /> Create Personnel
               </Button>
            </div>
         </form>
      </div>
    </div>
  );
};

export default AdminAddNewUser;