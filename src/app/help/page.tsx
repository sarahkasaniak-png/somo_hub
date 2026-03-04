// src/app/help/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  ArrowLeft,
  ChevronRight,
  BookOpen,
  Users,
  GraduationCap,
  CreditCard,
  Shield,
  HelpCircle,
  MessageCircle,
  FileText,
  Video,
  Clock,
  Mail,
  Phone,
  ExternalLink,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: <BookOpen className="w-6 h-6" />,
      description: "New to SomoHub? Start here",
      color: "purple",
      articles: [
        "Creating an account",
        "Completing your profile",
        "Understanding your dashboard",
        "Email verification process",
        "Setting up notifications",
      ],
    },
    {
      id: "students",
      title: "For Students",
      icon: <Users className="w-6 h-6" />,
      description: "Learn how to enroll and learn",
      color: "blue",
      articles: [
        "How to enroll in a session",
        "Joining a live session",
        "Accessing course materials",
        "Leaving reviews for tutors",
        "Requesting refunds",
        "Tracking your progress",
      ],
    },
    {
      id: "tutors",
      title: "For Tutors",
      icon: <GraduationCap className="w-6 h-6" />,
      description: "Everything about tutoring on SomoHub",
      color: "green",
      articles: [
        "Tutor application process",
        "Understanding the onboarding fee (KES 1,160)",
        "Creating your first course",
        "Setting up session schedules",
        "Managing enrollments",
        "Receiving payments",
        "Tutor dashboard guide",
      ],
    },
    {
      id: "communities",
      title: "Communities",
      icon: <Users className="w-6 h-6" />,
      description: "Coming soon - Community features",
      color: "yellow",
      articles: [
        "What are Communities?",
        "Creating a community",
        "Joining existing communities",
        "Community roles and permissions",
        "Managing community content",
      ],
      comingSoon: true,
    },
    {
      id: "payments",
      title: "Payments & Billing",
      icon: <CreditCard className="w-6 h-6" />,
      description: "Fees, refunds, and payment issues",
      color: "red",
      articles: [
        "Tutor onboarding fee (KES 1,160)",
        "Session enrollment payments",
        "Payment methods accepted",
        "Refund policy",
        "Understanding invoices",
        "Troubleshooting payment issues",
        "Paystack integration",
      ],
    },
    {
      id: "account",
      title: "Account Management",
      icon: <Shield className="w-6 h-6" />,
      description: "Manage your account settings",
      color: "indigo",
      articles: [
        "Changing your password",
        "Updating profile information",
        "Privacy settings",
        "Deleting your account",
        "Two-factor authentication",
        "Login issues",
      ],
    },
    {
      id: "technical",
      title: "Technical Support",
      icon: <HelpCircle className="w-6 h-6" />,
      description: "Troubleshooting and technical help",
      color: "gray",
      articles: [
        "Browser requirements",
        "Video session issues",
        "Mobile app help",
        "Connectivity problems",
        "Reporting technical bugs",
        "System requirements",
      ],
    },
    {
      id: "safety",
      title: "Safety & Guidelines",
      icon: <Shield className="w-6 h-6" />,
      description: "Community guidelines and safety",
      color: "purple",
      articles: [
        "Community guidelines overview",
        "Reporting inappropriate content",
        "Safety tips for students",
        "Safety tips for tutors",
        "Handling disputes",
        "Privacy and data protection",
      ],
    },
  ];

  const popularArticles = [
    {
      title: "How to become a tutor on SomoHub",
      category: "Tutors",
      reads: "2.5k reads",
      link: "/help/tutor-application",
    },
    {
      title: "Understanding the KES 1,160 tutor fee",
      category: "Payments",
      reads: "1.8k reads",
      link: "/help/tutor-fee",
    },
    {
      title: "How to join a live session",
      category: "Students",
      reads: "3.2k reads",
      link: "/help/join-session",
    },
    {
      title: "Payment methods and refunds",
      category: "Payments",
      reads: "1.4k reads",
      link: "/help/payments",
    },
    {
      title: "Creating your first course",
      category: "Tutors",
      reads: "2.1k reads",
      link: "/help/create-course",
    },
    {
      title: "Community guidelines summary",
      category: "Safety",
      reads: "1.2k reads",
      link: "/help/guidelines",
    },
  ];

  const filteredCategories = categories.filter(
    (category) => !selectedCategory || category.id === selectedCategory,
  );

  const filteredArticles = (articles: string[]) => {
    if (!searchQuery) return articles;
    return articles.filter((article) =>
      article.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-1">
              <div className="w-8 h-8">
                <img
                  src="/images/logo_purple.png"
                  alt="SomoHub Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl font-semibold text-main">SomoHub</span>
            </Link>

            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section with Search */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How can we help you?
          </h1>
          <p className="text-lg text-purple-100 mb-8">
            Search our help center or browse categories below
          </p>

          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for articles, tutorials, FAQs..."
              className="w-full px-6 py-4 pr-12 rounded-xl border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:outline-none focus:border-white/40 transition-colors"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter Chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !selectedCategory
                ? "bg-purple-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? `bg-${category.color}-600 text-white`
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {category.title}
            </button>
          ))}
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredCategories.map((category) => {
            const articles = filteredArticles(category.articles);

            return (
              <div
                key={category.id}
                className={`bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow ${
                  category.comingSoon ? "opacity-75" : ""
                }`}
              >
                {/* Header */}
                <div
                  className={`p-6 border-b border-gray-100 bg-${category.color}-50`}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`w-12 h-12 bg-${category.color}-100 rounded-lg flex items-center justify-center`}
                    >
                      <div className={`text-${category.color}-600`}>
                        {category.icon}
                      </div>
                    </div>
                    {category.comingSoon && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mt-3">
                    {category.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {category.description}
                  </p>
                </div>

                {/* Articles List */}
                <div className="p-6">
                  {articles.length > 0 ? (
                    <ul className="space-y-2">
                      {articles.slice(0, 5).map((article, index) => (
                        <li key={index}>
                          <Link
                            href={`/help/${category.id}/${index}`}
                            className="text-sm text-gray-600 hover:text-purple-600 flex items-center gap-2 group"
                          >
                            <FileText className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
                            {article}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No matching articles found
                    </p>
                  )}

                  {articles.length > 5 && (
                    <Link
                      href={`/help/${category.id}`}
                      className="mt-4 text-sm text-purple-600 hover:text-purple-800 font-medium inline-flex items-center gap-1"
                    >
                      View all {articles.length} articles
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Popular Articles Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Popular Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {popularArticles.map((article, index) => (
              <Link
                key={index}
                href={article.link}
                className="p-4 bg-gray-50 rounded-lg hover:bg-purple-50 transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 group-hover:text-purple-600 mb-1">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-purple-600">
                        {article.category}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500">{article.reads}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Still Need Help? Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-3">Still need help?</h2>
              <p className="text-purple-100 mb-6">
                Can't find what you're looking for? Our support team is here to
                help.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="px-6 py-3 bg-white text-purple-600 font-medium rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Contact Support
                </Link>
                <Link
                  href="/faq"
                  className="px-6 py-3 border-2 border-white/30 text-white font-medium rounded-lg hover:bg-white/10 transition-colors inline-flex items-center gap-2"
                >
                  <HelpCircle className="w-4 h-4" />
                  Visit FAQ
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <Mail className="w-6 h-6 mb-2" />
                <p className="font-medium">Email</p>
                <p className="text-sm text-purple-200">support@somohub.com</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <Phone className="w-6 h-6 mb-2" />
                <p className="font-medium">Phone</p>
                <p className="text-sm text-purple-200">+254 700 000 000</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <Clock className="w-6 h-6 mb-2" />
                <p className="font-medium">Response Time</p>
                <p className="text-sm text-purple-200">24-48 hours</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <MessageCircle className="w-6 h-6 mb-2" />
                <p className="font-medium">Live Chat</p>
                <p className="text-sm text-purple-200">Coming soon</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/terms"
            className="p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-300 transition-colors text-center"
          >
            <FileText className="w-5 h-5 text-purple-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">
              Terms of Service
            </p>
          </Link>
          <Link
            href="/privacy"
            className="p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-300 transition-colors text-center"
          >
            <Shield className="w-5 h-5 text-purple-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Privacy Policy</p>
          </Link>
          <Link
            href="/guidelines"
            className="p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-300 transition-colors text-center"
          >
            <Users className="w-5 h-5 text-purple-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">
              Community Guidelines
            </p>
          </Link>
          <Link
            href="/contact"
            className="p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-300 transition-colors text-center"
          >
            <Mail className="w-5 h-5 text-purple-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Contact Us</p>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
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
                href="/guidelines"
                className="text-sm text-gray-500 hover:text-gray-900"
              >
                Guidelines
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
