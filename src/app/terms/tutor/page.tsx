// src/app/terms/tutor/page.tsx
"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle,
  Info,
  AlertCircle,
  Calendar,
  Shield,
  CreditCard,
} from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back button */}
        <Link
          href="/onboarding/tutor"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Application
        </Link>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Tutor Onboarding Terms & Conditions
          </h1>
          <p className="text-gray-600">
            Please read these terms carefully before proceeding with your tutor
            application payment.
          </p>
        </div>

        {/* Payment Summary Card */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-lg p-8 mb-8 text-white">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Payment Summary
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-purple-100 text-sm mb-1">
                Regular Annual Subscription
              </p>
              <p className="text-2xl font-bold line-through opacity-75">
                KES 10,000
              </p>
            </div>

            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-purple-100 text-sm mb-1">
                90% Launch Discount
              </p>
              <p className="text-2xl font-bold text-green-300">- KES 9,000</p>
            </div>

            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-purple-100 text-sm mb-1">Subtotal</p>
              <p className="text-2xl font-bold">KES 1,000</p>
            </div>

            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-purple-100 text-sm mb-1">VAT (16%)</p>
              <p className="text-2xl font-bold">KES 160</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/20">
            <div className="flex justify-between items-center">
              <span className="text-lg">Total Amount Due Today</span>
              <span className="text-3xl font-bold">KES 1,160</span>
            </div>
          </div>
        </div>

        {/* Main Terms Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-8">
          {/* Important Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-800 mb-2">
                  Important: Non-Refundable Payment
                </h3>
                <p className="text-amber-700 text-sm">
                  The total amount of KES 1,160 (including VAT) is{" "}
                  <span className="font-bold">non-refundable</span> under any
                  circumstances. This fee covers the cost of application
                  processing, identity verification, document review, and your
                  annual subscription as a verified tutor on the SomoHub
                  platform.
                </p>
              </div>
            </div>
          </div>

          {/* What's Included */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              What Your Payment Covers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    Identity Verification
                  </h3>
                  <p className="text-sm text-gray-600">
                    Thorough verification of your National ID and documents
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    Credential Review
                  </h3>
                  <p className="text-sm text-gray-600">
                    Validation of your educational qualifications and
                    certificates
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    12-Month Subscription
                  </h3>
                  <p className="text-sm text-gray-600">
                    Full access to tutor features for one year from approval
                    date
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Info className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Platform Access</h3>
                  <p className="text-sm text-gray-600">
                    Create courses, host sessions, and earn from your expertise
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Terms */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Terms and Conditions
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  1. Payment Structure
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  The standard annual subscription fee for tutor onboarding is
                  KES 10,000. As part of our launch promotion, a 90% discount
                  (KES 9,000) is currently applied, bringing the base fee to KES
                  1,000. Value Added Tax (VAT) of 16% (KES 160) is added as
                  required by law, making the total payment KES 1,160.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  2. Non-Refundable Policy
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  The entire amount of KES 1,160 is strictly non-refundable.
                  This applies regardless of:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
                  <li>
                    Application outcome (approved, rejected, or under review)
                  </li>
                  <li>Decision to withdraw your application</li>
                  <li>Inability to complete the verification process</li>
                  <li>Technical issues encountered during application</li>
                  <li>Changes in personal circumstances</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  3. Verification Process
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Your payment facilitates a comprehensive verification process
                  including:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
                  <li>Identity verification against provided National ID</li>
                  <li>Educational credential validation</li>
                  <li>
                    Teaching qualification verification (where applicable)
                  </li>
                  <li>Background check for quality assurance</li>
                  <li>Manual review by our admin team</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  4. Subscription Period
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Upon successful application approval, your 12-month tutor
                  subscription begins immediately. This subscription grants you
                  full access to:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
                  <li>Create and publish tutoring courses</li>
                  <li>Host group and one-on-one sessions</li>
                  <li>Receive payments for your tutoring services</li>
                  <li>Access to the tutor dashboard and analytics</li>
                  <li>Priority support from our team</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  5. Application Rejection
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  In the event your application is rejected, the KES 1,160 fee
                  remains non-refundable as it covers the verification and
                  processing costs already incurred. You may reapply after 90
                  days, subject to a new application fee.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  6. Misrepresentation
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Providing false information or fraudulent documents will
                  result in immediate application rejection and permanent ban
                  from the platform. The application fee will not be refunded in
                  such cases.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  7. Payment Processing
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  All payments are processed securely through Paystack, a
                  PCI-DSS compliant payment gateway. SomoHub does not store your
                  payment card details. By proceeding, you agree to Paystack's
                  terms of service as well.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  8. Changes to Terms
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  SomoHub reserves the right to modify these terms at any time.
                  However, changes will not affect applications already
                  submitted and paid for.
                </p>
              </div>
            </div>
          </div>

          {/* Acknowledgment */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  Acknowledgment
                </h3>
                <p className="text-sm text-gray-600">
                  By checking the "I agree to the Terms of Service" box on the
                  application summary page and proceeding with payment, you
                  acknowledge that you have read, understood, and agree to be
                  bound by all the terms and conditions outlined above. You
                  specifically acknowledge that KES 1,160 is non-refundable
                  under any circumstances.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              href="/onboarding/tutor"
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              Return to Application
            </Link>
            <Link
              href="/onboarding/tutor#payment"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors text-center"
            >
              I Understand & Accept
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Last updated: March 2026</p>
          <p className="mt-1">For any questions, contact support@somohub.com</p>
        </div>
      </div>
    </div>
  );
}
