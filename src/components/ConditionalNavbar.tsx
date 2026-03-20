//src/components/ConditionalNavbar.tsx
"use client";

import { usePathname } from "next/navigation";
import Navbar from "../app/components/ui/Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();

  // Don't show Navbar on these routes
  const hiddenRoutes = [
    "/student/",
    "/tutor/",
    "/tutors/",
    "/community",
    "/communities",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/dashboard",
    "/onboarding",
    "/tuitions",
    // "/sessions",
    "/help",
    "/terms",
    "/privacy",
    "/guidelines",
    "/contact",
  ];

  const shouldShowNavbar = !hiddenRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (!shouldShowNavbar) return null;

  return <Navbar />;
}
