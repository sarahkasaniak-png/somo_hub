// src/app/onboarding/community/components/steps/Step1Category.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const categorySchema = z.object({
  category_id: z.number().min(1, "Please select a community type"),
  custom_category: z.string().optional().or(z.literal("")),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface Step1CategoryProps {
  initialData?: any;
  onNext: (data: CategoryFormData) => void;
  isLoading: boolean;
}

const communityCategories = [
  {
    id: 1,
    name: "Primary School",
    description: "Elementary/primary educational institutions",
    icon: "🏫",
    fee: "$45",
  },
  {
    id: 2,
    name: "High School",
    description: "Secondary/high school institutions",
    icon: "🎓",
    fee: "$45",
  },
  {
    id: 3,
    name: "College/University",
    description: "Higher education institutions",
    icon: "🎓",
    fee: "$45",
  },
  {
    id: 4,
    name: "NGO/Non-Profit",
    description: "Non-governmental organizations and non-profits",
    icon: "🤝",
    fee: "$45",
  },
  {
    id: 5,
    name: "Private Tutor Group",
    description: "Groups formed by private tutors",
    icon: "👨‍🏫",
    fee: "$45",
  },
  {
    id: 6,
    name: "Study Group",
    description: "Informal student study groups",
    icon: "📚",
    fee: "$45",
  },
  {
    id: 7,
    name: "Professional Association",
    description: "Professional and industry groups",
    icon: "💼",
    fee: "$45",
  },
  {
    id: 8,
    name: "Other",
    description: "Other types of communities",
    icon: "🔧",
    fee: "$45",
  },
];

export default function Step1Category({
  initialData,
  onNext,
  isLoading,
}: Step1CategoryProps) {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(
    initialData?.category_id || null,
  );
  const [showCustomInput, setShowCustomInput] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      category_id: initialData?.category_id || undefined,
      custom_category: initialData?.custom_category || "",
    },
  });

  const categoryId = watch("category_id");
  const customCategory = watch("custom_category");

  useEffect(() => {
    if (categoryId === 8) {
      setShowCustomInput(true);
    } else {
      setShowCustomInput(false);
    }
  }, [categoryId]);

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategory(categoryId);
    setValue("category_id", categoryId, { shouldValidate: true });
  };

  const onSubmit = async (data: CategoryFormData) => {
    if (isLoading) return;
    onNext(data);
  };

  const isFormReady = () => {
    const hasCategory = !!categoryId;
    const hasCustom = categoryId === 8 ? !!customCategory?.trim() : true;
    return hasCategory && hasCustom;
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      id="step-1-form"
    >
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">
          Select Community Type
        </h2>
        <p className="text-gray-600 mt-2">
          Choose the category that best describes your community
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Community Category *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {communityCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => handleCategorySelect(category.id)}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  selectedCategory === category.id
                    ? "border-purple-600 bg-purple-50"
                    : "border-gray-300 hover:border-purple-400 hover:bg-gray-50"
                }`}
                disabled={isLoading}
              >
                <div className="flex items-start">
                  <div className="text-2xl mr-3">{category.icon}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-gray-900">
                        {category.name}
                      </h3>
                      <span className="text-sm font-medium text-purple-600">
                        {category.fee}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {category.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <input type="hidden" {...register("category_id")} />
          {errors.category_id && (
            <p className="mt-2 text-sm text-red-600">
              {errors.category_id.message}
            </p>
          )}
        </div>

        {showCustomInput && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specify Community Type *
            </label>
            <input
              type="text"
              {...register("custom_category")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="Describe your community type"
              disabled={isLoading}
            />
            {errors.custom_category && (
              <p className="mt-1 text-sm text-red-600">
                {errors.custom_category.message}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Registration Fee Info */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-center">
          <svg
            className="w-5 h-5 text-purple-600 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <p className="text-sm font-medium text-purple-800">
              One-time registration fee: $45
            </p>
            <p className="text-xs text-purple-600 mt-1">
              This fee covers community setup, verification, and lifetime access
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
                ? "✓ Ready to continue"
                : "Please select a community type"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Required: Community category
              {showCustomInput && " + Custom category description"}
            </p>
          </div>
          <div className="text-sm text-gray-600">
            {selectedCategory
              ? `✓ ${
                  communityCategories.find((c) => c.id === selectedCategory)
                    ?.name
                } selected`
              : "No category selected"}
          </div>
        </div>
      </div>

      <button type="submit" className="hidden">
        Submit
      </button>
    </form>
  );
}
