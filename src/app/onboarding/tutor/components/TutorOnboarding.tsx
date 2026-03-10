// src/app/onboarding/tutor/components/TutorOnboarding.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// import Step1PersonalInfo from "./steps/Step2PersonalInfo";
// import Step2Education from "./steps/Step3Education";
// import Step3Experience from "./steps/Step4Experience";
// import Step1TutorLevel from "./steps/Step1TutorLevel";
import Step1TutorLevel from "./steps/Step1TutorLevel";
import Step2PersonalInfo from "./steps/Step2PersonalInfo"; // Updated
import Step3Education from "./steps/Step3Education"; // Updated
import Step4Experience from "./steps/Step4Experience"; // Updated
import ApplicationSummary from "./ApplicationSummary";
import ProgressBar from "./ProgressBar";
import {
  loadApplication,
  saveStep,
  submitApplication,
  ApplicationData,
  SaveStepResponse,
} from "@/lib/api/tutor";
import { toast } from "react-hot-toast";

export default function TutorOnboarding() {
  const [currentStep, setCurrentStep] = useState(0); // Start at 0 for intro page
  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSummary, setShowSummary] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const router = useRouter();

  const steps = [
    { number: 1, title: "Tutor Level & Category" },
    { number: 2, title: "Personal Information" },
    { number: 3, title: "Education Background" },
    { number: 4, title: "Teaching Experience" },
  ];

  useEffect(() => {
    checkExistingApplication();
  }, []);

  useEffect(() => {
    console.log("=== TutorOnboarding State Debug ===");
    console.log("Current step:", currentStep);
    console.log("Application data:", application);
    console.log("Application tutor_level:", application?.tutor_level);
    console.log("Form data:", formData);
  }, [application, currentStep, formData]);

  const checkExistingApplication = async () => {
    try {
      setIsLoading(true);
      const data = await loadApplication();
      console.log(
        "checkExistingApplication data:",
        data.data.hasApplication,
        data.data.application,
      );
      if (data.data.hasApplication && data.data.application) {
        console.log("Existing application found:", data.application);
        setApplication(data.data.application);
        // If user has existing application, skip intro and go to their current step
        setCurrentStep(data.data.application.current_step || 1);
        setFormData(data.data.application);

        if (data.data.application.application_status === "pending") {
          toast.success(
            "Your application is already submitted and pending review",
          );
          router.push("/onboarding/tutor/status");
          return;
        }

        if (data.data.application.application_status === "approved") {
          toast.success("You are already an approved tutor!");
          router.push("/tutor/dashboard");
          return;
        }
      } else {
        // New user starts with intro
        setCurrentStep(0);
      }
      console.log("Loaded application data:", data);
    } catch (error) {
      console.error("Failed to load application:", error);
      toast.error("Failed to load application data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async (stepData: any) => {
    try {
      setIsLoading(true);

      // Debug what's being saved
      console.log("=== handleNext Debug ===");
      console.log("Current step:", currentStep);
      console.log("Step data being saved:", stepData);
      console.log("Existing application data:", application);

      // Merge new step data with existing form data
      const mergedData = { ...formData, ...stepData };
      setFormData(mergedData);

      // Save step to backend
      const response: SaveStepResponse = await saveStep(currentStep, stepData);

      if (response.success && response.data) {
        console.log("Backend response data:", response.data);
        setApplication(response.data);

        // Update formData with the response data to keep everything in sync
        setFormData(response.data);
      } else if (response.success) {
        // If backend doesn't return data, update local state
        const updatedApp = {
          ...(application || {}),
          ...stepData,
          current_step: currentStep < 4 ? currentStep + 1 : currentStep,
        };
        console.log("Updated local application state:", updatedApp);
        setApplication(updatedApp as ApplicationData);
        setFormData(updatedApp);
      } else {
        throw new Error(response.message || "Failed to save step");
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
    if (currentStep > 0) {
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
      const response = await submitApplication(paymentReference, paymentMethod);

      if (!response.success) {
        throw new Error(response.message || "Failed to submit application");
      }

      toast.success("Application submitted successfully!");
      router.push("/onboarding/tutor/status");
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

  // Function to handle form submission from each step
  const handleFormSubmit = (data: any) => {
    // Merge form data with existing data
    const mergedData = { ...formData, ...data };
    setFormData(mergedData);
    handleNext(data); // Pass only the current step data
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main"></div>
      </div>
    );
  }

  if (showSummary && application) {
    return (
      <div className="fixed inset-0 bg-white overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <ApplicationSummary
            application={application}
            onSubmit={handleSubmitApplication}
            onEdit={() => setShowSummary(false)}
            isLoading={isLoading}
          />
        </div>
      </div>
    );
  }

  // Intro Page (Step 0)
  // Update the intro page section in TutorOnboarding.tsx
  // Find the intro page section (around line 190-250) and update:

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

        {/* Tutor Onboarding Indicator */}

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
                className="lucide lucide-graduation-cap text-main"
              >
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
              </svg>
              <span className="text-sm font-medium text-gray-700">
                Tutor Onboarding Application
              </span>
            </div>
          </div>
        </div>

        {/* Main Content - Intro */}
        <main className="flex-1 overflow-y-auto pb-24">
          {" "}
          {/* Added bottom padding for fixed footer */}
          <div className="max-w-7xl mx-auto px-1 pt-1 pb-8 md:pt-2 md:pb-8">
            <div className="bg-white p-6 md:p-8">
              <div className="flex flex-col lg:flex-row gap-2 md:gap-8 ">
                {/* Left Column - Introduction Message (Left-aligned on all devices) */}
                <div className="lg:w-1/2 flex items-center">
                  <div className="text-left w-full">
                    <h1 className="max-w-[18ch] text-3xl md:text-5xl font-semibold text-gray-900 mb-6 leading-tight">
                      It's easy to get started on SomoHub
                    </h1>
                    {/* <p className="text-lg text-gray-600 mb-2">
                    Join our community of expert educators
                  </p>
                  <p className="text-lg text-gray-600">
                    Help students achieve their academic goals
                  </p> */}
                  </div>
                </div>

                {/* Right Column - Step Cards */}
                <div className="lg:w-1/2">
                  <div className="space-y-4">
                    {/* Updated Step 1 - Tutor Level */}
                    <div className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-shrink-0 w-10 h-10 bg-main text-white rounded-full flex items-center justify-center font-bold">
                        1
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          Tutor Level & Category
                        </h3>
                        <p className="text-gray-600">
                          Select your teaching category (student, teacher,
                          professional, etc.) to customize the application
                          requirements.
                        </p>
                      </div>
                    </div>

                    {/* Updated Step 2 - Personal Information */}
                    <div className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-shrink-0 w-10 h-10 bg-main text-white rounded-full flex items-center justify-center font-bold">
                        2
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          Personal Information
                        </h3>
                        <p className="text-gray-600">
                          Provide your official personal details and upload
                          identification documents (National ID).
                        </p>
                      </div>
                    </div>

                    {/* Updated Step 3 - Education Background */}
                    <div className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-shrink-0 w-10 h-10 bg-main text-white rounded-full flex items-center justify-center font-bold">
                        3
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          Education Background
                        </h3>
                        <p className="text-gray-600">
                          Share your educational qualifications and provide
                          supporting documents based on your tutor level.
                        </p>
                      </div>
                    </div>

                    {/* Updated Step 4 - Teaching Experience */}
                    <div className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-shrink-0 w-10 h-10 bg-main text-white rounded-full flex items-center justify-center font-bold">
                        4
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          Teaching Experience
                        </h3>
                        <p className="text-gray-600">
                          Tell us about your teaching background,
                          certifications, and professional experience.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Fixed Bottom Section with Start Application Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-gray-200">
          <div className="max-w-7xl mx-auto px-1 py-2 md:px-6 md:py-3">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-500">
                <p>You can save your progress and return at any time.</p>
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
                  className="px-8 py-3 bg-main text-white font-semibold rounded-lg hover:bg-main/90 focus:outline-none focus:ring-2 focus:ring-main focus:ring-offset-2 transition-colors"
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
        <div className="w-full mx-auto px-4 py-4  md:px-14 md:py-8 md:pb-3 flex justify-between items-center">
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

      {/* Tutor Onboarding Indicator */}
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
              className="lucide lucide-graduation-cap text-main"
            >
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
            </svg>
            <span className="text-sm font-medium text-gray-700">
              Tutor Onboarding Application
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        {" "}
        {/* Added padding at bottom for fixed controls */}
        <div className="max-w-4xl mx-auto px-4 py-1 md:py-4">
          <div className="bg-white p-6 md:p-8">
            {currentStep === 1 && (
              <Step1TutorLevel
                key={`step1-${application?.id}`} // Force re-mount when application changes
                initialData={application}
                onNext={handleFormSubmit}
                isLoading={isLoading}
              />
            )}
            {currentStep === 2 && (
              <Step2PersonalInfo // This is actually Step 2 now
                initialData={application}
                onNext={handleFormSubmit}
                isLoading={isLoading}
              />
            )}
            {currentStep === 3 && (
              <Step3Education
                initialData={application}
                onNext={handleFormSubmit}
                onBack={handleBack}
                isLoading={isLoading}
                tutorLevel={formData?.tutor_level || application?.tutor_level} // ADD THIS LINE
              />
            )}
            {currentStep === 4 && (
              <Step4Experience // This is Step 4
                initialData={application}
                onNext={handleFormSubmit}
                onBack={handleBack}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </main>

      {/* Fixed Bottom Section with Progress Bar and Navigation Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white ">
        <div className="w-full mx-auto px-4 py-0 md:py-2">
          {/* Progress Bar - Hidden on mobile, shown on tablet and up */}
          <div className="hidden md:block mb-4">
            <ProgressBar steps={steps} currentStep={currentStep} />
          </div>

          {/* Mobile Step Indicator - Shown only on mobile */}
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

          {/* Navigation Buttons - Responsive layout */}
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
            {/* Step Number - Hidden on mobile (shown above), visible on desktop */}
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
                  className="px-4 py-2.5 md:px-8 md:py-3 bg-main text-white font-semibold rounded-lg hover:bg-main focus:outline-none focus:ring-2 focus:ring-main focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm md:text-base w-full md:w-auto"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-4 w-4 md:h-5 md:w-5 mr-2 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span className="hidden md:inline">Saving...</span>
                      <span className="md:hidden">Saving</span>
                    </span>
                  ) : (
                    <>
                      <span className="hidden md:inline">Continue</span>
                      <span className="md:hidden">Next</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => {
                    alert("test data");
                  }}
                  type="submit"
                  form="step-4-form" // Make sure this matches the form ID in Step4Experience
                  disabled={isLoading}
                  className="px-4 py-2.5 md:px-8 md:py-3 bg-main text-white font-semibold rounded-lg hover:bg-main focus:outline-none focus:ring-2 focus:ring-main focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm md:text-base w-full md:w-auto"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-4 w-4 md:h-5 md:w-5 mr-2 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span className="hidden md:inline">Saving...</span>
                      <span className="md:hidden">Saving</span>
                    </span>
                  ) : (
                    <>
                      <span className="hidden md:inline">
                        Review Application
                      </span>
                      <span className="md:hidden">Review</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Exit Confirmation Dialog */}
      {/* Exit Confirmation Dialog */}
      {showExitDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl md:rounded-2xl shadow-xl max-w-md w-full mx-auto relative">
            {/* Close Icon Button - Top Right */}
            <button
              onClick={() => setShowExitDialog(false)}
              className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Cancel"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-x"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>

            {/* Dialog Content */}
            <div className="p-6 md:p-8">
              {/* Icon */}
              <div className="flex justify-center mb-4">
                {/* <div className="w-12 h-12 md:w-14 md:h-14 bg-red-50 rounded-full flex items-center justify-center">
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
                </div> */}
              </div>

              {/* Title */}
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 text-center">
                Exit Application?
              </h3>

              {/* Description */}
              <p className="text-gray-600 mb-6 md:mb-8 text-center text-sm md:text-base">
                You have unsaved progress. Would you like to save before
                exiting?
              </p>

              {/* Action Buttons */}
              <div className="space-y-3 md:space-y-4">
                <button
                  onClick={() => {
                    handleExit(true);
                    setShowExitDialog(false);
                  }}
                  className="w-full px-4 py-3 bg-main text-white font-medium rounded-lg hover:bg-main/90 focus:outline-none focus:ring-2 focus:ring-main focus:ring-offset-2 transition-colors text-sm md:text-base"
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

              {/* Helper Text - Corrected to match the context */}
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
