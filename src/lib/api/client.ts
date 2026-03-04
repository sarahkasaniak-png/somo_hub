export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2000/api";

// const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2000/api";

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

// async function request<T>(
//   url: string,
//   options: RequestInit = {}
// ): Promise<T> {
//   try {
//     const res = await fetch(`${API_BASE}${url}`, {
//       credentials: "include",
//       ...options,
//     });

//     const contentType = res.headers.get("content-type");
//     const isJson = contentType && contentType.includes("application/json");
    
//     const data = isJson ? await res.json() : await res.text();

//     if (!res.ok) {
//       // Try to extract error message from response
//       const errorMessage = isJson
//         ? data.message || data.error || `Request failed with status ${res.status}`
//         : data || `Request failed with status ${res.status}`;
      
//       throw new Error(errorMessage);
//     }

//     return data as T;
//   } catch (error) {
//     console.error("API request error:", error);
//     throw error;
//   }
// }

async function request<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${url}`, {
      credentials: "include",
      ...options,
    });

    const contentType = res.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");
    
    const data = isJson ? await res.json() : await res.text();

    if (!res.ok) {
      // Create a proper error object with all details
      const errorMessage = isJson 
        ? data.message || data.error || `Request failed with status ${res.status}`
        : data || `Request failed with status ${res.status}`;
      
      // Create a detailed error object
      const error = new Error(errorMessage);
      // Attach the full response data for debugging
      (error as any).response = data;
      (error as any).status = res.status;
      (error as any).statusText = res.statusText;
      
      console.log("🔴 API Client - throwing error:", {
        message: errorMessage,
        status: res.status,
        data
      });
      
      throw error;
    }

    return data as T;
  } catch (error) {
    // If it's already our enhanced error, just re-throw
    if (error instanceof Error) {
      console.log("🔴 API Client - caught error (re-throwing):", {
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
    
    // For network errors or other issues
    console.log("🔴 API Client - network or unknown error:", error);
    throw new Error("Network error or unable to connect to server");
  }
}

export default {
  get: <T>(url: string, params?: Record<string, any>, options?: RequestInit) => {
    const queryString = buildQueryString(params);
    return request<T>(`${url}${queryString}`, { 
      method: "GET", 
      ...options 
    });
  },
  
  post: <T>(url: string, body?: any, options?: RequestInit) => {
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
  
  put: <T>(url: string, body?: any, options?: RequestInit) => {
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
  
  delete: <T>(url: string, options?: RequestInit) =>
    request<T>(url, { method: "DELETE", ...options }),
  
  upload: <T>(url: string, formData: FormData, options?: RequestInit) => 
    request<T>(url, { 
      method: "POST", 
      body: formData,
      ...options,
    }),
};