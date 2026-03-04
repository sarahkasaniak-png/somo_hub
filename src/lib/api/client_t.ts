// src/lib/api/client.ts

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2000/api";

// Define a base response type that all API responses will have
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  [key: string]: any; // Allow any other properties your API returns
}

// Helper function to convert params object to query string
const buildQueryString = (params?: Record<string, any>): string => {
  if (!params) return '';
  
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, String(value));
    }
  });
  
  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : '';
};

// Custom error class
class ApiRequestError extends Error {
  response?: ApiResponse;
  status?: number;
  statusText?: string;

  constructor(message: string, options?: { response?: ApiResponse; status?: number; statusText?: string }) {
    super(message);
    this.name = 'ApiRequestError';
    this.response = options?.response;
    this.status = options?.status;
    this.statusText = options?.statusText;
  }
}

async function request<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${API_BASE}${url}`, {
      credentials: "include",
      ...options,
    });

    const contentType = res.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");
    
    const data = isJson ? await res.json() : await res.text();

    if (!res.ok) {
      // Create error response
      const errorResponse: ApiResponse = {
        success: false,
        message: isJson ? data.message || data.error : data,
        ...(isJson ? data : {})
      };
      
      const errorMessage = errorResponse.message || `Request failed with status ${res.status}`;
      
      const error = new ApiRequestError(errorMessage);
      error.response = errorResponse;
      error.status = res.status;
      error.statusText = res.statusText;
      
      console.log("🔴 API Client - throwing error:", {
        message: errorMessage,
        status: res.status,
        data: errorResponse
      });
      
      throw error;
    }

    // Return success response with the ApiResponse shape
    const successResponse: ApiResponse<T> = {
      success: true,
      ...(isJson ? data : { data }),
    };

    return successResponse;
  } catch (error) {
    if (error instanceof ApiRequestError) {
      throw error;
    }
    
    console.log("🔴 API Client - network or unknown error:", error);
    
    const networkError = new ApiRequestError("Network error or unable to connect to server");
    networkError.response = { success: false, message: "Network error or unable to connect to server" };
    networkError.status = 0;
    networkError.statusText = "Network Error";
    throw networkError;
  }
}

// Type guard
export function isApiError(error: unknown): error is ApiRequestError {
  return error instanceof ApiRequestError;
}

export default {
  get: <T>(url: string, params?: Record<string, any>, options?: RequestInit): Promise<ApiResponse<T>> => {
    const queryString = buildQueryString(params);
    return request<T>(`${url}${queryString}`, { 
      method: "GET", 
      ...options 
    });
  },
  
  post: <T>(url: string, body?: any, options?: RequestInit): Promise<ApiResponse<T>> => {
    const headers: HeadersInit = {};
    
    if (!(body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }
    
    return request<T>(url, {
      method: "POST",
      headers,
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
      ...options,
    });
  },
  
  put: <T>(url: string, body?: any, options?: RequestInit): Promise<ApiResponse<T>> => {
    const headers: HeadersInit = {};
    
    if (!(body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }
    
    return request<T>(url, {
      method: "PUT",
      headers,
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
      ...options,
    });
  },
  
  delete: <T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> =>
    request<T>(url, { method: "DELETE", ...options }),
  
  upload: <T>(url: string, formData: FormData, options?: RequestInit): Promise<ApiResponse<T>> => 
    request<T>(url, { 
      method: "POST", 
      body: formData,
      ...options,
    }),
};