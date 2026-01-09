import React from 'react';
import { Outlet } from 'react-router-dom';
import ParentDashboardSidebar from './components/ParentDashboardSidebar';

const ParentDashboard = () => {
  return (
    <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen">
      <ParentDashboardSidebar />
      <div className="flex-1 lg:ml-64 transition-all duration-300">
        <div className="p-8 max-w-7xl mx-auto">
            <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;