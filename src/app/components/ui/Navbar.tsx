// src/app/components/Navbar.tsx
"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

import {
  UserRound,
  BookOpenCheck,
  SearchIcon,
  X,
  MessageCircleQuestionMark,
  Presentation,
  User2,
  CircleUserRound,
  MonitorCloud,
  ChevronDown,
  Home,
} from "lucide-react";
import CategoryTab from "./CategoryTab";
import LevelTab from "./LevelTab";
import TitleTab from "./TitleTab";
import TutorCategoryTab from "./TutorCategoryTab";
import TutorLevelTab from "./TutorLevelTab";
import TutorSearchTab from "./TutorSearchTab";
import Login from "./Login";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isTutorsPage = pathname === "/tutors";
  const isSessionsPage = pathname === "/sessions";

  const [showHamburgerNav, setShowHamburgerNav] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const [displaySearch, setDisplaySearch] = useState<boolean>(false);
  const [displaySearchCount, setDisplaySearchCount] = useState<number>(0);
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);

  // Scroll state for navbar height and search box size
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileNavVisible, setIsMobileNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const navbarRef = useRef<HTMLDivElement>(null);
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);

  // State to track if search is expanded (when clicked)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Tutor filter states
  const [tutorCategory, setTutorCategory] = useState<string>("all");
  const [tutorLevel, setTutorLevel] = useState<string>("all");
  const [tutorSearchTerm, setTutorSearchTerm] = useState<string>("");
  const [tutorSubject, setTutorSubject] = useState<string>("");

  // Mobile search states
  const [mobileCategory, setMobileCategory] = useState<string>("all");
  const [mobileLevel, setMobileLevel] = useState<string>("all");
  const [mobileSearchTerm, setMobileSearchTerm] = useState<string>("");

  // Mobile dropdown states
  const [showMobileCategoryDropdown, setShowMobileCategoryDropdown] =
    useState(false);
  const [showMobileLevelDropdown, setShowMobileLevelDropdown] = useState(false);

  // Get auth state
  const { user, logout } = useAuth();

  // Refs
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileCategoryRef = useRef<HTMLDivElement>(null);
  const mobileLevelRef = useRef<HTMLDivElement>(null);
  const hamburgerButtonRef = useRef<HTMLDivElement>(null);

  // Handle click on a segment to expand the search bar
  const handleSegmentClick = useCallback(
    (e: React.MouseEvent, segment: string) => {
      e.stopPropagation();
      setIsSearchExpanded(true);
      setIsScrolled(false);

      // Set the selected state to open the corresponding dropdown after a brief delay
      setTimeout(() => {
        if (segment === "category") {
          setSelected("category");
        } else if (segment === "level") {
          setSelected("level");
        } else if (segment === "title") {
          setSelected("title");
        }
      }, 50);
    },
    [],
  );

  // Optimized scroll handler with requestAnimationFrame
  const handleScroll = useCallback(() => {
    if (typeof window === "undefined" || displaySearch) return;

    const currentScrollY = window.scrollY;

    // Set scrolled state for navbar height and search box size
    // Only reduce if search is not expanded
    if (!isSearchExpanded) {
      setIsScrolled(currentScrollY > 20);
    }

    // Handle mobile nav visibility - only update if state would change
    if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
      if (isMobileNavVisible) {
        setIsMobileNavVisible(false);
      }
    } else if (currentScrollY < lastScrollY.current) {
      if (!isMobileNavVisible) {
        setIsMobileNavVisible(true);
      }
    }

    lastScrollY.current = currentScrollY;
  }, [displaySearch, isSearchExpanded, isMobileNavVisible]);

  // Optimized scroll listener with requestAnimationFrame
  useEffect(() => {
    const onScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [handleScroll]);

  // Handle click inside desktop search to expand
  const handleDesktopSearchClick = useCallback(() => {
    if (!displaySearch) {
      setIsSearchExpanded(true);
      setIsScrolled(false); // Reset scrolled state when expanded
    }
  }, [displaySearch]);

  // Handle click outside to collapse
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        desktopSearchRef.current &&
        !desktopSearchRef.current.contains(event.target as Node)
      ) {
        setIsSearchExpanded(false);
        // Re-evaluate scroll state after closing
        setIsScrolled(window.scrollY > 20);
      }

      // Close dropdown when clicking outside, but not when clicking on the hamburger button
      if (
        dropdownRef.current &&
        hamburgerButtonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !hamburgerButtonRef.current.contains(event.target as Node)
      ) {
        setShowHamburgerNav(false);
      }

      if (
        mobileCategoryRef.current &&
        !mobileCategoryRef.current.contains(event.target as Node)
      ) {
        setShowMobileCategoryDropdown(false);
      }
      if (
        mobileLevelRef.current &&
        !mobileLevelRef.current.contains(event.target as Node)
      ) {
        setShowMobileLevelDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent body scroll when search is open
  useEffect(() => {
    if (displaySearch) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = `-${window.scrollY}px`;
      // Reset scrolled state when search opens
      setIsScrolled(false);
      setIsSearchExpanded(false);
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }
  }, [displaySearch]);

  // Memoized handlers
  const handleHamburgerNav = useCallback(() => {
    setShowHamburgerNav((prev) => !prev);
  }, []);

  const openLoginDialog = useCallback(() => {
    setIsLoginOpen(true);
  }, []);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  const handleLevelChange = useCallback((level: string) => {
    setSelectedLevel(level);
  }, []);

  const handleSearchTermChange = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams();

    if (isTutorsPage) {
      if (selectedCategory && selectedCategory !== "all")
        params.append("category", selectedCategory);
      if (selectedLevel && selectedLevel !== "all")
        params.append("level", selectedLevel);
      if (searchTerm) params.append("q", searchTerm);
      router.replace(
        `/tutors${params.toString() ? `?${params.toString()}` : ""}`,
        { scroll: false },
      );
    } else if (isSessionsPage) {
      if (selectedCategory && selectedCategory !== "all")
        params.append("category", selectedCategory);
      if (selectedLevel && selectedLevel !== "all")
        params.append("level", selectedLevel);
      if (searchTerm) params.append("q", searchTerm);
      router.replace(
        `/sessions${params.toString() ? `?${params.toString()}` : ""}`,
        { scroll: false },
      );
    } else {
      if (selectedCategory && selectedCategory !== "all")
        params.append("category", selectedCategory);
      if (selectedLevel && selectedLevel !== "all")
        params.append("level", selectedLevel);
      if (searchTerm) params.append("q", searchTerm);
      router.push(`/search${params.toString() ? `?${params.toString()}` : ""}`);
    }

    setSelected(null);
    setDisplaySearch(false);
    setIsSearchExpanded(false);
  }, [
    isTutorsPage,
    isSessionsPage,
    selectedCategory,
    selectedLevel,
    searchTerm,
    router,
  ]);

  const handleTutorCategoryChange = useCallback((category: string) => {
    setTutorCategory(category);
    updateTutorSearch();
  }, []);

  const handleTutorLevelChange = useCallback((level: string) => {
    setTutorLevel(level);
    updateTutorSearch();
  }, []);

  const handleTutorSearchTermChange = useCallback((term: string) => {
    setTutorSearchTerm(term);
  }, []);

  const handleTutorSubjectChange = useCallback((subject: string) => {
    setTutorSubject(subject);
  }, []);

  const updateTutorSearch = useCallback(() => {
    const params = new URLSearchParams();
    if (tutorCategory && tutorCategory !== "all")
      params.append("category", tutorCategory);
    if (tutorLevel && tutorLevel !== "all") params.append("level", tutorLevel);
    if (tutorSearchTerm) params.append("q", tutorSearchTerm);
    if (tutorSubject) params.append("subject", tutorSubject);

    router.replace(
      `/tutors${params.toString() ? `?${params.toString()}` : ""}`,
      { scroll: false },
    );
  }, [tutorCategory, tutorLevel, tutorSearchTerm, tutorSubject, router]);

  const handleTutorSearch = useCallback(() => {
    updateTutorSearch();
    setSelected(null);
    setDisplaySearch(false);
    setIsSearchExpanded(false);
  }, [updateTutorSearch]);

  const handleProtectedNavigation = useCallback(
    (path: string) => {
      if (!user) {
        setIsLoginOpen(true);
      } else {
        router.push(path);
      }
    },
    [user, router],
  );

  const clearTutorFilters = useCallback(() => {
    setTutorCategory("all");
    setTutorLevel("all");
    setTutorSearchTerm("");
    setTutorSubject("");
    router.replace("/tutors", { scroll: false });
  }, [router]);

  const handleMobileCategorySelect = useCallback((category: string) => {
    setMobileCategory(category);
    setShowMobileCategoryDropdown(false);
    setDisplaySearchCount(1);
  }, []);

  const handleMobileLevelSelect = useCallback((level: string) => {
    setMobileLevel(level);
    setShowMobileLevelDropdown(false);
    setDisplaySearchCount(2);
  }, []);

  const handleMobileSearchTermChange = useCallback((term: string) => {
    setMobileSearchTerm(term);
    if (term) setDisplaySearchCount(3);
  }, []);

  const handleMobileSearch = useCallback(() => {
    const params = new URLSearchParams();
    if (mobileCategory && mobileCategory !== "all")
      params.append("category", mobileCategory);
    if (mobileLevel && mobileLevel !== "all")
      params.append("level", mobileLevel);
    if (mobileSearchTerm) params.append("q", mobileSearchTerm);

    router.push(`/search${params.toString() ? `?${params.toString()}` : ""}`);

    setDisplaySearch(false);
    setSelected(null);
    setDisplaySearchCount(0);
    setShowMobileCategoryDropdown(false);
    setShowMobileLevelDropdown(false);
    setMobileCategory("all");
    setMobileLevel("all");
    setMobileSearchTerm("");
  }, [mobileCategory, mobileLevel, mobileSearchTerm, router]);

  const clearMobileFilters = useCallback(() => {
    setMobileCategory("all");
    setMobileLevel("all");
    setMobileSearchTerm("");
    setDisplaySearchCount(0);
    setShowMobileCategoryDropdown(false);
    setShowMobileLevelDropdown(false);
  }, []);

  const handleLogout = useCallback(async () => {
    await logout();
    router.push("/");
  }, [logout, router]);

  // Memoized display mappings
  const getCategoryDisplay = useCallback((category: string) => {
    const map: Record<string, string> = {
      all: "All Sessions",
      group: "Group Sessions",
      one_on_one: "One-on-One",
    };
    return map[category] || category;
  }, []);

  const getLevelDisplay = useCallback((level: string) => {
    const map: Record<string, string> = {
      all: "All Levels",
      primary: "Primary School",
      junior_high: "Junior High School",
      senior_high: "Senior High School",
      university: "University",
      adult: "Adult Education",
    };
    return map[level] || level;
  }, []);

  const getTutorCategoryDisplay = useCallback((category: string) => {
    const map: Record<string, string> = {
      all: "All Tutors",
      featured: "Featured Tutors",
      popular: "Most Popular",
      new: "New Tutors",
    };
    return map[category] || category;
  }, []);

  const getTutorLevelDisplay = useCallback((level: string) => {
    const map: Record<string, string> = {
      all: "All Levels",
      primary: "Primary",
      junior_high: "Junior High",
      senior_high: "Senior High",
      university: "University",
      adult: "Adult",
    };
    return map[level] || level;
  }, []);

  // Memoized class names for navbar and search box
  const navbarClasses = useMemo(() => {
    return `nav-container transition-all duration-300 ${
      isScrolled && !isSearchExpanded ? "pt-1 pb-0" : "pt-3 pb-1"
    } ${displaySearch ? "shadow-lg" : ""}`;
  }, [isScrolled, displaySearch, isSearchExpanded]);

  const navRowClasses = useMemo(() => {
    return `navbar transition-all duration-300 ${
      isScrolled && !isSearchExpanded ? "py-0" : "py-1"
    }`;
  }, [isScrolled, isSearchExpanded]);

  // Desktop search box classes - shows only labels when reduced, expands when clicked
  const desktopSearchClasses = useMemo(() => {
    const isReduced = isScrolled && !isSearchExpanded;
    return `w-full transition-all duration-300 ${
      isReduced ? "max-w-xl h-12" : "max-w-4xl h-16"
    } m-3 md:m-0 px-0 border border-zinc-300 shadow-md rounded-full bg-white hidden md:flex items-center relative cursor-pointer ${
      isReduced ? "overflow-hidden" : ""
    }`;
  }, [isScrolled, isSearchExpanded]);

  // Mobile search bar classes - completely stable, no transitions
  const mobileSearchBarClasses = useMemo(() => {
    return `w-[90%] mb-3 mt-1 mx-auto relative md:hidden ${
      displaySearch
        ? "hidden"
        : `cursor-pointer shadow-lg h-14 border border-zinc-300 hover:ring-1 hover:ring-zinc-900 bg-white flex flex-col justify-center items-center rounded-full`
    }`;
  }, [displaySearch]);

  // Search icon size based on scroll state
  const searchIconSize = useMemo(() => {
    return isScrolled && !isSearchExpanded ? 16 : 18;
  }, [isScrolled, isSearchExpanded]);

  // Desktop search icon button - bigger in normal view, medium when scrolled
  const searchButtonClasses = useMemo(() => {
    const isReduced = isScrolled && !isSearchExpanded;
    return `transition-all duration-300 ${
      isReduced ? "h-9 w-9" : "h-12 w-12"
    } ${
      !isTutorsPage && selected !== null
        ? isReduced
          ? "w-16"
          : "w-24"
        : isReduced
          ? "w-9"
          : "w-12"
    } bg-main rounded-full flex items-center justify-center hover:ring-1 ring-main hover:bg-main/95 hover:text-main-50 cursor-pointer`;
  }, [isScrolled, isSearchExpanded, isTutorsPage, selected]);

  // Mobile navigation links - with will-change for better performance
  const mobileNavClasses = useMemo(() => {
    if (displaySearch) {
      return "md:hidden hidden";
    }

    return `md:hidden w-full px-6 transition-all duration-300 will-change-transform will-change-opacity overflow-hidden ${
      isMobileNavVisible
        ? "opacity-100 translate-y-0 max-h-20 py-1"
        : "opacity-0 -translate-y-2 max-h-0 py-0 pointer-events-none"
    }`;
  }, [displaySearch, isMobileNavVisible]);

  // Logo and hamburger remain the same size
  const logoClasses = "logo flex items-center gap-0 cursor-pointer select-none";
  const hamburgerContainerClasses = `hamburger-container relative transition-all duration-300 ${
    displaySearch
      ? "bg-white ring-1 ring-zinc-100 shadow-md hover:scale-110"
      : "bg-zinc-200 hover:bg-zinc-300"
  } w-8 h-8`;

  // Handle dropdown item click - closes dropdown after navigation
  const handleDropdownItemClick = useCallback((callback: () => void) => {
    return (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      callback();
      setShowHamburgerNav(false);
    };
  }, []);

  // Handle mobile search click - opens modal and hides search bar
  const handleMobileSearchClick = useCallback(() => {
    setDisplaySearch(true);
  }, []);

  // Handle hamburger X close
  const handleHamburgerClose = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setDisplaySearch(false);
    setSelected(null);
    setDisplaySearchCount(0);
    setMobileCategory("all");
    setMobileLevel("all");
    setMobileSearchTerm("");
    setShowMobileCategoryDropdown(false);
    setShowMobileLevelDropdown(false);
    setShowHamburgerNav(false);
  }, []);

  return (
    <>
      <Login isLoginOpen={isLoginOpen} setIsLoginOpen={setIsLoginOpen} />

      <div className="nav-wrapper">
        <div ref={navbarRef} className={navbarClasses}>
          <nav className={navRowClasses}>
            <div className={logoClasses} onClick={() => router.push("/")}>
              <div className="w-6 h-6 md:w-8 md:h-8">
                <img
                  src="/images/logo_purple.png"
                  alt="SomoHub Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl md:text-2xl font-semibold text-main">
                SomoHub
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <ul className="nav-links hidden md:flex">
              <li>
                <Link
                  href="/"
                  className={`flex flex-col md:flex-row justify-center items-center gap-1 transition-all duration-300 ${
                    pathname === "/"
                      ? "border-b-2 border-b-zinc-400 border-main pb-1"
                      : ""
                  }`}
                >
                  <Home className="w-5 h-5 text-gray-800" />
                  <span className="text-medium text-zinc-600">Home</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/sessions"
                  className={`flex flex-col md:flex-row justify-center items-center gap-1 ${
                    pathname === "/sessions"
                      ? "border-b-2 border-b-zinc-400 border-main pb-1"
                      : ""
                  }`}
                >
                  <BookOpenCheck className="w-5 h-5 text-gray-800" />
                  <span className="text-medium text-zinc-600">Tuition</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/tutors"
                  className={`flex flex-col md:flex-row justify-center items-center gap-1 ${
                    pathname === "/tutors"
                      ? "border-b-2 border-b-zinc-400 border-main pb-1"
                      : ""
                  }`}
                >
                  <UserRound className="w-5 h-5 text-gray-800" />
                  <span className="text-medium text-zinc-600">Tutors</span>
                </Link>
              </li>
            </ul>

            <div className="flex justify-center items-center gap-3">
              {!user ? (
                <span
                  className=" md:flex justify-center items-center font-semibold cursor-pointer hover:bg-zinc-200 py-2 px-3 rounded-3xl"
                  onClick={() => handleProtectedNavigation("/onboarding/tutor")}
                >
                  Become a Tutor
                </span>
              ) : (
                <>
                  {!user?.roles?.includes("tutor") && (
                    <span
                      className=" md:flex justify-center items-center font-semibold cursor-pointer hover:bg-zinc-200 py-2 px-3 rounded-3xl"
                      onClick={() =>
                        handleProtectedNavigation("/onboarding/tutor")
                      }
                    >
                      Become a Tutor
                    </span>
                  )}
                  {user?.roles?.includes("tutor") && (
                    <span
                      className="hidden md:flex justify-center items-center font-semibold cursor-pointer hover:bg-zinc-200 py-2 px-3 rounded-3xl"
                      onClick={() => handleProtectedNavigation("/tutor")}
                    >
                      Switch to Tutor Mode
                    </span>
                  )}
                  <div
                    className="hidden md:flex profile-pic h-10 w-10 rounded-full ring-1 ring-offset-neutral-50 text-zinc-50 bg-zinc-900 justify-center items-center cursor-pointer"
                    onClick={() => {
                      user.roles?.includes("tutor")
                        ? router.push("/tutor")
                        : router.push("/student");
                    }}
                  >
                    <User2 size={18} />
                  </div>
                </>
              )}

              <div
                ref={hamburgerButtonRef}
                className={hamburgerContainerClasses}
                onClick={(e) => {
                  e.stopPropagation();
                  if (displaySearch) {
                    setDisplaySearch(false);
                    setDisplaySearchCount(0);
                    setSelected(null);
                    setMobileCategory("all");
                    setMobileLevel("all");
                    setMobileSearchTerm("");
                    setShowMobileCategoryDropdown(false);
                    setShowMobileLevelDropdown(false);
                  } else {
                    handleHamburgerNav();
                  }
                }}
              >
                {displaySearch || showHamburgerNav ? (
                  <div>
                    <X
                      size={16}
                      strokeWidth={3}
                      className="text-zinc-700 cursor-pointer"
                      onClick={handleHamburgerClose}
                    />
                  </div>
                ) : (
                  <div className="hamburger"></div>
                )}
              </div>
            </div>
          </nav>

          {/* Mobile Navigation Links - with will-change for better performance */}
          <div ref={mobileNavRef} className={mobileNavClasses}>
            <ul className="flex justify-center items-center gap-6 w-full">
              <li>
                <Link
                  href="/"
                  className={`flex flex-col items-center gap-0.5 ${
                    pathname === "/"
                      ? "border-b-2 border-b-zinc-400 border-main pb-0.5"
                      : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDisplaySearch(false);
                  }}
                >
                  <Home className="w-5 h-5 text-gray-800" />
                  <span className="text-[12px] text-zinc-600">Home</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/sessions"
                  className={`flex flex-col items-center gap-0.5 ${
                    pathname === "/sessions"
                      ? "border-b-2 border-b-zinc-400 border-main pb-0.5"
                      : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDisplaySearch(false);
                  }}
                >
                  <BookOpenCheck className="w-5 h-5 text-gray-800" />
                  <span className="text-[12px] text-zinc-600">Tuition</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/tutors"
                  className={`flex flex-col items-center gap-0.5 ${
                    pathname === "/tutors"
                      ? "border-b-2 border-b-zinc-400 border-main pb-0.5"
                      : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDisplaySearch(false);
                  }}
                >
                  <UserRound className="w-5 h-5 text-gray-800" />
                  <span className="text-[12px] text-zinc-600">Tutors</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Hamburger Menu Dropdown */}
        {showHamburgerNav && (
          <div
            ref={dropdownRef}
            className="dropdown-menu z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex flex-col">
              {user && (
                <div className="pb-2 border-b-2 border-zinc-200 flex flex-col justify-start items-start">
                  <div
                    className="w-full font-medium text-zinc-700 flex justify-start items-center gap-2 pb-2 pt-2 px-2 cursor-pointer hover:bg-zinc-100"
                    onClick={handleDropdownItemClick(() => {
                      user?.roles?.includes("tutor")
                        ? handleProtectedNavigation("/tutor/profile")
                        : handleProtectedNavigation("/student/profile");
                    })}
                  >
                    <CircleUserRound size={18} />
                    <span className="text-[14px] font-sans text-zinc-700">
                      Profile
                    </span>
                  </div>
                  <div
                    className="w-full font-medium text-zinc-700 flex justify-start items-center gap-2 pb-2 pt-2 px-2 cursor-pointer hover:bg-zinc-100"
                    onClick={handleDropdownItemClick(() => {
                      user?.roles?.includes("tutor")
                        ? handleProtectedNavigation("/tutor/sessions")
                        : handleProtectedNavigation("/student/schedule");
                    })}
                  >
                    <MonitorCloud size={18} />
                    <span className="text-[14px] font-sans text-zinc-700">
                      My Classes
                    </span>
                  </div>
                </div>
              )}
              <div
                className="font-medium text-zinc-700 flex justify-start items-center gap-2 border-b-2 border-zinc-200 pb-4 pt-4 px-2 cursor-pointer hover:bg-zinc-100"
                onClick={handleDropdownItemClick(() => {
                  router.push("/help/tutor");
                })}
              >
                <MessageCircleQuestionMark size={18} />
                <span className="text-[14px] font-san">Help & Support</span>
              </div>
              <div
                className="font-medium text-zinc-700 flex justify-between items-center border-b-2 border-zinc-200 pb-4 pt-4 px-2 cursor-pointer hover:bg-zinc-100"
                onClick={handleDropdownItemClick(() => {
                  router.push("/tutors");
                })}
              >
                <div className="font-medium text-zinc-700 flex flex-col justify-start items-start">
                  <span className="text-[14px] font-sans text-zinc-700 leading-tight tracking-normal">
                    Tutors
                  </span>
                  <span className="text-zinc-500 text-[13px]">
                    Verified tutors with qualified academic background
                  </span>
                </div>
                <User2 size={30} />
              </div>
              <div
                className="font-medium text-zinc-700 flex justify-between items-center border-b-2 border-zinc-200 pb-4 pt-4 px-2 cursor-pointer hover:bg-zinc-100"
                onClick={handleDropdownItemClick(() => {
                  router.push("/sessions");
                })}
              >
                <div className="font-medium text-zinc-700 flex flex-col justify-start items-start">
                  <span className="text-[14px] font-sans text-zinc-700 leading-tight tracking-normal">
                    Tuition & Sessions
                  </span>
                  <span className="text-zinc-500 text-[13px]">
                    Sessions managed virtually within the app
                  </span>
                </div>
                <BookOpenCheck size={30} />
              </div>
              {!user?.roles?.includes("tutor") && (
                <div
                  className="font-medium text-zinc-700 flex justify-between items-center border-b-2 border-zinc-200 pb-4 pt-4 px-2 cursor-pointer hover:bg-zinc-100"
                  onClick={handleDropdownItemClick(() => {
                    handleProtectedNavigation("/onboarding/tutor");
                  })}
                >
                  <div className="font-medium text-zinc-700 flex flex-col justify-start items-start">
                    <span className="text-[14px] font-sans text-zinc-700 leading-tight tracking-normal">
                      Become a Tutor
                    </span>
                    <span className="text-zinc-500 text-[13px]">
                      It's easy to start and earn an extra income
                    </span>
                  </div>
                  <Presentation size={30} />
                </div>
              )}
              <div
                onClick={handleDropdownItemClick(() => {
                  if (!user) {
                    openLoginDialog();
                  } else {
                    handleLogout();
                  }
                })}
                className="font-medium text-zinc-700 flex justify-start items-center gap-2 border-zinc-200 pb-4 pt-4 px-2 cursor-pointer hover:bg-zinc-100"
              >
                <span className="text-[14px] font-san">
                  {!user ? "Login or sign up" : "Log out"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="pb-1 md:pl-8 md:pr-8 w-full md:pb-5 box-border">
          <div
            ref={searchRef}
            className={`search flex ${
              displaySearch
                ? "flex-col justify-start items-start box-border fixed inset-0 bg-white z-[100] pt-16 overflow-y-auto"
                : "justify-center items-center"
            } w-full md:max-w-4xl md:m-auto`}
          >
            {/* Mobile Search Bar */}
            {!displaySearch && (
              <div
                className={mobileSearchBarClasses}
                onClick={handleMobileSearchClick}
              >
                <div className="flex justify-center items-center gap-2 w-full text-sm">
                  <SearchIcon size={16} strokeWidth={3} />
                  <div className="font-semibold text-zinc-700">
                    Start your search
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Search Modal Content */}
            {displaySearch && (
              <div className="w-full h-full flex flex-col">
                {/* Header with close button */}
                <div className="w-full flex justify-between items-center py-4 px-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {isTutorsPage ? "Find a Tutor" : "Search"}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDisplaySearch(false);
                      setSelected(null);
                      setDisplaySearchCount(0);
                      if (isTutorsPage) {
                        clearTutorFilters();
                      } else {
                        clearMobileFilters();
                      }
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {isTutorsPage ? (
                  // Mobile Tutor Search
                  <div className="flex-1 overflow-y-auto px-4 pb-6">
                    {/* Tutor Category Selection */}
                    <div className="w-full" ref={mobileCategoryRef}>
                      <div
                        className="flex justify-between items-center py-3 border-b border-gray-100 cursor-pointer"
                        onClick={() =>
                          setShowMobileCategoryDropdown(
                            !showMobileCategoryDropdown,
                          )
                        }
                      >
                        <span className="text-sm font-medium text-gray-700">
                          Tutor Category
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text- font-medium">
                            {tutorCategory !== "all"
                              ? getTutorCategoryDisplay(tutorCategory)
                              : "All Tutors"}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                              showMobileCategoryDropdown ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </div>

                      {showMobileCategoryDropdown && (
                        <div className="py-3 space-y-2">
                          {[
                            {
                              value: "all",
                              label: "All Tutors",
                              desc: "Browse all available tutors",
                            },
                            {
                              value: "featured",
                              label: "Featured Tutors",
                              desc: "Top-rated and recommended tutors",
                            },
                            {
                              value: "popular",
                              label: "Most Popular",
                              desc: "Tutors with the most students",
                            },
                            {
                              value: "new",
                              label: "New Tutors",
                              desc: "Recently joined tutors",
                            },
                          ].map((cat) => (
                            <div
                              key={cat.value}
                              className="p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
                              onClick={() => {
                                handleTutorCategoryChange(cat.value);
                                setShowMobileCategoryDropdown(false);
                              }}
                            >
                              <p className="text-sm font-medium text-gray-900">
                                {cat.label}
                              </p>
                              <p className="text-xs text-gray-500">
                                {cat.desc}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Tutor Level Selection */}
                    <div className="w-full" ref={mobileLevelRef}>
                      <div
                        className="flex justify-between items-center py-3 border-b border-gray-100 cursor-pointer"
                        onClick={() =>
                          setShowMobileLevelDropdown(!showMobileLevelDropdown)
                        }
                      >
                        <span className="text-sm font-medium text-gray-700">
                          Education Level
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text- font-medium">
                            {tutorLevel !== "all"
                              ? getTutorLevelDisplay(tutorLevel)
                              : "All Levels"}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                              showMobileLevelDropdown ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </div>

                      {showMobileLevelDropdown && (
                        <div className="py-3 space-y-2 max-h-60 overflow-y-auto">
                          {[
                            { value: "all", label: "All Levels" },
                            { value: "primary", label: "Primary School" },
                            {
                              value: "junior_high",
                              label: "Junior High School",
                            },
                            {
                              value: "senior_high",
                              label: "Senior High School",
                            },
                            { value: "university", label: "University" },
                            { value: "adult", label: "Adult Education" },
                          ].map((lvl) => (
                            <div
                              key={lvl.value}
                              className="p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
                              onClick={() => {
                                handleTutorLevelChange(lvl.value);
                                setShowMobileLevelDropdown(false);
                              }}
                            >
                              <p className="text-sm font-medium text-gray-900">
                                {lvl.label}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Search Inputs */}
                    <div className="w-full">
                      <div className="py-3 border-b border-gray-100">
                        <span className="text-sm font-medium text-gray-700">
                          Search
                        </span>
                      </div>
                      <div className="py-3 space-y-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Tutor name or keyword
                          </label>
                          <input
                            type="text"
                            value={tutorSearchTerm}
                            onChange={(e) => setTutorSearchTerm(e.target.value)}
                            onKeyDown={(e) =>
                              e.key === "Enter" && handleTutorSearch()
                            }
                            placeholder="e.g., John, Mary, expert..."
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring- focus:border-transparent outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Subject (optional)
                          </label>
                          <input
                            type="text"
                            value={tutorSubject}
                            onChange={(e) => setTutorSubject(e.target.value)}
                            onKeyDown={(e) =>
                              e.key === "Enter" && handleTutorSearch()
                            }
                            placeholder="e.g., Mathematics, English..."
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring- focus:border-transparent outline-none"
                          />
                        </div>

                        {/* Popular subjects */}
                        <div className="mt-2">
                          <p className="text-xs font-medium text-gray-500 mb-2">
                            Popular subjects
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
                                onClick={() => setTutorSubject(item)}
                                className="px-3 py-1 bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-purple-700 rounded-full text-xs transition-colors"
                              >
                                {item}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Selected filters summary */}
                        {(tutorCategory !== "all" ||
                          tutorLevel !== "all" ||
                          tutorSearchTerm ||
                          tutorSubject) && (
                          <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                            <p className="text-xs font-medium text-purple-700 mb-2">
                              Selected filters:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {tutorCategory !== "all" && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                                  {getTutorCategoryDisplay(tutorCategory)}
                                  <button
                                    onClick={() => setTutorCategory("all")}
                                    className="ml-1 hover:bg-purple-200 rounded-full p-0.5"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </span>
                              )}
                              {tutorLevel !== "all" && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                  {getTutorLevelDisplay(tutorLevel)}
                                  <button
                                    onClick={() => setTutorLevel("all")}
                                    className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </span>
                              )}
                              {tutorSearchTerm && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                  "{tutorSearchTerm}"
                                  <button
                                    onClick={() => setTutorSearchTerm("")}
                                    className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </span>
                              )}
                              {tutorSubject && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">
                                  {tutorSubject}
                                  <button
                                    onClick={() => setTutorSubject("")}
                                    className="ml-1 hover:bg-amber-200 rounded-full p-0.5"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="w-full mt-4 flex gap-3">
                      <button
                        onClick={clearTutorFilters}
                        className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Clear All
                      </button>
                      <button
                        onClick={handleTutorSearch}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-main to-purple-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-main transition-colors"
                      >
                        Search Tutors
                      </button>
                    </div>
                  </div>
                ) : (
                  // Mobile Session Search
                  <div className="flex-1 overflow-y-auto px-4 pb-6">
                    {/* Category Selection */}
                    <div className="w-full" ref={mobileCategoryRef}>
                      <div
                        className="flex justify-between items-center py-3 border-b border-gray-100 cursor-pointer"
                        onClick={() =>
                          setShowMobileCategoryDropdown(
                            !showMobileCategoryDropdown,
                          )
                        }
                      >
                        <span className="text-sm font-medium text-gray-700">
                          Tuition/Session Category
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text- font-medium">
                            {mobileCategory !== "all"
                              ? getCategoryDisplay(mobileCategory)
                              : "Select Category"}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                              showMobileCategoryDropdown ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </div>

                      {showMobileCategoryDropdown && (
                        <div className="py-3 space-y-2">
                          {[
                            {
                              value: "all",
                              label: "All Sessions",
                              desc: "Browse all available sessions",
                            },
                            {
                              value: "group",
                              label: "Group Sessions",
                              desc: "Learn together with peers",
                            },
                            {
                              value: "one_on_one",
                              label: "One-on-One",
                              desc: "Personalized attention",
                            },
                          ].map((cat) => (
                            <div
                              key={cat.value}
                              className="p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
                              onClick={() =>
                                handleMobileCategorySelect(cat.value)
                              }
                            >
                              <p className="text-sm font-medium text-gray-900">
                                {cat.label}
                              </p>
                              <p className="text-xs text-gray-500">
                                {cat.desc}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Level Selection */}
                    <div className="w-full" ref={mobileLevelRef}>
                      <div
                        className="flex justify-between items-center py-3 border-b border-gray-100 cursor-pointer"
                        onClick={() =>
                          setShowMobileLevelDropdown(!showMobileLevelDropdown)
                        }
                      >
                        <span className="text-sm font-medium text-gray-700">
                          Level
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text- font-medium">
                            {mobileLevel !== "all"
                              ? getLevelDisplay(mobileLevel)
                              : "Select Level"}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                              showMobileLevelDropdown ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </div>

                      {showMobileLevelDropdown && (
                        <div className="py-3 space-y-2 max-h-60 overflow-y-auto">
                          {[
                            { value: "all", label: "All Levels" },
                            { value: "primary", label: "Primary School" },
                            {
                              value: "junior_high",
                              label: "Junior High School",
                            },
                            {
                              value: "senior_high",
                              label: "Senior High School",
                            },
                            { value: "university", label: "University" },
                            { value: "adult", label: "Adult Education" },
                          ].map((lvl) => (
                            <div
                              key={lvl.value}
                              className="p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
                              onClick={() => handleMobileLevelSelect(lvl.value)}
                            >
                              <p className="text-sm font-medium text-gray-900">
                                {lvl.label}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Title/Subject Search */}
                    <div className="w-full">
                      <div className="py-3 border-b border-gray-100">
                        <span className="text-sm font-medium text-gray-700">
                          Search
                        </span>
                      </div>
                      <div className="py-3">
                        <input
                          type="text"
                          value={mobileSearchTerm}
                          onChange={(e) =>
                            handleMobileSearchTermChange(e.target.value)
                          }
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleMobileSearch()
                          }
                          placeholder="Search subjects, courses..."
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring- focus:border-transparent outline-none"
                        />

                        {/* Popular searches */}
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
                              "Kiswahili",
                            ].map((item) => (
                              <button
                                key={item}
                                onClick={() => {
                                  setMobileSearchTerm(item);
                                  handleMobileSearch();
                                }}
                                className="px-3 py-1 bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-purple-700 rounded-full text-xs transition-colors"
                              >
                                {item}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Selected filters summary */}
                        {(mobileCategory !== "all" ||
                          mobileLevel !== "all" ||
                          mobileSearchTerm) && (
                          <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                            <p className="text-xs font-medium text-purple-700 mb-2">
                              Selected filters:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {mobileCategory !== "all" && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                                  {getCategoryDisplay(mobileCategory)}
                                  <button
                                    onClick={() => setMobileCategory("all")}
                                    className="ml-1 hover:bg-purple-200 rounded-full p-0.5"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </span>
                              )}
                              {mobileLevel !== "all" && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                  {getLevelDisplay(mobileLevel)}
                                  <button
                                    onClick={() => setMobileLevel("all")}
                                    className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </span>
                              )}
                              {mobileSearchTerm && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                  "{mobileSearchTerm}"
                                  <button
                                    onClick={() => setMobileSearchTerm("")}
                                    className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="w-full mt-4 flex gap-3">
                      <button
                        onClick={clearMobileFilters}
                        className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Clear All
                      </button>
                      <button
                        onClick={handleMobileSearch}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-main to-purple-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-main transition-colors"
                      >
                        Search
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Desktop Search Bar */}
            <div
              ref={desktopSearchRef}
              className={desktopSearchClasses}
              onClick={handleDesktopSearchClick}
            >
              {isTutorsPage ? (
                // Tutor Search with Category and Level tabs
                <>
                  {isScrolled && !isSearchExpanded ? (
                    // Reduced view - show only labels in equally divided segments
                    <div className="w-full h-full flex items-center">
                      {/* Three equal segments with click handlers */}
                      <div
                        className="flex-1 flex items-center justify-center px-2 cursor-pointer hover:bg-gray-50 h-full transition-colors"
                        onClick={(e) => handleSegmentClick(e, "category")}
                      >
                        <span className="text-xs font-semibold text-gray-700 truncate">
                          {tutorCategory !== "all"
                            ? getTutorCategoryDisplay(tutorCategory)
                            : "Tuition Category"}
                        </span>
                      </div>
                      <div className="h-5 w-px bg-gray-300"></div>
                      <div
                        className="flex-1 flex items-center justify-center px-2 cursor-pointer hover:bg-gray-50 h-full transition-colors"
                        onClick={(e) => handleSegmentClick(e, "level")}
                      >
                        <span className="text-xs font-semibold text-gray-700 truncate">
                          {tutorLevel !== "all"
                            ? getTutorLevelDisplay(tutorLevel)
                            : "Study Level"}
                        </span>
                      </div>
                      <div className="h-5 w-px bg-gray-300"></div>
                      <div
                        className="flex-1 flex items-center justify-center px-2 cursor-pointer hover:bg-gray-50 h-full transition-colors"
                        onClick={(e) => handleSegmentClick(e, "title")}
                      >
                        <span className="text-xs font-semibold text-gray-700 truncate">
                          {tutorSearchTerm || tutorSubject
                            ? "Active"
                            : "Subject/Title"}
                        </span>
                      </div>
                      {/* Search icon at the end */}
                      <div className="flex items-center justify-center px-3">
                        <div
                          className={`${
                            isScrolled && !isSearchExpanded
                              ? "h-9 w-9"
                              : "h-9 w-9"
                          } bg-main rounded-full flex items-center justify-center transition-all duration-300`}
                        >
                          <SearchIcon
                            size={isScrolled && !isSearchExpanded ? 16 : 18}
                            strokeWidth={3}
                            color="white"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Expanded view - show full tabs
                    <>
                      <TutorCategoryTab
                        hovered={hovered}
                        selected={selected}
                        setHovered={setHovered}
                        setSelected={setSelected}
                        onCategorySelect={handleTutorCategoryChange}
                        selectedCategory={tutorCategory}
                      />
                      <div
                        className={`h-[50%] w-px bg-zinc-300 transition-opacity duration-200 ${
                          hovered === "category" ||
                          hovered === "level" ||
                          selected === "category" ||
                          selected === "level"
                            ? "opacity-0"
                            : "opacity-100"
                        }`}
                      ></div>
                      <TutorLevelTab
                        hovered={hovered}
                        selected={selected}
                        setHovered={setHovered}
                        setSelected={setSelected}
                        onLevelSelect={handleTutorLevelChange}
                        selectedLevel={tutorLevel}
                      />
                      <div
                        className={`h-[50%] w-px bg-zinc-300 transition-opacity duration-200 ${
                          hovered === "level" ||
                          hovered === "title" ||
                          selected === "title" ||
                          selected === "level"
                            ? "opacity-0"
                            : "opacity-100"
                        }`}
                      ></div>
                      <TutorSearchTab
                        hovered={hovered}
                        selected={selected}
                        setHovered={setHovered}
                        setSelected={setSelected}
                        onSearchTermChange={handleTutorSearchTermChange}
                        onSubjectChange={handleTutorSubjectChange}
                        onSearch={handleTutorSearch}
                        searchTerm={tutorSearchTerm}
                        subject={tutorSubject}
                      />

                      {/* Search icon button in expanded view */}
                      <div className="px-2">
                        <button
                          onClick={handleTutorSearch}
                          className={searchButtonClasses}
                        >
                          <SearchIcon
                            size={18}
                            strokeWidth={3}
                            color="white"
                            className="hover:text-violet-50"
                          />
                        </button>
                      </div>
                    </>
                  )}
                </>
              ) : (
                // Session Search
                <>
                  {isScrolled && !isSearchExpanded ? (
                    // Reduced view - show only labels in equally divided segments
                    <div className="w-full h-full flex items-center">
                      {/* Three equal segments with click handlers */}
                      <div
                        className="flex-1 flex items-center justify-center px-2 cursor-pointer hover:bg-gray-50 h-full transition-colors"
                        onClick={(e) => handleSegmentClick(e, "category")}
                      >
                        <span className="text-xs font-semibold text-gray-700 truncate">
                          {selectedCategory !== "all"
                            ? getCategoryDisplay(selectedCategory)
                            : "Tuition Category"}
                        </span>
                      </div>
                      <div className="h-5 w-px bg-gray-300"></div>
                      <div
                        className="flex-1 flex items-center justify-center px-2 cursor-pointer hover:bg-gray-50 h-full transition-colors"
                        onClick={(e) => handleSegmentClick(e, "level")}
                      >
                        <span className="text-xs font-semibold text-gray-700 truncate">
                          {selectedLevel !== "all"
                            ? getLevelDisplay(selectedLevel)
                            : "Study Level"}
                        </span>
                      </div>
                      <div className="h-5 w-px bg-gray-300"></div>
                      <div
                        className="flex-1 flex items-center justify-center px-2 cursor-pointer hover:bg-gray-50 h-full transition-colors"
                        onClick={(e) => handleSegmentClick(e, "title")}
                      >
                        <span className="text-xs font-semibold text-gray-700 truncate">
                          {searchTerm ? "Active" : "Subject/Title"}
                        </span>
                      </div>
                      {/* Search icon at the end */}
                      <div className="flex items-center justify-center px-3">
                        <div
                          className={`${
                            isScrolled && !isSearchExpanded
                              ? "h-9 w-9"
                              : "h-9 w-9"
                          } bg-main rounded-full flex items-center justify-center transition-all duration-300`}
                        >
                          <SearchIcon
                            size={isScrolled && !isSearchExpanded ? 16 : 18}
                            strokeWidth={3}
                            color="white"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Expanded view - show full tabs
                    <>
                      <CategoryTab
                        hovered={hovered}
                        selected={selected}
                        setHovered={setHovered}
                        setSelected={setSelected}
                        onCategorySelect={handleCategoryChange}
                        selectedCategory={selectedCategory}
                      />
                      <div
                        className={`h-[50%] w-px bg-zinc-300 transition-opacity duration-200 ${
                          hovered === "category" ||
                          hovered === "level" ||
                          selected === "category" ||
                          selected === "level"
                            ? "opacity-0"
                            : "opacity-100"
                        }`}
                      ></div>
                      <LevelTab
                        hovered={hovered}
                        selected={selected}
                        setHovered={setHovered}
                        setSelected={setSelected}
                        onLevelSelect={handleLevelChange}
                        selectedLevel={selectedLevel}
                      />
                      <div
                        className={`h-[50%] w-px bg-zinc-300 transition-opacity duration-200 ${
                          hovered === "level" ||
                          hovered === "title" ||
                          selected === "title" ||
                          selected === "level"
                            ? "opacity-0"
                            : "opacity-100"
                        }`}
                      ></div>
                      <TitleTab
                        hovered={hovered}
                        selected={selected}
                        setHovered={setHovered}
                        setSelected={setSelected}
                        onSearchTermChange={handleSearchTermChange}
                        onSearch={handleSearch}
                        searchTerm={searchTerm}
                      />

                      {/* Search icon button in expanded view */}
                      <div className="px-2">
                        <button
                          onClick={handleSearch}
                          className={searchButtonClasses}
                        >
                          <SearchIcon
                            size={18}
                            strokeWidth={3}
                            color="white"
                            className="hover:text-violet-50"
                          />
                          {!isTutorsPage && selected !== null && (
                            <span className="text-white text-sm font-semibold ml-1">
                              Search
                            </span>
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
