// src/lib/api/tuition.ts
import client from "./client";
import { TutorSession, Tutor, Community, TuitionFilters, Curriculum, TutorLevel } from "@/types/tuition.types";

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

const tuitionApi = {
  getSessions: async (params?: TuitionFilters & { page?: number; limit?: number }): Promise<ApiResponse<{ sessions: TutorSession[]; total: number; page: number; limit: number }>> => {
    return client.get("/tuitions/sessions", params);
  },

  getSessionByUuid: (uuid: string): Promise<ApiResponse<TutorSession>> =>
    client.get(`/tuitions/sessions/${uuid}`),

  getGroupSessions: async (params?: TuitionFilters & { page?: number; limit?: number }): Promise<ApiResponse<{ sessions: TutorSession[]; total: number }>> => {
    return client.get("/tuitions/sessions/group", params);
  },

  getOneOnOneSessions: async (params?: TuitionFilters & { page?: number; limit?: number }): Promise<ApiResponse<{ sessions: TutorSession[]; total: number }>> => {
    return client.get("/tuitions/sessions/one-on-one", params);
  },

  getCurriculums: (): Promise<ApiResponse<Curriculum[]>> =>
    client.get("/tuitions/curriculums"),

  getTutorLevels: (): Promise<ApiResponse<TutorLevel[]>> =>
    client.get("/tuitions/tutor-levels"),

  getFeaturedTutors: (limit?: number): Promise<ApiResponse<{ tutors: Tutor[]; total: number }>> =>
    client.get("/tuitions/tutors/featured", { limit }),

  getTutors: (params?: { page?: number; limit?: number; subject?: string; search?: string; tutor_level_id?: number }): Promise<ApiResponse<{ tutors: Tutor[]; total: number; page: number; limit: number }>> =>
    client.get("/tuitions/tutors", params),

  getTutorById: (tutorId: number): Promise<ApiResponse<Tutor>> =>
    client.get(`/tuitions/tutors/${tutorId}`),

  getCommunities: (params?: { page?: number; limit?: number; category?: string; search?: string }): Promise<ApiResponse<{ communities: Community[]; total: number; page: number; limit: number }>> =>
    client.get("/tuitions/communities", params),

  getCommunityById: (communityId: number): Promise<ApiResponse<Community>> =>
    client.get(`/tuitions/communities/${communityId}`),

  getCommunitySessions: (communityId: number, params?: { page?: number; limit?: number }): Promise<ApiResponse<{ sessions: TutorSession[]; total: number }>> =>
    client.get(`/tuitions/communities/${communityId}/sessions`, params),

  search: (query: string, params?: TuitionFilters): Promise<ApiResponse<{
    sessions: TutorSession[];
    tutors: Tutor[];
    communities: Community[];
  }>> => client.get("/tuitions/search", { ...params, q: query }),

  checkEnrollmentEligibility: (uuid: string): Promise<ApiResponse<{ canEnroll: boolean; reason?: string; requiresPayment: boolean; amount: number; currency: string }>> =>
    client.get(`/tuitions/sessions/${uuid}/enroll/check`),

  enrollInSession: (uuid: string, paymentReference?: string): Promise<ApiResponse<{ enrollmentId: number; message: string }>> =>
    client.post(`/tuitions/sessions/${uuid}/enroll`, { payment_reference: paymentReference }),
};

export default tuitionApi;