// src/app/components/LevelTab.tsx
"use client";
import React, { useState, useEffect } from "react";
import { X, ChevronDown, Loader2 } from "lucide-react";
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
}

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
    // fetchLevels();

    setLevels([
      { value: "all", label: "All Levels" },
      { value: "primary", label: "Primary School" },
      { value: "junior_high", label: "Junior High School" },
      { value: "senior_high", label: "Senior High School" },
      { value: "university", label: "University" },
      { value: "adult", label: "Adult Education" },
    ]);
  }, []);

  const fetchLevels = async () => {
    setLoading(true);
    try {
      const response = await client.get("/tuitions/levels");
      if (response.success && response.data && response.data.length > 4) {
        setLevels([{ value: "all", label: "All Levels" }, ...response.data]);
      } else {
        // Fallback to default levels
        setLevels([
          { value: "all", label: "All Levels" },
          { value: "primary", label: "Primary School" },
          { value: "junior_high", label: "Junior High School" },
          { value: "senior_high", label: "Senior High School" },
          { value: "university", label: "University" },
          { value: "adult", label: "Adult Education" },
        ]);
      }
    } catch (error) {
      console.error("Failed to fetch levels:", error);
      // Set default levels on error
      setLevels([
        { value: "all", label: "All Levels" },
        { value: "primary", label: "Primary School" },
        { value: "junior_high", label: "Junior High School" },
        { value: "senior_high", label: "Senior High School" },
        { value: "university", label: "University" },
        { value: "adult", label: "Adult Education" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getSelectedLabel = () => {
    const level = levels.find((l) => l.value === selectedLevel);
    return level ? level.label : "Select Level";
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
        Level
      </span>

      {/* Selected item display with clear button */}
      <div className="flex items-center justify-between w-full mt-0.5">
        <span className="text-sm text-zinc-600 truncate max-w-[120px]">
          {selectedLevel !== "all" ? getSelectedLabel() : "Select Level"}
        </span>
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

      {/* Dropdown Panel - Full Width */}
      <div
        className={`absolute left-0 top-full mt-2 w-full min-w-[300px] bg-white 
                    rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50
                    transition-all duration-200 ${!isOpen && "hidden"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-2">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-main" />
            </div>
          ) : (
            levels.map((level) => (
              <div
                key={level.value}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedLevel === level.value
                    ? "bg-purple-50 border-l-4 border-main"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => handleLevelClick(level.value)}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    {level.label}
                  </p>
                  {selectedLevel === level.value && (
                    <span className="text-xs font-medium text-main">
                      Selected
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LevelTab;
