// src/types/tutor-profile.types.ts

export interface ProfileData {
  // Basic Info
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  avatar_url: string | null;

  // Location & Language
  country: string;
  city: string;
  languages: string[];

  // Professional Info
  bio: string;
  headline: string;
  subjects: string[];
  hourly_rate: number | null;
  currency: string;

  // Education & Experience
  education: Array<{
    id?: number;
    institution: string;
    degree: string;
    field_of_study: string;
    start_date: string;
    end_date: string;
    current: boolean;
    description?: string;
  }>;

  experience: Array<{
    id?: number;
    company: string;
    position: string;
    start_date: string;
    end_date: string;
    current: boolean;
    description?: string;
  }>;

  certifications: Array<{
    id?: number;
    name: string;
    issuing_organization: string;
    issue_date: string;
    expiration_date?: string;
    credential_id?: string;
    credential_url?: string;
  }>;

  // Availability
  availability: {
    timezone: string;
    weekly_hours: number;
    preferred_times: Array<{
      day: string;
      slots: Array<{
        start: string;
        end: string;
      }>;
    }>;
  };

  // Stats
  stats: {
    total_students: number;
    total_sessions: number;
    total_hours: number;
    average_rating: number;
    total_reviews: number;
    completion_rate: number;
    response_rate: number;
    response_time: string;
  };

  // Verification Status
  verification: {
    email_verified: boolean;
    phone_verified: boolean;
    identity_verified: boolean;
    documents_verified: boolean;
  };
}

export interface Document {
  id: number;
  name: string;
  type: string;
  url: string;
  verified: boolean;
  uploaded_at: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface ProfileCompletion {
  percentage: number;
  missing_fields: string[];
  completed_fields: string[];
}

// Re-export for backward compatibility
export type { ProfileData as TutorProfile };