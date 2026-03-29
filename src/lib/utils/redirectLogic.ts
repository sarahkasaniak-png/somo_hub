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

  // Step 2: Check for affiliate role
  const hasAffiliateRole = userStatus.hasAffiliateRole === true;
  const isApprovedAffiliate = userStatus.affiliateData?.is_active === true;
  const hasActiveAffiliateRole = hasAffiliateRole && isApprovedAffiliate;

  console.log("Affiliate role check:", { hasAffiliateRole, isApprovedAffiliate, hasActiveAffiliateRole });

  // Step 3: Check for other active roles
  const hasTutorRole = userStatus.hasTutorRole && userStatus.isApprovedTutor;
  const hasCommunityRole = userStatus.hasCommunityRole && userStatus.isApprovedCommunityMember;
  const hasStudentActivity = 
    userStatus.hasActiveEnrollments || 
    (userStatus.activeEnrollments && userStatus.activeEnrollments > 0) || 
    userStatus.hasActiveSessions || 
    (userStatus.upcomingSessionsCount && userStatus.upcomingSessionsCount > 0);

  // Count active roles (excluding affiliate for now)
  const activeRoles = [];
  if (hasTutorRole) activeRoles.push("tutor");
  if (hasCommunityRole) activeRoles.push("community");
  if (hasStudentActivity) activeRoles.push("student");

  console.log("Active non-affiliate roles:", activeRoles);

  // SCENARIO 1: User has ONLY affiliate role (and no other active roles)
  if (hasActiveAffiliateRole && activeRoles.length === 0) {
    console.log("User has only affiliate role, redirecting to affiliate dashboard");
    return "/affiliate/dashboard";
  }

  // SCENARIO 2: User has affiliate role AND other roles - go to dashboard for role selection
  if (hasActiveAffiliateRole && activeRoles.length > 0) {
    console.log("User has affiliate and other roles, going to dashboard for selection");
    return "/dashboard";
  }

  // SCENARIO 3: User has tutor role only (no affiliate)
  if (hasTutorRole && activeRoles.length === 1 && activeRoles[0] === "tutor") {
    console.log("User has only tutor role, redirecting to tutor dashboard");
    return "/tutor/dashboard";
  }

  // SCENARIO 4: User has community role only (no affiliate)
  if (hasCommunityRole && activeRoles.length === 1 && activeRoles[0] === "community") {
    console.log("User has only community role, redirecting to community dashboard");
    return "/community/dashboard";
  }

  // SCENARIO 5: User has student activity only (no other roles)
  if (hasStudentActivity && activeRoles.length === 1 && activeRoles[0] === "student") {
    console.log("User has only student activity, redirecting to student dashboard");
    return "/student/dashboard";
  }

  // SCENARIO 6: User has multiple roles - go to dashboard
  if (activeRoles.length > 1) {
    console.log("User has multiple roles, going to dashboard");
    return "/dashboard";
  }

  // SCENARIO 7: No active roles and no incomplete applications - go to home page
  console.log("No active roles, no incomplete apps - going to home page");
  return "/";
};