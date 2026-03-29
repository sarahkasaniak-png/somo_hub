// src/app/onboarding/tutor/components/CurriculumSelector.tsx
"use client";

import { useState, useEffect } from "react";
import {
  getCurriculums,
  Curriculum,
  SelectedCurriculum,
} from "@/lib/api/curriculum";
import { toast } from "react-hot-toast";

interface CurriculumSelectorProps {
  tutorLevel: string;
  onChange: (selected: SelectedCurriculum[]) => void;
  initialValue?: SelectedCurriculum[];
  disabled?: boolean;
  required?: boolean;
}

export default function CurriculumSelector({
  tutorLevel,
  onChange,
  initialValue = [],
  disabled = false,
  required = false,
}: CurriculumSelectorProps) {
  const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCurriculums, setSelectedCurriculums] =
    useState<SelectedCurriculum[]>(initialValue);
  const [expandedCurriculum, setExpandedCurriculum] = useState<number | null>(
    null,
  );

  // Get appropriate messaging based on tutor level
  const getMessaging = () => {
    switch (tutorLevel) {
      case "college_student":
        return {
          title: "Curriculums You Can Teach",
          description:
            "As a university student, you can tutor in various curricula. Select the ones you're qualified to teach.",
          hint: "You can teach multiple curricula. Choose all that apply based on your expertise.",
        };
      case "junior_high_teacher":
      case "senior_high_teacher":
        return {
          title: "Teaching Curriculum",
          description:
            "Select the curriculum(s) you are qualified to teach. This helps students find the right tutor for their educational system.",
          hint: "Most teachers specialize in one curriculum, but you can select multiple if you're qualified.",
        };
      case "university_lecturer":
        return {
          title: "Curriculum Frameworks",
          description:
            "Select the curriculum frameworks you're qualified to teach at university level.",
          hint: "Optional - select the curriculum frameworks you're experienced with.",
        };
      case "private_tutor":
      case "skilled_professional":
        return {
          title: "Teaching Curriculums (Optional)",
          description:
            "If you tutor specific curricula, select them here. This helps students find you based on their educational system.",
          hint: "Optional - only select if you specialize in teaching specific curricula.",
        };
      default:
        return {
          title: "Qualified to Teach",
          description: "Select the curriculum(s) you are qualified to teach.",
          hint: "Select all that apply.",
        };
    }
  };

  const messaging = getMessaging();

  useEffect(() => {
    const fetchCurriculums = async () => {
      try {
        setLoading(true);
        const data = await getCurriculums();
        setCurriculums(data);
      } catch (error) {
        console.error("Failed to fetch curriculums:", error);
        toast.error("Failed to load curriculum options");
      } finally {
        setLoading(false);
      }
    };

    fetchCurriculums();
  }, []);

  const handleCurriculumToggle = (curriculum: Curriculum) => {
    let newSelection: SelectedCurriculum[];

    const exists = selectedCurriculums.find(
      (c) => c.curriculum_id === curriculum.id,
    );

    if (exists) {
      newSelection = selectedCurriculums.filter(
        (c) => c.curriculum_id !== curriculum.id,
      );
    } else {
      newSelection = [
        ...selectedCurriculums,
        {
          curriculum_id: curriculum.id,
          curriculum_level_id: null,
        },
      ];
    }

    setSelectedCurriculums(newSelection);
    onChange(newSelection);
  };

  const handleLevelChange = (curriculumId: number, levelId: number | null) => {
    const newSelection = selectedCurriculums.map((c) =>
      c.curriculum_id === curriculumId
        ? { ...c, curriculum_level_id: levelId }
        : c,
    );
    setSelectedCurriculums(newSelection);
    onChange(newSelection);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-2 text-gray-600">
          Loading curriculum options...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {messaging.title} {required && "*"}
        </label>
        <p className="text-sm text-gray-500 mb-2">{messaging.description}</p>
        <p className="text-xs text-gray-400 mb-4">{messaging.hint}</p>
      </div>

      <div className="space-y-3">
        {curriculums.map((curriculum) => {
          const isSelected = selectedCurriculums.some(
            (c) => c.curriculum_id === curriculum.id,
          );
          const selectedCurriculum = selectedCurriculums.find(
            (c) => c.curriculum_id === curriculum.id,
          );

          return (
            <div
              key={curriculum.id}
              className={`border rounded-lg transition-colors ${
                isSelected
                  ? "border-purple-400 bg-purple-50"
                  : "border-gray-200"
              }`}
            >
              <div
                className="flex items-center p-4 cursor-pointer"
                onClick={() => !disabled && handleCurriculumToggle(curriculum)}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => {}}
                  className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  disabled={disabled}
                />
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {curriculum.name}
                      </h4>
                      <p className="text-sm text-gray-500">{curriculum.code}</p>
                    </div>
                    {curriculum.levels &&
                      curriculum.levels.length > 0 &&
                      isSelected && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedCurriculum(
                              expandedCurriculum === curriculum.id
                                ? null
                                : curriculum.id,
                            );
                          }}
                          className="text-purple-600 hover:text-purple-800 text-sm"
                        >
                          {expandedCurriculum === curriculum.id
                            ? "Hide levels"
                            : "Select specific level"}
                        </button>
                      )}
                  </div>
                  {curriculum.description && (
                    <p className="text-xs text-gray-500 mt-1">
                      {curriculum.description}
                    </p>
                  )}
                </div>
              </div>

              {expandedCurriculum === curriculum.id &&
                isSelected &&
                curriculum.levels && (
                  <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Specific Level (Optional)
                    </label>
                    <select
                      value={selectedCurriculum?.curriculum_level_id || ""}
                      onChange={(e) =>
                        handleLevelChange(
                          curriculum.id,
                          e.target.value ? parseInt(e.target.value) : null,
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      disabled={disabled}
                    >
                      <option value="">All levels (qualified for all)</option>
                      {curriculum.levels.map((level) => (
                        <option key={level.id} value={level.id}>
                          {level.name} ({level.code})
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Specify which level(s) you're qualified to teach within
                      this curriculum
                    </p>
                  </div>
                )}
            </div>
          );
        })}
      </div>

      {required && selectedCurriculums.length === 0 && (
        <div className="bg-red-50 rounded-lg p-3">
          <p className="text-sm text-red-600">
            Please select at least one curriculum you're qualified to teach
          </p>
        </div>
      )}

      {selectedCurriculums.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <span className="font-medium">You're qualified to teach:</span>{" "}
            {selectedCurriculums
              .map((sc) => {
                const curriculum = curriculums.find(
                  (c) => c.id === sc.curriculum_id,
                );
                const level = curriculum?.levels?.find(
                  (l) => l.id === sc.curriculum_level_id,
                );
                return `${curriculum?.name}${level ? ` (${level.name})` : " (All levels)"}`;
              })
              .join(", ")}
          </p>
          {tutorLevel === "college_student" && (
            <p className="text-xs text-blue-600 mt-2">
              Note: You can update these selections later as you gain more
              teaching experience
            </p>
          )}
        </div>
      )}

      {selectedCurriculums.length === 0 && !required && (
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm text-gray-500">
            You can skip this for now and add your teaching qualifications later
          </p>
        </div>
      )}
    </div>
  );
}
