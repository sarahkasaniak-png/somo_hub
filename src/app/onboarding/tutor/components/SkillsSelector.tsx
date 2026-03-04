// src/app/onboarding/tutor/components/SkillsSelector.tsx
"use client";

import { useState } from "react";

const skillCategories = [
  {
    category: "Technology",
    skills: [
      "Web Development",
      "Mobile App Development",
      "Data Science",
      "AI/ML",
      "Cybersecurity",
      "Cloud Computing",
      "DevOps",
    ],
  },
  {
    category: "Creative Arts",
    skills: [
      "Graphic Design",
      "Photography",
      "Video Editing",
      "Music Production",
      "Creative Writing",
      "Digital Art",
    ],
  },
  {
    category: "Languages",
    skills: [
      "English",
      "French",
      "Spanish",
      "Chinese",
      "German",
      "Japanese",
      "Swahili",
    ],
  },
  {
    category: "Business",
    skills: [
      "Marketing",
      "Finance",
      "Project Management",
      "Entrepreneurship",
      "Accounting",
      "Business Strategy",
    ],
  },
  {
    category: "Music Instruments",
    skills: [
      "Piano",
      "Guitar",
      "Violin",
      "Drums",
      "Saxophone",
      "Vocals",
      "Music Theory",
    ],
  },
];

interface SkillsSelectorProps {
  selectedSkills: string[];
  onSkillsChange: (skills: string[]) => void;
}

export default function SkillsSelector({
  selectedSkills,
  onSkillsChange,
}: SkillsSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSkillToggle = (skill: string) => {
    const newSkills = selectedSkills.includes(skill)
      ? selectedSkills.filter((s) => s !== skill)
      : [...selectedSkills, skill];
    onSkillsChange(newSkills);
  };

  const filteredCategories = skillCategories
    .map((cat) => ({
      ...cat,
      skills: cat.skills.filter((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((cat) => cat.skills.length > 0);

  return (
    <div className="space-y-6">
      <div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search skills..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div className="space-y-4">
        {filteredCategories.map((category) => (
          <div key={category.category}>
            <h3 className="font-medium text-gray-900 mb-2">
              {category.category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleSkillToggle(skill)}
                  className={`px-3 py-2 rounded-full text-sm transition-colors ${
                    selectedSkills.includes(skill)
                      ? "bg-purple-100 text-purple-700 border border-purple-300"
                      : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedSkills.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">
            Selected Skills ({selectedSkills.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedSkills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm flex items-center"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleSkillToggle(skill)}
                  className="ml-2 text-white hover:text-gray-200"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
