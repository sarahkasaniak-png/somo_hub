// src/lib/api/user.ts
import client from "./client";

// Define the affiliate data interface for backend response
export interface AffiliateData {
  id: number;
  affiliate_code: string;
  commission_rate: number;
  total_earnings: number;
  total_paid: number;
  total_referred_tutors: number;
  total_referred_students: number;
  is_active: boolean;
  created_at: string;
  // Optional fields that might be present in some responses
  user_id?: number;
  updated_at?: string;
  payment_method?: string;
  payment_details?: any;
}

// Define the extended user status data type
export interface UserStatusData {
  // Profile & Basic Info
  profileCompletion: number;
  
  // Student-specific
  activeEnrollments: number;
  hasActiveEnrollments: boolean;
  
  // Student profile data
  education?: Array<{
    id?: number;
    institution: string;
    degree: string;
    field_of_study: string;
    level?: string;
    grade?: string;
    score?: string;
    start_date?: string;
    end_date?: string;
    current?: boolean;
    description?: string;
    achievements?: string;
  }>;
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
  // Affiliate role flag
  hasAffiliateRole?: boolean;
  
  // Affiliate data - using the AffiliateData interface
  affiliateData?: AffiliateData | null;
  affiliateCode?: string | null;
  
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
  
  // User data (may be included in response)
  user?: {
    id: string;
    uuid?: string;
    email: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    avatar_url?: string;
    date_of_birth?: string;
    is_verified?: boolean;
    phone_verified?: boolean;
    country?: string;
    city?: string;
    created_at?: string;
    affiliate_code?: string | null;
  };
}

export interface UserStatusResponse {
  success: boolean;
  message?: string;
  data: UserStatusData;
}

export interface ActivityTrackResponse {
  success: boolean;
  message?: string;
}

/* ================= USER ENDPOINTS ================= */

/**
 * Get user status including roles, applications, and profile data
 */
const getUserStatus = (): Promise<UserStatusResponse> =>
  client.get("/users/status");

/**
 * Update user profile
 */
const updateProfile = (profileData: any): Promise<any> =>
  client.put("/users/profile", profileData);

/**
 * Update user settings
 */
const updateSettings = (settingsData: any): Promise<any> =>
  client.put("/users/settings", settingsData);

/**
 * Track user activity
 */
const trackActivity = (path: string): Promise<ActivityTrackResponse> =>
  client.post("/users/activity", { path });

/**
 * Search users
 */
const searchUsers = (params: any): Promise<any> =>
  client.get("/users/search", params);

/**
 * Get user by ID
 */
const getUserById = (userId: string): Promise<any> =>
  client.get(`/users/${userId}`);

/**
 * Get community applications for the user
 */
const getCommunityApplications = (): Promise<any> =>
  client.get("/users/community/applications");

/**
 * Get community memberships for the user
 */
const getCommunityMemberships = (): Promise<any> =>
  client.get("/users/community/memberships");

/**
 * Get tutor applications for the user
 */
const getTutorApplications = (): Promise<any> =>
  client.get("/users/tutor/applications");

/* ================= EXPORT ================= */

const userApi = {
  getUserStatus,
  updateProfile,
  updateSettings,
  trackActivity,
  searchUsers,
  getUserById,
  getCommunityApplications,
  getCommunityMemberships,
  getTutorApplications,
};

export default userApi;