// src/app/components/TitleTab.tsx
"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  Loader2,
  BookOpen,
  GraduationCap,
  Calendar,
  User,
  ChevronDown,
} from "lucide-react";
import client from "@/lib/api/client";

interface Suggestion {
  text: string;
  type: "subject" | "course" | "session" | "tutor";
  metadata: any;
}

interface TitleTabProps {
  selected: string | null;
  hovered: string | null;
  setSelected: React.Dispatch<React.SetStateAction<string | null>>;
  setHovered: React.Dispatch<React.SetStateAction<string | null>>;
  onSearchTermChange?: (term: string) => void;
  onSearch?: (searchTerm: string) => void;
  searchTerm?: string;
}

interface AutocompleteResponse {
  success: boolean;
  data?: Suggestion[];
  message?: string;
}

const TitleTab: React.FC<TitleTabProps> = ({
  selected,
  setSelected,
  hovered,
  setHovered,
  onSearchTermChange,
  onSearch,
  searchTerm: externalSearchTerm = "",
}) => {
  const router = useRouter();
  const [internalSearchTerm, setInternalSearchTerm] =
    useState(externalSearchTerm);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync internal state with external searchTerm
  useEffect(() => {
    setInternalSearchTerm(externalSearchTerm);
  }, [externalSearchTerm]);

  // Notify parent of search term changes - BUT DON'T TRIGGER SEARCH
  useEffect(() => {
    if (onSearchTermChange && internalSearchTerm !== externalSearchTerm) {
      onSearchTermChange(internalSearchTerm);
    }
  }, [internalSearchTerm, onSearchTermChange, externalSearchTerm]);

  // Handle click outside for dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch autocomplete suggestions - ONLY for suggestions, NOT for search
  useEffect(() => {
    if (internalSearchTerm.length < 2) {
      setSuggestions([]);
      return;
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await client.get<AutocompleteResponse>(
          "/tuitions/autocomplete",
          {
            q: internalSearchTerm,
          },
        );
        if (response.success && response.data) {
          setSuggestions(response.data);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error("Autocomplete error:", error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [internalSearchTerm]);

  // This function is ONLY called when user explicitly wants to search
  const handleSearch = (term: string) => {
    console.log("TitleTab handleSearch called with:", term);
    if (!term.trim()) return;

    // Close dropdown
    setIsOpen(false);
    setShowSuggestions(false);
    setSelected(null);

    // Trigger search
    if (onSearch) {
      console.log("Calling onSearch with:", term);
      onSearch(term);
    } else {
      console.log("Pushing to router with:", term);
      router.push(`/search?q=${encodeURIComponent(term)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      // Only search on Enter, not on typing
      handleSearch(internalSearchTerm);
    } else if (e.key === "ArrowDown" && suggestions.length > 0) {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev,
      );
    } else if (e.key === "ArrowUp" && suggestions.length > 0) {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    // When clicking a suggestion, update the input but DON'T search automatically
    setInternalSearchTerm(suggestion.text);
    // Keep dropdown open to show suggestions
    setIsOpen(true);
    setShowSuggestions(true);
    // Optionally focus the input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const clearSearch = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInternalSearchTerm("");
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

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
    setShowSuggestions(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInternalSearchTerm(value);
    // Don't trigger search here, just update the state
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case "subject":
        return <BookOpen className="w-4 h-4 text-purple-500" />;
      case "course":
        return <GraduationCap className="w-4 h-4 text-blue-500" />;
      case "session":
        return <Calendar className="w-4 h-4 text-green-500" />;
      case "tutor":
        return <User className="w-4 h-4 text-orange-500" />;
      default:
        return <Search className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`title-tab-container relative flex h-full w-1/3 px-6 py-2
                 flex-col justify-center items-start
                 hover:bg-hoverbg-grey cursor-pointer
                 transition-colors duration-200 rounded-full
                 ${selected === "title" ? "bg-hoverbg-grey" : "bg-white"}`}
      onMouseEnter={() => setHovered("title")}
      onMouseLeave={() => setHovered(null)}
      onClick={handleTabClick}
    >
      <span className="font-sans text-xs font-semibold text-zinc-700 tracking-wide">
        Subject/Title
      </span>

      {/* Selected item display with clear button */}
      <div className="flex items-center justify-between w-full mt-0.5">
        <span className="text-sm text-zinc-600 truncate max-w-[180px]">
          {internalSearchTerm || "What do you want to learn?"}
        </span>
        <div className="flex items-center gap-1">
          {internalSearchTerm && (
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
          className="absolute left-0 top-full mt-2 w-full min-w-[400px] md:min-w-[500px] bg-white 
                    rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={internalSearchTerm}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onClick={handleInputClick}
                onFocus={() => {
                  setIsOpen(true);
                  setShowSuggestions(true);
                }}
                placeholder="Search subjects, courses, topics, tutors..."
                className="w-full px-4 py-3 pr-20 border-2 border-gray-200 rounded-lg 
                         focus:ring-2 focus:ring-main focus:border-transparent 
                         outline-none transition-all text-base"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {internalSearchTerm && (
                  <button
                    onClick={clearSearch}
                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                    title="Clear search"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                )}
                {loading && (
                  <Loader2 className="w-5 h-5 animate-spin text-main" />
                )}
              </div>
            </div>
          </div>

          {/* Suggestions Panel */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="max-h-96 overflow-y-auto">
              <div className="p-2">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className={`p-3 flex items-start gap-3 rounded-lg cursor-pointer 
                               transition-colors ${
                                 index === selectedIndex
                                   ? "bg-purple-50 border-l-4 border-main"
                                   : "hover:bg-gray-50"
                               }`}
                    onClick={() => handleSuggestionClick(suggestion)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {getSuggestionIcon(suggestion.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {suggestion.text}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {suggestion.type === "subject" && "Subject"}
                        {suggestion.type === "course" && "Course"}
                        {suggestion.type === "session" && "Session"}
                        {suggestion.type === "tutor" && "Tutor"}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <Search className="w-4 h-4 text-gray-300" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick suggestions when no input */}
          {internalSearchTerm.length < 2 && (
            <div className="p-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                Popular searches
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Mathematics",
                  "English",
                  "Science",
                  "Programming",
                  "Kiswahili",
                  "Chemistry",
                  "Physics",
                  "Biology",
                  "History",
                  "Geography",
                ].map((item) => (
                  <button
                    key={item}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log("Popular search clicked:", item);
                      // Update the input but DON'T search automatically
                      setInternalSearchTerm(item);
                      // Keep dropdown open
                      setIsOpen(true);
                      setShowSuggestions(true);
                      // Focus the input
                      if (inputRef.current) {
                        inputRef.current.focus();
                      }
                    }}
                    className="px-4 py-2 bg-gray-100 hover:bg-purple-100 
                             text-gray-700 hover:text-purple-700 
                             rounded-full text-sm transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {internalSearchTerm.length >= 2 &&
            suggestions.length === 0 &&
            !loading && (
              <div className="p-8 text-center">
                <div className="mb-3">
                  <Search className="w-12 h-12 text-gray-300 mx-auto" />
                </div>
                <p className="text-gray-700 font-medium mb-1">
                  No results found for "{internalSearchTerm}"
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Try different keywords or browse all sessions
                </p>
                <button
                  onClick={() => handleSearch(internalSearchTerm)}
                  className="px-6 py-2 bg-main text-white rounded-lg 
                         hover:bg-purple-700 transition-colors text-sm font-medium"
                >
                  Search all sessions
                </button>
              </div>
            )}

          {/* Loading skeleton */}
          {loading && internalSearchTerm.length >= 2 && (
            <div className="p-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 animate-pulse"
                >
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Search button inside dropdown */}
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSearch(internalSearchTerm);
              }}
              className="w-full py-3 bg-main text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Search
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TitleTab;
