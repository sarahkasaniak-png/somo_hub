// src/types/tuition.types.ts


// src/types/tuition.types.ts

export interface TutorSession {
  id: number;
  tutor_course_id: number;
  name: string;
  description: string;
  batch_name: string | null;
  session_type: 'one_on_one' | 'group';
  max_students: number;
  current_enrollment: number;
  start_date: string;
  end_date: string;
  session_code: string;
  enrollment_status: 'open' | 'waiting_list' | 'closed' | 'completed';
  fee_amount: number;
  fee_currency: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  created_at: string;
  
  // Joined fields
  course_title?: string;
  course_description?: string;
  course_subject?: string;
  course_level?: string;
  course_thumbnail?: string;
  tutor_id?: number;
  tutor_name?: string;
  tutor_avatar?: string;
  tutor_bio?: string;
  tutor_rating?: number;
  total_sessions?: number;
  
  // Tutor level fields
  tutor_level_id?: number;
  tutor_level_name?: string;
  tutor_level_description?: string;
  
  // New fields from schedules
  classes_per_week?: number;
  class_duration_minutes?: number;
  total_duration_hours?: number;
  total_duration_minutes?: number;
  total_duration_string?: string;
  schedules_count?: number;
  schedules?: TutorSessionSchedule[];
  schedules_by_week?: Record<number, TutorSessionSchedule[]>;
}

export interface Tutor {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url: string | null;
  bio: string | null;
  headline: string | null;
  rating: number;
  total_sessions: number;
  total_students: number;
  response_rate: number;
  response_time: string;
  hourly_rate: number;
  currency: string;
  subjects: TutorSubject[];
  languages: TutorLanguage[];
  is_featured: boolean;
  is_available: boolean;
  tutor_level_id?: number;
  tutor_level?: {
    id: number;
    level_name: string;
    level_description: string;
  };
  love_count?: number;           // Total number of users who love this tutor
  is_loved_by_current_user?: boolean; // Whether the current user loves this tutor
}

export interface TutorSessionSchedule {
  id: number;
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
  student_meeting_passcode: string | null;
  attendee_pw: string | null;
  moderator_pw: string | null;
  status: string;
  recorded_session_url: string | null;
}

// src/types/tuition.types.ts

export interface TutorSession {
  id: number;
  tutor_course_id: number;
  name: string;
  description: string;
  batch_name: string | null;
  session_type: 'one_on_one' | 'group';
  max_students: number;
  current_enrollment: number;
  start_date: string;
  end_date: string;
  session_code: string;
  enrollment_status: 'open' | 'waiting_list' | 'closed' | 'completed';
  fee_amount: number;
  fee_currency: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  created_at: string;
  
  // Joined fields
  course_title?: string;
  course_description?: string;
  course_subject?: string;
  course_level?: string;
  course_thumbnail?: string;
  tutor_id?: number;
  tutor_name?: string;
  tutor_avatar?: string;
  tutor_bio?: string;
  tutor_rating?: number;
  total_sessions?: number;
  
  // Tutor level fields
  tutor_level_id?: number;
  tutor_level_name?: string;
  tutor_level_description?: string;
  
  // New fields from schedules
  classes_per_week?: number;
  class_duration_minutes?: number;
  total_duration_hours?: number;
  total_duration_minutes?: number;
  total_duration_string?: string;
  schedules_count?: number;
  schedules?: TutorSessionSchedule[];
  schedules_by_week?: Record<number, TutorSessionSchedule[]>;
}

export interface Tutor {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url: string | null;
  bio: string | null;
  headline: string | null;
  rating: number;
  total_sessions: number;
  total_students: number;
  response_rate: number;
  response_time: string;
  hourly_rate: number;
  currency: string;
  subjects: TutorSubject[];
  languages: TutorLanguage[];
  is_featured: boolean;
  is_available: boolean;
  tutor_level_id?: number;
  tutor_level?: {
    id: number;
    level_name: string;
    level_description: string;
  };
}

export interface TutorSubject {
  id: number;
  subject: string;
  hourly_rate: number;
  experience_years: number;
  levels: string[];
  is_verified: boolean;
}

export interface TutorLanguage {
  language: string;
  proficiency: string;
}

export interface Community {
  id: number;
  name: string;
  description: string;
  slug: string;
  logo_url: string | null;
  banner_url: string | null;
  member_count: number;
  category: string;
  is_public: boolean;
  courses_count?: number;
  sessions_count?: number;
}

export interface TuitionFilters {
  subject?: string;
  level?: string;
  price_min?: number;
  price_max?: number;
  session_type?: 'one_on_one' | 'group';
  tutor_id?: number;
  search?: string;
  sort?: 'popular' | 'newest' | 'price_low' | 'price_high' | 'rating';
  curriculum?: string;
  title?: string;
}

export interface SearchResults {
  sessions: TutorSession[];
  tutors: Tutor[];
  communities: Community[];
}