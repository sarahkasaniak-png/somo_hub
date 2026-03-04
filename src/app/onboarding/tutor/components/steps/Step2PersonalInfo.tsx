// src/app/onboarding/tutor/components/steps/Step1PersonalInfo.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FileUpload from "../FileUpload";

// Update schema to properly handle validation
const personalInfoSchema = z
  .object({
    official_first_name: z.string().min(2, "First name is required"),
    official_last_name: z.string().min(2, "Last name is required"),
    date_of_birth: z.string().min(1, "Date of birth is required"),
    national_id_number: z.string().min(5, "National ID number is required"),
    national_id_front_url: z
      .string()
      .min(1, "Front ID photo is required")
      .refine((val) => val !== "", {
        message: "Front ID photo is required",
      }),
    national_id_back_url: z
      .string()
      .min(1, "Back ID photo is required")
      .refine((val) => val !== "", {
        message: "Back ID photo is required",
      }),
  })
  .refine(
    (data) => {
      const today = new Date();
      const birthDate = new Date(data.date_of_birth);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const dayDiff = today.getDate() - birthDate.getDate();

      return (
        age > 18 ||
        (age === 18 && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)))
      );
    },
    {
      message: "You must be at least 18 years old",
      path: ["date_of_birth"],
    }
  );

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

interface Step1PersonalInfoProps {
  initialData?: any;
  onNext: (data: PersonalInfoFormData) => void;
  isLoading: boolean;
}

export default function Step1PersonalInfo({
  initialData,
  onNext,
  isLoading,
}: Step1PersonalInfoProps) {
  const [frontIdUrl, setFrontIdUrl] = useState(
    initialData?.national_id_front_url || ""
  );
  const [backIdUrl, setBackIdUrl] = useState(
    initialData?.national_id_back_url || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    watch,
    formState: { errors, isValid },
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    mode: "onChange", // Validate on change for better UX
    defaultValues: {
      official_first_name: initialData?.official_first_name || "",
      official_last_name: initialData?.official_last_name || "",
      date_of_birth: initialData?.date_of_birth?.split("T")[0] || "",
      national_id_number: initialData?.national_id_number || "",
      national_id_front_url: initialData?.national_id_front_url || "",
      national_id_back_url: initialData?.national_id_back_url || "",
    },
  });

  // Watch form values to update UI
  const formValues = watch();

  useEffect(() => {
    // Update form values when file URLs change
    if (frontIdUrl) {
      setValue("national_id_front_url", frontIdUrl, { shouldValidate: true });
    }
    if (backIdUrl) {
      setValue("national_id_back_url", backIdUrl, { shouldValidate: true });
    }
  }, [frontIdUrl, backIdUrl, setValue]);

  const handleFileUpload = async (fileType: string, url: string) => {
    if (fileType === "national_id_front") {
      setFrontIdUrl(url);
      setValue("national_id_front_url", url, { shouldValidate: true });
    } else if (fileType === "national_id_back") {
      setBackIdUrl(url);
      setValue("national_id_back_url", url, { shouldValidate: true });
    }
  };

  const handleFileRemove = async (fileType: string) => {
    if (fileType === "national_id_front") {
      setFrontIdUrl("");
      setValue("national_id_front_url", "", { shouldValidate: true });
    } else if (fileType === "national_id_back") {
      setBackIdUrl("");
      setValue("national_id_back_url", "", { shouldValidate: true });
    }
  };

  const onSubmit = async (data: PersonalInfoFormData) => {
    if (isSubmitting || isLoading) return;

    try {
      setIsSubmitting(true);

      // Final validation check
      if (!frontIdUrl || !backIdUrl) {
        alert("Please upload both ID photos before continuing");
        return;
      }

      console.log("Submitting personal info:", data);
      onNext(data);
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if form is ready for submission
  const isFormReady = () => {
    return (
      formValues.official_first_name &&
      formValues.official_last_name &&
      formValues.date_of_birth &&
      formValues.national_id_number &&
      frontIdUrl &&
      backIdUrl &&
      isValid
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      id="step-2-form" // Changed from step-1-form to step-2-form
    >
      <div>
        <h2 className="text-2xl font-semibold text-zinc-700">
          Personal Information
        </h2>
        <p className="text-gray-600 mt-2">
          Please provide your official personal details
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Official First Name *
          </label>
          <input
            type="text"
            {...register("official_first_name")}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent ${
              errors.official_first_name ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="Enter your first name"
            disabled={isLoading || isSubmitting}
          />
          {errors.official_first_name && (
            <p className="mt-1 text-sm text-red-600">
              {errors.official_first_name.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Official Last Name *
          </label>
          <input
            type="text"
            {...register("official_last_name")}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent ${
              errors.official_last_name ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="Enter your last name"
            disabled={isLoading || isSubmitting}
          />
          {errors.official_last_name && (
            <p className="mt-1 text-sm text-red-600">
              {errors.official_last_name.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth *
          </label>
          <input
            type="date"
            {...register("date_of_birth")}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent ${
              errors.date_of_birth ? "border-red-300" : "border-gray-300"
            }`}
            max={new Date().toISOString().split("T")[0]}
            disabled={isLoading || isSubmitting}
          />
          {errors.date_of_birth && (
            <p className="mt-1 text-sm text-red-600">
              {errors.date_of_birth.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            National ID Number *
          </label>
          <input
            type="text"
            {...register("national_id_number")}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent ${
              errors.national_id_number ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="Enter your national ID number"
            disabled={isLoading || isSubmitting}
          />
          {errors.national_id_number && (
            <p className="mt-1 text-sm text-red-600">
              {errors.national_id_number.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            National ID Front Photo *
          </label>
          <FileUpload
            fileType="national_id_front"
            currentUrl={frontIdUrl}
            onUploadComplete={handleFileUpload}
            onRemove={() => handleFileRemove("national_id_front")}
          />
          <input type="hidden" {...register("national_id_front_url")} />
          {errors.national_id_front_url && (
            <p className="mt-1 text-sm text-red-600">
              {errors.national_id_front_url.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            National ID Back Photo *
          </label>
          <FileUpload
            fileType="national_id_back"
            currentUrl={backIdUrl}
            onUploadComplete={handleFileUpload}
            onRemove={() => handleFileRemove("national_id_back")}
          />
          <input type="hidden" {...register("national_id_back_url")} />
          {errors.national_id_back_url && (
            <p className="mt-1 text-sm text-red-600">
              {errors.national_id_back_url.message}
            </p>
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
              Required fields: Name, Date of Birth, National ID, Front & Back ID
              Photos
            </p>
          </div>
          <div className="text-sm text-gray-600">
            {frontIdUrl && backIdUrl
              ? "✓ Photos uploaded"
              : `${frontIdUrl ? "1/2" : "0/2"} ID photos uploaded`}
          </div>
        </div>
      </div>

      {/* Hidden submit button for form validation testing */}
      <button type="submit" className="hidden">
        Submit
      </button>
    </form>
  );
}
