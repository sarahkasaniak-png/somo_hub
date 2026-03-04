// src/app/guidelines/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Users,
  MessageCircle,
  Video,
  Shield,
  AlertCircle,
  BookOpen,
  Heart,
  Flag,
  Ban,
  Star,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  FileText,
  Clock,
  Mail,
  School,
  GraduationCap,
} from "lucide-react";

export default function CommunityGuidelinesPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const sections = [
    {
      id: "mission",
      title: "Our Mission",
      icon: <Heart className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            SomoHub is built on the belief that education should be accessible,
            collaborative, and empowering. Our community brings together
            learners, educators, and institutions in a shared journey of growth
            and discovery.
          </p>
          <p className="text-gray-700">
            These Community Guidelines exist to ensure SomoHub remains a safe,
            respectful, and productive space for everyone. By using SomoHub, you
            agree to follow these guidelines and help us maintain a positive
            learning environment.
          </p>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-4">
            <p className="text-sm text-purple-800 flex items-start gap-2">
              <Heart className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>
                <span className="font-bold">Remember the human:</span> Behind
                every profile, comment, and session is a real person with
                feelings, goals, and challenges. Treat others as you would like
                to be treated.
              </span>
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "respect",
      title: "1. Be Respectful",
      icon: <Users className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 font-medium">
            Treat all community members with respect and dignity.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                <ThumbsUp className="w-4 h-4" />
                Do:
              </h4>
              <ul className="list-disc list-inside text-sm text-green-700 space-y-1">
                <li>Use inclusive and welcoming language</li>
                <li>Respect different opinions and perspectives</li>
                <li>Be constructive in feedback and criticism</li>
                <li>Acknowledge and learn from mistakes</li>
                <li>Celebrate others' achievements</li>
              </ul>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-medium text-red-800 mb-2 flex items-center gap-2">
                <ThumbsDown className="w-4 h-4" />
                Don't:
              </h4>
              <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                <li>Engage in personal attacks or insults</li>
                <li>Use discriminatory or hateful language</li>
                <li>Bully, harass, or intimidate others</li>
                <li>Dismiss or belittle others' experiences</li>
                <li>Engage in trolling or flame wars</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-2">
            <p className="text-sm text-yellow-800">
              <span className="font-bold">Zero Tolerance:</span> Harassment,
              hate speech, discrimination based on race, ethnicity, gender,
              religion, age, disability, or sexual orientation will result in
              immediate account suspension.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "content",
      title: "2. Content Standards",
      icon: <FileText className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 font-medium">
            All content posted on SomoHub must be appropriate, accurate, and
            educational.
          </p>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              2.1 Educational Content
            </h4>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Course materials should be accurate and well-researched</li>
              <li>Cite sources when using external content</li>
              <li>Respect intellectual property rights</li>
              <li>Keep content age-appropriate for your audience</li>
              <li>Update outdated information promptly</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              2.2 Prohibited Content
            </h4>
            <p className="text-sm text-gray-600 mb-2">
              The following content is strictly prohibited:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                <Ban className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">
                  Nudity or sexual content
                </span>
              </div>
              <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                <Ban className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">
                  Violent or graphic material
                </span>
              </div>
              <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                <Ban className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">
                  Hate speech or discrimination
                </span>
              </div>
              <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                <Ban className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">
                  Harassment or bullying
                </span>
              </div>
              <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                <Ban className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">
                  Misinformation or fake news
                </span>
              </div>
              <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                <Ban className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">
                  Spam or promotional content
                </span>
              </div>
              <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                <Ban className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">
                  Malware or harmful links
                </span>
              </div>
              <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                <Ban className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">
                  Illegal activities
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              2.3 Intellectual Property
            </h4>
            <p className="text-sm text-gray-600">
              You may only post content that you own or have permission to use.
              Copyright infringement will result in content removal and possible
              account termination. If you believe your copyright has been
              infringed, please contact our Copyright Agent at
              copyright@somohub.com.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "tutor",
      title: "3. Tutor Guidelines",
      icon: <GraduationCap className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 font-medium">
            Tutors are role models and educators. Additional expectations apply:
          </p>

          <div className="space-y-4">
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-medium text-gray-900 mb-1">
                3.1 Professionalism
              </h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Arrive on time for scheduled sessions</li>
                <li>Prepare materials in advance</li>
                <li>Maintain a professional appearance and environment</li>
                <li>Communicate clearly and respectfully</li>
                <li>Provide constructive feedback to students</li>
              </ul>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-medium text-gray-900 mb-1">
                3.2 Session Conduct
              </h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Start and end sessions on time</li>
                <li>Record sessions when required (with consent)</li>
                <li>Maintain student privacy and confidentiality</li>
                <li>Do not discriminate against any student</li>
                <li>Report technical issues promptly</li>
              </ul>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-medium text-gray-900 mb-1">
                3.3 Course Quality
              </h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Provide accurate and up-to-date information</li>
                <li>Respond to student questions within 48 hours</li>
                <li>Update course materials as needed</li>
                <li>Honor refund policies as stated</li>
                <li>Maintain professional boundaries with students</li>
              </ul>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">
                <span className="font-bold">Never:</span> Engage in romantic or
                inappropriate relationships with students, share personal
                contact information outside the platform, accept payments
                outside SomoHub, or provide false credentials.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "student",
      title: "4. Student Guidelines",
      icon: <BookOpen className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 font-medium">
            Students are expected to engage respectfully and actively:
          </p>

          <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
            <li>Attend scheduled sessions punctually</li>
            <li>Complete assigned work and preparations</li>
            <li>Participate actively and respectfully</li>
            <li>Provide honest feedback to tutors</li>
            <li>Report any issues or concerns promptly</li>
            <li>Respect tutors' time and expertise</li>
            <li>Do not share session recordings without permission</li>
            <li>Do not harass or abuse tutors or other students</li>
          </ul>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-2">
            <p className="text-sm text-blue-800">
              <span className="font-bold">Pro Tip:</span> The more you put into
              your learning, the more you'll get out of it. Ask questions, take
              notes, and practice between sessions!
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "community",
      title: "5. Community/Institution Guidelines",
      icon: <School className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 font-medium">
            Communities and institutions have additional responsibilities:
          </p>

          <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
            <li>Maintain accurate and up-to-date community information</li>
            <li>Designate responsible administrators</li>
            <li>Moderate community content and discussions</li>
            <li>Ensure all members follow platform guidelines</li>
            <li>Respond to member reports and concerns</li>
            <li>
              Do not use the community for unauthorized commercial purposes
            </li>
            <li>Respect member privacy and data</li>
            <li>Provide accurate information about your institution</li>
          </ul>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <span className="font-bold">Community Administrators:</span> You
              are responsible for content posted by your members. Ensure your
              community remains a safe and respectful space.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "safety",
      title: "6. Safety & Privacy",
      icon: <Shield className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 font-medium">
            Your safety and privacy are our priority:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Personal Information
              </h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Never share passwords or account access</li>
                <li>Keep personal contact information private</li>
                <li>Use platform messaging for communications</li>
                <li>Report suspicious behavior immediately</li>
              </ul>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <Video className="w-4 h-4" />
                Session Safety
              </h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Sessions may be recorded for quality</li>
                <li>Do not share session links publicly</li>
                <li>Report inappropriate behavior during sessions</li>
                <li>Maintain professional conduct</li>
              </ul>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm text-purple-800">
              <span className="font-bold">If you feel unsafe:</span> Trust your
              instincts. Leave any session or conversation that makes you
              uncomfortable and report it immediately to safety@somohub.com.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "reporting",
      title: "7. Reporting Violations",
      icon: <Flag className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            If you see something that violates these guidelines:
          </p>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Flag className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">In-App Reporting</h4>
                <p className="text-sm text-gray-600">
                  Use the "Report" button on any content, profile, or message
                  that concerns you. Reports are reviewed within 24 hours.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Email Reporting</h4>
                <p className="text-sm text-gray-600">
                  For urgent matters, email report@somohub.com with details and
                  evidence.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Emergency</h4>
                <p className="text-sm text-gray-600">
                  If someone is in immediate danger, contact local emergency
                  services immediately, then notify us.
                </p>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-600 mt-4">
            All reports are taken seriously and investigated promptly. We may
            not be able to share the outcome of investigations due to privacy,
            but we take appropriate action on all valid reports.
          </p>
        </div>
      ),
    },
    {
      id: "enforcement",
      title: "8. Enforcement",
      icon: <Shield className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Violations of these guidelines may result in:
          </p>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 border-l-4 border-yellow-500 bg-yellow-50">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Warning</h4>
                <p className="text-sm text-gray-600">
                  First-time or minor violations may receive a warning.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 border-l-4 border-orange-500 bg-orange-50">
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Content Removal</h4>
                <p className="text-sm text-gray-600">
                  Violating content will be removed from the platform.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 border-l-4 border-red-500 bg-red-50">
              <Ban className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">
                  Temporary Suspension
                </h4>
                <p className="text-sm text-gray-600">
                  Accounts may be temporarily suspended for repeated or serious
                  violations.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 border-l-4 border-red-700 bg-red-100">
              <Ban className="w-5 h-5 text-red-800 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Permanent Ban</h4>
                <p className="text-sm text-gray-600">
                  Severe violations (harassment, hate speech, illegal
                  activities) result in immediate permanent ban without refund.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mt-2">
            <p className="text-sm text-gray-600">
              <span className="font-bold">Appeals:</span> If you believe action
              was taken in error, you may appeal by emailing appeals@somohub.com
              within 14 days.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "positive",
      title: "9. Building a Positive Community",
      icon: <Heart className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Beyond avoiding violations, we encourage everyone to actively build
            a positive community:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Star className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900">Encourage Others</h4>
              <p className="text-xs text-gray-600 mt-1">
                Leave positive reviews and encouraging comments
              </p>
            </div>

            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <HelpCircle className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900">Help Newcomers</h4>
              <p className="text-xs text-gray-600 mt-1">
                Welcome new members and answer questions
              </p>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <MessageCircle className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900">Share Knowledge</h4>
              <p className="text-xs text-gray-600 mt-1">
                Contribute to discussions and share resources
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white text-center mt-4">
            <h3 className="text-lg font-semibold mb-2">
              Together We Learn, Together We Grow
            </h3>
            <p className="text-sm text-purple-100">
              Every positive interaction makes SomoHub stronger. Thank you for
              being part of our community!
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "updates",
      title: "10. Guideline Updates",
      icon: <Clock className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <p className="text-gray-700">
            These guidelines may be updated as our community grows. We will
            notify users of significant changes via email or platform
            announcements.
          </p>
          <p className="text-sm text-gray-600">Last updated: March 1, 2026</p>
          <p className="text-sm text-gray-600">
            By continuing to use SomoHub after updates, you accept the revised
            guidelines.
          </p>
        </div>
      ),
    },
    {
      id: "contact-guidelines",
      title: "11. Questions & Contact",
      icon: <Mail className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Have questions about these guidelines? Need to report something?
          </p>

          <div className="bg-gray-50 rounded-lg p-6 space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-medium">General Questions</p>
                <p className="text-sm text-gray-600">community@somohub.com</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Flag className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-medium">Report Violations</p>
                <p className="text-sm text-gray-600">report@somohub.com</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-medium">Safety Concerns</p>
                <p className="text-sm text-gray-600">safety@somohub.com</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Ban className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-medium">Appeals</p>
                <p className="text-sm text-gray-600">appeals@somohub.com</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            We aim to respond to all inquiries within 48 hours.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Community Guidelines
            </h1>
          </div>
          <p className="text-gray-600">
            Our guidelines help maintain a safe, respectful, and productive
            learning environment for everyone. Please read them carefully.
          </p>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Links
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  const element = document.getElementById(section.id);
                  element?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-left text-sm text-purple-600 hover:text-purple-800 hover:underline"
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion Sections */}
        <div className="space-y-4">
          {sections.map((section) => (
            <div
              key={section.id}
              id={section.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    {section.icon}
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {section.title}
                  </h2>
                </div>
                {activeSection === section.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>

              {activeSection === section.id && (
                <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                  {section.content}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} SomoHub Limited. All rights reserved.
          </p>
          <p className="mt-2">
            <Link
              href="/terms"
              className="text-purple-600 hover:text-purple-800 mx-2"
            >
              Terms of Service
            </Link>
            |
            <Link
              href="/privacy"
              className="text-purple-600 hover:text-purple-800 mx-2"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
