// src/app/onboarding/tutor/components/ApplicationSummary.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import PaystackPayment from "./PaystackPayment";
import {
  getTutorLevelDisplay,
  getEducationLevelDisplay,
  formatApplicationForDisplay,
} from "@/lib/api/tutor";
import paymentApi, { VerifyPaymentResponse } from "@/lib/api/payment";
import { useAuth } from "@/app/context/AuthContext";

// Helper function to safely parse JSON or return the value
const safeParse = (data: any) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error("JSON parse error:", error, "data:", data);
      return [];
    }
  }
  return [];
};

interface ApplicationSummaryProps {
  application: any;
  onSubmit: (paymentReference: string, paymentMethod: string) => Promise<void>;
  onEdit: () => void;
  isLoading: boolean;
}

export default function ApplicationSummary({
  application,
  onSubmit,
  onEdit,
  isLoading,
}: ApplicationSummaryProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentButtonEnabled, setPaymentButtonEnabled] = useState(false);

  // Add ref to prevent duplicate processing
  const hasProcessedPayment = useRef<boolean>(false);

  // Get user email from AuthContext
  const userEmail = user?.email || "";

  // Check if payment button should be enabled
  useEffect(() => {
    const enabled = termsAccepted && !!userEmail && !paymentProcessing;
    console.log("🔘 Payment button enabled:", enabled, {
      termsAccepted,
      userEmail: !!userEmail,
      paymentProcessing,
    });
    setPaymentButtonEnabled(enabled);
  }, [termsAccepted, userEmail, paymentProcessing]);

  // Format application data for display
  const formattedApp = formatApplicationForDisplay(application);

  // Check for payment callback on mount
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const reference = queryParams.get("reference");
    const trxref = queryParams.get("trxref");

    if ((reference || trxref) && !hasProcessedPayment.current) {
      handlePaymentCallback(reference || trxref || "");
    }
  }, []);

  const handlePaymentCallback = async (reference: string) => {
    // Prevent duplicate processing
    if (hasProcessedPayment.current) {
      console.log("⏳ Payment already being processed, skipping...");
      return;
    }

    hasProcessedPayment.current = true;

    try {
      setPaymentProcessing(true);
      toast.loading("Verifying payment...", { id: "payment-verification" });

      // Verify payment with backend
      const verifyResponse = await paymentApi.verifyPayment(reference);

      console.log("📦 Payment verification response:", verifyResponse);

      // ONLY proceed if payment was successful
      if (verifyResponse.success && verifyResponse.data?.status === "success") {
        // Check if application was updated (optional logging)
        if (verifyResponse.data.application) {
          console.log(
            "✅ Application updated:",
            verifyResponse.data.application,
          );
        }

        // Show success message
        toast.success(
          "Payment successful! Your application has been submitted for review.",
          {
            id: "payment-success",
            duration: 5000,
          },
        );

        // Clear any pending payment data
        sessionStorage.removeItem("pending_payment_reference");
        sessionStorage.removeItem("pending_payment_type");
        sessionStorage.removeItem("pending_application_id");

        // Wait a moment for the user to see the success message
        await new Promise((resolve) => setTimeout(resolve, 3000));

        // Redirect to home page
        router.push("/");
        // router.push("/onboarding/tutor/status");

        // Clean up URL
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        );
      } else {
        // Payment failed
        toast.error("Payment verification failed. Please contact support.", {
          id: "payment-verification",
        });
        // Reset the ref so user can try again
        setTimeout(() => {
          hasProcessedPayment.current = false;
        }, 5000);
      }
    } catch (error: any) {
      console.error("❌ Payment verification error:", error);
      toast.error(error.message || "Failed to verify payment", {
        id: "payment-verification",
      });
      // Reset the ref so user can try again
      setTimeout(() => {
        hasProcessedPayment.current = false;
      }, 5000);
    } finally {
      setPaymentProcessing(false);
    }
  };

  const handlePaymentSuccess = async (reference: string) => {
    console.log("Payment successful with reference:", reference);
  };

  const handlePaymentError = (error: string) => {
    toast.error(error);
    setPaymentProcessing(false);
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not provided";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Handle checkbox change
  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    console.log("📝 Terms checkbox changed:", checked);
    setTermsAccepted(checked);
    if (!checked) {
      toast.error("You must accept the Terms of Service to proceed", {
        id: "terms-warning",
        duration: 3000,
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header with back button */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          disabled={paymentProcessing}
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Edit
        </button>
        <div className="w-20"></div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-gray-900">
          Review Your Application
        </h2>
        <p className="text-gray-600 mt-2">
          Please review all information before submitting your application
        </p>
      </div>

      <div className="space-y-6">
        {/* Tutor Level & Category */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Tutor Level & Category
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Tutor Level</p>
                <p className="font-medium text-gray-900">
                  {getTutorLevelDisplay(application.tutor_level)}
                </p>
              </div>
              {application.tsc_number && (
                <div>
                  <p className="text-sm text-gray-500">
                    Teacher Service Number
                  </p>
                  <p className="font-medium text-gray-900">
                    {application.tsc_number}
                  </p>
                </div>
              )}
            </div>

            {/* Portfolio Display - Conditional */}
            {application.tutor_level === "skilled_professional" &&
              application.portfolio_url && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Portfolio</h4>
                  <a
                    href={application.portfolio_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                  >
                    <span>View Portfolio</span>
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
              )}

            {application.portfolio_url &&
              application.tutor_level !== "skilled_professional" && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Additional Links
                  </h4>
                  <a
                    href={application.portfolio_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-800 inline-flex items-center"
                  >
                    <span>View Portfolio/Work Samples</span>
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
              )}
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-medium text-gray-900">
                {application.official_first_name}{" "}
                {application.official_last_name}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date of Birth</p>
              <p className="font-medium text-gray-900">
                {formatDate(application.date_of_birth)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">National ID Number</p>
              <p className="font-medium text-gray-900">
                {application.national_id_number}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">ID Verification</p>
              <p className="font-medium text-green-600">
                Front & Back Photos Uploaded
              </p>
            </div>
          </div>
        </div>

        {/* Education Background */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Education Background
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Highest Education</p>
                <p className="font-medium text-gray-900">
                  {getEducationLevelDisplay(
                    application.highest_education_level,
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">University/Institution</p>
                <p className="font-medium text-gray-900">
                  {application.university_name}
                </p>
              </div>
            </div>
            {application.admission_number && (
              <div>
                <p className="text-sm text-gray-500">Admission Number</p>
                <p className="font-medium text-gray-900">
                  {application.admission_number}
                </p>
              </div>
            )}

            {application.admission_letter_url && (
              <div className="mt-3">
                <a
                  href={application.admission_letter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-purple-600 hover:text-purple-800 font-medium inline-flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  {application.tutor_level === "college_student"
                    ? "View Admission Letter"
                    : "View Graduation Certificate"}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Teaching Experience */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Teaching Experience
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Teaching Experience</p>
                <p className="font-medium text-gray-900">
                  {application.has_teaching_experience ? "Yes" : "No"}
                </p>
              </div>

              {application.has_teaching_experience &&
                application.teaching_experience_years && (
                  <div>
                    <p className="text-sm text-gray-500">Years of Experience</p>
                    <p className="font-medium text-gray-900">
                      {application.teaching_experience_years} year(s)
                    </p>
                  </div>
                )}
            </div>

            {application.professional_experience && (
              <div>
                <p className="text-sm text-gray-500 mb-2">
                  Professional Experience Summary
                </p>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                  {application.professional_experience}
                </p>
              </div>
            )}

            {application.previous_institutions &&
              safeParse(application.previous_institutions).length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">
                    Previous Institutions
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {safeParse(application.previous_institutions).map(
                      (institution: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {institution}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              )}

            {application.certificates &&
              safeParse(application.certificates).length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Certificates</p>
                  <div className="space-y-2">
                    {safeParse(application.certificates).map(
                      (cert: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <span className="font-medium text-gray-700">
                            {cert.name || `Certificate ${index + 1}`}
                          </span>
                          {cert.url && (
                            <a
                              href={cert.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-purple-600 hover:text-purple-800"
                            >
                              View
                            </a>
                          )}
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="flex items-start">
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={handleTermsChange}
              className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mt-0.5"
              disabled={paymentProcessing}
            />
            <label htmlFor="terms" className="ml-3 text-sm text-gray-700">
              I agree to the{" "}
              <a
                href="/terms/tutor"
                className="text-purple-600 hover:text-purple-800 font-medium underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms of Service
              </a>{" "}
              and confirm that all information provided is accurate. I
              understand that false information may lead to application
              rejection or account termination.
            </label>
          </div>
          {!termsAccepted && (
            <p className="text-sm text-red-600 mt-2 ml-8">
              You must accept the Terms of Service to proceed with payment
            </p>
          )}
        </div>

        {/* Application Fee */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-4">
            Application Fee
          </h3>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-yellow-700">
                An application fee of{" "}
                <span className="font-bold">KES 500t</span> is required
              </p>
              <p className="text-sm text-yellow-600 mt-1">
                This fee covers the cost of processing and verification
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-yellow-800">KES 500</p>
            </div>
          </div>

          {/* Payment Method - Paystack Only */}
          <div className="mt-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              Payment Details
            </h4>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-5 h-5 rounded-full border-2 border-purple-600 bg-purple-600 mr-3 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                </div>
                <div>
                  <p className="font-medium">Paystack</p>
                  <p className="text-sm text-gray-500">
                    Pay with Card, M-Pesa, or Bank Transfer
                  </p>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-2 mb-4">
                You'll be redirected to Paystack's secure payment page where you
                can pay with:
              </p>
              <ul className="text-xs text-gray-600 list-disc list-inside mb-4">
                <li>Credit/Debit Cards (Visa, Mastercard, Verve)</li>
                <li>M-Pesa (STK Push on your phone)</li>
                <li>Bank Transfer</li>
              </ul>

              {/* Email display */}
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">
                    Payment receipt will be sent to:
                  </span>{" "}
                  {userEmail || "No email available"}
                </p>
              </div>

              <PaystackPayment
                amount={500}
                email={userEmail}
                applicationId={application.id}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
                disabled={!paymentButtonEnabled}
              />

              {!termsAccepted && (
                <p className="text-xs text-red-600 mt-2 text-center">
                  Please accept the Terms of Service to enable payment
                </p>
              )}

              {!userEmail && (
                <p className="text-xs text-red-600 mt-2 text-center">
                  Email address is required for payment
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Helper Text */}
      <div className="space-y-3 pt-4">
        <p className="text-xs text-gray-500 text-center">
          By proceeding with payment, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}
