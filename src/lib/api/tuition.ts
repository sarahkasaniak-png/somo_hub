// src/lib/api/tuition.ts
import client from "./client";
import { TutorSession, Tutor, Community, TuitionFilters } from "@/types/tuition.types";

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

const tuitionApi = {
  // Get all available sessions (tuitions)
  getSessions: async (params?: TuitionFilters & { page?: number; limit?: number }): Promise<ApiResponse<{ sessions: TutorSession[]; total: number; page: number; limit: number }>> => {
    return client.get("/tuitions/sessions", params);
  },

  // Get group sessions
  getGroupSessions: async (params?: TuitionFilters & { page?: number; limit?: number }): Promise<ApiResponse<{ sessions: TutorSession[]; total: number }>> => {
    return client.get("/tuitions/sessions/group", params);
  },

  // Get one-on-one sessions
  getOneOnOneSessions: async (params?: TuitionFilters & { page?: number; limit?: number }): Promise<ApiResponse<{ sessions: TutorSession[]; total: number }>> => {
    return client.get("/tuitions/sessions/one-on-one", params);
  },

  // Get session by ID
  getSessionById: (sessionId: number): Promise<ApiResponse<TutorSession>> =>
    client.get(`/tuitions/sessions/${sessionId}`),

  // Get featured tutors
  getFeaturedTutors: (limit?: number): Promise<ApiResponse<{ tutors: Tutor[]; total: number }>> =>
    client.get("/tuitions/tutors/featured", { limit }),

  // Get all tutors
  getTutors: (params?: { page?: number; limit?: number; subject?: string; search?: string }): Promise<ApiResponse<{ tutors: Tutor[]; total: number; page: number; limit: number }>> =>
    client.get("/tuitions/tutors", params),

  // Get tutor by ID
  getTutorById: (tutorId: number): Promise<ApiResponse<Tutor>> =>
    client.get(`/tuitions/tutors/${tutorId}`),

  // Get communities
  getCommunities: (params?: { page?: number; limit?: number; category?: string; search?: string }): Promise<ApiResponse<{ communities: Community[]; total: number; page: number; limit: number }>> =>
    client.get("/tuitions/communities", params),

  // Get community by ID
  getCommunityById: (communityId: number): Promise<ApiResponse<Community>> =>
    client.get(`/tuitions/communities/${communityId}`),

  // Get community courses/sessions
  getCommunitySessions: (communityId: number, params?: { page?: number; limit?: number }): Promise<ApiResponse<{ sessions: TutorSession[]; total: number }>> =>
    client.get(`/tuitions/communities/${communityId}/sessions`, params),

  // Search all tuitions
  search: (query: string, params?: TuitionFilters): Promise<ApiResponse<{
    sessions: TutorSession[];
    tutors: Tutor[];
    communities: Community[];
  }>> => client.get("/tuitions/search", { ...params, q: query }),

  // Check enrollment eligibility
  checkEnrollmentEligibility: (sessionId: number): Promise<ApiResponse<{ canEnroll: boolean; reason?: string; requiresPayment: boolean; amount: number; currency: string }>> =>
    client.get(`/tuitions/sessions/${sessionId}/enroll/check`),

  // Enroll in session
  enrollInSession: (sessionId: number, paymentReference?: string): Promise<ApiResponse<{ enrollmentId: number; message: string }>> =>
    client.post(`/tuitions/sessions/${sessionId}/enroll`, { payment_reference: paymentReference }),
};

export default tuitionApi;