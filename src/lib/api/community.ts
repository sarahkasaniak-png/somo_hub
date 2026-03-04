// src/lib/api/community.ts
import apiClient from "./client";

export interface CommunityApplication {
  id?: number;
  onboarding_step: number;
  onboarding_status: "draft" | "pending" | "approved" | "rejected";
  category_id?: number;
  custom_category?: string;
  name?: string;
  description?: string;
  slug?: string;
  logo_url?: string;
  banner_url?: string;
  verification_documents?: any[];
  is_public?: boolean;
  owner_id?: number;
  payment_reference?: string;
  payment_status?: "pending" | "paid" | "failed" | "refunded";
  payment_amount?: number;
  [key: string]: any;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface LoadApplicationResponse extends ApiResponse {
  hasApplication: boolean;
  application?: CommunityApplication;
}

export interface SaveStepResponse extends ApiResponse<CommunityApplication> {}

export const loadCommunityApplication = async (): Promise<LoadApplicationResponse> => {
  try {
    const response = await apiClient.get<LoadApplicationResponse>(
      "/community/application/status"
    );
    return response;
  } catch (error: any) {
    console.error("Error loading community application:", error);
    throw error;
  }
};

export const saveCommunityStep = async (
  step: number,
  data: any
): Promise<SaveStepResponse> => {
  try {
    if (step < 1 || step > 4) {
      throw new Error(`Invalid step number: ${step}. Must be between 1 and 4`);
    }

    const response = await apiClient.post<SaveStepResponse>(
      `/community/application/step/${step}`,
      data
    );

    return response;
  } catch (error: any) {
    console.error(`Error saving step ${step}:`, error);
    throw error;
  }
};

export const submitCommunityApplication = async (
  paymentReference: string,
  paymentMethod: string
): Promise<ApiResponse> => {
  try {
    const response = await apiClient.post<ApiResponse>(
      "/community/application/submit",
      {
        payment_reference: paymentReference,
        payment_method: paymentMethod,
      }
    );

    return response;
  } catch (error: any) {
    console.error("Error submitting community application:", error);
    throw error;
  }
};

export const getCommunityCategories = async (): Promise<any> => {
  try {
    const response = await apiClient.get<any>("/community/application/categories");
    return response;
  } catch (error: any) {
    console.error("Error getting community categories:", error);
    throw error;
  }
};

export const uploadCommunityDocument = async (
  formData: FormData
): Promise<ApiResponse> => {
  try {
    const response = await apiClient.upload<ApiResponse>(
        "/community/application/upload-document?target=community-documents",
        formData
    );

    return response;
  } catch (error: any) {
    console.error("Error uploading community document:", error);
    throw error;
  }
};

export const getCommunityOnboardingSteps = async (): Promise<any> => {
  try {
    const response = await apiClient.get<any>("/community/application/steps");
    return response;
  } catch (error: any) {
    console.error("Error getting application steps:", error);
    throw error;
  }
};

// Helper functions
export const getCategoryDisplay = (categoryId: number): string => {
  const categories: Record<number, string> = {
    1: "Primary School",
    2: "High School",
    3: "College/University",
    4: "NGO/Non-Profit",
    5: "Private Tutor Group",
    6: "Study Group",
    7: "Professional Association",
    8: "Other",
  };
  return categories[categoryId] || "Unknown";
};

export const formatCommunityForDisplay = (application: CommunityApplication) => {
  return {
    ...application,
    category_display: getCategoryDisplay(application.category_id || 0),
    privacy_display: application.is_public !== false ? "Public" : "Private",
  };
};

export const validateCommunityStep = (
  step: number,
  data: any
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  switch (step) {
    case 1:
      if (!data.category_id) {
        errors.push("Community category is required");
      }
      if (data.category_id === 8 && !data.custom_category?.trim()) {
        errors.push("Custom category description is required");
      }
      break;

    case 2:
      if (!data.name?.trim()) errors.push("Community name is required");
      if (!data.description?.trim()) errors.push("Description is required");
      if (!data.slug?.trim()) errors.push("Community URL is required");
      break;

    case 3:
      // Verification documents are optional
      break;

    case 4:
      if (typeof data.is_public === "undefined") {
        errors.push("Privacy setting is required");
      }
      if (!data.terms_accepted) {
        errors.push("You must accept the terms and conditions");
      }
      break;
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};