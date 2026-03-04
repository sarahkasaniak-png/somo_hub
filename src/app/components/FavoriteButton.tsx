// src/app/components/FavoriteButton.tsx
"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/app/context/FavoritesContext";
import { useState } from "react";

interface FavoriteButtonProps {
  type: "session" | "tutor";
  id: number;
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
  className?: string;
}

export default function FavoriteButton({
  type,
  id,
  size = "md",
  showTooltip = true,
  className = "",
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite, loading } = useFavorites();
  const [showTooltipState, setShowTooltipState] = useState(false);

  const favorite = isFavorite(type, id);

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
    toggleFavorite(type, id);
  };

  return (
    <div className="relative inline-flex">
      <button
        onClick={handleClick}
        disabled={loading}
        onMouseEnter={() => setShowTooltipState(true)}
        onMouseLeave={() => setShowTooltipState(false)}
        className={`${sizeClasses[size]} hover:bg-gray-100 rounded-lg transition-colors relative ${className}`}
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart
          className={`${iconSizes[size]} transition-all ${
            favorite
              ? "fill-red-500 text-red-500"
              : "text-gray-400 hover:text-red-400"
          }`}
        />
      </button>

      {/* Tooltip */}
      {showTooltip && showTooltipState && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-50">
          {favorite ? "Remove from favorites" : "Save to favorites"}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
}
