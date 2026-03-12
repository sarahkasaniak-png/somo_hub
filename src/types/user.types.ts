// src/types/user.types.ts

// User Interface
export interface User {
  id: string;
  uuid?: string;
  email: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar_url?: string;
  date_of_birth?: string;
  profile_completed?: boolean;
  google_id?: string;
  is_verified?: boolean;
  phone_verified?: boolean;
  is_active?: boolean;
  roles?: string[];
  settings?: UserSettings;
  country?: string;
  city?: string;
  created_at?: string;
  updated_at?: string;
}

// Education Interface
export interface Education {
  id?: number;
  institution: string;
  degree: string;
  field_of_study: string;
  level?: 'high_school' | 'diploma' | 'bachelors' | 'masters' | 'phd' | 'certificate' | 'other';
  grade?: string;
  score?: string;
  start_date?: string;
  end_date?: string;
  current?: boolean;
  description?: string;
  achievements?: string;
}

// User Status Interface - UPDATED with education, interests, learning_goals
export interface UserStatus {
  // Profile & Basic Info
  profileCompletion: number;
  
  // Student-specific
  activeEnrollments: number;
  hasActiveEnrollments: boolean;
  
  // Student profile data
  education?: Education[];
  interests?: string[];
  learning_goals?: string[];
  
  // Tutor-specific
  tutorApplication: {
    id?: number;
    current_step: number;
    application_status: 'draft' | 'pending' | 'under_review' | 'approved' | 'rejected';
    tutor_level?: string;
    official_first_name?: string;
    official_last_name?: string;
    hourly_rate?: number;
    payment_status?: string;
    created_at?: string;
  } | null;
  isApprovedTutor: boolean;
  tutorData: any;
  hasTutorApplication: boolean;
  activeTutorStudents: number;
  pendingTutorRequests: number;
  
  // Community-specific
  communityApplication: {
    id?: number;
    current_step: number;
    application_status: 'draft' | 'pending' | 'under_review' | 'approved' | 'rejected';
    name?: string;
    slug?: string;
    description?: string;
    payment_status?: string;
    created_at?: string;
  } | null;
  hasCommunityApplication: boolean;
  communityMemberships: Array<{
    id: number;
    community_name: string;
    community_slug: string;
    role: string;
    joined_at: string;
  }>;
  isCommunityMember: boolean;
  isApprovedCommunityMember: boolean;
  pendingCommunityRequests: number;
  unreadMessages: number;
  joinedCommunities: Array<any>;
  pendingCommunityModeration: number;
  communityApplications?: Array<any>;
  
  // Session info
  upcomingSessionsCount?: number;
  hasActiveSessions?: boolean;
  
  // Role flags
  hasTutorRole: boolean;
  hasCommunityRole: boolean;
  hasStudentRole: boolean;
  hasAdminRole: boolean;
  
  // Application status summary
  applicationStatus: {
    tutor: 'not_started' | 'draft' | 'pending' | 'under_review' | 'approved' | 'rejected';
    community: 'not_started' | 'draft' | 'pending' | 'under_review' | 'approved' | 'rejected';
  };
  
  // Recent activity
  recentActivity: Array<{
    action: string;
    created_at: string;
    metadata: any;
  }>;
}

// Profile Data Interface - NEW
export interface ProfileData {
  // Basic Info
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  avatar_url: string | null;

  // Location
  country: string;
  city: string;

  // Education
  education: Education[];

  // Interests & Goals
  interests: string[];
  learning_goals: string[];

  // Stats
  stats: {
    courses_completed: number;
    sessions_attended: number;
    learning_hours: number;
    certificates_earned: number;
    average_rating: number;
    reviews_left: number;
  };

  // Verification
  verification: {
    email_verified: boolean;
    phone_verified: boolean;
  };
}

// User Settings Interface
export interface UserSettings {
  email_notifications: boolean;
  push_notifications: boolean;
  sms_notifications: boolean;
  preferred_language: 'en' | 'sw';
  timezone: string;
  privacy_settings: {
    profile_visibility: 'public' | 'community' | 'private';
    show_email: boolean;
    show_phone: boolean;
    show_activity: boolean;
  };
}

// Registration Data Interface
export interface RegistrationData {
  email: string;
  password: string;
  confirmPassword?: string; // Optional for frontend validation
  name?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
}

// Login Data Interface
export interface LoginData {
  email: string;
  password: string;
}

// Password Reset Data Interface
export interface ResetPasswordData {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

// Forgot Password Data Interface
export interface ForgotPasswordData {
  email: string;
}

// OTP Verification Data Interface
export interface OtpVerificationData {
  email: string;
  otp: string;
  purpose?: 'registration' | 'reset_password';
}

// Google Login Data Interface
export interface GoogleLoginData {
  idToken: string;
}

// Authentication Response Interface
export interface AuthResponse {
  user: User;
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  status?: UserStatus;
   verified?: boolean;
  success?: boolean;
  message?: string;
}

// Error Response Interface
export interface AuthError {
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}

// Auth Context Type - UPDATED WITH profileData
export interface AuthContextType {
  // State
  user: User | null;
  userStatus: UserStatus | null;
  profileData: ProfileData | null; // Added profileData
  loading: boolean;
  
  // Helper Functions
  getUserRoleCount: () => number;
  getPrimaryRole: () => string | null;
  
  // Registration Methods
  register: (email: string, password: string, confirmPassword: string) => Promise<AuthResponse>;
  registerWithData: (data: RegistrationData) => Promise<AuthResponse>;
  
  // Login Methods
  login: (email: string, password?: string) => Promise<AuthResponse>;
  passwordLogin: (email: string, password: string) => Promise<AuthResponse>;
  loginWithData: (data: LoginData) => Promise<AuthResponse>;
  
  // OTP Methods
  sendOtp: (email: string, purpose?: 'registration' | 'reset_password') => Promise<any>;
  verifyOtp: (email: string, otp: string, purpose?: 'registration' | 'reset_password') => Promise<AuthResponse>;
  
  // Password Reset Flow
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  verifyResetOtp: (email: string, otp: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (email: string, otp: string, newPassword: string, confirmPassword: string) => Promise<{ success: boolean; message: string }>;
  resetPasswordWithData: (data: ResetPasswordData) => Promise<{ success: boolean; message: string }>;
  
  // Google Login
  googleLogin: (idToken: string) => Promise<AuthResponse>;
  
  // User Management
  checkUserExists: (email: string) => Promise<{ exists: boolean; user?: User }>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<any>;
  refreshUserData: () => Promise<void>;
  refreshProfileData: () => Promise<ProfileData | null>; // Added refreshProfileData
  fetchUserStatus: () => Promise<UserStatus>;
  trackActivity: (path: string) => Promise<void>;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

// User Status Response Type
export interface UserStatusResponse extends ApiResponse<UserStatus> {}

// Check User Response Type
export interface CheckUserResponse extends ApiResponse<{ exists: boolean; user?: User }> {}

// Registration Response Type
export interface RegistrationResponse extends ApiResponse<AuthResponse> {}

// Login Response Type
export interface LoginResponse extends ApiResponse<AuthResponse> {}

// OTP Response Type
export interface OtpResponse extends ApiResponse<{ message: string }> {}

// Forgot Password Response Type
export interface ForgotPasswordResponse extends ApiResponse<{ message: string }> {}

// Reset Password Response Type
export interface ResetPasswordResponse extends ApiResponse<{ message: string }> {}