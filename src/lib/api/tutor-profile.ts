// src/lib/api/tutor-profile.ts
import client from "./client";
import { 
  ProfileData, 
  Document, 
  ApiResponse,
  ProfileCompletion 
} from "@/types/tutor-profile.types";
import { useAuth } from "@/app/context/AuthContext";

export const tutorProfileApi = {
  // Get complete tutor profile
  getProfile: async (): Promise<ApiResponse<ProfileData>> => {
    return client.get("/tutor/profile/profile");
  },

  // Update tutor profile
 updateProfile: async (data: Partial<ProfileData>): Promise<ApiResponse<ProfileData>> => {
    // Only include fields that are actually updatable
    const updatableFields = [
      'first_name', 'last_name', 'phone', 'date_of_birth', 'avatar_url',
      'country', 'city', 'timezone', 'languages',
      'bio', 'headline', 'currency',
      'subjects', 'education', 'experience', 'certifications',
      'availability',
      'highest_education_level', 'university_name', 'graduation_certificate_url',
      'teaching_experience_years', 'professional_experience', 'tsc_number', 'portfolio_url',
      'previous_institutions', 'certificates'
    ];
    
    // Filter the data to only include updatable fields
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([key, value]) => 
        updatableFields.includes(key) && value !== undefined
      )
    );
    
    console.log('Sending update data:', cleanData);
    
    return client.put("/tutor/profile", cleanData);
  },

  // Upload profile picture
  uploadProfilePicture: async (file: File): Promise<ApiResponse<{ url: string }>> => {
    const formData = new FormData();
    formData.append("document", file);
    formData.append("fileType", "avatar");
    return client.upload("/tutor/upload-document", formData);
  },

  // Upload document
  uploadDocument: async (file: File, documentType: string): Promise<ApiResponse<{ url: string; id: number }>> => {
    const formData = new FormData();
    formData.append("document", file);
    formData.append("fileType", documentType);
    formData.append("target", "tutor-documents");
    return client.upload("/tutor/upload-document", formData);
  },

  // Get all documents
  getDocuments: async (): Promise<ApiResponse<Document[]>> => {
    return client.get("/tutor/documents");
  },

  // Delete document
//   deleteDocument: async (documentId: number): Promise<ApiResponse<null>> => {
//     return client.delete(`/tutor/documents/${documentId}`);
    //   },
  // In tutor-profile.ts
deleteDocument: async (documentId: number): Promise<ApiResponse<null>> => {
  try {
   const response = await client.delete<ApiResponse<null>>(`/tutor/documents/${documentId}`);
    return response;
  } catch (error) {
    // Log the full error before re-throwing
    console.log("🔴 API Client - deleteDocument caught error:", {
      error,
      type: typeof error,
      isError: error instanceof Error,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    
    // Re-throw with preserved message
    if (error instanceof Error) {
      throw error;
    } else if (typeof error === 'object' && error !== null) {
      // Try to extract message from object
      const errorObj = error as any;
      throw new Error(errorObj.message || errorObj.error || "Failed to delete document");
    } else {
      throw new Error("Failed to delete document");
    }
  }
},

  // Add education
  addEducation: async (education: Omit<ProfileData['education'][0], "id">): Promise<ApiResponse<ProfileData['education'][0]>> => {
    return client.post("/tutor/education", education);
  },

  // Update education
  updateEducation: async (educationId: number, education: Partial<ProfileData['education'][0]>): Promise<ApiResponse<ProfileData['education'][0]>> => {
    return client.put(`/tutor/education/${educationId}`, education);
  },

  // Delete education
  deleteEducation: async (educationId: number): Promise<ApiResponse<null>> => {
    return client.delete(`/tutor/education/${educationId}`);
  },

  // Add experience
  addExperience: async (experience: Omit<ProfileData['experience'][0], "id">): Promise<ApiResponse<ProfileData['experience'][0]>> => {
    return client.post("/tutor/experience", experience);
  },

  // Update experience
  updateExperience: async (experienceId: number, experience: Partial<ProfileData['experience'][0]>): Promise<ApiResponse<ProfileData['experience'][0]>> => {
    return client.put(`/tutor/experience/${experienceId}`, experience);
  },

  // Delete experience
  deleteExperience: async (experienceId: number): Promise<ApiResponse<null>> => {
    return client.delete(`/tutor/experience/${experienceId}`);
  },

  // Add certification
  addCertification: async (certification: Omit<ProfileData['certifications'][0], "id">): Promise<ApiResponse<ProfileData['certifications'][0]>> => {
    return client.post("/tutor/certifications", certification);
  },

  // Update certification
  updateCertification: async (certificationId: number, certification: Partial<ProfileData['certifications'][0]>): Promise<ApiResponse<ProfileData['certifications'][0]>> => {
    return client.put(`/tutor/certifications/${certificationId}`, certification);
  },

  // Delete certification
  deleteCertification: async (certificationId: number): Promise<ApiResponse<null>> => {
    return client.delete(`/tutor/certifications/${certificationId}`);
  },

  // Update availability
  updateAvailability: async (availability: ProfileData['availability']): Promise<ApiResponse<ProfileData['availability']>> => {
    return client.put("/tutor/availability", availability);
  },

  // Get subjects
  getSubjects: async (): Promise<ApiResponse<Array<{ id: number; name: string; hourly_rate: number }>>> => {
    return client.get("/tutor/subjects");
  },

  // Add subject
  addSubject: async (subject: { name: string; hourly_rate: number }): Promise<ApiResponse<any>> => {
    return client.post("/tutor/subjects", subject);
  },

  // Delete subject
  deleteSubject: async (subjectId: number): Promise<ApiResponse<null>> => {
    return client.delete(`/tutor/subjects/${subjectId}`);
  },

  // Get profile completion status
  getProfileCompletion: async (): Promise<ApiResponse<ProfileCompletion>> => {
    return client.get("/tutor/profile/completion");
  },

  // Get tutor stats
  getStats: async (): Promise<ApiResponse<ProfileData['stats']>> => {
    return client.get("/tutor/stats");
  },

  // Verify phone number (send OTP)
  sendPhoneVerification: async (phone: string): Promise<ApiResponse<null>> => {
    return client.post("/tutor/profile/verify-phone/send", { phone });
  },

  // Verify phone with OTP
  verifyPhone: async (phone: string, otp: string): Promise<ApiResponse<null>> => {
    return client.post("/tutor/profile/verify-phone/verify", { phone, otp });
  },

  // Add language
  addLanguage: async (data: { language: string; proficiency?: string }): Promise<ApiResponse<any>> => {
    return client.post("/tutor/profile/languages", data);
  },

  // Remove language
  removeLanguage: async (languageId: number): Promise<ApiResponse<null>> => {
    return client.delete(`/tutor/profile/languages/${languageId}`);
  },

  // Update availability settings
  updateAvailabilitySettings: async (data: Partial<ProfileData['availability']>): Promise<ApiResponse<ProfileData['availability']>> => {
    return client.put("/tutor/profile/availability", data);
  },
};

// Custom hook for using tutor profile
export const useTutorProfile = () => {
  const { user, userStatus } = useAuth();
  
  const getProfileCompletionStatus = (profile: ProfileData | null): ProfileCompletion => {
    const requiredFields = [
      { field: "first_name", weight: 10, required_for: ["tutor", "student", "community"] },
      { field: "last_name", weight: 10, required_for: ["tutor", "student", "community"] },
      { field: "phone", weight: 10, required_for: ["tutor", "student", "community"] },
      { field: "country", weight: 5, required_for: ["tutor", "student", "community"] },
      { field: "city", weight: 5, required_for: ["tutor", "student", "community"] },
      { field: "languages", weight: 5, required_for: ["tutor"], isArray: true },
      { field: "bio", weight: 10, required_for: ["tutor"] },
      { field: "headline", weight: 5, required_for: ["tutor"] },
      { field: "subjects", weight: 10, required_for: ["tutor"], isArray: true },
      { field: "hourly_rate", weight: 5, required_for: ["tutor"] },
      { field: "education", weight: 10, required_for: ["tutor"], isArray: true },
      { field: "experience", weight: 10, required_for: ["tutor"], isArray: true },
      { field: "avatar_url", weight: 5, required_for: ["tutor", "student", "community"] },
    ];

    if (!profile) {
      return {
        percentage: 0,
        missing_fields: requiredFields.map(f => f.field.replace("_", " ")),
        completed_fields: []
      };
    }

    const completed: string[] = [];
    const missing: string[] = [];

    requiredFields.forEach(({ field, required_for, isArray }) => {
      // Check if this field is required for the user's roles
      const isRequired = required_for.some(role => {
        if (role === "tutor" && userStatus?.hasTutorRole) return true;
        if (role === "student" && userStatus?.hasStudentRole) return true;
        if (role === "community" && userStatus?.hasCommunityRole) return true;
        return false;
      });

      if (!isRequired) return;

      const value = profile[field as keyof ProfileData];
      let isComplete = false;

      if (isArray) {
        isComplete = Array.isArray(value) && (value as any[]).length > 0;
      } else if (field === "avatar_url") {
        isComplete = !!value;
      } else if (field === "hourly_rate") {
        isComplete = (value as number) > 0;
      } else {
        isComplete = !!value && String(value).trim() !== "";
      }

      if (isComplete) {
        completed.push(field);
      } else {
        missing.push(field.replace("_", " "));
      }
    });

    // Add phone verification bonus
    if (profile.verification?.phone_verified) {
      completed.push("phone_verified");
    } else {
      missing.push("phone verification");
    }

    // Add email verification bonus
    if (profile.verification?.email_verified) {
      completed.push("email_verified");
    } else {
      missing.push("email verification");
    }

    // Add identity verification bonus
    if (profile.verification?.identity_verified) {
      completed.push("identity_verified");
    } else {
      missing.push("identity verification");
    }

    const percentage = Math.round((completed.length / (completed.length + missing.length)) * 100) || 0;

    return {
      percentage,
      missing_fields: missing,
      completed_fields: completed
    };
  };

  const calculateProfileCompletion = (profile: ProfileData | null): number => {
    const status = getProfileCompletionStatus(profile);
    return status.percentage;
  };

  return {
    getProfileCompletionStatus,
    calculateProfileCompletion
  };
};