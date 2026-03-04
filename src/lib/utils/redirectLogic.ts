// lib/utils/redirectLogic.ts

import { UserStatus } from "../../types/user.types";

export const getPostLoginRedirect = (userStatus: UserStatus | null): string => {
  if (!userStatus) {
    return "/dashboard"; // Fallback
  }

  console.log("User status for redirect:", userStatus);

  // Step 1: Check for incomplete applications (draft, pending, under_review)
  const incompleteApplications = [];

  // Tutor incomplete: draft, pending, under_review
  if (
    userStatus.tutorApplication &&
    (userStatus.tutorApplication.application_status === "draft" ||
      userStatus.tutorApplication.application_status === "pending" ||
      userStatus.tutorApplication.application_status === "under_review")
  ) {
    incompleteApplications.push("tutor");
  }

  // Community incomplete: draft, pending, under_review
  if (
    userStatus.communityApplication &&
    (userStatus.communityApplication.application_status === "draft" ||
      userStatus.communityApplication.application_status === "pending" ||
      userStatus.communityApplication.application_status === "under_review")
  ) {
    incompleteApplications.push("community");
  }

  console.log("Incomplete applications:", incompleteApplications);

  // If there are ANY incomplete applications, go to dashboard
  if (incompleteApplications.length > 0) {
    console.log("User has incomplete applications, going to dashboard");
    return "/dashboard";
  }

  // Check if user has any active/approved roles
  const hasActiveRole = 
    (userStatus.hasTutorRole && userStatus.isApprovedTutor) ||
    (userStatus.hasCommunityRole && userStatus.isApprovedCommunityMember);

  console.log("Has active role:", hasActiveRole);

  // Step 2: No incomplete applications - check approved/active roles
  const activeRoles = [];
  
  // Check if user has tutor role (approved)
  if (userStatus.hasTutorRole && userStatus.isApprovedTutor) {
    activeRoles.push("tutor");
  }
  
  // Check if user has community role (approved)
  if (userStatus.hasCommunityRole && userStatus.isApprovedCommunityMember) {
    activeRoles.push("community");
  }
  
  // Student role only if user has ever registered for course sessions
  const hasStudentActivity = 
    userStatus.hasActiveEnrollments || // Has any active enrollments
    (userStatus.activeEnrollments && userStatus.activeEnrollments > 0) || // Active enrollment count
    userStatus.hasActiveSessions || // Has any active sessions
    (userStatus.upcomingSessionsCount && userStatus.upcomingSessionsCount > 0); // Upcoming sessions count
  
  // Only include student role if they have student activity
  if (hasStudentActivity) {
    activeRoles.push("student");
  }

  console.log("Active roles (approved):", activeRoles);

  // SINGLE active role redirection
  if (activeRoles.length === 1) {
    const role = activeRoles[0];
    console.log(`Single active role: ${role}`);
    
    switch (role) {
      case "tutor":
        return "/tutor/dashboard";
      case "community":
        return "/community/dashboard";
      case "student":
        if (userStatus.hasActiveEnrollments) {
          return "/student/dashboard";
        } else {
          return "/";
        }
      default:
        return "/dashboard";
    }
  }

  // MULTIPLE active roles - go to main dashboard
  if (activeRoles.length > 1) {
    console.log("Multiple roles, going to dashboard");
    return "/dashboard";
  }

  // No active roles and no incomplete applications - go to home page
  console.log("No active roles, no incomplete apps - going to home page");
  return "/";
};