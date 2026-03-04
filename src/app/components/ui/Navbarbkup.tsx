"use client";
import React, { useState, useEffect, useRef } from "react";
import { UserRound, BookOpenCheck, CirclePile } from "lucide-react";
export default function Navbar() {
  const [showHamburgerNav, setShowHamburgerNav] = useState(false);
  const [hovered, setHovered] = useState(null);
  const dropdownRef = useRef(null);

  const handleHamburgerNav = () => {
    setShowHamburgerNav((val) => {
      return !val;
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: { target: any }) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowHamburgerNav(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className="nav-wrapper">
      <div className="nav-container ">
        <div className={`dropdown-menu ${!showHamburgerNav && "hidden"}`}>
          afsfsadf afdasdfasdffd afsadfd
        </div>
        <nav className="navbar md:py-3">
          <div className="logo">
            <span className="text-2xl font-semibold hidden md:block">
              SomoApp
            </span>
          </div>

          <ul className="nav-links">
            <li>
              <a
                href="#"
                className="flex flex-col md:flex-row justify-center items-center gap-1"
              >
                <BookOpenCheck className="w-4 h-4 md:w-6 md:h6 text-gray-800" />{" "}
                <span className="md:text-base text-[12px]">Tuition</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex flex-col md:flex-row justify-center items-center gap-1 "
              >
                <UserRound className="w-4 h-4 md:w-6 md:h6 text-gray-800" />{" "}
                <span className="md:text-base text-[12px]">Tutors</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex flex-col md:flex-row justify-center items-center gap-1"
              >
                <CirclePile className="w-4 h-4 md:w-6 md:h6 text-gray-800" />{" "}
                <span className="md:text-base text-[12px]">Communities</span>
              </a>
            </li>
          </ul>
          <div className="flex justify-center items-center gap-2 ">
            <div className="hidden  md:flex profile-pic h-10 w-10 rounded-full ring-1 ring-offset-neutral-50 text-zinc-50 bg-zinc-900 flex justify-center items-center text-[12px] cursor-pointer">
              F
            </div>
            <div
              ref={dropdownRef}
              className="hamburger-container relative"
              onClick={handleHamburgerNav}
            >
              <div className="hamburger"></div>
            </div>
          </div>
        </nav>
      </div>

      <div className="search flex justify-center items-center w-full">
        <div
          className="w-full max-w-3xl m-3 md:m-5 px-0 h-14 md:h-16
             border border-zinc-300 shadow-md
             rounded-4xl bg-white
             flex items-center
             "
        >
          {/* Curriculum  */}
          <div
            onMouseEnter={() => setHovered("curriculum")}
            onMouseLeave={() => setHovered("null")}
            className="flex h-full w-1/3 px-6 py-2
                 flex-col justify-center items-start
                 hover:bg-zinc-200 cursor-pointer
                 transition-colors duration-200 rounded-4xl relative"
          >
            <span className="text-xs font-semibold text-zinc-700 tracking-wide">
              Curriculum
            </span>
            <span className="text-sm text-zinc-500 mt-0.5">
              Select Curriculum Type
            </span>
            <div className="dropdown-search ">
              <div className="items">
                <div className=" text-sm font-semibold text-zinc-700 leading-tight tracking-wide">
                  CBC
                </div>
                <div className="text-zinc-500 leading-tight tracking-wide text-sm">
                  Competence Based Curriculum
                </div>
              </div>
              <div className="items">
                <div className="text-sm font-semibold text-zinc-700 leading-tight tracking-wide">
                  Cambridge
                </div>
                <div className="text-zinc-500 leading-tight tracking-wide text-sm">
                  Competence Based Curriculum
                </div>
              </div>
            </div>
          </div>
          {/* Divider between Curriculum & Level */}
          <div
            className={`h-2/3 w-px bg-zinc-300 transition-opacity duration-200 ${
              hovered === "curriculum" || hovered === "level"
                ? "opacity-0"
                : "opacity-100"
            }`}
          ></div>

          {/* Level */}

          <div
            onMouseEnter={() => setHovered("level")}
            onMouseLeave={() => setHovered("null")}
            className="relative flex h-full w-1/3 px-6 py-2
                 flex-col justify-center items-start
                 hover:bg-zinc-200 cursor-pointer
                 transition-colors duration-200 rounded-4xl

                "
          >
            <span className="text-xs font-semibold text-zinc-700 tracking-wide">
              Level
            </span>
            <span className="text-sm text-zinc-500 mt-0.5">
              Select Study Level
            </span>
          </div>

          {/* Divider between Level & Title */}
          <div
            className={`h-2/3 w-px bg-zinc-300 transition-opacity duration-200 ${
              hovered === "level" || hovered === "title"
                ? "opacity-0"
                : "opacity-100"
            }`}
          ></div>
          {/* Title */}
          <div
            onMouseEnter={() => setHovered("title")}
            onMouseLeave={() => setHovered(null)}
            className="flex h-full w-1/3 px-6 py-2
                 flex-col justify-center items-start
                 hover:bg-zinc-200 cursor-pointer
                 transition-colors duration-200 rounded-4xl"
          >
            <span className="text-xs font-semibold text-zinc-700 tracking-wide">
              Title / Topic / Subject
            </span>
            <span className="text-sm text-zinc-500 mt-0.5">
              Select Title / Topic / Subject
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
