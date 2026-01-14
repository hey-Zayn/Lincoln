import React from 'react';
import { Outlet } from 'react-router-dom';
import TeacherDashboardSidebar from './Components/TeacherDashboardSidebar';
import TeacherTopbar from './Components/TeacherTopbar';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

const TeacherDashboard = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50 dark:bg-zinc-950">
        <TeacherDashboardSidebar />
        <SidebarInset className="flex flex-col bg-slate-50 dark:bg-zinc-950 border-0">
          <TeacherTopbar />
          <main className="flex-1 p-6 lg:p-10">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default TeacherDashboard;
