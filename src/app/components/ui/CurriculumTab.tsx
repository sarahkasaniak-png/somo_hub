// src/app/components/CurriculumTab.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import { X, ChevronDown, Loader2, BookOpen } from "lucide-react";
import client from "@/lib/api/client";

interface CurriculumTabProps {
  selected: string | null;
  hovered: string | null;
  setSelected: React.Dispatch<React.SetStateAction<string | null>>;
  setHovered: React.Dispatch<React.SetStateAction<string | null>>;
  onCurriculumSelect: (
    curriculumId: number | null,
    curriculumLevelId: number | null,
  ) => void;
  selectedCurriculumId: number | null;
  selectedCurriculumLevelId: number | null;
  selectedLevel?: string;
}

interface Curriculum {
  id: number;
  uuid: string;
  name: string;
  code: string;
  description: string;
  country: string;
  levels: CurriculumLevel[];
}

interface CurriculumLevel {
  id: number;
  name: string;
  code: string;
  order_index: number;
}

// Education levels that typically have formal curricula
const LEVELS_WITH_CURRICULUM = ["primary", "junior_high", "senior_high"];
// Levels that may or may not have curriculum
const LEVELS_WITH_OPTIONAL_CURRICULUM = ["university"];
// Levels that typically don't have curriculum
const LEVELS_WITHOUT_CURRICULUM = ["adult"];

const CurriculumTab: React.FC<CurriculumTabProps> = ({
  selected,
  hovered,
  setSelected,
  setHovered,
  onCurriculumSelect,
  selectedCurriculumId,
  selectedCurriculumLevelId,
  selectedLevel = "all",
}) => {
  const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCurriculum, setSelectedCurriculum] =
    useState<Curriculum | null>(null);
  const [selectedLevelObj, setSelectedLevelObj] =
    useState<CurriculumLevel | null>(null);
  const [showLevels, setShowLevels] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false); // Track if we're in the process of selecting

  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Determine if curriculum filter should be shown based on selected education level
  const shouldShowCurriculum = () => {
    if (selectedLevel === "all") return true;
    if (LEVELS_WITH_CURRICULUM.includes(selectedLevel)) return true;
    if (LEVELS_WITH_OPTIONAL_CURRICULUM.includes(selectedLevel)) return true;
    return false;
  };

  const shouldShowNoCurriculumOption = () => {
    // Show "No Curriculum" option for university level (some courses may not follow formal curriculum)
    // and for adult education (professional courses, certifications)
    if (selectedLevel === "university") return true;
    if (selectedLevel === "adult") return true;
    return false;
  };

  const shouldForceNoCurriculum = () => {
    // For adult education, force "No Curriculum" (hide curriculum selector)
    return LEVELS_WITHOUT_CURRICULUM.includes(selectedLevel);
  };

  useEffect(() => {
    if (!shouldForceNoCurriculum()) {
      fetchCurriculums();
    }
  }, [selectedLevel]);

  useEffect(() => {
    if (selectedCurriculumId && curriculums.length > 0) {
      const curriculum = curriculums.find((c) => c.id === selectedCurriculumId);
      if (curriculum) {
        setSelectedCurriculum(curriculum);
        if (selectedCurriculumLevelId) {
          const level = curriculum.levels.find(
            (l) => l.id === selectedCurriculumLevelId,
          );
          if (level) setSelectedLevelObj(level);
        } else {
          // If no level is selected, set level to null (All Levels)
          setSelectedLevelObj(null);
        }
      }
    } else if (!selectedCurriculumId) {
      setSelectedCurriculum(null);
      setSelectedLevelObj(null);
    }
  }, [selectedCurriculumId, selectedCurriculumLevelId, curriculums]);

  const fetchCurriculums = async () => {
    setLoading(true);
    try {
      const response = await client.get<{
        success: boolean;
        data: Curriculum[];
      }>("/tuitions/curriculums");
      if (response.success && response.data) {
        // Filter curriculums based on selected level
        let filtered = response.data;

        if (selectedLevel === "primary") {
          // Primary level: show KPSE, Cambridge Primary, IB PYP, British KS1/KS2
          filtered = response.data.filter((c) =>
            ["KPSE", "Cambridge", "British", "IB"].includes(c.code),
          );
        } else if (
          selectedLevel === "junior_high" ||
          selectedLevel === "senior_high"
        ) {
          // Secondary level: show KCSE, Cambridge, British, IB
          filtered = response.data.filter((c) =>
            ["KCSE", "Cambridge", "British", "IB"].includes(c.code),
          );
        } else if (selectedLevel === "university") {
          // University level: show all (some may be relevant for foundation programs)
          filtered = response.data;
        }

        setCurriculums(filtered);
      }
    } catch (error) {
      console.error("Failed to fetch curriculums:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSelectedDisplay = () => {
    if (selectedCurriculum) {
      if (selectedLevelObj) {
        return `${selectedCurriculum.name} - ${selectedLevelObj.name}`;
      }
      return selectedCurriculum.name;
    }
    if (
      selectedCurriculumId === null &&
      selectedLevel !== "all" &&
      shouldShowNoCurriculumOption()
    ) {
      return "No Curriculum / Professional";
    }
    return "Select Curriculum";
  };

  const handleCurriculumClick = (curriculum: Curriculum) => {
    if (selectedCurriculum?.id === curriculum.id) {
      // If same curriculum clicked, toggle level selection
      setShowLevels(!showLevels);
    } else {
      // When selecting a new curriculum, automatically select "All Levels" (null level)
      setIsSelecting(true);
      setSelectedCurriculum(curriculum);
      setSelectedLevelObj(null); // Set to null for "All Levels"
      setShowLevels(true);

      // Immediately notify parent that curriculum is selected with no specific level
      onCurriculumSelect(curriculum.id, null);

      // Keep dropdown open to show levels but mark as selected
      setTimeout(() => {
        setIsSelecting(false);
      }, 100);
    }
  };

  const handleLevelClick = (level: CurriculumLevel, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSelecting(true);
    setSelectedLevelObj(level);
    onCurriculumSelect(selectedCurriculum!.id, level.id);
    setIsOpen(false);
    setSelected(null);
    setShowLevels(false);
    setTimeout(() => {
      setIsSelecting(false);
    }, 100);
  };

  const handleAllLevelsClick = (
    curriculum: Curriculum,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    setIsSelecting(true);
    setSelectedCurriculum(curriculum);
    setSelectedLevelObj(null);
    onCurriculumSelect(curriculum.id, null);
    setIsOpen(false);
    setSelected(null);
    setShowLevels(false);
    setTimeout(() => {
      setIsSelecting(false);
    }, 100);
  };

  const handleNoCurriculumClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSelecting(true);
    setSelectedCurriculum(null);
    setSelectedLevelObj(null);
    onCurriculumSelect(null, null);
    setIsOpen(false);
    setSelected(null);
    setShowLevels(false);
    setTimeout(() => {
      setIsSelecting(false);
    }, 100);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSelecting(true);
    setSelectedCurriculum(null);
    setSelectedLevelObj(null);
    onCurriculumSelect(null, null);
    setTimeout(() => {
      setIsSelecting(false);
    }, 100);
  };

  const handleTabClick = () => {
    if (!shouldShowCurriculum() || shouldForceNoCurriculum()) {
      // Don't open dropdown if curriculum shouldn't be shown
      return;
    }

    if (selected === "curriculum") {
      setSelected(null);
      setIsOpen(false);
      setShowLevels(false);
    } else {
      setSelected("curriculum");
      setIsOpen(true);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setShowLevels(false);
        setSelected(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setSelected]);

  // If curriculum filter shouldn't be shown, render a placeholder
  if (!shouldShowCurriculum() || shouldForceNoCurriculum()) {
    return (
      <div
        className={`curriculum-tab-container relative flex h-full w-1/3 px-6 py-2
                   flex-col justify-center items-start
                   transition-colors duration-200 rounded-full bg-white opacity-60`}
      >
        <span className="font-sans text-xs font-semibold text-zinc-700 tracking-wide">
          Curriculum
        </span>
        <div className="flex items-center justify-between w-full mt-0.5">
          <span className="text-sm text-zinc-600 truncate max-w-[120px]">
            {shouldForceNoCurriculum()
              ? "Professional / No Curriculum"
              : "Not applicable"}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`curriculum-tab-container relative flex h-full w-1/3 px-6 py-2
                 flex-col justify-center items-start
                 hover:bg-hoverbg-grey cursor-pointer
                 transition-colors duration-200 rounded-full
                 ${selected === "curriculum" ? "bg-hoverbg-grey" : "bg-white"} ${isSelecting ? "pointer-events-none opacity-50" : ""}`}
      onMouseEnter={() => setHovered("curriculum")}
      onMouseLeave={() => setHovered(null)}
      onClick={handleTabClick}
    >
      <span className="font-sans text-xs font-semibold text-zinc-700 tracking-wide">
        Curriculum
      </span>

      {/* Selected item display with clear button */}
      <div className="flex items-center justify-between w-full mt-0.5">
        <span className="text-sm text-zinc-600 truncate max-w-[120px]">
          {getSelectedDisplay()}
        </span>
        <div className="flex items-center gap-1">
          {selectedCurriculum && (
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

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute left-0 top-full mt-2 w-full min-w-[350px] bg-white 
                    rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-2 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-main" />
              </div>
            ) : (
              <>
                {/* "No Curriculum" option for university/adult levels */}
                {shouldShowNoCurriculumOption() && (
                  <div
                    className={`p-3 rounded-lg cursor-pointer transition-colors mb-2
                               ${
                                 selectedCurriculumId === null &&
                                 selectedCurriculum === null &&
                                 !selectedLevelObj
                                   ? "bg-purple-50 border-l-4 border-main"
                                   : "hover:bg-gray-50"
                               }`}
                    onClick={handleNoCurriculumClick}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          No Curriculum / Professional
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          For professional courses, certifications, and
                          specialized training
                        </p>
                      </div>
                      {selectedCurriculumId === null &&
                        selectedCurriculum === null &&
                        !selectedLevelObj && (
                          <span className="text-xs font-medium text-main">
                            Selected
                          </span>
                        )}
                    </div>
                  </div>
                )}

                {/* Curriculums */}
                {curriculums.map((curriculum) => (
                  <div key={curriculum.id} className="mb-1">
                    <div
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedCurriculum?.id === curriculum.id
                          ? "bg-purple-50 border-l-4 border-main"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => handleCurriculumClick(curriculum)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {curriculum.name}
                          </p>
                          {curriculum.description && (
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                              {curriculum.description}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-0.5">
                            {curriculum.country}
                          </p>
                        </div>
                        {selectedCurriculum?.id === curriculum.id &&
                          !selectedLevelObj && (
                            <span className="text-xs font-medium text-main">
                              Selected (All Levels)
                            </span>
                          )}
                        {selectedCurriculum?.id === curriculum.id &&
                          selectedLevelObj && (
                            <span className="text-xs font-medium text-main">
                              Selected
                            </span>
                          )}
                      </div>
                    </div>

                    {/* Level submenu */}
                    {showLevels &&
                      selectedCurriculum?.id === curriculum.id &&
                      curriculum.levels.length > 0 && (
                        <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-3">
                          {/* "All Levels" option - set as default when curriculum is selected */}
                          <div
                            className={`p-2 rounded-lg cursor-pointer transition-colors ${
                              !selectedLevelObj
                                ? "bg-purple-100 border-l-2 border-main"
                                : "hover:bg-gray-50"
                            }`}
                            onClick={(e) => handleAllLevelsClick(curriculum, e)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  All Levels
                                </p>
                                <p className="text-xs text-gray-500">
                                  Browse all levels within this curriculum
                                </p>
                              </div>
                              {!selectedLevelObj &&
                                selectedCurriculum?.id === curriculum.id && (
                                  <span className="text-xs font-medium text-main">
                                    Default
                                  </span>
                                )}
                            </div>
                          </div>

                          {curriculum.levels.map((level) => (
                            <div
                              key={level.id}
                              className={`p-2 rounded-lg cursor-pointer transition-colors ${
                                selectedLevelObj?.id === level.id
                                  ? "bg-purple-50"
                                  : "hover:bg-gray-50"
                              }`}
                              onClick={(e) => handleLevelClick(level, e)}
                            >
                              <p className="text-sm text-gray-700">
                                {level.name}
                              </p>
                              <p className="text-xs text-gray-400">
                                {level.code}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                ))}

                {curriculums.length === 0 &&
                  !shouldShowNoCurriculumOption() && (
                    <div className="text-center py-8 text-gray-500">
                      <BookOpen className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">
                        No curricula available for {selectedLevel}
                      </p>
                    </div>
                  )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CurriculumTab;
