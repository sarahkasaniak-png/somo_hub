// src/app/student/notifications/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCheck,
  Archive,
  Trash2,
  Clock,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  AlertCircle,
  CreditCard,
  Calendar,
  Users,
  BookOpen,
  MessageSquare,
  Award,
  Mail,
  Smartphone,
  Globe,
} from "lucide-react";
import studentNotificationsApi, {
  Notification,
} from "@/lib/api/student-notifications";
import { formatDistanceToNow } from "date-fns";

export default function StudentNotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });
  const [filters, setFilters] = useState({
    unreadOnly: false,
    type: "",
    priority: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [preferences, setPreferences] = useState<any[]>([]);
  const [showPreferences, setShowPreferences] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  // Load notifications
  const loadNotifications = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: pagination.page,
        limit: pagination.limit,
      };

      if (filters.unreadOnly) params.unreadOnly = true;
      if (filters.type) params.type = filters.type;
      if (filters.priority) params.priority = filters.priority;

      const response = await studentNotificationsApi.getNotifications(params);

      if (response.success && response.data) {
        setNotifications(response.data.notifications);
        setPagination({
          page: response.data.page,
          limit: pagination.limit,
          total: response.data.total,
          totalPages: response.data.totalPages,
        });
      }
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load unread count
  const loadUnreadCount = async () => {
    try {
      const response = await studentNotificationsApi.getUnreadCount();
      if (response.success && response.data) {
        setUnreadCount(response.data.count);
      }
    } catch (error) {
      console.error("Failed to load unread count:", error);
    }
  };

  // Load preferences
  const loadPreferences = async () => {
    try {
      const response = await studentNotificationsApi.getPreferences();
      if (response.success && response.data) {
        setPreferences(response.data);
      }
    } catch (error) {
      console.error("Failed to load preferences:", error);
    }
  };

  useEffect(() => {
    loadNotifications();
    loadUnreadCount();
    loadPreferences();

    // Set up polling for unread count (every 30 seconds)
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [pagination.page, filters]);

  // Mark as read
  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await studentNotificationsApi.markAsRead(notificationId);

      // Update local state
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, is_read: 1 } : n)),
      );

      // Update unread count
      setUnreadCount((prev) => Math.max(0, prev - 1));

      // If it's the selected notification, update it
      if (selectedNotification?.id === notificationId) {
        setSelectedNotification({ ...selectedNotification, is_read: 1 });
      }
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await studentNotificationsApi.markAllAsRead();

      // Update local state
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: 1 })));

      setUnreadCount(0);

      if (selectedNotification) {
        setSelectedNotification({ ...selectedNotification, is_read: 1 });
      }
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  // Archive notification
  const handleArchive = async (notificationId: number) => {
    try {
      await studentNotificationsApi.archiveNotification(notificationId);

      // Remove from list
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));

      if (selectedNotification?.id === notificationId) {
        setShowDetail(false);
        setSelectedNotification(null);
      }

      // Reload unread count
      loadUnreadCount();
    } catch (error) {
      console.error("Failed to archive notification:", error);
    }
  };

  // Delete notification
  const handleDelete = async (notificationId: number) => {
    if (!confirm("Are you sure you want to delete this notification?")) return;

    try {
      await studentNotificationsApi.deleteNotification(notificationId);

      // Remove from list
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));

      if (selectedNotification?.id === notificationId) {
        setShowDetail(false);
        setSelectedNotification(null);
      }

      // Reload unread count
      loadUnreadCount();
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  // Update preference
  const handleUpdatePreference = async (
    type: string,
    field: "email_enabled" | "push_enabled" | "in_app_enabled",
    value: boolean,
  ) => {
    try {
      await studentNotificationsApi.updatePreference(type, { [field]: value });

      // Update local state
      setPreferences((prev) =>
        prev.map((p) =>
          p.notification_type === type ? { ...p, [field]: value ? 1 : 0 } : p,
        ),
      );
    } catch (error) {
      console.error("Failed to update preference:", error);
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "payment":
        return <CreditCard className="w-5 h-5 text-green-500" />;
      case "session":
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case "enrollment":
        return <BookOpen className="w-5 h-5 text-purple-500" />;
      case "community":
        return <Users className="w-5 h-5 text-orange-500" />;
      case "tutor":
        return <Award className="w-5 h-5 text-indigo-500" />;
      case "application_update":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "system":
        return <Bell className="w-5 h-5 text-gray-500" />;
      default:
        return <MessageSquare className="w-5 h-5 text-gray-500" />;
    }
  };

  // Get priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-blue-100 text-blue-800";
      case "low":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500 mt-1">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
              : "No unread notifications"}
          </p>
        </div>

        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>

          <button
            onClick={() => setShowPreferences(!showPreferences)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Bell className="w-4 h-4 mr-2" />
            Preferences
          </button>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"
            >
              <CheckCheck className="w-4 h-4 mr-2" />
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-900">Filter Notifications</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.unreadOnly ? "unread" : "all"}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    unreadOnly: e.target.value === "unread",
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All</option>
                <option value="unread">Unread only</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={filters.type}
                onChange={(e) =>
                  setFilters({ ...filters, type: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All types</option>
                <option value="payment">Payment</option>
                <option value="session">Session</option>
                <option value="enrollment">Enrollment</option>
                <option value="community">Community</option>
                <option value="tutor">Tutor</option>
                <option value="system">System</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={filters.priority}
                onChange={(e) =>
                  setFilters({ ...filters, priority: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Panel */}
      {showPreferences && (
        <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-900">
              Notification Preferences
            </h3>
            <button
              onClick={() => setShowPreferences(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            {preferences.map((pref) => (
              <div
                key={pref.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900 capitalize">
                    {pref.notification_type.replace("_", " ")}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <input
                      type="checkbox"
                      checked={pref.email_enabled === 1}
                      onChange={(e) =>
                        handleUpdatePreference(
                          pref.notification_type,
                          "email_enabled",
                          e.target.checked,
                        )
                      }
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                  </label>
                  <label className="flex items-center space-x-2">
                    <Smartphone className="w-4 h-4 text-gray-400" />
                    <input
                      type="checkbox"
                      checked={pref.push_enabled === 1}
                      onChange={(e) =>
                        handleUpdatePreference(
                          pref.notification_type,
                          "push_enabled",
                          e.target.checked,
                        )
                      }
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                  </label>
                  <label className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <input
                      type="checkbox"
                      checked={pref.in_app_enabled === 1}
                      onChange={(e) =>
                        handleUpdatePreference(
                          pref.notification_type,
                          "in_app_enabled",
                          e.target.checked,
                        )
                      }
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main content with split view */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Notifications List */}
        <div
          className={`${showDetail ? "lg:w-1/2" : "lg:w-full"} transition-all duration-300`}
        >
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">
                  Loading notifications...
                </p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-12 text-center">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No notifications
                </h3>
                <p className="text-sm text-gray-500">
                  {filters.unreadOnly
                    ? "You don't have any unread notifications"
                    : "You don't have any notifications yet"}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => {
                      setSelectedNotification(notification);
                      setShowDetail(true);
                      if (!notification.is_read) {
                        handleMarkAsRead(notification.id);
                      }
                    }}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.is_read ? "bg-purple-50/50" : ""
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p
                            className={`text-sm font-medium ${!notification.is_read ? "text-gray-900" : "text-gray-600"}`}
                          >
                            {notification.title}
                          </p>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(notification.priority)}`}
                          >
                            {notification.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-xs text-gray-400">
                            <Clock className="w-3 h-3" />
                            <span>
                              {formatDistanceToNow(
                                new Date(notification.created_at),
                                { addSuffix: true },
                              )}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {!notification.is_read && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkAsRead(notification.id);
                                }}
                                className="p-1 hover:bg-purple-100 rounded-full text-purple-600"
                                title="Mark as read"
                              >
                                <CheckCheck className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleArchive(notification.id);
                              }}
                              className="p-1 hover:bg-gray-100 rounded-full text-gray-400"
                              title="Archive"
                            >
                              <Archive className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(notification.id);
                              }}
                              className="p-1 hover:bg-red-100 rounded-full text-red-400"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <button
                  onClick={() =>
                    setPagination({ ...pagination, page: pagination.page - 1 })
                  }
                  disabled={pagination.page === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-700">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() =>
                    setPagination({ ...pagination, page: pagination.page + 1 })
                  }
                  disabled={pagination.page === pagination.totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Notification Detail */}
        {showDetail && selectedNotification && (
          <div className="lg:w-1/2">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sticky top-4">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  {getNotificationIcon(selectedNotification.type)}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {selectedNotification.title}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {new Date(
                        selectedNotification.created_at,
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetail(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(selectedNotification.priority)}`}
                >
                  {selectedNotification.priority.charAt(0).toUpperCase() +
                    selectedNotification.priority.slice(1)}{" "}
                  Priority
                </span>
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {selectedNotification.type.replace("_", " ")}
                </span>
                {selectedNotification.is_read ? (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Read
                  </span>
                ) : (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Unread
                  </span>
                )}
              </div>

              <div className="prose prose-sm max-w-none mb-6">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {selectedNotification.message}
                </p>
              </div>

              {selectedNotification.metadata && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Additional Information
                  </h3>
                  <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                    {JSON.stringify(selectedNotification.metadata, null, 2)}
                  </pre>
                </div>
              )}

              {selectedNotification.action_url && (
                <div className="mb-6">
                  <Link
                    href={selectedNotification.action_url}
                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"
                    onClick={() => setShowDetail(false)}
                  >
                    {selectedNotification.action_text || "View Details"}
                  </Link>
                </div>
              )}

              {selectedNotification.sender_id && (
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    From
                  </h3>
                  <div className="flex items-center space-x-2">
                    {selectedNotification.sender_avatar ? (
                      <img
                        src={selectedNotification.sender_avatar}
                        alt="Sender"
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">
                          {selectedNotification.sender_first_name?.charAt(0) ||
                            "?"}
                        </span>
                      </div>
                    )}
                    <span className="text-sm text-gray-600">
                      {selectedNotification.sender_first_name}{" "}
                      {selectedNotification.sender_last_name}
                    </span>
                  </div>
                </div>
              )}

              <div className="border-t mt-4 pt-4 flex space-x-3">
                {!selectedNotification.is_read && (
                  <button
                    onClick={() => handleMarkAsRead(selectedNotification.id)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <CheckCheck className="w-4 h-4 inline mr-2" />
                    Mark as read
                  </button>
                )}
                <button
                  onClick={() => handleArchive(selectedNotification.id)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Archive className="w-4 h-4 inline mr-2" />
                  Archive
                </button>
                <button
                  onClick={() => handleDelete(selectedNotification.id)}
                  className="flex-1 px-4 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 inline mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
