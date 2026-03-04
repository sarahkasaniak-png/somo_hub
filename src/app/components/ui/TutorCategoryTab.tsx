// src/app/components/TutorCategoryTab.tsx
"use client";
import React, { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";

interface TutorCategoryTabProps {
  selected: string | null;
  hovered: string | null;
  setSelected: React.Dispatch<React.SetStateAction<string | null>>;
  setHovered: React.Dispatch<React.SetStateAction<string | null>>;
  onCategorySelect: (category: string) => void;
  selectedCategory: string;
}

const TutorCategoryTab: React.FC<TutorCategoryTabProps> = ({
  selected,
  setSelected,
  hovered,
  setHovered,
  onCategorySelect,
  selectedCategory,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const categories = [
    {
      value: "all",
      label: "All Tutors",
      description: "Browse all available tutors",
    },
    {
      value: "featured",
      label: "Featured Tutors",
      description: "Top-rated and recommended tutors",
    },
    {
      value: "popular",
      label: "Most Popular",
      description: "Tutors with the most students",
    },
    {
      value: "new",
      label: "New Tutors",
      description: "Recently joined tutors",
    },
  ];

  const getSelectedLabel = () => {
    const category = categories.find((c) => c.value === selectedCategory);
    return category ? category.label : "All Tutors";
  };

  const handleCategoryClick = (value: string) => {
    console.log("TutorCategoryTab - handleCategoryClick:", value);
    onCategorySelect(value);
    setIsOpen(false);
    setSelected(null);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("TutorCategoryTab - handleClear");
    onCategorySelect("all");
  };

  const handleTabClick = () => {
    if (selected === "category") {
      setSelected(null);
      setIsOpen(false);
    } else {
      setSelected("category");
      setIsOpen(true);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".tutor-category-tab-container")) {
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
      className={`tutor-category-tab-container relative flex h-full w-1/3 px-6 py-2
                 flex-col justify-center items-start
                 hover:bg-hoverbg-grey cursor-pointer
                 transition-colors duration-200 rounded-full
                 ${selected === "category" ? "bg-hoverbg-grey" : "bg-white"}`}
      onMouseEnter={() => setHovered("category")}
      onMouseLeave={() => setHovered(null)}
      onClick={handleTabClick}
    >
      <span className="font-sans text-xs font-semibold text-zinc-700 tracking-wide">
        Tutor Category
      </span>

      <div className="flex items-center justify-between w-full mt-0.5">
        <span className="text-sm text-zinc-600 truncate max-w-[120px]">
          {selectedCategory !== "all" ? getSelectedLabel() : "All Tutors"}
        </span>
        <div className="flex items-center gap-1">
          {selectedCategory !== "all" && (
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

      <div
        className={`absolute left-0 top-full mt-2 w-full min-w-[300px] bg-white 
                    rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50
                    transition-all duration-200 ${!isOpen && "hidden"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-2">
          {categories.map((category) => (
            <div
              key={category.value}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selectedCategory === category.value
                  ? "bg-purple-50 border-l-4 border-main"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => handleCategoryClick(category.value)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {category.label}
                  </p>
                  {category.description && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {category.description}
                    </p>
                  )}
                </div>
                {selectedCategory === category.value && (
                  <span className="text-xs font-medium text-main">
                    Selected
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TutorCategoryTab;
