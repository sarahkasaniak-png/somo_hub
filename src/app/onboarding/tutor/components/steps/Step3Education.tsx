// src/app/onboarding/tutor/components/steps/Step3Education.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FileUpload from "../FileUpload";

// Helper to determine document requirements based on tutor level
const getDocumentRequirements = (tutorLevel: string) => {
  console.log("📋 getDocumentRequirements called with:", tutorLevel);

  if (!tutorLevel || tutorLevel.trim() === "") {
    console.log("⚠️ Tutor level is empty");
    return {
      isStudent: false,
      isGraduate: false,
    };
  }

  const studentLevels = ["college_student"];
  const teacherLevels = [
    "junior_high_teacher",
    "senior_high_teacher",
    "university_lecturer",
  ];
  const professionalLevels = ["skilled_professional", "private_tutor"];

  if (studentLevels.includes(tutorLevel)) {
    return {
      isStudent: true,
      isGraduate: false,
    };
  } else if (
    teacherLevels.includes(tutorLevel) ||
    professionalLevels.includes(tutorLevel)
  ) {
    return {
      isStudent: false,
      isGraduate: true,
    };
  }

  return {
    isStudent: false,
    isGraduate: false,
  };
};

// Schema factory based on tutor level
const createEducationSchema = (tutorLevel: string) => {
  const requirements = getDocumentRequirements(tutorLevel);
  const isStudent = requirements.isStudent;
  const isGraduate = requirements.isGraduate;

  return z
    .object({
      highest_education_level: z.enum(
        ["high_school", "diploma", "bachelors", "masters", "phd"],
        {
          errorMap: () => ({ message: "Please select an education level" }),
        },
      ),
      university_name: z.string().min(1, "University name is required"),
      admission_letter_url: z.string().optional().or(z.literal("")),
      admission_number: z.string().optional().or(z.literal("")),
      graduation_certificate_url: z.string().optional().or(z.literal("")),
    })
    .refine(
      (data) => {
        // For STUDENT tutors: require admission letter for higher education levels
        if (
          isStudent &&
          ["diploma", "bachelors", "masters", "phd"].includes(
            data.highest_education_level,
          )
        ) {
          return (
            data.admission_letter_url &&
            data.admission_letter_url.trim() !== "" &&
            data.admission_number &&
            data.admission_number.trim() !== ""
          );
        }
        // For GRADUATE/PROFESSIONAL tutors: require graduation certificate for higher education levels
        if (
          isGraduate &&
          ["diploma", "bachelors", "masters", "phd"].includes(
            data.highest_education_level,
          )
        ) {
          return (
            data.graduation_certificate_url &&
            data.graduation_certificate_url.trim() !== ""
          );
        }
        return true;
      },
      {
        message: isStudent
          ? "Admission letter and admission number are required for student tutors"
          : "Graduation certificate is required for graduate/professional tutors",
        path: isStudent
          ? ["admission_letter_url"]
          : ["graduation_certificate_url"],
      },
    );
};

type EducationFormData = z.infer<ReturnType<typeof createEducationSchema>>;

interface Step3EducationProps {
  initialData?: any;
  onNext: (data: EducationFormData) => void;
  onBack: () => void;
  isLoading: boolean;
  tutorLevel?: string;
}

export default function Step3Education({
  initialData,
  onNext,
  onBack,
  isLoading,
  tutorLevel,
}: Step3EducationProps) {
  console.log("🚀 === Step3Education Component ===");
  console.log("📥 Props received:");
  console.log("- tutorLevel prop:", tutorLevel);
  console.log("- initialData:", initialData);
  console.log("- initialData.tutor_level:", initialData?.tutor_level);

  const [admissionLetterUrl, setAdmissionLetterUrl] = useState(
    initialData?.admission_letter_url || "",
  );
  const [graduationCertificateUrl, setGraduationCertificateUrl] = useState(
    initialData?.graduation_certificate_url || "",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get tutor level - prioritize prop over initialData
  const actualTutorLevel = tutorLevel || initialData?.tutor_level || "";
  console.log("🎯 Actual tutor level determined:", actualTutorLevel);

  const requirements = getDocumentRequirements(actualTutorLevel);
  const isStudent = requirements.isStudent;
  const isGraduate = requirements.isGraduate;

  const educationSchema = createEducationSchema(actualTutorLevel);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    mode: "onChange",
    defaultValues: {
      highest_education_level:
        initialData?.highest_education_level || "bachelors",
      university_name: initialData?.university_name || "",
      admission_letter_url: initialData?.admission_letter_url || "",
      admission_number: initialData?.admission_number || "",
      graduation_certificate_url: initialData?.graduation_certificate_url || "",
    },
  });

  const educationLevel = watch("highest_education_level");
  const universityName = watch("university_name");

  // Determine document requirements based on tutor level and education level
  const requiresAdmissionLetter =
    isStudent &&
    ["diploma", "bachelors", "masters", "phd"].includes(educationLevel);

  const requiresGraduationCertificate =
    isGraduate &&
    ["diploma", "bachelors", "masters", "phd"].includes(educationLevel);

  // Add tutor_level to form submission
  const handleSubmitWithTutorLevel = async (data: EducationFormData) => {
    console.log(
      "📤 Submitting education data with tutor_level:",
      actualTutorLevel,
    );
    const dataWithTutorLevel = {
      ...data,
      // tutor_level: actualTutorLevel, // Ensure tutor_level is included
    };
    onNext(dataWithTutorLevel);
  };

  useEffect(() => {
    console.log("🔍 Step3Education Debug:");
    console.log("actualTutorLevel:", actualTutorLevel);
    console.log("isStudent:", isStudent);
    console.log("isGraduate:", isGraduate);
    console.log("educationLevel:", educationLevel);
    console.log("requiresAdmissionLetter:", requiresAdmissionLetter);
    console.log(
      "requiresGraduationCertificate:",
      requiresGraduationCertificate,
    );
  }, [actualTutorLevel, isStudent, isGraduate, educationLevel]);

  useEffect(() => {
    if (admissionLetterUrl) {
      setValue("admission_letter_url", admissionLetterUrl, {
        shouldValidate: true,
      });
    }
  }, [admissionLetterUrl, setValue]);

  useEffect(() => {
    if (graduationCertificateUrl) {
      setValue("graduation_certificate_url", graduationCertificateUrl, {
        shouldValidate: true,
      });
    }
  }, [graduationCertificateUrl, setValue]);

  const handleFileUpload = async (fileType: string, url: string) => {
    if (fileType === "admission_letter") {
      setAdmissionLetterUrl(url);
      setValue("admission_letter_url", url, { shouldValidate: true });
      await trigger("admission_letter_url");
    } else if (fileType === "graduation_certificate") {
      setGraduationCertificateUrl(url);
      setValue("graduation_certificate_url", url, { shouldValidate: true });
      await trigger("graduation_certificate_url");
    }
  };

  const handleFileRemove = async (fileType: string) => {
    if (fileType === "admission_letter") {
      setAdmissionLetterUrl("");
      setValue("admission_letter_url", "", { shouldValidate: true });
      await trigger("admission_letter_url");
    } else if (fileType === "graduation_certificate") {
      setGraduationCertificateUrl("");
      setValue("graduation_certificate_url", "", { shouldValidate: true });
      await trigger("graduation_certificate_url");
    }
  };

  const onSubmit = async (data: EducationFormData) => {
    if (isSubmitting || isLoading) return;

    try {
      setIsSubmitting(true);

      if (
        requiresAdmissionLetter &&
        (!admissionLetterUrl || !data.admission_number)
      ) {
        alert("Please upload admission letter and provide admission number");
        return;
      }

      if (requiresGraduationCertificate && !graduationCertificateUrl) {
        alert("Please upload graduation certificate");
        return;
      }

      await handleSubmitWithTutorLevel(data);
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if form is ready for submission
  const isFormReady = () => {
    const hasBasicInfo = educationLevel && universityName.trim();

    if (requiresAdmissionLetter) {
      return (
        hasBasicInfo &&
        admissionLetterUrl &&
        watch("admission_number")?.trim() &&
        isValid
      );
    }

    if (requiresGraduationCertificate) {
      return hasBasicInfo && graduationCertificateUrl && isValid;
    }

    return hasBasicInfo && isValid;
  };

  // Get document label based on tutor level
  const getDocumentLabel = () => {
    if (isStudent) return "Admission Letter/Proof of Enrollment *";
    if (isGraduate) return "Graduation Certificate/Diploma *";
    return "Education Proof *";
  };

  const getDocumentDescription = () => {
    if (isStudent) {
      return "Required for Diploma, Bachelor's, Master's, and PhD levels";
    }
    if (isGraduate) {
      return "Required for Diploma, Bachelor's, Master's, and PhD levels";
    }
    return "Required for higher education levels";
  };

  // Get display name for tutor level
  const getTutorLevelDisplay = (level: string) => {
    const levelMap: Record<string, string> = {
      college_student: "College Student",
      junior_high_teacher: "Junior High Teacher",
      senior_high_teacher: "Senior High Teacher",
      skilled_professional: "Skilled Professional",
      university_lecturer: "University Lecturer",
      private_tutor: "Private Tutor",
    };
    return levelMap[level] || level.replace("_", " ").toUpperCase();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      id="step-3-form"
    >
      <div>
        <h2 className="text-2xl font-semibold text-zinc-700">
          Education Background
        </h2>
        <p className="text-gray-600 mt-2">
          Tell us about your educational qualifications
        </p>
        {/* {actualTutorLevel ? (
          <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
            Tutor Level:{" "}
            <span className="font-medium ml-1">
              {getTutorLevelDisplay(actualTutorLevel)}
            </span>
          </div>
        ) : (
          <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">
            ⚠️ ERROR: Tutor level not found. Please go back to Step 1.
            <button
              type="button"
              onClick={onBack}
              className="ml-2 text-red-600 underline"
            >
              Go to Step 1
            </button>
          </div>
        )}
        {actualTutorLevel && (
          <div className="mt-2 text-sm text-gray-600">
            {isStudent &&
              "✓ Student tutor - Admission letter required for higher education"}
            {isGraduate &&
              "✓ Graduate/Professional - Graduation certificate required for higher education"}
          </div>
        )} */}
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Highest Education Level *
          </label>
          <select
            {...register("highest_education_level")}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent ${
              errors.highest_education_level
                ? "border-red-300"
                : "border-gray-300"
            }`}
            disabled={isLoading || isSubmitting || !actualTutorLevel}
          >
            <option value="high_school">High School</option>
            <option value="diploma">Diploma</option>
            <option value="bachelors">Bachelor's Degree</option>
            <option value="masters">Master's Degree</option>
            <option value="phd">PhD</option>
          </select>
          {errors.highest_education_level && (
            <p className="mt-1 text-sm text-red-600">
              {errors.highest_education_level.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            University/Institution Name *
          </label>
          <input
            type="text"
            {...register("university_name")}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent ${
              errors.university_name ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="Enter university or institution name"
            disabled={isLoading || isSubmitting || !actualTutorLevel}
          />
          {errors.university_name && (
            <p className="mt-1 text-sm text-red-600">
              {errors.university_name.message}
            </p>
          )}
        </div>

        {requiresAdmissionLetter && (
          <FileUpload
            fileType="admission_letter" // This is correct
            currentUrl={admissionLetterUrl}
            onUploadComplete={(type, url) =>
              handleFileUpload("admission_letter", url)
            }
            onRemove={() => handleFileRemove("admission_letter")}
            label="Upload Admission Letter"
          />
        )}

        {requiresGraduationCertificate && (
          <FileUpload
            fileType="graduation_certificate" // This should be "graduation_certificate"
            currentUrl={graduationCertificateUrl}
            onUploadComplete={(type, url) =>
              handleFileUpload("graduation_certificate", url)
            }
            onRemove={() => handleFileRemove("graduation_certificate")}
            label="Upload Graduation Certificate"
          />
        )}

        {/* Debug panel */}
        {/* <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="font-medium text-blue-800 mb-2">Data Status</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-blue-600">Tutor Level:</span>
              <span
                className={`ml-2 font-medium ${
                  actualTutorLevel ? "text-green-600" : "text-red-600"
                }`}
              >
                {actualTutorLevel || "Not found"}
              </span>
            </div>
            <div>
              <span className="text-blue-600">From Props:</span>
              <span className="ml-2">{tutorLevel || "undefined"}</span>
            </div>
            <div>
              <span className="text-blue-600">From Initial Data:</span>
              <span className="ml-2">
                {initialData?.tutor_level || "undefined"}
              </span>
            </div>
            <div>
              <span className="text-blue-600">Document Required:</span>
              <span className="ml-2 font-medium">
                {requiresAdmissionLetter && "Admission Letter"}
                {requiresGraduationCertificate && "Graduation Certificate"}
                {!requiresAdmissionLetter &&
                  !requiresGraduationCertificate &&
                  "None"}
              </span>
            </div>
          </div>
        </div> */}
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
              Required: Education Level and University Name
              {requiresAdmissionLetter && " + Admission Letter & Number"}
              {requiresGraduationCertificate && " + Graduation Certificate"}
            </p>
          </div>
          <div className="text-sm text-gray-600">
            {requiresAdmissionLetter &&
              admissionLetterUrl &&
              "✓ Admission letter uploaded"}
            {requiresAdmissionLetter &&
              !admissionLetterUrl &&
              "Admission letter required"}
            {requiresGraduationCertificate &&
              graduationCertificateUrl &&
              "✓ Graduation certificate uploaded"}
            {requiresGraduationCertificate &&
              !graduationCertificateUrl &&
              "Graduation certificate required"}
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
