import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import AdminTopBar from './components/AdminTopBar';

const AdminDashboard = () => {
  return (
    <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen">
      <Sidebar />
      <div className="flex-1 lg:ml-64 flex flex-col transition-all duration-300">
        <AdminTopBar />
        <div className="flex-1 p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;