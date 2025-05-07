import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiBell,
  FiChevronLeft,
  FiChevronRight,
  FiChevronDown,
  FiChevronUp,
  FiHome,
  FiMail,
  FiUser,
} from "react-icons/fi";
import { RiAdminFill } from "react-icons/ri";
import { AuthContext } from "../../context/AuthContext";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const [expandedMenus, setExpandedMenus] = useState({});

  // Define nav items
  const navItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: <FiHome />,
    },
    {
      name: "Users",
      path: "/users",
      icon: <FiUser />,
      subItems: [
        { name: "Instructors", path: "/editors" },
        { name: "Admins", path: "/admins" },
      ],
    },
    {
      name: "Courses & Instructors",
      path: "/courses",
      icon: <FiMail />,
      subItems: [
        { name: "Instructor Management", path: "/courses/instructors" },
        // { name: "Affiliate Program Settings", path: "/courses" },
      ],
    },
    { name: "Plans", path: "/plans", icon: <FiBell /> },
    // { name: "Editors", path: "/editors", icon: <RiAdminFill /> },
    {
      name: "Mindfulness Content",
      path: "/resources",
      icon: <RiAdminFill />,
      subItems: [
        { name: "Pillars & Categories", path: "/pillars/categories" },
        { name: "Manage Content", path: "#" },
        { name: "Tag Management", path: "#" },
      ],
    },
    {
      name: "Onboarding Questionnaire",
      path: "/onboarding",
      icon: <RiAdminFill />,
      // subItems: [{ name: "User Analytics", path: "#" }],
    },
    // {
    //   name: "Journals",
    //   path: "#",
    //   icon: <RiAdminFill />,
    //   subItems: [
    //     { name: "View Journals", path: "#" },
    //     { name: "Analyze User Entries", path: "#" },
    //   ],
    // },
    {
      name: "Accountability Management",
      path: "/accountability",
      icon: <RiAdminFill />,
      subItems: [{ name: "User Goals & Habits", path: "#" }],
    },
    
    {
      name: "Push Notifications",
      path: "/notifications",
      icon: <RiAdminFill />,
      
    },
    // {
    //   name: "Settings",
    //   path: "#",
    //   icon: <RiAdminFill />,
    //   subItems: [
    //     { name: "App Configuration", path: "#" },
    //     { name: "Onboarding Questionnaires", path: "#" },
    //     { name: "Personalization Rules", path: "#" },
    //   ],
    // },
    // { name: "Logs & Activity History", path: "#", icon: <RiAdminFill /> },
  ];

  // Expand the menu if current path matches a subItem
  useEffect(() => {
    const newExpandedMenus = {};
    navItems.forEach((item) => {
      if (item.subItems?.some((sub) => location.pathname === sub.path)) {
        newExpandedMenus[item.name] = true;
      }
    });
    setExpandedMenus((prev) => ({ ...prev, ...newExpandedMenus }));
  }, [location.pathname]);

  const handleItemClick = (item) => {
    if (item.subItems) {
      setExpandedMenus((prev) => ({
        ...prev,
        [item.name]: !prev[item.name],
      }));
    }

    if (window.innerWidth < 640) {
      setSidebarOpen(false);
    }
  };

  return (
    <div
      className={`
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      sm:translate-x-0
      fixed sm:static top-0 left-0 h-full bg-[#F1F2F7] text-gray-800 transition-transform duration-300 ease-in-out
      ${sidebarOpen ? "w-64" : "w-64"}
      sm:${sidebarOpen ? "w-64" : "w-20"}
      z-50
    `}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        {sidebarOpen && <h1 className="text-xl font-bold">Trade Sense</h1>}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-300"
        >
          {sidebarOpen ? (
            <FiChevronLeft size={20} />
          ) : (
            <FiChevronRight size={20} />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-8 overflow-y-auto max-h-[calc(100vh-250px)] pr-2">
        <ul className="space-y-2 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const hasSubItems = Array.isArray(item.subItems);
            const isExpanded = expandedMenus[item.name];

            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  onClick={() => handleItemClick(item)}
                  className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                    isActive ? " text-primary" : "hover:text-primary"
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-xl mr-3">{item.icon}</span>
                    {(sidebarOpen || window.innerWidth >= 640) && (
                      <span>{item.name}</span>
                    )}
                  </div>
                  {hasSubItems && (sidebarOpen || window.innerWidth >= 640) && (
                    <span>
                      {isExpanded ? (
                        <FiChevronUp size={16} />
                      ) : (
                        <FiChevronDown size={16} />
                      )}
                    </span>
                  )}
                </Link>

                {/* Sub Items */}
                {hasSubItems && isExpanded && (
                  <ul className="ml-8 mt-1 space-y-1">
                    {item.subItems.map((sub) => {
                      const isSubActive = location.pathname === sub.path;
                      return (
                        <li key={sub.name}>
                          <Link
                            to={sub.path}
                            className={`block px-2 py-1 rounded-md text-sm transition-colors ${
                              isSubActive ? "text-primary" : ""
                            }`}
                            onClick={() => {
                              if (window.innerWidth < 640)
                                setSidebarOpen(false);
                            }}
                          >
                            {sub.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info */}
      {(sidebarOpen || window.innerWidth >= 640) && user && (
        <div className="absolute max-w-[250px] bottom-0 w-full p-4 bg-primary">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-white text-primary font-bold flex items-center justify-center">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3">
              <p className="font-medium text-white">{user.name}</p>
              <p className="text-xs text-indigo-200">{user.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="mt-3 w-full py-2 px-4 bg-red-500 rounded-lg text-sm hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
