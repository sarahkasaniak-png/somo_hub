// src/app/onboarding/tutor/components/TutorOnboarding.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Step1TutorLevel from "./steps/Step1TutorLevel";
import Step2PersonalInfo from "./steps/Step2PersonalInfo";
import Step3Education from "./steps/Step3Education";
import Step4Experience from "./steps/Step4Experience";
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
  const [currentStep, setCurrentStep] = useState(0);
  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSummary, setShowSummary] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const router = useRouter();

  // Create refs for each step form
  const step1FormRef = useRef<HTMLFormElement>(null);
  const step2FormRef = useRef<HTMLFormElement>(null);
  const step3FormRef = useRef<HTMLFormElement>(null);
  const step4FormRef = useRef<HTMLFormElement>(null);

  // CRITICAL: Prevent multiple submissions and duplicate toasts
  const isSubmitting = useRef<boolean>(false);
  const hasCheckedExistingApp = useRef<boolean>(false);
  const hasProcessedPaymentReturn = useRef<boolean>(false);
  const hasShownStatusToast = useRef<boolean>(false);
  const hasRedirected = useRef<boolean>(false);
  const componentMounted = useRef<boolean>(true);
  const effectExecuted = useRef<boolean>(false);
  const redirectAttempted = useRef<boolean>(false); // Add this

  const steps = [
    { number: 1, title: "Tutor Level & Category" },
    { number: 2, title: "Personal Information" },
    { number: 3, title: "Education Background" },
    { number: 4, title: "Teaching Experience" },
  ];

  // Handle payment callback when returning from Paystack
  useEffect(() => {
    // Prevent multiple executions
    if (hasProcessedPaymentReturn.current) return;

    const queryParams = new URLSearchParams(window.location.search);
    const reference = queryParams.get("reference");
    const step = queryParams.get("step");

    console.log("🔍 TutorOnboarding - URL params:", { reference, step });

    // If we have a reference and we're on the summary step, show the summary with the reference
    if (reference && step === "summary" && application && !showSummary) {
      console.log(
        "✅ Payment return detected, showing summary with reference:",
        reference,
      );
      hasProcessedPaymentReturn.current = true;
      setShowSummary(true);
    }
  }, [application, showSummary]);

  // Check existing application on mount - with multiple safeguards
  useEffect(() => {
    // Prevent multiple executions with multiple safeguards
    if (effectExecuted.current) {
      console.log("useEffect already executed, skipping...");
      return;
    }

    if (!componentMounted.current) {
      console.log("Component not mounted, skipping...");
      return;
    }

    if (hasCheckedExistingApp.current) {
      console.log("hasCheckedExistingApp already true, skipping...");
      return;
    }

    console.log("Running checkExistingApplication for the first time");
    effectExecuted.current = true;
    hasCheckedExistingApp.current = true;

    checkExistingApplication();

    // Cleanup function
    return () => {
      console.log("TutorOnboarding cleanup");
      componentMounted.current = false;
    };
  }, []); // Empty dependency array - should run once

  // Debug logging - but don't let it cause re-renders
  useEffect(() => {
    console.log("=== TutorOnboarding State Debug ===");
    console.log("Current step:", currentStep);
    console.log("Show summary:", showSummary);
    console.log("Application data:", application);
    console.log("Application status:", application?.application_status);
    console.log("hasRedirected:", hasRedirected.current);
    console.log("redirectAttempted:", redirectAttempted.current);
  }, [currentStep, showSummary, application]);

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
        const appStatus = data.data.application.application_status;
        console.log("Existing application found with status:", appStatus);

        setApplication(data.data.application);
        setFormData(data.data.application);

        // Handle different application statuses - CRITICAL: Only redirect if not already redirected
        switch (appStatus) {
          case "pending":
          case "under_review":
            // Application is under review - redirect to status page
            console.log(
              `Application is ${appStatus}, redirecting to status page`,
            );

            // Show toast only once
            if (!hasShownStatusToast.current && componentMounted.current) {
              hasShownStatusToast.current = true;
              toast(
                `Your application is ${appStatus === "pending" ? "pending" : "under review"}. You cannot edit it at this time.`,
                {
                  id: "status-info-toast",
                  duration: 4000,
                  icon: "ℹ️",
                },
              );
            }

            // Redirect only once and only if not already redirected
            if (
              !hasRedirected.current &&
              !redirectAttempted.current &&
              componentMounted.current
            ) {
              console.log("Setting redirect flags to true");
              hasRedirected.current = true;
              redirectAttempted.current = true;

              // Use a longer timeout to ensure state is updated
              setTimeout(() => {
                if (componentMounted.current) {
                  console.log("Executing redirect to status page");
                  router.push("/onboarding/tutor/status");
                } else {
                  console.log("Component unmounted, skipping redirect");
                }
              }, 500); // Increased timeout
            } else {
              console.log("Redirect already attempted or flagged, skipping:", {
                hasRedirected: hasRedirected.current,
                redirectAttempted: redirectAttempted.current,
              });
            }

            // IMPORTANT: Return early to prevent further processing
            setIsLoading(false);
            return;

          case "approved":
            // Application approved - redirect to dashboard
            console.log("Application is approved, redirecting to dashboard");
            if (!hasShownStatusToast.current && componentMounted.current) {
              hasShownStatusToast.current = true;
              toast.success(
                "Your application has been approved! Welcome to the tutor community!",
                { id: "approved-toast", duration: 4000 },
              );
            }
            if (
              !hasRedirected.current &&
              !redirectAttempted.current &&
              componentMounted.current
            ) {
              hasRedirected.current = true;
              redirectAttempted.current = true;
              setTimeout(() => {
                if (componentMounted.current) {
                  router.push("/tutor/dashboard");
                }
              }, 500);
            }
            setIsLoading(false);
            return;

          case "rejected":
            // Application rejected - show message and allow reapply
            console.log("Application is rejected");
            if (!hasShownStatusToast.current && componentMounted.current) {
              hasShownStatusToast.current = true;
              toast.error(
                "Your application was not approved. You can submit a new application.",
                { id: "rejected-toast", duration: 5000 },
              );
            }
            // For rejected applications, we still show the onboarding but with a fresh start
            setCurrentStep(0);
            setApplication(null);
            setFormData({});
            setIsLoading(false);
            return;

          case "draft":
            // Draft application - continue normally
            console.log("Application is draft, continuing...");
            setCurrentStep(data.data.application.current_step || 1);
            break;

          default:
            // Unknown status - treat as draft
            console.log("Unknown status, treating as draft");
            setCurrentStep(data.data.application.current_step || 1);
        }
      } else {
        // No application found, start from intro
        console.log("No existing application found, showing intro");
        setCurrentStep(0);
      }
      console.log("Loaded application data:", data);
    } catch (error) {
      console.error("Failed to load application:", error);
      // Only show error toast once
      toast.error("Failed to load application data", {
        id: "load-error-toast",
        duration: 3000,
      });
    } finally {
      if (componentMounted.current) {
        setIsLoading(false);
      }
    }
  };

  const handleNext = useCallback(
    async (stepData: any) => {
      // CRITICAL: Prevent multiple submissions
      if (isSubmitting.current) {
        console.log("⏳ Submission already in progress, skipping...");
        return;
      }

      // Check if application is in draft state before allowing submission
      if (
        application?.application_status &&
        application.application_status !== "draft"
      ) {
        console.log("❌ Cannot submit - application is not in draft state");
        toast.error("This application cannot be edited at this time.", {
          id: "not-draft-error",
        });
        return;
      }

      try {
        isSubmitting.current = true;
        setIsLoading(true);

        console.log(
          "🚀 handleNext called with step:",
          currentStep,
          "data:",
          stepData,
        );

        const mergedData = { ...formData, ...stepData };
        setFormData(mergedData);

        const response: SaveStepResponse = await saveStep(
          currentStep,
          stepData,
        );

        if (response.success && response.data) {
          setApplication(response.data);
          setFormData(response.data);

          if (currentStep === 4) {
            console.log("🎯 Step 4 completed, setting showSummary to true");
            setShowSummary(true);
          } else {
            setCurrentStep(currentStep + 1);
          }

          toast.success("Progress saved", { id: "progress-saved" });
        } else if (response.success) {
          const updatedApp = {
            ...(application || {}),
            ...stepData,
            current_step: currentStep < 4 ? currentStep + 1 : currentStep,
          };
          setApplication(updatedApp as ApplicationData);
          setFormData(updatedApp);

          if (currentStep === 4) {
            setShowSummary(true);
          } else {
            setCurrentStep(currentStep + 1);
          }

          toast.success("Progress saved", { id: "progress-saved" });
        } else {
          throw new Error(response.message || "Failed to save step");
        }
      } catch (error: any) {
        console.error("❌ Error in handleNext:", error);
        toast.error(error.message || "Failed to save step", {
          id: "step-error",
        });
      } finally {
        console.log("Setting isLoading to false");
        setIsLoading(false);

        // Reset submission flag after a delay to prevent rapid re-submissions
        setTimeout(() => {
          isSubmitting.current = false;
        }, 1000);
      }
    },
    [currentStep, formData, application],
  );

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const handleStartApplication = useCallback(() => {
    setCurrentStep(1);
  }, []);

  const handleSubmitApplication = async (
    paymentReference: string,
    paymentMethod: string,
  ) => {
    if (isSubmitting.current) return;

    // Check if application is in draft state before allowing submission
    if (
      application?.application_status &&
      application.application_status !== "draft"
    ) {
      console.log("❌ Cannot submit - application is not in draft state");
      toast.error("This application cannot be submitted at this time.", {
        id: "not-draft-error",
      });
      return;
    }

    try {
      isSubmitting.current = true;
      setIsLoading(true);

      const response = await submitApplication(paymentReference, paymentMethod);

      if (!response.success) {
        throw new Error(response.message || "Failed to submit application");
      }

      toast.success("Application submitted successfully!", {
        id: "app-submit",
      });

      // Redirect to status page after successful submission
      if (!hasRedirected.current && !redirectAttempted.current) {
        hasRedirected.current = true;
        redirectAttempted.current = true;
        router.push("/onboarding/tutor/status");
      }
    } catch (error: any) {
      console.error("❌ Submit application error:", error);
      toast.error(error.message || "Failed to submit application", {
        id: "submit-error",
      });
      throw error;
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        isSubmitting.current = false;
      }, 1000);
    }
  };

  const handleExit = useCallback(
    (withSave = false) => {
      if (withSave && application) {
        toast.success("Your progress has been saved. You can continue later.", {
          id: "exit-save",
        });
      }
      router.push("/");
    },
    [application, router],
  );

  const handleExitClick = useCallback(() => {
    if (application && Object.keys(application).length > 0) {
      setShowExitDialog(true);
    } else {
      handleExit();
    }
  }, [application, handleExit]);

  const handleFormSubmit = useCallback(
    (data: any) => {
      console.log("handleFormSubmit called with data:", data);
      const mergedData = { ...formData, ...data };
      setFormData(mergedData);
      handleNext(data);
    },
    [formData, handleNext],
  );

  const handleContinueClick = useCallback(() => {
    if (isSubmitting.current) {
      console.log("⏳ Already submitting, ignoring click");
      return;
    }

    // Check if application is in draft state before allowing continuation
    if (
      application?.application_status &&
      application.application_status !== "draft"
    ) {
      console.log("❌ Cannot continue - application is not in draft state");
      toast.error("This application cannot be edited at this time.", {
        id: "not-draft-error",
      });
      return;
    }

    console.log("Continue/Review button clicked for step:", currentStep);

    if (currentStep === 1 && step1FormRef.current) {
      step1FormRef.current.requestSubmit();
    } else if (currentStep === 2 && step2FormRef.current) {
      step2FormRef.current.requestSubmit();
    } else if (currentStep === 3 && step3FormRef.current) {
      step3FormRef.current.requestSubmit();
    } else if (currentStep === 4) {
      if (step4FormRef.current) {
        step4FormRef.current.requestSubmit();
      } else {
        const form = document.getElementById("step-4-form") as HTMLFormElement;
        if (form) form.requestSubmit();
      }
    }
  }, [currentStep, application]);

  if (isLoading && !application) {
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

  if (currentStep === 0) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col">
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

        <main className="flex-1 overflow-y-auto pb-24">
          <div className="max-w-7xl mx-auto px-1 pt-1 pb-8 md:pt-2 md:pb-8">
            <div className="bg-white p-6 md:p-8">
              <div className="flex flex-col lg:flex-row gap-2 md:gap-8 ">
                <div className="lg:w-1/2 flex items-center">
                  <div className="text-left w-full">
                    <h1 className="max-w-[18ch] text-3xl md:text-5xl font-semibold text-gray-900 mb-6 leading-tight">
                      It's easy to get started on SomoHub
                    </h1>
                  </div>
                </div>

                <div className="lg:w-1/2">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-shrink-0 w-10 h-10 bg-main text-white rounded-full flex items-center justify-center font-bold">
                        1
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          Tutor Level & Category
                        </h3>
                        <p className="text-gray-600">
                          Select your teaching category to customize the
                          application requirements.
                        </p>
                      </div>
                    </div>

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
                          identification documents.
                        </p>
                      </div>
                    </div>

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
                          supporting documents.
                        </p>
                      </div>
                    </div>

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
                          certifications, and experience.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

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

  return (
    <div className="fixed inset-0 bg-white flex flex-col">
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

      <main className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-4xl mx-auto px-4 py-1 md:py-4">
          <div className="bg-white p-6 md:p-8">
            {currentStep === 1 && (
              <Step1TutorLevel
                key={`step1-${application?.id}`}
                initialData={application}
                onNext={handleFormSubmit}
                isLoading={isLoading}
                ref={step1FormRef}
              />
            )}
            {currentStep === 2 && (
              <Step2PersonalInfo
                key={`step2-${application?.id}`}
                initialData={application}
                onNext={handleFormSubmit}
                isLoading={isLoading}
                ref={step2FormRef}
              />
            )}
            {currentStep === 3 && (
              <Step3Education
                key={`step3-${application?.id}`}
                initialData={application}
                onNext={handleFormSubmit}
                onBack={handleBack}
                isLoading={isLoading}
                tutorLevel={formData?.tutor_level || application?.tutor_level}
                ref={step3FormRef}
              />
            )}
            {currentStep === 4 && (
              <Step4Experience
                key={`step4-${application?.id}`}
                initialData={application}
                onNext={handleFormSubmit}
                onBack={handleBack}
                isLoading={isLoading}
                ref={step4FormRef}
              />
            )}
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white">
        <div className="w-full mx-auto px-4 py-0 md:py-2">
          <div className="hidden md:block mb-4">
            <ProgressBar steps={steps} currentStep={currentStep} />
          </div>

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

          <div className="flex justify-between items-center w-full">
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

            <div className="hidden md:block w-2/4 text-center">
              <p className="text-sm text-gray-600">
                Step {currentStep} of {steps.length}
              </p>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {steps[currentStep - 1]?.title}
              </p>
            </div>

            <div className="w-1/4 md:w-1/4 text-right">
              <button
                type="button"
                onClick={handleContinueClick}
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
                    {currentStep < 4 ? (
                      <>
                        <span className="hidden md:inline">Continue</span>
                        <span className="md:hidden">Next</span>
                      </>
                    ) : (
                      <>
                        <span className="hidden md:inline">
                          Review Application
                        </span>
                        <span className="md:hidden">Review</span>
                      </>
                    )}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showExitDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl md:rounded-2xl shadow-xl max-w-md w-full mx-auto relative">
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

            <div className="p-6 md:p-8">
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
