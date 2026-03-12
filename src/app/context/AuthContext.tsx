// src/app/context/AuthContext.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import authApi from "../../lib/api/auth";
import userApi, {
  UserStatusResponse,
  UserStatusData,
} from "../../lib/api/user";
import studentApi from "../../lib/api/student";
import tutorApi from "../../lib/api/tutor";
import {
  User,
  UserStatus,
  AuthContextType,
  RegistrationData,
  LoginData,
  ResetPasswordData,
  AuthResponse,
  ProfileData,
  Education,
} from "../../types/user.types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [userStatus, setUserStatus] = useState<UserStatus | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper function to get role count
  const getUserRoleCount = (): number => {
    if (!userStatus) return 0;

    const roles = [];
    if (userStatus.hasTutorRole) roles.push("tutor");
    if (userStatus.hasCommunityRole) roles.push("community");
    if (userStatus.hasStudentRole) roles.push("student");

    return roles.length;
  };

  // Helper to get user's primary role - updated to accept status parameter
  const getPrimaryRole = (
    status: UserStatus | null = userStatus,
  ): string | null => {
    const currentStatus = status || userStatus;
    if (!currentStatus) return null;

    if (currentStatus.hasTutorRole) return "tutor";
    if (currentStatus.hasCommunityRole) return "community";
    if (currentStatus.hasStudentRole) return "student";

    return null;
  };

  const fetchUserStatus = async (): Promise<UserStatus> => {
    try {
      const response: UserStatusResponse = await userApi.getUserStatus();

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch user status");
      }

      const backendData = response.data as UserStatusData;

      return {
        profileCompletion: backendData.profileCompletion || 0,
        activeEnrollments: backendData.activeEnrollments || 0,
        hasActiveEnrollments: backendData.hasActiveEnrollments || false,
        tutorApplication: backendData.tutorApplication || null,
        isApprovedTutor: backendData.isApprovedTutor || false,
        tutorData: backendData.tutorData || null,
        hasTutorApplication: backendData.hasTutorApplication || false,
        activeTutorStudents: backendData.activeTutorStudents || 0,
        pendingTutorRequests: backendData.pendingTutorRequests || 0,
        communityApplication: backendData.communityApplication || null,
        hasCommunityApplication: backendData.hasCommunityApplication || false,
        communityMemberships: backendData.communityMemberships || [],
        isCommunityMember: backendData.isCommunityMember || false,
        isApprovedCommunityMember:
          backendData.isApprovedCommunityMember || false,
        pendingCommunityRequests: backendData.pendingCommunityRequests || 0,
        unreadMessages: backendData.unreadMessages || 0,
        joinedCommunities: backendData.joinedCommunities || [],
        pendingCommunityModeration: backendData.pendingCommunityModeration || 0,
        communityApplications: backendData.communityApplications || [],
        upcomingSessionsCount: backendData.upcomingSessionsCount || 0,
        hasActiveSessions: backendData.hasActiveSessions || false,
        hasTutorRole: backendData.hasTutorRole || false,
        hasCommunityRole: backendData.hasCommunityRole || false,
        hasStudentRole: backendData.hasStudentRole !== false,
        hasAdminRole: backendData.hasAdminRole || false,
        applicationStatus: backendData.applicationStatus || {
          tutor: "not_started",
          community: "not_started",
        },
        recentActivity: backendData.recentActivity || [],
        // Add student-specific data with type assertion
        education: (backendData.education || []) as Education[],
        interests: backendData.interests || [],
        learning_goals: backendData.learning_goals || [],
      };
    } catch (error) {
      console.error("Failed to fetch user status:", error);

      return {
        profileCompletion: 0,
        activeEnrollments: 0,
        hasActiveEnrollments: false,
        tutorApplication: null,
        isApprovedTutor: false,
        tutorData: null,
        hasTutorApplication: false,
        activeTutorStudents: 0,
        pendingTutorRequests: 0,
        communityApplication: null,
        hasCommunityApplication: false,
        communityMemberships: [],
        isCommunityMember: false,
        isApprovedCommunityMember: false,
        pendingCommunityRequests: 0,
        unreadMessages: 0,
        joinedCommunities: [],
        pendingCommunityModeration: 0,
        communityApplications: [],
        upcomingSessionsCount: 0,
        hasActiveSessions: false,
        hasTutorRole: false,
        hasCommunityRole: false,
        hasStudentRole: true,
        hasAdminRole: false,
        applicationStatus: {
          tutor: "not_started",
          community: "not_started",
        },
        recentActivity: [],
        education: [],
        interests: [],
        learning_goals: [],
      };
    }
  };

  // Fetch profile data based on user role - updated to accept status parameter
  const fetchProfileData = async (
    userData?: User,
    statusData?: UserStatus,
  ): Promise<ProfileData | null> => {
    const currentUser = userData || user;
    const currentStatus = statusData || userStatus;

    if (!currentUser) return null;

    // console.log("📊 fetchProfileData - user:", currentUser);
    // console.log("📊 fetchProfileData - status:", currentStatus);

    try {
      const primaryRole = getPrimaryRole(currentStatus);
      // console.log("📊 fetchProfileData - primary role:", primaryRole);

      if (primaryRole === "student") {
        try {
          // Try to get student profile from API
          const response = await studentApi.getProfile();

          if (response.success && response.data) {
            // console.log("✅ Student profile loaded from API:", response.data);
            setProfileData(response.data);
            return response.data;
          }
        } catch (error) {
          // console.log(
          //   "⚠️ Student profile endpoint not available, using userStatus data",
          // );

          // Use the passed status data instead of state
          if (currentStatus) {
            const profileFromStatus: ProfileData = {
              first_name: currentUser.first_name || "",
              last_name: currentUser.last_name || "",
              email: currentUser.email || "",
              phone: currentUser.phone || "",
              date_of_birth: currentUser.date_of_birth || "",
              avatar_url: currentUser.avatar_url || null,
              country: currentUser.country || "",
              city: currentUser.city || "",
              education: (currentStatus.education || []) as Education[],
              interests: currentStatus.interests || [],
              learning_goals: currentStatus.learning_goals || [],
              stats: {
                courses_completed: 0,
                sessions_attended: 0,
                learning_hours: 0,
                certificates_earned: 0,
                average_rating: 0,
                reviews_left: 0,
              },
              verification: {
                email_verified: currentUser.is_verified || false,
                phone_verified: currentUser.phone_verified || false,
              },
            };

            // console.log(
            //   "✅ Student profile built from status:",
            //   profileFromStatus,
            // );
            setProfileData(profileFromStatus);
            return profileFromStatus;
          }
        }
      } else if (primaryRole === "tutor") {
        try {
          const response = await tutorApi.getTutorProfile();
          if (response.success && response.data) {
            // console.log("✅ Tutor profile loaded from API:", response.data);
            setProfileData(response.data);
            return response.data;
          }
        } catch (error) {
          // console.error("❌ Failed to fetch tutor profile:", error);
        }
      } else {
        // console.log("⚠️ No primary role found, using basic user profile");

        // Fallback - create basic profile from user data
        const basicProfile: ProfileData = {
          first_name: currentUser.first_name || "",
          last_name: currentUser.last_name || "",
          email: currentUser.email || "",
          phone: currentUser.phone || "",
          date_of_birth: currentUser.date_of_birth || "",
          avatar_url: currentUser.avatar_url || null,
          country: currentUser.country || "",
          city: currentUser.city || "",
          education: [],
          interests: [],
          learning_goals: [],
          stats: {
            courses_completed: 0,
            sessions_attended: 0,
            learning_hours: 0,
            certificates_earned: 0,
            average_rating: 0,
            reviews_left: 0,
          },
          verification: {
            email_verified: currentUser.is_verified || false,
            phone_verified: currentUser.phone_verified || false,
          },
        };

        setProfileData(basicProfile);
        return basicProfile;
      }

      return null;
    } catch (error) {
      // console.error("❌ Failed to fetch profile data:", error);
      return null;
    }
  };

  const trackActivity = async (path: string): Promise<void> => {
    try {
      await userApi.trackActivity(path);
    } catch (error) {
      // console.error("Failed to track activity:", error);
    }
  };

  const loadUserData = async () => {
    try {
      const data = (await authApi.me()) as any;

      if (data?.user) {
        const currentUser = data.user;
        setUser(currentUser);

        // console.log("📊 AuthContext - User loaded:", currentUser);

        const status = await fetchUserStatus();
        setUserStatus(status);

        // console.log("📊 AuthContext - User status loaded:", status);

        // Pass both user and status explicitly to avoid state update delays
        await fetchProfileData(currentUser, status);
      } else {
        setUser(null);
        setUserStatus(null);
        setProfileData(null);
      }
    } catch (error) {
      // console.error("❌ Failed to load user:", error);
      setUser(null);
      setUserStatus(null);
      setProfileData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();

    const interval = setInterval(
      () => {
        if (user) {
          loadUserData();
        }
      },
      5 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, []);

  const checkUserExists = async (
    email: string,
  ): Promise<{ exists: boolean; user?: User }> => {
    try {
      console.log("Checking if user exists:", email);
      return { exists: false };
    } catch (error) {
      console.error("Error checking user existence:", error);
      return { exists: false };
    }
  };

  const register = async (
    email: string,
    password: string,
    confirmPassword: string,
  ): Promise<AuthResponse> => {
    try {
      const data = (await authApi.register(
        email,
        password,
        confirmPassword,
      )) as any;

      if (data?.user) {
        const currentUser = data.user;
        setUser(currentUser);

        const status = await fetchUserStatus();
        setUserStatus(status);

        await fetchProfileData(currentUser, status);
        return { user: currentUser, status };
      }

      throw new Error(data?.message || "Registration failed");
    } catch (error: any) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const registerWithData = async (
    data: RegistrationData,
  ): Promise<AuthResponse> => {
    try {
      const response = await register(
        data.email,
        data.password,
        data.confirmPassword || "",
      );
      return response;
    } catch (error: any) {
      console.error("Registration with data error:", error);
      throw error;
    }
  };

  const login = async (
    email: string,
    password?: string,
  ): Promise<AuthResponse> => {
    try {
      if (password) {
        return await passwordLogin(email, password);
      } else {
        await authApi.sendOtp(email);
        return {
          user: { id: "", email } as User,
          message: "OTP sent to email",
        };
      }
    } catch (error: any) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const passwordLogin = async (
    email: string,
    password: string,
  ): Promise<AuthResponse> => {
    try {
      const data = (await authApi.passwordLogin(email, password)) as any;

      if (data?.user) {
        const currentUser = data.user;
        setUser(currentUser);

        const status = await fetchUserStatus();
        setUserStatus(status);

        await fetchProfileData(currentUser, status);
        return { user: currentUser, status };
      }

      throw new Error(data?.message || "Login failed");
    } catch (error: any) {
      console.error("Password login error:", error);
      throw error;
    }
  };

  const loginWithData = async (data: LoginData): Promise<AuthResponse> => {
    try {
      return await passwordLogin(data.email, data.password);
    } catch (error: any) {
      console.error("Login with data error:", error);
      throw error;
    }
  };

  const sendOtp = async (
    email: string,
    purpose: "registration" | "reset_password" = "registration",
  ) => {
    try {
      return await authApi.sendOtp(email, purpose);
    } catch (error: any) {
      console.error("Send OTP error:", error);
      throw error;
    }
  };

  const verifyOtp = async (
    email: string,
    otp: string,
    purpose: "registration" | "reset_password" = "registration",
  ): Promise<AuthResponse> => {
    try {
      const data = (await authApi.verifyOtp(email, otp, purpose)) as any;

      if (purpose === "registration") {
        // Check if verification was successful
        if (data?.verified === true || data?.success === true) {
          // Return a success response even if user is not returned
          return {
            verified: true,
            success: true,
            message: data.message || "Email verified successfully",
          } as any; // Type assertion to avoid TypeScript error
        }
      } else if (purpose === "reset_password") {
        if (data?.verified === true || data?.success === true) {
          return {
            success: true,
            message: data.message || "OTP verified",
          } as any;
        }
      }

      throw new Error(data?.message || "OTP verification failed");
    } catch (error: any) {
      console.error("OTP verification error:", error);
      throw error;
    }
  };

  const forgotPassword = async (
    email: string,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const data = (await authApi.forgotPassword(email)) as any;
      return {
        success: true,
        message: data.message || "OTP sent to email",
      };
    } catch (error: any) {
      console.error("Forgot password error:", error);
      throw error;
    }
  };

  const verifyResetOtp = async (
    email: string,
    otp: string,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const data = (await authApi.verifyResetOtp(email, otp)) as any;
      return {
        success: true,
        message: data.message || "OTP verified",
      };
    } catch (error: any) {
      console.error("Verify reset OTP error:", error);
      throw error;
    }
  };

  const resetPassword = async (
    email: string,
    otp: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const data = (await authApi.resetPassword(
        email,
        otp,
        newPassword,
        confirmPassword,
      )) as any;
      return {
        success: true,
        message: data.message || "Password reset successful",
      };
    } catch (error: any) {
      console.error("Reset password error:", error);
      throw error;
    }
  };

  const resetPasswordWithData = async (
    data: ResetPasswordData,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      return await resetPassword(
        data.email,
        data.otp,
        data.newPassword,
        data.confirmPassword,
      );
    } catch (error: any) {
      console.error("Reset password with data error:", error);
      throw error;
    }
  };

  const googleLogin = async (idToken: string): Promise<AuthResponse> => {
    try {
      const data = (await authApi.googleLogin(idToken)) as any;

      if (data?.user) {
        const currentUser = data.user;
        setUser(currentUser);

        const status = await fetchUserStatus();
        setUserStatus(status);

        await fetchProfileData(currentUser, status);
        return { user: currentUser, status };
      }

      throw new Error(data?.message || "Google login failed");
    } catch (error: any) {
      console.error("Google login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setUserStatus(null);
      setProfileData(null);
    }
  };

  const refreshToken = async () => {
    try {
      return await authApi.refresh();
    } catch (error) {
      console.error("Refresh token error:", error);
      throw error;
    }
  };

  const refreshUserData = async () => {
    setLoading(true);
    await loadUserData();
  };

  const refreshProfileData = async (): Promise<ProfileData | null> => {
    return await fetchProfileData(user || undefined, userStatus || undefined);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userStatus,
        profileData,
        loading,
        getUserRoleCount,
        getPrimaryRole,
        register,
        registerWithData,
        login,
        passwordLogin,
        loginWithData,
        sendOtp,
        verifyOtp,
        forgotPassword,
        verifyResetOtp,
        resetPassword,
        resetPasswordWithData,
        googleLogin,
        checkUserExists,
        logout,
        refreshToken,
        refreshUserData,
        refreshProfileData,
        fetchUserStatus,
        trackActivity,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
