// src/app/affiliate/settings/page.tsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  CreditCard,
  Smartphone,
  Landmark,
  Globe,
  Save,
  Copy,
} from "lucide-react";
import affiliateApi from "@/lib/api/affiliate";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AffiliateSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentDetails, setPaymentDetails] = useState<any>({});
  const [affiliateInfo, setAffiliateInfo] = useState<any>(null);

  useEffect(() => {
    fetchAffiliateInfo();
  }, []);

  const fetchAffiliateInfo = async () => {
    try {
      setLoading(true);
      const response = await affiliateApi.getProfile();
      if (response.success && response.data) {
        setAffiliateInfo(response.data);
        setPaymentMethod(response.data.payment_method || "");
        setPaymentDetails(response.data.payment_details || {});
      }
    } catch (error) {
      console.error("Failed to fetch affiliate info:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    setSaving(true);
    try {
      await affiliateApi.updatePaymentMethod({
        payment_method: paymentMethod,
        payment_details: paymentDetails,
      });
      toast.success("Payment method updated successfully");
    } catch (error) {
      toast.error("Failed to update payment method");
    } finally {
      setSaving(false);
    }
  };

  const copyAffiliateCode = () => {
    if (affiliateInfo?.affiliate_code) {
      navigator.clipboard.writeText(affiliateInfo.affiliate_code);
      toast.success("Affiliate code copied!");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your affiliate account settings
        </p>
      </div>

      {/* Affiliate Code Card */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
        <h2 className="text-lg font-semibold mb-2">Your Affiliate Code</h2>
        <div className="flex items-center gap-3">
          <code className="text-2xl font-mono font-bold bg-white/20 px-4 py-2 rounded-lg">
            {affiliateInfo?.affiliate_code}
          </code>
          <button
            onClick={copyAffiliateCode}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <Copy className="w-5 h-5" />
          </button>
        </div>
        <p className="text-purple-100 text-sm mt-3">
          Share this code with tutors to earn commissions
        </p>
      </div>

      {/* Payment Method Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Payment Method
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Configure how you want to receive your affiliate payouts
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Payout Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => {
                setPaymentMethod(e.target.value);
                setPaymentDetails({});
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
            >
              <option value="">Select a method</option>
              <option value="bank">Bank Transfer</option>
              <option value="mobile_money">Mobile Money (M-PESA)</option>
              <option value="paypal">PayPal</option>
            </select>
          </div>

          {paymentMethod === "bank" && (
            <div className="space-y-3 border-t pt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Name
                </label>
                <input
                  type="text"
                  value={paymentDetails.account_name || ""}
                  onChange={(e) =>
                    setPaymentDetails({
                      ...paymentDetails,
                      account_name: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  placeholder="Full name on account"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={paymentDetails.bank_name || ""}
                  onChange={(e) =>
                    setPaymentDetails({
                      ...paymentDetails,
                      bank_name: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  placeholder="e.g., Equity Bank"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  value={paymentDetails.account_number || ""}
                  onChange={(e) =>
                    setPaymentDetails({
                      ...paymentDetails,
                      account_number: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  placeholder="Account number"
                />
              </div>
            </div>
          )}

          {paymentMethod === "mobile_money" && (
            <div className="space-y-3 border-t pt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={paymentDetails.mobile_number || ""}
                  onChange={(e) =>
                    setPaymentDetails({
                      ...paymentDetails,
                      mobile_number: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  placeholder="e.g., 0712345678"
                />
              </div>
            </div>
          )}

          {paymentMethod === "paypal" && (
            <div className="space-y-3 border-t pt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PayPal Email
                </label>
                <input
                  type="email"
                  value={paymentDetails.email || ""}
                  onChange={(e) =>
                    setPaymentDetails({
                      ...paymentDetails,
                      email: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  placeholder="your-email@example.com"
                />
              </div>
            </div>
          )}

          {paymentMethod && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Payment Method
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Commission Info */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-2">
          Commission Information
        </h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>
            • You earn{" "}
            <strong className="text-purple-600">5% commission</strong> on every
            student enrolled by tutors you refer
          </p>
          <p>
            • Commission is paid on the first <strong>100 students</strong> per
            referred tutor
          </p>
          <p>
            • Payouts are processed weekly on reaching{" "}
            <strong>KES 1,000</strong> minimum
          </p>
          <p>• Track your earnings in real-time from your dashboard</p>
        </div>
      </div>
    </div>
  );
}
