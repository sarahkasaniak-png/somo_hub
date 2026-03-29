// src/app/admin/affiliates/create/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import {
  UserPlus,
  Mail,
  User,
  Briefcase,
  ChevronRight,
  CheckCircle,
  XCircle,
  Copy,
} from "lucide-react";
import adminAffiliateApi from "@/lib/api/admin-affiliate";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function CreateAffiliatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    commission_rate: 5.0,
  });
  const [showCredentials, setShowCredentials] = useState(false);
  const [createdAffiliate, setCreatedAffiliate] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.first_name || !formData.last_name) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const response = await adminAffiliateApi.createAffiliate(formData);
      if (response.success && response.data) {
        setCreatedAffiliate(response.data);
        setShowCredentials(true);
        toast.success("Affiliate created successfully!");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create affiliate");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const handleResendCredentials = async () => {
    if (!createdAffiliate?.affiliate?.id) return;

    try {
      await adminAffiliateApi.resendCredentials(createdAffiliate.affiliate.id);
      toast.success("Credentials resent successfully!");
    } catch (error) {
      toast.error("Failed to resend credentials");
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Link href="/admin/affiliates" className="hover:text-purple-600">
              Affiliates
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900">Create Affiliate</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Create New Affiliate
          </h1>
          <p className="text-gray-600 mt-1">
            Create a new affiliate account. Credentials will be sent via email.
          </p>
        </div>

        {/* Success Modal */}
        {showCredentials && createdAffiliate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Affiliate Created!
                </h2>
                <p className="text-gray-600 mt-1">
                  Credentials have been sent to{" "}
                  {createdAffiliate.affiliate.email}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="mb-3">
                  <label className="text-xs font-medium text-gray-500 uppercase">
                    Affiliate Code
                  </label>
                  <div className="flex items-center justify-between mt-1">
                    <code className="text-lg font-mono font-bold text-purple-600">
                      {createdAffiliate.affiliate.affiliate_code}
                    </code>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          createdAffiliate.affiliate.affiliate_code,
                          "Affiliate code",
                        )
                      }
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <Copy className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="text-xs font-medium text-gray-500 uppercase">
                    Temporary Password
                  </label>
                  <div className="flex items-center justify-between mt-1">
                    <code className="text-sm font-mono text-gray-700">
                      {createdAffiliate.temporary_password}
                    </code>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          createdAffiliate.temporary_password,
                          "Password",
                        )
                      }
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <Copy className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>

                {createdAffiliate.is_new_user && (
                  <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      ⚠️ This is a new user. They will need to change their
                      password after first login.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleResendCredentials}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Resend Email
                </button>
                <button
                  onClick={() => router.push("/admin/affiliates")}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="affiliate@example.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) =>
                      setFormData({ ...formData, first_name: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    placeholder="John"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) =>
                      setFormData({ ...formData, last_name: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commission Rate (%)
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="100"
                  value={formData.commission_rate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      commission_rate: parseFloat(e.target.value),
                    })
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="5"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Default is 5%. Affiliates earn this percentage on the first 100
                students per referred tutor.
              </p>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.push("/admin/affiliates")}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Create Affiliate
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
