// src/app/components/TutorCurriculumTab.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import { X, ChevronDown, Loader2, BookOpen, GraduationCap } from "lucide-react";
import client from "@/lib/api/client";

interface TutorCurriculumTabProps {
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

const TutorCurriculumTab: React.FC<TutorCurriculumTabProps> = ({
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
  const [isSelecting, setIsSelecting] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCurriculums();
  }, []);

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
        setCurriculums(response.data);
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
    return "Any Curriculum";
  };

  const handleCurriculumClick = (curriculum: Curriculum) => {
    if (selectedCurriculum?.id === curriculum.id) {
      setShowLevels(!showLevels);
    } else {
      setIsSelecting(true);
      setSelectedCurriculum(curriculum);
      setSelectedLevelObj(null);
      setShowLevels(true);
      onCurriculumSelect(curriculum.id, null);
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
    if (selected === "curriculum") {
      setSelected(null);
      setIsOpen(false);
      setShowLevels(false);
    } else {
      setSelected("curriculum");
      setIsOpen(true);
    }
  };

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

  return (
    <div
      ref={containerRef}
      className={`tutor-curriculum-tab-container relative flex h-full w-1/3 px-6 py-2
                 flex-col justify-center items-start
                 hover:bg-hoverbg-grey cursor-pointer
                 transition-colors duration-200 rounded-full
                 ${selected === "curriculum" ? "bg-hoverbg-grey" : "bg-white"} ${isSelecting ? "pointer-events-none opacity-50" : ""}`}
      onMouseEnter={() => setHovered("curriculum")}
      onMouseLeave={() => setHovered(null)}
      onClick={handleTabClick}
    >
      <span className="font-sans text-xs font-semibold text-zinc-700 tracking-wide">
        Curriculum Expertise
      </span>

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
                {/* "Any Curriculum" option */}
                <div
                  className={`p-3 rounded-lg cursor-pointer transition-colors mb-2
                             ${!selectedCurriculum ? "bg-purple-50 border-l-4 border-main" : "hover:bg-gray-50"}`}
                  onClick={() => {
                    handleClear({
                      stopPropagation: () => {},
                    } as React.MouseEvent);
                    setIsOpen(false);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-gray-500" />
                        <p className="text-sm font-medium text-gray-900">
                          Any Curriculum
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 ml-6">
                        Tutors qualified for any curriculum
                      </p>
                    </div>
                    {!selectedCurriculum && (
                      <span className="text-xs font-medium text-main">
                        Default
                      </span>
                    )}
                  </div>
                </div>

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
                              Selected
                            </span>
                          )}
                      </div>
                    </div>

                    {showLevels &&
                      selectedCurriculum?.id === curriculum.id &&
                      curriculum.levels.length > 0 && (
                        <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-3">
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
                                  Tutors qualified for any level
                                </p>
                              </div>
                              {!selectedLevelObj &&
                                selectedCurriculum?.id === curriculum.id && (
                                  <span className="text-xs font-medium text-main">
                                    Selected
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

                {curriculums.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No curricula available</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Helpful note */}
          <div className="border-t border-gray-100 p-3 bg-gray-50">
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <GraduationCap className="w-3 h-3" />
              <span>
                Find tutors who specialize in teaching specific curricula like
                KCSE, Cambridge, IB, etc.
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorCurriculumTab;
