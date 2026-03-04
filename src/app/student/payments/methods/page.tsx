// src/app/student/payments/methods/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import {
  CreditCard,
  Smartphone,
  Landmark,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronRight,
  ArrowLeft,
  Edit,
  Star,
  StarOff,
  Lock,
  Shield,
  CheckCheck,
} from "lucide-react";

interface PaymentMethod {
  id: number;
  type: "card" | "mobile_money" | "bank_transfer";
  provider: string;
  last4?: string;
  expiry_month?: number;
  expiry_year?: number;
  mobile_number?: string;
  account_name?: string;
  account_number?: string;
  bank_name?: string;
  is_default: boolean;
}

export default function PaymentMethodsPage() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMethodType, setNewMethodType] = useState<
    "card" | "mobile_money" | "bank_transfer"
  >("card");

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      // This would be replaced with actual API call
      // const response = await studentApi.getPaymentMethods();
      // if (response.success) {
      //   setMethods(response.data);
      // }

      // Mock data for now
      setMethods([
        {
          id: 1,
          type: "card",
          provider: "Visa",
          last4: "4242",
          expiry_month: 12,
          expiry_year: 2026,
          is_default: true,
        },
        {
          id: 2,
          type: "mobile_money",
          provider: "M-Pesa",
          mobile_number: "254712345678",
          is_default: false,
        },
      ]);
    } catch (error) {
      console.error("Failed to fetch payment methods:", error);
      toast.error("Failed to load payment methods");
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      // API call to set as default
      // await studentApi.setDefaultPaymentMethod(id);

      setMethods(
        methods.map((method) => ({
          ...method,
          is_default: method.id === id,
        })),
      );

      toast.success("Default payment method updated");
    } catch (error) {
      toast.error("Failed to update default payment method");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this payment method?"))
      return;

    try {
      // API call to delete
      // await studentApi.deletePaymentMethod(id);

      setMethods(methods.filter((method) => method.id !== id));
      toast.success("Payment method deleted");
    } catch (error) {
      toast.error("Failed to delete payment method");
    }
  };

  const getMethodIcon = (type: string) => {
    switch (type) {
      case "card":
        return <CreditCard className="w-6 h-6 text-blue-600" />;
      case "mobile_money":
        return <Smartphone className="w-6 h-6 text-green-600" />;
      case "bank_transfer":
        return <Landmark className="w-6 h-6 text-purple-600" />;
      default:
        return <CreditCard className="w-6 h-6 text-gray-600" />;
    }
  };

  const getMethodLabel = (method: PaymentMethod) => {
    switch (method.type) {
      case "card":
        return `${method.provider} •••• ${method.last4}`;
      case "mobile_money":
        return `${method.provider} • ${method.mobile_number}`;
      case "bank_transfer":
        return `${method.bank_name} • ${method.account_number}`;
      default:
        return "Payment Method";
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/student/payments"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Payment Methods
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your saved payment methods
          </p>
        </div>
      </div>

      {/* Payment Methods List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Your Payment Methods
          </h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Method
          </button>
        </div>

        <div className="divide-y divide-gray-200">
          {methods.length > 0 ? (
            methods.map((method) => (
              <div
                key={method.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                      {getMethodIcon(method.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900">
                          {getMethodLabel(method)}
                        </p>
                        {method.is_default && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        Added {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!method.is_default && (
                      <button
                        onClick={() => handleSetDefault(method.id)}
                        className="p-2 text-gray-400 hover:text-yellow-500 transition-colors"
                        title="Set as default"
                      >
                        <StarOff className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(method.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <CreditCard className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No payment methods
              </h3>
              <p className="text-gray-500 mb-6">
                Add a payment method to make faster checkouts
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Payment Method
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Security Note */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">
              Secure Payment Processing
            </h3>
            <p className="text-sm text-gray-600">
              All payment information is encrypted and securely stored. We never
              store your full card details on our servers. Payments are
              processed through Paystack, a PCI-DSS compliant payment gateway.
            </p>
            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3" />
                256-bit SSL
              </span>
              <span className="flex items-center gap-1">
                <CheckCheck className="w-3 h-3" />
                PCI-DSS Compliant
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Payment Method Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full animate-fade-in">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Add Payment Method
              </h2>
            </div>

            <div className="p-6 space-y-4">
              {/* Method Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setNewMethodType("card")}
                    className={`p-4 border rounded-xl text-center transition-colors ${
                      newMethodType === "card"
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <CreditCard
                      className={`w-6 h-6 mx-auto mb-2 ${
                        newMethodType === "card"
                          ? "text-blue-600"
                          : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        newMethodType === "card"
                          ? "text-blue-600"
                          : "text-gray-600"
                      }`}
                    >
                      Card
                    </span>
                  </button>
                  <button
                    onClick={() => setNewMethodType("mobile_money")}
                    className={`p-4 border rounded-xl text-center transition-colors ${
                      newMethodType === "mobile_money"
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Smartphone
                      className={`w-6 h-6 mx-auto mb-2 ${
                        newMethodType === "mobile_money"
                          ? "text-blue-600"
                          : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        newMethodType === "mobile_money"
                          ? "text-blue-600"
                          : "text-gray-600"
                      }`}
                    >
                      Mobile Money
                    </span>
                  </button>
                  <button
                    onClick={() => setNewMethodType("bank_transfer")}
                    className={`p-4 border rounded-xl text-center transition-colors ${
                      newMethodType === "bank_transfer"
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Landmark
                      className={`w-6 h-6 mx-auto mb-2 ${
                        newMethodType === "bank_transfer"
                          ? "text-blue-600"
                          : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        newMethodType === "bank_transfer"
                          ? "text-blue-600"
                          : "text-gray-600"
                      }`}
                    >
                      Bank Transfer
                    </span>
                  </button>
                </div>
              </div>

              {/* Form fields based on selected type */}
              {newMethodType === "card" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {newMethodType === "mobile_money" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile Money Provider
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent">
                      <option value="mpesa">M-Pesa</option>
                      <option value="airtelmoney">Airtel Money</option>
                      <option value="tigo_pesa">Tigo Pesa</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="254712345678"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Enter the phone number registered with your mobile money
                    account
                  </p>
                </div>
              )}

              {newMethodType === "bank_transfer" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank Name
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent">
                      <option value="equity">Equity Bank</option>
                      <option value="kcb">KCB Bank</option>
                      <option value="coop">Cooperative Bank</option>
                      <option value="absa">ABSA Bank</option>
                      <option value="stanchart">Standard Chartered</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234567890"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                Add Method
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
