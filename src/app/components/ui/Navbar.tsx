// src/app/components/Navbar.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

import {
  UserRound,
  BookOpenCheck,
  CirclePile,
  SearchIcon,
  X,
  MessageCircleQuestionMark,
  Presentation,
  School,
  User2,
  MessageSquare,
  CircleUserRound,
  MonitorCloud,
  ChevronDown,
  GraduationCap,
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

  // Scroll state for mobile nav
  const [showMobileNav, setShowMobileNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [navbarHeight, setNavbarHeight] = useState("auto");

  // Filter states for sessions
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Tutor filter states
  const [tutorCategory, setTutorCategory] = useState<string>("all");
  const [tutorLevel, setTutorLevel] = useState<string>("all");
  const [tutorSearchTerm, setTutorSearchTerm] = useState<string>("");
  const [tutorSubject, setTutorSubject] = useState<string>("");

  // Mobile search states - separate from desktop
  const [mobileCategory, setMobileCategory] = useState<string>("all");
  const [mobileLevel, setMobileLevel] = useState<string>("all");
  const [mobileSearchTerm, setMobileSearchTerm] = useState<string>("");

  // Mobile dropdown states - separate
  const [showMobileCategoryDropdown, setShowMobileCategoryDropdown] =
    useState(false);
  const [showMobileLevelDropdown, setShowMobileLevelDropdown] = useState(false);

  // Get auth state
  const { user, loading, logout } = useAuth();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileCategoryRef = useRef<HTMLDivElement>(null);
  const mobileLevelRef = useRef<HTMLDivElement>(null);
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<HTMLDivElement>(null);

  const handleHamburgerNav = () => {
    setShowHamburgerNav((val) => {
      return !val;
    });
  };

  const openLoginDialog = () => {
    setIsLoginOpen(true);
  };

  // Handle scroll hide/show for mobile nav links and navbar height
  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== "undefined") {
        const currentScrollY = window.scrollY;

        // Scroll down - hide mobile nav and reduce navbar height
        if (currentScrollY > lastScrollY && currentScrollY > 50) {
          setShowMobileNav(false);
          setNavbarHeight("60px"); // Reduced height when scrolling down
        }
        // Scroll up - show mobile nav and restore navbar height
        else {
          setShowMobileNav(true);
          setNavbarHeight("auto"); // Full height when scrolling up
        }

        setLastScrollY(currentScrollY);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar);

      return () => {
        window.removeEventListener("scroll", controlNavbar);
      };
    }
  }, [lastScrollY]);

  // Filter handlers for sessions
  const handleCategoryChange = (category: string) => {
    console.log("Category changed to:", category);
    setSelectedCategory(category);
  };

  const handleLevelChange = (level: string) => {
    console.log("Level changed to:", level);
    setSelectedLevel(level);
  };

  const handleSearchTermChange = (term: string) => {
    setSearchTerm(term);
  };

  // Updated handleSearch with conditional behavior
  const handleSearch = () => {
    if (isTutorsPage) {
      // Tutor search - update URL params without redirect
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== "all") {
        params.append("category", selectedCategory);
      }
      if (selectedLevel && selectedLevel !== "all") {
        params.append("level", selectedLevel);
      }
      if (searchTerm) {
        params.append("q", searchTerm);
      }
      const queryString = params.toString();
      router.replace(`/tutors${queryString ? `?${queryString}` : ""}`, {
        scroll: false,
      });
    } else if (isSessionsPage) {
      // Session search - update URL params without redirect
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== "all") {
        params.append("category", selectedCategory);
      }
      if (selectedLevel && selectedLevel !== "all") {
        params.append("level", selectedLevel);
      }
      if (searchTerm) {
        params.append("q", searchTerm);
      }
      const queryString = params.toString();
      router.replace(`/sessions${queryString ? `?${queryString}` : ""}`, {
        scroll: false,
      });
    } else {
      // Default behavior - redirect to search page
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== "all") {
        params.append("category", selectedCategory);
      }
      if (selectedLevel && selectedLevel !== "all") {
        params.append("level", selectedLevel);
      }
      if (searchTerm) {
        params.append("q", searchTerm);
      }
      const queryString = params.toString();
      router.push(`/search${queryString ? `?${queryString}` : ""}`);
    }

    // Close search panels
    setSelected(null);
    setDisplaySearch(false);
  };

  // Tutor filter handlers
  const handleTutorCategoryChange = (category: string) => {
    console.log("Tutor category changed to:", category);
    setTutorCategory(category);
    updateTutorSearch();
  };

  const handleTutorLevelChange = (level: string) => {
    console.log("Tutor level changed to:", level);
    setTutorLevel(level);
    updateTutorSearch();
  };

  const handleTutorSearchTermChange = (term: string) => {
    setTutorSearchTerm(term);
  };

  const handleTutorSubjectChange = (subject: string) => {
    setTutorSubject(subject);
  };

  const updateTutorSearch = () => {
    const params = new URLSearchParams();
    if (tutorCategory && tutorCategory !== "all") {
      params.append("category", tutorCategory);
    }
    if (tutorLevel && tutorLevel !== "all") {
      params.append("level", tutorLevel);
    }
    if (tutorSearchTerm) {
      params.append("q", tutorSearchTerm);
    }
    if (tutorSubject) {
      params.append("subject", tutorSubject);
    }

    const queryString = params.toString();
    router.replace(`/tutors${queryString ? `?${queryString}` : ""}`, {
      scroll: false,
    });
  };

  const handleTutorSearch = () => {
    updateTutorSearch();
    setSelected(null);
    setDisplaySearch(false);
  };

  const handleTutorKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleTutorSearch();
    }
  };

  const handleProtectedNavigation = (path: string) => {
    if (!user) {
      // If not logged in, open login modal and store the intended path
      setIsLoginOpen(true);
      // You could store the intended path in state if you want to redirect after login
      // setPendingRoute(path);
    } else {
      router.push(path);
    }
  };

  const clearTutorFilters = () => {
    setTutorCategory("all");
    setTutorLevel("all");
    setTutorSearchTerm("");
    setTutorSubject("");
    router.replace("/tutors", { scroll: false });
  };

  // Mobile search handlers
  const handleMobileCategorySelect = (category: string) => {
    console.log("Mobile category selected:", category);
    setMobileCategory(category);
    setShowMobileCategoryDropdown(false);
    setDisplaySearchCount(1);
  };

  const handleMobileLevelSelect = (level: string) => {
    console.log("Mobile level selected:", level);
    setMobileLevel(level);
    setShowMobileLevelDropdown(false);
    setDisplaySearchCount(2);
  };

  const handleMobileSearchTermChange = (term: string) => {
    setMobileSearchTerm(term);
    if (term) {
      setDisplaySearchCount(3);
    }
  };

  const handleMobileSearch = () => {
    console.log("Mobile search with:", {
      category: mobileCategory,
      level: mobileLevel,
      searchTerm: mobileSearchTerm,
    });

    const params = new URLSearchParams();
    if (mobileCategory && mobileCategory !== "all") {
      params.append("category", mobileCategory);
    }
    if (mobileLevel && mobileLevel !== "all") {
      params.append("level", mobileLevel);
    }
    if (mobileSearchTerm) {
      params.append("q", mobileSearchTerm);
    }

    const queryString = params.toString();
    router.push(`/search${queryString ? `?${queryString}` : ""}`);

    // Close search panels
    setDisplaySearch(false);
    setSelected(null);
    setDisplaySearchCount(0);
    setShowMobileCategoryDropdown(false);
    setShowMobileLevelDropdown(false);
    // Reset mobile filters
    setMobileCategory("all");
    setMobileLevel("all");
    setMobileSearchTerm("");
  };

  const clearMobileFilters = () => {
    console.log("Clearing mobile filters");
    setMobileCategory("all");
    setMobileLevel("all");
    setMobileSearchTerm("");
    setDisplaySearchCount(0);
    setShowMobileCategoryDropdown(false);
    setShowMobileLevelDropdown(false);
  };

  // Close mobile dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle click outside for desktop search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Hamburger dropdown
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowHamburgerNav(false);
      }

      // Only close desktop dropdowns if clicking outside the entire search bar
      if (
        desktopSearchRef.current &&
        !desktopSearchRef.current.contains(event.target as Node)
      ) {
        setSelected(null);
      }
    };
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  // Category display mapping
  const getCategoryDisplay = (category: string) => {
    const map: Record<string, string> = {
      all: "All Sessions",
      group: "Group Sessions",
      one_on_one: "One-on-One",
    };
    return map[category] || category;
  };

  // Level display mapping
  const getLevelDisplay = (level: string) => {
    const map: Record<string, string> = {
      all: "All Levels",
      primary: "Primary School",
      junior_high: "Junior High School",
      senior_high: "Senior High School",
      university: "University",
      adult: "Adult Education",
    };
    return map[level] || level;
  };

  // Tutor category display mapping
  const getTutorCategoryDisplay = (category: string) => {
    const map: Record<string, string> = {
      all: "All Tutors",
      featured: "Featured Tutors",
      popular: "Most Popular",
      new: "New Tutors",
    };
    return map[category] || category;
  };

  // Tutor level display mapping
  const getTutorLevelDisplay = (level: string) => {
    const map: Record<string, string> = {
      all: "All Levels",
      primary: "Primary",
      junior_high: "Junior High",
      senior_high: "Senior High",
      university: "University",
      adult: "Adult",
    };
    return map[level] || level;
  };

  return (
    <>
      <Login isLoginOpen={isLoginOpen} setIsLoginOpen={setIsLoginOpen} />

      <div className="nav-wrapper">
        <div
          ref={navbarRef}
          className="nav-container transition-all duration-300 ease-in-out"
          style={{ height: navbarHeight }}
        >
          <nav className="navbar md:py-3">
            <div
              className="logo flex items-center gap-0 cursor-pointer select-none"
              onClick={() => router.push("/")}
            >
              <div className="w-6 h-6 md:w-8 md:h-8">
                <img
                  src="/images/logo_purple.png"
                  alt="SomoHub Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl md:text-2xl md:font-bold font-semibold text-main">
                SomoHub
              </span>
            </div>

            {/* Desktop Navigation Links - hidden on mobile */}
            <ul className="nav-links hidden md:flex">
              <li>
                <Link
                  href="/"
                  className={`flex flex-col md:flex-row justify-center items-center gap-1 ${
                    pathname === "/"
                      ? "border-b-2 border-b-zinc-400 border-main pb-1"
                      : ""
                  }`}
                >
                  <Home className="w-4 h-4 md:w-6 md:h6 text-gray-800" />{" "}
                  <span className="md:text-base text-[12px] text-zinc-600">
                    Home
                  </span>
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
                  <BookOpenCheck className="w-4 h-4 md:w-6 md:h6 text-gray-800" />{" "}
                  <span className="md:text-base text-[12px] text-zinc-600">
                    Tuition
                  </span>
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
                  <UserRound className="w-4 h-4 md:w-6 md:h6 text-gray-800" />{" "}
                  <span className="md:text-base text-[12px] text-zinc-600">
                    Tutors
                  </span>
                </Link>
              </li>
            </ul>

            <div className="flex justify-center items-center gap-3 ">
              {!user ? (
                <span
                  className="hidden md:flex justify-center items-center font-semibold cursor-pointer  hover:bg-zinc-200 py-2 px-3 rounded-3xl"
                  onClick={() => handleProtectedNavigation("/onboarding/tutor")}
                >
                  Become a Tutor
                </span>
              ) : (
                <>
                  {!user?.roles?.includes("tutor") && (
                    <span
                      className="hidden md:flex justify-center items-center font-semibold cursor-pointer hover:bg-zinc-200 py-2 px-3 rounded-3xl"
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
                    className="hidden md:flex profile-pic h-10 w-10 rounded-full ring-1 ring-offset-neutral-50 text-zinc-50 bg-zinc-900 justify-center items-center text-[12px] cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
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
                ref={dropdownRef}
                className={`hamburger-container relative ${
                  displaySearch
                    ? "bg-white  ring-1 ring-zinc-100 shadow-md    hover:scale-110 transition-all duration-200"
                    : "bg-zinc-200  hover:bg-zinc-300"
                }`}
                onClick={() => {
                  if (displaySearch) {
                    setDisplaySearch(false);
                    setDisplaySearchCount(0);
                    setSelected(null);
                    // Reset mobile filters when closing
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
                      onClick={() => {
                        setDisplaySearch(false);
                        setSelected(null);
                        setDisplaySearchCount(0);
                        // Reset mobile filters when closing
                        setMobileCategory("all");
                        setMobileLevel("all");
                        setMobileSearchTerm("");
                        setShowMobileCategoryDropdown(false);
                        setShowMobileLevelDropdown(false);
                      }}
                    />
                  </div>
                ) : (
                  <div className="hamburger"></div>
                )}
              </div>
            </div>
          </nav>

          {/* Mobile Navigation Links with hide/show on scroll */}
          <div
            className={`
              md:hidden w-full px-6 py-1
              transition-all duration-300 ease-in-out
              ${showMobileNav ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full h-0 py-0"}
              overflow-hidden
            `}
          >
            <ul className="flex justify-center items-center gap-6 w-full">
              <li>
                <Link
                  href="/"
                  className={`flex flex-col items-center gap-0.5 ${
                    pathname === "/"
                      ? "border-b-2 border-b-zinc-400 border-main pb-0.5"
                      : ""
                  }`}
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
                >
                  <UserRound className="w-5 h-5 text-gray-800" />
                  <span className="text-[12px] text-zinc-600">Tutors</span>
                </Link>
              </li>
            </ul>
          </div>

          <div
            className={`dropdown-menu z-20 ${!showHamburgerNav && "hidden"}`}
          >
            <div className="w-full flex flex-col ">
              {user && (
                <div className=" pb-2 border-b-2 border-zinc-200 flex flex-col justify-start items-start">
                  {/* <div className="w-full font-medium text-zinc-700 flex justify-start items-center gap-2  pb-2 pt-2 px-2 cursor-pointer hover:bg-zinc-100">
                    <MessageSquare size={18} />
                    <span className="text-[14px] font-sans text-zinc-700">
                      Messages
                    </span>
                  </div> */}
                  <div
                    className="w-full font-medium text-zinc-700 flex justify-start items-center gap-2  pb-2 pt-2 px-2 cursor-pointer hover:bg-zinc-100"
                    onClick={() => {
                      {
                        user?.roles?.includes("tutor")
                          ? handleProtectedNavigation("/tutor/profile")
                          : handleProtectedNavigation("/student/profile");
                      }
                    }}
                  >
                    <CircleUserRound size={18} />
                    <span className="text-[14px] font-sans text-zinc-700">
                      Profile
                    </span>
                  </div>
                  <div
                    className="w-full font-medium text-zinc-700 flex justify-start items-center gap-2  pb-2 pt-2 px-2 cursor-pointer hover:bg-zinc-100"
                    onClick={() => {
                      {
                        user?.roles?.includes("tutor")
                          ? handleProtectedNavigation("/tutor/sessions")
                          : handleProtectedNavigation("/student/schedule");
                      }
                    }}
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
                onClick={() => {
                  router.push("/help/tutor");
                }}
              >
                <MessageCircleQuestionMark size={18} />
                <span className="text-[14px] font-san">Help & Support</span>
              </div>
              <div
                className="font-medium text-zinc-700 flex  justify-between items-center border-b-2 border-zinc-200 pb-4 pt-4 px-2 cursor-pointer hover:bg-zinc-100"
                onClick={() => router.push("/tutors")}
              >
                <div className="font-medium text-zinc-700 flex flex-col justify-start items-start ">
                  <span
                    className="text-[14px] font-sans   text-zinc-700 leading-tight font-sans tracking-normal"
                    onClick={() => router.push("/tutors")}
                  >
                    Tutors
                  </span>
                  <span className="text-zinc-500 text-[13px] ">
                    Verified tutors with qualified academic background
                  </span>
                </div>
                <User2 size={30} />
              </div>
              <div
                className="font-medium text-zinc-700 flex  justify-between items-center border-b-2 border-zinc-200 pb-4 pt-4 px-2 cursor-pointer hover:bg-zinc-100"
                onClick={() => router.push("/sessions")}
              >
                <div className="font-medium text-zinc-700 flex flex-col justify-start items-start ">
                  <span
                    className="text-[14px] font-sans   text-zinc-700 leading-tight font-sans tracking-normal"
                    onClick={() => router.push("/tutors")}
                  >
                    Tuition & Sessions
                  </span>
                  <span className="text-zinc-500 text-[13px] ">
                    Sessions managed virtually within the app
                  </span>
                </div>
                <BookOpenCheck size={30} />
              </div>
              {!user?.roles?.includes("tutor") && (
                <div
                  className="font-medium text-zinc-700 flex  justify-between items-center border-b-2 border-zinc-200 pb-4 pt-4 px-2 cursor-pointer hover:bg-zinc-100"
                  onClick={() => handleProtectedNavigation("/onboarding/tutor")}
                >
                  <div className="font-medium text-zinc-700 flex flex-col justify-start items-start ">
                    <span
                      className="text-[14px] font-sans   text-zinc-700 leading-tight font-sans tracking-normal"
                      onClick={() =>
                        handleProtectedNavigation("/onboarding/tutor")
                      }
                    >
                      Become a Tutor
                    </span>
                    <span className="text-zinc-500 text-[13px] ">
                      It's easy to start and earn an extra income
                    </span>
                  </div>
                  <Presentation size={30} />
                </div>
              )}
              {/* <div
                className="font-medium text-zinc-700 flex  justify-between items-center border-b-2 border-zinc-200 pb-4 pt-4 px-2 cursor-pointer hover:bg-zinc-100"
                onClick={() =>
                  handleProtectedNavigation("/onboarding/community")
                }
              >
                <div className="font-medium text-zinc-700 flex flex-col justify-start items-start ">
                  <span className="text-[14px] font-sans md:text-[14px] text-zinc-700 leading-tight tracking-normal font-sans">
                    Register your Community
                  </span>
                  <span className="text-zinc-500 text-[13px] ">
                    Register your learning community with us (schools, colleges,
                    groups, etc)
                  </span>
                </div>
                <School className="w-14 h-" />
              </div> */}
              <div
                onClick={() => {
                  if (!user) {
                    openLoginDialog();
                  } else {
                    logout();
                  }
                }}
                className="font-medium text-zinc-700 flex justify-start items-center gap-2  border-zinc-200 pb-4 pt-4 px-2 cursor-pointer hover:bg-zinc-100"
              >
                <span className="text-[14px] font-san">
                  {!user ? "Login or sign up" : "Log out"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="pb-1 md:pl-8 md:pr-8 w-full md:pb-5 box-border ">
          <div
            ref={searchRef}
            className={`search flex ${
              displaySearch
                ? "flex-col justify-start items-start box-border h-screen"
                : "justify-center items-center"
            } w-full md:max-w-4xl md:m-auto`}
          >
            {/* Mobile Search Bar - Full featured like desktop */}
            <div
              className={`w-full m:0 md:m-0 px-0 transition-colors duration-200 relative md:hidden
                ${
                  displaySearch
                    ? "flex flex-col justify-start items-start h-screen w-screen pl-4 pr-4 ml-0 mr-0 box-border gap-4 bg-white overflow-y-auto"
                    : "cursor-pointer shadow-lg max-w-4xl h-14 border border-zinc-300 hover:ring-1 hover:ring-zinc-900 w-full m-3 ml-4 mr-4 bg-white flex flex-col justify-center items-center rounded-full"
                }`}
              onClick={() => {
                if (!displaySearch) {
                  setDisplaySearch(true);
                }
              }}
            >
              {!displaySearch && (
                <div className="flex justify-center items-center gap-2 w-full">
                  <SearchIcon size={12} strokeWidth={3} />{" "}
                  <div className="text-sm font-semibold text-zinc-700">
                    Start your search
                  </div>
                </div>
              )}

              {displaySearch && (
                <>
                  {/* Header with close button */}
                  <div className="w-full flex justify-between items-center py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {isTutorsPage ? "Find a Tutor" : "Search"}
                    </h3>
                    <button
                      onClick={() => {
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
                    <>
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
                                {cat.desc && (
                                  <p className="text-xs text-gray-500">
                                    {cat.desc}
                                  </p>
                                )}
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

                      {/* Tutor Search Inputs */}
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
                              onChange={(e) =>
                                setTutorSearchTerm(e.target.value)
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleTutorSearch();
                                }
                              }}
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
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleTutorSearch();
                                }
                              }}
                              placeholder="e.g., Mathematics, English..."
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring- focus:border-transparent outline-none"
                            />
                          </div>

                          {/* Popular tutor searches */}
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
                                  onClick={() => {
                                    setTutorSubject(item);
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

                          {/* Show selected filters summary */}
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
                      <div className="w-full mt-4 flex gap-3 pb-6">
                        <button
                          onClick={clearTutorFilters}
                          className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Clear All
                        </button>
                        <button
                          onClick={handleTutorSearch}
                          className="flex-1 px-4 py-3 bg- text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          Search Tutors
                        </button>
                      </div>
                    </>
                  ) : (
                    // Original Mobile Session Search
                    <>
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
                                onClick={() =>
                                  handleMobileLevelSelect(lvl.value)
                                }
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
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleMobileSearch();
                              }
                            }}
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

                          {/* Show selected filters summary */}
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
                                      onClick={() => {
                                        setMobileCategory("all");
                                        setDisplaySearchCount(
                                          Math.max(0, displaySearchCount - 1),
                                        );
                                      }}
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
                                      onClick={() => {
                                        setMobileLevel("all");
                                        setDisplaySearchCount(
                                          Math.max(0, displaySearchCount - 1),
                                        );
                                      }}
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
                      <div className="w-full mt-4 flex gap-3 pb-6">
                        <button
                          onClick={clearMobileFilters}
                          className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Clear All
                        </button>
                        <button
                          onClick={handleMobileSearch}
                          className="flex-1 px-4 py-3 bg- text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          Search
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Desktop Search Bar */}
            <div
              ref={desktopSearchRef}
              className="w-full max-w-4xl m-3 md:m-0 px-0 h-14 md:h-16
             border border-zinc-300 shadow-md
             rounded-full bg-white
             hidden md:flex items-center relative"
            >
              {isTutorsPage ? (
                // Tutor Search with Category and Level tabs
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
                </>
              ) : (
                // Session Search
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
                </>
              )}

              {/* search icon */}
              <div className="px-2">
                <button
                  onClick={handleSearch}
                  className={`h-12 ${
                    !isTutorsPage && selected !== null ? "w-24" : "w-12"
                  } bg-main rounded-full flex justify-center items-center gap-2
                 hover:ring-1 ring-main hover:bg-main/95 hover:text-main-50 cursor-pointer
                 transition-all duration-300`}
                >
                  <SearchIcon
                    size={16}
                    strokeWidth={3}
                    color="white"
                    className="hover:text-violet-50"
                  />
                  {!isTutorsPage && selected !== null && (
                    <span className="text-white text-md font-semibold">
                      Search
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
