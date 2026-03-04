// src/app/onboarding/community/components/ApplicationSummary.tsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import PaystackPayment from "./PaystackPayment";
import MpesaPayment from "./MpesaPayment";

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
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<
    "paystack" | "mpesa" | null
  >(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");

  const handlePaymentSuccess = async (reference: string) => {
    try {
      setPaymentProcessing(true);
      await onSubmit(reference, paymentMethod!);
    } catch (error) {
      toast.error("Failed to submit application after payment");
    } finally {
      setPaymentProcessing(false);
    }
  };

  const handlePaymentError = (error: string) => {
    toast.error(error);
    setPaymentProcessing(false);
  };

  const getCategoryName = (categoryId: number) => {
    const categories = {
      1: "Primary School",
      2: "High School",
      3: "College/University",
      4: "NGO/Non-Profit",
      5: "Private Tutor Group",
      6: "Study Group",
      7: "Professional Association",
      8: "Other",
    };
    return categories[categoryId as keyof typeof categories] || "Unknown";
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
          Review Your Community Application
        </h2>
        <p className="text-gray-600 mt-2">
          Please review all information before submitting your application
        </p>
      </div>

      <div className="space-y-6">
        {/* Community Type */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Community Type
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium text-gray-900">
                  {getCategoryName(application.category_id)}
                </p>
              </div>
              {application.custom_category && (
                <div>
                  <p className="text-sm text-gray-500">Custom Type</p>
                  <p className="font-medium text-gray-900">
                    {application.custom_category}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Basic Information
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Community Name</p>
              <p className="font-medium text-gray-900 text-lg">
                {application.name}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Description</p>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                {application.description}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Community URL</p>
              <p className="font-medium text-gray-900">
                somo.community/{application.slug}
              </p>
            </div>
          </div>
        </div>

        {/* Verification Documents */}
        {(application.logo_url ||
          application.banner_url ||
          (application.verification_documents &&
            application.verification_documents.length > 0)) && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Verification & Branding
            </h3>
            <div className="space-y-4">
              {application.logo_url && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Community Logo</p>
                  <a
                    href={application.logo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-800 inline-flex items-center"
                  >
                    <span>View Logo</span>
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

              {application.banner_url && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Community Banner</p>
                  <a
                    href={application.banner_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-800 inline-flex items-center"
                  >
                    <span>View Banner</span>
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

              {application.verification_documents &&
                application.verification_documents.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">
                      Verification Documents
                    </p>
                    <div className="space-y-2">
                      {application.verification_documents.map(
                        (doc: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded"
                          >
                            <span className="font-medium text-gray-700">
                              {doc.name || `Document ${index + 1}`}
                            </span>
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-purple-600 hover:text-purple-800"
                            >
                              View
                            </a>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}

        {/* Community Settings */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Community Settings
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Privacy</p>
              <p className="font-medium text-gray-900">
                {application.is_public !== false
                  ? "Public Community"
                  : "Private Community"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Terms Accepted</p>
              <p className="font-medium text-green-600">
                ✓ Community Terms of Service
              </p>
            </div>
          </div>
        </div>

        {/* Application Fee */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-4">
            Registration Fee
          </h3>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-yellow-700">
                A one-time registration fee of{" "}
                <span className="font-bold">$45</span> is required
              </p>
              <p className="text-sm text-yellow-600 mt-1">
                This fee covers community setup, verification, and lifetime
                access
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-yellow-800">$45.00</p>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="mt-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              Select Payment Method
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <button
                type="button"
                onClick={() => setPaymentMethod("paystack")}
                className={`p-4 border-2 rounded-lg transition-colors ${
                  paymentMethod === "paystack"
                    ? "border-purple-600 bg-purple-50"
                    : "border-gray-300 hover:border-purple-400"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                      paymentMethod === "paystack"
                        ? "border-purple-600 bg-purple-600"
                        : "border-gray-400"
                    }`}
                  >
                    {paymentMethod === "paystack" && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Paystack</p>
                    <p className="text-sm text-gray-500">
                      Credit/Debit Card, Mobile Money
                    </p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("mpesa")}
                className={`p-4 border-2 rounded-lg transition-colors ${
                  paymentMethod === "mpesa"
                    ? "border-purple-600 bg-purple-50"
                    : "border-gray-300 hover:border-purple-400"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                      paymentMethod === "mpesa"
                        ? "border-purple-600 bg-purple-600"
                        : "border-gray-400"
                    }`}
                  >
                    {paymentMethod === "mpesa" && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <div className="text-left">
                    <p className="font-medium">M-Pesa</p>
                    <p className="text-sm text-gray-500">Kenyan Mobile Money</p>
                  </div>
                </div>
              </button>
            </div>

            {/* Payment Method Details */}
            {paymentMethod === "paystack" && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address for Payment Receipt *
                </label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="you@example.com"
                  disabled={paymentProcessing}
                />
                <div className="mt-4">
                  <PaystackPayment
                    amount={45}
                    email={userEmail}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentError={handlePaymentError}
                  />
                </div>
              </div>
            )}

            {paymentMethod === "mpesa" && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <MpesaPayment
                  amount={45}
                  phoneNumber={userPhone}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                />
              </div>
            )}
          </div>
        </div>

        {/* Terms Confirmation */}
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-start">
            <input
              type="checkbox"
              id="terms-confirm"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mt-1"
              disabled={paymentProcessing}
            />
            <label
              htmlFor="terms-confirm"
              className="ml-3 text-sm text-gray-700"
            >
              I confirm that all information provided is accurate and I agree to
              pay the $45 registration fee. I understand that this fee is
              non-refundable after community approval.
            </label>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col md:flex-row justify-between gap-4 pt-6">
        <button
          type="button"
          onClick={onEdit}
          disabled={paymentProcessing}
          className="px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Edit Application
        </button>

        <div className="space-y-3">
          <p className="text-xs text-gray-500 text-center md:text-right">
            {paymentMethod === "paystack" &&
              "You'll be redirected to Paystack's secure payment page"}
            {paymentMethod === "mpesa" &&
              "You'll receive an M-Pesa prompt on your phone"}
            {!paymentMethod && "Select a payment method above"}
          </p>
        </div>
      </div>
    </div>
  );
}
