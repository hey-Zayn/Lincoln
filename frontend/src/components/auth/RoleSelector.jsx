import React from 'react';
import { GraduationCap, BookOpen, Users, ShieldCheck } from 'lucide-react';

const roles = [
  {
    id: 'student',
    title: 'Student',
    description: 'Access courses and track progress',
    icon: GraduationCap,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20'
  },
  {
    id: 'teacher',
    title: 'Teacher',
    description: 'Manage classes and students',
    icon: BookOpen,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20'
  },
  {
    id: 'parent',
    title: 'Parent',
    description: 'Monitor child performance',
    icon: Users,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20'
  },
  {
    id: 'admin',
    title: 'Admin',
    description: 'Full institutional control',
    icon: ShieldCheck,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20'
  }
];

const RoleSelector = ({ selectedRole, onChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
      {roles.map((role) => {
        const Icon = role.icon;
        const isSelected = selectedRole === role.id;
        
        return (
          <button
            key={role.id}
            type="button"
            onClick={() => onChange(role.id)}
            className={`flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all duration-300 ${
              isSelected 
                ? 'border-red-600 bg-red-600/5 ring-4 ring-red-600/10 shadow-lg' 
                : 'border-border bg-card/50 hover:border-red-600/30 hover:bg-red-600/5'
            }`}
          >
            <div className={`p-2 rounded-lg ${role.bg}`}>
              <Icon className={`size-6 ${role.color}`} />
            </div>
            <div>
              <h3 className="font-bold text-white leading-tight">{role.title}</h3>
              <p className="text-xs text-slate-400 mt-1">{role.description}</p>
            </div>
            {isSelected && (
              <div className="ml-auto size-5 bg-red-600 rounded-full flex items-center justify-center">
                <div className="size-2 bg-white rounded-full" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default RoleSelector;
