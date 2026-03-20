// src/lib/api/wishlist.ts
import client from "./client";

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface CheckItemResponse {
  isLoved: boolean;
}

export interface LoveCountResponse {
  count: number;
}

export interface WishlistItem {
  wishlist_id: number;
  item_type: 'tutor' | 'session';
  item_id: number;
  
  // Common fields
  user_id: number;
  wished_at: string;
  
  // Tutor specific fields (when item_type = 'tutor')
  tutor_id?: number;
  bio?: string;
  headline?: string;
  rating?: number;
  hourly_rate?: number;
  currency?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  subjects_count?: number;
  active_courses_count?: number;
  subjects?: Array<{
    id: number;
    subject: string;
    hourly_rate: number;
    experience_years: number;
    is_verified: boolean;
    levels: string[];
  }>;
  
  // Session specific fields (when item_type = 'session')
  session_id?: number;
  session_name?: string;
  session_code?: string;
  session_type?: 'one_on_one' | 'group';
  course_title?: string;
  course_subject?: string;
  course_level?: string;
  tutor_name?: string;
  tutor_avatar?: string;
  start_date?: string;
  end_date?: string;
  fee_amount?: number;
  fee_currency?: string;
  max_students?: number;
  current_enrollment?: number;
  enrollment_status?: string;
}

export interface WishlistResponse {
  items: WishlistItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BatchCheckResponse {
  [itemId: number]: boolean;
}

export interface PopularItem {
  id: number;
  item_type: 'tutor' | 'session';
  item_id: number;
  love_count: number;
  
  // Common display fields
  title?: string;
  subtitle?: string;
  image_url?: string;
  
  // Tutor specific
  first_name?: string;
  last_name?: string;
  headline?: string;
  avatar_url?: string;
  hourly_rate?: number;
  currency?: string;
  
  // Session specific
  name?: string;
  course_title?: string;
  tutor_name?: string;
  fee_amount?: number;
  fee_currency?: string;
  start_date?: string;
}

export interface WishlistStats {
  total_items: number;
  total_tutors: number;
  total_sessions: number;
  first_added: string | null;
  last_added: string | null;
}

const wishlistApi = {
  // ==================== TUTOR ENDPOINTS ====================
  
  // Check if tutor is in wishlist
  checkTutor: (tutorId: number): Promise<ApiResponse<CheckItemResponse>> =>
    client.get(`/wishlist/tutors/${tutorId}/check`),

  // Get love count for tutor
  getTutorLoveCount: (tutorId: number): Promise<ApiResponse<LoveCountResponse>> =>
    client.get(`/wishlist/tutors/${tutorId}/count`),

  // Add tutor to wishlist
  addTutor: (tutorId: number): Promise<ApiResponse<{ wishlist_id: number; item_id: number; item_type: 'tutor' }>> =>
    client.post(`/wishlist/tutors/${tutorId}`),

  // Remove tutor from wishlist
  removeTutor: (tutorId: number): Promise<ApiResponse<{ deleted: boolean }>> =>
    client.delete(`/wishlist/tutors/${tutorId}`),

  // ==================== SESSION ENDPOINTS ====================
  
  // Check if session is in wishlist
  checkSession: (sessionId: number): Promise<ApiResponse<CheckItemResponse>> =>
    client.get(`/wishlist/sessions/${sessionId}/check`),

  // Get love count for session
  getSessionLoveCount: (sessionId: number): Promise<ApiResponse<LoveCountResponse>> =>
    client.get(`/wishlist/sessions/${sessionId}/count`),

  // Add session to wishlist
  addSession: (sessionId: number): Promise<ApiResponse<{ wishlist_id: number; item_id: number; item_type: 'session' }>> =>
    client.post(`/wishlist/sessions/${sessionId}`),

  // Remove session from wishlist
  removeSession: (sessionId: number): Promise<ApiResponse<{ deleted: boolean }>> =>
    client.delete(`/wishlist/sessions/${sessionId}`),

  // ==================== GENERIC ENDPOINTS (for unified handling) ====================
  
  // Check any item type
  checkItem: (itemType: 'tutor' | 'session', itemId: number): Promise<ApiResponse<CheckItemResponse>> =>
    client.get(`/wishlist/${itemType}s/${itemId}/check`),

  // Get love count for any item type
  getItemLoveCount: (itemType: 'tutor' | 'session', itemId: number): Promise<ApiResponse<LoveCountResponse>> =>
    client.get(`/wishlist/${itemType}s/${itemId}/count`),

  // Add any item type to wishlist
  addItem: (itemType: 'tutor' | 'session', itemId: number): Promise<ApiResponse<{ wishlist_id: number; item_id: number; item_type: string }>> =>
    client.post(`/wishlist/${itemType}s/${itemId}`),

  // Remove any item type from wishlist
  removeItem: (itemType: 'tutor' | 'session', itemId: number): Promise<ApiResponse<{ deleted: boolean }>> =>
    client.delete(`/wishlist/${itemType}s/${itemId}`),

  // ==================== USER'S WISHLIST ====================
  
  // Get user's wishlist (all items)
  getMyWishlist: (params?: { page?: number; limit?: number; item_type?: 'tutor' | 'session' }): Promise<
    ApiResponse<WishlistResponse>
  > => client.get("/wishlist/me", params),

  // Get user's favorite tutors only
  getMyTutors: (params?: { page?: number; limit?: number }): Promise<
    ApiResponse<WishlistResponse>
  > => client.get("/wishlist/me/tutors", params),

  // Get user's favorite sessions only
  getMySessions: (params?: { page?: number; limit?: number }): Promise<
    ApiResponse<WishlistResponse>
  > => client.get("/wishlist/me/sessions", params),

  // ==================== BATCH OPERATIONS ====================
  
  // Batch check multiple tutors
  batchCheckTutors: (tutorIds: number[]): Promise<ApiResponse<BatchCheckResponse>> =>
    client.post("/wishlist/tutors/batch-check", { tutorIds }),

  // Batch check multiple sessions
  batchCheckSessions: (sessionIds: number[]): Promise<ApiResponse<BatchCheckResponse>> =>
    client.post("/wishlist/sessions/batch-check", { sessionIds }),

  // Batch check mixed items
  batchCheckItems: (items: Array<{ type: 'tutor' | 'session'; id: number }>): Promise<
    ApiResponse<{ [key: string]: boolean }>
  > => client.post("/wishlist/items/batch-check", { items }),

  // ==================== POPULAR ITEMS ====================
  
  // Get popular tutors (sorted by love count)
  getPopularTutors: (limit?: number): Promise<ApiResponse<{ tutors: PopularItem[]; total: number }>> =>
    client.get("/wishlist/popular/tutors", { limit }),

  // Get popular sessions (sorted by love count)
  getPopularSessions: (limit?: number): Promise<ApiResponse<{ sessions: PopularItem[]; total: number }>> =>
    client.get("/wishlist/popular/sessions", { limit }),

  // Get popular items (mixed)
  getPopularItems: (limit?: number, type?: 'tutor' | 'session'): Promise<
    ApiResponse<{ items: PopularItem[]; total: number }>
  > => client.get("/wishlist/popular", { limit, type }),

  // ==================== STATISTICS ====================
  
  // Get wishlist statistics
  getWishlistStats: (): Promise<ApiResponse<WishlistStats>> =>
    client.get("/wishlist/me/stats"),

  // Clear entire wishlist
  clearWishlist: (): Promise<ApiResponse<{ removed_count: number }>> =>
    client.delete("/wishlist/me/clear"),
};

export default wishlistApi;