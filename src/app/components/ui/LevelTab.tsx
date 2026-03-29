// src/app/components/LevelTab.tsx
"use client";
import React, { useState, useEffect } from "react";
import {
  X,
  ChevronDown,
  Loader2,
  GraduationCap,
  Briefcase,
  School,
} from "lucide-react";
import client from "@/lib/api/client";

interface LevelTabProps {
  selected: string | null;
  hovered: string | null;
  setSelected: React.Dispatch<React.SetStateAction<string | null>>;
  setHovered: React.Dispatch<React.SetStateAction<string | null>>;
  onLevelSelect: (level: string) => void;
  selectedLevel: string;
}

interface Level {
  value: string;
  label: string;
  category?: string;
  description?: string;
  icon?: React.ReactNode;
}

// Education level categories with descriptions
const LEVEL_CATEGORIES = [
  {
    name: "K-12 / Primary & Secondary Education",
    icon: <School className="w-4 h-4" />,
    levels: [
      {
        value: "primary",
        label: "Primary School",
        description: "Grades 1-8, foundational education",
        icon: "📚",
      },
      {
        value: "junior_high",
        label: "Junior High School",
        description: "Grades 7-9, transitional stage",
        icon: "📖",
      },
      {
        value: "senior_high",
        label: "Senior High School",
        description: "Grades 10-12, exam preparation",
        icon: "🎓",
      },
    ],
  },
  {
    name: "Higher Education",
    icon: <GraduationCap className="w-4 h-4" />,
    levels: [
      {
        value: "university",
        label: "University",
        description: "Undergraduate & Postgraduate programs",
        icon: "🏛️",
      },
    ],
  },
  {
    name: "Professional & Adult Education",
    icon: <Briefcase className="w-4 h-4" />,
    levels: [
      {
        value: "adult",
        label: "Adult Education",
        description: "Professional courses, certifications, lifelong learning",
        icon: "💼",
      },
    ],
  },
];

const LevelTab: React.FC<LevelTabProps> = ({
  selected,
  setSelected,
  hovered,
  setHovered,
  onLevelSelect,
  selectedLevel,
}) => {
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Initialize with categorized levels
    const allLevels: Level[] = [
      {
        value: "all",
        label: "All Levels",
        category: "All",
        description: "Browse all education levels",
      },
    ];

    LEVEL_CATEGORIES.forEach((category) => {
      category.levels.forEach((level) => {
        allLevels.push({
          ...level,
          category: category.name,
        });
      });
    });

    setLevels(allLevels);

    // Optionally fetch additional levels from API if needed
    // fetchLevels();
  }, []);

  const fetchLevels = async () => {
    setLoading(true);
    try {
      const response = await client.get<{ success: boolean; data?: Level[] }>(
        "/tuitions/levels",
      );
      if (response.success && response.data && response.data.length > 4) {
        // Merge API levels with categories
        const apiLevels = response.data.map((level) => ({
          ...level,
          category: getCategoryForLevel(level.value),
        }));
        setLevels([
          { value: "all", label: "All Levels", category: "All" },
          ...apiLevels,
        ]);
      }
    } catch (error) {
      console.error("Failed to fetch levels:", error);
      // Keep default levels
    } finally {
      setLoading(false);
    }
  };

  const getCategoryForLevel = (levelValue: string): string => {
    for (const category of LEVEL_CATEGORIES) {
      if (category.levels.some((l) => l.value === levelValue)) {
        return category.name;
      }
    }
    return "Other";
  };

  const getSelectedLabel = () => {
    const level = levels.find((l) => l.value === selectedLevel);
    if (level) {
      return level.label;
    }
    return "Select Level";
  };

  const getSelectedDescription = () => {
    const level = levels.find((l) => l.value === selectedLevel);
    return level?.description || "";
  };

  const handleLevelClick = (value: string) => {
    console.log("LevelTab - handleLevelClick:", value);
    onLevelSelect(value);
    setIsOpen(false);
    setSelected(null);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("LevelTab - handleClear");
    onLevelSelect("all");
  };

  const handleTabClick = () => {
    if (selected === "level") {
      setSelected(null);
      setIsOpen(false);
    } else {
      setSelected("level");
      setIsOpen(true);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".level-tab-container")) {
        setIsOpen(false);
        setSelected(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setSelected]);

  // Group levels by category for display
  const groupedLevels = levels.reduce(
    (acc, level) => {
      if (level.value === "all") return acc;
      const category = level.category || "Other";
      if (!acc[category]) acc[category] = [];
      acc[category].push(level);
      return acc;
    },
    {} as Record<string, Level[]>,
  );

  const categories = Object.keys(groupedLevels);

  return (
    <div
      className={`level-tab-container relative flex h-full w-1/3 px-6 py-2
                 flex-col justify-center items-start
                 hover:bg-hoverbg-grey cursor-pointer
                 transition-colors duration-200 rounded-full 
                 ${selected === "level" ? "bg-hoverbg-grey" : "bg-white"}`}
      onMouseEnter={() => setHovered("level")}
      onMouseLeave={() => setHovered(null)}
      onClick={handleTabClick}
    >
      <span className="font-sans text-xs font-semibold text-zinc-700 tracking-wide">
        Education Level
      </span>

      {/* Selected item display with clear button */}
      <div className="flex items-center justify-between w-full mt-0.5">
        <div className="flex flex-col truncate max-w-[120px]">
          <span className="text-sm text-zinc-600 truncate">
            {selectedLevel !== "all" ? getSelectedLabel() : "Select Level"}
          </span>
          {selectedLevel !== "all" && selectedLevel === "adult" && (
            <span className="text-[10px] text-gray-400 truncate">
              Professional courses
            </span>
          )}
          {selectedLevel !== "all" && selectedLevel === "university" && (
            <span className="text-[10px] text-gray-400 truncate">
              Higher education
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {selectedLevel !== "all" && (
            <button
              onClick={handleClear}
              className="p-0.5 hover:bg-gray-200 rounded-full transition-colors"
              title="Clear selection"
            >
              <X className="w-3.5 h-3.5 text-gray-500" />
            </button>
          )}
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* Dropdown Panel - Full Width with Categories */}
      <div
        className={`absolute left-0 top-full mt-2 w-full min-w-[350px] bg-white 
                    rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50
                    transition-all duration-200 ${!isOpen && "hidden"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-2 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-main" />
            </div>
          ) : (
            <>
              {/* All Levels option at the top */}
              <div
                className={`p-3 rounded-lg cursor-pointer transition-colors mb-2
                           ${selectedLevel === "all" ? "bg-purple-50 border-l-4 border-main" : "hover:bg-gray-50"}`}
                onClick={() => handleLevelClick("all")}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-gray-500" />
                      <p className="text-sm font-medium text-gray-900">
                        All Levels
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 ml-6">
                      Browse all education levels
                    </p>
                  </div>
                  {selectedLevel === "all" && (
                    <span className="text-xs font-medium text-main">
                      Selected
                    </span>
                  )}
                </div>
              </div>

              {/* Category sections */}
              {categories.map((categoryName) => {
                const categoryLevels = groupedLevels[categoryName];
                const categoryIcon = LEVEL_CATEGORIES.find(
                  (c) => c.name === categoryName,
                )?.icon;

                return (
                  <div key={categoryName} className="mb-3">
                    <div className="px-3 py-2 mb-1">
                      <div className="flex items-center gap-2">
                        {categoryIcon}
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          {categoryName}
                        </h4>
                      </div>
                    </div>
                    <div className="space-y-1">
                      {categoryLevels.map((level) => (
                        <div
                          key={level.value}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ml-2
                                     ${
                                       selectedLevel === level.value
                                         ? "bg-purple-50 border-l-4 border-main"
                                         : "hover:bg-gray-50"
                                     }`}
                          onClick={() => handleLevelClick(level.value)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-base">{level.icon}</span>
                                <p className="text-sm font-medium text-gray-900">
                                  {level.label}
                                </p>
                              </div>
                              {level.description && (
                                <p className="text-xs text-gray-500 mt-1 ml-6">
                                  {level.description}
                                </p>
                              )}
                              {/* Additional info for specific levels */}
                              {level.value === "adult" && (
                                <div className="mt-1 ml-6">
                                  <span className="inline-flex items-center gap-1 text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">
                                    <Briefcase className="w-2.5 h-2.5" />
                                    Professional Certifications
                                  </span>
                                  <span className="inline-flex items-center gap-1 text-[10px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded ml-1">
                                    <GraduationCap className="w-2.5 h-2.5" />
                                    Career Development
                                  </span>
                                </div>
                              )}
                              {level.value === "university" && (
                                <div className="mt-1 ml-6">
                                  <span className="inline-flex items-center gap-1 text-[10px] bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded">
                                    <GraduationCap className="w-2.5 h-2.5" />
                                    Bachelor's & Master's
                                  </span>
                                </div>
                              )}
                            </div>
                            {selectedLevel === level.value && (
                              <span className="text-xs font-medium text-main ml-2">
                                Selected
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Helpful note at the bottom */}
        <div className="border-t border-gray-100 p-3 bg-gray-50">
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <GraduationCap className="w-3 h-3" />
            <span>
              {selectedLevel === "adult"
                ? "Adult education includes professional certifications, career development, and lifelong learning programs."
                : selectedLevel === "university"
                  ? "University level includes undergraduate and postgraduate programs."
                  : "Select an education level to find relevant sessions and tutors."}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LevelTab;
