// // src/app/onboarding/tutor/status/page.tsx (Server Component)
// import { Suspense } from "react";
// import StatusContent from "./StatusContent";

// export default function StatusPage() {

//   return (
//     <Suspense
//       fallback={
//         <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
//         </div>
//       }
//     >
//       <StatusContent />
//     </Suspense>
//   );
// }
// src/app/onboarding/tutor/status/page.tsx
// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";

// export default function StatusRedirectPage() {
//   const router = useRouter();

//   useEffect(() => {
//     // Immediately redirect to home page
//     router.push("/");
//   }, [router]);

//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
//     </div>
//   );
// }

// src/app/onboarding/tutor/status/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getApplicationStatus } from "@/lib/api/tutor";
import Link from "next/link";
import React from "react";

type ApplicationStatus =
  | "draft"
  | "pending"
  | "under_review"
  | "approved"
  | "rejected";

interface StatusConfig {
  title: string;
  message: string;
  icon: React.ReactNode;
  color: string;
  buttonText?: string;
  buttonLink?: string;
}

export default function ApplicationStatusPage() {
  const router = useRouter();
  const [status, setStatus] = useState<ApplicationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadStatus = async () => {
      try {
        const data = await getApplicationStatus();

        if (!isMounted) return;

        if (!data.hasApplication || !data.application) {
          router.push("/onboarding/tutor");
          return;
        }

        setStatus(data.application.application_status as ApplicationStatus);
      } catch (err) {
        if (!isMounted) return;
        setError("Failed to load application status");
        console.error(err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadStatus();

    return () => {
      isMounted = false;
    };
  }, [router]);

  const getStatusConfig = (): StatusConfig => {
    switch (status) {
      case "approved":
        return {
          title: "Application Approved! 🎉",
          message:
            "Congratulations! Your application has been approved. You can now access your tutor dashboard.",
          icon: (
            <svg
              className="w-16 h-16 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
          color: "bg-green-100 text-green-800 border-green-200",
          buttonText: "Go to Dashboard",
          buttonLink: "/tutor/dashboard",
        };
      case "rejected":
        return {
          title: "Application Not Approved",
          message:
            "We were unable to approve your application at this time. You can submit a new application after 30 days.",
          icon: (
            <svg
              className="w-16 h-16 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
          color: "bg-red-100 text-red-800 border-red-200",
          buttonText: "Start New Application",
          buttonLink: "/onboarding/tutor",
        };
      case "pending":
        return {
          title: "Application Pending Review",
          message:
            "Your application has been submitted and is waiting to be reviewed. This usually takes 2-3 business days.",
          icon: (
            <svg
              className="w-16 h-16 text-yellow-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        };
      case "under_review":
        return {
          title: "Application Under Review",
          message:
            "Your application is currently being reviewed by our team. We'll notify you once a decision is made.",
          icon: (
            <svg
              className="w-16 h-16 text-yellow-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        };
      default:
        return {
          title: "Application Status",
          message: "Your application is being processed.",
          icon: (
            <svg
              className="w-16 h-16 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
          color: "bg-blue-100 text-blue-800 border-blue-200",
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading status...</p>
        </div>
      </div>
    );
  }

  if (error || !status) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <svg
            className="w-16 h-16 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Oops!</h2>
          <p className="text-gray-600 mb-6">
            {error || "Unable to load application status"}
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const config = getStatusConfig();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Back button */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6"
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
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Home
        </button>

        {/* Status Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className={`p-8 text-center border-b ${config.color}`}>
            <div className="flex justify-center mb-4">{config.icon}</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {config.title}
            </h1>
          </div>

          <div className="p-8">
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <p className="text-gray-700 text-center text-lg">
                {config.message}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {config.buttonText && config.buttonLink && (
                <Link
                  href={config.buttonLink}
                  className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors text-center"
                >
                  {config.buttonText}
                </Link>
              )}

              <Link
                href="/"
                className="px-8 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-center"
              >
                Return Home
              </Link>
            </div>

            <p className="text-xs text-gray-500 text-center mt-6">
              Need help?{" "}
              <Link href="/contact" className="text-purple-600 hover:underline">
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
