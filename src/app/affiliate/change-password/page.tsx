// src/app/affiliate/change-password/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Key, Eye, EyeOff, Shield, CheckCircle } from "lucide-react";
import authApi from "@/lib/api/auth";

export default function AffiliateChangePasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.current_password ||
      !formData.new_password ||
      !formData.confirm_password
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.new_password !== formData.confirm_password) {
      toast.error("New passwords do not match");
      return;
    }

    if (formData.new_password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (formData.current_password === formData.new_password) {
      toast.error("New password must be different from current password");
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.changePassword(
        formData.current_password,
        formData.new_password,
        formData.confirm_password,
      );

      if (response.success) {
        toast.success("Password changed successfully! Please login again.");
        setTimeout(() => {
          // Logout and redirect to login page
          authApi.logout().then(() => {
            router.push("/login");
          });
        }, 2000);
      } else {
        toast.error(response.message || "Failed to change password");
      }
    } catch (error: any) {
      console.error("Failed to change password:", error);
      toast.error(error?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Change Password
        </h1>
        <p className="text-gray-600 mt-1">Update your account password</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Password
          </label>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showCurrentPassword ? "text" : "password"}
              value={formData.current_password}
              onChange={(e) =>
                setFormData({ ...formData, current_password: e.target.value })
              }
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="Enter current password"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showCurrentPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <div className="relative">
            <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showNewPassword ? "text" : "password"}
              value={formData.new_password}
              onChange={(e) =>
                setFormData({ ...formData, new_password: e.target.value })
              }
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showNewPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Password must be at least 8 characters
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <CheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirm_password}
              onChange={(e) =>
                setFormData({ ...formData, confirm_password: e.target.value })
              }
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="Confirm new password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Changing Password...
              </>
            ) : (
              <>
                <Key className="w-5 h-5" />
                Change Password
              </>
            )}
          </button>
        </div>
      </form>

      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <h3 className="font-medium text-gray-900 mb-2">
          Password Requirements:
        </h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• At least 8 characters long</li>
          <li>• Include uppercase and lowercase letters</li>
          <li>• Include at least one number</li>
          <li>• Include at least one special character (!@#$%^&*)</li>
        </ul>
      </div>
    </div>
  );
}
