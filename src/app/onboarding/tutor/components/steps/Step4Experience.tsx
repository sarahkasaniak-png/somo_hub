// src/app/onboarding/tutor/components/steps/Step4Experience.tsx
"use client";

import { useState, useEffect, forwardRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FileUpload from "../FileUpload";

// Define the certificate type
interface Certificate {
  name: string;
  url: string;
  issued_date?: string;
}

// Simplified schema - make certificates completely permissive
const experienceSchema = z.object({
  has_teaching_experience: z.boolean().default(false),
  tsc_number: z.string().optional().or(z.literal("")),
  teaching_experience_years: z.number().min(0).max(50).optional().or(z.null()),
  previous_institutions: z.array(z.string()).optional().default([]),
  professional_experience: z.string().max(1000).optional().or(z.literal("")),
  portfolio_url: z.string().url().optional().or(z.literal("")).or(z.null()),
  certificates: z.any().optional().default([]), // Accept anything
});

type ExperienceFormData = z.infer<typeof experienceSchema>;

interface Step4ExperienceProps {
  initialData?: any;
  onNext: (data: ExperienceFormData) => void;
  onBack: () => void;
  isLoading: boolean;
}

const Step4Experience = forwardRef<HTMLFormElement, Step4ExperienceProps>(
  ({ initialData, onNext, onBack, isLoading }, ref) => {
    const [certificates, setCertificates] = useState<Certificate[]>(
      Array.isArray(initialData?.certificates) ? initialData.certificates : [],
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);

    const {
      register,
      handleSubmit,
      watch,
      control,
      setValue,
      trigger,
      formState: { errors, isValid, isDirty, isValidating },
    } = useForm<ExperienceFormData>({
      resolver: zodResolver(experienceSchema),
      mode: "onChange",
      defaultValues: {
        has_teaching_experience: initialData?.has_teaching_experience || false,
        tsc_number: initialData?.tsc_number || "",
        teaching_experience_years: initialData?.teaching_experience_years || 0,
        previous_institutions: initialData?.previous_institutions || [],
        professional_experience: initialData?.professional_experience || "",
        portfolio_url: initialData?.portfolio_url || "",
        certificates: initialData?.certificates || [],
      },
    });

    const { fields, append, remove } = useFieldArray({
      control,
      name: "certificates",
    });

    const hasExperience = watch("has_teaching_experience");
    const tscNumber = watch("tsc_number");
    const experienceYears = watch("teaching_experience_years");

    // Update form validity state
    useEffect(() => {
      const checkFormValidity = () => {
        const hasExperienceStatus = typeof hasExperience !== "undefined";

        if (hasExperience) {
          const hasExperienceDetails =
            (tscNumber?.trim() ? true : false) || (experienceYears || 0) > 0;
          setIsFormValid(hasExperienceStatus && hasExperienceDetails);
        } else {
          setIsFormValid(hasExperienceStatus);
        }
      };

      checkFormValidity();
    }, [hasExperience, tscNumber, experienceYears]);

    // Log certificate errors specifically
    useEffect(() => {
      if (errors.certificates) {
        console.log(
          "🔴 Certificates error details:",
          JSON.stringify(errors.certificates, null, 2),
        );
      }
    }, [errors.certificates]);

    // Log form state for debugging
    useEffect(() => {
      console.log("📊 Step4 Form State:", {
        isValid,
        isDirty,
        isValidating,
        hasExperience,
        tscNumber,
        experienceYears,
        certificatesCount: fields.length,
        isFormValid,
        errors:
          Object.keys(errors).length > 0 ? Object.keys(errors) : "No errors",
      });
    }, [
      isValid,
      isDirty,
      isValidating,
      hasExperience,
      tscNumber,
      experienceYears,
      errors,
      fields.length,
      isFormValid,
    ]);

    useEffect(() => {
      // Parse JSON if coming from initialData
      if (
        initialData?.previous_institutions &&
        typeof initialData.previous_institutions === "string"
      ) {
        try {
          const parsed = JSON.parse(initialData.previous_institutions);
          setValue("previous_institutions", parsed);
        } catch (error) {
          console.error("Error parsing previous_institutions:", error);
        }
      }

      // Parse certificates if they come as string
      if (
        initialData?.certificates &&
        typeof initialData.certificates === "string"
      ) {
        try {
          const parsed = JSON.parse(initialData.certificates);
          if (Array.isArray(parsed)) {
            setCertificates(parsed);
            setValue("certificates", parsed);
          }
        } catch (error) {
          console.error("Error parsing certificates:", error);
        }
      }
    }, [initialData, setValue]);

    const handleFileUpload = async (fileType: string, url: string) => {
      if (fileType === "certificate") {
        const newCert: Certificate = {
          name: `Certificate ${certificates.length + 1}`,
          url,
          issued_date: new Date().toISOString().split("T")[0],
        };

        console.log("Creating new certificate:", newCert);

        // Create a new array with the certificate
        const updatedCertificates = [...certificates, newCert];
        setCertificates(updatedCertificates);

        // Update the form field
        setValue("certificates", updatedCertificates);

        // Trigger validation after update
        await trigger("certificates");

        // Append to field array
        append(newCert);
      }
    };

    const handleFileRemove = (index: number) => {
      remove(index);
      const updatedCertificates = certificates.filter((_, i) => i !== index);
      setCertificates(updatedCertificates);
      setValue("certificates", updatedCertificates);
      trigger("certificates");
    };

    // Helper function to ensure certificates is an array
    const ensureCertificatesArray = (certs: any): any[] => {
      if (Array.isArray(certs)) {
        return certs;
      }
      if (typeof certs === "string") {
        try {
          const parsed = JSON.parse(certs);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      }
      return [];
    };

    const onSubmit = async (data: ExperienceFormData) => {
      console.log("📝 Step4 onSubmit called with data:", data);
      console.log(
        "Current state - isSubmitting:",
        isSubmitting,
        "isLoading:",
        isLoading,
      );

      if (isSubmitting || isLoading) {
        console.log("Submission blocked - already submitting");
        return;
      }

      try {
        setIsSubmitting(true);
        console.log("Set isSubmitting to true");

        // Additional validation
        if (data.has_teaching_experience) {
          console.log("Has experience, checking validation:", {
            tscNumber: data.tsc_number?.trim(),
            experienceYears: data.teaching_experience_years,
          });

          if (!data.tsc_number?.trim() && !data.teaching_experience_years) {
            console.log("Validation failed - missing TSC or experience years");
            alert(
              "Please provide either TSC number or teaching experience years",
            );
            setIsSubmitting(false);
            return;
          }
        }

        // Ensure certificates is an array before filtering
        const certificatesArray = ensureCertificatesArray(data.certificates);
        console.log("Certificates array after ensure:", certificatesArray);

        // Clean up certificates data - remove empty certificates or those without URLs
        const cleanedData = {
          ...data,
          has_teaching_experience: Boolean(data.has_teaching_experience), // Ensure boolean
          certificates: certificatesArray.filter(
            (cert: any) => cert && cert.url && cert.url.trim() !== "",
          ),
          // Ensure previous_institutions is an array
          previous_institutions: Array.isArray(data.previous_institutions)
            ? data.previous_institutions
            : [],
        };

        console.log("Calling onNext with cleaned data:", cleanedData);
        await onNext(cleanedData);
        console.log("onNext completed successfully");
      } catch (error) {
        console.error("Submission error:", error);
        setIsSubmitting(false);
      }
      // Note: isSubmitting will be reset by the parent component
    };

    const onError = (errors: any) => {
      console.log("❌ Form validation errors:", errors);
    };

    // Check if form is ready for submission
    const isFormReady = () => {
      const hasExperienceStatus = typeof hasExperience !== "undefined";

      if (hasExperience) {
        const hasExperienceDetails =
          (tscNumber?.trim() ? true : false) || (experienceYears || 0) > 0;
        return hasExperienceStatus && hasExperienceDetails;
      }

      return hasExperienceStatus;
    };

    const handlePreviousInstitutionsChange = (
      e: React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
      const value = e.target.value;
      const institutions = value
        .split("\n")
        .filter((line) => line.trim() !== "");
      setValue("previous_institutions", institutions);
    };

    // Function to handle form submission with validation
    const handleFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log("🔥 handleFormSubmit called, isFormValid:", isFormValid);

      if (isFormValid) {
        console.log("Form is valid, submitting...");
        handleSubmit(onSubmit, onError)(e);
      } else {
        console.log("Form is not valid, triggering validation...");
        // Trigger validation to show errors
        trigger().then(() => {
          // Try submitting again after a short delay
          setTimeout(() => {
            if (isFormValid) {
              console.log("Form became valid, submitting...");
              handleSubmit(onSubmit, onError)(e);
            } else {
              console.log("Form still invalid");
            }
          }, 100);
        });
      }
    };

    return (
      <form
        ref={ref}
        onSubmit={handleFormSubmit}
        className="space-y-6"
        id="step-4-form"
      >
        <div>
          <h2 className="text-2xl font-semibold text-zinc-700">
            Teaching Experience
          </h2>
          <p className="text-gray-600 mt-2">
            Share your teaching background and qualifications
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="has_experience"
              {...register("has_teaching_experience", {
                setValueAs: (value) => Boolean(value),
              })}
              className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              disabled={isLoading || isSubmitting}
            />
            <label
              htmlFor="has_experience"
              className="ml-3 text-gray-700 font-medium"
            >
              I have prior teaching experience
            </label>
          </div>

          {hasExperience && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    TSC Number (Optional)
                  </label>
                  <input
                    type="text"
                    {...register("tsc_number")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    placeholder="Enter your TSC registration number"
                    disabled={isLoading || isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years of Teaching Experience
                  </label>
                  <input
                    type="number"
                    {...register("teaching_experience_years", {
                      valueAsNumber: true,
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    placeholder="0"
                    min="0"
                    max="50"
                    disabled={isLoading || isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Previous Institutions (Optional)
                </label>
                <textarea
                  onChange={handlePreviousInstitutionsChange}
                  defaultValue={
                    Array.isArray(watch("previous_institutions"))
                      ? watch("previous_institutions").join("\n")
                      : ""
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="List any previous institutions where you've taught (one per line)"
                  rows={3}
                  disabled={isLoading || isSubmitting}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Enter one institution per line
                </p>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Professional Experience Summary (Optional)
            </label>
            <textarea
              {...register("professional_experience")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="Briefly describe your teaching philosophy, experience, or any other relevant information..."
              rows={4}
              disabled={isLoading || isSubmitting}
            />
            <p className="mt-1 text-sm text-gray-500">
              This will be visible to students on your profile (optional)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Portfolio URL (Optional)
            </label>
            <input
              type="url"
              {...register("portfolio_url")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="https://yourportfolio.com or LinkedIn profile URL"
              disabled={isLoading || isSubmitting}
            />
            <p className="mt-1 text-sm text-gray-500">
              Share links to your GitHub, Behance, LinkedIn, or personal website
            </p>
            {errors.portfolio_url && (
              <p className="mt-1 text-sm text-red-600">
                {errors.portfolio_url.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certificates & Qualifications (Optional)
            </label>
            <FileUpload
              fileType="certificate"
              onUploadComplete={handleFileUpload}
              label="Upload Certificate"
            />

            {fields.length > 0 && (
              <div className="mt-4 space-y-3">
                {fields.map((field, index) => {
                  // Cast field to any to access properties
                  const fieldData = field as any;
                  return (
                    <div
                      key={field.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <span className="font-medium text-gray-700">
                          {fieldData.name || `Certificate ${index + 1}`}
                        </span>
                        <p className="text-sm text-gray-500 truncate">
                          {fieldData.url}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleFileRemove(index)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium ml-4"
                        disabled={isLoading || isSubmitting}
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Form validation status */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                {isFormReady()
                  ? "✓ All required information is provided"
                  : "Please complete all required fields"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Required: Teaching experience status
                {hasExperience && " + Either TSC number or experience years"}
              </p>
            </div>
            <div className="text-sm text-gray-600">
              {fields.length > 0
                ? `✓ ${fields.length} certificate(s) uploaded`
                : "No certificates uploaded (optional)"}
            </div>
          </div>
        </div>

        {/* Hidden submit button */}
        <button type="submit" className="hidden">
          Submit
        </button>
      </form>
    );
  },
);

Step4Experience.displayName = "Step4Experience";

export default Step4Experience;
