//src/components/ConditionalFooter.tsx
"use client";

import { usePathname } from "next/navigation";
import Footer from "@/app/components/ui/Footer";

export default function ConditionalFooter() {
  const pathname = usePathname();

  // Don't show Navbar on these routes
  const hiddenRoutes = [
    "/student",
    "/tutor/",
    "/community",

    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/dashboard",
    "/onboarding",
    // "/tuitions",
    // "/sessions",
    // "/help",
    // "/terms",
    // "/privacy",
    // "/guidelines",
    // "/contact",
  ];

  const shouldShowNavbar = !hiddenRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (!shouldShowNavbar) return null;

  return <Footer />;
}
