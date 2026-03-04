"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const settingsSchema = z.object({
  is_public: z.boolean().default(true),
  terms_accepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

interface Step4SettingsProps {
  initialData?: any;
  onNext: (data: SettingsFormData) => void;
  onBack: () => void;
  isLoading: boolean;
}

// Helper component for radio options
const PrivacyOption = ({
  value,
  title,
  description,
  isSelected,
  onSelect,
  disabled,
}: {
  value: boolean;
  title: string;
  description: string;
  isSelected: boolean;
  onSelect: (value: boolean) => void;
  disabled: boolean;
}) => (
  <div
    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
      isSelected
        ? "border-purple-600 bg-purple-50"
        : "border-gray-200 hover:border-gray-300"
    } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    onClick={() => !disabled && onSelect(value)}
  >
    <div className="flex items-center h-5">
      <input
        type="radio"
        name="is_public"
        checked={isSelected}
        onChange={() => !disabled && onSelect(value)}
        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
        disabled={disabled}
      />
    </div>
    <div className="ml-3 flex-1">
      <div className="font-medium text-gray-900">{title}</div>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </div>
  </div>
);

export default function Step4Settings({
  initialData,
  onNext,
  onBack,
  isLoading,
}: Step4SettingsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Convert initial data to proper boolean values
  const getInitialValues = () => {
    const defaults = {
      is_public: true,
      terms_accepted: false,
    };

    if (!initialData) return defaults;

    // Convert is_public to boolean
    let isPublic = defaults.is_public;
    if (initialData.is_public !== undefined && initialData.is_public !== null) {
      if (typeof initialData.is_public === "boolean") {
        isPublic = initialData.is_public;
      } else if (typeof initialData.is_public === "string") {
        isPublic =
          initialData.is_public === "true" || initialData.is_public === "1";
      } else if (typeof initialData.is_public === "number") {
        isPublic = initialData.is_public === 1;
      }
    }

    // Convert terms_accepted to boolean
    let termsAccepted = defaults.terms_accepted;
    if (
      initialData.terms_accepted !== undefined &&
      initialData.terms_accepted !== null
    ) {
      if (typeof initialData.terms_accepted === "boolean") {
        termsAccepted = initialData.terms_accepted;
      } else if (typeof initialData.terms_accepted === "string") {
        termsAccepted =
          initialData.terms_accepted === "true" ||
          initialData.terms_accepted === "1";
      } else if (typeof initialData.terms_accepted === "number") {
        termsAccepted = initialData.terms_accepted === 1;
      }
    }

    return {
      is_public: isPublic,
      terms_accepted: termsAccepted,
    };
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
    trigger,
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    mode: "onChange",
    defaultValues: getInitialValues(),
  });

  const isPublic = watch("is_public");
  const termsAccepted = watch("terms_accepted");

  // Reset form when initialData changes
  useEffect(() => {
    console.log("Step4Settings - Resetting form with:", getInitialValues());
    reset(getInitialValues());
  }, [initialData, reset]);

  const onSubmit = async (data: SettingsFormData) => {
    console.log("Step4Settings - Form submitted:", data);

    if (isLoading || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const isValid = await trigger();
      if (!isValid) return;

      onNext(data);
    } catch (error) {
      console.error("Step4Settings - Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle terms checkbox change
  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("terms_accepted", e.target.checked, { shouldValidate: true });
  };

  // Handle privacy change
  const handlePrivacyChange = (value: boolean) => {
    setValue("is_public", value, { shouldValidate: true });
  };

  const isFormReady = () => {
    return termsAccepted && isValid;
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      id="step-4-form"
    >
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">
          Community Settings
        </h2>
        <p className="text-gray-600 mt-2">
          Configure your community's privacy and finalize application
        </p>
      </div>

      <div className="space-y-6">
        {/* Privacy Settings */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Privacy Settings
          </h3>
          <div className="space-y-4">
            <PrivacyOption
              value={true}
              title="Public Community"
              description="Anyone can discover and request to join. Members can be approved by admins."
              isSelected={isPublic === true}
              onSelect={handlePrivacyChange}
              disabled={isLoading || isSubmitting}
            />

            <PrivacyOption
              value={false}
              title="Private Community"
              description="Only invited members can join. Community won't appear in public listings."
              isSelected={isPublic === false}
              onSelect={handlePrivacyChange}
              disabled={isLoading || isSubmitting}
            />
          </div>
          {errors.is_public && (
            <p className="mt-2 text-sm text-red-600">
              {errors.is_public.message}
            </p>
          )}
        </div>

        {/* Terms and Conditions */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Terms & Conditions
          </h3>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">
                Community Guidelines
              </h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    You are responsible for content posted in your community
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    All communities must comply with SomoHub's code of conduct
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    Educational content must be accurate and appropriate
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    You may not use the platform for commercial purposes without
                    approval
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Community fees are non-refundable after approval</span>
                </li>
              </ul>
            </div>

            <div className="flex items-start p-3 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={handleTermsChange}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mt-1"
                disabled={isLoading || isSubmitting}
              />
              <label htmlFor="terms" className="ml-3 text-sm text-gray-700">
                I agree to the{" "}
                <a
                  href="/terms/community"
                  className="text-purple-600 hover:text-purple-800 font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Community Terms of Service
                </a>{" "}
                and confirm that all information provided is accurate. I
                understand that false information may lead to application
                rejection.
              </label>
            </div>
            {errors.terms_accepted && (
              <p className="text-sm text-red-600">
                {errors.terms_accepted.message}
              </p>
            )}
          </div>
        </div>

        {/* Application Fee */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-4">
            Application Fee
          </h3>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-yellow-700">
                A one-time registration fee of{" "}
                <span className="font-bold">$45</span> is required
              </p>
              <p className="text-sm text-yellow-600 mt-1">
                This fee covers community setup, verification, and lifetime
                access
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-yellow-800">$45.00</p>
            </div>
          </div>
          <div className="text-sm text-yellow-700">
            <p>Fee includes:</p>
            <ul className="mt-1 space-y-1">
              <li>• Community verification and approval</li>
              <li>• Custom community URL</li>
              <li>• Up to 100 members (free)</li>
              <li>• Basic community features</li>
              <li>• Lifetime access (no renewal fees)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Form validation status */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">
              {isFormReady()
                ? "✓ Ready to review application"
                : "Please accept terms and conditions"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Required: Accept terms and conditions
            </p>
          </div>
          <div className="text-sm text-gray-600">
            {isPublic === true
              ? "✓ Public community"
              : isPublic === false
                ? "✓ Private community"
                : "No privacy setting selected"}
          </div>
        </div>
      </div>

      <button type="submit" className="hidden">
        Submit
      </button>
    </form>
  );
}
