// src/app/admin/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  UserPlus,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import adminAffiliateApi from "@/lib/api/admin-affiliate";
import { useAuth } from "../context/AuthContext";
import client from "@/lib/api/client";

interface DashboardStats {
  overview: {
    total_active_affiliates: number;
    total_affiliates: number;
    total_earnings: number;
    total_paid: number;
    total_referrals: number;
    pending_referrals: number;
    pending_commissions_amount: number;
    paid_commissions_count: number;
  };
  monthly_trend: Array<{ month: string; total: number }>;
}

interface PendingApplication {
  id: number;
  user_id: number;
  official_first_name: string;
  official_last_name: string;
  email: string;
  phone: string | null;
  application_status: string;
  created_at: string;
}

export default function AdminDashboardPage() {
  const { userStatus } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pendingApplications, setPendingApplications] = useState<
    PendingApplication[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch affiliate stats
      const affiliateStats = await adminAffiliateApi.getStatsOverview();

      if (affiliateStats.success) {
        setStats(affiliateStats.data);
      } else {
        console.error("Failed to fetch affiliate stats:", affiliateStats);
      }

      // Fetch pending tutor applications
      try {
        const pendingAppsRes = await client.get<{
          success: boolean;
          data: { applications: PendingApplication[] };
        }>("/admin/tutors/applications/pending");

        if (pendingAppsRes.success && pendingAppsRes.data) {
          setPendingApplications(pendingAppsRes.data.applications || []);
        } else {
          console.error(
            "Failed to fetch pending applications:",
            pendingAppsRes,
          );
        }
      } catch (appError: any) {
        // Handle 404 or other errors gracefully
        console.error("Error fetching pending applications:", appError);
        // Don't show error for this, just keep empty array
        setPendingApplications([]);
      }
    } catch (error: any) {
      console.error("Error fetching dashboard data:", error);
      setError(error.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Pending Tutor Applications",
      value: pendingApplications.length,
      icon: Clock,
      color: "bg-orange-100 text-orange-600",
      link: "/admin/tutors/applications",
    },
    {
      title: "Pending Affiliate Referrals",
      value: stats?.overview.pending_referrals || 0,
      icon: AlertCircle,
      color: "bg-yellow-100 text-yellow-600",
      link: "/admin/affiliates/referrals",
    },
    {
      title: "Active Affiliates",
      value: stats?.overview.total_active_affiliates || 0,
      icon: Users,
      color: "bg-green-100 text-green-600",
      link: "/admin/affiliates",
    },
    {
      title: "Total Affiliates",
      value: stats?.overview.total_affiliates || 0,
      icon: UserPlus,
      color: "bg-blue-100 text-blue-600",
      link: "/admin/affiliates",
    },
    {
      title: "Total Referrals",
      value: stats?.overview.total_referrals || 0,
      icon: CheckCircle,
      color: "bg-purple-100 text-purple-600",
      link: "/admin/affiliates/referrals",
    },
    {
      title: "Total Earnings",
      value: `KES ${(stats?.overview.total_earnings || 0).toLocaleString()}`,
      icon: DollarSign,
      color: "bg-emerald-100 text-emerald-600",
      link: "/admin/affiliates",
    },
    {
      title: "Pending Commissions",
      value: `KES ${(stats?.overview.pending_commissions_amount || 0).toLocaleString()}`,
      icon: TrendingUp,
      color: "bg-amber-100 text-amber-600",
      link: "/admin/affiliates",
    },
    {
      title: "Paid Commissions",
      value: stats?.overview.paid_commissions_count || 0,
      icon: CheckCircle,
      color: "bg-teal-100 text-teal-600",
      link: "/admin/affiliates",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mt-1">
          Welcome back! Here's an overview of your platform activity.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-2 text-sm text-red-700 hover:text-red-800 underline"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            href={stat.link}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {stat.value}
              </span>
            </div>
            <p className="text-gray-600 text-sm">{stat.title}</p>
          </Link>
        ))}
      </div>

      {/* Recent Applications */}
      {pendingApplications.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="font-semibold text-gray-900">
              Pending Tutor Applications
            </h2>
            <Link
              href="/admin/tutors/applications"
              className="text-sm text-purple-600 hover:text-purple-700"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {pendingApplications.slice(0, 5).map((app) => (
              <Link
                key={app.id}
                href={`/admin/tutors/applications/${app.id}`}
                className="px-6 py-4 hover:bg-gray-50 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {app.official_first_name} {app.official_last_name}
                  </p>
                  <p className="text-sm text-gray-500">{app.email}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Applied: {new Date(app.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                    Pending
                  </span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* No Data Message */}
      {pendingApplications.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-12 text-center">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              All Clear!
            </h3>
            <p className="text-gray-500">
              No pending tutor applications to review.
            </p>
            <Link
              href="/admin/tutors/applications"
              className="mt-4 inline-block text-purple-600 hover:text-purple-700"
            >
              View all applications →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
