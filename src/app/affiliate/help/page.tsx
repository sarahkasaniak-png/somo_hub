// src/app/affiliate/help/page.tsx
"use client";

import Link from "next/link";
import {
  HelpCircle,
  TrendingUp,
  DollarSign,
  Users,
  Wallet,
  Shield,
  Mail,
  MessageCircle,
  BookOpen,
  Video,
  FileText,
  ChevronRight,
} from "lucide-react";

export default function AffiliateHelpPage() {
  const faqs = [
    {
      question: "How do I earn commissions?",
      answer:
        "You earn 5% commission on every student enrolled by tutors who signed up using your affiliate code. The commission applies to the first 100 students per referred tutor.",
    },
    {
      question: "When do I get paid?",
      answer:
        "Payouts are processed weekly for affiliates with a minimum balance of KES 1,000. Once approved, payments are sent within 3-5 business days.",
    },
    {
      question: "How do I track my referrals?",
      answer:
        "You can track all your referrals in the 'My Referrals' section. You'll see their status, application date, and whether they've been approved.",
    },
    {
      question: "What happens if a referred tutor is rejected?",
      answer:
        "If a tutor's application is rejected, you won't earn commissions from them. However, they can reapply, and if approved later, you'll earn from future enrollments.",
    },
    {
      question: "Can I change my payout method?",
      answer:
        "Yes! Go to Settings to update your payout method. You can choose between Bank Transfer, Mobile Money (M-PESA), or PayPal.",
    },
    {
      question: "Is there a limit to how much I can earn?",
      answer:
        "No, there's no limit! You can refer unlimited tutors and earn commissions on their first 100 students each. The more tutors you refer, the more you earn!",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Help Center</h1>
        <p className="text-gray-600 mt-1">
          Everything you need to know about being a SomoHub affiliate
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/affiliate/dashboard"
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Dashboard</p>
              <p className="text-xs text-gray-500">View earnings</p>
            </div>
          </div>
        </Link>

        <Link
          href="/affiliate/referrals"
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Referrals</p>
              <p className="text-xs text-gray-500">Track your referrals</p>
            </div>
          </div>
        </Link>

        <Link
          href="/affiliate/commissions"
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Commissions</p>
              <p className="text-xs text-gray-500">View earnings</p>
            </div>
          </div>
        </Link>

        <Link
          href="/affiliate/payouts"
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Wallet className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Payouts</p>
              <p className="text-xs text-gray-500">Request payment</p>
            </div>
          </div>
        </Link>
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {faqs.map((faq, index) => (
            <div key={index} className="p-6">
              <h3 className="font-medium text-gray-900 mb-2">{faq.question}</h3>
              <p className="text-gray-600 text-sm">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Getting Started */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Getting Started
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              1
            </div>
            <div>
              <p className="font-medium text-gray-900">Share Your Code</p>
              <p className="text-sm text-gray-600">
                Share your unique affiliate code with potential tutors
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              2
            </div>
            <div>
              <p className="font-medium text-gray-900">Track Referrals</p>
              <p className="text-sm text-gray-600">
                Monitor when tutors sign up using your code
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              3
            </div>
            <div>
              <p className="font-medium text-gray-900">Earn Commissions</p>
              <p className="text-sm text-gray-600">
                Get paid when your referred tutors teach students
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-purple-100 rounded-lg">
            <MessageCircle className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              Still have questions?
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              Our support team is here to help you with any questions about the
              affiliate program.
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href="mailto:affiliates@somohub.com"
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
              >
                <Mail className="w-4 h-4" />
                Email Support
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                <HelpCircle className="w-4 h-4" />
                Contact Form
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Resources */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* <Link
          href="/affiliate/guide"
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-gray-900">Affiliate Guide</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
        </Link> */}

        {/* <Link
          href="/affiliate/videos"
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Video className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-gray-900">Video Tutorials</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
        </Link> */}

        <Link
          href="/affiliate/terms"
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-gray-900">
              Terms & Conditions
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
