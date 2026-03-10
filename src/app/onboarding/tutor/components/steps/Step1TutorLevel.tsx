// src/app/onboarding/tutor/components/steps/Step1TutorLevel.tsx
"use client";

import { useState, useEffect, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Update schema with proper validation
const tutorLevelSchema = z
  .object({
    tutor_level: z.enum(
      [
        "college_student",
        "junior_high_teacher",
        "senior_high_teacher",
        "skilled_professional",
        "university_lecturer",
        "private_tutor",
      ],
      {
        errorMap: () => ({ message: "Please select a tutor level" }),
      },
    ),
    portfolio_url: z.string().url().optional().or(z.literal("")).or(z.null()),
    tsc_number: z.string().optional().or(z.literal("")).or(z.null()),
  })
  .refine(
    (data) => {
      // TSC number required for school teachers
      if (
        ["junior_high_teacher", "senior_high_teacher"].includes(
          data.tutor_level,
        )
      ) {
        return data.tsc_number && data.tsc_number.trim() !== "";
      }
      return true;
    },
    {
      message: "TSC number is required for school teachers",
      path: ["tsc_number"],
    },
  );

type TutorLevelFormData = z.infer<typeof tutorLevelSchema>;

interface Step1TutorLevelProps {
  initialData?: any;
  onNext: (data: TutorLevelFormData) => void;
  isLoading: boolean;
}

const tutorLevelOptions = [
  {
    value: "college_student",
    label: "College/University Student",
    description: "Currently studying education or related field",
    icon: "🎓",
    requirements: ["Admission letter", "Student ID"],
  },
  {
    value: "junior_high_teacher",
    label: "Primary School Teacher",
    description: "Certified teacher teaching at primary & junior high level",
    icon: "👨‍🏫",
    requirements: ["TSC number", "Teaching certificate"],
  },
  {
    value: "senior_high_teacher",
    label: "High School Teacher",
    description: "Certified teacher teaching at high school level",
    icon: "👩‍🏫",
    requirements: ["TSC number", "Teaching certificate"],
  },
  {
    value: "university_lecturer",
    label: "University/College Lecturer",
    description: "Lecturer at university level",
    icon: "📚",
    requirements: ["Appointment letter", "Academic qualifications"],
  },
  {
    value: "skilled_professional",
    label: "Skilled Professional",
    description: "Expert in specific field (software, music, languages, etc.)",
    icon: "💼",
    requirements: ["Portfolio/Work samples (recommended)", "Certifications"],
  },
  {
    value: "private_tutor",
    label: "Private Tutor",
    description: "Independent tutor with teaching experience",
    icon: "✏️",
    requirements: ["Teaching experience proof", "References"],
  },
];

const Step1TutorLevel = forwardRef<HTMLFormElement, Step1TutorLevelProps>(
  ({ initialData, onNext, isLoading }, ref) => {
    const [selectedLevel, setSelectedLevel] = useState<string>(
      initialData?.tutor_level || "",
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
      register,
      handleSubmit,
      watch,
      setValue,
      reset,
      formState: { errors, isValid },
    } = useForm<TutorLevelFormData>({
      resolver: zodResolver(tutorLevelSchema),
      mode: "onChange",
      defaultValues: {
        tutor_level: initialData?.tutor_level || "",
        portfolio_url: initialData?.portfolio_url || "",
        tsc_number: initialData?.tsc_number || "",
      },
    });

    // Add useEffect to reset form when initialData changes
    useEffect(() => {
      if (initialData) {
        console.log("Step1TutorLevel - Initial data loaded:", initialData);

        // Reset form with initial data
        reset({
          tutor_level: initialData.tutor_level || "",
          portfolio_url: initialData.portfolio_url || "",
          tsc_number: initialData.tsc_number || "",
        });

        // Also update selectedLevel state
        if (initialData.tutor_level) {
          setSelectedLevel(initialData.tutor_level);
        }
      }
    }, [initialData, reset]);

    const currentLevel = watch("tutor_level");
    const portfolioUrl = watch("portfolio_url");
    const tscNumber = watch("tsc_number");

    useEffect(() => {
      if (currentLevel) {
        setSelectedLevel(currentLevel);
      }
    }, [currentLevel]);

    const handleLevelSelect = (level: string) => {
      setSelectedLevel(level);
      setValue("tutor_level", level as any, { shouldValidate: true });
    };

    const onSubmit = async (data: TutorLevelFormData) => {
      if (isSubmitting || isLoading) return;

      try {
        setIsSubmitting(true);

        console.log("Submitting tutor level data:", data);
        onNext(data);
      } catch (error) {
        console.error("Submission error:", error);
      } finally {
        setIsSubmitting(false);
      }
    };

    // Check if form is ready for submission
    const isFormReady = () => {
      const hasLevel = !!currentLevel;

      if (
        ["junior_high_teacher", "senior_high_teacher"].includes(currentLevel)
      ) {
        return hasLevel && tscNumber?.trim() && isValid;
      }

      return hasLevel && isValid;
    };

    const getRequirements = () => {
      const level = tutorLevelOptions.find((opt) => opt.value === currentLevel);
      return level?.requirements || [];
    };

    const isSkilledProfessional = currentLevel === "skilled_professional";
    const requiresTSC = ["junior_high_teacher", "senior_high_teacher"].includes(
      currentLevel,
    );

    return (
      <form
        ref={ref}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
        id="step-1-form"
      >
        <div>
          <h2 className="text-2xl font-semibold text-zinc-700">
            Tutor Level & Category
          </h2>
          <p className="text-gray-600 mt-2">
            Select your teaching category to customize the application process
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Select Your Teaching Category *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tutorLevelOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleLevelSelect(option.value)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    selectedLevel === option.value
                      ? "border-purple-600 bg-purple-50"
                      : "border-gray-300 hover:border-purple-400 hover:bg-gray-50"
                  }`}
                  disabled={isLoading || isSubmitting}
                >
                  <div className="flex items-start">
                    <div className="text-2xl mr-3">{option.icon}</div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {option.label}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {option.description}
                      </p>
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 font-medium">
                          Requirements:
                        </p>
                        <ul className="text-xs text-gray-600 mt-1">
                          {option.requirements.map((req, idx) => (
                            <li key={idx} className="flex items-center">
                              <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <input type="hidden" {...register("tutor_level")} />
            {errors.tutor_level && (
              <p className="mt-2 text-sm text-red-600">
                {errors.tutor_level.message}
              </p>
            )}
          </div>

          {selectedLevel && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">
                Additional Information Required
              </h4>
              <p className="text-sm text-blue-700">
                Based on your selection, you'll need to provide:
              </p>
              <ul className="mt-2 text-sm text-blue-600">
                {getRequirements().map((req, idx) => (
                  <li key={idx} className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {requiresTSC && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                TSC Registration Number *
              </label>
              <input
                type="text"
                {...register("tsc_number")}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent ${
                  errors.tsc_number ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Enter your TSC registration number"
                disabled={isLoading || isSubmitting}
              />
              {errors.tsc_number && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.tsc_number.message}
                </p>
              )}
            </div>
          )}

          {isSkilledProfessional && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Portfolio or Work Samples URL (Recommended)
              </label>
              <input
                type="url"
                {...register("portfolio_url")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="https://yourportfolio.com or LinkedIn profile URL (optional)"
                disabled={isLoading || isSubmitting}
              />
              <div className="mt-1 space-y-1">
                <p className="text-sm text-gray-500">
                  Share links to your GitHub, Behance, LinkedIn, or personal
                  website
                </p>
                <p className="text-xs text-gray-400">
                  Optional but recommended to showcase your skills
                </p>
              </div>
              {errors.portfolio_url && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.portfolio_url.message}
                </p>
              )}
            </div>
          )}
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
                Required: Select a tutor level
                {requiresTSC && " + TSC number"}
              </p>
            </div>
            <div className="text-sm text-gray-600">
              {selectedLevel
                ? `✓ ${
                    tutorLevelOptions.find((opt) => opt.value === selectedLevel)
                      ?.label
                  }`
                : "No level selected"}
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

Step1TutorLevel.displayName = "Step1TutorLevel";

export default Step1TutorLevel;
