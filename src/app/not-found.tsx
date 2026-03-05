// src/app/not-found.tsx
"use client";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Home,
  Search,
  BookOpen,
  Users,
  GraduationCap,
  ArrowLeft,
  Compass,
  School,
} from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Main Content */}
        <div className="text-center mb-12">
          {/* Simple 404 */}
          <h1 className="text-8xl md:text-9xl font-bold text-gray-200 mb-4">
            404
          </h1>

          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3">
            Page Not Found
          </h2>

          <p className="text-gray-600 max-w-md mx-auto mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>

          {/* Simple Search */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for courses, tutors..."
                className="w-full px-5 py-3 pr-12 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-colors text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value.trim()) {
                    window.location.href = `/search?q=${encodeURIComponent(e.currentTarget.value.trim())}`;
                  }
                }}
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
            <Link
              href="/"
              className="p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-sm transition-all"
            >
              <Home className="w-5 h-5 text-purple-600 mb-2" />
              <p className="font-medium text-gray-900 text-sm">Home</p>
              <p className="text-xs text-gray-500">Dashboard</p>
            </Link>

            <Link
              href="/sessions"
              className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <BookOpen className="w-5 h-5 text-blue-600 mb-2" />
              <p className="font-medium text-gray-900 text-sm">Sessions</p>
              <p className="text-xs text-gray-500">Browse classes</p>
            </Link>

            <Link
              href="/tutors"
              className="p-4 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-sm transition-all"
            >
              <GraduationCap className="w-5 h-5 text-green-600 mb-2" />
              <p className="font-medium text-gray-900 text-sm">Tutors</p>
              <p className="text-xs text-gray-500">Find educators</p>
            </Link>

            <Link
              href="/communities"
              className="p-4 bg-white rounded-lg border border-gray-200 hover:border-yellow-300 hover:shadow-sm transition-all"
            >
              <Users className="w-5 h-5 text-yellow-600 mb-2" />
              <p className="font-medium text-gray-900 text-sm">Communities</p>
              <p className="text-xs text-gray-500">Join groups</p>
            </Link>

            <Link
              href="/help"
              className="p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-400 hover:shadow-sm transition-all"
            >
              <Compass className="w-5 h-5 text-gray-600 mb-2" />
              <p className="font-medium text-gray-900 text-sm">Help</p>
              <p className="text-xs text-gray-500">Support & FAQs</p>
            </Link>

            <Link
              href="/onboarding/tutor"
              className="p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-sm transition-all"
            >
              <School className="w-5 h-5 text-purple-600 mb-2" />
              <p className="font-medium text-gray-900 text-sm">
                Become a Tutor
              </p>
              <p className="text-xs text-gray-500">Start teaching</p>
            </Link>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.back()}
              className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>

            <Link
              href="/"
              className="px-5 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors inline-flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Return Home
            </Link>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-12 text-center">
          <p className="text-xs text-gray-400">
            Looking for something specific? Try the search above or browse our
            popular sections.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-3 text-xs">
            <Link
              href="/sessions/group"
              className="text-gray-500 hover:text-purple-600"
            >
              Group Sessions
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              href="/sessions/one-on-one"
              className="text-gray-500 hover:text-purple-600"
            >
              One-on-One
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              href="/tutors/featured"
              className="text-gray-500 hover:text-purple-600"
            >
              Featured Tutors
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              href="/communities/popular"
              className="text-gray-500 hover:text-purple-600"
            >
              Popular Communities
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
