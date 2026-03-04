// src/app/onboarding/community/components/steps/Step3Verification.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FileUpload from "../FileUpload";

const verificationSchema = z.object({
  logo_url: z.string().url().optional().or(z.literal("")),
  banner_url: z.string().url().optional().or(z.literal("")),
  verification_documents: z
    .array(
      z.object({
        type: z.string(),
        url: z.string().url(),
        name: z.string(),
      }),
    )
    .optional()
    .default([]),
});

type VerificationFormData = z.infer<typeof verificationSchema>;

interface Step3VerificationProps {
  initialData?: any;
  onNext: (data: VerificationFormData) => void;
  onBack: () => void;
  isLoading: boolean;
}

const documentTypes = [
  { value: "registration_certificate", label: "Registration Certificate" },
  { value: "letterhead", label: "Official Letterhead" },
  { value: "director_id", label: "Director's ID" },
  { value: "school_logbook", label: "School Logbook" },
  { value: "ministry_letter", label: "Ministry of Education Letter" },
  { value: "other", label: "Other Official Document" },
];

export default function Step3Verification({
  initialData,
  onNext,
  onBack,
  isLoading,
}: Step3VerificationProps) {
  const [logoUrl, setLogoUrl] = useState(initialData?.logo_url || "");
  const [bannerUrl, setBannerUrl] = useState(initialData?.banner_url || "");
  const [documents, setDocuments] = useState<any[]>(
    initialData?.verification_documents || [],
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      logo_url: initialData?.logo_url || "",
      banner_url: initialData?.banner_url || "",
      verification_documents: initialData?.verification_documents || [],
    },
  });

  const handleFileUpload = async (fileType: string, url: string) => {
    if (fileType === "community_logo") {
      setLogoUrl(url);
      setValue("logo_url", url);
    } else if (fileType === "community_banner") {
      setBannerUrl(url);
      setValue("banner_url", url);
    } else if (fileType === "verification_document") {
      const newDoc = {
        type: "other",
        url,
        name: `Verification Document ${documents.length + 1}`,
      };
      const updatedDocs = [...documents, newDoc];
      setDocuments(updatedDocs);
      setValue("verification_documents", updatedDocs);
    }
  };

  const removeDocument = (index: number) => {
    const updatedDocs = documents.filter((_, i) => i !== index);
    setDocuments(updatedDocs);
    setValue("verification_documents", updatedDocs);
  };

  const onSubmit = async (data: VerificationFormData) => {
    if (isLoading) return;
    onNext(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      id="step-3-form"
    >
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">
          Community Verification
        </h2>
        <p className="text-gray-600 mt-2">
          Help us verify your community with documents and branding
        </p>
      </div>

      <div className="space-y-6">
        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Community Logo (Optional)
          </label>
          <p className="text-sm text-gray-500 mb-4">
            Upload a square logo (recommended: 500x500px, PNG or JPG)
          </p>
          <FileUpload
            fileType="community_logo"
            currentUrl={logoUrl}
            onUploadComplete={handleFileUpload}
            label="Upload Logo"
          />
        </div>

        {/* Banner Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Community Banner (Optional)
          </label>
          <p className="text-sm text-gray-500 mb-4">
            Upload a banner image (recommended: 1200x400px, PNG or JPG)
          </p>
          <FileUpload
            fileType="community_banner"
            currentUrl={bannerUrl}
            onUploadComplete={handleFileUpload}
            label="Upload Banner"
          />
        </div>

        {/* Verification Documents */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Verification Documents
          </label>
          <p className="text-sm text-gray-500 mb-4">
            Upload official documents to verify your community (optional but
            recommended)
          </p>

          <FileUpload
            fileType="verification_document"
            onUploadComplete={handleFileUpload}
            label="Upload Verification Document"
          />

          {documents.length > 0 && (
            <div className="mt-6 space-y-3">
              <h4 className="font-medium text-gray-900">
                Uploaded Documents ({documents.length})
              </h4>
              {documents.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-700">{doc.name}</p>
                      <p className="text-sm text-gray-500 truncate max-w-xs">
                        {doc.url.split("/").pop()}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDocument(index)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Verification Guidelines */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">
            Verification Guidelines
          </h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Schools: Registration certificate or Ministry letter</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>NGOs: Registration documents from relevant authority</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                Study Groups: Letter from institution or group leader ID
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Documents help speed up approval process</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Form validation status */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">
              ✓ Verification documents are optional
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Documents help verify your community faster
            </p>
          </div>
          <div className="text-sm text-gray-600">
            {documents.length > 0
              ? `✓ ${documents.length} document(s) uploaded`
              : "No documents uploaded"}
          </div>
        </div>
      </div>

      <button type="submit" className="hidden">
        Submit
      </button>
    </form>
  );
}
