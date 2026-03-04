// src/lib/api/auth.ts
import client from "./client";

/* ================= REGISTRATION & PASSWORD LOGIN ================= */

const register = (email: string, password: string, confirmPassword: string) =>
  client.post("/auth/register", { email, password, confirmPassword });

const passwordLogin = (email: string, password: string) =>
  client.post("/auth/login", { email, password });

/* ================= OTP ================= */

const sendOtp = (email: string, purpose: 'registration' | 'reset_password' = 'registration') =>
  client.post("/auth/otp/send", { email, purpose });

const verifyOtp = (email: string, otp: string, purpose: 'registration' | 'reset_password' = 'registration') =>
  client.post("/auth/otp/verify", { email, otp, purpose });

/* ================= PASSWORD RESET FLOW ================= */

const forgotPassword = (email: string) =>
  client.post("/auth/forgot-password", { email });

const verifyResetOtp = (email: string, otp: string) =>
  client.post("/auth/verify-reset-otp", { email, otp });

const resetPassword = (email: string, otp: string, newPassword: string, confirmPassword: string) =>
  client.post("/auth/reset-password", { email, otp, newPassword, confirmPassword });

/* ================= GOOGLE ================= */

const googleLogin = (idToken: string) =>
  client.post("/auth/google", { idToken });

/* ================= SESSION ================= */

const me = () =>
  client.get("/auth/me");

const refresh = () =>
  client.post("/auth/refresh");

const logout = () =>
  client.post("/auth/logout");

const logoutAll = () =>
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
  
  // Google
  googleLogin,
  
  // Session
  me,
  refresh,
  logout,
  logoutAll,
};

export default authApi;