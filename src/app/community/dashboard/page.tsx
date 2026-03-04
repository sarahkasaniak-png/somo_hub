// src/app/community/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface DashboardStats {
  totalMembers: number;
  activeCourses: number;
  upcomingSessions: number;
  totalRevenue: number;
}

export default function CommunityDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    activeCourses: 0,
    upcomingSessions: 0,
    totalRevenue: 0,
  });

  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    // Fetch dashboard data
    const fetchData = async () => {
      try {
        // Mock data
        setStats({
          totalMembers: 245,
          activeCourses: 8,
          upcomingSessions: 5,
          totalRevenue: 1250,
        });

        setRecentActivity([
          {
            id: 1,
            type: "enrollment",
            user: "John Doe",
            course: "Calculus 101",
            time: "2 hours ago",
          },
          {
            id: 2,
            type: "payment",
            user: "Jane Smith",
            amount: "$45",
            time: "4 hours ago",
          },
          {
            id: 3,
            type: "session",
            user: "Mike Johnson",
            course: "Physics Review",
            time: "Yesterday",
          },
        ]);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    {
      title: "Total Members",
      value: stats.totalMembers,
      icon: "👥",
      color: "bg-purple-100 text-purple-800",
      link: "/community/members",
    },
    {
      title: "Active Courses",
      value: stats.activeCourses,
      icon: "📚",
      color: "bg-blue-100 text-blue-800",
      link: "/community/courses",
    },
    {
      title: "Upcoming Sessions",
      value: stats.upcomingSessions,
      icon: "🎯",
      color: "bg-green-100 text-green-800",
      link: "/community/sessions",
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue}`,
      icon: "💰",
      color: "bg-yellow-100 text-yellow-800",
      link: "/community/earnings",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section - Adjusted for expanded layout */}
      <div className="p-4">
        <div className="w-full flex md:justify-between md:items-start flex-col md:flex-row gap-4">
          <div>
            <h1 className="text-2xl font-bold">Community Dashboard</h1>
            <p className="mt-2 opacity-90">
              Welcome to Nairobi High School Math Club administration
            </p>
          </div>
          <Link
            href="/community/settings"
            className="bg-main text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors cursor-pointer"
          >
            Manage Community
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            href={stat.link}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
              </div>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <div className="mt-4">
              <span className="text-sm text-blue-600 font-medium">
                View Details →
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h2>
            <Link
              href="/community/activity"
              className="text-sm text-main hover:text-purple-800 font-medium"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    activity.type === "enrollment"
                      ? "bg-green-100 text-green-600"
                      : activity.type === "payment"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-purple-100 text-purple-600"
                  }`}
                >
                  {activity.type === "enrollment"
                    ? "👤"
                    : activity.type === "payment"
                      ? "💰"
                      : "🎯"}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {activity.user}{" "}
                    {activity.type === "enrollment"
                      ? "enrolled in"
                      : activity.type === "payment"
                        ? "paid"
                        : "completed"}{" "}
                    {activity.course || activity.amount}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/community/courses/create"
              className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100 hover:border-purple-300 transition-colors text-center"
            >
              <div className="text-2xl mb-2">📚</div>
              <p className="font-medium text-gray-900">Create Course</p>
              <p className="text-sm text-gray-500 mt-1">Start a new course</p>
            </Link>
            <Link
              href="/community/sessions/create"
              className="p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl border border-green-100 hover:border-green-300 transition-colors text-center"
            >
              <div className="text-2xl mb-2">🎯</div>
              <p className="font-medium text-gray-900">Schedule Session</p>
              <p className="text-sm text-gray-500 mt-1">Plan a new session</p>
            </Link>
            <Link
              href="/community/analytics"
              className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100 hover:border-blue-300 transition-colors text-center"
            >
              <div className="text-2xl mb-2">📊</div>
              <p className="font-medium text-gray-900">View Analytics</p>
              <p className="text-sm text-gray-500 mt-1">See community stats</p>
            </Link>
            <Link
              href="/community/members"
              className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-100 hover:border-yellow-300 transition-colors text-center"
            >
              <div className="text-2xl mb-2">👥</div>
              <p className="font-medium text-gray-900">Manage Members</p>
              <p className="text-sm text-gray-500 mt-1">View all members</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Additional Stats Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Community Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📈</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Growth This Month</p>
                <p className="text-2xl font-bold text-gray-900">+24%</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⭐</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">4.7</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🎓</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">89%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
