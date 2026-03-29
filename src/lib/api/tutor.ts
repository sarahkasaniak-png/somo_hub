// src/lib/api/tutor.ts
import client from "./client";
import tutorScheduleApi, { TutorSessionSchedule, JoinSessionResponse } from "./tutor-schedule";

// Export types from tutor-schedule
export type { 
  TutorSessionSchedule,
  JoinSessionResponse 
} from "./tutor-schedule";

//interface for tutor curriculum
export interface TutorCurriculum {
  id: number;
  tutor_id: number;
  curriculum_id: number;
  curriculum_level_id: number | null;
  status: string;
  curriculum_name?: string;
  curriculum_code?: string;
  level_name?: string;
  level_code?: string;
}

// ================= ENROLLMENT TYPES =================

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
  student?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    avatar_url: string | null;
    phone: string | null;
  };
  session?: {
    id: number;
    uuid: string;
    name: string;
    session_code: string;
    start_date: string;
    end_date: string;
    max_students: number;
    fee_amount: number;
    fee_currency: string;
    subject: string;  
    level: string;  
  };
}

export interface EnrollmentDetail {
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
  student: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    avatar_url: string | null;
    date_of_birth: string | null;
    created_at: string;
  };
  session: {
    id: number;
    uuid: string;
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
    subject: string; 
    level: string;  
   
  };
  payment_history?: Array<{
    id: number;
    amount: number;
    status: string;
    reference: string;
    created_at: string;
  }>;
  attendance_history?: Array<{
    id: number;
    schedule_id: number;
    class_date: string;
    class_title: string;
    attended: boolean;
    attended_at: string | null;
  }>;
}

export interface PaymentRecord {
  id: number;
  enrollment_id: number;
  amount: number;
  reference: string;
  notes: string | null;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  created_at: string;
}

export interface AttendanceRecord {
  id: number;
  enrollment_id: number;
  schedule_id: number;
  attended: boolean;
  attended_at: string | null;
  class_date: string;
  class_title: string;
}

// Define tutor level types
export type TutorLevel = 
  | 'college_student' 
  | 'junior_high_teacher' 
  | 'senior_high_teacher' 
  | 'skilled_professional' 
  | 'university_lecturer' 
  | 'private_tutor';

export type EducationLevel = 
  | 'high_school' 
  | 'diploma' 
  | 'bachelors' 
  | 'masters' 
  | 'phd';

export interface TutorLevelInfo {
  id: number;
  level_name: string;
  level_description: string;
  requires_admission_letter: boolean;
  requires_tsc_number: boolean;
  requires_portfolio: boolean;
}

export interface CurriculumLevel {
  id: number;
  name: string;
  code: string;
  order_index: number;
}

export interface Curriculum {
  id: number;
  uuid: string;
  name: string;
  code: string;
  description: string;
  country: string;
  levels: CurriculumLevel[];
}

export interface ApplicationData {
  id?: number;
  current_step: number;
  application_status: 'draft' | 'pending' | 'under_review' | 'approved' | 'rejected';
  tutor_level?: TutorLevel;
  portfolio_url?: string;
  tsc_number?: string;
  official_first_name?: string;
  official_last_name?: string;
  date_of_birth?: string;
  national_id_number?: string;
  national_id_front_url?: string;
  national_id_back_url?: string;
  highest_education_level?: EducationLevel;
  university_name?: string;
  admission_letter_url?: string;
  admission_number?: string;
  certificates?: any[];
  has_teaching_experience?: boolean;
  teaching_experience_years?: number;
  previous_institutions?: string[];
  professional_experience?: string;
  subjects?: string[];
  levels?: string[];
  payment_reference?: string;
  payment_status?: 'pending' | 'paid' | 'failed';
  payment_amount?: number;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface LoadApplicationResponse extends ApiResponse {
  hasApplication: boolean;
  application?: ApplicationData;
}

export interface SaveStepResponse extends ApiResponse<ApplicationData> {}

// Step-specific data interfaces
export interface Step1TutorLevelData {
  tutor_level: TutorLevel;
  portfolio_url?: string;
  tsc_number?: string;
}

export interface Step2PersonalInfoData {
  official_first_name: string;
  official_last_name: string;
  date_of_birth: string;
  national_id_number: string;
  national_id_front_url: string;
  national_id_back_url: string;
}

export interface Step3EducationData {
  highest_education_level: EducationLevel;
  university_name: string;
  admission_letter_url?: string;
  admission_number?: string;
}

export interface Step4ExperienceData {
  has_teaching_experience: boolean;
  tsc_number?: string;
  teaching_experience_years?: number;
  previous_institutions?: string[];
  professional_experience?: string;
  portfolio_url?: string;
  certificates?: Array<{
    name: string;
    url: string;
    issued_date?: string;
  }>;
}

type StepData = 
  | Step1TutorLevelData 
  | Step2PersonalInfoData 
  | Step3EducationData 
  | Step4ExperienceData;

// ================= TYPES FOR SESSIONS =================

export interface SessionScheduleConfig {
  id?: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  duration_minutes?: number;
  is_active?: boolean;
}

export interface TutorSession {
  id: number;
  uuid: string;
  tutor_id: number;
  tutor_level_id?: number;
  name: string;
  description: string | null;
  subject: string;
  curriculum_id?: number;
  curriculum_level_id?: number;
   level?: 'primary' | 'junior_high' | 'senior_high' | 'university' | 'adult';
  prerequisites: string[];
  learning_outcomes: string[];
  curriculum: Array<{
    week: number;
    topic: string;
    objectives?: string[];
    materials?: string[];
  }>;
  
  // Curriculum joined fields
  curriculum_name?: string;
  curriculum_code?: string;
  curriculum_level_name?: string;
  curriculum_level_code?: string;
  tutor_level_name?: string;
  tutor_level_description?: string;
  
  // Session fields
  batch_name: string | null;
  session_type: 'one_on_one' | 'group';
  max_students: number;
  start_date: string;
  end_date: string;
  session_code: string;
  enrollment_status: 'open' | 'waiting_list' | 'closed' | 'completed';
  current_enrollment: number;
  fee_amount: number;
  fee_currency: string;
  session_status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  
  // Joined fields
  tutor_name?: string;
  tutor_avatar?: string;
  tutor_rating?: number;
  schedule_configs?: SessionScheduleConfig[];
  schedules?: TutorSessionSchedule[];
}

export interface CreateSessionData {
  name: string;
  description?: string;
  subject: string;
  curriculum_id?: number;  // Change from number | null to optional number
  curriculum_level_id?: number;  // Change from number | null to optional number
  prerequisites?: string[];
  learning_outcomes?: string[];
  curriculum?: Array<{
    week: number;
    topic: string;
    objectives?: string[];
    materials?: string[];
  }>;
  batch_name?: string;
  session_type: 'one_on_one' | 'group';
  max_students: number;
  start_date: string;
  end_date: string;
  fee_amount?: number;
  fee_currency?: string;
  schedule_configs: Omit<SessionScheduleConfig, 'id' | 'duration_minutes'>[];
}

export interface SessionEnrollment {
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
}

// ================= APPLICATION HELPERS =================

export const loadApplication = async (): Promise<LoadApplicationResponse> => {
  try {
    const response = await client.get<LoadApplicationResponse>("/tutor/application/status");
    console.log("Load application response:", response);
    return response;
  } catch (error: any) {
    console.error("Error loading application:", error);
    throw error;
  }
};

export const saveStep = async (step: number, data: StepData): Promise<SaveStepResponse> => {
  try {
    if (step < 1 || step > 4) {
      throw new Error(`Invalid step number: ${step}. Must be between 1 and 4`);
    }

    console.log(`Saving step ${step} with data:`, data);
    
    const response = await client.post<SaveStepResponse>(
      `/tutor/application/step/${step}`, 
      data
    );
    
    console.log(`Save step ${step} response:`, response);
    return response;
  } catch (error: any) {
    console.error(`Error saving step ${step}:`, error);
    throw error;
  }
};

export const saveTutorLevel = async (data: Step1TutorLevelData): Promise<SaveStepResponse> => {
  return saveStep(1, data);
};

export const savePersonalInfo = async (data: Step2PersonalInfoData): Promise<SaveStepResponse> => {
  return saveStep(2, data);
};

export const saveEducation = async (data: Step3EducationData): Promise<SaveStepResponse> => {
  return saveStep(3, data);
};

export const saveExperience = async (data: Step4ExperienceData): Promise<SaveStepResponse> => {
  return saveStep(4, data);
};

export const submitApplication = async (
  paymentReference: string, 
  paymentMethod: string
): Promise<ApiResponse> => {
  try {
    console.log("Submitting application with payment:", { paymentReference, paymentMethod });
    
    const response = await client.post<ApiResponse>("/tutor/application/submit", {
      payment_reference: paymentReference,
      payment_method: paymentMethod,
    });
    
    console.log("Submit application response:", response);
    return response;
  } catch (error: any) {
    console.error("Error submitting application:", error);
    throw error;
  }
};

export const uploadDocument = async (formData: FormData): Promise<ApiResponse> => {
  try {
    console.log("Uploading document with formData:", {
      fileType: formData.get("fileType"),
      file: formData.get("document") ? "File present" : "No file",
    });
    
    const response = await client.upload<ApiResponse>(
      "/tutor/upload-document?target=tutor-documents", 
      formData
    );
    
    console.log("Upload document response:", response);
    return response;
  } catch (error: any) {
    console.error("Error uploading document:", error);
    throw error;
  }
};

export const uploadAvatar = async (formData: FormData): Promise<ApiResponse> => {
  try {
    const fileType = formData.get("fileType");
    console.log("Uploading avatar with formData:", {
      fileType: formData.get("fileType"),
      file: formData.get("document") ? "File present" : "No file",
    });
    
    const response = await client.upload<ApiResponse>(
      `/tutor/upload-document?target=${fileType == "avatar" ? "avatars" : "tutor-documents"}`, 
      formData
    );
    
    console.log("Upload avatar response:", response);
    return response;
  } catch (error: any) {
    console.error("Error uploading avatar:", error);
    throw error;
  }
};

export const getApplicationStatus = async (): Promise<LoadApplicationResponse> => {
  try {
    const response = await client.get<LoadApplicationResponse>("/tutor/application/status");
    return response;
  } catch (error: any) {
    console.error("Error getting application status:", error);
    throw error;
  }
};

export const validateStepData = (
  step: number,
  data: any
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  switch (step) {
    case 1:
      if (!data.tutor_level) {
        errors.push("Tutor level is required");
      }
      if (['junior_high_teacher', 'senior_high_teacher'].includes(data.tutor_level) && !data.tsc_number) {
        errors.push("TSC number is required for school teachers");
      }
      break;

    case 2:
      if (!data.official_first_name?.trim()) errors.push("First name is required");
      if (!data.official_last_name?.trim()) errors.push("Last name is required");
      if (!data.date_of_birth) errors.push("Date of birth is required");
      if (!data.national_id_number?.trim()) errors.push("National ID number is required");
      if (!data.national_id_front_url?.trim()) errors.push("National ID front photo is required");
      if (!data.national_id_back_url?.trim()) errors.push("National ID back photo is required");
      break;

    case 3:
      if (!data.highest_education_level) errors.push("Education level is required");
      if (!data.university_name?.trim()) errors.push("University name is required");
      
      if (['bachelors', 'masters', 'phd', 'diploma'].includes(data.highest_education_level)) {
        if (!data.admission_letter_url?.trim()) {
          errors.push("Admission letter is required for this education level");
        }
        if (!data.admission_number?.trim()) {
          errors.push("Admission number is required for this education level");
        }
      }
      break;

    case 4:
      if (typeof data.has_teaching_experience === "undefined") {
        errors.push("Please specify if you have teaching experience");
      }
      
      if (data.has_teaching_experience && (!data.teaching_experience_years && data.teaching_experience_years !== 0)) {
        errors.push("Teaching experience years is required");
      }
      break;
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const canProceedToStep = (currentStep: number, application?: ApplicationData): boolean => {
  if (!application) return currentStep === 1;
  return currentStep <= (application.current_step || 0) + 1;
};

export const getNextStep = (currentStep: number): number => {
  return Math.min(currentStep + 1, 4);
};

export const getPreviousStep = (currentStep: number): number => {
  return Math.max(currentStep - 1, 1);
};

export const getProgressPercentage = (currentStep: number): number => {
  if (currentStep === 0) return 0;
  return Math.min(currentStep * 25, 100);
};

export const getTutorLevelDisplay = (level?: TutorLevel): string => {
  const map: Record<TutorLevel, string> = {
    college_student: "College/University Student",
    junior_high_teacher: "Junior High School Teacher",
    senior_high_teacher: "Senior High School Teacher",
    skilled_professional: "Skilled Professional",
    university_lecturer: "University Lecturer",
    private_tutor: "Private Tutor",
  };
  return level ? map[level] : "Not specified";
};

export const getEducationLevelDisplay = (level?: EducationLevel): string => {
  const map: Record<EducationLevel, string> = {
    high_school: "High School",
    diploma: "Diploma",
    bachelors: "Bachelor's Degree",
    masters: "Master's Degree",
    phd: "PhD",
  };
  return level ? map[level] : "Not specified";
};

export const getRequiredDocuments = (tutorLevel: string, educationLevel: string) => {
  const isStudent = tutorLevel === "college_student";
  const needsHigherEducationDoc = ["diploma", "bachelors", "masters", "phd"].includes(educationLevel);
  
  if (isStudent && needsHigherEducationDoc) {
    return {
      admissionLetter: true,
      graduationCertificate: false,
      description: "Admission letter and student number required for current students"
    };
  }
  
  if (!isStudent && needsHigherEducationDoc) {
    return {
      admissionLetter: false,
      graduationCertificate: true,
      description: "Graduation certificate required for graduates"
    };
  }
  
  return {
    admissionLetter: false,
    graduationCertificate: false,
    description: "No additional documents required"
  };
};

export const isApplicationComplete = (application?: ApplicationData): boolean => {
  if (!application) return false;
  
  const hasTutorLevel = !!application.tutor_level;
  const hasPersonalInfo = !!application.official_first_name && !!application.official_last_name;
  const hasEducation = !!application.highest_education_level && !!application.university_name;
  const hasExperience = typeof application.has_teaching_experience !== "undefined";
  
  return hasTutorLevel && hasPersonalInfo && hasEducation && hasExperience;
};

export const formatApplicationForDisplay = (application: ApplicationData) => {
  return {
    ...application,
    tutor_level_display: getTutorLevelDisplay(application.tutor_level),
    highest_education_level_display: getEducationLevelDisplay(application.highest_education_level),
    has_teaching_experience_display: application.has_teaching_experience ? "Yes" : "No",
    formatted_date_of_birth: application.date_of_birth 
      ? new Date(application.date_of_birth).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Not provided",
  };
};

export const getStepRequirements = (
  step: number, 
  tutorLevel?: TutorLevel
): { required: string[]; optional: string[] } => {
  const baseRequirements = {
    1: {
      required: ["Select tutor level"],
      optional: ["TSC number (for teachers)", "Portfolio URL (recommended for professionals)"],
    },
    2: {
      required: [
        "Official first name",
        "Official last name", 
        "Date of birth",
        "National ID number",
        "National ID front photo",
        "National ID back photo",
      ],
      optional: [],
    },
    3: {
      required: ["Highest education level", "University name"],
      optional: ["Admission letter", "Admission number"],
    },
    4: {
      required: ["Teaching experience status"],
      optional: [
        "Teaching experience years",
        "Previous institutions",
        "Professional experience",
        "Certificates",
        "Portfolio URL",
      ],
    },
  };

  const requirements = baseRequirements[step as keyof typeof baseRequirements] || baseRequirements[1];
  
  if (step === 3) {
    if (tutorLevel === "college_student" || tutorLevel === "university_lecturer") {
      requirements.optional = ["Admission letter (required for higher education)", "Admission number"];
    }
  }
  
  if (step === 4 && tutorLevel === "skilled_professional") {
    requirements.optional = ["Portfolio URL (recommended)", ...requirements.optional];
  }

  return requirements;
};

// ================= SESSION API METHODS =================

const tutorApi = {
  // Application methods
  loadApplication,
  saveStep,
  saveTutorLevel,
  savePersonalInfo,
  saveEducation,
  saveExperience,
  submitApplication,
  uploadDocument,
  uploadAvatar,
  getApplicationStatus,
  validateStepData,
  canProceedToStep,
  getNextStep,
  getPreviousStep,
  getProgressPercentage,
  getTutorLevelDisplay,
  getEducationLevelDisplay,
  getRequiredDocuments,
  isApplicationComplete,
  formatApplicationForDisplay,
  getStepRequirements,

  getTutorCurriculums: (): Promise<{ success: boolean; data: TutorCurriculum[] }> =>
  client.get("/tutor/curriculums/tutor"), 

  // ================= SESSION ENDPOINTS =================
  
  // Get all sessions
  getSessions: (params?: {
    tutor_course_id?: number;
    session_type?: string;
    enrollment_status?: string;
    status?: string;
    start_date?: string;
    end_date?: string;
    page?: number;
    limit?: number;
  }): Promise<{ success: boolean; data: { sessions: TutorSession[]; total: number; page: number; limit: number; totalPages: number } }> => {
    console.log("Fetching sessions with params:", params);
    return client.get("/tutor/sessions", params);
  },

  // Get session by UUID
  getSession: (uuid: string): Promise<{ success: boolean; data: TutorSession }> =>
    client.get(`/tutor/sessions/${uuid}`),

  // Create session
  createSession: (data: CreateSessionData): Promise<{ success: boolean; data: TutorSession }> =>
    client.post("/tutor/sessions", data),

  // Update session by UUID
  updateSession: (uuid: string, data: Partial<CreateSessionData>): Promise<{ success: boolean; data: TutorSession }> =>
    client.put(`/tutor/sessions/${uuid}`, data),

  // Delete session by UUID
  deleteSession: (uuid: string): Promise<{ success: boolean; message: string }> =>
    client.delete(`/tutor/sessions/${uuid}`),

  // Join session by UUID
  joinSession: (uuid: string): Promise<{ success: boolean; data: { meeting_link: string } }> =>
    client.post(`/tutor/sessions/${uuid}/join`),

  // Get session enrollments by UUID
  getSessionEnrollments: (uuid: string): Promise<{ success: boolean; data: SessionEnrollment[] }> =>
    client.get(`/tutor/sessions/${uuid}/enrollments`),

  // Enroll in session by UUID
  enrollInSession: (uuid: string): Promise<{ success: boolean; data: SessionEnrollment }> =>
    client.post(`/tutor/sessions/${uuid}/enroll`),

  // ================= TUTOR PROFILE ENDPOINTS =================
  
  // Get tutor profile
  getTutorProfile: (): Promise<{ success: boolean; data: any }> =>
    client.get("/tutor/profile"),

  // Update tutor profile
  updateTutorProfile: (data: any): Promise<{ success: boolean; data: any }> =>
    client.put("/tutor/profile", data),

  // Get tutor dashboard stats
  getDashboardStats: (): Promise<{ 
  success: boolean; 
  data: {
    totalSessions: number;
    activeSessions: number;
    totalStudents: number;
    totalEarnings: number;
    pendingApplications: number;
    totalEnrollments?: number;
    completionRate?: number;
    averageRating?: number;
    totalReviews?: number;
  } 
}> => client.get("/tutor/dashboard/stats"),

  // ================= ENROLLMENT MANAGEMENT =================

  getAllEnrollments: (params?: {
    status?: string;
    payment_status?: string;
    session_id?: number;
    course_id?: number;
    page?: number;
    limit?: number;
  }): Promise<{ success: boolean; data: { enrollments: Enrollment[]; total: number; page: number; limit: number; totalPages: number } }> =>
    client.get("/tutor/enrollments", params),

  getEnrollmentById: (enrollmentId: number): Promise<{ success: boolean; data: EnrollmentDetail }> =>
    client.get(`/tutor/enrollments/${enrollmentId}`),

  updateEnrollmentStatus: (enrollmentId: number, data: { status: string }): Promise<{ success: boolean; data: Enrollment }> =>
    client.put(`/tutor/enrollments/${enrollmentId}/status`, data),

  bulkUpdateEnrollments: (data: { enrollment_ids: number[]; action: string }): Promise<{ success: boolean; data: { updated: number } }> =>
    client.post("/tutor/enrollments/bulk-update", data),

  recordPayment: (enrollmentId: number, data: { amount: number; reference: string; notes?: string }): Promise<{ success: boolean; data: any }> =>
    client.post(`/tutor/enrollments/${enrollmentId}/payments`, data),

  getEnrollmentPayments: (enrollmentId: number): Promise<{ success: boolean; data: any[] }> =>
    client.get(`/tutor/enrollments/${enrollmentId}/payments`),

  getEnrollmentAttendance: (enrollmentId: number): Promise<{ success: boolean; data: any[] }> =>
    client.get(`/tutor/enrollments/${enrollmentId}/attendance`),

  markAttendance: (enrollmentId: number, scheduleId: number, attended: boolean): Promise<{ success: boolean; data: any }> =>
    client.post(`/tutor/enrollments/${enrollmentId}/attendance`, { schedule_id: scheduleId, attended }),

  // ================= CURRICULUM AND LEVELS =================

  getCurriculums: (): Promise<{ success: boolean; data: Curriculum[] }> =>
    client.get("/tutor/curriculums"),

  getTutorLevels: (): Promise<{ success: boolean; data: TutorLevelInfo[] }> =>
    client.get("/tutor/levels"),

  // ================= SCHEDULE API =================
  schedules: tutorScheduleApi,
};

export default tutorApi;