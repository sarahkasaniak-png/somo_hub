// src/app/onboarding/tutor/components/steps/Step4Experience.tsx
"use client";

import { useState, useEffect, forwardRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FileUpload from "../FileUpload";
import CurriculumSelector from "../CurriculumSelector";
import { SelectedCurriculum } from "@/lib/api/curriculum";

// Define the certificate type
interface Certificate {
  name: string;
  url: string;
  issued_date?: string;
}

// Base schema without curriculum
const baseExperienceSchema = z.object({
  has_teaching_experience: z.boolean().default(false),
  tsc_number: z.string().optional().or(z.literal("")),
  teaching_experience_years: z.number().min(0).max(50).optional().or(z.null()),
  previous_institutions: z.array(z.string()).optional().default([]),
  professional_experience: z.string().max(1000).optional().or(z.literal("")),
  portfolio_url: z.string().url().optional().or(z.literal("")).or(z.null()),
  certificates: z.any().optional().default([]),
  affiliate_code: z.string().max(100).optional().or(z.literal("")),
});

// Schema with required curriculum
const requiredCurriculumSchema = baseExperienceSchema.extend({
  selected_curriculums: z
    .array(z.any())
    .min(1, "Please select at least one curriculum you're qualified to teach"),
});

// Schema with optional curriculum
const optionalCurriculumSchema = baseExperienceSchema.extend({
  selected_curriculums: z.array(z.any()).optional().default([]),
});

// Schema factory based on tutor level
const createExperienceSchema = (tutorLevel: string) => {
  const isSchoolTeacher = [
    "junior_high_teacher",
    "senior_high_teacher",
  ].includes(tutorLevel);
  const isUniversityStudent = tutorLevel === "college_student";
  const isSkilledProfessional = tutorLevel === "skilled_professional";
  const isUniversityLecturer = tutorLevel === "university_lecturer";
  const isPrivateTutor = tutorLevel === "private_tutor";

  // Curriculum is REQUIRED for school teachers and university students
  const requiresCurriculum = isSchoolTeacher || isUniversityStudent;

  // Curriculum is NOT available for professional and lecturer tutors
  const curriculumNotAvailable = isSkilledProfessional || isUniversityLecturer;

  // Curriculum is OPTIONAL for private tutors
  const curriculumOptional = isPrivateTutor;

  if (curriculumNotAvailable) {
    return baseExperienceSchema;
  } else if (requiresCurriculum) {
    return requiredCurriculumSchema;
  } else if (curriculumOptional) {
    return optionalCurriculumSchema;
  }

  // Default fallback (should not happen)
  return baseExperienceSchema;
};

type ExperienceFormData = z.infer<ReturnType<typeof createExperienceSchema>>;

interface Step4ExperienceProps {
  initialData?: any;
  onNext: (data: ExperienceFormData) => void;
  onBack: () => void;
  isLoading: boolean;
  tutorLevel?: string;
}

const Step4Experience = forwardRef<HTMLFormElement, Step4ExperienceProps>(
  ({ initialData, onNext, onBack, isLoading, tutorLevel }, ref) => {
    const [certificates, setCertificates] = useState<Certificate[]>(
      Array.isArray(initialData?.certificates) ? initialData.certificates : [],
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);

    // Get tutor level - prioritize prop over initialData
    const actualTutorLevel = tutorLevel || initialData?.tutor_level || "";

    // Determine curriculum requirements
    const isSchoolTeacher = [
      "junior_high_teacher",
      "senior_high_teacher",
    ].includes(actualTutorLevel);
    const isUniversityStudent = actualTutorLevel === "college_student";
    const isUniversityLecturer = actualTutorLevel === "university_lecturer";
    const isPrivateTutor = actualTutorLevel === "private_tutor";
    const isSkilledProfessional = actualTutorLevel === "skilled_professional";

    // Curriculum is REQUIRED for school teachers and university students
    const requiresCurriculum = isSchoolTeacher || isUniversityStudent;

    // Curriculum is NOT available for professional and lecturer tutors
    const curriculumNotAvailable =
      isSkilledProfessional || isUniversityLecturer;

    // Curriculum is OPTIONAL for private tutors
    const curriculumOptional = isPrivateTutor;

    // Show curriculum selector only for those who need it
    const showCurriculum = requiresCurriculum || curriculumOptional;

    const schema = createExperienceSchema(actualTutorLevel);

    // Conditionally build default values
    const getDefaultValues = () => {
      const baseDefaults = {
        has_teaching_experience: initialData?.has_teaching_experience || false,
        tsc_number: initialData?.tsc_number || "",
        teaching_experience_years: initialData?.teaching_experience_years || 0,
        previous_institutions: initialData?.previous_institutions || [],
        professional_experience: initialData?.professional_experience || "",
        portfolio_url: initialData?.portfolio_url || "",
        certificates: initialData?.certificates || [],
        affiliate_code: initialData?.affiliate_code || "",
      };

      // Add selected_curriculums only if curriculum is relevant
      if (requiresCurriculum || curriculumOptional) {
        return {
          ...baseDefaults,
          selected_curriculums: initialData?.selected_curriculums || [],
        };
      }

      return baseDefaults;
    };

    const {
      register,
      handleSubmit,
      watch,
      control,
      setValue,
      trigger,
      formState: { errors, isValid },
    } = useForm<ExperienceFormData>({
      resolver: zodResolver(schema),
      mode: "onChange",
      defaultValues: getDefaultValues(),
    });

    const { fields, append, remove } = useFieldArray({
      control,
      name: "certificates" as any,
    });

    // Use type assertion for watched values to avoid undefined issues
    const hasExperience = watch("has_teaching_experience") ?? false;
    const tscNumber = watch("tsc_number") ?? "";
    const experienceYears = watch("teaching_experience_years") ?? 0;

    // Use type assertion for selectedCurriculums since it may not exist in all schemas
    const selectedCurriculums = (watch as any)("selected_curriculums") as
      | any[]
      | undefined;

    // Update form validity state - FIXED: ensure all values are booleans
    useEffect(() => {
      const checkFormValidity = () => {
        // hasExperience is now guaranteed to be boolean (default false if undefined)
        const hasExperienceStatus = hasExperience !== undefined;

        // Check curriculum requirement - ensure boolean result
        let curriculumValid: boolean = true;
        if (requiresCurriculum) {
          // Explicitly check if selectedCurriculums exists and has length > 0
          curriculumValid = !!(
            selectedCurriculums && selectedCurriculums.length > 0
          );
        }

        if (hasExperience) {
          const hasExperienceDetails = !!(
            tscNumber?.trim() ||
            (experienceYears && experienceYears > 0)
          );
          setIsFormValid(
            hasExperienceStatus && hasExperienceDetails && curriculumValid,
          );
        } else {
          setIsFormValid(hasExperienceStatus && curriculumValid);
        }
      };

      checkFormValidity();
    }, [
      hasExperience,
      tscNumber,
      experienceYears,
      requiresCurriculum,
      selectedCurriculums,
    ]);

    // Handle curriculum selection
    const handleCurriculumChange = (curriculums: SelectedCurriculum[]) => {
      console.log("🎯 Curriculum selection changed:", curriculums);
      (setValue as any)("selected_curriculums", curriculums, {
        shouldValidate: true,
        shouldDirty: true,
      });

      setTimeout(() => {
        (trigger as any)("selected_curriculums");
        trigger();
      }, 50);
    };

    const handleFileUpload = async (fileType: string, url: string) => {
      if (fileType === "certificate") {
        const newCert: Certificate = {
          name: `Certificate ${certificates.length + 1}`,
          url,
          issued_date: new Date().toISOString().split("T")[0],
        };

        const updatedCertificates = [...certificates, newCert];
        setCertificates(updatedCertificates);
        setValue("certificates", updatedCertificates as any);
        await trigger("certificates" as any);
        append(newCert as any);
      }
    };

    const handleFileRemove = (index: number) => {
      remove(index);
      const updatedCertificates = certificates.filter((_, i) => i !== index);
      setCertificates(updatedCertificates);
      setValue("certificates", updatedCertificates as any);
      trigger("certificates" as any);
    };

    const ensureCertificatesArray = (certs: any): any[] => {
      if (Array.isArray(certs)) return certs;
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
      if (isSubmitting || isLoading) return;

      try {
        setIsSubmitting(true);

        // Additional validation
        if (data.has_teaching_experience) {
          if (!data.tsc_number?.trim() && !data.teaching_experience_years) {
            alert(
              "Please provide either TSC number or teaching experience years",
            );
            setIsSubmitting(false);
            return;
          }
        }

        // Validate curriculum requirement
        if (requiresCurriculum) {
          const currentCurriculums = (data as any).selected_curriculums;
          if (!currentCurriculums || currentCurriculums.length === 0) {
            alert(
              "Please select at least one curriculum you're qualified to teach",
            );
            setIsSubmitting(false);
            return;
          }
        }

        const certificatesArray = ensureCertificatesArray(
          (data as any).certificates,
        );

        const cleanedData = {
          ...data,
          has_teaching_experience: Boolean(data.has_teaching_experience),
          certificates: certificatesArray.filter(
            (cert: any) => cert && cert.url && cert.url.trim() !== "",
          ),
          previous_institutions: Array.isArray(data.previous_institutions)
            ? data.previous_institutions
            : [],
        };

        console.log(
          "📤 Submitting experience data with curriculums:",
          (cleanedData as any).selected_curriculums,
        );
        await onNext(cleanedData);
      } catch (error) {
        console.error("Submission error:", error);
        setIsSubmitting(false);
      }
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

    const getCurriculumRequirementText = () => {
      if (curriculumNotAvailable) {
        return "";
      }

      switch (actualTutorLevel) {
        case "college_student":
          return "Select the curriculum(s) you're qualified to teach. University students often tutor in KCSE, Cambridge, or IB based on their high school background.";
        case "junior_high_teacher":
        case "senior_high_teacher":
          return "Select the curriculum(s) you're qualified to teach (e.g., KCSE, Cambridge, IB, etc.). This is required for school teachers.";
        case "private_tutor":
          return "Select the curriculum(s) you specialize in teaching (optional). This helps students find you based on their curriculum needs.";
        default:
          return "";
      }
    };

    // Render info for professional/lecturer tutors about why curriculum is not shown
    const renderProfessionalInfo = () => {
      if (!curriculumNotAvailable) return null;

      return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-blue-600"
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
            </div>
            <div>
              <h4 className="font-medium text-gray-900">
                {actualTutorLevel === "university_lecturer"
                  ? "For University Lecturers"
                  : "For Skilled Professionals"}
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                {actualTutorLevel === "university_lecturer"
                  ? "As a university lecturer, you're recognized for your expertise in higher education. Students will find you based on your subject expertise and professional experience rather than specific school curricula."
                  : "As a skilled professional, your expertise is recognized through your industry experience and professional background. Students will find you based on your skills and practical knowledge."}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                You can still specify your teaching subjects and rates in your
                profile after registration.
              </p>
            </div>
          </div>
        </div>
      );
    };

    return (
      <form
        ref={ref}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
        id="step-4-form"
      >
        <div>
          <h2 className="text-2xl font-semibold text-zinc-700">
            Teaching Experience & Qualifications
          </h2>
          <p className="text-gray-600 mt-2">
            Share your teaching background and what you're qualified to teach
          </p>
        </div>

        <div className="space-y-6">
          {/* Teaching Experience Checkbox */}
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

          {/* Professional/Lecturer Info Message */}
          {renderProfessionalInfo()}

          {/* Helpful info for university students */}
          {actualTutorLevel === "college_student" && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-blue-600"
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
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    For University Students
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    As a university student, you can tutor in various curricula.
                    Select the ones you're comfortable teaching based on your
                    high school background and university coursework. Most
                    university students are qualified to teach KCSE, Cambridge,
                    or IB curricula.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Curriculum Selection - Only for school teachers, university students, and private tutors */}
          {showCurriculum && (
            <div className="border-t border-gray-200 pt-4">
              <CurriculumSelector
                tutorLevel={actualTutorLevel}
                onChange={handleCurriculumChange}
                initialValue={
                  (selectedCurriculums || []) as SelectedCurriculum[]
                }
                disabled={isLoading || isSubmitting}
                required={requiresCurriculum}
              />
              {getCurriculumRequirementText() && (
                <p className="text-sm text-gray-500 mt-2">
                  {getCurriculumRequirementText()}
                </p>
              )}
            </div>
          )}

          {/* Teaching Experience Details */}
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

          {/* Professional Experience Summary */}
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

          {/* Portfolio URL */}
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
          </div>

          {/* Affiliate Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Affiliate/Referral Code (Optional)
            </label>
            <input
              type="text"
              {...register("affiliate_code")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="Enter affiliate or referral code if you have one"
              disabled={isLoading || isSubmitting}
            />
            <p className="mt-1 text-sm text-gray-500">
              If you were referred by an existing tutor or community, enter
              their referral code here
            </p>
          </div>

          {/* Certificates Upload */}
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
                {isFormValid
                  ? "✓ All required information is provided"
                  : "Please complete all required fields"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Required: Teaching experience status
                {hasExperience && " + Either TSC number or experience years"}
                {requiresCurriculum &&
                  " + Select at least one curriculum you're qualified to teach"}
                {curriculumOptional && !requiresCurriculum && (
                  <span className="block text-xs text-purple-600 mt-1">
                    Tip: Adding your teaching curriculum helps students find you
                  </span>
                )}
              </p>
            </div>
            <div className="text-sm text-gray-600">
              {requiresCurriculum &&
                selectedCurriculums &&
                selectedCurriculums.length > 0 && (
                  <span className="text-green-600">
                    ✓ {selectedCurriculums.length} curriculum(s) selected
                  </span>
                )}
              {curriculumOptional &&
                selectedCurriculums &&
                selectedCurriculums.length > 0 && (
                  <span className="text-blue-600">
                    ✓ {selectedCurriculums.length} curriculum(s) added
                  </span>
                )}
              {fields.length > 0 && (
                <span className="ml-2">✓ {fields.length} certificate(s)</span>
              )}
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
