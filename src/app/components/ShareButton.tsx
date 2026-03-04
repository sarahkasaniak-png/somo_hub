// src/app/components/ShareButton.tsx
"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import ShareModal from "./ShareModal";

interface ShareButtonProps {
  title: string;
  description?: string;
  url?: string;
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
  className?: string;
}

export default function ShareButton({
  title,
  description,
  url,
  size = "md",
  showTooltip = true,
  className = "",
}: ShareButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [showTooltipState, setShowTooltipState] = useState(false);

  const shareUrl =
    url || (typeof window !== "undefined" ? window.location.href : "");

  const sizeClasses = {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-3",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowModal(true);
  };

  return (
    <>
      <div className="relative inline-flex">
        <button
          onClick={handleClick}
          onMouseEnter={() => setShowTooltipState(true)}
          onMouseLeave={() => setShowTooltipState(false)}
          className={`${sizeClasses[size]} hover:bg-gray-100 rounded-lg transition-colors ${className}`}
          aria-label="Share"
        >
          <Share2
            className={`${iconSizes[size]} text-gray-400 hover:text-purple-600 transition-colors`}
          />
        </button>

        {/* Tooltip */}
        {showTooltip && showTooltipState && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-50">
            Share
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
          </div>
        )}
      </div>

      <ShareModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={title}
        url={shareUrl}
        description={description}
      />
    </>
  );
}
