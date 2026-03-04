// src/app/terms/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Shield,
  CreditCard,
  Users,
  BookOpen,
  AlertCircle,
  Calendar,
  FileText,
} from "lucide-react";

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const sections = [
    {
      id: "acceptance",
      title: "1. Acceptance of Terms",
      icon: <FileText className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <p>
            By accessing or using the SomoHub platform, website, mobile
            application, or any services provided by SomoHub ("the Platform"),
            you agree to be bound by these Terms of Service ("Terms"). If you do
            not agree to these Terms, you may not access or use the Platform.
          </p>
          <p>
            These Terms constitute a legally binding agreement between you
            ("User", "You", "Your") and SomoHub Limited ("Company", "We", "Us",
            "Our"), registered in Kenya. By using our services, you acknowledge
            that you have read, understood, and agree to be bound by these
            Terms.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Last Updated: March 1, 2026
          </p>
        </div>
      ),
    },
    {
      id: "definitions",
      title: "2. Definitions",
      icon: <BookOpen className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <ul className="list-disc list-inside space-y-2">
            <li>
              <span className="font-medium">"Platform"</span> refers to the
              SomoHub website, mobile applications, and all related services.
            </li>
            <li>
              <span className="font-medium">"User"</span> refers to any
              individual who accesses or uses the Platform, including Students,
              Tutors, and Community Members.
            </li>
            <li>
              <span className="font-medium">"Student"</span> refers to a User
              who enrolls in courses or sessions for learning purposes.
            </li>
            <li>
              <span className="font-medium">"Tutor"</span> refers to a verified
              User who creates and delivers educational content, courses, or
              sessions through the Platform.
            </li>
            <li>
              <span className="font-medium">"Community"</span> refers to an
              educational institution, organization, or group registered on the
              Platform.
            </li>
            <li>
              <span className="font-medium">"Content"</span> refers to all
              materials, including courses, videos, documents, and
              communications posted on the Platform.
            </li>
            <li>
              <span className="font-medium">"Subscription"</span> refers to the
              recurring fee paid by Tutors and Communities for access to
              Platform features.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "accounts",
      title: "3. User Accounts & Eligibility",
      icon: <Users className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">3.1 Eligibility</h4>
            <p>By creating an account, you represent and warrant that:</p>
            <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
              <li>You are at least 18 years of age</li>
              <li>
                You have the legal capacity to enter into binding contracts
              </li>
              <li>
                All information provided is accurate, current, and complete
              </li>
              <li>You will maintain and update your information as needed</li>
              <li>
                You are not located in a country subject to government sanctions
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              3.2 Account Responsibilities
            </h4>
            <p>You are solely responsible for:</p>
            <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
              <li>
                Maintaining the confidentiality of your account credentials
              </li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
              <li>Ensuring your use complies with applicable laws</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              3.3 Account Suspension
            </h4>
            <p>We reserve the right to suspend or terminate accounts that:</p>
            <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
              <li>Violate these Terms or applicable laws</li>
              <li>Provide false or misleading information</li>
              <li>Engage in fraudulent or harmful activities</li>
              <li>Infringe on intellectual property rights</li>
              <li>Are inactive for more than 12 consecutive months</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "tutor-terms",
      title: "4. Tutor Terms & Subscription",
      icon: <Shield className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">
                  Important: Tutor Payment Terms
                </h4>
                <p className="text-sm text-yellow-700 mt-1">
                  The tutor onboarding fee of KES 1,160 (including VAT) is
                  <span className="font-bold"> non-refundable</span> under any
                  circumstances.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              4.1 Tutor Onboarding Fee
            </h4>
            <p className="text-sm text-gray-600">
              The standard annual subscription fee for tutors is KES 10,000. A
              90% launch discount (KES 9,000) is currently applied, resulting in
              a base fee of KES 1,000. VAT of 16% (KES 160) is added, making the
              total payment KES 1,160.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              4.2 Non-Refundable Policy
            </h4>
            <p className="text-sm text-gray-600">
              The entire amount of KES 1,160 is strictly non-refundable
              regardless of:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
              <li>Application outcome (approved, rejected, or under review)</li>
              <li>Decision to withdraw application</li>
              <li>Inability to complete verification</li>
              <li>Technical issues during application</li>
              <li>Changes in personal circumstances</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              4.3 Tutor Verification
            </h4>
            <p className="text-sm text-gray-600">
              All tutors must complete identity verification and provide
              required documentation including National ID, educational
              certificates, and teaching credentials where applicable. False
              information will result in immediate rejection and permanent ban.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              4.4 Subscription Period
            </h4>
            <p className="text-sm text-gray-600">
              Upon approval, tutors receive a 12-month subscription starting
              from the approval date. Renewal fees apply annually. Failure to
              renew may result in suspension of tutoring privileges.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "community-terms",
      title: "5. Community/Institution Terms",
      icon: <Users className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p>
            Communities, schools, and institutions registering on SomoHub agree
            to:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
            <li>
              Provide valid registration documents and accreditation
              certificates
            </li>
            <li>
              Designate authorized administrators for the community account
            </li>
            <li>
              Ensure all content posted complies with educational standards
            </li>
            <li>
              Pay applicable community membership fees (currently KES 45/month)
            </li>
            <li>Moderate member activity and content appropriately</li>
            <li>Respond to user reports and complaints promptly</li>
          </ul>
          <p className="text-sm text-gray-600 mt-2">
            Community fees are non-refundable after the 14-day cooling-off
            period.
          </p>
        </div>
      ),
    },
    {
      id: "payments",
      title: "6. Payments & Refunds",
      icon: <CreditCard className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              6.1 Payment Processing
            </h4>
            <p>
              All payments are processed securely through Paystack, a PCI-DSS
              compliant payment gateway. SomoHub does not store credit card
              details. By making a payment, you agree to Paystack's terms of
              service.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">6.2 Fee Schedule</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2">Service</th>
                    <th className="text-right py-2">Fee (KES)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-2">Tutor Onboarding (Annual)</td>
                    <td className="text-right py-2 font-medium">1,160</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2">Community Membership (Monthly)</td>
                    <td className="text-right py-2 font-medium">45</td>
                  </tr>
                  <tr>
                    <td className="py-2">Session Enrollment (Varies)</td>
                    <td className="text-right py-2 font-medium">Per Session</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              6.3 Refund Policy
            </h4>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
              <li>
                <span className="font-medium">Tutor Onboarding:</span>{" "}
                Non-refundable as stated in Section 4.2
              </li>
              <li>
                <span className="font-medium">Session Enrollments:</span>{" "}
                Refunds available within 48 hours of enrollment if no classes
                attended. After 48 hours or if any class attended, no refunds.
              </li>
              <li>
                <span className="font-medium">Community Fees:</span> Refundable
                within 14 days of payment, after which they are non-refundable.
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">6.4 Disputes</h4>
            <p>
              Any payment disputes must be reported within 30 days. We will
              investigate and resolve disputes in accordance with applicable
              laws and these Terms.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "content",
      title: "7. Content & Intellectual Property",
      icon: <BookOpen className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">7.1 User Content</h4>
            <p>
              By posting content on SomoHub, you grant us a non-exclusive,
              worldwide, royalty-free license to host, use, distribute, and
              promote your content in connection with the Platform. You retain
              ownership of your content.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              7.2 Prohibited Content
            </h4>
            <p>Users may not post content that:</p>
            <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
              <li>Infringes on intellectual property rights</li>
              <li>Is defamatory, obscene, or discriminatory</li>
              <li>Contains malware or harmful code</li>
              <li>Violates any applicable laws</li>
              <li>Impersonates others or provides false information</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              7.3 Platform Content
            </h4>
            <p>
              All SomoHub trademarks, logos, and platform materials are our
              exclusive property. Users may not use them without written
              permission.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "privacy",
      title: "8. Privacy & Data Protection",
      icon: <Shield className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <p>
            Your privacy is important to us. Our collection and use of personal
            data is governed by our Privacy Policy, which is incorporated into
            these Terms by reference.
          </p>
          <p>
            We comply with the Kenya Data Protection Act, 2019. By using
            SomoHub, you consent to the collection and processing of your data
            as described in our Privacy Policy.
          </p>
          <p className="text-sm text-gray-600">
            For full details, please review our{" "}
            <Link
              href="/privacy"
              className="text-purple-600 hover:text-purple-800"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      ),
    },
    {
      id: "limitations",
      title: "9. Limitations of Liability",
      icon: <AlertCircle className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <p>
            To the maximum extent permitted by law, SomoHub shall not be liable
            for:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
            <li>Indirect, incidental, or consequential damages</li>
            <li>Loss of profits, data, or business opportunities</li>
            <li>
              Damages exceeding the amount paid to SomoHub in the past 12 months
            </li>
            <li>
              Content or actions of third parties, including tutors and students
            </li>
          </ul>
          <p>
            The Platform is provided "as is" without warranties of any kind.
          </p>
        </div>
      ),
    },
    {
      id: "termination",
      title: "10. Termination",
      icon: <Calendar className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <p>Either party may terminate this agreement:</p>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
            <li>
              <span className="font-medium">By User:</span> You may delete your
              account at any time through platform settings
            </li>
            <li>
              <span className="font-medium">By SomoHub:</span> We may suspend or
              terminate access for violations of these Terms
            </li>
          </ul>
          <p>
            Upon termination, your right to access the Platform ceases
            immediately. Sections regarding payments, content, and limitations
            of liability survive termination.
          </p>
        </div>
      ),
    },
    {
      id: "disputes",
      title: "11. Dispute Resolution",
      icon: <Shield className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <p>
            Any disputes arising from these Terms shall be resolved as follows:
          </p>
          <ol className="list-decimal list-inside text-sm text-gray-600 space-y-2">
            <li>Informal resolution through customer support within 30 days</li>
            <li>
              Mediation through a mutually agreed mediator in Nairobi, Kenya
            </li>
            <li>Arbitration in accordance with the Arbitration Act of Kenya</li>
            <li>Courts of Kenya shall have exclusive jurisdiction</li>
          </ol>
          <p>These Terms are governed by the laws of the Republic of Kenya.</p>
        </div>
      ),
    },
    {
      id: "changes",
      title: "12. Changes to Terms",
      icon: <FileText className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <p>
            We may modify these Terms at any time. Changes will be effective
            upon posting to the Platform. Material changes will be notified via
            email or platform notice. Continued use after changes constitutes
            acceptance.
          </p>
          <p>It is your responsibility to review these Terms periodically.</p>
        </div>
      ),
    },
    {
      id: "contact",
      title: "13. Contact Information",
      icon: <Users className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p>For questions about these Terms, please contact us:</p>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="font-medium">SomoHub Limited</p>
            <p className="text-sm text-gray-600">Nairobi, Kenya</p>
            <p className="text-sm text-gray-600">Email: legal@somohub.com</p>
            <p className="text-sm text-gray-600">Phone: +254 700 000 000</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-600">
            Welcome to SomoHub. These terms govern your use of our platform and
            services. Please read them carefully.
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
              href="/privacy"
              className="text-purple-600 hover:text-purple-800 mx-2"
            >
              Privacy Policy
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
