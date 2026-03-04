// src/app/onboarding/community/components/steps/Step2BasicInfo.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const basicInfoSchema = z.object({
  name: z.string().min(3, "Community name must be at least 3 characters"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(500, "Description must be less than 500 characters"),
  slug: z
    .string()
    .min(3, "URL must be at least 3 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "URL can only contain lowercase letters, numbers, and hyphens",
    ),
});

type BasicInfoFormData = z.infer<typeof basicInfoSchema>;

interface Step2BasicInfoProps {
  initialData?: any;
  onNext: (data: BasicInfoFormData) => void;
  onBack: () => void;
  isLoading: boolean;
}

export default function Step2BasicInfo({
  initialData,
  onNext,
  onBack,
  isLoading,
}: Step2BasicInfoProps) {
  const [slugPreview, setSlugPreview] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BasicInfoFormData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      slug: initialData?.slug || "",
    },
  });

  const name = watch("name");
  const description = watch("description");
  const slug = watch("slug");

  useEffect(() => {
    if (name) {
      const generatedSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, "-");
      setSlugPreview(generatedSlug);
    }
  }, [name]);

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setValue("slug", value, { shouldValidate: true });
  };

  const useSuggestedSlug = () => {
    setValue("slug", slugPreview, { shouldValidate: true });
  };

  const onSubmit = async (data: BasicInfoFormData) => {
    if (isLoading) return;
    onNext(data);
  };

  const isFormReady = () => {
    return name?.trim() && description?.trim() && slug?.trim();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      id="step-2-form"
    >
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">
          Basic Information
        </h2>
        <p className="text-gray-600 mt-2">
          Provide essential details about your community
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Community Name *
          </label>
          <input
            type="text"
            {...register("name")}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent ${
              errors.name ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="e.g., Nairobi High School Math Club"
            disabled={isLoading}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            This will be the display name of your community
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            {...register("description")}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent ${
              errors.description ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="Describe your community's purpose, goals, and activities..."
            rows={4}
            disabled={isLoading}
          />
          <div className="flex justify-between mt-1">
            <div>
              {errors.description && (
                <p className="text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>
            <p className="text-sm text-gray-500">
              {description.length}/500 characters
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Community URL *
          </label>
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">somo.community/</span>
              </div>
              <input
                type="text"
                value={slug}
                onChange={handleSlugChange}
                className={`pl-32 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent ${
                  errors.slug ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="your-community-name"
                disabled={isLoading}
              />
            </div>
            {slugPreview && slugPreview !== slug && (
              <button
                type="button"
                onClick={useSuggestedSlug}
                className="px-3 py-2 text-sm text-purple-600 hover:text-purple-800 font-medium"
              >
                Use suggested
              </button>
            )}
          </div>
          {errors.slug && (
            <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
          )}
          <div className="mt-2 text-sm text-gray-600">
            <p>
              Suggested URL:{" "}
              <span className="font-medium">somo.community/{slugPreview}</span>
            </p>
            <p className="text-gray-500 mt-1">
              This URL must be unique and cannot be changed later
            </p>
          </div>
        </div>
      </div>

      {/* Form validation status */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">
              {isFormReady()
                ? "✓ All required information provided"
                : "Please complete all required fields"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Required: Name, Description, and Unique URL
            </p>
          </div>
          <div className="text-sm text-gray-600">
            {slug && `✓ URL: somo.community/${slug}`}
          </div>
        </div>
      </div>

      <button type="submit" className="hidden">
        Submit
      </button>
    </form>
  );
}
