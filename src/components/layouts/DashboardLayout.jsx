// src/components/layout/DashboardLayout.jsx
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { FiBell, FiMail } from 'react-icons/fi';
import { CiMenuFries } from 'react-icons/ci';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 640);

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden relative">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto ml-0 sm:ml-0">
        <header className="bg-white shadow-sm p-4 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button
            className="sm:hidden p-2 rounded-md hover:bg-gray-100"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <CiMenuFries size={24} />
          </button>

          <div>
            <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
            <p className="text-sm text-gray-500">Welcome back! Manage your content below.</p>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <FiBell size={20} />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <FiMail size={20} />
            </button>
          </div>
        </header>

        <main className="p-6 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
