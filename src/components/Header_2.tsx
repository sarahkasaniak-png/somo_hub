"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
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
} from "lucide-react";

import Login from "../app/components/ui/Login";
import { LogOut, User } from "lucide-react";
import { useAuth } from "../app/context/AuthContext";

export default function Navbar() {
  const [showHamburgerNav, setShowHamburgerNav] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const [displaySearch, setDisplaySearch] = useState<boolean>(false);
  const [displaySearchCount, setDisplaySearchCount] = useState<number>(0);
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);

  // Get auth state
  const { user, loading, logout } = useAuth();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleHamburgerNav = () => {
    setShowHamburgerNav((val) => {
      return !val;
    });
  };

  const openLoginDialog = () => {
    setIsLoginOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Hamburger dropdown
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowHamburgerNav(false);
      }

      // Search dropdowns
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSelected(null);
      }
    };
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  //     const handleClickOutside = (event: { target: any }) => {
  //       // Close search dropdowns
  //       if (searchRef.current && !searchRef.current.contains(event.target)) {
  //         setSelected(null);
  //       }
  //     };

  //     document.addEventListener("click", handleClickOutside, true);
  //     return () => {
  //       document.removeEventListener("click", handleClickOutside);
  //     };
  //   }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/"); // Redirect to home after logout
  };

  // Handle dropdown item click - closes dropdown after navigation
  const handleDropdownItemClick = useCallback((callback: () => void) => {
    return (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      callback();
      setShowHamburgerNav(false);
    };
  }, []);

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

  return (
    <>
      <Login isLoginOpen={isLoginOpen} setIsLoginOpen={setIsLoginOpen} />

      <div className="nav-wrapper relative  bg-gray-50 border-t-0 border-b-4 border-zinc-200 shadow-none pl-2 pr-2 md:pl-10 md:pr-10 pt-2 pb-2 box-border">
        <div className="nav-container ">
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
              {/* <span className="text-xl font-bold text-gray-900">SomoHub</span> */}
              <span className="text-xl md:text-2xl md:font-bold font-semibold text-main">
                SomoHub
              </span>
            </div>

            {/* <div>{`dsc:${displaySearchCount}  selected:${selected} ds:${displaySearch.toString()}`}</div> */}

            <div className="flex justify-center items-center gap-3 ">
              {!user ? (
                <span
                  className="hidden md:flex justify-center items-center font-semibold cursor-pointer  hover:bg-zinc-200 py-2 px-3 rounded-3xl"
                  onClick={() => router.push("/onboarding/tutor")}
                >
                  Become a Tutor
                </span>
              ) : (
                <>
                  {!user?.roles?.includes("tutor") && (
                    <span
                      className="hidden md:flex justify-center items-center font-semibold cursor-pointer hover:bg-zinc-200 py-2 px-3 rounded-3xl"
                      onClick={() => router.push("/onboarding/tutor")}
                    >
                      Become a Tutor
                    </span>
                  )}
                  {user?.roles?.includes("tutor") && (
                    <span
                      className="hidden md:flex justify-center items-center font-semibold cursor-pointer hover:bg-zinc-200 py-2 px-3 rounded-3xl"
                      onClick={() => router.push("/onboarding/tutor")}
                    >
                      Switch to Tutor Mode
                    </span>
                  )}
                  <div
                    className="hidden md:flex profile-pic h-10 w-10 rounded-full ring-1 ring-offset-neutral-50 text-zinc-50 bg-zinc-900 justify-center items-center text-[12px] cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push("/profile");
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
                      }}
                    />
                  </div>
                ) : (
                  <div className="hamburger"></div>
                )}
              </div>
            </div>
          </nav>

          <div
            className={`dropdown-menu z-20 ${!showHamburgerNav && "hidden"}`}
          >
            <div className="w-full flex flex-col ">
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
              {/* <div
                className="font-medium text-zinc-700 flex  justify-between items-center border-b-2 border-zinc-200 pb-4 pt-4 px-2 cursor-pointer hover:bg-zinc-100"
                onClick={() => router.push("/onboarding/community")}
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
      </div>
    </>
  );
}
