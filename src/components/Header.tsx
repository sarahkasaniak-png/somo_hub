// src/components/Header.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../app/context/AuthContext";
import {
  Bell,
  Clock,
  X,
  CreditCard,
  Calendar,
  Users,
  BookOpen,
  Award,
  AlertCircle,
  ChevronDown,
  TrendingUp,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import studentNotificationsApi, {
  Notification,
} from "@/lib/api/student-notifications";
import tutorNotificationsApi from "@/lib/api/tutor-notifications";

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header = ({ onMenuToggle }: HeaderProps) => {
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const { user, userStatus, profileData, logout } = useAuth();

  // Check if mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showNotifications || showProfile) {
        const target = event.target as HTMLElement;
        if (
          !target.closest(".dropdown-menu") &&
          !target.closest(".dropdown-trigger")
        ) {
          setShowNotifications(false);
          setShowProfile(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications, showProfile]);

  // Load notifications when user changes
  useEffect(() => {
    if (user) {
      loadNotifications();

      // Set up polling for unread count (every 30 seconds)
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user, pathname]);

  const loadNotifications = async () => {
    if (!user) return;

    setLoadingNotifications(true);
    try {
      const isTutor =
        pathname.includes("/tutor/") || user?.roles?.includes("tutor");

      if (isTutor) {
        const response = await tutorNotificationsApi.getNotifications({
          limit: 5,
          unreadOnly: false,
        });
        if (response.success && response.data) {
          setNotifications(response.data.notifications);
        }

        const countResponse = await tutorNotificationsApi.getUnreadCount();
        if (countResponse.success && countResponse.data) {
          setUnreadCount(countResponse.data.count);
        }
      } else {
        const response = await studentNotificationsApi.getNotifications({
          limit: 5,
          unreadOnly: false,
        });
        if (response.success && response.data) {
          setNotifications(response.data.notifications);
        }

        const countResponse = await studentNotificationsApi.getUnreadCount();
        if (countResponse.success && countResponse.data) {
          setUnreadCount(countResponse.data.count);
        }
      }
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const handleMarkNotificationRead = async (notificationId: number) => {
    try {
      const isTutor =
        pathname.includes("/tutor/") || user?.roles?.includes("tutor");

      if (isTutor) {
        await tutorNotificationsApi.markAsRead(notificationId);
      } else {
        await studentNotificationsApi.markAsRead(notificationId);
      }

      // Update local state
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, is_read: 1 } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const isTutor =
        pathname.includes("/tutor/") || user?.roles?.includes("tutor");

      if (isTutor) {
        await tutorNotificationsApi.markAllAsRead();
      } else {
        await studentNotificationsApi.markAllAsRead();
      }

      // Update local state
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: 1 })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "payment":
        return <CreditCard className="w-4 h-4 text-green-500" />;
      case "session":
        return <Calendar className="w-4 h-4 text-blue-500" />;
      case "enrollment":
        return <BookOpen className="w-4 h-4 text-purple-500" />;
      case "community":
        return <Users className="w-4 h-4 text-orange-500" />;
      case "tutor":
        return <Award className="w-4 h-4 text-indigo-500" />;
      case "application_update":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "system":
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getCurrentRole = () => {
    if (pathname.includes("/tutor/")) return "Tutor";
    if (pathname.includes("/community/")) return "Community Admin";
    if (pathname.includes("/student/")) return "Student";
    if (pathname.includes("/affiliate/")) return "Affiliate";

    // Determine from user roles
    if (user?.roles) {
      if (user.roles.includes("affiliate")) return "Affiliate";
      if (user.roles.includes("tutor")) return "Tutor";
      if (user.roles.includes("community")) return "Community Admin";
      if (user.roles.includes("student")) return "Student";
    }

    return "User";
  };

  const handleLogout = async () => {
    try {
      setShowProfile(false);
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (profileData?.first_name && profileData?.last_name) {
      return `${profileData.first_name} ${profileData.last_name}`;
    }
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    if (user?.name) return user.name;
    return user?.email || "User";
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    const name = getUserDisplayName();
    if (name === "User" && user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  // Get user avatar URL
  const getUserAvatar = () => {
    return profileData?.avatar_url || user?.avatar_url || null;
  };

  // Get dashboard link based on role
  const getDashboardLink = () => {
    if (user?.roles?.includes("affiliate")) return "/affiliate/dashboard";
    if (user?.roles?.includes("tutor")) return "/tutor/dashboard";
    if (user?.roles?.includes("community")) return "/community/dashboard";
    return "/student/dashboard";
  };

  return (
    <header className="nav-wrapper z-50">
      <div className="nav-container">
        <nav className="navbar">
          {/* Left: Mobile Menu Button and Logo */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={onMenuToggle}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <Link href="/" className="flex items-center space-x-1">
              <div className="w-8 h-8 flex items-center justify-center">
                <img
                  src="/images/logo_purple.png"
                  alt="SomoHub Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-main hidden md:inline text-xl md:text-2xl font-semibold">
                SomoHub
              </span>
              <span className="text-main md:hidden text-xl font-semibold">
                SomoHub
              </span>
            </Link>
          </div>

          {/* Right: Notifications and Profile */}
          <div className="flex items-center space-x-4">
            {/* Mobile search dropdown */}
            {showSearch && (
              <div className="md:hidden fixed inset-0 bg-white z-50">
                <div className="h-full p-4 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="font-semibold text-gray-900">Search</div>
                    <button
                      onClick={() => setShowSearch(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                      aria-label="Close search"
                    >
                      <svg
                        className="w-5 h-5 text-gray-600"
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
                  </div>
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search courses, sessions, tutors..."
                      className="w-full px-4 py-3 pl-10 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      autoFocus
                    />
                    <svg
                      className="absolute left-3 top-3.5 w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <div className="mt-6 space-y-4 flex-1 overflow-y-auto">
                    <div>
                      <div className="font-medium text-gray-900">
                        Recent Searches
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Math courses, Tutor sessions, Community events
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        Popular Courses
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Calculus, Physics, Programming
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfile(false);
                }}
                className="p-2 hover:bg-gray-100 rounded-full relative dropdown-trigger"
                aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ""}`}
              >
                <Bell className="w-5 h-5 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {showNotifications && (
                <>
                  {/* Mobile overlay */}
                  {isMobile && (
                    <div
                      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                      onClick={() => setShowNotifications(false)}
                    />
                  )}

                  <div
                    className={`dropdown-menu ${isMobile ? "mobile-fullscreen" : ""}`}
                  >
                    <div className="pb-3 border-b px-3">
                      <div className="font-medium text-gray-900 flex justify-between items-center">
                        <span>
                          Notifications {unreadCount > 0 && `(${unreadCount})`}
                        </span>
                        <div className="flex items-center space-x-3">
                          {unreadCount > 0 && (
                            <button
                              onClick={handleMarkAllRead}
                              className="text-xs text-purple-600 hover:text-purple-800"
                            >
                              Mark all read
                            </button>
                          )}
                          <Link
                            href={
                              pathname.includes("/tutor/")
                                ? "/tutor/notifications"
                                : "/student/notifications"
                            }
                            className="text-xs text-gray-500 hover:text-gray-700"
                            onClick={() => setShowNotifications(false)}
                          >
                            View all
                          </Link>
                          {isMobile && (
                            <button
                              onClick={() => setShowNotifications(false)}
                              className="p-2 hover:bg-gray-100 rounded-lg"
                              aria-label="Close notifications"
                            >
                              <svg
                                className="w-5 h-5 text-gray-600"
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
                        </div>
                      </div>
                    </div>

                    <div className="py-3 max-h-[60vh] overflow-y-auto">
                      {loadingNotifications ? (
                        <div className="py-8 text-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
                          <p className="text-xs text-gray-500 mt-2">
                            Loading...
                          </p>
                        </div>
                      ) : notifications.length === 0 ? (
                        <div className="py-8 text-center">
                          <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">
                            No notifications
                          </p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            onClick={() => {
                              if (!notification.is_read) {
                                handleMarkNotificationRead(notification.id);
                              }
                              if (notification.action_url) {
                                router.push(notification.action_url);
                              }
                              setShowNotifications(false);
                            }}
                            className={`items cursor-pointer ${!notification.is_read ? "bg-purple-50/50" : ""}`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0">
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-gray-900 text-sm">
                                  {notification.title}
                                </div>
                                <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                                  {notification.message}
                                </div>
                                <div className="text-xs text-gray-400 mt-2 flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {formatDistanceToNow(
                                    new Date(notification.created_at),
                                    { addSuffix: true },
                                  )}
                                  {notification.priority === "urgent" && (
                                    <span className="ml-2 px-1.5 py-0.5 bg-red-100 text-red-800 rounded-full text-[10px]">
                                      Urgent
                                    </span>
                                  )}
                                </div>
                              </div>
                              {!notification.is_read && (
                                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {notifications.length > 0 && (
                      <div className="pt-3 border-t px-3">
                        <Link
                          href={
                            pathname.includes("/tutor/")
                              ? "/tutor/notifications"
                              : "/student/notifications"
                          }
                          className="block w-full text-center text-purple-600 hover:text-purple-800 font-medium py-2 text-sm"
                          onClick={() => setShowNotifications(false)}
                        >
                          View all notifications
                        </Link>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowProfile(!showProfile);
                  setShowNotifications(false);
                }}
                className="flex items-center space-x-2 p-1 hover:bg-gray-100 rounded-full dropdown-trigger"
                aria-label="Profile menu"
              >
                {getUserAvatar() ? (
                  <img
                    src={getUserAvatar()!}
                    alt={getUserDisplayName()}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-medium">
                    {getUserInitials()}
                  </div>
                )}
                <ChevronDown className="w-4 h-4 text-gray-500 hidden md:block" />
              </button>

              {showProfile && (
                <>
                  {/* Mobile overlay */}
                  {isMobile && (
                    <div
                      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                      onClick={() => setShowProfile(false)}
                    />
                  )}

                  <div
                    className={`dropdown-menu min-w-64 ${isMobile ? "mobile-fullscreen" : ""}`}
                  >
                    <div className="pb-4 border-b px-3">
                      <div className="flex items-center space-x-3">
                        {getUserAvatar() ? (
                          <img
                            src={getUserAvatar()!}
                            alt={getUserDisplayName()}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-medium text-lg">
                            {getUserInitials()}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 truncate">
                            {getUserDisplayName()}
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            {user?.email || ""}
                          </div>
                          <div className="text-xs text-purple-600 mt-1">
                            {getCurrentRole()}
                          </div>
                          {user?.is_affiliate && user?.affiliate_code && (
                            <div className="text-xs text-gray-500 mt-1">
                              Code: {user.affiliate_code}
                            </div>
                          )}
                        </div>
                        {isMobile && (
                          <button
                            onClick={() => setShowProfile(false)}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                            aria-label="Close profile"
                          >
                            <svg
                              className="w-5 h-5 text-gray-600"
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
                      </div>
                    </div>

                    <div className="py-3">
                      <Link
                        href={getDashboardLink()}
                        className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors mx-2"
                        onClick={() => setShowProfile(false)}
                      >
                        <TrendingUp className="w-5 h-5 text-gray-500" />
                        <span className="font-medium text-gray-700">
                          Dashboard
                        </span>
                      </Link>

                      <Link
                        href={`/${getCurrentRole().toLowerCase()}/profile`}
                        className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors mx-2"
                        onClick={() => setShowProfile(false)}
                      >
                        <svg
                          className="w-5 h-5 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span className="font-medium text-gray-700">
                          My Profile
                        </span>
                      </Link>

                      <Link
                        href={`/help/${getCurrentRole().toLowerCase()}`}
                        className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors mx-2"
                        onClick={() => setShowProfile(false)}
                      >
                        <svg
                          className="w-5 h-5 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="font-medium text-gray-700">
                          Help & Support
                        </span>
                      </Link>

                      <div className="border-t mt-3 pt-3 mx-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors w-full text-left text-red-600"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          <span className="font-medium">Logout</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </nav>
      </div>

      {/* Add mobile-friendly styles */}
      <style jsx global>{`
        /* Mobile fullscreen dropdown styles */
        .mobile-fullscreen {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          max-width: 100vw !important;
          max-height: 100vh !important;
          border-radius: 0 !important;
          margin: 0 !important;
          z-index: 50 !important;
          overflow-y: auto !important;
          animation: slide-up 0.3s ease-out !important;
        }

        /* Desktop dropdown styles */
        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          min-width: 320px;
          max-width: 400px;
          max-height: 80vh;
          overflow-y: auto;
          z-index: 50;
          margin-top: 8px;
          animation: fade-in 0.2s ease-out;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Better touch targets for mobile */
        @media (max-width: 768px) {
          .dropdown-trigger {
            padding: 10px;
            min-height: 44px;
          }

          .items {
            padding: 16px;
            border-bottom: 1px solid #f3f4f6;
          }

          .items:last-child {
            border-bottom: none;
          }

          .items:hover {
            background-color: #f9fafb;
          }
        }

        /* Custom scrollbar for dropdowns */
        .dropdown-menu::-webkit-scrollbar {
          width: 6px;
        }

        .dropdown-menu::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .dropdown-menu::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }

        .dropdown-menu::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }

        /* Line clamp utility */
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </header>
  );
};

export default Header;
