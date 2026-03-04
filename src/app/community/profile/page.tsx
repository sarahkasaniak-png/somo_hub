// src/app/community/profile/page.tsx
"use client";

import { useState } from "react";

export default function CommunityProfile() {
  const [community, setCommunity] = useState({
    name: "Nairobi High School Math Club",
    description:
      "A community for mathematics enthusiasts and students preparing for national exams. We provide tutoring, study materials, and collaborative learning sessions.",
    category: "High School",
    members: 245,
    activeCourses: 8,
    totalSessions: 45,
    established: "2022",
    contactEmail: "contact@nairobi-math.org",
    website: "www.nairobi-math.org",
    location: "Nairobi, Kenya",
    isVerified: true,
  });

  const [admins] = useState([
    { name: "John Doe", role: "Head Admin", email: "john@example.com" },
    { name: "Jane Smith", role: "Content Admin", email: "jane@example.com" },
    { name: "Mike Johnson", role: "Moderator", email: "mike@example.com" },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(community);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Update community API call
      setCommunity(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update community:", error);
    }
  };

  const stats = [
    { label: "Total Members", value: community.members, icon: "👥" },
    { label: "Active Courses", value: community.activeCourses, icon: "📚" },
    { label: "Total Sessions", value: community.totalSessions, icon: "🎯" },
    { label: "Established", value: community.established, icon: "🏛️" },
  ];

  return (
    <div className="max-w-full mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Community Profile
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your community settings and information
          </p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-main text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
        >
          {isEditing ? "Cancel Editing" : "Edit Community"}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {/* Community Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Community Information
            </h2>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Community Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Established Year
                    </label>
                    <input
                      type="text"
                      name="established"
                      value={formData.established}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <input
                      type="text"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-main text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-4">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full">
                    {community.category}
                  </span>
                  {community.isVerified && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full flex items-center">
                      <span className="mr-1">✓</span> Verified
                    </span>
                  )}
                </div>

                <div>
                  <p className="text-sm text-gray-500">Community Name</p>
                  <p className="font-medium text-gray-900 mt-1 text-xl">
                    {community.name}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="mt-1 text-gray-900 leading-relaxed">
                    {community.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Contact Email</p>
                    <p className="font-medium text-gray-900 mt-1">
                      {community.contactEmail}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Website</p>
                    <p className="font-medium text-gray-900 mt-1">
                      {community.website}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium text-gray-900 mt-1">
                      {community.location}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Established</p>
                    <p className="font-medium text-gray-900 mt-1">
                      {community.established}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Admin Team */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Admin Team
            </h2>
            <div className="space-y-4">
              {admins.map((admin, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                      {admin.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{admin.name}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-sm text-gray-500 mr-3">
                          {admin.role}
                        </span>
                        <span className="text-sm text-gray-400">
                          {admin.email}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button className="text-sm text-main hover:text-purple-800 font-medium">
                      Message
                    </button>
                    <button className="text-sm text-gray-500 hover:text-gray-700">
                      ...
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 p-3 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-main hover:bg-purple-50 transition-colors">
              <div className="flex items-center justify-center">
                <span className="text-xl mr-2">➕</span>
                <p className="font-medium text-gray-900">Add New Admin</p>
              </div>
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Community Stats
            </h2>
            <div className="space-y-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{stat.icon}</span>
                    <span className="font-medium text-gray-700">
                      {stat.label}
                    </span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Verification Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Verification Status
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">
                  Community Verified
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  ✓ Verified
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">
                  Documents Verified
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  ✓ Complete
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Payment Status</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  ✓ Paid
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Active Status</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-main to-purple-400 rounded-xl p-6 text-white">
            <h2 className="text-lg font-semibold mb-4">Community Actions</h2>
            <div className="space-y-3">
              <a
                href="/community/courses/create"
                className="flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                <span>Create Course</span>
                <span>→</span>
              </a>
              <a
                href="/community/sessions/create"
                className="flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                <span>Schedule Session</span>
                <span>→</span>
              </a>
              <a
                href="/community/analytics"
                className="flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                <span>View Analytics</span>
                <span>→</span>
              </a>
              <a
                href="/community/settings"
                className="flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                <span>Community Settings</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
