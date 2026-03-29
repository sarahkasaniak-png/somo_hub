// src/lib/api/auth.ts
import client from "./client";

// Define response types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface User {
  id: number;
  uuid: string;
  email: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  avatar_url?: string;
  roles?: string[];
}

export interface AuthResponse extends ApiResponse {
  data?: {
    user: User;
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
  };
}

export interface ChangePasswordResponse extends ApiResponse {
  message?: string;
}

/* ================= REGISTRATION & PASSWORD LOGIN ================= */

const register = (email: string, password: string, confirmPassword: string): Promise<AuthResponse> =>
  client.post("/auth/register", { email, password, confirmPassword });

const passwordLogin = (email: string, password: string): Promise<AuthResponse> =>
  client.post("/auth/login", { email, password });

/* ================= OTP ================= */

const sendOtp = (email: string, purpose: 'registration' | 'reset_password' = 'registration'): Promise<ApiResponse> =>
  client.post("/auth/otp/send", { email, purpose });

const verifyOtp = (email: string, otp: string, purpose: 'registration' | 'reset_password' = 'registration'): Promise<ApiResponse> =>
  client.post("/auth/otp/verify", { email, otp, purpose });

/* ================= PASSWORD RESET FLOW ================= */

const forgotPassword = (email: string): Promise<ApiResponse> =>
  client.post("/auth/forgot-password", { email });

const verifyResetOtp = (email: string, otp: string): Promise<ApiResponse> =>
  client.post("/auth/verify-reset-otp", { email, otp });

const resetPassword = (email: string, otp: string, newPassword: string, confirmPassword: string): Promise<ApiResponse> =>
  client.post("/auth/reset-password", { email, otp, newPassword, confirmPassword });

/* ================= CHANGE PASSWORD (Authenticated) ================= */

const changePassword = (currentPassword: string, newPassword: string, confirmPassword: string): Promise<ChangePasswordResponse> =>
  client.post("/auth/change-password", { 
    current_password: currentPassword, 
    new_password: newPassword, 
    confirm_password: confirmPassword 
  });

/* ================= GOOGLE ================= */

const googleLogin = (idToken: string): Promise<AuthResponse> =>
  client.post("/auth/google", { idToken });

/* ================= SESSION ================= */

const me = (): Promise<ApiResponse<{ user: User }>> =>
  client.get("/auth/me");

const refresh = (): Promise<ApiResponse<{ access_token: string; expires_in: number }>> =>
  client.post("/auth/refresh");

const logout = (): Promise<ApiResponse> =>
  client.post("/auth/logout");

const logoutAll = (): Promise<ApiResponse> =>
  client.post("/auth/logout/all");

/* ================= EXPORT ================= */

const authApi = {
  // Registration & Password Login
  register,
  passwordLogin,
  
  // OTP
  sendOtp,
  verifyOtp,
  
  // Password Reset Flow
  forgotPassword,
  verifyResetOtp,
  resetPassword,
  
  // Change Password (Authenticated)
  changePassword,
  
  // Google
  googleLogin,
  
  // Session
  me,
  refresh,
  logout,
  logoutAll,
};

export default authApi;