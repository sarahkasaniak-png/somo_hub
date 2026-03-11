"use client";

import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getPostLoginRedirect } from "@/lib/utils/redirectLogic";
import Navbar from "@/components/Header_2";

export default function DashboardPage() {
  const { user, userStatus, loading } = useAuth();
  const router = useRouter();
  const [hasRedirected, setHasRedirected] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (loading || !user || !userStatus || hasRedirected) return;

    // Get redirect path based on user status
    const redirectPath = getPostLoginRedirect(userStatus);

    // Only redirect if we're not already on the correct page
    const currentPath = window.location.pathname;

    if (redirectPath !== currentPath) {
      setHasRedirected(true);
      router.push(redirectPath);
    }
  }, [user, userStatus, loading, router, hasRedirected]);
  //   useEffect(() => {
  //     if (loading || !user || !userStatus || hasRedirected) return;

  //     // Determine active roles
  //     const hasTutorRole = userStatus.hasTutorRole;
  //     const hasCommunityRole = userStatus.hasCommunityRole;
  //     const hasStudentRole = userStatus.hasStudentRole !== false;

  //     // COUNT incomplete applications
  //     const incompleteApplications = [];

  //     if (
  //       userStatus.tutorApplication &&
  //       (userStatus.tutorApplication.application_status === "draft" ||
  //         !userStatus.isApprovedTutor)
  //     ) {
  //       incompleteApplications.push("tutor");
  //     }

  //     if (
  //       userStatus.communityApplication &&
  //       (userStatus.communityApplication.application_status === "draft" ||
  //         !userStatus.isApprovedCommunityMember)
  //     ) {
  //       incompleteApplications.push("community");
  //     }

  //     // SCENARIO 1: Single incomplete application - auto-redirect
  //     if (incompleteApplications.length === 1) {
  //       const appType = incompleteApplications[0];
  //       setHasRedirected(true);

  //       if (appType === "tutor") {
  //         const tutorApp = userStatus.tutorApplication;
  //         if (tutorApp?.application_status === "draft") {
  //           router.push(`/onboarding/tutor?step=${tutorApp.current_step}`);
  //         } else {
  //           router.push("/onboarding/tutor");
  //         }
  //       } else {
  //         const communityApp = userStatus.communityApplication;
  //         if (communityApp?.application_status === "draft") {
  //           router.push(
  //             `/onboarding/community?step=${communityApp.current_step}`,
  //           );
  //         } else {
  //           router.push("/onboarding/community");
  //         }
  //       }
  //       return;
  //     }
  //   }, [user, userStatus, loading, router, hasRedirected]);

  // Close dropdowns when clicking outside

  useEffect(() => {
    if (loading || !user || !userStatus || hasRedirected) return;

    // Get redirect path based on user status
    const redirectPath = getPostLoginRedirect(userStatus);

    // Only redirect if we're not already on the correct page
    const currentPath = window.location.pathname;

    if (redirectPath !== currentPath) {
      setHasRedirected(true);
      router.push(redirectPath);
    }
  }, [user, userStatus, loading, router, hasRedirected]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showProfileDropdown) {
        const target = event.target as HTMLElement;
        if (
          !target.closest(".dropdown-menu") &&
          !target.closest(".dropdown-trigger")
        ) {
          setShowProfileDropdown(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showProfileDropdown]);

  // Loading state
  if (loading) {
    return <LoadingSpinner />;
  }

  // No user - should be redirected by parent component or middleware
  if (!user) {
    return null;
  }

  if (!userStatus) {
    return <LoadingSpinner />;
  }

  // Check incomplete applications
  const hasTutorApp =
    userStatus.tutorApplication &&
    (userStatus.tutorApplication.application_status === "draft" ||
      !userStatus.isApprovedTutor);
  const hasCommunityApp =
    userStatus.communityApplication &&
    (userStatus.communityApplication.application_status === "draft" ||
      !userStatus.isApprovedCommunityMember);

  const incompleteApps = [];
  if (hasTutorApp) incompleteApps.push("tutor");
  if (hasCommunityApp) incompleteApps.push("community");

  const hasTutorRole = userStatus.hasTutorRole;
  const hasCommunityRole = userStatus.hasCommunityRole;
  const hasStudentRole = userStatus.hasStudentRole !== false;

  // Get current role from pathname
  const getCurrentRole = () => {
    return "User"; // Default for dashboard
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <Navbar />
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-left md:text-center mb-12">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900 ">
            Welcome back,{" "}
            <span className="text-gray-700 text-sm md:text-md">
              {user.first_name || user.email}
            </span>
          </h1>
          <p className="text-gray-600 mt-3 max-w-2xl md:mx-auto">
            Choose how you want to use SomoHub today. You can switch between
            roles anytime.
          </p>
        </div>

        {/* Incomplete Applications Section */}
        {incompleteApps.length > 0 && (
          <div className="mb-12">
            <div className="flex flex-col justify-start items-start gap-1 md:flex-row md:items-center md:justify-between mb-6 ">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Complete Your Setup
                </h2>
                <p className="text-gray-500 mt-1 ">
                  Finish these applications to unlock full platform access
                </p>
              </div>
              <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-semibold">
                {incompleteApps.length} pending
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hasTutorApp && (
                <ApplicationCard
                  type="tutor"
                  title="Tutor Application"
                  description="Complete your tutor profile to start offering tutoring services"
                  application={userStatus.tutorApplication}
                  isApproved={userStatus.isApprovedTutor}
                  color="from-emerald-500 to-green-500"
                  icon={
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  }
                />
              )}

              {hasCommunityApp && (
                <ApplicationCard
                  type="community"
                  title="Community Application"
                  description="Complete your community profile to create and manage courses"
                  application={userStatus.communityApplication}
                  isApproved={userStatus.isApprovedCommunityMember}
                  color="from-purple-500 to-violet-500"
                  icon={
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  }
                />
              )}
            </div>
          </div>
        )}

        {/* Main Role Cards Section */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Your Active Roles
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Student Role Card - Always shown if student role exists */}
            {hasStudentRole && (
              <RoleCard
                title="Student"
                icon={
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M12 14l9-5-9-5-9 5 9 5z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M12 14l9-5-9-5-9 5 9 5z"
                      opacity="0.5"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M12 14v6l9-5M12 20l-9-5"
                    />
                  </svg>
                }
                description={
                  userStatus.hasActiveEnrollments
                    ? "Continue learning with your enrolled courses"
                    : "Discover and join new learning sessions"
                }
                href={
                  userStatus.hasActiveEnrollments
                    ? "/student/dashboard"
                    : "/student/browse-tutors"
                }
                status={
                  userStatus.hasActiveEnrollments
                    ? {
                        text: "Active",
                        color: "bg-emerald-100 text-emerald-800",
                      }
                    : {
                        text: "Browse",
                        color: "bg-blue-100 text-blue-800",
                      }
                }
                color="from-blue-500 to-cyan-500"
              />
            )}

            {/* Tutor Role Card (only if no incomplete tutor app) */}
            {hasTutorRole && !hasTutorApp && (
              <RoleCard
                title="Tutor"
                icon={
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                }
                description="Manage your tutoring sessions and students"
                href="/tutor/dashboard"
                status={{
                  text: "Active",
                  color: "bg-emerald-100 text-emerald-800",
                }}
                color="from-emerald-500 to-green-500"
              />
            )}

            {/* Community Role Card (only if no incomplete community app) */}
            {hasCommunityRole && !hasCommunityApp && (
              <RoleCard
                title="Community"
                icon={
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                }
                description="Manage your community courses and members"
                href="/community/dashboard"
                status={{
                  text: "Active",
                  color: "bg-emerald-100 text-emerald-800",
                }}
                color="from-purple-500 to-violet-500"
              />
            )}
          </div>
        </div>

        {/* Quick Stats Section */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Quick Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Active Sessions"
              value={
                userStatus.hasActiveEnrollments
                  ? `${userStatus.activeEnrollments || 0}`
                  : "0"
              }
              description="Currently enrolled courses"
              icon="📚"
              color="bg-blue-50 text-blue-600"
            />
            <StatCard
              title="Application Status"
              value={
                incompleteApps.length > 0
                  ? `${incompleteApps.length} Pending`
                  : "All Complete"
              }
              description="Applications to review"
              icon="📋"
              color={
                incompleteApps.length > 0
                  ? "bg-amber-50 text-amber-600"
                  : "bg-emerald-50 text-emerald-600"
              }
            />
            <StatCard
              title="Account Type"
              value={(() => {
                const roles = [];
                if (hasTutorRole && !hasTutorApp) roles.push("Tutor");
                if (hasCommunityRole && !hasCommunityApp)
                  roles.push("Community");
                if (hasStudentRole) roles.push("Student");
                return roles.length > 1 ? "Multi-role" : roles[0] || "Student";
              })()}
              description="Your active roles"
              icon="👤"
              color="bg-purple-50 text-purple-600"
            />
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-500 text-sm">
            Need help?{" "}
            <Link
              href="/help"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Visit our help center
            </Link>{" "}
            or{" "}
            <Link
              href="/support"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              contact support
            </Link>
          </p>
          <p className="text-gray-400 text-xs mt-2">
            You can switch between roles anytime from the profile menu
          </p>
        </div>
      </div>

      {/* Add mobile-friendly styles */}
      <style jsx global>{`
        /* Mobile fullscreen dropdown styles */
        .mobile-fullscreen {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          max-width: 100vw !important;
          max-height: 100vh !important;
          border-radius: 0 !important;
          margin: 0 !important;
          z-index: 50 !important;
          overflow-y: auto !important;
          animation: slide-up 0.3s ease-out !important;
        }

        /* Desktop dropdown styles */
        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          min-width: 280px;
          max-width: 400px;
          max-height: 80vh;
          overflow-y: auto;
          z-index: 50;
          margin-top: 8px;
          animation: fade-in 0.2s ease-out;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Better touch targets for mobile */
        @media (max-width: 768px) {
          .dropdown-trigger {
            padding: 10px;
            min-height: 44px; /* Minimum touch target size */
          }

          .dropdown-menu .items {
            padding: 16px;
            border-bottom: 1px solid #f3f4f6;
          }

          .dropdown-menu .items:last-child {
            border-bottom: none;
          }

          .dropdown-menu .items:hover {
            background-color: #f9fafb;
          }
        }

        /* Custom scrollbar for dropdowns */
        .dropdown-menu::-webkit-scrollbar {
          width: 6px;
        }

        .dropdown-menu::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .dropdown-menu::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }

        .dropdown-menu::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
      `}</style>
    </div>
  );
}

// Application Card Component
function ApplicationCard({
  type,
  title,
  description,
  application,
  isApproved,
  color,
  icon,
}: any) {
  const router = useRouter();

  const getStatusText = () => {
    if (application?.application_status === "draft") return "Draft";
    if (application?.application_status === "pending") return "Pending Review";
    if (application?.application_status === "under_review")
      return "Under Review";
    if (application?.application_status === "rejected") return "Rejected";
    if (isApproved) return "Approved";
    return "Setup Required";
  };

  const getStatusColor = () => {
    if (application?.application_status === "draft")
      return "bg-amber-100 text-amber-800";
    if (
      application?.application_status === "pending" ||
      application?.application_status === "under_review"
    )
      return "bg-blue-100 text-blue-800";
    if (application?.application_status === "rejected")
      return "bg-red-100 text-red-800";
    if (isApproved) return "bg-emerald-100 text-emerald-800";
    return "bg-gray-100 text-gray-800";
  };

  const handleContinue = () => {
    if (application?.application_status === "draft") {
      router.push(`/onboarding/${type}?step=${application.current_step}`);
    } else {
      router.push(`/onboarding/${type}`);
    }
  };

  const handleDelete = async () => {
    if (
      confirm(
        "Are you sure you want to delete this application? This action cannot be undone.",
      )
    ) {
      // TODO: Implement API call to delete application
      console.log(`Delete ${type} application`);
      // Show loading state
      const button = document.activeElement as HTMLButtonElement;
      if (button) {
        button.disabled = true;
        button.innerHTML = "Deleting...";
      }

      // Simulate API call
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mr-4`}
            >
              <div className="text-white">{icon}</div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{title}</h3>
              <span
                className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}
              >
                {getStatusText()}
              </span>
            </div>
          </div>
        </div>

        <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>

        {application?.application_status === "draft" && (
          <div className="mb-6 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center text-sm text-gray-500">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Last saved at step {application.current_step}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleContinue}
            className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center"
          >
            <span>
              {application?.application_status === "draft"
                ? "Continue Application"
                : "Start Application"}
            </span>
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>

          {application?.application_status === "draft" && (
            <button
              onClick={handleDelete}
              className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Role Card Component
function RoleCard({ title, icon, description, href, status, color }: any) {
  return (
    <Link
      href={href}
      className="group block bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-200 hover:border-gray-300"
    >
      <div className="p-8">
        {/* Icon with gradient background */}
        <div
          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300`}
        >
          <div className="text-white">{icon}</div>
        </div>

        {/* Title and Status */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          {status && (
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}
            >
              {status.text}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>

        {/* Action Button */}
        <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-800 transition-colors">
          <span>Go to Dashboard</span>
          <svg
            className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}

// Stat Card Component
function StatCard({ title, value, description, icon, color }: any) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            {title}
          </p>
          <p className="text-2xl font-semibold text-gray-900 mt-2">{value}</p>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
        <div className={`text-2xl ${color}`}>{icon}</div>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="mt-6 text-gray-600 font-medium">
        Loading your dashboard...
      </p>
      <p className="text-sm text-gray-500 mt-2">
        Checking your roles and applications
      </p>
    </div>
  );
}
