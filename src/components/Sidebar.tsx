"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  Target,
  Users,
  DollarSign,
  User,
  BarChart3,
  Laptop,
  GraduationCap,
  CalendarDays, // Add this import
  Calendar,
  Presentation,
} from "lucide-react";

interface SidebarProps {
  role: "tutor" | "student" | "community";
  isMobileOpen: boolean;
  setIsMobileOpen: (isOpen: boolean) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (isCollapsed: boolean) => void;
  isMobile: boolean;
}

const Sidebar = ({
  role,
  isMobileOpen,
  setIsMobileOpen,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  isMobile,
}: SidebarProps) => {
  const pathname = usePathname();

  const tutorMenu = [
    { name: "Dashboard", href: "/tutor/dashboard", icon: Home },
    { name: "Courses", href: "/tutor/courses", icon: BookOpen },
    {
      name: "Sessions",
      href: "/tutor/sessions",
      icon: Target,
      // Add submenu for sessions
      submenu: [
        { name: "All Sessions", href: "/tutor/sessions", icon: Target },
        {
          name: "Class Schedule",
          href: "/tutor/schedules",
          icon: CalendarDays,
        },
        {
          name: "Create Session",
          href: "/tutor/sessions/create",
          icon: Calendar,
        },
      ],
    },
    { name: "Enrollments", href: "/tutor/enrollments", icon: Users },
    { name: "Earnings", href: "/tutor/earnings", icon: DollarSign },
    { name: "Profile", href: "/tutor/profile", icon: User },
  ];

  const studentMenu = [
    { name: "Dashboard", href: "/student/dashboard", icon: Home },
    {
      name: "My Classes",
      href: "/student/schedule",
      icon: Presentation,
    },
    {
      name: "Sessions / Tuition",
      href: "/student/sessions",
      icon: GraduationCap,
    },
    // {
    //   name: "My Schedule",
    //   href: "/student/schedule",
    //   icon: CalendarDays,
    // },

    // {
    //   name: "Learning History",
    //   href: "/student/learning-history",
    //   icon: BarChart3,
    // },
    { name: "Payments", href: "/student/payments", icon: DollarSign },
    // { name: "Virtual Class", href: "/student/virtual-class", icon: Laptop },
    { name: "Profile", href: "/student/profile", icon: User },
  ];

  const communityMenu = [
    { name: "Dashboard", href: "/community/dashboard", icon: Home },
    { name: "Analytics", href: "/community/analytics", icon: BarChart3 },
    { name: "Courses", href: "/community/courses", icon: BookOpen },
    { name: "Sessions", href: "/community/sessions", icon: Target },
    { name: "Schedule", href: "/community/schedule", icon: CalendarDays },
    { name: "Enrollments", href: "/community/enrollments", icon: Users },
    { name: "Profile", href: "/community/profile", icon: User },
  ];

  const menu =
    role === "tutor"
      ? tutorMenu
      : role === "student"
        ? studentMenu
        : communityMenu;

  const roleColors = {
    tutor: "from-purple-600 to-blue-500",
    student: "from-green-600 to-teal-500",
    community: "from-indigo-600 to-purple-500",
  };

  // Track expanded submenus
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>(
    {},
  );

  // Handle click on menu item
  const handleMenuItemClick = () => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  // Toggle submenu
  const toggleSubmenu = (menuName: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  const getCurrentRole = () => {
    if (pathname.includes("/tutor/")) return "Tutor";
    if (pathname.includes("/community/")) return "Community Admin";
    if (pathname.includes("/student/")) return "Student";
    return "User";
  };

  // Check if a menu or any of its subitems is active
  const isMenuActive = (item: any) => {
    if (item.submenu) {
      return item.submenu.some(
        (subItem: any) =>
          pathname === subItem.href || pathname.startsWith(subItem.href + "/"),
      );
    }

    if (item.name === "Dashboard") {
      return (
        pathname === item.href ||
        (role === "tutor" && pathname === "/tutor") ||
        (role === "student" && pathname === "/student") ||
        (role === "community" && pathname === "/community")
      );
    }

    return pathname === item.href || pathname.startsWith(item.href + "/");
  };

  // Auto-expand submenu if a child is active
  useEffect(() => {
    const newExpandedMenus = { ...expandedMenus };
    menu.forEach((item) => {
      if (item.submenu) {
        const hasActiveChild = item.submenu.some(
          (subItem: any) =>
            pathname === subItem.href ||
            pathname.startsWith(subItem.href + "/"),
        );
        if (hasActiveChild && !newExpandedMenus[item.name]) {
          newExpandedMenus[item.name] = true;
        }
      }
    });
    setExpandedMenus(newExpandedMenus);
  }, [pathname]);

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`flex flex-col bg-white border-r border-gray-200 h-screen transition-all duration-300 fixed left-0 top-0 z-40 ${
          isMobile
            ? `w-64 transform transition-transform duration-300 ${
                isMobileOpen ? "translate-x-0" : "-translate-x-full"
              }`
            : isSidebarCollapsed
              ? "w-20"
              : "w-64"
        } pt-16`}
      >
        {/* Close button for mobile */}
        {isMobile && isMobileOpen && (
          <button
            onClick={() => setIsMobileOpen(false)}
            className="absolute -right-3 top-20 bg-white border border-gray-300 rounded-full p-1.5 shadow-md hover:shadow-lg transition-shadow z-50 md:hidden"
            aria-label="Close menu"
          >
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        {/* Toggle button for desktop */}
        {!isMobile && (
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="absolute -right-3 top-20 bg-white border border-gray-300 rounded-full p-1.5 shadow-md hover:shadow-lg transition-shadow z-50 cursor-pointer"
            aria-label={
              isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
            }
          >
            <svg
              className={`w-4 h-4 text-gray-600 transition-transform ${
                isSidebarCollapsed ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
          </button>
        )}

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto pt-2">
          <div className="h-full flex flex-col">
            {/* role indicator */}
            {!isSidebarCollapsed || isMobile ? (
              <div className="px-4 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  {role === "tutor" && (
                    <Users className="w-6 h-6 text-purple-600" />
                  )}
                  {role === "student" && (
                    <GraduationCap className="w-6 h-6 text-green-600" />
                  )}
                  {role === "community" && (
                    <Users className="w-6 h-6 text-indigo-600" />
                  )}
                  <span className="text-md font-semibold text-gray-700">
                    {getCurrentRole()}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex justify-center pb-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium bg-gradient-to-r ${roleColors[role]}`}
                >
                  {role === "tutor" && <Users className="w-5 h-5 text-white" />}
                  {role === "student" && (
                    <GraduationCap className="w-5 h-5 text-white" />
                  )}
                  {role === "community" && (
                    <Users className="w-5 h-5 text-white" />
                  )}
                </div>
              </div>
            )}

            {/* Menu items */}
            <nav className="p-4 flex-1">
              <ul className="space-y-2">
                {menu.map((item) => {
                  const Icon = item.icon;
                  const isActive = isMenuActive(item);
                  const hasSubmenu = item.submenu && item.submenu.length > 0;
                  const isExpanded = expandedMenus[item.name];

                  return (
                    <li key={item.name}>
                      {hasSubmenu ? (
                        // Parent menu with submenu
                        <div>
                          <button
                            onClick={(e) => toggleSubmenu(item.name, e)}
                            className={`w-full flex items-center ${
                              isSidebarCollapsed && !isMobile
                                ? "justify-center p-3"
                                : "justify-between p-3"
                            } rounded-lg transition-colors ${
                              isActive
                                ? "bg-gray-200 text-zinc-900 font-semibold"
                                : "hover:bg-gray-100 text-gray-700 hover:text-gray-900"
                            }`}
                            title={
                              isSidebarCollapsed && !isMobile ? item.name : ""
                            }
                          >
                            <div
                              className={`flex items-center ${!isSidebarCollapsed || isMobile ? "space-x-3" : ""}`}
                            >
                              <Icon
                                className={`w-6 h-6 flex-shrink-0 ${
                                  isActive ? "text-zinc-900" : "text-gray-600"
                                }`}
                              />
                              {(!isSidebarCollapsed || isMobile) && (
                                <span
                                  className={`truncate transition-all ${
                                    isActive
                                      ? "text-zinc-900 font-semibold"
                                      : "text-gray-700 font-medium"
                                  }`}
                                >
                                  {item.name}
                                </span>
                              )}
                            </div>

                            {(!isSidebarCollapsed || isMobile) && (
                              <svg
                                className={`w-4 h-4 transition-transform ${
                                  isExpanded ? "rotate-180" : ""
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            )}
                          </button>

                          {/* Submenu */}
                          {isExpanded && (!isSidebarCollapsed || isMobile) && (
                            <ul className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-2">
                              {item.submenu.map((subItem: any) => {
                                const SubIcon = subItem.icon;
                                const isSubActive =
                                  pathname === subItem.href ||
                                  pathname.startsWith(subItem.href + "/");

                                return (
                                  <li key={subItem.name}>
                                    <Link
                                      href={subItem.href}
                                      className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                                        isSubActive
                                          ? "bg-purple-50 text-purple-700 font-medium"
                                          : "hover:bg-gray-50 text-gray-600 hover:text-gray-900"
                                      }`}
                                      onClick={handleMenuItemClick}
                                    >
                                      <SubIcon className="w-4 h-4 flex-shrink-0" />
                                      <span className="text-sm truncate">
                                        {subItem.name}
                                      </span>
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </div>
                      ) : (
                        // Regular menu item without submenu
                        <Link
                          href={item.href}
                          className={`flex items-center ${
                            isSidebarCollapsed && !isMobile
                              ? "justify-center p-3"
                              : "space-x-3 p-3"
                          } rounded-lg transition-colors ${
                            isActive
                              ? "bg-gray-200 text-zinc-900 font-semibold"
                              : "hover:bg-gray-100 text-gray-700 hover:text-gray-900"
                          }`}
                          title={
                            isSidebarCollapsed && !isMobile ? item.name : ""
                          }
                          onClick={handleMenuItemClick}
                        >
                          <Icon
                            className={`w-6 h-6 flex-shrink-0 ${
                              isActive ? "text-zinc-900" : "text-gray-600"
                            }`}
                          />
                          {(!isSidebarCollapsed || isMobile) && (
                            <span
                              className={`truncate transition-all ${
                                isActive
                                  ? "text-zinc-900 font-semibold"
                                  : "text-gray-700 font-medium"
                              }`}
                            >
                              {item.name}
                            </span>
                          )}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
