// src/lib/api/student.ts
import client, { API_BASE } from "./client";
import { ProfileData } from "@/types/user.types";
import { PaymentMethod } from "@/types/payment.types";

// Types
export interface Enrollment {
  id: number;
  tutor_course_session_id: number;
  student_id: number;
  enrollment_status: 'pending' | 'active' | 'completed' | 'dropped' | 'suspended';
  payment_status: 'pending' | 'paid' | 'partial' | 'refunded';
  payment_amount: number;
  payment_reference: string | null;
  enrolled_at: string;
  completed_at: string | null;
  progress_percentage: number;
  classes_attended: number;
  total_classes: number;
  last_accessed_at: string | null;
  notes: string | null;
  session: {
    id: number;
    name: string;
    description: string | null;
    session_code: string;
    session_type: string;
    start_date: string;
    end_date: string;
    max_students: number;
    fee_amount: number;
    fee_currency: string;
    status: string;
    enrollment_status: string;
    current_enrollment: number;
    course: {
      id: number;
      title: string;
      subject: string;
      level: string;
      thumbnail_url: string | null;
    };
    tutor: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      avatar_url: string | null;
      bio: string | null;
      rating: number;
    };
  };
}

export interface Schedule {
  id: number;
  tutor_course_session_id: number;
  week_number: number;
  class_number: number;
  title: string;
  description: string | null;
  date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  mode: 'virtual' | 'in_person' | 'hybrid';
  meeting_platform: string;
  meeting_link: string | null;
  student_meeting_link: string | null;
  meeting_id: string | null;
  meeting_passcode: string | null;
  meeting_metadata: Record<string, any>;
  location: string | null;
  topics: string[];
  learning_objectives: string[];
  materials: string[];
  assignments: any[];
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled' | 'rescheduled';
  notes: string | null;
  recorded_session_url: string | null;
  attendance_taken: boolean;
  
  // Joined fields
  course_title?: string;
  course_subject?: string;
  session_name?: string;
  session_code?: string;
}

export interface JoinSessionResponse {
  meeting_link: string;
  schedule_id: number;
  session_id: number;
  session_name: string;
  class_title: string;
  course_title: string;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  role: 'student';
}

export interface DashboardStats {
  activeEnrollments: number;
  completedCourses: number;
  totalSessions: number;
  upcomingSessions: number;
  completedSessions: number;
  totalSpent: number;
  averageRating: number;
  certificates: number;
  learningHours: number;
}

export interface Payment {
  id: number;
  reference: string;
  user_id: number;
  amount: number;
  currency: string;
  payment_type: 'tutor_onboarding' | 'session_enrollment' | 'community_membership' | 'course_purchase';
  status: 'pending' | 'success' | 'failed' | 'refunded';
  paystack_reference?: string;
  paystack_response?: any;
  metadata?: {
    session_id?: number;
    session_name?: string;
    course_id?: number;
    course_title?: string;
    enrollment_id?: number;
  };
  created_at: string;
  updated_at: string;
  
  // Joined fields from API
  session_name?: string;
  course_title?: string;
  enrollment_status?: string;
}

export interface PaymentsResponse {
  success: boolean;
  message?: string;
  data: {
    payments: Payment[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PaymentDetailsResponse {
  success: boolean;
  message?: string;
  data: Payment;
}

export interface Education {
  id?: number;
  institution: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date: string | null;
  current: boolean;
  description?: string;
  level?: 'high_school' | 'diploma' | 'bachelors' | 'masters' | 'phd' | 'certificate' | 'other';
  grade?: string;
  score?: string;
  achievements?: string;
}

export interface LearningGoal {
  id?: number;
  goal: string;
  progress?: number;
  target_date?: string;
  completed_at?: string;
}

export interface StudentProfileData {
  // Basic Info
  first_name?: string;
  last_name?: string;
  phone?: string;
  date_of_birth?: string;
  avatar_url?: string | null;

  // Location
  country?: string;
  city?: string;

  // Education & Learning
  education?: Education[];
  learning_goals?: (string | LearningGoal)[];
  interests?: string[];

  // Settings
  notification_preferences?: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

const studentApi = {
  // Get user status
  getUserStatus: (): Promise<ApiResponse<any>> =>
    client.get("/users/status"),

  // Get student profile
  getProfile: (): Promise<ApiResponse<ProfileData>> =>
    client.get("/student/profile"),

  // Get dashboard stats

getDashboardStats: async (): Promise<ApiResponse<DashboardStats>> => {
  try {
    const response = await client.get<ApiResponse<DashboardStats>>("/student/dashboard/stats");
    return response;
  } catch (error: any) {
    console.error("Error fetching dashboard stats:", error);
    // Return default stats to prevent UI breakage
    return {
      success: true,
      data: {
        activeEnrollments: 0,
        completedCourses: 0,
        totalSessions: 0,
        upcomingSessions: 0,
        completedSessions: 0,
        totalSpent: 0,
        averageRating: 0,
        certificates: 0,
        learningHours: 0,
      },
    };
  }
},

  // Get all enrollments for the student
  getMyEnrollments: (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{ enrollments: Enrollment[]; total: number }>> =>
    client.get("/student/enrollments", params),

  // Get enrollment by ID
  getEnrollmentById: (enrollmentId: number): Promise<ApiResponse<Enrollment>> =>
    client.get(`/student/enrollments/${enrollmentId}`),

  // Get upcoming sessions
  getUpcomingSessions: (limit?: number): Promise<ApiResponse<Schedule[]>> =>
    client.get("/student/schedules/upcoming", { limit }),

  // Get today's sessions
  getTodaySessions: (): Promise<ApiResponse<Schedule[]>> =>
    client.get("/student/schedules/today"),

  // Join a session
  joinSession: (scheduleId: number): Promise<ApiResponse<JoinSessionResponse>> =>
    client.post(`/student/schedules/${scheduleId}/join`),

  // Get session schedules
  getSessionSchedules: (sessionId: number): Promise<ApiResponse<Schedule[]>> =>
    client.get(`/student/sessions/${sessionId}/schedules`),

  // Get session details
  getSessionDetails: (sessionId: number): Promise<ApiResponse<any>> =>
    client.get(`/student/sessions/${sessionId}`),

  // Update profile following the same pattern as tutor-profile.ts
updateProfile: async (data: Partial<StudentProfileData>): Promise<ApiResponse<ProfileData>> => {
  // Only include fields that are actually updatable for students
  const updatableFields = [
    'first_name', 'last_name', 'phone', 'date_of_birth', 'avatar_url',
    'country', 'city',
    'education', 'learning_goals', 'interests',
    'notification_preferences'
  ];
  
  // Filter the data to only include updatable fields
  const cleanData = Object.fromEntries(
    Object.entries(data).filter(([key, value]) => 
      updatableFields.includes(key) && value !== undefined
    )
  );
  
  console.log('📤 Sending student profile update data:', JSON.stringify(cleanData, null, 2));
  
  try {
    const response = await client.put<ApiResponse<ProfileData>>("/student/profile", cleanData);
    console.log('📥 Student profile update response:', response);
    return response;
  } catch (error: any) {
    console.error('❌ Student profile update error:', {
      message: error?.message,
      status: error?.status || error?.response?.status,
      data: error?.response?.data,
      stack: error?.stack
    });
    throw error;
  }
},

  // Upload avatar
  uploadAvatar: (formData: FormData): Promise<ApiResponse<{ url: string }>> =>
    client.upload("/student/upload-avatar?target=avatars", formData),

  // Get learning history
  getLearningHistory: (params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{ enrollments: Enrollment[]; total: number }>> =>
    client.get("/student/history", params),

  // Get certificates
  getCertificates: (): Promise<ApiResponse<any[]>> =>
    client.get("/student/certificates"),

  // Download certificate
  getCertificateUrl: (enrollmentId: number): Promise<ApiResponse<{ url: string }>> =>
    client.get(`/student/certificates/${enrollmentId}`),

  // ==================== PAYMENTS ====================
  
  // Get payments
  getPayments: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    payment_type?: string;
    from_date?: string;
    to_date?: string;
  }): Promise<ApiResponse<{ payments: Payment[]; total: number; page: number; limit: number; totalPages: number }>> =>
    client.get("/student/payments", params),

  // Get payment details
  getPaymentDetails: (paymentId: number): Promise<ApiResponse<Payment>> =>
    client.get(`/student/payments/${paymentId}`),

  // ==================== PAYMENT METHODS ====================
  
  // Get payment methods
  getPaymentMethods: (): Promise<ApiResponse<PaymentMethod[]>> =>
    client.get("/student/payment-methods"),

  // Add payment method
  addPaymentMethod: (data: any): Promise<ApiResponse<PaymentMethod>> =>
    client.post("/student/payment-methods", data),

  // Update payment method
  updatePaymentMethod: (id: number, data: any): Promise<ApiResponse<PaymentMethod>> =>
    client.put(`/student/payment-methods/${id}`, data),

  // Delete payment method
  deletePaymentMethod: (id: number): Promise<ApiResponse<null>> =>
    client.delete(`/student/payment-methods/${id}`),

  // Set default payment method
  setDefaultPaymentMethod: (id: number): Promise<ApiResponse<null>> =>
    client.put(`/student/payment-methods/${id}/default`),

  // ==================== RECEIPTS & INVOICES ====================
  
  // View receipt in browser (opens in new tab)
  viewReceiptInBrowser: (paymentId: number): void => {
    window.open(`${API_BASE}/student/payments/${paymentId}/receipt`, '_blank');
  },

  // View invoice in browser (opens in new tab)
  viewInvoiceInBrowser: (paymentId: number): void => {
    window.open(`${API_BASE}/student/payments/${paymentId}/invoice`, '_blank');
  },

  // Download receipt as PDF
  downloadReceipt: async (paymentId: number): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE}/student/payments/${paymentId}/receipt?download=true`, {
        credentials: 'include',
      });
      
      if (!response.ok) throw new Error('Failed to download receipt');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${paymentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading receipt:', error);
      throw error;
    }
  },

  // Download invoice as PDF
  downloadInvoice: async (paymentId: number): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE}/student/payments/${paymentId}/invoice?download=true`, {
        credentials: 'include',
      });
      
      if (!response.ok) throw new Error('Failed to download invoice');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${paymentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading invoice:', error);
      throw error;
    }
  },

  // ==================== NOTIFICATIONS ====================
  
  getNotifications: (params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{ notifications: any[]; unread: number }>> =>
    client.get("/student/notifications", params),

  markNotificationRead: (notificationId: number): Promise<ApiResponse<null>> =>
    client.put(`/student/notifications/${notificationId}/read`),

  markAllNotificationsRead: (): Promise<ApiResponse<null>> =>
    client.put("/student/notifications/read-all"),

  // ==================== REVIEWS ====================
  
  getMyReviews: (): Promise<ApiResponse<any[]>> =>
    client.get("/student/reviews"),

  submitReview: (sessionId: number, data: { rating: number; comment: string }): Promise<ApiResponse<{ id: number }>> =>
    client.post(`/student/sessions/${sessionId}/review`, data),

  updateReview: (reviewId: number, data: { rating?: number; comment?: string }): Promise<ApiResponse<null>> =>
    client.put(`/student/reviews/${reviewId}`, data),

  deleteReview: (reviewId: number): Promise<ApiResponse<null>> =>
    client.delete(`/student/reviews/${reviewId}`),
};

export default studentApi;