// src/lib/api/admin-api.ts
import client from "./client";

// Re-export the existing admin affiliate API
export { default as adminAffiliateApi } from "./admin-affiliate";

// Create a wrapper for admin tutor applications API
export const adminTutorApi = {
  getApplications: (status: string, page: number, limit: number) =>
    client.get(`/admin/tutors/applications`, { status, page, limit }),
  
  getApplication: (id: string | number) =>
    client.get(`/admin/tutors/applications/${id}`),
  
  reviewApplication: (id: string | number, data: { status: string; admin_notes?: string; rejection_reason?: string }) =>
    client.put(`/admin/tutors/applications/${id}/review`, data),
  
  saveNotes: (id: string | number, admin_notes: string) =>
    client.put(`/admin/tutors/applications/${id}/notes`, { admin_notes }),
  
  getPendingApplications: () =>
    client.get(`/admin/tutors/applications/pending`),
};