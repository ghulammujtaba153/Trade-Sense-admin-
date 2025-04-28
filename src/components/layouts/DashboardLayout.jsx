import React, { useContext, useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FiBell, FiChevronLeft, FiChevronRight, FiHome, FiMail, FiUser } from 'react-icons/fi';
import { RiAdminFill } from "react-icons/ri";
import { CiMenuFries } from "react-icons/ci";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 640); // sm breakpoint (640px)
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <FiHome /> },
    { name: 'Users', path: '/users', icon: <FiUser /> },
    { name: 'Courses', path: '/courses', icon: <FiMail /> },
    { name: 'Plans', path: '/plans', icon: <FiBell /> },
    { name: 'Editors', path: '/editors', icon: <RiAdminFill /> }
  ];

  const handleLogout = () => {
    logout();
  };

  // This effect listens to window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden relative">
      {/* Sidebar */}
      <div className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        sm:translate-x-0
        fixed sm:static top-0 left-0 h-full bg-[#F1F2F7] text-gray-800 transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'w-64' : 'w-64'}
        sm:${sidebarOpen ? 'w-64' : 'w-20'}
        z-50
      `}>
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && (
            <h1 className="text-xl font-bold">Trade Sense</h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-300"
          >
            {sidebarOpen ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
          </button>
        </div>

        <nav className="mt-8">
          <ul className="space-y-2 px-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`flex items-center p-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'hover:bg-gray-300 hover:text-primary'
                    }`}
                    onClick={() => {
                      if (window.innerWidth < 640) {
                        setSidebarOpen(false);
                      }
                    }}
                  >
                    <span className="text-xl mr-3">{item.icon}</span>
                    {(sidebarOpen || window.innerWidth >= 640) && <span>{item.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile */}
        {(sidebarOpen || window.innerWidth >= 640) && user && (
          <div className="absolute max-w-[250px] bottom-0 w-full p-4 bg-primary">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3">
                <p className="font-medium text-white">{user.name}</p>
                <p className="text-xs text-indigo-200">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-3 w-full py-2 px-4 bg-red-500 rounded-lg text-sm hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>

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

          <h2 className="text-xl font-semibold text-gray-800">
            Dashboard
          </h2>

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
