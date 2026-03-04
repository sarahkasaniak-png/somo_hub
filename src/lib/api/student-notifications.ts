// src/lib/api/student-notifications.ts
import client from "./client";

export interface Notification {
  id: number;
  user_id: number;
  sender_id: number | null;
  title: string;
  message: string;
  type: 'application_update' | 'payment' | 'session' | 'enrollment' | 'community' | 'tutor' | 'system' | 'promotion';
  action_url: string | null;
  action_text: string | null;
  metadata: any;
  is_read: 0 | 1;
  is_archived: 0 | 1;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
  read_at: string | null;
  archived_at: string | null;
  // Joined fields
  sender_first_name?: string;
  sender_last_name?: string;
  sender_avatar?: string;
}

export interface NotificationsResponse {
  success: boolean;
  message?: string;
  data: {
    notifications: Notification[];
    total: number;
    page: number;
    totalPages: number;
  };
}

export interface NotificationResponse {
  success: boolean;
  message?: string;
  data: Notification;
}

export interface UnreadCountResponse {
  success: boolean;
  data: {
    count: number;
  };
}

export interface NotificationPreferences {
  id: number;
  user_id: number;
  notification_type: string;
  email_enabled: 0 | 1;
  push_enabled: 0 | 1;
  in_app_enabled: 0 | 1;
  created_at: string;
  updated_at: string;
}

export interface PreferencesResponse {
  success: boolean;
  data: NotificationPreferences[];
}

const studentNotificationsApi = {
  /**
   * Get student notifications with pagination and filters
   */
  getNotifications: (params?: {
    page?: number;
    limit?: number;
    unreadOnly?: boolean;
    type?: string;
    priority?: string;
  }): Promise<NotificationsResponse> =>
    client.get("/student/notifications", params),

  /**
   * Get unread notification count
   */
  getUnreadCount: (): Promise<UnreadCountResponse> =>
    client.get("/student/notifications/unread/count"),

  /**
   * Get notification by ID
   */
  getNotification: (notificationId: number): Promise<NotificationResponse> =>
    client.get(`/student/notifications/${notificationId}`),

  /**
   * Mark notification as read
   */
  markAsRead: (notificationId: number): Promise<{ success: boolean; message: string }> =>
    client.put(`/student/notifications/${notificationId}/read`, {}),

  /**
   * Mark all notifications as read
   */
  markAllAsRead: (): Promise<{ success: boolean; message: string }> =>
    client.put("/student/notifications/read-all", {}),

  /**
   * Archive notification
   */
  archiveNotification: (notificationId: number): Promise<{ success: boolean; message: string }> =>
    client.put(`/student/notifications/${notificationId}/archive`, {}),

  /**
   * Delete notification
   */
  deleteNotification: (notificationId: number): Promise<{ success: boolean; message: string }> =>
    client.delete(`/student/notifications/${notificationId}`),

  /**
   * Get notification preferences
   */
  getPreferences: (): Promise<PreferencesResponse> =>
    client.get("/student/notifications/preferences"),

  /**
   * Update notification preference
   */
  updatePreference: (
    notificationType: string,
    data: {
      email_enabled?: boolean;
      push_enabled?: boolean;
      in_app_enabled?: boolean;
    }
  ): Promise<{ success: boolean; message: string }> =>
    client.put(`/student/notifications/preferences/${notificationType}`, data),
};

export default studentNotificationsApi;