// src/app/onboarding/community/components/CommunityOnboarding.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProgressBar from "./ProgressBar";
import Step1Category from "./steps/Step1Category";
import Step2BasicInfo from "./steps/Step2BasicInfo";
import Step3Verification from "./steps/Step3Verification";
import Step4Settings from "./steps/Step4Settings";
import ApplicationSummary from "./ApplicationSummary";
import {
  loadCommunityApplication,
  saveCommunityStep,
  submitCommunityApplication,
} from "@/lib/api/community";
import { toast } from "react-hot-toast";

export default function CommunityOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [application, setApplication] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSummary, setShowSummary] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const router = useRouter();

  const steps = [
    { number: 1, title: "Community Type" },
    { number: 2, title: "Basic Information" },
    { number: 3, title: "Verification" },
    { number: 4, title: "Settings" },
  ];

  useEffect(() => {
    checkExistingApplication();
  }, []);

  useEffect(() => {
    console.log("Form data loaded to application:", application);
  }, [formData]);

  const checkExistingApplication = async () => {
    try {
      setIsLoading(true);
      const data = await loadCommunityApplication();

      console.log("Loaded community application data:", data);
      if (data.data.hasApplication && data.data.application) {
        setApplication(data.data.application);
        setCurrentStep(data.data.application.current_step || 1);
        setFormData(data.data.application);

        if (data.data.application.application_status === "pending") {
          toast.success("Your community application is pending review");
          router.push("/dashboard/communities");
          return;
        }

        if (data.data.application.application_status === "approved") {
          toast.success("Your community is already approved!");
          router.push(`/community/${data.data.application.slug}`);
          return;
        }
      } else {
        setCurrentStep(0);
      }
    } catch (error) {
      console.error("Failed to load community application:", error);
      toast.error("Failed to load application data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async (stepData: any) => {
    try {
      setIsLoading(true);

      // Merge new data with existing formData
      const mergedData = { ...formData, ...stepData };
      setFormData(mergedData); // Update formData immediately

      const response = await saveCommunityStep(currentStep, stepData);

      if (response.success && response.data) {
        setApplication(response.data);
      }

      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      } else {
        setShowSummary(true);
      }

      toast.success("Progress saved");
    } catch (error: any) {
      toast.error(error.message || "Failed to save step");
      console.error("Save step error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStartApplication = () => {
    setCurrentStep(1);
  };

  const handleSubmitApplication = async (
    paymentReference: string,
    paymentMethod: string,
  ) => {
    try {
      setIsLoading(true);
      const response = await submitCommunityApplication(
        paymentReference,
        paymentMethod,
      );

      if (!response.success) {
        throw new Error(response.message || "Failed to submit application");
      }

      toast.success("Community application submitted successfully!");
      router.push("/onboarding/community/status");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit application");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleExit = (withSave = false) => {
    if (withSave && application) {
      toast.success("Your progress has been saved. You can continue later.");
    }
    router.push("/");
  };

  const handleExitClick = () => {
    if (application && Object.keys(application).length > 0) {
      setShowExitDialog(true);
    } else {
      handleExit();
    }
  };

  const handleFormSubmit = (data: any) => {
    const mergedData = { ...formData, ...data };
    setFormData(mergedData);
    handleNext(data);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main"></div>
      </div>
    );
  }

  // if (showSummary && application) {
  //   return (
  //     <div className="fixed inset-0 bg-white overflow-y-auto">
  //       <div className="max-w-4xl mx-auto px-4 py-8">
  //         <ApplicationSummary
  //           application={application}
  //           onSubmit={handleSubmitApplication}
  //           onEdit={() => setShowSummary(false)}
  //           isLoading={isLoading}
  //         />
  //       </div>
  //     </div>
  //   );
  // }
  if (showSummary) {
    // Create a complete application object by merging application and formData
    const completeApplication = {
      ...application,
      ...formData,
      // Ensure we have the latest from both sources
      verification_documents:
        formData.verification_documents || application?.verification_documents,
      logo_url: formData.logo_url || application?.logo_url,
      banner_url: formData.banner_url || application?.banner_url,
    };

    console.log("Complete application for summary:", completeApplication);

    return (
      <div className="fixed inset-0 bg-white overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <ApplicationSummary
            application={completeApplication}
            onSubmit={handleSubmitApplication}
            onEdit={() => setShowSummary(false)}
            isLoading={isLoading}
          />
        </div>
      </div>
    );
  }

  // Intro Page (Step 0)
  if (currentStep === 0) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col">
        {/* Header */}
        <header className="border-b border-gray-200">
          <div className="w-full mx-auto px-4 py-4 md:px-14 md:py-8 md:pb-3 flex justify-between items-center">
            <a href="/" className="flex items-center space-x-0">
              <div className="w-8 h-8">
                <img
                  src="/images/logo_purple.png"
                  alt="SomoHub Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl md:text-2xl font-bold text-main">
                SomoHub
              </span>
            </a>
            <button
              onClick={handleExitClick}
              className="px-4 py-[6px] text-gray-700 hover:bg-gray-100 rounded-3xl font-medium transition-colors border border-gray-300 font-semibold cursor-pointer"
            >
              Exit
            </button>
          </div>
        </header>

        {/* Community Onboarding Indicator */}
        <div className="pt-3">
          <div className="w-full px-4 md:px-14">
            <div className="flex items-center justify-start space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-users text-main"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span className="text-sm font-medium text-gray-700">
                Community Onboarding Application
              </span>
            </div>
          </div>
        </div>

        {/* Main Content - Intro */}
        <main className="flex-1 overflow-y-auto pb-24">
          <div className="max-w-7xl mx-auto px-1 pt-1 pb-8 md:pt-2 md:pb-8">
            <div className="bg-white p-6 md:p-8">
              <div className="flex flex-col lg:flex-row gap-2 md:gap-8">
                {/* Left Column */}
                <div className="lg:w-1/2 flex items-center">
                  <div className="text-left w-full">
                    <h1 className="max-w-[18ch] text-3xl md:text-5xl font-semibold text-gray-900 mb-6 leading-tight">
                      Create your learning Community
                    </h1>
                  </div>
                </div>

                {/* Right Column - Step Cards */}
                <div className="lg:w-1/2">
                  <div className="space-y-4">
                    {/* Step 1 */}
                    <div className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-shrink-0 w-10 h-10 bg-main text-white rounded-full flex items-center justify-center font-bold">
                        1
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          Community Type
                        </h3>
                        <p className="text-gray-600">
                          Select your community category (school, college, NGO,
                          study group, etc.)
                        </p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-shrink-0 w-10 h-10 bg-main text-white rounded-full flex items-center justify-center font-bold">
                        2
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          Basic Information
                        </h3>
                        <p className="text-gray-600">
                          Provide community name, description, and unique URL
                        </p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-shrink-0 w-10 h-10 bg-main text-white rounded-full flex items-center justify-center font-bold">
                        3
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          Verification
                        </h3>
                        <p className="text-gray-600">
                          Upload verification documents for your community
                        </p>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-shrink-0 w-10 h-10 bg-main text-white rounded-full flex items-center justify-center font-bold">
                        4
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          Settings
                        </h3>
                        <p className="text-gray-600">
                          Configure privacy settings and finalize your
                          application
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Fixed Bottom Section */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-gray-200">
          <div className="max-w-7xl mx-auto px-1 py-2 md:px-6 md:py-3">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-500">
                {/* <p>Registration fee: $45 (one-time payment)</p> */}
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleExitClick}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Not Now
                </button>
                <button
                  onClick={handleStartApplication}
                  className="px-8 py-3 bg-main text-white font-semibold rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-main focus:ring-offset-2 transition-colors"
                >
                  Start Application
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Regular Step Pages (1-4)
  return (
    <div className="fixed inset-0 bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="w-full mx-auto px-4 py-4 md:px-14 md:py-8 md:pb-3 flex justify-between items-center">
          <a href="/" className="flex items-center space-x-0">
            <div className="w-8 h-8">
              <img
                src="/images/logo_purple.png"
                alt="SomoHub Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xl font-bold text-main">SomoHub</span>
          </a>
          <button
            onClick={handleExitClick}
            className="px-4 py-[6px] text-gray-700 hover:bg-gray-100 rounded-3xl font-medium transition-colors border border-gray-300 font-semibold cursor-pointer"
          >
            Exit
          </button>
        </div>
      </header>

      {/* Community Onboarding Indicator */}
      <div className="pt-3">
        <div className="w-full px-4 md:px-14">
          <div className="flex items-center justify-start space-x-2">
            <svg
              xmlns="http://www.w3.org2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-users text-main"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span className="text-sm font-medium text-gray-700">
              Community Onboarding Application
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-4xl mx-auto px-4 py-1 md:py-4">
          <div className="bg-white p-6 md:p-8">
            {currentStep === 1 && (
              <Step1Category
                initialData={formData} // Changed from application to formData
                onNext={handleFormSubmit}
                isLoading={isLoading}
              />
            )}
            {currentStep === 2 && (
              <Step2BasicInfo
                initialData={formData} // Changed from application to formData
                onNext={handleFormSubmit}
                onBack={handleBack}
                isLoading={isLoading}
              />
            )}
            {currentStep === 3 && (
              <Step3Verification
                initialData={formData} // Changed from application to formData
                onNext={handleFormSubmit}
                onBack={handleBack}
                isLoading={isLoading}
              />
            )}
            {currentStep === 4 && (
              <Step4Settings
                initialData={formData} // Changed from application to formData
                onNext={handleFormSubmit}
                onBack={handleBack}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </main>

      {/* Fixed Bottom Section */}
      <div className="fixed bottom-0 left-0 right-0 bg-white">
        <div className="w-full mx-auto px-4 py-0 md:py-2">
          {/* Progress Bar */}
          <div className="hidden md:block mb-4">
            <ProgressBar steps={steps} currentStep={currentStep} />
          </div>

          {/* Mobile Step Indicator */}
          <div className="md:hidden mb-3 text-center">
            <div className="flex items-center justify-center space-x-2">
              <div className="flex items-center space-x-1">
                {steps.map((step, index) => (
                  <div
                    key={step.number}
                    className={`w-2 h-2 rounded-full ${
                      index + 1 <= currentStep ? "bg-main" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-700">
                Step {currentStep} of {steps.length}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {steps[currentStep - 1]?.title}
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center w-full">
            {/* Back Button */}
            <div className="w-1/4 md:w-1/4">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isLoading}
                  className="px-4 py-2.5 md:px-6 md:py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm md:text-base"
                >
                  Back
                </button>
              )}
            </div>

            {/* Step Number */}
            <div className="hidden md:block w-2/4 text-center">
              <p className="text-sm text-gray-600">
                Step {currentStep} of {steps.length}
              </p>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {steps[currentStep - 1]?.title}
              </p>
            </div>

            {/* Continue/Review Button */}
            <div className="w-1/4 md:w-1/4 text-right">
              {currentStep < 4 ? (
                <button
                  type="submit"
                  form={`step-${currentStep}-form`}
                  disabled={isLoading}
                  className="px-4 py-2.5 md:px-8 md:py-3 bg-main text-white font-semibold rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-main focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm md:text-base w-full md:w-auto"
                >
                  {isLoading ? "Saving..." : "Continue"}
                </button>
              ) : (
                <button
                  type="submit"
                  form={`step-4-form`}
                  disabled={isLoading}
                  className="px-4 py-2.5 md:px-8 md:py-3 bg-main text-white font-semibold rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-main focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm md:text-base w-full md:w-auto"
                >
                  {isLoading ? "Saving..." : "Review Application"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Exit Confirmation Dialog */}
      {showExitDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl md:rounded-2xl shadow-xl max-w-md w-full mx-auto relative">
            <button
              onClick={() => setShowExitDialog(false)}
              className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              ×
            </button>

            <div className="p-6 md:p-8">
              {/* <div className="flex justify-center mb-4">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-red-50 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-log-out text-red-500"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </div>
              </div> */}

              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 text-center">
                Exit Application?
              </h3>

              <p className="text-gray-600 mb-6 md:mb-8 text-center text-sm md:text-base">
                You have unsaved progress. Would you like to save before
                exiting?
              </p>

              <div className="space-y-3 md:space-y-4">
                <button
                  onClick={() => {
                    handleExit(true);
                    setShowExitDialog(false);
                  }}
                  className="w-full px-4 py-3 bg-main text-white font-medium rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-main focus:ring-offset-2 transition-colors text-sm md:text-base"
                >
                  Save & Exit
                </button>

                <button
                  onClick={() => {
                    handleExit();
                    setShowExitDialog(false);
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors text-sm md:text-base"
                >
                  Exit Without Saving
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-4 md:mt-6 text-center">
                You can resume your application anytime from your dashboard
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
