// src/app/affiliate/layout.tsx (create this file)
"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  DollarSign,
  TrendingUp,
  Wallet,
  Settings,
  Key,
  HelpCircle,
} from "lucide-react";
import Header from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AffiliateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Dashboard",
      href: "/affiliate/",
      icon: LayoutDashboard,
    },
    {
      name: "My Referrals",
      href: "/affiliate/referrals",
      icon: Users,
    },
    {
      name: "Commissions",
      href: "/affiliate/commissions",
      icon: DollarSign,
    },
    {
      name: "Payouts",
      href: "/affiliate/payouts",
      icon: Wallet,
    },
    {
      name: "Earnings Overview",
      href: "/affiliate/earnings",
      icon: TrendingUp,
    },
    // {
    //   name: "Change Password",
    //   href: "/affiliate/change-password",
    //   icon: Key,
    // },
    {
      name: "Settings",
      href: "/affiliate/settings",
      icon: Settings,
    },
    {
      name: "Help",
      href: "/affiliate/help",
      icon: HelpCircle,
    },
  ];

  return (
    <ProtectedRoute requiredRoles={["affiliate"]}>
      <div className="min-h-screen bg-gray-50">
        {/* <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} /> */}

        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-0 z-40 w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transform transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <nav className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-purple-600" />
                <span className="font-semibold text-gray-900">
                  Affiliate Portal
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-purple-50 text-purple-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${isActive ? "text-purple-600" : "text-gray-500"}`}
                    />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>

            <div className="p-4 border-t border-gray-200">
              <div className="bg-purple-50 rounded-lg p-3">
                <p className="text-xs text-purple-600 font-medium">
                  Commission Rate
                </p>
                <p className="text-lg font-bold text-purple-700">5%</p>
                <p className="text-xs text-purple-500 mt-1">
                  On first 100 students per tutor
                </p>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <main className="md:ml-64 pt-6">
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
