// src/app/privacy/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Shield,
  Lock,
  Eye,
  Database,
  Mail,
  Phone,
  Clock,
  FileText,
  Users,
  Cookie,
  Trash2,
  Download,
  AlertCircle,
} from "lucide-react";

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const sections = [
    {
      id: "introduction",
      title: "1. Introduction",
      icon: <FileText className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <p className="text-gray-700">
            SomoHub Limited ("Company," "we," "our," "us") respects your privacy
            and is committed to protecting your personal data. This Privacy
            Policy explains how we collect, use, disclose, and safeguard your
            information when you use our platform, website, mobile applications,
            and services (collectively, the "Platform").
          </p>
          <p className="text-gray-700">
            We comply with the Kenya Data Protection Act, 2019, the General Data
            Protection Regulation (GDPR) for users in the European Union, and
            other applicable data protection laws. Please read this policy
            carefully to understand our practices regarding your personal data.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <p className="text-sm text-blue-800 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>
                <span className="font-bold">Data Controller:</span> SomoHub
                Limited, P.O. Box 12345-00100, Nairobi, Kenya. Email:
                privacy@somohub.com
              </span>
            </p>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Last Updated: March 1, 2026
          </p>
        </div>
      ),
    },
    {
      id: "information-collect",
      title: "2. Information We Collect",
      icon: <Database className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
              <Users className="w-4 h-4" />
              2.1 Personal Information You Provide
            </h4>
            <p className="text-sm text-gray-600 mb-2">
              We collect information you voluntarily provide when you:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Create an account (name, email, phone number)</li>
              <li>
                Complete your profile (date of birth, location, profile photo)
              </li>
              <li>
                Apply as a tutor (National ID, educational certificates, TSC
                number)
              </li>
              <li>
                Register a community (institution documents, accreditation)
              </li>
              <li>Make payments (payment details processed by Paystack)</li>
              <li>Communicate with us or other users</li>
              <li>Participate in surveys or promotions</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              2.2 Information Automatically Collected
            </h4>
            <p className="text-sm text-gray-600 mb-2">
              When you use our Platform, we automatically collect:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>
                Device information (IP address, browser type, operating system)
              </li>
              <li>
                Usage data (pages visited, time spent, clicks, navigation)
              </li>
              <li>Location information (general location from IP address)</li>
              <li>Cookies and similar tracking technologies</li>
              <li>Session recordings for quality improvement</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
              <Users className="w-4 h-4" />
              2.3 Information from Third Parties
            </h4>
            <p className="text-sm text-gray-600 mb-2">
              We may receive information from:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Payment processors (Paystack - transaction confirmations)</li>
              <li>Authentication providers (Google login)</li>
              <li>Background check services (for tutor verification)</li>
              <li>Social media platforms (when you connect accounts)</li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Sensitive Data</h4>
            <p className="text-sm text-gray-600">
              We collect certain sensitive data only for tutor verification
              purposes, including National ID numbers, educational certificates,
              and TSC numbers. This information is encrypted, access-restricted,
              and used solely for verification. It is retained only as long as
              necessary for legal and operational purposes.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "how-use",
      title: "3. How We Use Your Information",
      icon: <Database className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <p className="text-gray-700">We use your personal information to:</p>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
            <li>
              <span className="font-medium">
                Provide and maintain our services
              </span>{" "}
              - Create accounts, process enrollments, facilitate tutoring
              sessions
            </li>
            <li>
              <span className="font-medium">Verify identities</span> - Conduct
              tutor and community verification checks
            </li>
            <li>
              <span className="font-medium">Process payments</span> - Handle
              transactions, send receipts, manage subscriptions
            </li>
            <li>
              <span className="font-medium">Communicate with you</span> - Send
              important updates, notifications, and marketing materials (with
              consent)
            </li>
            <li>
              <span className="font-medium">Improve our platform</span> -
              Analyze usage patterns, fix bugs, enhance user experience
            </li>
            <li>
              <span className="font-medium">Ensure security</span> - Detect
              fraud, prevent abuse, enforce our terms
            </li>
            <li>
              <span className="font-medium">Comply with legal obligations</span>{" "}
              - Maintain records, respond to legal requests
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "legal-basis",
      title: "4. Legal Basis for Processing (GDPR)",
      icon: <Shield className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <p className="text-gray-700">
            For users in the European Union, we process your data based on:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
            <li>
              <span className="font-medium">Contract Performance:</span> To
              provide our services and fulfill our agreements
            </li>
            <li>
              <span className="font-medium">Legal Obligations:</span> To comply
              with applicable laws and regulations
            </li>
            <li>
              <span className="font-medium">Legitimate Interests:</span> To
              improve our services, ensure security, and prevent fraud
            </li>
            <li>
              <span className="font-medium">Consent:</span> For marketing
              communications and optional data collection
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "sharing",
      title: "5. How We Share Your Information",
      icon: <Users className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">We may share your information with:</p>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              5.1 Service Providers
            </h4>
            <p className="text-sm text-gray-600">
              Third-party vendors who help us operate our business:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
              <li>Paystack - payment processing</li>
              <li>Cloud storage providers - data hosting</li>
              <li>Analytics services - usage tracking</li>
              <li>Email service providers - communications</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">5.2 Other Users</h4>
            <p className="text-sm text-gray-600">
              Information you choose to share publicly:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
              <li>Your profile information is visible to other users</li>
              <li>Tutor profiles are publicly accessible</li>
              <li>Community information is visible to members</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              5.3 Legal Requirements
            </h4>
            <p className="text-sm text-gray-600">
              We may disclose information if required by law, court order, or
              government agency, or to protect our rights, property, or safety.
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <span className="font-bold">Important:</span> We do not sell your
              personal information to third parties. Your data is only shared as
              necessary to provide our services or comply with legal
              obligations.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "cookies",
      title: "6. Cookies & Tracking Technologies",
      icon: <Cookie className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            We use cookies and similar technologies to enhance your experience:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Cookie Type</th>
                  <th className="px-4 py-2 text-left">Purpose</th>
                  <th className="px-4 py-2 text-left">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3 font-medium">Essential</td>
                  <td className="px-4 py-3">
                    Authentication, security, session management
                  </td>
                  <td className="px-4 py-3">Session / 30 days</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3 font-medium">Functional</td>
                  <td className="px-4 py-3">Preferences, language settings</td>
                  <td className="px-4 py-3">1 year</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3 font-medium">Analytics</td>
                  <td className="px-4 py-3">
                    Usage patterns, performance tracking
                  </td>
                  <td className="px-4 py-3">2 years</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Marketing</td>
                  <td className="px-4 py-3">Personalized ads (with consent)</td>
                  <td className="px-4 py-3">90 days</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-sm text-gray-600 mt-4">
            You can control cookies through your browser settings. Disabling
            essential cookies may affect platform functionality.
          </p>
        </div>
      ),
    },
    {
      id: "data-security",
      title: "7. Data Security",
      icon: <Lock className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            We implement appropriate technical and organizational measures to
            protect your personal data:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Encryption
              </h4>
              <p className="text-sm text-gray-600">
                All data transmitted between your device and our servers is
                encrypted using TLS 1.3. Sensitive data is encrypted at rest
                using AES-256.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Access Control
              </h4>
              <p className="text-sm text-gray-600">
                Strict access controls, multi-factor authentication, and regular
                access reviews for all employees and contractors.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Monitoring
              </h4>
              <p className="text-sm text-gray-600">
                24/7 security monitoring, intrusion detection systems, and
                regular security audits.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <Database className="w-4 h-4" />
                Backups
              </h4>
              <p className="text-sm text-gray-600">
                Regular encrypted backups stored in secure, geographically
                distributed locations.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <p className="text-sm text-blue-800">
              <span className="font-bold">Security Incident Response:</span> We
              have procedures to deal with any suspected personal data breach
              and will notify you and any applicable regulator of a breach where
              we are legally required to do so.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "data-retention",
      title: "8. Data Retention",
      icon: <Clock className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <p className="text-gray-700">
            We retain your personal data only as long as necessary:
          </p>

          <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
            <li>
              <span className="font-medium">Account information:</span> Until
              you delete your account, plus 90 days for backup recovery
            </li>
            <li>
              <span className="font-medium">Tutor verification documents:</span>{" "}
              For the duration of your tutor status plus 3 years for legal
              compliance
            </li>
            <li>
              <span className="font-medium">Payment records:</span> 7 years
              (required by Kenyan tax law)
            </li>
            <li>
              <span className="font-medium">Communications:</span> 2 years for
              customer service purposes
            </li>
            <li>
              <span className="font-medium">Usage logs:</span> 90 days for
              security analysis
            </li>
          </ul>

          <p className="text-sm text-gray-600 mt-2">
            After the retention period, your data is securely deleted or
            anonymized for analytical purposes.
          </p>
        </div>
      ),
    },
    {
      id: "your-rights",
      title: "9. Your Rights",
      icon: <Shield className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Depending on your location, you may have the following rights:
          </p>

          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Eye className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Right to Access</h4>
                <p className="text-sm text-gray-600">
                  Request a copy of the personal data we hold about you.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Database className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">
                  Right to Rectification
                </h4>
                <p className="text-sm text-gray-600">
                  Correct inaccurate or incomplete data.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Trash2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Right to Erasure</h4>
                <p className="text-sm text-gray-600">
                  Request deletion of your data (subject to legal exceptions).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Download className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">
                  Right to Data Portability
                </h4>
                <p className="text-sm text-gray-600">
                  Receive your data in a structured, machine-readable format.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Right to Object</h4>
                <p className="text-sm text-gray-600">
                  Object to processing based on legitimate interests.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
            <p className="text-sm text-green-800">
              <span className="font-bold">To exercise your rights:</span> Email
              privacy@somohub.com or use the "Data Request" form in your account
              settings. We will respond within 30 days.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "children",
      title: "10. Children's Privacy",
      icon: <Users className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <p className="text-gray-700">
            Our Platform is not intended for children under 13. We do not
            knowingly collect personal information from children under 13. If
            you are a parent or guardian and believe your child has provided us
            with personal data, please contact us immediately.
          </p>
          <p className="text-gray-700">
            Users between 13 and 18 may use the Platform only with parental
            consent and supervision. Certain features (like becoming a tutor)
            require users to be at least 18.
          </p>
        </div>
      ),
    },
    {
      id: "international",
      title: "11. International Data Transfers",
      icon: <Database className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <p className="text-gray-700">
            Your information may be transferred to and processed in countries
            other than your own. We ensure appropriate safeguards are in place:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
            <li>
              Data processing agreements based on EU Standard Contractual
              Clauses
            </li>
            <li>Adequacy decisions where applicable</li>
            <li>Binding corporate rules for our service providers</li>
          </ul>
          <p className="text-sm text-gray-600">
            Our servers are primarily located in Kenya and the European Union.
          </p>
        </div>
      ),
    },
    {
      id: "changes-privacy",
      title: "12. Changes to This Policy",
      icon: <FileText className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <p className="text-gray-700">
            We may update this Privacy Policy from time to time. We will notify
            you of material changes by:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
            <li>
              Posting the new policy on this page with an updated revision date
            </li>
            <li>Sending an email notification (for significant changes)</li>
            <li>Displaying a notice on the Platform</li>
          </ul>
          <p className="text-sm text-gray-600">
            We encourage you to review this Privacy Policy periodically for any
            changes.
          </p>
        </div>
      ),
    },
    {
      id: "contact-privacy",
      title: "13. Contact Us",
      icon: <Mail className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            If you have questions about this Privacy Policy or our data
            practices:
          </p>

          <div className="bg-gray-50 rounded-lg p-6 space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-gray-600">privacy@somohub.com</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-medium">Phone</p>
                <p className="text-sm text-gray-600">+254 700 000 000</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-medium">Data Protection Officer</p>
                <p className="text-sm text-gray-600">dpo@somohub.com</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Database className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-medium">Postal Address</p>
                <p className="text-sm text-gray-600">
                  SomoHub Limited
                  <br />
                  P.O. Box 12345-00100
                  <br />
                  Nairobi, Kenya
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm text-purple-800">
              <span className="font-bold">Data Protection Complaint:</span> If
              you are unsatisfied with our response, you have the right to lodge
              a complaint with the Office of the Data Protection Commissioner
              (Kenya) at complaints@odpc.go.ke or +254 700 000 001.
            </p>
          </div>
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
            <Shield className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
          </div>
          <p className="text-gray-600">
            Your privacy is important to us. This policy explains how we
            collect, use, and protect your personal information on the SomoHub
            platform.
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
              href="/guidelines"
              className="text-purple-600 hover:text-purple-800 mx-2"
            >
              Community Guidelines
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
