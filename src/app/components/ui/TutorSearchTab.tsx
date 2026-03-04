// src/app/components/TutorSearchTab.tsx
"use client";
import React, { useState, useRef, useEffect } from "react";
import { Search, X, ChevronDown } from "lucide-react";

interface TutorSearchTabProps {
  selected: string | null;
  hovered: string | null;
  setSelected: React.Dispatch<React.SetStateAction<string | null>>;
  setHovered: React.Dispatch<React.SetStateAction<string | null>>;
  onSearchTermChange?: (term: string) => void;
  onSubjectChange?: (subject: string) => void;
  onSearch?: () => void;
  searchTerm?: string;
  subject?: string;
}

const TutorSearchTab: React.FC<TutorSearchTabProps> = ({
  selected,
  setSelected,
  hovered,
  setHovered,
  onSearchTermChange,
  onSubjectChange,
  onSearch,
  searchTerm: externalSearchTerm = "",
  subject: externalSubject = "",
}) => {
  const [internalSearchTerm, setInternalSearchTerm] =
    useState(externalSearchTerm);
  const [internalSubject, setInternalSubject] = useState(externalSubject);
  const [isOpen, setIsOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const subjectRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync internal state with external props
  useEffect(() => {
    setInternalSearchTerm(externalSearchTerm);
  }, [externalSearchTerm]);

  useEffect(() => {
    setInternalSubject(externalSubject);
  }, [externalSubject]);

  // Handle click outside - EXACTLY like TitleTab
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSelected(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setSelected]);

  // Focus input when opened - like TitleTab
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  const handleTabClick = () => {
    if (selected === "title") {
      setSelected(null);
      setIsOpen(false);
    } else {
      setSelected("title");
      setIsOpen(true);
    }
  };

  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(true);
  };

  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInternalSearchTerm(value);
    if (onSearchTermChange) {
      onSearchTermChange(value);
    }
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInternalSubject(value);
    if (onSubjectChange) {
      onSubjectChange(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleSearch = () => {
    // Close dropdown
    setIsOpen(false);
    setSelected(null);

    // Trigger search
    if (onSearch) {
      onSearch();
    }
  };

  const clearSearch = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInternalSearchTerm("");
    if (onSearchTermChange) {
      onSearchTermChange("");
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const clearSubject = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInternalSubject("");
    if (onSubjectChange) {
      onSubjectChange("");
    }
    if (subjectRef.current) {
      subjectRef.current.focus();
    }
  };

  const handlePopularClick = (item: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setInternalSubject(item);
    if (onSubjectChange) {
      onSubjectChange(item);
    }
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setInternalSearchTerm("");
    setInternalSubject("");
    if (onSearchTermChange) onSearchTermChange("");
    if (onSubjectChange) onSubjectChange("");
  };

  return (
    <div
      ref={containerRef}
      className={`tutor-search-tab-container relative flex h-full w-1/3 px-6 py-2
                 flex-col justify-center items-start
                 hover:bg-hoverbg-grey cursor-pointer
                 transition-colors duration-200 rounded-full
                 ${selected === "title" ? "bg-hoverbg-grey" : "bg-white"}`}
      onMouseEnter={() => setHovered("title")}
      onMouseLeave={() => setHovered(null)}
      onClick={handleTabClick}
    >
      <span className="font-sans text-xs font-semibold text-zinc-700 tracking-wide">
        Search Tutors
      </span>

      {/* Selected item display with clear button */}
      <div className="flex items-center justify-between w-full mt-0.5">
        <span className="text-sm text-zinc-600 truncate max-w-[180px]">
          {internalSearchTerm || internalSubject
            ? `${internalSearchTerm} ${internalSubject ? `(${internalSubject})` : ""}`.trim()
            : "Search by name or subject..."}
        </span>
        <div className="flex items-center gap-1">
          {(internalSearchTerm || internalSubject) && (
            <button
              onClick={clearSearch}
              className="p-0.5 hover:bg-gray-200 rounded-full transition-colors"
              title="Clear search"
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

      {/* Search Input Dropdown - Full Width */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute left-0 top-full mt-2 w-full min-w-[400px] bg-white 
                    rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 border-b border-gray-100">
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Tutor name or keyword
              </label>
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={internalSearchTerm}
                  onChange={handleSearchTermChange}
                  onKeyDown={handleKeyDown}
                  onClick={handleInputClick}
                  onFocus={() => setIsOpen(true)}
                  placeholder="e.g., John, Mary, expert..."
                  className="w-full px-4 py-3 pr-8 border-2 border-gray-200 rounded-lg 
                           focus:ring-2 focus:ring-main focus:border-transparent 
                           outline-none transition-all text-base"
                />
                {internalSearchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Subject (optional)
              </label>
              <div className="relative">
                <input
                  ref={subjectRef}
                  type="text"
                  value={internalSubject}
                  onChange={handleSubjectChange}
                  onKeyDown={handleKeyDown}
                  onClick={handleInputClick}
                  onFocus={() => setIsOpen(true)}
                  placeholder="e.g., Mathematics, English..."
                  className="w-full px-4 py-3 pr-8 border-2 border-gray-200 rounded-lg 
                           focus:ring-2 focus:ring-main focus:border-transparent 
                           outline-none transition-all text-base"
                />
                {internalSubject && (
                  <button
                    onClick={clearSubject}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>
            </div>

            {/* Popular tutor searches */}
            <div className="mt-4">
              <p className="text-xs font-medium text-gray-500 mb-2">
                Popular searches
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Mathematics",
                  "English",
                  "Science",
                  "Programming",
                  "Music",
                ].map((item) => (
                  <button
                    key={item}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setInternalSubject(item);
                      if (onSubjectChange) {
                        onSubjectChange(item);
                      }
                    }}
                    className="px-3 py-1 bg-gray-100 hover:bg-purple-100 
                             text-gray-700 hover:text-purple-700 
                             rounded-full text-xs transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setInternalSearchTerm("");
                  setInternalSubject("");
                  if (onSearchTermChange) onSearchTermChange("");
                  if (onSubjectChange) onSubjectChange("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 
                         rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Clear All
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSearch();
                }}
                className="flex-1 px-4 py-2 bg-main text-white 
                         rounded-lg hover:bg-purple-700 transition-colors text-sm"
              >
                Search Tutors
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorSearchTab;
