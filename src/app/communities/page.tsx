// src/app/community/page.tsx
"use client";

import Link from "next/link";
import {
  Users,
  Calendar,
  Bell,
  MessageCircle,
  Share2,
  Star,
  ArrowLeft,
  Mail,
  ChevronRight,
} from "lucide-react";

export default function CommunityComingSoon() {
  const features = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community Spaces",
      description:
        "Create and join communities for schools, alumni groups, study circles, and professional networks.",
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Discussions & Forums",
      description:
        "Engage in topic-based discussions, share resources, and collaborate with members.",
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Community Events",
      description:
        "Organize and participate in community events, webinars, and study sessions.",
    },
    {
      icon: <Share2 className="w-6 h-6" />,
      title: "Resource Sharing",
      description:
        "Share learning materials, notes, and resources with your community.",
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: "Announcements",
      description:
        "Stay updated with community announcements and important notifications.",
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Member Recognition",
      description:
        "Recognize active members and contributors within your community.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="max-w-3xl mx-auto text-center mb-16">
          {/* Status Badge */}
          <div className="inline-flex items-center px-3 py-1 bg-purple-100 rounded-full mb-6">
            <span className="w-2 h-2 bg-purple-600 rounded-full animate-pulse mr-2"></span>
            <span className="text-sm font-medium text-purple-700">
              Coming Soon
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Communities
          </h1>

          <p className="text-xl text-gray-600 mb-6">
            Connect, collaborate, and learn together
          </p>

          <p className="text-gray-500 max-w-2xl mx-auto">
            We're building a space where educators, students, and institutions
            can come together to share knowledge, resources, and experiences.
            Join the waitlist to be notified when we launch.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:border-purple-200 hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mb-4">
                <div className="text-purple-600">{feature.icon}</div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Waitlist Section */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Get notified when we launch
            </h2>
            <p className="text-gray-600 mb-6">
              Be the first to know when Communities become available. We'll send
              you an email as soon as we're ready.
            </p>

            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none text-sm"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors text-sm whitespace-nowrap"
              >
                Notify Me
              </button>
            </form>

            <p className="text-xs text-gray-400 mt-4">
              We'll only send you updates about Communities. No spam,
              unsubscribe anytime.
            </p>
          </div>
        </div>

        {/* What to do in the meantime */}
        <div className="mt-16 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            In the meantime, explore:
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/sessions"
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
            >
              Browse Sessions
            </Link>
            <Link
              href="/tutors"
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
            >
              Find Tutors
            </Link>
            <Link
              href="/onboarding/tutor"
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
            >
              Become a Tutor
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} SomoHub. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                href="/terms"
                className="text-sm text-gray-500 hover:text-gray-900"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="text-sm text-gray-500 hover:text-gray-900"
              >
                Privacy
              </Link>
              <Link
                href="/contact"
                className="text-sm text-gray-500 hover:text-gray-900"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
