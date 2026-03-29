// src/app/admin/layout.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Building2,
  CheckCircle,
  XCircle,
  DollarSign,
  Menu,
  X,
  LogOut,
  Home,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, userStatus, logout, loading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if user is admin
  useEffect(() => {
    if (!loading) {
      const isAdmin =
        userStatus?.hasAdminRole || user?.roles?.includes("admin");
      if (!isAdmin) {
        router.push("/dashboard");
      }
    }
  }, [user, userStatus, loading, router]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  const isAdmin = userStatus?.hasAdminRole || user?.roles?.includes("admin");
  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Tutor Applications",
      href: "/admin/tutors/applications",
      icon: Users,
    },
    {
      name: "Tutors",
      href: "/admin/tutors",
      icon: Users,
    },
    {
      name: "Affiliates",
      href: "/admin/affiliates",
      icon: UserPlus,
    },
    {
      name: "Affiliate Referrals",
      href: "/admin/affiliates/referrals",
      icon: CheckCircle,
    },
    {
      name: "Create Affiliate",
      href: "/admin/affiliates/create",
      icon: UserPlus,
    },
    // {
    //   name: "Community Applications",
    //   href: "/admin/communities/applications",
    //   icon: Building2,
    // },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-white shadow-xl z-50 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 w-64`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="font-semibold text-gray-900">Admin Panel</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => isMobile && setSidebarOpen(false)}
                className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200">
            <Link
              href="/"
              className="flex items-center gap-3 px-0 py-2 text-gray-700 hover:text-purple-600 transition-colors mb-3"
            >
              <Home className="w-5 h-5" />
              <span>Back to Site</span>
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-3 px-0 py-2 text-gray-700 hover:text-red-600 transition-colors w-full"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="md:ml-64 min-h-screen">
        {/* Mobile Header */}
        <header className="bg-white border-b border-gray-200 md:hidden sticky top-0 z-30">
          <div className="px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            <span className="font-semibold text-gray-900">Admin Panel</span>
            <div className="w-10" />
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
