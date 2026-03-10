// src/app/onboarding/tutor/components/steps/Step4Experience.tsx

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FileUpload from "../FileUpload";

const experienceSchema = z.object({
  has_teaching_experience: z.boolean().default(false),
  tsc_number: z.string().optional().or(z.literal("")),
  teaching_experience_years: z.number().min(0).max(50).optional().or(z.null()),
  previous_institutions: z.array(z.string()).optional().default([]),
  professional_experience: z.string().max(1000).optional().or(z.literal("")),
  portfolio_url: z.string().url().optional().or(z.literal("")).or(z.null()),
  certificates: z
    .array(
      z.object({
        name: z.string(),
        url: z.string().url(),
        issued_date: z.string().optional(),
      }),
    )
    .optional()
    .default([]),
});

type ExperienceFormData = z.infer<typeof experienceSchema>;

interface Step4ExperienceProps {
  initialData?: any;
  onNext: (data: ExperienceFormData) => void;
  onBack: () => void;
  isLoading: boolean;
}

export default function Step4Experience({
  initialData,
  onNext,
  onBack,
  isLoading,
}: Step4ExperienceProps) {
  const [certificates, setCertificates] = useState<any[]>(
    initialData?.certificates || [],
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors, isValid },
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
  }, [initialData, setValue]);

  const handleFileUpload = async (fileType: string, url: string) => {
    if (fileType === "certificate") {
      const newCert = {
        name: `Certificate ${certificates.length + 1}`,
        url,
        issued_date: new Date().toISOString().split("T")[0],
      };

      console.log("Creating new certificate:", newCert);

      // Create a new array with the certificate
      const updatedCertificates = [...certificates, newCert];
      setCertificates(updatedCertificates);

      // Update the form field
      setValue("certificates", updatedCertificates, { shouldValidate: true });

      // Append to field array
      append(newCert);
    }
  };

  const onSubmit = async (data: ExperienceFormData) => {
    if (isSubmitting || isLoading) return;

    try {
      setIsSubmitting(true);

      // Additional validation
      if (hasExperience) {
        if (!tscNumber?.trim() && !experienceYears) {
          alert(
            "Please provide either TSC number or teaching experience years",
          );
          setIsSubmitting(false);
          return;
        }
      }

      console.log("Submitting experience data:", data);
      await onNext(data);
    } catch (error) {
      console.error("Submission error:", error);
      setIsSubmitting(false);
    }
    // Note: isSubmitting will be reset by the parent component
  };

  // Check if form is ready for submission
  const isFormReady = () => {
    const hasExperienceStatus = typeof hasExperience !== "undefined";

    if (hasExperience) {
      const hasExperienceDetails =
        tscNumber?.trim() || (experienceYears || 0) > 0;
      return hasExperienceStatus && hasExperienceDetails && isValid;
    }

    return hasExperienceStatus && isValid;
  };

  const handlePreviousInstitutionsChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const value = e.target.value;
    const institutions = value.split("\n").filter((line) => line.trim() !== "");
    setValue("previous_institutions", institutions);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
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
            {...register("has_teaching_experience")}
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
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <span className="font-medium text-gray-700">
                      {field.name || `Certificate ${index + 1}`}
                    </span>
                    <p className="text-sm text-gray-500 truncate">
                      {field.url}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      remove(index);
                      setCertificates(
                        certificates.filter((_, i) => i !== index),
                      );
                    }}
                    className="text-red-600 hover:text-red-800 text-sm font-medium ml-4"
                    disabled={isLoading || isSubmitting}
                  >
                    Remove
                  </button>
                </div>
              ))}
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
}
