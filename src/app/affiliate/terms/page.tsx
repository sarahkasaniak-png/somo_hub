// src/app/affiliate/terms/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  CheckCircle,
  ArrowLeft,
  Shield,
  DollarSign,
  Users,
  Clock,
  AlertCircle,
  Download,
  Printer,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function AffiliateTermsPage() {
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);

  const handleAcceptTerms = async () => {
    setAccepting(true);
    try {
      // Here you would call an API to accept the terms
      // await affiliateApi.acceptTerms();

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Terms accepted successfully!");
      setShowAcceptModal(false);
      router.push("/affiliate/dashboard");
    } catch (error) {
      console.error("Failed to accept terms:", error);
      toast.error("Failed to accept terms. Please try again.");
    } finally {
      setAccepting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a printable version
    const content = document.getElementById("terms-content");
    if (content) {
      const htmlContent = content.innerHTML;
      const printWindow = window.open("", "_blank");
      printWindow?.document.write(`
        <html>
          <head>
            <title>SomoHub Affiliate Terms & Conditions</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; padding: 40px; max-width: 800px; margin: 0 auto; }
              h1 { color: #7c3aed; }
              h2 { color: #374151; margin-top: 24px; }
              h3 { color: #4b5563; margin-top: 16px; }
              p { margin: 12px 0; }
              ul { margin: 12px 0; padding-left: 24px; }
              li { margin: 8px 0; }
              .effective-date { color: #6b7280; font-style: italic; margin-bottom: 24px; }
              .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
            </style>
          </head>
          <body>
            ${htmlContent}
          </body>
        </html>
      `);
      printWindow?.document.close();
      printWindow?.print();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/affiliate"
          className="p-2 text-gray-600 hover:text-purple-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Affiliate Program Terms & Conditions
          </h1>
          <p className="text-gray-600 mt-1">
            Please read these terms carefully before participating in the
            affiliate program
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        <button
          onClick={handlePrint}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <Printer className="w-4 h-4" />
          Print
        </button>
        <button
          onClick={handleDownload}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>

      {/* Terms Content */}
      <div
        id="terms-content"
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8"
      >
        {/* Header */}
        <div className="text-center border-b border-gray-200 pb-6">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            SomoHub Affiliate Program
          </h1>
          <p className="text-gray-500 mt-2">Terms and Conditions</p>
          <p className="text-sm text-gray-400 mt-1">
            Effective Date: March 1, 2026
          </p>
        </div>

        {/* Introduction */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            1. Introduction
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Welcome to the SomoHub Affiliate Program ("Program"). These Terms
            and Conditions ("Terms") govern your participation in the Program.
            By participating in the Program, you agree to be bound by these
            Terms. If you do not agree to these Terms, please do not participate
            in the Program.
          </p>
        </div>

        {/* Eligibility */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            2. Eligibility
          </h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            To participate in the Affiliate Program, you must:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Be at least 18 years of age</li>
            <li>Have a valid email address and phone number</li>
            <li>Have a verified SomoHub account</li>
            <li>
              Agree to comply with these Terms and all applicable laws and
              regulations
            </li>
            <li>
              Not be located in a jurisdiction where participation in such
              programs is prohibited
            </li>
          </ul>
        </div>

        {/* Commission Structure */}
        <div className="bg-purple-50 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              3. Commission Structure
            </h2>
          </div>
          <div className="space-y-3 text-gray-700">
            <p>
              <strong className="text-gray-900">Commission Rate:</strong> 5% of
              the enrollment fee for each student enrolled by a referred tutor.
            </p>
            <p>
              <strong className="text-gray-900">Commission Cap:</strong>{" "}
              Commission is paid on the first 100 students per referred tutor.
            </p>
            <p>
              <strong className="text-gray-900">Payment Threshold:</strong>{" "}
              Minimum payout of KES 1,000.
            </p>
            <p>
              <strong className="text-gray-900">Payment Schedule:</strong>{" "}
              Payouts are processed weekly on reaching the minimum threshold.
            </p>
            <p>
              <strong className="text-gray-900">Payment Methods:</strong> Bank
              Transfer, Mobile Money (M-PESA), or PayPal.
            </p>
          </div>
        </div>

        {/* Referral Process */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            4. Referral Process
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
            <li>Share your unique affiliate code with potential tutors</li>
            <li>
              Referred tutors must use your affiliate code during their
              application process
            </li>
            <li>
              Referrals are tracked automatically when tutors sign up using your
              code
            </li>
            <li>
              Referrals must be approved by the SomoHub team before commissions
              are earned
            </li>
            <li>
              Commissions are credited to your account when referred tutors
              successfully enroll students
            </li>
          </ol>
        </div>

        {/* Payment Terms */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            5. Payment Terms
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>
              Commissions are calculated based on actual payments received from
              students
            </li>
            <li>Payments are made in Kenyan Shillings (KES)</li>
            <li>
              Payouts are processed within 3-5 business days after approval
            </li>
            <li>You are responsible for providing accurate payment details</li>
            <li>
              Any fees associated with payment processing may be deducted from
              your payout
            </li>
            <li>Commissions may be adjusted for refunds or chargebacks</li>
          </ul>
        </div>

        {/* Prohibited Activities */}
        <div className="bg-red-50 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              6. Prohibited Activities
            </h2>
          </div>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Self-referral or creating fake accounts to earn commissions</li>
            <li>Spamming or unsolicited marketing of your affiliate code</li>
            <li>Misrepresenting your relationship with SomoHub</li>
            <li>Using deceptive or misleading advertising practices</li>
            <li>
              Promoting SomoHub on websites that contain illegal or
              inappropriate content
            </li>
            <li>Attempting to manipulate the referral tracking system</li>
            <li>
              Sharing your affiliate code in a way that violates platform terms
              of service
            </li>
          </ul>
        </div>

        {/* Affiliate Responsibilities */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            7. Affiliate Responsibilities
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Promote SomoHub in a professional and ethical manner</li>
            <li>Clearly disclose your affiliate relationship when promoting</li>
            <li>
              Maintain accurate and up-to-date contact and payment information
            </li>
            <li>Comply with all applicable laws and regulations</li>
            <li>Respond promptly to any inquiries from the SomoHub team</li>
            <li>
              Keep your affiliate account secure and not share login credentials
            </li>
          </ul>
        </div>

        {/* Termination */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            8. Termination
          </h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            SomoHub reserves the right to terminate or suspend your
            participation in the Affiliate Program at any time, with or without
            cause, including but not limited to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Violation of these Terms</li>
            <li>Engaging in prohibited activities</li>
            <li>Fraudulent or abusive behavior</li>
            <li>Inactivity for more than 12 months</li>
            <li>
              Changes to the Program that make your participation incompatible
            </li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-3">
            Upon termination, any unpaid commissions that have been earned prior
            to termination will be paid out, unless termination is due to fraud
            or violation of these Terms.
          </p>
        </div>

        {/* Modifications */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            9. Modifications to Terms
          </h2>
          <p className="text-gray-700 leading-relaxed">
            SomoHub reserves the right to modify these Terms at any time. We
            will notify you of any material changes via email or through your
            affiliate dashboard. Continued participation in the Program after
            such modifications constitutes your acceptance of the updated Terms.
          </p>
        </div>

        {/* Limitation of Liability */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            10. Limitation of Liability
          </h2>
          <p className="text-gray-700 leading-relaxed">
            SomoHub shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages arising out of or related to your
            participation in the Affiliate Program. Our total liability shall
            not exceed the total commissions paid to you in the 12 months
            preceding the claim.
          </p>
        </div>

        {/* Governing Law */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            11. Governing Law
          </h2>
          <p className="text-gray-700 leading-relaxed">
            These Terms shall be governed by and construed in accordance with
            the laws of the Republic of Kenya, without regard to its conflict of
            law provisions. Any disputes arising under these Terms shall be
            subject to the exclusive jurisdiction of the courts of Kenya.
          </p>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              12. Contact Information
            </h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            If you have any questions about these Terms or the Affiliate
            Program, please contact us at:
          </p>
          <div className="mt-3 space-y-1 text-gray-600">
            <p>Email: affiliates@somohub.com</p>
            <p>Phone: +254 700 123 456</p>
            <p>Address: SomoHub Headquarters, Nairobi, Kenya</p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 pt-6 text-center">
          <p className="text-sm text-gray-500">
            By participating in the SomoHub Affiliate Program, you acknowledge
            that you have read, understood, and agree to be bound by these Terms
            and Conditions.
          </p>
          <p className="text-xs text-gray-400 mt-4">
            © {new Date().getFullYear()} SomoHub. All rights reserved.
          </p>
        </div>
      </div>

      {/* Acceptance Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky bottom-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="acceptTerms"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-1 w-5 h-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
            />
            <label htmlFor="acceptTerms" className="text-gray-700">
              I have read and agree to the{" "}
              <span className="font-semibold text-purple-600">
                Terms and Conditions
              </span>{" "}
              of the SomoHub Affiliate Program.
            </label>
          </div>
          <button
            onClick={() => setShowAcceptModal(true)}
            disabled={!accepted}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Accept Terms & Continue
          </button>
        </div>
      </div>

      {/* Accept Modal */}
      {showAcceptModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Accept Terms & Conditions
              </h2>
              <p className="text-gray-600 mt-2">
                By accepting, you agree to comply with all the terms and
                conditions of the SomoHub Affiliate Program.
              </p>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                <p className="text-sm text-yellow-800">
                  This agreement is legally binding. Please ensure you fully
                  understand the terms before accepting.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAcceptModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAcceptTerms}
                disabled={accepting}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {accepting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Accepting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Accept Terms
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
